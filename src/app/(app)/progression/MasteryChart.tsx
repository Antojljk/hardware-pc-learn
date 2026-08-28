'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type Datum = { key: string; label: string; value: number };

export function MasteryChart({ data }: { data: Datum[] }) {
  const sorted = [...data].sort((a, b) => b.value - a.value).slice(0, 12);

  const tone = (v: number) => {
    if (v >= 85) return '#ffffff';
    if (v >= 65) return '#d4d4d8';
    if (v >= 40) return '#a1a1aa';
    if (v > 0) return '#71717a';
    return '#3f3f46';
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={sorted} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
        <XAxis
          type="number"
          domain={[0, 100]}
          stroke="#6b7280"
          fontSize={11}
          tickLine={false}
          axisLine={{ stroke: '#262626' }}
        />
        <YAxis
          dataKey="label"
          type="category"
          stroke="#9ca3af"
          fontSize={11}
          width={120}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          contentStyle={{
            background: '#0f0f10',
            border: '1px solid #262626',
            borderRadius: 12,
            fontSize: 12,
            color: '#ffffff',
            boxShadow: '0 12px 32px rgba(0,0,0,0.55)',
          }}
          labelStyle={{ color: '#9ca3af', marginBottom: 4 }}
          itemStyle={{ color: '#ffffff' }}
          formatter={(v: number) => [`${v}%`, 'Maîtrise']}
        />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} background={{ fill: '#161617' }}>
          {sorted.map((d) => (
            <Cell key={d.key} fill={tone(d.value)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
