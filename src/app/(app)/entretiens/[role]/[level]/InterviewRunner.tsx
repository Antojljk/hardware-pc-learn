'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { pickInterviewQuestions, evaluateAnswer } from '@/lib/interview';
import { ArrowRight, ArrowLeft, Loader2, Send, CheckCircle2, MessageSquareQuote, Lightbulb, Sparkles, Target } from 'lucide-react';
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
      <div className="space-y-5 max-w-3xl">
        <Link href="/entretiens" className="text-sm text-muted hover:text-text inline-flex items-center gap-1.5 anim-rise">
          <ArrowLeft className="w-3.5 h-3.5" /> Tous les entretiens
        </Link>

        <section className="result-hero anim-rise relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-50 blur-3xl"
            style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.14), transparent 70%)' }}
          />
          <div className="relative">
            <div className="module-eyebrow mb-2">Entretien terminé</div>
            <div className="font-display text-7xl font-semibold tabular-nums">
              {finalResult.score}<span className="text-2xl text-muted">/100</span>
            </div>
            <div className="text-muted mt-1">Score global</div>
            <div className="mt-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-text/10 border border-text/30 text-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-semibold tabular-nums">+{finalResult.xpAwarded}</span>
              <span className="text-muted">XP gagnés</span>
            </div>
          </div>
        </section>

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="card-depth p-5 anim-rise anim-rise-1">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg grid place-items-center bg-text/10 border border-text/30">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              Points forts
            </h3>
            {strengths.length > 0 ? (
              <ul className="text-sm space-y-2 text-text-soft">
                {strengths.map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 p-2 rounded-lg bg-bg-elev/40">
                    <span className="font-mono text-[10px] text-muted mt-0.5 shrink-0 w-5 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">Aucun point fort identifié.</p>
            )}
          </div>
          <div className="card-depth p-5 anim-rise anim-rise-2">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg grid place-items-center bg-bg-elev border border-border">
                <Lightbulb className="w-4 h-4" />
              </span>
              À améliorer
            </h3>
            {improvements.length > 0 ? (
              <ul className="text-sm space-y-2 text-text-soft">
                {improvements.map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 p-2 rounded-lg bg-bg-elev/40">
                    <span className="font-mono text-[10px] text-muted mt-0.5 shrink-0 w-5 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">Excellent — rien à signaler.</p>
            )}
          </div>
        </div>

        <section className="module-frame anim-rise anim-rise-3">
          <h3 className="section-title mb-4 flex items-center gap-2">
            <Target className="w-4 h-4" /> Réponses idéales
          </h3>
          <ul className="space-y-3">
            {finalResult.transcript?.map((t: { question?: string }, i: number) => (
              <li key={i} className="p-4 rounded-2xl bg-bg-elev/60 border border-border">
                <div className="text-[10px] text-muted uppercase tracking-wider mb-1.5 font-mono">Question {String(i + 1).padStart(2, '0')}</div>
                <div className="font-medium mb-2 text-text">{t.question || questions[i].question}</div>
                <div className="text-sm text-text-soft whitespace-pre-line leading-relaxed">{questions[i].idealAnswer}</div>
              </li>
            ))}
          </ul>
        </section>

        <Link href="/entretiens" className="btn-primary w-full justify-center py-3">
          Retour aux entretiens
        </Link>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <Link href="/entretiens" className="text-sm text-muted hover:text-text inline-flex items-center gap-1.5 anim-rise">
          <ArrowLeft className="w-3.5 h-3.5" /> Tous les entretiens
        </Link>
        <section className="card-depth p-6 sm:p-8 anim-rise relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-50 blur-3xl"
            style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.10), transparent 70%)' }}
          />
          <div className="relative">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl grid place-items-center bg-text/10 border border-text/30 text-text">
                <MessageSquareQuote className="w-5 h-5" />
              </div>
              <div>
                <div className="module-eyebrow mb-0.5">Simulation</div>
                <h1 className="font-display text-2xl font-semibold">Entretien technique</h1>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="badge-muted capitalize">{role}</span>
              <span className="badge-muted capitalize">{level}</span>
              <span className="badge-muted tabular-nums">{questions.length} questions</span>
            </div>
            <p className="text-sm text-muted mb-4 leading-relaxed">
              Un recruteur te posera <strong className="text-text">{questions.length} questions</strong>. Réponds par écrit avec précision et structure.
              À la fin : score global, points forts, à améliorer, réponses idéales.
            </p>
            <div className="info-banner text-xs">
              <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>Il s&apos;agit d&apos;une simulation inspirée du secteur. Aucune question ne provient d&apos;un processus de recrutement réel.</span>
            </div>
            <button onClick={() => setStarted(true)} className="btn-primary w-full justify-center mt-6 py-3">
              Commencer l&apos;entretien
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
    );
  }

  const q = questions[index];
  const progress = ((index) / questions.length) * 100;
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="max-w-3xl space-y-4">
      <div className="sticky-stage -mx-6 sm:-mx-10 px-6 sm:px-10">
        <div className="flex items-center justify-between text-sm mb-2.5">
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="w-3.5 h-3.5 text-muted" />
            <span className="text-text font-semibold tabular-nums">Question {index + 1}</span>
            <span className="text-faint">/ {questions.length}</span>
          </div>
          <span className="badge-muted capitalize">{role} · {level}</span>
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
            <div className="flex items-center gap-2 text-xs text-muted uppercase tracking-wider font-semibold">
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>Recruteur</span>
            </div>
            <span className="text-[10px] text-faint tabular-nums font-mono">
              {String(index + 1).padStart(2, '0')}/{String(questions.length).padStart(2, '0')}
            </span>
          </div>
          <h2 className="font-display text-lg sm:text-2xl font-semibold mb-6 leading-snug text-text">
            {q.question}
          </h2>
          {!currentEval ? (
            <>
              <textarea
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                className="input min-h-[180px] resize-y leading-relaxed"
                placeholder="Ta réponse…"
              />
              <div className="flex items-center justify-between mt-2 text-xs text-muted">
                <span>Sois précis et structuré.</span>
                <span className="tabular-nums">{wordCount} mot{wordCount > 1 ? 's' : ''}</span>
              </div>
              <button onClick={submitAnswer} disabled={!answer.trim()} className="btn-primary mt-4 w-full justify-center py-3">
                <Send className="w-4 h-4" /> Soumettre ma réponse
              </button>
            </>
          ) : (
            <div className="space-y-3 anim-rise">
              <div className="p-4 rounded-2xl border border-text/30 bg-text/8">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="font-semibold flex items-center gap-2">
                    {currentEval.score >= 70 ? <CheckCircle2 className="w-4 h-4" /> : <Lightbulb className="w-4 h-4" />}
                    <span>Score : <span className="tabular-nums">{currentEval.score}/100</span></span>
                  </div>
                  <span className="text-xs text-muted">{currentEval.feedback}</span>
                </div>
                <div className="text-sm mb-1.5">
                  <strong className="text-text">Mots-clés trouvés :</strong>{' '}
                  <span className="text-text-soft">
                    {currentEval.matched.length > 0 ? currentEval.matched.join(', ') : <span className="text-muted italic">aucun</span>}
                  </span>
                </div>
                {currentEval.missing.length > 0 && (
                  <div className="text-sm">
                    <strong className="text-text">Manquants :</strong>{' '}
                    <span className="text-muted">{currentEval.missing.join(', ')}</span>
                  </div>
                )}
              </div>
              <details className="card-depth p-4">
                <summary className="cursor-pointer text-sm font-medium flex items-center gap-2 list-none">
                  <Lightbulb className="w-3.5 h-3.5" />
                  Voir la réponse idéale
                </summary>
                <p className="text-sm text-text-soft mt-3 whitespace-pre-line leading-relaxed">{currentEval.idealAnswer}</p>
              </details>
              <button onClick={nextQuestion} disabled={submitting} className="btn-primary w-full justify-center py-3">
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : index + 1 >= questions.length ? (
                  <>Terminer <CheckCircle2 className="w-4 h-4" /></>
                ) : (
                  <>Question suivante <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
