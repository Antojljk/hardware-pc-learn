import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getLevel } from '@/lib/xp';
import { User, Trophy, Flame, Sparkles } from 'lucide-react';
import { LogoutButton } from './LogoutButton';

export const metadata = { title: 'Profil — HardwarePC' };

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');
  const lvl = getLevel(user.xp);
  const badges = await prisma.badgesOnUsers.findMany({ where: { userId: user.id }, include: { badge: true } });

  return (
    <div className="space-y-6 max-w-2xl">
      <section className="module-hero">
        <div className="module-eyebrow">Compte</div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight flex items-center gap-2 mt-2">
          <User className="w-6 h-6 text-text" /> Profil
        </h1>
      </section>

      <section className="card p-5 anim-rise anim-rise-1">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-accent grid place-items-center text-white">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <div className="font-display text-xl font-semibold tracking-tight">{user.username}</div>
            <div className="text-sm text-text-soft">{user.email}</div>
            <div className="flex items-center gap-3 mt-2 text-xs text-text-mute">
              <span className="badge-accent">N{lvl.current.level} · {lvl.current.title}</span>
              {user.isGuest && <span className="badge-warning">Invité</span>}
              <span className="inline-flex items-center gap-1"><Flame className="w-3 h-3 text-warning" /> {user.streak} jours</span>
            </div>
          </div>
        </div>
      </section>

      <section className="card p-5 anim-rise anim-rise-2">
        <h2 className="section-title mb-3 flex items-center gap-2"><Trophy className="w-4 h-4 text-text" /> Badges ({badges.length})</h2>
        {badges.length === 0 ? (
          <p className="text-sm text-text-soft">Pas encore de badge — termine un cours ou un quiz pour commencer.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {badges.map(b => (
              <div key={b.badge.id} className="badge bg-bg-elev border-border px-3 py-1.5">
                <span>{b.badge.icon}</span><span>{b.badge.name}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card p-5 anim-rise anim-rise-3">
        <h2 className="section-title mb-3">Compte</h2>
        <p className="text-sm text-text-soft mb-3">Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}.</p>
        <LogoutButton />
      </section>
    </div>
  );
}
