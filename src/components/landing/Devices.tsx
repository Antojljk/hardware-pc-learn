/**
 * Section 03 — Composition "responsive devices".
 * Trois images Unsplash positionnées en absolu (web / phone / tablet)
 * sur une scène au fond gris bleuté avec un radial teal derrière.
 * Server Component, purement statique.
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
        <figure className="l-s03-stage">
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
            Disponible sur Web, Tablette et Mobile fluide.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
