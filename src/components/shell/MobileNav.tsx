'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, Brain, Stethoscope, PcCase, Library, MessageSquareQuote,
  TrendingUp, Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEMS = [
  { href: '/',             label: 'Accueil',  icon: LayoutDashboard },
  { href: '/cours',        label: 'Cours',    icon: BookOpen },
  { href: '/quiz',         label: 'Quiz',     icon: Brain },
  { href: '/diagnostic',   label: 'Diag',     icon: Stethoscope },
  { href: '/constructeur', label: 'Build',    icon: PcCase },
  { href: '/glossaire',    label: 'Gloss.',   icon: Library },
  { href: '/entretiens',   label: 'Inter.',   icon: MessageSquareQuote },
  { href: '/avis',         label: 'Avis',     icon: Star },
];

export function MobileNav() {
  const path = usePathname();
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-border">
      <ul className="grid grid-cols-8">
        {ITEMS.map(item => {
          const active = item.href === '/' ? path === '/' : path.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center py-2.5 text-[10px] transition-colors uppercase tracking-[0.08em]',
                  active ? 'text-accent' : 'text-faint'
                )}
              >
                <item.icon className="w-4 h-4 mb-0.5" />
                <span className="leading-none text-mono">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
