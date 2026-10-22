'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, BookOpen, Compass, Brain, FileCheck2, MessageSquareQuote,
  Stethoscope, PcCase, Library, BarChart3, TrendingUp, User, Settings, Wrench,
  Activity, Sparkles, Hammer, ShieldCheck, Bot, Star, ShoppingBag, Zap,
} from 'lucide-react';
import { useSession } from './SessionProvider';

const SECTIONS = [
  {
    label: null,
    items: [
      { href: '/offres',    label: 'Offres',     icon: ShoppingBag },
      { href: '/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
    ],
  },
  {
    label: 'Apprendre',
    items: [
      { href: '/cours',       label: 'Cours',        icon: BookOpen },
      { href: '/parcours',    label: 'Parcours',     icon: Compass },
      { href: '/quiz',        label: 'Quiz',         icon: Brain },
      { href: '/examens',     label: 'Examens',      icon: FileCheck2 },
      { href: '/entretiens',  label: 'Entretiens',   icon: MessageSquareQuote },
    ],
  },
  {
    label: 'Pratiquer',
    items: [
      { href: '/diagnostic',   label: 'Diagnostic',       icon: Stethoscope },
      { href: '/constructeur', label: 'Constructeur PC',  icon: PcCase },
      { href: '/tuteur',       label: 'Tuteur IA',        icon: Bot },
      { href: '/revisions',    label: 'Révisions',        icon: Wrench },
    ],
  },
  {
    label: 'Explorer',
    items: [
      { href: '/progression',        label: 'Progression',          icon: TrendingUp },
      { href: '/avis',               label: 'Avis',                 icon: Star },
      { href: '/benchmarks',         label: 'Benchmarks',           icon: BarChart3 },
      { href: '/monitoring',         label: 'Monitoring',           icon: Activity },
      { href: '/glossaire',          label: 'Glossaire',            icon: Library },
      { href: '/base-connaissances', label: 'Base de connaissances',icon: Sparkles },
    ],
  },
  {
    label: 'Modes',
    items: [
      { href: '/mode-technicien', label: 'Mode technicien', icon: Hammer },
      { href: '/mode-client',     label: 'Mode client',     icon: ShieldCheck },
    ],
  },
];

const ACCOUNT_ITEMS = [
  { href: '/profil',     label: 'Profil',      icon: User },
  { href: '/parametres', label: 'Paramètres',  icon: Settings },
];

export function Sidebar() {
  const path = usePathname();
  const { userId } = useSession();

  const isActive = (href: string) =>
    href === '/dashboard' ? path === '/dashboard' : path.startsWith(href);

  const renderItem = (item: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }) => {
    const active = isActive(item.href);
    return (
      <li key={item.href}>
        <Link
          href={item.href}
          className={cn(
            'flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[13px] font-medium transition-all duration-150 relative',
            active
              ? 'text-white'
              : 'text-[var(--color-muted)] hover:text-white hover:bg-[var(--color-surface)]'
          )}
          style={active ? {
            background: 'linear-gradient(135deg, rgba(91,95,238,0.18), rgba(99,102,241,0.08))',
            boxShadow: 'inset 2px 0 0 #6366F1',
            paddingLeft: '10px',
          } : undefined}
        >
          <item.icon className={cn(
            'w-[15px] h-[15px] flex-shrink-0',
            active ? 'text-[#818CF8]' : 'text-[var(--color-faint)]'
          )} />
          <span className="truncate">{item.label}</span>
          {active && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#6366F1] flex-shrink-0 opacity-90" />
          )}
        </Link>
      </li>
    );
  };

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col"
      style={{ background: '#020205', borderRight: '1px solid var(--color-border-soft)' }}>

      {/* Brand */}
      <Link
        href="/"
        className="h-[68px] px-5 flex items-center gap-3 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--color-border-soft)' }}
      >
        <div
          className="w-9 h-9 rounded-xl flex-shrink-0 grid place-items-center"
          style={{
            background: 'linear-gradient(135deg, #5B5FEE, #818CF8)',
            boxShadow: '0 0 18px rgba(91,95,238,0.40)',
          }}
        >
          <PcCase className="w-[17px] h-[17px] text-white" />
        </div>
        <div className="min-w-0">
          <div className="font-display font-semibold tracking-tight text-[14px] text-white leading-tight">HardwarePC</div>
          <div className="text-[9px] uppercase tracking-[0.16em]" style={{ color: 'var(--color-faint)' }}>
            Apprends · Progresse
          </div>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 scrollbar-none" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {SECTIONS.map((section, si) => (
          <div key={si}>
            {section.label && (
              <div
                className="px-3 mb-1.5 text-[9px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: 'var(--color-faint)' }}
              >
                {section.label}
              </div>
            )}
            <ul className="space-y-0.5">
              {section.items.map(renderItem)}
            </ul>
          </div>
        ))}

        {/* Account */}
        <div>
          <div className="mx-1 mb-3" style={{ height: '1px', background: 'var(--color-border-soft)' }} />
          <ul className="space-y-0.5">
            {ACCOUNT_ITEMS.map(renderItem)}
            {userId === 'cmt6fgcg50000ju04upia45gp' && renderItem({ href: '/admin', label: 'Admin', icon: Settings })}
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div
        className="px-4 py-3 flex items-center gap-2"
        style={{ borderTop: '1px solid var(--color-border-soft)' }}
      >
        <Zap className="w-3 h-3" style={{ color: '#818CF8' }} />
        <span className="text-[9px] uppercase tracking-[0.16em]" style={{ color: 'var(--color-faint)' }}>
          HardwarePC v1.0
        </span>
      </div>
    </aside>
  );
}
