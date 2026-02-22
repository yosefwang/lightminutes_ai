import { NextResponse } from 'next/server';
import { getRecording, updateRecording } from '@/lib/server/db';
import { removeFromCloud, isR2Configured } from '@/lib/server/services/r2';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recording = await getRecording(id);

  if (!recording) {
    return NextResponse.json({ error: 'Recording not found' }, { status: 404 });
  }

  if (!isR2Configured()) {
    return NextResponse.json({ error: 'R2 not configured' }, { status: 500 });
  }

  if (!recording.cloudKey) {
    return NextResponse.json({ error: 'Recording not in cloud' }, { status: 400 });
  }

  // Update status to deleting immediately
  await updateRecording(id, { cloudStatus: 'deleting' });

  // Do the actual delete in the background, return immediately
  (async () => {
    try {
      await removeFromCloud(recording.cloudKey!);
      await updateRecording(id, {
        cloudStatus: 'not_uploaded',
        cloudKey: null,
        cloudUrl: null,
      });
    } catch (error) {
      console.error('Cloud delete error:', error);
      await updateRecording(id, { cloudStatus: 'uploaded' });
    }
  })();

  return NextResponse.json({ success: true });
}
