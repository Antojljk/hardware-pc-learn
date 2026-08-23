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
      <header className="card p-5 bg-gradient-to-br from-bg-card to-bg-elev">
        <h1 className="text-xl font-bold mb-1 flex items-center gap-2"><FileCheck2 className="w-5 h-5 text-brand-blue" /> {exam.title}</h1>
        <div className="flex items-center gap-4 text-sm text-text-soft">
          <span className="inline-flex items-center gap-1"><FileCheck2 className="w-3.5 h-3.5" />{questions.length} questions</span>
          <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{Math.round(exam.durationSec/60)} min</span>
          <span className="badge bg-bg-elev border-border">{exam.level}</span>
        </div>
      </header>
      <ExamRunner exam={exam} questions={questions} />
    </div>
  );
}
