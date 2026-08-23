import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { grantXp, unlockBadges } from '@/lib/gamification';
import { INTERVIEW_QUESTIONS } from '@/lib/interview';
import { z } from 'zod';

const Schema = z.object({
  role: z.string(),
  level: z.string(),
  transcript: z.array(z.object({
    questionId: z.string(),
    answer: z.string(),
    evaluation: z.object({ score: z.number(), matched: z.array(z.string()), missing: z.array(z.string()) }),
  })),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
  try {
    const { role, level, transcript } = Schema.parse(await req.json());
    const avg = Math.round(transcript.reduce((s, t) => s + t.evaluation.score, 0) / transcript.length);
    const xpAwarded = Math.round(avg * 0.6);

    // Feedback global
    const allMatched = transcript.flatMap(t => t.evaluation.matched);
    const allMissing = transcript.flatMap(t => t.evaluation.missing);
    const strengths = Array.from(new Set(allMatched)).slice(0, 5);
    const improvements = Array.from(new Set(allMissing)).slice(0, 5);
    if (improvements.length === 0) improvements.push('Aucune lacune majeure détectée.');

    await prisma.interviewAttempt.create({
      data: {
        userId: user.id, role, level, score: avg,
        transcript: JSON.stringify(transcript.map((t, i) => ({
          question: INTERVIEW_QUESTIONS.find(q => q.id === t.questionId)?.question || `Question ${i + 1}`,
          answer: t.answer, evaluation: t.evaluation,
        }))),
        feedback: JSON.stringify({ strengths, improvements }),
      },
    });
    await grantXp(user.id, xpAwarded);
    await unlockBadges(user.id);

    return NextResponse.json({
      ok: true, score: avg, xpAwarded,
      feedback: { strengths, improvements },
      transcript: transcript.map((t, i) => ({ question: INTERVIEW_QUESTIONS.find(q => q.id === t.questionId)?.question })),
    });
  } catch {
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}
