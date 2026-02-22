import { NextResponse } from 'next/server';
import { getAllRecordings } from '@/lib/server/db';
import { getAuthUserId } from '@/lib/server/auth';
import { isSupabaseConfigured, supabaseAdmin, type Recording } from '@/lib/server/supabase';

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

export async function GET() {
  const userId = await getAuthUserId();

  // Try Supabase first if configured
  if (isSupabaseConfigured && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('recordings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      return NextResponse.json(data.map(convertToLegacyFormat));
    }
  }

  // Fallback to legacy JSON DB
  const recordings = await getAllRecordings();
  return NextResponse.json(recordings);
}
