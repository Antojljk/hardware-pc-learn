'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

type Msg = { role: 'user' | 'assistant'; text: string };
type Quota = { used: number; limit: number; remaining: number };

type Props = {
  initialQuota?: Quota;
};

const SEED_PROMPTS = [
  'Explique-moi la différence entre TDP et consommation réelle.',
  'Pourquoi une DDR5-6000 CL30 est le sweet spot AMD AM5 ?',
  'Comment fonctionne un VRM sur une carte mère ?',
  'Mon PC fait du bruit, par où je commence ?',
];

export function TutorClient({ initialQuota }: Props) {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', text: 'Salut ! Je suis ton tuteur hardware. Pose-moi une question, je m\'adapte à ton niveau.' },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [quota, setQuota] = useState<Quota | undefined>(initialQuota);
  const [, setLimitError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quotaExhausted = !!quota && quota.used >= quota.limit;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, busy]);

  async function send(text?: string) {
    const message = (text ?? input).trim();
    if (!message) return;
    if (quotaExhausted) {
      setLimitError(`Tu as utilisé tes ${quota?.limit ?? 0} messages IA ce mois-ci.`);
      return;
    }
    setMessages(m => [...m, { role: 'user', text: message }]);
    setInput('');
    setBusy(true);
    setLimitError(null);
    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403 && data?.code === 'QUOTA_EXCEEDED') {
          setLimitError(data.error || 'Quota mensuel atteint.');
          if (typeof data.used === 'number' && typeof data.limit === 'number') {
            setQuota({ used: data.used, limit: data.limit, remaining: 0 });
          }
          setMessages(m => [
            ...m,
            { role: 'assistant', text: `Tu as atteint la limite de ${data.limit ?? '?'} messages IA ce mois-ci pour ton offre. Passe à une offre supérieure pour continuer.` },
          ]);
        } else if (res.status === 403 && data?.code === 'PLAN_REQUIRED') {
          setLimitError(data.error || 'Tuteur IA non disponible sur ton offre.');
          setMessages(m => [
            ...m,
            { role: 'assistant', text: 'Le Tuteur IA est réservé aux utilisateurs avec une offre payante. Passe à une offre supérieure pour y accéder.' },
          ]);
        } else {
          setMessages(m => [...m, { role: 'assistant', text: 'Erreur réseau. Réessaye.' }]);
        }
      } else {
        if (data.quota) setQuota(data.quota);
        setMessages(m => [...m, { role: 'assistant', text: data.reply || '...' }]);
      }
    } catch {
      setMessages(m => [...m, { role: 'assistant', text: 'Erreur réseau. Réessaye.' }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* PROMPTS PRÉDÉFINIS */}
      <div className="anim-rise anim-rise-2">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-muted" />
          <h3 className="module-eyebrow">Suggestions pour démarrer</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {SEED_PROMPTS.map(p => (
            <button
              key={p}
              onClick={() => send(p)}
              className="btn-outline text-xs sm:text-sm"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* HISTORIQUE DE CONVERSATION */}
      <div
        ref={scrollRef}
        className="module-frame p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto anim-rise anim-rise-3"
      >
        {messages.map((m, i) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={i}
              className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-lg grid place-items-center bg-bg-elev border border-border shrink-0">
                  <Bot className="w-4 h-4 text-text" />
                </div>
              )}
              <div
                className={`rounded-2xl p-3.5 text-sm max-w-[85%] whitespace-pre-line leading-relaxed border ${
                  isUser
                    ? 'bg-text/10 border-text/30 text-text'
                    : 'bg-bg-elev text-text-soft border-border'
                }`}
              >
                {!isUser && (
                  <div className="text-[10px] uppercase tracking-wider text-muted mb-1.5 font-semibold">
                    Tuteur
                  </div>
                )}
                {m.text}
              </div>
              {isUser && (
                <div className="w-8 h-8 rounded-lg grid place-items-center bg-text/8 border border-text/30 shrink-0">
                  <User className="w-4 h-4 text-text" />
                </div>
              )}
            </div>
          );
        })}
        {busy && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg grid place-items-center bg-bg-elev border border-border shrink-0">
              <Bot className="w-4 h-4 text-text" />
            </div>
            <div className="rounded-2xl p-3.5 text-sm bg-bg-elev border border-border">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-text-mute animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-text-mute animate-pulse" style={{ animationDelay: '120ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-text-mute animate-pulse" style={{ animationDelay: '240ms' }} />
                <span className="text-xs text-muted ml-1.5">Réflexion en cours…</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ZONE DE SAISIE */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(); }}
        className="anim-rise anim-rise-4 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pose ta question hardware…"
          className="input flex-1"
        />
        <button type="submit" disabled={busy} className="btn-primary">
          <Send className="w-4 h-4" /> Envoyer
        </button>
      </form>
    </div>
  );
}
