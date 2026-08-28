import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { QuizClient } from './QuizClient';
import { Brain, Sparkles, Shuffle, History, ChevronRight, Activity } from 'lucide-react';
import Link from 'next/link';

export default async function QuizPage({ searchParams }: { searchParams: { category?: string; mode?: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  const recent = await prisma.quizAttempt.findMany({
    where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 5,
  });

  const totalAttempts = recent.length;
  const avgPct = totalAttempts > 0
    ? Math.round(recent.reduce((acc, r) => acc + (r.score / r.total) * 100, 0) / totalAttempts)
    : 0;

  return (
    <div className="space-y-6">
      {/* HERO */}
      <section className="module-hero">
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="module-eyebrow flex items-center gap-2">
              <Brain className="w-3.5 h-3.5" /> Entraînement
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              Quiz
            </h1>
            <p className="text-muted text-[15px] max-w-xl leading-relaxed">
              Entraîne-toi sur tous les domaines du hardware : alimentation, mémoire,
              stockage, CPU, GPU, refroidissement, diagnostic.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full sm:w-auto sm:min-w-[300px]">
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Activity className="w-3.5 h-3.5" /> Tentatives
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {totalAttempts}
              </div>
            </div>
            <div className="rounded-2xl border border-text/30 bg-text/8 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Sparkles className="w-3.5 h-3.5" /> Réussite moy.
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {avgPct}%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODES */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Link
          href="/quiz"
          className="card-depth relative overflow-hidden lift-3d group p-5 sm:p-6 anim-rise anim-rise-1"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-50 blur-3xl"
            style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.10), transparent 70%)' }}
          />
          <div className="relative flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl grid place-items-center bg-bg-elev border border-border shrink-0">
              <Shuffle className="w-5 h-5 text-text" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="module-eyebrow mb-1">Mode libre</div>
              <div className="font-display text-lg font-semibold">Quiz libre</div>
              <p className="text-sm text-muted mt-1.5 leading-relaxed">
                10 questions piochées au hasard sur l&apos;ensemble du catalogue.
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-sm text-text">
                Démarrer <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        </Link>

        <Link
          href="/quiz?mode=adaptive"
          className="card-depth relative overflow-hidden lift-3d group p-5 sm:p-6 anim-rise anim-rise-2"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-60 blur-3xl"
            style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.14), transparent 70%)' }}
          />
          <span className="absolute top-3 right-3 badge-accent">Recommandé</span>
          <div className="relative flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl grid place-items-center bg-text/10 border border-text/30 shrink-0">
              <Sparkles className="w-5 h-5 text-text" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="module-eyebrow mb-1">Mode adaptatif</div>
              <div className="font-display text-lg font-semibold">Quiz adaptatif</div>
              <p className="text-sm text-muted mt-1.5 leading-relaxed">
                S&apos;adapte à ton niveau : plus dur quand tu maîtrises, plus facile quand tu galères.
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-sm text-text">
                Lancer <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      <QuizClient initialCategory={searchParams.category} mode={searchParams.mode === 'adaptive' ? 'adaptive' : 'free'} />

      {recent.length > 0 && (
        <section className="module-frame anim-rise anim-rise-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <History className="w-4 h-4" /> Historique récent
            </h2>
            <span className="badge-muted tabular-nums">{recent.length}</span>
          </div>
          <ul className="divide-y divide-border">
            {recent.map(r => {
              const pct = Math.round((r.score / r.total) * 100);
              return (
                <li key={r.id} className="py-3 flex flex-wrap items-center gap-3 text-sm">
                  <div className="flex-1 min-w-0">
                    <div className="text-muted truncate">
                      {new Date(r.createdAt).toLocaleString('fr-FR')}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-24 sm:w-32 h-1.5 rounded-full bg-bg-elev overflow-hidden">
                      <div className="h-full bg-text" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="font-semibold tabular-nums text-text w-12 text-right">
                      {pct}%
                    </span>
                    <span className="text-xs text-muted tabular-nums w-10 text-right">
                      {r.score}/{r.total}
                    </span>
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
