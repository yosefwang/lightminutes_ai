import { NextResponse } from 'next/server';
import { getRecording, updateRecording } from '@/lib/server/db';
import { getAuthUserId } from '@/lib/server/auth';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/server/supabase';
import { tasks } from '@trigger.dev/sdk';
import type { regenerateSummary } from '@/trigger/process-recording';

// Convert Supabase recording to legacy format
function convertToLegacyFormat(supabaseRecording: any): any {
  return {
    id: supabaseRecording.id,
    title: supabaseRecording.title,
    audioPath: supabaseRecording.r2_audio_url || '',
    transcript: supabaseRecording.transcript,
    summary: supabaseRecording.summary,
    status: supabaseRecording.status,
    duration: supabaseRecording.duration,
    createdAt: supabaseRecording.created_at ? new Date(supabaseRecording.created_at).getTime() : Date.now(),
    cloudStatus: supabaseRecording.cloud_status || 'not_uploaded',
    cloudKey: supabaseRecording.cloud_key,
    cloudUrl: supabaseRecording.cloud_url,
    tags: supabaseRecording.tags || [],
    summaryLanguage: supabaseRecording.summary_language || 'zh',
  };
}

async function getRecordingFromAnywhere(id: string, userId: string) {
  // Try Supabase first if configured
  if (isSupabaseConfigured && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('recordings')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!error && data) {
      return { source: 'supabase', recording: convertToLegacyFormat(data) };
    }
  }

  // Fallback to legacy JSON DB
  const recording = await getRecording(id);
  if (recording) {
    return { source: 'legacy', recording };
  }

  return { source: null, recording: null };
}

export const maxDuration = 300;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getAuthUserId();

  const { source, recording } = await getRecordingFromAnywhere(id, userId);

  if (!recording) {
    return NextResponse.json({ error: 'Recording not found' }, { status: 404 });
  }

  if (!recording.transcript) {
    return NextResponse.json({ error: 'No transcript available' }, { status: 400 });
  }

  const body = await request.json();
  const language = body.language || recording.summaryLanguage;
  const promptTemplate = body.promptTemplate;

  // Try Trigger.dev first if Supabase is configured
  if (source === 'supabase') {
    await tasks.trigger<typeof regenerateSummary>('regenerate-summary', {
      recordingId: id,
      userId,
      summaryLanguage: language,
      promptTemplate,
    });

    return NextResponse.json({ success: true });
  }

  // Fallback to legacy processing
  // Update status to processing
  await updateRecording(id, { status: 'processing', summary: null });

  // Process in background
  (async () => {
    try {
      const { generateSummary } = await import('@/lib/server/services/llm');
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
