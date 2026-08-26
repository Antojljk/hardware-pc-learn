'use client';
import { useEffect, useState, useRef } from 'react';
import { cn, formatDuration } from '@/lib/utils';
import { Loader2, ArrowRight, Clock, AlertTriangle } from 'lucide-react';

type Q = { id: string; type: string; category: string; difficulty: string; prompt: string; choices: string[]; explanation: string; answer: string | string[] };

export function ExamRunner({ exam, questions }: { exam: { slug: string; durationSec: number; title: string }; questions: Q[] }) {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(exam.durationSec);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
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
      <div className="card p-6">
        <h2 className="font-semibold mb-2">Consignes</h2>
        <ul className="text-sm text-text-soft space-y-1 mb-4 list-disc list-inside">
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
        <div className={`card p-6 text-center ${pass ? 'bg-gradient-to-br from-success/10 to-bg-elev' : 'bg-gradient-to-br from-danger/10 to-bg-elev'}`}>
          <div className="text-5xl font-bold mb-1">{pct}%</div>
          <div className={`font-semibold mb-2 ${pass ? 'text-success' : 'text-danger'}`}>{pass ? 'Réussi !' : 'Échoué'}</div>
          <div className="text-sm text-text-soft">{result.score}/{result.total} bonnes réponses · {formatDuration(result.timeSpent)} · +{result.xpAwarded} XP</div>
        </div>
        {result.domainStats && (
          <section className="card p-5">
            <h2 className="section-title mb-3">Domaines</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <h3 className="text-sm font-semibold text-success mb-2">🟢 Domaines forts</h3>
                <ul className="space-y-1 text-sm">{result.strongDomains.map((d: any) => <li key={d.category} className="flex justify-between"><span>{d.category}</span><span className="tabular-nums">{d.percent}%</span></li>)}</ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-warning mb-2">🔴 À travailler</h3>
                <ul className="space-y-1 text-sm">{result.weakDomains.map((d: any) => <li key={d.category} className="flex justify-between"><span>{d.category}</span><span className="tabular-nums">{d.percent}%</span></li>)}</ul>
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm sticky top-16 z-10 bg-bg/80 backdrop-blur py-2">
        <span>Question {index + 1}/{questions.length}</span>
        <span className={cn('badge font-mono tabular-nums', timeLeft < 60 ? 'bg-danger/15 text-danger border-danger/30 animate-pulse' : 'bg-bg-elev border-border')}>
          <Clock className="w-3 h-3" />{mins}:{String(secs).padStart(2, '0')}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-bg-elev overflow-hidden">
        <div className="h-full bg-gradient-to-r from-brand-blue to-brand-violet" style={{ width: `${progress}%` }} />
      </div>

      <div className="card p-6">
        <div className="text-xs text-text-mute mb-2">{q.category}</div>
        <h2 className="text-lg font-medium mb-5">{q.prompt}</h2>
        <div className="space-y-2">
          {q.choices.map((c, i) => (
            <button
              key={i}
              onClick={() => setAnswers(a => ({ ...a, [q.id]: c }))}
              className={cn(
                'w-full text-left p-4 rounded-lg border transition',
                answers[q.id] === c ? 'border-brand-blue bg-brand-blue/10' : 'border-border bg-bg-elev hover:border-brand-blue/40',
              )}
            >
              <span className="font-mono mr-2 text-text-mute">{String.fromCharCode(65 + i)}.</span>{c}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-4">
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
