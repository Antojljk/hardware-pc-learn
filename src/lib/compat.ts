import { COMPONENTS } from '@/content/components';

export type Build = Partial<Record<string, string>>; // type -> component id
export type Issue = { severity: 'error' | 'warn' | 'info'; message: string };
export type Score = { performance: number; value: number; compatibility: number; upgrade: number; total: number };

function get(type: string, id?: string) { return id ? COMPONENTS.find(c => c.id === id) : undefined; }

export function checkCompatibility(build: Build): { ok: boolean; issues: Issue[]; totalPower: number; totalPrice: number } {
  const issues: Issue[] = [];
  let totalPower = 0;
  let totalPrice = 0;

  const cpu = get('cpu', build.cpu);
  const mb = get('motherboard', build.motherboard);
  const ram = get('ram', build.ram);
  const gpu = get('gpu', build.gpu);
  const ssd = get('ssd', build.ssd);
  const psu = get('psu', build.psu);
  const caseC = get('case', build.case);
  const cooler = get('cooler', build.cooler);

  [cpu, mb, ram, gpu, ssd, psu, caseC, cooler].forEach(c => { if (c) totalPrice += c.price; });

  // 1. Socket CPU vs carte mère
  if (cpu && mb) {
    const cpuSocket = String(cpu.specs.socket);
    const mbSocket = String(mb.specs.socket);
    if (cpuSocket !== mbSocket) {
      issues.push({ severity: 'error', message: `Cette carte mère utilise le socket ${mbSocket}. Le processeur sélectionné est ${cpuSocket}. ❌` });
    }
  }

  // 2. RAM type
  if (ram && mb) {
    const ramType = String(ram.specs.type);
    const mbRamType = String(mb.specs.ram_type);
    if (ramType !== mbRamType) {
      issues.push({ severity: 'error', message: `La carte mère supporte ${mbRamType}. La RAM sélectionnée est ${ramType}. ❌` });
    }
  }

  // 3. Format carte mère vs boîtier
  if (mb && caseC) {
    const mbForm = String(mb.specs.form);
    const caseForm = String(caseC.specs.form);
    const order = { ITX: 0, mATX: 1, ATX: 2 };
    if (order[mbForm as keyof typeof order] > order[caseForm as keyof typeof order]) {
      issues.push({ severity: 'error', message: `Carte mère ${mbForm} trop grande pour boîtier ${caseForm}. ❌` });
    }
  }

  // 4. Puissance GPU + CPU vs PSU
  if (psu) {
    const psuW = Number(psu.specs.wattage);
    const cpuTdp = cpu ? Number(cpu.specs.tdp) : 0;
    const gpuPower = gpu ? Number(gpu.specs.power) : 0;
    const headroom = 0.7; // 70% charge max recommandé
    totalPower = cpuTdp + gpuPower + 100; // +100W pour le reste
    const recommended = totalPower / headroom;
    if (psuW < totalPower) {
      issues.push({ severity: 'error', message: `PSU ${psuW}W insuffisante. Le PC consomme ~${totalPower}W. ❌` });
    } else if (psuW < recommended) {
      issues.push({ severity: 'warn', message: `PSU ${psuW}W trop juste. Recommandé : ${Math.ceil(recommended)}W (30% de marge). ⚠️` });
    } else {
      issues.push({ severity: 'info', message: `PSU ${psuW}W OK (charge estimée ~${Math.round(totalPower/psuW*100)}%). ✓` });
    }
  }

  // 5. GPU length vs case
  if (gpu && caseC) {
    const gpuLen = Number(gpu.specs.length);
    const caseLen = Number(caseC.specs.gpu_length);
    if (gpuLen > caseLen) {
      issues.push({ severity: 'error', message: `GPU ${gpuLen}mm trop long pour boîtier ${caseLen}mm. ❌` });
    }
  }

  // 6. Cooler height vs case
  if (cooler && caseC) {
    const ch = Number(cooler.specs.height);
    const caseh = Number(caseC.specs.cooler_height);
    if (ch > caseh) {
      issues.push({ severity: 'error', message: `Ventirad ${ch}mm trop haut pour boîtier ${caseh}mm. ❌` });
    }
  }

  // 7. CPU TDP vs cooler capacity
  if (cpu && cooler) {
    const tdp = Number(cpu.specs.tdp);
    const coolMax = Number(cooler.specs.tdp_max);
    if (coolMax < tdp) {
      issues.push({ severity: 'warn', message: `Ventirad conçu pour ${coolMax}W, CPU ${tdp}W. Sous-dimensionné. ⚠️` });
    } else if (coolMax < tdp * 1.3) {
      issues.push({ severity: 'warn', message: `Ventirad OK mais juste pour ${tdp}W (capacité ${coolMax}W). ⚠️` });
    } else {
      issues.push({ severity: 'info', message: `Refroidissement adapté (${coolMax}W pour ${tdp}W CPU). ✓` });
    }
  }

  // 8. SSD interface vs motherboard M.2 slots
  if (ssd && mb) {
    const ssdIface = String(ssd.specs.interface);
    if (ssdIface.includes('NVMe') || ssdIface.includes('PCIe')) {
      const m2Slots = Number(mb.specs.m2_slots);
      if (m2Slots < 1) issues.push({ severity: 'warn', message: `Aucun slot M.2 sur cette carte mère pour ce SSD NVMe. ⚠️` });
    }
  }

  // 9. GPU power connector vs PSU
  if (gpu && psu) {
    const gpuPower = Number(gpu.specs.power);
    const psuConnector = String(psu.specs.connector || '');
    if (gpuPower >= 450 && !psuConnector.includes('12VHPWR')) {
      issues.push({ severity: 'warn', message: `GPU ${gpuPower}W nécessite 12VHPWR. PSU livrée sans : utiliser un adaptateur. ⚠️` });
    }
  }

  // 10. RAM slots
  if (ram && mb) {
    const sticks = Number(ram.specs.sticks);
    const slots = Number(mb.specs.ram_slots);
    if (sticks > slots) {
      issues.push({ severity: 'error', message: `RAM ${sticks} sticks > slots CM ${slots}. ❌` });
    }
  }

  // 11. RAM speed check for AM5 sweet spot
  if (ram && cpu && String(cpu.specs.socket) === 'AM5') {
    const speed = Number(ram.specs.speed);
    if (speed > 6000) {
      issues.push({ severity: 'info', message: `DDR5-${speed} > sweet spot AM5 (DDR5-6000). Ratio FCLK 2:1, latence légèrement supérieure. ℹ️` });
    }
  }

  const hasErrors = issues.some(i => i.severity === 'error');
  return { ok: !hasErrors, issues, totalPower, totalPrice };
}

export function evaluateBuild(build: Build, constraints: Record<string, string | number | boolean> = {}): Score {
  const c = checkCompatibility(build);
  if (!c.ok) {
    return { performance: 0, value: 0, compatibility: 0, upgrade: 0, total: 0 };
  }

  const cpu = get('cpu', build.cpu);
  const gpu = get('gpu', build.gpu);
  const ram = get('ram', build.ram);
  const ssd = get('ssd', build.ssd);

  // Performance: heuristique basée sur le couple CPU/GPU
  // Simple scoring basé sur les prix relatifs
  let perf = 50;
  if (cpu && gpu) {
    const cpuScore = Math.min(40, cpu.price / 15);
    const gpuScore = Math.min(60, gpu.price / 25);
    perf = Math.min(100, cpuScore + gpuScore);
  }
  // Bonus RAM
  if (ram && Number(ram.specs.size) >= 32) perf += 8;
  if (ssd && String(ssd.specs.interface).includes('NVMe')) perf += 5;

  // Valeur : performance / prix
  const value = Math.min(100, perf * 1.2 / Math.max(1, c.totalPrice / 800));

  // Compatibilité: pas d'erreur
  const compatibility = 100;

  // Évolution: AM5/DDR5 = bon, mATX = moins de slots
  let upgrade = 80;
  const mb = get('motherboard', build.motherboard);
  if (mb) {
    if (String(mb.specs.socket) === 'AM5' || String(mb.specs.socket) === 'LGA1851') upgrade += 10;
    if (Number(mb.specs.m2_slots) >= 3) upgrade += 5;
    if (Number(mb.specs.ram_slots) >= 4) upgrade += 5;
  }
  upgrade = Math.min(100, upgrade);

  // Bonus contraintes
  if (constraints.resolution === '1440p' && gpu && Number(gpu.specs.vram) >= 12) perf += 5;
  if (constraints.ram_min) {
    const min = Number(constraints.ram_min);
    if (ram && Number(ram.specs.size) >= min) perf += 3;
  }
  if (constraints.ssd_min) {
    const min = Number(constraints.ssd_min);
    if (ssd && Number(ssd.specs.capacity) >= min) perf += 3;
  }

  const total = Math.round((perf * 0.4) + (value * 0.25) + (compatibility * 0.2) + (upgrade * 0.15));
  return { performance: Math.min(100, perf), value: Math.min(100, value), compatibility, upgrade, total: Math.min(100, total) };
}

export const CHALLENGES = [
  { slug: 'gaming-1000', title: 'PC gaming à 1 000 €', budget: 1000, constraints: { use: 'gaming', resolution: '1440p', ram_min: 16, ssd_min: 1000 } },
  { slug: 'gaming-1500', title: 'PC gaming à 1 500 €', budget: 1500, constraints: { use: 'gaming', resolution: '1440p', ram_min: 32, ssd_min: 1000, wifi: true } },
  { slug: 'creation-2000', title: 'PC création à 2 000 €', budget: 2000, constraints: { use: 'creation', ram_min: 32, ssd_min: 2000, resolution: '4K' } },
  { slug: 'streaming-1500', title: 'PC streaming à 1 500 €', budget: 1500, constraints: { use: 'streaming', ram_min: 32, ssd_min: 1000 } },
  { slug: 'esport-800', title: 'PC esport à 800 €', budget: 800, constraints: { use: 'esport', ram_min: 16, ssd_min: 500 } },
];
