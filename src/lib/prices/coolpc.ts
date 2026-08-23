import * as cheerio from 'cheerio';
import type { PriceProvider, PriceResult } from './types';

const UA = 'Mozilla/5.0 (compatible; HardwarePC-Learn/1.0)';
const TIMEOUT_MS = 4000;

function parsePrice(raw: string): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/\s/g, '').replace('€', '').replace(',', '.');
  const m = cleaned.match(/[0-9]+(?:\.[0-9]+)?/);
  if (!m) return null;
  const n = parseFloat(m[0]);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
}

export const coolpc: PriceProvider = {
  source: 'coolpc',
  async search(query: string): Promise<PriceResult | null> {
    const q = encodeURIComponent(query.trim());
    if (!q) return null;
    const ctl = new AbortController();
    const id = setTimeout(() => ctl.abort(), TIMEOUT_MS);
    let html: string;
    try {
      // Coolpc a un endpoint de recherche JSON-ish ; fallback sur la page
      const res = await fetch(`https://www.coolpc.fr/search?q=${q}`, {
        headers: { 'User-Agent': UA, 'Accept-Language': 'fr-FR,fr;q=0.9' },
        signal: ctl.signal,
        cache: 'no-store',
      });
      if (!res.ok) return null;
      html = await res.text();
    } catch { return null; }
    finally { clearTimeout(id); }

    const $ = cheerio.load(html);
    const item = $('.product, .item, article').first();
    if (!item.length) return null;
    const name = item.find('.product-name, .name, h2, h3, a').first().text().trim();
    const priceRaw = item.find('.price, .product-price, [itemprop="price"]').first().text().trim() || item.find('[itemprop="price"]').attr('content') || '';
    const price = parsePrice(priceRaw);
    const href = item.find('a').first().attr('href');
    if (!name || price == null || !href) return null;
    return {
      name,
      price,
      currency: 'EUR',
      source: 'coolpc',
      url: href.startsWith('http') ? href : `https://www.coolpc.fr${href.startsWith('/') ? '' : '/'}${href}`,
      updatedAt: new Date().toISOString(),
    };
  },
};
