import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { Clock, BookOpen, CheckCircle2 } from 'lucide-react';

export default async function CoursesPage() {
  const user = await getCurrentUser();
  const [tracks, lessons, completed] = await Promise.all([
    prisma.track.findMany({ orderBy: { order: 'asc' } }),
    prisma.lesson.findMany({ orderBy: [{ trackId: 'asc' }, { order: 'asc' }] }),
    user ? prisma.lessonProgress.findMany({ where: { userId: user.id, completed: true } }) : [],
  ]);
  const completedIds = new Set(completed.map(c => c.lessonId));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl sm:text-4xl font-display font-semibold tracking-tight text-text">
          Cours
        </h1>
        <p className="text-muted mt-2 text-[15px]">
          4 parcours pour passer de débutant à expert.
        </p>
      </header>

      {tracks.map(track => {
        const trackLessons = lessons.filter(l => l.trackId === track.id);
        const done = trackLessons.filter(l => completedIds.has(l.id)).length;
        return (
          <section key={track.id} className="card p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-2 mb-4">
              <div>
                <div className="text-xs text-accent mb-1 uppercase tracking-[0.12em]">{track.level}</div>
                <h2 className="text-xl font-semibold text-text">{track.title}</h2>
                <p className="text-sm text-muted mt-1">{track.description}</p>
              </div>
              <div className="text-sm text-muted">{done}/{trackLessons.length} terminés</div>
            </div>
            <ul className="grid sm:grid-cols-2 gap-2">
              {trackLessons.map(l => {
                const isDone = completedIds.has(l.id);
                return (
                  <li key={l.id}>
                    <Link
                      href={`/cours/${l.slug}`}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-bg-elev border border-border hover:border-accent/40 transition"
                    >
                      <div className={`w-8 h-8 rounded-lg grid place-items-center ${isDone ? 'bg-success/15 text-success' : 'bg-bg-soft text-muted'}`}>
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-text truncate">{l.title}</div>
                        <div className="flex items-center gap-2 text-xs text-muted mt-0.5">
                          <Clock className="w-3 h-3" />{l.durationMin} min · {l.level}
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
