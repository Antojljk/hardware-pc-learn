import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { EXAMS } from '@/content/quizzes';
import { FileCheck2, Clock, Trophy, ChevronRight, Target, ListChecks, Activity } from 'lucide-react';
import { redirect } from 'next/navigation';
import { canAccess } from '@/lib/plans';
import { LockedState } from '@/components/LockedState';

export default async function ExamsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  // Garde-fou serveur : les examens sont ESSENTIEL+.
  if (!canAccess(user.plan, 'exams_basic', user.id)) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">Examens blancs</h1>
        <LockedState
          feature="Examens blancs"
          required="ESSENTIEL"
          current={user.plan}
          description="Les examens blancs sont réservés à l'offre Essentiel et supérieures. Ils valident tes acquis en conditions réelles."
        />
      </div>
    );
  }

  const attempts = await prisma.examAttempt.findMany({
    where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 10,
  });

  const passedCount = attempts.filter(a => (a.score / a.total) * 100 >= 70).length;
  const passRate = attempts.length ? Math.round((passedCount / attempts.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* HERO */}
      <section className="module-hero">
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="module-eyebrow flex items-center gap-2">
              <FileCheck2 className="w-3.5 h-3.5" /> Évaluation
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              Examens blancs
            </h1>
            <p className="text-muted text-[15px] max-w-xl leading-relaxed">
              Teste-toi en condition réelle : chrono, score, validation.
              Un examen est réussi à partir de 70%.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto sm:min-w-[360px]">
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <ListChecks className="w-3.5 h-3.5" /> Examens
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {EXAMS.length}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Activity className="w-3.5 h-3.5" /> Tentatives
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {attempts.length}
              </div>
            </div>
            <div className="rounded-2xl border border-text/30 bg-text/8 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Trophy className="w-3.5 h-3.5" /> Réussite
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {passRate}%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LISTE EXAMENS */}
      <div className="grid sm:grid-cols-2 gap-3">
        {EXAMS.map((e, i) => (
          <Link
            key={e.slug}
            href={`/examens/${e.slug}`}
            className={`card-depth relative overflow-hidden lift-3d group p-5 sm:p-6 anim-rise anim-rise-${Math.min(i + 1, 4)}`}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-24 w-60 h-60 rounded-full opacity-50 blur-3xl"
              style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.10), transparent 70%)' }}
            />
            <div className="relative">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="space-y-1.5">
                  <div className="module-eyebrow">Examen blanc</div>
                  <h2 className="font-display text-lg sm:text-xl font-semibold leading-tight">{e.title}</h2>
                </div>
                <span className="badge-muted capitalize shrink-0">{e.level}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="rounded-xl border border-border bg-bg-elev/60 p-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                    <FileCheck2 className="w-3 h-3" /> Questions
                  </div>
                  <div className="mt-0.5 font-display text-base font-semibold tabular-nums text-text">
                    {e.questionIds.length}
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-bg-elev/60 p-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                    <Clock className="w-3 h-3" /> Durée
                  </div>
                  <div className="mt-0.5 font-display text-base font-semibold tabular-nums text-text">
                    {Math.round(e.durationSec / 60)} min
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <Target className="w-3 h-3" />
                  <span>Seuil de réussite : 70%</span>
                </div>
                <span className="inline-flex items-center gap-1 text-sm text-text">
                  Démarrer
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* HISTORIQUE */}
      {attempts.length > 0 && (
        <section className="module-frame anim-rise anim-rise-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <Trophy className="w-4 h-4" /> Historique des examens
            </h2>
            <span className="badge-muted tabular-nums">{attempts.length}</span>
          </div>
          <ul className="divide-y divide-border">
            {attempts.map(a => {
              const pct = Math.round((a.score / a.total) * 100);
              const pass = pct >= 70;
              return (
                <li key={a.id} className="py-3 flex flex-wrap items-center gap-3 text-sm">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {EXAMS.find(e => e.slug === a.examId)?.title || a.examId}
                    </div>
                    <div className="text-xs text-muted tabular-nums">
                      {new Date(a.createdAt).toLocaleString('fr-FR')} · {Math.round(a.timeSpentSec / 60)} min
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden sm:block w-28 h-1.5 rounded-full bg-bg-elev overflow-hidden">
                      <div className="h-full bg-text" style={{ width: `${pct}%` }} />
                    </div>
                    <span className={`font-semibold tabular-nums w-12 text-right ${pass ? 'text-text' : 'text-muted'}`}>
                      {pct}%
                    </span>
                    <span className="text-xs text-muted tabular-nums w-10 text-right">
                      {a.score}/{a.total}
                    </span>
                    <span className={`badge ${pass ? 'border-text/40' : 'badge-muted'} uppercase text-[10px]`}>
                      {pass ? 'Réussi' : 'Échoué'}
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
