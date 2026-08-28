import { notFound, redirect } from 'next/navigation';
import { EXAMS, QUESTIONS, Question } from '@/content/quizzes';
import { getCurrentUser } from '@/lib/auth';
import { ExamRunner } from './ExamRunner';
import { Clock, FileCheck2, ArrowLeft, ListChecks, Target } from 'lucide-react';
import Link from 'next/link';

export default async function ExamRunnerPage({ params }: { params: { slug: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');
  const exam = EXAMS.find(e => e.slug === params.slug);
  if (!exam) notFound();
  const questions = exam.questionIds
    .map(id => QUESTIONS.find(q => q.id === id))
    .filter((q): q is Question => Boolean(q));

  return (
    <div className="space-y-5 max-w-3xl">
      <Link href="/examens" className="text-sm text-muted hover:text-text inline-flex items-center gap-1.5 anim-rise">
        <ArrowLeft className="w-3.5 h-3.5" /> Tous les examens
      </Link>

      <section className="module-hero">
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="module-eyebrow flex items-center gap-2">
              <FileCheck2 className="w-3.5 h-3.5" /> Examen blanc
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mt-2">
              {exam.title}
            </h1>
          </div>

          <div className="grid grid-cols-3 gap-2 w-full sm:w-auto sm:min-w-[320px]">
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-2.5">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <ListChecks className="w-3 h-3" /> Q.
              </div>
              <div className="mt-0.5 font-display text-lg font-semibold tabular-nums text-text">
                {questions.length}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-2.5">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Clock className="w-3 h-3" /> Durée
              </div>
              <div className="mt-0.5 font-display text-lg font-semibold tabular-nums text-text">
                {Math.round(exam.durationSec / 60)} min
              </div>
            </div>
            <div className="rounded-2xl border border-text/30 bg-text/8 backdrop-blur p-2.5">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Target className="w-3 h-3" /> Seuil
              </div>
              <div className="mt-0.5 font-display text-lg font-semibold tabular-nums text-text">
                70%
              </div>
            </div>
          </div>
        </div>
        <div className="relative flex flex-wrap items-center gap-2 mt-5 pt-5 border-t border-border">
          <span className="badge-muted capitalize">{exam.level}</span>
          <span className="text-xs text-muted">Seuil de réussite : 70%</span>
        </div>
      </section>
      <ExamRunner exam={exam} questions={questions} />
    </div>
  );
}
