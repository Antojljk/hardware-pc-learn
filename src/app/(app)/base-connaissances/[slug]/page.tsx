import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Metadata } from 'next';

const KNOWLEDGE: Record<string, { title: string; description: string; sections: { heading: string; body: string }[] }> = {
  cpu: {
    title: 'CPU — Tout savoir',
    description: 'Apprenez tout sur les processeurs : cœurs, threads, fréquence, IPC, architectures AMD et Intel, TDP et overclocking.',
    sections: [
      { heading: 'Qu\'est-ce qu\'un CPU ?', body: 'Le Central Processing Unit (CPU) est le cerveau de l\'ordinateur. Son rôle est d\'interpréter et d\'exécuter les instructions des logiciels en effectuant des calculs arithmétiques et logiques. Il coordonne le flux de données entre la mémoire vive, le stockage et les autres périphériques. Sans lui, aucune opération ne peut être lancée, car il pilote l\'ensemble du système via des cycles d\'horloge précis.' },
      { heading: 'Cœurs et Threads', body: 'Un cœur physique est une unité de calcul indépendante. Plus un CPU a de cœurs, plus il peut traiter de tâches simultanément (multitâche). Le Multi-Threading (SMT chez AMD, Hyper-Threading chez Intel) permet à un seul cœur physique de gérer deux flux d\'instructions (threads). Cela optimise l\'utilisation des ressources du cœur en comblant les temps d\'attente, améliorant ainsi les performances globales dans les logiciels optimisés.' },
      { heading: 'Fréquence et IPC', body: 'La fréquence (exprimée en GHz) indique le nombre de cycles par seconde. Cependant, elle ne suffit pas à définir la puissance. L\'IPC (Instructions Per Cycle) mesure combien d\'opérations le CPU réalise en un seul cycle. Un processeur avec une fréquence plus basse mais un IPC plus élevé sera souvent plus rapide qu\'un ancien processeur cadencé très haut. C\'est pourquoi on compare toujours les générations d\'architectures.' },
      { heading: 'La Hiérarchie du Cache (L1, L2, L3)', body: 'Le cache est une mémoire ultra-rapide intégrée au CPU pour éviter d\'attendre les données de la RAM. Le L1 est le plus petit et le plus rapide, situé au cœur du processeur. Le L2 est intermédiaire. Le L3 est plus large et partagé entre tous les cœurs. Un cache L3 important (comme le 3D V-Cache d\'AMD) réduit drastiquement les temps de latence, ce qui booste significativement les performances, notamment dans les jeux vidéo.' },
      { heading: 'TDP et Consommation Réelle', body: 'Le TDP (Thermal Design Power) indique la chaleur que le système de refroidissement doit pouvoir dissiper. Ce n\'est pas la consommation électrique exacte. En mode Boost, un CPU peut consommer bien plus que son TDP nominal (via les limites PL1/PL2 chez Intel ou PPT chez AMD). Il est crucial de choisir un refroidissement basé sur la consommation réelle en charge et non uniquement sur le chiffre du TDP pour éviter le thermal throttling.' },
      { heading: 'Architectures : AMD vs Intel', body: 'AMD utilise actuellement l\'architecture Zen avec le socket AM5, privilégiant l\'efficacité énergétique et la longévité du socket. Intel propose des architectures hybrides avec des P-cores (Performance) pour les tâches lourdes et des E-cores (Efficiency) pour le fond et l\'économie d\'énergie. Le choix dépend de l\'usage : Intel est souvent dominant en productivité monocœur, tandis qu\'AMD excelle en efficacité et gaming grâce au cache étendu.' },
      { heading: 'Comment choisir son CPU ?', body: 'Le choix dépend de l\'usage principal. Pour du gaming, 6 à 8 cœurs rapides suffisent. Pour du montage vidéo, du rendu 3D ou du streaming, visez 12 cœurs ou plus. Vérifiez également la génération : un i5 récent battra souvent un i9 d\'il y a trois ans. Enfin, considérez le budget global, car un CPU trop puissant peut nécessiter une carte mère et un refroidissement coûteux.' },
      { heading: 'Compatibilité et Socket', body: 'Le socket est l\'interface physique entre le CPU et la carte mère. Un CPU AM5 ne rentrera jamais dans un socket AM4 ou LGA1700. Au-delà du socket, le chipset de la carte mère détermine les fonctionnalités disponibles (overclocking, nombre de lignes PCIe). Vérifiez toujours la liste de support (QVL) du fabricant de la carte mère pour être certain que le processeur et la version du BIOS sont compatibles.' },
    ],
  },
  gpu: {
    title: 'GPU — Tout savoir',
    description: 'Maîtrisez le fonctionnement des cartes graphiques : architectures, VRAM, Ray Tracing et technologies d\'upscaling.',
    sections: [
      { heading: 'Le rôle du GPU', body: 'Le Graphics Processing Unit est spécialisé dans le calcul parallèle massif. Contrairement au CPU qui gère quelques tâches complexes, le GPU gère des milliers de petits calculs simultanément pour calculer la couleur de chaque pixel à l\'écran. Aujourd\'hui, il est aussi utilisé pour l\'IA et le calcul scientifique (GPGPU) grâce à sa capacité à traiter d\'énormes volumes de données en parallèle.' },
      { heading: 'Architectures Modernes', body: 'NVIDIA domine avec Ada Lovelace et Blackwell, utilisant des Tensor Cores pour l\'IA et des RT Cores pour le Ray Tracing. AMD propose RDNA 3, misant sur un design de chiplets pour réduire les coûts et augmenter les performances. Intel entre dans la course avec Arc Alchemist. Chaque architecture apporte des gains en efficacité énergétique et en nombre d\'opérations par seconde (TFLOPS).' },
      { heading: 'Comprendre la VRAM', body: 'La VRAM est la mémoire dédiée du GPU. Elle stocke les textures, les modèles 3D et le frame buffer. Plus la résolution (4K) et la qualité des textures sont hautes, plus on a besoin de VRAM. La norme GDDR6X est la plus rapide actuellement. Si la VRAM est saturée, le GPU pioche dans la RAM système, ce qui provoque des chutes brutales de performances (stutters).' },
      { heading: 'Ray Tracing et Lumen', body: 'Le Ray Tracing simule le comportement physique de la lumière (reflets, ombres, réfractions) en traçant des rayons. C\'est extrêmement gourmand en ressources. Pour compenser, on utilise des techniques de débruitage (denoising) et l\'IA. Des moteurs comme Unreal Engine 5 avec Lumen poussent ce concept plus loin pour créer des environnements dynamiques et photoréalistes en temps réel.' },
      { heading: 'Upscaling : DLSS, FSR et XeSS', body: 'L\'upscaling permet de calculer l\'image dans une résolution faible (ex: 1080p) et de l\'agrandir intelligemment vers la 4K. Le DLSS de NVIDIA utilise l\'IA et des cœurs dédiés pour une qualité supérieure. Le FSR d\'AMD est open source et compatible avec presque tous les GPU. Le XeSS d\'Intel suit une approche similaire. Ces technologies sont essentielles pour maintenir un framerate élevé en Ray Tracing.' },
      { heading: 'TGP et Alimentation', body: 'Le Total Graphics Power (TGP) définit la consommation maximale du GPU. Les cartes haut de gamme demandent des alimentations robustes et des connecteurs spécifiques (comme le 12VHPWR). Un mauvais câblage ou une alimentation de mauvaise qualité peut entraîner des instabilités ou, dans le pire des cas, des dommages matériels dus à des pics de consommation (transients).' },
      { heading: 'Choisir son GPU selon la résolution', body: 'Pour du 1080p, un GPU d\'entrée ou milieu de gamme suffit. Pour le 1440p, visez un modèle avec au moins 12 Go de VRAM. Pour la 4K, 16 Go ou plus sont recommandés pour éviter les limitations. Ne négligez pas le processeur : un GPU trop puissant avec un CPU faible créera un "bottleneck", limitant les performances de la carte graphique.' },
      { heading: 'Drivers et Optimisation', body: 'Les pilotes (drivers) sont essentiels pour le support des nouveaux jeux et la correction de bugs. NVIDIA et AMD publient régulièrement des mises à jour. Pour optimiser, on peut utiliser le sous-voltage (undervolting), qui consiste à réduire la tension du GPU pour baisser la température et le bruit sans perdre de performances, prolongeant ainsi la durée de vie du matériel.' },
    ],
  },
  ram: {
    title: 'RAM — Tout savoir',
    description: 'Tout comprendre sur la mémoire vive : DDR5, timings, Dual Channel, XMP/EXPO et influence sur les performances.',
    sections: [
      { heading: 'Qu\'est-ce que la RAM ?', body: 'La Random Access Memory est une mémoire volatile ultra-rapide qui stocke temporairement les données dont le CPU a besoin immédiatement. Contrairement au SSD, elle s\'efface à l\'extinction du PC. Plus on a de RAM, plus on peut ouvrir de logiciels lourds simultanément sans que le système ne ralentisse en utilisant le "fichier d\'échange" (swap) sur le disque dur.' },
      { heading: 'DDR4 vs DDR5', body: 'La DDR5 apporte une augmentation massive de la bande passante et une consommation réduite. Elle intègre désormais la gestion de l\'alimentation (PMIC) directement sur la barrette plutôt que sur la carte mère. Elle permet des fréquences bien plus hautes (6000 MHz+ contre 3200-3600 MHz pour la DDR4), ce qui booste les performances dans les tâches gourmandes en données.' },
      { heading: 'Fréquences et Timings (CAS)', body: 'La fréquence (MHz) est la vitesse de transfert. Les timings (comme le CL ou CAS Latency) représentent le délai avant que la RAM ne commence à envoyer des données. Une RAM rapide a une fréquence haute et des timings bas. Le compromis idéal (sweet spot) dépend du processeur. Par exemple, sur AM5, la DDR5-6000 CL30 est souvent le meilleur choix en termes de latence et de stabilité.' },
      { heading: 'Le Dual Channel', body: 'Le Dual Channel permet au CPU d\'accéder à deux canaux de mémoire simultanément, doublant ainsi la bande passante théorique. Pour l\'activer, il faut installer les barrettes par paires dans les slots appropriés (souvent A2 et B2). Utiliser un seul stick (Single Channel) peut brider les performances du processeur de 10 à 30 %, particulièrement dans les jeux et les applications de création.' },
      { heading: 'Profils XMP et EXPO', body: 'Par défaut, la RAM tourne à une vitesse standard basse. XMP (Intel) et EXPO (AMD) sont des profils d\'overclocking d\'usine stockés dans la barrette. Il faut les activer dans le BIOS pour que la RAM tourne à la vitesse promise sur la boîte. Si le système devient instable (BSOD), il peut être nécessaire de baisser légèrement la fréquence ou d\'augmenter la tension (Voltage).' },
      { heading: 'Quelle quantité de RAM choisir ?', body: '16 Go est le minimum actuel pour le gaming et la bureautique. 32 Go devient la norme pour le multitâche, le montage vidéo léger et les jeux modernes gourmands. 64 Go ou plus sont réservés aux professionnels de la 3D, de la virtualisation ou du montage 4K. Installer trop de RAM n\'augmente pas la vitesse, cela évite simplement les ralentissements dus au manque de place.' },
      { heading: 'Latence vs Bande passante', body: 'La bande passante est la quantité de données transférées par seconde, tandis que la latence est le temps de réponse. Pour le gaming, la latence est souvent plus critique. Pour le rendu vidéo, c\'est la bande passante qui prime. C\'est pourquoi une RAM avec une fréquence très élevée mais des timings très lâches peut être moins performante qu\'une RAM légèrement plus lente mais très réactive.' },
      { heading: 'Compatibilité et Slots', body: 'Il est fortement déconseillé de mélanger des barrettes de marques, fréquences ou capacités différentes, car la carte mère alignera toutes les barrettes sur la plus lente et risque d\'être instable. Vérifiez toujours que votre carte mère supporte la fréquence choisie. Sur certains laptops, la RAM est soudée (LPDDR), ce qui rend toute amélioration impossible.' },
    ],
  },
  storage: {
    title: 'Stockage — Tout savoir',
    description: 'Guide complet sur SSD NVMe, SATA, endurance TBW et technologies de stockage modernes.',
    sections: [
      { heading: 'SSD vs HDD', body: 'Le HDD (Hard Disk Drive) utilise des plateaux magnétiques rotatifs, ce qui le rend lent et fragile. Le SSD (Solid State Drive) utilise de la mémoire Flash, offrant des vitesses de lecture/écriture des dizaines de fois supérieures. Aujourd\'hui, le SSD est indispensable pour le système d\'exploitation et les applications, tandis que le HDD ne sert plus qu\'au stockage de masse (archives, films, backups).' },
      { heading: 'Le standard NVMe et PCIe', body: 'Le NVMe (Non-Volatile Memory express) est un protocole optimisé pour les SSD, utilisant le bus PCIe pour communiquer directement avec le CPU. Le PCIe 3.0 plafonne à ~3,5 Go/s, le 4.0 à ~7,5 Go/s et le 5.0 à ~14 Go/s. Cette vitesse réduit les temps de chargement des jeux et accélère massivement le transfert de gros fichiers.' },
      { heading: 'SATA et Formats M.2', body: 'Le SATA est l\'ancien standard (limité à 560 Mo/s). On le trouve en format 2.5 pouces ou M.2. Le format M.2 est une petite carte qui se branche directement sur la carte mère. Attention : un slot M.2 peut supporter du SATA ou du NVMe. Vérifiez toujours la compatibilité du slot avant l\'achat pour ne pas vous retrouver avec un disque non reconnu.' },
      { heading: 'Endurance et TBW', body: 'Les cellules de mémoire Flash s\'usent à chaque écriture. Le TBW (Total Bytes Written) indique la quantité totale de données qu\'un SSD peut écrire avant que les cellules ne risquent de faillir. Un SSD de 2 To a souvent un TBW de 1200 To. Pour un usage normal, cela représente des dizaines d\'années, mais pour des serveurs ou du montage vidéo intensif, c\'est un point critique.' },
      { heading: 'DirectStorage et 미래 du Gaming', body: 'Le DirectStorage est une technologie Microsoft qui permet au GPU de charger les données du SSD NVMe sans passer par le CPU. Cela élimine les écrans de chargement et permet des mondes ouverts beaucoup plus denses et détaillés. C\'est une technologie similaire à celle des consoles PS5/Xbox Series, qui transforme la façon dont les jeux sont conçus.' },
      { heading: 'Gestion du cache SLC', body: 'Beaucoup de SSD utilisent du TLC ou QLC (plus de bits par cellule, moins cher). Pour maintenir la vitesse, ils utilisent une portion de "cache SLC" (1 bit par cellule). Une fois ce cache plein lors d\'un transfert massif, la vitesse chute brutalement pour atteindre la vitesse réelle de la mémoire TLC/QLC. C\'est pourquoi certains SSD "entrée de gamme" ralentissent après 50 Go d\'écriture.' },
      { heading: 'Sauvegarde et RAID', body: 'Le RAID (Redundant Array of Independent Disks) permet de combiner plusieurs disques. Le RAID 0 augmente la vitesse (striping) mais si un disque meurt, tout est perdu. Le RAID 1 duplique les données (mirroring) pour la sécurité. Pour un utilisateur domestique, un backup régulier sur un disque externe ou dans le cloud reste la solution la plus sûre et simple.' },
      { heading: 'Comment choisir son SSD ?', body: 'Pour Windows et les apps : un NVMe PCIe 4.0 de 500 Go ou 1 To suffit. Pour le gaming : un NVMe de 2 To est recommandé vu la taille des jeux modernes. Pour le stockage de masse : un gros HDD de 4 To+ ou un SSD SATA bon marché. Vérifiez toujours la présence d\'un dissipateur thermique pour les NVMe PCIe 4.0/5.0, car ils peuvent chauffer et ralentir.' },
    ],
  },
  motherboard: {
    title: 'Carte mère — Tout savoir',
    description: 'Comprendre les chipsets, sockets, VRM et connectivités pour choisir la base solide de son PC.',
    sections: [
      { heading: 'Le rôle de la Carte Mère', body: 'La carte mère (Mainboard) est le système nerveux du PC. Elle relie tous les composants : CPU, RAM, GPU, stockage et périphériques. Elle gère la distribution électrique via les VRM et assure la communication entre les éléments via des bus de données (comme le PCIe). La qualité d\'une carte mère se juge à la robustesse de ses composants et à la richesse de ses connectiques.' },
      { heading: 'Sockets et Compatibilité', body: 'Le socket est l\'emplacement physique du CPU. Chaque génération de processeur a souvent son propre socket (ex: LGA1700 pour Intel 12-14th, AM5 pour AMD Ryzen 7000+). Un mauvais choix de socket rend le CPU incompatible. AMD est connu pour garder ses sockets plusieurs années (AM4 a duré très longtemps), facilitant ainsi les mises à jour futures sans changer de carte mère.' },
      { heading: 'Les Chipsets (Z, B, H / X, B, A)', body: 'Le chipset est le centre de contrôle de la carte mère. Chez Intel, le Z permet l\'overclocking, le B est polyvalent et le H est basique. Chez AMD, le X est premium, le B est le meilleur rapport qualité/prix et l\'A est pour le budget. Le chipset détermine le nombre de ports USB, de lignes PCIe pour les SSD et les capacités de connectivité réseau.' },
      { heading: 'L\'étage d\'alimentation (VRM)', body: 'Le Voltage Regulator Module (VRM) convertit le 12V de l\'alimentation en une tension très basse et précise pour le CPU. Un bon VRM (nombre de phases élevé et MOSFET de qualité) évite la surchauffe et permet un overclocking stable. Sur les cartes bas de gamme, des VRM médiocres peuvent brider un CPU puissant en provoquant du throttling thermique sur la carte mère elle-même.' },
      { heading: 'Le Bus PCIe et les Lignes', body: 'Le PCIe (Peripheral Component Interconnect Express) est l\'autoroute des données. Le GPU utilise généralement un slot x16. Les SSD NVMe utilisent des lignes x4. Si vous installez trop de périphériques, certaines lignes peuvent être partagées, réduisant la vitesse d\'un SSD ou d\'un port PCIe. Le PCIe 5.0 double la bande passante du 4.0, crucial pour les futurs GPU et SSD.' },
      { heading: 'Connectique et I/O', body: 'Le panneau arrière offre les ports USB (3.2, Type-C), l\'Ethernet, l\'Audio et parfois le Wi-Fi/Bluetooth. À l\'intérieur, on trouve les headers pour les ventilateurs, le RGB et le panneau frontal. Une bonne carte mère propose suffisamment de headers pour un refroidissement complet et des ports USB rapides pour les transferts de données massifs.' },
      { heading: 'Format : ATX, Micro-ATX, ITX', body: 'Le format détermine la taille du boîtier. L\'ATX est le standard (plus de slots, meilleur refroidissement). Le Micro-ATX est compact et économique. Le Mini-ITX est minuscule, idéal pour les PC SFF (Small Form Factor), mais limite le nombre de slots RAM et PCIe et rend le montage plus complexe et la dissipation thermique plus difficile.' },
      { heading: 'BIOS et Mise à jour', body: 'Le BIOS (ou UEFI) est le premier logiciel lancé au démarrage. Il configure le matériel avant le boot de Windows. Mettre à jour le BIOS peut être nécessaire pour supporter un nouveau CPU ou améliorer la stabilité de la RAM (XMP/EXPO). Attention : une coupure de courant pendant un flash BIOS peut rendre la carte mère inutilisable, sauf si elle possède un bouton BIOS Flashback.' },
    ],
  },
};
export async function generateStaticParams() {
  return Object.keys(KNOWLEDGE).map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const data = KNOWLEDGE[slug];
  if (!data) return { title: 'Page non trouvée' };

  return {
    title: `${data.title} | HardwarePC`,
    description: data.description,
  };
}

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
