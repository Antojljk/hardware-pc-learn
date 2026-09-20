'use client';
import React, { useEffect, useRef } from 'react';
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
    image: 'https://images.unsplash.com/photo-1719927604476-dc404b85358f?w=1200&h=1200&fit=crop&q=80',
    alt: 'Illustration technique d’un processeur moderne',
    ctaLabel: 'Explorer',
    ctaHref: '/cours',
    dotLabel: 'Cours',
  },
  {
    title: 'Montage Expert',
    sub: "Guide d'Assemblage",
    body: 'Suis des procédures pas à pas pour monter un PC stable et performant.',
    image: 'https://images.unsplash.com/photo-1555617778-02518510b9fa?w=1200&h=1200&fit=crop&q=80',
    alt: "Vue éclatée d'une carte graphique haute performance",
    ctaLabel: 'Démarrer le montage',
    ctaHref: '/constructeur',
    dotLabel: 'Montage',
  },
  {
    title: 'Diagnostic',
    sub: 'Résolution de pannes',
    body: 'Apprends à identifier les codes erreurs, les surchauffes et les instabilités de manière méthodique et rapide.',
    image: 'https://images.unsplash.com/photo-1555618254-84e2cf498b01?w=1200&h=1200&fit=crop&q=80',
    alt: 'Schéma technique des barrettes de mémoire vive',
    ctaLabel: 'Lancer le debug',
    ctaHref: '/diagnostic',
    dotLabel: 'Diagnostic',
  },
  {
    title: 'Build Pro',
    sub: 'Configurateur PC',
    body: 'Simule des configurations avec vérification de compatibilité, calcul de puissance et estimation de performance.',
    image: 'https://images.unsplash.com/photo-1602837385569-08ac19ec83af?w=1200&h=1200&fit=crop&q=80',
    alt: "Vue d'ensemble d'une carte mère haut de gamme",
    ctaLabel: "Accéder à l'outil",
    ctaHref: '/constructeur',
    dotLabel: 'Configurateur',
  },
];

export function Features() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="section02"
      data-l-section="section02"
      data-section="features"
      className="l-section"
    >
      <div className="l-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              ref={(el) => { cardsRef.current[i] = el; }}
              style={{ 
                opacity: 0, 
                transform: 'translateY(20px)', 
                transition: `all 0.5s ease ${i * 100}ms` 
              }}
              className="group relative p-6 rounded-xl border border-white/10 bg-white/5 hover:border-white/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="absolute top-4 left-4 text-4xl font-display font-bold text-white/10 pointer-events-none">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="relative z-10 space-y-4">
                <div className="aspect-video overflow-hidden rounded-lg mb-4">
                   <Image 
                      src={f.image} 
                      alt={f.alt} 
                      width={1200} 
                      height={675} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                </div>
                <div className="text-center">
                  <h2 className="text-white font-display font-bold text-xl mb-1">{f.title}</h2>
                  <h3 className="text-cyan-400 text-sm font-medium mb-2">{f.sub}</h3>
                  <p className="text-muted text-sm leading-relaxed mb-4">{f.body}</p>
                </div>
                <div className="flex justify-center">
                  <Link href={f.ctaHref} className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-cyan-400 transition-colors">
                      {f.ctaLabel}
                      <svg
                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M13 5l7 7-7 7" />
                      </svg>
                    </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


