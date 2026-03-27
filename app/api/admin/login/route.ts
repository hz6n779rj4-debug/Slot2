import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const password = String(body.password || '');
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    return NextResponse.json({ error: 'ADMIN_SECRET is missing.' }, { status: 500 });
  }

  if (password !== secret) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
  }

  const store = await cookies();
  store.set(COOKIE_NAME, secret, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 14
  });

  return NextResponse.json({ success: true });
}
