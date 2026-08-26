'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LogOut } from 'lucide-react';

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function logout() {
    setLoading(true);
    try {
      await fetch('/api/auth?action=logout', { method: 'POST' });
      router.push('/auth');
      router.refresh();
    } finally { setLoading(false); }
  }
  return (
    <button onClick={logout} disabled={loading} className="btn-outline">
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
      Se déconnecter
    </button>
  );
}
