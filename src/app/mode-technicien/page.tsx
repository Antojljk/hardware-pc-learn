import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Hammer, ArrowRight } from 'lucide-react';

export const metadata = { title: 'Mode technicien — HardwarePC' };

export default async function TechnicienModePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  const scenarios = await prisma.diagnosticScenario.findMany({ orderBy: { difficulty: 'asc' } });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Hammer className="w-5 h-5 text-brand-blue" /> Mode technicien</h1>
        <p className="text-text-soft text-sm">Diagnostic sans guidage : observe, raisonne, propose ta procédure. Solution détaillée affichée après validation.</p>
      </header>

      <section className="card p-4 border-warning/30 bg-warning/5 text-sm text-text-soft">
        🛠️ Mode avancé : aucune aide affichée pendant la procédure. À la fin, compare ton diagnostic à la cause racine et à la solution détaillée.
      </section>

      <section className="grid sm:grid-cols-2 gap-3">
        {scenarios.map(s => {
          let symptoms: string[] = [];
          try { symptoms = JSON.parse(s.symptoms); } catch { /* ignore */ }
          return (
            <Link key={s.slug} href={`/diagnostic/${s.slug}`} className="card card-hover p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h2 className="font-semibold">{s.title}</h2>
                <span className="badge bg-bg-elev border-border">{s.difficulty}</span>
              </div>
              <div className="text-xs text-text-mute mb-2">{s.category}</div>
              <ul className="text-xs text-text-soft space-y-0.5">
                {symptoms.slice(0, 3).map((sym, i) => <li key={i}>• {sym}</li>)}
              </ul>
              <div className="mt-3 inline-flex items-center gap-1 text-sm text-brand-blue">Diagnostiquer <ArrowRight className="w-3.5 h-3.5" /></div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
