'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Section 05 — Stat géant avec compteur animé.
 * - Animation "count up" déclenchée à l'apparition (IntersectionObserver)
 * - Format compact + suffixe
 * - Respecte prefers-reduced-motion (affiche directement la valeur finale)
 */
export function Stats() {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const node = ref.current;
    if (!node) return;

    const target = 70_000_000;
    const duration = 1600;

    const animateCount = () => {
      const start = performance.now();
      const reduce =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduce) {
        setValue(target);
        return;
      }

      const tick = (now: number) => {
        const elapsed = now - start;
        const t = Math.min(1, elapsed / duration);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(Math.round(target * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            animateCount();
            io.disconnect();
          }
        }
      },
      { threshold: 0.4 }
    );

    io.observe(node);

    return () => io.disconnect();
  }, []);

  const formatted =
    '+' +
    new Intl.NumberFormat('fr-FR').format(value).replace(/,/g, ' ');

  return (
    <section
      data-l-section="section05"
      data-section="features"
      className="l-s05-wrap"
    >
      <div className="l-container l-stack-sm">
        <p className="l-s05-eyebrow">Rejoignez 15K+ techniciens en herbe.</p>
        <div className="l-s05-divider" />
        <p className="l-s05-stat" ref={ref} aria-label={`${formatted} composants décryptés`}>
          <span>{formatted}</span>
        </p>
      </div>
    </section>
  );
}
