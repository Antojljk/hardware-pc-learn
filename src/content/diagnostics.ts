// Scénarios de diagnostic PC
export type DiagnosticStep = {
  id: string;
  label: string;
  type: 'check' | 'fix';
  category: 'hardware' | 'software' | 'cooling' | 'cables' | 'bios';
};

export type Scenario = {
  slug: string;
  title: string;
  category: string;
  difficulty: 'debutant' | 'intermediaire' | 'avance' | 'expert';
  symptoms: string[];
  idealSequence: string[];   // sequence d'étapes idéales dans l'ordre
  optionalAcceptable: string[]; // étapes acceptables mais pas obligatoires
  wrongMoves: string[];      // étapes qui indiquent une mauvaise approche
  rootCause: string;
  solution: string;
};

const step = (id: string, label: string, type: DiagnosticStep['type'], category: DiagnosticStep['category']): DiagnosticStep =>
  ({ id, label, type, category });

export const SCENARIO_STEPS: DiagnosticStep[] = [
  step('check-power', 'Vérifier que la PSU est branchée et l\'interrupteur ON', 'check', 'hardware'),
  step('check-power-cable', 'Tester le câble d\'alimentation 230V', 'check', 'cables'),
  step('check-psu-paperclip', 'Tester la PSU avec paperclip test', 'check', 'hardware'),
  step('check-front-panel', 'Vérifier les connecteurs panneau avant (power switch)', 'check', 'hardware'),
  step('check-cmos-battery', 'Tester/remplacer la pile CMOS', 'check', 'hardware'),
  step('check-cmos-reset', 'Clear CMOS', 'fix', 'bios'),
  step('check-video-cable', 'Vérifier le câble vidéo (HDMI/DP)', 'check', 'cables'),
  step('check-monitor-input', 'Vérifier la bonne entrée sur l\'écran', 'check', 'cables'),
  step('check-monitor-power', 'Tester l\'écran sur un autre PC', 'check', 'cables'),
  step('test-cpu', 'Tester le CPU dans une autre carte mère', 'check', 'hardware'),
  step('reseat-cpu', 'Réinstaller le CPU', 'fix', 'hardware'),
  step('test-ram', 'Tester la RAM un stick à la fois', 'check', 'hardware'),
  step('reseat-ram', 'Réinstaller la RAM', 'fix', 'hardware'),
  step('try-other-ram', 'Tester avec d\'autres barrettes de RAM', 'check', 'hardware'),
  step('test-gpu', 'Tester le GPU dans un autre slot PCIe', 'check', 'hardware'),
  step('test-igpu', 'Tester avec le GPU intégré (iGPU)', 'check', 'hardware'),
  step('reseat-gpu', 'Réinstaller le GPU', 'fix', 'hardware'),
  step('try-other-gpu', 'Tester avec un autre GPU', 'check', 'hardware'),
  step('remove-gpu', 'Retirer le GPU et tester', 'check', 'hardware'),
  step('check-ssd', 'Vérifier le SSD : bien branché, slot M.2', 'check', 'hardware'),
  step('reseat-ssd', 'Réinstaller le SSD', 'fix', 'hardware'),
  step('test-other-ssd', 'Tester un autre SSD', 'check', 'hardware'),
  step('check-boot-order', 'Vérifier l\'ordre de boot dans le BIOS', 'check', 'bios'),
  step('check-bios-detection', 'Le BIOS détecte-t-il le SSD ?', 'check', 'bios'),
  step('check-ram-seating', 'Tester la RAM dans différents slots', 'check', 'hardware'),
  step('check-ram-compat', 'Vérifier la compatibilité RAM/CM (QVL)', 'check', 'hardware'),
  step('update-bios', 'Mettre à jour le BIOS', 'fix', 'bios'),
  step('check-cooler', 'Vérifier que le ventirad est bien fixé', 'check', 'cooling'),
  step('check-fans', 'Vérifier que les ventilateurs tournent', 'check', 'cooling'),
  step('check-temp', 'Vérifier les températures', 'check', 'cooling'),
  step('check-fans-psu', 'Vérifier le ventilateur de la PSU', 'check', 'cooling'),
  step('check-thermal-paste', 'Renouveler la pâte thermique', 'fix', 'cooling'),
  step('check-vrm-temp', 'Vérifier la température du VRM', 'check', 'cooling'),
  step('clean-dust', 'Nettoyer la poussière', 'fix', 'cooling'),
  step('check-driver-update', 'Mettre à jour les pilotes', 'fix', 'software'),
  step('ddu-reinstall', 'DDU + réinstallation propre des pilotes GPU', 'fix', 'software'),
  step('check-event-viewer', 'Consulter l\'Observateur d\'événements', 'check', 'software'),
  step('test-memtest', 'Lancer MemTest86', 'check', 'software'),
  step('reinstall-os', 'Réinstaller Windows', 'fix', 'software'),
  step('check-overclock', 'Désactiver XMP/OC', 'fix', 'bios'),
  step('reseat-power-cables', 'Reconnecter les câbles 24-pin et EPS', 'fix', 'hardware'),
  step('try-another-psu', 'Tester une autre PSU', 'check', 'hardware'),
  step('check-short-circuit', 'Vérifier qu\'il n\'y a pas de court-circuit', 'check', 'hardware'),
  step('remove-everything', 'Build minimal : CM + CPU + 1 RAM + GPU', 'fix', 'hardware'),
];

export const SCENARIOS: Scenario[] = [
  {
    slug: 'ecran-noir',
    title: 'Le PC démarre mais aucun affichage',
    category: 'GPU/Display',
    difficulty: 'debutant',
    symptoms: ['Ventilateurs tournent', 'LEDs allumées', 'Écran noir', 'Aucun signal détecté'],
    idealSequence: ['check-video-cable', 'check-monitor-input', 'check-monitor-power', 'test-gpu', 'reseat-gpu', 'test-igpu'],
    optionalAcceptable: ['try-other-gpu', 'remove-gpu', 'reseat-ram'],
    wrongMoves: ['clean-dust', 'reinstall-os', 'check-thermal-paste'],
    rootCause: 'GPU mal logé ou problème d\'affichage',
    solution: 'Vérifier le câble vidéo, tester avec un autre câble/écran, réinstaller le GPU dans le slot PCIe. Si le GPU est défaillant, tester avec le GPU intégré.',
  },
  {
    slug: 'pc-mort',
    title: 'PC totalement mort (aucun signe)',
    category: 'Alimentation',
    difficulty: 'debutant',
    symptoms: ['Aucun voyant', 'Aucun ventilateur', 'Aucune LED'],
    idealSequence: ['check-power', 'check-power-cable', 'check-psu-paperclip', 'check-front-panel', 'reseat-power-cables', 'try-another-psu'],
    optionalAcceptable: ['remove-everything', 'check-short-circuit'],
    wrongMoves: ['reinstall-os', 'ddu-reinstall', 'update-bios'],
    rootCause: 'PSU défaillante ou problème d\'alimentation',
    solution: 'Vérifier la prise murale, tester la PSU avec paperclip test. Si la PSU tourne, vérifier les connecteurs panneau avant et l\'alimentation 24-pin/8-pin. Tester avec une autre PSU.',
  },
  {
    slug: 'bsod-frequent',
    title: 'BSOD fréquents',
    category: 'Système',
    difficulty: 'intermediaire',
    symptoms: ['Redémarrages aléatoires', 'BSOD en jeu', 'BSOD au boot'],
    idealSequence: ['test-ram', 'test-memtest', 'ddu-reinstall', 'check-driver-update', 'check-event-viewer'],
    optionalAcceptable: ['check-overclock', 'try-other-ram', 'reinstall-os'],
    wrongMoves: ['check-thermal-paste', 'clean-dust'],
    rootCause: 'RAM instable ou pilote GPU défectueux',
    solution: 'Lancer MemTest86 pendant 1h+ pour tester la RAM. Désactiver XMP. Mettre à jour ou réinstaller les pilotes GPU avec DDU. Consulter l\'Observateur d\'événements pour identifier le pilote fautif.',
  },
  {
    slug: 'surchauffe-cpu',
    title: 'CPU qui surchauffe et throttle',
    category: 'Thermique',
    difficulty: 'intermediaire',
    symptoms: ['Température > 90°C', 'Baisse de FPS', 'Bruit de ventilateurs à fond'],
    idealSequence: ['check-cooler', 'check-fans', 'check-temp', 'check-thermal-paste', 'check-airflow'],
    optionalAcceptable: ['clean-dust', 'undervolt', 'reseat-cpu'],
    wrongMoves: ['ddu-reinstall', 'reinstall-os', 'update-bios'],
    rootCause: 'Pâte thermique sèche ou ventirad mal monté',
    solution: 'Vérifier que le ventirad est bien clipsé et que les ventilateurs tournent. Renouveler la pâte thermique (3-5 ans). Vérifier l\'airflow du boîtier. Envisager un AIO pour CPU haut de gamme.',
  },
  {
    slug: 'gpu-chaud',
    title: 'GPU trop chaud en jeu',
    category: 'Thermique',
    difficulty: 'intermediaire',
    symptoms: ['Température GPU > 85°C', 'Throttling GPU', 'Ventilateurs GPU à 100%'],
    idealSequence: ['clean-dust', 'check-fans', 'check-airflow', 'check-thermal-paste'],
    optionalAcceptable: ['reseat-gpu', 'undervolt'],
    wrongMoves: ['test-ram', 'reinstall-os', 'update-bios'],
    rootCause: 'Airflow insuffisant ou pâte thermique GPU sèche',
    solution: 'Améliorer l\'airflow (entrée avant/bas). Nettoyer la poussière. Si ancien (> 5 ans), renouveler la pâte thermique GPU (opération risquée, garantie perdue). Undervolt GPU avec MSI Afterburner.',
  },
  {
    slug: 'ram-instable',
    title: 'RAM instable (XMP plante)',
    category: 'RAM',
    difficulty: 'avance',
    symptoms: ['BSOD avec code MEMORY_MANAGEMENT', 'Écran bleu au boot', 'Pas de boot avec XMP'],
    idealSequence: ['check-overclock', 'test-ram', 'try-other-ram', 'reseat-ram', 'check-ram-seating', 'check-ram-compat'],
    optionalAcceptable: ['update-bios', 'check-event-viewer'],
    wrongMoves: ['clean-dust', 'ddu-reinstall'],
    rootCause: 'XMP trop agressif ou IMC faible',
    solution: 'Désactiver XMP/EXPO. Mettre à jour le BIOS (améliore souvent la compatibilité RAM). Tester chaque stick individuellement. Ajuster manuellement les timings (CL légèrement +1).',
  },
  {
    slug: 'ssd-non-detecte',
    title: 'SSD NVMe non détecté',
    category: 'Stockage',
    difficulty: 'avance',
    symptoms: ['SSD absent dans le BIOS', 'SSD absent dans Windows', 'PC boot mais pas d\'OS'],
    idealSequence: ['check-ssd', 'reseat-ssd', 'check-bios-detection', 'test-other-ssd'],
    optionalAcceptable: ['update-bios', 'reinstall-os'],
    wrongMoves: ['ddu-reinstall', 'clean-dust', 'check-thermal-paste'],
    rootCause: 'Slot M.2 partagé ou BIOS non à jour',
    solution: 'Vérifier le manuel de la carte mère : certains slots M.2 partagent des lanes PCIe avec des SATA. Mettre à jour le BIOS. Tester un autre slot M.2. Tester le SSD dans une autre machine.',
  },
  {
    slug: 'redemarrages-aleatoires',
    title: 'Redémarrages aléatoires en charge',
    category: 'Alimentation/VRM',
    difficulty: 'avance',
    symptoms: ['PC redémarre en jeu', 'PC redémarre en benchmark', 'Pas de BSOD, juste reset'],
    idealSequence: ['test-ram', 'check-thermal-paste', 'check-vrm-temp', 'try-another-psu', 'check-overclock'],
    optionalAcceptable: ['update-bios', 'undervolt'],
    wrongMoves: ['ddu-reinstall', 'reinstall-os'],
    rootCause: 'PSU insuffisante, VRM faible ou RAM instable',
    solution: 'Vérifier la consommation totale et la capacité PSU. Tester avec une autre PSU plus puissante. Vérifier les températures VRM (HWiNFO). Désactiver XMP et OC. Undervolt CPU.',
  },
  {
    slug: 'performances-faibles',
    title: 'Performances anormalement basses',
    category: 'Système',
    difficulty: 'expert',
    symptoms: ['FPS très bas attendu', 'CPU/GPU pas à 100% en jeu', 'Stuttering'],
    idealSequence: ['check-event-viewer', 'ddu-reinstall', 'check-ram-seating', 'check-overclock', 'check-ram-compat'],
    optionalAcceptable: ['reinstall-os', 'update-bios', 'reseat-ram'],
    wrongMoves: ['clean-dust', 'check-thermal-paste'],
    rootCause: 'RAM en single channel, pilote obsolète ou background processes',
    solution: 'Vérifier que la RAM est en dual channel (slots A2+B2). Mettre à jour/réinstaller les pilotes. Activer Resizable BAR dans le BIOS. Vérifier l\'absence de malwares/background. Désactiver XMP si pas testé.',
  },
  {
    slug: 'artefacts-gpu',
    title: 'Artefacts visuels à l\'écran',
    category: 'GPU',
    difficulty: 'expert',
    symptoms: ['Pixels colorés aléatoires', 'Lignes bizarres', 'Textures corrompues'],
    idealSequence: ['ddu-reinstall', 'reseat-gpu', 'test-other-gpu', 'check-overclock', 'check-vram-temp'],
    optionalAcceptable: ['update-bios'],
    wrongMoves: ['reinstall-os', 'clean-dust'],
    rootCause: 'VRAM défectueuse ou GPU en fin de vie',
    solution: 'DDU en safe mode + réinstall pilote. Désactiver tout OC GPU. Tester avec un autre GPU. Si artefacts persistent = GPU défectueux, RMA.',
  },
];
