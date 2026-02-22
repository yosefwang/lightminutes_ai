import { transcribeAudio } from './groq';
import { generateSummary } from './llm';
import { downloadAudioFromR2, uploadMetadataToR2V2 } from './r2';
import { isSupabaseConfigured, supabaseAdmin } from '../supabase';

export async function processSupabaseRecording(
  recordingId: string,
  userId: string,
  r2AudioKey: string,
  r2AudioUrl: string,
  summaryLanguage: string
) {
  if (!isSupabaseConfigured || !supabaseAdmin) {
    throw new Error('Supabase not configured');
  }

  console.log('Starting Supabase recording processing:', recordingId);

  try {
    // Update status to processing
    await supabaseAdmin
      .from('recordings')
      .update({ status: 'processing' })
      .eq('id', recordingId)
      .eq('user_id', userId);

    // Download audio from R2
    console.log('Downloading audio from R2:', r2AudioKey);
    const audioBuffer = await downloadAudioFromR2(r2AudioKey);

    // Step 1: Transcribe
    console.log('Starting transcription');
    const transcript = await transcribeAudio(
      audioBuffer,
      'audio/webm',
      summaryLanguage
    );

    await supabaseAdmin
      .from('recordings')
      .update({ transcript })
      .eq('id', recordingId)
      .eq('user_id', userId);

    console.log('Transcription complete, length:', transcript.length);

    // Step 2: Generate summary
    console.log('Generating summary');
    const summary = await generateSummary(
      transcript,
      summaryLanguage
    );

    // Step 3: Upload metadata to R2
    console.log('Uploading metadata to R2');
    const { data: recording } = await supabaseAdmin
      .from('recordings')
      .select('*')
      .eq('id', recordingId)
      .eq('user_id', userId)
      .single();

    if (!recording) {
      throw new Error('Recording not found during metadata upload');
    }

    const metadataUrl = await uploadMetadataToR2V2({
      id: recordingId,
      userId,
      title: recording.title,
      duration: recording.duration,
      createdAt: recording.created_at,
      transcript,
      summary,
      status: 'completed',
      audioUrl: r2AudioUrl,
    });

    // Update recording with all data
    await supabaseAdmin
      .from('recordings')
      .update({
        summary,
        status: 'completed',
        cloud_status: 'uploaded',
        cloud_key: `users/${userId}/${recordingId}/metadata.json`,
        cloud_url: metadataUrl,
      })
      .eq('id', recordingId)
      .eq('user_id', userId);

    console.log('Supabase recording processing complete:', recordingId);
  } catch (error) {
    console.error('Supabase processing error:', error);
    try {
      await supabaseAdmin
        .from('recordings')
        .update({ status: 'failed' })
        .eq('id', recordingId)
        .eq('user_id', userId);
    } catch (updateError) {
      console.error('Failed to update status to failed:', updateError);
    }
    throw error;
  }
}
