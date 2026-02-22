import { NextResponse } from 'next/server';
import { listCloudRecordings, isR2Configured } from '@/lib/server/services/r2';

export async function GET() {
  if (!isR2Configured()) {
    return NextResponse.json({ recordings: [] });
  }

  try {
    const recordings = await listCloudRecordings();
    return NextResponse.json({ recordings });
  } catch (error) {
    console.error('Cloud list error:', error);
    return NextResponse.json({ recordings: [] });
  }
}
