import { NextResponse } from 'next/server';
import { deleteAllRecordings } from '@/lib/server/db';
import { getAuthUserId } from '@/lib/server/auth';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/server/supabase';
import { deleteAllFromR2, isR2Configured } from '@/lib/server/services/r2';

export async function DELETE() {
  const userId = await getAuthUserId();
  let count = 0;

  // Delete from R2 first (if configured)
  if (isR2Configured()) {
    await deleteAllFromR2(userId);
  }

  // Try Supabase first if configured
  if (isSupabaseConfigured && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('recordings')
      .delete()
      .eq('user_id', userId)
      .select('*');

    if (!error) {
      count = data?.length || 0;
    }
  }

  // Also delete from legacy JSON DB as fallback
  const legacyCount = await deleteAllRecordings();
  if (count === 0) {
    count = legacyCount;
  }

  return NextResponse.json({ success: true, count });
}
