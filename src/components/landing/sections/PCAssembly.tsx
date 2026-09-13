'use client';
import { useState, useEffect, useRef } from 'react';

const STEPS = [
  { id: 'case', text: 'Le boîtier protège vos composants.' },
  { id: 'cpu', text: 'Le CPU calcule tout.' },
  { id: 'ram', text: 'La RAM stocke temporairement.' },
  { id: 'gpu', text: 'Le GPU génère chaque pixel.' },
  { id: 'leds', text: "L'énergie donne vie au système." },
];

export function PCAssembly() {
  const [step, setStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Logic to advance steps could be tied to scroll position inside the element
          // For simplicity in this implementation, we use a simple interval or 
          // we can refine this to a scroll-linked animation.
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // We'll use a more precise scroll listener for the "assembly" feel
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (rect.top < windowHeight && rect.bottom > 0) {
        const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
        const currentStep = Math.min(
          Math.floor(progress * STEPS.length),
          STEPS.length - 1
        );
        if (currentStep >= 0) setStep(currentStep);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="py-24 px-6 bg-[#080B14] overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-square max-w-md mx-auto">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Case */}
            <rect 
              x="60" y="40" width="80" height="120" 
              rx="4" fill="none" stroke="#6B7A9A" strokeWidth="2" 
              className={`transition-all duration-500 ${step >= 0 ? 'opacity-100' : 'opacity-0'}`}
            />
            {/* CPU */}
            <rect 
              x="90" y="60" width="20" height="20" 
              fill="#00D4FF" 
              className={`transition-all duration-500 ${step >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
              style={{ transitionDelay: '100ms' }}
            />
            {/* RAM */}
            <rect 
              x="115" y="55" width="5" height="30" 
              fill="#7C3AED" 
              className={`transition-all duration-500 ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}
            />
            {/* GPU */}
            <rect 
              x="70" y="100" width="60" height="15" 
              fill="#00D4FF" 
              className={`transition-all duration-500 ${step >= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
            />
            {/* LEDs / Cables */}
            <path 
              d="M60 140 L140 140 M100 160 L100 140" 
              stroke="#00D4FF" strokeWidth="1" fill="none"
              className={`transition-all duration-500 ${step >= 4 ? 'opacity-100 stroke-dashoffset-0' : 'opacity-0'}`}
              style={{ strokeDasharray: '100', strokeDashoffset: '100' }}
            />
            <circle cx="100" cy="70" r="2" fill="#00D4FF" className={`${step >= 4 ? 'animate-pulse' : ''}`} />
          </svg>
        </div>
        <div className="space-y-4 text-center lg:text-left">
          <h2 className="text-4xl font-display text-white font-bold mb-6">L&apos;anatomie de la puissance</h2>
          <div className="h-20">
            <p className={`text-xl text-muted transition-all duration-300 ${step < STEPS.length ? 'opacity-100 translate-y-0' : 'opacity-0'}`}>
              {STEPS[step]?.text || "Maîtrisez chaque composant."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
