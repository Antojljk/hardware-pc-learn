import { Activity, Thermometer, Cpu, MonitorPlay, MemoryStick, HardDrive, Plug, Wind } from 'lucide-react';

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

export default function MonitoringPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <section className="module-hero">
        <div className="module-eyebrow">Référence</div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight flex items-center gap-2 mt-2">
          <Activity className="w-6 h-6 text-text" /> Monitoring PC
        </h1>
        <p className="text-muted text-[15px] mt-2 max-w-xl">Comprendre les capteurs et apprendre à repérer un problème.</p>
      </section>

      <section className="grid sm:grid-cols-2 gap-3">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <article key={m.name} className={`module-frame anim-rise anim-rise-${(i % 4) + 1}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-xl grid place-items-center bg-bg-elev border border-border">
                  <Icon className="w-4 h-4 text-text" />
                </div>
                <h3 className="font-semibold text-sm">{m.name}</h3>
              </div>
              <p className="text-xs text-muted leading-relaxed">{m.tip}</p>
            </article>
          );
        })}
      </section>

      <section className="module-frame anim-rise anim-rise-4">
        <h2 className="section-title mb-2">Repérer un problème</h2>
        <ul className="text-sm text-muted space-y-1.5 list-disc pl-5 marker:text-muted">
          <li>CPU à 100% sur un cœur et 10% sur les autres → jeu mal threadé ou bottleneck CPU.</li>
          <li>GPU à 99% et CPU à 50% → GPU-bound (normal, équilibre OK).</li>
          <li>GPU à 60% et CPU à 50% → autre limite (RAM, stockage, pilote).</li>
          <li>Température CPU qui monte à 95°C en quelques minutes → ventirad mal installé ou pâte thermique usée.</li>
          <li>Stuttering avec VRAM à 99% → réduire les textures ou upgrade GPU.</li>
          <li>Fréquence CPU qui descend sous la base en charge → throttling thermique (Tjunction).</li>
        </ul>
      </section>
    </div>
  );
}
