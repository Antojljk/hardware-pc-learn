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
    <div className="space-y-10">
      <header>
        <div className="text-[11px] tracking-widest uppercase text-accent mb-2">Défis</div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight flex items-center gap-3">
          <Target className="w-7 h-7 text-accent" />
          Défis constructeur
        </h1>
        <p className="text-text-soft text-sm mt-2 max-w-xl">
          Atteins un objectif (budget, usage, contraintes) et obtiens un score. Les prix sont synchronisés en direct.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-4">
        {CHALLENGES.map(c => {
          const constraints = c.constraints as Record<string, unknown>;
          return (
            <Link key={c.slug} href={`/constructeur/defis/${c.slug}`} className="card card-hover p-6 group block">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h2 className="font-display text-lg font-semibold tracking-tight">{c.title}</h2>
                <span className="badge-accent">Défi</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-soft mb-3">
                <Wallet className="w-3.5 h-3.5" /> Budget {c.budget} €
              </div>
              <ul className="text-xs text-text-mute space-y-1">
                {!!constraints.use && <li>• Usage : {String(constraints.use)}</li>}
                {!!constraints.resolution && <li>• Résolution : {String(constraints.resolution)}</li>}
                {!!constraints.ram_min && <li>• RAM ≥ {String(constraints.ram_min)} Go</li>}
                {!!constraints.ssd_min && <li>• SSD ≥ {String(constraints.ssd_min)} Go</li>}
                {!!constraints.wifi && <li>• Wi-Fi obligatoire</li>}
              </ul>
              <div className="mt-5 inline-flex items-center gap-1 text-sm text-accent group-hover:gap-2 transition-all">
                Relever le défi <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          );
        })}
      </div>

      {builds.length > 0 && (
        <section>
          <h2 className="section-title mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-text-soft" /> Mes configurations sauvegardées
          </h2>
          <ul className="divide-y divide-border">
            {builds.map(b => (
              <li key={b.id} className="py-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                <div>
                  <div className="font-medium">{b.name}</div>
                  <div className="text-xs text-text-mute">{new Date(b.createdAt).toLocaleString('fr-FR')}</div>
                </div>
                {b.score !== null && <div className="font-display font-semibold tabular-nums">{b.score}<span className="text-text-mute text-xs">/100</span></div>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
