import { getCurrentUser } from '@/lib/auth';
import { getLevel } from '@/lib/xp';
import Link from 'next/link';
import { Flame, Sparkles } from 'lucide-react';

export async function TopBar() {
  const user = await getCurrentUser();
  if (!user) return null;
  const lvl = getLevel(user.xp);
  return (
    <header className="h-20 sticky top-0 z-20 bg-bg-soft/80 backdrop-blur border-b border-border flex items-center px-6 sm:px-10 gap-4">
      <div className="hidden sm:flex items-center gap-3">
        <span className="text-[11px] text-muted uppercase tracking-[0.14em]">Niveau</span>
        <span className="text-sm font-display font-semibold">{lvl.current.title}</span>
        <span className="badge-accent">N{lvl.current.level}</span>
      </div>
      <div className="flex-1 max-w-md hidden md:block">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${lvl.progress}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-faint mt-1.5 uppercase tracking-[0.12em]">
          <span>{user.xp} XP</span>
          <span>{lvl.next.xpRequired} XP</span>
        </div>
      </div>
      <div className="flex-1 md:flex-none" />
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border border-border bg-bg-soft">
          <Flame className="w-4 h-4 text-warning" />
          <span className="font-display font-semibold tabular-nums">{user.streak}</span>
          <span className="text-muted text-xs hidden sm:inline uppercase tracking-[0.1em]">jours</span>
        </div>
        <Link href="/profil" className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-text text-bg hover:opacity-85 transition-all">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span className="text-sm font-medium">{user.username}</span>
        </Link>
      </div>
    </header>
  );
}
