'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, BookOpen, Compass, Brain, FileCheck2, MessageSquareQuote,
  Stethoscope, PcCase, Library, BarChart3, TrendingUp, User, Settings, Wrench,
  Activity, Sparkles, Hammer, ShieldCheck, Bot, Star, ShoppingBag,
} from 'lucide-react';
import { useSession } from './SessionProvider';

const ITEMS = [
  { href: '/vente',       label: 'Vente',            icon: ShoppingBag },
  { href: '/dashboard',   label: 'Dashboard',        icon: LayoutDashboard },
  { href: '/cours',       label: 'Cours',            icon: BookOpen },
  { href: '/parcours',    label: 'Parcours',         icon: Compass },
  { href: '/quiz',        label: 'Quiz',             icon: Brain },
  { href: '/examens',     label: 'Examens',          icon: FileCheck2 },
  { href: '/entretiens',  label: 'Entretiens',       icon: MessageSquareQuote },
  { href: '/diagnostic',  label: 'Diagnostic',       icon: Stethoscope },
  { href: '/constructeur',label: 'Constructeur PC',  icon: PcCase },
  { href: '/glossaire',   label: 'Glossaire',        icon: Library },
  { href: '/base-connaissances', label: 'Base connaissances', icon: Sparkles },
  { href: '/benchmarks',  label: 'Benchmarks',       icon: BarChart3 },
  { href: '/monitoring',  label: 'Monitoring',       icon: Activity },
  { href: '/revisions',   label: 'Révisions',        icon: Wrench },
  { href: '/progression', label: 'Progression',      icon: TrendingUp },
  { href: '/avis',       label: 'Avis',             icon: Star },
  { href: '/tuteur',      label: 'Tuteur IA',        icon: Bot },
  { href: '/mode-technicien', label: 'Mode technicien', icon: Hammer },
  { href: '/mode-client',    label: 'Mode client',      icon: ShieldCheck },
  { href: '/profil',      label: 'Profil',           icon: User },
  { href: '/parametres',  label: 'Paramètres',       icon: Settings },
  { href: '/admin',       label: 'Admin',            icon: Settings, admin: true },
];

export function Sidebar() {
  const path = usePathname();
  const { userId } = useSession();
  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-72 flex-col border-r border-border bg-bg-soft">
      <Link href="/" className="px-6 h-20 flex items-center gap-3 border-b border-border">
        <div className="w-10 h-10 rounded-2xl bg-accent grid place-items-center text-[#001818]">
          <PcCase className="w-5 h-5" />
        </div>
        <div className="leading-tight">
          <div className="font-display font-semibold tracking-tight text-[15px] text-text">HardwarePC</div>
          <div className="text-[10px] text-muted uppercase tracking-[0.12em]">Apprends · Progresse</div>
        </div>
      </Link>
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {ITEMS.map(item => {
          if (item.admin && userId !== 'cmt6fgcg50000ju04upia45gp') {
            return null;
          }
          const active = item.href === '/dashboard' ? path === '/dashboard' : path.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-full text-[13px] transition-colors',
                active
                  ? 'bg-text text-bg'
                  : 'text-muted hover:bg-bg-elev hover:text-text'
              )}
            >
              <item.icon className={cn('w-4 h-4', active ? 'text-bg' : 'text-muted')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 text-[10px] text-faint uppercase tracking-[0.14em] border-t border-border">
        v1.0 · 100% local
      </div>
    </aside>
  );
}
