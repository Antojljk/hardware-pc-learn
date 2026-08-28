import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Hammer, ArrowRight, Wrench } from 'lucide-react';

export const metadata = { title: 'Mode technicien — HardwarePC' };

export default async function TechnicienModePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  const scenarios = await prisma.diagnosticScenario.findMany({ orderBy: { difficulty: 'asc' } });

  return (
    <div className="space-y-6">
      <section className="module-hero">
        <div className="module-eyebrow">Atelier</div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight flex items-center gap-2 mt-2">
          <Hammer className="w-6 h-6 text-text" /> Mode technicien
        </h1>
        <p className="text-muted text-[15px] mt-2 max-w-xl">Diagnostic sans guidage : observe, raisonne, propose ta procédure. Solution détaillée affichée après validation.</p>
      </section>

      <section className="info-banner text-sm anim-rise anim-rise-1">
        <Wrench className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
        <span>Mode avancé : aucune aide affichée pendant la procédure. À la fin, compare ton diagnostic à la cause racine et à la solution détaillée.</span>
      </section>

      <div className="grid sm:grid-cols-2 gap-3">
        {scenarios.map((s, i) => {
          let symptoms: string[] = [];
          try { symptoms = JSON.parse(s.symptoms); } catch { /* ignore */ }
          return (
            <Link
              key={s.slug}
              href={`/diagnostic/${s.slug}`}
              className={`module-frame lift-3d block group anim-rise anim-rise-${(i % 4) + 1}`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="font-display text-base font-semibold">{s.title}</h2>
                <span className="badge-muted capitalize">{s.difficulty}</span>
              </div>
              <div className="text-xs text-muted mb-3 uppercase tracking-wider">{s.category}</div>
              <ul className="text-xs text-text-soft space-y-1 line-clamp-3">
                {symptoms.slice(0, 3).map((sym, idx) => <li key={idx} className="flex items-start gap-2"><span className="text-muted">•</span>{sym}</li>)}
              </ul>
              <div className="mt-4 inline-flex items-center gap-1.5 text-sm text-text">Diagnostiquer <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" /></div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
