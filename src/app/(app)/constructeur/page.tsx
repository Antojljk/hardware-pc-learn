import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { PcCase, Sparkles, Wrench, Layers, Cpu, ChevronRight } from 'lucide-react';
import { BuildClient } from './BuildClient';
import Link from 'next/link';
import { canAccess } from '@/lib/plans';
import { LockedState } from '@/components/LockedState';

export const dynamic = 'force-dynamic';

export default async function ConstructeurPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  // Constructeur PC complet = ESSENTIEL+.
  if (!canAccess(user.plan, 'builder_full')) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">Constructeur PC</h1>
        <LockedState
          feature="Constructeur PC"
          required="ESSENTIEL"
          current={user.plan}
          description="L'atelier de montage est réservé à l'offre Essentiel et supérieures : vérifie la compatibilité de tes composants, sauvegarde tes builds et obtiens un score."
        />
      </div>
    );
  }

  const components = await prisma.component.findMany();
  const componentsLite = components.map(c => ({
    id: c.id, type: c.type, brand: c.brand, model: c.model, price: c.price,
    specs: typeof c.specs === 'string' ? safeParse(c.specs) : c.specs,
    category: c.category || undefined,
  }));

  const totalRefs = componentsLite.length;
  const brandsCount = new Set(componentsLite.map(c => c.brand)).size;

  return (
    <div className="space-y-6">
      {/* HERO */}
      <section className="module-hero">
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="module-eyebrow flex items-center gap-2">
              <PcCase className="w-3.5 h-3.5" /> Atelier
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              Construis ta machine
            </h1>
            <p className="text-muted text-[15px] max-w-xl leading-relaxed">
              Sélectionne tes composants. La compatibilité est vérifiée en temps réel.
              Les prix sont synchronisés depuis LDLC, TopAchat et Coolpc.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto sm:min-w-[360px]">
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Layers className="w-3.5 h-3.5" /> Références
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {totalRefs}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Cpu className="w-3.5 h-3.5" /> Marques
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {brandsCount}
              </div>
            </div>
            <Link
              href="/constructeur/defis"
              className="rounded-2xl border border-text/30 bg-text/8 backdrop-blur p-3 group hover:bg-text/12 transition-colors"
            >
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Sparkles className="w-3.5 h-3.5" /> Défis
              </div>
              <div className="mt-1.5 font-display text-sm font-semibold text-text inline-flex items-center gap-1.5">
                Lancer
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      <BuildClient components={componentsLite} />

      {/* COMMENT ÇA MARCHE */}
      <section className="module-frame anim-rise anim-rise-3">
        <div className="flex items-center gap-2 mb-5">
          <Wrench className="w-4 h-4 text-muted" />
          <h2 className="section-title">Comment ça marche</h2>
        </div>
        <ol className="grid sm:grid-cols-2 gap-3 text-sm">
          {[
            {
              t: 'Choisis tes composants',
              d: 'CPU, GPU, RAM, carte mère, SSD, alimentation, boîtier, refroidissement.',
            },
            {
              t: 'Vérification en direct',
              d: 'Socket, format, dimensions, puissance, connecteurs, M.2 — tout est contrôlé.',
            },
            {
              t: 'Sauvegarde & scoring',
              d: 'Une fois compatible, sauvegarde ta build et reçois un score (perf / valeur / évolutivité).',
            },
            {
              t: 'Mode défis',
              d: (
                <>
                  Relève les{' '}
                  <Link href="/constructeur/defis" className="text-text hover:underline">
                    défis
                  </Link>{' '}
                  avec un budget imposé.
                </>
              ),
            },
          ].map((step, i) => (
            <li
              key={i}
              className="rounded-2xl border border-border bg-bg-elev/40 p-4 flex items-start gap-3"
            >
              <span className="font-display text-xs tabular-nums w-7 h-7 rounded-full bg-text/8 border border-border grid place-items-center text-text shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <div className="font-medium text-text">{step.t}</div>
                <div className="text-muted mt-1 leading-relaxed">{step.d}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function safeParse(s: string) {
  try { return JSON.parse(s); } catch { return {}; }
}
