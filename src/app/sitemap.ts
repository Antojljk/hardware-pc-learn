import type { MetadataRoute } from 'next';

// URL canonique de production — utilisée pour toutes les URLs absolues du sitemap.
const SITE_URL = 'https://hardware-pc-learn-odlp5j5wt-antoine-drutel.vercel.app';

// Seules les routes réellement publiques (accessibles sans authentification)
// sont référencées ici. Le reste de l'application (cours, quiz, glossaire,
// diagnostic, constructeur, etc.) est protégé par `getCurrentUser()` +
// `redirect('/auth')` et n'est PAS listé tant qu'une décision produit n'est
// pas prise pour les rendre crawlables.
const PUBLIC_ROUTES = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' as const },
  { path: '/glossaire', priority: 0.8, changeFrequency: 'weekly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PUBLIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
