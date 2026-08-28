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
  { slug: 'debutant',      label: 'Débutant' },
  { slug: 'intermediaire', label: 'Intermédiaire' },
  { slug: 'avance',        label: 'Avancé' },
  { slug: 'expert',        label: 'Expert' },
];

export default async function InterviewsHome() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');
  const past = await prisma.interviewAttempt.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 5 });

  return (
    <div className="space-y-6">
      <section className="module-hero">
        <div className="module-eyebrow">Simulation</div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight flex items-center gap-2 mt-2">
          <MessageSquareQuote className="w-6 h-6 text-text" /> Entretiens blancs
        </h1>
        <p className="text-muted text-[15px] mt-2 max-w-xl">Entraîne-toi comme dans un vrai entretien technique.</p>
      </section>

      <section>
        <h2 className="section-title mb-4 flex items-center gap-2"><Briefcase className="w-4 h-4 text-muted" /> Choisis un métier</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ROLES.map((r, i) => (
            <div key={r.slug} className={`module-frame lift-3d anim-rise anim-rise-${(i % 4) + 1}`}>
              <h3 className="font-display text-base font-semibold mb-1">{r.title}</h3>
              <p className="text-sm text-muted mb-4">{r.desc}</p>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map(l => (
                  <Link key={l.slug} href={`/entretiens/${r.slug}/${l.slug}`} className="btn-outline text-xs">{l.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {past.length > 0 && (
        <section className="module-frame">
          <h2 className="section-title mb-4 flex items-center gap-2"><GraduationCap className="w-4 h-4 text-muted" /> Historique</h2>
          <ul className="divide-y divide-border">
            {past.map(a => (
              <li key={a.id} className="py-3 flex justify-between text-sm">
                <span className="text-muted">{a.role} · {a.level} · {new Date(a.createdAt).toLocaleString('fr-FR')}</span>
                <span className="font-semibold tabular-nums">{a.score}/100</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
