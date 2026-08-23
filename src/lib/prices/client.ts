'use client';
import { useEffect, useState } from 'react';

export type LivePrice = {
  price: number;
  source: 'ldlc' | 'topachat' | 'coolpc' | null;
  url: string | null;
  updatedAt: string | null;
  isLive: boolean;
  isLoading: boolean;
  error: string | null;
};

const EMPTY: LivePrice = { price: 0, source: null, url: null, updatedAt: null, isLive: false, isLoading: false, error: null };

export function useLivePrice(query: string, fallbackPrice: number): LivePrice {
  const [state, setState] = useState<LivePrice>({ ...EMPTY, price: fallbackPrice });

  useEffect(() => {
    const q = query.trim();
    if (!q) { setState({ ...EMPTY, price: fallbackPrice }); return; }
    const ctl = new AbortController();
    setState(s => ({ ...s, isLoading: true, error: null, price: fallbackPrice }));
    const timer = setTimeout(() => ctl.abort(), 3500);
    fetch(`/api/prices?q=${encodeURIComponent(q)}`, { signal: ctl.signal, cache: 'no-store' })
      .then(r => r.json())
      .then((data: { ok: boolean; price?: number; source?: LivePrice['source']; url?: string; updatedAt?: string; error?: string }) => {
        if (ctl.signal.aborted) return;
        if (data?.ok && typeof data.price === 'number') {
          setState({ price: data.price, source: data.source ?? null, url: data.url ?? null, updatedAt: data.updatedAt ?? null, isLive: true, isLoading: false, error: null });
        } else {
          setState({ price: fallbackPrice, source: null, url: null, updatedAt: null, isLive: false, isLoading: false, error: data?.error ?? 'unavailable' });
        }
      })
      .catch(() => {
        if (ctl.signal.aborted) return;
        setState({ price: fallbackPrice, source: null, url: null, updatedAt: null, isLive: false, isLoading: false, error: 'unavailable' });
      })
      .finally(() => clearTimeout(timer));
    return () => { ctl.abort(); clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return state;
}
