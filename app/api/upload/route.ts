import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { ulid } from 'ulid';
import { createRecording } from '@/lib/server/db';

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audio = formData.get('audio') as File;
    const duration = formData.get('duration') as string;
    const mimeType = formData.get('mimeType') as string;
    const language = formData.get('language') as string;

    if (!audio) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    const bytes = await audio.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads');
    try {
      await writeFile(path.join(uploadsDir, '.gitkeep'), '');
    } catch {}

    // Save audio file
    const id = ulid();
    const ext = audio.name.split('.').pop() || 'webm';
    const filename = `${id}.${ext}`;
    const filepath = path.join(uploadsDir, filename);
    await writeFile(filepath, buffer);

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

    return NextResponse.json({ id: recording.id });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
