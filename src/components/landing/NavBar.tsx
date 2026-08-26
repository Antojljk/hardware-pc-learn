import Link from 'next/link';
import { MobileNav } from './MobileNav';

/**
 * Barre de navigation principale de la landing.
 * Server Component — le menu mobile est délégué à <MobileNav />.
 * Les ancres pointent vers les sections de la landing (id de <section data-l-section>).
 * Le CTA "S'inscrire" pointe vers /auth (inscription).
 */
export function NavBar() {
  return (
    <nav className="l-m-nav" data-section="navigation" aria-label="Navigation principale">
      <Link href="/" className="l-logo">
        HardPC
      </Link>

      <ul id="l-nav-links" className="l-nav-links">
        <li>
          <a href="#section01">Apprendre</a>
        </li>
        <li>
          <a href="#section02">Parcours</a>
        </li>
        <li>
          <a href="#section03">Constructeur</a>
        </li>
        <li>
          <a href="#section04">Glossaire</a>
        </li>
        <li>
          <a href="#section05">Quiz</a>
        </li>
      </ul>

      <Link href="/auth" className="l-m-btn">
        S&apos;inscrire
      </Link>

      <MobileNav />
    </nav>
  );
}
