import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Bot } from 'lucide-react';
import { TutorClient } from './TutorClient';

export default async function TutorPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <header>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Bot className="w-5 h-5 text-brand-violet" /> Tuteur IA</h1>
        <p className="text-text-soft text-sm">Pose n&apos;importe quelle question sur le hardware. Réponse claire, exemples, analogies.</p>
      </header>
      <TutorClient />
    </div>
  );
}
