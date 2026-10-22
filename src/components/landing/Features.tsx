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

export function Features() {
  const [activeDot, setActiveDot] = useState(0);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = cardRefs.current.indexOf(entry.target as HTMLLIElement);
            if (idx !== -1) setActiveDot(idx);
          }
        });
      },
      { threshold: 0.4 }
    );
    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollToCard(idx: number) {
    cardRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setActiveDot(idx);
  }

  return (
    <section id="section02" data-l-section="section02">
      <div className="l-container">
        <ul className="l-s02-list">
          {FEATURES.map((f, i) => (
            <li
              key={f.title}
              id={`feature-${i + 1}`}
              ref={(el) => { cardRefs.current[i] = el; }}
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
    </section>
  );
}
