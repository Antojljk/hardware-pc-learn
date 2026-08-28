'use client';
import { useEffect, useState, useRef } from 'react';
import { cn, formatDuration } from '@/lib/utils';
import { Loader2, ArrowRight, Clock, AlertTriangle, CircleCheck, CircleAlert } from 'lucide-react';

type Q = { id: string; type: string; category: string; difficulty: string; prompt: string; choices: string[]; explanation: string; answer: string | string[] };

export function ExamRunner({ exam, questions }: { exam: { slug: string; durationSec: number; title: string }; questions: Q[] }) {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(exam.durationSec);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number; timeSpent: number; xpAwarded: number; passPercent: number; domainStats?: boolean; strongDomains?: { category: string; percent: number }[]; weakDomains?: { category: string; percent: number }[] } | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (!started || result) return;
    const tick = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(tick);
  }, [started, result]);

  useEffect(() => {
    if (started && timeLeft === 0 && !result) {
      submit();
    }
  }, [timeLeft, started, result]);

  async function submit() {
    if (submitting || result) return;
    setSubmitting(true);
    const elapsed = Math.round((Date.now() - startRef.current) / 1000);
    const res = await fetch('/api/examens', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ examSlug: exam.slug, answers, timeSpent: elapsed }),
    });
    setResult(await res.json());
    setSubmitting(false);
  }

  if (!started) {
    return (
      <div className="module-frame anim-rise">
        <div className="module-eyebrow mb-2">Consignes</div>
        <h2 className="font-display text-lg font-semibold mb-3">Prépare-toi</h2>
        <ul className="text-sm text-muted space-y-2 mb-6 list-disc list-inside marker:text-muted">
          <li>Chronomètre de {Math.round(exam.durationSec/60)} minutes, non pausible.</li>
          <li>Pas de retour en arrière après validation de chaque question (mode examen).</li>
          <li>Score &ge; 70% = réussi.</li>
        </ul>
        <button onClick={() => { startRef.current = Date.now(); setStarted(true); }} className="btn-primary">
          Démarrer l&apos;examen
        </button>
      </div>
    );
  }

  if (result) {
    const pct = Math.round((result.score / result.total) * 100);
    const pass = pct >= result.passPercent;
    return (
      <div className="space-y-4">
        <section className={`result-hero anim-rise ${pass ? 'border-text/40' : ''}`}>
          <div className="module-eyebrow mb-2">Résultat</div>
          <div className="font-display text-6xl font-semibold tabular-nums">{pct}<span className="text-2xl text-muted">%</span></div>
          <div className={`font-semibold mt-1 ${pass ? 'text-text' : 'text-muted'}`}>{pass ? 'Réussi' : 'Échoué'}</div>
          <div className="text-sm text-muted mt-2">{result.score}/{result.total} bonnes réponses · {formatDuration(result.timeSpent)} · +{result.xpAwarded} XP</div>
        </section>
        {result.domainStats && (
          <section className="module-frame anim-rise anim-rise-1">
            <h2 className="section-title mb-4">Domaines</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><CircleCheck className="w-4 h-4" /> Domaines forts</h3>
                <ul className="space-y-1 text-sm">{(result.strongDomains ?? []).map((d: { category: string; percent: number }) => <li key={d.category} className="flex justify-between py-1.5 border-b border-border last:border-0"><span className="text-muted">{d.category}</span><span className="tabular-nums font-semibold">{d.percent}%</span></li>)}</ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><CircleAlert className="w-4 h-4" /> À travailler</h3>
                <ul className="space-y-1 text-sm">{(result.weakDomains ?? []).map((d: { category: string; percent: number }) => <li key={d.category} className="flex justify-between py-1.5 border-b border-border last:border-0"><span className="text-muted">{d.category}</span><span className="tabular-nums font-semibold">{d.percent}%</span></li>)}</ul>
              </div>
            </div>
          </section>
        )}
      </div>
    );
  }

  const q = questions[index];
  const progress = ((index) / questions.length) * 100;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const critical = timeLeft < 60;

  return (
    <div className="space-y-4">
      <div className="sticky-stage -mx-6 sm:-mx-10 px-6 sm:px-10 flex items-center justify-between text-sm">
        <span className="text-muted tabular-nums">Question {index + 1}<span className="text-faint"> / {questions.length}</span></span>
        <span className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-mono tabular-nums',
          critical
            ? 'bg-text/10 border-text/50 animate-pulse text-text'
            : 'bg-bg-elev border-border text-muted'
        )}>
          <Clock className="w-3 h-3" />{mins}:{String(secs).padStart(2, '0')}
        </span>
      </div>
      <div className="h-1 rounded-full bg-bg-elev overflow-hidden">
        <div className="h-full bg-text transition-all duration-500 ease-smooth" style={{ width: `${progress}%` }} />
      </div>

      <div key={index} className="question-card anim-rise">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-muted uppercase tracking-wider">{q.category}</div>
          <span className="text-[10px] text-faint tabular-nums">{index + 1}/{questions.length}</span>
        </div>
        <h2 className="font-display text-lg sm:text-xl font-semibold mb-5 leading-snug">{q.prompt}</h2>
        <div className="space-y-2">
          {q.choices.map((c, i) => {
            const selected = answers[q.id] === c;
            return (
              <button
                key={i}
                onClick={() => setAnswers(a => ({ ...a, [q.id]: c }))}
                className="option-card"
                data-state={selected ? 'selected' : undefined}
              >
                <span className={cn(
                  'w-7 h-7 rounded-lg grid place-items-center font-mono text-xs shrink-0 border transition-colors',
                  selected ? 'border-text/50 bg-text/10 text-text' : 'border-border bg-bg-soft text-muted'
                )}>{String.fromCharCode(65 + i)}</span>
                <span className="flex-1">{c}</span>
              </button>
            );
          })}
        </div>
        <div className="flex justify-between mt-5 gap-2">
          <button
            disabled={index === 0}
            onClick={() => setIndex(i => Math.max(0, i - 1))}
            className="btn-outline"
          >← Précédente</button>
          {index + 1 >= questions.length ? (
            <button onClick={submit} disabled={submitting} className="btn-primary">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
              Terminer l&apos;examen
            </button>
          ) : (
            <button onClick={() => setIndex(i => i + 1)} className="btn-primary">
              Suivante <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
