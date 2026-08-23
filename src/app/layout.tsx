import type { Metadata } from 'next';
import { Inter_Tight, DM_Mono } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/shell/Sidebar';
import { TopBar } from '@/components/shell/TopBar';
import { MobileNav } from '@/components/shell/MobileNav';
import { SessionProvider } from '@/components/shell/SessionProvider';

// Polices alignées sur la référence CoreTech : Inter Tight (display) + DM Mono (body)
const display = Inter_Tight({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});
const body = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HardwarePC — Apprends le hardware PC',
  description:
    "Plateforme d'apprentissage interactive du hardware informatique : cours, quiz, examens, entretiens blancs, diagnostics PC et constructeur de configuration.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <body>
        <SessionProvider>
          <div className="min-h-screen flex bg-bg text-text">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 lg:ml-72">
              <TopBar />
              <main className="flex-1 px-6 sm:px-10 py-10 pb-28 lg:pb-12 max-w-7xl w-full mx-auto">
                {children}
              </main>
              <MobileNav />
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
