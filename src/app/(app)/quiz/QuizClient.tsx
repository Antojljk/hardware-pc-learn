'use client';
import { useEffect, useState, useCallback } from 'react';
import { Loader2, ArrowRight, CheckCircle2, XCircle, RefreshCw, PartyPopper } from 'lucide-react';
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

  if (loading) return <div className="module-frame grid place-items-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  if (done && finalResult) {
    const pct = Math.round((finalResult.score / finalResult.total) * 100);
    return (
      <div className="space-y-4">
        <section className="result-hero anim-rise">
          <div className="module-eyebrow mb-2">Résultat</div>
          <div className="font-display text-6xl font-semibold tabular-nums">{finalResult.score}<span className="text-2xl text-muted">/{finalResult.total}</span></div>
          <div className="text-muted mt-1">{pct}% de réussite</div>
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-elev border border-border text-sm">
            <span className="font-semibold">+{finalResult.xpAwarded}</span><span className="text-muted">XP gagnés</span>
          </div>
        </section>
        {finalResult.newBadges?.length > 0 && (
          <div className="module-frame flex items-center gap-3 anim-rise anim-rise-1">
            <div className="w-9 h-9 rounded-xl grid place-items-center bg-bg-elev border border-border">
              <PartyPopper className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="text-sm">
              <div className="font-medium">Nouveau(x) badge(s)</div>
              <div className="text-muted">{finalResult.newBadges.join(', ')}</div>
            </div>
          </div>
        )}
        {finalResult.reviews?.length > 0 && (
          <section className="module-frame anim-rise anim-rise-2">
            <h2 className="section-title mb-4">Révision des erreurs</h2>
            <ul className="space-y-3">
              {finalResult.reviews.map(r => (
                <li key={r.questionId} className="p-4 rounded-2xl bg-bg-elev border border-border">
                  <div className="font-medium mb-2">{r.prompt}</div>
                  <div className="text-sm text-muted mb-1"><strong className="text-text">Ta réponse :</strong> {String(r.yourAnswer)}</div>
                  <div className="text-sm text-muted mb-2"><strong className="text-text">Bonne réponse :</strong> {String(r.correctAnswer)}</div>
                  <div className="text-sm bg-bg-card p-3 rounded-xl border border-border mt-2"><strong className="text-text">Pourquoi :</strong> {r.explanation}</div>
                </li>
              ))}
            </ul>
          </section>
        )}
        <button onClick={load} className="btn-primary w-full justify-center"><RefreshCw className="w-4 h-4" /> Nouveau quiz</button>
      </div>
    );
  }

  const q = questions[index];
  const progress = ((index + (feedback ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="space-y-4">
      <div className="sticky-stage -mx-6 sm:-mx-10 px-6 sm:px-10">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted tabular-nums">Question {index + 1}<span className="text-faint"> / {questions.length}</span></span>
          <span className="badge-muted">{q.difficulty}</span>
        </div>
        <div className="h-1 rounded-full bg-bg-elev overflow-hidden">
          <div className="h-full bg-text transition-all duration-500 ease-smooth" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div key={index} className="question-card anim-rise">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-muted uppercase tracking-wider">{q.category}</div>
          <span className="text-[10px] text-faint tabular-nums">{index + 1}/{questions.length}</span>
        </div>
        <h2 className="font-display text-lg sm:text-xl font-semibold mb-5 leading-snug">{q.prompt}</h2>
        <div className="space-y-2">
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
                className="option-card"
                data-state={state === 'idle' ? undefined : state}
              >
                <span className={cn(
                  'w-7 h-7 rounded-lg grid place-items-center font-mono text-xs shrink-0 border transition-colors',
                  isChosen ? 'border-text/50 bg-text/10 text-text' : 'border-border bg-bg-soft text-muted',
                  state === 'correct' && 'border-text bg-text/15 text-text',
                  state === 'wrong' && 'border-text/30 bg-text/5 text-text-soft',
                )}>{String.fromCharCode(65 + i)}</span>
                <span className="flex-1">{c}</span>
              </button>
            );
          })}
        </div>

        {feedback ? (
          <div className="mt-5 space-y-3 anim-rise">
            <div className={cn(
              'p-4 rounded-2xl border',
              feedback.correct
                ? 'bg-text/10 border-text/40'
                : 'bg-bg-elev border-border'
            )}>
              <div className="flex items-center gap-2 font-semibold mb-1">
                {feedback.correct ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {feedback.correct ? `Bonne réponse ! +${feedback.xpGained} XP` : 'Réponse incorrecte'}
              </div>
              <div className="text-sm text-muted">{feedback.explanation}</div>
            </div>
            <button onClick={next} className="btn-primary w-full justify-center">
              {index + 1 >= questions.length ? 'Voir mes résultats' : 'Question suivante'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button onClick={submit} disabled={!chosen} className="btn-primary w-full mt-5 justify-center">
            Valider ma réponse
          </button>
        )}
      </div>
    </div>
  );
}
