import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { MessageSquareQuote, Briefcase, GraduationCap } from 'lucide-react';

const ROLES = [
  { slug: 'monteur',    title: 'Monteur PC',           desc: 'Capacité à assembler et tester un PC.' },
  { slug: 'technicien', title: 'Technicien hardware',  desc: 'Diagnostic, réparation, stabilité.' },
  { slug: 'support',    title: 'Technicien support',   desc: 'Relation client + résolution technique.' },
  { slug: 'vendeur',    title: 'Vendeur hardware',     desc: 'Conseil client, configurations, vente.' },
  { slug: 'stage',      title: 'Stage entreprise PC',  desc: 'Simulation d\'entretien d\'embauche.' },
];
const LEVELS = [
  { slug: 'debutant',      label: 'Débutant',      color: 'border-success/30 text-success' },
  { slug: 'intermediaire', label: 'Intermédiaire', color: 'border-brand-blue/30 text-brand-blue' },
  { slug: 'avance',        label: 'Avancé',        color: 'border-brand-violet/30 text-brand-violet' },
  { slug: 'expert',        label: 'Expert',        color: 'border-warning/30 text-warning' },
];

export default async function InterviewsHome() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');
  const past = await prisma.interviewAttempt.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 5 });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold flex items-center gap-2"><MessageSquareQuote className="w-5 h-5 text-brand-blue" /> Entretiens blancs</h1>
        <p className="text-text-soft text-sm">Entraîne-toi comme dans un vrai entretien technique.</p>
      </header>

      <section>
        <h2 className="section-title mb-3 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Choisis un métier</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ROLES.map(r => (
            <div key={r.slug} className="card p-5">
              <h3 className="font-semibold mb-1">{r.title}</h3>
              <p className="text-sm text-text-soft mb-3">{r.desc}</p>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map(l => (
                  <Link key={l.slug} href={`/entretiens/${r.slug}/${l.slug}`} className={`btn-outline text-xs border ${l.color}`}>{l.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {past.length > 0 && (
        <section className="card p-5">
          <h2 className="section-title mb-3 flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Historique</h2>
          <ul className="divide-y divide-border">
            {past.map(a => (
              <li key={a.id} className="py-2 flex justify-between text-sm">
                <span>{a.role} · {a.level} · {new Date(a.createdAt).toLocaleString('fr-FR')}</span>
                <span className="font-bold tabular-nums">{a.score}/100</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
