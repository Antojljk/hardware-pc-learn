import Link from 'next/link';
import {
  LLogomark,
  LIconInstagram,
  LIconTikTok,
  LIconYouTube,
  LIconLinkedIn,
  LIconX,
  LIconFacebook,
} from './icons';

const COL_PLATEFORME = [
  { label: 'Débutants', href: '#' },
  { label: 'Étudiants', href: '#' },
  { label: 'Passionnés', href: '#' },
  { label: 'Techniciens', href: '#' },
  { label: 'Experts', href: '#' },
  { label: 'Formateurs', href: '#' },
];

const COL_RESSOURCES = [
  { label: "Bases de l'architecture", href: '/base-connaissances' },
  { label: 'Guide de dépannage PC', href: '/diagnostic' },
  { label: 'Montage PC', href: '/constructeur' },
  { label: 'Compatibilité des composants hardware', href: '/constructeur' },
];

const COL_LOGICIELS = [
  { label: 'Web App', href: '/' },
  { label: 'Dashboard Pro', href: '/dashboard' },
  { label: 'Outils Diagnostic', href: '/diagnostic' },
];

const COL_SOCIETE = [
  { label: 'About', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Presse', href: '#' },
  { label: 'Études', href: '#' },
  { label: 'Carrière', href: '#' },
  { label: 'Partenariats', href: '#' },
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Support', href: '#' },
  { label: 'Contact Pro', href: '#' },
  { label: 'Patents', href: '#' },
];

/**
 * Section 09 — Footer.
 * Logo SVG inline, tagline, sélecteur de langue, 4 colonnes,
 * 6 icônes sociales SVG inline, copyright.
 *
 * NOTE : le copyright indique "© 2024 HardPC" — à mettre à jour
 * en "© {année courante} HardwarePC" lors de l'étape de finalisation.
 * Le sélecteur de langue n'est pas câblé (i18n hors scope).
 */
export function Footer() {
  return (
    <footer
      data-l-section="section09"
      data-section="footer"
      className="l-m-footer"
    >
      <div className="l-container">
        <div className="l-s09-top">
          <div className="l-s09-brand">
            <Link href="#top" className="l-s09-logo" aria-label="Logo HardPC">
              <LLogomark className="l-s09-logomark" />
              <span className="l-s09-wordmark">HardPC</span>
            </Link>
            <p className="l-s09-tagline">Ta montée en compétence commence ici.</p>
            <label className="l-s09-lang" htmlFor="l-s09-lang-select">
              <span className="l-s09-lang-caption">Français</span>
              <select id="l-s09-lang-select" className="l-s09-lang-select" defaultValue="fr">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="pt">Português</option>
                <option value="fr">Français</option>
              </select>
            </label>
          </div>

          <nav className="l-s09-cols" aria-label="Footer">
            <FooterCol title="Plateforme" items={COL_PLATEFORME} />
            <FooterCol title="Ressources" items={COL_RESSOURCES} />
            <FooterCol title="Logiciels" items={COL_LOGICIELS} />
            <FooterCol title="Société" items={COL_SOCIETE} />
          </nav>
        </div>

        <div className="l-s09-bottom">
          <ul className="l-s09-social" aria-label="Réseaux sociaux">
            <li>
              <a href="#" className="l-s09-social-link" aria-label="Instagram">
                <LIconInstagram width={18} height={18} />
              </a>
            </li>
            <li>
              <a href="#" className="l-s09-social-link" aria-label="TikTok">
                <LIconTikTok width={18} height={18} />
              </a>
            </li>
            <li>
              <a href="#" className="l-s09-social-link" aria-label="YouTube">
                <LIconYouTube width={18} height={18} />
              </a>
            </li>
            <li>
              <a href="#" className="l-s09-social-link" aria-label="LinkedIn">
                <LIconLinkedIn width={18} height={18} />
              </a>
            </li>
            <li>
              <a href="#" className="l-s09-social-link" aria-label="X">
                <LIconX width={18} height={18} />
              </a>
            </li>
            <li>
              <a href="#" className="l-s09-social-link" aria-label="Facebook">
                <LIconFacebook width={18} height={18} />
              </a>
            </li>
          </ul>

          <button type="button" className="l-s09-cookie">
            <span>Cookies settings</span>
          </button>

          <p className="l-s09-copy">© 2024 HardPC. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div className="l-s09-col">
      <h4>{title}</h4>
      <ul className="l-s09-list">
        {items.map((it) => (
          <li key={it.label}>
            <Link href={it.href}>{it.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
