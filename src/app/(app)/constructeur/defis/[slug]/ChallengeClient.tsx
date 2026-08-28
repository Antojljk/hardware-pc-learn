'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkCompatibility, evaluateBuild, type Build } from '@/lib/compat';
import {
  Cpu, MemoryStick, HardDrive, CircuitBoard, MonitorPlay, Plug, Box, Snowflake,
  Save, AlertTriangle, CheckCircle2, Info, Target, Wallet, Sparkles, ChevronRight,
} from 'lucide-react';
import { LivePrice } from '@/components/LivePrice';
import { cn } from '@/lib/utils';

type ComponentLite = {
  id: string; type: string; brand: string; model: string; price: number;
  specs: Record<string, string | number>; category?: string;
};
type Challenge = { slug: string; title: string; budget: number; constraints: Record<string, unknown> };

const TYPES: { key: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'cpu', label: 'CPU', icon: Cpu },
  { key: 'gpu', label: 'GPU', icon: MonitorPlay },
  { key: 'motherboard', label: 'Carte mère', icon: CircuitBoard },
  { key: 'ram', label: 'RAM', icon: MemoryStick },
  { key: 'ssd', label: 'SSD', icon: HardDrive },
  { key: 'psu', label: 'Alimentation', icon: Plug },
  { key: 'case', label: 'Boîtier', icon: Box },
  { key: 'cooler', label: 'Refroidissement', icon: Snowflake },
];

export function ChallengeClient({ components, challenge }: { components: ComponentLite[]; challenge: Challenge }) {
  const router = useRouter();
  const [build, setBuild] = useState<Build>({});
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState<{ score: number; feedback: string } | null>(null);

  const byType = useMemo(() => {
    const m: Record<string, ComponentLite[]> = {};
    for (const c of components) (m[c.type] ||= []).push(c);
    for (const k of Object.keys(m)) m[k].sort((a, b) => a.price - b.price);
    return m;
  }, [components]);

  const check = useMemo(() => checkCompatibility(build), [build]);
  const score = useMemo(
    () => evaluateBuild(build, challenge.constraints as Record<string, string | number | boolean>),
    [build, challenge.constraints]
  );

  const overBudget = check.totalPrice > challenge.budget;
  const budgetPct = Math.min(100, Math.round((check.totalPrice / challenge.budget) * 100));
  const selectedCount = TYPES.filter(t => build[t.key]).length;
  const totalCategories = TYPES.length;
  const fillPct = Math.round((selectedCount / totalCategories) * 100);

  async function submit() {
    if (!check.ok || overBudget) return;
    setSaving(true);
    try {
      const res = await fetch('/api/builder', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: `Défi : ${challenge.title}`,
          components: build,
          score: score.total,
          feedback: JSON.stringify({ ...score, challenge: challenge.slug }),
        }),
      });
      if (res.ok) {
        setDone({ score: score.total, feedback: JSON.stringify(score) });
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    return (
      <div className="result-hero max-w-2xl mx-auto space-y-4 anim-rise">
        <div className="w-16 h-16 rounded-full grid place-items-center bg-text/10 border border-text/30 mx-auto">
          <CheckCircle2 className="w-8 h-8 text-text" />
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Défi validé.</h1>
        <p className="text-muted">
          Tu as terminé le défi <strong className="text-text">{challenge.title}</strong>.
        </p>
        <div className="font-display text-6xl font-semibold tabular-nums tracking-tight">
          {done.score}
          <span className="text-2xl text-muted">/100</span>
        </div>
        <a href="/constructeur/defis" className="btn-primary inline-flex">
          <Target className="w-4 h-4" /> Revenir aux défis
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HERO */}
      <section className="module-hero">
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="module-eyebrow flex items-center gap-2">
              <Target className="w-3.5 h-3.5" /> Défi en cours
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
              {challenge.title}
            </h1>
            <p className="text-sm text-muted flex items-center gap-1.5 mt-1">
              <Wallet className="w-3.5 h-3.5" /> Budget {challenge.budget} €
              <span className="text-border">·</span>
              {Object.keys(challenge.constraints).length} contraintes
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full sm:w-auto sm:min-w-[300px]">
            <div className={cn(
              'rounded-2xl border backdrop-blur p-3',
              overBudget ? 'border-text/30 bg-text/8' : 'border-border bg-bg-elev/70'
            )}>
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Wallet className="w-3.5 h-3.5" /> Total
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {check.totalPrice}<span className="text-sm text-muted ml-1">€</span>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Sparkles className="w-3.5 h-3.5" /> Sélection
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {selectedCount}<span className="text-sm text-muted">/{totalCategories}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Progress bar */}
          <section className="module-frame anim-rise anim-rise-1">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-muted" />
                <h3 className="section-title">Avancement</h3>
              </div>
              <span className="badge-muted tabular-nums">
                {selectedCount}/{totalCategories} pièces
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {TYPES.map(t => {
                const filled = !!build[t.key];
                return (
                  <span
                    key={t.key}
                    className={cn(
                      'inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border tabular-nums',
                      filled
                        ? 'border-text/40 bg-text/10 text-text'
                        : 'border-border bg-bg-elev text-muted'
                    )}
                  >
                    <span className={cn('w-1.5 h-1.5 rounded-full', filled ? 'bg-text' : 'bg-border')} />
                    {t.label}
                  </span>
                );
              })}
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-bg-elev overflow-hidden">
              <div
                className="h-full bg-text transition-all duration-500 ease-smooth"
                style={{ width: `${fillPct}%` }}
              />
            </div>
          </section>

          {/* Composants */}
          {TYPES.map((t, i) => {
            const Icon = t.icon;
            const opts = byType[t.key] || [];
            const selected = build[t.key];
            const selectedComp = opts.find(o => o.id === selected);
            return (
              <section
                key={t.key}
                className={`module-frame anim-rise anim-rise-${(i % 4) + 1}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl grid place-items-center bg-bg-elev border border-border">
                    <Icon className="w-4 h-4 text-text" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base font-semibold tracking-tight">{t.label}</h3>
                    <p className="text-[11px] text-muted">{opts.length} références</p>
                  </div>
                  {selectedComp && (
                    <span className="badge-accent truncate max-w-[200px]">
                      {selectedComp.brand} {selectedComp.model}
                    </span>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {opts.slice(0, 18).map(o => {
                    const active = selected === o.id;
                    return (
                      <button
                        key={o.id}
                        onClick={() => setBuild(b => ({ ...b, [t.key]: active ? undefined : o.id }))}
                        className={cn(
                          'text-left p-3 rounded-xl border transition-all duration-200 lift-3d',
                          active
                            ? 'border-text/60 bg-text/8 shadow-[0_0_0_1px_rgba(255,255,255,0.10)]'
                            : 'border-border bg-bg-elev hover:border-text/40'
                        )}
                      >
                        <div className="font-medium truncate">{o.brand} {o.model}</div>
                        <div className="mt-1.5 flex items-center justify-between">
                          <LivePrice query={`${o.brand} ${o.model}`} fallback={o.price} />
                          {active && <CheckCircle2 className="w-3.5 h-3.5 text-text shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-4 self-start">
          {/* Contraintes */}
          <section className="module-frame anim-rise anim-rise-1">
            <h3 className="section-title mb-3">Contraintes</h3>
            <ul className="text-sm space-y-1.5">
              <li className="flex items-center gap-2 py-2 border-b border-border">
                <Wallet className="w-3.5 h-3.5 text-muted shrink-0" />
                <span className="flex-1">Budget {challenge.budget} €</span>
                {overBudget ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-text shrink-0" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-text shrink-0" />
                )}
              </li>
              {Object.entries(challenge.constraints).map(([k, v]) => (
                <li
                  key={k}
                  className="flex items-center gap-2 py-2 border-b border-border last:border-0"
                >
                  <Info className="w-3.5 h-3.5 text-muted shrink-0" />
                  <span className="text-muted flex-1 truncate">{k}</span>
                  <span className="text-text font-medium tabular-nums shrink-0">{String(v)}</span>
                </li>
              ))}
            </ul>

            {/* Budget bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted mb-1.5">
                <span>Budget consommé</span>
                <span className="tabular-nums text-text">{budgetPct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-bg-elev overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all duration-500',
                    overBudget ? 'bg-text' : 'bg-text'
                  )}
                  style={{ width: `${budgetPct}%` }}
                />
              </div>
            </div>
          </section>

          {/* Compatibilité */}
          <section className="module-frame anim-rise anim-rise-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="section-title">Compatibilité</h3>
              {check.issues.length === 0 ? (
                <span className="badge-accent inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> OK
                </span>
              ) : (
                <span className="badge-muted tabular-nums">{check.issues.length}</span>
              )}
            </div>
            {check.issues.length === 0 ? (
              <p className="text-sm text-text inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Tout est OK
              </p>
            ) : (
              <ul className="space-y-2 text-xs text-text-soft">
                {check.issues.map((i, idx) => (
                  <li
                    key={idx}
                    className={cn(
                      'flex items-start gap-2',
                      i.severity === 'error'
                        ? 'text-text'
                        : i.severity === 'warn'
                          ? 'text-text-soft'
                          : 'text-muted'
                    )}
                  >
                    {i.severity === 'info' ? (
                      <Info className="w-3 h-3 mt-0.5 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                    )}
                    <span>{i.message}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Score + Submit */}
          {check.ok && !overBudget && (
            <section className="card-highlight anim-rise anim-rise-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="section-title">Score prévu</h3>
                <Sparkles className="w-4 h-4 text-text-soft" />
              </div>
              <div className="font-display text-4xl font-semibold tabular-nums tracking-tight">
                {score.total}
                <span className="text-sm text-muted">/100</span>
              </div>
              <button
                onClick={submit}
                disabled={saving}
                className="btn-on-surface w-full mt-4"
              >
                <Save className="w-4 h-4" /> {saving ? 'Validation…' : 'Valider le défi'}
                <ChevronRight className="w-3.5 h-3.5 ml-auto" />
              </button>
            </section>
          )}

          {/* Alerte budget */}
          {check.ok && overBudget && (
            <section className="info-banner anim-rise anim-rise-3">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <div className="text-sm">
                <div className="font-medium">Budget dépassé</div>
                <div className="text-muted mt-1">
                  Réduis la config de {check.totalPrice - challenge.budget} € pour valider.
                </div>
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
