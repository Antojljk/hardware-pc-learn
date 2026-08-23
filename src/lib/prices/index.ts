import type { PriceResult, PriceProvider } from './types';
import { ldlc } from './ldlc';
import { topachat } from './topachat';
import { coolpc } from './coolpc';

const providers: PriceProvider[] = [ldlc, topachat, coolpc];

// Cache mémoire process-level — TTL 6h, clé = query normalisée
const TTL_MS = 6 * 60 * 60 * 1000;
const cache = new Map<string, { value: PriceResult | null; expiresAt: number }>();

function key(q: string) {
  return q.toLowerCase().replace(/\s+/g, ' ').trim();
}

export async function searchPrice(rawQuery: string): Promise<PriceResult | null> {
  const q = rawQuery.trim();
  if (!q) return null;
  const k = key(q);
  const now = Date.now();
  const hit = cache.get(k);
  if (hit && hit.expiresAt > now) return hit.value;

  for (const p of providers) {
    try {
      const r = await p.search(q);
      if (r) {
        cache.set(k, { value: r, expiresAt: now + TTL_MS });
        return r;
      }
    } catch (e) {
      console.warn(`[prices] provider ${p.source} failed:`, e instanceof Error ? e.message : e);
    }
  }
  // Cache aussi le "null" pour 30 min afin d'éviter de spammer les sources KO
  cache.set(k, { value: null, expiresAt: now + 30 * 60 * 1000 });
  return null;
}
