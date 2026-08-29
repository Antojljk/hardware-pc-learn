import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { grantXp, unlockBadges } from '@/lib/gamification';
import { canAccessCourse } from '@/lib/content-access';

const Schema = z.object({ slug: z.string().min(1) });

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
  try {
    const { slug } = Schema.parse(await req.json());
    // Garde-fou serveur : on refuse de valider un cours verrouillé
    // selon l'offre de l'utilisateur.
    if (!canAccessCourse(user.plan, slug)) {
      return NextResponse.json(
        { error: 'Accès refusé', code: 'PLAN_REQUIRED' },
        { status: 403 },
      );
    }
    const lesson = await prisma.lesson.findUnique({ where: { slug } });
    if (!lesson) return NextResponse.json({ error: 'Cours introuvable' }, { status: 404 });
    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: user.id, lessonId: lesson.id } },
      update: { completed: true, score: 100 },
      create: { userId: user.id, lessonId: lesson.id, completed: true, score: 100 },
    });
    const xpAwarded = 30;
    await grantXp(user.id, xpAwarded);
    const newBadges = await unlockBadges(user.id);
    return NextResponse.json({ ok: true, xpAwarded, newBadges });
  } catch {
    return NextResponse.json({ error: 'Erreur' }, { status: 400 });
  }
}
