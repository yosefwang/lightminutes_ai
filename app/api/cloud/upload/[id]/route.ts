import { NextResponse } from 'next/server';
import path from 'path';
import { readFile } from 'fs/promises';
import { getRecording, updateRecording } from '@/lib/server/db';
import { uploadToCloud, isR2Configured } from '@/lib/server/services/r2';

export const maxDuration = 300;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recording = await getRecording(id);

  if (!recording) {
    return NextResponse.json({ error: 'Recording not found' }, { status: 404 });
  }

  if (!isR2Configured()) {
    return NextResponse.json({ error: 'R2 not configured' }, { status: 500 });
  }

  try {
    await updateRecording(id, { cloudStatus: 'uploading' });

    const body = await request.json();
    const uploadOption = body.uploadOption || 'both';

    let audioBuffer: Buffer | null = null;
    if (uploadOption !== 'summary') {
      const audioPath = path.join(process.cwd(), 'uploads', path.basename(recording.audioPath));
      audioBuffer = await readFile(audioPath);
    }

    const cloudUrl = await uploadToCloud(recording, audioBuffer, uploadOption);
    const cloudKey = `recording-${recording.id}.json`;

    await updateRecording(id, {
      cloudStatus: 'uploaded',
      cloudKey,
      cloudUrl,
    });

    return NextResponse.json({ success: true, cloudUrl });
  } catch (error) {
    console.error('Cloud upload error:', error);
    await updateRecording(id, { cloudStatus: 'not_uploaded' });
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
