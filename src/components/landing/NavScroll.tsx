'use client';

import { useEffect } from 'react';

/**
 * Effet scroll sur la nav :
 * - Ajoute/retire la classe `is-scrolled` sur la nav quand on dépasse 8px.
 * - Respecte `prefers-reduced-motion` (aucun transform).
 */
export function NavScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const nav = document.querySelector('.l-landing .l-m-nav') as HTMLElement | null;
    if (!nav) return;

    const onScroll = () => {
      if (window.scrollY > 8) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}
