'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, ArrowRight, RotateCcw } from 'lucide-react';

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
      <div className="card p-6 text-center space-y-2">
        <p className="text-2xl">🎉</p>
        <h2 className="font-bold text-lg">Révisions terminées</h2>
        <p className="text-sm text-text-soft">{good}/{done} cartes acquises. À bientôt !</p>
        <button onClick={() => router.refresh()} className="btn-primary"><RotateCcw className="w-4 h-4" /> Recharger</button>
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
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="text-xs text-text-mute">Carte {Math.min(idx + 1, cards.length)} / {cards.length}</div>
      <div className="card p-6 text-center space-y-3">
        <div className="text-3xl font-bold">{current.term}</div>
        {!revealed ? (
          <button onClick={() => setRevealed(true)} className="btn-primary">Voir la réponse</button>
        ) : (
          <div className="space-y-2 text-left">
            <p className="text-sm"><span className="text-brand-cyan">Simple :</span> {current.simple}</p>
            <p className="text-sm text-text-soft"><span className="text-brand-blue">Technique :</span> {current.technical}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <button disabled={busy} onClick={() => rate(0)} className="btn-outline text-xs"><X className="w-3 h-3" /> Oublié</button>
              <button disabled={busy} onClick={() => rate(3)} className="btn-outline text-xs">Difficile</button>
              <button disabled={busy} onClick={() => rate(4)} className="btn-outline text-xs">Correct</button>
              <button disabled={busy} onClick={() => rate(5)} className="btn-primary text-xs"><Check className="w-3 h-3" /> Facile</button>
            </div>
          </div>
        )}
      </div>
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-xs text-text-mute">
          <ArrowRight className="w-3 h-3" /> {good}/{done} carte{done > 1 ? 's' : ''} validée{done > 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
