import Link from 'next/link';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1587134160474-cd3c9a60a34a?w=1600&h=1100&fit=crop&q=80';

/**
 * Section 01 — Hero plein écran.
 * Image de fond Unsplash + overlay sombre gauche→droite, titre, lede, 2 CTA.
 * Server Component, statique.
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
        <div className="l-s01-content">
          <h1 className="l-s01-title">Comprends enfin ton PC.</h1>
          <span className="l-s01-lede">
            Maîtrise le hardware via des cours interactifs et des outils pro, du niveau
            débutant jusqu&apos;à l&apos;expertise technique.
          </span>
          <div className="l-s01-actions">
            <Link href="/auth" className="l-m-btn">
              Commencer libre
            </Link>
            <a href="#section02" className="l-m-btn-outline l-s01-ghost">
              Voir tous nos modules
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
