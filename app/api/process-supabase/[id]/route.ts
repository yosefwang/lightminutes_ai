import { NextResponse } from 'next/server';
import { getAuthUserId } from '@/lib/server/auth';
import { transcribeAudio } from '@/lib/server/services/groq';
import { generateSummary } from '@/lib/server/services/llm';
import { downloadAudioFromR2, uploadMetadataToR2V2 } from '@/lib/server/services/r2';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/server/supabase';

export const maxDuration = 300;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getAuthUserId();

  if (!isSupabaseConfigured || !supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  // Get recording first to verify ownership and get data
  const { data: recording } = await supabaseAdmin
    .from('recordings')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (!recording) {
    return NextResponse.json({ error: 'Recording not found' }, { status: 404 });
  }

  // Process in background, return immediately
  (async () => {
    try {
      console.log('Starting Supabase recording processing:', id);

      // Update status to processing
      await supabaseAdmin
        .from('recordings')
        .update({ status: 'processing' })
        .eq('id', id)
        .eq('user_id', userId);

      // Download audio from R2
      console.log('Downloading audio from R2:', recording.r2_audio_key);
      const audioBuffer = await downloadAudioFromR2(recording.r2_audio_key);

      // Step 1: Transcribe
      console.log('Starting transcription');
      const transcript = await transcribeAudio(
        audioBuffer,
        'audio/webm',
        recording.summary_language || 'zh'
      );

      await supabaseAdmin
        .from('recordings')
        .update({ transcript })
        .eq('id', id)
        .eq('user_id', userId);

      console.log('Transcription complete, length:', transcript.length);

      // Step 2: Generate summary
      console.log('Generating summary');
      const summary = await generateSummary(
        transcript,
        recording.summary_language || 'zh'
      );

      // Step 3: Upload metadata to R2
      console.log('Uploading metadata to R2');
      const metadataUrl = await uploadMetadataToR2V2({
        id,
        userId,
        title: recording.title,
        duration: recording.duration,
        createdAt: recording.created_at,
        transcript,
        summary,
        status: 'completed',
        audioUrl: recording.r2_audio_url,
      });

      // Update recording with all data
      await supabaseAdmin
        .from('recordings')
        .update({
          summary,
          status: 'completed',
          cloud_status: 'uploaded',
          cloud_key: `users/${userId}/${id}/metadata.json`,
          cloud_url: metadataUrl,
        })
        .eq('id', id)
        .eq('user_id', userId);

      console.log('Supabase recording processing complete:', id);
    } catch (error) {
      console.error('Supabase processing error:', error);
      try {
        await supabaseAdmin
          .from('recordings')
          .update({ status: 'failed' })
          .eq('id', id)
          .eq('user_id', userId);
      } catch (updateError) {
        console.error('Failed to update status to failed:', updateError);
      }
    }
  })();

  return NextResponse.json({ success: true });
}
