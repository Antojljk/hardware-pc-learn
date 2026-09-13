'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Hammer, Wrench, AlertTriangle, Activity, Layers, Wrench as Tool } from 'lucide-react';
import { TechnicienChat } from '@/components/technicien/TechnicienChat';
import { DiagnosticScenario } from '@prisma/client';

export function TechnicienModeClient({ 
  scenarios, difficultyCount 
}: { 
  scenarios: DiagnosticScenario[]; difficultyCount: { facile: number; moyen: number; difficile: number } 
}) {
  const [selectedScenario, setSelectedScenario] = useState<DiagnosticScenario | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [pendingScenario, setPendingScenario] = useState<DiagnosticScenario | null>(null);
  const router = useRouter();

  const handleSimulationClick = (s: DiagnosticScenario) => {
    setPendingScenario(s);
    setShowWarning(true);
  };

  const confirmSimulation = () => {
    setSelectedScenario(pendingScenario);
    setShowWarning(false);
    setPendingScenario(null);
  };

  const cancelSimulation = () => {
    setShowWarning(false);
    setPendingScenario(null);
    router.push('/diagnostic');
  };

  return (
    <div className="space-y-6">
      <section className="module-hero">
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="module-eyebrow flex items-center gap-2">
              <Tool className="w-3.5 h-3.5" /> Atelier
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight flex items-center gap-3">
              <Hammer className="w-8 h-8 sm:w-10 sm:h-10 text-text" />
              Mode technicien
            </h1>
            <p className="text-muted text-[15px] max-w-xl leading-relaxed">
              Diagnostic sans guidage : observe, raisonne, propose ta procédure.
              Solution détaillée affichée après validation.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto sm:min-w-[360px]">
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Wrench className="w-3.5 h-3.5" /> Scénarios
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {scenarios.length}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Activity className="w-3.5 h-3.5" /> Facile
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {difficultyCount.facile}
              </div>
            </div>
            <div className="rounded-2xl border border-text/30 bg-text/8 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <AlertTriangle className="w-3.5 h-3.5" /> Difficile
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {difficultyCount.difficile}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="info-banner text-sm anim-rise anim-rise-1">
        <Wrench className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
        <span>
          <strong className="text-text">Mode avancé :</strong> aucune aide affichée pendant la procédure.
          À la fin, compare ton diagnostic à la cause racine et à la solution détaillée.
        </span>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title flex items-center gap-2">
            <Layers className="w-4 h-4 text-muted" /> Catalogue de pannes
          </h2>
          <span className="badge-muted">{scenarios.length} scénarios</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {scenarios.map((s, i) => {
            let symptoms: string[] = [];
            try { symptoms = JSON.parse(s.symptoms); } catch { /* ignore */ }
            return (
              <div
                key={s.slug}
                className={`card-depth relative overflow-hidden lift-3d group p-5 sm:p-6 anim-rise anim-rise-${(i % 4) + 1}`}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-50 blur-3xl"
                  style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.10), transparent 70%)' }}
                />
                <div className="relative">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="space-y-1.5 min-w-0">
                      <div className="module-eyebrow">{s.category}</div>
                      <h2 className="font-display text-lg sm:text-xl font-semibold leading-tight truncate">
                        {s.title}
                      </h2>
                    </div>
                    <span className="badge-muted capitalize shrink-0">{s.difficulty}</span>
                  </div>

                  <ul className="text-xs text-text-soft space-y-1.5 line-clamp-3 my-4">
                    {symptoms.slice(0, 3).map((sym, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-text/60 mt-1.5 shrink-0" />
                        <span>{sym}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-[10px] text-muted uppercase tracking-wider">
                      {symptoms.length} symptôme{symptoms.length > 1 ? 's' : ''}
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleSimulationClick(s)}
                        className="text-sm text-accent hover:underline font-medium"
                      >
                        Simulation Client
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {selectedScenario && (
        <TechnicienChat 
          scenario={selectedScenario} 
          onClose={() => setSelectedScenario(null)} 
          onComplete={(score) => {
            alert(`Diagnostic terminé ! Votre score de performance est de ${score}/100`);
            setSelectedScenario(null);
          }} 
        />
      )}

      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm">
          <div className="bg-bg-elev border border-border p-6 rounded-3xl max-w-md w-full shadow-2xl space-y-4 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <p className="text-text font-medium leading-relaxed">
              ⚠️ Ce mode est réservé aux utilisateurs ayant déjà fait quelques diagnostics guidés. Es-tu prêt ?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                onClick={cancelSimulation}
                className="flex-1 px-4 py-2 text-sm font-medium text-muted hover:text-text transition-colors"
              >
                Retour aux diagnostics
              </button>
              <button 
                onClick={confirmSimulation}
                className="flex-1 px-4 py-2 text-sm font-medium bg-accent text-bg rounded-xl hover:bg-accent/90 transition-colors"
              >
                Oui, je me lance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
