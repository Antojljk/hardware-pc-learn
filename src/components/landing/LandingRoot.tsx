import './landing.css';
import { NavBar } from './NavBar';
import { Hero } from './Hero';
import { Features } from './Features';
import { PC3DLoader } from './PC3DLoader';
import { PricingCTA } from './PricingCTA';
import { Footer } from './Footer';

export function LandingRoot() {
  return (
    <div className="l-landing">
      <NavBar />
      <main>
        <Hero />
        <Features />
        <PC3DLoader />
      </main>
      <PricingCTA />
      <Footer />
    </div>
  );
}
