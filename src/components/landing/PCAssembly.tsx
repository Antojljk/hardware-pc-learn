'use client';
import { useState, useEffect, useRef } from 'react';

const COMPONENTS = [
  { id: 'cpu', label: 'Le CPU calcule', startPos: 'translate-y-[-200px]', endPos: 'translate-y-0', delay: '0ms' },
  { id: 'ram', label: 'La RAM stocke', startPos: 'translate-x-[200px]', endPos: 'translate-x-0', delay: '200ms' },
  { id: 'gpu', label: 'Le GPU affiche', startPos: 'translate-x-[-200px]', endPos: 'translate-x-0', delay: '400ms' },
  { id: 'mb', label: 'Tout s\'assemble', startPos: 'translate-y-[200px]', endPos: 'translate-y-0', delay: '600ms' },
];

export function PCAssembly() {
  const [assembledStep, setAssembledStep] = useState(-1);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Trigger the assembly sequence
          setAssembledStep(COMPONENTS.length - 1);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative py-24 px-6 bg-[#080B14] overflow-hidden flex flex-col items-center justify-center"
    >
      <div className="relative w-64 h-80 md:w-80 md:h-96">
        {/* Case - Base always visible */}
        <div className="absolute inset-0 border-4 border-white/20 rounded-xl flex items-center justify-center transition-all duration-1000 bg-white/5 backdrop-blur-sm">
          <div className={`absolute inset-0 rounded-lg transition-all duration-1000 ${assembledStep === COMPONENTS.length - 1 ? 'shadow-[0_0_50px_rgba(0,212,255,0.4)] border-cyan-400' : 'border-transparent'}`} />
          <span className="text-white/20 text-xs uppercase tracking-widest">Case</span>
        </div>

        {/* CPU */}
        <div 
          className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-12 h-12 bg-cyan-500 rounded-sm transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-20 shadow-lg`}
          style={{ 
            transitionDelay: COMPONENTS[0].delay,
            transform: assembledStep >= 0 ? 'translate(-50%, 0)' : `translate(-50%, -200px)` 
          }}
        />

        {/* RAM */}
        <div 
          className={`absolute top-1/3 right-1/4 w-4 h-20 bg-violet-500 rounded-sm transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-20 shadow-lg`}
          style={{ 
            transitionDelay: COMPONENTS[1].delay,
            transform: assembledStep >= 1 ? 'translateX(0)' : `translateX(200px)` 
          }}
        />

        {/* GPU */}
        <div 
          className={`absolute bottom-1/3 left-1/4 w-32 h-10 bg-cyan-600 rounded-sm transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-20 shadow-lg`}
          style={{ 
            transitionDelay: COMPONENTS[2].delay,
            transform: assembledStep >= 2 ? 'translateX(0)' : `translateX(-200px)` 
          }}
        />

        {/* Motherboard */}
        <div 
          className={`absolute inset-8 bg-slate-800 rounded-sm transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-10 border border-white/10`}
          style={{ 
            transitionDelay: COMPONENTS[3].delay,
            transform: assembledStep >= 3 ? 'translateY(0)' : `translateY(200px)` 
          }}
        />
      </div>

      <div className="mt-12 h-8 text-center">
        <p className="text-xl md:text-2xl text-white font-display font-medium transition-opacity duration-500">
          {assembledStep === -1 ? "Préparez le montage..." : COMPONENTS[Math.min(assembledStep, COMPONENTS.length - 1)].label}
        </p>
      </div>
    </section>
  );
}
