'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import Image from 'next/image';
import * as THREE from 'three';

// ─── Shared: Spinning Fan ────────────────────────────────────────────────────

function SpinFan({
  pos,
  accent,
  speed = 5,
  radius = 0.38,
}: {
  pos: [number, number, number];
  accent: string;
  speed?: number;
  radius?: number;
}) {
  const blades = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { blades.current.rotation.z = clock.elapsedTime * speed; });
  const r = radius;
  return (
    <group position={pos}>
      {/* Outer ring frame */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[r, 0.03, 8, 48]} />
        <meshStandardMaterial color="#1a1a2a" metalness={0.7} roughness={0.25} />
      </mesh>
      {/* Inner corner hubs (4 corners of fan frame) */}
      {([[-r * 0.7, r * 0.7], [r * 0.7, r * 0.7], [-r * 0.7, -r * 0.7], [r * 0.7, -r * 0.7]] as [number, number][]).map(([x, y], i) => (
        <mesh key={i} position={[x, 0, y]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.04, 8]} />
          <meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      {/* RGB ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[r * 0.88, 0.018, 8, 48]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={4} />
      </mesh>
      {/* Spinning blades */}
      <group ref={blades} rotation={[Math.PI / 2, 0, 0]}>
        {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg, i) => (
          <mesh key={i} rotation={[0, 0, (deg * Math.PI) / 180]}>
            <boxGeometry args={[0.03, r * 0.72, 0.035]} />
            <meshStandardMaterial color="#0e0e20" metalness={0.4} roughness={0.55} />
          </mesh>
        ))}
        {/* Centre hub */}
        <mesh>
          <cylinderGeometry args={[0.06, 0.06, 0.07, 16]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={2} />
        </mesh>
      </group>
    </group>
  );
}

// ─── CPU — Intel Core i9 (12th gen Alder Lake style) ────────────────────────

function CPUModel() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { ref.current.rotation.y = clock.elapsedTime * 0.42; });

  // LGA1700 contact pins — simplified as instanced gold dots
  const pinOffsets: [number, number, number][] = [];
  for (let row = -6; row <= 6; row++) {
    for (let col = -6; col <= 6; col++) {
      pinOffsets.push([col * 0.12, 0.095, row * 0.12]);
    }
  }

  const capY = 0.12;
  const caps: [number, number, number][] = [
    // Top edge
    [-0.85, capY, 0.96], [-0.45, capY, 0.96], [-0.05, capY, 0.96], [0.35, capY, 0.96], [0.75, capY, 0.96],
    // Bottom edge
    [-0.85, capY, -0.96], [-0.45, capY, -0.96], [-0.05, capY, -0.96], [0.35, capY, -0.96], [0.75, capY, -0.96],
    // Left edge
    [-0.96, capY, -0.6], [-0.96, capY, -0.2], [-0.96, capY, 0.2], [-0.96, capY, 0.6],
    // Right edge
    [0.96, capY, -0.6], [0.96, capY, -0.2], [0.96, capY, 0.2], [0.96, capY, 0.6],
  ];

  return (
    <group ref={ref}>
      {/* PCB substrate — dark green/black */}
      <mesh>
        <boxGeometry args={[2.1, 0.2, 2.1]} />
        <meshStandardMaterial color="#0c190c" metalness={0.25} roughness={0.78} />
      </mesh>

      {/* Gold LGA contact field */}
      {pinOffsets.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <cylinderGeometry args={[0.03, 0.03, 0.04, 6]} />
          <meshStandardMaterial color="#c8960a" metalness={0.96} roughness={0.04} />
        </mesh>
      ))}

      {/* PCB trace lines */}
      {[-0.4, 0, 0.4].map((x, i) => (
        <mesh key={i} position={[x, 0.1, 0]}>
          <boxGeometry args={[0.006, 0.008, 2.0]} />
          <meshStandardMaterial color="#3a7a2a" metalness={0.3} roughness={0.7} />
        </mesh>
      ))}

      {/* Edge capacitors */}
      {caps.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <cylinderGeometry args={[0.055, 0.055, 0.12, 8]} />
          <meshStandardMaterial color="#1a1a28" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}

      {/* IHS — Integrated Heat Spreader */}
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[1.7, 0.15, 1.7]} />
        <meshStandardMaterial color="#c8b040" metalness={0.97} roughness={0.025} />
      </mesh>

      {/* IHS polished center mirror */}
      <mesh position={[0, 0.358, 0]}>
        <boxGeometry args={[1.15, 0.005, 1.15]} />
        <meshStandardMaterial color="#d8c050" metalness={0.99} roughness={0.008} />
      </mesh>

      {/* IHS laser etch — brand horizontal bar */}
      <mesh position={[0, 0.363, 0.24]}>
        <boxGeometry args={[0.55, 0.003, 0.07]} />
        <meshStandardMaterial color="#999999" metalness={0.85} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.363, 0.36]}>
        <boxGeometry args={[0.4, 0.003, 0.055]} />
        <meshStandardMaterial color="#777777" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* RGB outer ring — primary */}
      <mesh position={[0, 0.362, 0]}>
        <torusGeometry args={[0.95, 0.042, 8, 64]} />
        <meshStandardMaterial color="#818CF8" emissive="#818CF8" emissiveIntensity={5} />
      </mesh>
      {/* Secondary inner ring */}
      <mesh position={[0, 0.362, 0]}>
        <torusGeometry args={[0.8, 0.02, 8, 64]} />
        <meshStandardMaterial color="#a5b4fc" emissive="#a5b4fc" emissiveIntensity={2.5} />
      </mesh>

      {/* IHS edge chamfer suggestion (thin strip) */}
      <mesh position={[0, 0.352, 0]}>
        <torusGeometry args={[0.88, 0.012, 6, 4]} />
        <meshStandardMaterial color="#b8a030" metalness={0.96} roughness={0.03} />
      </mesh>

      {/* Alignment notch (corner) */}
      <mesh position={[-0.98, 0.12, -0.98]}>
        <boxGeometry args={[0.18, 0.22, 0.18]} />
        <meshStandardMaterial color="#0c190c" metalness={0.2} roughness={0.8} />
      </mesh>
    </group>
  );
}

// ─── GPU — ASUS ROG Strix RTX style (triple fan) ────────────────────────────

function GPUModel() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { ref.current.rotation.y = clock.elapsedTime * 0.36; });

  const accent = '#6366F1';
  const fanY = 0.26;

  return (
    <group ref={ref} rotation={[0.28, 0.06, 0]}>

      {/* PCB board */}
      <mesh>
        <boxGeometry args={[3.7, 0.1, 1.25]} />
        <meshStandardMaterial color="#0a1420" metalness={0.35} roughness={0.7} />
      </mesh>

      {/* PCIe x16 connector — gold fingers */}
      <mesh position={[0.65, -0.08, 0.55]}>
        <boxGeometry args={[2.1, 0.05, 0.1]} />
        <meshStandardMaterial color="#c09010" metalness={0.96} roughness={0.03} />
      </mesh>
      {/* Slot key notch */}
      <mesh position={[0.65, -0.075, 0.59]}>
        <boxGeometry args={[0.07, 0.06, 0.04]} />
        <meshStandardMaterial color="#0a1420" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Main heatsink shroud body */}
      <mesh position={[-0.05, fanY - 0.02, 0]}>
        <boxGeometry args={[3.55, 0.5, 1.18]} />
        <meshStandardMaterial color="#080818" metalness={0.92} roughness={0.07} />
      </mesh>

      {/* Shroud side vent fins (right) */}
      {[-0.35, -0.22, -0.09, 0.04, 0.17, 0.3, 0.43].map((z, i) => (
        <mesh key={i} position={[1.8, fanY, z]}>
          <boxGeometry args={[0.055, 0.46, 0.014]} />
          <meshStandardMaterial color="#18183a" metalness={0.75} roughness={0.18} />
        </mesh>
      ))}

      {/* ROG Eye logo (angled diamond on shroud) */}
      <mesh position={[-1.35, fanY + 0.22, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.3, 0.3, 0.01]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={4} />
      </mesh>
      <mesh position={[-1.35, fanY + 0.22, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.14, 0.14, 0.015]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
      </mesh>

      {/* RGB top strip — full length */}
      <mesh position={[-0.05, fanY + 0.27, -0.59]}>
        <boxGeometry args={[3.2, 0.035, 0.012]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={6} />
      </mesh>
      {/* RGB diffuser above strip */}
      <mesh position={[-0.05, fanY + 0.26, -0.59]}>
        <boxGeometry args={[3.2, 0.018, 0.015]} />
        <meshStandardMaterial color="#818CF8" emissive="#818CF8" emissiveIntensity={2} transparent opacity={0.6} />
      </mesh>

      {/* Backplate */}
      <mesh position={[-0.05, fanY, -0.6]}>
        <boxGeometry args={[3.55, 0.46, 0.014]} />
        <meshStandardMaterial color="#111120" metalness={0.94} roughness={0.06} />
      </mesh>
      {/* Backplate diagonal cut lines */}
      <mesh position={[-0.05, fanY + 0.05, -0.597]} rotation={[0, 0, Math.PI * 0.08]}>
        <boxGeometry args={[3.3, 0.008, 0.008]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={2} />
      </mesh>
      <mesh position={[-0.05, fanY - 0.05, -0.597]} rotation={[0, 0, Math.PI * 0.08]}>
        <boxGeometry args={[2.8, 0.006, 0.006]} />
        <meshStandardMaterial color="#4f52a0" emissive="#4f52a0" emissiveIntensity={1} />
      </mesh>

      {/* I/O bracket (left side) */}
      <mesh position={[-1.83, fanY - 0.12, 0]}>
        <boxGeometry args={[0.06, 0.25, 1.1]} />
        <meshStandardMaterial color="#1a1a2a" metalness={0.85} roughness={0.12} />
      </mesh>
      {/* I/O ports (display outputs) */}
      {[-0.36, -0.12, 0.12, 0.36].map((z, i) => (
        <mesh key={i} position={[-1.87, fanY - 0.12, z]}>
          <boxGeometry args={[0.02, 0.12, 0.14]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}

      {/* 2× 8-pin power connectors (top) */}
      <mesh position={[1.48, fanY + 0.2, -0.42]}>
        <boxGeometry args={[0.24, 0.18, 0.22]} />
        <meshStandardMaterial color="#181818" metalness={0.55} roughness={0.45} />
      </mesh>
      <mesh position={[1.75, fanY + 0.2, -0.42]}>
        <boxGeometry args={[0.24, 0.18, 0.22]} />
        <meshStandardMaterial color="#181818" metalness={0.55} roughness={0.45} />
      </mesh>
      {[1.41, 1.48, 1.55, 1.68, 1.75, 1.82].map((x, i) => (
        <mesh key={i} position={[x, fanY + 0.3, -0.42]}>
          <cylinderGeometry args={[0.018, 0.018, 0.04, 8]} />
          <meshStandardMaterial color="#c09010" metalness={0.95} roughness={0.05} />
        </mesh>
      ))}

      {/* 3 spinning fans */}
      <SpinFan pos={[-1.1, fanY, 0.6]} accent={accent} speed={5} />
      <SpinFan pos={[0.05, fanY, 0.6]} accent={accent} speed={5.3} />
      <SpinFan pos={[1.2, fanY, 0.6]} accent={accent} speed={4.8} />

    </group>
  );
}

// ─── RAM — Corsair Dominator Platinum RGB ───────────────────────────────────

function RAMModel() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { ref.current.rotation.y = clock.elapsedTime * 0.48; });

  const chipPositions: [number, number][] = [
    [-0.78, 0.18], [-0.5, 0.18], [-0.22, 0.18], [0.06, 0.18], [0.34, 0.18], [0.62, 0.18],
  ];

  return (
    <group ref={ref}>
      {/* PCB stick */}
      <mesh>
        <boxGeometry args={[0.14, 2.55, 0.98]} />
        <meshStandardMaterial color="#0a0a1a" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Gold edge connector (bottom) */}
      <mesh position={[0, -1.24, 0]}>
        <boxGeometry args={[0.155, 0.13, 0.9]} />
        <meshStandardMaterial color="#c09010" metalness={0.96} roughness={0.03} />
      </mesh>
      {/* Notch in connector */}
      <mesh position={[0, -1.22, 0.38]}>
        <boxGeometry args={[0.16, 0.14, 0.07]} />
        <meshStandardMaterial color="#0a0a1a" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Memory chips — one side */}
      {chipPositions.map(([y, z], i) => (
        <mesh key={i} position={[0.09, y, z]}>
          <boxGeometry args={[0.04, 0.32, 0.3]} />
          <meshStandardMaterial color="#141428" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      {/* Other side (offset) */}
      {chipPositions.map(([y, z], i) => (
        <mesh key={i} position={[-0.09, y - 0.15, z]}>
          <boxGeometry args={[0.04, 0.32, 0.3]} />
          <meshStandardMaterial color="#141428" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}

      {/* Heat spreader — left wing (Dominator black aluminum) */}
      <mesh position={[0.22, 0.1, 0]}>
        <boxGeometry args={[0.26, 2.28, 0.96]} />
        <meshStandardMaterial color="#101018" metalness={0.92} roughness={0.07} />
      </mesh>
      {/* Right wing */}
      <mesh position={[-0.22, 0.1, 0]}>
        <boxGeometry args={[0.26, 2.28, 0.96]} />
        <meshStandardMaterial color="#101018" metalness={0.92} roughness={0.07} />
      </mesh>

      {/* Dominator fin array — top (12 fins) */}
      {Array.from({ length: 12 }, (_, i) => i * 0.07 - 0.385).map((z, i) => (
        <mesh key={i} position={[0, 1.26, z]}>
          <boxGeometry args={[0.5, 0.28, 0.018]} />
          <meshStandardMaterial color="#181828" metalness={0.88} roughness={0.1} />
        </mesh>
      ))}

      {/* RGB light bar top — full width */}
      <mesh position={[0, 1.44, 0]}>
        <boxGeometry args={[0.52, 0.1, 0.92]} />
        <meshStandardMaterial color="#818CF8" emissive="#818CF8" emissiveIntensity={6} />
      </mesh>
      {/* Diffuser cap */}
      <mesh position={[0, 1.42, 0]}>
        <boxGeometry args={[0.56, 0.07, 0.96]} />
        <meshStandardMaterial color="#c0ccff" emissive="#c0ccff" emissiveIntensity={1.5} transparent opacity={0.35} />
      </mesh>

      {/* Corsair logo accent line on spreader */}
      <mesh position={[0.23, -0.1, 0]}>
        <boxGeometry args={[0.005, 1.6, 0.9]} />
        <meshStandardMaterial color="#6366F1" emissive="#6366F1" emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
}

// ─── SSD — Samsung 980 Pro NVMe M.2 ─────────────────────────────────────────

function SSDModel() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { ref.current.rotation.y = clock.elapsedTime * 0.44; });

  return (
    <group ref={ref} rotation={[0.22, 0, 0]}>

      {/* PCB */}
      <mesh>
        <boxGeometry args={[2.45, 0.065, 0.62]} />
        <meshStandardMaterial color="#080f1a" metalness={0.45} roughness={0.6} />
      </mesh>

      {/* Samsung black aluminium heatspreader */}
      <mesh position={[0.05, 0.065, 0]}>
        <boxGeometry args={[2.2, 0.072, 0.6]} />
        <meshStandardMaterial color="#0c1422" metalness={0.94} roughness={0.04} />
      </mesh>

      {/* Heatspreader top face — gradient suggestion */}
      <mesh position={[0.05, 0.1, 0]}>
        <boxGeometry args={[2.1, 0.005, 0.55]} />
        <meshStandardMaterial color="#141e30" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* "980 PRO" model label */}
      <mesh position={[0.3, 0.103, 0.12]}>
        <boxGeometry args={[0.7, 0.003, 0.062]} />
        <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Samsung blue logo */}
      <mesh position={[0.3, 0.103, -0.08]}>
        <boxGeometry args={[0.5, 0.003, 0.075]} />
        <meshStandardMaterial color="#1565C0" emissive="#1565C0" emissiveIntensity={1.5} />
      </mesh>

      {/* NVMe logo bar */}
      <mesh position={[0.3, 0.103, -0.2]}>
        <boxGeometry args={[0.22, 0.003, 0.045]} />
        <meshStandardMaterial color="#555555" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Samsung Elpis controller chip */}
      <mesh position={[-0.68, 0.096, 0]}>
        <boxGeometry args={[0.36, 0.076, 0.36]} />
        <meshStandardMaterial color="#1a2820" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[-0.68, 0.135, 0]}>
        <boxGeometry args={[0.28, 0.003, 0.12]} />
        <meshStandardMaterial color="#444" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* NAND V-NAND chips — 2×2 */}
      {([[0.35, 0.17], [0.35, -0.17], [0.85, 0.17], [0.85, -0.17]] as [number, number][]).map(([x, z], i) => (
        <mesh key={i} position={[x, 0.096, z]}>
          <boxGeometry args={[0.38, 0.076, 0.26]} />
          <meshStandardMaterial color="#101e28" metalness={0.55} roughness={0.45} />
        </mesh>
      ))}
      {/* Chip labels */}
      {[[0.35, 0.17], [0.35, -0.17], [0.85, 0.17], [0.85, -0.17]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.134, z]}>
          <boxGeometry args={[0.26, 0.003, 0.08]} />
          <meshStandardMaterial color="#333" metalness={0.4} roughness={0.6} />
        </mesh>
      ))}

      {/* M.2 M-key connector */}
      <mesh position={[-1.19, 0, 0]}>
        <boxGeometry args={[0.14, 0.065, 0.56]} />
        <meshStandardMaterial color="#b08808" metalness={0.97} roughness={0.03} />
      </mesh>
      {/* Key notch */}
      <mesh position={[-1.19, 0.04, 0.21]}>
        <boxGeometry args={[0.16, 0.065, 0.065]} />
        <meshStandardMaterial color="#080f1a" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Circuit trace lines (NVMe lanes) */}
      {[-0.2, 0, 0.2].map((z, i) => (
        <mesh key={i} position={[0.05, 0.098, z]}>
          <boxGeometry args={[2.0, 0.003, 0.007]} />
          <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={3} />
        </mesh>
      ))}

      {/* Mounting screw hole */}
      <mesh position={[1.18, 0.04, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.1, 12]} />
        <meshStandardMaterial color="#c0a030" metalness={0.96} roughness={0.04} />
      </mesh>
    </group>
  );
}

// ─── PSU — Corsair RM750x Fully Modular ──────────────────────────────────────

function PSUModel() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { ref.current.rotation.y = clock.elapsedTime * 0.3; });

  const accent = '#F59E0B';

  // Honeycomb vent (back face)
  const honeycombPos: [number, number][] = [];
  for (let col = -2; col <= 2; col++) {
    for (let row = -1; row <= 1; row++) {
      honeycombPos.push([col * 0.35, row * 0.3]);
    }
  }

  // Modular connector grid (front face) — 5 columns × 2 rows
  const modPorts: [number, number][] = [];
  for (let col = -2; col <= 2; col++) {
    for (let row = 0; row <= 1; row++) {
      modPorts.push([col * 0.32, row === 0 ? 0.2 : -0.15]);
    }
  }

  return (
    <group ref={ref} rotation={[0.1, 0, 0]}>

      {/* Main body */}
      <mesh>
        <boxGeometry args={[2.25, 1.1, 1.75]} />
        <meshStandardMaterial color="#111111" metalness={0.82} roughness={0.13} />
      </mesh>

      {/* Top face — fan area */}
      <mesh position={[0, 0.556, 0]}>
        <boxGeometry args={[1.8, 0.01, 1.7]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Fan grille circle */}
      <mesh position={[0, 0.558, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.012, 48]} />
        <meshStandardMaterial color="#090909" metalness={0.65} roughness={0.35} />
      </mesh>
      <SpinFan pos={[0, 0.57, 0]} accent={accent} speed={3.5} radius={0.44} />

      {/* Top label / Corsair logo bar */}
      <mesh position={[0, 0.558, -0.55]}>
        <boxGeometry args={[0.9, 0.01, 0.16]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={4} />
      </mesh>

      {/* Honeycomb vents (back face) */}
      {honeycombPos.map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.876]}>
          <cylinderGeometry args={[0.09, 0.09, 0.014, 6]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.4} roughness={0.6} />
        </mesh>
      ))}
      {/* Back power inlet */}
      <mesh position={[0.65, -0.3, 0.876]}>
        <boxGeometry args={[0.38, 0.24, 0.01]} />
        <meshStandardMaterial color="#222222" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* On/off switch */}
      <mesh position={[0.95, -0.3, 0.876]}>
        <boxGeometry args={[0.12, 0.18, 0.01]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Modular connector panel (front face) */}
      <mesh position={[0, 0, -0.876]}>
        <boxGeometry args={[2.1, 0.95, 0.01]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.75} roughness={0.25} />
      </mesh>
      {modPorts.map(([x, y], i) => (
        <mesh key={i} position={[x, y, -0.875]}>
          <boxGeometry args={[0.22, 0.16, 0.01]} />
          <meshStandardMaterial color="#181818" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      {/* Front Corsair logo */}
      <mesh position={[0, -0.35, -0.876]}>
        <boxGeometry args={[0.7, 0.06, 0.008]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={3} />
      </mesh>

      {/* Side vent slats (right) */}
      {[-0.38, -0.22, -0.06, 0.1, 0.26, 0.42].map((y, i) => (
        <mesh key={i} position={[1.125, y, 0.1]}>
          <boxGeometry args={[0.012, 0.08, 1.4]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.65} roughness={0.35} />
        </mesh>
      ))}
      {/* Side vent slats (left) */}
      {[-0.38, -0.22, -0.06, 0.1, 0.26, 0.42].map((y, i) => (
        <mesh key={i} position={[-1.125, y, 0.1]}>
          <boxGeometry args={[0.012, 0.08, 1.4]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.65} roughness={0.35} />
        </mesh>
      ))}

      {/* Rubber feet */}
      {([[-0.9, -0.82], [0.9, -0.82], [-0.9, 0.82], [0.9, 0.82]] as [number, number][]).map(([x, z], i) => (
        <mesh key={i} position={[x, -0.557, z]}>
          <cylinderGeometry args={[0.09, 0.09, 0.02, 12]} />
          <meshStandardMaterial color="#222222" metalness={0.2} roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Cooler — Corsair iCUE H150i Elite Capellix (360mm AIO) ─────────────────

function CoolerModel() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { ref.current.rotation.y = clock.elapsedTime * 0.26; });

  const accent = '#06B6D4';

  // pump head at centre-top, radiator below
  return (
    <group ref={ref}>

      {/* ── Pump head (Corsair square style with rounded corners) ── */}
      <group position={[0, 0.55, 0]}>
        {/* Main pump body */}
        <mesh>
          <boxGeometry args={[0.95, 0.95, 0.28]} />
          <meshStandardMaterial color="#0c0c22" metalness={0.9} roughness={0.06} />
        </mesh>
        {/* Rounded corner pillars */}
        {([[-0.4, -0.4], [0.4, -0.4], [-0.4, 0.4], [0.4, 0.4]] as [number, number][]).map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.29, 16]} />
            <meshStandardMaterial color="#0c0c22" metalness={0.9} roughness={0.06} />
          </mesh>
        ))}

        {/* Top cap face */}
        <mesh position={[0, 0, 0.142]}>
          <boxGeometry args={[0.88, 0.88, 0.02]} />
          <meshStandardMaterial color="#14143a" metalness={0.85} roughness={0.1} />
        </mesh>

        {/* Corsair logo hex ring */}
        <mesh position={[0, 0, 0.154]}>
          <torusGeometry args={[0.32, 0.028, 6, 6]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={5} />
        </mesh>
        {/* Inner hex fill */}
        <mesh position={[0, 0, 0.154]}>
          <cylinderGeometry args={[0.28, 0.28, 0.01, 6]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={2} metalness={0.7} roughness={0.2} />
        </mesh>
        {/* ARGB outer square ring */}
        <mesh position={[0, 0, 0.16]}>
          <torusGeometry args={[0.5, 0.025, 8, 4]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={4} />
        </mesh>

        {/* Contact plate (copper bottom) */}
        <mesh position={[0, 0, -0.147]}>
          <boxGeometry args={[0.72, 0.72, 0.04]} />
          <meshStandardMaterial color="#c8841c" metalness={0.95} roughness={0.04} />
        </mesh>

        {/* Tube connectors (left and right) */}
        <mesh position={[-0.38, -0.55, 0]} rotation={[0.3, 0, Math.PI / 5]}>
          <cylinderGeometry args={[0.07, 0.07, 0.95, 12]} />
          <meshStandardMaterial color="#181830" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0.38, -0.55, 0]} rotation={[0.3, 0, -Math.PI / 5]}>
          <cylinderGeometry args={[0.07, 0.07, 0.95, 12]} />
          <meshStandardMaterial color="#181830" metalness={0.5} roughness={0.3} />
        </mesh>
      </group>

      {/* ── 360mm Radiator ── */}
      <group position={[0, -0.55, 0]}>
        {/* Radiator block */}
        <mesh>
          <boxGeometry args={[2.0, 0.6, 0.55]} />
          <meshStandardMaterial color="#0d0d1e" metalness={0.78} roughness={0.18} />
        </mesh>
        {/* Radiator fin rows (left edge) */}
        {Array.from({ length: 14 }, (_, i) => i * 0.1 - 0.65).map((z, i) => (
          <mesh key={i} position={[0, 0, z]}>
            <boxGeometry args={[1.95, 0.52, 0.014]} />
            <meshStandardMaterial color="#14142a" metalness={0.7} roughness={0.2} />
          </mesh>
        ))}
        {/* End tanks */}
        <mesh position={[-1.0, 0, 0]}>
          <boxGeometry args={[0.06, 0.58, 0.54]} />
          <meshStandardMaterial color="#1a1a30" metalness={0.8} roughness={0.15} />
        </mesh>
        <mesh position={[1.0, 0, 0]}>
          <boxGeometry args={[0.06, 0.58, 0.54]} />
          <meshStandardMaterial color="#1a1a30" metalness={0.8} roughness={0.15} />
        </mesh>

        {/* 3× Corsair RGB fans on radiator */}
        <SpinFan pos={[-0.65, 0, 0.6]} accent={accent} speed={4.5} radius={0.36} />
        <SpinFan pos={[0, 0, 0.6]} accent={accent} speed={4.8} radius={0.36} />
        <SpinFan pos={[0.65, 0, 0.6]} accent={accent} speed={4.2} radius={0.36} />
      </group>

    </group>
  );
}

// ─── Per-component 3D canvas ─────────────────────────────────────────────────

type ModelKey = 'cpu' | 'gpu' | 'ram' | 'ssd' | 'psu' | 'cooler';

const CAM_CONFIG: Record<ModelKey, { pos: [number, number, number]; fov: number }> = {
  cpu:    { pos: [0.3, 1.4, 3.6],   fov: 46 },
  gpu:    { pos: [0.2, 0.9, 4.8],   fov: 50 },
  ram:    { pos: [0.4, 0.3, 5.2],   fov: 44 },
  ssd:    { pos: [0.1, 0.9, 4.2],   fov: 46 },
  psu:    { pos: [0.5, 1.2, 4.4],   fov: 50 },
  cooler: { pos: [0.3, 0.5, 4.8],   fov: 52 },
};

function ComponentCanvas({ model, accent }: { model: ModelKey; accent: string }) {
  const cfg = CAM_CONFIG[model];
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: cfg.fov, position: cfg.pos }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.18} />
      <pointLight position={[-4, 4, 4]} intensity={3.0} color="#ffffff" />
      <pointLight position={[3, -1, 3]} intensity={1.6} color={accent} />
      <pointLight position={[0, 1, -3]} intensity={0.7} color="#818CF8" />
      <pointLight position={[0, -2, 1]} intensity={0.4} color="#334" />
      {model === 'cpu'    && <CPUModel />}
      {model === 'gpu'    && <GPUModel />}
      {model === 'ram'    && <RAMModel />}
      {model === 'ssd'    && <SSDModel />}
      {model === 'psu'    && <PSUModel />}
      {model === 'cooler' && <CoolerModel />}
    </Canvas>
  );
}

// ─── Component card ───────────────────────────────────────────────────────────

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

          {/* Full RGB PC build — centre fixe */}
          <motion.div className="l-xp-pc" style={{ scale: pcScale, opacity: pcOpacity }}>
            <div className="l-xp-pc-glow" aria-hidden="true" />
            <Image
              src="/images/pc-aquarium.jpg"
              alt="Build PC Corsair RGB — Gigabyte mobo, ASUS GPU, AIO 360mm"
              width={560}
              height={700}
              priority
              className="l-xp-pc-img"
            />
          </motion.div>

          {/* Intel Core i9 */}
          <Comp x={cpuX} y={cpuY} opacity={cpuO}
            label="Processeur" sub="CPU · Intel Core i9" accent="#818CF8" model="cpu" />
          {/* ASUS ROG GPU */}
          <Comp x={gpuX} y={gpuY} opacity={gpuO}
            label="Carte graphique" sub="GPU · ASUS ROG Strix" accent="#6366F1" model="gpu" />
          {/* Corsair Dominator RAM */}
          <Comp x={ramX} y={ramY} opacity={ramO}
            label="Mémoire vive" sub="RAM · Corsair Dominator" accent="#818CF8" model="ram" />
          {/* Samsung 980 Pro */}
          <Comp x={ssdX} y={ssdY} opacity={ssdO}
            label="Stockage NVMe" sub="SSD · Samsung 980 Pro" accent="#10B981" model="ssd" />
          {/* Corsair RM PSU */}
          <Comp x={psuX} y={psuY} opacity={psuO}
            label="Alimentation" sub="PSU · Corsair RM750x" accent="#F59E0B" model="psu" />
          {/* Corsair iCUE H150i AIO */}
          <Comp x={coolerX} y={coolerY} opacity={coolerO}
            label="Refroidissement" sub="AIO · Corsair iCUE H150i" accent="#06B6D4" model="cooler" />

        </div>

        <motion.p className="l-xp-scroll-hint" style={{ opacity: hintOpacity }}>
          ↓ scroll pour explorer
        </motion.p>

      </div>
    </div>
  );
}
