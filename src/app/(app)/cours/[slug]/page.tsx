import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { Clock, CheckCircle2, ArrowLeft, ArrowRight, AlertTriangle, Lightbulb, Target, Settings, Sparkles, BookOpen } from 'lucide-react';
import { CompleteButton } from './CompleteButton';

export default async function LessonPage({ params }: { params: { slug: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  const lesson = await prisma.lesson.findUnique({ where: { slug: params.slug }, include: { track: true } });
  if (!lesson) notFound();

  const progress = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId: user.id, lessonId: lesson.id } },
  });

  // Chapitre suivant dans le même parcours
  const nextLesson = await prisma.lesson.findFirst({
    where: { trackId: lesson.trackId, order: { gt: lesson.order } },
    orderBy: { order: 'asc' },
  });

  const takeaways: string[] = JSON.parse(lesson.keyTakeaways || '[]');
  const position = `${lesson.track.title}`;

  return (
    <article className="space-y-6 max-w-3xl">
      {/* Fil d'Ariane */}
      <nav className="flex flex-wrap items-center gap-2 text-xs text-muted anim-rise">
        <Link href="/cours" className="inline-flex items-center gap-1.5 hover:text-text transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Cours
        </Link>
        <span className="opacity-40">/</span>
        <span className="text-text-soft">{position}</span>
        <span className="opacity-40">/</span>
        <span className="text-text truncate max-w-[260px]">{lesson.title}</span>
      </nav>

      {/* HERO : titre + métadonnées + statut */}
      <section className="module-hero">
        <div className="module-eyebrow mb-3 flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Leçon</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-text leading-[1.05]">
          {lesson.title}
        </h1>
        <p className="text-muted text-[15px] mt-3 max-w-2xl leading-relaxed">
          {lesson.objective}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-5">
          <span className="badge-muted uppercase">{lesson.level}</span>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted">
            <Clock className="w-3 h-3" />
            <span className="tabular-nums">{lesson.durationMin} min</span>
          </span>
          {progress?.completed && (
            <span className="badge-accent inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" /> Terminé
            </span>
          )}
        </div>
      </section>

      {/* SOMMAIRE IMMERSIF — permet de scanner la leçon rapidement */}
      <section className="module-frame anim-rise anim-rise-1">
        <div className="module-eyebrow mb-3">Au programme</div>
        <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <PlanItem label="Explication simple" />
          <PlanItem label="Explication technique" />
          <PlanItem label="Exemples" />
          <PlanItem label="Erreurs fréquentes" />
          {takeaways.length > 0 && <PlanItem label="À retenir" />}
        </ol>
      </section>

      {/* OBJECTIF — encadré coach */}
      <section className="coach-card anim-rise anim-rise-2">
        <div className="w-10 h-10 rounded-xl grid place-items-center bg-bg-elev border border-border text-text shrink-0">
          <Target className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] text-muted uppercase tracking-[0.14em] font-semibold mb-1">Objectif de la leçon</div>
          <p className="text-[15px] leading-relaxed text-text">{lesson.objective}</p>
        </div>
      </section>

      {/* CONTENU — sections pédagogiques */}
      <Section title="Explication simple" body={lesson.simple} icon={<Target className="w-4 h-4" />} delay="anim-rise-2" tone="muted" />
      <Section title="Explication technique" body={lesson.technical} icon={<Settings className="w-4 h-4" />} delay="anim-rise-3" tone="muted" />
      <Section title="Exemples" body={lesson.examples} icon={<Sparkles className="w-4 h-4" />} delay="anim-rise-3" tone="muted" />
      <Section title="Erreurs fréquentes" body={lesson.mistakes} icon={<AlertTriangle className="w-4 h-4" />} delay="anim-rise-4" tone="warning" />

      {/* SYNTHÈSE */}
      {takeaways.length > 0 && (
        <section className="card-highlight anim-rise anim-rise-4">
          <div className="module-eyebrow mb-2">Synthèse</div>
          <h2 className="font-display text-xl sm:text-2xl font-semibold flex items-center gap-2 mb-5">
            <span className="w-9 h-9 rounded-xl grid place-items-center bg-text/10 border border-text/30">
              <Lightbulb className="w-4 h-4" />
            </span>
            À retenir
          </h2>
          <ul className="space-y-2.5">
            {takeaways.map((t, i) => (
              <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-bg-card/40 border border-border/60">
                <span className="font-mono text-xs text-muted shrink-0 mt-0.5 w-6 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm leading-relaxed text-text">{t}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ACTION : validation + suites */}
      <section className="space-y-3 anim-rise anim-rise-4">
        <CompleteButton slug={lesson.slug} completed={progress?.completed ?? false} />

        <div className="grid sm:grid-cols-2 gap-2.5">
          <Link
            href={`/quiz?lesson=${lesson.slug}`}
            className="module-frame lift-3d flex items-center gap-3 group p-4"
          >
            <div className="w-10 h-10 rounded-xl grid place-items-center bg-bg-elev border border-border text-text shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">Quiz sur ce cours</div>
              <div className="text-xs text-muted">Valide tes acquis en 5 questions</div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted group-hover:text-text group-hover:translate-x-0.5 transition-all" />
          </Link>
          <Link
            href="/diagnostic"
            className="module-frame lift-3d flex items-center gap-3 group p-4"
          >
            <div className="w-10 h-10 rounded-xl grid place-items-center bg-bg-elev border border-border text-text shrink-0">
              <Settings className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">Laboratoire de diagnostic</div>
              <div className="text-xs text-muted">Appliquer sur un cas réel</div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted group-hover:text-text group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>

        {nextLesson && (
          <Link
            href={`/cours/${nextLesson.slug}`}
            className="group block module-frame p-4 hover:border-text/40 transition-colors"
          >
            <div className="text-[11px] text-muted uppercase tracking-[0.14em] font-semibold mb-1">Leçon suivante</div>
            <div className="flex items-center justify-between gap-3">
              <div className="font-medium text-text">{nextLesson.title}</div>
              <ArrowRight className="w-4 h-4 text-muted group-hover:text-text group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        )}
      </section>
    </article>
  );
}

function PlanItem({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-2.5 text-text-soft py-1">
      <span className="w-1.5 h-1.5 rounded-full bg-text/40 shrink-0" />
      <span className="text-text-soft">{label}</span>
    </li>
  );
}

function Section({
  title, body, icon, delay, tone = 'muted',
}: { title: string; body: string; icon: React.ReactNode; delay?: string; tone?: 'muted' | 'warning' }) {
  const accent = tone === 'warning';
  return (
    <section className={`module-frame anim-rise ${delay ?? ''} relative overflow-hidden`}>
      {accent && (
        <div
          aria-hidden
          className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-30 blur-2xl"
          style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.12), transparent 70%)' }}
        />
      )}
      <h2 className="font-display text-base font-semibold mb-3 flex items-center gap-2.5">
        <span className={`w-8 h-8 rounded-lg grid place-items-center border ${accent ? 'bg-text/10 border-text/30 text-text' : 'bg-bg-elev border-border text-text'}`}>
          {icon}
        </span>
        <span className="text-text">{title}</span>
      </h2>
      <p className="text-text leading-relaxed whitespace-pre-line text-[15px]">{body}</p>
    </section>
  );
}
