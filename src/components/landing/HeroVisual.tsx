'use client';

import { useEffect, useRef } from 'react';

/**
 * Effets visuels du hero (client-only) :
 * - halo radial qui suit le curseur (profondeur 3D subtile)
 * - tilt très subtil de la grille 3D en fonction du curseur
 *
 * Aucun re-render React : on mute directement le DOM via refs / querySelector.
 * Strict respect de `prefers-reduced-motion`.
 *
 * IMPORTANT : ce composant s'attend à être monté DANS `.l-s01-shell`.
 * On interagit avec l'élément `.l-s01-grid3d` déjà présent dans le DOM.
 */
export function HeroVisual() {
  const haloRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const shell = document.querySelector('.l-s01-shell') as HTMLElement | null;
    const halo = haloRef.current;
    const grid = document.querySelector(
      '.l-s01-shell .l-s01-grid3d'
    ) as HTMLElement | null;
    if (!shell || !halo) return;

    let raf = 0;
    let tx = 50;
    let ty = 35;
    let cx = 50;
    let cy = 35;

    const animate = () => {
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      halo.style.setProperty('--mx', `${cx}%`);
      halo.style.setProperty('--my', `${cy}%`);

      // Tilt très subtil de la grille perspective
      if (grid) {
        const rx = ((cy - 50) / 50) * -2;
        const ry = ((cx - 50) / 50) * 3;
        grid.style.transform = `perspective(900px) rotateX(${48 + rx}deg) rotateY(${ry}deg) translateZ(-60px) translateY(10%)`;
      }

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
      if (grid) grid.style.transform = '';
    };
  }, []);

  return <div ref={haloRef} className="l-s01-cursor-halo" aria-hidden="true" />;
}
