import { NextResponse } from 'next/server';
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

  let uploadOption = 'both' as 'audio' | 'summary' | 'both';
  try {
    const body = await request.json().catch(() => ({}));
    if (body.uploadOption && ['audio', 'summary', 'both'].includes(body.uploadOption)) {
      uploadOption = body.uploadOption;
    }
  } catch (e) {
    // use default
  }

  // Update status to uploading immediately
  await updateRecording(id, { cloudStatus: 'uploading' });

  // Do the actual upload in the background, return immediately
  (async () => {
    try {
      const cloudUrl = await uploadToCloud(recording, null, uploadOption);
      const cloudKey = `recordings/${recording.id}.json`;

      await updateRecording(id, {
        cloudStatus: 'uploaded',
        cloudKey,
        cloudUrl,
      });
    } catch (error) {
      console.error('Cloud upload error:', error);
      await updateRecording(id, { cloudStatus: 'not_uploaded' });
    }
  })();

  return NextResponse.json({ success: true });
}
