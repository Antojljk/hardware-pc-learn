import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { grantXp, unlockBadges } from '@/lib/gamification';
import { canAccessBuilder } from '@/lib/content-access';
import { buildLockedResponse } from '@/lib/plan-guard';

const schema = z.object({
  name: z.string().min(1).max(80),
  components: z.record(z.string()),
  score: z.number().min(0).max(100).optional(),
  feedback: z.string().optional(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  // Le Constructeur PC complet est désormais réservé à PRO+.
  if (!canAccessBuilder(user.plan)) {
    return buildLockedResponse('builder_full', 'PRO');
  }
  const builds = await prisma.configBuild.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  return NextResponse.json({ builds });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  // Constructeur PC complet = PRO+ (cf. grille officielle).
  if (!canAccessBuilder(user.plan)) {
    return buildLockedResponse('builder_full', 'PRO');
  }
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'invalid', details: parsed.error.flatten() }, { status: 400 });

  const build = await prisma.configBuild.create({
    data: {
      userId: user.id,
      name: parsed.data.name,
      components: JSON.stringify(parsed.data.components),
      score: parsed.data.score ?? null,
      feedback: parsed.data.feedback ?? null,
    },
  });
  await grantXp(user.id, 25);
  await unlockBadges(user.id);
  return NextResponse.json({ id: build.id });
}
