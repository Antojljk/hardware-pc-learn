'use client';
import { useState, useEffect } from 'react';
import { Send, User, Wrench, Clock, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Message = { role: 'user' | 'assistant'; content: string };

export function TechnicienChat({ 
  scenario, 
  onClose, 
  onComplete 
}: { 
  scenario: any; 
  onClose: () => void; 
  onComplete: (score: number) => void 
}) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Bonjour, mon PC a un problème. Je ne sais pas trop quoi dire, mais ça ne marche pas comme d\'habitude...' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [startTime] = useState(Date.now());
  const [isFinished, setIsFinished] = useState(false);

  async function sendMessage() {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/technicien/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg], scenario }),
      });
      const data = await res.json();
      if (data.text) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  }

  async function submitDiagnostic() {
    // Simplification pour l'exemple : on demande à l'IA de valider le diagnostic final
    setIsTyping(true);
    try {
      const res = await fetch('/api/technicien/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, { role: 'user', content: '[DIAGNOSTIC FINAL] Je pense que le problème est : ' + messages[messages.length-1]?.content }], 
          scenario 
        }),
      });
      const data = await res.json();
      
      // Calcul score basé sur le temps
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const score = Math.max(0, 100 - Math.floor(timeSpent / 60));
      
      setIsFinished(true);
      onComplete(score);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-bg/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-bg-elev border border-border w-full max-w-2xl h-[80vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-bg-elev">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-text text-bg grid place-items-center font-bold">C</div>
            <div>
              <h3 className="font-semibold text-sm">Client {scenario.title}</h3>
              <div className="flex items-center gap-1 text-[10px] text-muted uppercase tracking-wider">
                <Clock className="w-3 h-3" /> {Math.floor((Date.now() - startTime) / 1000)}s
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-bg-soft rounded-full transition-colors">
            <XCircle className="w-5 h-5 text-muted" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div className={cn(
                'max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed',
                m.role === 'user' ? 'bg-text text-bg rounded-tr-none' : 'bg-bg-soft border border-border rounded-tl-none'
              )}>
                {m.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-bg-soft border border-border p-3 rounded-2xl rounded-tl-none text-xs text-muted animate-pulse">
                Le client réfléchit...
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border bg-bg-elev">
          {isFinished ? (
            <div className="text-center py-4">
              <div className="text-lg font-semibold text-text mb-2">Diagnostic terminé !</div>
              <button onClick={onClose} className="btn-primary px-6 py-2">Fermer</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Posez une question au client..."
                className="flex-1 bg-bg-soft border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-text"
              />
              <button onClick={sendMessage} className="p-2 bg-text text-bg rounded-xl hover:bg-text/90 transition-colors">
                <Send className="w-4 h-4" />
              </button>
              <button onClick={submitDiagnostic} className="p-2 bg-accent text-bg rounded-xl hover:bg-accent/90 transition-colors" title="Soumettre diagnostic final">
                <CheckCircle className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
