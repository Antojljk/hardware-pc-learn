'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

interface Comp {
  id: string;
  name: string;
  sub: string;
  desc: string;
  img: string;
  accent: string;
}

const LEFT: Comp[] = [
  {
    id: 'cpu',
    name: 'Processeur',
    sub: 'CPU',
    desc: 'Cerveau du système — exécute toutes les instructions du PC.',
    img: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=320&h=180&fit=crop&q=80',
    accent: '#818CF8',
  },
  {
    id: 'ram',
    name: 'Mémoire vive',
    sub: 'RAM',
    desc: 'Stockage temporaire ultra-rapide pour les données actives.',
    img: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=320&h=180&fit=crop&q=80',
    accent: '#818CF8',
  },
  {
    id: 'psu',
    name: 'Alimentation',
    sub: 'PSU',
    desc: 'Convertit et distribue la puissance à tous les composants.',
    img: 'https://images.unsplash.com/photo-1563770557593-dc5b08a2f80e?w=320&h=180&fit=crop&q=80',
    accent: '#F59E0B',
  },
];

const RIGHT: Comp[] = [
  {
    id: 'gpu',
    name: 'Carte graphique',
    sub: 'GPU',
    desc: 'Calcul massivement parallèle — jeux, IA et rendu 3D.',
    img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=320&h=180&fit=crop&q=80',
    accent: '#818CF8',
  },
  {
    id: 'ssd',
    name: 'Stockage NVMe',
    sub: 'SSD',
    desc: 'Lecture à 7 Go/s — démarrage et chargements instantanés.',
    img: 'https://images.unsplash.com/photo-1601737487795-dab272f52420?w=320&h=180&fit=crop&q=80',
    accent: '#10B981',
  },
  {
    id: 'cooler',
    name: 'Refroidissement',
    sub: 'Cooler',
    desc: 'Évacue la chaleur pour maintenir des perfs stables.',
    img: 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=320&h=180&fit=crop&q=80',
    accent: '#06B6D4',
  },
];

function CompCard({
  comp,
  direction,
  delay,
}: {
  comp: Comp;
  direction: 'left' | 'right';
  delay: number;
}) {
  return (
    <motion.div
      className="l-exploded-card"
      style={{ '--card-accent': comp.accent } as React.CSSProperties}
      initial={{ opacity: 0, x: direction === 'left' ? -50 : 50, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="l-exploded-card-img">
        <Image src={comp.img} alt={comp.name} width={320} height={180} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <div className="l-exploded-card-body">
        <span className="l-exploded-card-sub">{comp.sub}</span>
        <p className="l-exploded-card-name">{comp.name}</p>
        <p className="l-exploded-card-desc">{comp.desc}</p>
      </div>
    </motion.div>
  );
}

export function PC3DSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section ref={ref} data-l-section="section-3d" className="l-exploded">
      <div className="l-container">

        {/* Header */}
        <header className="l-exploded-header">
          <p className="l-m-label l-exploded-label">
            <span aria-hidden="true" className="l-exploded-dot" />
            Architecture PC
          </p>
          <h2 className="l-exploded-title">
            Chaque composant,{' '}
            <em className="l-exploded-em">son rôle exact.</em>
          </h2>
          <p className="l-exploded-subtitle">
            Apprends comment chaque pièce fonctionne et interagit au sein du système.
          </p>
        </header>

        {/* Grid */}
        <div className="l-exploded-grid">

          {/* Left column */}
          <div className="l-exploded-col l-exploded-col--left">
            {inView && LEFT.map((c, i) => (
              <CompCard key={c.id} comp={c} direction="left" delay={0.1 + i * 0.12} />
            ))}
          </div>

          {/* Center — PC fixe */}
          <motion.div
            className="l-exploded-center"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div aria-hidden="true" className="l-exploded-center-glow" />
            <Image
              src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&h=700&fit=crop&q=85"
              alt="PC gaming"
              width={600}
              height={700}
              className="l-exploded-pc-img"
            />
            <div aria-hidden="true" className="l-exploded-center-fade" />
          </motion.div>

          {/* Right column */}
          <div className="l-exploded-col l-exploded-col--right">
            {inView && RIGHT.map((c, i) => (
              <CompCard key={c.id} comp={c} direction="right" delay={0.1 + i * 0.12} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
