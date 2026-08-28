import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { EXAMS } from '@/content/quizzes';
import { FileCheck2, Clock, Trophy } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function ExamsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  const attempts = await prisma.examAttempt.findMany({
    where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 10,
  });

  return (
    <div className="space-y-6">
      <section className="module-hero">
        <div className="module-eyebrow">Évaluation</div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight flex items-center gap-2 mt-2">
          <FileCheck2 className="w-6 h-6 text-text" /> Examens blancs
        </h1>
        <p className="text-muted text-[15px] mt-2 max-w-xl">Teste-toi en condition réelle avec chrono.</p>
      </section>

      <div className="grid sm:grid-cols-2 gap-3">
        {EXAMS.map((e, i) => (
          <Link
            key={e.slug}
            href={`/examens/${e.slug}`}
            className={`module-frame lift-3d block group anim-rise anim-rise-${Math.min(i + 1, 4)}`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h2 className="font-display text-base font-semibold">{e.title}</h2>
              <span className="badge-muted capitalize">{e.level}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5"><FileCheck2 className="w-3.5 h-3.5" />{e.questionIds.length} questions</span>
              <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{Math.round(e.durationSec/60)} min</span>
            </div>
          </Link>
        ))}
      </div>

      {attempts.length > 0 && (
        <section className="module-frame">
          <h2 className="section-title mb-3 flex items-center gap-2"><Trophy className="w-4 h-4" /> Historique des examens</h2>
          <ul className="divide-y divide-border">
            {attempts.map(a => {
              const pct = Math.round((a.score / a.total) * 100);
              const pass = pct >= 70;
              return (
                <li key={a.id} className="py-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-medium">{EXAMS.find(e => e.slug === a.examId)?.title || a.examId}</div>
                    <div className="text-xs text-muted">{new Date(a.createdAt).toLocaleString('fr-FR')} · {Math.round(a.timeSpentSec/60)} min</div>
                  </div>
                  <div className={`font-semibold tabular-nums ${pass ? 'text-text' : 'text-muted'}`}>
                    {pct}% <span className="text-xs text-muted">({a.score}/{a.total})</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
