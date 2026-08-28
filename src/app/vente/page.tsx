/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  BookOpen,
  Compass,
  Zap,
  GraduationCap,
  Wrench,
  Cpu,
  Database,
  Activity,
  RotateCcw,
  Sparkles,
  LineChart,
  Hammer,
  Mic,
  CheckCircle2,
  ArrowRight,
  Award,
  Target,
  TrendingUp,
  GraduationCap as GraduationCapIcon,
  Wrench as WrenchIcon,
  Briefcase as BriefcaseIcon,
  User as UserIcon,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Page de vente HardwarePC — `/vente`
//
// Cette page est un point d'entrée commercial public (non authentifié).
// Elle réutilise l'identité visuelle déjà en place (palette dark + accent
// teal, classes .card / .btn-* / .badge / .card-highlight définies dans
// globals.css et la tailwind.config.ts).
//
// IMPORTANT : aucun paiement réel n'est déclenché ici. Tous les CTA
// pointent vers `/auth` (inscription) ou `/tarifs` (comparaison des
// offres). Les promesses sont volontairement alignées sur ce qui
// existe déjà dans l'application (voir /tarifs).
// ---------------------------------------------------------------------------

const SITE_URL = 'https://hardware-pc-learn-3zmsiaq0x-antoine-drutel.vercel.app';
const PAGE_URL = `${SITE_URL}/vente`;

export const metadata: Metadata = {
  title: 'Deviens technicien PC — Formation hardware, montage & diagnostic',
  description:
    "Apprends le hardware, le montage, le diagnostic et les compétences indispensables pour construire, dépanner et comprendre un PC comme un professionnel. Cours, parcours, quiz, examens, tuteur IA et outils interactifs.",
  alternates: {
    canonical: '/vente',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: PAGE_URL,
    siteName: 'HardwarePC',
    title: 'Deviens technicien PC — Formation hardware, montage & diagnostic',
    description:
      "Apprends le hardware, le montage, le diagnostic et les compétences indispensables pour construire, dépanner et comprendre un PC comme un professionnel.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deviens technicien PC — Formation hardware, montage & diagnostic',
    description:
      "Apprends le hardware, le montage, le diagnostic et les compétences indispensables pour construire, dépanner et comprendre un PC comme un professionnel.",
  },
};

// --- Sections de la page -----------------------------------------------------

const DOMAINS = [
  {
    icon: BookOpen,
    title: 'Cours',
    body: "Des cours clairs et progressifs sur chaque composant, du CPU à l'alimentation, pour comprendre ce qui se passe à l'intérieur de ta machine.",
    href: '/cours',
  },
  {
    icon: Compass,
    title: 'Parcours',
    body: 'Des parcours structurés qui t\'emmènent de débutant à autonome, sans avoir à chercher ce que tu dois apprendre ensuite.',
    href: '/parcours',
  },
  {
    icon: Zap,
    title: 'Quiz',
    body: 'Des quiz courts et ciblés pour valider chaque notion et ancrer durablement tes connaissances.',
    href: '/quiz',
  },
  {
    icon: GraduationCap,
    title: 'Examens',
    body: 'Des examens blancs pour te tester en conditions réelles et identifier tes points à renforcer.',
    href: '/examens',
  },
  {
    icon: Mic,
    title: 'Entretiens',
    body: 'Des simulations d\'entretiens techniques pour préparer un poste, un stage ou une certification.',
    href: '/entretiens',
  },
  {
    icon: Wrench,
    title: 'Diagnostic PC',
    body: 'Apprends à diagnostiquer des pannes réelles : instabilités, surchauffes, écrans noirs, codes erreur, etc.',
    href: '/diagnostic',
  },
  {
    icon: Hammer,
    title: 'Constructeur PC',
    body: 'Configure ton PC idéal avec un outil qui vérifie la compatibilité, la puissance et les performances.',
    href: '/constructeur',
  },
  {
    icon: Database,
    title: 'Base de connaissances',
    body: 'Un référentiel dense et structuré sur le hardware pour revenir à tout moment sur une notion clé.',
    href: '/base-connaissances',
  },
  {
    icon: LineChart,
    title: 'Benchmarks',
    body: 'Comprends et interprète les benchmarks pour comparer les composants et choisir en connaissance de cause.',
    href: '/benchmarks',
  },
  {
    icon: Activity,
    title: 'Monitoring',
    body: 'Apprends à lire les courbes de température, d\'usage et de performances pour garder un PC sain.',
    href: '/monitoring',
  },
  {
    icon: RotateCcw,
    title: 'Révisions',
    body: 'Un système de révision intelligent qui te remet sous les yeux ce que tu as tendance à oublier.',
    href: '/revisions',
  },
  {
    icon: Sparkles,
    title: 'Tuteur IA',
    body: 'Un assistant pédagogique pour expliquer une notion, répondre à tes questions ou t\'aider à progresser.',
    href: '/tuteur',
  },
];

const JOURNEY = [
  { icon: Sparkles, label: 'Débutant' },
  { icon: BookOpen, label: 'Comprendre les composants' },
  { icon: Hammer, label: 'Monter son premier PC' },
  { icon: Wrench, label: 'Diagnostiquer les pannes' },
  { icon: Activity, label: 'Maîtriser les performances' },
  { icon: Mic, label: 'Se préparer aux entretiens' },
  { icon: Award, label: 'Niveau technicien' },
];

const PRACTICE = [
  {
    icon: Zap,
    title: 'Quiz interactifs',
    body: 'Vérifie tes acquis bloc par bloc, avec correction immédiate.',
  },
  {
    icon: GraduationCap,
    title: 'Examens blancs',
    body: 'Conditions réelles, score global, retour sur les erreurs.',
  },
  {
    icon: Wrench,
    title: 'Diagnostics guidés',
    body: 'Apprends la méthode pro face à un PC qui ne démarre plus.',
  },
  {
    icon: Cpu,
    title: 'Simulations techniques',
    body: 'Choisis des composants, compare des configs, anticipe les conflits.',
  },
  {
    icon: Hammer,
    title: 'Constructeur PC',
    body: 'Un atelier complet pour assembler ta première config en sécurité.',
  },
  {
    icon: Target,
    title: 'Mode technicien & mode client',
    body: 'Deux angles pour comprendre la relation client et la posture pro.',
  },
];

const PROFILES = [
  {
    icon: UserIcon,
    title: 'Débutant',
    body: 'Tu pars de zéro et veux comprendre comment fonctionne un PC.',
  },
  {
    icon: WrenchIcon,
    title: 'Passionné',
    body: 'Tu veux améliorer tes connaissances et construire tes propres configurations.',
  },
  {
    icon: GraduationCapIcon,
    title: 'Futur technicien',
    body: 'Tu veux apprendre à diagnostiquer, dépanner et travailler comme un professionnel.',
  },
  {
    icon: BriefcaseIcon,
    title: 'Futur professionnel',
    body: 'Tu veux te préparer aux entretiens et développer des compétences concrètes.',
  },
];

const PLANS = [
  {
    name: 'FREE',
    price: '0 €',
    badge: 'Découverte',
    accent: false,
    bullets: [
      'Accès à une sélection de cours',
      'Quiz des catégories gratuites',
      'Diagnostic basique',
      'Aperçu du Tuteur IA',
    ],
  },
  {
    name: 'ESSENTIEL',
    price: '7,99 €',
    cadence: '/ mois',
    badge: 'Pour progresser',
    accent: false,
    bullets: [
      'Cours et parcours étendus',
      'Examens basiques',
      'Tuteur IA — 20 messages / mois',
      'Suivi de progression',
    ],
  },
  {
    name: 'PRO',
    price: '14,99 €',
    cadence: '/ mois',
    badge: 'Le plus populaire',
    accent: true,
    bullets: [
      'Tous les cours, parcours et quiz',
      'Examens et entretiens complets',
      'Tuteur IA — 150 messages / mois',
      'Mode technicien & mode client',
    ],
  },
  {
    name: 'ULTIMATE',
    price: '24,99 €',
    cadence: '/ mois',
    badge: 'Pour aller plus loin',
    accent: false,
    bullets: [
      'Diagnostic et monitoring avancés',
      'Base de connaissances complète',
      'Tuteur IA — 500 messages / mois',
      'Révisions intelligentes',
    ],
  },
];

const REASONS = [
  {
    icon: Compass,
    title: 'Apprentissage progressif',
    body: 'Tu avances étape par étape, avec un ordre pensé pour ne rien rater.',
  },
  {
    icon: Hammer,
    title: 'La pratique avant tout',
    body: 'Quiz, diagnostics, simulations et constructeur PC : tu apprends en faisant.',
  },
  {
    icon: TrendingUp,
    title: 'Suivi de progression',
    body: 'Tu vois ce que tu as terminé, ce qui reste à revoir et où tu en es.',
  },
  {
    icon: Zap,
    title: 'Quiz & examens',
    body: 'Valide chaque notion, puis teste-toi en conditions réelles.',
  },
  {
    icon: Wrench,
    title: 'Outils interactifs',
    body: 'Constructeur PC, diagnostic, monitoring, benchmarks : tout est intégré.',
  },
  {
    icon: Award,
    title: 'Métier de technicien',
    body: 'Des contenus orientés terrain, pas seulement théorie.',
  },
  {
    icon: Sparkles,
    title: 'Tuteur IA',
    body: 'Un assistant pédagogique pour t\'expliquer ce que tu n\'as pas compris.',
  },
  {
    icon: Database,
    title: 'Une seule plateforme',
    body: 'Cours, outils, révisions et suivi : tout est centralisé au même endroit.',
  },
];

const FAQS = [
  {
    q: 'Est-ce adapté aux débutants ?',
    a: "Oui. Les parcours commencent au niveau débutant et t'amènent progressivement vers l'autonomie. Tu n'as besoin d'aucune base technique pour démarrer.",
  },
  {
    q: 'Puis-je commencer gratuitement ?',
    a: "Oui. L'offre FREE te permet de découvrir la plateforme, certains cours et quiz, sans carte bancaire.",
  },
  {
    q: 'Quelle est la différence entre les abonnements ?',
    a: "L'offre FREE permet de découvrir. ESSENTIEL débloque les cours et parcours étendus. PRO ajoute examens, entretiens, modes technicien/client et un Tuteur IA plus généreux. ULTIMATE va encore plus loin avec diagnostic, monitoring et révisions avancés.",
  },
  {
    q: 'Puis-je suivre ma progression ?',
    a: "Oui. Chaque cours, quiz, examen et défi complété est enregistré. Tu peux revenir à tout moment sur ce que tu as déjà fait.",
  },
  {
    q: 'Le Tuteur IA est-il inclus ?',
    a: "Oui, selon ton offre : quelques essais en FREE, 20 messages / mois en ESSENTIEL, 150 en PRO et 500 en ULTIMATE. Il peut t'expliquer une notion, répondre à une question ou t'aider à comprendre une erreur.",
  },
  {
    q: 'Puis-je arrêter mon abonnement ?',
    a: "Oui. Tu peux interrompre ton abonnement à tout moment depuis tes paramètres. Ta progression est conservée et tu peux la retrouver si tu reviens plus tard.",
  },
  {
    q: "Qu'est-ce que l'offre Ultimate Lifetime ?",
    a: "C'est un paiement unique de 399 € qui te donne accès à vie à toutes les fonctionnalités de la plateforme. Une alternative à l'abonnement mensuel pour ceux qui veulent s'engager sur la durée.",
  },
];

// --- Composant --------------------------------------------------------------

export default function VentePage() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <main className="px-6 sm:px-10 py-10 lg:py-16 max-w-7xl w-full mx-auto space-y-24 lg:space-y-32">
        {/* ============================================================
            1. HERO
            ============================================================ */}
        <section className="text-center pt-6 lg:pt-12">
          <span className="badge-accent">HardwarePC · Formation</span>
          <h1 className="mt-6 font-display font-semibold text-[clamp(2.5rem,6vw,5rem)] leading-[1.02] tracking-[-0.02em] text-text max-w-[18ch] mx-auto">
            Deviens un véritable technicien PC.
          </h1>
          <p className="mt-6 text-muted text-[17px] sm:text-[18px] max-w-[58ch] mx-auto leading-relaxed">
            Apprends le hardware, le montage, le diagnostic et les compétences
            indispensables pour construire, dépanner et comprendre un PC comme
            un professionnel.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/auth" className="btn-primary">
              Commencer gratuitement
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/tarifs" className="btn-outline">
              Voir les offres
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted">
            Aucune carte bancaire requise pour commencer.
          </p>
        </section>

        {/* ============================================================
            2. APPRENDS BIEN PLUS QUE LE HARDWARE
            ============================================================ */}
        <section aria-labelledby="domain-title">
          <SectionHeader
            eyebrow="Tout ce dont tu as besoin"
            title="Apprends bien plus que le hardware."
            id="domain-title"
            description="Une seule plateforme pour apprendre, pratiquer, diagnostiquer et suivre ta progression."
          />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DOMAINS.map(({ icon: Icon, title, body, href }) => (
              <Link
                key={title}
                href={href}
                className="card card-hover p-5 flex flex-col gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl grid place-items-center bg-bg-elev border border-border text-accent">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-text">
                  {title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">{body}</p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm text-accent opacity-80 group-hover:opacity-100">
                  Découvrir <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ============================================================
            3. UN PARCOURS POUR DEVENIR TECHNICIEN
            ============================================================ */}
        <section aria-labelledby="journey-title">
          <SectionHeader
            eyebrow="Progression claire"
            title="Un parcours pour devenir technicien."
            id="journey-title"
            description="Tu n'es pas lâché seul face au hardware. La plateforme te guide, étape par étape."
          />

          <ol className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {JOURNEY.map((step, i) => (
              <li
                key={step.label}
                className="card p-4 flex flex-col items-start gap-3 relative"
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="text-xs uppercase tracking-[0.12em] text-muted">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="hair-rule flex-1" />
                </div>
                <div className="w-9 h-9 rounded-lg grid place-items-center bg-accent/10 border border-accent/30 text-accent">
                  <step.icon className="w-4.5 h-4.5" />
                </div>
                <p className="font-medium text-text text-sm leading-snug">
                  {step.label}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-center text-muted text-sm">
            Tu suis ta progression à chaque étape — cours terminés, quiz
            validés, examens passés, défis relevés.
          </p>
        </section>

        {/* ============================================================
            4. APPRENDS EN PRATIQUANT
            ============================================================ */}
        <section aria-labelledby="practice-title">
          <SectionHeader
            eyebrow="Pas seulement des vidéos"
            title="Apprends en pratiquant."
            id="practice-title"
            description="HardwarePC n'est pas une simple bibliothèque de cours : tu apprends en faisant."
          />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRACTICE.map(({ icon: Icon, title, body }) => (
              <div key={title} className="card p-5 space-y-2">
                <div className="w-10 h-10 rounded-xl grid place-items-center bg-bg-elev border border-border text-accent">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-text">
                  {title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            5. TON TUTEUR IA
            ============================================================ */}
        <section aria-labelledby="tutor-title">
          <div className="card-highlight text-center lg:text-left lg:flex lg:items-center lg:gap-12">
            <div className="flex-1">
              <span className="badge border-accent/40 text-accent bg-transparent">
                Tuteur IA
              </span>
              <h2
                id="tutor-title"
                className="mt-4 font-display text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-text"
              >
                Ton Tuteur IA, toujours là pour t'expliquer.
              </h2>
              <p className="mt-3 text-text/80 max-w-[60ch] lg:max-w-[55ch] mx-auto lg:mx-0 leading-relaxed">
                Un assistant pédagogique qui t'aide à comprendre, à débloquer
                une erreur et à avancer à ton rythme.
              </p>
              <ul className="mt-6 grid sm:grid-cols-2 gap-2 text-left max-w-xl mx-auto lg:mx-0">
                {[
                  'Expliquer une notion',
                  'Répondre à tes questions',
                  "T'aider à comprendre une erreur",
                  "T'accompagner dans ton apprentissage",
                  'T’aider à progresser',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-text/90"
                  >
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link href="/tarifs" className="btn-primary">
                  Voir les offres
                </Link>
                <Link href="/tuteur" className="btn-outline">
                  Découvrir le Tuteur IA
                </Link>
              </div>
            </div>
            <div className="mt-8 lg:mt-0 flex-1 hidden lg:block">
              <div className="card p-5 text-left space-y-3 max-w-md mx-auto">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full grid place-items-center bg-accent/15 border border-accent/30 text-accent">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-muted">Tuteur IA</span>
                </div>
                <p className="text-text text-sm leading-relaxed">
                  « C'est normal que mon PC redémarre tout seul en jeu ? »
                </p>
                <p className="text-text/80 text-sm leading-relaxed">
                  Pas forcément, mais c'est un classique. Vérifions d'abord
                  trois choses : la température CPU en charge, la stabilité
                  de l'alimentation et les paramètres XMP/EXPO de la RAM.
                </p>
                <div className="hair-rule" />
                <p className="text-xs text-muted">
                  Disponible selon ton offre · voir{' '}
                  <Link href="/tarifs" className="text-accent">
                    les détails
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            6. UNE PLATEFORME QUI TE SUIT
            ============================================================ */}
        <section aria-labelledby="follow-title">
          <SectionHeader
            eyebrow="Tu construis tes compétences"
            title="Une plateforme qui te suit."
            id="follow-title"
            description="Tu ne te contentes pas de regarder des cours. Tu construis progressivement tes compétences."
          />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: TrendingUp, title: 'Progression' },
              { icon: RotateCcw, title: 'Révisions' },
              { icon: Activity, title: 'Historique' },
              { icon: Compass, title: 'Parcours personnalisé' },
            ].map(({ icon: Icon, title }) => (
              <div key={title} className="card p-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl grid place-items-center bg-accent/10 border border-accent/30 text-accent">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-text">{title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            7. POUR QUI ?
            ============================================================ */}
        <section aria-labelledby="audience-title">
          <SectionHeader
            eyebrow="Pour tous les niveaux"
            title="Pour qui ?"
            id="audience-title"
            description="Que tu partes de zéro ou que tu vises un poste de technicien, il y a un point d'entrée pour toi."
          />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROFILES.map((p) => (
              <div key={p.title} className="card p-5 space-y-2">
                <div className="w-10 h-10 rounded-xl grid place-items-center bg-bg-elev border border-border text-accent">
                  <p.icon className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-text">
                  {p.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            8. TARIFS (présentation courte, renvoie vers /tarifs)
            ============================================================ */}
        <section aria-labelledby="pricing-title">
          <SectionHeader
            eyebrow="Offres"
            title="Des formules adaptées à ton rythme."
            id="pricing-title"
            description="Choisis l'offre qui te correspond. Le détail complet est sur la page des tarifs."
          />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={
                  'card p-5 flex flex-col gap-4 ' +
                  (plan.accent ? 'border-accent/50' : '')
                }
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-semibold tracking-wider text-text">
                    {plan.name}
                  </h3>
                  {plan.accent ? (
                    <span className="badge badge-accent">
                      Le plus populaire
                    </span>
                  ) : (
                    <span className="badge">{plan.badge}</span>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-3xl font-bold text-text tabular-nums">
                    {plan.price}
                  </span>
                  {plan.cadence && (
                    <span className="text-muted text-sm">{plan.cadence}</span>
                  )}
                </div>
                <ul className="space-y-2 text-sm text-text/90">
                  {plan.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-muted text-sm">
            Une offre <strong className="text-text">Ultimate Lifetime</strong>{' '}
            à 399 € (paiement unique) est également disponible.
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/tarifs" className="btn-primary">
              Comparer les offres
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ============================================================
            9. POURQUOI HARDWARE PC LEARN ?
            ============================================================ */}
        <section aria-labelledby="why-title">
          <SectionHeader
            eyebrow="Ce qui fait la différence"
            title="Pourquoi Hardware PC Learn ?"
            id="why-title"
            description="Une plateforme pensée pour celles et ceux qui veulent vraiment comprendre — et pas seulement regarder."
          />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REASONS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="card p-5 space-y-2">
                <div className="w-10 h-10 rounded-xl grid place-items-center bg-bg-elev border border-border text-accent">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display text-base font-semibold text-text">
                  {title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            10. FAQ
            ============================================================ */}
        <section aria-labelledby="faq-title">
          <SectionHeader
            eyebrow="Questions fréquentes"
            title="On répond à tes questions."
            id="faq-title"
          />
          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            {FAQS.map((f) => (
              <div
                key={f.q}
                className="card p-5 space-y-2"
              >
                <h3 className="font-medium text-text">{f.q}</h3>
                <p className="text-muted text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            11. CTA FINAL
            ============================================================ */}
        <section className="card-highlight text-center py-12 lg:py-16">
          <span className="badge border-border text-muted bg-transparent">
            Prêt à passer au niveau supérieur ?
          </span>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.02em] text-text max-w-[22ch] mx-auto">
            Prêt à passer au niveau supérieur ?
          </h2>
          <p className="mt-3 text-text/80 max-w-[55ch] mx-auto leading-relaxed">
            Commence gratuitement et construis progressivement tes compétences
            en hardware et en informatique.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth" className="btn-primary">
              Commencer gratuitement
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/tarifs" className="btn-outline">
              Voir les offres
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

// --- Sous-composant --------------------------------------------------------

function SectionHeader({
  eyebrow,
  title,
  description,
  id,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  id?: string;
}) {
  return (
    <header className="text-center max-w-[60ch] mx-auto">
      <span className="badge-accent">{eyebrow}</span>
      <h2
        id={id}
        className="mt-4 font-display text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-text"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-muted text-[15px] sm:text-[16px] leading-relaxed">
          {description}
        </p>
      )}
    </header>
  );
}
