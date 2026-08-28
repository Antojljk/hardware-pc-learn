import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { DOMAINS, getLevel } from '@/lib/xp';
import {
  TrendingUp, Clock, Trophy, Target, BookOpen, MessageSquareQuote, Wrench,
  Activity, Flame, Award, Layers, ShieldCheck, ChevronRight, Zap,
} from 'lucide-react';
import { MasteryChart } from './MasteryChart';
import { ActivityChart } from './ActivityChart';

export const metadata = { title: 'Progression — HardwarePC' };

export default async function ProgressionPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  const lvl = getLevel(user.xp);

  const [quizAttempts, examAttempts, interviews, diagnostics, lessonsCompleted, badges] = await Promise.all([
    prisma.quizAttempt.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'asc' } }),
    prisma.examAttempt.findMany({ where: { userId: user.id } }),
    prisma.interviewAttempt.findMany({ where: { userId: user.id } }),
    prisma.diagnosticAttempt.findMany({ where: { userId: user.id } }),
    prisma.lessonProgress.count({ where: { userId: user.id, completed: true } }),
    prisma.badgesOnUsers.findMany({ where: { userId: user.id }, include: { badge: true } }),
  ]);

  // Domain mastery from quiz details
  const totals: Record<string, { correct: number; total: number }> = {};
  for (const att of quizAttempts) {
    let details: { correct: boolean; category?: string }[] = [];
    try { details = JSON.parse(att.details); } catch { /* ignore */ }
    for (const d of details) {
      if (!d.category) continue;
      totals[d.category] = totals[d.category] || { correct: 0, total: 0 };
      totals[d.category].total++;
      if (d.correct) totals[d.category].correct++;
    }
  }
  const domainStats = DOMAINS.map(d => ({
    key: d.key,
    label: d.label,
    value: totals[d.key] ? Math.round((totals[d.key].correct / totals[d.key].total) * 100) : 0,
    attempts: totals[d.key]?.total ?? 0,
  }));
  const strong = [...domainStats].sort((a, b) => b.value - a.value).slice(0, 5).filter(d => d.value > 0);
  const weak = [...domainStats].sort((a, b) => a.value - b.value).slice(0, 5).filter(d => d.value < 75);

  // Score moyen quiz
  const avgQuiz = quizAttempts.length
    ? Math.round(quizAttempts.reduce((s, a) => s + (a.score / Math.max(1, a.total)) * 100, 0) / quizAttempts.length)
    : 0;
  const avgExam = examAttempts.length
    ? Math.round(examAttempts.reduce((s, a) => s + (a.score / Math.max(1, a.total)) * 100, 0) / examAttempts.length)
    : 0;
  const avgInterview = interviews.length
    ? Math.round(interviews.reduce((s, a) => s + a.score, 0) / interviews.length)
    : 0;
  const avgDiag = diagnostics.length
    ? Math.round(diagnostics.reduce((s, a) => s + a.score, 0) / diagnostics.length)
    : 0;

  const overallAvg = (() => {
    const vals = [avgQuiz, avgExam, avgInterview, avgDiag].filter(v => v > 0);
    return vals.length ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length) : 0;
  })();

  // Activity chart : XP cumulé sur les 14 derniers jours
  const days: { day: string; xp: number }[] = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now); d.setDate(now.getDate() - i); d.setHours(0, 0, 0, 0);
    const next = new Date(d); next.setDate(d.getDate() + 1);
    const dailyXp =
      quizAttempts.filter(a => new Date(a.createdAt) >= d && new Date(a.createdAt) < next).reduce((s, a) => s + a.score * 10, 0)
      + examAttempts.filter(a => new Date(a.createdAt) >= d && new Date(a.createdAt) < next).reduce((s, a) => s + a.score * 12, 0)
      + interviews.filter(a => new Date(a.createdAt) >= d && new Date(a.createdAt) < next).reduce((s, a) => s + a.score * 0.6, 0)
      + diagnostics.filter(a => new Date(a.createdAt) >= d && new Date(a.createdAt) < next).reduce((s, a) => s + a.score * 0.5, 0)
      + lessonsCompleted * 0;
    days.push({ day: d.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit' }), xp: Math.round(dailyXp) });
  }

  return (
    <div className="space-y-6">
      {/* HERO */}
      <section className="module-hero">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-40 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.10), transparent 70%)' }}
        />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="module-eyebrow flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5" /> Tableau de bord
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              Progression
            </h1>
            <p className="text-muted text-[15px] max-w-xl leading-relaxed">
              Tes statistiques, domaines maîtrisés et activité récente.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full sm:w-auto sm:min-w-[420px]">
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Zap className="w-3.5 h-3.5" /> XP
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {user.xp}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Flame className="w-3.5 h-3.5" /> Série
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {user.streak}<span className="text-sm text-muted ml-0.5">j</span>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Award className="w-3.5 h-3.5" /> Badges
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {badges.length}
              </div>
            </div>
            <div className="rounded-2xl border border-text/30 bg-text/8 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Activity className="w-3.5 h-3.5" /> Moy.
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {overallAvg > 0 ? `${overallAvg}%` : '—'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NIVEAU + PROGRESSION */}
      <section className="card-depth relative overflow-hidden p-5 sm:p-6 anim-rise anim-rise-1">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-40 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.10), transparent 70%)' }}
        />
        <div className="relative grid lg:grid-cols-[1fr_2fr] gap-6 items-center">
          <div>
            <div className="module-eyebrow flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Niveau actuel
            </div>
            <div className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              {lvl.current.title}
            </div>
            <div className="text-sm text-muted mt-2">
              Prochain palier · <span className="text-text">{lvl.next.title}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-end justify-between gap-3">
              <div className="text-[11px] uppercase tracking-wider text-muted">
                {user.xp} XP cumulés
              </div>
              <div className="font-display text-2xl font-semibold tabular-nums tracking-tight">
                {Math.round(lvl.progress)}<span className="text-muted text-base ml-0.5">%</span>
              </div>
            </div>
            <div className="h-2 rounded-full bg-bg-elev overflow-hidden">
              <div
                className="h-full bg-text transition-all duration-700 ease-smooth"
                style={{ width: `${lvl.progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted tabular-nums">
              <span>{user.xp} XP</span>
              <span>{Math.max(0, Math.round((lvl.next.xpRequired - user.xp)))} XP restants</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS GLOBALES */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Stat icon={BookOpen} label="Cours terminés" value={lessonsCompleted} />
        <Stat icon={Target} label="Quiz passés" value={quizAttempts.length} sub={`${avgQuiz}% moy.`} />
        <Stat icon={Layers} label="Examens" value={examAttempts.length} sub={`${avgExam}% moy.`} />
        <Stat icon={MessageSquareQuote} label="Entretiens" value={interviews.length} sub={`${avgInterview}/100`} />
        <Stat icon={Wrench} label="Diagnostics" value={diagnostics.length} sub={`${avgDiag}/100`} />
      </section>

      {/* GRAPHIQUES */}
      <section className="grid lg:grid-cols-2 gap-4">
        <div className="module-frame anim-rise anim-rise-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">XP gagnés (14 derniers jours)</h2>
            <span className="badge-muted tabular-nums">
              {days.reduce((s, d) => s + d.xp, 0)} XP
            </span>
          </div>
          <ActivityChart data={days} />
        </div>
        <div className="module-frame anim-rise anim-rise-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Maîtrise par domaine</h2>
            <span className="badge-muted">{domainStats.filter(d => d.value > 0).length} actifs</span>
          </div>
          <MasteryChart data={domainStats} />
        </div>
      </section>

      {/* DOMAINES FORTS / FAIBLES */}
      <section className="grid lg:grid-cols-2 gap-4">
        <div className="module-frame anim-rise anim-rise-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <Trophy className="w-4 h-4" /> Domaines forts
            </h2>
            <span className="badge-muted tabular-nums">{strong.length}</span>
          </div>
          {strong.length === 0 ? (
            <EmptyState label="Pas encore assez de données." />
          ) : (
            <ul className="space-y-2">
              {strong.map(d => (
                <li
                  key={d.key}
                  className="rounded-xl border border-border bg-bg-elev/40 p-3 flex items-center gap-3"
                >
                  <span className="flex-1 min-w-0 truncate font-medium">{d.label}</span>
                  <div className="hidden sm:block w-24 h-1.5 rounded-full bg-bg overflow-hidden">
                    <div className="h-full bg-text" style={{ width: `${d.value}%` }} />
                  </div>
                  <span className="font-display font-semibold tabular-nums text-text w-12 text-right">
                    {d.value}<span className="text-muted text-xs font-normal">%</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="module-frame anim-rise anim-rise-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <Target className="w-4 h-4" /> À renforcer
            </h2>
            <span className="badge-muted tabular-nums">{weak.length}</span>
          </div>
          {weak.length === 0 ? (
            <EmptyState label="Aucun domaine critique." />
          ) : (
            <ul className="space-y-2">
              {weak.map(d => (
                <li
                  key={d.key}
                  className="rounded-xl border border-border bg-bg-elev/40 p-3 flex items-center gap-3"
                >
                  <span className="flex-1 min-w-0 truncate font-medium">{d.label}</span>
                  <div className="hidden sm:block w-24 h-1.5 rounded-full bg-bg overflow-hidden">
                    <div className="h-full bg-text/70" style={{ width: `${d.value}%` }} />
                  </div>
                  <Link
                    href={`/quiz?category=${d.key}`}
                    className="btn-outline text-xs shrink-0"
                  >
                    S&apos;entraîner · {d.value}%
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* BADGES */}
      {badges.length > 0 && (
        <section className="module-frame anim-rise anim-rise-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <Trophy className="w-4 h-4" /> Tous tes badges
            </h2>
            <span className="badge-muted tabular-nums">{badges.length}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {badges.map(b => (
              <div
                key={b.badge.id}
                className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-bg-elev border border-border lift-3d"
              >
                <span className="font-display tabular-nums text-text-soft">
                  {b.badge.icon}
                </span>
                <span>{b.badge.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RACCOURCIS */}
      <section className="grid sm:grid-cols-3 gap-3">
        <Link
          href="/revisions"
          className="card-depth relative overflow-hidden lift-3d group p-5 anim-rise anim-rise-1"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-40 blur-3xl"
            style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.08), transparent 70%)' }}
          />
          <div className="relative flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl grid place-items-center bg-bg-elev border border-border shrink-0">
              <Clock className="w-5 h-5 text-text" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-display font-semibold tracking-tight">Révisions</div>
              <div className="text-xs text-muted mt-0.5">Réviser les termes clés</div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
        <Link
          href="/entretiens"
          className="card-depth relative overflow-hidden lift-3d group p-5 anim-rise anim-rise-2"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-40 blur-3xl"
            style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.08), transparent 70%)' }}
          />
          <div className="relative flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl grid place-items-center bg-bg-elev border border-border shrink-0">
              <MessageSquareQuote className="w-5 h-5 text-text" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-display font-semibold tracking-tight">Entretiens</div>
              <div className="text-xs text-muted mt-0.5">S&apos;entraîner à l&apos;oral</div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
        <Link
          href="/diagnostic"
          className="card-depth relative overflow-hidden lift-3d group p-5 anim-rise anim-rise-3"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-40 blur-3xl"
            style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.08), transparent 70%)' }}
          />
          <div className="relative flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl grid place-items-center bg-bg-elev border border-border shrink-0">
              <Wrench className="w-5 h-5 text-text" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-display font-semibold tracking-tight">Diagnostics</div>
              <div className="text-xs text-muted mt-0.5">Résoudre des pannes</div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      </section>
    </div>
  );
}

function Stat({
  icon: Icon, label, value, sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  sub?: string;
}) {
  return (
    <div className="card p-4 flex flex-col gap-1.5 lift-3d">
      <div className="flex items-center justify-between">
        <Icon className="w-4 h-4 text-muted" />
        <span className="badge-muted tabular-nums">{value}</span>
      </div>
      <div className="text-[11px] uppercase tracking-wider text-muted">{label}</div>
      {sub && <div className="text-xs text-text-soft tabular-nums">{sub}</div>}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-bg-elev/40 p-6 text-center">
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}

// Silence unused imports for parity
void ShieldCheck;
