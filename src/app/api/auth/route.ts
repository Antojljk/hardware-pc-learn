import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword, createSession, destroySession } from '@/lib/auth';

const RegisterSchema = z.object({
  email: z.string().email('Email invalide').max(120),
  username: z.string().min(3, 'Pseudo trop court').max(24).regex(/^[a-zA-Z0-9_]+$/, 'Caractères autorisés : lettres, chiffres, _'),
  password: z.string().min(6, 'Mot de passe : 6 caractères minimum').max(128),
});

const LoginSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  const url = new URL(req.url);
  const action = url.searchParams.get('action');
  const body = await req.json().catch(() => ({}));

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
