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

  const levelColor: Record<string, string> = {
    debutant: 'border-success/30 text-success',
    intermediaire: 'border-brand-blue/30 text-brand-blue',
    avance: 'border-brand-violet/30 text-brand-violet',
    expert: 'border-warning/30 text-warning',
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold flex items-center gap-2"><FileCheck2 className="w-5 h-5 text-brand-blue" /> Examens blancs</h1>
        <p className="text-text-soft text-sm">Teste-toi en condition réelle avec chrono.</p>
      </header>

      <div className="grid sm:grid-cols-2 gap-3">
        {EXAMS.map(e => (
          <Link key={e.slug} href={`/examens/${e.slug}`} className="card card-hover p-5">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h2 className="font-semibold">{e.title}</h2>
              <span className={`badge bg-bg-elev border ${levelColor[e.level]}`}>{e.level}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-text-soft">
              <span className="inline-flex items-center gap-1"><FileCheck2 className="w-3.5 h-3.5" />{e.questionIds.length} questions</span>
              <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{Math.round(e.durationSec/60)} min</span>
            </div>
          </Link>
        ))}
      </div>

      {attempts.length > 0 && (
        <section className="card p-5">
          <h2 className="section-title mb-3 flex items-center gap-2"><Trophy className="w-4 h-4 text-warning" /> Historique des examens</h2>
          <ul className="divide-y divide-border">
            {attempts.map(a => {
              const pct = Math.round((a.score / a.total) * 100);
              const pass = pct >= 70;
              return (
                <li key={a.id} className="py-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-medium">{EXAMS.find(e => e.slug === a.examId)?.title || a.examId}</div>
                    <div className="text-xs text-text-mute">{new Date(a.createdAt).toLocaleString('fr-FR')} · {Math.round(a.timeSpentSec/60)} min</div>
                  </div>
                  <div className={`font-bold tabular-nums ${pass ? 'text-success' : 'text-danger'}`}>{pct}% <span className="text-xs text-text-mute">({a.score}/{a.total})</span></div>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
