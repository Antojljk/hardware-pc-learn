import Link from 'next/link';
import { Check } from 'lucide-react';

interface Plan {
  name: string;
  price: string;
  features: string[];
  highlight?: boolean;
}

const PLANS: Plan[] = [
  {
    name: 'FREE',
    price: '0 €',
    features: ['Accès limité aux cours', 'Quiz basiques', 'Support communauté', 'Accès public', 'Progression limitée'],
    highlight: false,
  },
  {
    name: 'ESSENTIEL',
    price: '7,99 €/mois',
    features: ['Tous les cours', 'Quiz complets', 'Certifications niveau 1', 'Accès prioritaire', 'Support forum'],
    highlight: false,
  },
  {
    name: 'PRO',
    price: '14,99 €/mois',
    features: ['Tout d\'Essentiel', 'Simulations de diagnostic', 'Mode Technicien', 'Tuteur IA dédié', 'Accès Beta outils'],
    highlight: true,
  },
  {
    name: 'ULTIMATE',
    price: '24,99 €/mois',
    features: ['Tout de Pro', 'Certifications expertes', 'Accès à vie', 'Coaching 1-on-1', 'Support VIP'],
    highlight: false,
  },
];

export function PricingCTA() {
  return (
    <section
      data-l-section="pricing-cta"
      data-section="pricing"
      className="py-24 px-6 bg-[#080B14]"
      aria-labelledby="l-pricing-cta-title"
    >
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
            Offres & tarifs
          </span>
          <h2 id="l-pricing-cta-title" className="text-4xl font-display font-bold text-white mb-4">
            Deviens un véritable technicien PC.
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Hardware PC Learn t&apos;accompagne pas à pas : apprentissage du hardware,
            montage, diagnostic et compétences avancées.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 mx-auto w-full">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl border transition-all duration-300 flex flex-col ${
                plan.highlight 
                  ? 'border-cyan-400 bg-white/5 scale-105 shadow-[0_0_30px_rgba(0,212,255,0.15)] z-10' 
                  : 'border-white/10 bg-white/5 hover:border-white/30'
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-400 text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                  Recommandé
                </span>
              )}
              <h3 className="text-white font-display font-bold text-xl mb-2">{plan.name}</h3>
              <div className="text-3xl font-display font-bold text-white mb-6">{plan.price}</div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-muted">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link 
                href="/offres" 
                className={`block w-full py-3 text-center rounded-lg font-medium transition-all ${
                  plan.highlight 
                    ? 'bg-cyan-400 text-black hover:bg-cyan-300' 
                    : 'border border-white/20 text-white hover:bg-white/5'
                }`}
              >
                Commencer
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/offres" className="inline-flex items-center gap-2 text-sm text-muted hover:text-white transition-colors">
            Découvrir toutes les offres
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
