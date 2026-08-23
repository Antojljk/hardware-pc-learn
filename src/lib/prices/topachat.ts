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

export const topachat: PriceProvider = {
  source: 'topachat',
  async search(query: string): Promise<PriceResult | null> {
    const q = encodeURIComponent(query.trim());
    if (!q) return null;
    const ctl = new AbortController();
    const id = setTimeout(() => ctl.abort(), TIMEOUT_MS);
    let html: string;
    try {
      const res = await fetch(`https://www.topachat.com/pages/recherche.php?query=${q}`, {
        headers: { 'User-Agent': UA, 'Accept-Language': 'fr-FR,fr;q=0.9' },
        signal: ctl.signal,
        cache: 'no-store',
      });
      if (!res.ok) return null;
      html = await res.text();
    } catch { return null; }
    finally { clearTimeout(id); }

    const $ = cheerio.load(html);
    // TopAchat: conteneur produit .grille-produit .prod-item ou a.product-link
    const link = $('.prod-item a, .product-link, a[href*="/pages/produit/"]').first();
    if (!link.length) return null;
    const name = link.find('.prod-name, .name, h3, h2').first().text().trim() || link.attr('title')?.trim() || '';
    const priceRaw = link.find('.prod-price, .price, [itemprop="price"]').first().text().trim() || link.find('[itemprop="price"]').attr('content') || '';
    const price = parsePrice(priceRaw);
    const href = link.attr('href');
    if (!name || price == null || !href) return null;
    return {
      name,
      price,
      currency: 'EUR',
      source: 'topachat',
      url: href.startsWith('http') ? href : `https://www.topachat.com${href.startsWith('/') ? '' : '/'}${href}`,
      updatedAt: new Date().toISOString(),
    };
  },
};
