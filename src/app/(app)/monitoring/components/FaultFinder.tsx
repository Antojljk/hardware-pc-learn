"use client";
import React, { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

type Case = {
  id: string;
  metrics: {
    cpuTemp: number;
    cpuUsage: number;
    gpuUsage: number;
    fanSpeed: number;
    clock: number;
  };
  options: {
    id: string;
    text: string;
    correct: boolean;
    explanation: string;
  }[];
};

const CASES: Case[] = [
  {
    id: 'case1',
    metrics: { cpuTemp: 98, cpuUsage: 95, gpuUsage: 40, fanSpeed: 1200, clock: 1800 },
    options: [
      { id: 'a', text: 'Bottleneck GPU', correct: false, explanation: 'Le GPU est à 40%, il n\'est pas le facteur limitant. Le CPU est ici le problème.' },
      { id: 'b', text: 'Thermal Throttling CPU', correct: true, explanation: 'L\'association d\'une température très haute (98°C) et d\'une fréquence basse (1800MHz) malgré une charge élevée est la signature du throttling.' },
      { id: 'c', text: 'Surcharge RAM', correct: false, explanation: 'La RAM n\'est pas indiquée ici, mais unlikely avec un CPU throttlé.' },
    ],
  },
  {
    id: 'case2',
    metrics: { cpuTemp: 45, cpuUsage: 10, gpuUsage: 99, fanSpeed: 2200, clock: 4200 },
    options: [
      { id: 'a', text: 'GPU-bound (Normal)', correct: true, explanation: 'C\'est l\'état idéal en gaming : le GPU tourne à fond pour maximiser les FPS, tandis que le CPU a assez de marge.' },
      { id: 'b', text: 'CPU Bottleneck', correct: false, explanation: 'Le CPU est à seulement 10%, il ne bride pas le système.' },
      { id: 'c', text: 'Panne Ventilateur', correct: false, explanation: 'Avec 45°C, le système est parfaitement refroidi.' },
    ],
  },
  {
    id: 'case3',
    metrics: { cpuTemp: 102, cpuUsage: 90, gpuUsage: 30, fanSpeed: 0, clock: 1500 },
    options: [
      { id: 'a', text: 'Pâte thermique usée', correct: false, explanation: 'Une pâte usée ferait monter la température, mais le ventilateur tournerait quand même à fond.' },
      { id: 'b', text: 'Ventilateur CPU HS', correct: true, explanation: 'Fan Speed à 0 RPM avec une température critique est le signe indiscutable d\'une panne mécanique ou électrique du ventilateur.' },
      { id: 'c', text: 'Mauvaise configuration BIOS', correct: false, explanation: 'Le BIOS ne désactiverait pas totalement un ventilateur en cas de surchauffe critique.' },
    ],
  },
  {
    id: 'case4',
    metrics: { cpuTemp: 72, cpuUsage: 98, gpuUsage: 15, fanSpeed: 2600, clock: 3800 },
    options: [
      { id: 'a', text: 'CPU-bound (Normal)', correct: true, explanation: 'C\'est un scénario de rendu CPU (comme un export vidéo). Le CPU est à 98%, les températures sont maîtrisées et la fréquence est haute.' },
      { id: 'b', text: 'Thermal Throttling', correct: false, explanation: 'La température (72°C) est bien en dessous du seuil de throttling.' },
      { id: 'c', text: 'Panne GPU', correct: false, explanation: 'Le GPU est peu utilisé car la tâche est purement calcul CPU.' },
    ],
  },
  {
    id: 'case5',
    metrics: { cpuTemp: 85, cpuUsage: 30, gpuUsage: 98, fanSpeed: 1100, clock: 4100 },
    options: [
      { id: 'a', text: 'Ventilation GPU insuffisante', correct: true, explanation: 'Le GPU est à fond et le CPU est frais, mais la température globale monte. Si le boîtier est mal ventilé, la chaleur stagne.' },
      { id: 'b', text: 'CPU Bottleneck', correct: false, explanation: 'Le CPU est à 30%, il ne bride rien.' },
      { id: 'c', text: 'Thermal Throttling CPU', correct: false, explanation: 'Le CPU est à 85°C mais sa fréquence reste haute (4100MHz), donc pas de throttling.' },
    ],
  },
];

export default function FaultFinder() {
  const [currentCase, setCurrentCase] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const caseData = CASES[currentCase];
  const metrics = caseData.metrics;

  const handleSubmit = () => {
    if (selectedOption) setIsSubmitted(true);
  };

  const handleNext = () => {
    setCurrentCase((prev) => (prev + 1) % CASES.length);
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  return (
    <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {Object.entries(metrics).map(([key, value]) => (
              <div key={key} className="rounded-xl border border-border bg-bg-elev/50 p-3 transition-all hover:border-text/30">
                <div className="text-[10px] uppercase tracking-wider text-muted mb-1">{key.replace(/([A-Z])/g, ' $1')}</div>
                <div className="font-display text-lg font-semibold tabular-nums text-text">
                  {value}{key.includes('Temp') ? '°C' : key.includes('Usage') ? '%' : key.includes('fan') ? ' RPM' : ' MHz'}
                </div>
              </div>
            ))}
          </div>

      <div className="space-y-3">
        <div className="grid gap-2">
          {caseData.options.map((opt) => (
            <button
              key={opt.id}
              disabled={isSubmitted}
              onClick={() => setSelectedOption(opt.id)}
              className={`p-4 text-left rounded-xl border transition-all text-sm ${
                selectedOption === opt.id 
                  ? 'border-text bg-text/5' 
                  : 'border-border bg-bg-elev hover:border-text/50'
              } ${isSubmitted && opt.correct ? 'border-green-500 bg-green-500/5' : ''}`}
            >
              {opt.text}
            </button>
          ))}
        </div>

        {!isSubmitted ? (
          <button 
            onClick={handleSubmit}
            disabled={!selectedOption}
            className="w-full py-3 rounded-xl bg-text text-bg font-medium text-sm disabled:opacity-50 transition-all"
          >
            Valider le diagnostic
          </button>
        ) : (
          <div className="space-y-4">
            <div className={`p-4 rounded-xl border flex gap-3 text-sm ${
              caseData.options.find(o => o.id === selectedOption)?.correct 
                ? 'border-green-500 bg-green-500/5 text-green-500' 
                : 'border-red-500 bg-red-500/5 text-red-500'
            }`}>
              {caseData.options.find(o => o.id === selectedOption)?.correct ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
              <span className="font-medium">{caseData.options.find(o => o.id === selectedOption)?.correct ? 'Correct !' : 'Incorrect'}</span>
            </div>
            <div className="p-4 rounded-xl border border-border bg-bg-elev text-muted text-sm leading-relaxed">
              {caseData.options.find(o => o.id === selectedOption)?.explanation}
            </div>
            <button 
              onClick={handleNext}
              className="w-full py-3 rounded-xl border border-border text-text font-medium text-sm hover:bg-bg-elev transition-all"
            >
              Cas suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
