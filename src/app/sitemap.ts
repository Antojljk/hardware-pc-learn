import { MetadataRoute } from 'next';

const SITE_URL = 'https://hardware-pc-learn.vercel.app';

const STATIC_ROUTES = [
  { url: '/', priority: 1.0, changeFrequency: 'weekly' as const },
  { url: '/offres', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/contact', priority: 0.4, changeFrequency: 'yearly' as const },
  { url: '/mentions-legales', priority: 0.3, changeFrequency: 'yearly' as const },
  { url: '/confidentialite', priority: 0.3, changeFrequency: 'yearly' as const },
  { url: '/remboursement', priority: 0.3, changeFrequency: 'yearly' as const },
  { url: '/cookies', priority: 0.2, changeFrequency: 'yearly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return STATIC_ROUTES.map(route => ({
    url: `${SITE_URL}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
