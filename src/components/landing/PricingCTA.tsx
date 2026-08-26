import Link from 'next/link';
import { Check } from 'lucide-react';

/**
 * Section "Commerciale" — insérée en bas de la landing avant le footer.
 *
 * Présente brièvement :
 *  - le positionnement "Deviens un véritable technicien PC"
 *  - les 5 offres (FREE, ESSENTIEL, PRO, ULTIMATE, ULTIMATE LIFETIME)
 *  - deux CTA : "Découvrir les offres" -> /vente et "Comparer les tarifs" -> /tarifs
 *
 * Respecte le design system de la landing :
 *  - préfixe de classes `l-` (CSS scoped via landing.css)
 *  - tokens `var(--l-color-*)` déjà définis
 *  - typographie display Inter
 *
 * N'INTRODUIT PAS de logique de paiement, ni d'appel Stripe.
 * N'AFFECTE PAS les fonctionnalités existantes.
 */

interface OfferRow {
  name: string;
  price: string;
  hint: string;
  highlight?: boolean;
}

const OFFERS: OfferRow[] = [
  { name: 'FREE',              price: '0 €/mois',         hint: 'Pour commencer' },
  { name: 'ESSENTIEL',         price: '7,99 €/mois',     hint: 'Apprenant régulier' },
  { name: 'PRO',               price: '14,99 €/mois',    hint: 'Montée en compétences', highlight: true },
  { name: 'ULTIMATE',          price: '24,99 €/mois',    hint: 'Niveau technicien' },
  { name: 'ULTIMATE LIFETIME', price: '399 €',           hint: 'Paiement unique' },
];

export function PricingCTA() {
  return (
    <section
      data-l-section="pricing-cta"
      data-section="pricing"
      className="l-pricing-cta"
      aria-labelledby="l-pricing-cta-title"
    >
      <div className="l-container">
        <div className="l-pricing-cta-inner">
          <header className="l-pricing-cta-header">
            <span className="l-m-badge">Offres & tarifs</span>
            <h2 id="l-pricing-cta-title" className="l-pricing-cta-title">
              Deviens un véritable technicien PC.
            </h2>
            <p className="l-pricing-cta-lede">
              Hardware PC Learn t&apos;accompagne pas à pas : apprentissage du hardware,
              montage, diagnostic et compétences avancées pour progresser jusqu&apos;au
              niveau technicien — à ton rythme, avec des outils pro.
            </p>
          </header>

          <ul className="l-pricing-cta-grid" aria-label="Aperçu des offres">
            {OFFERS.map((offer) => (
              <li
                key={offer.name}
                className={
                  'l-pricing-cta-card' + (offer.highlight ? ' l-pricing-cta-card--highlight' : '')
                }
              >
                <div className="l-pricing-cta-card-top">
                  <span className="l-pricing-cta-card-name">{offer.name}</span>
                  {offer.highlight ? (
                    <span className="l-pricing-cta-card-tag">
                      <Check className="w-3 h-3" aria-hidden="true" />
                      Recommandé
                    </span>
                  ) : null}
                </div>
                <div className="l-pricing-cta-card-price">{offer.price}</div>
                <div className="l-pricing-cta-card-hint">{offer.hint}</div>
              </li>
            ))}
          </ul>

          <div className="l-pricing-cta-actions">
            <Link href="/vente" className="l-m-btn l-pricing-cta-primary">
              Découvrir les offres
            </Link>
            <Link href="/tarifs" className="l-m-btn-outline l-pricing-cta-secondary">
              Comparer les tarifs
            </Link>
          </div>

          <p className="l-pricing-cta-foot">
            Accès immédiat · Sans engagement sur l&apos;offre FREE · Paiement sécurisé
          </p>
        </div>
      </div>
    </section>
  );
}
