import { NextResponse } from 'next/server';
import { getAuthUserId } from '@/lib/server/auth';
import { getS3Client, getR2Config } from '@/lib/server/services/r2';
import { GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const userId = await getAuthUserId();
    const { key } = await params;
    const fullKey = key.join('/');

    // Verify the key belongs to the user - must start with users/{userId}/
    if (!fullKey.startsWith(`users/${userId}/`)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const s3Client = getS3Client();
    const { R2_BUCKET_NAME } = getR2Config();

    if (!s3Client || !R2_BUCKET_NAME) {
      return NextResponse.json({ error: 'R2 not configured' }, { status: 500 });
    }

    // Get file metadata first
    const headResponse = await s3Client.send(
      new HeadObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: fullKey,
      })
    );

    const fileSize = headResponse.ContentLength || 0;
    const range = request.headers.get('range');

    // Determine content type based on file extension
    let contentType = 'audio/webm';
    if (fullKey.endsWith('.m4a') || fullKey.endsWith('.mp4')) {
      contentType = 'audio/mp4';
    } else if (fullKey.endsWith('.wav')) {
      contentType = 'audio/wav';
    } else if (fullKey.endsWith('.mp3')) {
      contentType = 'audio/mpeg';
    }

    // Handle range requests
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const response = await s3Client.send(
        new GetObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: fullKey,
          Range: `bytes=${start}-${end}`,
        })
      );

      if (!response.Body) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }

      // Convert S3 Body to Web ReadableStream
      const body = response.Body as unknown as AsyncIterable<Uint8Array>;
      const stream = new ReadableStream({
        async start(controller) {
          for await (const chunk of body) {
            controller.enqueue(chunk);
          }
          controller.close();
        },
      });

      return new NextResponse(stream, {
        status: 206,
        headers: {
          'Content-Type': contentType,
          'Content-Length': chunkSize.toString(),
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=31536000',
        },
      });
    }

    // Full file request
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: fullKey,
      })
    );

    if (!response.Body) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Convert S3 Body to Web ReadableStream
    const body = response.Body as unknown as AsyncIterable<Uint8Array>;
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of body) {
          controller.enqueue(chunk);
        }
        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileSize.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error: any) {
    console.error('Audio proxy error:', error);

    if (error.message === 'Unauthorized: No user ID found') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Failed to fetch audio' },
      { status: 500 }
    );
  }
}
