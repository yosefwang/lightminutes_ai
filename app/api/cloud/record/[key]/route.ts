import { NextResponse } from 'next/server';
import { deleteCloudRecording, isR2Configured } from '@/lib/server/services/r2';

export async function DELETE(request: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;

  if (!isR2Configured()) {
    return NextResponse.json({ error: 'R2 not configured' }, { status: 500 });
  }

  try {
    await deleteCloudRecording(decodeURIComponent(key));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cloud record delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
