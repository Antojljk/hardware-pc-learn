'use client';
import Link from 'next/link';
import { Check } from 'lucide-react';

interface Plan {
  name: string;
  price: string;
  hint: string;
  features: string[];
  highlight?: boolean;
  tag?: string;
}

const PLANS: Plan[] = [
  {
    name: 'FREE',
    price: '0 €',
    hint: 'Pour débuter',
    features: ['Accès limité aux cours', 'Quiz basiques', 'Support communauté'],
  },
  {
    name: 'ESSENTIEL',
    price: '7,99 €',
    hint: 'par mois',
    features: ['Tous les cours', 'Quiz complets', 'Certifications niveau 1'],
  },
  {
    name: 'PRO',
    price: '14,99 €',
    hint: 'par mois',
    features: ['Simulations diagnostic', 'Mode Technicien', 'Tuteur IA dédié'],
    highlight: true,
    tag: 'Recommandé',
  },
  {
    name: 'ULTIMATE',
    price: '24,99 €',
    hint: 'par mois',
    features: ['Certifications avancées', 'Support VIP', 'Accès prioritaire'],
  },
];

export function PricingCTA() {
  return (
    <section data-l-section="pricing-cta" aria-labelledby="l-pricing-cta-title">
      <div className="l-container">
        <div className="l-pricing-cta-inner">
          <header className="l-pricing-cta-header">
            <span className="l-m-label">Offres &amp; tarifs</span>
            <h2 id="l-pricing-cta-title" className="l-pricing-cta-title">
              Deviens un véritable technicien PC.
            </h2>
            <p className="l-pricing-cta-lede">
              Apprends à ton rythme. Progresse jusqu&apos;au niveau technicien.
            </p>
          </header>

          <ul className="l-pricing-cta-grid">
            {PLANS.map((plan) => (
              <li
                key={plan.name}
                className={`l-pricing-cta-card${plan.highlight ? ' l-pricing-cta-card--highlight' : ''}`}
              >
                <div className="l-pricing-cta-card-top">
                  <span className="l-pricing-cta-card-name">{plan.name}</span>
                  {plan.tag && (
                    <span className="l-pricing-cta-card-tag">{plan.tag}</span>
                  )}
                </div>
                <div className="l-pricing-cta-card-price">{plan.price}</div>
                <div className="l-pricing-cta-card-hint">{plan.hint}</div>
                <ul className="l-pricing-cta-features">
                  {plan.features.map((f) => (
                    <li key={f} className="l-pricing-cta-feature">
                      <Check className="l-pricing-cta-feature-icon" aria-hidden="true" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/offres"
                  className={`l-pricing-cta-card-btn ${plan.highlight ? 'l-m-btn' : 'l-m-btn-outline'}`}
                >
                  Commencer
                </Link>
              </li>
            ))}

            {/* Lifetime */}
            <li className="l-pricing-cta-card l-pricing-cta-card--highlight">
              <div className="l-pricing-cta-card-top">
                <span className="l-pricing-cta-card-name">LIFETIME</span>
                <span className="l-pricing-cta-card-tag">Exclusif</span>
              </div>
              <div className="l-pricing-cta-card-price">499 €</div>
              <div className="l-pricing-cta-card-hint">paiement unique</div>
              <ul className="l-pricing-cta-features">
                {["Tout d'Ultimate", 'Mises à jour à vie', 'Support prioritaire à vie'].map((f) => (
                  <li key={f} className="l-pricing-cta-feature">
                    <Check className="l-pricing-cta-feature-icon" aria-hidden="true" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={async () => {
                  const res = await fetch('/api/stripe/lifetime', { method: 'POST' });
                  const data = await res.json();
                  if (data.url) window.location.href = data.url;
                }}
                className="l-pricing-cta-card-btn l-m-btn"
              >
                Acheter — 499 €
              </button>
            </li>
          </ul>

          <div className="l-pricing-cta-actions">
            <Link href="/offres" className="l-m-btn l-pricing-cta-primary">
              Voir toutes les offres
            </Link>
            <Link href="/auth" className="l-m-btn-outline l-pricing-cta-secondary">
              Commencer gratuitement
            </Link>
          </div>
          <p className="l-pricing-cta-foot">Sans carte bancaire · Résiliable à tout moment</p>
        </div>
      </div>
    </section>
  );
}
