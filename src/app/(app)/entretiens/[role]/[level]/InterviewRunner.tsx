'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { pickInterviewQuestions, evaluateAnswer } from '@/lib/interview';
import { ArrowRight, Loader2, Send, CheckCircle2, MessageSquareQuote, Lightbulb } from 'lucide-react';
import Link from 'next/link';

export function InterviewRunner({ role, level }: { role: string; level: string }) {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [questions] = useState(() => pickInterviewQuestions(role, level, 5));
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [evaluations, setEvaluations] = useState<{ score: number; matched: string[]; missing: string[]; feedback: string; questionId: string; question: string; idealAnswer: string }[]>([]);
  const [currentEval, setCurrentEval] = useState<{ score: number; matched: string[]; missing: string[]; feedback: string; questionId: string; question: string; idealAnswer: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [finalResult, setFinalResult] = useState<{ score: number; xpAwarded: number; feedback?: { strengths: string[]; improvements: string[] }; transcript?: { question?: string }[] } | null>(null);

  async function submitAnswer() {
    if (!answer.trim()) return;
    const q = questions[index];
    const evalRes = evaluateAnswer(q, answer);
    setCurrentEval({ ...evalRes, questionId: q.id, question: q.question, idealAnswer: q.idealAnswer });
  }

  async function nextQuestion() {
    if (!currentEval) return;
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
        <section className="result-hero anim-rise">
          <div className="module-eyebrow mb-2">Entretien terminé</div>
          <div className="font-display text-6xl font-semibold tabular-nums">{finalResult.score}<span className="text-2xl text-muted">/100</span></div>
          <div className="text-muted mt-1">Score global</div>
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-elev border border-border text-sm">
            <span className="font-semibold">+{finalResult.xpAwarded}</span><span className="text-muted">XP gagnés</span>
          </div>
        </section>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="module-frame anim-rise anim-rise-1">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Points forts</h3>
            <ul className="text-sm space-y-1.5 text-muted">
              {strengths.map((s: string, i: number) => (
                <li key={i} className="flex items-start gap-2"><span className="text-muted shrink-0">•</span>{s}</li>
              ))}
            </ul>
          </div>
          <div className="module-frame anim-rise anim-rise-2">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Lightbulb className="w-4 h-4" /> À améliorer</h3>
            <ul className="text-sm space-y-1.5 text-muted">
              {improvements.map((s: string, i: number) => (
                <li key={i} className="flex items-start gap-2"><span className="text-muted shrink-0">•</span>{s}</li>
              ))}
            </ul>
          </div>
        </div>
        <section className="module-frame anim-rise anim-rise-3">
          <h3 className="section-title mb-3">Réponses idéales</h3>
          <ul className="space-y-3">
            {finalResult.transcript?.map((t: { question?: string }, i: number) => (
              <li key={i} className="p-4 rounded-2xl bg-bg-elev border border-border">
                <div className="text-xs text-muted uppercase tracking-wider mb-1.5">Question {i + 1}</div>
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
      <div className="space-y-4 max-w-2xl mx-auto">
        <section className="module-frame anim-rise">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl grid place-items-center bg-bg-elev border border-border">
              <MessageSquareQuote className="w-5 h-5 text-text" />
            </div>
            <div>
              <div className="module-eyebrow">Simulation</div>
              <h1 className="font-display text-lg font-semibold">Entretien technique</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="badge-muted capitalize">{role}</span>
            <span className="badge-muted capitalize">{level}</span>
            <span className="badge-muted">{questions.length} questions</span>
          </div>
          <p className="text-sm text-muted mb-3">
            Un recruteur te posera <strong className="text-text">{questions.length} questions</strong>. Réponds par écrit avec précision et structure.
            À la fin : score global, points forts, à améliorer, réponses idéales.
          </p>
          <div className="info-banner text-xs">
            <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>Il s&apos;agit d&apos;une simulation inspirée du secteur. Aucune question ne provient d&apos;un processus de recrutement réel.</span>
          </div>
          <button onClick={() => setStarted(true)} className="btn-primary w-full justify-center mt-5">
            Commencer l&apos;entretien
          </button>
        </section>
      </div>
    );
  }

  const q = questions[index];
  const progress = ((index) / questions.length) * 100;

  return (
    <div className="max-w-3xl space-y-4">
      <div className="sticky-stage -mx-6 sm:-mx-10 px-6 sm:px-10">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted tabular-nums">Question {index + 1}<span className="text-faint"> / {questions.length}</span></span>
          <span className="badge-muted capitalize">{role} · {level}</span>
        </div>
        <div className="h-1 rounded-full bg-bg-elev overflow-hidden">
          <div className="h-full bg-text transition-all duration-500 ease-smooth" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div key={index} className="question-card anim-rise">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-muted uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquareQuote className="w-3.5 h-3.5" /> Recruteur
          </div>
          <span className="text-[10px] text-faint tabular-nums">{index + 1}/{questions.length}</span>
        </div>
        <h2 className="font-display text-lg sm:text-xl font-semibold mb-5 leading-snug">{q.question}</h2>
        {!currentEval ? (
          <>
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              className="input min-h-[160px] resize-y"
              placeholder="Ta réponse…"
            />
            <div className="text-xs text-muted mt-2">{answer.trim().split(/\s+/).filter(Boolean).length} mots</div>
            <button onClick={submitAnswer} disabled={!answer.trim()} className="btn-primary mt-3 w-full justify-center">
              <Send className="w-4 h-4" /> Soumettre
            </button>
          </>
        ) : (
          <div className="space-y-3 anim-rise">
            <div className="p-4 rounded-2xl border border-text/30 bg-text/8">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold flex items-center gap-2">
                  {currentEval.score >= 70 ? <CheckCircle2 className="w-4 h-4" /> : <Lightbulb className="w-4 h-4" />}
                  Score : {currentEval.score}/100
                </div>
                <span className="text-xs text-muted">{currentEval.feedback}</span>
              </div>
              <div className="text-sm mb-2"><strong className="text-text">Mots-clés trouvés :</strong> {currentEval.matched.join(', ') || 'aucun'}</div>
              {currentEval.missing.length > 0 && (
                <div className="text-sm"><strong className="text-text">Manquants :</strong> <span className="text-muted">{currentEval.missing.join(', ')}</span></div>
              )}
            </div>
            <details className="module-frame">
              <summary className="cursor-pointer text-sm font-medium">Voir la réponse idéale</summary>
              <p className="text-sm text-muted mt-3 whitespace-pre-line">{currentEval.idealAnswer}</p>
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
