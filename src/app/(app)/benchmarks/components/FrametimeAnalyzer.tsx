"use client";
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2, XCircle } from 'lucide-react';

type Scenario = 'stable' | 'stutter';

const DATA: Record<Scenario, { time: number, value: number }[]> = {
  stable: Array.from({ length: 50 }, (_, i) => ({ time: i, value: 16.6 + (Math.random() * 2 - 1) })),
  stutter: [
    ...Array.from({ length: 20 }, (_, i) => ({ time: i, value: 16.6 + (Math.random() * 2 - 1) })),
    { time: 20, value: 85 },
    { time: 21, value: 110 },
    { time: 22, value: 45 },
    ...Array.from({ length: 27 }, (_, i) => ({ time: i + 23, value: 16.6 + (Math.random() * 2 - 1) })),
  ],
};

export default function FrametimeAnalyzer() {
  const [scenario, setScenario] = useState<Scenario>('stable');
  const [analysis, setAnalysis] = useState<'stable' | 'stutter' | null>(null);
  const [isValidated, setIsValidated] = useState(false);

  const handleValidate = (a: 'stable' | 'stutter') => {
    setAnalysis(a);
    setIsValidated(true);
  };

  return (
    <div className="space-y-6">
      <div className="h-[300px] w-full rounded-2xl border border-border bg-bg-elev/50 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={DATA[scenario]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="time" hide />
            <YAxis domain={[0, 120]} stroke="#666" fontSize={12} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }} 
              itemStyle={{ color: '#fff' }}
              formatter={(value: number) => [`${value.toFixed(2)} ms`, 'Frametime']}
            />
            <Line type="monotone" dataKey="value" stroke="#fff" strokeWidth={2} dot={false} isAnimationActive={true} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(['stable', 'stutter'] as const).map((s) => (
          <button
            key={s}
            onClick={() => handleValidate(s)}
            disabled={isValidated}
            className={`py-3 rounded-xl border text-sm font-medium transition-all capitalize ${
              analysis === s 
                ? 'border-text bg-text/10 text-text' 
                : 'border-border bg-bg-elev text-muted hover:text-text'
            } ${isValidated && s === scenario ? 'border-green-500 bg-green-500/5 text-green-500' : ''}`}
          >
            {s === 'stable' ? 'Stable / Fluide' : 'Anomalies / Stutters'}
          </button>
        ))}
      </div>

      {isValidated && (
        <div className="p-4 rounded-xl border flex gap-3 text-sm animate-in fade-in slide-in-from-top-2 duration-500">
          {analysis === scenario ? <CheckCircle2 className="w-5 h-5 shrink-0 text-green-500" /> : <XCircle className="w-5 h-5 shrink-0 text-red-500" />}
          <div className="flex-1">
            <p className="font-semibold">{analysis === scenario ? 'Correct !' : 'Incorrect'}</p>
            <p className="opacity-80 leading-relaxed">
              {scenario === 'stable' 
                ? 'Le frametime est constant autour de 16.6ms (60 FPS). C\'est l\'expérience utilisateur idéale.' 
                : 'On observe un pic massif (spike) dépassant les 100ms. Cela crée une saccade visible (stutter) même si le FPS moyen reste élevé.'}
            </p>
          </div>
        </div>
      )}

      <button 
        onClick={() => {
          setScenario(scenario === 'stable' ? 'stutter' : 'stable');
          setAnalysis(null);
          setIsValidated(false);
        }}
        className="w-full py-3 rounded-xl border border-border text-text font-medium text-sm hover:bg-bg-elev transition-all"
      >
        Changer le scénario
      </button>
    </div>
  );
}
