import { Hero } from '@/components/landing/Hero';
import { PCAssembly } from '@/components/landing/sections/PCAssembly';
import { ModulesSection } from '@/components/landing/sections/ModulesSection';
import { PricingSection } from '@/components/landing/sections/PricingSection';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="bg-[#080B14] min-h-screen font-sans text-[#E8EDF5]">
      <Hero />
      <PCAssembly />
      <ModulesSection />
      <PricingSection />
      <Footer />
    </div>
  );
}
