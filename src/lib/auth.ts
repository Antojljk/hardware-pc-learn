import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

const COOKIE = 'hwl_session';
const TTL_DAYS = 30;
const MIN_SECRET_LENGTH = 32;
const DEV_FALLBACK_SECRET = 'dev-secret-hardware-pc-learn-please-change-in-prod-9k2';

function resolveJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  const isProd = process.env.NODE_ENV === 'production';

  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    if (isProd) {
      throw new Error(
        `JWT_SECRET manquant ou trop court (${MIN_SECRET_LENGTH} caractères minimum requis en production).`
      );
    }
    return new TextEncoder().encode(DEV_FALLBACK_SECRET);
  }
  return new TextEncoder().encode(secret);
}

const SECRET = resolveJwtSecret();

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}
export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string) {
  const token = await new SignJWT({ uid: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${TTL_DAYS}d`)
    .sign(SECRET);
  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: TTL_DAYS * 86400,
  });
}

export async function destroySession() {
  cookies().delete(COOKIE);
}

export async function getCurrentUser() {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    const uid = payload.uid as string;
    return prisma.user.findUnique({ where: { id: uid } });
  } catch {
    return null;
  }
}

export async function requireUser() {
  const u = await getCurrentUser();
  if (!u) throw new Error('UNAUTHENTICATED');
  return u;
}
