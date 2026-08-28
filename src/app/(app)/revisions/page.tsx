import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Wrench, Sparkles, ArrowRight } from 'lucide-react';
import { ReviewRunner } from './ReviewRunner';

export const dynamic = 'force-dynamic';

// Spaced-repetition lite (SM-2 like) : propose 5-15 cartes dues.
// Si pas de ReviewCard, on prend les termes où l'utilisateur s'est trompé récemment (catégories faibles).

export default async function RevisionsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  const now = new Date();
  // Crée des cartes initiales pour tous les termes si l'utilisateur n'en a aucune
  const existingCount = await prisma.reviewCard.count({ where: { userId: user.id } });
  if (existingCount === 0) {
    const terms = await prisma.glossaryTerm.findMany();
    if (terms.length) {
      await prisma.reviewCard.createMany({
        data: terms.map(t => ({ userId: user.id, termSlug: t.slug })),
      });
    }
  }

  const due = await prisma.reviewCard.findMany({
    where: { userId: user.id, dueAt: { lte: now } },
    orderBy: { dueAt: 'asc' },
    take: 15,
  });
  const terms = await prisma.glossaryTerm.findMany({
    where: { slug: { in: due.map(d => d.termSlug) } },
  });
  const termMap = new Map(terms.map(t => [t.slug, t]));

  const cards = due.map(c => {
    const t = termMap.get(c.termSlug);
    return t ? {
      slug: t.slug,
      term: t.term,
      simple: t.simple,
      technical: t.technical,
      ease: c.ease,
      interval: c.interval,
      reps: c.reps,
    } : null;
  }).filter(Boolean) as Array<{ slug: string; term: string; simple: string; technical: string; ease: number; interval: number; reps: number }>;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <section className="module-hero">
        <div className="module-eyebrow">Mémorisation</div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight flex items-center gap-2 mt-2">
          <Wrench className="w-6 h-6 text-text" /> Révisions du jour
        </h1>
        <p className="text-muted text-[15px] mt-2 max-w-xl">Révision espacée : les cartes reviennent au bon moment pour ancrer durablement.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="badge-muted">{cards.length} carte{cards.length > 1 ? 's' : ''} à réviser</span>
        </div>
      </section>

      {cards.length === 0 ? (
        <div className="module-frame text-center space-y-3 py-10 anim-rise">
          <div className="w-12 h-12 mx-auto rounded-2xl grid place-items-center bg-bg-elev border border-border">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold">Aucune carte à réviser aujourd&apos;hui !</p>
            <p className="text-sm text-muted mt-1">Reviens demain, ou entraîne-toi sur des quiz pour générer de nouvelles cartes.</p>
          </div>
          <a href="/quiz" className="btn-primary inline-flex"><ArrowRight className="w-4 h-4" /> Lancer un quiz</a>
        </div>
      ) : (
        <ReviewRunner cards={cards} />
      )}
    </div>
  );
}
