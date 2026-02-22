import { NextResponse } from 'next/server';
import path from 'path';
import { readFile } from 'fs/promises';
import { getRecording, updateRecording } from '@/lib/server/db';
import { transcribeAudio } from '@/lib/server/services/groq';
import { generateSummary } from '@/lib/server/services/llm';

export const maxDuration = 300;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recording = await getRecording(id);

  if (!recording) {
    return NextResponse.json({ error: 'Recording not found' }, { status: 404 });
  }

  // Process in background, return immediately
  (async () => {
    try {
      const audioPath = path.join(process.cwd(), 'uploads', path.basename(recording.audioPath));
      const audioBuffer = await readFile(audioPath);

      // Step 1: Transcribe
      const transcript = await transcribeAudio(
        audioBuffer,
        'audio/webm',
        recording.summaryLanguage
      );
      await updateRecording(id, { transcript });

      // Step 2: Generate summary
      const summary = await generateSummary(
        transcript,
        recording.summaryLanguage
      );
      await updateRecording(id, { summary, status: 'completed' });
    } catch (error) {
      console.error('Processing error:', error);
      await updateRecording(id, { status: 'failed' });
    }
  })();

  return NextResponse.json({ success: true });
}
