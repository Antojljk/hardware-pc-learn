import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { grantXp, unlockBadges } from '@/lib/gamification';
import { QUESTIONS, EXAMS } from '@/content/quizzes';
import { z } from 'zod';
import { canAccess } from '@/lib/plans';
import { buildLockedResponse } from '@/lib/plan-guard';

export async function GET() {
  return NextResponse.json({ exams: EXAMS });
}

const SubmitSchema = z.object({
  examSlug: z.string(),
  answers: z.record(z.string(), z.string()),
  timeSpent: z.number(),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 });

  // Examens = feature payante (ESSENTIEL+ pour les basiques, PRO+ pour les complets).
  if (!canAccess(user.plan, 'exams_basic', user.id)) {
    return buildLockedResponse('exams_basic', 'ESSENTIEL');
  }
  try {
    const { examSlug, answers, timeSpent } = SubmitSchema.parse(await req.json());
    const exam = EXAMS.find(e => e.slug === examSlug);
    if (!exam) return NextResponse.json({ error: 'Examen introuvable' }, { status: 404 });

    const details = exam.questionIds.map(qid => {
      const q = QUESTIONS.find(x => x.id === qid);
      const chosen = answers[qid];
      const correct = q ? String(chosen || '').trim().toLowerCase() === String(q.answer).trim().toLowerCase() : false;
      return { questionId: qid, chosen, correct, category: q?.category };
    });
    const score = details.filter(d => d.correct).length;
    const total = details.length;
    const xpAwarded = score * 12;

    await prisma.examAttempt.create({
      data: {
        userId: user.id,
        examId: examSlug,
        score, total, timeSpentSec: timeSpent,
        details: JSON.stringify(details),
      },
    });
    await grantXp(user.id, xpAwarded);
    await unlockBadges(user.id);

    // Domain breakdown
    const byCat: Record<string, { correct: number; total: number }> = {};
    details.forEach(d => {
      if (!d.category) return;
      byCat[d.category] = byCat[d.category] || { correct: 0, total: 0 };
      byCat[d.category].total++;
      if (d.correct) byCat[d.category].correct++;
    });
    const domainStats = Object.entries(byCat).map(([cat, v]) => ({ category: cat, percent: Math.round((v.correct / v.total) * 100), correct: v.correct, total: v.total }));
    domainStats.sort((a, b) => b.percent - a.percent);

    return NextResponse.json({
      ok: true, score, total, timeSpent, xpAwarded,
      weakDomains: domainStats.slice(-3),
      strongDomains: domainStats.slice(0, 3),
      domainStats,
      passPercent: 70,
    });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}
