'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type Mode = 'login' | 'register';

export function AuthForm() {
  const router = useRouter();
  const search = useSearchParams();
  const guestDefault = search.get('guest') === '1';
  const [mode, setMode] = useState<Mode>(guestDefault ? 'register' : 'login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/auth?action=${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          mode === 'register' ? { email, username, password } : { identifier: email || username, password }
        ),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      router.push('/');
      router.refresh();
    } catch { setError('Erreur réseau'); }
    finally { setLoading(false); }
  }

  async function guest() {
    setLoading(true);
    try {
      const res = await fetch('/api/auth?action=guest', { method: 'POST' });
      if (!res.ok) { setError('Impossible de créer la session invité'); return; }
      router.push('/');
      router.refresh();
    } finally { setLoading(false); }
  }

  return (
    <div className="card p-6 space-y-4">
      <div className="flex bg-bg-elev rounded-lg p-1 border border-border">
        {(['login', 'register'] as Mode[]).map(m => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 py-1.5 rounded-md text-sm font-medium transition ${mode === m ? 'bg-brand-blue text-white' : 'text-text-soft'}`}
          >
            {m === 'login' ? 'Connexion' : 'Inscription'}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="space-y-3">
        {mode === 'register' && (
          <div>
            <label className="label">Pseudo</label>
            <input className="input" value={username} onChange={e => setUsername(e.target.value)} required minLength={3} maxLength={24} />
          </div>
        )}
        <div>
          <label className="label">{mode === 'register' ? 'Email' : 'Email ou pseudo'}</label>
          <input className="input" type={mode === 'register' ? 'email' : 'text'} value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="label">Mot de passe</label>
          <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
        </div>
        {error && <div className="text-danger text-sm bg-danger/10 border border-danger/30 rounded-lg px-3 py-2">{error}</div>}
        <button className="btn-primary w-full" disabled={loading}>{loading ? '…' : mode === 'register' ? 'Créer mon compte' : 'Se connecter'}</button>
      </form>
      <div className="relative my-2"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div><div className="relative flex justify-center"><span className="bg-bg-card px-2 text-xs text-text-mute">ou</span></div></div>
      <button onClick={guest} disabled={loading} className="btn-outline w-full">Continuer en invité</button>
      <p className="text-xs text-text-mute text-center">Tes données restent locales. Aucune information envoyée à un serveur externe.</p>
    </div>
  );
}
