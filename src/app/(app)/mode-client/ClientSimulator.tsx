'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, ShieldCheck, Loader2, User, Sparkles, MessageCircle, ListChecks } from 'lucide-react';

type Msg = { role: 'client' | 'tech' | 'eval'; text: string };
type Case = { id: string; title: string; message: string; hints: string[]; solution: string };

const CASES: Case[] = [
  {
    id: 'bruit',
    title: 'PC bruyant',
    message: 'Salut, mon PC fait énormément de bruit depuis quelques jours, surtout quand je joue. C\'est normal ?',
    hints: [
      'Le bruit = ventilateurs à haut régime. Identifier la source (CPU ou GPU) avec HWiNFO64.',
      'Cause fréquente : ventirad mal fixé, pâte thermique séchée (3-5 ans), ou poussière dans les pales.',
      'Vérifier la courbe de ventilation dans le BIOS / MSI Afterburner.',
    ],
    solution: '1. Identifier la source du bruit via HWiNFO64 (température CPU/GPU). 2. Dépoussiérer (bombe d\'air sec). 3. Si pâte thermique > 4 ans, renouveler. 4. Ajuster la courbe des ventilateurs pour rester sous 80% en charge normale.',
  },
  {
    id: 'lent',
    title: 'PC lent au démarrage',
    message: 'Bonjour, mon PC met 3 minutes à démarrer alors qu\'il était rapide avant. Je n\'ai rien changé.',
    hints: [
      'Au démarrage = nombreux programmes qui se lancent. Vérifier le démarrage Windows.',
      'Cause fréquente : mise à jour Windows, application installée en démarrage, malware.',
      'Outil : Gestionnaire de tâches → onglet Démarrage.',
    ],
    solution: '1. Ouvrir le Gestionnaire de tâches et désactiver les programmes inutiles au démarrage. 2. Vérifier les mises à jour Windows en attente. 3. Lancer un scan anti-malware (Malwarebytes). 4. Vérifier la santé du SSD avec CrystalDiskInfo.',
  },
  {
    id: 'crash-jeu',
    title: 'Crash en jeu',
    message: 'Mon jeu crash au bout de 10 minutes, mais il marchait bien avant. Je n\'ai rien installé.',
    hints: [
      'Crash en charge = souvent thermique, pilote, ou overclock.',
      'Vérifier la température GPU avec HWiNFO64 (> 90°C = danger).',
      'Pilote GPU obsolète ou corrompu : réinstaller avec DDU.',
    ],
    solution: '1. Surveiller les températures GPU et CPU pendant le crash. 2. Si thermique : vérifier la pâte thermique GPU et l\'airflow du boîtier. 3. Réinstaller les pilotes GPU avec DDU en safe mode. 4. Désactiver tout overclock GPU ou XMP.',
  },
];

export function ClientSimulator() {
  const [idx, setIdx] = useState(0);
  const c = CASES[idx];
  const [messages, setMessages] = useState<Msg[]>([{ role: 'client', text: c.message }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, busy]);

  function reset(i: number) {
    setIdx(i);
    setMessages([{ role: 'client', text: CASES[i].message }]);
    setInput('');
    setDone(false);
  }

  async function send() {
    const text = input.trim();
    if (!text) return;
    setBusy(true);
    setMessages(m => [...m, { role: 'tech', text }]);
    setInput('');
    // Simple heuristique : on note des mots-clés tech
    const score = analyzeAnswer(text, c.hints);
    setTimeout(() => {
      setMessages(m => [
        ...m,
        { role: 'eval', text: `Score de communication + technique : ${score}/100` },
        ...(score >= 60 ? [{ role: 'eval' as const, text: `Bonne approche. Solution complète : ${c.solution}` }] : []),
      ]);
      if (score >= 60) setDone(true);
      setBusy(false);
    }, 400);
  }

  return (
    <div className="space-y-4">
      {/* SELECTEUR DE SCÉNARIOS */}
      <div className="anim-rise anim-rise-1">
        <div className="flex items-center gap-2 mb-3">
          <ListChecks className="w-3.5 h-3.5 text-muted" />
          <h3 className="module-eyebrow">Choisir un scénario client</h3>
        </div>
        <div className="segment flex-wrap">
          {CASES.map((cs, i) => (
            <button
              key={cs.id}
              onClick={() => reset(i)}
              data-active={idx === i ? 'true' : 'false'}
              type="button"
            >
              {cs.title}
            </button>
          ))}
        </div>
      </div>

      {/* CONVERSATION */}
      <div
        ref={scrollRef}
        className="module-frame p-5 sm:p-6 space-y-3 max-h-[60vh] overflow-y-auto anim-rise anim-rise-2"
      >
        {messages.map((m, i) => {
          const isClient = m.role === 'client';
          const isEval = m.role === 'eval';
          const isTech = m.role === 'tech';
          return (
            <div key={i} className={`flex ${isClient || isEval ? 'justify-start' : 'justify-end'}`}>
              <div className="flex items-start gap-3 max-w-[90%]">
                {isClient && (
                  <div className="w-8 h-8 rounded-lg grid place-items-center bg-bg-elev border border-border shrink-0">
                    <ShieldCheck className="w-4 h-4 text-text" />
                  </div>
                )}
                <div className={`rounded-2xl p-3.5 text-sm whitespace-pre-line leading-relaxed border ${
                  isClient ? 'bg-bg-elev text-text border-border' :
                  isEval ? 'bg-text/8 border-text/30 text-text' :
                  'bg-text/10 border-text/30 text-text'
                }`}>
                  {isClient && (
                    <div className="text-[10px] uppercase tracking-wider text-muted mb-1.5 flex items-center gap-1.5 font-semibold">
                      <MessageCircle className="w-3 h-3" /> Client
                    </div>
                  )}
                  {isEval && (
                    <div className="text-[10px] uppercase tracking-wider text-muted mb-1.5 flex items-center gap-1.5 font-semibold">
                      <Sparkles className="w-3 h-3" /> Évaluation
                    </div>
                  )}
                  {isTech && (
                    <div className="text-[10px] uppercase tracking-wider text-muted mb-1.5 flex items-center gap-1.5 font-semibold">
                      <User className="w-3 h-3" /> Technicien (toi)
                    </div>
                  )}
                  {m.text}
                </div>
              </div>
            </div>
          );
        })}
        {busy && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg grid place-items-center bg-bg-elev border border-border shrink-0">
              <ShieldCheck className="w-4 h-4 text-text" />
            </div>
            <div className="rounded-2xl p-3 text-sm bg-bg-elev border border-border">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-text-mute animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-text-mute animate-pulse" style={{ animationDelay: '120ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-text-mute animate-pulse" style={{ animationDelay: '240ms' }} />
                <span className="text-xs text-muted ml-1.5">Le client réfléchit…</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ZONE DE SAISIE */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(); }}
        className="anim-rise anim-rise-3 flex gap-2"
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Réponds au client (pose des questions, propose un diagnostic)…"
          className="input flex-1"
          disabled={done}
        />
        <button type="submit" disabled={busy || done} className="btn-primary">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Envoyer
        </button>
      </form>
    </div>
  );
}

function analyzeAnswer(text: string, hints: string[]): number {
  const lower = text.toLowerCase();
  let score = 0;
  // Communication : longueur raisonnable + question
  if (text.length > 50) score += 10;
  if (lower.includes('depuis') || lower.includes('quand')) score += 10;
  if (lower.includes('utilis') || lower.includes('utilisé')) score += 10;
  // Technique : présence de mots-clés
  const keywords = ['hwinfo', 'cristaldiskinfo', 'ddru', 'ddu', 'température', 'driver', 'pilote', 'ventilateur', 'pâte thermique', 'bios', 'airflow', 'memtest'];
  keywords.forEach(k => { if (lower.includes(k)) score += 12; });
  // Bonus si la réponse couvre un hint
  hints.forEach(h => {
    const w = h.toLowerCase().split(/[^a-zé]+/).filter(w => w.length > 4);
    const matches = w.filter(x => lower.includes(x)).length;
    if (matches >= 2) score += 10;
  });
  return Math.min(100, score);
}
