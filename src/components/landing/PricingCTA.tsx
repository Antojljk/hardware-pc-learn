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
  isPro?: boolean;
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
    isPro: true,
  },
  {
    name: 'ULTIMATE',
    price: '24,99 €',
    hint: 'par mois',
    features: ['Certifications avancées', 'Support VIP', 'Accès prioritaire'],
  },
];

const LIFETIME_FEATURES = [
  "Tout d'Ultimate, sans exception",
  "Mises à jour incluses à vie",
  "Accès anticipé aux nouvelles fonctionnalités",
  "Support prioritaire à vie",
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

          {/* 4-plan grid */}
          <ul className="l-pricing-cta-grid">
            {PLANS.map((plan) => (
              <li
                key={plan.name}
                className={[
                  'l-pricing-cta-card',
                  plan.isPro ? 'l-pricing-cta-card--pro' : (plan.highlight ? 'l-pricing-cta-card--highlight' : ''),
                ].filter(Boolean).join(' ')}
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
                  className={`l-pricing-cta-card-btn ${plan.isPro ? 'l-m-btn' : 'l-m-btn-outline'}`}
                >
                  Commencer
                </Link>
              </li>
            ))}
          </ul>

          {/* Lifetime banner — full width, amber/gold */}
          <div className="l-pricing-cta-lifetime">
            <div className="l-pricing-cta-lifetime-text">
              <span className="l-pricing-cta-lifetime-eyebrow">
                <span className="l-pricing-cta-lifetime-eyebrow-dot" aria-hidden="true" />
                Exclusif — Meilleure valeur
              </span>
              <h3 className="l-pricing-cta-lifetime-title">
                Accès <em>illimité</em> à vie.{' '}
                <span style={{ color: 'var(--l-color-muted)', fontWeight: 400 }}>Payez une fois.</span>
              </h3>
              <p className="l-pricing-cta-lifetime-desc">
                L&apos;offre la plus avantageuse sur le long terme. Un seul paiement pour un accès définitif à toutes les fonctionnalités HardwarePC, présentes et futures.
              </p>
              <ul className="l-pricing-cta-lifetime-features">
                {LIFETIME_FEATURES.map((f) => (
                  <li key={f} className="l-pricing-cta-lifetime-feature">
                    <Check className="l-pricing-cta-lifetime-feature-check" aria-hidden="true" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="l-pricing-cta-lifetime-price-block">
              <div className="l-pricing-cta-lifetime-amount">499 €</div>
              <div className="l-pricing-cta-lifetime-period">Paiement unique · Accès à vie</div>
              <button
                className="l-pricing-cta-lifetime-btn"
                onClick={async () => {
                  const res = await fetch('/api/stripe/lifetime', { method: 'POST' });
                  const data = await res.json();
                  if (data.url) window.location.href = data.url;
                }}
              >
                Acheter à vie — 499 €
              </button>
              <p className="l-pricing-cta-lifetime-guarantee">
                Satisfait ou remboursé 30 jours
              </p>
            </div>
          </div>

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
