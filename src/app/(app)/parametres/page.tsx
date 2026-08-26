import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Settings, Info } from 'lucide-react';

export const metadata = { title: 'Paramètres — HardwarePC' };

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  return (
    <div className="space-y-6 max-w-2xl">
      <header>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Settings className="w-5 h-5 text-brand-blue" /> Paramètres</h1>
        <p className="text-text-soft text-sm">Configuration de l&apos;application.</p>
      </header>

      <section className="card p-5">
        <h2 className="section-title mb-3">Apparence</h2>
        <p className="text-sm text-text-soft">Thème sombre actif (par défaut). Le mode clair n&apos;est pas encore disponible.</p>
      </section>

      <section className="card p-5">
        <h2 className="section-title mb-3">Données</h2>
        <ul className="text-sm text-text-soft space-y-2 list-disc pl-5">
          <li>Les comptes et la progression sont stockés localement (SQLite via Prisma).</li>
          <li>Tu peux supprimer ton compte en supprimant la base <code>prisma/dev.db</code>.</li>
          <li>Le tuteur IA fonctionne en mode local par défaut. Ajoute <code>OPENAI_API_KEY</code> dans <code>.env</code> pour activer le mode conversationnel avancé.</li>
        </ul>
      </section>

      <section className="card p-5 border-brand-blue/30 bg-brand-blue/5">
        <h2 className="section-title mb-2 flex items-center gap-2"><Info className="w-4 h-4 text-brand-blue" /> À propos</h2>
        <p className="text-sm text-text-soft">
          HardwarePC v1.0 — plateforme éducative 100% locale pour apprendre le hardware PC.
          Stack : Next.js 14, TypeScript, Prisma, Tailwind, Recharts, Lucide.
        </p>
      </section>
    </div>
  );
}
