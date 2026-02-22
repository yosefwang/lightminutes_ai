import { NextResponse } from 'next/server';
import { getRecording, deleteRecording as deleteRecordingFromDB } from '@/lib/server/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recording = await getRecording(id);

  if (!recording) {
    return NextResponse.json({ error: 'Recording not found' }, { status: 404 });
  }

  return NextResponse.json(recording);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const success = await deleteRecordingFromDB(id);

  if (!success) {
    return NextResponse.json({ error: 'Recording not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
