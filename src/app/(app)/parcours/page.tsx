import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { TRACKS } from '@/content/courses';
import { Compass, ArrowRight } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function TracksPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  const tracks = await prisma.track.findMany({ orderBy: { order: 'asc' }, include: { lessons: true } });
  const completed = await prisma.lessonProgress.findMany({ where: { userId: user.id, completed: true } });
  const completedIds = new Set(completed.map(c => c.lessonId));

  return (
    <div className="space-y-6">
      <section className="module-hero">
        <div className="module-eyebrow">Catalogue</div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight flex items-center gap-2 mt-2">
          <Compass className="w-6 h-6 text-text" /> Parcours d&apos;apprentissage
        </h1>
        <p className="text-muted text-[15px] mt-2 max-w-xl">{tracks.length} parcours structurés pour devenir expert.</p>
      </section>

      <div className="grid lg:grid-cols-2 gap-4">
        {tracks.map((t, i) => {
          const meta = TRACKS.find(x => x.slug === t.slug);
          const done = t.lessons.filter(l => completedIds.has(l.id)).length;
          const pct = Math.round((done / Math.max(1, t.lessons.length)) * 100);
          return (
            <div key={t.id} className={`module-frame anim-rise anim-rise-${(i % 4) + 1}`}>
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div>
                  <span className="badge-muted capitalize">{t.level}</span>
                  <h2 className="font-display text-lg font-semibold mt-2">{t.title}</h2>
                  <p className="text-sm text-muted mt-1">{meta?.description || t.description}</p>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-bg-elev overflow-hidden mb-2">
                <div
                  className={`h-full bg-text transition-all duration-500 ease-smooth ${pct > 0 && pct < 100 ? 'progress-fill-shimmer' : ''}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted mb-3 tabular-nums">
                <span>{done} / {t.lessons.length} cours</span>
                <span>{pct}%</span>
              </div>
              <Link href={`/cours?track=${t.slug}`} className="btn-outline text-sm w-full justify-center">
                Voir le parcours <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
