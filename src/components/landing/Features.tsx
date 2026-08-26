'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Feature {
  title: string;
  sub: string;
  body: string;
  image: string;
  alt: string;
  ctaLabel: string;
  ctaHref: string;
  /** Petit label d'aria pour le dot correspondant. */
  dotLabel: string;
}

const FEATURES: Feature[] = [
  {
    title: 'Anatomie Système',
    sub: 'Bases du Hardware',
    body: 'Décompose chaque composant : CPU, GPU, RAM. Apprends leur rôle et leur interaction au sein de la machine.',
    image:
      'https://images.unsplash.com/photo-1719927604476-dc404b85358f?w=1200&h=1200&fit=crop&q=80',
    alt: 'Illustration technique d’un processeur moderne',
    ctaLabel: 'Explorer',
    ctaHref: '/cours',
    dotLabel: 'Cours',
  },
  {
    title: 'Montage Expert',
    sub: "Guide d'Assemblage",
    body: 'Suis des procédures pas à pas pour monter un PC stable et performant.',
    image:
      'https://images.unsplash.com/photo-1555617778-02518510b9fa?w=1200&h=1200&fit=crop&q=80',
    alt: "Vue éclatée d'une carte graphique haute performance",
    ctaLabel: 'Démarrer le montage',
    ctaHref: '/constructeur',
    dotLabel: 'Montage',
  },
  {
    title: 'Diagnostic',
    sub: 'Résolution de pannes',
    body: 'Apprends à identifier les codes erreurs, les surchauffes et les instabilités de manière méthodique et rapide.',
    image:
      'https://images.unsplash.com/photo-1555618254-84e2cf498b01?w=1200&h=1200&fit=crop&q=80',
    alt: 'Schéma technique des barrettes de mémoire vive',
    ctaLabel: 'Lancer le debug',
    ctaHref: '/diagnostic',
    dotLabel: 'Diagnostic',
  },
  {
    title: 'Build Pro',
    sub: 'Configurateur PC',
    body: 'Simule des configurations avec vérification de compatibilité, calcul de puissance et estimation de performance.',
    image:
      'https://images.unsplash.com/photo-1602837385569-08ac19ec83af?w=1200&h=1200&fit=crop&q=80',
    alt: "Vue d'ensemble d'une carte mère haut de gamme",
    ctaLabel: "Accéder à l'outil",
    ctaHref: '/constructeur',
    dotLabel: 'Configurateur',
  },
];

/**
 * Section 02 — 4 grandes features en cards alternées + dot slider.
 * Client Component : gère l'index actif quand on clique sur un dot.
 * (Visuellement, on n'affiche qu'une card à la fois : on masque les autres
 * pour rester fidèle au design, mais on garde la grille pour le SEO
 * en exposant toutes les cards dans le DOM.)
 */
export function Features() {
  const [active, setActive] = useState(0);

  return (
    <section
      id="section02"
      data-l-section="section02"
      data-section="features"
      className="l-section"
    >
      <div className="l-container">
        <ul className="l-s02-list">
          {FEATURES.map((f, i) => (
            <li
              key={f.title}
              className={
                'l-s02-card' + (i === active ? ' l-s02-card--active' : '')
              }
              hidden={i !== active}
            >
              <div className="l-s02-card-inner">
                <div className="l-s02-text">
                  <h2 className="l-m-heading l-s02-title">{f.title}</h2>
                  <h3 className="l-s02-sub">{f.sub}</h3>
                  <p className="l-s02-body">{f.body}</p>
                  <Link href={f.ctaHref} className="l-s02-cta">
                    {f.ctaLabel}
                  </Link>
                </div>
                <figure className="l-s02-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.image} alt={f.alt} width={1200} height={1200} />
                </figure>
              </div>
            </li>
          ))}
        </ul>

        <ol className="l-s02-dots" aria-label="Indicateur slide">
          {FEATURES.map((f, i) => (
            <li key={f.dotLabel}>
              <button
                type="button"
                className={
                  'l-s02-dot' + (i === active ? ' l-s02-dot--active' : '')
                }
                aria-label={`Sélection : ${f.dotLabel}`}
                aria-current={i === active ? 'true' : undefined}
                onClick={() => setActive(i)}
              >
                <span>{i + 1}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
