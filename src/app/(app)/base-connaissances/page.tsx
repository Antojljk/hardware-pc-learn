import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import {
  Sparkles,
  BookOpen,
  Brain,
  MessageSquareQuote,
  Wrench,
  Cpu,
  MonitorPlay,
  MemoryStick,
  CircuitBoard,
  Plug,
  Snowflake,
  HardDrive,
  Network,
  ShieldAlert,
} from 'lucide-react';

export const metadata = { title: 'Base de connaissances — HardwarePC' };

const CATEGORIES = [
  { slug: 'cpu',        title: 'CPU',                  desc: 'Architecture, IPC, SMT, TDP, FCLK.',     icon: Cpu },
  { slug: 'gpu',        title: 'GPU',                  desc: 'CUDA, Stream Processors, GDDR, RT.',      icon: MonitorPlay },
  { slug: 'ram',        title: 'RAM',                  desc: 'DDR5, timings, XMP, EXPO, sweet spot.',   icon: MemoryStick },
  { slug: 'motherboard',title: 'Carte mère',           desc: 'Socket, chipset, VRM, PCIe, M.2.',        icon: CircuitBoard },
  { slug: 'psu',        title: 'Alimentation',         desc: '80 Plus, 12VHPWR, modularité, watts.',    icon: Plug },
  { slug: 'cooling',    title: 'Refroidissement',      desc: 'Aircooling, AIO, pâte thermique.',        icon: Snowflake },
  { slug: 'storage',    title: 'Stockage',             desc: 'NVMe, SATA, SMART, TBW.',                 icon: HardDrive },
  { slug: 'reseau',     title: 'Réseau',               desc: 'Wi-Fi 7, Ethernet 2.5/5 GbE, latence.',   icon: Network },
  { slug: 'depannage',  title: 'Dépannage',            desc: 'POST, BSOD, redémarrages, artefacts.',    icon: ShieldAlert },
];

export default async function KnowledgeBasePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  return (
    <div className="space-y-6">
      <section className="module-hero">
        <div className="module-eyebrow">Référence</div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight flex items-center gap-2 mt-2">
          <Sparkles className="w-6 h-6 text-text" /> Base de connaissances
        </h1>
        <p className="text-muted text-[15px] mt-2 max-w-xl">Fiches techniques et ressources par catégorie.</p>
      </section>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CATEGORIES.map(c => {
          const Icon = c.icon;
          return (
            <Link
              key={c.slug}
              href={`/base-connaissances/${c.slug}`}
              className="module-frame lift-3d block group"
            >
              <div className="w-10 h-10 rounded-xl grid place-items-center bg-bg-elev border border-border text-text mb-3">
                <Icon className="w-5 h-5" />
              </div>
              <h2 className="font-display text-base font-semibold">{c.title}</h2>
              <p className="text-sm text-muted mt-1">{c.desc}</p>
            </Link>
          );
        })}
      </div>

      <section className="module-frame">
        <h2 className="section-title mb-4">Outils transverses</h2>
        <ul className="text-sm space-y-2.5">
          <li className="flex items-center gap-2.5"><BookOpen className="w-3.5 h-3.5 text-muted shrink-0" /> <Link href="/cours" className="hover:underline">Cours</Link> — explications progressives</li>
          <li className="flex items-center gap-2.5"><Brain className="w-3.5 h-3.5 text-muted shrink-0" /> <Link href="/quiz" className="hover:underline">Quiz</Link> — entraînement par catégorie</li>
          <li className="flex items-center gap-2.5"><MessageSquareQuote className="w-3.5 h-3.5 text-muted shrink-0" /> <Link href="/entretiens" className="hover:underline">Entretiens</Link> — simulation orale</li>
          <li className="flex items-center gap-2.5"><Wrench className="w-3.5 h-3.5 text-muted shrink-0" /> <Link href="/diagnostic" className="hover:underline">Diagnostic</Link> — résolution de pannes</li>
        </ul>
      </section>
    </div>
  );
}
