import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { QuizClient } from './QuizClient';
import { Brain, Sparkles, Shuffle } from 'lucide-react';
import Link from 'next/link';

export default async function QuizPage({ searchParams }: { searchParams: { category?: string; mode?: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  const recent = await prisma.quizAttempt.findMany({
    where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 5,
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Brain className="w-5 h-5 text-brand-blue" /> Quiz</h1>
          <p className="text-text-soft text-sm">Entraîne-toi sur tous les domaines du hardware.</p>
        </div>
        <Link href="/quiz?mode=adaptive" className="btn-primary"><Sparkles className="w-4 h-4" /> Mode adaptatif</Link>
      </header>

      <div className="grid sm:grid-cols-2 gap-3">
        <Link href="/quiz" className="card card-hover p-5 flex items-center gap-3">
          <Shuffle className="w-5 h-5 text-brand-blue" />
          <div>
            <div className="font-medium">Quiz libre</div>
            <div className="text-xs text-text-soft">10 questions au hasard</div>
          </div>
        </Link>
        <Link href="/quiz?mode=adaptive" className="card card-hover p-5 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-brand-violet" />
          <div>
            <div className="font-medium">Quiz adaptatif</div>
            <div className="text-xs text-text-soft">S&apos;adapte à ton niveau</div>
          </div>
        </Link>
      </div>

      <QuizClient initialCategory={searchParams.category} mode={searchParams.mode === 'adaptive' ? 'adaptive' : 'free'} />

      {recent.length > 0 && (
        <section className="card p-5">
          <h2 className="section-title mb-3">Historique récent</h2>
          <ul className="divide-y divide-border">
            {recent.map(r => (
              <li key={r.id} className="py-2 flex justify-between text-sm">
                <span className="text-text-soft">{new Date(r.createdAt).toLocaleString('fr-FR')}</span>
                <span className="font-semibold tabular-nums">{r.score}/{r.total} ({Math.round((r.score/r.total)*100)}%)</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
