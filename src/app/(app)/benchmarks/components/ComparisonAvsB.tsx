"use client";
import React, { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

type ComponentType = 'CPU' | 'GPU';
type Usage = 'gaming' | 'productivity' | 'general';

type Hardware = {
  name: string;
  gaming: number;
  productivity: number;
  overall: number;
};

const HARDWARE_DATA: Record<ComponentType, Hardware[]> = {
  CPU: [
    { name: 'Intel Core i5-13600K', gaming: 88, productivity: 82, overall: 85 },
    { name: 'AMD Ryzen 5 7600X', gaming: 86, productivity: 75, overall: 80 },
    { name: 'Intel Core i9-13900K', gaming: 95, productivity: 98, overall: 96 },
    { name: 'AMD Ryzen 9 7950X', gaming: 92, productivity: 99, overall: 95 },
  ],
  GPU: [
    { name: 'RTX 4070', gaming: 85, productivity: 70, overall: 77 },
    { name: 'RX 7800 XT', gaming: 84, productivity: 60, overall: 72 },
    { name: 'RTX 4090', gaming: 99, productivity: 98, overall: 98 },
    { name: 'RX 7900 XTX', gaming: 96, productivity: 75, overall: 85 },
  ],
};

export default function ComparisonAvsB() {
  const [type, setType] = useState<ComponentType>('CPU');
  const [selectedA, setSelectedA] = useState(0);
  const [selectedB, setSelectedB] = useState(1);
  const [usage, setUsage] = useState<Usage>('gaming');
  const [answer, setAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const hardwareA = HARDWARE_DATA[type][selectedA];
  const hardwareB = HARDWARE_DATA[type][selectedB];

  const getScore = (hw: Hardware) => {
    if (usage === 'gaming') return hw.gaming;
    if (usage === 'productivity') return hw.productivity;
    return hw.overall;
  };

  const scoreA = getScore(hardwareA);
  const scoreB = getScore(hardwareB);
  const correctAnswer = scoreA > scoreB ? 0 : 1;

  const handleSubmit = () => {
    if (answer !== null) setIsSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex gap-2 p-1 rounded-xl bg-bg-elev border border-border">
          {(['CPU', 'GPU'] as ComponentType[]).map((t) => (
            <button
              key={t}
              onClick={() => { setType(t); setAnswer(null); setIsSubmitted(false); }}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                type === t ? 'bg-text text-bg' : 'text-muted hover:text-text'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2 p-1 rounded-xl bg-bg-elev border border-border">
          {(['gaming', 'productivity', 'general'] as Usage[]).map((u) => (
            <button
              key={u}
              onClick={() => { setUsage(u); setAnswer(null); setIsSubmitted(false); }}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all capitalize ${
                usage === u ? 'bg-text text-bg' : 'text-muted hover:text-text'
              }`}
            >
              {u === 'general' ? 'Global' : u}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[hardwareA, hardwareB].map((hw, idx) => (
          <div key={idx} className="p-4 rounded-2xl border border-border bg-bg-elev/50 space-y-4">
            <select 
              className="w-full bg-transparent text-sm font-semibold text-text border-none focus:ring-0 p-0 cursor-pointer"
              value={idx === 0 ? selectedA : selectedB}
              onChange={(e) => idx === 0 ? setSelectedA(Number(e.target.value)) : setSelectedB(Number(e.target.value))}
            >
              {HARDWARE_DATA[type].map((h, i) => (
                <option key={i} value={i} className="bg-bg text-text">{h.name}</option>
              ))}
            </select>
            <div className="flex items-end justify-between">
              <span className="text-[10px] uppercase tracking-wider text-muted">Score {usage}</span>
              <span className="font-display text-3xl font-semibold tabular-nums">{getScore(hw)}</span>
            </div>
            <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
              <div 
                className="h-full bg-text transition-all duration-1000" 
                style={{ width: `${getScore(hw)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl border border-border bg-bg-elev/30 space-y-4">
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-text">Lequel choisiriez-vous pour un usage {usage === 'general' ? 'global' : usage === 'gaming' ? 'gaming' : 'productivité'} ?</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[hardwareA, hardwareB].map((hw, idx) => (
            <button
              key={idx}
              onClick={() => setAnswer(idx)}
              className={`py-3 rounded-xl border transition-all text-sm font-medium ${
                answer === idx 
                  ? 'border-text bg-text/10 text-text' 
                  : 'border-border bg-bg-elev text-muted hover:text-text'
              } ${isSubmitted && idx === correctAnswer ? 'border-green-500 bg-green-500/5 text-green-500' : ''}`}
            >
              {hw.name}
            </button>
          ))}
        </div>
        {!isSubmitted ? (
          <button 
            onClick={handleSubmit}
            disabled={answer === null}
            className="w-full py-3 rounded-xl bg-text text-bg font-medium text-sm disabled:opacity-50 transition-all"
          >
            Valider le choix
          </button>
        ) : (
          <div className={`p-4 rounded-xl border flex gap-3 text-sm ${
            answer === correctAnswer 
              ? 'border-green-500 bg-green-500/5 text-green-500' 
              : 'border-red-500 bg-red-500/5 text-red-500'
          }`}>
            {answer === correctAnswer ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
            <div className="flex-1">
              <p className="font-semibold">{answer === correctAnswer ? 'Correct !' : 'Incorrect'}</p>
              <p className="opacity-80 leading-relaxed">
                {`Le ${HARDWARE_DATA[type][correctAnswer].name} est plus performant dans ce scénario avec un score de ${getScore(HARDWARE_DATA[type][correctAnswer])} contre ${getScore(HARDWARE_DATA[type][answer === null ? 0 : answer])}.`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
