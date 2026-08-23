'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { INTERVIEW_QUESTIONS, pickInterviewQuestions, evaluateAnswer } from '@/lib/interview';
import { ArrowRight, Loader2, Send, CheckCircle2, MessageSquareQuote } from 'lucide-react';
import Link from 'next/link';

export function InterviewRunner({ role, level }: { role: string; level: string }) {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [questions] = useState(() => pickInterviewQuestions(role, level, 5));
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [currentEval, setCurrentEval] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [finalResult, setFinalResult] = useState<any>(null);

  async function submitAnswer() {
    if (!answer.trim()) return;
    const q = questions[index];
    const evalRes = evaluateAnswer(q, answer);
    setCurrentEval({ ...evalRes, questionId: q.id, question: q.question, idealAnswer: q.idealAnswer });
  }

  async function nextQuestion() {
    const newEvals = [...evaluations, currentEval];
    setEvaluations(newEvals);

    if (index + 1 >= questions.length) {
      setSubmitting(true);
      try {
        const res = await fetch('/api/interviews', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role, level,
            transcript: newEvals.map(e => ({ questionId: e.questionId, answer, evaluation: { score: e.score, matched: e.matched, missing: e.missing } })),
          }),
        });
        const data = await res.json();
        setFinalResult(data);
        router.refresh();
      } finally { setSubmitting(false); }
    } else {
      setIndex(i => i + 1);
      setAnswer('');
      setCurrentEval(null);
    }
  }

  if (finalResult) {
    const strengths = finalResult.feedback?.strengths || [];
    const improvements = finalResult.feedback?.improvements || [];
    return (
      <div className="space-y-4 max-w-3xl">
        <div className="card p-6 text-center bg-gradient-to-br from-bg-card to-bg-elev">
          <div className="text-5xl font-bold bg-gradient-to-r from-brand-blue to-brand-violet bg-clip-text text-transparent">{finalResult.score}/100</div>
          <div className="text-text-soft mt-1">Score global</div>
          <div className="text-sm text-brand-blue mt-2">+{finalResult.xpAwarded} XP</div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card p-5">
            <h3 className="font-semibold text-success mb-3">� Points forts</h3>
            <ul className="space-y-1 text-sm">{strengths.map((s: string, i: number) => <li key={i}>• {s}</li>)}</ul>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold text-warning mb-3">� À améliorer</h3>
            <ul className="space-y-1 text-sm">{improvements.map((s: string, i: number) => <li key={i}>• {s}</li>)}</ul>
          </div>
        </div>
        <section className="card p-5">
          <h3 className="font-semibold mb-3">Réponses idéales</h3>
          <ul className="space-y-4">
            {finalResult.transcript?.map((t: any, i: number) => (
              <li key={i} className="p-3 rounded-lg bg-bg-elev border border-border">
                <div className="text-xs text-text-mute mb-1">Question {i + 1}</div>
                <div className="font-medium mb-2">{t.question || questions[i].question}</div>
                <div className="text-sm text-text-soft whitespace-pre-line">{questions[i].idealAnswer}</div>
              </li>
            ))}
          </ul>
        </section>
        <Link href="/entretiens" className="btn-primary w-full justify-center">Retour aux entretiens</Link>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="card p-6 max-w-2xl mx-auto">
        <h1 className="text-xl font-bold mb-1 flex items-center gap-2"><MessageSquareQuote className="w-5 h-5 text-brand-blue" /> Simulation d&apos;entretien</h1>
        <div className="text-sm text-text-soft mb-4">Poste : <strong className="capitalize">{role}</strong> · Niveau : <strong className="capitalize">{level}</strong></div>
        <p className="text-sm text-text-soft mb-4">
          Un recruteur te posera <strong>{questions.length} questions</strong>. Réponds par écrit avec précision et structure.
          À la fin : score global, points forts, à améliorer, réponses idéales.
        </p>
        <p className="text-xs text-text-mute mb-4 bg-bg-elev p-3 rounded border border-border">
          � Il s&apos;agit d&apos;une simulation inspirée du secteur. Aucune question ne provient d&apos;un processus de recrutement réel.
        </p>
        <button onClick={() => setStarted(true)} className="btn-primary">Commencer l&apos;entretien</button>
      </div>
    );
  }

  const q = questions[index];
  const progress = ((index) / questions.length) * 100;

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center gap-2 text-sm text-text-mute">
        <span>Question {index + 1}/{questions.length}</span>
        <span>·</span>
        <span className="capitalize">{role}</span>
        <span>·</span>
        <span className="capitalize">{level}</span>
      </div>
      <div className="h-1.5 rounded-full bg-bg-elev overflow-hidden">
        <div className="h-full bg-gradient-to-r from-brand-blue to-brand-violet" style={{ width: `${progress}%` }} />
      </div>

      <div className="card p-6">
        <div className="text-xs text-text-mute mb-1">Recruteur</div>
        <h2 className="text-lg font-medium mb-4">{q.question}</h2>
        {!currentEval ? (
          <>
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              className="input min-h-[160px] resize-y"
              placeholder="Ta réponse…"
            />
            <div className="text-xs text-text-mute mt-2">{answer.trim().split(/\s+/).filter(Boolean).length} mots</div>
            <button onClick={submitAnswer} disabled={!answer.trim()} className="btn-primary mt-3 w-full justify-center">
              <Send className="w-4 h-4" /> Soumettre
            </button>
          </>
        ) : (
          <div className="space-y-3">
            <div className={`p-4 rounded-lg border ${currentEval.score >= 70 ? 'bg-success/10 border-success/30' : currentEval.score >= 40 ? 'bg-warning/10 border-warning/30' : 'bg-danger/10 border-danger/30'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">Score : {currentEval.score}/100</div>
                <span className="text-sm text-text-soft">{currentEval.feedback}</span>
              </div>
              <div className="text-sm mb-2"><strong>Mots-clés trouvés :</strong> {currentEval.matched.join(', ') || 'aucun'}</div>
              {currentEval.missing.length > 0 && (
                <div className="text-sm"><strong>Manquants :</strong> <span className="text-text-soft">{currentEval.missing.join(', ')}</span></div>
              )}
            </div>
            <details className="card p-3">
              <summary className="cursor-pointer text-sm font-medium">Voir la réponse idéale</summary>
              <p className="text-sm text-text-soft mt-2 whitespace-pre-line">{currentEval.idealAnswer}</p>
            </details>
            <button onClick={nextQuestion} disabled={submitting} className="btn-primary w-full justify-center">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : index + 1 >= questions.length ? <>Terminer <CheckCircle2 className="w-4 h-4" /></> : <>Question suivante <ArrowRight className="w-4 h-4" /></>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
