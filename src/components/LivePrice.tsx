'use client';
import { useLivePrice } from '@/lib/prices/client';
import { cn } from '@/lib/utils';

const SOURCE_LABEL: Record<string, string> = { ldlc: 'LDLC', topachat: 'TopAchat', coolpc: 'Coolpc' };

function relativeTime(iso: string | null): string {
  if (!iso) return '';
  const diffMs = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diffMs / (60 * 60 * 1000));
  if (h < 1) return 'à l\'instant';
  if (h < 24) return `il y a ${h}h`;
  const d = Math.floor(h / 24);
  return `il y a ${d}j`;
}

function fmtEUR(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

export function LivePrice({ query, fallback, className }: { query: string; fallback: number; className?: string }) {
  const { price, source, url, updatedAt, isLive, isLoading } = useLivePrice(query, fallback);
  const label = source ? SOURCE_LABEL[source] ?? source : null;

  return (
    <div className={cn('flex flex-col leading-tight', className)}>
      <div className="flex items-baseline gap-1.5">
        <span className={cn('font-display font-semibold tabular-nums', isLive ? 'text-accent' : 'text-text')}>
          {fmtEUR(price)}
        </span>
        {isLoading && <span className="text-[10px] text-faint animate-pulse text-mono">…</span>}
      </div>
      {isLive && label && (
        <a
          href={url ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-faint hover:text-accent transition-colors text-mono uppercase tracking-[0.1em]"
        >
          via {label} · {relativeTime(updatedAt)}
        </a>
      )}
      {!isLive && !isLoading && (
        <span className="text-[10px] text-faint text-mono uppercase tracking-[0.1em]">prix de référence</span>
      )}
    </div>
  );
}
