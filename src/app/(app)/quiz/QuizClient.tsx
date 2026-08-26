'use client';
import { useEffect, useState, useCallback } from 'react';
import { Loader2, ArrowRight, CheckCircle2, XCircle, Sparkles, RefreshCw } from 'lucide-react';
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

  if (loading) return <div className="card p-10 grid place-items-center"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  if (done && finalResult) {
    return (
      <div className="space-y-4">
        <div className="card p-6 text-center bg-gradient-to-br from-bg-card to-bg-elev">
          <div className="text-5xl font-bold bg-gradient-to-r from-brand-blue to-brand-violet bg-clip-text text-transparent">{finalResult.score}/{finalResult.total}</div>
          <div className="text-text-soft mt-1">{Math.round((finalResult.score/finalResult.total)*100)}% de réussite</div>
          <div className="text-sm text-brand-blue mt-2">+{finalResult.xpAwarded} XP gagnés</div>
        </div>
        {finalResult.newBadges?.length > 0 && (
          <div className="card p-4 border-warning/30 bg-warning/5 text-sm">
            🎉 Nouveau(x) badge(s) : {finalResult.newBadges.join(', ')}
          </div>
        )}
        {finalResult.reviews?.length > 0 && (
          <section className="card p-5">
            <h2 className="section-title mb-3">Révision des erreurs</h2>
            <ul className="space-y-4">
              {finalResult.reviews.map(r => (
                <li key={r.questionId} className="p-4 rounded-lg bg-bg-elev border border-border">
                  <div className="font-medium mb-2">{r.prompt}</div>
                  <div className="text-sm text-text-soft mb-2"><strong className="text-danger">Ta réponse :</strong> {String(r.yourAnswer)}</div>
                  <div className="text-sm text-text-soft mb-2"><strong className="text-success">Bonne réponse :</strong> {String(r.correctAnswer)}</div>
                  <div className="text-sm bg-bg-card p-3 rounded mt-2"><strong>Pourquoi :</strong> {r.explanation}</div>
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
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-mute">Question {index + 1}/{questions.length}</span>
        <span className="badge bg-bg-elev border-border">{q.difficulty}</span>
      </div>
      <div className="h-1.5 rounded-full bg-bg-elev overflow-hidden">
        <div className="h-full bg-gradient-to-r from-brand-blue to-brand-violet transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="card p-6">
        <div className="text-xs text-text-mute mb-2">{q.category}</div>
        <h2 className="text-lg font-medium mb-5">{q.prompt}</h2>
        <div className="space-y-2">
          {q.choices.map((c, i) => {
            const isChosen = chosen === c;
            const isCorrectAnswer = feedback && String(feedback.correctAnswer) === c;
            return (
              <button
                key={i}
                disabled={!!feedback}
                onClick={() => setChosen(c)}
                className={cn(
                  'w-full text-left p-4 rounded-lg border transition',
                  !feedback && isChosen ? 'border-brand-blue bg-brand-blue/10' : 'border-border bg-bg-elev hover:border-brand-blue/40',
                  feedback && isCorrectAnswer ? 'border-success bg-success/10' : '',
                  feedback && isChosen && !isCorrectAnswer ? 'border-danger bg-danger/10' : '',
                )}
              >
                <span className="font-mono mr-2 text-text-mute">{String.fromCharCode(65 + i)}.</span>{c}
              </button>
            );
          })}
        </div>

        {feedback ? (
          <div className="mt-4">
            <div className={cn('p-4 rounded-lg border', feedback.correct ? 'bg-success/10 border-success/30' : 'bg-danger/10 border-danger/30')}>
              <div className="flex items-center gap-2 font-semibold mb-1">
                {feedback.correct ? <CheckCircle2 className="w-4 h-4 text-success" /> : <XCircle className="w-4 h-4 text-danger" />}
                {feedback.correct ? `Bonne réponse ! +${feedback.xpGained} XP` : 'Réponse incorrecte'}
              </div>
              <div className="text-sm">{feedback.explanation}</div>
            </div>
            <button onClick={next} className="btn-primary w-full mt-3 justify-center">
              {index + 1 >= questions.length ? 'Voir mes résultats' : 'Question suivante'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button onClick={submit} disabled={!chosen} className="btn-primary w-full mt-4 justify-center">
            Valider
          </button>
        )}
      </div>
    </div>
  );
}
