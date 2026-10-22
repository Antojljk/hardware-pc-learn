'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import Image from 'next/image';
import * as THREE from 'three';

// ─── 3D Models ────────────────────────────────────────────────────────────────

function CPUModel() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { ref.current.rotation.y = clock.elapsedTime * 0.5; });
  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[1.8, 0.15, 1.8]} />
        <meshStandardMaterial color="#1a2a1a" metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[1.4, 0.08, 1.4]} />
        <meshStandardMaterial color="#b8902a" metalness={0.95} roughness={0.05} />
      </mesh>
      <mesh position={[0, 0.21, 0]}>
        <torusGeometry args={[0.62, 0.03, 8, 48]} />
        <meshStandardMaterial color="#818CF8" emissive="#818CF8" emissiveIntensity={3} />
      </mesh>
    </group>
  );
}

function GPUModel() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { ref.current.rotation.y = clock.elapsedTime * 0.4; });
  return (
    <group ref={ref} rotation={[0.25, 0, 0]}>
      <mesh>
        <boxGeometry args={[3, 0.12, 1.1]} />
        <meshStandardMaterial color="#0d1520" metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[2.8, 0.36, 1.0]} />
        <meshStandardMaterial color="#111111" metalness={0.85} roughness={0.12} />
      </mesh>
      <mesh position={[-0.75, 0.22, 0.52]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.08, 32]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[-0.75, 0.22, 0.56]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.025, 8, 32]} />
        <meshStandardMaterial color="#6366F1" emissive="#6366F1" emissiveIntensity={3} />
      </mesh>
      <mesh position={[0.75, 0.22, 0.52]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.08, 32]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0.75, 0.22, 0.56]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.025, 8, 32]} />
        <meshStandardMaterial color="#6366F1" emissive="#6366F1" emissiveIntensity={3} />
      </mesh>
      <mesh position={[0, 0.41, -0.53]}>
        <boxGeometry args={[2.5, 0.04, 0.02]} />
        <meshStandardMaterial color="#6366F1" emissive="#6366F1" emissiveIntensity={5} />
      </mesh>
    </group>
  );
}

function RAMModel() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { ref.current.rotation.y = clock.elapsedTime * 0.5; });
  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[0.18, 2.2, 0.9]} />
        <meshStandardMaterial color="#12122a" metalness={0.88} roughness={0.08} />
      </mesh>
      <mesh position={[0, 1.12, 0]}>
        <boxGeometry args={[0.22, 0.28, 0.88]} />
        <meshStandardMaterial color="#1e1e40" metalness={0.8} roughness={0.15} />
      </mesh>
      <mesh position={[0, 1.26, 0]}>
        <boxGeometry args={[0.24, 0.08, 0.86]} />
        <meshStandardMaterial color="#818CF8" emissive="#818CF8" emissiveIntensity={5} />
      </mesh>
      <mesh position={[0.1, 0, 0]}>
        <boxGeometry args={[0.006, 2.0, 0.88]} />
        <meshStandardMaterial color="#6366F1" emissive="#6366F1" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

function SSDModel() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { ref.current.rotation.y = clock.elapsedTime * 0.45; });
  return (
    <group ref={ref} rotation={[0.2, 0, 0]}>
      <mesh>
        <boxGeometry args={[2.2, 0.07, 0.55]} />
        <meshStandardMaterial color="#0a1a1a" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[2.0, 0.05, 0.52]} />
        <meshStandardMaterial color="#101828" metalness={0.9} roughness={0.05} />
      </mesh>
      <mesh position={[-0.55, 0.1, 0]}>
        <boxGeometry args={[0.3, 0.04, 0.3]} />
        <meshStandardMaterial color="#1e2e1e" metalness={0.6} roughness={0.4} />
      </mesh>
      {([-0.1, 0.5, 0.9] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 0.1, 0.02]}>
          <boxGeometry args={[0.26, 0.04, 0.2]} />
          <meshStandardMaterial color="#0f1a2a" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[0.2, 0.12, -0.2]}>
        <boxGeometry args={[1.6, 0.006, 0.008]} />
        <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={4} />
      </mesh>
    </group>
  );
}

function PSUModel() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { ref.current.rotation.y = clock.elapsedTime * 0.35; });
  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[2, 1, 1.5]} />
        <meshStandardMaterial color="#141414" metalness={0.75} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0.52, 0]}>
        <cylinderGeometry args={[0.44, 0.44, 0.05, 32]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <torusGeometry args={[0.38, 0.025, 8, 40]} />
        <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={3} />
      </mesh>
      <mesh position={[0, 0, 0.76]}>
        <boxGeometry args={[0.7, 0.08, 0.01]} />
        <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={4} />
      </mesh>
      {([-0.6, -0.3, 0, 0.3, 0.6] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 0, -0.76]}>
          <boxGeometry args={[0.04, 0.7, 0.01]} />
          <meshStandardMaterial color="#222222" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function CoolerModel() {
  const groupRef = useRef<THREE.Group>(null!);
  const fanRef = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    groupRef.current.rotation.y = clock.elapsedTime * 0.3;
    fanRef.current.rotation.z = clock.elapsedTime * 4;
  });
  return (
    <group ref={groupRef}>
      <mesh>
        <cylinderGeometry args={[0.65, 0.65, 0.22, 32]} />
        <meshStandardMaterial color="#0e0e22" metalness={0.88} roughness={0.08} />
      </mesh>
      <mesh position={[0, 0.13, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.04, 32]} />
        <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={1.5} metalness={0.7} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.17, 0]}>
        <torusGeometry args={[0.5, 0.03, 8, 48]} />
        <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={5} />
      </mesh>
      <mesh position={[-0.52, -0.38, 0]} rotation={[0, 0, Math.PI / 5]}>
        <cylinderGeometry args={[0.06, 0.06, 0.85, 12]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0.52, -0.38, 0]} rotation={[0, 0, -Math.PI / 5]}>
        <cylinderGeometry args={[0.06, 0.06, 0.85, 12]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.3} />
      </mesh>
      <group ref={fanRef} position={[0, -0.85, 0]}>
        {([0, 60, 120, 180, 240, 300] as number[]).map((deg, i) => (
          <mesh key={i} rotation={[0, 0, (deg * Math.PI) / 180]}>
            <boxGeometry args={[0.06, 0.52, 0.07]} />
            <meshStandardMaterial color="#0f0f22" metalness={0.5} roughness={0.5} />
          </mesh>
        ))}
        <mesh>
          <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
          <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={2} />
        </mesh>
      </group>
    </group>
  );
}

// ─── Card 3D canvas ───────────────────────────────────────────────────────────

type ModelKey = 'cpu' | 'gpu' | 'ram' | 'ssd' | 'psu' | 'cooler';

const CAM: Record<ModelKey, [number, number, number]> = {
  cpu:    [0, 0.8, 3.5],
  gpu:    [0, 0.6, 4.2],
  ram:    [0, 0.5, 4.4],
  ssd:    [0, 0.5, 4.0],
  psu:    [0, 0.6, 4.2],
  cooler: [0, 0.4, 4.0],
};

function ComponentCanvas({ model, accent }: { model: ModelKey; accent: string }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 48, position: CAM[model] }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.22} />
      <pointLight position={[-3, 3, 3]} intensity={2.5} color="#ffffff" />
      <pointLight position={[2, -1, 2]} intensity={1.4} color={accent} />
      <pointLight position={[0, 0, -2]} intensity={0.5} color="#818CF8" />
      {model === 'cpu'    && <CPUModel />}
      {model === 'gpu'    && <GPUModel />}
      {model === 'ram'    && <RAMModel />}
      {model === 'ssd'    && <SSDModel />}
      {model === 'psu'    && <PSUModel />}
      {model === 'cooler' && <CoolerModel />}
    </Canvas>
  );
}

// ─── Comp card ────────────────────────────────────────────────────────────────

interface CompProps {
  label: string;
  sub: string;
  accent: string;
  model: ModelKey;
  x: MotionValue<number>;
  y: MotionValue<number>;
  opacity: MotionValue<number>;
}

function Comp({ label, sub, accent, model, x, y, opacity }: CompProps) {
  return (
    <motion.div
      className="l-xp-card"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      style={{ x, y, opacity, '--card-accent': accent } as any}
    >
      <div className="l-xp-card-img">
        <ComponentCanvas model={model} accent={accent} />
      </div>
      <div className="l-xp-card-footer">
        <span className="l-xp-card-sub">{sub}</span>
        <span className="l-xp-card-name">{label}</span>
      </div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function PC3DSection() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const pcScale   = useTransform(scrollYProgress, [0, 0.08], [0.88, 1]);
  const pcOpacity = useTransform(scrollYProgress, [0, 0.07], [0, 1]);

  const cpuX = useTransform(scrollYProgress, [0.06, 0.22], [0, -320]);
  const cpuY = useTransform(scrollYProgress, [0.06, 0.22], [0, -165]);
  const cpuO = useTransform(scrollYProgress, [0.06, 0.18], [0, 1]);

  const gpuX = useTransform(scrollYProgress, [0.13, 0.29], [0, 320]);
  const gpuY = useTransform(scrollYProgress, [0.13, 0.29], [0, -165]);
  const gpuO = useTransform(scrollYProgress, [0.13, 0.25], [0, 1]);

  const ramX = useTransform(scrollYProgress, [0.22, 0.38], [0, -360]);
  const ramY = useTransform(scrollYProgress, [0.22, 0.38], [0, 15]);
  const ramO = useTransform(scrollYProgress, [0.22, 0.34], [0, 1]);

  const ssdX = useTransform(scrollYProgress, [0.29, 0.45], [0, 360]);
  const ssdY = useTransform(scrollYProgress, [0.29, 0.45], [0, 15]);
  const ssdO = useTransform(scrollYProgress, [0.29, 0.41], [0, 1]);

  const psuX = useTransform(scrollYProgress, [0.37, 0.53], [0, -295]);
  const psuY = useTransform(scrollYProgress, [0.37, 0.53], [0, 190]);
  const psuO = useTransform(scrollYProgress, [0.37, 0.49], [0, 1]);

  const coolerX = useTransform(scrollYProgress, [0.44, 0.60], [0, 295]);
  const coolerY = useTransform(scrollYProgress, [0.44, 0.60], [0, 190]);
  const coolerO = useTransform(scrollYProgress, [0.44, 0.56], [0, 1]);

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

          <motion.div className="l-xp-pc" style={{ scale: pcScale, opacity: pcOpacity }}>
            <div className="l-xp-pc-glow" aria-hidden="true" />
            <Image
              src="/images/pc-aquarium.jpg"
              alt="PC water cooling RGB"
              width={560}
              height={700}
              priority
              className="l-xp-pc-img"
            />
          </motion.div>

          <Comp x={cpuX} y={cpuY} opacity={cpuO}
            label="Processeur" sub="CPU" accent="#818CF8" model="cpu" />
          <Comp x={gpuX} y={gpuY} opacity={gpuO}
            label="Carte graphique" sub="GPU" accent="#6366F1" model="gpu" />
          <Comp x={ramX} y={ramY} opacity={ramO}
            label="Mémoire vive" sub="RAM" accent="#818CF8" model="ram" />
          <Comp x={ssdX} y={ssdY} opacity={ssdO}
            label="Stockage NVMe" sub="SSD" accent="#10B981" model="ssd" />
          <Comp x={psuX} y={psuY} opacity={psuO}
            label="Alimentation" sub="PSU" accent="#F59E0B" model="psu" />
          <Comp x={coolerX} y={coolerY} opacity={coolerO}
            label="Refroidissement" sub="Cooler" accent="#06B6D4" model="cooler" />

        </div>

        <motion.p className="l-xp-scroll-hint" style={{ opacity: hintOpacity }}>
          ↓ scroll pour explorer
        </motion.p>

      </div>
    </div>
  );
}
