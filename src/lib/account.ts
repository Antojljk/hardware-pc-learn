// =============================================================================
// Gestion du compte — actions utilisateur
// =============================================================================
//
// Centralise toutes les opérations de modification du profil (username,
// email, mot de passe, plan, suppression). Chaque action :
//   - vérifie que l'utilisateur est authentifié ;
//   - valide les entrées avec Zod ;
//   - vérifie les conflits (unicité email/username) ;
//   - utilise UNIQUEMENT l'identifiant de l'utilisateur courant —
//     un utilisateur ne peut JAMAIS agir sur le compte d'un autre.

import { z } from 'zod';
import { prisma } from './prisma';
import { hashPassword, getCurrentUser } from './auth';
import { PLAN_ORDER, toPlanKey, type PlanKey } from './plans';

const UsernameSchema = z
  .string()
  .min(3, 'Pseudo trop court')
  .max(24, 'Pseudo trop long')
  .regex(/^[a-zA-Z0-9_]+$/, 'Caractères autorisés : lettres, chiffres, _');

const EmailSchema = z.string().email('Email invalide').max(120);

const PasswordSchema = z.string().min(6, 'Mot de passe : 6 caractères minimum').max(128);

export const UpdateProfileSchema = z.object({
  username: UsernameSchema.optional(),
  email: EmailSchema.optional(),
  currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
});

export const UpdatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
  newPassword: PasswordSchema,
});

export const UpdatePlanSchema = z.object({
  plan: z.enum(PLAN_ORDER),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type UpdatePasswordInput = z.infer<typeof UpdatePasswordSchema>;
export type UpdatePlanInput = z.infer<typeof UpdatePlanSchema>;

export type AccountError = { code: string; message: string };

function err(code: string, message: string): AccountError {
  return { code, message };
}

/**
 * Met à jour le profil (username et/ou email). Vérifie que le nouveau
 * username/email n'est pas déjà pris par un autre utilisateur.
 */
export async function updateProfile(
  input: UpdateProfileInput,
): Promise<{ ok: true } | { ok: false; error: AccountError }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: err('UNAUTHENTICATED', 'Non connecté') };

  const parsed = UpdateProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: err('VALIDATION', parsed.error.issues[0].message) };
  }
  const data = parsed.data;

  // Vérification mot de passe actuel avant toute modification sensible
  const { verifyPassword } = await import('./auth');
  const okPwd = await verifyPassword(data.currentPassword, user.passwordHash);
  if (!okPwd) {
    return { ok: false, error: err('PASSWORD', 'Mot de passe actuel incorrect') };
  }

  const updates: { username?: string; email?: string } = {};
  if (data.username && data.username !== user.username) updates.username = data.username;
  if (data.email && data.email !== user.email) updates.email = data.email;

  if (Object.keys(updates).length === 0) {
    return { ok: true };
  }

  if (updates.username || updates.email) {
    const exists = await prisma.user.findFirst({
      where: {
        OR: [
          updates.email ? { email: updates.email } : undefined,
          updates.username ? { username: updates.username } : undefined,
        ].filter(Boolean) as { email?: string; username?: string }[],
        NOT: { id: user.id },
      },
      select: { id: true },
    });
    if (exists) {
      return { ok: false, error: err('CONFLICT', 'Email ou pseudo déjà utilisé') };
    }
  }

  await prisma.user.update({ where: { id: user.id }, data: updates });
  return { ok: true };
}

/**
 * Change le mot de passe de l'utilisateur courant.
 */
export async function updatePassword(
  input: UpdatePasswordInput,
): Promise<{ ok: true } | { ok: false; error: AccountError }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: err('UNAUTHENTICATED', 'Non connecté') };

  const parsed = UpdatePasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: err('VALIDATION', parsed.error.issues[0].message) };
  }
  const data = parsed.data;

  const { verifyPassword } = await import('./auth');
  const okPwd = await verifyPassword(data.currentPassword, user.passwordHash);
  if (!okPwd) {
    return { ok: false, error: err('PASSWORD', 'Mot de passe actuel incorrect') };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(data.newPassword) },
  });
  return { ok: true };
}

/**
 * Met à jour l'offre associée au compte. À l'étape 6, aucun paiement réel
 * n'est déclenché — l'offre est enregistrée telle quelle. L'étape 8
 * ajoutera la création d'une session de paiement avant l'écriture.
 */
export async function updatePlan(
  input: UpdatePlanInput,
): Promise<{ ok: true; plan: PlanKey } | { ok: false; error: AccountError }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: err('UNAUTHENTICATED', 'Non connecté') };

  const parsed = UpdatePlanSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: err('VALIDATION', 'Plan invalide') };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { plan: toPlanKey(parsed.data.plan) },
  });
  return { ok: true, plan: parsed.data.plan };
}

/**
 * Supprime le compte courant ainsi que toutes les données associées.
 * Les relations Prisma en cascade (LessonProgress, QuizAttempt, etc.)
 * sont supprimées automatiquement via onDelete: Cascade dans le schéma.
 */
export async function deleteAccount(
  password: string,
): Promise<{ ok: true } | { ok: false; error: AccountError }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: err('UNAUTHENTICATED', 'Non connecté') };

  const { verifyPassword, destroySession } = await import('./auth');
  // Pour un compte invité, on autorise la suppression sans mot de passe
  // (le mot de passe généré n'est pas connu de l'utilisateur).
  if (!user.isGuest) {
    const okPwd = await verifyPassword(password, user.passwordHash);
    if (!okPwd) {
      return { ok: false, error: err('PASSWORD', 'Mot de passe incorrect') };
    }
  }

  await prisma.user.delete({ where: { id: user.id } });
  await destroySession();
  return { ok: true };
}
