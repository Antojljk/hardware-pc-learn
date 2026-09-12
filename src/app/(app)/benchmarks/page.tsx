import { BarChart3 } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { canAccess } from '@/lib/plans';
import { LockedState } from '@/components/LockedState';
import ComparisonAvsB from './components/ComparisonAvsB';
import FrametimeAnalyzer from './components/FrametimeAnalyzer';
import BottleneckDetector from './components/BottleneckDetector';
import LowOneAnalysis from './components/LowOneAnalysis';

export const metadata = { title: 'Benchmarks — HardwarePC' };
export const dynamic = 'force-dynamic';

export default async function BenchmarksPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  if (!canAccess(user.plan, 'monitoring_extended', user.id)) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">Benchmarks</h1>
        <LockedState
          feature="Benchmarks & Analyse"
          required="PRO"
          current={user.plan}
          description="L&apos;analyse des benchmarks est réservée à l&apos;offre Pro et supérieures : apprends à interpréter les chiffres pour optimiser tes performances."
        />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <section className="module-hero">
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="module-eyebrow flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5" /> Laboratoire de Performance
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              Analyse de Benchmarks
            </h1>
            <p className="text-muted text-[15px] max-w-xl leading-relaxed">
              Ne vous contentez pas de lire des chiffres. Apprenez à analyser les performances réelles d&apos;un système à travers des exercices pratiques.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6 anim-rise anim-rise-1">
        <div className="flex items-end justify-between gap-3 mb-4">
          <div>
            <h2 className="section-title">Comparatif Matériel</h2>
            <p className="text-xs text-muted">Comparez deux composants et choisissez le meilleur selon l&apos;usage.</p>
          </div>
          <span className="text-[10px] uppercase tracking-[0.14em] text-faint">01 · Comparaison</span>
        </div>
        <div className="module-frame">
          <ComparisonAvsB />
        </div>
      </section>

      <section className="space-y-6 anim-rise anim-rise-2">
        <div className="flex items-end justify-between gap-3 mb-4">
          <div>
            <h2 className="section-title">Analyseur de Frametime</h2>
            <p className="text-xs text-muted">Identifiez les saccades (stutters) via le temps de rendu des images.</p>
          </div>
          <span className="text-[10px] uppercase tracking-[0.14em] text-faint">02 · Fluidité</span>
        </div>
        <div className="module-frame">
          <FrametimeAnalyzer />
        </div>
      </section>

      <section className="space-y-6 anim-rise anim-rise-3">
        <div className="flex items-end justify-between gap-3 mb-4">
          <div>
            <h2 className="section-title">Détecteur de Bottleneck</h2>
            <p className="text-xs text-muted">Analysez les charges CPU/GPU pour trouver le facteur limitant.</p>
          </div>
          <span className="text-[10px] uppercase tracking-[0.14em] text-faint">03 · Diagnostic</span>
        </div>
        <div className="module-frame">
          <BottleneckDetector />
        </div>
      </section>

      <section className="space-y-6 anim-rise anim-rise-4">
        <div className="flex items-end justify-between gap-3 mb-4">
          <div>
            <h2 className="section-title">Analyse du 1% Low</h2>
            <p className="text-xs text-muted">Interprétez la différence entre moyenne et chutes de FPS.</p>
          </div>
          <span className="text-[10px] uppercase tracking-[0.14em] text-faint">04 · Stabilité</span>
        </div>
        <div className="module-frame">
          <LowOneAnalysis />
        </div>
      </section>
    </div>
  );
}
