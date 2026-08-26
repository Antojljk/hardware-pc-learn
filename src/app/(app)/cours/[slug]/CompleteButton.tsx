'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';

export function CompleteButton({ slug, completed }: { slug: string; completed: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(completed);

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
        if (data.newBadges?.length) {
          alert(`+${data.xpAwarded} XP 🎉\nNouveau(x) badge(s) : ${data.newBadges.join(', ')}`);
        }
        router.refresh();
      }
    } finally { setLoading(false); }
  }

  if (done) {
    return (
      <div className="card p-4 flex items-center gap-3 border-success/30 bg-success/5">
        <CheckCircle2 className="w-5 h-5 text-success" />
        <div className="flex-1">
          <div className="font-medium">Cours terminé</div>
          <div className="text-xs text-text-soft">Tu as déjà validé ce cours.</div>
        </div>
      </div>
    );
  }
  return (
    <button onClick={complete} disabled={loading} className="btn-primary w-full justify-center">
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
      Marquer comme terminé (+30 XP)
    </button>
  );
}
