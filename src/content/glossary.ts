// Glossaire hardware — 300+ termes
export type Term = {
  slug: string;
  term: string;
  simple: string;
  technical: string;
  example?: string;
  level: 'debutant' | 'intermediaire' | 'avance' | 'expert';
  categories: string[];
};

const t = (slug: string, term: string, simple: string, technical: string, level: Term['level'], categories: string[], example?: string): Term => ({
  slug, term, simple, technical, level, categories, example,
});

export const TERMS: Term[] = [
  // A
  t('aio','AIO (All-In-One)','Watercooling avec radiateur, pompe et waterblock pré-montés.','Solution de refroidissement liquide fermée. Pompe dans le waterblock, radiateur avec ventilateurs, tubes rigides ou souples. Maintenance : quasi nulle, durée ~5-7 ans.','debutant',['cooling'],'Arctic Liquid Freezer III 360, NZXT Kraken Elite 360'),
  t('airflow','Airflow','Circulation d\'air dans le boîtier, du frais vers le chaud.','L\'air frais entre par l\'avant/bas, traverse les composants chauffants, sort par l\'arrière/haut chargé en chaleur. Pression positive ou négative selon la configuration des ventilateurs.','intermediaire',['cooling','build']),
  t('ahci','AHCI','Ancien standard pour SSD SATA, bridé à 1 commande par file.','Advanced Host Controller Interface. Prévu pour les HDD, limité à 32 files de commandes et 1 commande par file. Remplacé par NVMe pour les SSD.','avance',['storage','interfaces']),
  t('ai-tensor-core','AI / Tensor Core','Unité GPU dédiée à l\'IA (matrix math).','Présents sur NVIDIA depuis Volta. Utilisés pour DLSS, accélération d\'inférence, calculs INT8/FP16.','avance',['gpu','arch_gpu']),
  t('apu','APU','CPU avec GPU intégré sur la même puce.','Accelerated Processing Unit (AMD) ou Intel CPU avec iGPU. Partage la RAM système comme VRAM. Performances modestes mais suffisantes pour bureautique.','debutant',['cpu','gpu']),
  t('atx','ATX','Format standard de carte mère (305×244mm).','Standard depuis 1995 (Intel). Alimentation ATX 24-pin. Slots d\'extension PCIe à l\'arrière.','debutant',['motherboard']),
  t('atx-connector','24-pin ATX','Connecteur principal d\'alimentation de la carte mère.','ATX 24 broches : 12V, 5V, 3.3V. Alimente la CM et indirectement tous les autres composants.','intermediaire',['psu']),

  // B
  t('bandwidth','Bande passante','Quantité de données transmises par seconde.','Mesurée en Go/s. PCIe 5.0 x16 = ~126 Go/s. RAM DDR5-6000 dual channel = ~96 Go/s.','intermediaire',['memory_tech','interfaces']),
  t('bc1','Binning','Tri des puces selon leurs performances.','Les meilleures puces deviennent des modèles haut de gamme, les moins bonnes en entrée de gamme. Explique la "silicon lottery" en overclocking.','avance',['cpu','gpu']),
  t('benchmark','Benchmark','Programme de mesure des performances.','Cinebench (CPU), 3DMark (GPU), PCMark (usage général). Score reproductible.','debutant',['benchmarks']),
  t('bifurcation','Bifurcation PCIe','Diviser un slot x16 en x8/x8 ou x4/x4/x4/x4.','Permet d\'utiliser un slot CPU pour plusieurs SSD NVMe ou GPU. Utilisé en serveur.','avance',['interfaces']),
  t('bios','BIOS','Ancien firmware de carte mère (avant UEFI).','Basic Input Output System. Remplacé par UEFI depuis 2010. Mode Legacy 16-bit.','intermediaire',['firmware']),
  t('boost','Boost CPU','Fréquence au-delà de la base si conditions thermiques/puissance le permettent.','Boost single-core plus élevé que all-core. Limité par Tjmax et PL2.','debutant',['cpu','arch_cpu']),
  t('bottleneck','Bottleneck','Quand un composant limite les performances globales.','Typiquement CPU en 1080p, GPU en 4K. Dépend du jeu et des paramètres.','avance',['diagnostic','build','benchmarks']),
  t('branch-prediction','Branch Prediction','Le CPU devine l\'issue d\'un if/else.','Mécanisme critique pour l\'IPC. TAGE (TaGged GEometric history length) est l\'état de l\'art.','expert',['cpu','arch_cpu']),

  // C
  t('cache-l1','Cache L1','Mémoire ultra-rapide du CPU, 32-64 Ko par cœur.','Latence ~1ns. Séparée instructions/données (Harvard).','intermediaire',['cpu','memory_tech']),
  t('cache-l2','Cache L2','Cache CPU privé par cœur, 512 Ko à 1 Mo.','Latence ~3-5ns. Sur Zen 5 : 1 Mo par cœur.','intermediaire',['cpu','memory_tech']),
  t('cache-l3','Cache L3','Cache partagé entre tous les cœurs, 16-128 Mo.','Latence ~10-15ns. Le 3D V-Cache d\'AMD empile du L3 sur le die.','intermediaire',['cpu','memory_tech']),
  t('cas-latency','CAS Latency (CL)','Délai en cycles entre une demande et la 1re donnée.','CL30 à 6000 MT/s = 10ns. Latence réelle = CL × 2000 / MT/s.','intermediaire',['ram']),
  t('chassis','Boîtier','Enveloppe du PC, format ATX/mATX/ITX.','Héberge CM, GPU, PSU, stockage. Critiques : longueur GPU, hauteur CPU cooler, ventilation.','debutant',['cooling','build']),
  t('chipset','Chipset','Circuit additionnel qui étend les capacités du CPU.','AMD B650/X870, Intel Z890/B860. PCIe lanes additionnelles, USB, SATA, réseau.','intermediaire',['motherboard']),
  t('clear-cmos','Clear CMOS','Réinitialiser les paramètres du BIOS.','Retirer la pile CR2032 ou utiliser le jumper. Utile en cas d\'OC raté ou boot impossible.','expert',['firmware']),
  t('clk','CLK / Clock','Signal d\'horloge qui cadence le CPU.','1 cycle d\'horloge à 5 GHz = 0,2 ns.','intermediaire',['cpu','arch_cpu']),
  t('closed-loop','Closed-loop','AIO watercooling, waterblock + pompe + radiateur en boucle fermée.','Contrairement au custom loop, pas de maintenance ni remplissage.','intermediaire',['cooling']),
  t('cmos','CMOS','Mémoire qui stocke les paramètres du BIOS.','Alimentée par une pile CR2032. Clear CMOS = réinitialiser.','intermediaire',['firmware']),
  t('core','Cœur (Core)','Unité d\'exécution indépendante du CPU.','Chaque cœur peut exécuter un thread. Plus de cœurs = plus de calculs parallèles.','debutant',['cpu','arch_cpu']),
  t('cpu','CPU','Processeur central : exécute les instructions.','Central Processing Unit. Cerveau du PC.','debutant',['cpu']),
  t('custom-loop','Custom Loop','Watercooling assemblé manuellement avec composants séparés.','Waterblock, radiateur, pompe, réservoir, tubes. Performances max et esthétique, mais maintenance et risques de fuite.','avance',['cooling']),

  // D
  t('ddr','DDR','Double Data Rate : transfère 2x par cycle.','DDR, DDR2, DDR3, DDR4, DDR5. Chaque génération augmente la fréquence et réduit la tension.','debutant',['ram']),
  t('ddr5','DDR5','Standard RAM actuel, 4800-8000+ MT/s.','PMIC intégré sur le module, on-die ECC, plus économe (1.1V).','debutant',['ram']),
  t('ddr4','DDR4','Ancien standard RAM, 2133-3200 MT/s.','1.2V, encore utilisé mais en fin de vie. Pas compatible avec DDR5.','debutant',['ram']),
  t('debug-led','LED Debug','LEDs sur la carte mère qui indiquent où le boot bloque.','CPU, DRAM, VGA, BOOT. Plus moderne que les bips BIOS.','intermediaire',['diagnostic','motherboard']),
  t('ddr-bios','DDR BIOS','Section du BIOS pour configurer la RAM.','Activer XMP/EXPO, ajuster timings, tension DRAM, FCLK.','intermediaire',['firmware','ram']),
  t('dimm','DIMM','Format des modules de RAM pour PC de bureau.','288 broches en DDR5, 288 en DDR4 aussi (mais encoche différente).','debutant',['ram']),
  t('dlss','DLSS','IA d\'upscaling NVIDIA pour augmenter les FPS.','Deep Learning Super Sampling. Tensor cores rendent en interne plus basse résolution, upscalent via réseau neuronal.','intermediaire',['gpu']),
  t('dpc-latency','DPC Latency','Latence des Deferred Procedure Calls Windows.','Si élevée : glitches audio, drop FPS. Souvent liée aux pilotes Wi-Fi/USB.','avance',['driver_os','diagnostic']),
  t('dram','DRAM','Type de mémoire utilisée pour la RAM.','Dynamic Random Access Memory. Besoin de rafraîchissement constant.','debutant',['ram']),
  t('driver','Pilote','Logiciel qui fait communiquer l\'OS avec le matériel.','NVIDIA/AMD pour GPU, Intel/AMD pour chipset. Mise à jour régulière.','debutant',['driver_os']),
  t('dr-bridge','DrMOS','Composant VRM intégré MOSFET haut + bas + driver.','Plus efficace qu\'un design discret, utilisé sur cartes mères modernes.','avance',['vrm']),

  // E
  t('ecc','ECC','Mémoire avec correction d\'erreur.','Error-Correcting Code. Détecte et corrige les erreurs bit. Crucial en serveur.','avance',['ram','memory_tech']),
  t('edc','EDC','Limite de courant électrique CPU AMD.','Electrical Design Current. Avec PPT et TDC, définit les power limits.','expert',['cpu','overclock']),
  t('efuse','eFuse','Protection électronique sur les cartes mères modernes.','Coupe un port PCIe/M.2 en cas de court-circuit. Empêche la propagation des pannes.','expert',['motherboard']),
  t('expo','EXPO','AMD Extended Profile for Overclocking.','Profil préconfiguré pour DDR5, équivalent AMD d\'XMP.','debutant',['ram','overclock']),
  t('exotic-timings','Timings exotiques','Réglages mémoire avancés (tRFC, tREFI, ProcODT...).','Nécessitent Oscilloscope ou Ryzen DRAM Calculator.','expert',['ram','overclock']),
  t('eps','EPS','Connecteur 8-pin qui alimente le CPU depuis la PSU.','ATX12V. Sur les CPU haut de gamme : 2 connecteurs 8-pin (EPS + ATX12V).','intermediaire',['psu']),

  // F
  t('fclk','FCLK','Horloge Infinity Fabric AMD AM5.','Doit être synchronisée avec MCLK. Ratio optimal 1:1 (jusqu\'à 2000 MHz).','avance',['cpu','memory_tech']),
  t('fps','FPS','Images par seconde.','Framerate. 60 FPS = fluide, 144 FPS = très fluide, 240 FPS = esport.','debutant',['benchmarks']),
  t('frametime','Frametime','Temps entre 2 images, en ms.','16.67 ms = 60 FPS. Variabilité = stuttering. Mesurable avec CapFrameX.','avance',['benchmarks']),
  t('fsr','FSR','AMD FidelityFX Super Resolution.','Upscaling concurrent de DLSS, basé sur algorithme spatial (FSR 1/2) ou temporel + IA (FSR 3/4).','intermediaire',['gpu']),
  t('full-custom','Full Custom','Echec en VRM : MOSFET pilote la phase entière.','Plus complexe mais plus efficace que les MOSFET discrets.','expert',['vrm']),

  // G
  t('gddr6','GDDR6','VRAM moderne pour GPU milieu de gamme.','14-18 Gbps par pin. Présente sur RTX 30 series et RX 6000.','intermediaire',['gpu','memory_tech']),
  t('gddr6x','GDDR6X','VRAM ultra-rapide pour GPU haut de gamme.','21-32 Gbps via PAM4. Présente sur RTX 4080/4090.','avance',['gpu','memory_tech']),
  t('gddr7','GDDR7','Nouveau standard VRAM 2025+.','32-48 Gbps via PAM3. Présent sur RTX 50 series.','avance',['gpu','memory_tech']),
  t('gpu','GPU','Processeur graphique.','Graphics Processing Unit. Parallélisme massif : rendu 3D, IA, calcul.','debutant',['gpu']),
  t('gpu-z','GPU-Z','Utilitaire de monitoring GPU.','Affiche fréquences, VRAM, température, utilisation, tensions.','debutant',['diagnostic','gpu']),

  // H
  t('hbm','HBM','High Bandwidth Memory : VRAM empilée.','HBM2e, HBM3. Utilisée dans les GPU data center. Bande passante énorme via interposeur silicium.','avance',['gpu','memory_tech']),
  t('heatsink','Dissipateur','Bloc métallique avec ailettes qui évacue la chaleur.','Aluminium ou cuivre. Associé à un ventilateur (aircooling).','debutant',['cooling']),
  t('hyper-threading','Hyper-Threading (HT)','Technologie Intel SMT (2 threads par cœur).','Présent depuis Pentium 4. Gain moyen ~15-25%.','intermediaire',['cpu','arch_cpu']),

  // I
  t('ich','ICH','Ancien nom du chipset Intel.','I/O Controller Hub. Remplacé par PCH sur les plateformes modernes.','avance',['motherboard']),
  t('ihs','IHS','Integrated Heat Spreader : plaque métallique sur le CPU.','Répartit la chaleur du die vers le ventirad.','intermediaire',['cooling','cpu']),
  t('imc','IMC','Contrôleur mémoire intégré au CPU.','Détermine la fréquence RAM max stable.','avance',['cpu','memory_tech']),
  t('infinity-fabric','Infinity Fabric (IF)','Bus interne AMD qui relie les CCX.','Doit être synchronisé avec MCLK (RAM). Ratio MCLK:FCLK = 1:1 idéal.','avance',['cpu','arch_cpu','memory_tech']),
  t('instruction-set','Jeu d\'instructions','Ensemble des instructions comprises par le CPU.','x86 (Intel/AMD), ARM (mobile/Apple). Extensions : SSE, AVX, AVX-512.','avance',['cpu','arch_cpu']),
  t('io-die','IO Die','Puce I/O sur les CPU AMD chiplet.','Contient le contrôleur mémoire, IF, PCIe, USB.','avance',['cpu','arch_cpu']),
  t('ipc','IPC','Instructions Per Cycle. Nombre d\'instructions par cycle d\'horloge.','Détermine l\'efficacité du CPU. Zen 5 : +16% d\'IPC vs Zen 4.','avance',['cpu','arch_cpu']),
  t('itx','ITX','Format carte mère compact 170×170mm.','Mini-ITX. 1 slot PCIe x16, 2 slots RAM.','debutant',['motherboard']),

  // K
  t('k-skus','K-SKU','CPU Intel avec multiplicateur débloqué.','Permet l\'overclocking. Ex : i7-14700K, i9-14900K.','intermediaire',['cpu','overclock']),
  t('kb','Killer / NIC réseau','Contrôleur réseau gaming (Killer / Realtek).','Priorisation du trafic, latence réduite en jeu.','debutant',['motherboard','pcb']),

  // L
  t('lanes','Lanes PCIe','Connexions PCIe unitaires.','Chaque lane = 2 fils (TX/RX). PCIe 5.0 x1 = ~3,94 Go/s.','intermediaire',['interfaces']),
  t('latency','Latence','Délai avant qu\'une donnée soit disponible.','RAM : CL × 2000 / MT/s. PCIe : latence fixe faible.','intermediaire',['memory_tech','interfaces']),
  t('lga','LGA','Socket CPU avec contacts sur la carte mère (Intel).','Land Grid Array. Ex : LGA1700, LGA1851.','intermediaire',['motherboard']),
  t('llc','LLC','Load Line Calibration : compensation de chute de tension.','Niveau 1 = partielle, niveau 5+ = agressive. Trop haut = surtension.','expert',['vrm','overclock']),

  // M
  t('m2','M.2','Format compact pour SSD NVMe ou Wi-Fi.','Key M = NVMe, Key E = Wi-Fi/Bluetooth. Slot M.2 directement sur la PCIe.','debutant',['storage','interfaces']),
  t('matx','mATX','Micro-ATX : format compact 244×244mm.','Moins de slots PCIe que ATX, plus compact.','debutant',['motherboard']),
  t('mclk','MCLK','Horloge mémoire (RAM).','DDR5-6000 = 3000 MHz MCLK.','avance',['memory_tech','ram']),
  t('mosfet','MOSFET','Transistor de puissance du VRM.','Metal-Oxide Semiconductor Field-Effect Transistor. Commute rapidement pour réguler la tension.','avance',['vrm']),
  t('mt-s','MT/s','Mégatransferts par seconde.','Unité de fréquence RAM. DDR5-6000 = 6000 MT/s = 3000 MHz réels (DDR = 2 transfers/cycle).','intermediaire',['ram']),

  // N
  t('nanometer','nm (nanomètre)','Taille des transistors sur le CPU/GPU.','TSMC N5, N4, N3 pour les process les plus modernes. Plus petit = plus de transistors et meilleure efficacité.','avance',['cpu','gpu','arch_cpu']),
  t('nic','NIC','Carte réseau.','Network Interface Card. Intégrée à la carte mère ou PCIe add-in.','debutant',['pcb']),
  t('nvme','NVMe','Protocole SSD optimisé pour PCIe.','Non-Volatile Memory Express. File 64K commandes, latence < 10 µs.','intermediaire',['storage','interfaces']),

  // O
  t('oc','Overclocking','Augmenter la fréquence au-delà des specs.','Méthode : monter le multiplicateur, tester la stabilité, ajuster la tension.','debutant',['overclock']),
  t('od','On-Die ECC','Correction d\'erreur intégrée dans la DDR5.','Sur la plupart des modules DDR5. Pas un vrai ECC serveur mais réduit les erreurs.','avance',['ram','memory_tech']),

  // P
  t('pbo','PBO','Precision Boost Overdrive : boost dynamique AMD.','Utilise marges thermiques et électriques pour overclocker automatiquement.','intermediaire',['cpu','overclock']),
  t('pcie','PCIe','Bus série point-à-point qui connecte GPU/SSD.','PCI Express. Générations 3.0, 4.0, 5.0.','debutant',['interfaces']),
  t('pcie-30','PCIe 3.0','Ancienne génération, ~985 Mo/s par lane.','Utilisé encore sur cartes mère entrée de gamme.','intermediaire',['interfaces']),
  t('pcie-40','PCIe 4.0','Génération actuelle, ~1,97 Go/s par lane.','Standard sur les plateformes 2020+.','debutant',['interfaces']),
  t('pcie-50','PCIe 5.0','Dernière génération, ~3,94 Go/s par lane.','Sur AMD AM5 et Intel LGA1851.','avance',['interfaces']),
  t('pch','PCH','Platform Controller Hub : chipset Intel moderne.','Relié au CPU via DMI (équivalent PCIe 4.0 x4).','avance',['motherboard']),
  t('phase','Phase VRM','Une unité de conversion DC-DC.','MOSFET H + L + driver + inductance. Plus de phases = meilleur courant.','avance',['vrm']),
  t('pl1','PL1','Puissance CPU soutenue (Intel).','Long Duration Power Limit.','avance',['cpu','overclock']),
  t('pl2','PL2','Puissance CPU en boost (Intel).','Short Duration Power Limit. ~25% au-dessus de PL1.','avance',['cpu','overclock']),
  t('pmic','PMIC','Power Management IC : contrôleur de tension sur les modules DDR5.','Remplace le contrôleur sur la carte mère.','avance',['ram','memory_tech']),
  t('post','POST','Power-On Self-Test : vérification matérielle au boot.','Si échec : LED debug, bips, codes erreur.','intermediaire',['diagnostic','firmware']),
  t('ppt','PPT','Package Power Tracking : consommation totale CPU AMD.','Puissance socket = PPT.','avance',['cpu','overclock']),
  t('psu','PSU','Alimentation du PC.','Convertit 230V AC en tensions DC. Certification 80 Plus.','debutant',['psu']),

  // Q
  t('qvl','QVL','Qualified Vendors List : liste RAM testée par le fabricant CM.','Garantit la compatibilité mais n\'est pas exhaustive.','avance',['compatibility','ram']),
  t('qhd','QHD','1440p = 2560×1440.','Résolution sweet spot gaming.','debutant',['pcb']),

  // R
  t('ram','RAM','Mémoire vive : stockage temporaire du CPU.','Random Access Memory. Volatile (données perdues à l\'extinction).','debutant',['ram']),
  t('ray-tracing','Ray Tracing','Rendu réaliste de la lumière.','Simule le trajet des rayons. RT cores / Ray Accelerators dédiés.','intermediaire',['gpu','arch_gpu']),
  t('refresh-rate','Taux de rafraîchissement','Nombre de fois que l\'écran se redessine par seconde.','60Hz, 144Hz, 240Hz, 360Hz. Plus haut = plus fluide.','debutant',['pcb']),
  t('rgb','RGB','LEDs décoratives sur les composants.','Personnalisables via logiciels constructeur.','debutant',['pcb']),
  t('rop','ROP','Render Output Unit : écriture finale des pixels.','Plus de ROP = plus de pixels traités par cycle.','avance',['gpu','arch_gpu']),

  // S
  t('sata','SATA','Standard stockage ancien.','Serial ATA. SATA III = 6 Gbps (~550 Mo/s réels).','debutant',['storage','interfaces']),
  t('sb','Southbridge (PCH)','Ancien nom du chipset secondaire.','Aujourd\'hui intégré dans le PCH unique.','avance',['motherboard']),
  t('sfx','SFX','Format PSU compact pour ITX.','Small Form Factor. 125×100×63.5mm.','intermediaire',['psu']),
  t('sh','SMT','Simultaneous Multithreading (AMD).','Équivalent d\'Hyper-Threading Intel. 2 threads par cœur.','intermediaire',['cpu','arch_cpu']),
  t('socket','Socket','Connecteur CPU sur la carte mère.','AM5, AM4, LGA1851, LGA1700. Physiquement incompatibles.','debutant',['motherboard']),
  t('soc','SoC','System on Chip : tout intégré sur une puce.','Apple M-series, Qualcomm Snapdragon.','avance',['cpu']),
  t('spd','SPD','Serial Presence Detect : chip sur le module RAM.','Contient les timings et fréquence JEDEC de base.','avance',['ram']),
  t('ssd','SSD','Solid State Drive : stockage sans pièce mobile.','Beaucoup plus rapide qu\'un HDD. NAND TLC/QLC.','debutant',['storage']),
  t('super-io','Super I/O','Chip qui gère ventilateurs, températures, ports legacy.','Souvent intégré au PCH sur cartes modernes.','avance',['motherboard']),

  // T
  t('tbw','TBW','Total Bytes Written : endurance SSD.','Quantité totale de données qu\'un SSD peut écrire.','intermediaire',['storage']),
  t('tcl','tCL','CAS Latency timing.','Voir CAS Latency.','avance',['ram']),
  t('tdc','TDC','Thermal Design Current : limite courant AMD.','Avec PPT et EDC, définit les power limits.','expert',['cpu','overclock']),
  t('tdp','TDP','Thermal Design Power : indication de chaleur à dissiper.','Pas la consommation réelle. Voir PPT pour AMD, PL1/PL2 pour Intel.','intermediaire',['cpu']),
  t('thermal-throttling','Thermal Throttling','Réduction de fréquence quand la température est trop élevée.','Protection automatique. TJmax = limite.','intermediaire',['thermal','cooling']),
  t('thread','Thread','Flux d\'instructions qu\'un cœur peut exécuter.','Cœur physique + SMT = 2 threads logiques.','debutant',['cpu','arch_cpu']),
  t('tim','TIM','Thermal Interface Material : pâte thermique.','Comble les micro-imperfections entre CPU et ventirad.','debutant',['cooling']),
  t('tjmax','TJmax','Température de jonction maximale CPU.','Au-delà, throttling. ~100°C pour la plupart des CPU modernes.','intermediaire',['thermal','cpu']),
  t('tm5','TM5','Test mémoire avancé (Karhu / TestMem5).','Stress RAM plus poussé que les tests classiques.','expert',['ram','diagnostic']),

  // U
  t('uefi','UEFI','Firmware moderne de carte mère.','Remplace le BIOS Legacy depuis 2010. Interface graphique, Secure Boot, GPT.','intermediaire',['firmware']),
  t('uhd','UHD','4K = 3840×2160.','Résolution haute définition.','debutant',['pcb']),
  t('undervolt','Undervolt','Réduire la tension CPU pour baisser température et consommation.','Souvent possible avec curve optimizer AMD ou offset Intel.','intermediaire',['overclock','cpu']),

  // V
  t('vcore','VCore','Tension du cœur CPU.','Typiquement 0.9-1.4V selon charge et OC.','avance',['cpu','overclock','vrm']),
  t('vga','VGA','Vieux connecteur analogique.','Remplacé par HDMI, DisplayPort, DVI.','debutant',['pcb']),
  t('vrm','VRM','Voltage Regulator Module : convertit 12V en tensions CPU/RAM.','Phases multiples, MOSFET, LLC.','intermediaire',['vrm','motherboard']),
  t('vrm-controller','VRM Controller','Puce qui contrôle les phases VRM.','Synchronise les phases, gère le LLC.','expert',['vrm']),

  // W
  t('watt','Watt','Unité de puissance.','P = U × I. Pour une PSU : puissance continue fournie.','debutant',['psu','cpu']),
  t('whea','WHEA','Windows Hardware Error Architecture.','Erreurs matérielles reportées dans l\'Event Viewer (ID 19).','avance',['driver_os','diagnostic']),
  t('wraith','Wraith','Ventirad stock AMD.','Inclus avec certains Ryzen. Spire, Stealth, Prism.','debutant',['cooling']),

  // X
  t('x3d','X3D','Suffixe AMD pour CPU avec 3D V-Cache.','Plus de L3 (96 Mo sur 7800X3D). Idéal gaming.','intermediaire',['cpu']),
  t('xmp','XMP','Intel eXtreme Memory Profile.','Profil préconfiguré pour overclocker la RAM.','debutant',['ram','overclock']),
  t('xess','XeSS','Intel Xe Super Sampling.','Upscaling Intel.','intermediaire',['gpu']),

  // Z
  t('zen','Zen','Architecture CPU AMD depuis 2017.','Zen, Zen 2, Zen 3, Zen 4, Zen 5.','debutant',['cpu','arch_cpu']),
];

export const CATEGORIES = Array.from(new Set(TERMS.flatMap(t => t.categories))).sort();
