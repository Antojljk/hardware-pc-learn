'use client';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative py-32 px-6 bg-[#080B14] overflow-hidden flex items-center justify-center text-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00D4FF]/10 rounded-full blur-[120px]" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        <h1 className="text-[40px] md:text-[72px] font-display font-bold text-white leading-tight">
          Comprends enfin ton PC.
        </h1>
        <p className="text-lg md:text-xl text-[#6B7A9A] max-w-2xl mx-auto leading-relaxed">
          La plateforme ultime pour maîtriser le hardware, du diagnostic expert à l&apos;optimisation extrême.
        </p>        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/auth" 
            className="px-8 py-4 bg-[#00D4FF] text-black font-bold rounded-md hover:bg-[#00D4FF]/90 transition-all w-full sm:w-auto"
          >
            Commencer maintenant
          </Link>
          <Link 
            href="/offres" 
            className="px-8 py-4 border border-white text-white font-medium rounded-md hover:bg-white/5 transition-all w-full sm:w-auto"
          >
            Voir les plans
          </Link>
        </div>
      </div>
    </section>
  );
}
