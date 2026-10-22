'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import Image from 'next/image';

interface CompProps {
  label: string;
  sub: string;
  accent: string;
  img: string;
  x: MotionValue<number>;
  y: MotionValue<number>;
  opacity: MotionValue<number>;
}

function Comp({ label, sub, accent, img, x, y, opacity }: CompProps) {
  return (
    <motion.div
      className="l-xp-card"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      style={{ x, y, opacity, '--card-accent': accent } as any}
    >
      <div className="l-xp-card-img">
        <Image src={img} alt={label} width={180} height={110} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <div className="l-xp-card-footer">
        <span className="l-xp-card-sub">{sub}</span>
        <span className="l-xp-card-name">{label}</span>
      </div>
    </motion.div>
  );
}

export function PC3DSection() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // PC entrance
  const pcScale   = useTransform(scrollYProgress, [0, 0.08], [0.88, 1]);
  const pcOpacity = useTransform(scrollYProgress, [0, 0.07], [0, 1]);

  // CPU — top left
  const cpuX = useTransform(scrollYProgress, [0.06, 0.22], [0, -320]);
  const cpuY = useTransform(scrollYProgress, [0.06, 0.22], [0, -165]);
  const cpuO = useTransform(scrollYProgress, [0.06, 0.18], [0, 1]);

  // GPU — top right
  const gpuX = useTransform(scrollYProgress, [0.13, 0.29], [0, 320]);
  const gpuY = useTransform(scrollYProgress, [0.13, 0.29], [0, -165]);
  const gpuO = useTransform(scrollYProgress, [0.13, 0.25], [0, 1]);

  // RAM — left
  const ramX = useTransform(scrollYProgress, [0.22, 0.38], [0, -360]);
  const ramY = useTransform(scrollYProgress, [0.22, 0.38], [0, 15]);
  const ramO = useTransform(scrollYProgress, [0.22, 0.34], [0, 1]);

  // SSD — right
  const ssdX = useTransform(scrollYProgress, [0.29, 0.45], [0, 360]);
  const ssdY = useTransform(scrollYProgress, [0.29, 0.45], [0, 15]);
  const ssdO = useTransform(scrollYProgress, [0.29, 0.41], [0, 1]);

  // PSU — bottom left
  const psuX = useTransform(scrollYProgress, [0.37, 0.53], [0, -295]);
  const psuY = useTransform(scrollYProgress, [0.37, 0.53], [0, 190]);
  const psuO = useTransform(scrollYProgress, [0.37, 0.49], [0, 1]);

  // Cooler — bottom right
  const coolerX = useTransform(scrollYProgress, [0.44, 0.60], [0, 295]);
  const coolerY = useTransform(scrollYProgress, [0.44, 0.60], [0, 190]);
  const coolerO = useTransform(scrollYProgress, [0.44, 0.56], [0, 1]);

  // Scroll hint
  const hintOpacity = useTransform(scrollYProgress, [0, 0.04, 0.12], [1, 1, 0]);

  return (
    <div ref={ref} data-l-section="section-3d" className="l-xp-wrap">
      <div className="l-xp-sticky">

        <header className="l-xp-header">
          <p className="l-m-label l-xp-eyebrow">
            <span className="l-xp-eyebrow-dot" aria-hidden="true" />
            Architecture PC
          </p>
          <h2 className="l-xp-title">Explore chaque composant.</h2>
        </header>

        <div className="l-xp-scene">

          {/* PC — fixe au centre */}
          <motion.div className="l-xp-pc" style={{ scale: pcScale, opacity: pcOpacity }}>
            <div className="l-xp-pc-glow" aria-hidden="true" />
            <video
              src="/videos/pc-showcase.mp4"
              autoPlay muted loop playsInline
              className="l-xp-pc-video"
            />
          </motion.div>

          {/* Composants — vrais photos, partent du centre */}
          <Comp
            x={cpuX} y={cpuY} opacity={cpuO}
            label="Processeur" sub="CPU" accent="#818CF8"
            img="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=360&h=220&fit=crop&q=80"
          />
          <Comp
            x={gpuX} y={gpuY} opacity={gpuO}
            label="Carte graphique" sub="GPU" accent="#6366F1"
            img="https://images.unsplash.com/photo-1555617778-02518510b9fa?w=360&h=220&fit=crop&q=80"
          />
          <Comp
            x={ramX} y={ramY} opacity={ramO}
            label="Mémoire vive" sub="RAM" accent="#10B981"
            img="https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=360&h=220&fit=crop&q=80"
          />
          <Comp
            x={ssdX} y={ssdY} opacity={ssdO}
            label="Stockage NVMe" sub="SSD" accent="#10B981"
            img="https://images.unsplash.com/photo-1601737487795-dab272f52420?w=360&h=220&fit=crop&q=80"
          />
          <Comp
            x={psuX} y={psuY} opacity={psuO}
            label="Alimentation" sub="PSU" accent="#F59E0B"
            img="https://images.unsplash.com/photo-1563770557593-dc5b08a2f80e?w=360&h=220&fit=crop&q=80"
          />
          <Comp
            x={coolerX} y={coolerY} opacity={coolerO}
            label="Refroidissement" sub="Cooler" accent="#06B6D4"
            img="https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=360&h=220&fit=crop&q=80"
          />

        </div>

        <motion.p className="l-xp-scroll-hint" style={{ opacity: hintOpacity }}>
          ↓ scroll pour explorer
        </motion.p>

      </div>
    </div>
  );
}
