import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { 
  Settings, BookOpen, Brain, Wrench, Library, Sparkles, 
  Users, UserPlus, Activity, Cpu, MessageSquare, Trophy,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'Admin Dashboard — HardwarePC' };

export default async function AdminPage() {
  try {
    await requireAdmin();
  } catch {
    redirect('/dashboard');
  }

  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    , lessons, questions, exams, glossary, scenarios, components,
    userCount,
    planCounts,
    totalAiMessages,
    avgExamScore,
    newUsers24h,
    newUsers7d,
    newUsers30d,
    activeUsers24h,
    totalConfigs,
    totalReviewCards,
    totalBadges,
    totalReviews,
    avgQuizScore,
    recentInterviews,
    recentDiagnostics
  ] = await Promise.all([
    prisma.track.count(),
    prisma.lesson.count(),
    prisma.quizQuestion.count(),
    prisma.exam.count(),
    prisma.glossaryTerm.count(),
    prisma.diagnosticScenario.count(),
    prisma.component.count(),
    prisma.user.count(),
    prisma.user.groupBy({ by: ['plan'], _count: { _all: true } }),
    prisma.aiMessageUsage.aggregate({ _sum: { count: true } }),
    prisma.examAttempt.aggregate({ _avg: { score: true } }),
    prisma.user.count({ where: { createdAt: { gte: last24h } } }),
    prisma.user.count({ where: { createdAt: { gte: last7d } } }),
    prisma.user.count({ where: { createdAt: { gte: last30d } } }),
    prisma.user.count({ where: { lastActiveAt: { gte: last24h } } }),
    prisma.configBuild.count(),
    prisma.reviewCard.count(),
    prisma.badgesOnUsers.count(),
    prisma.review.count(),
    prisma.quizAttempt.aggregate({ _avg: { score: true } }),
    prisma.interviewAttempt.count({ where: { createdAt: { gte: last7d } } }),
    prisma.diagnosticAttempt.count({ where: { createdAt: { gte: last7d } } }),
  ]);

  const quickStats = [
    { label: 'Utilisateurs', value: userCount, icon: Users, color: 'text-blue-500' },
    { label: 'Nouveaux (24h)', value: newUsers24h, icon: UserPlus, color: 'text-green-500' },
    { label: 'Actifs (24h)', value: activeUsers24h, icon: Activity, color: 'text-orange-500' },
    { label: 'Configs PC', value: totalConfigs, icon: Cpu, color: 'text-purple-500' },
  ];

  const contentItems = [
    { href: '/admin/cours',   icon: BookOpen, label: 'Cours', count: lessons, desc: 'Cours et parcours' },
    { href: '/admin/quiz',    icon: Brain,    label: 'Quiz', count: questions, desc: 'Banque de questions' },
    { href: '/admin/examens', icon: Sparkles, label: 'Examens', count: exams, desc: 'Examens blancs' },
    { href: '/admin/glossaire', icon: Library, label: 'Glossaire', count: glossary, desc: 'Termes techniques' },
    { href: '/admin/diagnostics', icon: Wrench, label: 'Diagnostics', count: scenarios, desc: 'Scénarios de panne' },
    { href: '/admin/composants', icon: Settings, label: 'Composants', count: components, desc: 'Catalogue composants' },
  ];

  return (
    <div className="space-y-6">
      <section className="module-hero">
        <div className="module-eyebrow">Analytics</div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight flex items-center gap-2 mt-2">
          <Settings className="w-6 h-6 text-text" /> Dashboard Administration
        </h1>
        <p className="text-muted text-[15px] mt-2 max-w-xl">Vue d&apos;ensemble en temps réel de l&apos;activité et du contenu du site.</p>
      </section>

      {/* Top Quick Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickStats.map((s, idx) => (
          <div key={s.label} className={`module-frame lift-3d anim-rise anim-rise-${(idx % 4) + 1} flex items-center gap-4 p-4`}>
            <div className={`w-12 h-12 rounded-2xl grid place-items-center bg-bg-elev border border-border ${s.color}`}>
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-display font-bold tabular-nums">{s.value}</div>
              <div className="text-xs text-muted font-medium">{s.label}</div>
            </div>
          </div>
        ))}
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Content Management Links */}
        <section className="lg:col-span-2 space-y-6">
          <div className="module-frame anim-rise anim-rise-1">
            <h2 className="section-title mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Gestion du contenu
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {contentItems.map((i) => (
                <Link key={i.href} href={i.href} className="group p-3 rounded-xl border border-border hover:bg-bg-elev transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg grid place-items-center bg-bg-elev border border-border group-hover:border-text/30">
                      <i.icon className="w-4 h-4 text-text" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{i.label}</div>
                      <div className="text-[11px] text-muted">{i.desc}</div>
                    </div>
                  </div>
                  <div className="font-display text-lg font-bold tabular-nums">{i.count}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* User Growth & Activity */}
          <div className="module-frame anim-rise anim-rise-2">
            <h2 className="section-title mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Croissance & Engagement
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-3 rounded-xl bg-bg-elev border border-border text-center">
                <div className="text-xs text-muted mb-1">7 derniers jours</div>
                <div className="text-xl font-display font-bold text-text">+{newUsers7d}</div>
              </div>
              <div className="p-3 rounded-xl bg-bg-elev border border-border text-center">
                <div className="text-xs text-muted mb-1">30 derniers jours</div>
                <div className="text-xl font-display font-bold text-text">+{newUsers30d}</div>
              </div>
              <div className="p-3 rounded-xl bg-bg-elev border border-border text-center">
                <div className="text-xs text-muted mb-1">Taux d&apos;activité (24h)</div>
                <div className="text-xl font-display font-bold text-text">
                  {userCount > 0 ? ((activeUsers24h / userCount) * 100).toFixed(1) : '0'}%
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sidebar Stats */}
        <aside className="space-y-6">
          <section className="module-frame anim-rise anim-rise-3">
            <h2 className="section-title mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4" /> Performance
            </h2>
            <ul className="text-sm space-y-3 text-muted">
              <li className="flex justify-between">
                <span>Score moyen Examens</span>
                <strong className="text-text">{avgExamScore?._avg.score?.toFixed(1) ?? '0'}%</strong>
              </li>
              <li className="flex justify-between">
                <span>Score moyen Quiz</span>
                <strong className="text-text">{avgQuizScore?._avg.score?.toFixed(1) ?? '0'}%</strong>
              </li>
              <li className="flex justify-between">
                <span>Badges débloqués</span>
                <strong className="text-text">{totalBadges}</strong>
              </li>
              <li className="flex justify-between">
                <span>Cartes de révision</span>
                <strong className="text-text">{totalReviewCards}</strong>
              </li>
              <li className="flex justify-between">
                <span>Avis clients</span>
                <strong className="text-text">{totalReviews}</strong>
              </li>
            </ul>
          </section>

          <section className="module-frame anim-rise anim-rise-4">
            <h2 className="section-title mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" /> Répartition Plans
            </h2>
            <div className="space-y-2">
              {planCounts.map(p => (
                <div key={p.plan} className="flex items-center gap-3">
                  <span className="text-xs text-muted w-20">{p.plan}</span>
                  <div className="flex-1 h-2 bg-bg-elev rounded-full overflow-hidden border border-border">
                    <div 
                      className="h-full bg-text" 
                      style={{ width: `${(p._count._all / userCount) * 100}%` }} 
                    />
                  </div>
                  <span className="text-xs font-semibold tabular-nums w-8 text-right">{p._count._all}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="module-frame anim-rise anim-rise-1">
            <h2 className="section-title mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> IA & Support
            </h2>
            <div className="p-3 rounded-xl bg-bg-elev border border-border">
              <div className="text-xs text-muted mb-1">Messages Tuteur total</div>
              <div className="text-2xl font-display font-bold tabular-nums text-text">
                {totalAiMessages?._sum.count ?? 0}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="p-2 rounded-lg border border-border text-center">
                <div className="text-[10px] text-muted">Entretiens (7j)</div>
                <div className="text-sm font-bold tabular-nums">{recentInterviews}</div>
              </div>
              <div className="p-2 rounded-lg border border-border text-center">
                <div className="text-[10px] text-muted">Diagnostics (7j)</div>
                <div className="text-sm font-bold tabular-nums">{recentDiagnostics}</div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
