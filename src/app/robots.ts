import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: 'https://hardware-pc-learn-odlp5j5wt-antoine-drutel.vercel.app/sitemap.xml',
  };
}
