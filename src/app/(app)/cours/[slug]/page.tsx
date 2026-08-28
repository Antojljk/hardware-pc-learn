import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { Clock, CheckCircle2, ArrowLeft, AlertTriangle, Lightbulb, Target, Settings, Sparkles } from 'lucide-react';
import { CompleteButton } from './CompleteButton';

export default async function LessonPage({ params }: { params: { slug: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  const lesson = await prisma.lesson.findUnique({ where: { slug: params.slug }, include: { track: true } });
  if (!lesson) notFound();

  const progress = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId: user.id, lessonId: lesson.id } },
  });

  const takeaways: string[] = JSON.parse(lesson.keyTakeaways || '[]');

  return (
    <article className="space-y-6 max-w-3xl">
      <Link href="/cours" className="text-sm text-text-soft hover:text-text inline-flex items-center gap-1 anim-rise">
        <ArrowLeft className="w-3.5 h-3.5" /> Tous les cours
      </Link>

      <section className="module-hero">
        <div className="module-eyebrow mb-3">{lesson.track.title}</div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-text">
          {lesson.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="badge-muted">{lesson.level}</span>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted">
            <Clock className="w-3 h-3" />{lesson.durationMin} min
          </span>
          {progress?.completed && (
            <span className="badge-accent"><CheckCircle2 className="w-3 h-3" /> Terminé</span>
          )}
        </div>
      </section>

      <section className="coach-card anim-rise anim-rise-1">
        <div className="w-9 h-9 rounded-xl grid place-items-center bg-bg-elev border border-border text-text shrink-0">
          <Target className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs text-muted uppercase tracking-wider mb-1">Objectif</div>
          <p className="text-[15px] leading-relaxed text-text">{lesson.objective}</p>
        </div>
      </section>

      <Section title="Explication simple" body={lesson.simple} icon={<Target className="w-4 h-4" />} delay="anim-rise-2" />
      <Section title="Explication technique" body={lesson.technical} icon={<Settings className="w-4 h-4" />} delay="anim-rise-3" />
      <Section title="Exemples" body={lesson.examples} icon={<Sparkles className="w-4 h-4" />} delay="anim-rise-3" />
      <Section title="Erreurs fréquentes" body={lesson.mistakes} icon={<AlertTriangle className="w-4 h-4" />} delay="anim-rise-4" />

      {takeaways.length > 0 && (
        <section className="card-highlight">
          <div className="module-eyebrow mb-2">Synthèse</div>
          <h2 className="font-display text-lg font-semibold flex items-center gap-2 mb-4">
            <Lightbulb className="w-4 h-4" /> À retenir
          </h2>
          <ul className="space-y-2">
            {takeaways.map((t, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="text-sm">{t}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <CompleteButton slug={lesson.slug} completed={progress?.completed ?? false} />

      <div className="flex flex-wrap gap-3">
        <Link href={`/quiz?lesson=${lesson.slug}`} className="btn-outline">Quiz sur ce cours</Link>
        <Link href="/diagnostic" className="btn-outline">Laboratoire de diagnostic</Link>
      </div>
    </article>
  );
}

function Section({ title, body, icon, delay }: { title: string; body: string; icon: React.ReactNode; delay?: string }) {
  return (
    <section className={`module-frame anim-rise ${delay ?? ''}`}>
      <h2 className="font-display text-base font-semibold mb-3 flex items-center gap-2">
        <span className="w-7 h-7 rounded-lg grid place-items-center bg-bg-elev border border-border text-muted">{icon}</span>
        {title}
      </h2>
      <p className="text-text leading-relaxed whitespace-pre-line">{body}</p>
    </section>
  );
}
