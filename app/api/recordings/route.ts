import { NextResponse } from 'next/server';
import { getAuthUserId } from '@/lib/server/auth';
import { ulid } from 'ulid';
import { v4 as uuidv4 } from 'uuid';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/server/supabase';
import { createRecording as createLegacyRecording } from '@/lib/server/db';
import { tasks } from '@trigger.dev/sdk';

export async function POST(request: Request) {
  try {
    const userId = await getAuthUserId();
    const body = await request.json();

    const {
      title,
      r2AudioKey,
      r2AudioUrl,
      duration,
      summaryLanguage = 'zh',
      tags = [],
      promptTemplate,
    } = body;

    if (!r2AudioKey || !r2AudioUrl) {
      return NextResponse.json(
        { error: 'r2AudioKey and r2AudioUrl are required' },
        { status: 400 }
      );
    }

    const recordingTitle = title || `Recording ${new Date().toLocaleString()}`;
    const recordingId = ulid();

    // Try Supabase first if configured
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('recordings')
        .insert({
          id: uuidv4(),
          user_id: userId,
          title: recordingTitle,
          r2_audio_key: r2AudioKey,
          r2_audio_url: r2AudioUrl,
          transcript: null,
          summary: null,
          status: 'processing',
          cloud_status: 'uploaded',
          cloud_key: null,
          cloud_url: null,
          duration: duration || null,
          tags: tags || [],
          summary_language: summaryLanguage || 'zh',
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      // Trigger Trigger.dev task
      await tasks.trigger('process-recording', {
        recordingId: data.id,
        userId,
        r2AudioKey,
        r2AudioUrl,
        summaryLanguage: (summaryLanguage || 'zh') as 'zh' | 'en' | 'bilingual',
        promptTemplate,
      });

      return NextResponse.json({ id: data.id, recording: data });
    }

    // Fallback to legacy JSON DB
    const legacyRecording = await createLegacyRecording({
      id: recordingId,
      title: recordingTitle,
      audioPath: r2AudioUrl,
      transcript: null,
      summary: null,
      status: 'processing',
      duration: duration || null,
      cloudStatus: 'uploaded',
      cloudKey: null,
      cloudUrl: null,
      tags: tags || [],
      summaryLanguage: summaryLanguage || 'zh',
    });

    // Also trigger the old-style processing for backward compatibility
    fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/process/${recordingId}`, {
      method: 'POST',
    }).catch(() => {});

    return NextResponse.json({ id: recordingId, recording: legacyRecording });
  } catch (error: any) {
    console.error('Create recording error:', error);

    if (error.message === 'Unauthorized: No user ID found') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Failed to create recording' },
      { status: 500 }
    );
  }
}
