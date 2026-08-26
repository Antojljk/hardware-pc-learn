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

  const levelColor: Record<string, string> = {
    debutant: 'border-success/30 text-success',
    intermediaire: 'border-brand-blue/30 text-brand-blue',
    avance: 'border-brand-violet/30 text-brand-violet',
    expert: 'border-warning/30 text-warning',
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Compass className="w-5 h-5 text-brand-blue" /> Parcours d&apos;apprentissage</h1>
        <p className="text-text-soft text-sm">4 parcours structurés pour devenir expert.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-4">
        {tracks.map(t => {
          const meta = TRACKS.find(x => x.slug === t.slug);
          const done = t.lessons.filter(l => completedIds.has(l.id)).length;
          const pct = Math.round((done / Math.max(1, t.lessons.length)) * 100);
          return (
            <div key={t.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div>
                  <span className={`badge bg-bg-elev border ${levelColor[t.level]}`}>{t.level}</span>
                  <h2 className="text-lg font-semibold mt-2">{t.title}</h2>
                  <p className="text-sm text-text-soft mt-1">{meta?.description || t.description}</p>
                </div>
              </div>
              <div className="h-2 rounded-full bg-bg-elev overflow-hidden mb-2">
                <div className="h-full bg-gradient-to-r from-brand-blue to-brand-violet" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex items-center justify-between text-xs text-text-mute mb-3">
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
