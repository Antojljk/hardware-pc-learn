'use client';

import { useEffect, useRef } from 'react';

/**
 * Effets visuels du hero (client-only) :
 * - halo radial qui suit le curseur (profondeur 3D subtile)
 * - tilt très subtil de l'image média en fonction du curseur
 *
 * Aucun re-render React : on mute directement le DOM via refs / querySelector.
 * Strict respect de `prefers-reduced-motion`.
 *
 * IMPORTANT : ce composant s'attend à être monté DANS `.l-s01-shell`.
 * On interagit avec l'élément `.l-s01-media` déjà présent dans le DOM.
 */
export function HeroVisual() {
  const haloRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const shell = document.querySelector('.l-s01-shell') as HTMLElement | null;
    const halo = haloRef.current;
    const media = document.querySelector(
      '.l-s01-shell .l-s01-media'
    ) as HTMLElement | null;
    if (!shell || !halo || !media) return;

    let raf = 0;
    let tx = 50; // target x (%)
    let ty = 35; // target y (%)
    let cx = 50; // current x (%)
    let cy = 35; // current y (%)

    const animate = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      halo.style.setProperty('--mx', `${cx}%`);
      halo.style.setProperty('--my', `${cy}%`);

      // Tilt très subtil (max ~2.4deg) pour donner du relief
      const rx = ((cy - 50) / 50) * -1.6;
      const ry = ((cx - 50) / 50) * 2.4;
      // On compose avec le translateZ existant du ParallaxHero
      media.style.transform =
        `translateZ(-30px) scale(1.04) rotateX(${rx}deg) rotateY(${ry}deg)`;

      raf = window.requestAnimationFrame(animate);
    };

    const onMove = (e: MouseEvent) => {
      const rect = shell.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      tx = Math.max(0, Math.min(100, x));
      ty = Math.max(0, Math.min(100, y));
      if (!raf) raf = window.requestAnimationFrame(animate);
    };

    const onLeave = () => {
      tx = 50;
      ty = 35;
    };

    shell.addEventListener('mousemove', onMove);
    shell.addEventListener('mouseleave', onLeave);
    raf = window.requestAnimationFrame(animate);

    return () => {
      shell.removeEventListener('mousemove', onMove);
      shell.removeEventListener('mouseleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
      // Réinitialisation du media pour ne pas casser le ParallaxHero
      media.style.transform = '';
    };
  }, []);

  return <div ref={haloRef} className="l-s01-cursor-halo" aria-hidden="true" />;
}
