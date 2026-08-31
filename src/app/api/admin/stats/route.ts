import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();
    console.log('Fetching admin stats...');
    
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const results = await Promise.allSettled([
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

    const getValue = (index: number) => {
      const res = results[index];
      if (res?.status === 'fulfilled') return res.value;
      console.error(`Stat index ${index} failed:`, res?.reason);
      return null;
    };

    const uv24h = (getValue(23) as unknown as Array<unknown>)?.length || 0;
    const uv7d = (getValue(25) as unknown as Array<unknown>)?.length || 0;
    const uv30d = (getValue(27) as unknown as Array<unknown>)?.length || 0;

    return NextResponse.json({
      lessons: getValue(1),
      questions: getValue(2),
      exams: getValue(3),
      glossary: getValue(4),
      scenarios: getValue(5),
      components: getValue(6),
      userCount: getValue(7),
      planCounts: getValue(8),
      totalAiMessages: getValue(9),
      avgExamScore: getValue(10),
      newUsers24h: getValue(11),
      newUsers7d: getValue(12),
      newUsers30d: getValue(13),
      activeUsers24h: getValue(14),
      totalReviewCards: getValue(15),
      totalBadges: getValue(16),
      totalReviews: getValue(17),
      avgQuizScore: getValue(18),
      recentInterviews: getValue(19),
      recentDiagnostics: getValue(20),
      pv24h: getValue(22),
      uv24h: uv24h,
      pv7d: getValue(24),
      uv7d: uv7d,
      pv30d: getValue(26),
      uv30d: uv30d,
      topPages: getValue(28)
    });
  } catch (e) {
    console.error('Stats API Error:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
