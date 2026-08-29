// =============================================================================
// Système d'offres — HardwarePC
// =============================================================================
//
// Quatre offres sont définies : FREE / ESSENTIEL / PRO / ULTIMATE.
//
// Toute la logique d'accès aux fonctionnalités doit passer par cette
// bibliothèque. Ne JAMAIS disperser de conditions "user.plan === ..."
// dans les pages ou routes API : utiliser `canAccess(user, feature)`
// et `requirePlan(user, plan)` à la place.
//
// À l'étape 6 (cette livraison) : aucune passerelle de paiement réelle
// n'est branchée. L'utilisateur peut sélectionner une offre depuis la
// page /tarifs — son plan est simplement mis à jour en base. L'étape 8
// ajoutera Stripe (ou équivalent) et des champs de facturation.
//
// Les "features" sont des identifiants fonctionnels (ex. "interviews",
// "diagnostic_avance"). Une offre donnée déclare les features qu'elle
// débloque ; le code consommateur interroge via canAccess(user, feature).
// =============================================================================

import type { Plan as PrismaPlan } from '@prisma/client';

/** Liste canonique des plans, dans l'ordre croissant. */
export const PLAN_ORDER = ['FREE', 'ESSENTIEL', 'PRO', 'ULTIMATE'] as const;
export type PlanKey = (typeof PLAN_ORDER)[number];

/** Identifiants des fonctionnalités contrôlées par les plans. */
export const FEATURES = [
  'courses_basic',
  'courses_full',
  'tracks_multiple',
  'quiz_basic',
  'quiz_full',
  'exams_basic',
  'exams_full',
  'interviews_basic',
  'interviews_full',
  'diagnostic_basic',
  'diagnostic_full',
  'knowledge_base',
  'revisions_advanced',
  'monitoring_extended',
  'builder_full',
  'tutor_ai',
  'mode_technicien',
  'mode_client',
  'early_access',
] as const;
export type FeatureKey = (typeof FEATURES)[number];

export type PlanDef = {
  key: PlanKey;
  label: string;
  tagline: string;
  /** Prix indicatif mensuel — non facturé à l'étape 6. */
  priceMonthly: number;
  /** Prix annuel indicatif — non facturé à l'étape 6. */
  priceYearly: number;
  badge?: string;
  highlight?: boolean;
  features: Record<FeatureKey, boolean>;
};

/**
 * Définition unique des quatre offres. Toute l'UI (page /tarifs,
 * restrictions d'accès, badges de plan) lit cette structure.
 */
export const PLANS: readonly PlanDef[] = [
  {
    key: 'FREE',
    label: 'Gratuit',
    tagline: 'Découvrir les fondamentaux',
    priceMonthly: 0,
    priceYearly: 0,
    features: {
      courses_basic: true,
      courses_full: false,
      tracks_multiple: false,
      quiz_basic: true,
      quiz_full: false,
      exams_basic: false,
      exams_full: false,
      interviews_basic: false,
      interviews_full: false,
      diagnostic_basic: false,
      diagnostic_full: false,
      knowledge_base: true,
      revisions_advanced: false,
      monitoring_extended: false,
      builder_full: false,
      tutor_ai: true,
      mode_technicien: false,
      mode_client: false,
      early_access: false,
    },
  },
  {
    key: 'ESSENTIEL',
    label: 'Essentiel',
    tagline: 'Approfondir sa pratique',
    priceMonthly: 7.99,
    priceYearly: 79.99,
    badge: 'POPULAIRE',
    features: {
      courses_basic: true,
      courses_full: true,
      tracks_multiple: true,
      quiz_basic: true,
      quiz_full: true,
      exams_basic: true,
      exams_full: false,
      interviews_basic: true,
      interviews_full: false,
      diagnostic_basic: false,
      diagnostic_full: false,
      knowledge_base: true,
      revisions_advanced: true,
      monitoring_extended: false,
      builder_full: false,
      tutor_ai: true,
      mode_technicien: false,
      mode_client: false,
      early_access: false,
    },
  },
  {
    key: 'PRO',
    label: 'Pro',
    tagline: 'Maîtriser l’ensemble du catalogue',
    priceMonthly: 14.99,
    priceYearly: 149.99,
    badge: 'PRO',
    highlight: true,
    features: {
      courses_basic: true,
      courses_full: true,
      tracks_multiple: true,
      quiz_basic: true,
      quiz_full: true,
      exams_basic: true,
      exams_full: true,
      interviews_basic: true,
      interviews_full: true,
      diagnostic_basic: true,
      diagnostic_full: true,
      knowledge_base: true,
      revisions_advanced: true,
      monitoring_extended: true,
      builder_full: true,
      tutor_ai: true,
      mode_technicien: false,
      mode_client: false,
      early_access: false,
    },
  },
  {
    key: 'ULTIMATE',
    label: 'Ultimate',
    tagline: 'Accès complet à vie',
    priceMonthly: 24.99,
    priceYearly: 249.99,
    badge: 'ULTIMATE',
    features: {
      courses_basic: true,
      courses_full: true,
      tracks_multiple: true,
      quiz_basic: true,
      quiz_full: true,
      exams_basic: true,
      exams_full: true,
      interviews_basic: true,
      interviews_full: true,
      diagnostic_basic: true,
      diagnostic_full: true,
      knowledge_base: true,
      revisions_advanced: true,
      monitoring_extended: true,
      builder_full: true,
      tutor_ai: true,
      mode_technicien: true,
      mode_client: true,
      early_access: true,
    },
  },
];

const PLAN_MAP: Record<PlanKey, PlanDef> = PLANS.reduce((acc, p) => {
  acc[p.key] = p;
  return acc;
}, {} as Record<PlanKey, PlanDef>);

/** Convertit la valeur Prisma en PlanKey typé (avec fallback FREE). */
export function toPlanKey(value: PrismaPlan | string | null | undefined): PlanKey {
  if (!value) return 'FREE';
  const upper = String(value).toUpperCase();
  return (PLAN_ORDER as readonly string[]).includes(upper) ? (upper as PlanKey) : 'FREE';
}

/** Récupère la définition d'un plan. */
export function getPlan(plan: PrismaPlan | string | null | undefined): PlanDef {
  return PLAN_MAP[toPlanKey(plan)];
}

/** Indique si un plan est au moins aussi élevé qu'un autre. */
export function isAtLeast(actual: PrismaPlan | string | null | undefined, required: PlanKey): boolean {
  return PLAN_ORDER.indexOf(toPlanKey(actual)) >= PLAN_ORDER.indexOf(required);
}

/** Vérifie si un utilisateur a accès à une fonctionnalité. */
export function canAccess(
  plan: PrismaPlan | string | null | undefined,
  feature: FeatureKey,
): boolean {
  return PLAN_MAP[toPlanKey(plan)].features[feature] === true;
}

/**
 * Helper pour les routes API : jette une erreur si l'utilisateur n'a pas
 * le plan requis. Centralise le message 403 retourné au client.
 */
export class PlanRequiredError extends Error {
  status = 403;
  constructor(public required: PlanKey, public feature?: FeatureKey) {
    super(
      feature
        ? `Fonctionnalité "${feature}" réservée à l'offre ${required} ou supérieure.`
        : `Offre ${required} ou supérieure requise.`,
    );
  }
}

/**
 * Helper générique pour les pages et routes : renvoie vrai si l'utilisateur
 * peut accéder à une feature, faux sinon (sans exception).
 */
export function userCanAccess(
  plan: PrismaPlan | string | null | undefined,
  feature: FeatureKey,
): boolean {
  return canAccess(plan, feature);
}

/**
 * Libellé de plan affichable (utile pour badges, etc.).
 */
export function planLabel(plan: PrismaPlan | string | null | undefined): string {
  return getPlan(plan).label;
}

// =============================================================================
// Limites mensuelles du Tuteur IA par offre
// =============================================================================
// Quotas mensuels par plan, appliqués strictement côté serveur dans
// `ai-quota.ts` (incrément transactionnel). Le client ne peut pas les
// contourner : la limite est lue depuis le plan Prisma de l'utilisateur.
export const AI_LIMITS: Record<PlanKey, number> = {
  FREE: 3,
  ESSENTIEL: 10,
  PRO: 50,
  ULTIMATE: 150,
};

export function aiMonthlyLimit(plan: PrismaPlan | string | null | undefined): number {
  return AI_LIMITS[toPlanKey(plan)];
}

/** Renvoie la clé de mois UTC au format "YYYY-MM". */
export function currentMonthKey(date: Date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}
