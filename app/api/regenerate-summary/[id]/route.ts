import { NextResponse } from 'next/server';
import { getRecording, updateRecording } from '@/lib/server/db';
import { generateSummary } from '@/lib/server/services/llm';
import { getAuthUserId } from '@/lib/server/auth';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/server/supabase';

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

async function updateRecordingAnywhere(id: string, userId: string, updates: any) {
  // Try Supabase first if configured
  if (isSupabaseConfigured && supabaseAdmin) {
    const supabaseUpdates: any = {};
    if (updates.status !== undefined) supabaseUpdates.status = updates.status;
    if (updates.summary !== undefined) supabaseUpdates.summary = updates.summary;
    if (updates.transcript !== undefined) supabaseUpdates.transcript = updates.transcript;

    const { error } = await supabaseAdmin
      .from('recordings')
      .update(supabaseUpdates)
      .eq('id', id)
      .eq('user_id', userId);

    if (!error) {
      return true;
    }
  }

  // Fallback to legacy JSON DB
  await updateRecording(id, updates);
  return true;
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

  // Update status to processing
  await updateRecordingAnywhere(id, userId, { status: 'processing', summary: null });

  // Process in background
  (async () => {
    try {
      const summary = await generateSummary(
        recording.transcript!,
        language,
        promptTemplate
      );
      await updateRecordingAnywhere(id, userId, { summary, status: 'completed' });
    } catch (error) {
      console.error('Regenerate summary error:', error);
      await updateRecordingAnywhere(id, userId, { status: 'failed' });
    }
  })();

  return NextResponse.json({ success: true });
}
