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
      <div className="card p-10 max-w-2xl mx-auto text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 text-success mx-auto" />
        <h1 className="font-display text-3xl font-semibold tracking-tight">Défi validé.</h1>
        <p className="text-text-soft">Tu as terminé le défi <b>{challenge.title}</b>.</p>
        <div className="font-display text-6xl font-semibold tabular-nums tracking-tight text-accent">{done.score}<span className="text-2xl text-text-mute">/100</span></div>
        <a href="/constructeur/defis" className="btn-primary inline-flex"><Target className="w-4 h-4" /> Revenir aux défis</a>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[11px] tracking-widest uppercase text-accent mb-2">Défi en cours</div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">{challenge.title}</h1>
          <p className="text-sm text-text-soft flex items-center gap-1.5 mt-2">
            <Wallet className="w-3.5 h-3.5" /> Budget {challenge.budget} € · {Object.keys(challenge.constraints).length} contraintes
          </p>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-text-mute uppercase tracking-wider">Total actuel</div>
          <div className={`font-display text-3xl font-semibold tabular-nums ${overBudget ? 'text-danger' : 'text-text'}`}>{check.totalPrice}<span className="text-base text-text-mute ml-1">€</span></div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {TYPES.map(t => {
            const Icon = t.icon;
            const opts = byType[t.key] || [];
            const selected = build[t.key];
            return (
              <section key={t.key} className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <Icon className="w-4 h-4 text-text-soft" />
                  <h3 className="font-display text-base font-semibold tracking-tight">{t.label}</h3>
                  <span className="text-xs text-text-mute ml-auto">{opts.length} références</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {opts.slice(0, 18).map(o => {
                    const active = selected === o.id;
                    const over = o.price > challenge.budget;
                    return (
                      <button
                        key={o.id}
                        onClick={() => setBuild(b => ({ ...b, [t.key]: active ? undefined : o.id }))}
                        className={cn(
                          'text-left p-2.5 rounded-xl border transition-colors text-sm',
                          active
                            ? 'border-accent bg-accent/5'
                            : 'border-border bg-bg-elev hover:border-text-mute'
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

        <aside className="space-y-3 lg:sticky lg:top-4 self-start">
          <section className="card p-4">
            <h3 className="section-title mb-2">Contraintes</h3>
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2">
                <Wallet className="w-3.5 h-3.5" />
                <span>Budget {challenge.budget} €</span>
                {overBudget ? <AlertTriangle className="w-3.5 h-3.5 text-danger ml-auto" /> : <CheckCircle2 className="w-3.5 h-3.5 text-success ml-auto" />}
              </li>
              {Object.entries(challenge.constraints).map(([k, v]) => (
                <li key={k} className="flex items-center gap-2 text-text-soft">
                  <Info className="w-3.5 h-3.5" />
                  <span>{k} : {String(v)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="card p-4">
            <h3 className="section-title mb-2">Compatibilité</h3>
            {check.issues.length === 0 ? (
              <p className="text-sm text-success">Tout est OK</p>
            ) : (
              <ul className="text-xs space-y-1">
                {check.issues.map((i, idx) => (
                  <li key={idx} className={i.severity === 'error' ? 'text-danger' : i.severity === 'warn' ? 'text-warning' : 'text-text-soft'}>{i.message}</li>
                ))}
              </ul>
            )}
          </section>

          {check.ok && !overBudget && (
            <section className="card p-4">
              <h3 className="section-title mb-2">Score prévu</h3>
              <div className="text-3xl font-bold">{score.total}<span className="text-sm text-text-mute">/100</span></div>
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
