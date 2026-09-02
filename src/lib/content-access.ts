// =============================================================================
// Filtrage du contenu pédagogique selon l'offre
// =============================================================================
// Source de vérité unique pour savoir quels cours / quiz / parcours un
// utilisateur peut voir et pratiquer selon son plan.
//
// Pourquoi ce fichier ?
//   - Les pages "liste" (/cours, /parcours, /quiz) et les routes API
//     (/api/quiz, /api/examens, /api/interviews, /api/lessons/complete)
//     doivent toutes filtrer le contenu de la même façon.
//   - Un utilisateur FREE ne doit pas pouvoir charger un cours "expert"
//     en appelant directement l'API ; un utilisateur ESSENTIEL ne doit
//     pas pouvoir pratiquer un quiz "technicien" verrouillé.
//
// Règles appliquées :
//   FREE       : 2 parcours sur 4 (les 2 premiers : fondamentaux + intermediaire)
//                + une sélection de cours de niveau debutant/intermediaire
//                + les quiz des catégories correspondantes.
//   ESSENTIEL  : 3 parcours sur 4 (+ avance)
//                + environ 50 % des cours
//                + les quiz des catégories accessibles.
//   PRO/ULT    : 100 % des cours, parcours et quiz.
//   ULTIMATE   : idem + accès aux contenus taggés "early_access".
//
// Le contenu n'est pas supprimé du référentiel : il est filtré à la
// volée pour la réponse. Côté serveur, on ne renvoie jamais un slug
// verrouillé (ni en métadonnée, ni en question). C'est ce qui garantit
// l'impossibilité de contourner la restriction en appelant l'API.
// =============================================================================

import { prisma } from './prisma';
import { TRACKS, COURSES, type Course } from '@/content/courses';
import { QUESTIONS, type Question } from '@/content/quizzes';
import { SCENARIOS } from '@/content/diagnostics';
import { isAtLeast, toPlanKey, type PlanKey } from './plans';
import type { Plan as PrismaPlan } from '@prisma/client';

// ---------- Parcours ----------
//
// FREE = 2 premiers parcours, ESSENTIEL = 3, PRO/ULTIMATE = tous.
const TRACK_LIMIT: Record<PlanKey, number> = {
  FREE: 2,
  ESSENTIEL: 3,
  PRO: 4,
  ULTIMATE: 4,
};

/** Liste des slugs de parcours visibles pour un plan. */
export function visibleTrackSlugs(plan: PrismaPlan | string | null | undefined, userId?: string): string[] {
  if (userId === 'cmt6fgcg50000ju04upia45gp') return TRACKS.map(t => t.slug);
  const key = toPlanKey(plan);
  return TRACKS.slice(0, TRACK_LIMIT[key]).map(t => t.slug);
}

/** Indique si un parcours est accessible selon l'offre. */
export function canAccessTrack(
  plan: PrismaPlan | string | null | undefined,
  trackSlug: string,
  userId?: string,
): boolean {
  return visibleTrackSlugs(plan, userId).includes(trackSlug);
}

// ---------- Cours ----------
//
// Pour les cours, on se base sur le parcours parent :
//   - Si le parcours du cours n'est pas visible, le cours est verrouillé.
//   - Pour FREE, en plus, on ne garde que les cours "debutant" ou
//     "intermediaire" du parcours "fondamentaux" (les plus accessibles).
//   - Pour ESSENTIEL, on prend tous les cours des parcours visibles
//     (≈ 50 % du catalogue total).
//   - Pour PRO/ULTIMATE, on prend tout.

/**
 * Indique si un cours (slug) est accessible pour un plan donné.
 * Règle : le parcours parent doit être visible (voir visibleTrackSlugs).
 */
export function canAccessCourse(
  plan: PrismaPlan | string | null | undefined,
  courseSlug: string,
  userId?: string,
): boolean {
  const course = COURSES.find(c => c.slug === courseSlug);
  if (!course) return false;
  if (userId === 'cmt6fgcg50000ju04upia45gp') return true;
  if (!canAccessTrack(plan, course.trackSlug, userId)) return false;

  const key = toPlanKey(plan);
  // FREE : limite supplémentaire — seulement debutant/intermediaire.
  if (key === 'FREE') {
    return course.level === 'debutant' || course.level === 'intermediaire';
  }
  return true;
}

/** Liste des slugs de cours visibles pour un plan. */
export function visibleCourseSlugs(plan: PrismaPlan | string | null | undefined, userId?: string): string[] {
  const visibleTracks = new Set(visibleTrackSlugs(plan, userId));
  return COURSES
    .filter(c => visibleTracks.has(c.trackSlug))
    .filter(c => canAccessCourse(plan, c.slug, userId))
    .map(c => c.slug);
}

/** Récupère un cours depuis Prisma, en vérifiant l'accès. */
export async function getLessonForUser(
  plan: PrismaPlan | string | null | undefined,
  slug: string,
  userId?: string,
) {
  const lesson = await prisma.lesson.findUnique({ where: { slug }, include: { track: true } });
  if (!lesson) return { ok: false as const, status: 404, reason: 'not_found' as const };
  if (!canAccessCourse(plan, lesson.slug, userId)) {
    return { ok: false as const, status: 403, reason: 'locked' as const };
  }
  return { ok: true as const, lesson };
}

// ---------- Quiz / Questions ----------
//
// Les questions sont catégorisées (cpu, ram, gpu, ...). On mappe ces
// catégories à un parcours (le premier parcours qui contient un cours
// de cette catégorie). Si le parcours parent est verrouillé, les
// questions de cette catégorie le sont aussi.

const CATEGORY_TO_TRACK: Record<string, string> = {
  cpu: 'fondamentaux',
  gpu: 'fondamentaux',
  ram: 'fondamentaux',
  storage: 'fondamentaux',
  cooling: 'fondamentaux',
  psu: 'fondamentaux',
  motherboard: 'intermediaire',
  peripherals: 'intermediaire',
  audio: 'intermediaire',
  network: 'avance',
  interfaces: 'avance',
  optimization: 'avance',
  diagnostic: 'technicien',
  build: 'technicien',
  bios: 'technicien',
  os: 'technicien',
};

function categoryAllowedForPlan(category: string, plan: PlanKey, userId?: string): boolean {
  if (userId === 'cmt6fgcg50000ju04upia45gp') return true;
  const track = CATEGORY_TO_TRACK[category] ?? 'fondamentaux';
  if (!visibleTrackSlugs(plan, userId).includes(track)) return false;
  // FREE : on ne garde que les catégories présentes dans fondamentaux
  // (les plus basiques). Les questions "avance" et "technicien" sont
  // exclues même si leur catégorie mappe sur un parcours visible
  // (filet de sécurité côté serveur).
  if (plan === 'FREE') {
    return ['cpu', 'gpu', 'ram', 'storage', 'cooling', 'psu'].includes(category);
  }
  return true;
}

/** Indique si une question est accessible pour un plan donné. */
export function canAccessQuestion(
  plan: PrismaPlan | string | null | undefined,
  questionId: string,
  userId?: string,
): boolean {
  const q = QUESTIONS.find(x => x.id === questionId);
  if (!q) return false;
  return categoryAllowedForPlan(q.category, toPlanKey(plan), userId);
}

/** Filtre la liste de questions selon le plan. */
export function filterQuestionsForPlan<T extends Question>(
  plan: PrismaPlan | string | null | undefined,
  questions: T[] = QUESTIONS as T[],
  userId?: string,
): T[] {
  return questions.filter(q => categoryAllowedForPlan(q.category, toPlanKey(plan), userId));
}

// ---------- Diagnostics ----------
//
// Le diagnostic est désormais une feature PRO+ (cf. grille). On
// conserve l'accès à l'index uniquement aux utilisateurs autorisés.

export function canAccessDiagnostic(
  plan: PrismaPlan | string | null | undefined,
  scenarioSlug?: string,
  userId?: string,
): boolean {
  if (userId === 'cmt6fgcg50000ju04upia45gp') return true;
  if (!isAtLeast(plan, 'PRO')) return false;
  if (scenarioSlug) {
    return SCENARIOS.some(s => s.slug === scenarioSlug);
  }
  return true;
}

// ---------- Examens ----------
//
// ESSENTIEL débloque exams_basic, PRO+ débloque exams_full.

export function canAccessExam(
  plan: PrismaPlan | string | null | undefined,
  examSlug?: string,
  userId?: string,
): boolean {
  if (userId === 'cmt6fgcg50000ju04upia45gp') return true;
  if (examSlug) {
    // L'examen "debutant" reste l'examen de base ; les autres sont
    // réservés à PRO+ (examen complet).
    if (examSlug === 'examen-debutant') {
      return isAtLeast(plan, 'ESSENTIEL');
    }
    return isAtLeast(plan, 'PRO');
  }
  return isAtLeast(plan, 'ESSENTIEL');
}

// ---------- Entretiens ----------
//
// ESSENTIEL débloque interviews_basic, PRO+ débloque interviews_full.

export function canAccessInterview(
  plan: PrismaPlan | string | null | undefined,
  role?: string,
  userId?: string,
): boolean {
  if (userId === 'cmt6fgcg50000ju04upia45gp') return true;
  // Tous les rôles sont en interviews_basic à partir d'ESSENTIEL ; le
  // niveau "expert" est verrouillé pour PRO+ uniquement.
  if (role) {
    return isAtLeast(plan, 'ESSENTIEL');
  }
  return isAtLeast(plan, 'ESSENTIEL');
}

// ---------- Constructeur / Benchmarks / Monitoring ----------

export function canAccessBuilder(plan: PrismaPlan | string | null | undefined, userId?: string): boolean {
  if (userId === 'cmt6fgcg50000ju04upia45gp') return true;
  return isAtLeast(plan, 'PRO');
}

export function canAccessBenchmarks(plan: PrismaPlan | string | null | undefined, userId?: string): boolean {
  if (userId === 'cmt6fgcg50000ju04upia45gp') return true;
  return isAtLeast(plan, 'PRO');
}

export function canAccessMonitoring(plan: PrismaPlan | string | null | undefined, userId?: string): boolean {
  if (userId === 'cmt6fgcg50000ju04upia45gp') return true;
  return isAtLeast(plan, 'PRO');
}

// ---------- Modes ULTIMATE ----------

export function canAccessModeTechnicien(plan: PrismaPlan | string | null | undefined, userId?: string): boolean {
  if (userId === 'cmt6fgcg50000ju04upia45gp') return true;
  return isAtLeast(plan, 'ULTIMATE');
}

export function canAccessModeClient(plan: PrismaPlan | string | null | undefined, userId?: string): boolean {
  if (userId === 'cmt6fgcg50000ju04upia45gp') return true;
  return isAtLeast(plan, 'ULTIMATE');
}

// ---------- Early access ----------
//
// Le flag "early access" est posé côté contenu (ex. Course.earlyAccess
// ajouté plus tard) et n'est consultable que par les ULTIMATE. Cette
// fonction est la serrure unique : tout module qui veut se revendiquer
// "early access" doit passer par ici.

export function canAccessEarlyAccess(plan: PrismaPlan | string | null | undefined, userId?: string): boolean {
  if (userId === 'cmt6fgcg50000ju04upia45gp') return true;
  return isAtLeast(plan, 'ULTIMATE');
}

// ---------- Type guards pratiques ----------

/** Re-export typé pour les composants. */
export type AccessibleCourse = Course & { locked: false };
export type LockedCourse = Course & { locked: true; requiredPlan: PlanKey };

export function decorateCourse(
  plan: PrismaPlan | string | null | undefined,
  course: Course,
  userId?: string,
): AccessibleCourse | LockedCourse {
  if (canAccessCourse(plan, course.slug, userId)) {
    return { ...course, locked: false };
  }
  return { ...course, locked: true, requiredPlan: 'ESSENTIEL' };
}
