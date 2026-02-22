import { NextResponse } from 'next/server';
import { getAllRecordings } from '@/lib/server/db';

export async function GET() {
  const recordings = await getAllRecordings();
  return NextResponse.json(recordings);
}
