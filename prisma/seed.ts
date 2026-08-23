/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import { COURSES, TRACKS } from '../src/content/courses';
import { QUESTIONS, EXAMS } from '../src/content/quizzes';
import { TERMS } from '../src/content/glossary';
import { COMPONENTS } from '../src/content/components';
import { SCENARIOS } from '../src/content/diagnostics';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed démarré…');

  // Tracks
  TRACKS.forEach((t, i) => { (t as any).order = i; });
  for (const t of TRACKS) {
    await prisma.track.upsert({
      where: { slug: t.slug },
      update: { title: t.title, level: t.level, description: t.description, order: (t as any).order ?? 0 },
      create: { ...t, order: (t as any).order ?? 0 },
    });
  }
  console.log(`✓ ${TRACKS.length} tracks`);

  // Courses
  for (const c of COURSES) {
    const track = await prisma.track.findUnique({ where: { slug: c.trackSlug } });
    if (!track) continue;
    await prisma.lesson.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        slug: c.slug,
        trackId: track.id,
        title: c.title,
        level: c.level,
        durationMin: c.durationMin,
        order: 0,
        objective: c.objective,
        simple: c.simple,
        technical: c.technical,
        examples: c.examples,
        mistakes: c.mistakes,
        keyTakeaways: JSON.stringify(c.keyTakeaways),
      },
    });
  }
  console.log(`✓ ${COURSES.length} cours`);

  // Quiz questions
  for (const q of QUESTIONS) {
    await prisma.quizQuestion.upsert({
      where: { id: q.id },
      update: {},
      create: {
        id: q.id,
        category: q.category,
        difficulty: q.difficulty,
        type: q.type,
        prompt: q.prompt,
        choices: JSON.stringify(q.choices),
        answer: typeof q.answer === 'string' ? q.answer : JSON.stringify(q.answer),
        explanation: q.explanation,
        xpReward: q.xpReward,
      },
    });
  }
  console.log(`✓ ${QUESTIONS.length} questions`);

  // Exams
  for (const e of EXAMS) {
    await prisma.exam.upsert({
      where: { slug: e.slug },
      update: {},
      create: {
        slug: e.slug,
        title: e.title,
        level: e.level,
        durationSec: e.durationSec,
        questionIds: JSON.stringify(e.questionIds),
      },
    });
  }
  console.log(`✓ ${EXAMS.length} examens`);

  // Glossary
  for (const term of TERMS) {
    await prisma.glossaryTerm.upsert({
      where: { slug: term.slug },
      update: {},
      create: {
        slug: term.slug,
        term: term.term,
        simple: term.simple,
        technical: term.technical,
        example: term.example || null,
        level: term.level,
        categories: term.categories.join(','),
      },
    });
  }
  console.log(`✓ ${TERMS.length} termes`);

  // Components
  for (const c of COMPONENTS) {
    await prisma.component.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        type: c.type,
        brand: c.brand,
        model: c.model,
        price: c.price,
        specs: JSON.stringify(c.specs),
        category: c.category || null,
      },
    });
  }
  console.log(`✓ ${COMPONENTS.length} composants`);

  // Diagnostic scenarios
  for (const s of SCENARIOS) {
    await prisma.diagnosticScenario.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        slug: s.slug,
        title: s.title,
        symptoms: JSON.stringify(s.symptoms),
        steps: JSON.stringify({ idealSequence: s.idealSequence, optionalAcceptable: s.optionalAcceptable, wrongMoves: s.wrongMoves, rootCause: s.rootCause, solution: s.solution }),
        category: s.category,
        difficulty: s.difficulty,
      },
    });
  }
  console.log(`✓ ${SCENARIOS.length} scénarios`);

  // Badges par défaut
  const badges = [
    { slug: 'first-course',     name: 'Premier cours',      description: 'Termine ton premier cours',         icon: '🎓' },
    { slug: 'first-quiz',       name: 'Premier quiz',       description: 'Réussis ton premier quiz',          icon: '✅' },
    { slug: 'quiz-10',          name: '10 quiz réussis',    description: 'Réussis 10 quiz',                    icon: '🏆' },
    { slug: 'first-diagnostic', name: 'Diagnostic réussi',  description: 'Résous ton premier diagnostic',     icon: '🛠️' },
    { slug: 'expert-cpu',       name: 'Expert CPU',         description: 'Maîtrise CPU (90%+)',               icon: '🧠' },
    { slug: 'expert-gpu',       name: 'Expert GPU',         description: 'Maîtrise GPU (90%+)',               icon: '🎮' },
    { slug: 'master-troubleshoot', name: 'Maître du dépannage', description: 'Résous 5 diagnostics',         icon: '�' },
    { slug: 'perfect-build',    name: 'Configuration parfaite', description: 'Configuration compatible 100%',  icon: '💎' },
    { slug: 'interview-done',   name: 'Entretien réussi',   description: 'Termine un entretien blanc',        icon: '💬' },
    { slug: 'streak-7',         name: 'Série de 7 jours',   description: '7 jours consécutifs d\'apprentissage', icon: '🔥' },
  ];
  for (const b of badges) {
    await prisma.badge.upsert({ where: { slug: b.slug }, update: {}, create: b });
  }
  console.log(`✓ ${badges.length} badges`);

  console.log('🌱 Seed terminé.');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
