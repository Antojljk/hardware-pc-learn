// Système de progression — compétences de niveau technicien
//
// 6 compétences dérivées des activités réellement réalisées par l'utilisateur :
//   - Composants
//   - Montage
//   - Diagnostic
//   - Dépannage
//   - Performances
//   - Relation client
//
// Les données sources sont : quiz, examens, entretiens, diagnostics,
// cours (LessonProgress) et configurations (ConfigBuild).
//
// La progression globale est dérivée des 6 compétences via une
// moyenne pondérée, pondérée elle-même par le niveau d'activité
// dans chaque compétence. Cela évite de gonfler artificiellement
// le score quand un utilisateur n'a touché qu'à une seule
// compétence.

import { prisma } from './prisma';
import { QUESTIONS } from '@/content/quizzes';
import { COURSES } from '@/content/courses';
import { SCENARIOS } from '@/content/diagnostics';

export const SKILL_KEYS = [
  'composants',
  'montage',
  'diagnostic',
  'depannage',
  'performances',
  'relation_client',
] as const;

export type SkillKey = (typeof SKILL_KEYS)[number];

export type Skill = {
  key: SkillKey;
  label: string;
  short: string;
  href: string;
  cta: string;
  weight: number; // contribution relative à la progression globale
};

export const SKILLS: readonly Skill[] = [
  { key: 'composants',      label: 'Composants',     short: 'CPU, GPU, RAM, stockage',          href: '/cours',         cta: 'Approfondir les composants',  weight: 1.1 },
  { key: 'montage',         label: 'Montage',        short: 'Assemblage, configuration, BIOS',  href: '/constructeur',  cta: 'Sauvegarder une configuration', weight: 1.0 },
  { key: 'diagnostic',      label: 'Diagnostic',     short: 'Méthodologie, lecture des symptômes', href: '/diagnostic', cta: 'Lancer un diagnostic',       weight: 1.1 },
  { key: 'depannage',       label: 'Dépannage',      short: 'BSOD, instabilité, redémarrages',   href: '/diagnostic',    cta: 'Résoudre un scénario',       weight: 1.1 },
  { key: 'performances',    label: 'Performances',   short: 'Benchmarks, overclock, optimisations', href: '/cours',     cta: 'Travailler les benchmarks',  weight: 0.9 },
  { key: 'relation_client', label: 'Relation client', short: 'Conseil, support, communication', href: '/entretiens',    cta: 'Faire un entretien',         weight: 0.8 },
];

// Domaines techniques (catégories quiz / domaines leçons) rattachés à
// chaque compétence. Permet de convertir les scores quiz en progression
// de compétence, sans dupliquer la définition des DomainKey.
// (Réservé pour usages futurs : la pondération réelle est faite via
//  DOMAIN_OWNERSHIP ci-dessous.)
// const SKILL_DOMAINS: Record<SkillKey, string[]> = { ... };

// Domaines "purs" d'une compétence — quand un domaine appartient à
// plusieurs compétences, on utilise cette pondération pour éviter
// le double comptage.
const DOMAIN_OWNERSHIP: Record<string, SkillKey> = {
  cpu: 'composants',
  gpu: 'composants',
  ram: 'composants',
  storage: 'composants',
  motherboard: 'composants',
  psu: 'composants',
  cooling: 'performances',
  pcb: 'composants',
  arch_cpu: 'composants',
  arch_gpu: 'composants',
  memory_tech: 'composants',
  interfaces: 'composants',
  vrm: 'composants',
  firmware: 'composants',
  overclock: 'performances',
  thermal: 'performances',
  benchmarks: 'performances',
  diagnostic: 'diagnostic',
  build: 'montage',
  compatibility: 'montage',
  driver_os: 'montage',
};

// --- Mapping d'une catégorie de scénario de diagnostic vers la compétence ---
// (les scénarios ont un champ "category" textuel dans SCENARIOS)
const SCENARIO_CATEGORY_SKILL: Record<string, SkillKey> = {
  'GPU/Display':  'depannage',
  'Alimentation': 'depannage',
  'Système':      'depannage',
  'Thermique':    'performances',
  'RAM':          'depannage',
  'Stockage':     'depannage',
  'Alimentation/VRM': 'depannage',
  'GPU':          'depannage',
};

// --- Mapping des rôles d'entretien vers la compétence relation client ---
const INTERVIEW_RELATION_ROLES = new Set(['support', 'vendeur']);

export const LEVELS = [
  { level: 1, title: 'Débutant',           xpRequired: 0 },
  { level: 2, title: 'Apprenti',           xpRequired: 500 },
  { level: 3, title: 'Technicien junior',  xpRequired: 1500 },
  { level: 4, title: 'Technicien',         xpRequired: 3500 },
  { level: 5, title: 'Technicien confirmé',xpRequired: 7000 },
] as const;

export type LevelDef = (typeof LEVELS)[number];

export function getLevel(xp: number): {
  current: LevelDef;
  next: LevelDef;
  progress: number;
  xpInLevel: number;
  xpForNext: number;
  isMax: boolean;
} {
  let current: LevelDef = LEVELS[0];
  let nextIdx = 1;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].xpRequired) current = LEVELS[i];
    if (LEVELS[i].xpRequired > xp) { nextIdx = i; break; }
  }
  if (nextIdx >= LEVELS.length) {
    return { current, next: current, progress: 100, xpInLevel: xp - current.xpRequired, xpForNext: 0, isMax: true };
  }
  const next = LEVELS[nextIdx];
  const span = next.xpRequired - current.xpRequired;
  const into = xp - current.xpRequired;
  const progress = span > 0 ? Math.max(0, Math.min(100, (into / span) * 100)) : 0;
  return { current, next, progress, xpInLevel: into, xpForNext: span, isMax: false };
}

// ----------------------------------------------------------------------------
// Agrégation
// ----------------------------------------------------------------------------

export type SkillScore = {
  key: SkillKey;
  value: number;       // 0..100
  activity: number;    // 0..1, niveau d'activité dans cette compétence
  signals: number;     // nombre de signaux pris en compte
};

export type SkillBreakdown = SkillScore & {
  components: {
    quiz: number;          // % moyen pondéré sur les quiz rattachés
    exam: number;          // % moyen pondéré sur les examens
    diagnostic: number;    // % moyen des diagnostics
    interview: number;     // % moyen des entretiens
    courses: number;       // % de cours liés complétés
    builds: number;        // score moyen des configurations
  };
  attempts: number;
};

export type ActivityFeedItem = {
  id: string;
  type: 'quiz' | 'exam' | 'diagnostic' | 'interview' | 'course' | 'build';
  label: string;
  score: number;        // 0..100 normalisé
  weight: number;       // importance (pour agrégation)
  createdAt: Date;
  href: string;
};

export type ProgressionReport = {
  skills: SkillBreakdown[];
  globalPercent: number;
  xp: number;
  level: ReturnType<typeof getLevel>;
  activity: {
    total: number;
    byType: Record<ActivityFeedItem['type'], number>;
  };
  domains: Record<string, number>; // par micro-domaine technique (rétrocompatibilité)
  recent: ActivityFeedItem[];
  weakSkills: SkillKey[];
  recommended: { skill: SkillKey; href: string; cta: string; reason: string } | null;
};

function pct(num: number, den: number): number {
  if (den <= 0) return 0;
  return Math.max(0, Math.min(100, (num / den) * 100));
}

function domainToSkill(domain: string | null | undefined): SkillKey | null {
  if (!domain) return null;
  return DOMAIN_OWNERSHIP[domain] ?? null;
}

export async function buildProgressionReport(userId: string, totalXp: number): Promise<ProgressionReport> {
  const [
    quizAttempts,
    examAttempts,
    interviewAttempts,
    diagnosticAttempts,
    lessonProgress,
    configBuilds,
  ] = await Promise.all([
    prisma.quizAttempt.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } }),
    prisma.examAttempt.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } }),
    prisma.interviewAttempt.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } }),
    prisma.diagnosticAttempt.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } }),
    prisma.lessonProgress.findMany({ where: { userId, completed: true }, include: { lesson: true } }),
    prisma.configBuild.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } }),
  ]);

  // === Index des leçons (slug -> domains) ===
  const courseBySlug = new Map(COURSES.map(c => [c.slug, c]));

  // === Agrégation par compétence ===
  type Bucket = {
    quizWeight: number;   quizWeightedSum: number;
    examWeight: number;   examWeightedSum: number;
    diagWeight: number;   diagWeightedSum: number;
    intWeight: number;    intWeightedSum: number;
    courseDone: number;   courseTotal: number;
    buildWeight: number;  buildWeightedSum: number;
    signals: number;
  };
  const buckets: Record<SkillKey, Bucket> = SKILL_KEYS.reduce((acc, k) => {
    acc[k] = { quizWeight: 0, quizWeightedSum: 0, examWeight: 0, examWeightedSum: 0,
      diagWeight: 0, diagWeightedSum: 0, intWeight: 0, intWeightedSum: 0,
      courseDone: 0, courseTotal: 0, buildWeight: 0, buildWeightedSum: 0, signals: 0 };
    return acc;
  }, {} as Record<SkillKey, Bucket>);

  // --- Quiz : pour chaque détail, retrouver la catégorie de la question
  // et l'attribuer à la compétence correspondante.
  for (const att of quizAttempts) {
    let details: { questionId?: string; correct: boolean; category?: string }[] = [];
    try { details = JSON.parse(att.details); } catch { /* ignore */ }
    const total = Math.max(1, att.total || details.length);
    const score = att.score / total; // 0..1
    // Attribuer la tentative à la compétence de sa catégorie déclarée
    // (le quiz a une seule catégorie si elle est fournie).
    if (att.category) {
      const skill = DOMAIN_OWNERSHIP[att.category];
      if (skill && buckets[skill]) {
        // Pondération : une tentative compte pour 1
        buckets[skill].quizWeightedSum += score * 100;
        buckets[skill].quizWeight += 1;
        buckets[skill].signals += details.length;
      }
    } else {
      // Sinon, distribuer au prorata des détails par compétence
      const perSkill: Record<string, { sum: number; count: number }> = {};
      for (const d of details) {
        const skill = domainToSkill(d.category);
        if (!skill) continue;
        perSkill[skill] = perSkill[skill] || { sum: 0, count: 0 };
        perSkill[skill].sum += (d.correct ? 1 : 0);
        perSkill[skill].count += 1;
      }
      for (const [k, v] of Object.entries(perSkill)) {
        const skill = k as SkillKey;
        if (!buckets[skill]) continue;
        buckets[skill].quizWeightedSum += pct(v.sum, v.count);
        buckets[skill].quizWeight += 1;
        buckets[skill].signals += v.count;
      }
    }
  }

  // --- Examens : par détail, par catégorie, par compétence
  for (const att of examAttempts) {
    let details: { questionId?: string; correct: boolean; category?: string }[] = [];
    try { details = JSON.parse(att.details); } catch { /* ignore */ }
    // Pondération plus forte pour les examens
    const perSkill: Record<string, { sum: number; count: number }> = {};
    for (const d of details) {
      const skill = domainToSkill(d.category);
      if (!skill) continue;
      perSkill[skill] = perSkill[skill] || { sum: 0, count: 0 };
      perSkill[skill].sum += (d.correct ? 1 : 0);
      perSkill[skill].count += 1;
    }
    for (const [k, v] of Object.entries(perSkill)) {
      const skill = k as SkillKey;
      if (!buckets[skill]) continue;
      buckets[skill].examWeightedSum += pct(v.sum, v.count);
      buckets[skill].examWeight += 1;
      buckets[skill].signals += v.count;
    }
  }

  // --- Diagnostics : rattacher à la compétence par la catégorie du scénario
  const scenarioBySlug = new Map(SCENARIOS.map(s => [s.slug, s]));
  for (const att of diagnosticAttempts) {
    const scenario = scenarioBySlug.get(att.scenarioId);
    const skill = scenario ? (SCENARIO_CATEGORY_SKILL[scenario.category] ?? 'diagnostic') : 'diagnostic';
    if (!buckets[skill]) continue;
    buckets[skill].diagWeightedSum += att.score;
    buckets[skill].diagWeight += 1;
    buckets[skill].signals += 1;
  }

  // --- Entretiens : relation client pour les rôles support/vendeur,
  // performances pour les rôles techniques.
  for (const att of interviewAttempts) {
    const isRelation = INTERVIEW_RELATION_ROLES.has(att.role);
    const skill: SkillKey = isRelation ? 'relation_client' : 'performances';
    if (!buckets[skill]) continue;
    buckets[skill].intWeightedSum += att.score;
    buckets[skill].intWeight += 1;
    buckets[skill].signals += 1;
  }

  // --- Cours : pour chaque LessonProgress, rattacher la compétence
  // via le domaine principal de la leçon (premier déclaré).
  for (const lp of lessonProgress) {
    const course = courseBySlug.get(lp.lesson.slug);
    if (!course || !course.domains?.length) continue;
    const skill = DOMAIN_OWNERSHIP[course.domains[0]] ?? null;
    if (!skill || !buckets[skill]) continue;
    buckets[skill].courseDone += 1;
    buckets[skill].signals += 1;
  }
  // Compter le total de cours par compétence (potentiel)
  for (const c of COURSES) {
    const skill = c.domains?.[0] ? DOMAIN_OWNERSHIP[c.domains[0]] : null;
    if (!skill || !buckets[skill]) continue;
    buckets[skill].courseTotal += 1;
  }

  // --- Configurations sauvegardées : score normalisé, rattaché à "montage"
  for (const b of configBuilds) {
    if (typeof b.score === 'number') {
      if (!buckets.montage) continue;
      buckets.montage.buildWeightedSum += b.score;
      buckets.montage.buildWeight += 1;
      buckets.montage.signals += 1;
    } else {
      // Pas de score : signal léger pour "montage" (l'utilisateur a sauvegardé une config)
      if (!buckets.montage) continue;
      buckets.montage.buildWeight += 1;
      buckets.montage.signals += 1;
    }
  }

  // === Calcul du score par compétence ===
  const skills: SkillBreakdown[] = SKILL_KEYS.map(k => {
    const b = buckets[k];
    const compQuiz     = pct(b.quizWeightedSum,  b.quizWeight);
    const compExam     = pct(b.examWeightedSum,  b.examWeight);
    const compDiag     = pct(b.diagWeightedSum,  b.diagWeight);
    const compInt      = pct(b.intWeightedSum,   b.intWeight);
    const compCourses  = pct(b.courseDone,       b.courseTotal);
    const compBuilds   = pct(b.buildWeightedSum, b.buildWeight);

    // Pondération par source : cours/examens/diagnostics/quiz ont plus de poids
    // qu'une seule configuration. Les poids sont choisis pour rester lisibles.
    const wQuiz = 1, wExam = 1.2, wDiag = 1.2, wInt = 1, wCourse = 0.8, wBuild = 0.6;
    const weightSum = b.quizWeight * wQuiz + b.examWeight * wExam + b.diagWeight * wDiag
      + b.intWeight * wInt + b.courseTotal * wCourse + b.buildWeight * wBuild;

    let value = 0;
    if (weightSum > 0) {
      value = (
        b.quizWeightedSum * wQuiz +
        b.examWeightedSum * wExam +
        b.diagWeightedSum * wDiag +
        b.intWeightedSum  * wInt +
        b.courseDone * 100 * wCourse +
        b.buildWeightedSum * wBuild
      ) / weightSum;
    }

    // Activité : combine le nombre de signaux et la diversité des sources
    const sources = [
      b.quizWeight, b.examWeight, b.diagWeight, b.intWeight, b.courseTotal, b.buildWeight,
    ].filter(v => v > 0).length;
    const signalScore = Math.min(1, b.signals / 12);
    const sourceScore = sources / 6;
    const activity = Math.min(1, 0.65 * signalScore + 0.35 * sourceScore);

    return {
      key: k,
      value: Math.round(value),
      activity: Math.round(activity * 100) / 100,
      signals: b.signals,
      components: {
        quiz: Math.round(compQuiz),
        exam: Math.round(compExam),
        diagnostic: Math.round(compDiag),
        interview: Math.round(compInt),
        courses: Math.round(compCourses),
        builds: Math.round(compBuilds),
      },
      attempts: b.quizWeight + b.examWeight + b.diagWeight + b.intWeight + b.buildWeight,
    };
  });

  // === Progression globale pondérée par activité ===
  let globalNum = 0;
  let globalDen = 0;
  for (const s of skills) {
    const w = SKILL_WEIGHT[s.key] * s.activity;
    globalNum += s.value * w;
    globalDen += w;
  }
  const globalPercent = globalDen > 0 ? Math.round(globalNum / globalDen) : 0;

  // === Domaines techniques (rétrocompatibilité avec l'ancien affichage) ===
  const domainMap: Record<string, { correct: number; total: number }> = {};
  for (const att of quizAttempts) {
    let details: { questionId?: string; correct: boolean; category?: string }[] = [];
    try { details = JSON.parse(att.details); } catch { /* ignore */ }
    for (const d of details) {
      let cat = d.category;
      if (!cat && d.questionId) {
        const q = QUESTIONS.find(x => x.id === d.questionId);
        if (q) cat = q.category;
      }
      if (!cat) continue;
      domainMap[cat] = domainMap[cat] || { correct: 0, total: 0 };
      domainMap[cat].total += 1;
      if (d.correct) domainMap[cat].correct += 1;
    }
  }
  for (const att of examAttempts) {
    let details: { questionId?: string; correct: boolean; category?: string }[] = [];
    try { details = JSON.parse(att.details); } catch { /* ignore */ }
    for (const d of details) {
      if (!d.category) continue;
      domainMap[d.category] = domainMap[d.category] || { correct: 0, total: 0 };
      domainMap[d.category].total += 1;
      if (d.correct) domainMap[d.category].correct += 1;
    }
  }
  const domains: Record<string, number> = {};
  for (const [k, v] of Object.entries(domainMap)) {
    domains[k] = Math.round(pct(v.correct, v.total));
  }

  // === Activité récente (pour le feed) ===
  const recent: ActivityFeedItem[] = [];
  for (const a of quizAttempts) {
    recent.push({
      id: a.id, type: 'quiz',
      label: a.category ? `Quiz · ${a.category}` : 'Quiz',
      score: Math.round((a.score / Math.max(1, a.total)) * 100),
      weight: 1, createdAt: a.createdAt,
      href: '/progression',
    });
  }
  for (const a of examAttempts) {
    recent.push({
      id: a.id, type: 'exam',
      label: `Examen · ${a.examId}`,
      score: Math.round((a.score / Math.max(1, a.total)) * 100),
      weight: 1.2, createdAt: a.createdAt,
      href: '/examens',
    });
  }
  for (const a of diagnosticAttempts) {
    const s = SCENARIOS.find(x => x.slug === a.scenarioId);
    recent.push({
      id: a.id, type: 'diagnostic',
      label: s ? `Diagnostic · ${s.title}` : 'Diagnostic',
      score: a.score, weight: 1.2, createdAt: a.createdAt,
      href: '/diagnostic',
    });
  }
  for (const a of interviewAttempts) {
    recent.push({
      id: a.id, type: 'interview',
      label: `Entretien · ${a.role} (${a.level})`,
      score: a.score, weight: 1, createdAt: a.createdAt,
      href: '/entretiens',
    });
  }
  for (const lp of lessonProgress) {
    recent.push({
      id: lp.id, type: 'course',
      label: `Cours · ${lp.lesson.title}`,
      score: 100, weight: 0.6, createdAt: lp.updatedAt,
      href: `/cours/${lp.lesson.slug}`,
    });
  }
  for (const b of configBuilds) {
    recent.push({
      id: b.id, type: 'build',
      label: `Configuration · ${b.name}`,
      score: b.score ?? 0, weight: 0.6, createdAt: b.createdAt,
      href: '/constructeur',
    });
  }
  recent.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // === Compteurs d'activité par type ===
  const byType: Record<ActivityFeedItem['type'], number> = {
    quiz: quizAttempts.length,
    exam: examAttempts.length,
    diagnostic: diagnosticAttempts.length,
    interview: interviewAttempts.length,
    course: lessonProgress.length,
    build: configBuilds.length,
  };
  const total = Object.values(byType).reduce((s, v) => s + v, 0);

  // === Faiblesses et recommandation ===
  const sorted = [...skills].sort((a, b) => a.value - b.value);
  const weak = sorted.filter(s => s.value < 75).slice(0, 2);
  const weakSkills = weak.map(s => s.key);

  let recommended: ProgressionReport['recommended'] = null;
  if (total > 0) {
    // Cible : la compétence la plus faible ET active (sinon celle la moins active)
    const activeWeak = sorted.find(s => s.activity > 0.1);
    const leastActive = [...skills].sort((a, b) => a.activity - b.activity).find(s => s.value < 85);
    const target = activeWeak ?? leastActive ?? sorted[0];
    if (target) {
      const def = SKILLS.find(s => s.key === target.key)!;
      const reason = target.activity < 0.2
        ? `Pas encore d'activité mesurée en ${def.label.toLowerCase()}.`
        : target.value < 50
          ? `Score ${target.value}% — à renforcer en priorité.`
          : `Score ${target.value}% — encore perfectible.`;
      recommended = { skill: target.key, href: def.href, cta: def.cta, reason };
    }
  }

  return {
    skills,
    globalPercent,
    xp: totalXp,
    level: getLevel(totalXp),
    activity: { total, byType },
    domains,
    recent: recent.slice(0, 12),
    weakSkills,
    recommended,
  };
}

// Helper : pour conserver une API proche de l'ancien computeDomainMastery.
const SKILL_WEIGHT: Record<SkillKey, number> = SKILLS.reduce((acc, s) => {
  acc[s.key] = s.weight;
  return acc;
}, {} as Record<SkillKey, number>);
