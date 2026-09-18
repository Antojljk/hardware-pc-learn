import Link from 'next/link';
import { LLogomark } from './icons';

const COL_PLATEFORME = [
  { label: 'Cours', href: '/cours' },
  { label: 'Quiz', href: '/quiz' },
  { label: 'Constructeur', href: '/constructeur' },
  { label: 'Glossaire', href: '/glossaire' },
];

const COL_RESSOURCES = [
  { label: "Base de connaissances", href: '/base-connaissances' },
  { label: 'Diagnostic', href: '/diagnostic' },
  { label: 'Contact', href: '/contact' },
];

const COL_LEGAL = [
  { label: 'Mentions légales', href: '/mentions-legales' },
  { label: 'Confidentialité', href: '/confidentialite' },
  { label: 'Cookies', href: '/cookies' },
  { label: 'Remboursements', href: '/remboursement' },
];

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
            <Link href="#top" className="l-s09-logo" aria-label="Logo HardwarePC">
              <LLogomark className="l-s09-logomark" />
              <span className="l-s09-wordmark">HardwarePC</span>
            </Link>
            <p className="l-s09-tagline">Apprends le hardware, deviens technicien.</p>
          </div>

          <nav className="l-s09-cols" aria-label="Footer">
            <FooterCol title="Plateforme" items={COL_PLATEFORME} />
            <FooterCol title="Ressources" items={COL_RESSOURCES} />
            <FooterCol title="Légal" items={COL_LEGAL} />
          </nav>
        </div>

        <div className="l-s09-bottom">
          <p className="l-s09-copy">© 2026 HardwarePC. Tous droits réservés.</p>
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
