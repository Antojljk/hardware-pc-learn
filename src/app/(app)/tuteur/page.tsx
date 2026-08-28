import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Bot, Sparkles, MessageCircle, Zap, Brain, Info } from 'lucide-react';
import { TutorClient } from './TutorClient';

export default async function TutorPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* HERO */}
      <section className="module-hero">
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="module-eyebrow flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> Assistant
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight flex items-center gap-3">
              <Bot className="w-8 h-8 sm:w-10 sm:h-10 text-text" />
              Tuteur IA
            </h1>
            <p className="text-muted text-[15px] max-w-xl leading-relaxed">
              Pose n&apos;importe quelle question sur le hardware. Réponse claire, exemples,
              analogies : le tuteur s&apos;adapte à ton niveau.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto sm:min-w-[360px]">
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Brain className="w-3.5 h-3.5" /> Domaine
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                Hardware
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Zap className="w-3.5 h-3.5" /> Latence
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                ~1s
              </div>
            </div>
            <div className="rounded-2xl border border-text/30 bg-text/8 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <MessageCircle className="w-3.5 h-3.5" /> Mode
              </div>
              <div className="mt-1.5 font-display text-base sm:text-lg font-semibold text-text">
                Local
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BANDEAU D'INFO */}
      <section className="info-banner text-xs sm:text-sm anim-rise anim-rise-1">
        <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
        <span>
          Mode local par défaut (réponses pédagogiques de la base). Une clé OpenAI peut être
          ajoutée via la variable <code className="font-mono text-text">OPENAI_API_KEY</code>
          pour activer le mode conversationnel avancé.
        </span>
      </section>

      <section className="anim-rise anim-rise-2">
        <TutorClient />
      </section>
    </div>
  );
}
