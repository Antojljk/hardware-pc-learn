import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { grantXp, unlockBadges } from '@/lib/gamification';
import { QUESTIONS } from '@/content/quizzes';

const Schema = z.object({
  mode: z.string(),
  category: z.string().optional(),
  details: z.array(z.object({
    questionId: z.string(),
    chosen: z.union([z.string(), z.array(z.string())]),
    correct: z.boolean(),
  })),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
  try {
    const data = Schema.parse(await req.json());
    const total = data.details.length;
    const score = data.details.filter(d => d.correct).length;
    const xpAwarded = score * 10;

    await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        mode: data.mode,
        category: data.category,
        score,
        total,
        details: JSON.stringify(data.details),
      },
    });
    await grantXp(user.id, xpAwarded);
    const newBadges = await unlockBadges(user.id);

    // Renvoie les explications pour chaque mauvaise réponse
    const reviews = data.details
      .filter(d => !d.correct)
      .map(d => {
        const q = QUESTIONS.find(x => x.id === d.questionId);
        return q ? { questionId: d.questionId, prompt: q.prompt, explanation: q.explanation, correctAnswer: q.answer, yourAnswer: d.chosen } : null;
      })
      .filter(Boolean);

    return NextResponse.json({ ok: true, score, total, xpAwarded, newBadges, reviews });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}
