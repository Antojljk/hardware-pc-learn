"use client";
import React, { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

type Experience = {
  id: string;
  avgFps: number;
  low1: number;
  description: string;
  isFluid: boolean;
};

const EXPERIENCES: Experience[] = [
  {
    id: 'exp1',
    avgFps: 95,
    low1: 82,
    description: 'Le jeu tourne à 95 FPS en moyenne et ne descend presque jamais sous les 80 FPS.',
    isFluid: true,
  },
  {
    id: 'exp2',
    avgFps: 92,
    low1: 34,
    description: 'Le jeu tourne à 92 FPS en moyenne, mais on ressent des micro-saccades fréquentes.',
    isFluid: false,
  },
  {
    id: 'exp3',
    avgFps: 60,
    low1: 45,
    description: 'Moyenne stable à 60 FPS, avec des chutes occasionnelles à 45 FPS.',
    isFluid: true,
  },
];

export default function LowOneAnalysis() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<'fluid' | 'stutter' | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const exp = EXPERIENCES[currentIdx];

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % EXPERIENCES.length);
    setSelected(null);
    setSubmitted(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-bg-elev/50 p-5 text-center">
          <div className="text-[10px] uppercase tracking-wider text-muted mb-1">FPS Moyen</div>
          <div className="font-display text-4xl font-semibold tabular-nums text-text">{exp.avgFps}</div>
        </div>
        <div className="rounded-2xl border border-border bg-bg-elev/50 p-5 text-center">
          <div className="text-[10px] uppercase tracking-wider text-muted mb-1">1% Low</div>
          <div className="font-display text-4xl font-semibold tabular-nums text-text">{exp.low1}</div>
        </div>
      </div>

      <div className="p-4 rounded-2xl border border-border bg-bg-elev/30 text-muted text-sm leading-relaxed italic text-center">
        &quot;{exp.description}&quot;
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {(['fluid', 'stutter'] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => !submitted && setSelected(opt)}
              className={`py-3 rounded-xl border transition-all text-sm font-medium capitalize ${
                selected === opt 
                  ? 'border-text bg-text/10 text-text' 
                  : 'border-border bg-bg-elev text-muted hover:text-text'
              } ${submitted && (opt === 'fluid' === exp.isFluid) ? 'border-green-500 bg-green-500/5 text-green-500' : ''}`}
            >
              {opt === 'fluid' ? 'Expérience Fluide' : 'Expérience Saccadée'}
            </button>
          ))}
        </div>

        {!submitted ? (
            <button 
              onClick={() => selected && setSubmitted(true)}
              disabled={!selected}
              className="w-full py-3 rounded-xl bg-text text-bg font-medium text-sm disabled:opacity-50 transition-all"
            >
              Valider l&apos;interprétation
            </button>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className={`p-4 rounded-xl border flex gap-3 text-sm ${
              (selected === 'fluid' === exp.isFluid) 
                ? 'border-green-500 bg-green-500/5 text-green-500' 
                : 'border-red-500 bg-red-500/5 text-red-500'
            }`}>
              {(selected === 'fluid' === exp.isFluid) ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
              <div className="flex-1">
                <p className="font-semibold">{(selected === 'fluid' === exp.isFluid) ? 'Correct !' : 'Incorrect'}</p>
                <p className="opacity-80 leading-relaxed">
                  {exp.isFluid 
                    ? `L&apos;écart entre le FPS moyen (${exp.avgFps}) et le 1% low (${exp.low1}) est faible. La fluidité est maintenue.` 
                    : `L&apos;écart est massif (${exp.avgFps} vs ${exp.low1}). Même si la moyenne est haute, les chutes brutales créent des micro-saccades.`}
                </p>
              </div>
            </div>
            <button onClick={handleNext} className="w-full py-3 rounded-xl border border-border text-text font-medium text-sm hover:bg-bg-elev transition-all">
              Cas suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
