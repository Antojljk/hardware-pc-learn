/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import {
  HeartHandshake,
  DollarSign,
  Users,
  ShieldCheck,
  Brain,
  Wrench,
  List,
  GraduationCap,
  MessageCircle,
  Zap,
  TrendingUp,
} from 'lucide-react';

export default async function TarifsPage() {
  await getCurrentUser();

  return (
    <div className="space-y-16">
      {/* Header */}
      <section className="text-center">
        <span className="badge-accent">Nouveau</span>
        <h1 className="font-display font-semibold text-[clamp(2.5rem,6vw,5rem)] leading-[1.02] tracking-[-0.02em] text-text">
          Choisis votre plan HardwarePC
        </h1>
        <p className="text-muted mt-4 text-[18px] max-w-[36ch] mx-auto">
          Accédez à toutes les fonctionnalités selon vos besoins. Du découverte gratuite
          à l'expérience complète avec accompagnement IA.
        </p>
      </section>

      {/* Toggle: Monthly / Annually */}
      <section className="flex justify-center mb-10">
        <div className="inline-flex items-center rounded-xl bg-bg-evol px-3">
          <label
            htmlFor="toggle-billing"
            className="cursor-pointer text-sm font-medium text-muted px-3 py-2 rounded-l-xl hover:text-text"
          >
            Mensuel
          </label>
          <input
            id="toggle-billing"
            type="checkbox"
            className="hidden peer"
            checked
          />
          <label
            htmlFor="toggle-billing"
            className="cursor-pointer text-sm font-medium text-muted px-3 py-2 rounded-r-xl hover:text-text peer-checked:bg-accent/10 peer-checked:text-accent transition-colors"
          >
            Annuel (-17%)
          </label>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FREE */}
        <div className="card p-6 space-y-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-text">Gratuit</h2>
            <span className="badge">FREE</span>
          </div>

          <div className="space-y-4">
            <div className="text-3xl font-display font-bold tabular-nums text-text">
              0€
            </div>
            <p className="text-muted">/ mois</p>
          </div>

          <ul className="space-y-3 text-[14px]">
            <li className="flex items-start gap-3">
              <Brain className="w-4 h-4 mt-0.5 text-muted" />
              <span>2 catégories de cours</span>
            </li>
            <li className="flex items-start gap-3">
              <List className="w-4 h-4 mt-0.5 text-muted" />
              <span>1 parcours complet</span>
            </li>
            <li className="flex items-start gap-3">
              <Zap className="w-4 h-4 mt-0.5 text-muted" />
              <span>Quiz des catégories gratuites</span>
            </li>
            <li className="flex items-start gap-3">
              <MessageCircle className="w-4 h-4 mt-0.5 text-muted" />
              <span>3 essais Tuteur IA</span>
            </li>
            <li className="flex items-start gap-3">
              <Wrench className="w-4 h-4 mt-0.5 text-muted" />
              <span>Diagnostic basique</span>
            </li>
            <li className="flex items-start gap-3">
              <Users className="w-4 h-4 mt-0.5 text-muted" />
              <span>Profil et paramètres</span>
            </li>
            <li className="flex items-start gap-3">
              <HeartHandshake className="w-4 h-4 mt-0.5 text-muted" />
              <span>Base de connaissances limitée (2 catégories)</span>
            </li>
          </ul>

          <div className="mt-6">
            <Link href="/auth" className="w-full btn-primary">
              Commencer gratuitement
            </Link>
          </div>
        </div>

        {/* ESSENTIEL - Most Popular */}
        <div className="card p-6 space-y-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-text">Essentiel</h2>
            <span className="badge badge-accent">POPULAIRE</span>
          </div>

          <div className="space-y-4">
            <div className="text-3xl font-display font-bold tabular-nums text-text">
              7,99€
            </div>
            <p className="text-muted">/ mois</p>
          </div>

          <ul className="space-y-3 text-[14px]">
            <li className="flex items-start gap-3">
              <Brain className="w-4 h-4 mt-0.5 text-muted" />
              <span>Accès étendu aux cours</span>
            </li>
            <li className="flex items-start gap-3">
              <List className="w-4 h-4 mt-0.5 text-muted" />
              <span>Plusieurs parcours</span>
            </li>
            <li className="flex items-start gap-3">
              <Zap className="w-4 h-4 mt-0.5 text-muted" />
              <span>Quiz accès étendu</span>
            </li>
            <li className="flex items-start gap-3">
              <GraduationCap className="w-4 h-4 mt-0.5 text-muted" />
              <span>Examens basiques</span>
            </li>
            <li className="flex items-start gap-3">
              <MessageCircle className="w-4 h-4 mt-0.5 text-muted" />
              <span>20 messages Tuteur IA/mois</span>
            </li>
            <li className="flex items-start gap-3">
              <Wrench className="w-4 h-4 mt-0.5 text-muted" />
              <span>Diagnostic étendu</span>
            </li>
            <li className="flex items-start gap-3">
              <HeartHandshake className="w-4 h-4 mt-0.5 text-muted" />
              <span>Base de connaissances étendue</span>
            </li>
            <li className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 mt-0.5 text-muted" />
              <span>Révisions avancées</span>
            </li>
            <li className="flex items-start gap-3">
              <TrendingUp className="w-4 h-4 mt-0.5 text-muted" />
              <span>Monitoring étendu</span>
            </li>
            <li className="flex items-start gap-3">
              <Users className="w-4 h-4 mt-0.5 text-muted" />
              <span>Constructeur PC complet</span>
            </li>
            <li className="flex items-start gap-3">
              <DollarSign className="w-4 h-4 mt-0.5 text-muted" />
              <span>Progression complète</span>
            </li>
          </ul>

          <div className="mt-6">
            <Link href="/auth" className="w-full btn-primary">
              Commencer l'essai
            </Link>
          </div>
        </div>

        {/* PRO */}
        <div className="card p-6 space-y-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-text">Pro</h2>
            <span className="badge badge-warning">LE PLUS POPULAIRE</span>
          </div>

          <div className="space-y-4">
            <div className="text-3xl font-display font-bold tabular-nums text-text">
              14,99€
            </div>
            <p className="text-muted">/ mois</p>
          </div>

          <ul className="space-y-3 text-[14px]">
            <li className="flex items-start gap-3">
              <Brain className="w-4 h-4 mt-0.5 text-muted" />
              <span>Tous les cours</span>
            </li>
            <li className="flex items-start gap-3">
              <List className="w-4 h-4 mt-0.5 text-muted" />
              <span>Tous les parcours</span>
            </li>
            <li className="flex items-start gap-3">
              <Zap className="w-4 h-4 mt-0.5 text-muted" />
              <span>Tous les quiz</span>
            </li>
            <li className="flex items-start gap-3">
              <GraduationCap className="w-4 h-4 mt-0.5 text-muted" />
              <span>Examens complets</span>
            </li>
            <li className="flex items-start gap-3">
              <Users className="w-4 h-4 mt-0.5 text-muted" />
              <span>Entretiens complets</span>
            </li>
            <li className="flex items-start gap-3">
              <MessageCircle className="w-4 h-4 mt-0.5 text-muted" />
              <span>150 messages Tuteur IA/mois</span>
            </li>
            <li className="flex items-start gap-3">
              <Wrench className="w-4 h-4 mt-0.5 text-muted" />
              <span>Diagnostic avancé</span>
            </li>
            <li className="flex items-start gap-3">
              <HeartHandshake className="w-4 h-4 mt-0.5 text-muted" />
              <span>Base de connaissances complète</span>
            </li>
            <li className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 mt-0.5 text-muted" />
              <span>Révisions intelligentes</span>
            </li>
            <li className="flex items-start gap-3">
              <TrendingUp className="w-4 h-4 mt-0.5 text-muted" />
              <span>Monitoring avancé</span>
            </li>
            <li className="flex items-start gap-3">
              <Users className="w-4 h-4 mt-0.5 text-muted" />
              <span>Constructeur PC complet</span>
            </li>
            <li className="flex items-start gap-3">
              <DollarSign className="w-4 h-4 mt-0.5 text-muted" />
              <span>Mode technicien disponible</span>
            </li>
            <li className="flex items-start gap-3">
              <Users className="w-4 h-4 mt-0.5 text-muted" />
              <span>Mode client disponible</span>
            </li>
            <li className="flex items-start gap-3">
              <DollarSign className="w-4 h-4 mt-0.5 text-muted" />
              <span>Progression complète</span>
            </li>
          </ul>

          <div className="mt-6">
            <Link href="/auth" className="w-full btn-primary">
              Choisir Pro
            </Link>
          </div>
        </div>
      </section>

      {/* Ultimate Lifetime Section */}
      <section className="card p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-semibold text-text">
            Ultimate Lifetime
          </h2>
          <span className="badge badge-warning">Paiement unique</span>
        </div>

        <div className="space-y-4 text-center">
          <div className="text-4xl font-display font-bold tabular-nums text-text">
            399€
          </div>
          <p className="text-muted">Au lieu de 299,88€ (12 mois)</p>
        </div>

        <ul className="space-y-3 text-[14px] mt-4">
          <li className="flex items-start gap-3">
            <Brain className="w-4 h-4 mt-0.5 text-muted" />
            <span>Tous les cours</span>
          </li>
          <li className="flex items-start gap-3">
            <List className="w-4 h-4 mt-0.5 text-muted" />
            <span>Tous les parcours</span>
          </li>
          <li className="flex items-start gap-3">
            <Zap className="w-4 h-4 mt-0.5 text-muted" />
            <span>Tous les quiz</span>
          </li>
          <li className="flex items-start gap-3">
            <GraduationCap className="w-4 h-4 mt-0.5 text-muted" />
            <span>Examens complets</span>
          </li>
          <li className="flex items-start gap-3">
            <Users className="w-4 h-4 mt-0.5 text-muted" />
            <span>Entretiens complets</span>
          </li>
          <li className="flex items-start gap-3">
            <MessageCircle className="w-4 h-4 mt-0.5 text-muted" />
            <span>500 messages Tuteur IA/mois</span>
          </li>
          <li className="flex items-start gap-3">
            <Wrench className="w-4 h-4 mt-0.5 text-muted" />
            <span>Diagnostic complet</span>
          </li>
          <li className="flex items-start gap-3">
            <HeartHandshake className="w-4 h-4 mt-0.5 text-muted" />
            <span>Base de connaissances complète</span>
          </li>
          <li className="flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 mt-0.5 text-muted" />
            <span>Révisions intelligentes+</span>
          </li>
          <li className="flex items-start gap-3">
            <TrendingUp className="w-4 h-4 mt-0.5 text-muted" />
            <span>Monitoring complet</span>
          </li>
          <li className="flex items-start gap-3">
            <Users className="w-4 h-4 mt-0.5 text-muted" />
            <span>Constructeur PC complet</span>
          </li>
          <li className="flex items-start gap-3">
            <Users className="w-4 h-4 mt-0.5 text-muted" />
            <span>Mode technicien disponible</span>
          </li>
          <li className="flex items-start gap-3">
            <Users className="w-4 h-4 mt-0.5 text-muted" />
            <span>Mode client disponible</span>
          </li>
          <li className="flex items-start gap-3">
            <DollarSign className="w-4 h-4 mt-0.5 text-muted" />
            <span>Progression complète</span>
          </li>
        </ul>

        <div className="mt-6">
          <Link href="/auth" className="w-full btn-primary">
            Choisir Ultimate Lifetime
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <div className="space-y-6">
          <h2 className="font-display text-2xl font-semibold text-text">
            Questions fréquentes
          </h2>

          <div className="space-y-4">
            <div className="border border-border rounded-xl p-5">
              <h3 className="font-medium text-text mb-2">
                Quelle est la différence entre les offres ?
              </h3>
              <p className="text-muted text-[14px] leading-relaxed">
                L'offre <strong>Gratuite</strong> vous donne accès à 2 catégories de cours, 1 parcours et les quiz associés.
                <strong>Essentiel</strong> (7,99€/mois) ajoute l'accès étendu aux cours, plusieurs parcours, les examens basiques
                et 20 messages/mois avec le Tuteur IA. <strong>Pro</strong> (14,99€/mois) offre l'accès complet à tout le contenu
                incluant les examens et entretiens complets, avec 150 messages Tuteur IA/mois et les modes technicien/client.
                <strong>Ultimate</strong> (24,99€/mois) ajoute le diagnostic complet et 500 messages Tuteur IA/mois.
              </p>
            </div>

            <div className="border border-border rounded-xl p-5">
              <h3 className="font-medium text-text mb-2">
                Comment fonctionne le paiement mensuel vs annuel ?
              </h3>
              <p className="text-muted text-[14px] leading-relaxed">
                Le paiement mensuel est prélevé chaque mois sans engagement. Le paiement annuel vous offre une réduction de 17%
                (équivalent à 2 mois gratuits) et est renouvelé automatiquement chaque année. Vous pouvez passer du mensuel
                à l'annuel (et vice versa) à tout moment depuis vos paramètres de compte.
              </p>
            </div>

            <div className="border border-border rounded-xl p-5">
              <h3 className="font-medium text-text mb-2">
                Qu'est-ce que l'offre Ultimate Lifetime ?
              </h3>
              <p className="text-muted text-[14px] leading-relaxed">
                L'offre Ultimate Lifetime est un paiement unique de 399€ qui vous donne accès à vie à toutes les fonctionnalités
                du plan Ultimate (24,99€/mois). Cela représente une économie de plus de 65% comparé à un abonnement mensuel
                standard sur 2 ans. Aucun paiement récurrent n'est requis après cet achat unique.
              </p>
            </div>

            <div className="border border-border rounded-xl p-5">
              <h3 className="font-medium text-text mb-2">
                Comment fonctionne le Tuteur IA et quelles sont les limites ?
              </h3>
              <p className="text-muted text-[14px] leading-relaxed">
                Le Tuteur IA est votre assistant personnel disponible 24/7 pour répondre à vos questions sur le hardware PC.
                Selon votre forfait, vous disposez d'un certain nombre de messages par mois : 3 essais (Gratuit), 20 (Essentiel),
                150 (Pro) ou 500 (Ultimate). Les messages non utilisés ne sont pas reportés au mois suivant.
              </p>
            </div>

            <div className="border border-border rounded-xl p-5">
              <h3 className="font-medium text-text mb-2">
                Ma progression est-elle préservée si je change d'offre ou arrête mon abonnement ?
              </h3>
              <p className="text-muted text-[14px] leading-relaxed">
                Oui ! Votre progression, vos XP, vos badges débloqués et votre historique d'apprentissage restent sauvegardés
                dans votre compte, même si vous passez à l'offre gratuite ou si vous arrêtez votre abonnement. Vous pourrez
                toujours consulter vos statistiques et continuer depuis où vous vous êtes arrêté.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="card-highlight text-center py-12">
        <span className="badge border-border text-muted bg-transparent">
          Prêt à passer au niveau supérieur ?
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.03em] mt-4 text-text">
          Développez vos compétences hardware sans limite
        </h2>
        <p className="text-muted mt-3 max-w-[32ch] mx-auto leading-relaxed">
          Que vous soyez débutant curieux ou professionnel en quête de certification, HardwarePC s'adapte à votre rythme
          et à vos objectifs d'apprentissage.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Link href="/auth" className="flex-1 btn-primary">
            Commencer l'essai gratuit
          </Link>
          <Link href="/dashboard" className="flex-1 btn-outline">
            Déjà membre ? Se connecter
          </Link>
        </div>
      </section>
    </div>
  );
}