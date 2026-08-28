'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wrench, Send, Loader2, AlertTriangle, CircleCheck, CircleAlert, CircleX, Settings, Lightbulb, ArrowLeft } from 'lucide-react';
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
      <div className="space-y-4 max-w-3xl">
        <section className="result-hero anim-rise">
          <div className="module-eyebrow mb-2">Résultat</div>
          <div className="font-display text-6xl font-semibold tabular-nums">{result.score}<span className="text-2xl text-muted">/100</span></div>
          <div className="text-muted mt-1">Score de diagnostic</div>
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-elev border border-border text-sm">
            <span className="font-semibold">+{result.xpAwarded}</span><span className="text-muted">XP gagnés</span>
          </div>
        </section>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="module-frame anim-rise anim-rise-1">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><CircleCheck className="w-4 h-4" /> Bonne approche</h3>
            <ul className="text-sm space-y-1.5 text-muted">{result.evaluation.good.map((s: string, i: number) => <li key={i} className="flex items-start gap-2"><span className="text-muted">•</span>{s}</li>)}</ul>
          </div>
          <div className="module-frame anim-rise anim-rise-2">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><CircleAlert className="w-4 h-4" /> À améliorer</h3>
            <ul className="text-sm space-y-1.5 text-muted">{result.evaluation.missed.map((s: string, i: number) => <li key={i} className="flex items-start gap-2"><span className="text-muted">•</span>{s}</li>)}</ul>
          </div>
        </div>
        {result.evaluation.wrong.length > 0 && (
          <div className="module-frame anim-rise anim-rise-3">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><CircleX className="w-4 h-4" /> Étapes inappropriées</h3>
            <ul className="text-sm space-y-1.5 text-muted">{result.evaluation.wrong.map((s: string, i: number) => <li key={i} className="flex items-start gap-2"><span className="text-muted">•</span>{s}</li>)}</ul>
          </div>
        )}
        <section className="card-highlight anim-rise anim-rise-4">
          <h3 className="font-display text-lg font-semibold mb-2 flex items-center gap-2"><Settings className="w-4 h-4" /> Cause racine</h3>
          <p className="text-sm text-text-soft mb-5">{rootCause}</p>
          <h3 className="font-display text-lg font-semibold mb-2 flex items-center gap-2"><Lightbulb className="w-4 h-4" /> Solution détaillée</h3>
          <p className="text-sm text-text-soft whitespace-pre-line">{solution}</p>
        </section>
        <Link href="/diagnostic" className="btn-primary w-full justify-center">Autre scénario</Link>
      </div>
    );
  }

  const usedSteps = steps.filter(s => chosen.includes(s.id));
  const availableSteps = steps.filter(s => !chosen.includes(s.id));
  // optionalAcceptable is parsed from the scenario for reference
  void optionalAcceptable;

  return (
    <div className="space-y-5 max-w-4xl">
      <Link href="/diagnostic" className="text-sm text-muted hover:text-text inline-flex items-center gap-1 anim-rise">
        <ArrowLeft className="w-3.5 h-3.5" /> Tous les scénarios
      </Link>

      <section className="module-hero">
        <div className="module-eyebrow mb-2 flex items-center gap-2"><Wrench className="w-3.5 h-3.5" /> Scénario de diagnostic</div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h1>
        <div className="mt-5 pt-5 border-t border-border">
          <div className="text-xs text-muted mb-3 uppercase tracking-wider">Symptômes</div>
          <ul className="text-sm space-y-2.5">
            {symptoms.map((s, i) => <li key={i} className="flex items-start gap-2.5"><AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-text" />{s}</li>)}
          </ul>
        </div>
      </section>

      {usedSteps.length > 0 && (
        <section className="module-frame anim-rise anim-rise-1">
          <h2 className="section-title mb-3">Tes étapes ({usedSteps.length})</h2>
          <ol className="timeline">
            {usedSteps.map((s, i) => {
              const ideal = idealSequence.includes(s.id);
              return (
                <li key={s.id} className="timeline-item">
                  <div className={cn(
                    'p-3 rounded-xl border flex items-start gap-3',
                    ideal ? 'bg-text/8 border-text/30' : 'bg-bg-elev border-border',
                  )}>
                    <span className="font-mono text-sm text-muted w-6">{i + 1}.</span>
                    <span className="flex-1 text-sm">{s.label}</span>
                    <button onClick={() => setChosen(c => c.filter(x => x !== s.id))} className="text-xs text-muted hover:text-text transition-colors">retirer</button>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      <section className="module-frame anim-rise anim-rise-2">
        <h2 className="section-title mb-3">Étapes disponibles</h2>
        <div className="choice-grid sm:gap-2" data-cols={availableSteps.length > 3 ? "2" : undefined}>
          {availableSteps.map(s => (
            <button
              key={s.id}
              onClick={() => setChosen(c => [...c, s.id])}
              className="option-card"
            >
              <span className="flex-1">{s.label}</span>
              <span className="text-faint text-xs">ajouter →</span>
            </button>
          ))}
        </div>
      </section>

      <button
        onClick={submit}
        disabled={chosen.length === 0 || submitting}
        className="btn-primary w-full justify-center"
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        Valider ma procédure
      </button>
    </div>
  );
}
