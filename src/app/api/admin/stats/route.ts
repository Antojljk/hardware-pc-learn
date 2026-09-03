import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

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

    const uv24h = (getValue(41) as unknown as Array<unknown>)?.length || 0;
    const uv7d = (getValue(43) as unknown as Array<unknown>)?.length || 0;
    const uv30d = (getValue(45) as unknown as Array<unknown>)?.length || 0;

    return NextResponse.json({
      lessons: Number(getValue(1)) || 0,
      questions: Number(getValue(2)) || 0,
      exams: Number(getValue(3)) || 0,
      glossary: Number(getValue(4)) || 0,
      scenarios: Number(getValue(5)) || 0,
      components: Number(getValue(6)) || 0,
      userCount: Number(getValue(7)) || 0,
      planCounts: (getValue(8) as unknown as Array<Record<string, unknown>>)?.map(p => ({ 
        plan: String(p.plan || 'UNKNOWN'), 
        count: (p._count as Record<string, unknown>)?.['_all' as string] ?? 0 
      })) || [],
      totalAiMessages: (getValue(9) as unknown as Record<string, Record<string, unknown>>)?._sum?.count ?? 0,
      avgExamScore: (getValue(10) as unknown as Record<string, Record<string, unknown>>)?._avg?.score ?? 0,
      newUsers24h: Number(getValue(11)) || 0,
      newUsers7d: Number(getValue(12)) || 0,
      newUsers30d: Number(getValue(13)) || 0,
      activeUsers24h: Number(getValue(14)) || 0,
      totalReviewCards: Number(getValue(15)) || 0,
      totalBadges: Number(getValue(16)) || 0,
      totalReviews: Number(getValue(17)) || 0,
      avgQuizScore: (getValue(18) as unknown as Record<string, Record<string, unknown>>)?._avg?.score ?? 0,
      recentInterviews: Number(getValue(19)) || 0,
      recentDiagnostics: Number(getValue(20)) || 0,
      pv24h: Number(getValue(40)) || 0,
      uv24h: uv24h,
      pv7d: Number(getValue(42)) || 0,
      uv7d: uv7d,
      pv30d: Number(getValue(44)) || 0,
      uv30d: uv30d,
      topPages: (getValue(46) as unknown as Array<Record<string, unknown>>)?.map(p => ({ 
        url: String(p.url || ''), 
        count: (p._count as Record<string, unknown>)?.url ?? 0 
      })) || []
    });
  } catch (e) {
    console.error('Stats API Error:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
