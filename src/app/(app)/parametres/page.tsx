import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Settings } from 'lucide-react';
import FormsClient from './FormsClient';

export const metadata = { title: 'Paramètres — HardwarePC' };

export default async function ParametresPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  return (
    <div className="space-y-6 max-w-2xl">
      {/* HERO */}
      <section className="module-hero">
        <div className="module-eyebrow">Configuration</div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight flex items-center gap-2 mt-2">
          <Settings className="w-6 h-6 text-text" /> Paramètres
        </h1>
        <p className="text-muted text-[15px] mt-2 max-w-xl">Configuration de votre compte et de l'application.</p>
      </section>

      {/* The FormsClient will handle the rest */}
      <FormsClient user={user} />
    </div>
  );
}