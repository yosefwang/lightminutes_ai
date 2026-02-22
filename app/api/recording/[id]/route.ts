import { NextResponse } from 'next/server';
import { getRecording, deleteRecording as deleteRecordingFromDB } from '@/lib/server/db';
import { getAuthUserId } from '@/lib/server/auth';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/server/supabase';
import { deleteFromR2, isR2Configured } from '@/lib/server/services/r2';

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

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getAuthUserId();

  // Try Supabase first if configured
  if (isSupabaseConfigured && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('recordings')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!error && data) {
      return NextResponse.json(convertToLegacyFormat(data));
    }
  }

  // Fallback to legacy JSON DB
  const recording = await getRecording(id);
  if (!recording) {
    return NextResponse.json({ error: 'Recording not found' }, { status: 404 });
  }

  return NextResponse.json(recording);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getAuthUserId();

  // Delete from R2 first (if configured)
  if (isR2Configured()) {
    await deleteFromR2(userId, id);
  }

  // Try Supabase first if configured
  if (isSupabaseConfigured && supabaseAdmin) {
    const { error } = await supabaseAdmin
      .from('recordings')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (!error) {
      return NextResponse.json({ success: true });
    }
  }

  // Fallback to legacy JSON DB
  const success = await deleteRecordingFromDB(id);
  if (!success) {
    return NextResponse.json({ error: 'Recording not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
