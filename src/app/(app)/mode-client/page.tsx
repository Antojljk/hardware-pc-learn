import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { ShieldCheck, MessageCircle, Users, Briefcase, Sparkles } from 'lucide-react';
import { ClientSimulator } from './ClientSimulator';

export const metadata = { title: 'Mode client — HardwarePC' };

export default async function ClientModePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* HERO */}
      <section className="module-hero">
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="module-eyebrow flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5" /> Simulation
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-text" />
              Mode client
            </h1>
            <p className="text-muted text-[15px] max-w-xl leading-relaxed">
              Dialogue avec un client mécontent ou inquiet. Qualité de la communication
              + technique évaluées en temps réel.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto sm:min-w-[360px]">
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <MessageCircle className="w-3.5 h-3.5" /> Scénarios
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                3
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Users className="w-3.5 h-3.5" /> Rôle
              </div>
              <div className="mt-1.5 font-display text-base sm:text-lg font-semibold text-text">
                Support
              </div>
            </div>
            <div className="rounded-2xl border border-text/30 bg-text/8 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Sparkles className="w-3.5 h-3.5" /> Évaluation
              </div>
              <div className="mt-1.5 font-display text-base sm:text-lg font-semibold text-text">
                Mixte
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="anim-rise anim-rise-1">
        <ClientSimulator />
      </section>
    </div>
  );
}
