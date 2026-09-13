'use client';
import { Cpu, Zap, Shield, Award } from 'lucide-react';

const MODULES = [
  {
    title: 'Base de Connaissances',
    desc: 'Maîtrisez les composants, du socket au chipset.',
    icon: <Cpu className="w-6 h-6 text-[#00D4FF]" />,
  },
  {
    title: 'Simulations Réelles',
    desc: 'Diagnostiquez des pannes complexes en temps réel.',
    icon: <Zap className="w-6 h-6 text-[#00D4FF]" />,
  },
  {
    title: 'Benchmarks & Analyse',
    desc: 'Interprétez les courbes de performance et timings.',
    icon: <Award className="w-6 h-6 text-[#00D4FF]" />,
  },
  {
    title: 'Certification Pro',
    desc: 'Validez vos acquis avec des examens rigoureux.',
    icon: <Shield className="w-6 h-6 text-[#00D4FF]" />,
  },
];

export function ModulesSection() {
  return (
    <section className="py-24 px-6 bg-[#080B14]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display text-white font-bold mb-4">L&apos;écosystème d&apos;apprentissage</h2>
          <p className="text-muted max-w-2xl mx-auto">Une approche modulaire pour transformer votre curiosité en expertise technique.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MODULES.map((m) => (
            <div 
              key={m.title} 
              className="p-6 rounded-lg border border-[#00D4FF]/15 bg-[#0F1523] transition-all duration-300 hover:border-[#00D4FF] hover:shadow-[0_0_20px_rgba(0,212,255,0.1)]"
            >
              <div className="mb-4">{m.icon}</div>
              <h3 className="text-white font-display font-bold text-lg mb-2">{m.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
