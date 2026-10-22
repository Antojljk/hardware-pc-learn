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
  psu: {
    title: 'Alimentation (PSU) — Tout savoir',
    description: 'Choisir une alimentation fiable : certifications 80 Plus, connecteurs, calcul de wattage et sécurité.',
    sections: [
      { heading: 'Rôle de l\'alimentation', body: 'La PSU (Power Supply Unit) convertit le courant alternatif (230 V AC en Europe) en tensions continues utilisables par les composants : 12 V pour CPU/GPU, 5 V pour USB et stockage, 3,3 V pour la mémoire et les circuits logiques. Sa qualité impacte directement la stabilité du PC : une PSU bon marché peut introduire du bruit électrique ou fournir des tensions instables, provoquant crashs et dégâts matériels.' },
      { heading: 'Certifications 80 Plus', body: '80 Plus mesure le rendement énergétique : une PSU 80 Plus Gold convertit 87 % de l\'énergie (le reste part en chaleur). Les niveaux : Standard (80 %), Bronze (85 %), Silver (87 %), Gold (87-90 %), Platinum (89-92 %), Titanium (90-94 %). Un meilleur rendement = moins de chaleur dégagée, facture électrique réduite et composants mieux protégés. Visez minimum Gold pour un usage gaming.' },
      { heading: 'Calcul du wattage', body: 'Pour calculer la puissance nécessaire, additionnez le TDP du CPU (ex : 105 W) et le TGP du GPU (ex : 285 W), ajoutez 80-100 W pour le reste (carte mère, RAM, stockage, ventilateurs) et multipliez par 1,25-1,30 pour une marge de sécurité. Exemple : 105 + 285 + 90 = 480 W × 1,3 = 624 W → choisir une 650 W Gold. Ne jamais fonctionner au-delà de 80 % de la capacité nominale en usage continu.' },
      { heading: 'Connecteurs essentiels', body: '24 broches ATX : alimente la carte mère. 4+4 broches EPS (CPU) : alimente le VRM. 6+2 broches PCIe : alimente le GPU (jusqu\'à 150 W par connecteur). 12VHPWR (16 broches) : connecteur PCIe 5.0 pour GPU RTX 40/50 et RX 7000+, supporte jusqu\'à 600 W sur un seul câble. Important : utiliser les câbles d\'origine de la PSU ; brancher des câbles d\'une autre marque sur une PSU modulaire peut provoquer un court-circuit.' },
      { heading: 'Modulaire vs semi-modulaire vs fixe', body: 'Une PSU fixe a tous ses câbles attachés (moins cher, câblage plus encombrant). Semi-modulaire : les câbles essentiels (24 pins, EPS) sont fixes, les autres sont détachables. Modulaire : tous les câbles sont amovibles pour un montage plus propre. Pour un boîtier ATX standard, la semi-modulaire est le meilleur compromis. Pour un ITX ou un build soigné, la modulaire simplifie le cable management.' },
      { heading: 'Marques et fiabilité', body: 'Les marques réputées pour leur fiabilité : Seasonic (référence), be quiet!, Corsair (gamme RM/HX), EVGA (gamme SuperNOVA), Fractal Design. Évitez les PSU sans marque identifiable, les fausses certifications ou les prix anormalement bas : une PSU de mauvaise qualité peut surtensionner et endommager irrémédiablement CPU, GPU et carte mère.' },
      { heading: 'Durée de vie et garantie', body: 'Les meilleures PSU ont une garantie de 7 à 12 ans (Seasonic Prime, be quiet! Dark Power). La garantie est un indicateur de qualité : les fabricants ne proposent pas de longues garanties sur des composants fragiles. Prévoyez de renouveler la PSU tous les 8-10 ans même si elle fonctionne : les condensateurs vieillissent et un condensateur fatigué peut alimenter irrégulièrement vos composants.' },
    ],
  },
  cooling: {
    title: 'Refroidissement — Tout savoir',
    description: 'Aircooling, watercooling AIO, pâte thermique et optimisation thermique pour des composants stables et silencieux.',
    sections: [
      { heading: 'Pourquoi refroidir ?', body: 'Les processeurs et cartes graphiques génèrent une grande quantité de chaleur lors du fonctionnement. Si la température dépasse le seuil maximal (TJmax : 95-100 °C pour un CPU Ryzen/Intel récent, 83-90 °C pour un GPU), le composant active le thermal throttling : il réduit automatiquement sa fréquence pour éviter de se détruire. Un bon refroidissement permet de maintenir des performances maximales en continu.' },
      { heading: 'Aircooling — ventirad', body: 'Un ventirad (dissipateur à air) est composé d\'un ou plusieurs blocs d\'ailettes en aluminium/cuivre traversés par des caloducs, avec un ou deux ventilateurs. Les modèles de référence : Noctua NH-D15 (excellent pour CPU haut de gamme, silencieux), be quiet! Dark Rock Pro 5, DeepCool AK620. Un bon ventirad aircooling peut égaler un AIO 240 mm pour un coût moindre et une fiabilité supérieure (pas de pompe, pas de risque de fuite).' },
      { heading: 'Watercooling AIO', body: 'Un AIO (All-In-One) est un watercooling préassemblé : pompe + waterblock + radiateur + tuyaux. Les tailles de radiateurs : 120/140/240/280/360/420 mm. Plus le radiateur est grand, meilleures sont les performances. Les marques fiables : Arctic Liquid Freezer III, NZXT Kraken, Corsair iCUE Elite. Avantages : dégagement thermique supérieur pour les CPU très puissants (i9, Ryzen 9), montage visuel soigné. Inconvénient : pompe qui peut tomber en panne après 5-7 ans.' },
      { heading: 'Pâte thermique', body: 'La pâte thermique (TIM) comble les micro-imperfections entre le CPU et le dissipateur pour améliorer la conduction thermique. Les meilleures pastes : Thermal Grizzly Kryonaut (référence gaming), Noctua NT-H2, Arctic MX-6. Méthode d\'application recommandée : une noisette de la taille d\'un grain de riz au centre du CPU. La pâte se répartit seule à la pression. Trop = elle déborde et risque de court-circuiter les condensateurs autour du socket.' },
      { heading: 'Gestion des ventilateurs', body: 'L\'airflow (flux d\'air) dans un boîtier détermine l\'efficacité globale du refroidissement. Configuration optimale : ventilateurs d\'entrée d\'air en façade et en bas, ventilateurs d\'extraction en arrière et en haut. Les connecteurs PWM (4 broches) permettent au BIOS de réguler automatiquement la vitesse selon la température, contrairement aux connecteurs DC (3 broches) qui tournent à vitesse fixe. Paramétrer des courbes de ventilation dans le BIOS réduit le bruit.' },
      { heading: 'Températures normales et alarmes', body: 'Températures de fonctionnement typiques : CPU en gaming 60-80 °C, CPU en charge complète 80-95 °C, GPU en gaming 70-85 °C. Outils de monitoring : HWiNFO64 (le plus complet), MSI Afterburner (GPU), CPU-Z. Si le CPU dépasse 95 °C en usage normal, vérifiez dans cet ordre : pâte thermique bien appliquée, ventirad bien monté, airflow du boîtier, poussière dans les ventilateurs.' },
    ],
  },
  reseau: {
    title: 'Réseau — Tout savoir',
    description: 'Wi-Fi 6/6E/7, Ethernet 2.5G/10G, latence filaire vs sans-fil, et installation des pilotes réseau.',
    sections: [
      { heading: 'Ethernet vs Wi-Fi', body: 'L\'Ethernet (câble RJ45) est toujours préférable pour un PC fixe : latence stable de 1-2 ms, débit maximum garanti, aucune interférence. Le Wi-Fi convient pour les PC portables ou les configurations où le câblage est impossible. Règle générale pour le gaming : Ethernet obligatoire. Pour la bureautique et la vidéo en streaming, le Wi-Fi 6 est suffisant dans un appartement standard.' },
      { heading: 'Standards Ethernet', body: '100 Mb/s (Fast Ethernet) : désuet. 1 Gb/s (Gigabit Ethernet, GbE) : standard actuel sur la plupart des cartes mères. 2,5 Gb/s (2.5GbE) : de plus en plus courant sur les cartes mères milieu/haut de gamme. 10 Gb/s (10GbE) : pour les NAS et les professionnels. Un câble Cat5e suffit pour le Gigabit, Cat6 ou Cat6A pour le 2,5G et 10G. Les switchs non gérés 2,5GbE sont accessibles (~30-50 €).' },
      { heading: 'Wi-Fi 5, 6, 6E, 7', body: 'Wi-Fi 5 (802.11ac) : 3,5 Gb/s théoriques, 5 GHz uniquement. Wi-Fi 6 (802.11ax) : 9,6 Gb/s théoriques, 2,4 et 5 GHz, meilleure gestion des appareils simultanés (OFDMA, MU-MIMO). Wi-Fi 6E : ajoute la bande 6 GHz (moins encombrée, moins de portée). Wi-Fi 7 (802.11be) : jusqu\'à 46 Gb/s théoriques, Multi-Link Operation (MLO) entre bandes. La bande 5 GHz offre un débit supérieur mais une portée moindre que le 2,4 GHz.' },
      { heading: 'Cartes réseau intégrées et PCIe', body: 'La plupart des cartes mères intègrent un contrôleur Ethernet 2.5GbE (Realtek ou Intel). Pour le Wi-Fi, les cartes mères milieu/haut de gamme intègrent un module Wi-Fi (Intel AX210/AX411 pour Wi-Fi 6E/7). Si la carte mère n\'a pas de Wi-Fi intégré, on ajoute une carte PCIe Wi-Fi (ex : Intel Wi-Fi 6E AX210 sur slot M.2 Key E) ou un adaptateur USB (moins performant et plus sujet aux interférences).' },
      { heading: 'Latence réseau et gaming', body: 'La latence (ping) est le délai aller-retour entre votre PC et le serveur. Elle dépend de la distance physique, de la qualité de votre connexion internet et du câble/Wi-Fi local. Un câble Ethernet ajoute ~0,1 ms de latence locale contre 5-20 ms en Wi-Fi. Pour le gaming compétitif, la stabilité de la latence (jitter) est plus importante que la valeur moyenne : un ping de 20 ms stable est meilleur qu\'un ping de 10 ms qui varie entre 5 et 40 ms.' },
      { heading: 'Installation des pilotes réseau', body: 'Après une installation propre de Windows, le pilote réseau peut être absent, rendant la connexion internet impossible. Solution : télécharger le pilote réseau sur un autre PC, le transférer par clé USB. Les pilotes sont disponibles sur le site du fabricant de la carte mère (section Support/Drivers). Pour les cartes mères AMD avec puce Realtek, télécharger le pilote depuis le site Realtek ou AMD. Après installation, redémarrer et activer XMP/EXPO dans le BIOS.' },
    ],
  },
  depannage: {
    title: 'Dépannage — Tout savoir',
    description: 'Diagnostiquer POST, BSOD, redémarrages, artefacts GPU et pannes courantes méthodiquement.',
    sections: [
      { heading: 'Méthode de dépannage', body: 'Le dépannage efficace repose sur la méthode d\'élimination : isoler une variable à la fois. Ne jamais changer plusieurs composants simultanément. Commencez par les causes les plus fréquentes et les moins coûteuses à vérifier : câbles débranché, RAM mal insérée, pilote corrompu. Notez chaque test effectué pour ne pas répéter les mêmes vérifications.' },
      { heading: 'PC qui ne démarre pas — POST', body: 'Le POST (Power-On Self-Test) est le test initial au démarrage. Codes habituels : LED debug CPU = problème CPU ou BIOS incompatible ; LED DRAM = problème RAM (essayer un seul stick en slot A2) ; LED VGA = GPU ou slot PCIe ; LED BOOT = disque introuvable. Procédure : débrancher tous les périphériques inutiles, tester avec 1 seul stick RAM, retirer le GPU (si iGPU disponible), effectuer un Clear CMOS (cavalier ou bouton sur la carte mère).' },
      { heading: 'BSOD (Écran bleu)', body: 'Un BSOD indique une erreur critique. Les codes les plus courants : MEMORY_MANAGEMENT ou PAGE_FAULT → RAM instable (tester avec MemTest86, désactiver XMP) ; SYSTEM_THREAD_EXCEPTION → pilote corrompu (DDU pour GPU, pilote chipset) ; CRITICAL_PROCESS_DIED → OS corrompu ou SSD défaillant (CrystalDiskInfo) ; IRQL_NOT_LESS_OR_EQUAL → conflit de pilote. Outil : WhoCrashed analyse les fichiers minidump et identifie le pilote fautif.' },
      { heading: 'PC qui redémarre ou s\'éteint seul', body: 'Causes fréquentes : surchauffe (vérifier HWiNFO64 en charge), alimentation sous-dimensionnée ou défaillante, RAM instable avec XMP activé, overclocking trop agressif. Procédure : surveiller les températures en charge (CPU > 95 °C suspect), tester sans XMP, tester avec une autre PSU si possible, remettre les fréquences d\'usine. Un PC qui s\'éteint brutalement sans BSOD pointe souvent vers la PSU ou la thermique.' },
      { heading: 'Artefacts visuels et crashs GPU', body: 'Les artefacts (pixels colorés, triangles, bandes) indiquent une VRAM défectueuse ou un GPU sous-tension. Procédure : 1) Désinstaller le pilote avec DDU en mode sans échec. 2) Réinstaller le dernier pilote stable. 3) Tester avec MSI Kombustor ou FurMark. 4) Sous-clocker légèrement le GPU (-100 MHz). 5) Si la pâte thermique du GPU a plus de 5 ans, la renouveler. 6) Tester dans un autre slot PCIe ou avec un autre câble d\'alimentation.' },
      { heading: 'SSD non détecté', body: 'Si un SSD NVMe n\'apparaît pas dans le BIOS : vérifier que le slot M.2 utilisé est compatible NVMe (certains slots ne supportent que SATA). Vérifier dans les réglages BIOS que le slot M.2 est activé. Certains slots M.2 partagent des lanes avec des ports SATA : brancher un SSD NVMe peut désactiver 1-2 ports SATA (lire le manuel de la carte mère). Mettre à jour le BIOS peut corriger des problèmes de détection avec de nouveaux modèles de SSD.' },
      { heading: 'Outils de diagnostic indispensables', body: 'MemTest86 : test RAM complet (bootable USB, minimum 1 heure). CrystalDiskInfo : santé SMART du SSD/HDD. HWiNFO64 : monitoring complet températures, tensions, fréquences. WhoCrashed : analyse des minidumps BSOD. DDU (Display Driver Uninstaller) : désinstallation propre des pilotes GPU. CineBench R24 : stabilité CPU sous charge. MSI Kombustor : stabilité GPU sous charge.' },
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
