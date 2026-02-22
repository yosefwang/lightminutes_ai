import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ulid } from 'ulid';
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

// Lazy initialization for env vars and client
function getR2Config() {
  return {
    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
    R2_PUBLIC_URL: process.env.R2_PUBLIC_URL,
  };
}

let s3ClientCache: S3Client | null | undefined = undefined;

function getS3Client(): S3Client | null {
  if (s3ClientCache !== undefined) return s3ClientCache;

  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME } = getR2Config();

  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
    s3ClientCache = null;
    return null;
  }

  s3ClientCache = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID!,
      secretAccessKey: R2_SECRET_ACCESS_KEY!,
    },
  });

  return s3ClientCache;
}

export function isR2Configured(): boolean {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME } = getR2Config();
  return !!(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME);
}

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
  const s3Client = getS3Client();
  const { R2_BUCKET_NAME, R2_PUBLIC_URL } = getR2Config();

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
  const s3Client = getS3Client();
  const { R2_BUCKET_NAME, R2_PUBLIC_URL } = getR2Config();

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
  const s3Client = getS3Client();
  const { R2_BUCKET_NAME, R2_PUBLIC_URL } = getR2Config();

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
  const s3Client = getS3Client();
  const { R2_BUCKET_NAME } = getR2Config();

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
  const s3Client = getS3Client();
  const { R2_BUCKET_NAME } = getR2Config();

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
    if (!obj.Key.endsWith('/metadata.json') && !obj.Key.endsWith('.json')) continue;
    if (obj.Key.endsWith('.webm') || obj.Key.endsWith('.m4a') || obj.Key.endsWith('.mp3')) continue;
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
  const s3Client = getS3Client();
  const { R2_BUCKET_NAME } = getR2Config();

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

// === NEW: Direct R2 Upload Functions (for serverless architecture) ===

/**
 * Generate a presigned URL for direct upload to R2
 */
export async function generatePresignedUploadUrl(
  userId: string,
  fileExtension: string,
  mimeType: string
): Promise<{ key: string; url: string; publicUrl: string }> {
  const s3Client = getS3Client();
  const { R2_BUCKET_NAME, R2_PUBLIC_URL } = getR2Config();

  if (!s3Client) {
    throw new Error('R2 not configured');
  }

  const fileId = ulid();
  const key = `users/${userId}/${fileId}/audio.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    ContentType: mimeType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  const publicUrl = R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${key}` : key;

  return { key, url, publicUrl };
}

/**
 * Download audio from R2 as Buffer
 */
export async function downloadAudioFromR2(key: string): Promise<Buffer> {
  const s3Client = getS3Client();
  const { R2_BUCKET_NAME } = getR2Config();

  if (!s3Client) {
    throw new Error('R2 not configured');
  }

  const response = await s3Client.send(
    new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    })
  );

  if (!response.Body) {
    throw new Error('No content in R2 response');
  }

  const bytes = await response.Body.transformToByteArray();
  return Buffer.from(bytes);
}

/**
 * Upload metadata JSON to R2 (new format with user isolation)
 */
export async function uploadMetadataToR2V2(
  recording: {
    id: string;
    userId: string;
    title: string;
    duration: number | null;
    createdAt: string | number;
    transcript: string | null;
    summary: string | null;
    status: string;
    audioUrl: string;
  }
): Promise<string> {
  const s3Client = getS3Client();
  const { R2_BUCKET_NAME, R2_PUBLIC_URL } = getR2Config();

  if (!s3Client) {
    throw new Error('R2 not configured');
  }

  const key = `users/${recording.userId}/${recording.id}/metadata.json`;
  const createdAtNum = typeof recording.createdAt === 'string'
    ? new Date(recording.createdAt).getTime()
    : recording.createdAt;

  const payload = {
    id: recording.id,
    userId: recording.userId,
    title: recording.title,
    duration: recording.duration,
    createdAt: createdAtNum,
    timestamp: new Date().toISOString(),
    transcript: recording.transcript,
    summary: recording.summary,
    status: recording.status,
    audioUrl: recording.audioUrl,
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

/**
 * Delete recording from R2 (both audio and metadata - new format)
 */
export async function deleteFromR2(userId: string, recordingId: string): Promise<void> {
  const s3Client = getS3Client();
  const { R2_BUCKET_NAME } = getR2Config();

  if (!s3Client) {
    return;
  }

  const audioKey = `users/${userId}/${recordingId}/audio`;
  const metadataKey = `users/${userId}/${recordingId}/metadata.json`;

  try {
    const extensions = ['webm', 'm4a', 'wav', 'mp3'];
    for (const ext of extensions) {
      try {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: `${audioKey}.${ext}`,
          })
        );
      } catch {}
    }

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: metadataKey,
      })
    );
  } catch (error) {
    console.error('R2 deletion error:', error);
  }
}
