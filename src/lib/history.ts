// =============================================================================
// Historique des activités utilisateur
// =============================================================================
//
// Récupère et formate l'historique complet des activités d'un utilisateur :
// cours terminés, quiz, examens, diagnostics, entretiens, configurations,
// badges débloqués, etc.
//
// Chaque activité est normalisée avec un type, un libellé, un score (si applicable)
// et une date.

import { prisma } from './prisma'

export type ActivityType =
  | 'course'
  | 'quiz'
  | 'exam'
  | 'interview'
  | 'diagnostic'
  | 'build'
  | 'badge'

export interface UserActivity {
  id: string
  type: ActivityType
  label: string
  score: number | null
  createdAt: Date
  // Pour les liens éventuels vers les détails
  url?: string
}

/**
 * Récupère toutes les activités de l'utilisateur, triées par date décroissante.
 */
export async function getUserActivities(userId: string) {
  // Récupérer toutes les sources en parallèle
  const [
    courses,
    quizzes,
    exams,
    interviews,
    diagnostics,
    builds,
    badges,
  ] = await Promise.all([
    // Cours terminés
    prisma.lessonProgress.findMany({
      where: { userId, completed: true },
      select: { id: true, lesson: { select: { title: true, slug: true } }, score: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    }),
    // Quiz attempts
    prisma.quizAttempt.findMany({
      where: { userId },
      select: { id: true, score: true, total: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
    // Exam attempts
    prisma.examAttempt.findMany({
      where: { userId },
      select: { id: true, score: true, total: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
    // Interview attempts
    prisma.interviewAttempt.findMany({
      where: { userId },
      select: { id: true, score: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
    // Diagnostic attempts
    prisma.diagnosticAttempt.findMany({
      where: { userId },
      select: { id: true, score: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
    // Config builds
    prisma.configBuild.findMany({
      where: { userId },
      select: { id: true, name: true, score: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
    // Badges débloqués
    prisma.badgesOnUsers.findMany({
      where: { userId },
      select: { userId: true, badgeId: true, unlockedAt: true, badge: { select: { name: true, icon: true } } },
      orderBy: { unlockedAt: 'desc' },
    }),
  ])

  // Normaliser chaque activité
  const activities: UserActivity[] = []

  // Cours
  for (const cp of courses) {
    activities.push({
      id: cp.id,
      type: 'course',
      label: cp.lesson.title,
      score: cp.score ?? null,
      createdAt: cp.updatedAt,
      url: `/cours/${cp.lesson.slug}`,
    })
  }

  // Quiz
  for (const q of quizzes) {
    activities.push({
      id: q.id,
      type: 'quiz',
      label: `Quiz`,
      score: q.score,
      createdAt: q.createdAt,
      // On pourrait ajouter un lien vers les détails du quiz si on avait une page dédiée
      // url: `/quiz/${q.id}`,
    })
  }

  // Examens
  for (const e of exams) {
    activities.push({
      id: e.id,
      type: 'exam',
      label: `Examen`,
      score: e.score,
      createdAt: e.createdAt,
      url: `/exam/${e.id}`,
    })
  }

  // Entretiens
  for (const i of interviews) {
    activities.push({
      id: i.id,
      type: 'interview',
      label: `Entretien`,
      score: i.score,
      createdAt: i.createdAt,
    })
  }

  // Diagnostics
  for (const d of diagnostics) {
    activities.push({
      id: d.id,
      type: 'diagnostic',
      label: `Diagnostic`,
      score: d.score,
      createdAt: d.createdAt,
      url: `/diagnostic/${d.id}`,
    })
  }

  // Configurations
  for (const b of builds) {
    activities.push({
      id: b.id,
      type: 'build',
      label: b.name,
      score: b.score ?? null,
      createdAt: b.createdAt,
    })
  }

  // Badges
  for (const bg of badges) {
    activities.push({
      id: `${bg.userId}-${bg.badgeId}`,
      type: 'badge',
      label: bg.badge.name,
      score: null, // Les badges n'ont pas de score
      createdAt: bg.unlockedAt,
      // url: `/badges/${bg.badge.id}`, // Si on avait une page de badge
    })
  }

  // Trier par date décroissante
  activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return activities
}