import { AuthForm } from './AuthForm';
import Link from 'next/link';

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header simple aligné sur le nouveau design */}
      <header className="border-b border-border bg-bg">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="font-display font-bold text-lg tracking-tight text-text">
            HardPC
          </Link>
          <Link
            href="/"
            className="text-sm text-muted hover:text-text transition-colors"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-display font-semibold tracking-tight text-text">
              Bienvenue sur HardwarePC
            </h1>
            <p className="text-muted mt-3 text-[15px]">
              Crée ton compte ou connecte-toi pour suivre ta progression.
            </p>
          </div>
          <AuthForm />
        </div>
      </main>
    </div>
  );
}
