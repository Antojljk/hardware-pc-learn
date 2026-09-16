'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) setStatus('sent');
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="min-h-screen bg-bg text-text py-20 px-6 sm:px-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-display font-semibold mb-8 text-center">Nous contacter</h1>
      
      {status === 'sent' ? (
        <div className="card p-8 text-center space-y-4">
          <p className="text-lg">Merci ! Votre message a été envoyé avec succès.</p>
          <Link href="/" className="btn-primary">Retour à l&apos;accueil</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Nom</label>
              <input name="name" className="input" required />
            </div>
            <div>
              <label className="label">Email</label>
              <input name="email" type="email" className="input" required />
            </div>
          </div>
          <div>
            <label className="label">Sujet</label>
            <select name="subject" className="input" required>
              <option value="Question générale">Question générale</option>
              <option value="Problème technique">Problème technique</option>
              <option value="Remboursement">Remboursement</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div>
            <label className="label">Message</label>
            <textarea name="message" className="input h-32 resize-none" required />
          </div>
          <button className="btn-primary w-full" disabled={status === 'sending'}>
            {status === 'sending' ? 'Envoi en cours...' : 'Envoyer'}
          </button>
          {status === 'error' && <p className="text-danger text-sm text-center">Une erreur est survenue. Veuillez réessayer.</p>}
        </form>
      )}
    </div>
  );
}
