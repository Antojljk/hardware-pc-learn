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

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="text-xs text-text-mute">Note</label>
        <div className="flex gap-1 mt-1">
          {[1, 2, 3, 4, 5].map(i => (
            <button
              type="button"
              key={i}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(i)}
              className="p-1"
              aria-label={`${i} étoiles`}
            >
              <Star
                className={`w-6 h-6 ${i <= active ? 'fill-warning text-warning' : 'text-text-mute'}`}
              />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-xs text-text-mute" htmlFor="msg">Ton avis</label>
        <textarea
          id="msg"
          value={message}
          onChange={e => setMessage(e.target.value)}
          maxLength={500}
          rows={3}
          required
          className="w-full mt-1 px-3 py-2 rounded-lg bg-bg-elev border border-border focus:border-text outline-none text-sm"
          placeholder="Qu&apos;as-tu pensé de la plateforme ?"
        />
        <div className="text-[10px] text-text-mute text-right">{message.length}/500</div>
      </div>
      {err && <div className="text-xs text-danger">{err}</div>}
      <button type="submit" disabled={busy} className="btn-primary">
        <Send className="w-4 h-4" /> {busy ? 'Envoi…' : 'Publier'}
      </button>
    </form>
  );
}
