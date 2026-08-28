import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export default async function TarifsPage() {
  const user = await getCurrentUser();
  if (!user) {
    return redirect('/auth');
  }

  return (
    <div>
      <h1>Tarifs Page</h1>
    </div>
  );
}