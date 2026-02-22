import { NextResponse } from 'next/server';
import { writeFile, appendFile, mkdir, rename, unlink, readFile } from 'fs/promises';
import path from 'path';
import { ulid } from 'ulid';
import { createRecording } from '@/lib/server/db';
import { existsSync } from 'fs';

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const chunk = formData.get('chunk') as File;
    const sessionId = formData.get('sessionId') as string;
    const chunkIndex = parseInt(formData.get('chunkIndex') as string, 10);
    const duration = formData.get('duration') as string;
    const mimeType = formData.get('mimeType') as string;
    const language = formData.get('language') as string;
    const isFinal = formData.get('isFinal') === 'true';
    const ext = formData.get('ext') as string || 'webm';

    if (!chunk) {
      return NextResponse.json({ error: 'No chunk provided' }, { status: 400 });
    }

    if (!sessionId) {
      return NextResponse.json({ error: 'No sessionId provided' }, { status: 400 });
    }

    const bytes = await chunk.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const chunksDir = path.join(uploadsDir, 'chunks');

    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }
    if (!existsSync(chunksDir)) {
      await mkdir(chunksDir, { recursive: true });
    }

    const tempFilePath = path.join(chunksDir, `${sessionId}.temp`);
    const sessionInfoPath = path.join(chunksDir, `${sessionId}.json`);

    // Load or create session info
    let sessionInfo: any = {
      sessionId,
      startTime: Date.now(),
      chunksReceived: [],
      mimeType,
      language,
      ext,
    };

    if (existsSync(sessionInfoPath)) {
      try {
        const existingInfo = await readFile(sessionInfoPath, 'utf-8');
        sessionInfo = { ...JSON.parse(existingInfo), ...sessionInfo };
      } catch {}
    }

    // Append chunk to temp file
    if (existsSync(tempFilePath)) {
      await appendFile(tempFilePath, buffer);
    } else {
      await writeFile(tempFilePath, buffer);
    }

    sessionInfo.chunksReceived.push(chunkIndex);
    sessionInfo.lastChunkTime = Date.now();

    // Save session info
    await writeFile(sessionInfoPath, JSON.stringify(sessionInfo, null, 2));

    // If this is the final chunk, complete the upload
    if (isFinal) {
      const id = ulid();
      const filename = `${id}.${ext}`;
      const finalFilePath = path.join(uploadsDir, filename);

      // Move temp file to final location
      await rename(tempFilePath, finalFilePath);

      // Clean up session info
      try {
        await unlink(sessionInfoPath);
      } catch {}

      // Create recording in database
      const recording = await createRecording({
        id,
        title: `Recording ${new Date().toLocaleString()}`,
        audioPath: `/uploads/${filename}`,
        transcript: null,
        summary: null,
        status: 'processing',
        duration: duration ? parseInt(duration, 10) : null,
        cloudStatus: 'not_uploaded',
        cloudKey: null,
        cloudUrl: null,
        tags: [],
        summaryLanguage: language as any || 'zh',
      });

      return NextResponse.json({ id: recording.id, completed: true });
    }

    return NextResponse.json({ success: true, sessionId, chunkIndex });
  } catch (error) {
    console.error('Chunk upload error:', error);
    return NextResponse.json({ error: 'Chunk upload failed' }, { status: 500 });
  }
}

