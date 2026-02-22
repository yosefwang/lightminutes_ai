import { NextResponse } from 'next/server';
import { getAuthUserId } from '@/lib/server/auth';
import { generatePresignedUploadUrl, isR2Configured } from '@/lib/server/services/r2';

export async function POST(request: Request) {
  try {
    const userId = await getAuthUserId();

    if (!isR2Configured()) {
      return NextResponse.json(
        { error: 'R2 storage not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const fileExtension = body.fileExtension || 'webm';
    const mimeType = body.mimeType || 'audio/webm';

    const { key, url, publicUrl } = await generatePresignedUploadUrl(
      userId,
      fileExtension,
      mimeType
    );

    return NextResponse.json({
      key,
      uploadUrl: url,
      publicUrl,
    });
  } catch (error: any) {
    console.error('Presigned URL error:', error);

    if (error.message === 'Unauthorized: No user ID found') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
