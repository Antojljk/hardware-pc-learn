import * as cheerio from 'cheerio';
import type { PriceProvider, PriceResult } from './types';
import { parseFrenchPrice, isGoodMatch } from './utils';

const UA = 'Mozilla/5.0 (compatible; HardwarePC-Learn/1.0)';
const TIMEOUT_MS = 4000;

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
    
    const productElements = $('.product, .item, article').toArray();
    for (const el of productElements) {
      const $item = $(el);
      const name = $item.find('.product-name, .name, h2, h3, a').first().text().trim();
      const priceRaw = $item.find('.price, .product-price, [itemprop="price"]').first().text().trim() || $item.find('[itemprop="price"]').attr('content') || '';
      const price = parseFrenchPrice(priceRaw);
      const href = $item.find('a').first().attr('href');

      if (name && price != null && href && isGoodMatch(query, name)) {
        return {
          name,
          price,
          currency: 'EUR',
          source: 'coolpc',
          url: href.startsWith('http') ? href : `https://www.coolpc.fr${href.startsWith('/') ? '' : '/'}${href}`,
          updatedAt: new Date().toISOString(),
        };
      }
    }
    return null;
  },
};
