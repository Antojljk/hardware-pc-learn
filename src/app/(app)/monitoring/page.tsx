import { Activity, Thermometer, Cpu, MonitorPlay, MemoryStick, HardDrive, Plug, Wind, AlertTriangle, ListChecks } from 'lucide-react';

export const metadata = { title: 'Monitoring — HardwarePC' };

const metrics = [
  { icon: Cpu, name: 'CPU usage',          tip: 'HWiNFO64 → CPU [0..n] → utilisation. > 80% constant = CPU bottleneck.' },
  { icon: Thermometer, name: 'CPU temperature', tip: 'HWiNFO64 → CPU Temperature. < 80°C OK, 80-90°C chaud, > 95°C throttling.' },
  { icon: MonitorPlay, name: 'GPU usage',   tip: 'HWiNFO64 → GPU usage. 99% en jeu = GPU-bound, < 70% = souvent CPU-bound.' },
  { icon: Thermometer, name: 'GPU temperature', tip: 'HWiNFO64 → GPU Temperature. < 75°C idéal, 75-85°C OK, > 90°C danger.' },
  { icon: MemoryStick, name: 'RAM usage',   tip: 'Task Manager → Performance → Memory. > 80% = compresser la RAM, fermer des apps.' },
  { icon: HardDrive, name: 'VRAM usage',   tip: 'HWiNFO64 → GPU Memory Used. > 90% de la VRAM = chute de FPS (texture swapping).' },
  { icon: Activity, name: 'Clock speed',   tip: 'HWiNFO64 → CPU/GPU Clock. Vérifie que le boost fonctionne (≠ fréquence de base).' },
  { icon: Plug, name: 'Power consumption', tip: 'HWiNFO64 → CPU/GPU Power. Doit rester sous le PPT/PL2 pour éviter le throttling.' },
  { icon: Wind, name: 'Fan speed',        tip: 'HWiNFO64 → Fan speeds. Une courbe agressive = plus de bruit. Ajuste dans le BIOS ou le software de la carte.' },
];

const problemClues = [
  'CPU à 100% sur un cœur et 10% sur les autres → jeu mal threadé ou bottleneck CPU.',
  'GPU à 99% et CPU à 50% → GPU-bound (normal, équilibre OK).',
  'GPU à 60% et CPU à 50% → autre limite (RAM, stockage, pilote).',
  'Température CPU qui monte à 95°C en quelques minutes → ventirad mal installé ou pâte thermique usée.',
  'Stuttering avec VRAM à 99% → réduire les textures ou upgrade GPU.',
  'Fréquence CPU qui descend sous la base en charge → throttling thermique (Tjunction).',
];

export default function MonitoringPage() {
  return (
    <div className="space-y-6">
      <section className="module-hero">
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="module-eyebrow flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" /> Référence
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              Monitoring PC
            </h1>
            <p className="text-muted text-[15px] max-w-xl leading-relaxed">
              Comprendre les capteurs et apprendre à repérer un problème avant qu&apos;il ne dégrade ton PC.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto sm:min-w-[360px]">
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <ListChecks className="w-3.5 h-3.5" /> Capteurs
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {metrics.length}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Thermometer className="w-3.5 h-3.5" /> Composants
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                6
              </div>
            </div>
            <div className="rounded-2xl border border-text/30 bg-text/8 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <AlertTriangle className="w-3.5 h-3.5" /> Signaux
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {problemClues.length}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-3 mb-4">
          <h2 className="section-title">Capteurs à surveiller</h2>
          <span className="text-[10px] uppercase tracking-[0.14em] text-faint">01 · Lecture</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {metrics.map((m, i) => {
            const Icon = m.icon;
            return (
              <article
                key={m.name}
                className={`card-depth relative overflow-hidden lift-3d p-5 sm:p-6 anim-rise anim-rise-${(i % 4) + 1}`}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-40 blur-3xl"
                  style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.10), transparent 70%)' }}
                />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl grid place-items-center bg-bg-elev border border-border text-text shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-display text-base font-semibold text-text">{m.name}</h3>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{m.tip}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="module-frame anim-rise anim-rise-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Repérer un problème
          </h2>
          <span className="badge-muted tabular-nums">{problemClues.length}</span>
        </div>
        <ul className="divide-y divide-border">
          {problemClues.map((clue, i) => (
            <li key={i} className="py-3 flex items-start gap-3 text-sm">
              <span className="font-display tabular-nums text-muted w-6 shrink-0">
                0{i + 1}
              </span>
              <span className="text-text-soft leading-relaxed flex-1">{clue}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
