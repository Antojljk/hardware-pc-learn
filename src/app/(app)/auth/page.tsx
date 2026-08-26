import { AuthForm } from './AuthForm';
import Link from 'next/link';

export default function AuthPage() {
  return (
    <div className="max-w-md mx-auto py-10">
      <Link href="/" className="text-sm text-text-soft hover:text-text inline-flex items-center gap-1 mb-4">← Retour</Link>
      <h1 className="text-2xl font-bold mb-1">Bienvenue sur HardwarePC</h1>
      <p className="text-text-soft mb-6">Crée ton compte ou connecte-toi pour suivre ta progression.</p>
      <AuthForm />
    </div>
  );
}
