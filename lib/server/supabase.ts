import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Make Supabase optional for backward compatibility
export const isSupabaseConfigured = !!(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

// For debugging - log what's missing
export function getSupabaseConfigStatus() {
  const missing: string[] = [];
  if (!SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY');
  return {
    isConfigured: isSupabaseConfigured,
    missing,
    hasUrl: !!SUPABASE_URL,
    hasServiceKey: !!SUPABASE_SERVICE_ROLE_KEY,
  };
}

/**
 * Supabase admin client (service role) for server-side operations
 * Bypasses RLS - always enforce user_id checks in application code!
 */
export const supabaseAdmin = isSupabaseConfigured
  ? createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Type definitions
export type RecordingStatus = 'recording' | 'processing' | 'completed' | 'failed';
export type CloudStatus = 'not_uploaded' | 'uploading' | 'uploaded' | 'deleting';
export type SummaryLanguage = 'zh' | 'en' | 'bilingual';

export interface Recording {
  id: string;
  user_id: string;
  title: string;
  r2_audio_key: string;
  r2_audio_url: string;
  transcript: string | null;
  summary: string | null;
  status: RecordingStatus;
  cloud_status: CloudStatus;
  cloud_key: string | null;
  cloud_url: string | null;
  duration: number | null;
  tags: string[];
  summary_language: SummaryLanguage;
  created_at: string;
  updated_at: string;
}
