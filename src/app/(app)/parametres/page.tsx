import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Settings, Info } from 'lucide-react';

export const metadata = { title: 'Paramètres — HardwarePC' };

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  return (
    <div className="space-y-6 max-w-2xl">
      <section className="module-hero">
        <div className="module-eyebrow">Configuration</div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight flex items-center gap-2 mt-2">
          <Settings className="w-6 h-6 text-text" /> Paramètres
        </h1>
        <p className="text-muted text-[15px] mt-2 max-w-xl">Configuration de l&apos;application.</p>
      </section>

      <section className="module-frame anim-rise anim-rise-1">
        <h2 className="section-title mb-3">Apparence</h2>
        <p className="text-sm text-muted">Thème sombre actif (par défaut). Le mode clair n&apos;est pas encore disponible.</p>
      </section>

      <section className="module-frame anim-rise anim-rise-2">
        <h2 className="section-title mb-3">Données</h2>
        <ul className="text-sm text-muted space-y-2 list-disc pl-5 marker:text-muted">
          <li>Les comptes et la progression sont stockés localement (SQLite via Prisma).</li>
          <li>Tu peux supprimer ton compte en supprimant la base <code>prisma/dev.db</code>.</li>
          <li>Le tuteur IA fonctionne en mode local par défaut. Ajoute <code>OPENAI_API_KEY</code> dans <code>.env</code> pour activer le mode conversationnel avancé.</li>
        </ul>
      </section>

      <section className="info-banner anim-rise anim-rise-3">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <h2 className="font-semibold mb-1">À propos</h2>
          <p className="text-sm text-muted">
            HardwarePC v1.0 — plateforme éducative 100% locale pour apprendre le hardware PC.
            Stack : Next.js 14, TypeScript, Prisma, Tailwind, Recharts, Lucide.
          </p>
        </div>
      </section>
    </div>
  );
}
