import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Stethoscope, Wrench, ArrowRight, AlertTriangle, Activity, History } from 'lucide-react';
import { canAccess } from '@/lib/plans';
import { LockedState } from '@/components/LockedState';

export default async function DiagnosticHome() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  // Garde-fou serveur : le diagnostic est réservé au plan PRO et supérieures.
  if (!canAccess(user.plan, 'diagnostic_full')) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">Laboratoire de diagnostic</h1>
        <LockedState
          feature="Laboratoire de diagnostic"
          required="PRO"
          current={user.plan}
          description="L'atelier de diagnostic est réservé à l'offre Pro et supérieures : résous des pannes complexes et valide ton expertise technique."
        />
      </div>
    );
  }

  const scenarios = await prisma.diagnosticScenario.findMany();
  const attempts = await prisma.diagnosticAttempt.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 5 });

  const bestScore = attempts.length ? Math.max(...attempts.map(a => a.score)) : null;

  return (
    <div className="space-y-6">
      {/* HERO */}
      <section className="module-hero">
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="module-eyebrow flex items-center gap-2">
              <Stethoscope className="w-3.5 h-3.5" /> Atelier
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              Laboratoire de diagnostic
            </h1>
            <p className="text-muted text-[15px] max-w-xl leading-relaxed">
              Résous des pannes PC réelles en exerçant ton raisonnement.
              Sélectionne les étapes de diagnostic dans le bon ordre pour valider un scénario.
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
                <Activity className="w-3.5 h-3.5" /> Tentatives
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {attempts.length}
              </div>
            </div>
            <div className="rounded-2xl border border-text/30 bg-text/8 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <AlertTriangle className="w-3.5 h-3.5" /> Meilleur
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {bestScore !== null ? `${bestScore}` : '—'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LISTE SCÉNARIOS */}
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

      {attempts.length > 0 && (
        <section className="module-frame anim-rise anim-rise-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <History className="w-4 h-4" /> Historique
            </h2>
            <span className="badge-muted tabular-nums">{attempts.length}</span>
          </div>
          <ul className="divide-y divide-border">
            {attempts.map(a => (
              <li key={a.id} className="py-3 flex flex-wrap items-center gap-3 text-sm">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {scenarios.find(s => s.id === a.scenarioId)?.title || 'Scénario'}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="hidden sm:block w-28 h-1.5 rounded-full bg-bg-elev overflow-hidden">
                    <div className="h-full bg-text" style={{ width: `${a.score}%` }} />
                  </div>
                  <span className="font-semibold tabular-nums text-text w-12 text-right">
                    {a.score}/100
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
