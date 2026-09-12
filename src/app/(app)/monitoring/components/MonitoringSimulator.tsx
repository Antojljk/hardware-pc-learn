"use client";
import React, { useState, useEffect } from 'react';
import { Cpu, Thermometer, Activity, Wind, MemoryStick, Gauge } from 'lucide-react';

type Scenario = 'idle' | 'gaming' | 'cpu_load' | 'overheating';

const SCENARIOS: Record<Scenario, { 
  label: string; 
  description: string;
  cpu: { usage: [number, number], temp: [number, number], freq: [number, number] };
  gpu: { usage: [number, number], temp: [number, number], freq: [number, number] };
  ram: { usage: [number, number] };
  fans: { speed: [number, number] };
}> = {
  idle: {
    label: 'Repos',
    description: 'Utilisation légère : navigation web, documents.',
    cpu: { usage: [1, 8], temp: [32, 40], freq: [1800, 2800] },
    gpu: { usage: [0, 3], temp: [30, 38], freq: [210, 400] },
    ram: { usage: [12, 20] },
    fans: { speed: [600, 900] },
  },
  gaming: {
    label: 'Gaming',
    description: 'Charge équilibrée CPU/GPU : Jeu AAA moderne.',
    cpu: { usage: [35, 65], temp: [60, 78], freq: [3800, 4600] },
    gpu: { usage: [92, 99], temp: [68, 84], freq: [1850, 2200] },
    ram: { usage: [45, 70] },
    fans: { speed: [1600, 2400] },
  },
  cpu_load: {
    label: 'Rendu CPU',
    description: 'Charge CPU maximale : Export vidéo, Compilation.',
    cpu: { usage: [97, 100], temp: [82, 92], freq: [3400, 3900] },
    gpu: { usage: [2, 12], temp: [35, 45], freq: [300, 600] },
    ram: { usage: [60, 85] },
    fans: { speed: [2100, 2600] },
  },
  overheating: {
    label: 'Surchauffe',
    description: 'Échec refroidissement : Pompe AIO HS ou ventilateur bloqué.',
    cpu: { usage: [90, 100], temp: [96, 105], freq: [1100, 1800] },
    gpu: { usage: [20, 50], temp: [80, 92], freq: [800, 1200] },
    ram: { usage: [30, 50] },
    fans: { speed: [0, 300] },
  },
};

const randomBetween = (range: [number, number]) => 
  Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];

export default function MonitoringSimulator() {
  const [scenario, setScenario] = useState<Scenario>('idle');
  const [metrics, setMetrics] = useState({
    cpuUsage: 0, cpuTemp: 0, cpuFreq: 0,
    gpuUsage: 0, gpuTemp: 0,
    ramUsage: 0,
    fanSpeed: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const s = SCENARIOS[scenario];
      setMetrics({
        cpuUsage: randomBetween(s.cpu.usage),
        cpuTemp: randomBetween(s.cpu.temp),
        cpuFreq: randomBetween(s.cpu.freq),
        gpuUsage: randomBetween(s.gpu.usage),
        gpuTemp: randomBetween(s.gpu.temp),
        ramUsage: randomBetween(s.ram.usage),
        fanSpeed: randomBetween(s.fans.speed),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [scenario]);

  const MetricCard = ({ icon: Icon, label, value, unit, colorClass = "text-text" }: { icon: React.ElementType, label: string, value: number, unit: string, colorClass?: string }) => (
    <div className="rounded-2xl border border-border bg-bg-elev/50 backdrop-blur p-4 transition-all duration-500">
      <div className="flex items-center gap-2 text-muted mb-2">
        <Icon className="w-3 h-3" />
        <span className="text-[10px] uppercase tracking-wider font-medium">{label}</span>
      </div>
      <div className={`font-display text-2xl font-semibold tabular-nums ${colorClass}`}>
        {value}<span className="text-sm ml-1 font-normal opacity-60">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
    <div className="flex flex-wrap gap-2">
      {(Object.keys(SCENARIOS) as Scenario[]).map((s) => (
        <button
          key={s}
          onClick={() => setScenario(s)}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
            scenario === s 
              ? 'bg-text text-bg border border-transparent' 
              : 'bg-bg-elev border border-border text-muted hover:text-text hover:border-text/50'
          }`}
        >
          {SCENARIOS[s].label}
        </button>
      ))}
    </div>
    <div className="p-3 rounded-xl border border-border bg-bg-elev/30 text-muted text-xs leading-relaxed animate-in fade-in slide-in-from-top-1 duration-500">
      {SCENARIOS[scenario].description}
    </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard icon={Cpu} label="CPU Usage" value={metrics.cpuUsage} unit="%" />
        <MetricCard icon={Thermometer} label="CPU Temp" value={metrics.cpuTemp} unit="°C" colorClass={metrics.cpuTemp > 90 ? 'text-red-500' : metrics.cpuTemp > 75 ? 'text-yellow-500' : 'text-text'} />
        <MetricCard icon={Gauge} label="CPU Clock" value={metrics.cpuFreq} unit="MHz" />
        <MetricCard icon={Activity} label="GPU Usage" value={metrics.gpuUsage} unit="%" />
        <MetricCard icon={Thermometer} label="GPU Temp" value={metrics.gpuTemp} unit="°C" colorClass={metrics.gpuTemp > 85 ? 'text-red-500' : metrics.gpuTemp > 70 ? 'text-yellow-500' : 'text-text'} />
        <MetricCard icon={MemoryStick} label="RAM Usage" value={metrics.ramUsage} unit="%" />
        <MetricCard icon={Wind} label="Fan Speed" value={metrics.fanSpeed} unit="RPM" />
        <div className="rounded-2xl border border-border bg-bg-elev/50 backdrop-blur p-4 flex items-center justify-center">
           <div className="text-center">
             <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Statut</div>
             <div className="text-xs font-semibold text-text">
               {scenario === 'overheating' ? 'CRITIQUE' : 'STABLE'}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
