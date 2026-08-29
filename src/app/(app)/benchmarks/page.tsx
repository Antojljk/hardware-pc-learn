import { BarChart3, Activity, Gauge, Cpu, MonitorPlay, Wrench, ListChecks } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { canAccess } from '@/lib/plans';
import { LockedState } from '@/components/LockedState';

export const metadata = { title: 'Benchmarks — HardwarePC' };
export const dynamic = 'force-dynamic';

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

export default async function BenchmarksPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  if (!canAccess(user.plan, 'monitoring_extended')) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">Benchmarks</h1>
        <LockedState
          feature="Benchmarks & Analyse"
          required="PRO"
          current={user.plan}
          description="L'analyse des benchmarks est réservée à l'offre Pro et supérieures : apprends à interpréter les chiffres pour optimiser tes performances."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="module-hero">
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="module-eyebrow flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5" /> Référence
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              Comprendre les benchmarks
            </h1>
            <p className="text-muted text-[15px] max-w-xl leading-relaxed">
              Apprends à interpréter les chiffres pour comparer CPU, GPU et configurations.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto sm:min-w-[360px]">
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <ListChecks className="w-3.5 h-3.5" /> Métriques
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {sections.length}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Activity className="w-3.5 h-3.5" /> Domaines
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                3
              </div>
            </div>
            <div className="rounded-2xl border border-text/30 bg-text/8 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Wrench className="w-3.5 h-3.5" /> Outils
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                5
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-3 mb-4">
          <h2 className="section-title">Métriques clés</h2>
          <span className="text-[10px] uppercase tracking-[0.14em] text-faint">01 · Lecture</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {sections.map((s, i) => {
            const Icon = s.icon;
            return (
              <article
                key={s.title}
                className={`card-depth relative overflow-hidden lift-3d p-5 sm:p-6 anim-rise anim-rise-${(i % 4) + 1}`}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-40 blur-3xl"
                  style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.10), transparent 70%)' }}
                />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl grid place-items-center bg-bg-elev border border-border text-text shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-display text-base font-semibold text-text">{s.title}</h3>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">{s.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="module-frame anim-rise anim-rise-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title flex items-center gap-2">
            <Wrench className="w-4 h-4" /> Outils recommandés
          </h2>
          <span className="badge-muted tabular-nums">5</span>
        </div>
        <ul className="divide-y divide-border">
          {[
            { name: 'HWiNFO64', desc: 'monitoring complet (CPU, GPU, RAM, températures, voltages, fréquences).' },
            { name: 'MSI Afterburner', desc: 'overlay en jeu (FPS, frametime, GPU load) + overclocking GPU.' },
            { name: 'Cinebench R23', desc: 'benchmark CPU single/multi thread.' },
            { name: '3DMark', desc: 'benchmark GPU (Time Spy, Fire Strike, Port Royal pour le ray tracing).' },
            { name: 'CapFrameX', desc: 'analyse fine du frametime et des 1% lows.' },
          ].map(t => (
            <li key={t.name} className="py-3 flex flex-wrap items-center gap-3 text-sm">
              <span className="font-medium text-text">{t.name}</span>
              <span className="text-muted flex-1 min-w-0">— {t.desc}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
