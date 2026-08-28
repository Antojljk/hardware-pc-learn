import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { ShieldCheck } from 'lucide-react';
import { ClientSimulator } from './ClientSimulator';

export const metadata = { title: 'Mode client — HardwarePC' };

export default async function ClientModePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <section className="module-hero">
        <div className="module-eyebrow">Simulation</div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight flex items-center gap-2 mt-2">
          <ShieldCheck className="w-6 h-6 text-text" /> Mode client
        </h1>
        <p className="text-muted text-[15px] mt-2 max-w-xl">Dialogue avec un client mécontent ou inquiet. Qualité de la communication + technique évaluées.</p>
      </section>

      <ClientSimulator />
    </div>
  );
}
