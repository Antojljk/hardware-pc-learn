// Banque de questions — utilisée par /api/quiz, /api/examens, /api/interviews
// Catégories alignées sur les DomainKey du système XP

export type QuestionType = 'mcq' | 'truefalse' | 'short';

export type Question = {
  id: string;
  category: string;
  difficulty: 'debutant' | 'intermediaire' | 'avance' | 'expert';
  type: QuestionType;
  prompt: string;
  choices: string[];
  answer: string | string[];
  explanation: string;
  xpReward: number;
};

// Utilitaire pour générer les bonnes réponses pour MCQ
const mcq = (id: string, cat: string, diff: Question['difficulty'], prompt: string, choices: string[], correct: string, explanation: string, xp = 10): Question => ({
  id, category: cat, difficulty: diff, type: 'mcq', prompt, choices, answer: correct, explanation, xpReward: xp,
});

const tf = (id: string, cat: string, diff: Question['difficulty'], prompt: string, correct: boolean, explanation: string, xp = 8): Question => ({
  id, category: cat, difficulty: diff, type: 'truefalse', prompt, choices: ['Vrai', 'Faux'], answer: correct ? 'Vrai' : 'Faux', explanation, xpReward: xp,
});

export const QUESTIONS: Question[] = [
  // ========== CPU ==========
  mcq('cpu-001','cpu','debutant','Que signifie CPU ?',
    ['Central Processing Unit','Computer Personal Unit','Core Processor Utility','Central Power Unit'],
    'Central Processing Unit',
    "CPU = Central Processing Unit. C'est le processeur central qui exécute les instructions des programmes.",12),
  mcq('cpu-002','cpu','debutant','Quelle est l\'unité de fréquence CPU ?',
    ['Hertz','Watt','Volt','Octet'],
    'Hertz',
    "La fréquence se mesure en Hertz (cycles par seconde). 3 GHz = 3 milliards de cycles/seconde.",10),
  mcq('cpu-003','cpu','debutant','Qu\'est-ce qu\'un cœur (core) de CPU ?',
    ['Une unité d\'exécution indépendante','Un ventilateur','Un type de mémoire','Un connecteur'],
    'Une unité d\'exécution indépendante',
    "Chaque cœur peut exécuter un thread indépendamment. Plus de cœurs = plus de calculs en parallèle.",10),
  mcq('cpu-004','cpu','intermediaire','Que signifie SMT (chez AMD) ou Hyper-Threading (chez Intel) ?',
    ['Exécuter 2 threads par cœur physique','Un mode basse tension','Un cache rapide','Une mémoire dédiée'],
    'Exécuter 2 threads par cœur physique',
    "SMT/HT duplique les registres architecturaux pour exécuter 2 threads par cœur physique, ce qui améliore l'utilisation des unités d'exécution.",15),
  mcq('cpu-005','cpu','intermediaire','Quelle est la différence entre TDP et consommation réelle ?',
    ['Le TDP est une indication thermique, la consommation peut être plus élevée','Ce sont exactement la même chose','Le TDP est la consommation au repos','Le TDP mesure la fréquence'],
    'Le TDP est une indication thermique, la consommation peut être plus élevée',
    "Le TDP (Thermal Design Power) est une indication de chaleur à dissiper. La consommation réelle (PPT/package power) peut être supérieure pendant les boosts, surtout sur les CPU Intel récentes.",18),
  mcq('cpu-006','cpu','avance','Qu\'est-ce que l\'IPC ?',
    ['Instructions Per Cycle','Internal Power Control','Instruction Pipeline Cache','Increased Performance Computing'],
    'Instructions Per Cycle',
    "L'IPC mesure combien d'instructions un CPU exécute par cycle. Une amélioration d'IPC de 10% = 10% de performance à fréquence égale.",18),
  mcq('cpu-007','cpu','avance','Quelle génération Zen a introduit le 3D V-Cache ?',
    ['Zen 3','Zen 2','Zen 4','Zen 5'],
    'Zen 3',
    "Le 3D V-Cache a été introduit avec Zen 3 (Ryzen 7 5800X3D). Zen 4 a apporté le 3D V-Cache de 2e génération (Ryzen 7 7800X3D, 9800X3D).",15),
  mcq('cpu-008','cpu','expert','Quel est le ratio idéal MCLK:FCLK sur AM5 ?',
    ['1:1','2:1','1:2','3:1'],
    '1:1',
    "Le ratio MCLK:FCLK = 1:1 est optimal pour la latence. Sur AMD AM5, DDR5-6000 à 3000 MHz MCLK = 2000 MHz FCLK = ratio 2:1 (limite du 1:1). Pour du 1:1 strict, viser DDR5-4000.",20),
  mcq('cpu-009','cpu','expert','Qu\'est-ce que le Branch Prediction ?',
    ['Deviner le résultat d\'un branchement conditionnel','Prédire la température','Choisir le meilleur cœur','Gérer les interruptions'],
    'Deviner le résultat d\'un branchement conditionnel',
    "Le branch prediction devine si un saut conditionnel (if/else) sera pris ou non. Une mauvaise prédiction coûte ~15 cycles. Les architectures modernes atteignent >95% de précision.",18),

  // ========== GPU ==========
  mcq('gpu-001','gpu','debutant','Que signifie GPU ?',
    ['Graphics Processing Unit','General Processing Unit','Graphical Performance Utility','Gaming Processor Unit'],
    'Graphics Processing Unit',
    "GPU = Graphics Processing Unit. Il est spécialisé dans le rendu graphique et les calculs parallèles.",10),
  mcq('gpu-002','gpu','debutant','À quoi sert la VRAM ?',
    ['Stocker les textures et le framebuffer','Alimenter le GPU','Communiquer avec le CPU','Refroidir le GPU'],
    'Stocker les textures et le framebuffer',
    "La VRAM (Video RAM) stocke les textures, le framebuffer (image finale) et les données GPU. Plus de VRAM = plus de textures haute résolution.",10),
  mcq('gpu-003','gpu','intermediaire','Quelle architecture est utilisée par les RTX 40 ?',
    ['Ada Lovelace','Ampere','Turing','Blackwell'],
    'Ada Lovelace',
    "Ada Lovelace est l'architecture des RTX 40 series. Blackwell est l'architecture des RTX 50 series.",15),
  mcq('gpu-004','gpu','intermediaire','Quelle technologie NVIDIA améliore les FPS via l\'IA ?',
    ['DLSS','G-Sync','FreeSync','Resizable BAR'],
    'DLSS',
    "DLSS (Deep Learning Super Sampling) utilise les Tensor Cores pour upscaler l'image en temps réel et générer plus de FPS.",15),
  mcq('gpu-005','gpu','avance','Quelle est la différence entre GDDR6X et GDDR7 ?',
    ['GDDR7 utilise PAM3 et atteint 32-48 Gbps','Aucune','GDDR6X est plus rapide','GDDR7 est plus lent'],
    'GDDR7 utilise PAM3 et atteint 32-48 Gbps',
    "GDDR7 (2025+) atteint 32-48 Gbps grâce au PAM3 (Pulse Amplitude Modulation). GDDR6X était limité à ~21-32 Gbps.",18),
  mcq('gpu-006','gpu','avance','Que fait le Ray Tracing hardware ?',
    ['Calcule les intersections rayon-géométrie en temps réel','Ajoute des pixels aléatoires','Supprime les effets de lumière','Augmente la fréquence'],
    'Calcule les intersections rayon-géométrie en temps réel',
    "Le RT calcule le trajet de la lumière réaliste : réflexion, réfraction, ombres. Coûteux en performance mais beaucoup plus précis que les méthodes traditionnelles.",18),

  // ========== RAM ==========
  mcq('ram-001','ram','debutant','DDR5 vs DDR4 : quelle est correcte ?',
    ['DDR5 est plus rapide et plus économe','DDR4 est plus rapide','Identiques','DDR5 est plus lent'],
    'DDR5 est plus rapide et plus économe',
    "DDR5 (4800-8000+ MT/s) offre le double de bande passante de la DDR4 et fonctionne à 1.1V (vs 1.2V pour DDR4).",10),
  mcq('ram-002','ram','debutant','Que signifie CL ?',
    ['CAS Latency','Core Level','Cache Load','Clock Latency'],
    'CAS Latency',
    "CL = CAS Latency : nombre de cycles entre la demande d'une colonne mémoire et sa disponibilité. CL30 à 6000 MT/s = 10 ns.",12),
  mcq('ram-003','ram','intermediaire','Que fait le profil XMP ?',
    ['Permet d\'overclocker la RAM automatiquement','Augmente la fréquence CPU','Réduit la température','Change la couleur des LED'],
    'Permet d\'overclocker la RAM automatiquement',
    "XMP (Intel) et EXPO (AMD) sont des profils préconfigurés qui overclockent la RAM. À activer dans le BIOS.",15),
  mcq('ram-004','ram','intermediaire','Quel est l\'impact du dual channel ?',
    ['Double la bande passante mémoire','Augmente la latence','Réduit la compatibilité','Plus de capacité'],
    'Double la bande passante mémoire',
    "Le dual channel utilise 2 sticks pour doubler la bande passante (128 bits au lieu de 64). Gain typique 10-20% sur les tâches mémoire-limited.",15),
  mcq('ram-005','ram','avance','Que calcule la latence réelle en ns ?',
    ['CL × 2000 / fréquence MT/s','CL + fréquence','Fréquence × CL','CL × voltage'],
    'CL × 2000 / fréquence MT/s',
    "Latence réelle (ns) = CL × 2000 / fréquence MT/s. DDR5-6000 CL30 = 30 × 2000 / 6000 = 10 ns. DDR4-3200 CL16 = 16 × 2000 / 3200 = 10 ns.",18),

  // ========== STOCKAGE ==========
  mcq('storage-001','storage','debutant','Quel connecteur pour un SSD NVMe ?',
    ['M.2 Key M','SATA','PCIe x1','USB-C'],
    'M.2 Key M',
    "Les SSD NVMe utilisent le slot M.2 Key M. Les M.2 Key B (SATA) sont rares. Le SATA traditionnel utilise un connecteur SATA + câble d'alimentation.",10),
  mcq('storage-002','storage','debutant','Quelle est la limite pratique du SATA III ?',
    ['~550 Mo/s','~1 Go/s','~3 Go/s','~100 Mo/s'],
    '~550 Mo/s',
    "SATA III = 6 Gbps mais en pratique ~550 Mo/s pour les SSD. Pour aller plus vite, il faut du NVMe sur PCIe.",10),
  mcq('storage-003','storage','intermediaire','Que signifie NVMe ?',
    ['Non-Volatile Memory Express','New Video Memory','Native VMe','Non-Volatile Main Engine'],
    'Non-Volatile Memory Express',
    "NVMe est un protocole optimisé pour les SSD : faible latence, file de 64K commandes vs 32 pour AHCI (SATA).",12),
  mcq('storage-004','storage','intermediaire','Que mesure le TBW ?',
    ['Total Bytes Written (endurance)','Total Bandwidth','Transfer Buffer Width','Time Between Writes'],
    'Total Bytes Written (endurance)',
    "TBW = endurance du SSD. Un SSD 2 To typique a 1200 TBW. Au-delà, la garantie ne couvre plus.",15),
  mcq('storage-005','storage','avance','Quel est le débit PCIe 4.0 x4 ?',
    ['~7 Go/s','~3,5 Go/s','~14 Go/s','~1 Go/s'],
    '~7 Go/s',
    "PCIe 4.0 x4 = 4 × ~1,97 Go/s = ~7,88 Go/s. PCIe 5.0 x4 double à ~15,75 Go/s.",18),

  // ========== CARTE MÈRE ==========
  mcq('mb-001','motherboard','debutant','Quel socket utilise un Ryzen 9000 ?',
    ['AM5','AM4','LGA1700','LGA1851'],
    'AM5',
    "AM5 est le socket AMD depuis 2022 (Ryzen 7000/9000). Il utilise des pins sur le CPU (LGA côté carte mère).",10),
  mcq('mb-002','motherboard','debutant','Quel format de carte mère est le plus compact ?',
    ['ITX','ATX','E-ATX','XL-ATX'],
    'ITX',
    "Mini-ITX (170×170 mm) est le plus compact. ATX (305×244 mm) est le standard.",10),
  mcq('mb-003','motherboard','intermediaire','Que fait le chipset ?',
    ['Gère les ports PCIe, USB, SATA supplémentaires','Exécute les instructions','Stocke le BIOS','Alimente le CPU'],
    'Gère les ports PCIe, USB, SATA supplémentaires',
    "Le chipset étend les capacités du CPU : ports PCIe supplémentaires, USB, SATA, réseau. Le CPU gère directement 28 lanes PCIe.",15),
  mcq('mb-004','motherboard','intermediaire','Quelle différence entre Z890 et B860 ?',
    ['Z890 supporte l\'overclocking CPU','Aucune','Z890 est moins cher','B860 a plus de PCIe'],
    'Z890 supporte l\'overclocking CPU',
    "Les chipsets Z (Intel) et X (AMD) permettent l'overclocking du CPU. Les B/H sont bridés.",15),

  // ========== PSU ==========
  mcq('psu-001','psu','debutant','Que signifie 80 Plus Gold ?',
    ['Rendement ≥ 87% à 50% de charge','Consommation 80W','Marque commerciale','Type de connecteur'],
    'Rendement ≥ 87% à 50% de charge',
    "La certification 80 Plus mesure le rendement : Gold = 87-90% à 50% de charge. Plus haut = Platinum (90-92%), Titanium (92-94%).",10),
  mcq('psu-002','psu','debutant','Quel connecteur alimente un GPU PCIe 5.0 ?',
    ['12VHPWR','6-pin','8-pin EPS','24-pin ATX'],
    '12VHPWR',
    "Le 12VHPWR (12V High Power) supporte jusqu'à 600W sur un seul connecteur, utilisé par les RTX 40/50 series.",12),
  mcq('psu-003','psu','intermediaire','Que se passe-t-il si la PSU est sous-dimensionnée ?',
    ['Crashes aléatoires, instabilité','Meilleures performances','Plus de bruit','Aucun effet'],
    'Crashes aléatoires, instabilité',
    "Une PSU trop faible ne peut pas fournir le courant nécessaire en pointe : crashs, redémarrages, instabilité.",15),

  // ========== COOLING ==========
  mcq('cooling-001','cooling','debutant','À quoi sert la pâte thermique ?',
    ['Combler les micro-imperfections entre CPU et ventirad','Coller le CPU','Peindre le ventirad','Isoler le CPU'],
    'Combler les micro-imperfections entre CPU et ventirad',
    "Le contact entre CPU et ventirad n'est jamais parfait. La pâte thermique comble ces espaces pour transférer la chaleur.",10),
  mcq('cooling-002','cooling','intermediaire','Quelle taille d\'AIO pour un i9-14900K ?',
    ['360mm','120mm','140mm','240mm'],
    '360mm',
    "Un Core i9-14900K consomme jusqu'à 253W en PL2. Un AIO 360mm est recommandé. 240mm peut suffire mais avec du bruit.",15),
  mcq('cooling-003','cooling','intermediaire','À quelle fréquence renouveler la pâte thermique ?',
    ['Tous les 3-5 ans','Chaque mois','Une seule fois','Tous les 10 ans'],
    'Tous les 3-5 ans',
    "La pâte thermique sèche avec le temps. Renouveler tous les 3-5 ans pour conserver les performances.",12),

  // ========== VRM ==========
  mcq('vrm-001','vrm','intermediaire','Que signifie VRM ?',
    ['Voltage Regulator Module','Very Rapid Memory','Virtual Rendering Mode','Voltage Resistance Measure'],
    'Voltage Regulator Module',
    "Le VRM convertit le 12V de la PSU en tensions précises (1.0-1.4V) pour le CPU.",12),
  mcq('vrm-002','vrm','avance','Qu\'est-ce qu\'une phase VRM ?',
    ['1 MOSFET haut + 1 MOSFET bas + driver + inductance','Un condensateur','Un ventilateur','Un câble'],
    '1 MOSFET haut + 1 MOSFET bas + driver + inductance',
    "Une phase = un circuit de conversion DC-DC. Plus il y a de phases, plus le courant est réparti et le VRM est efficace.",18),
  mcq('vrm-003','vrm','expert','Que fait le LLC (Load Line Calibration) ?',
    ['Compense la chute de tension en charge','Augmente la fréquence','Réduit la température','Éteint le CPU'],
    'Compense la chute de tension en charge',
    "Le LLC ajuste dynamiquement la tension pour compenser la chute (Vdroop). Niveau 1 = compensation partielle, niveaux élevés = compensation agressive.",20),

  // ========== OVERCLOCK ==========
  mcq('oc-001','overclock','debutant','Overclocker signifie :',
    ['Augmenter la fréquence au-delà des spécifications','Réduire la consommation','Changer la couleur du boîtier','Ajouter de la RAM'],
    'Augmenter la fréquence au-delà des spécifications',
    "Overclocking = pousser le CPU/RAM au-delà des fréquences annoncées par le fabricant.",10),
  mcq('oc-002','overclock','avance','Qu\'est-ce que l\'undervolting ?',
    ['Réduire la tension pour gagner en efficacité et baisser les températures','Augmenter la fréquence','Overclocker la RAM','Aucune de ces réponses'],
    'Réduire la tension pour gagner en efficacité et baisser les températures',
    "L'undervolting baisse la tension Vcore tout en conservant (ou augmentant légèrement) la fréquence. Réduit la chaleur sans perte de performance.",18),

  // ========== DIAGNOSTIC ==========
  mcq('diag-001','diagnostic','debutant','PC démarre mais écran noir. Quelle est la première vérification ?',
    ['Câble vidéo / écran','Pâte thermique','SSD','Carte son'],
    'Câble vidéo / écran',
    "Si l'écran est noir mais que les ventilos tournent, vérifier le câble vidéo (HDMI/DP), l'écran, puis tester le GPU dans un autre slot.",10),
  mcq('diag-002','diagnostic','intermediaire','BSOD fréquent : quel composant suspecter en premier ?',
    ['RAM','Ventirad','Écran','Clavier'],
    'RAM',
    "Les BSOD sont souvent liés à la RAM (timings, défauts) ou au stockage (pilote, SMART). Tester avec MemTest86.",15),
  mcq('diag-003','diagnostic','expert','PC totalement mort (aucun voyant). Que tester en premier ?',
    ['Alimentation (PSU) et bouton power','Écran','Souris','Clavier'],
    'Alimentation (PSU) et bouton power',
    "Test PSU avec paperclip test (court-circuiter pin 16 et 17 du 24-pin). Si la PSU tourne, tester le bouton power et les connexions carte mère.",18),

  // ========== BENCHMARKS ==========
  mcq('bench-001','benchmarks','debutant','À quoi servent les benchmarks ?',
    ['Mesurer objectivement les performances','Vendre des produits','Décorer','Aucune utilité'],
    'Mesurer objectivement les performances',
    "Les benchmarks donnent des scores reproductibles pour comparer composants ou tester la stabilité.",8),
  mcq('bench-002','benchmarks','intermediaire','Que mesure Cinebench R24 ?',
    ['Performance CPU multi et single thread','Performance GPU','Latence réseau','Température'],
    'Performance CPU multi et single thread',
    "Cinebench utilise le moteur Cinema 4D pour stresser le CPU. Score multi = tous les cœurs, single = 1 cœur.",15),

  // ========== TRUE/FALSE ==========
  tf('tf-001','cpu','debutant','Plus de GHz = toujours plus de performance.', false,
    "Faux. L'IPC compte autant que la fréquence. Un CPU moderne à 4 GHz peut être plus rapide qu'un ancien à 5 GHz grâce à un meilleur IPC.", 10),
  tf('tf-002','gpu','debutant','La VRAM et la RAM sont interchangeables.', false,
    "Faux. La VRAM est dédiée au GPU et beaucoup plus rapide pour les usages graphiques. La RAM est utilisée par le CPU.", 8),
  tf('tf-003','ram','debutant','On peut mélanger DDR4 et DDR5 sur la même carte mère.', false,
    "Faux. Les slots DIMM DDR4 et DDR5 sont physiquement différents (encoche à des endroits différents) et électriquement incompatibles.", 8),
  tf('tf-004','storage','intermediaire','Un SSD NVMe PCIe 5.0 est 5x plus rapide en usage réel qu\'un PCIe 3.0.', false,
    "Faux. En usage réel, la différence est rarement perceptible car les workloads courants ne saturent pas le PCIe 3.0.", 12),
  tf('tf-005','psu','intermediaire','Une PSU 80 Plus Gold consomme moins d\'énergie qu\'une Bronze à charge identique.', true,
    "Vrai. La certification 80 Plus mesure le rendement : une Gold gaspille moins en chaleur, donc consomme moins sur la prise pour fournir la même puissance au PC.", 12),
  tf('tf-006','cooling','debutant','Plus de pâte thermique = meilleur refroidissement.', false,
    "Faux. Trop de pâte peut déborder et agir comme isolant. Une fine couche uniforme suffit.", 10),
  tf('tf-007','motherboard','intermediaire','Toutes les cartes mères AM5 supportent l\'overclocking.', false,
    "Faux. Les chipsets B650 ont un OC limité. Pour l'overclocking CPU avancé, il faut X870/X870E.", 12),
  tf('tf-008','diagnostic','intermediaire','Un PC qui ne démarre pas a forcément la carte mère en panne.', false,
    "Faux. La cause peut être la PSU, le CPU, la RAM, ou même un simple câble mal branché. Tester par élimination.", 12),
  tf('tf-009','vrm','avance','Le LLC doit toujours être au maximum.', false,
    "Faux. Un LLC trop agressif provoque des surtensions (danger pour le CPU), un LLC trop bas provoque des chutes et instabilité.", 14),
  tf('tf-010','cpu','expert','Le 3D V-Cache améliore les performances gaming principalement.', true,
    "Vrai. Le 3D V-Cache ajoute 64 Mo de L3 qui profitent aux jeux (cache locality). En productivité, l'impact est plus limité.", 12),

  // ========== SHORT ==========
  {
    id: 'short-001', category: 'cpu', difficulty: 'debutant', type: 'short',
    prompt: 'Quel acronyme désigne le processeur central ?',
    choices: ['CPU', 'GPU', 'PSU', 'SSD'], answer: 'CPU',
    explanation: 'CPU = Central Processing Unit.', xpReward: 8,
  },
  {
    id: 'short-002', category: 'ram', difficulty: 'debutant', type: 'short',
    prompt: 'Quel type de RAM équipe les cartes mères AM5 ?',
    choices: ['DDR5', 'DDR4', 'DDR3', 'GDDR6'], answer: 'DDR5',
    explanation: 'AM5 utilise exclusivement la DDR5.', xpReward: 8,
  },
  {
    id: 'short-003', category: 'gpu', difficulty: 'debutant', type: 'short',
    prompt: 'Quelle technologie NVIDIA améliore les FPS via IA ?',
    choices: ['DLSS', 'FSR', 'XeSS', 'TAA'], answer: 'DLSS',
    explanation: 'DLSS = Deep Learning Super Sampling.', xpReward: 8,
  },
  {
    id: 'short-004', category: 'storage', difficulty: 'debutant', type: 'short',
    prompt: 'Quel protocole est utilisé par les SSD modernes ?',
    choices: ['NVMe', 'AHCI', 'IDE', 'SCSI'], answer: 'NVMe',
    explanation: 'NVMe = Non-Volatile Memory Express, optimisé pour les SSD.', xpReward: 8,
  },
  {
    id: 'short-005', category: 'cooling', difficulty: 'debutant', type: 'short',
    prompt: 'Quel gaz est utilisé dans les bombes d\'air sec ?',
    choices: ['Air comprimé', 'Hélium', 'Azote', 'Hydrogène'], answer: 'Air comprimé',
    explanation: 'Les bombes d\'air utilisent un gaz propulseur (souvent du butane/propane) avec de l\'air. À utiliser avec précaution car le gaz est inflammable.', xpReward: 8,
  },
];

export const EXAMS = [
  {
    slug: 'examen-debutant',
    title: 'Examen Hardware Débutant',
    level: 'debutant',
    durationSec: 900,
    questionIds: ['cpu-001','cpu-002','cpu-003','gpu-001','gpu-002','ram-001','ram-002','storage-001','storage-002','mb-001','mb-002','psu-001','cooling-001','psu-002','diag-001','bench-001','tf-001','tf-003','tf-006','short-001'],
  },
  {
    slug: 'examen-assembleur',
    title: 'Examen Assembleur',
    level: 'intermediaire',
    durationSec: 1500,
    questionIds: ['cpu-004','cpu-005','cpu-006','gpu-003','gpu-004','ram-003','ram-004','storage-003','storage-004','mb-003','mb-004','cooling-002','tf-002','tf-004','tf-007','diag-002','bench-002','short-002','short-003','short-004','cpu-007','vrm-001','tf-005','oc-001','cooling-003','tf-008','short-005','tf-009','ram-005','cpu-008'],
  },
  {
    slug: 'examen-technicien',
    title: 'Examen Technicien',
    level: 'avance',
    durationSec: 2400,
    questionIds: ['cpu-006','cpu-007','cpu-008','cpu-009','gpu-005','gpu-006','ram-005','storage-005','vrm-001','vrm-002','oc-001','oc-002','diag-002','diag-003','tf-001','tf-005','tf-008','tf-009','tf-010','bench-002','mb-003','mb-004','storage-005','cooling-002','cpu-005','gpu-005','storage-004','ram-003','ram-004','vrm-001','vrm-002','diag-002','diag-003','mb-004','oc-001','oc-002','cpu-008','cpu-009','gpu-006','vrm-003'],
  },
];
