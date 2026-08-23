import { prisma } from './prisma';
import { QUESTIONS } from '@/content/quizzes';
import { DOMAINS, DomainKey } from './xp';

export type ProgressMap = Partial<Record<DomainKey, number>>;

export async function computeDomainMastery(userId: string): Promise<ProgressMap> {
  const attempts = await prisma.quizAttempt.findMany({ where: { userId } });
  const totals: Record<string, { correct: number; total: number }> = {};
  for (const att of attempts) {
    let details: { questionId: string; correct: boolean; category?: string }[] = [];
    try { details = JSON.parse(att.details); } catch { /* ignore */ }
    for (const d of details) {
      const q = QUESTIONS.find(x => x.id === d.questionId);
      const cat = d.category || q?.category || '';
      if (!cat) continue;
      totals[cat] = totals[cat] || { correct: 0, total: 0 };
      totals[cat].total++;
      if (d.correct) totals[cat].correct++;
    }
  }
  const map: ProgressMap = {};
  for (const d of DOMAINS) {
    const t = totals[d.key];
    map[d.key] = t ? Math.round((t.correct / Math.max(1, t.total)) * 100) : 0;
  }
  return map;
}

export async function updateStreak(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const last = user.lastActiveAt ? new Date(user.lastActiveAt) : null;
  if (last) last.setHours(0, 0, 0, 0);

  let streak = user.streak;
  if (!last) streak = 1;
  else {
    const diffDays = Math.round((today.getTime() - last.getTime()) / 86400000);
    if (diffDays === 0) { /* same day, no change */ }
    else if (diffDays === 1) streak += 1;
    else if (diffDays > 1) streak = 1;
  }
  await prisma.user.update({ where: { id: userId }, data: { streak, lastActiveAt: new Date() } });
  return streak;
}

export async function grantXp(userId: string, amount: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return 0;
  const newXp = Math.max(0, user.xp + amount);
  await prisma.user.update({ where: { id: userId }, data: { xp: newXp } });
  return newXp;
}

export async function unlockBadges(userId: string) {
  const [user, attempts, interviews, diagnostics, builds] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.quizAttempt.count({ where: { userId } }),
    prisma.interviewAttempt.count({ where: { userId } }),
    prisma.diagnosticAttempt.count({ where: { userId } }),
    prisma.configBuild.count({ where: { userId } }),
  ]);
  if (!user) return [];

  const allBadges = await prisma.badge.findMany();
  const owned = await prisma.badgesOnUsers.findMany({ where: { userId } });
  const ownedSlugs = new Set(owned.map(o => o.badgeId));

  const toUnlock: string[] = [];
  const unlocks = [
    { slug: 'first-quiz', test: attempts >= 1 },
    { slug: 'quiz-10', test: attempts >= 10 },
    { slug: 'first-diagnostic', test: diagnostics >= 1 },
    { slug: 'master-troubleshoot', test: diagnostics >= 5 },
    { slug: 'interview-done', test: interviews >= 1 },
    { slug: 'perfect-build', test: builds >= 1 },
    { slug: 'streak-7', test: user.streak >= 7 },
  ];
  for (const u of unlocks) {
    const b = allBadges.find(x => x.slug === u.slug);
    if (b && u.test && !ownedSlugs.has(b.id)) toUnlock.push(b.id);
  }

  // First course (lesson completed)
  const completedLessons = await prisma.lessonProgress.count({ where: { userId, completed: true } });
  const firstCourse = allBadges.find(b => b.slug === 'first-course');
  if (firstCourse && completedLessons >= 1 && !ownedSlugs.has(firstCourse.id)) toUnlock.push(firstCourse.id);

  // Expert CPU/GPU basé sur la maîtrise
  const mastery = await computeDomainMastery(userId);
  const cpuBadge = allBadges.find(b => b.slug === 'expert-cpu');
  if (cpuBadge && (mastery.cpu ?? 0) >= 90 && !ownedSlugs.has(cpuBadge.id)) toUnlock.push(cpuBadge.id);
  const gpuBadge = allBadges.find(b => b.slug === 'expert-gpu');
  if (gpuBadge && (mastery.gpu ?? 0) >= 90 && !ownedSlugs.has(gpuBadge.id)) toUnlock.push(gpuBadge.id);

  for (const id of toUnlock) {
    await prisma.badgesOnUsers.create({ data: { userId, badgeId: id } });
  }
  return toUnlock.map(id => allBadges.find(b => b.id === id)?.name).filter(Boolean) as string[];
}
