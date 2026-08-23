// Banque de questions d'entretien + évaluateur heuristique
export type InterviewQuestion = {
  id: string;
  level: 'debutant' | 'intermediaire' | 'avance' | 'expert';
  role: 'monteur' | 'technicien' | 'support' | 'vendeur' | 'stage';
  question: string;
  keywords: string[];      // mots-clés importants pour scoring
  idealAnswer: string;
};

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  { id: 'i01', level: 'debutant', role: 'monteur', question: 'À quoi sert la RAM ?',
    keywords: ['stockage', 'temporaire', 'volatile', 'programmes', 'cpu', 'rapide'],
    idealAnswer: 'La RAM (Random Access Memory) stocke temporairement les données et instructions utilisées par le CPU pendant que le PC fonctionne. Elle est très rapide mais volatile : ses données sont perdues à l\'extinction.' },
  { id: 'i02', level: 'debutant', role: 'monteur', question: 'Quelle est la différence entre un SSD SATA et un SSD NVMe ?',
    keywords: ['pcie', 'nvme', 'sata', 'vitesse', 'm.2', 'protocole'],
    idealAnswer: 'Un SSD SATA utilise le protocole AHCI via SATA III (~550 Mo/s réels), tandis qu\'un SSD NVMe utilise le protocole NVMe directement sur PCIe, atteignant 7 000+ Mo/s en PCIe 4.0. Les NVMe se branchent en M.2 Key M.' },
  { id: 'i03', level: 'debutant', role: 'technicien', question: 'Un PC s\'allume mais l\'écran reste noir. Par où commencer ?',
    keywords: ['câble', 'écran', 'gpu', 'alimentation', 'vidéo', 'hdmi', 'displayport'],
    idealAnswer: 'Vérifier d\'abord le câble vidéo (HDMI/DP) et l\'entrée de l\'écran. Tester l\'écran sur un autre PC ou un autre câble. Ensuite, réinstaller le GPU dans son slot PCIe. Tester le GPU intégré si disponible. Si toujours rien : tester RAM un stick à la fois.' },
  { id: 'i04', level: 'intermediaire', role: 'stage', question: 'Pourquoi une RAM DDR5-6000 CL30 peut-elle être intéressante ?',
    keywords: ['bande passante', 'fréquence', 'timing', 'latence', 'amd', 'am5', 'sweet spot', '1:1'],
    idealAnswer: 'DDR5-6000 CL30 = sweet spot pour AMD AM5 : fréquence MCLK 3000 MHz permet un ratio Infinity Fabric 1:1 jusqu\'à FCLK 2000 MHz. La latence réelle est 10 ns (CL30 × 2000/6000), comparable à de la DDR4 haute perf, avec une bande passante double. Excellent compromis prix/performance.' },
  { id: 'i05', level: 'intermediaire', role: 'technicien', question: 'Explique le rôle d\'un VRM sur une carte mère.',
    keywords: ['alimentation', 'cpu', 'tension', 'phases', 'mosfet', '12v', 'conversion', 'pwm'],
    idealAnswer: 'Le VRM (Voltage Regulator Module) convertit le 12V de la PSU en tensions précises (1-1.4V) pour le CPU. Il est composé de phases (MOSFET haut/bas + inductance). Plus il y a de phases robustes, plus le CPU est alimenté stablement, ce qui est crucial pour l\'overclocking et les CPU haut de gamme.' },
  { id: 'i06', level: 'intermediaire', role: 'support', question: 'Un client se plaint que son PC "rame". Quelles premières questions poser ?',
    keywords: ['quand', 'depuis', 'changements', 'utilisation', 'logiciels', 'mise à jour', 'pilotes'],
    idealAnswer: 'Questions à poser : depuis quand ? Y a-t-il eu des changements (mise à jour Windows, nouveaux logiciels, ajout matériel) ? Quand ça rame (boot, navigation, jeux) ? Quels messages d\'erreur ? Avez-vous nettoyé/traité les malwares récemment ?' },
  { id: 'i07', level: 'avance', role: 'stage', question: 'Pourquoi deux cartes graphiques identiques peuvent-elles avoir des températures différentes ?',
    keywords: ['airflow', 'pâte thermique', 'silicon lottery', 'ventilateurs', 'boîtier', 'position', 'curves'],
    idealAnswer: 'Plusieurs facteurs : 1) Airflow du boîtier différent (entrée d\'air bloquée). 2) Pâte thermique appliquée différemment à l\'usine. 3) Silicon lottery (qualité du GPU/GDDR varie). 4) Profil de ventilateurs et courbe différents. 5) Position dans le boîtier (slot PCIe bas = moins de chaleur CPU).' },
  { id: 'i08', level: 'avance', role: 'technicien', question: 'Explique l\'impact de la latence CAS sur les performances réelles d\'un jeu.',
    keywords: ['cl', 'cas', 'latence', 'frametime', '1% low', 'ns', 'mémoire'],
    idealAnswer: 'La latence CAS (CL) seule ne suffit pas : la latence réelle en ns = CL × 2000 / fréquence MT/s. En jeu, ce qui compte, c\'est la régularité du frametime et les 1% lows. Une latence plus faible réduit les micro-stutters, surtout en jeu CPU-limited.' },
  { id: 'i09', level: 'expert', role: 'technicien', question: 'Explique comment le VRM influence la stabilité d\'un CPU fortement consommateur.',
    keywords: ['phases', 'courant', 'vrm', 'chute', 'tension', 'llc', 'load line', 'temperature', 'mosfet'],
    idealAnswer: 'Un CPU gourmand (ex : i9-14900K à 253W) tire des courants très élevés par pics. Un VRM insuffisant (peu de phases, MOSFET bas de gamme) : chute de tension sous charge, instabilité, voire crash. Le LLC compense cette chute mais ne peut pas tout compenser. La température du VRM (HWiNFO) indique s\'il est à la limite : > 110°C = danger.' },
  { id: 'i10', level: 'expert', role: 'stage', question: 'Tu dois diagnostiquer un PC qui redémarre aléatoirement en jeu mais jamais au repos. Quelle est ta démarche ?',
    keywords: ['psu', 'alimentation', 'ram', 'xmp', 'vrm', 'température', 'stabilité', 'pics'],
    idealAnswer: 'Démarche : 1) Vérifier la consommation totale et la capacité PSU (peut-être sous-dimensionnée). 2) Tester la RAM : MemTest86, désactiver XMP. 3) Vérifier températures VRM et CPU (HWiNFO64). 4) Vérifier les pilotes (DDU). 5) Tester une autre PSU. Le redémarrage en charge = souvent alimentation insuffisante ou VRM faible.' },
  { id: 'i11', level: 'intermediaire', role: 'vendeur', question: 'Un client veut jouer en 1440p 144Hz avec un budget de 1 200€. Que lui proposes-tu ?',
    keywords: ['cpu', 'gpu', 'rtx 4070', 'ryzen 5', 'ddr5', '1440p', 'budget', 'composant'],
    idealAnswer: 'Pour ce budget, je proposerais un combo équilibré : Ryzen 5 7600 + RTX 4070 Super (parfait pour 1440p), 32 Go DDR5-6000 CL30, SSD NVMe 1 To, B650 milieu de gamme. La RTX 4070 Super est le sweet spot 1440p, et le Ryzen 5 7600 évite le bottleneck.' },
  { id: 'i12', level: 'expert', role: 'technicien', question: 'Qu\'est-ce que l\'Infinity Fabric et pourquoi est-il critique sur AMD ?',
    keywords: ['infinity fabric', 'ccx', 'fclk', 'mclk', '1:1', 'latence', 'amd'],
    idealAnswer: 'L\'Infinity Fabric est le bus interne AMD qui relie les CCX et le contrôleur mémoire. Sur AM5, sa fréquence (FCLK) doit être synchronisée avec MCLK. Le ratio 1:1 minimise la latence, mais limité à 2000 MHz (donc DDR5-4000 max en 1:1). Au-delà, ratio 2:1 avec DDR5-6000 sweet spot (latence contrôlée).' },
];

// Évaluation heuristique : on cherche des mots-clés + longueur + tonalité
export function evaluateAnswer(question: InterviewQuestion, answer: string): { score: number; matched: string[]; missing: string[]; feedback: string } {
  const text = answer.toLowerCase().trim();
  const matched: string[] = [];
  const missing: string[] = [];

  question.keywords.forEach(kw => {
    if (text.includes(kw.toLowerCase())) matched.push(kw);
    else missing.push(kw);
  });

  // Score de base par couverture de mots-clés
  let score = (matched.length / question.keywords.length) * 70;

  // Bonus longueur (réponse ni trop courte ni pavé)
  const words = text.split(/\s+/).filter(Boolean).length;
  if (words >= 20 && words <= 200) score += 15;
  else if (words < 10) score -= 10;
  else if (words > 300) score -= 5;

  // Bonus précision technique (présence de termes techniques spécifiques)
  if (text.match(/\b(ns|mhz|ghz|w|go|to|mo|watt|tension|courant|signal|protocole|lane|slot|ventirad|thermal)\b/)) score += 8;

  // Bonus structure (réponse organisée)
  if (text.match(/\b\d+\)|premier|ensuite|enfin|premièrement|deuxièmement|par exemple|concrètement\b/)) score += 7;

  score = Math.max(0, Math.min(100, Math.round(score)));

  let feedback = '';
  if (score >= 80) feedback = 'Excellente réponse : précise, structurée et technique.';
  else if (score >= 60) feedback = 'Bonne réponse mais peut être améliorée.';
  else if (score >= 40) feedback = 'Réponse incomplète : il manque des notions clés.';
  else feedback = 'Réponse insuffisante. Reformule avec des termes techniques précis.';

  return { score, matched, missing, feedback };
}

export function pickInterviewQuestions(role: string, level: string, count = 5): InterviewQuestion[] {
  const filtered = INTERVIEW_QUESTIONS.filter(q => q.role === role && q.level === level);
  if (filtered.length >= count) return filtered.slice(0, count);
  // Fallback par niveau
  const sameLevel = INTERVIEW_QUESTIONS.filter(q => q.level === level);
  return (sameLevel.length >= count ? sameLevel : INTERVIEW_QUESTIONS).slice(0, count);
}
