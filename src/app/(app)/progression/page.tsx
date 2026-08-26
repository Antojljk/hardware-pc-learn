import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { DOMAINS, getLevel } from '@/lib/xp';
import { TrendingUp, Clock, Trophy, Target, BookOpen, MessageSquareQuote, Wrench, Hammer, ShieldCheck, BarChart3 } from 'lucide-react';
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
  const strong = [...domainStats].sort((a, b) => b.value - a.value).slice(0, 5);
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
      + lessonsCompleted * 0; // simplification
    days.push({ day: d.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit' }), xp: Math.round(dailyXp) });
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold flex items-center gap-2"><TrendingUp className="w-5 h-5 text-brand-blue" /> Progression</h1>
        <p className="text-text-soft text-sm">Tes statistiques, domaines maîtrisés et activité récente.</p>
      </header>

      {/* Niveau + série */}
      <section className="card p-5 grid sm:grid-cols-3 gap-4 bg-gradient-to-br from-bg-card to-bg-elev">
        <div>
          <div className="text-xs text-text-mute">Niveau</div>
          <div className="text-2xl font-bold">{lvl.current.title}</div>
          <div className="text-sm text-text-soft mt-1">{user.xp} XP · {Math.round(lvl.progress)}% vers {lvl.next.title}</div>
        </div>
        <div>
          <div className="text-xs text-text-mute">Série</div>
          <div className="text-2xl font-bold">🔥 {user.streak} jours</div>
        </div>
        <div>
          <div className="text-xs text-text-mute">Badges</div>
          <div className="text-2xl font-bold">{badges.length}</div>
        </div>
      </section>

      {/* Stats globales */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Stat icon={BookOpen} label="Cours terminés" value={lessonsCompleted} />
        <Stat icon={Target} label="Quiz passés" value={quizAttempts.length} sub={`${avgQuiz}% moy.`} />
        <Stat icon={BarChart3} label="Examens" value={examAttempts.length} sub={`${avgExam}% moy.`} />
        <Stat icon={MessageSquareQuote} label="Entretiens" value={interviews.length} sub={`${avgInterview}/100`} />
        <Stat icon={Wrench} label="Diagnostics" value={diagnostics.length} sub={`${avgDiag}/100`} />
      </section>

      {/* Graphiques */}
      <section className="grid lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="section-title mb-3">XP gagnés (14 derniers jours)</h2>
          <ActivityChart data={days} />
        </div>
        <div className="card p-5">
          <h2 className="section-title mb-3">Maîtrise par domaine</h2>
          <MasteryChart data={domainStats} />
        </div>
      </section>

      {/* Domaines forts/faibles */}
      <section className="grid lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="section-title mb-3 flex items-center gap-2"><Trophy className="w-4 h-4 text-success" /> Domaines forts</h2>
          {strong.length === 0 ? <p className="text-sm text-text-soft">Pas encore assez de données.</p> : (
            <ul className="space-y-2">
              {strong.map(d => (
                <li key={d.key} className="flex items-center justify-between">
                  <span>{d.label}</span>
                  <span className="font-semibold tabular-nums">{d.value}%</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="card p-5">
          <h2 className="section-title mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-warning" /> À renforcer</h2>
          {weak.length === 0 ? <p className="text-sm text-text-soft">Aucun domaine critique.</p> : (
            <ul className="space-y-2">
              {weak.map(d => (
                <li key={d.key} className="flex items-center justify-between">
                  <span>{d.label}</span>
                  <Link href={`/quiz?category=${d.key}`} className="btn-outline text-xs">S&apos;entraîner · {d.value}%</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Badges */}
      {badges.length > 0 && (
        <section className="card p-5">
          <h2 className="section-title mb-3 flex items-center gap-2"><Trophy className="w-4 h-4 text-warning" /> Tous tes badges</h2>
          <div className="flex flex-wrap gap-2">
            {badges.map(b => (
              <div key={b.badge.id} className="badge bg-bg-elev border-border px-3 py-1.5 text-sm">
                <span>{b.badge.icon}</span><span>{b.badge.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="grid sm:grid-cols-3 gap-3">
        <Link href="/revisions" className="card card-hover p-4 flex items-center gap-3">
          <Clock className="w-5 h-5 text-brand-blue" />
          <div><div className="font-medium">Révisions</div><div className="text-xs text-text-soft">Réviser les termes clés</div></div>
        </Link>
        <Link href="/entretiens" className="card card-hover p-4 flex items-center gap-3">
          <MessageSquareQuote className="w-5 h-5 text-brand-violet" />
          <div><div className="font-medium">Entretiens</div><div className="text-xs text-text-soft">S&apos;entraîner à l&apos;oral</div></div>
        </Link>
        <Link href="/diagnostic" className="card card-hover p-4 flex items-center gap-3">
          <Wrench className="w-5 h-5 text-warning" />
          <div><div className="font-medium">Diagnostics</div><div className="text-xs text-text-soft">Résoudre des pannes</div></div>
        </Link>
      </section>
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number | string; sub?: string }) {
  return (
    <div className="stat-card">
      <Icon className="w-4 h-4 text-brand-blue" />
      <div className="text-xs text-text-mute">{label}</div>
      <div className="text-xl font-bold">{value}</div>
      {sub && <div className="text-xs text-text-soft">{sub}</div>}
    </div>
  );
}

// Silence unused icons that are imported for sidebar parity
void Hammer; void ShieldCheck;
