import { task } from '@trigger.dev/sdk';
import { transcribeAudio } from '@/lib/server/services/groq';
import { generateSummary } from '@/lib/server/services/llm';
import { downloadAudioFromR2, uploadMetadataToR2V2 } from '@/lib/server/services/r2';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/server/supabase';

export const processRecording = task({
  id: 'process-recording',
  retry: {
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 10000,
  },
  run: async (payload: {
    recordingId: string;
    userId: string;
    r2AudioKey: string;
    r2AudioUrl: string;
    summaryLanguage: 'zh' | 'en' | 'bilingual';
    promptTemplate?: string;
  }) => {
    const { recordingId, userId, r2AudioKey, r2AudioUrl, summaryLanguage, promptTemplate } = payload;

    console.log('Starting recording processing', { recordingId, userId });

    try {
      if (!isSupabaseConfigured || !supabaseAdmin) {
        throw new Error('Supabase not configured');
      }

      await supabaseAdmin
        .from('recordings')
        .update({ status: 'processing' })
        .eq('id', recordingId)
        .eq('user_id', userId);

      console.log('Downloading audio from R2', { r2AudioKey });
      const audioBuffer = await downloadAudioFromR2(r2AudioKey);

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

      console.log('Transcription complete', { transcriptLength: transcript.length });

      console.log('Generating summary');
      const summary = await generateSummary(
        transcript,
        summaryLanguage,
        promptTemplate
      );

      const { data: recording } = await supabaseAdmin
        .from('recordings')
        .select('*')
        .eq('id', recordingId)
        .eq('user_id', userId)
        .single();

      if (!recording) {
        throw new Error('Recording not found');
      }

      console.log('Uploading metadata to R2');
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

      console.log('Recording processing complete', { recordingId });

      return { success: true, recordingId };
    } catch (error) {
      console.error('Recording processing failed', { error });
      try {
        if (isSupabaseConfigured && supabaseAdmin) {
          await supabaseAdmin
            .from('recordings')
            .update({ status: 'failed' })
            .eq('id', recordingId)
            .eq('user_id', userId);
        }
      } catch (updateError) {
        console.error('Failed to update status to failed', { updateError });
      }
      throw error;
    }
  },
});

export const regenerateSummary = task({
  id: 'regenerate-summary',
  retry: {
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 10000,
  },
  run: async (payload: {
    recordingId: string;
    userId: string;
    summaryLanguage?: 'zh' | 'en' | 'bilingual';
    promptTemplate?: string;
  }) => {
    const { recordingId, userId, summaryLanguage, promptTemplate } = payload;

    console.log('Starting summary regeneration', { recordingId, userId });

    try {
      if (!isSupabaseConfigured || !supabaseAdmin) {
        throw new Error('Supabase not configured');
      }

      const { data: recording } = await supabaseAdmin
        .from('recordings')
        .select('*')
        .eq('id', recordingId)
        .eq('user_id', userId)
        .single();

      if (!recording) {
        throw new Error('Recording not found');
      }

      if (!recording.transcript) {
        throw new Error('No transcript available');
      }

      const language = summaryLanguage || recording.summary_language;

      await supabaseAdmin
        .from('recordings')
        .update({ status: 'processing', summary: null })
        .eq('id', recordingId)
        .eq('user_id', userId);

      const summary = await generateSummary(recording.transcript, language, promptTemplate);

      await supabaseAdmin
        .from('recordings')
        .update({
          summary,
          status: 'completed',
          summary_language: language,
        })
        .eq('id', recordingId)
        .eq('user_id', userId);

      console.log('Summary regeneration complete', { recordingId });

      return { success: true, recordingId };
    } catch (error) {
      console.error('Summary regeneration failed', { error });
      try {
        if (isSupabaseConfigured && supabaseAdmin) {
          await supabaseAdmin
            .from('recordings')
            .update({ status: 'failed' })
            .eq('id', recordingId)
            .eq('user_id', userId);
        }
      } catch (updateError) {
        console.error('Failed to update status to failed', { updateError });
      }
      throw error;
    }
  },
});
