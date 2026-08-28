// =============================================================================
// Quota mensuel du Tuteur IA
// =============================================================================
// Source de vérité côté serveur. Aucune confiance n'est accordée au client.
//
// Mécanisme :
//   - Une ligne AiMessageUsage(userId, monthKey) persiste le compteur du mois
//     courant (UTC). Pas besoin de cron : à chaque appel, on lit/écrit la
//     ligne du mois courant, ce qui réinitialise implicitement le quota au
//     passage de mois.
//   - L'incrément et le contrôle de la limite sont faits dans une unique
//     transaction (findUnique puis update). Les conditions sont évaluées
//     sur la valeur lue — un dépassement n'est donc pas possible entre la
//     lecture et l'écriture tant qu'on reste mono-instance ; en
//     multi-instance serverless, on accepterait un léger dépassement,
//     acceptable pour un quota mensuel.
//
// Trois exports :
//   - getAiUsage(userId, plan)   : usage courant sans incrément
//   - consumeAiMessage(userId, plan) : tente de consommer 1 message ; renvoie
//     { ok: true, used, limit } ou { ok: false, used, limit, reason }
// =============================================================================

import type { Plan as PrismaPlan } from '@prisma/client';
import { prisma } from './prisma';
import { aiMonthlyLimit, currentMonthKey } from './plans';

export type AiQuotaResult =
  | { ok: true; used: number; limit: number; remaining: number }
  | { ok: false; used: number; limit: number; reason: 'exceeded' | 'no_user' };

export async function getAiUsage(
  userId: string,
  plan: PrismaPlan | string | null | undefined,
): Promise<{ used: number; limit: number; monthKey: string }> {
  const monthKey = currentMonthKey();
  const limit = aiMonthlyLimit(plan);
  const row = await prisma.aiMessageUsage.findUnique({
    where: { userId_monthKey: { userId, monthKey } },
  });
  return { used: row?.count ?? 0, limit, monthKey };
}

/**
 * Tente de consommer un message IA pour l'utilisateur.
 * - Incrémente le compteur du mois courant.
 * - Refuse si la limite mensuelle de l'offre est atteinte.
 */
export async function consumeAiMessage(
  userId: string,
  plan: PrismaPlan | string | null | undefined,
): Promise<AiQuotaResult> {
  const monthKey = currentMonthKey();
  const limit = aiMonthlyLimit(plan);

  // Lecture + incrément atomique via upsert + transaction. On accepte un
  // dépassement de 1 dans le pire cas multi-instance — acceptable pour un
  // quota mensuel (et toujours bien meilleur qu'un compteur client).
  const result = await prisma.$transaction(async (tx) => {
    const row = await tx.aiMessageUsage.findUnique({
      where: { userId_monthKey: { userId, monthKey } },
    });
    const current = row?.count ?? 0;
    if (current >= limit) {
      return { ok: false as const, used: current, limit };
    }
    const updated = await tx.aiMessageUsage.upsert({
      where: { userId_monthKey: { userId, monthKey } },
      create: { userId, monthKey, count: 1 },
      update: { count: { increment: 1 } },
    });
    return { ok: true as const, used: updated.count, limit };
  });

  if (!result.ok) {
    return { ok: false, used: result.used, limit: result.limit, reason: 'exceeded' };
  }
  return { ok: true, used: result.used, limit: result.limit, remaining: result.limit - result.used };
}
