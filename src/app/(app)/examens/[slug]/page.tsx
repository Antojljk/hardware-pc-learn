import { notFound, redirect } from 'next/navigation';
import { EXAMS, QUESTIONS, Question } from '@/content/quizzes';
import { getCurrentUser } from '@/lib/auth';
import { ExamRunner } from './ExamRunner';
import { Clock, FileCheck2 } from 'lucide-react';

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
      <section className="module-hero">
        <div className="module-eyebrow">Examen blanc</div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight mt-2 flex items-center gap-2">
          <FileCheck2 className="w-6 h-6 text-text" /> {exam.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted mt-3">
          <span className="inline-flex items-center gap-1.5"><FileCheck2 className="w-3.5 h-3.5" />{questions.length} questions</span>
          <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{Math.round(exam.durationSec/60)} min</span>
          <span className="badge-muted capitalize">{exam.level}</span>
        </div>
      </section>
      <ExamRunner exam={exam} questions={questions} />
    </div>
  );
}
