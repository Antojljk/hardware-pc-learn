'use client';

import { useMemo, useState } from 'react';
import { checkCompatibility, evaluateBuild, type Build } from '@/lib/compat';
import { Save, AlertTriangle, CheckCircle2, Info, Trash2, Cpu, HardDrive, CircuitBoard, MemoryStick, Plug, Box, Snowflake, MonitorPlay, Sparkles, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LivePrice } from '@/components/LivePrice';
import { cn } from '@/lib/utils';

type ComponentLite = {
  id: string;
  type: string;
  brand: string;
  model: string;
  price: number;
  specs: Record<string, string | number>;
  category?: string;
};

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

export function BuildClient({ components }: { components: ComponentLite[] }) {
  const router = useRouter();
  const [build, setBuild] = useState<Build>({});
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const byType = useMemo(() => {
    const m: Record<string, ComponentLite[]> = {};
    for (const c of components) (m[c.type] ||= []).push(c);
    for (const k of Object.keys(m)) m[k].sort((a, b) => a.price - b.price);
    return m;
  }, [components]);

  const check = useMemo(() => checkCompatibility(build), [build]);
  const score = useMemo(() => evaluateBuild(build), [build]);

  const selectedCount = TYPES.filter(t => build[t.key]).length;
  const totalCategories = TYPES.length;
  const fillPct = Math.round((selectedCount / totalCategories) * 100);

  function pick(type: string, id: string | undefined) {
    setBuild(b => ({ ...b, [type]: id }));
  }
  function reset() {
    setBuild({});
    setSavedId(null);
    setError(null);
  }
  async function save() {
    if (!check.ok) { setError('Impossible de sauvegarder : configuration incompatible.'); return; }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/builder', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: name || 'Ma configuration', components: build, score: score.total, feedback: JSON.stringify(score) }),
      });
      if (!res.ok) throw new Error('Erreur serveur');
      const data = await res.json();
      setSavedId(data.id);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Sélecteur */}
      <div className="lg:col-span-2 space-y-4">
        {/* Build progress */}
        <section className="module-frame anim-rise anim-rise-1">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-muted" />
              <h2 className="section-title">Progression de la build</h2>
            </div>
            <span className="badge-muted tabular-nums">
              {selectedCount}/{totalCategories} sélectionnés
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
                {opts.slice(0, 30).map(o => {
                  const active = selected === o.id;
                  return (
                    <button
                      key={o.id}
                      onClick={() => pick(t.key, active ? undefined : o.id)}
                      className={cn(
                        'text-left p-3 rounded-xl border transition-all duration-200 lift-3d',
                        active
                          ? 'border-text/60 bg-text/8 shadow-[0_0_0_1px_rgba(255,255,255,0.10)]'
                          : 'border-border bg-bg-elev hover:border-text/40'
                      )}
                    >
                      <div className="text-sm font-medium truncate">{o.brand} {o.model}</div>
                      <div className="text-[11px] text-muted truncate mt-0.5">
                        {Object.entries(o.specs).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                      </div>
                      <div className="mt-1.5 flex items-center justify-between">
                        <LivePrice query={`${o.brand} ${o.model}`} fallback={o.price} />
                        {active && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-text shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Récap + score */}
      <aside className="space-y-4 lg:sticky lg:top-4 self-start">
        {/* Récapitulatif */}
        <section className="module-frame anim-rise anim-rise-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="section-title">Récapitulatif</h3>
            <span className="badge-muted tabular-nums">{selectedCount}/{totalCategories}</span>
          </div>
          <ul className="text-sm space-y-1">
            {TYPES.map(t => {
              const c = (byType[t.key] || []).find(x => x.id === build[t.key]);
              return (
                <li
                  key={t.key}
                  className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-0"
                >
                  <span className="text-muted text-[10px] uppercase tracking-wider shrink-0">
                    {t.label}
                  </span>
                  <span className="font-medium text-right truncate min-w-0">
                    {c ? `${c.brand} ${c.model}` : <span className="text-faint">—</span>}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="hair-rule my-3" />
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted flex items-center gap-1">
                <Wallet className="w-3 h-3" /> Total
              </div>
              <div className="font-display text-3xl font-semibold tabular-nums tracking-tight">
                {check.totalPrice}<span className="text-base text-muted ml-1">€</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-muted">Conso.</div>
              <div className="font-display text-sm font-semibold tabular-nums text-text-soft">
                ~{check.totalPower} W
              </div>
            </div>
          </div>
        </section>

        {/* Vérification */}
        <section
          className={cn(
            'module-frame anim-rise anim-rise-2 transition-colors',
            check.issues.length > 0 && 'border-text/30'
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="section-title">Vérification</h3>
            {check.issues.length === 0 ? (
              <span className="badge-accent inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> OK
              </span>
            ) : (
              <span className="badge-muted tabular-nums">{check.issues.length}</span>
            )}
          </div>
          {check.issues.length === 0 ? (
            <div className="text-sm text-text-soft inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Configuration compatible
            </div>
          ) : (
            <ul className="space-y-2 text-sm">
              {check.issues.map((i, idx) => (
                <li
                  key={idx}
                  className={cn(
                    'flex items-start gap-2',
                    i.severity === 'error'
                      ? 'text-text'
                      : i.severity === 'warn'
                        ? 'text-text-soft'
                        : 'text-text-soft'
                  )}
                >
                  {i.severity === 'info' ? (
                    <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  )}
                  <span>{i.message}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Score */}
        {check.ok && (
          <section className="card-highlight anim-rise anim-rise-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="section-title">Score</h3>
              <Sparkles className="w-4 h-4 text-text-soft" />
            </div>
            <div className="font-display text-5xl font-semibold tabular-nums tracking-tight">
              {score.total}
              <span className="text-base text-muted ml-1">/100</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
              <ScoreRow label="Performances" value={score.performance} />
              <ScoreRow label="Rapport qualité/prix" value={score.value} />
              <ScoreRow label="Compatibilité" value={score.compatibility} />
              <ScoreRow label="Évolutivité" value={score.upgrade} />
            </div>
          </section>
        )}

        {/* Actions */}
        <section className="module-frame space-y-3 anim-rise anim-rise-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom de la config (optionnel)"
            className="input"
          />
          <button
            onClick={save}
            disabled={!check.ok || saving}
            className="btn-primary w-full"
          >
            <Save className="w-4 h-4" /> {saving ? 'Sauvegarde…' : 'Sauvegarder'}
          </button>
          <button onClick={reset} className="btn-outline w-full">
            <Trash2 className="w-4 h-4" /> Réinitialiser
          </button>
          {savedId && (
            <p className="text-xs text-text-soft inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Sauvegardé
            </p>
          )}
          {error && <p className="text-xs text-text-soft">{error}</p>}
        </section>
      </aside>
    </div>
  );
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  const v = Math.round(value);
  return (
    <div className="p-3 rounded-xl bg-bg-elev border border-border">
      <div className="text-muted text-[10px] uppercase tracking-wider">{label}</div>
      <div className="font-display font-semibold text-base tabular-nums mt-1 inline-flex items-baseline gap-1">
        {v}
        <span className="text-muted text-xs font-normal">/100</span>
      </div>
      <div className="mt-1.5 h-1 rounded-full bg-bg overflow-hidden">
        <div className="h-full bg-text transition-all duration-500" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
