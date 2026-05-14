import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = 'sewpl_admin_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || 'admin123';
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || getAdminPassword();
}

function sign(payload: string) {
  return crypto.createHmac('sha256', getSessionSecret()).update(payload).digest('hex');
}

export function verifyAdminPassword(password: string) {
  const expected = getAdminPassword();
  const providedBuffer = Buffer.from(password);
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(providedBuffer, expectedBuffer);
}

export function createSessionToken() {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = `admin.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;

  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const payload = `${parts[0]}.${parts[1]}`;
  const signature = parts[2];
  if (Date.now() > Number(parts[1])) return false;

  const expected = sign(payload);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  return providedBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(providedBuffer, expectedBuffer);
}
