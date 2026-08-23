import * as cheerio from 'cheerio';
import type { PriceProvider, PriceResult } from './types';

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

// Parse prix français : "1 299,99 €" ou "1299.99€"
function parsePrice(raw: string): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/\s/g, '').replace('€', '').replace(',', '.');
  const m = cleaned.match(/[0-9]+(?:\.[0-9]+)?/);
  if (!m) return null;
  const n = parseFloat(m[0]);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
}

export const ldlc: PriceProvider = {
  source: 'ldlc',
  async search(query: string): Promise<PriceResult | null> {
    const q = encodeURIComponent(query.trim());
    if (!q) return null;
    const html = await fetchWithTimeout(`https://www.ldlc.com/recherche/${q}/`);
    if (!html) return null;
    const $ = cheerio.load(html);
    // Premier produit de la liste — LDLC: .pdt-item ou .product-block
    const item = $('.pdt-item').first();
    if (!item.length) return null;
    const name = item.find('.pdt-desc, .product-name, h3').first().text().trim();
    const priceRaw = item.find('.price, .pdt-price, [data-price]').first().text().trim() || item.find('[data-price]').attr('data-price') || '';
    const price = parsePrice(priceRaw);
    const href = item.find('a').first().attr('href');
    if (!name || price == null || !href) return null;
    return {
      name,
      price,
      currency: 'EUR',
      source: 'ldlc',
      url: href.startsWith('http') ? href : `https://www.ldlc.com${href}`,
      updatedAt: new Date().toISOString(),
    };
  },
};
