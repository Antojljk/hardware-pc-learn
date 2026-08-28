'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Send } from 'lucide-react';

export function ReviewForm() {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, message }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErr(data.error || 'Erreur');
      return;
    }
    setMessage('');
    setRating(5);
    router.refresh();
  }

  const active = hover || rating;
  const ratingLabel = ['', 'Décevant', 'Moyen', 'Bien', 'Très bien', 'Excellent'][active];

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs uppercase tracking-wider text-muted font-semibold">Note</label>
          <span className="badge-muted">{ratingLabel}</span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(i => (
            <button
              type="button"
              key={i}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(i)}
              className="p-1 transition-transform hover:scale-110"
              aria-label={`${i} étoiles`}
            >
              <Star
                className={`w-7 h-7 ${i <= active ? 'fill-text text-text' : 'text-text-mute'}`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs uppercase tracking-wider text-muted font-semibold" htmlFor="msg">Ton avis</label>
          <span className="text-[10px] text-text-mute tabular-nums">{message.length}/500</span>
        </div>
        <textarea
          id="msg"
          value={message}
          onChange={e => setMessage(e.target.value)}
          maxLength={500}
          rows={4}
          required
          className="w-full px-4 py-3 rounded-2xl bg-bg-elev border border-border focus:border-text outline-none text-sm transition-colors resize-none"
          placeholder="Qu&apos;as-tu pensé de la plateforme ?"
        />
      </div>

      {err && (
        <div className="rounded-xl border border-text/30 bg-text/8 p-3 text-xs text-text">
          {err}
        </div>
      )}

      <button type="submit" disabled={busy} className="btn-primary">
        <Send className="w-4 h-4" /> {busy ? 'Envoi en cours…' : 'Publier mon avis'}
      </button>
    </form>
  );
}
