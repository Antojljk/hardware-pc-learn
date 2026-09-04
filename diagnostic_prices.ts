// Remove imports to avoid TS config issues, we just need the logic
import * as cheerio from 'cheerio';

function parseFrenchPrice(raw: string): number | null {
  if (!raw) return null;
  let cleaned = raw.replace(/[€\s\u00a0]/g, '').trim();
  if (cleaned.includes('.') && cleaned.includes(',')) {
    const dotIndex = cleaned.indexOf('.');
    const commaIndex = cleaned.indexOf(',');
    if (dotIndex < commaIndex) {
      cleaned = cleaned.replace(/\./g, '');
    }
  }
  cleaned = cleaned.replace(',', '.');
  const m = cleaned.match(/-?\d+(?:\.\d+)?/);
  if (!m) return null;
  const n = parseFloat(m[0]);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
}

async function traceProvider(providerName: string, query: string) {
  console.log(`\nTracing ${providerName} for query: "${query}"`);
  
  let url = '';
  let html = '';
  
  if (providerName === 'ldlc') {
    url = `https://www.ldlc.com/recherche/${encodeURIComponent(query)}/`;
  } else if (providerName === 'topachat') {
    url = `https://www.topachat.com/pages/recherche.php?query=${encodeURIComponent(query)}`;
  } else if (providerName === 'coolpc') {
    url = `https://www.coolpc.fr/search?q=${encodeURIComponent(query)}`;
  }

  console.log(`1. Request URL: ${url}`);

  try {
    const res = await fetch(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HardwarePC-Learn/1.0)', 'Accept-Language': 'fr-FR,fr;q=0.9' },
      cache: 'no-store'
    });
    if (!res.ok) {
      console.log(`   Error: Response not OK (${res.status})`);
      return;
    }
    html = await res.text();
    console.log(`2. HTML received: ${html.length} bytes`);
    
    const $ = cheerio.load(html);
    let productElements: any[] = [];

    let selector = '';

    if (providerName === 'ldlc') {
      selector = '.pdt-item, .product-block';
      productElements = $('.pdt-item, .product-block').toArray();
    } else if (providerName === 'topachat') {
      selector = '.prod-item a, .product-link, a[href*="/pages/produit/"]';
      productElements = $('.prod-item a, .product-link, a[href*="/pages/produit/"]').toArray();
    } else if (providerName === 'coolpc') {
      selector = '.product, .item, article';
      productElements = $('.product, .item, article').toArray();
    }

    console.log(`   Selector used: ${selector} | Matches found: ${productElements.length}`);

    for (const el of productElements) {
      const $item = $(el);
      let name = '';
      let priceRaw = '';

      if (providerName === 'ldlc') {
        name = $item.find('.pdt-desc, .product-name, h3').first().text().trim();
        priceRaw = $item.find('.price, .pdt-price, [data-price]').first().text().trim() || $item.find('[data-price]').attr('data-price') || '';
      } else if (providerName === 'topachat') {
        name = $item.find('.prod-name, .name, h3, h2').first().text().trim() || $item.attr('title')?.trim() || '';
        priceRaw = $item.find('.prod-price, .price, [itemprop="price"]').first().text().trim() || $item.find('[itemprop="price"]').attr('content') || '';
      } else if (providerName === 'coolpc') {
        name = $item.find('.product-name, .name, h2, h3, a').first().text().trim();
        priceRaw = $item.find('.price, .product-price, [itemprop="price"]').first().text().trim() || $item.find('[itemprop="price"]').attr('content') || '';
      }

      // Simple matching logic for trace
      if (name && name.toLowerCase().includes(query.toLowerCase().substring(0, 5))) {
        const priceParsed = parseFrenchPrice(priceRaw);
        console.log(`   Candidate Found:`);
        console.log(`   - Product Name: ${name}`);
        console.log(`   - Raw Price: "${priceRaw}"`);
        console.log(`   - Parsed Price: ${priceParsed}`);
        
        // In a real scenario, this would then go to LivePrice
        console.log(`   - Final Value to LivePrice: ${priceParsed}`);
        return;
      }
    }
    console.log('   No suitable candidate found in the HTML.');

  } catch (e) {
    console.log(`   Fetch Error: ${e}`);
  }
}

async function runDiagnostic() {
  const components = [
    { type: 'CPU', query: 'AMD Ryzen 7 7800X3D' },
    { type: 'GPU', query: 'RTX 4080 Super' },
    { type: 'RAM', query: 'Corsair Vengeance DDR5 32GB' },
    { type: 'SSD', query: 'Samsung 990 Pro 2TB' },
    { type: 'Motherboard', query: 'MSI MAG B650 TOMAHAWK' },
    { type: 'PSU', query: 'Corsair RM850x' },
    { type: 'Case', query: 'NZXT H7 Flow' },
  ];

  const providers = ['ldlc', 'topachat', 'coolpc'];

  for (const comp of components) {
    console.log(`\n=== DIAGNOSTIC FOR ${comp.type} (${comp.query}) ===`);
    for (const prov of providers) {
      await traceProvider(prov, comp.query);
    }
  }
}

runDiagnostic();
