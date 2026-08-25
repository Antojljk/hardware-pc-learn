import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword, createSession, destroySession } from '@/lib/auth';
import { checkRateLimit, resetRateLimit } from '@/lib/rate-limit';

const RegisterSchema = z.object({
  email: z.string().email('Email invalide').max(120),
  username: z.string().min(3, 'Pseudo trop court').max(24).regex(/^[a-zA-Z0-9_]+$/, 'Caractères autorisés : lettres, chiffres, _'),
  password: z.string().min(6, 'Mot de passe : 6 caractères minimum').max(128),
});

const LoginSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(6),
});

// Limites du rate limiter par action. Voir src/lib/rate-limit.ts pour
// l'avertissement concernant l'usage en environnement serverless / multi-instance.
const RATE_LIMITS = {
  login:    { limit: 10, windowMs: 15 * 60 * 1000 }, // 10 tentatives / 15 min / IP
  register: { limit: 3,  windowMs: 60 * 60 * 1000 }, // 3 créations  / 1 h  / IP
  guest:    { limit: 5,  windowMs: 60 * 60 * 1000 }, // 5 créations  / 1 h  / IP
} as const;

type RateLimitedAction = keyof typeof RATE_LIMITS;

/**
 * Extrait l'IP du client en privilégiant les en-têtes de proxy de confiance.
 * Ne logue ni ne renvoie la valeur : utilisée uniquement comme clé opaque.
 */
function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    // On prend la première IP de la liste (client d'origine selon le spec).
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get('x-real-ip');
  if (real) return real;
  return 'unknown';
}

function rateLimitResponse(retryAfterSeconds: number) {
  return NextResponse.json(
    { error: 'Trop de tentatives. Réessayez plus tard.' },
    {
      status: 429,
      headers: { 'Retry-After': String(retryAfterSeconds) },
    }
  );
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const action = url.searchParams.get('action');
  const body = await req.json().catch(() => ({}));

  // --- Rate limiting (avant la validation Zod et les requêtes coûteuses) ---
  // On ne limite que les actions sensibles. `logout` reste non limité.
  if (action === 'login' || action === 'register' || action === 'guest') {
    const typedAction = action as RateLimitedAction;
    const cfg = RATE_LIMITS[typedAction];
    const key = `${getClientIp(req)}:${typedAction}`;
    const result = checkRateLimit(key, cfg);
    if (!result.ok) {
      return rateLimitResponse(result.retryAfterSeconds);
    }
  }

  try {
    if (action === 'register') {
      const data = RegisterSchema.parse(body);
      const exists = await prisma.user.findFirst({
        where: { OR: [{ email: data.email }, { username: data.username }] },
      });
      if (exists) return NextResponse.json({ error: 'Email ou pseudo déjà utilisé' }, { status: 400 });
      const user = await prisma.user.create({
        data: {
          email: data.email,
          username: data.username,
          passwordHash: await hashPassword(data.password),
        },
      });
      await createSession(user.id);
      return NextResponse.json({ ok: true, username: user.username });
    }
    if (action === 'login') {
      const data = LoginSchema.parse(body);
      const user = await prisma.user.findFirst({
        where: { OR: [{ email: data.identifier }, { username: data.identifier }] },
      });
      if (!user || !(await verifyPassword(data.password, user.passwordHash))) {
        return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
      }
      // Connexion réussie : on libère le compteur de tentatives pour cette IP/action.
      resetRateLimit(`${getClientIp(req)}:login`);
      await createSession(user.id);
      return NextResponse.json({ ok: true, username: user.username });
    }
    if (action === 'logout') {
      await destroySession();
      return NextResponse.json({ ok: true });
    }
    if (action === 'guest') {
      const id = `guest_${Math.random().toString(36).slice(2, 10)}`;
      const user = await prisma.user.create({
        data: {
          email: `${id}@guest.local`,
          username: id,
          passwordHash: await hashPassword('guest'),
          isGuest: true,
        },
      });
      await createSession(user.id);
      return NextResponse.json({ ok: true, username: user.username });
    }
    return NextResponse.json({ error: 'Action inconnue' }, { status: 400 });
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
