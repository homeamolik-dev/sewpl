import { NextResponse } from 'next/server';
import { readAllContent } from '@/lib/content-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const content = await readAllContent();
  return NextResponse.json(content, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
