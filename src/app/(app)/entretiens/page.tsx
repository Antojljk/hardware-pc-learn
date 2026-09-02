import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { MessageSquareQuote, Briefcase, ChevronRight, Activity, History, Wrench, Settings, Users, BarChart3, Headphones, ShoppingBag, Building2 } from 'lucide-react';
import { canAccess } from '@/lib/plans';
import { LockedState } from '@/components/LockedState';

const ROLES = [
  { slug: 'monteur',    title: 'Monteur PC',           desc: 'Capacité à assembler et tester un PC.',            Icon: Wrench },
  { slug: 'technicien', title: 'Technicien hardware',  desc: 'Diagnostic, réparation, stabilité.',              Icon: Settings },
  { slug: 'support',    title: 'Technicien support',   desc: 'Relation client + résolution technique.',         Icon: Headphones },
  { slug: 'vendeur',    title: 'Vendeur hardware',     desc: 'Conseil client, configurations, vente.',          Icon: ShoppingBag },
  { slug: 'stage',      title: 'Stage entreprise PC',  desc: "Simulation d'entretien d'embauche.",              Icon: Building2 },
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

  // Garde-fou serveur : les entretiens sont ESSENTIEL+.
  if (!canAccess(user.plan, 'interviews_basic', user.id)) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">Entretiens blancs</h1>
        <LockedState
          feature="Simulations d'entretiens"
          required="ESSENTIEL"
          current={user.plan}
          description="Les entretiens blancs sont réservés à l'offre Essentiel et supérieures. Débloque 5 métiers et 4 niveaux de difficulté."
        />
      </div>
    );
  }

  const past = await prisma.interviewAttempt.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 5 });

  const bestScore = past.length ? Math.max(...past.map(p => p.score)) : null;
  const avgScore = past.length ? Math.round(past.reduce((acc, p) => acc + p.score, 0) / past.length) : null;

  return (
    <div className="space-y-6">
      {/* HERO */}
      <section className="module-hero">
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="module-eyebrow flex items-center gap-2">
              <MessageSquareQuote className="w-3.5 h-3.5" /> Simulation
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              Entretiens blancs
            </h1>
            <p className="text-muted text-[15px] max-w-xl leading-relaxed">
              Entraîne-toi comme dans un vrai entretien technique : 5 questions écrites,
              évaluation par mots-clés, feedback et correction à la fin.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto sm:min-w-[360px]">
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Briefcase className="w-3.5 h-3.5" /> Métiers
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {ROLES.length}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Activity className="w-3.5 h-3.5" /> Passés
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {past.length}
              </div>
            </div>
            <div className="rounded-2xl border border-text/30 bg-text/8 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <BarChart3 className="w-3.5 h-3.5" /> Meilleur
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {bestScore ?? '—'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title flex items-center gap-2">
            <Users className="w-4 h-4 text-muted" /> Choisis un métier
          </h2>
          <span className="badge-muted">{LEVELS.length} niveaux</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ROLES.map((r, i) => {
            const Icon = r.Icon;
            return (
              <div
                key={r.slug}
                className={`card-depth relative overflow-hidden p-5 sm:p-6 anim-rise anim-rise-${(i % 4) + 1}`}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-40 blur-3xl"
                  style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.10), transparent 70%)' }}
                />
                <div className="relative">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl grid place-items-center bg-bg-elev border border-border text-text shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="module-eyebrow mb-0.5">Métier</div>
                      <h3 className="font-display text-base font-semibold leading-tight">{r.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-muted leading-relaxed mb-5">{r.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {LEVELS.map(l => (
                      <Link
                        key={l.slug}
                        href={`/entretiens/${r.slug}/${l.slug}`}
                        className="group inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-bg-elev border border-border text-xs text-text-soft hover:text-text hover:border-text/40 transition-all"
                      >
                        {l.label}
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {past.length > 0 && (
        <section className="module-frame anim-rise anim-rise-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <History className="w-4 h-4" /> Historique
            </h2>
            <div className="flex items-center gap-2">
              {avgScore !== null && (
                <span className="badge-muted">Moy. {avgScore}/100</span>
              )}
              <span className="badge-muted tabular-nums">{past.length}</span>
            </div>
          </div>
          <ul className="divide-y divide-border">
            {past.map(a => (
              <li key={a.id} className="py-3 flex flex-wrap items-center gap-3 text-sm">
                <div className="flex-1 min-w-0">
                  <div className="font-medium capitalize">{a.role} · <span className="text-muted">{a.level}</span></div>
                  <div className="text-xs text-muted tabular-nums">{new Date(a.createdAt).toLocaleString('fr-FR')}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="hidden sm:block w-28 h-1.5 rounded-full bg-bg-elev overflow-hidden">
                    <div className="h-full bg-text" style={{ width: `${a.score}%` }} />
                  </div>
                  <span className="font-semibold tabular-nums text-text w-12 text-right">
                    {a.score}/100
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
