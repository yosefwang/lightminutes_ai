import { NextResponse } from 'next/server';
import { deleteAllRecordings } from '@/lib/server/db';

export async function DELETE() {
  const count = await deleteAllRecordings();
  return NextResponse.json({ success: true, count });
}
