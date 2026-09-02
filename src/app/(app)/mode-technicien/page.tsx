import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Hammer, ArrowRight, Wrench, AlertTriangle, Activity, Layers, Wrench as Tool } from 'lucide-react';
import { canAccess } from '@/lib/plans';
import { LockedState } from '@/components/LockedState';

export const metadata = { title: 'Mode technicien — HardwarePC' };

export default async function TechnicienModePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  // Mode technicien = PRO+.
  if (!canAccess(user.plan, 'mode_technicien', user.id)) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">Mode technicien</h1>
        <LockedState
          feature="Mode technicien"
          required="PRO"
          current={user.plan}
          description="Le mode technicien est réservé à l'offre Pro et supérieures. Diagnostique sans guidage, puis compare ta procédure à la cause racine."
        />
      </div>
    );
  }

  const scenarios = await prisma.diagnosticScenario.findMany({ orderBy: { difficulty: 'asc' } });

  const difficultyCount = {
    facile: scenarios.filter(s => s.difficulty.toLowerCase() === 'facile').length,
    moyen: scenarios.filter(s => s.difficulty.toLowerCase() === 'moyen').length,
    difficile: scenarios.filter(s => s.difficulty.toLowerCase() === 'difficile').length,
  };

  return (
    <div className="space-y-6">
      {/* HERO */}
      <section className="module-hero">
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="module-eyebrow flex items-center gap-2">
              <Tool className="w-3.5 h-3.5" /> Atelier
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight flex items-center gap-3">
              <Hammer className="w-8 h-8 sm:w-10 sm:h-10 text-text" />
              Mode technicien
            </h1>
            <p className="text-muted text-[15px] max-w-xl leading-relaxed">
              Diagnostic sans guidage : observe, raisonne, propose ta procédure.
              Solution détaillée affichée après validation.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto sm:min-w-[360px]">
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Wrench className="w-3.5 h-3.5" /> Scénarios
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {scenarios.length}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Activity className="w-3.5 h-3.5" /> Facile
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {difficultyCount.facile}
              </div>
            </div>
            <div className="rounded-2xl border border-text/30 bg-text/8 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <AlertTriangle className="w-3.5 h-3.5" /> Difficile
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {difficultyCount.difficile}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BANDEAU D'INFO */}
      <section className="info-banner text-sm anim-rise anim-rise-1">
        <Wrench className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
        <span>
          <strong className="text-text">Mode avancé :</strong> aucune aide affichée pendant la procédure.
          À la fin, compare ton diagnostic à la cause racine et à la solution détaillée.
        </span>
      </section>

      {/* LISTE SCÉNARIOS */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title flex items-center gap-2">
            <Layers className="w-4 h-4 text-muted" /> Catalogue de pannes
          </h2>
          <span className="badge-muted">{scenarios.length} scénarios</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {scenarios.map((s, i) => {
            let symptoms: string[] = [];
            try { symptoms = JSON.parse(s.symptoms); } catch { /* ignore */ }
            return (
              <Link
                key={s.slug}
                href={`/diagnostic/${s.slug}`}
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
                      <div className="module-eyebrow">{s.category}</div>
                      <h2 className="font-display text-lg sm:text-xl font-semibold leading-tight truncate">
                        {s.title}
                      </h2>
                    </div>
                    <span className="badge-muted capitalize shrink-0">{s.difficulty}</span>
                  </div>

                  <ul className="text-xs text-text-soft space-y-1.5 line-clamp-3 my-4">
                    {symptoms.slice(0, 3).map((sym, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-text/60 mt-1.5 shrink-0" />
                        <span>{sym}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-[10px] text-muted uppercase tracking-wider">
                      {symptoms.length} symptôme{symptoms.length > 1 ? 's' : ''}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-text">
                      Diagnostiquer
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
