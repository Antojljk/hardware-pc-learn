export function PC3DSection() {
  return (
    <section data-l-section="section-3d" className="l-s3d">
      <div aria-hidden="true" className="l-s3d-glow" />
      <div className="l-container l-s3d-inner">

        {/* Text */}
        <div className="l-s3d-text">
          <p className="l-m-label l-s3d-label">
            <span aria-hidden="true" className="l-s3d-dot" />
            Visualisation 3D
          </p>
          <h2 className="l-s3d-heading">
            Chaque composant,{' '}
            <em className="l-s3d-em">dans les détails.</em>
          </h2>
          <p className="l-s3d-body">
            CPU, GPU, RAM, alimentation — explore l&apos;architecture interne d&apos;un PC de A à Z et comprends comment chaque pièce joue son rôle dans la machine.
          </p>
          <a href="/cours" className="l-m-btn l-s3d-cta">
            Explorer les cours
          </a>
        </div>

        {/* Video */}
        <div className="l-s3d-canvas-wrap">
          <video
            src="/videos/pc-showcase.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="l-s3d-video"
          />
        </div>

      </div>
    </section>
  );
}
