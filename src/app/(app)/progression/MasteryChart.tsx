'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type Datum = { key: string; label: string; value: number };

const COLORS = ['#22c55e', '#22d3ee', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#a3a3a3'];

export function MasteryChart({ data }: { data: Datum[] }) {
  const sorted = [...data].sort((a, b) => b.value - a.value).slice(0, 12);
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={sorted} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
        <XAxis type="number" domain={[0, 100]} stroke="#6b7196" fontSize={11} />
        <YAxis dataKey="label" type="category" stroke="#9ca3c4" fontSize={11} width={120} />
        <Tooltip contentStyle={{ background: '#131525', border: '1px solid #252846', borderRadius: 8 }} cursor={{ fill: 'rgba(59,130,246,0.06)' }} />
        <Bar dataKey="value" radius={[0, 6, 6, 0]}>
          {sorted.map((d, i) => {
            const c = d.value >= 85 ? COLORS[0] : d.value >= 65 ? COLORS[1] : d.value >= 40 ? COLORS[4] : COLORS[5];
            return <Cell key={d.key} fill={c} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
