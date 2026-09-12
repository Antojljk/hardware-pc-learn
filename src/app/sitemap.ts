import type { MetadataRoute } from 'next';

// URL canonique de production — utilisée pour toutes les URLs absolues du sitemap.
const SITE_URL = 'https://hardware-pc-learn.vercel.app';

// Seules les routes réellement publiques (accessibles sans authentification)
// sont référencées ici.
const PUBLIC_ROUTES = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' as const },
  { path: '/glossaire', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/cours', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/quiz', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/constructeur', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/abonnements', priority: 0.7, changeFrequency: 'monthly' as const },
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
