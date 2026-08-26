/**
 * Section 05 — Stat géant.
 * Eyebrow + divider + chiffre énorme.
 * NOTE : le chiffre "+70,000,000" provient du HTML 8B original
 * et n'est pas une métrique réelle du projet. À remplacer par
 * une vraie donnée (nombre d'apprenants, de cours, etc.) lors
 * de l'étape de finalisation.
 */
export function Stats() {
  return (
    <section
      data-l-section="section05"
      data-section="features"
      className="l-s05-wrap"
    >
      <div className="l-container l-stack-sm">
        <p className="l-s05-eyebrow">Rejoignez 15K+ techniciens en herbe.</p>
        <div className="l-s05-divider" />
        <p className="l-s05-stat">
          <span>+70,000,000</span>
        </p>
      </div>
    </section>
  );
}
