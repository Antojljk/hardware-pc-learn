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
      <header>
        <h1 className="text-2xl font-bold flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-brand-blue" /> Mode client</h1>
        <p className="text-text-soft text-sm">Dialogue avec un client mécontent ou inquiet. Qualité de la communication + technique évaluées.</p>
      </header>

      <ClientSimulator />
    </div>
  );
}
