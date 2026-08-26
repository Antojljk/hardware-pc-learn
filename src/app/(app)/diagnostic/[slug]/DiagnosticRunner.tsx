'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wrench, Send, Loader2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type Step = { id: string; label: string; type: string; category: string };

export function DiagnosticRunner({
  slug, title, symptoms, steps, idealSequence, optionalAcceptable, wrongMoves, rootCause, solution,
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
        <div className="card p-6 text-center bg-gradient-to-br from-bg-card to-bg-elev">
          <div className="text-5xl font-bold bg-gradient-to-r from-brand-blue to-brand-violet bg-clip-text text-transparent">{result.score}/100</div>
          <div className="text-text-soft mt-1">Score de diagnostic</div>
          <div className="text-sm text-brand-blue mt-2">+{result.xpAwarded} XP</div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card p-5">
            <h3 className="font-semibold text-success mb-3">🟢 Bonne approche</h3>
            <ul className="text-sm space-y-1">{result.evaluation.good.map((s: string, i: number) => <li key={i}>• {s}</li>)}</ul>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold text-warning mb-3">🟡 À améliorer</h3>
            <ul className="text-sm space-y-1">{result.evaluation.missed.map((s: string, i: number) => <li key={i}>• {s}</li>)}</ul>
          </div>
        </div>
        {result.evaluation.wrong.length > 0 && (
          <div className="card p-5 border-danger/30 bg-danger/5">
            <h3 className="font-semibold text-danger mb-3">❌ Étapes inappropriées</h3>
            <ul className="text-sm space-y-1">{result.evaluation.wrong.map((s: string, i: number) => <li key={i}>• {s}</li>)}</ul>
          </div>
        )}
        <section className="card p-5 bg-gradient-to-br from-bg-card to-bg-elev">
          <h3 className="font-semibold mb-2">🔧 Cause racine</h3>
          <p className="text-sm text-text-soft mb-3">{rootCause}</p>
          <h3 className="font-semibold mb-2">💡 Solution détaillée</h3>
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
      <Link href="/diagnostic" className="text-sm text-text-soft hover:text-text inline-flex items-center gap-1">← Tous les scénarios</Link>

      <header className="card p-5 bg-gradient-to-br from-bg-card to-bg-elev">
        <h1 className="text-xl font-bold mb-2 flex items-center gap-2"><Wrench className="w-5 h-5 text-brand-blue" /> {title}</h1>
        <div className="text-xs text-text-mute mb-2 uppercase tracking-wider">Symptômes</div>
        <ul className="text-sm space-y-1">
          {symptoms.map((s, i) => <li key={i} className="flex items-start gap-2"><AlertTriangle className="w-3.5 h-3.5 text-warning mt-0.5" />{s}</li>)}
        </ul>
      </header>

      {usedSteps.length > 0 && (
        <section className="card p-5">
          <h2 className="section-title mb-3">Tes étapes ({usedSteps.length})</h2>
          <ol className="space-y-2">
            {usedSteps.map((s, i) => {
              const ideal = idealSequence.includes(s.id);
              const wrong = wrongMoves.includes(s.id);
              return (
                <li key={s.id} className={cn('p-3 rounded-lg border flex items-start gap-3',
                  ideal ? 'bg-success/5 border-success/30' : wrong ? 'bg-danger/5 border-danger/30' : 'bg-bg-elev border-border',
                )}>
                  <span className="font-mono text-sm text-text-mute w-6">{i + 1}.</span>
                  <span className="flex-1 text-sm">{s.label}</span>
                  <div className="flex gap-1">
                    <button onClick={() => setChosen(c => c.filter(x => x !== s.id))} className="text-xs text-text-mute hover:text-danger">retirer</button>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      <section className="card p-5">
        <h2 className="section-title mb-3">Étapes disponibles</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {availableSteps.map(s => (
            <button
              key={s.id}
              onClick={() => setChosen(c => [...c, s.id])}
              className="text-left p-3 rounded-lg bg-bg-elev border border-border hover:border-brand-blue/40 transition text-sm"
            >
              {s.label}
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
