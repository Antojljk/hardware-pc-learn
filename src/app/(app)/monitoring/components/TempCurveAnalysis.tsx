"use client";
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

type Scenario = 'normal' | 'critical' | 'throttling';

const SCENARIOS: Record<Scenario, { label: string, data: { time: number, temp: number }[], explanation: string }> = {
  normal: {
    label: 'Normal',
    data: [
      { time: 0, temp: 40 }, { time: 1, temp: 42 }, { time: 2, temp: 45 },
      { time: 3, temp: 55 }, { time: 4, temp: 65 }, { time: 5, temp: 72 },
      { time: 6, temp: 75 }, { time: 7, temp: 74 }, { time: 8, temp: 76 },
      { time: 9, temp: 73 }, { time: 10, temp: 75 }, { time: 11, temp: 74 },
    ],
    explanation: 'La température monte lors de la charge puis se stabilise bien en dessous du seuil critique. C\'est un comportement thermique sain.'
  },
  critical: {
    label: 'Critique',
    data: [
      { time: 0, temp: 40 }, { time: 1, temp: 50 }, { time: 2, temp: 65 },
      { time: 3, temp: 80 }, { time: 4, temp: 90 }, { time: 5, temp: 98 },
      { time: 6, temp: 102 }, { time: 7, temp: 105 }, { time: 8, temp: 104 },
      { time: 9, temp: 106 }, { time: 10, temp: 105 }, { time: 11, temp: 107 },
    ],
    explanation: 'La température dépasse largement le seuil T-Junction sans jamais se stabiliser. Le système risque l\'extinction de sécurité.'
  },
  throttling: {
    label: 'Thermal Throttling',
    data: [
      { time: 0, temp: 40 }, { time: 1, temp: 42 }, { time: 2, temp: 45 },
      { time: 3, temp: 60 }, { time: 4, temp: 75 }, { time: 5, temp: 88 },
      { time: 6, temp: 95 }, { time: 7, temp: 96 }, { time: 8, temp: 94 },
      { time: 9, temp: 95 }, { time: 10, temp: 96 }, { time: 11, temp: 95 },
    ],
    explanation: 'La température atteint le seuil critique (95°C) puis stagne en formant un plateau parfait. Le CPU réduit sa fréquence pour limiter la chaleur.'
  },
};

export default function TempCurveAnalysis() {
  const [activeScenario, setActiveScenario] = useState<Scenario>('normal');
  const [selectedAnalysis, setSelectedAnalysis] = useState<Scenario | null>(null);
  const [isValidated, setIsValidated] = useState(false);

  const handleValidate = (s: Scenario) => {
    setSelectedAnalysis(s);
    setIsValidated(true);
  };

  const handleNextScenario = () => {
    const scenarios: Scenario[] = ['normal', 'critical', 'throttling'];
    const currentIndex = scenarios.indexOf(activeScenario);
    const nextIndex = (currentIndex + 1) % scenarios.length;
    setActiveScenario(scenarios[nextIndex]);
    setSelectedAnalysis(null);
    setIsValidated(false);
  };

  return (
    <div className="space-y-6">
      <div className="h-[300px] w-full rounded-2xl border border-border bg-bg-elev/50 p-4 transition-all duration-500">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={SCENARIOS[activeScenario].data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="time" hide />
            <YAxis domain={[30, 115]} stroke="#666" fontSize={12} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }} 
              itemStyle={{ color: '#fff' }}
            />
            <Line 
              type="monotone" 
              dataKey="temp" 
              stroke="#fff" 
              strokeWidth={2} 
              dot={false} 
              isAnimationActive={true} 
              animationDuration={1000}
            />
            <ReferenceLine y={95} stroke="red" strokeDasharray="3 3" label={{ value: 'T-Junction', position: 'right', fill: 'red', fontSize: 10 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['normal', 'critical', 'throttling'] as Scenario[]).map((s) => (
            <button
              key={s}
              onClick={() => handleValidate(s)}
              disabled={isValidated}
              className={`py-3 rounded-xl border text-sm font-medium transition-all capitalize ${
                selectedAnalysis === s 
                  ? 'border-text bg-text/10 text-text' 
                  : 'border-border bg-bg-elev text-muted hover:text-text'
              } ${isValidated && s === activeScenario ? 'border-green-500 bg-green-500/5 text-green-500' : ''}`}
            >
              {s === 'normal' ? 'Normal' : s === 'critical' ? 'Critique' : 'Thermal Throttling'}
            </button>
          ))}
        </div>

        {isValidated && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className={`p-4 rounded-xl border flex gap-3 text-sm transition-all ${
              selectedAnalysis === activeScenario 
                ? 'border-green-500 bg-green-500/5 text-green-500' 
                : 'border-red-500 bg-red-500/5 text-red-500'
            }`}>
              {selectedAnalysis === activeScenario ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
              <div className="flex-1">
                <p className="font-semibold">{selectedAnalysis === activeScenario ? 'Correct !' : 'Incorrect'}</p>
                <p className="opacity-80 leading-relaxed">
                  {SCENARIOS[activeScenario].explanation}
                </p>
              </div>
            </div>
            <button 
              onClick={handleNextScenario}
              className="w-full py-3 rounded-xl border border-border text-text font-medium text-sm hover:bg-bg-elev transition-all"
            >
              Scénario suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
