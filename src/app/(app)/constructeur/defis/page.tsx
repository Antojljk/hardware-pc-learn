import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CHALLENGES } from '@/lib/compat';
import { Sparkles, Target, ArrowRight, Wallet, History, Trophy, Layers } from 'lucide-react';

export default async function ChallengesPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');
  const builds = await prisma.configBuild.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  const bestScore = builds.length ? Math.max(...builds.map(b => b.score ?? 0)) : null;
  const avgScore = builds.length
    ? Math.round(builds.reduce((s, b) => s + (b.score ?? 0), 0) / builds.length)
    : null;

  return (
    <div className="space-y-6">
      {/* HERO */}
      <section className="module-hero">
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="module-eyebrow flex items-center gap-2">
              <Target className="w-3.5 h-3.5" /> Atelier
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              Défis constructeur
            </h1>
            <p className="text-muted text-[15px] max-w-xl leading-relaxed">
              Atteins un objectif (budget, usage, contraintes) et obtiens un score.
              Les prix sont synchronisés en direct.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto sm:min-w-[360px]">
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Layers className="w-3.5 h-3.5" /> Défis
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {CHALLENGES.length}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <History className="w-3.5 h-3.5" /> Builds
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {builds.length}
              </div>
            </div>
            <div className="rounded-2xl border border-text/30 bg-text/8 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Trophy className="w-3.5 h-3.5" /> Meilleur
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {bestScore !== null ? bestScore : '—'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GRILLE DES DÉFIS */}
      <div className="grid sm:grid-cols-2 gap-3">
        {CHALLENGES.map((c, i) => {
          const constraints = c.constraints as Record<string, unknown>;
          const constraintCount = Object.keys(constraints).length;
          return (
            <Link
              key={c.slug}
              href={`/constructeur/defis/${c.slug}`}
              className={`card-depth relative overflow-hidden lift-3d group p-5 sm:p-6 anim-rise anim-rise-${(i % 4) + 1}`}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-50 blur-3xl"
                style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.10), transparent 70%)' }}
              />
              <div className="relative">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="space-y-1.5 min-w-0">
                    <div className="module-eyebrow">Défi</div>
                    <h2 className="font-display text-lg sm:text-xl font-semibold leading-tight">
                      {c.title}
                    </h2>
                  </div>
                  <span className="badge-muted shrink-0">
                    <Wallet className="w-3 h-3" />
                    {c.budget} €
                  </span>
                </div>

                <ul className="text-xs text-text-soft space-y-1.5 my-4">
                  {!!constraints.use && (
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-text/60 mt-1.5 shrink-0" />
                      <span>Usage : {String(constraints.use)}</span>
                    </li>
                  )}
                  {!!constraints.resolution && (
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-text/60 mt-1.5 shrink-0" />
                      <span>Résolution : {String(constraints.resolution)}</span>
                    </li>
                  )}
                  {!!constraints.ram_min && (
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-text/60 mt-1.5 shrink-0" />
                      <span>RAM ≥ {String(constraints.ram_min)} Go</span>
                    </li>
                  )}
                  {!!constraints.ssd_min && (
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-text/60 mt-1.5 shrink-0" />
                      <span>SSD ≥ {String(constraints.ssd_min)} Go</span>
                    </li>
                  )}
                  {!!constraints.wifi && (
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-text/60 mt-1.5 shrink-0" />
                      <span>Wi-Fi obligatoire</span>
                    </li>
                  )}
                </ul>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-[10px] text-muted uppercase tracking-wider tabular-nums">
                    {constraintCount} contrainte{constraintCount > 1 ? 's' : ''}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-text">
                    Relever le défi
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* MES CONFIGURATIONS */}
      {builds.length > 0 && (
        <section className="module-frame anim-rise anim-rise-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Mes configurations sauvegardées
            </h2>
            <div className="flex items-center gap-2">
              {avgScore !== null && (
                <span className="badge-muted tabular-nums">Moy. {avgScore}/100</span>
              )}
              <span className="badge-muted tabular-nums">{builds.length}</span>
            </div>
          </div>
          <ul className="divide-y divide-border">
            {builds.map(b => (
              <li
                key={b.id}
                className="py-3 flex flex-wrap items-center gap-3 text-sm"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{b.name}</div>
                  <div className="text-xs text-muted">
                    {new Date(b.createdAt).toLocaleString('fr-FR')}
                  </div>
                </div>
                {b.score !== null && (
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden sm:block w-28 h-1.5 rounded-full bg-bg-elev overflow-hidden">
                      <div className="h-full bg-text" style={{ width: `${b.score}%` }} />
                    </div>
                    <span className="font-semibold tabular-nums text-text w-12 text-right">
                      {b.score}
                      <span className="text-muted text-xs font-normal">/100</span>
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
