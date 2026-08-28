'use client';
import { useEffect, useState, useCallback } from 'react';
import { Loader2, ArrowRight, CheckCircle2, XCircle, RefreshCw, PartyPopper, Sparkles, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

type Q = { id: string; type: string; category: string; difficulty: string; prompt: string; choices: string[]; xpReward: number };

export function QuizClient({ initialCategory, mode }: { initialCategory?: string; mode: 'free' | 'adaptive' }) {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Q[]>([]);
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation: string; correctAnswer: string; xpGained: number } | null>(null);
  const [results, setResults] = useState<{ questionId: string; chosen: string; correct: boolean; category: string }[]>([]);
  const [done, setDone] = useState(false);
  const [finalResult, setFinalResult] = useState<{ score: number; total: number; xpAwarded: number; newBadges: string[]; reviews: { questionId: string; prompt: string; explanation: string; correctAnswer: string; yourAnswer: string }[] } | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setDone(false); setIndex(0); setChosen(null); setFeedback(null); setResults([]); setFinalResult(null);
    const url = new URL('/api/quiz', window.location.origin);
    if (mode === 'adaptive') url.searchParams.set('mode', 'adaptive');
    if (initialCategory) url.searchParams.set('category', initialCategory);
    url.searchParams.set('count', '10');
    const res = await fetch(url);
    const data = await res.json();
    setQuestions(data.questions);
    setLoading(false);
  }, [mode, initialCategory]);

  useEffect(() => { load(); }, [load]);

  async function submit() {
    if (!chosen || feedback) return;
    const q = questions[index];
    const res = await fetch('/api/quiz', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId: q.id, answer: chosen }),
    });
    const data = await res.json();
    setFeedback(data);
    setResults(r => [...r, { questionId: q.id, chosen, correct: data.correct, category: q.category }]);
  }

  async function next() {
    if (index + 1 >= questions.length) {
      // Submit final
      const res = await fetch('/api/quiz/attempt', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, category: initialCategory, details: results }),
      });
      const data = await res.json();
      setFinalResult(data);
      setDone(true);
    } else {
      setIndex(i => i + 1); setChosen(null); setFeedback(null);
    }
  }

  if (loading) {
    return (
      <div className="card-depth p-8 sm:p-12 grid place-items-center anim-rise">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-7 h-7 animate-spin text-text" />
          <div className="text-sm text-muted">Préparation des questions…</div>
        </div>
      </div>
    );
  }

  if (done && finalResult) {
    const pct = Math.round((finalResult.score / finalResult.total) * 100);
    const correctCount = finalResult.reviews ? finalResult.total - finalResult.reviews.length : finalResult.score;

    return (
      <div className="space-y-5">
        <section className="result-hero anim-rise overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-50 blur-3xl"
            style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.14), transparent 70%)' }}
          />
          <div className="relative">
            <div className="module-eyebrow mb-2">Résultat</div>
            <div className="font-display text-6xl sm:text-7xl font-semibold tabular-nums">
              {finalResult.score}
              <span className="text-2xl text-muted">/{finalResult.total}</span>
            </div>
            <div className="text-muted mt-1 tabular-nums">{pct}% de réussite</div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-elev border border-border text-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-semibold tabular-nums">+{finalResult.xpAwarded}</span>
                <span className="text-muted">XP gagnés</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-elev border border-border text-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="font-semibold tabular-nums">{correctCount}</span>
                <span className="text-muted">bonnes réponses</span>
              </span>
            </div>
          </div>
        </section>

        {finalResult.newBadges?.length > 0 && (
          <div className="module-frame flex items-center gap-3 anim-rise anim-rise-1 border-text/30">
            <div className="w-10 h-10 rounded-xl grid place-items-center bg-text/10 border border-text/30">
              <PartyPopper className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="text-sm">
              <div className="font-semibold">Nouveau(x) badge(s)</div>
              <div className="text-muted">{finalResult.newBadges.join(', ')}</div>
            </div>
          </div>
        )}

        {finalResult.reviews?.length > 0 && (
          <section className="module-frame anim-rise anim-rise-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Révision des erreurs</h2>
              <span className="badge-muted tabular-nums">{finalResult.reviews.length}</span>
            </div>
            <ul className="space-y-3">
              {finalResult.reviews.map((r, i) => (
                <li key={r.questionId} className="p-4 rounded-2xl bg-bg-elev/60 border border-border">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="font-mono text-[11px] text-muted mt-0.5 shrink-0 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="font-medium text-[15px] leading-snug">{r.prompt}</div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2 text-sm ml-7">
                    <div className="p-2.5 rounded-xl bg-bg-card border border-border">
                      <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Ta réponse</div>
                      <div className="text-text-soft">{String(r.yourAnswer)}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-text/8 border border-text/30">
                      <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Bonne réponse</div>
                      <div className="text-text font-medium">{String(r.correctAnswer)}</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted mt-3 ml-7 p-3 rounded-xl bg-bg-card border border-border leading-relaxed">
                    <strong className="text-text">Pourquoi : </strong>{r.explanation}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <button onClick={load} className="btn-primary w-full justify-center py-3">
          <RefreshCw className="w-4 h-4" /> Nouveau quiz
        </button>
      </div>
    );
  }

  const q = questions[index];
  const progress = ((index + (feedback ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="space-y-4">
      {/* Sticky progress stage */}
      <div className="sticky-stage -mx-6 sm:-mx-10 px-6 sm:px-10">
        <div className="flex items-center justify-between text-sm mb-2.5">
          <div className="flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-muted" />
            <span className="text-text font-semibold tabular-nums">Question {index + 1}</span>
            <span className="text-faint">/ {questions.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge-muted uppercase">{q.difficulty}</span>
            <span className="badge-muted">{q.category}</span>
          </div>
        </div>
        <div className="relative h-1.5 rounded-full bg-bg-elev overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-text transition-all duration-700 ease-smooth"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card immersive */}
      <div key={index} className="card-depth p-5 sm:p-7 anim-rise relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-40 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.10), transparent 70%)' }}
        />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-muted uppercase tracking-wider">
                {q.category}
              </span>
              <span className="opacity-30 text-muted">·</span>
              <span className="font-mono text-[11px] text-muted uppercase tracking-wider">
                {q.type}
              </span>
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
              const isChosen = chosen === c;
              const isCorrectAnswer = feedback && String(feedback.correctAnswer) === c;
              const state = feedback
                ? (isCorrectAnswer ? 'correct' : (isChosen ? 'wrong' : 'idle'))
                : (isChosen ? 'selected' : 'idle');
              return (
                <button
                  key={i}
                  disabled={!!feedback}
                  onClick={() => setChosen(c)}
                  className="option-card group"
                  data-state={state === 'idle' ? undefined : state}
                >
                  <span className={cn(
                    'w-8 h-8 rounded-lg grid place-items-center font-mono text-xs shrink-0 border transition-all',
                    isChosen
                      ? 'border-text bg-text/15 text-text scale-105'
                      : 'border-border bg-bg-soft text-muted group-hover:border-text/50 group-hover:text-text',
                    state === 'correct' && 'border-text bg-text/15 text-text',
                    state === 'wrong' && 'border-text/30 bg-text/5 text-text-soft',
                  )}>{String.fromCharCode(65 + i)}</span>
                  <span className="flex-1 leading-relaxed">{c}</span>
                  {state === 'correct' && <CheckCircle2 className="w-4 h-4 text-text" />}
                  {state === 'wrong' && <XCircle className="w-4 h-4 text-muted" />}
                </button>
              );
            })}
          </div>

          {feedback ? (
            <div className="mt-6 space-y-3 anim-rise">
              <div className={cn(
                'p-4 rounded-2xl border',
                feedback.correct
                  ? 'bg-text/10 border-text/40'
                  : 'bg-bg-elev border-border'
              )}>
                <div className="flex items-center gap-2 font-semibold mb-1.5">
                  {feedback.correct ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {feedback.correct ? `Bonne réponse ! +${feedback.xpGained} XP` : 'Réponse incorrecte'}
                </div>
                <div className="text-sm text-muted leading-relaxed">{feedback.explanation}</div>
              </div>
              <button onClick={next} className="btn-primary w-full justify-center py-3">
                {index + 1 >= questions.length ? 'Voir mes résultats' : 'Question suivante'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={submit}
              disabled={!chosen}
              className="btn-primary w-full mt-6 justify-center py-3"
            >
              Valider ma réponse
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
