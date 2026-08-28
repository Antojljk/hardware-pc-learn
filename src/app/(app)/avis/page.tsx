import { Star, MessageSquareQuote } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ReviewForm } from './ReviewForm';

export const dynamic = 'force-dynamic';

export default async function AvisPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { user: { select: { username: true } } },
  });

  const avg = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="space-y-6">
      <section className="module-hero">
        <div className="module-eyebrow">Communauté</div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight flex items-center gap-2 mt-2">
          <MessageSquareQuote className="w-6 h-6 text-text" /> Avis
        </h1>
        <p className="text-muted text-[15px] mt-2 max-w-xl">Donne ton retour sur la plateforme.</p>
      </section>

      <section className="module-frame anim-rise anim-rise-1">
        <div className="flex flex-wrap items-center gap-4">
          <div className="font-display text-4xl font-semibold tabular-nums">{avg.toFixed(1)}</div>
          <div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map(i => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i <= Math.round(avg) ? 'fill-text text-text' : 'text-text-mute'}`}
                />
              ))}
            </div>
            <div className="text-xs text-muted mt-1">{reviews.length} avis</div>
          </div>
        </div>
      </section>

      <section className="module-frame anim-rise anim-rise-2">
        <h2 className="section-title mb-3">Laisser un avis</h2>
        <ReviewForm />
      </section>

      <section className="space-y-3">
        <h2 className="section-title">Tous les avis</h2>
        {reviews.length === 0 ? (
          <div className="module-frame text-muted text-sm">Aucun avis pour le moment. Sois le premier !</div>
        ) : (
          reviews.map((r, i) => (
            <article key={r.id} className={`module-frame anim-rise anim-rise-${(i % 4) + 1}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{r.user.username}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(j => (
                      <Star
                        key={j}
                        className={`w-3.5 h-3.5 ${j <= r.rating ? 'fill-text text-text' : 'text-text-mute'}`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-muted">
                  {new Date(r.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <p className="text-sm text-muted whitespace-pre-wrap">{r.message}</p>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
