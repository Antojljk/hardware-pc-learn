'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, ArrowRight, RotateCcw, PartyPopper, Eye, BookOpen, GraduationCap, Sparkles } from 'lucide-react';

type Card = { slug: string; term: string; simple: string; technical: string; ease: number; interval: number; reps: number };

export function ReviewRunner({ cards }: { cards: Card[] }) {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(0);
  const [good, setGood] = useState(0);
  const [busy, setBusy] = useState(false);
  const current = cards[idx];

  if (!current) {
    const accuracy = done > 0 ? Math.round((good / done) * 100) : 0;
    return (
      <div className="result-hero space-y-4 py-10 anim-rise">
        <div className="w-14 h-14 mx-auto rounded-2xl grid place-items-center bg-bg-elev border border-border">
          <PartyPopper className="w-6 h-6 text-text" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">Révisions terminées</h2>
          <p className="text-sm text-muted mt-1.5">{good}/{done} cartes acquises · {accuracy}% de réussite</p>
        </div>
        <button onClick={() => router.refresh()} className="btn-primary mx-auto">
          <RotateCcw className="w-4 h-4" /> Recharger
        </button>
      </div>
    );
  }

  async function rate(quality: 0 | 3 | 4 | 5) {
    setBusy(true);
    try {
      await fetch('/api/review', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ termSlug: current.slug, quality }),
      });
      setDone(d => d + 1);
      if (quality >= 3) setGood(g => g + 1);
      setRevealed(false);
      setIdx(i => i + 1);
    } finally {
      setBusy(false);
    }
  }

  const progressPct = (idx / cards.length) * 100;
  const sessionPct = done > 0 ? Math.round((good / done) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="sticky-stage -mx-6 sm:-mx-10 px-6 sm:px-10">
        <div className="flex items-center justify-between text-sm mb-2.5">
          <span className="text-muted tabular-nums">
            Carte <span className="text-text font-medium">{Math.min(idx + 1, cards.length)}</span>
            <span className="text-faint"> / {cards.length}</span>
          </span>
          <div className="flex items-center gap-2">
            {done > 0 && (
              <span className="badge-muted tabular-nums">Précision {sessionPct}%</span>
            )}
            <span className="text-xs text-muted tabular-nums">{good}/{done}</span>
          </div>
        </div>
        <div className="h-1.5 rounded-full bg-bg-elev overflow-hidden">
          <div
            className="h-full bg-text transition-all duration-500 ease-smooth"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div key={idx} className="question-card text-center space-y-5 anim-rise">
        <div className="module-eyebrow">Terme à mémoriser</div>
        <div className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">{current.term}</div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] uppercase tracking-wider text-muted">
          {current.reps === 0 ? (
            <span className="badge-muted">Nouvelle</span>
          ) : (
            <span className="badge-muted">Renforcement</span>
          )}
          {current.interval > 0 && <span className="badge-muted">Intervalle {current.interval}j</span>}
          {current.ease > 0 && <span className="badge-muted">Ease {current.ease.toFixed(1)}</span>}
        </div>

        {!revealed ? (
          <button onClick={() => setRevealed(true)} className="btn-primary mx-auto">
            <Eye className="w-4 h-4" /> Voir la réponse
          </button>
        ) : (
          <div className="space-y-4 text-left">
            <div className="card-depth relative overflow-hidden p-5 sm:p-6">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-50 blur-3xl"
                style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.10), transparent 70%)' }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg grid place-items-center bg-bg-elev border border-border">
                    <Sparkles className="w-3.5 h-3.5 text-text" />
                  </div>
                  <div className="module-eyebrow">Explication simple</div>
                </div>
                <p className="text-sm leading-relaxed">{current.simple}</p>
              </div>
            </div>

            <div className="card-depth relative overflow-hidden p-5 sm:p-6">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-50 blur-3xl"
                style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.10), transparent 70%)' }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg grid place-items-center bg-bg-elev border border-border">
                    <BookOpen className="w-3.5 h-3.5 text-text" />
                  </div>
                  <div className="module-eyebrow">Version technique</div>
                </div>
                <p className="text-sm text-muted leading-relaxed">{current.technical}</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <div className="module-eyebrow text-center">Comment t&apos;es-tu senti ?</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button disabled={busy} onClick={() => rate(0)} className="btn-outline text-xs">
                  <X className="w-3 h-3" /> Oublié
                </button>
                <button disabled={busy} onClick={() => rate(3)} className="btn-outline text-xs">
                  Difficile
                </button>
                <button disabled={busy} onClick={() => rate(4)} className="btn-outline text-xs">
                  Correct
                </button>
                <button disabled={busy} onClick={() => rate(5)} className="btn-primary text-xs">
                  <Check className="w-3 h-3" /> Facile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {done > 0 && (
        <div className="text-center text-xs text-muted inline-flex items-center gap-1.5 w-full justify-center">
          <GraduationCap className="w-3 h-3" />
          <span className="tabular-nums">{good}/{done} carte{done > 1 ? 's' : ''} validée{done > 1 ? 's' : ''}</span>
        </div>
      )}
    </div>
  );
}

void ArrowRight;
