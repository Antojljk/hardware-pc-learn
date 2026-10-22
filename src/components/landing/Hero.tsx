import Link from 'next/link';
import Image from 'next/image';

export function Hero() {
  return (
    <section
      id="section01"
      data-l-section="section01"
      data-section="header"
      className="l-section l-section01-hero"
    >
      <div className="l-container l-s01-shell">
        {/* Background image */}
        <div className="l-s01-media">
          <Image
            src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=2400&h=1800&fit=crop&q=85"
            alt="PC gaming haute performance, composants éclairés"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: '70% center' }}
          />
        </div>

        {/* Vignette overlay */}
        <div className="l-s01-media-vignette" aria-hidden="true" />

        {/* Scanlines effect */}
        <div className="l-s01-scanlines" aria-hidden="true" />

        {/* Content */}
        <div className="l-s01-content">
          <div className="l-s01-content-inner">
            <span className="l-s01-eyebrow">
              <span className="l-s01-eyebrow-dot" aria-hidden="true" />
              Plateforme de formation hardware PC
            </span>

            <h1 className="l-s01-title">
              Comprends enfin{' '}
              <span className="l-s01-title-accent">ton PC.</span>
            </h1>

            <p className="l-s01-lede">
              Des cours clairs, des outils concrets. Du débutant au niveau technicien.
            </p>

            <div className="l-s01-actions">
              <Link href="/auth" className="l-m-btn l-s01-cta-primary">
                Commencer gratuitement
                <svg className="l-s01-cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/offres" className="l-m-btn-outline l-s01-ghost">
                Voir nos offres
              </Link>
            </div>

            <ul className="l-s01-meta" aria-label="Aperçu rapide">
              <li><span className="l-s01-meta-num">12+</span><span className="l-s01-meta-label">modules guidés</span></li>
              <li><span className="l-s01-meta-num">4</span><span className="l-s01-meta-label">niveaux de maîtrise</span></li>
              <li><span className="l-s01-meta-num">24/7</span><span className="l-s01-meta-label">accès aux outils</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
