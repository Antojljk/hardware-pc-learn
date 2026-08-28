import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { ArrowLeft, BookOpen } from 'lucide-react';

const KNOWLEDGE: Record<string, { title: string; sections: { heading: string; body: string }[] }> = {
  cpu: {
    title: 'CPU — Tout savoir',
    sections: [
      { heading: 'Cœur, thread, fréquence', body: 'Un cœur physique exécute 1 thread à la fois. Avec SMT/HT, il en gère 2. La fréquence (GHz) mesure les cycles par seconde. L\'IPC détermine combien d\'instructions par cycle.' },
      { heading: 'TDP vs consommation réelle', body: 'TDP = chaleur à dissiper (ex : 65W). Consommation réelle peut être 1.5 à 2× en boost. Surveille PL1/PL2 (Intel) ou PPT (AMD).' },
      { heading: 'Architectures 2025+', body: 'AMD Zen 5 (AM5, +16% IPC vs Zen 4). Intel Arrow Lake (LGA1851, Lunar Lake mobile). Apple M-series (ARM).' },
      { heading: 'Binning et silicon lottery', body: 'Les CPU sont triés selon leurs performances. Les meilleurs puces finissent en haut de gamme. Les autres en entrée de gamme. C\'est pour ça que l\'overclock varie d\'un exemplaire à l\'autre.' },
    ],
  },
  gpu: {
    title: 'GPU — Tout savoir',
    sections: [
      { heading: 'Architectures', body: 'NVIDIA Blackwell (RTX 50), Ada Lovelace (RTX 40), Ampere (RTX 30). AMD RDNA 3 (RX 7000), RDNA 2 (RX 6000). Intel Arc Alchemist (A770, A580).' },
      { heading: 'VRAM', body: 'GDDR6X : 21-32 Gbps (RTX 40 haut de gamme). GDDR7 : 32-48 Gbps (RTX 50). GDDR6 : 14-18 Gbps (RX 7000). HBM3 : data center uniquement.' },
      { heading: 'Upscaling', body: 'DLSS 3.5 (NVIDIA, IA, Tensor cores). FSR 3 (AMD, open source). XeSS (Intel). Le rendu se fait en interne en résolution réduite, puis upscalé.' },
    ],
  },
  ram: {
    title: 'RAM — Tout savoir',
    sections: [
      { heading: 'DDR5 sweet spot', body: 'Pour AMD AM5 : DDR5-6000 CL30 (ratio 1:1 avec FCLK 2000 MHz). Pour Intel : DDR5-7200+ possible grâce à un meilleur IMC.' },
      { heading: 'XMP / EXPO', body: 'XMP = Intel. EXPO = AMD. Profils préconfigurés sur les modules. Activer dans le BIOS. Si instable : relâcher les timings.' },
      { heading: 'Dual channel', body: '2 sticks dans les slots A2+B2 pour doubler la bande passante. Gain 10-20% sur les tâches mémoire-limited.' },
    ],
  },
  motherboard: {
    title: 'Carte mère — Tout savoir',
    sections: [
      { heading: 'Sockets 2025+', body: 'AMD AM5 (depuis 2022, Ryzen 7000/9000). Intel LGA1851 (depuis 2024, Arrow Lake).' },
      { heading: 'Chipsets', body: 'AMD : X870E, X870, B850, B840. Intel : Z890, B860, H810. Plus le chipset est haut, plus il y a de fonctionnalités (OC, PCIe 5.0, USB 4).' },
      { heading: 'VRM', body: 'Le VRM alimente le CPU. Plus de phases + MOSFET robustes = meilleur pour CPU haut de gamme et overclocking.' },
    ],
  },
  psu: {
    title: 'Alimentation — Tout savoir',
    sections: [
      { heading: 'Dimensionnement', body: 'Somme TDP CPU + TBP GPU + 100W (autres). Prévoir 30% de marge. Ex : 600W réels → PSU 800W minimum.' },
      { heading: '12VHPWR', body: 'Nouveau connecteur PCIe 5.0. Jusqu\'à 600W sur un seul câble. Attention aux adaptateurs 8-pin → 12VHPWR : source fréquente de fusion.' },
      { heading: 'Certifications', body: '80 Plus Bronze (84%), Silver (85%), Gold (87%), Platinum (90%), Titanium (92%). Plus haut = meilleur rendement.' },
    ],
  },
  cooling: {
    title: 'Refroidissement — Tout savoir',
    sections: [
      { heading: 'Aircooling', body: 'Noctua NH-D15, Thermalright Peerless Assassin, Deepcool AK620. Pour CPU jusqu\'à 200W en silence.' },
      { heading: 'AIO', body: 'Arctic Liquid Freezer III 360 (rapport qualité/prix imbattable). NZXT Kraken Elite 360 RGB (premium). Radiateur 360mm pour CPU 200W+.' },
      { heading: 'Pâte thermique', body: 'Thermal Grizzly Kryonaut, Noctua NT-H2. Renouveler tous les 3-5 ans. Application : petite noisette au centre du CPU.' },
    ],
  },
  storage: {
    title: 'Stockage — Tout savoir',
    sections: [
      { heading: 'NVMe vs SATA', body: 'NVMe PCIe 4.0 = 7 Go/s. SATA = 550 Mo/s. En usage réel, différence visible sur les transferts massifs et les temps de chargement.' },
      { heading: 'Endurance (TBW)', body: 'Un SSD 2 To typique a 1200 TBW. Au-delà, hors garantie. Surveille avec CrystalDiskInfo.' },
      { heading: 'Slots M.2 partagés', body: 'Certains slots M.2 partagent les lanes PCIe avec des ports SATA. Vérifier le manuel avant d\'utiliser.' },
    ],
  },
  reseau: {
    title: 'Réseau — Tout savoir',
    sections: [
      { heading: 'Ethernet', body: '1 GbE suffit pour la plupart des usages. 2.5 GbE et 5 GbE se démocratisent. Wi-Fi 7 = jusqu\'à 5.8 Gbps théoriques.' },
      { heading: 'Latence en jeu', body: 'Connexion filaire = latence minimale. Wi-Fi 6E/7 OK mais sensible aux interférences. Utilise le câble pour le gaming compétitif.' },
    ],
  },
  depannage: {
    title: 'Dépannage — Tout savoir',
    sections: [
      { heading: 'POST', body: 'Power-On Self-Test : vérification matérielle avant boot. LED debug (CPU, DRAM, VGA, BOOT) ou afficheur 2 chiffres.' },
      { heading: 'BSOD', body: 'Consulte l\'Observateur d\'événements Windows pour identifier le pilote fautif. Lance MemTest86 pour la RAM. DDU pour les pilotes GPU.' },
      { heading: 'Outils', body: 'HWiNFO64 (monitoring), CrystalDiskInfo (SMART SSD), GPU-Z, MemTest86, OCCT (stress test).' },
    ],
  },
};

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');
  const data = KNOWLEDGE[params.slug];
  if (!data) return notFound();

  return (
    <article className="space-y-5 max-w-3xl">
      <Link href="/base-connaissances" className="text-sm text-muted hover:text-text inline-flex items-center gap-1 anim-rise">
        <ArrowLeft className="w-3.5 h-3.5" /> Toutes les catégories
      </Link>

      <section className="module-hero">
        <div className="module-eyebrow mb-2 flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" /> Référence</div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">{data.title}</h1>
      </section>

      {data.sections.map((s, i) => (
        <section key={s.heading} className={`module-frame anim-rise anim-rise-${(i % 4) + 1}`}>
          <h2 className="section-title mb-3">{s.heading}</h2>
          <p className="text-sm text-muted whitespace-pre-line leading-relaxed">{s.body}</p>
        </section>
      ))}
    </article>
  );
}
