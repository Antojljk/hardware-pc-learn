'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';

export function CompleteButton({ slug, completed }: { slug: string; completed: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(completed);
  const [justEarned, setJustEarned] = useState<number | null>(null);

  async function complete() {
    setLoading(true);
    try {
      const res = await fetch('/api/lessons/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (data.ok) {
        setDone(true);
        setJustEarned(data.xpAwarded ?? 30);
        if (data.newBadges?.length) {
          alert(`+${data.xpAwarded} XP\nNouveau(x) badge(s) : ${data.newBadges.join(', ')}`);
        }
        router.refresh();
      }
    } finally { setLoading(false); }
  }

  if (done) {
    return (
      <div className="relative module-frame flex items-center gap-3 border-text/30 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-50 blur-2xl"
          style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.12), transparent 70%)' }}
        />
        <div className="relative w-10 h-10 rounded-xl grid place-items-center bg-text/15 border border-text/40 shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="relative flex-1">
          <div className="font-semibold">Cours terminé</div>
          <div className="text-xs text-muted">Tu as déjà validé ce cours. Bravo.</div>
        </div>
        {justEarned != null && (
          <div className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-text/10 border border-text/30 text-sm shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-semibold tabular-nums">+{justEarned}</span>
            <span className="text-muted text-xs">XP</span>
          </div>
        )}
      </div>
    );
  }
  return (
    <button
      onClick={complete}
      disabled={loading}
      className="btn-primary w-full justify-center py-3 text-[15px]"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
      Marquer comme terminé
      <span className="ml-1 text-text-soft/70 font-normal">(+30 XP)</span>
    </button>
  );
}
