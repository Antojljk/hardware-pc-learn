// Système de niveaux : XP cumulé → titre et palier
export const LEVELS = [
  { level: 1, title: 'Débutant',          xpRequired: 0 },
  { level: 2, title: 'Initié',            xpRequired: 500 },
  { level: 3, title: 'Assembleur',        xpRequired: 1500 },
  { level: 4, title: 'Technicien I',      xpRequired: 3000 },
  { level: 5, title: 'Technicien confirmé', xpRequired: 5000 },
  { level: 6, title: 'Expert Hardware',   xpRequired: 8000 },
  { level: 7, title: 'Maître Hardware',   xpRequired: 12000 },
];

export function getLevel(xp: number) {
  let current = LEVELS[0];
  let next = LEVELS[1];
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].xpRequired) current = LEVELS[i];
    if (LEVELS[i].xpRequired > xp) { next = LEVELS[i]; break; }
  }
  const span = next.xpRequired - current.xpRequired;
  const into = xp - current.xpRequired;
  const progress = Math.max(0, Math.min(100, (into / span) * 100));
  return { current, next, progress, xpInLevel: into, xpForNext: span };
}

// Domaines de compétence — utilisés pour les stats
export const DOMAINS = [
  { key: 'cpu',        label: 'CPU',        icon: 'Cpu' },
  { key: 'gpu',        label: 'GPU',        icon: 'MonitorPlay' },
  { key: 'ram',        label: 'RAM',        icon: 'Layers' },
  { key: 'storage',    label: 'Stockage',   icon: 'HardDrive' },
  { key: 'motherboard', label: 'Carte mère', icon: 'CircuitBoard' },
  { key: 'psu',        label: 'Alimentation', icon: 'Plug' },
  { key: 'cooling',    label: 'Refroidissement', icon: 'Wind' },
  { key: 'pcb',        label: 'Périphériques', icon: 'Mouse' },
  { key: 'arch_cpu',   label: 'Architecture CPU', icon: 'Binary' },
  { key: 'arch_gpu',   label: 'Architecture GPU', icon: 'Boxes' },
  { key: 'memory_tech', label: 'Technologies mémoire', icon: 'Database' },
  { key: 'interfaces', label: 'Interfaces (PCIe/NVMe)', icon: 'Cable' },
  { key: 'vrm',        label: 'VRM',        icon: 'Zap' },
  { key: 'firmware',   label: 'BIOS / UEFI', icon: 'Settings' },
  { key: 'overclock',  label: 'Overclocking', icon: 'Gauge' },
  { key: 'thermal',    label: 'Thermique',  icon: 'Thermometer' },
  { key: 'benchmarks', label: 'Benchmarks', icon: 'BarChart3' },
  { key: 'diagnostic', label: 'Diagnostic', icon: 'Stethoscope' },
  { key: 'build',      label: 'Montage / Build', icon: 'Hammer' },
  { key: 'compatibility', label: 'Compatibilité', icon: 'Combine' },
  { key: 'driver_os',  label: 'Pilotes / OS', icon: 'AppWindow' },
] as const;

export type DomainKey = (typeof DOMAINS)[number]['key'];

export function getDomainMastery(scores: Record<string, number>): Record<DomainKey, number> {
  const result = {} as Record<DomainKey, number>;
  for (const d of DOMAINS) result[d.key] = scores[d.key] ?? 0;
  return result;
}

export function masteryColor(value: number): { label: string; color: string; bg: string; ring: string } {
  if (value >= 85) return { label: 'Maîtrisé',     color: 'text-success',    bg: 'bg-success/15',    ring: 'ring-success/40' };
  if (value >= 65) return { label: 'Acquis',       color: 'text-brand-cyan',  bg: 'bg-brand-cyan/15', ring: 'ring-brand-cyan/40' };
  if (value >= 40) return { label: 'À renforcer',  color: 'text-warning',    bg: 'bg-warning/15',    ring: 'ring-warning/40' };
  return                    { label: 'À travailler', color: 'text-danger',    bg: 'bg-danger/15',     ring: 'ring-danger/40' };
}
