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
      style={{ padding: '96px 24px', background: '#080B14' }} 
      aria-labelledby="l-pricing-cta-title"
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span style={{ 
            display: 'inline-block', 
            padding: '4px 12px', 
            borderRadius: '9999px', 
            background: 'rgba(6, 182, 212, 0.1)', 
            color: '#22d3ee', 
            fontSize: '12px', 
            fontWeight: 'bold', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em', 
            marginBottom: '16px' 
          }}>
            Offres & tarifs
          </span>
          <h2 id="l-pricing-cta-title" style={{ 
            fontSize: '36px', 
            fontWeight: 'bold', 
            color: 'white', 
            marginBottom: '16px',
            fontFamily: 'var(--font-display, sans-serif)'
          }}>
            Deviens un véritable technicien PC.
          </h2>
           <p style={{ color: '#9ca3af', maxWidth: '672px', margin: '0 auto' }}>
             Apprends à ton rythme. Progresse jusqu&apos;au niveau technicien.
           </p>
        </header>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '24px', 
          width: '100%',
          marginBottom: '48px'
        }}>
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              style={{
                position: 'relative',
                padding: '32px',
                borderRadius: '16px',
                border: plan.highlight ? '1px solid #22d3ee' : '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                transform: plan.highlight ? 'scale(1.05)' : 'scale(1)',
                boxShadow: plan.highlight ? '0 0 30px rgba(0,212,255,0.15)' : 'none',
                zIndex: plan.highlight ? 10 : 1
              }}
            >
              {plan.highlight && (
                <span style={{ 
                  position: 'absolute', 
                  top: '-12px', 
                  left: '50%', 
                  transform: 'translateX(-50%)', 
                  background: '#22d3ee', 
                  color: 'black', 
                  fontSize: '10px', 
                  fontWeight: 'bold', 
                  padding: '4px 12px', 
                  borderRadius: '9999px', 
                  textTransform: 'uppercase' 
                }}>
                  Recommandé
                </span>
              )}
              <h3 style={{ color: 'white', fontWeight: 'bold', fontSize: '20px', marginBottom: '8px', fontFamily: 'var(--font-display, sans-serif)' }}>{plan.name}</h3>
              <div style={{ fontSize: '30px', fontWeight: 'bold', color: 'white', marginBottom: '24px', fontFamily: 'var(--font-display, sans-serif)' }}>{plan.price}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', flex: 1 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'start', gap: '12px', fontSize: '14px', color: '#9ca3af', marginBottom: '12px' }}>
                    <Check style={{ width: '16px', height: '16px', color: '#22d3ee', marginTop: '2px', flexShrink: 0 }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link 
                href="/offres" 
                style={{ 
                  display: 'block', 
                  width: '100%', 
                  padding: '12px 0', 
                  textAlign: 'center', 
                  borderRadius: '8px', 
                  fontWeight: '500', 
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  background: plan.highlight ? '#22d3ee' : 'transparent',
                  color: plan.highlight ? 'black' : 'white',
                  border: plan.highlight ? 'none' : '1px solid rgba(255,255,255,0.2)',
                }}
              >
                Commencer
              </Link>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/offres" style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '14px', 
            color: '#9ca3af', 
            textDecoration: 'none', 
            transition: 'color 0.3s ease' 
          }}>
            Découvrir toutes les offres
            <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
