import Link from 'next/link';
import { Check } from 'lucide-react';

const PLANS = [
  {
    name: 'FREE',
    price: '0€',
    features: ['Accès cours base', 'Quizz débutants', 'Support communauté'],
    recommended: false,
  },
  {
    name: 'ESSENTIEL',
    price: '9€/mois',
    features: ['Tous les cours', 'Simulations guidées', 'Certifications niveau 1'],
    recommended: false,
  },
  {
    name: 'PRO',
    price: '19€/mois',
    features: ['Accès complet', 'Mode Technicien', 'Analyses de benchmarks', 'Priorité support'],
    recommended: true,
  },
  {
    name: 'ULTIMATE',
    price: '49€/mois',
    features: ['Accès à vie', 'Coaching 1-on-1', 'Accès bêta outils', 'Support VIP'],
    recommended: false,
  },
];

export function PricingSection() {
  return (
    <section className="py-24 px-6 bg-[#080B14]">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-display text-white font-bold mb-4">Choisissez votre parcours</h2>
        <p className="text-muted max-w-2xl mx-auto">De curieux à expert, nous avons un plan adapté à vos ambitions.</p>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLANS.map((plan) => (
          <div 
            key={plan.name} 
            className={`relative p-8 rounded-lg border transition-all duration-300 ${
              plan.recommended 
                ? 'border-[#00D4FF] bg-[#0F1523] shadow-[0_0_20px_rgba(0,212,255,0.1)]' 
                : 'border-white/10 bg-[#0F1523] hover:border-[#00D4FF]'
            }`}
          >
            {plan.recommended && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00D4FF] text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Recommandé
              </span>
            )}
            <h3 className="text-white font-display font-bold text-xl mb-2">{plan.name}</h3>
            <div className="text-4xl font-display font-bold text-white mb-6">{plan.price}</div>
            <ul className="space-y-4 mb-8 text-sm text-muted">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#00D4FF] shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link 
              href="/offres" 
              className={`block w-full py-3 text-center rounded-md font-medium transition-all ${
                plan.recommended 
                  ? 'bg-[#00D4FF] text-black hover:bg-[#00D4FF]/90' 
                  : 'border border-white/20 text-white hover:bg-white/5'
              }`}
            >
              Commencer
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
