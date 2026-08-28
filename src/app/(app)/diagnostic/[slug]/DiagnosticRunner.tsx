'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wrench, Send, Loader2, AlertTriangle, CircleCheck, CircleAlert, CircleX, Settings, Lightbulb, ArrowLeft, Plus, Activity, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type Step = { id: string; label: string; type: string; category: string };

export function DiagnosticRunner({
  slug, title, symptoms, steps, idealSequence, optionalAcceptable, rootCause, solution,
}: {
  slug: string; title: string; symptoms: string[]; steps: Step[];
  idealSequence: string[]; optionalAcceptable: string[]; wrongMoves: string[]; rootCause: string; solution: string;
}) {
  const router = useRouter();
  const [chosen, setChosen] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; xpAwarded: number; evaluation: { good: string[]; missed: string[]; wrong: string[] } } | null>(null);

  async function submit() {
    setSubmitting(true);
    try {
      const res = await fetch('/api/diagnostic', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, stepsChosen: chosen }),
      });
      const data = await res.json();
      setResult(data);
      router.refresh();
    } finally { setSubmitting(false); }
  }

  if (result) {
    return (
      <div className="space-y-5 max-w-3xl">
        <Link href="/diagnostic" className="text-sm text-muted hover:text-text inline-flex items-center gap-1.5 anim-rise">
          <ArrowLeft className="w-3.5 h-3.5" /> Tous les scénarios
        </Link>

        <section className="result-hero anim-rise relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-50 blur-3xl"
            style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.14), transparent 70%)' }}
          />
          <div className="relative">
            <div className="module-eyebrow mb-2">Résultat</div>
            <div className="font-display text-7xl font-semibold tabular-nums">
              {result.score}<span className="text-2xl text-muted">/100</span>
            </div>
            <div className="text-muted mt-1">Score de diagnostic</div>
            <div className="mt-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-text/10 border border-text/30 text-sm">
              <Lightbulb className="w-3.5 h-3.5" />
              <span className="font-semibold tabular-nums">+{result.xpAwarded}</span>
              <span className="text-muted">XP gagnés</span>
            </div>
          </div>
        </section>

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="card-depth p-5 anim-rise anim-rise-1">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg grid place-items-center bg-text/10 border border-text/30">
                <CircleCheck className="w-4 h-4" />
              </span>
              Bonne approche
            </h3>
            <ul className="text-sm space-y-2 text-text-soft">
              {result.evaluation.good.map((s: string, i: number) => (
                <li key={i} className="flex items-start gap-2.5 p-2 rounded-lg bg-bg-elev/40">
                  <span className="font-mono text-[10px] text-muted mt-0.5 shrink-0 w-5 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-depth p-5 anim-rise anim-rise-2">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg grid place-items-center bg-bg-elev border border-border">
                <CircleAlert className="w-4 h-4" />
              </span>
              À améliorer
            </h3>
            <ul className="text-sm space-y-2 text-text-soft">
              {result.evaluation.missed.map((s: string, i: number) => (
                <li key={i} className="flex items-start gap-2.5 p-2 rounded-lg bg-bg-elev/40">
                  <span className="font-mono text-[10px] text-muted mt-0.5 shrink-0 w-5 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {result.evaluation.wrong.length > 0 && (
          <div className="card-depth p-5 anim-rise anim-rise-3">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg grid place-items-center bg-bg-elev border border-border">
                <CircleX className="w-4 h-4" />
              </span>
              Étapes inappropriées
            </h3>
            <ul className="text-sm space-y-2 text-text-soft">
              {result.evaluation.wrong.map((s: string, i: number) => (
                <li key={i} className="flex items-start gap-2.5 p-2 rounded-lg bg-bg-elev/40">
                  <span className="font-mono text-[10px] text-muted mt-0.5 shrink-0 w-5 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <section className="card-highlight anim-rise anim-rise-4">
          <div className="space-y-5">
            <div>
              <h3 className="font-display text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg grid place-items-center bg-text/10 border border-text/30">
                  <Settings className="w-4 h-4" />
                </span>
                Cause racine
              </h3>
              <p className="text-sm text-text-soft leading-relaxed">{rootCause}</p>
            </div>
            <div className="pt-5 border-t border-text/15">
              <h3 className="font-display text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg grid place-items-center bg-text/10 border border-text/30">
                  <Lightbulb className="w-4 h-4" />
                </span>
                Solution détaillée
              </h3>
              <p className="text-sm text-text-soft whitespace-pre-line leading-relaxed">{solution}</p>
            </div>
          </div>
        </section>

        <Link href="/diagnostic" className="btn-primary w-full justify-center py-3">
          Autre scénario
        </Link>
      </div>
    );
  }

  const usedSteps = steps.filter(s => chosen.includes(s.id));
  const availableSteps = steps.filter(s => !chosen.includes(s.id));
  // optionalAcceptable is parsed from the scenario for reference
  void optionalAcceptable;

  return (
    <div className="space-y-5 max-w-4xl">
      <Link href="/diagnostic" className="text-sm text-muted hover:text-text inline-flex items-center gap-1.5 anim-rise">
        <ArrowLeft className="w-3.5 h-3.5" /> Tous les scénarios
      </Link>

      {/* HERO */}
      <section className="module-hero">
        <div className="relative">
          <div className="module-eyebrow mb-2 flex items-center gap-2">
            <Wrench className="w-3.5 h-3.5" /> Scénario de diagnostic
          </div>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight">
            {title}
          </h1>

          <div className="mt-5 pt-5 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted mb-3 uppercase tracking-wider font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              Symptômes observés
            </div>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm">
              {symptoms.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-bg-elev/60 border border-border">
                  <span className="w-6 h-6 rounded-md grid place-items-center bg-bg-card border border-border text-[10px] font-mono text-muted shrink-0 mt-0.5 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-text-soft leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* TIMELINE : étapes choisies */}
      {usedSteps.length > 0 && (
        <section className="card-depth p-5 sm:p-6 anim-rise anim-rise-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <Activity className="w-4 h-4" /> Ta procédure
            </h2>
            <span className="badge-muted tabular-nums">{usedSteps.length} étape{usedSteps.length > 1 ? 's' : ''}</span>
          </div>
          <ol className="timeline">
            {usedSteps.map((s, i) => {
              const ideal = idealSequence.includes(s.id);
              return (
                <li key={s.id} className="timeline-item">
                  <div className={cn(
                    'p-3 rounded-xl border flex items-start gap-3 transition-all',
                    ideal
                      ? 'bg-text/8 border-text/30'
                      : 'bg-bg-elev/60 border-border'
                  )}>
                    <span className={cn(
                      'w-7 h-7 rounded-lg grid place-items-center font-mono text-xs shrink-0 border',
                      ideal
                        ? 'border-text/50 bg-text/15 text-text'
                        : 'border-border bg-bg-soft text-muted'
                    )}>{i + 1}</span>
                    <span className="flex-1 text-sm text-text leading-relaxed">{s.label}</span>
                    {ideal && (
                      <span className="text-[10px] uppercase tracking-wider text-muted px-1.5 py-0.5 rounded-full bg-bg-card border border-border">
                        Idéal
                      </span>
                    )}
                    <button
                      onClick={() => setChosen(c => c.filter(x => x !== s.id))}
                      className="text-xs text-muted hover:text-text transition-colors shrink-0"
                    >
                      retirer
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {/* ÉTAPES DISPONIBLES */}
      <section className="card-depth p-5 sm:p-6 anim-rise anim-rise-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title flex items-center gap-2">
            <ListChecks className="w-4 h-4" /> Étapes disponibles
          </h2>
          <span className="badge-muted tabular-nums">{availableSteps.length}</span>
        </div>
        <div className="choice-grid sm:gap-2.5" data-cols={availableSteps.length > 3 ? "2" : undefined}>
          {availableSteps.map(s => (
            <button
              key={s.id}
              onClick={() => setChosen(c => [...c, s.id])}
              className="option-card group"
            >
              <span className="w-7 h-7 rounded-lg grid place-items-center bg-bg-soft border border-border text-muted shrink-0 transition-all group-hover:border-text/50 group-hover:text-text">
                <Plus className="w-3.5 h-3.5" />
              </span>
              <span className="flex-1 leading-relaxed">{s.label}</span>
              <span className="text-faint text-xs shrink-0 transition-all group-hover:translate-x-0.5">ajouter →</span>
            </button>
          ))}
        </div>
      </section>

      <button
        onClick={submit}
        disabled={chosen.length === 0 || submitting}
        className="btn-primary w-full justify-center py-3"
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        Valider ma procédure
      </button>
    </div>
  );
}
