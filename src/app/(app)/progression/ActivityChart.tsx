'use client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function ActivityChart({ data }: { data: { day: string; xp: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ left: -16, right: 8, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="xpgrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="day"
          stroke="#6b7280"
          fontSize={11}
          tickLine={false}
          axisLine={{ stroke: '#262626' }}
        />
        <YAxis
          stroke="#6b7280"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ stroke: '#ffffff', strokeOpacity: 0.2, strokeWidth: 1 }}
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
          formatter={(v: number) => [`${v} XP`, 'Gagnés']}
        />
        <Area
          type="monotone"
          dataKey="xp"
          stroke="#ffffff"
          fill="url(#xpgrad)"
          strokeWidth={2}
          activeDot={{
            r: 4,
            stroke: '#ffffff',
            strokeWidth: 2,
            fill: '#000000',
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
