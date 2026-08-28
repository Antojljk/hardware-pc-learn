import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export const metadata = { title: 'Historique — HardwarePC' };

export default async function HistoriquePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  return (
    <div className="space-y-6 max-w-4xl">
      <h1>Test</h1>
    </div>
  );
}
