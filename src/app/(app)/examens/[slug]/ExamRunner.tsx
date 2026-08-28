'use client';
import { useEffect, useState, useRef } from 'react';
import { cn, formatDuration } from '@/lib/utils';
import { Loader2, ArrowRight, ArrowLeft, Clock, AlertTriangle, CircleCheck, CircleAlert, Sparkles, Target } from 'lucide-react';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className="card-depth p-6 sm:p-8 anim-rise relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-50 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.10), transparent 70%)' }}
        />
        <div className="relative">
          <div className="module-eyebrow mb-2">Consignes</div>
          <h2 className="font-display text-2xl font-semibold mb-3">Prépare-toi</h2>
          <p className="text-sm text-muted mb-5 leading-relaxed max-w-xl">
            Cet examen blanc simule les conditions réelles : chrono, mode examen sans retour en arrière après validation, score final.
          </p>
          <ul className="space-y-2.5 mb-7 max-w-xl">
            <Rule>Chronomètre de {Math.round(exam.durationSec / 60)} minutes, non pausible.</Rule>
            <Rule>Pas de retour en arrière après validation de chaque question (mode examen).</Rule>
            <Rule>Score supérieur ou égal à 70% = réussi.</Rule>
            <Rule>Tes réponses sont sauvegardées, tu peux les modifier avant de valider la question.</Rule>
          </ul>
          <button
            onClick={() => { startRef.current = Date.now(); setStarted(true); }}
            className="btn-primary py-3 px-6"
          >
            Démarrer l&apos;examen
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (result) {
    const pct = Math.round((result.score / result.total) * 100);
    const pass = pct >= result.passPercent;
    return (
      <div className="space-y-5">
        <section className={`result-hero anim-rise relative overflow-hidden ${pass ? 'border-text/40' : ''}`}>
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-60 blur-3xl"
            style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.14), transparent 70%)' }}
          />
          <div className="relative">
            <div className="module-eyebrow mb-2">Résultat</div>
            <div className="font-display text-7xl font-semibold tabular-nums">{pct}<span className="text-2xl text-muted">%</span></div>
            <div className={`font-semibold mt-2 text-lg ${pass ? 'text-text' : 'text-muted'}`}>
              {pass ? 'Réussi' : 'Échoué'}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-elev border border-border text-sm tabular-nums">
                <Target className="w-3.5 h-3.5" />
                {result.score}/{result.total} bonnes réponses
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-elev border border-border text-sm tabular-nums">
                <Clock className="w-3.5 h-3.5" />
                {formatDuration(result.timeSpent)}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-text/10 border border-text/30 text-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-semibold tabular-nums">+{result.xpAwarded}</span>
                <span className="text-muted">XP gagnés</span>
              </span>
            </div>
          </div>
        </section>

        {result.domainStats && (
          <section className="module-frame anim-rise anim-rise-1">
            <h2 className="section-title mb-4">Domaines</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="card-depth p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg grid place-items-center bg-text/10 border border-text/30">
                    <CircleCheck className="w-3.5 h-3.5" />
                  </span>
                  Domaines forts
                </h3>
                <ul className="space-y-1.5 text-sm">
                  {(result.strongDomains ?? []).map((d: { category: string; percent: number }) => (
                    <DomainRow key={d.category} category={d.category} percent={d.percent} positive />
                  ))}
                  {(result.strongDomains ?? []).length === 0 && (
                    <li className="text-xs text-muted py-2">Aucun domaine au-dessus de 80%.</li>
                  )}
                </ul>
              </div>
              <div className="card-depth p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg grid place-items-center bg-bg-elev border border-border">
                    <CircleAlert className="w-3.5 h-3.5" />
                  </span>
                  À travailler
                </h3>
                <ul className="space-y-1.5 text-sm">
                  {(result.weakDomains ?? []).map((d: { category: string; percent: number }) => (
                    <DomainRow key={d.category} category={d.category} percent={d.percent} />
                  ))}
                  {(result.weakDomains ?? []).length === 0 && (
                    <li className="text-xs text-muted py-2">Tous les domaines sont au-dessus de 50%.</li>
                  )}
                </ul>
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
      {/* Sticky progress + chrono */}
      <div className="sticky-stage -mx-6 sm:-mx-10 px-6 sm:px-10">
        <div className="flex items-center justify-between text-sm mb-2.5">
          <div className="flex items-center gap-3">
            <span className="text-text font-semibold tabular-nums">
              Question {index + 1}<span className="text-faint"> / {questions.length}</span>
            </span>
            <span className="hidden sm:inline text-xs text-muted">
              {Object.keys(answers).length} réponse{Object.keys(answers).length > 1 ? 's' : ''}
            </span>
          </div>
          <span className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-mono tabular-nums text-sm transition-all',
            critical
              ? 'bg-text/10 border-text/50 text-text animate-pulse'
              : 'bg-bg-elev border-border text-muted'
          )}>
            <Clock className="w-3.5 h-3.5" />
            {mins}:{String(secs).padStart(2, '0')}
          </span>
        </div>
        <div className="relative h-1.5 rounded-full bg-bg-elev overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-text transition-all duration-700 ease-smooth"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div key={index} className="card-depth p-5 sm:p-7 anim-rise relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-40 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.10), transparent 70%)' }}
        />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-muted uppercase tracking-wider">{q.category}</span>
              <span className="opacity-30 text-muted">·</span>
              <span className="font-mono text-[11px] text-muted uppercase tracking-wider">{q.difficulty}</span>
            </div>
            <span className="text-[10px] text-faint tabular-nums font-mono">
              {String(index + 1).padStart(2, '0')}/{String(questions.length).padStart(2, '0')}
            </span>
          </div>
          <h2 className="font-display text-lg sm:text-2xl font-semibold mb-6 leading-snug text-text">
            {q.prompt}
          </h2>
          <div className="space-y-2.5">
            {q.choices.map((c, i) => {
              const selected = answers[q.id] === c;
              return (
                <button
                  key={i}
                  onClick={() => setAnswers(a => ({ ...a, [q.id]: c }))}
                  className="option-card group"
                  data-state={selected ? 'selected' : undefined}
                >
                  <span className={cn(
                    'w-8 h-8 rounded-lg grid place-items-center font-mono text-xs shrink-0 border transition-all',
                    selected
                      ? 'border-text bg-text/15 text-text scale-105'
                      : 'border-border bg-bg-soft text-muted group-hover:border-text/50 group-hover:text-text'
                  )}>{String.fromCharCode(65 + i)}</span>
                  <span className="flex-1 leading-relaxed">{c}</span>
                </button>
              );
            })}
          </div>
          <div className="flex justify-between mt-6 gap-2">
            <button
              disabled={index === 0}
              onClick={() => setIndex(i => Math.max(0, i - 1))}
              className="btn-outline"
            >
              <ArrowLeft className="w-4 h-4" /> Précédente
            </button>
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
    </div>
  );
}

function Rule({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm text-text-soft">
      <span className="w-1.5 h-1.5 rounded-full bg-text/60 mt-2 shrink-0" />
      <span>{children}</span>
    </li>
  );
}

function DomainRow({ category, percent, positive }: { category: string; percent: number; positive?: boolean }) {
  return (
    <li className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-soft">{category}</span>
        <span className={`tabular-nums font-semibold ${positive ? 'text-text' : 'text-muted'}`}>{percent}%</span>
      </div>
      <div className="h-1 rounded-full bg-bg-elev overflow-hidden">
        <div className="h-full bg-text" style={{ width: `${percent}%` }} />
      </div>
    </li>
  );
}
