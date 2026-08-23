# HardwarePC — Plateforme d'apprentissage du hardware PC

> Plateforme web éducative interactive pour apprendre le hardware informatique, de débutant à expert.
> Cours, quiz, examens blancs, entretiens simulés, laboratoire de diagnostic, constructeur de configurations, glossaire, et bien plus.

![Stack](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Prisma](https://img.shields.io/badge/Prisma-6-2D3748) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC)

## 🎯 Vision

Devenir ton propre "Duolingo du hardware" : progression gamifiée (XP, niveaux, badges, série), adaptation au niveau, parcours personnalisé, et un système de maîtrise par domaine qui génère automatiquement des révisions sur tes points faibles.

## ✨ Fonctionnalités principales

| Module | Description |
|--------|-------------|
| **Dashboard** | Niveau, XP, série, maîtrise par domaine, prochain cours recommandé |
| **Cours** | 4 parcours (Fondamentaux → Intermédiaire → Avancé → Technicien) avec explications simple + technique + exemples + erreurs fréquentes + "à retenir" |
| **Quiz** | Quiz libre + adaptatif (ajuste la difficulté selon tes performances). ~60 questions catégorisées |
| **Examens blancs** | Examen Débutant / Assembleur / Technicien, chronométrés, avec historique |
| **Entretiens blancs** | 5 rôles (monteur, technicien, support, vendeur, stage) × 4 niveaux + évaluation heuristique des réponses |
| **Diagnostic PC** | 10 scénarios de pannes réelles, évalue ton raisonnement, donne la cause racine et la solution |
| **Constructeur PC** | Vérification de compatibilité en direct (socket, RAM, format, alimentation, dimensions) + scoring perf/valeur/évolutivité |
| **Défis** | "PC gaming à 1 000€", "PC création à 2 000€", etc. avec contraintes et budget |
| **Glossaire** | 130+ termes, recherche, filtres par niveau/catégorie |
| **Révisions espacées** | Algorithme SM-2 like, génère les cartes automatiquement depuis le glossaire |
| **Tuteur IA** | Pose une question, réponse locale (banque pédagogique) ou OpenAI si clé fournie |
| **Progression** | Statistiques, graphiques (Recharts), domaines forts/faibles, badges |
| **Monitoring** | Comprendre les capteurs (CPU/GPU temp, usage, etc.) |
| **Benchmarks** | Apprendre à interpréter FPS, 1% low, frametime |
| **Base de connaissances** | Fiches par catégorie (CPU, GPU, RAM, etc.) |
| **Mode technicien** | Diagnostic sans guidage |
| **Mode client** | Simulation conversationnelle, évalue communication + technique |
| **Admin** | Vue d'ensemble des contenus |

## 🛠️ Stack

- **Framework** : Next.js 14 (App Router) + TypeScript
- **UI** : Tailwind CSS, Lucide React, Framer Motion (léger)
- **DB** : Prisma + SQLite (par défaut) — bascule PostgreSQL possible
- **Auth** : JWT (jose) + bcryptjs, session cookie httpOnly
- **Charts** : Recharts
- **Validation** : Zod

## � Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env (par défaut OK pour dev local)

# 3. Initialiser la base de données + seed
npm run setup
# ou étape par étape :
npm run prisma:generate
npm run prisma:push
npm run prisma:seed

# 4. Lancer en dev
npm run dev
```

L'application sera accessible sur **http://localhost:3000**.

### Variables d'environnement

```env
DATABASE_URL="file:./dev.db"          # SQLite par défaut
JWT_SECRET="change-me-..."             # 32+ caractères
OPENAI_API_KEY="sk-..."                # Optionnel — active le tuteur conversationnel
```

Si `OPENAI_API_KEY` n'est pas définie, le tuteur fonctionne en mode local (banque de réponses pédagogiques pré-écrites).

## 🗂️ Architecture

```
hardware-pc-learn/
├── prisma/
│   ├── schema.prisma           # Modèles : User, Lesson, QuizQuestion, Exam, …
│   ├── seed.ts                 # Peuple la DB depuis src/content/*
│   └── dev.db                  # Base SQLite (auto-créée)
├── src/
│   ├── app/                    # Routes Next.js (App Router)
│   │   ├── api/                # API routes
│   │   ├── auth/               # Login / Register / Guest
│   │   ├── cours/              # Cours & parcours
│   │   ├── quiz/               # Quiz libre & adaptatif
│   │   ├── examens/            # Examens blancs
│   │   ├── entretiens/         # Entretiens simulés
│   │   ├── diagnostic/         # Laboratoire de diagnostic
│   │   ├── constructeur/       # Builder + défis
│   │   ├── glossaire/          # Glossaire
│   │   ├── revisions/          # Révisions espacées
│   │   ├── tuteur/             # Tuteur IA
│   │   ├── progression/        # Statistiques
│   │   ├── monitoring/         # Capteurs PC
│   │   ├── benchmarks/         # Comprendre les benchs
│   │   ├── base-connaissances/ # Fiches par catégorie
│   │   ├── mode-technicien/    # Diagnostic libre
│   │   ├── mode-client/        # Simulation client
│   │   ├── admin/              # Admin
│   │   ├── profil/             # Profil
│   │   └── parametres/         # Paramètres
│   ├── components/             # Composants partagés
│   │   └── shell/              # Layout (Sidebar, TopBar, MobileNav)
│   ├── content/                # Données pédagogiques (statiques)
│   │   ├── courses.ts          # Cours & parcours
│   │   ├── quizzes.ts          # Questions & examens
│   │   ├── glossary.ts         # Glossaire
│   │   ├── components.ts       # Catalogue composants PC
│   │   └── diagnostics.ts      # Scénarios de diagnostic
│   └── lib/
│       ├── auth.ts             # Auth (JWT, sessions)
│       ├── compat.ts           # Compatibilité + scoring PC builds
│       ├── gamification.ts     # XP, streaks, mastery, badges
│       ├── interview.ts        # Banque questions + évaluateur heuristique
│       ├── prisma.ts           # Client Prisma
│       ├── utils.ts            # Helpers
│       └── xp.ts               # Niveaux + domaines
```

## 🧪 Commandes utiles

```bash
npm run dev              # Dev server
npm run build            # Build production
npm run start            # Serveur production
npm run lint             # ESLint
npm run prisma:generate  # Régénère le client Prisma
npm run prisma:push      # Synchronise le schéma avec la DB
npm run prisma:seed      # Peuple la DB
npm run setup            # Tout en un : generate + push + seed
```

## 🔐 Sécurité

- Mots de passe hashés (bcrypt, 10 rounds)
- Sessions JWT (jose, HS256) en cookie httpOnly
- Validation Zod côté serveur pour toutes les routes API
- Pas de secrets exposés côté client
- Routes protégées (redirection `/auth` si non connecté)

## 🎮 Système de progression

- **7 niveaux** : Débutant → Initié → Assembleur → Technicien I → Technicien confirmé → Expert → Maître
- **XP** : cours (30), quiz (10/q), examen (12/q), entretien (0.6 × score), diagnostic (0.5 × score), révision (2/q)
- **Badges** : Premier cours, Premier quiz, Expert CPU/GPU, Maître du dépannage, Configuration parfaite, Série 7 jours…
- **Série** : nombre de jours consécutifs d'activité
- **Maîtrise par domaine** : calculée depuis les détails des quiz, classification "Maîtrisé / Acquis / À renforcer / À travailler"
- **Révisions espacées** : SM-2 like, génère les cartes depuis le glossaire au premier passage

## 📜 Licence & données

Tout le contenu pédagogique est original et techniquement validé.
Aucune dépendance externe au runtime (sauf `OPENAI_API_KEY` optionnelle).

## 🎯 Roadmap

- [ ] Édition admin via interface (CRUD complet)
- [ ] Mode multi-joueur / défi entre amis
- [ ] Export PDF des cours
- [ ] Intégration HWiNFO64 (lecture réelle des capteurs)
- [ ] Mode PWA (installable, offline)
- [ ] Génération d'examens dynamiques depuis les quiz

---

Made with 🛠️ pour les passionnés de hardware.
