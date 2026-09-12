import { Activity } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { canAccess } from '@/lib/plans';
import { LockedState } from '@/components/LockedState';
import MonitoringSimulator from './components/MonitoringSimulator';
import FaultFinder from './components/FaultFinder';
import TempCurveAnalysis from './components/TempCurveAnalysis';

export const metadata = { title: 'Monitoring — HardwarePC' };
export const dynamic = 'force-dynamic';

export default async function MonitoringPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  if (!canAccess(user.plan, 'monitoring_extended', user.id)) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">Monitoring PC</h1>
        <LockedState
          feature="Monitoring avancé"
          required="PRO"
          current={user.plan}
          description="Le monitoring avancé est réservé à l'offre Pro et supérieures : apprends à surveiller tes capteurs et repérer les signes de fatigue de ton matériel."
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
              <Activity className="w-3.5 h-3.5" /> Apprentissage Interactif
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              Monitoring PC
            </h1>
            <p className="text-muted text-[15px] max-w-xl leading-relaxed">
              Passez de la théorie à la pratique. Simulez des scénarios, analysez des données et apprenez à diagnostiquer les pannes matérielles.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6 anim-rise anim-rise-1">
        <div className="flex items-end justify-between gap-3 mb-4">
          <div>
            <h2 className="section-title">Simulateur de Capteurs</h2>
            <p className="text-xs text-muted">Observez comment les métriques évoluent selon la charge.</p>
          </div>
          <span className="text-[10px] uppercase tracking-[0.14em] text-faint">01 · Simulation</span>
        </div>
        <div className="module-frame">
          <MonitoringSimulator />
        </div>
      </section>

      <section className="space-y-6 anim-rise anim-rise-2">
        <div className="flex items-end justify-between gap-3 mb-4">
          <div>
            <h2 className="section-title">Diagnostic : Trouve la panne</h2>
            <p className="text-xs text-muted">Analysez les chiffres et identifiez le problème matériel.</p>
          </div>
          <span className="text-[10px] uppercase tracking-[0.14em] text-faint">02 · Exercice</span>
        </div>
        <div className="module-frame">
          <FaultFinder />
        </div>
      </section>

      <section className="space-y-6 anim-rise anim-rise-3">
        <div className="flex items-end justify-between gap-3 mb-4">
          <div>
            <h2 className="section-title">Analyse de Courbe</h2>
            <p className="text-xs text-muted">Interprétez le comportement thermique d&apos;un CPU.</p>
          </div>
          <span className="text-[10px] uppercase tracking-[0.14em] text-faint">03 · Analyse</span>
        </div>
        <div className="module-frame">
          <TempCurveAnalysis />
        </div>
      </section>
    </div>
  );
}
