import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Sparkles, BookOpen, Brain, MessageSquareQuote, Wrench } from 'lucide-react';

export const metadata = { title: 'Base de connaissances — HardwarePC' };

const CATEGORIES = [
  { slug: 'cpu',        title: 'CPU',                  desc: 'Architecture, IPC, SMT, TDP, FCLK.',     icon: '🧠' },
  { slug: 'gpu',        title: 'GPU',                  desc: 'CUDA, Stream Processors, GDDR, RT.',      icon: '🎮' },
  { slug: 'ram',        title: 'RAM',                  desc: 'DDR5, timings, XMP, EXPO, sweet spot.',   icon: '💾' },
  { slug: 'motherboard',title: 'Carte mère',           desc: 'Socket, chipset, VRM, PCIe, M.2.',        icon: '🔌' },
  { slug: 'psu',        title: 'Alimentation',         desc: '80 Plus, 12VHPWR, modularité, watts.',    icon: '⚡' },
  { slug: 'cooling',    title: 'Refroidissement',      desc: 'Aircooling, AIO, pâte thermique.',        icon: '❄️' },
  { slug: 'storage',    title: 'Stockage',             desc: 'NVMe, SATA, SMART, TBW.',                 icon: '💽' },
  { slug: 'reseau',     title: 'Réseau',               desc: 'Wi-Fi 7, Ethernet 2.5/5 GbE, latence.',   icon: '🌐' },
  { slug: 'depannage',  title: 'Dépannage',            desc: 'POST, BSOD, redémarrages, artefacts.',    icon: '🛠️' },
];

export default async function KnowledgeBasePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Sparkles className="w-5 h-5 text-brand-blue" /> Base de connaissances</h1>
        <p className="text-text-soft text-sm">Fiches techniques et ressources par catégorie.</p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CATEGORIES.map(c => (
          <Link
            key={c.slug}
            href={`/base-connaissances/${c.slug}`}
            className="card card-hover p-5"
          >
            <div className="text-2xl mb-2">{c.icon}</div>
            <h2 className="font-semibold">{c.title}</h2>
            <p className="text-sm text-text-soft mt-1">{c.desc}</p>
          </Link>
        ))}
      </div>

      <section className="card p-5">
        <h2 className="section-title mb-3">Outils transverses</h2>
        <ul className="text-sm space-y-2">
          <li className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5 text-brand-blue" /> <Link href="/cours" className="hover:underline">Cours</Link> — explications progressives</li>
          <li className="flex items-center gap-2"><Brain className="w-3.5 h-3.5 text-brand-violet" /> <Link href="/quiz" className="hover:underline">Quiz</Link> — entraînement par catégorie</li>
          <li className="flex items-center gap-2"><MessageSquareQuote className="w-3.5 h-3.5 text-success" /> <Link href="/entretiens" className="hover:underline">Entretiens</Link> — simulation orale</li>
          <li className="flex items-center gap-2"><Wrench className="w-3.5 h-3.5 text-warning" /> <Link href="/diagnostic" className="hover:underline">Diagnostic</Link> — résolution de pannes</li>
        </ul>
      </section>
    </div>
  );
}
