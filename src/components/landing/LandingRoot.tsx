import './landing.css';
import { NavBar } from './NavBar';
import { Hero } from './Hero';
import { Features } from './Features';
import { PricingCTA } from './PricingCTA';
import { Footer } from './Footer';

export function LandingRoot() {
  return (
    <div className="l-landing">
      <NavBar />
      <main>
        <Hero />
        <Features />
      </main>
      <PricingCTA />
      <Footer />
    </div>
  );
}
