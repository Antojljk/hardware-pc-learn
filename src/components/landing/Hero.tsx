'use client'

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import anime from 'animejs';

/**
 * Section 01 — Hero plein écran premium.
 * - Fond 3D CSS (grille perspective + halos)
 * - Titre clean blanc
 * - Lede, double CTA
 * - Lignes de scan très subtiles pour le côté tech
 */
export function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      const title = titleRef.current;
      const text = title.innerText;
      const words = text.split(' ');
      
      title.innerHTML = words
        .map(word => `<span class="inline-block opacity-0 translate-y-[30px]">${word} </span>`)
        .join('');

      anime.timeline({
        easing: 'easeOutExpo',
      })
      .add({
        targets: '.l-s01-title span',
        opacity: [0, 1],
        translateY: [30, 0],
        delay: anime.stagger(80),
        duration: 800,
      });
    }
  }, []);

  return (
    <section
      id="section01"
      data-l-section="section01"
      data-section="header"
      className="l-section l-section01-hero"
    >
      <div className="l-container l-s01-shell">
        {/* Fond 3D CSS — grille perspective + halos rayonnants */}
        <div className="l-s01-bg3d" aria-hidden="true">
          <div className="l-s01-grid3d" />
          <div className="l-s01-orb l-s01-orb--1" />
          <div className="l-s01-orb l-s01-orb--2" />
          <div className="l-s01-orb l-s01-orb--3" />
          <div className="l-s01-particles" aria-hidden="true">
            {Array.from({ length: 22 }).map((_, i) => (
              <span key={i} className={`l-s01-particle l-s01-particle--${i + 1}`} />
            ))}
          </div>
        </div>

        {/* Vignette douce par-dessus le fond */}
        <div className="l-s01-media-vignette" aria-hidden="true" />

        {/* Contenu du hero (devant le fond) */}
        <div className="l-s01-content">
          <div className="l-s01-content-inner">
            <h1 ref={titleRef} className="l-s01-title">
              Comprends enfin <span className="text-white">ton PC.</span>
            </h1>
            <div className="text-muted text-sm font-medium mb-6 tracking-wide text-center">
              12 modules · 4 niveaux · Accès immédiat
            </div>
             <p className="l-s01-lede animate-fade-in">
               Des cours clairs, des outils concrets. Du débutant au niveau technicien.
             </p>

            <div className="l-s01-actions">
              <Link href="/auth" className="l-m-btn l-s01-cta-primary">
                Commencer libre
                <svg
                  className="l-s01-cta-arrow"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="16"
                  height="16"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
              <a href="#section02" className="l-m-btn-outline l-s01-ghost">
                Voir tous nos modules
              </a>
            </div>

            {/* Métriques de réassurance en bas du hero */}
            <ul className="l-s01-meta" aria-label="Aperçu rapide">
              <li>
                <span className="l-s01-meta-num">12+</span>
                <span className="l-s01-meta-label">modules guidés</span>
              </li>
              <li>
                <span className="l-s01-meta-num">4</span>
                <span className="l-s01-meta-label">niveaux de maîtrise</span>
              </li>
              <li>
                <span className="l-s01-meta-num">24/7</span>
                <span className="l-s01-meta-label">accès aux outils</span>
              </li>
            </ul>
            </div>

            {/* Lignes de scan très subtiles pour le côté tech */}
            <div className="l-s01-scanlines" aria-hidden="true" />
          </div>
        </div>
      </section>
    );
}
