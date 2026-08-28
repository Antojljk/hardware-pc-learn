import Link from 'next/link';
import { MobileNav } from './MobileNav';
import { NavScroll } from './NavScroll';

/**
 * Barre de navigation principale de la landing.
 * Server Component — le menu mobile et l'effet scroll sont délégués
 * à <MobileNav /> et <NavScroll /> (client components).
 *
 * - Backdrop blur + bordure subtile dès qu'on scrolle (via NavScroll)
 * - Logo wordmark avec petite "led" qui pulse
 * - Liens centraux avec underline animé au hover
 * - CTA premium à droite
 */
export function NavBar() {
  return (
    <>
      <NavScroll />
      <nav className="l-m-nav" data-section="navigation" aria-label="Navigation principale">
        <Link href="/" className="l-logo">
          <span className="l-logo-led" aria-hidden="true" />
          <span className="l-logo-text">HardPC</span>
        </Link>

        <ul id="l-nav-links" className="l-nav-links">
          <li>
            <a href="#section01" className="l-nav-link">
              <span>Apprendre</span>
            </a>
          </li>
          <li>
            <a href="#section02" className="l-nav-link">
              <span>Parcours</span>
            </a>
          </li>
          <li>
            <a href="#section03" className="l-nav-link">
              <span>Constructeur</span>
            </a>
          </li>
          <li>
            <a href="#section04" className="l-nav-link">
              <span>Glossaire</span>
            </a>
          </li>
          <li>
            <a href="#section05" className="l-nav-link">
              <span>Quiz</span>
            </a>
          </li>
        </ul>

        <Link href="/auth" className="l-m-btn l-nav-cta">
          S&apos;inscrire
        </Link>

        <MobileNav />
      </nav>
    </>
  );
}
