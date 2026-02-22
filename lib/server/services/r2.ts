import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
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

const s3Client = isR2Configured() ? new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID!,
    secretAccessKey: R2_SECRET_ACCESS_KEY!,
  },
}) : null;

function generateTags(recording: Recording): string[] {
  const tags: string[] = ['recording'];
  if (recording.status === 'completed') tags.push('completed');
  if (recording.status === 'failed') tags.push('failed');
  const date = new Date(recording.createdAt);
  tags.push(`year:${date.getFullYear()}`);
  tags.push(`month:${String(date.getMonth() + 1).padStart(2, '0')}`);
  tags.push(`day:${String(date.getDate()).padStart(2, '0')}`);
  return tags;
}

// Upload audio file directly to R2 (streaming)
export async function uploadAudioToR2(
  recordingId: string,
  audioBuffer: Buffer,
  mimeType: string = 'audio/webm'
): Promise<string> {
  if (!s3Client) {
    throw new Error('R2 not configured');
  }

  const ext = mimeType.includes('mp4') || mimeType.includes('m4a') ? 'm4a' : mimeType.includes('webm') ? 'webm' : 'webm';
  const audioKey = `recordings/${recordingId}/audio.${ext}`;

  await s3Client.send(new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: audioKey,
    Body: audioBuffer,
    ContentType: mimeType,
  }));

  return R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${audioKey}` : audioKey;
}

// Upload metadata JSON to R2
export async function uploadMetadataToR2(
  recording: Recording,
  audioUrl?: string
): Promise<string> {
  if (!s3Client) {
    throw new Error('R2 not configured');
  }

  const key = `recordings/${recording.id}/metadata.json`;
  const tags = generateTags(recording);

  const payload = {
    id: recording.id,
    title: recording.title,
    duration: recording.duration,
    createdAt: recording.createdAt,
    timestamp: new Date().toISOString(),
    tags,
    transcript: recording.transcript,
    summary: recording.summary,
    status: recording.status,
    audioUrl: audioUrl || null,
  };

  await s3Client.send(new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: JSON.stringify(payload, null, 2),
    ContentType: 'application/json',
  }));

  const url = R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${key}` : key;
  return url;
}

// Original function maintained for backwards compatibility
export async function uploadToCloud(
  recording: Recording,
  audioBuffer: Buffer | null,
  uploadOption: 'audio' | 'summary' | 'both' = 'both'
): Promise<string> {
  if (!s3Client) {
    throw new Error('R2 not configured');
  }

  const key = `recordings/${recording.id}.json`;
  const tags = generateTags(recording);

  const payload: any = {
    id: recording.id,
    title: recording.title,
    duration: recording.duration,
    createdAt: recording.createdAt,
    timestamp: new Date().toISOString(),
    tags,
    uploadOption,
  };

  if (uploadOption === 'summary' || uploadOption === 'both') {
    payload.transcript = recording.transcript;
    payload.summary = recording.summary;
  }

  if (uploadOption === 'audio' || uploadOption === 'both') {
    if (audioBuffer) {
      payload.audioBase64 = audioBuffer.toString('base64');
      payload.hasAudio = true;
    } else {
      // Fallback: read from file if buffer not provided
      const audioPath = path.join(process.cwd(), 'uploads', path.basename(recording.audioPath));
      if (fs.existsSync(audioPath)) {
        const fileBuffer = fs.readFileSync(audioPath);
        payload.audioBase64 = fileBuffer.toString('base64');
        payload.hasAudio = true;
      }
    }
  }

  await s3Client.send(new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: JSON.stringify(payload, null, 2),
    ContentType: 'application/json',
  }));

  const url = R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${key}` : '';
  return url;
}

export async function removeFromCloud(cloudKey: string): Promise<void> {
  if (!s3Client) {
    throw new Error('R2 not configured');
  }

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: cloudKey,
    })
  );
}

export async function listCloudRecordings(): Promise<CloudRecording[]> {
  if (!s3Client) {
    return [];
  }

  const response = await s3Client.send(
    new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: 'recordings/',
    })
  );

  const recordings: CloudRecording[] = [];

  if (!response.Contents) {
    return recordings;
  }

  for (const obj of response.Contents) {
    if (!obj.Key) continue;
    // Only get metadata.json files for the new format, or .json for old format
    if (!obj.Key.endsWith('/metadata.json') && !obj.Key.endsWith('.json')) continue;
    // Skip audio files
    if (obj.Key.endsWith('.webm') || obj.Key.endsWith('.m4a') || obj.Key.endsWith('.mp3')) continue;
    // Skip if it's in a subdirectory but not metadata.json
    if (obj.Key.includes('/') && !obj.Key.endsWith('/metadata.json') && obj.Key.split('/').length > 2) continue;

    try {
      const getResult = await s3Client.send(
        new GetObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: obj.Key,
        })
      );
      const body = await getResult.Body?.transformToString();
      if (body) {
        const data = JSON.parse(body);
        recordings.push({
          key: obj.Key,
          title: data.title,
          summary: data.summary,
          transcript: data.transcript,
          tags: data.tags || [],
          createdAt: data.createdAt,
          duration: data.duration,
          lastModified: obj.LastModified?.getTime(),
          hasAudio: !!data.audioBase64 || !!data.audioUrl,
          audioBase64: data.audioBase64,
          uploadOption: data.uploadOption || 'both',
        });
      }
    } catch (e) {
      console.error('Failed to fetch', obj.Key, e);
    }
  }

  return recordings.sort((a, b) => b.createdAt - a.createdAt);
}

export async function deleteCloudRecording(key: string): Promise<void> {
  if (!s3Client) {
    throw new Error('R2 not configured');
  }

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    })
  );
}
