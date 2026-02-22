import { NextResponse } from 'next/server';
import { getRecording, updateRecording } from '@/lib/server/db';
import { generateSummary } from '@/lib/server/services/llm';

export const maxDuration = 300;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recording = await getRecording(id);

  if (!recording) {
    return NextResponse.json({ error: 'Recording not found' }, { status: 404 });
  }

  if (!recording.transcript) {
    return NextResponse.json({ error: 'No transcript available' }, { status: 400 });
  }

  const body = await request.json();
  const language = body.language || recording.summaryLanguage;
  const promptTemplate = body.promptTemplate;

  // Update status to processing
  await updateRecording(id, { status: 'processing', summary: null });

  // Process in background
  (async () => {
    try {
      const summary = await generateSummary(
        recording.transcript!,
        language,
        promptTemplate
      );
      await updateRecording(id, { summary, status: 'completed' });
    } catch (error) {
      console.error('Regenerate summary error:', error);
      await updateRecording(id, { status: 'failed' });
    }
  })();

  return NextResponse.json({ success: true });
}
