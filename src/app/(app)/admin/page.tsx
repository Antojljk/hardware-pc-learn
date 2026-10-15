import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import AdminDashboardClient from './AdminDashboardClient';
import { prisma } from '@/lib/prisma';
import { AdminStats } from '@/types/admin';

// Logic shared with the API route to avoid duplication
async function getAdminStats(): Promise<AdminStats> {
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const safeCount = async (promise: Promise<number>) => {
    try { return await promise; } catch { return 0; }
  };

  const safeAgg = async <T>(promise: Promise<T>, def: T) => {
    try { return await promise; } catch { return def; }
  };

  const [content, userStats, performance, traffic, ai] = await Promise.all([
    (async () => ({
      lessons: await safeCount(prisma.lesson.count()),
      questions: await safeCount(prisma.quizQuestion.count()),
      exams: await safeCount(prisma.exam.count()),
      glossary: await safeCount(prisma.glossaryTerm.count()),
      scenarios: await safeCount(prisma.diagnosticScenario.count()),
      components: await safeCount(prisma.component.count()),
    })(),
    (async () => {
      const total = await safeCount(prisma.user.count());
      const planDist = await safeAgg(prisma.user.groupBy({ by: ['plan'], _count: { _all: true } }), []);
      return {
        total,
        new24h: await safeCount(prisma.user.count({ where: { createdAt: { gte: last24h } } })),
        new7d: await safeCount(prisma.user.count({ where: { createdAt: { gte: last7d } } })),
        new30d: await safeCount(prisma.user.count({ where: { createdAt: { gte: last30d } } })),
        active24h: await safeCount(prisma.user.count({ where: { lastActiveAt: { gte: last24h } } })),
        planDistribution: (planDist as any[]).map(p => ({ plan: p.plan || 'UNKNOWN', count: p._count?._all || 0 })),
      };
    })(),
    (async () => {
      const examAvg = await safeAgg(prisma.examAttempt.aggregate({ _avg: { score: true } }), { _avg: { score: 0 } });
      const quizAvg = await safeAgg(prisma.quizAttempt.aggregate({ _avg: { score: true } }), { _avg: { score: 0 } });
      return {
        avgExamScore: examAvg._avg?.score || 0,
        avgQuizScore: quizAvg._avg?.score || 0,
        totalBadges: await safeCount(prisma.badgesOnUsers.count()),
        totalReviewCards: await safeCount(prisma.reviewCard.count()),
        totalReviews: await safeCount(prisma.review.count()),
      };
    })(),
    (async () => {
      const pv24h = await safeCount(prisma.pageView.count({ where: { createdAt: { gte: last24h } } }));
      const pv7d = await safeCount(prisma.pageView.count({ where: { createdAt: { gte: last7d } } }));
      const pv30d = await safeCount(prisma.pageView.count({ where: { createdAt: { gte: last30d } } }));
      const uv24hRaw = await safeAgg(prisma.pageView.groupBy({ where: { createdAt: { gte: last24h } }, by: ['visitorId'] }), []);
      const uv7dRaw = await safeAgg(prisma.pageView.groupBy({ where: { createdAt: { gte: last7d } }, by: ['visitorId'] }), []);
      const uv30dRaw = await safeAgg(prisma.pageView.groupBy({ where: { createdAt: { gte: last30d } }, by: ['visitorId'] }), []);
      const topPages = await safeAgg(prisma.pageView.groupBy({ by: ['url'], _count: { url: true }, orderBy: { _count: { url: 'desc' } }, take: 10 }), []);
      return {
        pv24h, uv24h: (uv24hRaw as any[]).length, pv7d, uv7d: (uv7dRaw as any[]).length, pv30d, uv30d: (uv30dRaw as any[]).length,
        topPages: (topPages as any[]).map(p => ({ url: p.url || '', count: p._count?.url || 0 })),
      };
    })(),
    (async () => {
      const aiUsage = await safeAgg(prisma.aiMessageUsage.aggregate({ _sum: { count: true } }), { _sum: { count: 0 } });
      return {
        totalMessages: aiUsage._sum?.count || 0,
        recentInterviews: await safeCount(prisma.interviewAttempt.count({ where: { createdAt: { gte: last7d } } })),
        recentDiagnostics: await safeCount(prisma.diagnosticAttempt.count({ where: { createdAt: { gte: last7d } } })),
      };
    })(),
  ]);

  return {
    content: content as any,
    users: userStats as any,
    performance: performance as any,
    traffic: traffic as any,
    aiSupport: ai as any,
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
