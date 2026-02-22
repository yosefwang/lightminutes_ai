import { NextResponse } from 'next/server';
import { isR2Configured } from '@/lib/server/services/r2';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    r2Configured: isR2Configured(),
  });
}
