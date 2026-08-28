'use client';

import { useEffect, useRef } from 'react';

/**
 * Effet parallaxe léger pour le hero de la landing.
 * - Translate très subtil (max ~10px) sur le contenu (texte/CTA).
 * - Le média est piloté par <HeroVisual /> (tilt curseur) pour éviter
 *   les conflits de transform inline.
 * - Respect strict de `prefers-reduced-motion` (aucune écoute).
 * - Pas de re-render React : on mute directement le DOM.
 */
export function ParallaxHero() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const el = ref.current;
    if (!el) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const center = rect.top + rect.height / 2;
      const delta = (center - window.innerHeight / 2) / window.innerHeight; // -0.5..0.5
      const content = el.querySelector('.l-s01-content') as HTMLElement | null;
      const meta = el.querySelector('.l-s01-meta') as HTMLElement | null;
      if (content) {
        // On compose avec le translateZ et l'animation d'entrée
        // (les animations CSS keyframes s'appliquent en plus du transform).
        content.style.setProperty('--l-parallax-y', `${delta * -8}px`);
      }
      if (meta) {
        meta.style.setProperty('--l-parallax-y', `${delta * -4}px`);
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <div ref={ref} aria-hidden="true" className="l-s01-parallax-trigger" />;
}
