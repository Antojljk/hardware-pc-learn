import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Bot } from 'lucide-react';
import { TutorClient } from './TutorClient';

export default async function TutorPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <section className="module-hero">
        <div className="module-eyebrow">Assistant</div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight flex items-center gap-2 mt-2">
          <Bot className="w-6 h-6 text-text" /> Tuteur IA
        </h1>
        <p className="text-muted text-[15px] mt-2 max-w-xl">Pose n&apos;importe quelle question sur le hardware. Réponse claire, exemples, analogies.</p>
      </section>
      <TutorClient />
    </div>
  );
}
