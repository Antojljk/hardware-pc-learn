import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { QuizClient } from './QuizClient';
import { Brain, Sparkles, Shuffle, History, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function QuizPage({ searchParams }: { searchParams: { category?: string; mode?: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  const recent = await prisma.quizAttempt.findMany({
    where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 5,
  });

  return (
    <div className="space-y-6">
      <section className="module-hero flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="module-eyebrow">Entraînement</div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight flex items-center gap-2 mt-2">
            <Brain className="w-6 h-6 text-text" /> Quiz
          </h1>
          <p className="text-muted text-[15px] mt-2 max-w-xl">Entraîne-toi sur tous les domaines du hardware.</p>
        </div>
        <Link href="/quiz?mode=adaptive" className="btn-primary"><Sparkles className="w-4 h-4" /> Mode adaptatif</Link>
      </section>

      <div className="grid sm:grid-cols-2 gap-3">
        <Link href="/quiz" className="module-frame lift-3d flex items-center gap-3 group anim-rise anim-rise-1">
          <div className="w-10 h-10 rounded-xl grid place-items-center bg-bg-elev border border-border">
            <Shuffle className="w-5 h-5 text-text" />
          </div>
          <div className="flex-1">
            <div className="font-medium">Quiz libre</div>
            <div className="text-xs text-muted">10 questions au hasard</div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </Link>
        <Link href="/quiz?mode=adaptive" className="module-frame lift-3d flex items-center gap-3 group anim-rise anim-rise-2">
          <div className="w-10 h-10 rounded-xl grid place-items-center bg-bg-elev border border-border">
            <Sparkles className="w-5 h-5 text-text" />
          </div>
          <div className="flex-1">
            <div className="font-medium">Quiz adaptatif</div>
            <div className="text-xs text-muted">S&apos;adapte à ton niveau</div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>

      <QuizClient initialCategory={searchParams.category} mode={searchParams.mode === 'adaptive' ? 'adaptive' : 'free'} />

      {recent.length > 0 && (
        <section className="module-frame">
          <h2 className="section-title mb-3 flex items-center gap-2"><History className="w-4 h-4" /> Historique récent</h2>
          <ul className="divide-y divide-border">
            {recent.map(r => (
              <li key={r.id} className="py-3 flex justify-between items-center text-sm">
                <span className="text-muted">{new Date(r.createdAt).toLocaleString('fr-FR')}</span>
                <span className="font-semibold tabular-nums">{r.score}/{r.total} <span className="text-muted">({Math.round((r.score/r.total)*100)}%)</span></span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
