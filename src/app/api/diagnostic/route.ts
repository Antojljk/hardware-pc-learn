import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { grantXp, unlockBadges } from '@/lib/gamification';
import { SCENARIOS, SCENARIO_STEPS } from '@/content/diagnostics';
import { z } from 'zod';
import { canAccessDiagnostic } from '@/lib/content-access';
import { buildLockedResponse } from '@/lib/plan-guard';

const Schema = z.object({ slug: z.string(), stepsChosen: z.array(z.string()) });

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 });

  // Le diagnostic complet est désormais réservé à PRO+. La page
  // serveur applique déjà cette restriction ; on la confirme ici pour
  // qu'aucun client ne puisse soumettre une tentative en bypassant
  // l'UI.
  if (!canAccessDiagnostic(user.plan)) {
    return buildLockedResponse('diagnostic_full', 'PRO');
  }
  try {
    const { slug, stepsChosen } = Schema.parse(await req.json());
    const scenario = SCENARIOS.find(s => s.slug === slug);
    if (!scenario) return NextResponse.json({ error: 'Scénario introuvable' }, { status: 404 });

    const ideal = scenario.idealSequence;
    const optional = scenario.optionalAcceptable;
    const wrong = scenario.wrongMoves;

    const good: string[] = [];
    const missed: string[] = [];
    const wrongChosen: string[] = [];
    let score = 0;

    // Pour chaque étape idéale, bonus si choisie tôt
    ideal.forEach((stepId) => {
      if (stepsChosen.includes(stepId)) {
        score += 25;
        const s = SCENARIO_STEPS.find(x => x.id === stepId);
        if (s) good.push(s.label);
      } else {
        const s = SCENARIO_STEPS.find(x => x.id === stepId);
        if (s) missed.push(s.label);
      }
    });

    // Bonus steps optionnels pertinents
    stepsChosen.forEach(stepId => {
      if (optional.includes(stepId)) score += 5;
      if (wrong.includes(stepId)) {
        score -= 15;
        const s = SCENARIO_STEPS.find(x => x.id === stepId);
        if (s) wrongChosen.push(s.label);
      }
    });

    // Bonus si procédure courte et efficace (pas trop de bruit)
    if (stepsChosen.length <= ideal.length + 2) score += 10;

    score = Math.max(0, Math.min(100, score));

    await prisma.diagnosticAttempt.create({
      data: {
        userId: user.id, scenarioId: scenario.slug, score,
        stepsChosen: JSON.stringify(stepsChosen),
        evaluation: JSON.stringify({ good, missed, wrong: wrongChosen }),
      },
    });
    const xpAwarded = Math.round(score * 0.5);
    await grantXp(user.id, xpAwarded);
    await unlockBadges(user.id);

    return NextResponse.json({
      ok: true, score, xpAwarded,
      evaluation: { good, missed, wrong: wrongChosen },
    });
  } catch {
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}
