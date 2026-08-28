'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkCompatibility, evaluateBuild, type Build } from '@/lib/compat';
import { Cpu, MemoryStick, HardDrive, CircuitBoard, MonitorPlay, Plug, Box, Snowflake, Save, AlertTriangle, CheckCircle2, Info, Target, Wallet } from 'lucide-react';
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
  const score = useMemo(() => evaluateBuild(build, challenge.constraints as Record<string, string | number | boolean>), [build, challenge.constraints]);

  const overBudget = check.totalPrice > challenge.budget;

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
        <CheckCircle2 className="w-12 h-12 text-text mx-auto" />
        <h1 className="font-display text-3xl font-semibold tracking-tight">Défi validé.</h1>
        <p className="text-muted">Tu as terminé le défi <strong className="text-text">{challenge.title}</strong>.</p>
        <div className="font-display text-6xl font-semibold tabular-nums tracking-tight">{done.score}<span className="text-2xl text-muted">/100</span></div>
        <a href="/constructeur/defis" className="btn-primary inline-flex"><Target className="w-4 h-4" /> Revenir aux défis</a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="module-hero flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="module-eyebrow mb-2">Défi en cours</div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">{challenge.title}</h1>
          <p className="text-sm text-muted flex items-center gap-1.5 mt-3">
            <Wallet className="w-3.5 h-3.5" /> Budget {challenge.budget} € · {Object.keys(challenge.constraints).length} contraintes
          </p>
        </div>
        <div className="text-right">
          <div className="module-eyebrow mb-1">Total actuel</div>
          <div className={`font-display text-3xl font-semibold tabular-nums ${overBudget ? 'text-muted' : 'text-text'}`}>{check.totalPrice}<span className="text-base text-muted ml-1">€</span></div>
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {TYPES.map((t, i) => {
            const Icon = t.icon;
            const opts = byType[t.key] || [];
            const selected = build[t.key];
            return (
              <section key={t.key} className={`space-y-3 anim-rise anim-rise-${(i % 4) + 1}`}>
                <div className="flex items-center gap-2 px-1">
                  <Icon className="w-4 h-4 text-muted" />
                  <h3 className="font-display text-base font-semibold tracking-tight">{t.label}</h3>
                  <span className="text-xs text-muted ml-auto">{opts.length} références</span>
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
                            ? 'border-text/60 bg-text/8'
                            : 'border-border bg-bg-elev hover:border-text/40'
                        )}
                      >
                        <div className="font-medium truncate">{o.brand} {o.model}</div>
                        <div className="mt-0.5">
                          <LivePrice query={`${o.brand} ${o.model}`} fallback={o.price} />
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
          <section className="module-frame">
            <h3 className="section-title mb-3">Contraintes</h3>
            <ul className="text-sm space-y-1.5">
              <li className="flex items-center gap-2 py-1.5 border-b border-border last:border-0">
                <Wallet className="w-3.5 h-3.5" />
                <span>Budget {challenge.budget} €</span>
                {overBudget ? <AlertTriangle className="w-3.5 h-3.5 text-muted ml-auto" /> : <CheckCircle2 className="w-3.5 h-3.5 text-text ml-auto" />}
              </li>
              {Object.entries(challenge.constraints).map(([k, v]) => (
                <li key={k} className="flex items-center gap-2 text-muted py-1.5 border-b border-border last:border-0">
                  <Info className="w-3.5 h-3.5" />
                  <span>{k} : {String(v)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="module-frame">
            <h3 className="section-title mb-3">Compatibilité</h3>
            {check.issues.length === 0 ? (
              <p className="text-sm text-text inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Tout est OK</p>
            ) : (
              <ul className="text-xs space-y-1.5 text-muted">
                {check.issues.map((i, idx) => (
                  <li key={idx} className={i.severity === 'error' ? 'text-text' : i.severity === 'warn' ? 'text-text-soft' : 'text-muted'}>{i.message}</li>
                ))}
              </ul>
            )}
          </section>

          {check.ok && !overBudget && (
            <section className="module-frame">
              <h3 className="section-title mb-3">Score prévu</h3>
              <div className="font-display text-3xl font-semibold tabular-nums">{score.total}<span className="text-sm text-muted">/100</span></div>
              <button onClick={submit} disabled={saving} className="btn-primary w-full mt-3">
                <Save className="w-4 h-4" /> {saving ? 'Validation…' : 'Valider le défi'}
              </button>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
