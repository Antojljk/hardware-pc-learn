export function PC3DSection() {
  return (
    <section data-l-section="section-3d" className="l-s3d">

      {/* Full-width video */}
      <div className="l-s3d-video-wrap" aria-hidden="true">
        <video
          src="/videos/pc-showcase.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="l-s3d-video"
        />
        {/* gradient overlays — hides watermark at bottom + makes text readable */}
        <div className="l-s3d-overlay-left" />
        <div className="l-s3d-overlay-bottom" />
      </div>

      {/* Text overlay */}
      <div className="l-container l-s3d-content">
        <p className="l-m-label l-s3d-label">
          <span aria-hidden="true" className="l-s3d-dot" />
          Visualisation 3D
        </p>
        <h2 className="l-s3d-heading">
          Chaque composant,<br />
          <em className="l-s3d-em">dans les détails.</em>
        </h2>
        <p className="l-s3d-body">
          CPU, GPU, RAM, alimentation — explore l&apos;architecture interne d&apos;un PC de A à Z et comprends comment chaque pièce joue son rôle.
        </p>
        <a href="/cours" className="l-m-btn l-s3d-cta">
          Explorer les cours
        </a>
      </div>

    </section>
  );
}
