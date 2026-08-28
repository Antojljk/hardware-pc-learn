import { Star, MessageSquareQuote, Users, BarChart3, Sparkles, Send, CalendarDays } from 'lucide-react';
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

  // Distribution des notes
  const distribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length,
    pct: reviews.length ? Math.round((reviews.filter(r => r.rating === stars).length / reviews.length) * 100) : 0,
  }));

  // Mes avis
  const myReviews = reviews.filter(r => r.user.username === user.username);
  const myAvg = myReviews.length
    ? myReviews.reduce((s, r) => s + r.rating, 0) / myReviews.length
    : 0;

  return (
    <div className="space-y-6">
      {/* HERO */}
      <section className="module-hero">
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="module-eyebrow flex items-center gap-2">
              <Users className="w-3.5 h-3.5" /> Communauté
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight flex items-center gap-3">
              <MessageSquareQuote className="w-8 h-8 sm:w-10 sm:h-10 text-text" />
              Avis
            </h1>
            <p className="text-muted text-[15px] max-w-xl leading-relaxed">
              Donne ton retour sur la plateforme. Tes retours aident à façonner
              l&apos;expérience pour toute la communauté.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto sm:min-w-[360px]">
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Star className="w-3.5 h-3.5" /> Moyenne
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {avg.toFixed(1)}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <MessageSquareQuote className="w-3.5 h-3.5" /> Total
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {reviews.length}
              </div>
            </div>
            <div className="rounded-2xl border border-text/30 bg-text/8 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Sparkles className="w-3.5 h-3.5" /> Mes notes
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {myAvg > 0 ? myAvg.toFixed(1) : '—'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RÉSUMÉ & DISTRIBUTION */}
      <div className="grid lg:grid-cols-2 gap-3">
        <section className="module-frame anim-rise anim-rise-1">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-muted" />
            <h2 className="section-title">Note moyenne</h2>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <div className="font-display text-5xl font-semibold tabular-nums">{avg.toFixed(1)}</div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i <= Math.round(avg) ? 'fill-text text-text' : 'text-text-mute'}`}
                  />
                ))}
              </div>
              <div className="text-xs text-muted tabular-nums">
                Basé sur {reviews.length} avis
              </div>
            </div>
          </div>
        </section>

        <section className="module-frame anim-rise anim-rise-2">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-muted" />
            <h2 className="section-title">Distribution</h2>
          </div>
          {reviews.length === 0 ? (
            <p className="text-sm text-muted">Aucune note pour le moment.</p>
          ) : (
            <ul className="space-y-1.5">
              {distribution.map(d => (
                <li key={d.stars} className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-0.5 w-12 shrink-0">
                    <span className="font-medium tabular-nums w-4 text-right">{d.stars}</span>
                    <Star className="w-3 h-3 text-text" />
                  </div>
                  <div className="flex-1 h-1.5 rounded-full bg-bg-elev overflow-hidden">
                    <div
                      className="h-full bg-text transition-all duration-500 ease-smooth"
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted tabular-nums w-16 text-right">
                    {d.count} ({d.pct}%)
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* FORMULAIRE */}
      <section className="module-frame anim-rise anim-rise-3">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg grid place-items-center bg-bg-elev border border-border">
            <Send className="w-4 h-4 text-text" />
          </div>
          <div>
            <h2 className="section-title">Laisser un avis</h2>
            <p className="text-xs text-muted mt-0.5">Partage ton expérience, ça prend 30 secondes.</p>
          </div>
        </div>
        <ReviewForm />
      </section>

      {/* TOUS LES AVIS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="section-title flex items-center gap-2">
            <MessageSquareQuote className="w-4 h-4" /> Tous les avis
          </h2>
          <span className="badge-muted tabular-nums">{reviews.length}</span>
        </div>
        {reviews.length === 0 ? (
          <div className="module-frame text-center text-muted text-sm py-10">
            Aucun avis pour le moment. Sois le premier !
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {reviews.map((r, i) => (
              <article
                key={r.id}
                className={`card-depth relative overflow-hidden p-5 anim-rise anim-rise-${(i % 4) + 1}`}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-40 blur-3xl"
                  style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.10), transparent 70%)' }}
                />
                <div className="relative space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 min-w-0">
                      <div className="font-medium truncate">{r.user.username}</div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(j => (
                          <Star
                            key={j}
                            className={`w-3.5 h-3.5 ${j <= r.rating ? 'fill-text text-text' : 'text-text-mute'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-muted shrink-0 inline-flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {new Date(r.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-sm text-muted whitespace-pre-wrap leading-relaxed">{r.message}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
