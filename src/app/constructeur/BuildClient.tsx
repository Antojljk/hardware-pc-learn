'use client';

import { useMemo, useState } from 'react';
import { checkCompatibility, evaluateBuild, type Build } from '@/lib/compat';
import { Save, AlertTriangle, CheckCircle2, Info, Trash2, Cpu, HardDrive, CircuitBoard, MemoryStick, Plug, Box, Snowflake, MonitorPlay } from 'lucide-react';
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
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Sélecteur */}
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
                {opts.slice(0, 30).map(o => {
                  const active = selected === o.id;
                  return (
                    <button
                      key={o.id}
                      onClick={() => pick(t.key, active ? undefined : o.id)}
                      className={cn(
                        'text-left p-3 rounded-xl border transition-colors',
                        active
                          ? 'border-accent bg-accent/5'
                          : 'border-border bg-bg-elev hover:border-text-mute'
                      )}
                    >
                      <div className="text-sm font-medium truncate">{o.brand} {o.model}</div>
                      <div className="text-[11px] text-text-mute truncate">
                        {Object.entries(o.specs).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                      </div>
                      <div className="mt-1">
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

      {/* Récap + score */}
      <aside className="space-y-6 lg:sticky lg:top-4 self-start">
        <section>
          <h3 className="font-display text-base font-semibold tracking-tight mb-3">Récapitulatif</h3>
          <ul className="text-sm space-y-2">
            {TYPES.map(t => {
              const c = (byType[t.key] || []).find(x => x.id === build[t.key]);
              return (
                <li key={t.key} className="flex items-center justify-between gap-3 py-1.5 border-b border-border last:border-0">
                  <span className="text-text-mute text-xs uppercase tracking-wider">{t.label}</span>
                  <span className="font-medium text-right truncate">
                    {c ? `${c.brand} ${c.model}` : <span className="text-text-mute">—</span>}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="hair-rule my-3" />
          <div className="text-sm flex justify-between items-baseline">
            <span className="text-text-mute">Total</span>
            <span className="font-display text-2xl font-semibold tabular-nums">{check.totalPrice} €</span>
          </div>
          <div className="text-[11px] text-text-mute mt-1">Conso. estimée : ~{check.totalPower} W</div>
        </section>

        <section>
          <h3 className="font-display text-base font-semibold tracking-tight mb-3">Vérification</h3>
          {check.issues.length === 0 ? (
            <div className="text-sm text-success flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Configuration compatible</div>
          ) : (
            <ul className="space-y-2 text-sm">
              {check.issues.map((i, idx) => (
                <li key={idx} className={`flex items-start gap-2 ${i.severity === 'error' ? 'text-danger' : i.severity === 'warn' ? 'text-warning' : 'text-text-soft'}`}>
                  {i.severity === 'info' ? <Info className="w-3.5 h-3.5 mt-0.5" /> : <AlertTriangle className="w-3.5 h-3.5 mt-0.5" />}
                  <span>{i.message}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {check.ok && (
          <section>
            <h3 className="font-display text-base font-semibold tracking-tight mb-3">Score</h3>
            <div className="font-display text-5xl font-semibold tabular-nums tracking-tight">{score.total}<span className="text-base text-text-mute ml-1">/100</span></div>
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
              <ScoreRow label="Performances" value={score.performance} />
              <ScoreRow label="Rapport qualité/prix" value={score.value} />
              <ScoreRow label="Compatibilité" value={score.compatibility} />
              <ScoreRow label="Évolutivité" value={score.upgrade} />
            </div>
          </section>
        )}

        <section className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom de la config (optionnel)"
            className="input"
          />
          <button onClick={save} disabled={!check.ok || saving} className="btn-primary w-full">
            <Save className="w-4 h-4" /> {saving ? 'Sauvegarde…' : 'Sauvegarder'}
          </button>
          <button onClick={reset} className="btn-outline w-full"><Trash2 className="w-4 h-4" /> Réinitialiser</button>
          {savedId && <p className="text-xs text-success">Sauvegardé ✓</p>}
          {error && <p className="text-xs text-danger">{error}</p>}
        </section>
      </aside>
    </div>
  );
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-3 rounded-xl bg-bg-elev">
      <div className="text-text-mute text-[10px] uppercase tracking-wider">{label}</div>
      <div className="font-display font-semibold text-base tabular-nums mt-0.5">{Math.round(value)}<span className="text-text-mute text-xs">/100</span></div>
    </div>
  );
}
