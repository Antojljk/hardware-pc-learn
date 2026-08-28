import { BarChart3, Activity, Gauge, Cpu, MonitorPlay } from 'lucide-react';

export const metadata = { title: 'Benchmarks — HardwarePC' };

const sections = [
  {
    icon: Activity,
    title: 'FPS moyen',
    body: 'Nombre d\'images générées par seconde. Cible : ≥ 60 FPS pour jouer confortablement, ≥ 144 FPS pour exploiter un écran 144 Hz. Le FPS moyen cache la régularité : un jeu à 80 FPS de moyenne mais qui tombe à 30 FPS certaines secondes sera désagréable.',
  },
  {
    icon: Gauge,
    title: '1% low et 0.1% low',
    body: 'Le 1% low est la valeur sous laquelle tombent les 1% d\'images les plus lentes. Il reflète les micro-stutters. Un jeu à 90 FPS moyen mais 35 FPS en 1% low est moins fluide qu\'un jeu à 70 FPS moyen mais 60 FPS en 1% low.',
  },
  {
    icon: BarChart3,
    title: 'Frametime',
    body: 'Temps en millisecondes pour rendre une image. Cible : 16.6 ms pour 60 FPS, 8.3 ms pour 120 FPS. Un frametime irrégulier se traduit par des saccades même si la moyenne est élevée.',
  },
  {
    icon: Cpu,
    title: 'Utilisation CPU',
    body: 'Pourcentage de temps CPU occupé. Un CPU à 100% en permanence est CPU-bound. Regarde aussi la répartition par cœur : un jeu mal threadé ne mobilise qu\'un seul cœur.',
  },
  {
    icon: MonitorPlay,
    title: 'Utilisation GPU',
    body: 'À 99-100% en jeu, ton GPU est le facteur limitant. À 60%, c\'est probablement ton CPU (bottleneck) qui bride les performances.',
  },
  {
    icon: Activity,
    title: 'Températures',
    body: 'CPU : < 80°C idéal, 80-90°C OK, > 95°C throttling. GPU : < 75°C idéal, 75-85°C OK, > 90°C throttling. Utilise HWiNFO64 ou MSI Afterburner pour le monitoring en jeu.',
  },
  {
    icon: Gauge,
    title: 'Consommation',
    body: 'Mesure avec un wattmètre secteur. Pour un CPU donné, la consommation réelle peut être 1.5 à 2× supérieure au TDP constructeur (PL1/PL2). Ex. : un CPU "65W" peut consommer 100W en pic.',
  },
  {
    icon: BarChart3,
    title: 'Scores benchmarks',
    body: 'Cinebench R23 (CPU multi/mono), 3DMark Time Spy (GPU gaming), PCMark 10 (bureautique), Blender (rendu). Compare toujours sur la même version et les mêmes paramètres.',
  },
];

export default function BenchmarksPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <section className="module-hero">
        <div className="module-eyebrow">Référence</div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight flex items-center gap-2 mt-2">
          <BarChart3 className="w-6 h-6 text-text" /> Comprendre les benchmarks
        </h1>
        <p className="text-muted text-[15px] mt-2 max-w-xl">Apprends à interpréter les chiffres pour comparer CPU, GPU et configurations.</p>
      </section>

      <div className="grid sm:grid-cols-2 gap-3">
        {sections.map((s, i) => {
          const Icon = s.icon;
          return (
            <article key={s.title} className={`module-frame anim-rise anim-rise-${(i % 4) + 1}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-xl grid place-items-center bg-bg-elev border border-border">
                  <Icon className="w-4 h-4 text-text" />
                </div>
                <h2 className="font-semibold">{s.title}</h2>
              </div>
              <p className="text-sm text-muted leading-relaxed">{s.body}</p>
            </article>
          );
        })}
      </div>

      <section className="module-frame anim-rise anim-rise-4">
        <h2 className="section-title mb-3">Outils recommandés</h2>
        <ul className="text-sm space-y-2 text-muted">
          <li><strong className="text-text">HWiNFO64</strong> : monitoring complet (CPU, GPU, RAM, températures, voltages, fréquences).</li>
          <li><strong className="text-text">MSI Afterburner</strong> : overlay en jeu (FPS, frametime, GPU load) + overclocking GPU.</li>
          <li><strong className="text-text">Cinebench R23</strong> : benchmark CPU single/multi thread.</li>
          <li><strong className="text-text">3DMark</strong> : benchmark GPU (Time Spy, Fire Strike, Port Royal pour le ray tracing).</li>
          <li><strong className="text-text">CapFrameX</strong> : analyse fine du frametime et des 1% lows.</li>
        </ul>
      </section>
    </div>
  );
}
