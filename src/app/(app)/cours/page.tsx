import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { Clock, BookOpen, CheckCircle2, ChevronRight } from 'lucide-react';

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
      <section className="module-hero">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="module-eyebrow">Catalogue</div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-text mt-2">
              Cours
            </h1>
            <p className="text-muted mt-2 text-[15px] max-w-2xl">
              4 parcours pour passer de débutant à expert.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted">
            <span className="badge-muted">{tracks.length} parcours</span>
            <span className="badge-muted">{lessons.length} leçons</span>
          </div>
        </div>
      </section>

      {tracks.map(track => {
        const trackLessons = lessons.filter(l => l.trackId === track.id);
        const done = trackLessons.filter(l => completedIds.has(l.id)).length;
        const pct = trackLessons.length ? Math.round((done / trackLessons.length) * 100) : 0;
        return (
          <section key={track.id} className="module-frame anim-rise anim-rise-1">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
              <div>
                <div className="module-eyebrow mb-1">{track.level}</div>
                <h2 className="text-xl font-semibold text-text">{track.title}</h2>
                <p className="text-sm text-muted mt-1 max-w-xl">{track.description}</p>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted">
                <span className="tabular-nums">{done}/{trackLessons.length} terminés</span>
                <span className="badge-muted">{pct}%</span>
              </div>
            </div>

            <div className="h-1 rounded-full bg-bg-elev overflow-hidden mb-4">
              <div
                className={`h-full bg-text transition-all duration-500 ease-smooth ${pct > 0 && pct < 100 ? 'progress-fill-shimmer' : ''}`}
                style={{ width: `${pct}%` }}
              />
            </div>

            <ul className="grid sm:grid-cols-2 gap-2">
              {trackLessons.map(l => {
                const isDone = completedIds.has(l.id);
                return (
                  <li key={l.id}>
                    <Link
                      href={`/cours/${l.slug}`}
                      className="group relative flex items-center gap-3 p-3.5 rounded-2xl bg-bg-elev border border-border hover:border-text/40 transition-all duration-200 lift-3d overflow-hidden"
                    >
                      <div className={`w-9 h-9 rounded-xl grid place-items-center border ${isDone ? 'bg-text/15 border-text/30 text-text' : 'bg-bg-soft border-border text-muted'}`}>
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-text truncate">{l.title}</div>
                        <div className="flex items-center gap-2 text-xs text-muted mt-0.5">
                          <Clock className="w-3 h-3" />{l.durationMin} min · {l.level}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)' }} />
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
