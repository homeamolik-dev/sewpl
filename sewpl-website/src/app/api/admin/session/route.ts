import { NextResponse } from 'next/server';
import { clearAdminSession, isAdminAuthenticated, setAdminSession, verifyAdminPassword } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ authenticated: await isAdminAuthenticated() });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: 'Invalid admin password' }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ authenticated: true });
}

export async function DELETE() {
  await clearAdminSession();
  return NextResponse.json({ authenticated: false });
}
