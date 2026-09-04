import * as cheerio from 'cheerio';
import type { PriceProvider, PriceResult } from './types';
import { parseFrenchPrice, isGoodMatch } from './utils';

const UA = 'Mozilla/5.0 (compatible; HardwarePC-Learn/1.0; +https://hardware-pc-learn.local)';
const TIMEOUT_MS = 4000;

async function fetchWithTimeout(url: string): Promise<string | null> {
  const ctl = new AbortController();
  const id = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'fr-FR,fr;q=0.9' }, signal: ctl.signal, cache: 'no-store' });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(id);
  }
}

export const ldlc: PriceProvider = {
  source: 'ldlc',
  async search(query: string): Promise<PriceResult | null> {
    const q = encodeURIComponent(query.trim());
    if (!q) return null;
    const html = await fetchWithTimeout(`https://www.ldlc.com/recherche/${q}/`);
    if (!html) return null;
    const $ = cheerio.load(html);

    const productElements = $('.pdt-item, .product-block').toArray();
    
    for (const el of productElements) {
      const $item = $(el);
      const name = $item.find('.pdt-desc, .product-name, h3').first().text().trim();
      const priceRaw = $item.find('.price, .pdt-price, [data-price]').first().text().trim() || $item.find('[data-price]').attr('data-price') || '';
      const price = parseFrenchPrice(priceRaw);
      const href = $item.find('a').first().attr('href');

      if (name && price != null && href && isGoodMatch(query, name)) {
        return {
          name,
          price,
          currency: 'EUR',
          source: 'ldlc',
          url: href.startsWith('http') ? href : `https://www.ldlc.com${href}`,
          updatedAt: new Date().toISOString(),
        };
      }
    }
    return null;
  },
};
