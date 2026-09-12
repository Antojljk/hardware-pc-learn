"use client";
import React, { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

type Scenario = {
  id: string;
  metrics: { cpuUsage: number; gpuUsage: number; fps: number };
  options: { id: string; text: string; correct: boolean; explanation: string }[];
};

const SCENARIOS: Scenario[] = [
  {
    id: 's1',
    metrics: { cpuUsage: 98, gpuUsage: 45, fps: 60 },
    options: [
      { id: 'a', text: 'GPU Bottleneck', correct: false, explanation: 'Le GPU n\'est utilisé qu\'à 45%, il n\'est pas le facteur limitant.' },
      { id: 'b', text: 'CPU Bottleneck', correct: true, explanation: 'Le CPU est saturé (98%) alors que le GPU a encore beaucoup de marge. C\'est un bottleneck CPU.' },
      { id: 'c', text: 'Équilibré', correct: false, explanation: 'Une utilisation déséquilibrée (98% vs 45%) indique un goulot d\'étranglement.' },
    ],
  },
  {
    id: 's2',
    metrics: { cpuUsage: 30, gpuUsage: 99, fps: 120 },
    options: [
      { id: 'a', text: 'CPU Bottleneck', correct: false, explanation: 'Le CPU est très peu sollicité (30%), il ne bride rien.' },
      { id: 'b', text: 'GPU Bottleneck', correct: true, explanation: 'Le GPU est à 99%, il donne tout ce qu\'il peut. C\'est l\'état normal et souhaité en gaming.' },
      { id: 'c', text: 'Surcharge RAM', correct: false, explanation: 'L\'utilisation CPU/GPU ne suggère pas de problème de RAM ici.' },
    ],
  },
  {
    id: 's3',
    metrics: { cpuUsage: 60, gpuUsage: 60, fps: 40 },
    options: [
      { id: 'a', text: 'Bottleneck Matériel', correct: false, explanation: 'L\'utilisation est faible des deux côtés, mais les FPS sont bas. C\'est probablement un problème logiciel ou un lock FPS.' },
      { id: 'b', text: 'CPU Bottleneck', correct: false, explanation: 'Le CPU n\'est pas saturé.' },
      { id: 'c', text: 'GPU Bottleneck', correct: false, explanation: 'Le GPU n\'est pas saturé.' },
    ],
  },
];

export default function BottleneckDetector() {
  const [currentCase, setCurrentCase] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const scenario = SCENARIOS[currentCase];

  const handleNext = () => {
    setCurrentCase((prev) => (prev + 1) % SCENARIOS.length);
    setSelected(null);
    setSubmitted(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(scenario.metrics).map(([key, value]) => (
          <div key={key} className="rounded-xl border border-border bg-bg-elev/50 p-3 text-center">
            <div className="text-[10px] uppercase tracking-wider text-muted mb-1">{key.replace('Usage', ' Load')}</div>
            <div className="font-display text-xl font-semibold tabular-nums text-text">
              {value}{key === 'fps' ? ' FPS' : '%'}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="grid gap-2">
          {scenario.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => !submitted && setSelected(opt.id)}
              className={`p-4 text-left rounded-xl border transition-all text-sm ${
                selected === opt.id 
                  ? 'border-text bg-text/10 text-text' 
                  : 'border-border bg-bg-elev text-muted hover:text-text'
              } ${submitted && opt.correct ? 'border-green-500 bg-green-500/5 text-green-500' : ''}`}
            >
              {opt.text}
            </button>
          ))}
        </div>

        {!submitted ? (
          <button 
            onClick={() => selected && setSubmitted(true)}
            disabled={!selected}
            className="w-full py-3 rounded-xl bg-text text-bg font-medium text-sm disabled:opacity-50 transition-all"
          >
            Analyser le bottleneck
          </button>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className={`p-4 rounded-xl border flex gap-3 text-sm ${
              scenario.options.find(o => o.id === selected)?.correct 
                ? 'border-green-500 bg-green-500/5 text-green-500' 
                : 'border-red-500 bg-red-500/5 text-red-500'
            }`}>
              {scenario.options.find(o => o.id === selected)?.correct ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
              <div className="flex-1">
                <p className="font-semibold">{scenario.options.find(o => o.id === selected)?.correct ? 'Correct !' : 'Incorrect'}</p>
                <p className="opacity-80 leading-relaxed">{scenario.options.find(o => o.id === selected)?.explanation}</p>
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
