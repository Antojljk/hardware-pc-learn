import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CHALLENGES } from '@/lib/compat';
import { Sparkles, Target, ArrowRight, Wallet } from 'lucide-react';

export default async function ChallengesPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');
  const builds = await prisma.configBuild.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-6">
      <section className="module-hero">
        <div className="module-eyebrow">Constructeur</div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight flex items-center gap-3 mt-2">
          <Target className="w-6 h-6 text-text" /> Défis constructeur
        </h1>
        <p className="text-muted text-[15px] mt-2 max-w-xl">Atteins un objectif (budget, usage, contraintes) et obtiens un score. Les prix sont synchronisés en direct.</p>
      </section>

      <div className="grid sm:grid-cols-2 gap-3">
        {CHALLENGES.map((c, i) => {
          const constraints = c.constraints as Record<string, unknown>;
          return (
            <Link
              key={c.slug}
              href={`/constructeur/defis/${c.slug}`}
              className={`module-frame lift-3d block group anim-rise anim-rise-${(i % 4) + 1}`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h2 className="font-display text-base font-semibold tracking-tight">{c.title}</h2>
                <span className="badge-muted">Défi</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted mb-3">
                <Wallet className="w-3.5 h-3.5" /> Budget {c.budget} €
              </div>
              <ul className="text-xs text-muted space-y-1">
                {!!constraints.use && <li className="flex items-start gap-2"><span className="text-muted">•</span>Usage : {String(constraints.use)}</li>}
                {!!constraints.resolution && <li className="flex items-start gap-2"><span className="text-muted">•</span>Résolution : {String(constraints.resolution)}</li>}
                {!!constraints.ram_min && <li className="flex items-start gap-2"><span className="text-muted">•</span>RAM ≥ {String(constraints.ram_min)} Go</li>}
                {!!constraints.ssd_min && <li className="flex items-start gap-2"><span className="text-muted">•</span>SSD ≥ {String(constraints.ssd_min)} Go</li>}
                {!!constraints.wifi && <li className="flex items-start gap-2"><span className="text-muted">•</span>Wi-Fi obligatoire</li>}
              </ul>
              <div className="mt-5 inline-flex items-center gap-1.5 text-sm text-text">Relever le défi <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" /></div>
            </Link>
          );
        })}
      </div>

      {builds.length > 0 && (
        <section className="module-frame">
          <h2 className="section-title mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-muted" /> Mes configurations sauvegardées
          </h2>
          <ul className="divide-y divide-border">
            {builds.map(b => (
              <li key={b.id} className="py-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                <div>
                  <div className="font-medium">{b.name}</div>
                  <div className="text-xs text-muted">{new Date(b.createdAt).toLocaleString('fr-FR')}</div>
                </div>
                {b.score !== null && <div className="font-display font-semibold tabular-nums">{b.score}<span className="text-muted text-xs">/100</span></div>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
