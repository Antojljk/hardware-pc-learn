'use client';

import { useState } from 'react';
import { Send, Sparkles, Bot, User, Info } from 'lucide-react';

type Msg = { role: 'user' | 'assistant'; text: string };

const SEED_PROMPTS = [
  'Explique-moi la différence entre TDP et consommation réelle.',
  'Pourquoi une DDR5-6000 CL30 est le sweet spot AMD AM5 ?',
  'Comment fonctionne un VRM sur une carte mère ?',
  'Mon PC fait du bruit, par où je commence ?',
];

export function TutorClient() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', text: 'Salut ! Je suis ton tuteur hardware. Pose-moi une question, je m\'adapte à ton niveau.' },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  async function send(text?: string) {
    const message = (text ?? input).trim();
    if (!message) return;
    setMessages(m => [...m, { role: 'user', text: message }]);
    setInput('');
    setBusy(true);
    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setMessages(m => [...m, { role: 'assistant', text: data.reply || '...' }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', text: 'Erreur réseau. Réessaye.' }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-3 text-xs text-text-soft flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-brand-blue" />
        Mode local par défaut (réponses pédagogiques de la base). Une clé OpenAI peut être ajoutée via la variable <code>OPENAI_API_KEY</code> pour activer le mode conversationnel avancé.
      </div>

      <div className="flex flex-wrap gap-2">
        {SEED_PROMPTS.map(p => (
          <button key={p} onClick={() => send(p)} className="btn-outline text-xs">{p}</button>
        ))}
      </div>

      <div className="card p-4 space-y-3 max-h-[60vh] overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={`flex items-start gap-2 ${m.role === 'user' ? 'justify-end' : ''}`}>
            {m.role === 'assistant' && <Bot className="w-5 h-5 text-brand-blue mt-1" />}
            <div className={`rounded-lg p-3 text-sm max-w-[85%] whitespace-pre-line ${m.role === 'user' ? 'bg-brand-blue/15 text-text' : 'bg-bg-elev text-text-soft'}`}>
              {m.text}
            </div>
            {m.role === 'user' && <User className="w-5 h-5 text-text-soft mt-1" />}
          </div>
        ))}
        {busy && <div className="text-xs text-text-mute">Réflexion…</div>}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pose ta question hardware…"
          className="input flex-1"
        />
        <button type="submit" disabled={busy} className="btn-primary"><Send className="w-4 h-4" /> Envoyer</button>
      </form>
    </div>
  );
}
