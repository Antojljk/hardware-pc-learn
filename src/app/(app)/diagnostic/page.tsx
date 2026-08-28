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

  return (
    <div className="space-y-6">
      <section className="module-hero">
        <div className="module-eyebrow">Atelier</div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight flex items-center gap-2 mt-2">
          <Stethoscope className="w-6 h-6 text-text" /> Laboratoire de diagnostic
        </h1>
        <p className="text-muted text-[15px] mt-2 max-w-xl">Résous des pannes PC réelles en exerçant ton raisonnement.</p>
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
                {symptoms.slice(0, 3).map((sym, i) => <li key={i} className="flex items-start gap-2"><span className="text-muted">•</span>{sym}</li>)}
              </ul>
              <div className="mt-4 inline-flex items-center gap-1.5 text-sm text-text">Diagnostiquer <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" /></div>
            </Link>
          );
        })}
      </div>

      {attempts.length > 0 && (
        <section className="module-frame">
          <h2 className="section-title mb-3 flex items-center gap-2"><Wrench className="w-4 h-4" /> Historique</h2>
          <ul className="divide-y divide-border">
            {attempts.map(a => (
              <li key={a.id} className="py-3 flex justify-between text-sm">
                <span className="text-muted">{scenarios.find(s => s.id === a.scenarioId)?.title || 'Scénario'}</span>
                <span className="font-semibold tabular-nums">{a.score}/100</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
