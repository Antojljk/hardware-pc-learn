import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { Clock, CheckCircle2, ArrowLeft, AlertTriangle, Lightbulb, Target } from 'lucide-react';
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
      <Link href="/cours" className="text-sm text-text-soft hover:text-text inline-flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Tous les cours
      </Link>

      <header>
        <div className="flex flex-wrap items-center gap-2 text-xs text-text-mute mb-2">
          <span className="badge bg-brand-blue/10 border-brand-blue/30 text-brand-blue">{lesson.track.title}</span>
          <span className="badge bg-bg-elev border-border">{lesson.level}</span>
          <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{lesson.durationMin} min</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
        <div className="flex items-start gap-2 text-text-soft">
          <Target className="w-4 h-4 mt-1 text-brand-blue shrink-0" />
          <p>{lesson.objective}</p>
        </div>
      </header>

      <Section title="Explication simple" body={lesson.simple} icon="🎯" />
      <Section title="Explication technique" body={lesson.technical} icon="⚙️" />

      <Section title="Exemples" body={lesson.examples} icon="💡" />
      <Section title="Erreurs fréquentes" body={lesson.mistakes} icon={<AlertTriangle className="w-4 h-4 text-warning inline" />} />

      {takeaways.length > 0 && (
        <section className="card p-5 bg-gradient-to-br from-brand-blue/10 to-brand-violet/10 border-brand-blue/30">
          <h2 className="font-semibold flex items-center gap-2 mb-3"><Lightbulb className="w-4 h-4 text-warning" /> À retenir</h2>
          <ul className="space-y-2">
            {takeaways.map((t, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
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

function Section({ title, body, icon }: { title: string; body: string; icon: React.ReactNode }) {
  return (
    <section className="card p-5">
      <h2 className="font-semibold mb-3 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h2>
      <p className="text-text leading-relaxed whitespace-pre-line">{body}</p>
    </section>
  );
}
