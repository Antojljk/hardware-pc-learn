'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Feature {
  title: string;
  sub: string;
  body: string;
  image: string;
  alt: string;
  ctaLabel: string;
  ctaHref: string;
  dotLabel: string;
}

const FEATURES: Feature[] = [
  {
    title: 'Anatomie Système',
    sub: 'Bases du Hardware',
    body: 'Décompose chaque composant : CPU, GPU, RAM. Apprends leur rôle et leur interaction au sein de la machine.',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=1200&h=900&fit=crop&q=80',
    alt: 'Vue RGB d\'une carte mère haute performance',
    ctaLabel: 'Explorer les cours',
    ctaHref: '/cours',
    dotLabel: 'Cours',
  },
  {
    title: 'Montage Expert',
    sub: "Guide d'Assemblage",
    body: 'Suis des procédures pas à pas pour monter un PC stable et performant, composant par composant.',
    image: 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=1200&h=900&fit=crop&q=80',
    alt: "Assemblage d'un PC haute performance, câbles et composants",
    ctaLabel: 'Démarrer le montage',
    ctaHref: '/constructeur',
    dotLabel: 'Montage',
  },
  {
    title: 'Diagnostic',
    sub: 'Résolution de pannes',
    body: 'Apprends à identifier les codes erreurs, les surchauffes et les instabilités de manière méthodique et rapide.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=900&fit=crop&q=80',
    alt: 'PC gaming avec éclairage RGB bleu et violet',
    ctaLabel: 'Lancer le debug',
    ctaHref: '/diagnostic',
    dotLabel: 'Diagnostic',
  },
  {
    title: 'Build Pro',
    sub: 'Configurateur PC',
    body: 'Simule des configurations avec vérification de compatibilité, calcul de puissance et estimation de performance.',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&h=900&fit=crop&q=80',
    alt: 'Configuration PC gaming atmosphérique en lumière tamisée',
    ctaLabel: "Accéder à l'outil",
    ctaHref: '/constructeur',
    dotLabel: 'Configurateur',
  },
];

const LINE_X = 12;
const ARROW_LEN = 28;
const SVG_W = 48;

export function Features() {
  const [activeDot, setActiveDot] = useState(0);
  const [lineProgress, setLineProgress] = useState(0);
  const [arrowYs, setArrowYs] = useState<number[]>([]);
  const [listHeight, setListHeight] = useState(0);

  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Measure card positions relative to the list top
  useEffect(() => {
    function measure() {
      if (!listRef.current) return;
      const listBcr = listRef.current.getBoundingClientRect();
      setListHeight(listRef.current.offsetHeight);
      setArrowYs(
        cardRefs.current.map(card => {
          if (!card) return 0;
          const r = card.getBoundingClientRect();
          return r.top - listBcr.top + r.height / 2;
        })
      );
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Scroll-driven line progress
  useEffect(() => {
    function onScroll() {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollable = sectionRef.current.offsetHeight - window.innerHeight;
      setLineProgress(Math.max(0, Math.min(1, -rect.top / Math.max(scrollable, 1))));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active dot via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = cardRefs.current.indexOf(entry.target as HTMLLIElement);
            if (idx !== -1) setActiveDot(idx);
          }
        });
      },
      { threshold: 0.4 }
    );
    cardRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollToCard(idx: number) {
    cardRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setActiveDot(idx);
  }

  return (
    <section id="section02" data-l-section="section02" ref={sectionRef}>
      <div className="l-container">
        <div className="l-s02-line-wrap">

          {/* White conductor line — drawn by scroll */}
          {listHeight > 0 && (
            <svg
              aria-hidden="true"
              className="l-s02-line"
              width={SVG_W}
              height={listHeight}
              viewBox={`0 0 ${SVG_W} ${listHeight}`}
            >
              <defs>
                <marker
                  id="l-feat-arr"
                  markerWidth="7"
                  markerHeight="7"
                  refX="7"
                  refY="3.5"
                  orient="auto"
                >
                  <path
                    d="M0,0.5 L7,3.5 L0,6.5"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </marker>
              </defs>

              {/* Vertical line — draws from top to bottom as you scroll */}
              <line
                x1={LINE_X} y1={0}
                x2={LINE_X} y2={listHeight}
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray={`${listHeight} ${listHeight}`}
                strokeDashoffset={listHeight * (1 - lineProgress)}
              />

              {/* Horizontal arrows — appear when the vertical line reaches each card */}
              {arrowYs.map((y, i) => {
                const threshold = listHeight > 0 ? arrowYs[i] / listHeight : 1;
                const shown = lineProgress >= threshold - 0.03;
                return (
                  <line
                    key={i}
                    x1={LINE_X}
                    y1={y}
                    x2={LINE_X + ARROW_LEN}
                    y2={y}
                    stroke="rgba(255,255,255,0.85)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    markerEnd="url(#l-feat-arr)"
                    strokeDasharray={ARROW_LEN}
                    strokeDashoffset={shown ? 0 : ARROW_LEN}
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                  />
                );
              })}
            </svg>
          )}

          <ul className="l-s02-list" ref={listRef}>
            {FEATURES.map((f, i) => (
              <li
                key={f.title}
                id={`feature-${i + 1}`}
                ref={el => { cardRefs.current[i] = el; }}
                className="l-s02-card"
              >
                <div className="l-s02-card-inner">
                  <div className="l-s02-text">
                    <p className="l-s02-title">{f.sub}</p>
                    <h2 className="l-s02-sub">{f.title}</h2>
                    <p className="l-s02-body">{f.body}</p>
                    <Link href={f.ctaHref} className="l-s02-cta">
                      {f.ctaLabel}
                    </Link>
                  </div>
                  <figure className="l-s02-media">
                    <Image
                      src={f.image}
                      alt={f.alt}
                      width={800}
                      height={600}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </figure>
                </div>
              </li>
            ))}
          </ul>

          <ul className="l-s02-dots" aria-label="Navigation des fonctionnalités">
            {FEATURES.map((f, i) => (
              <li key={f.dotLabel}>
                <button
                  className={`l-s02-dot${i === activeDot ? ' l-s02-dot--active' : ''}`}
                  onClick={() => scrollToCard(i)}
                >
                  <span>{f.dotLabel}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
