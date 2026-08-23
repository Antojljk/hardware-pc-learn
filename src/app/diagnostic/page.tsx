import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Stethoscope, Wrench, ArrowRight } from 'lucide-react';

export default async function DiagnosticHome() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  const scenarios = await prisma.diagnosticScenario.findMany();
  const attempts = await prisma.diagnosticAttempt.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 5 });

  const levelColor: Record<string, string> = {
    debutant: 'border-success/30 text-success',
    intermediaire: 'border-brand-blue/30 text-brand-blue',
    avance: 'border-brand-violet/30 text-brand-violet',
    expert: 'border-warning/30 text-warning',
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Stethoscope className="w-5 h-5 text-brand-blue" /> Laboratoire de diagnostic</h1>
        <p className="text-text-soft text-sm">Résous des pannes PC réelles en exerçant ton raisonnement.</p>
      </header>

      <div className="grid sm:grid-cols-2 gap-3">
        {scenarios.map(s => {
          let symptoms: string[] = [];
          try { symptoms = JSON.parse(s.symptoms); } catch { /* ignore */ }
          return (
            <Link key={s.slug} href={`/diagnostic/${s.slug}`} className="card card-hover p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h2 className="font-semibold">{s.title}</h2>
                <span className={`badge bg-bg-elev border ${levelColor[s.difficulty]}`}>{s.difficulty}</span>
              </div>
              <div className="text-xs text-text-mute mb-2">{s.category}</div>
              <ul className="text-xs text-text-soft space-y-0.5 line-clamp-3">
                {symptoms.slice(0, 3).map((sym, i) => <li key={i}>• {sym}</li>)}
              </ul>
              <div className="mt-3 inline-flex items-center gap-1 text-sm text-brand-blue">Diagnostiquer <ArrowRight className="w-3.5 h-3.5" /></div>
            </Link>
          );
        })}
      </div>

      {attempts.length > 0 && (
        <section className="card p-5">
          <h2 className="section-title mb-3 flex items-center gap-2"><Wrench className="w-4 h-4" /> Historique</h2>
          <ul className="divide-y divide-border">
            {attempts.map(a => (
              <li key={a.id} className="py-2 flex justify-between text-sm">
                <span>{scenarios.find(s => s.id === a.scenarioId)?.title || 'Scénario'}</span>
                <span className="font-bold tabular-nums">{a.score}/100</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
