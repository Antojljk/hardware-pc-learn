import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import AdminDashboardClient from './AdminDashboardClient';
import { prisma } from '@/lib/prisma';

export const metadata = { title: 'Admin Dashboard — HardwarePC' };

async function getAdminStats() {
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
    ,
    totalReviewCards,
    totalBadges,
    totalReviews,
    avgQuizScore,
    recentInterviews,
    recentDiagnostics,
    pv24h,
    uv24h,
    pv7d,
    uv7d,
    pv30d,
    uv30d,
    topPages,
    ,
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
    prisma.pageView.count({ where: { createdAt: { gte: last24h } } }),
    prisma.pageView.groupBy({ where: { createdAt: { gte: last24h } }, by: ['visitorId'], _count: { visitorId: true } }),
    prisma.pageView.count({ where: { createdAt: { gte: last7d } } }),
    prisma.pageView.groupBy({ where: { createdAt: { gte: last7d } }, by: ['visitorId'], _count: { visitorId: true } }),
    prisma.pageView.count({ where: { createdAt: { gte: last30d } } }),
    prisma.pageView.groupBy({ where: { createdAt: { gte: last30d } }, by: ['visitorId'], _count: { visitorId: true } }),
    prisma.pageView.groupBy({
      by: ['url'],
      _count: { url: true },
      orderBy: { _count: { url: 'desc' } },
      take: 10,
    }),
    prisma.pageView.groupBy({
      by: ['createdAt'],
      _count: { url: true },
      where: { createdAt: { gte: last30d } },
    })
  ]);

  return {
    lessons, questions, exams, glossary, scenarios, components,
    userCount, planCounts,     totalAiMessages: totalAiMessages._sum.count, avgExamScore,
    newUsers24h, newUsers7d, newUsers30d, activeUsers24h,
    totalReviewCards, totalBadges, totalReviews, avgQuizScore,
    recentInterviews, recentDiagnostics,
    pv24h, uv24h: uv24h.length, pv7d, uv7d: uv7d.length, pv30d, uv30d: uv30d.length, topPages
  };
}

export default async function AdminPage() {
  try {
    await requireAdmin();
  } catch {
    redirect('/dashboard');
  }

  return <AdminDashboardClient initialData={await getAdminStats()} />;
}
