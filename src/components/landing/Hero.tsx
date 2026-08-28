import Link from 'next/link';
import { ParallaxHero } from './ParallaxHero';
import { HeroVisual } from './HeroVisual';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1587134160474-cd3c9a60a34a?w=1600&h=1100&fit=crop&q=80';

/**
 * Section 01 — Hero plein écran premium.
 * - Pill d'eyebrow animée (statut "live")
 * - Titre avec mot accentué
 * - Lede, double CTA avec micro-relief au survol
 * - Effets 3D : perspective + translateZ (contenu en avant, média en arrière)
 * - Parallaxe très subtile au scroll (ParallaxHero, client)
 * - Halo lumineux qui suit doucement le curseur (HeroVisual, client)
 * - Vignette sombre cohérente pour fond premium
 * - Lignes de scan très subtiles pour le côté tech
 */
export function Hero() {
  return (
    <section
      id="section01"
      data-l-section="section01"
      data-section="header"
      className="l-section l-section01-hero"
    >
      <div className="l-container l-s01-shell">
        <div className="l-s01-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_IMAGE} alt="Rendu 3D abstrait de circuits imprimés haute technologie" />
        </div>

        {/* Halo lumineux qui suit le curseur (3D subtil) */}
        <HeroVisual />

        {/* Vignette douce par-dessus le média */}
        <div className="l-s01-media-vignette" aria-hidden="true" />

        {/* Contenu du hero (devant le média) */}
        <div className="l-s01-content">
          <div className="l-s01-content-inner">
            <span className="l-s01-eyebrow">
              <span className="l-s01-eyebrow-dot" aria-hidden="true" />
              Plateforme d&apos;apprentissage hardware
            </span>

            <h1 className="l-s01-title">
              Comprends enfin <span className="l-s01-title-accent">ton PC.</span>
            </h1>

            <p className="l-s01-lede">
              Maîtrise le hardware via des cours interactifs et des outils pro, du niveau
              débutant jusqu&apos;à l&apos;expertise technique.
            </p>

            <div className="l-s01-actions">
              <Link href="/auth" className="l-m-btn l-s01-cta-primary">
                Commencer libre
                <svg
                  className="l-s01-cta-arrow"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="16"
                  height="16"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
              <a href="#section02" className="l-m-btn-outline l-s01-ghost">
                Voir tous nos modules
              </a>
            </div>

            {/* Métriques de réassurance en bas du hero */}
            <ul className="l-s01-meta" aria-label="Aperçu rapide">
              <li>
                <span className="l-s01-meta-num">12+</span>
                <span className="l-s01-meta-label">modules guidés</span>
              </li>
              <li>
                <span className="l-s01-meta-num">4</span>
                <span className="l-s01-meta-label">niveaux de maîtrise</span>
              </li>
              <li>
                <span className="l-s01-meta-num">24/7</span>
                <span className="l-s01-meta-label">accès aux outils</span>
              </li>
            </ul>
          </div>
        </div>

        <ParallaxHero />

        {/* Lignes de scan très subtiles pour le côté tech */}
        <div className="l-s01-scanlines" aria-hidden="true" />
      </div>
    </section>
  );
}
