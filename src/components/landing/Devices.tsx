/**
 * Section 03 — Composition "responsive devices".
 * Trois images Unsplash positionnées en absolu (web / phone / tablet)
 * sur une scène au fond gris bleuté avec un radial teal derrière.
 *
 * Server Component, purement statique.
 *
 * Le stage reçoit un grain très subtil (radial noise) pour le côté
 * premium, et les images flottent doucement (animation gérée en CSS).
 */
export function Devices() {
  return (
    <section
      id="section03"
      data-l-section="section03"
      data-section="gallery"
      className="l-section"
    >
      <div className="l-container">
        <header className="l-s03-header">
          <span className="l-m-label">Multi-plateforme</span>
          <h2 className="l-s03-title">Une expérience fluide, partout.</h2>
          <p className="l-s03-sub">
            Apprends sur ton PC, ta tablette ou ton mobile — le contenu
            s&apos;adapte et ta progression te suit.
          </p>
        </header>

        <figure className="l-s03-stage">
          {/* Grain très subtil pour ambiance premium */}
          <div className="l-s03-grain" aria-hidden="true" />
          {/* Anneau lumineux pour donner du relief */}
          <div className="l-s03-ring" aria-hidden="true" />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="l-s03-web"
            src="https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?w=1152&h=722&fit=crop&q=80"
            alt="Interface du configurateur PC avec composants 3D"
            width={1152}
            height={722}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="l-s03-phone"
            src="https://images.unsplash.com/photo-1543965170-4c01a586684e?w=460&h=992&fit=crop&q=80"
            alt="Tableau de bord de progression utilisateur"
            width={460}
            height={992}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="l-s03-tablet"
            src="https://images.unsplash.com/photo-1651340741844-48edcd3fe79c?w=1612&h=1186&fit=crop&q=80"
            alt="Illustration de refroidissement liquide pour PC"
            width={1612}
            height={1186}
          />
          <figcaption className="l-s03-caption l-m-caption">
            Disponible sur Web, Tablette et Mobile — synchronisé en continu.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
