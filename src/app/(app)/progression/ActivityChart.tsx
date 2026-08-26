'use client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function ActivityChart({ data }: { data: { day: string; xp: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="xpgrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <XAxis dataKey="day" stroke="#6b7196" fontSize={11} />
        <YAxis stroke="#6b7196" fontSize={11} />
        <Tooltip contentStyle={{ background: '#131525', border: '1px solid #252846', borderRadius: 8 }} />
        <Area type="monotone" dataKey="xp" stroke="#8b5cf6" fill="url(#xpgrad)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
