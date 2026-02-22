import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { promises as fs } from 'fs';
import path from 'path';
import type { Recording } from '../db/schema';

interface CloudRecording {
  key: string;
  title: string;
  summary: string;
  transcript?: string;
  tags: string[];
  createdAt: number;
  duration?: number;
  lastModified?: number;
  hasAudio?: boolean;
  audioBase64?: string;
  uploadOption?: 'audio' | 'summary' | 'both';
}

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

export function isR2Configured(): boolean {
  return !!(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME);
}

function getS3Client() {
  if (!isR2Configured()) {
    throw new Error('R2 is not configured');
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID!,
      secretAccessKey: R2_SECRET_ACCESS_KEY!,
    },
  });
}

export async function uploadToCloud(
  recording: Recording,
  audioBuffer: Buffer | null,
  uploadOption: 'audio' | 'summary' | 'both' = 'both'
): Promise<string> {
  const client = getS3Client();
  const key = `recording-${recording.id}.json`;

  const cloudData: CloudRecording = {
    key,
    title: recording.title,
    summary: recording.summary || '',
    transcript: recording.transcript || undefined,
    tags: recording.tags,
    createdAt: recording.createdAt,
    duration: recording.duration || undefined,
    lastModified: Date.now(),
    hasAudio: uploadOption !== 'summary' && !!audioBuffer,
    uploadOption,
  };

  // Upload audio if requested
  if (uploadOption !== 'summary' && audioBuffer) {
    const audioKey = `audio-${recording.id}`;
    await client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: audioKey,
        Body: audioBuffer,
        ContentType: 'audio/webm',
      })
    );
    // Store base64 for backward compatibility
    cloudData.audioBase64 = audioBuffer.toString('base64');
  }

  // Upload metadata JSON
  await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(cloudData),
      ContentType: 'application/json',
    })
  );

  return R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${key}` : key;
}

export async function removeFromCloud(cloudKey: string): Promise<void> {
  const client = getS3Client();

  // Delete the metadata file
  await client.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: cloudKey,
    })
  );

  // Also try to delete the audio file
  try {
    const audioKey = cloudKey.replace('recording-', 'audio-').replace('.json', '');
    await client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: audioKey,
      })
    );
  } catch {
    // Ignore if audio file doesn't exist
  }
}

export async function listCloudRecordings(): Promise<CloudRecording[]> {
  const client = getS3Client();

  const response = await client.send(
    new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: 'recording-',
    })
  );

  const recordings: CloudRecording[] = [];

  if (!response.Contents) {
    return recordings;
  }

  for (const obj of response.Contents) {
    if (!obj.Key || !obj.Key.endsWith('.json')) continue;

    try {
      const getResponse = await client.send(
        new GetObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: obj.Key,
        })
      );

      if (getResponse.Body) {
        const body = await getResponse.Body.transformToString();
        const recording = JSON.parse(body) as CloudRecording;
        recordings.push({
          ...recording,
          key: obj.Key,
          lastModified: obj.LastModified?.getTime(),
        });
      }
    } catch (e) {
      console.error(`Failed to fetch ${obj.Key}:`, e);
    }
  }

  return recordings.sort((a, b) => b.createdAt - a.createdAt);
}

export async function deleteCloudRecording(key: string): Promise<void> {
  const client = getS3Client();

  await client.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    })
  );

  // Also delete associated audio file
  try {
    const audioKey = key.replace('recording-', 'audio-').replace('.json', '');
    await client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: audioKey,
      })
    );
  } catch {
    // Ignore if audio doesn't exist
  }
}
