const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'screenshots-motion');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// 9:16 vertical pour TikTok/Reels/Shorts
const VIEWPORT = { width: 1080, height: 1920, deviceScaleFactor: 2 };

// Credentials
const LOGIN_EMAIL = 'antoine.drutel@gmail.com';
const LOGIN_PASSWORD = 'Antoine2906*';

const PAGES = [
  { name: '01-home', url: 'http://localhost:3000', waitFor: '.l-s01-title', scroll: false, auth: false },
  { name: '02-dashboard', url: 'http://localhost:3000/app', waitFor: '[data-testid="dashboard"], .dashboard, main', scroll: true, auth: true },
  { name: '03-cours', url: 'http://localhost:3000/cours', waitFor: 'main, [role="main"]', scroll: true, auth: false },
  { name: '04-quiz', url: 'http://localhost:3000/quiz', waitFor: 'main, [role="main"]', scroll: true, auth: true },
  { name: '05-diagnostic', url: 'http://localhost:3000/diagnostic', waitFor: 'main, [role="main"]', scroll: true, auth: true },
  { name: '06-constructeur', url: 'http://localhost:3000/constructeur', waitFor: 'main, [role="main"]', scroll: true, auth: true },
  { name: '07-glossaire', url: 'http://localhost:3000/glossaire', waitFor: 'main, [role="main"]', scroll: true, auth: false },
  { name: '08-entretiens', url: 'http://localhost:3000/entretiens', waitFor: 'main, [role="main"]', scroll: true, auth: true },
  { name: '09-offres', url: 'http://localhost:3000/offres', waitFor: 'main, [role="main"]', scroll: true, auth: false },
];

async function login(page) {
  console.log('🔐 Logging in...');
  await page.goto('http://localhost:3000/auth', { waitUntil: 'networkidle' });

  // Wait for login form - inputs have className="input"
  await page.waitForSelector('input.input[type="text"], input.input[type="email"], input.input', { timeout: 10000 });

  // Fill credentials - login mode uses "Email ou pseudo" field (type="text") and password
  await page.fill('input.input[type="text"]', LOGIN_EMAIL);
  await page.fill('input.input[type="password"]', LOGIN_PASSWORD);

  // Submit - button has className="btn-primary w-full" with text "Se connecter"
  await page.click('button.btn-primary:has-text("Se connecter")');

  // Wait for redirect to dashboard
  await page.waitForURL('**/dashboard**', { timeout: 15000 }).catch(() => {});
  await page.waitForLoadState('networkidle');

  console.log('✅ Logged in');
}

async function capturePage(browser, pageConfig) {
  const page = await browser.newPage();
  await page.setViewportSize(VIEWPORT);

  try {
    console.log(`📸 Capturing ${pageConfig.name}...`);

    // Login first if needed
    if (pageConfig.auth) {
      await login(page);
    }

    await page.goto(pageConfig.url, { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for content
    try {
      await page.waitForSelector(pageConfig.waitFor, { timeout: 10000 });
    } catch {
      await page.waitForLoadState('domcontentloaded');
    }

    // Hide cookie banner if exists
    await page.evaluate(() => {
      const selectors = ['.cookie-banner', '#cookie-consent', '[data-testid="cookie-banner"]'];
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) el.style.display = 'none';
      }
      // Also check for dialog with cookie text
      const dialogs = document.querySelectorAll('[role="dialog"]');
      dialogs.forEach(d => {
        if (d.textContent.toLowerCase().includes('cookie')) d.style.display = 'none';
      });
    });

    // Scroll to capture full page if needed
    if (pageConfig.scroll) {
      await page.evaluate(async () => {
        await new Promise(resolve => {
          let totalHeight = 0;
          const distance = 300;
          const timer = setInterval(() => {
            window.scrollBy(0, distance);
            totalHeight += distance;
            if (totalHeight >= document.body.scrollHeight - window.innerHeight) {
              clearInterval(timer);
              window.scrollTo(0, 0);
              resolve();
            }
          }, 100);
        });
      });
      await page.waitForTimeout(500);
    }

    // Full page screenshot
    await page.screenshot({
      path: path.join(OUTPUT_DIR, `${pageConfig.name}.png`),
      fullPage: true,
      animations: 'disabled'
    });

    // Also capture viewport-only (above fold)
    await page.screenshot({
      path: path.join(OUTPUT_DIR, `${pageConfig.name}-viewport.png`),
      fullPage: false,
      animations: 'disabled'
    });

    console.log(`✅ ${pageConfig.name} done`);
  } catch (err) {
    console.error(`❌ ${pageConfig.name} failed:`, err.message);
  } finally {
    await page.close();
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  for (const pageConfig of PAGES) {
    await capturePage(browser, pageConfig);
  }

  await browser.close();
  console.log('\n✅ All screenshots saved to:', OUTPUT_DIR);
}

main().catch(console.error);