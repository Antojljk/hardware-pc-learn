import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Polices alignées sur l'AccueilHardwarePC de référence : Inter (display + body)
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

// URL canonique de production — utilisée comme base pour canonical, OG et sitemap.
const SITE_URL = 'https://hardware-pc-learn-3zmsiaq0x-antoine-drutel.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'HardwarePC — Apprends le hardware PC',
    template: '%s · HardwarePC',
  },
  description:
    "Plateforme d'apprentissage interactive du hardware informatique : cours, quiz, examens, entretiens blancs, diagnostics PC et constructeur de configuration.",
  applicationName: 'HardwarePC',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: 'HardwarePC',
    title: 'HardwarePC — Apprends le hardware PC',
    description:
      "Plateforme d'apprentissage interactive du hardware informatique : cours, quiz, examens, entretiens blancs, diagnostics PC et constructeur de configuration.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HardwarePC — Apprends le hardware PC',
    description:
      "Plateforme d'apprentissage interactive du hardware informatique : cours, quiz, examens, entretiens blancs, diagnostics PC et constructeur de configuration.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable} style={{ ['--font-body' as string]: `var(${inter.variable})` }}>
      <body>{children}</body>
    </html>
  );
}
