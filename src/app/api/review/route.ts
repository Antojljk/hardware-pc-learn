import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { grantXp } from '@/lib/gamification';

const schema = z.object({
  termSlug: z.string().min(1),
  // 0 = oublié, 3 = dur, 4 = bon, 5 = facile (SM-2 like)
  quality: z.number().int().min(0).max(5),
});

function sm2(ease: number, interval: number, reps: number, quality: number) {
  const newEase = Math.max(1.3, ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  let newReps = reps;
  let newInterval = interval;
  if (quality < 3) {
    newReps = 0;
    newInterval = 1;
  } else {
    newReps += 1;
    if (newReps === 1) newInterval = 1;
    else if (newReps === 2) newInterval = 6;
    else newInterval = Math.round(interval * newEase);
  }
  return { ease: newEase, interval: newInterval, reps: newReps };
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });

  const card = await prisma.reviewCard.findUnique({
    where: { userId_termSlug: { userId: user.id, termSlug: parsed.data.termSlug } },
  });
  if (!card) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const { ease, interval, reps } = sm2(card.ease, card.interval, card.reps, parsed.data.quality);
  const dueAt = new Date(Date.now() + interval * 86400000);

  await prisma.reviewCard.update({
    where: { userId_termSlug: { userId: user.id, termSlug: parsed.data.termSlug } },
    data: { ease, interval, reps, lapses: parsed.data.quality < 3 ? card.lapses + 1 : card.lapses, dueAt },
  });
  if (parsed.data.quality >= 3) await grantXp(user.id, 2);
  return NextResponse.json({ ok: true, next: dueAt });
}
