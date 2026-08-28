'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, ArrowRight, RotateCcw, PartyPopper, Eye } from 'lucide-react';

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
    return (
      <div className="result-hero space-y-3 py-10 anim-rise">
        <div className="w-12 h-12 mx-auto rounded-2xl grid place-items-center bg-bg-elev border border-border">
          <PartyPopper className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold">Révisions terminées</h2>
          <p className="text-sm text-muted mt-1">{good}/{done} cartes acquises. À bientôt !</p>
        </div>
        <button onClick={() => router.refresh()} className="btn-primary mx-auto"><RotateCcw className="w-4 h-4" /> Recharger</button>
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

  return (
    <div className="space-y-4">
      <div className="sticky-stage -mx-6 sm:-mx-10 px-6 sm:px-10">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted tabular-nums">Carte {Math.min(idx + 1, cards.length)}<span className="text-faint"> / {cards.length}</span></span>
          <span className="text-xs text-muted tabular-nums">{good}/{done}</span>
        </div>
        <div className="h-1 rounded-full bg-bg-elev overflow-hidden">
          <div className="h-full bg-text transition-all duration-500 ease-smooth" style={{ width: `${(idx / cards.length) * 100}%` }} />
        </div>
      </div>

      <div key={idx} className="question-card text-center space-y-5 anim-rise">
        <div className="text-xs text-muted uppercase tracking-wider">Terme à mémoriser</div>
        <div className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">{current.term}</div>
        {!revealed ? (
          <button onClick={() => setRevealed(true)} className="btn-primary mx-auto">
            <Eye className="w-4 h-4" /> Voir la réponse
          </button>
        ) : (
          <div className="space-y-4 text-left">
            <div className="p-4 rounded-2xl bg-bg-elev border border-border">
              <div className="text-xs text-muted uppercase tracking-wider mb-1.5">Simple</div>
              <p className="text-sm">{current.simple}</p>
            </div>
            <div className="p-4 rounded-2xl bg-bg-elev border border-border">
              <div className="text-xs text-muted uppercase tracking-wider mb-1.5">Technique</div>
              <p className="text-sm text-muted">{current.technical}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <button disabled={busy} onClick={() => rate(0)} className="btn-outline text-xs"><X className="w-3 h-3" /> Oublié</button>
              <button disabled={busy} onClick={() => rate(3)} className="btn-outline text-xs">Difficile</button>
              <button disabled={busy} onClick={() => rate(4)} className="btn-outline text-xs">Correct</button>
              <button disabled={busy} onClick={() => rate(5)} className="btn-primary text-xs"><Check className="w-3 h-3" /> Facile</button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-xs text-muted inline-flex items-center gap-1.5 w-full justify-center">
        <ArrowRight className="w-3 h-3" />
        <span className="tabular-nums">{good}/{done} carte{done > 1 ? 's' : ''} validée{done > 1 ? 's' : ''}</span>
      </div>
    </div>
  );
}
