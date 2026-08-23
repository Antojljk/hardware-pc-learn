import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { CHALLENGES, checkCompatibility, evaluateBuild } from '@/lib/compat';
import { ChallengeClient } from './ChallengeClient';

export const dynamic = 'force-dynamic';

export default async function ChallengePage({ params }: { params: { slug: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');
  const challenge = CHALLENGES.find(c => c.slug === params.slug);
  if (!challenge) return notFound();

  const components = await prisma.component.findMany();

  const initial = {
    components: components.map(c => ({
      id: c.id, type: c.type, brand: c.brand, model: c.model, price: c.price,
      specs: typeof c.specs === 'string' ? safeParse(c.specs) : c.specs,
      category: c.category || undefined,
    })),
    challenge,
  };

  return <ChallengeClient {...initial} />;
}

function safeParse(s: string) {
  try { return JSON.parse(s); } catch { return {}; }
}

// Reference unused helpers to avoid TS6133
void checkCompatibility;
void evaluateBuild;
