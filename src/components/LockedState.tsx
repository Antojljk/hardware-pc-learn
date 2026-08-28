// =============================================================================
// État verrouillé — affiché quand une fonctionnalité nécessite une offre
// supérieure. Pas d'emoji, design noir/blanc/gris aligné avec le reste.
// =============================================================================

import Link from 'next/link';
import { Lock, ArrowRight, Crown } from 'lucide-react';
import type { Plan as PrismaPlan } from '@prisma/client';
import { planLabel, type PlanKey } from '@/lib/plans';

type Props = {
  feature: string;
  required: PlanKey;
  current: PrismaPlan | null | undefined;
  /** URL où l'utilisateur peut comparer / changer d'offre. */
  upgradeHref?: string;
  /** Description courte de la fonctionnalité. */
  description?: string;
};

export function LockedState({ feature, required, current, upgradeHref = '/vente', description }: Props) {
  return (
    <section className="module-frame anim-rise">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className="w-14 h-14 rounded-2xl grid place-items-center bg-bg-elev border border-border text-text shrink-0">
          <Lock className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="module-eyebrow">Accès restreint</div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-text">
            {feature}
          </h2>
          <p className="text-muted text-sm leading-relaxed">
            {description ??
              `Cette fonctionnalité est réservée à l'offre ${planLabel(required)} ou supérieure.`}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="badge-muted inline-flex items-center gap-1.5">
              <Crown className="w-3 h-3" />
              Offre actuelle : {planLabel(current ?? 'FREE')}
            </span>
            <span className="badge-accent inline-flex items-center gap-1.5">
              <Crown className="w-3 h-3" />
              Requis : {planLabel(required)} ou plus
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Link href={upgradeHref} className="btn-primary">
            Voir les offres
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
