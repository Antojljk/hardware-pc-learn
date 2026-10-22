'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

function Chip({
  label, sub, accent, x, y, opacity,
}: {
  label: string;
  sub: string;
  accent: string;
  x: MotionValue<number>;
  y: MotionValue<number>;
  opacity: MotionValue<number>;
}) {
  return (
    <motion.div
      className="l-xp-chip"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      style={{ x, y, opacity, '--chip-accent': accent } as any}
    >
      <span className="l-xp-chip-dot" aria-hidden="true" />
      <span className="l-xp-chip-text">
        <span className="l-xp-chip-sub">{sub}</span>
        <span className="l-xp-chip-name">{label}</span>
      </span>
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
  const cpuX = useTransform(scrollYProgress, [0.06, 0.22], [0, -310]);
  const cpuY = useTransform(scrollYProgress, [0.06, 0.22], [0, -155]);
  const cpuO = useTransform(scrollYProgress, [0.06, 0.18], [0, 1]);

  // GPU — top right
  const gpuX = useTransform(scrollYProgress, [0.13, 0.29], [0, 310]);
  const gpuY = useTransform(scrollYProgress, [0.13, 0.29], [0, -155]);
  const gpuO = useTransform(scrollYProgress, [0.13, 0.25], [0, 1]);

  // RAM — left
  const ramX = useTransform(scrollYProgress, [0.22, 0.38], [0, -350]);
  const ramY = useTransform(scrollYProgress, [0.22, 0.38], [0, 10]);
  const ramO = useTransform(scrollYProgress, [0.22, 0.34], [0, 1]);

  // SSD — right
  const ssdX = useTransform(scrollYProgress, [0.29, 0.45], [0, 350]);
  const ssdY = useTransform(scrollYProgress, [0.29, 0.45], [0, 10]);
  const ssdO = useTransform(scrollYProgress, [0.29, 0.41], [0, 1]);

  // PSU — bottom left
  const psuX = useTransform(scrollYProgress, [0.37, 0.53], [0, -280]);
  const psuY = useTransform(scrollYProgress, [0.37, 0.53], [0, 178]);
  const psuO = useTransform(scrollYProgress, [0.37, 0.49], [0, 1]);

  // Cooler — bottom right
  const coolerX = useTransform(scrollYProgress, [0.44, 0.60], [0, 280]);
  const coolerY = useTransform(scrollYProgress, [0.44, 0.60], [0, 178]);
  const coolerO = useTransform(scrollYProgress, [0.44, 0.56], [0, 1]);

  // Scroll hint fades out once animation starts
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
              autoPlay
              muted
              loop
              playsInline
              className="l-xp-pc-video"
            />
          </motion.div>

          {/* Composants — partent du centre vers l'extérieur */}
          <Chip x={cpuX}    y={cpuY}    opacity={cpuO}    label="Processeur"      sub="CPU"    accent="#818CF8" />
          <Chip x={gpuX}    y={gpuY}    opacity={gpuO}    label="Carte graphique" sub="GPU"    accent="#818CF8" />
          <Chip x={ramX}    y={ramY}    opacity={ramO}    label="Mémoire vive"    sub="RAM"    accent="#10B981" />
          <Chip x={ssdX}    y={ssdY}    opacity={ssdO}    label="Stockage NVMe"   sub="SSD"    accent="#10B981" />
          <Chip x={psuX}    y={psuY}    opacity={psuO}    label="Alimentation"    sub="PSU"    accent="#F59E0B" />
          <Chip x={coolerX} y={coolerY} opacity={coolerO} label="Refroidissement" sub="Cooler" accent="#06B6D4" />

        </div>

        <motion.p className="l-xp-scroll-hint" style={{ opacity: hintOpacity }}>
          ↓ scroll pour explorer
        </motion.p>

      </div>
    </div>
  );
}
