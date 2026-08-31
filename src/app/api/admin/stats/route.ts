import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();
    
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
      uv24hCount,
      pv7d,
      uv7dCount,
      pv30d,
      uv30dCount,
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
      prisma.pageView.groupBy({ 
        where: { createdAt: { gte: last24h } }, 
        by: ['visitorId'], 
        _count: { visitorId: true } 
      }).then(res => res.length),
      prisma.pageView.count({ where: { createdAt: { gte: last7d } } }),
      prisma.pageView.groupBy({ 
        where: { createdAt: { gte: last7d } }, 
        by: ['visitorId'], 
        _count: { visitorId: true } 
      }).then(res => res.length),
      prisma.pageView.count({ where: { createdAt: { gte: last30d } } }),
      prisma.pageView.groupBy({ 
        where: { createdAt: { gte: last30d } }, 
        by: ['visitorId'], 
        _count: { visitorId: true } 
      }).then(res => res.length),
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

    return NextResponse.json({
      lessons, questions, exams, glossary, scenarios, components,
      userCount, planCounts, totalAiMessages, avgExamScore,
      newUsers24h, newUsers7d, newUsers30d, activeUsers24h,
      totalReviewCards, totalBadges, totalReviews, avgQuizScore,
      recentInterviews, recentDiagnostics,
      pv24h, uv24h: uv24hCount, pv7d, uv7d: uv7dCount, pv30d, uv30d: uv30dCount, topPages
    });
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}
