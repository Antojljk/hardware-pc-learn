// =============================================================================
// Garde-fous d'accès aux fonctionnalités selon l'offre
// =============================================================================
// Helpers partagés par les pages serveur (Server Components) et les routes
// API. Ils s'appuient sur la bibliothèque `plans.ts` (source de vérité
// pour les features) et garantissent qu'un utilisateur ne peut pas
// contourner une restriction en entrant directement une URL ou en
// appelant une API.
//
// Trois exports principaux :
//   - requireFeature(user, feature) : jette `PlanRequiredError` si KO.
//   - assertFeature(user, feature)  : renvoie `{ ok, required }` sans
//     exception, utile pour les pages qui veulent afficher un état
//     verrouillé sans rediriger.
//   - buildLockedResponse(...)      : produit une réponse 403 standardisée
//     pour les routes API.
// =============================================================================

import { NextResponse } from 'next/server';
import {
  canAccess,
  isAtLeast,
  type FeatureKey,
  type PlanKey,
} from './plans';
import type { Plan as PrismaPlan, User } from '@prisma/client';

export class PlanRequiredError extends Error {
  status = 403;
  feature: FeatureKey;
  required: PlanKey;
  constructor(feature: FeatureKey, required: PlanKey) {
    super(`Fonctionnalité "${feature}" réservée à l'offre ${required} ou supérieure.`);
    this.feature = feature;
    this.required = required;
    this.name = 'PlanRequiredError';
  }
}

/** Jette si l'utilisateur n'a pas accès à la fonctionnalité. */
export function requireFeature(
  user: Pick<User, 'plan' | 'id'> | null | undefined,
  feature: FeatureKey,
  required: PlanKey,
): asserts user is Pick<User, 'plan' | 'id'> {
  if (!user) throw new PlanRequiredError(feature, required);
  if (!canAccess(user.plan, feature, user.id)) {
    throw new PlanRequiredError(feature, required);
  }
}

/** Variante sans exception — utile pour les Server Components. */
export function assertFeature(
  user: Pick<User, 'plan' | 'id'> | null | undefined,
  feature: FeatureKey,
  required: PlanKey,
): { ok: boolean; user: User | null; plan: PrismaPlan | null; required: PlanKey } {
  return {
    ok: !!user && canAccess(user.plan, feature, user.id),
    user: (user ?? null) as User | null,
    plan: user?.plan ?? null,
    required,
  };
}

/** Variante par palier de plan (utile quand une feature n'est pas nommée). */
export function assertAtLeast(
  user: Pick<User, 'plan'> | null | undefined,
  required: PlanKey,
): boolean {
  if (!user) return false;
  return isAtLeast(user.plan, required);
}

/**
 * Construit une réponse 403 normalisée pour les routes API.
 * Le client peut afficher un état verrouillé cohérent.
 */
export function buildLockedResponse(feature: FeatureKey, required: PlanKey, used?: number, limit?: number) {
  return NextResponse.json(
    {
      error: 'Plan requis',
      code: 'PLAN_REQUIRED',
      feature,
      required,
      ...(typeof used === 'number' ? { used } : {}),
      ...(typeof limit === 'number' ? { limit } : {}),
    },
    { status: 403 },
  );
}
