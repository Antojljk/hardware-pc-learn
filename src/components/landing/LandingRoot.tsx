import './landing.css';
import { NavBar } from './NavBar';
import { Hero } from './Hero';
import { Features } from './Features';
import { Stats } from './Stats';
import { PricingCTA } from './PricingCTA';
import { Footer } from './Footer';

/**
 * Racine de la landing HardwarePC.
 * - Importe le CSS scoped (`./landing.css`) une seule fois.
 * - Monte la nav, puis enchaîne les sections dans l'ordre suivant :
 *   Hero → Features → Stats → PricingCTA → Footer.
 * - Wrapper neutre : ne touche pas au shell auth-gated (Sidebar/TopBar/MobileNav).
 */
export function LandingRoot() {
  return (
    <div className="l-landing">
      <NavBar />
      <main>
        <Hero />
        <Features />
        <Stats />
      </main>
      <PricingCTA />
      <Footer />
    </div>
  );
}
