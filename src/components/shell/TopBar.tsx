import { getCurrentUser } from '@/lib/auth';
import { getLevel } from '@/lib/xp';
import Link from 'next/link';
import { Flame } from 'lucide-react';

export async function TopBar() {
  const user = await getCurrentUser();
  if (!user) return null;
  const lvl = getLevel(user.xp);
  return (
    <header className="h-[68px] sticky top-0 z-20 flex items-center px-6 sm:px-10 gap-4"
      style={{
        background: 'color-mix(in srgb, var(--color-bg) 82%, transparent)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--color-border-soft)',
      }}>

      {/* Niveau + barre XP */}
      <div className="hidden md:flex items-center gap-4 flex-1 min-w-0 max-w-sm">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--color-faint)' }}>Niv.</span>
          <span className="font-display font-semibold text-sm text-white">{lvl.current.level}</span>
          <span className="hidden lg:block text-[11px]" style={{ color: 'var(--color-muted)' }}>{lvl.current.title}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${lvl.progress}%`,
                background: 'linear-gradient(90deg, #5B5FEE, #818CF8)',
                boxShadow: '0 0 8px rgba(91,95,238,0.45)',
              }}
            />
          </div>
          <div className="flex justify-between mt-1 text-[9px] uppercase tracking-[0.12em]" style={{ color: 'var(--color-faint)' }}>
            <span>{user.xp} XP</span>
            <span>{lvl.next.xpRequired} XP</span>
          </div>
        </div>
      </div>

      <div className="flex-1" />

      {/* Streak + Profil */}
      <div className="flex items-center gap-2.5">
        <div
          className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full"
          style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
        >
          <Flame className="w-3.5 h-3.5" style={{ color: '#F59E0B' }} />
          <span className="font-display font-semibold tabular-nums text-white">{user.streak}</span>
          <span className="text-xs hidden sm:inline uppercase tracking-[0.1em]" style={{ color: 'var(--color-muted)' }}>j</span>
        </div>
        <Link
          href="/profil"
          className="flex items-center gap-2 px-4 py-1.5 rounded-full font-medium text-sm text-white transition-all hover:brightness-110"
          style={{
            background: 'linear-gradient(135deg, #5B5FEE, #6366F1)',
            boxShadow: '0 4px 16px rgba(91,95,238,0.35)',
          }}
        >
          <span>{user.username}</span>
        </Link>
      </div>
    </header>
  );
}
