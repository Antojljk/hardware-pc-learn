import { cn } from '@/lib/utils';

export function DomainProgress({ label, value, color }: { label: string; value: number; color: { label: string; color: string; bg: string; ring: string } }) {
  return (
    <div className={cn('card p-4 border', color.bg)}>
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium text-sm">{label}</div>
        <span className={cn('text-xs px-2 py-0.5 rounded-full border', color.color, 'border-current/30')}>{color.label}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full bg-bg-soft overflow-hidden">
          <div className={cn('h-full transition-all', color.color)} style={{ width: `${value}%` }} />
        </div>
        <span className={cn('text-sm font-semibold tabular-nums', color.color)}>{value}%</span>
      </div>
    </div>
  );
}
