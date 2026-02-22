import { task, logger, retry } from '@trigger.dev/sdk/v3';
import { transcribeAudio } from '@/lib/server/services/groq';
import { generateSummary } from '@/lib/server/services/llm';
import { downloadAudioFromR2, uploadMetadataToR2V2 } from '@/lib/server/services/r2';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/server/supabase';

export const processRecording = task({
  id: 'process-recording',
  run: async (payload: {
    recordingId: string;
    userId: string;
    r2AudioKey: string;
    r2AudioUrl: string;
    summaryLanguage: 'zh' | 'en' | 'bilingual';
  }) => {
    const { recordingId, userId, r2AudioKey, r2AudioUrl, summaryLanguage } = payload;

    logger.info('Starting recording processing', { recordingId, userId });

    try {
      if (!isSupabaseConfigured || !supabaseAdmin) {
        throw new Error('Supabase not configured');
      }

      await supabaseAdmin
        .from('recordings')
        .update({ status: 'processing' })
        .eq('id', recordingId)
        .eq('user_id', userId);

      logger.info('Downloading audio from R2', { r2AudioKey });
      const audioBuffer = await retry.onThrow(() => downloadAudioFromR2(r2AudioKey), {
        maxAttempts: 3,
        minTimeoutInMs: 1000,
      });

      logger.info('Starting transcription');
      const transcript = await retry.onThrow(() => transcribeAudio(
        audioBuffer,
        'audio/webm',
        summaryLanguage
      ), {
        maxAttempts: 3,
        minTimeoutInMs: 1000,
      });

      await supabaseAdmin
        .from('recordings')
        .update({ transcript })
        .eq('id', recordingId)
        .eq('user_id', userId);

      logger.info('Transcription complete', { transcriptLength: transcript.length });

      logger.info('Generating summary');
      const summary = await retry.onThrow(() => generateSummary(
        transcript,
        summaryLanguage
      ), {
        maxAttempts: 3,
        minTimeoutInMs: 1000,
      });

      const { data: recording } = await supabaseAdmin
        .from('recordings')
        .select('*')
        .eq('id', recordingId)
        .eq('user_id', userId)
        .single();

      if (!recording) {
        throw new Error('Recording not found');
      }

      logger.info('Uploading metadata to R2');
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

      logger.info('Recording processing complete', { recordingId });

      return { success: true, recordingId };
    } catch (error) {
      logger.error('Recording processing failed', { error });
      try {
        if (isSupabaseConfigured && supabaseAdmin) {
          await supabaseAdmin
            .from('recordings')
            .update({ status: 'failed' })
            .eq('id', recordingId)
            .eq('user_id', userId);
        }
      } catch (updateError) {
        logger.error('Failed to update status to failed', { updateError });
      }
      throw error;
    }
  },
});

export const regenerateSummary = task({
  id: 'regenerate-summary',
  run: async (payload: {
    recordingId: string;
    userId: string;
    summaryLanguage?: 'zh' | 'en' | 'bilingual';
  }) => {
    const { recordingId, userId, summaryLanguage } = payload;

    logger.info('Starting summary regeneration', { recordingId, userId });

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

      const summary = await generateSummary(recording.transcript, language);

      await supabaseAdmin
        .from('recordings')
        .update({
          summary,
          status: 'completed',
          summary_language: language,
        })
        .eq('id', recordingId)
        .eq('user_id', userId);

      logger.info('Summary regeneration complete', { recordingId });

      return { success: true, recordingId };
    } catch (error) {
      logger.error('Summary regeneration failed', { error });
      try {
        if (isSupabaseConfigured && supabaseAdmin) {
          await supabaseAdmin
            .from('recordings')
            .update({ status: 'failed' })
            .eq('id', recordingId)
            .eq('user_id', userId);
        }
      } catch (updateError) {
        logger.error('Failed to update status to failed', { updateError });
      }
      throw error;
    }
  },
});
