"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import type { User } from '@prisma/client';
import {
  Info,
  User as UserIcon,
  Lock,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { planLabel } from '@/lib/plans';

export default function FormsClient({ user }: { user: User }) {
  const router = useRouter();
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError(null);
    setProfileSuccess(null);

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const currentPassword = formData.get('currentPassword') as string;

    const res = await fetch('/api/account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_profile',
        username: username || undefined,
        email: email || undefined,
        currentPassword,
      }),
    });

    const data = await res.json();

    setProfileLoading(false);
    if (res.ok && data.ok) {
      setProfileSuccess('Profil mis à jour avec succès');
    } else {
      setProfileError(data.error?.message || 'Erreur inconnue');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;

    const res = await fetch('/api/account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_password',
        currentPassword,
        newPassword,
      }),
    });

    const data = await res.json();

    setPasswordLoading(false);
    if (res.ok && data.ok) {
      setPasswordSuccess('Mot de passe mis à jour avec succès');
      // Reset the form
      (e.target as HTMLFormElement).reset();
    } else {
      setPasswordError(data.error?.message || 'Erreur inconnue');
    }
  };

  const handleDeleteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDeleteLoading(true);
    setDeleteError(null);
    setDeleteSuccess(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;

    const res = await fetch('/api/account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete',
        password,
      }),
    });

    const data = await res.json();

    setDeleteLoading(false);
    if (res.ok && data.ok) {
      setDeleteSuccess('Compte supprimé avec succès');
      // Redirect to home or auth page after deletion
      router.push('/');
    } else {
      setDeleteError(data.error?.message || 'Erreur inconnue');
    }
  };

  return (
    <>
      {/* PROFIL */}
      <section className="module-frame anim-rise anim-rise-1">
        <h2 className="section-title mb-3 flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-text" /> Profil
        </h2>
        {profileSuccess && (
          <div className="mb-4 p-3 bg-text/10 rounded-xl border border-text/20">
            <p className="text-sm text-text">{profileSuccess}</p>
          </div>
        )}
        {profileError && (
          <div className="mb-4 p-3 bg-text/10 rounded-xl border border-text/20">
            <p className="text-sm text-text">{profileError}</p>
          </div>
        )}
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-muted mb-1">Pseudo</label>
              <input
                type="text"
                name="username"
                value={user.username}
                className="w-full px-3 py-2 rounded-border bg-bg-elev border border-border focus:outline-none focus:ring-2 focus:ring-text"
                placeholder="Entrez votre nouveau pseudo"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-muted mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                className="w-full px-3 py-2 rounded-border bg-bg-elev border border-border focus:outline-none focus:ring-2 focus:ring-text"
                placeholder="Entrez votre nouvel email"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-muted mb-1">
              Mot de passe actuel (requis pour confirmer)
            </label>
            <input
              type="password"
              name="currentPassword"
              className="w-full px-3 py-2 rounded-border bg-bg-elev border border-border focus:outline-none focus:ring-2 focus:ring-text"
              placeholder="Entrez votre mot de passe actuel"
              required
            />
          </div>
          <button
            type="submit"
            disabled={profileLoading}
            className="w-full btn-primary"
          >
            {profileLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </form>
      </section>

      {/* MOT DE PASSE */}
      <section className="module-frame anim-rise anim-rise-2">
        <h2 className="section-title mb-3 flex items-center gap-2">
          <Lock className="w-4 h-4 text-text" /> Mot de passe
        </h2>
        {passwordSuccess && (
          <div className="mb-4 p-3 bg-text/10 rounded-xl border border-text/20">
            <p className="text-sm text-text">{passwordSuccess}</p>
          </div>
        )}
        {passwordError && (
          <div className="mb-4 p-3 bg-text/10 rounded-xl border border-text/20">
            <p className="text-sm text-text">{passwordError}</p>
          </div>
        )}
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-muted mb-1">
              Mot de passe actuel
            </label>
            <input
              type="password"
              name="currentPassword"
              className="w-full px-3 py-2 rounded-border bg-bg-elev border border-border focus:outline-none focus:ring-2 focus:ring-text"
              placeholder="Entrez votre mot de passe actuel"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-muted mb-1">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              name="newPassword"
              className="w-full px-3 py-2 rounded-border bg-bg-elev border border-border focus:outline-none focus:ring-2 focus:ring-text"
              placeholder="Entrez votre nouveau mot de passe (6 caractères minimum)"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={passwordLoading}
            className="w-full btn-primary"
          >
            {passwordLoading ? 'Enregistrement...' : 'Changer le mot de passe'}
          </button>
        </form>
      </section>

      {/* PRÉFÉRENCES */}
      <section className="module-frame anim-rise anim-rise-3">
        <h2 className="section-title mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-text" /> Préférences
        </h2>
        <p className="text-sm text-muted">
          Les préférences d&apos;application (thème, langue, notifications) seront disponibles dans une future mise à jour.
          Actuellement, l&apos;application utilise le thème sombre par défaut.
        </p>
      </section>

      {/* COMPTE */}
      <section className="module-frame anim-rise anim-rise-4">
        <h2 className="section-title mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-text" /> Gestion du compte
        </h2>
        <div className="space-y-4">
          {/* Plan actuel */}
           <div className="card p-4">
             <div className="flex items-center justify-between mb-2">
               <span className="font-medium text-text">Offre actuelle</span>
               <span className="badge-accent">{planLabel(user.plan)}</span>
             </div>
             <p className="text-sm text-muted">
               Pour changer d&apos;offre, rendez-vous sur la page des <Link href="/vente" className="text-text underline">tarifs</Link>.
             </p>
           </div>


          {/* Suppression du compte */}
          {deleteSuccess && (
            <div className="mb-4 p-3 bg-text/10 rounded-xl border border-text/20">
              <p className="text-sm text-text">{deleteSuccess}</p>
            </div>
          )}
          {deleteError && (
            <div className="mb-4 p-3 bg-text/10 rounded-xl border border-text/20">
              <p className="text-sm text-text">{deleteError}</p>
            </div>
          )}
          <form onSubmit={handleDeleteSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-muted mb-1">
                Mot de passe actuel (requis pour confirmer la suppression)
              </label>
              <input
                type="password"
                name="password"
                className="w-full px-3 py-2 rounded-border bg-bg-elev border border-border focus:outline-none focus:ring-2 focus:ring-text"
                placeholder="Entrez votre mot de passe actuel"
                required
              />
            </div>
            <p className="text-sm text-muted mt-2">
              La suppression de votre compte est irréversible. Toutes vos données (progression, XP, badges, historiques) seront définitivement supprimées.
              <br />
              Cette action ne peut pas être annulée.
            </p>
            <button
              type="submit"
              disabled={deleteLoading}
              className="w-full btn-outline btn-outline-destructive"
            >
              {deleteLoading ? 'Suppression...' : 'Supprimer mon compte'}
            </button>
          </form>
        </div>
      </section>

      {/* LIENS UTILES */}
      <section className="info-banner anim-rise anim-rise-5">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <h2 className="font-semibold mb-1">À propos</h2>
          <p className="text-sm text-muted">
            HardwarePC v1.0 — plateforme éducative 100% locale pour apprendre le hardware PC.
            Stack : Next.js 14, TypeScript, Prisma, Tailwind, Recharts, Lucide.
          </p>
        </div>
      </section>
    </>
  );
}