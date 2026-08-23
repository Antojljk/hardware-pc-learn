import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { PcCase, Sparkles, Wrench } from 'lucide-react';
import { BuildClient } from './BuildClient';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ConstructeurPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  const components = await prisma.component.findMany();

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[11px] tracking-widest uppercase text-accent mb-2">Constructeur</div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight flex items-center gap-3">
            <PcCase className="w-7 h-7 text-accent" />
            Construis ta machine
          </h1>
          <p className="text-text-soft text-sm mt-2 max-w-xl">
            Sélectionne tes composants. La compatibilité est vérifiée en temps réel.
            Les prix sont synchronisés depuis LDLC, TopAchat et Coolpc.
          </p>
        </div>
        <Link href="/constructeur/defis" className="btn-primary">
          <Sparkles className="w-4 h-4" /> Mode défis
        </Link>
      </header>

      <BuildClient components={components.map(c => ({
        id: c.id, type: c.type, brand: c.brand, model: c.model, price: c.price,
        specs: typeof c.specs === 'string' ? safeParse(c.specs) : c.specs,
        category: c.category || undefined,
      }))} />

      <section className="card p-6">
        <h2 className="section-title mb-3 flex items-center gap-2">
          <Wrench className="w-4 h-4 text-text-soft" /> Comment ça marche
        </h2>
        <ul className="text-sm text-text-soft space-y-2 list-disc pl-5">
          <li>Choisis CPU, GPU, RAM, carte mère, SSD, alimentation, boîtier, refroidissement.</li>
          <li>La vérification tourne en direct : socket, format, dimensions, puissance, connecteurs, M.2.</li>
          <li>Une fois compatible, sauvegarde ta build et reçois un score (perf / valeur / évolutivité).</li>
          <li>Tu peux aussi relever les <Link href="/constructeur/defis" className="text-accent hover:underline">défis</Link> avec un budget imposé.</li>
        </ul>
      </section>
    </div>
  );
}

function safeParse(s: string) {
  try { return JSON.parse(s); } catch { return {}; }
}
