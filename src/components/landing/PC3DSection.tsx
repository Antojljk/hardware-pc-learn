'use client';
import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, Environment } from '@react-three/drei';
import type { Group } from 'three';

function PCCase() {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.35) * 0.4 + 0.3;
  });

  return (
    <group ref={groupRef}>
      {/* Main chassis */}
      <mesh>
        <boxGeometry args={[1.2, 2.8, 0.6]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.4} roughness={0.65} />
      </mesh>

      {/* Front panel */}
      <mesh position={[0, 0, 0.305]}>
        <boxGeometry args={[1.14, 2.74, 0.01]} />
        <meshStandardMaterial color="#16213e" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Top indigo LED strip */}
      <mesh position={[0, 1.41, 0]}>
        <boxGeometry args={[1.0, 0.04, 0.55]} />
        <meshStandardMaterial color="#6366F1" emissive="#6366F1" emissiveIntensity={4} />
      </mesh>

      {/* Front bottom LED bar */}
      <mesh position={[0, -1.3, 0.31]}>
        <boxGeometry args={[0.85, 0.022, 0.01]} />
        <meshStandardMaterial color="#818CF8" emissive="#818CF8" emissiveIntensity={5} />
      </mesh>

      {/* Power button */}
      <mesh position={[0.42, 1.0, 0.31]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.052, 0.052, 0.015, 32]} />
        <meshStandardMaterial color="#6366F1" emissive="#6366F1" emissiveIntensity={3} />
      </mesh>

      {/* HDD activity LED */}
      <mesh position={[0.27, 1.0, 0.31]}>
        <boxGeometry args={[0.028, 0.028, 0.01]} />
        <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={3} />
      </mesh>

      {/* Ventilation slots */}
      {([-0.3, -0.1, 0.1, 0.3] as number[]).map((x, i) => (
        <mesh key={i} position={[x, -0.55, 0.31]}>
          <boxGeometry args={[0.04, 0.65, 0.01]} />
          <meshStandardMaterial color="#0f0f1a" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}

      {/* USB/IO cluster */}
      <mesh position={[0, 0.6, 0.31]}>
        <boxGeometry args={[0.55, 0.12, 0.01]} />
        <meshStandardMaterial color="#080810" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Side LED strip */}
      <mesh position={[0.605, 0, 0]}>
        <boxGeometry args={[0.008, 2.4, 0.02]} />
        <meshStandardMaterial color="#6366F1" emissive="#6366F1" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <hemisphereLight args={['#818CF8', '#000000', 0.8]} />
      <pointLight position={[-3, 4, 3]} intensity={3} color="#818CF8" />
      <pointLight position={[3, -2, 2]} intensity={2} color="#6366F1" />
      <pointLight position={[0, 1, 5]} intensity={1} color="#ffffff" />
      <Environment preset="city" background={false} />
      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.5}>
        <PCCase />
      </Float>
      <ContactShadows
        position={[0, -1.6, 0]}
        opacity={0.45}
        scale={5}
        blur={2.5}
        color="#6366F1"
      />
    </>
  );
}

export function PC3DSection() {
  return (
    <section
      data-l-section="section-3d"
      className="l-s3d"
    >
      <div aria-hidden="true" className="l-s3d-glow" />
      <div className="l-container l-s3d-inner">
        {/* Text */}
        <div className="l-s3d-text">
          <p className="l-m-label l-s3d-label">
            <span aria-hidden="true" className="l-s3d-dot" />
            Visualisation 3D
          </p>
          <h2 className="l-s3d-heading">
            Chaque composant,{' '}
            <em className="l-s3d-em">dans les détails.</em>
          </h2>
          <p className="l-s3d-body">
            CPU, GPU, RAM, alimentation — explore l&apos;architecture interne d&apos;un PC de A à Z et comprends comment chaque pièce joue son rôle dans la machine.
          </p>
          <a href="/cours" className="l-m-btn l-s3d-cta">
            Explorer les cours
          </a>
        </div>

        {/* 3D Canvas */}
        <div className="l-s3d-canvas-wrap">
          <Canvas
            camera={{ position: [0, 0.5, 5], fov: 40 }}
            style={{ width: '100%', height: '100%' }}
            dpr={[1, 2]}
          >
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </section>
  );
}
