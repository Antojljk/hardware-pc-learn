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
      <header>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquareQuote className="w-5 h-5 text-brand-blue" /> Avis
        </h1>
        <p className="text-text-soft text-sm">Donne ton retour sur la plateforme.</p>
      </header>

      <section className="card p-5 bg-gradient-to-br from-bg-card to-bg-elev">
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-4xl font-bold">{avg.toFixed(1)}</div>
          <div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map(i => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i <= Math.round(avg) ? 'fill-warning text-warning' : 'text-text-mute'}`}
                />
              ))}
            </div>
            <div className="text-xs text-text-mute">{reviews.length} avis</div>
          </div>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="section-title mb-3">Laisser un avis</h2>
        <ReviewForm />
      </section>

      <section className="space-y-3">
        <h2 className="section-title">Tous les avis</h2>
        {reviews.length === 0 ? (
          <div className="card p-5 text-text-soft text-sm">Aucun avis pour le moment. Sois le premier !</div>
        ) : (
          reviews.map(r => (
            <article key={r.id} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{r.user.username}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i <= r.rating ? 'fill-warning text-warning' : 'text-text-mute'}`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-text-mute">
                  {new Date(r.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <p className="text-sm text-text-soft whitespace-pre-wrap">{r.message}</p>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
