import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { Clock, BookOpen, CheckCircle2, ChevronRight, GraduationCap, Layers, BarChart3 } from 'lucide-react';

export default async function CoursesPage() {
  const user = await getCurrentUser();
  const [tracks, lessons, completed] = await Promise.all([
    prisma.track.findMany({ orderBy: { order: 'asc' } }),
    prisma.lesson.findMany({ orderBy: [{ trackId: 'asc' }, { order: 'asc' }] }),
    user ? prisma.lessonProgress.findMany({ where: { userId: user.id, completed: true } }) : [],
  ]);
  const completedIds = new Set(completed.map(c => c.lessonId));

  const totalDone = completedIds.size;
  const totalPct = lessons.length ? Math.round((totalDone / lessons.length) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* HERO : identité forte du module + KPI synthétiques */}
      <section className="module-hero relative">
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="module-eyebrow flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5" /> Catalogue
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-text">
              Cours
            </h1>
            <p className="text-muted text-[15px] max-w-xl leading-relaxed">
              Quatre parcours structurés pour passer de débutant à expert en hardware PC.
              Chaque leçon mêle théorie, exemples concrets et erreurs fréquentes.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto sm:min-w-[360px]">
            <KpiTile icon={<Layers className="w-3.5 h-3.5" />} label="Parcours" value={tracks.length} />
            <KpiTile icon={<BookOpen className="w-3.5 h-3.5" />} label="Leçons" value={lessons.length} />
            <KpiTile icon={<BarChart3 className="w-3.5 h-3.5" />} label="Progression" value={`${totalPct}%`} accent />
          </div>
        </div>
      </section>

      {/* BARRE DE PROGRESSION GLOBALE */}
      <section className="module-frame anim-rise anim-rise-1">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <div className="module-eyebrow mb-1">Vue d&apos;ensemble</div>
            <div className="text-sm text-muted">
              <span className="text-text font-semibold tabular-nums">{totalDone}</span>
              <span> / {lessons.length} leçons terminées</span>
            </div>
          </div>
          <span className="badge-accent tabular-nums">{totalPct}%</span>
        </div>
        <div className="relative h-2 rounded-full bg-bg-elev overflow-hidden">
          <div
            className={`h-full bg-text transition-all duration-700 ease-smooth ${totalPct > 0 && totalPct < 100 ? 'progress-fill-shimmer' : ''}`}
            style={{ width: `${totalPct}%` }}
          />
        </div>
      </section>

      {/* PARCOURS : cartes immersives avec timeline verticale */}
      {tracks.map((track, ti) => {
        const trackLessons = lessons.filter(l => l.trackId === track.id);
        const done = trackLessons.filter(l => completedIds.has(l.id)).length;
        const pct = trackLessons.length ? Math.round((done / trackLessons.length) * 100) : 0;
        const isComplete = pct === 100;
        return (
          <section key={track.id} className={`card-depth relative overflow-hidden anim-rise anim-rise-${Math.min(ti + 1, 4)}`}>
            {/* halo de fond */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-50 blur-3xl"
              style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.08), transparent 70%)' }}
            />

            <div className="relative flex flex-wrap items-end justify-between gap-3 mb-5">
              <div>
                <div className="module-eyebrow mb-1 flex items-center gap-2">
                  <span className="tabular-nums">0{ti + 1}</span>
                  <span className="opacity-50">/</span>
                  <span className="uppercase">{track.level}</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-text">
                  {track.title}
                </h2>
                <p className="text-sm text-muted mt-2 max-w-xl leading-relaxed">{track.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge-muted tabular-nums">{done}/{trackLessons.length}</span>
                <span className={`badge ${isComplete ? 'border-text/50' : 'badge-muted'} tabular-nums`}>
                  {pct}%
                </span>
              </div>
            </div>

            <div className="relative h-1.5 rounded-full bg-bg-elev overflow-hidden mb-6">
              <div
                className={`h-full bg-text transition-all duration-700 ease-smooth ${pct > 0 && pct < 100 ? 'progress-fill-shimmer' : ''}`}
                style={{ width: `${pct}%` }}
              />
            </div>

            <ul className="relative grid sm:grid-cols-2 gap-2.5">
              {trackLessons.map((l, i) => {
                const isDone = completedIds.has(l.id);
                return (
                  <li key={l.id}>
                    <Link
                      href={`/cours/${l.slug}`}
                      className="group relative flex items-center gap-3 p-3.5 rounded-2xl bg-bg-elev/70 backdrop-blur border border-border hover:border-text/50 transition-all duration-200 lift-3d overflow-hidden"
                    >
                      <div className={`relative w-9 h-9 rounded-xl grid place-items-center border transition-colors ${isDone ? 'bg-text/15 border-text/40 text-text' : 'bg-bg-soft border-border text-muted group-hover:text-text'}`}>
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-bg-card border border-border text-[9px] grid place-items-center text-muted font-mono">
                          {i + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-text truncate">{l.title}</div>
                        <div className="flex items-center gap-2 text-xs text-muted mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span className="tabular-nums">{l.durationMin} min</span>
                          <span className="opacity-40">·</span>
                          <span className="capitalize">{l.level}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)' }}
                      />
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

function KpiTile({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number | string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-3 sm:p-3.5 ${accent ? 'bg-text/8 border-text/30' : 'bg-bg-elev/70 border-border'} backdrop-blur`}>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-1.5 font-display text-xl sm:text-2xl font-semibold tabular-nums text-text">
        {value}
      </div>
    </div>
  );
}
