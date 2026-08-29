import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { grantXp } from '@/lib/gamification';
import { QUESTIONS } from '@/content/quizzes';
import { canAccessQuestion, filterQuestionsForPlan } from '@/lib/content-access';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get('category');
  const count = Number(url.searchParams.get('count') ?? 10);
  const mode = url.searchParams.get('mode') ?? 'free';

  const user = await getCurrentUser();

  // Filtre serveur strict : on ne propose QUE les questions accessibles
  // selon le plan. Le client ne reçoit jamais un id de question
  // verrouillée.
  let pool = filterQuestionsForPlan(user?.plan, QUESTIONS);
  if (category) pool = pool.filter(q => q.category === category);
  const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length));

  // En mode adaptatif, on ajuste difficulté en fonction de l'historique
  if (mode === 'adaptive') {
    if (user) {
      const recent = await prisma.quizAttempt.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 5 });
      const avgRecent = recent.length ? recent.reduce((s, a) => s + a.score / Math.max(1, a.total), 0) / recent.length : 0.5;
      const targetDifficulty = avgRecent > 0.7 ? ['avance', 'expert'] : avgRecent > 0.5 ? ['intermediaire', 'avance'] : ['debutant', 'intermediaire'];
      const filtered = shuffled.filter(q => targetDifficulty.includes(q.difficulty));
      return NextResponse.json({ questions: filtered.length ? filtered : shuffled });
    }
  }

  // On cache la réponse correcte pour ne pas la泄露 au client
  return NextResponse.json({
    questions: shuffled.map(q => ({ id: q.id, type: q.type, category: q.category, difficulty: q.difficulty, prompt: q.prompt, choices: q.choices, xpReward: q.xpReward })),
  });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
  try {
    const { questionId, answer } = await req.json();
    // Garde-fou serveur : refuse de valider une réponse pour une
    // question qui n'est pas accessible au plan de l'utilisateur.
    if (!canAccessQuestion(user.plan, questionId)) {
      return NextResponse.json(
        { error: 'Accès refusé', code: 'PLAN_REQUIRED' },
        { status: 403 },
      );
    }
    const q = QUESTIONS.find(x => x.id === questionId);
    if (!q) return NextResponse.json({ error: 'Question introuvable' }, { status: 404 });

    const correct = typeof q.answer === 'string'
      ? String(answer).trim().toLowerCase() === q.answer.trim().toLowerCase()
      : Array.isArray(answer) && Array.isArray(q.answer) && answer.sort().join(',') === [...q.answer].sort().join(',');

    let xpGained = 0;
    if (correct) xpGained = q.xpReward;
    if (xpGained) await grantXp(user.id, xpGained);

    return NextResponse.json({
      correct,
      explanation: q.explanation,
      correctAnswer: q.answer,
      xpGained,
    });
  } catch {
    return NextResponse.json({ error: 'Erreur' }, { status: 400 });
  }
}
