import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Wrench, Sparkles, ArrowRight, Layers, Clock, Target, Brain, ListChecks } from 'lucide-react';
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

  const totalCards = await prisma.reviewCard.count({ where: { userId: user.id } });
  const dueCount = cards.length;
  const masteredCount = cards.filter(c => c.reps >= 3 && c.interval >= 21).length;
  const newCount = cards.filter(c => c.reps === 0).length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* HERO */}
      <section className="module-hero">
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="module-eyebrow flex items-center gap-2">
              <Brain className="w-3.5 h-3.5" /> Mémorisation
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight flex items-center gap-3">
              <Wrench className="w-8 h-8 sm:w-10 sm:h-10 text-text" />
              Révisions du jour
            </h1>
            <p className="text-muted text-[15px] max-w-xl leading-relaxed">
              Révision espacée : les cartes reviennent au bon moment pour ancrer durablement.
              Algorithme SM-2 adaptatif selon ta confiance.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto sm:min-w-[360px]">
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <ListChecks className="w-3.5 h-3.5" /> Dues
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {dueCount}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Layers className="w-3.5 h-3.5" /> Total
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {totalCards}
              </div>
            </div>
            <div className="rounded-2xl border border-text/30 bg-text/8 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Target className="w-3.5 h-3.5" /> Maîtrisées
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {masteredCount}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BANDEAU D'INFO */}
      <section className="info-banner text-xs sm:text-sm anim-rise anim-rise-1">
        <Clock className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
        <span>
          {newCount > 0 ? (
            <>Parmi les cartes du jour : <strong className="text-text">{newCount}</strong> nouvelle{newCount > 1 ? 's' : ''} et <strong className="text-text">{dueCount - newCount}</strong> à renforcer.</>
          ) : (
            <>Toutes les cartes du jour ont déjà été vues au moins une fois. Idéal pour renforcer la mémoire à long terme.</>
          )}
        </span>
      </section>

      {cards.length === 0 ? (
        <div className="module-frame text-center space-y-4 py-10 anim-rise anim-rise-2">
          <div className="w-14 h-14 mx-auto rounded-2xl grid place-items-center bg-bg-elev border border-border">
            <Sparkles className="w-6 h-6 text-text" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold">Aucune carte à réviser aujourd&apos;hui</h2>
            <p className="text-sm text-muted mt-1.5 max-w-md mx-auto">Reviens demain, ou entraîne-toi sur des quiz pour générer de nouvelles cartes.</p>
          </div>
          <a href="/quiz" className="btn-primary inline-flex">
            <ArrowRight className="w-4 h-4" /> Lancer un quiz
          </a>
        </div>
      ) : (
        <section className="anim-rise anim-rise-2">
          <ReviewRunner cards={cards} />
        </section>
      )}
    </div>
  );
}
