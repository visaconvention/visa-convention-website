/**
 * Capture before/after screenshots for the v1.11.0 audit report:
 * - Homepage hero (desktop & mobile)
 * - Homepage USA destination card
 * - USA country detail page
 * - Countries directory showing USA
 * Run: node scripts/capture-v1110-screenshots.js
 */
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = 'http://localhost:4324';
const OUT_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\7ca130ef-5e70-4578-88a2-0879acc42caa';

async function capture(page, filePath, clip = null) {
  const opts = { path: filePath, type: 'png' };
  if (clip) opts.clip = clip;
  await page.screenshot(opts);
  console.log(`📸 ${path.basename(filePath)}`);
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    const page = await browser.newPage();

    // ── 1. Homepage hero at 1440px ──────────────────────────────────────────────
    await page.setViewport({ width: 1440, height: 820, deviceScaleFactor: 1 });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    // Full viewport fold (above-the-fold)
    await capture(page, `${OUT_DIR}/v1110-hero-1440px-fold.png`, { x: 0, y: 0, width: 1440, height: 820 });

    // Hero section specifically
    const heroEl = await page.$('section');
    if (heroEl) {
      const box = await heroEl.boundingBox();
      if (box) await capture(page, `${OUT_DIR}/v1110-hero-section-1440px.png`, { x: box.x, y: box.y, width: box.width, height: box.height });
    }

    // ── 2. Homepage hero at 390px mobile ────────────────────────────────────────
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await capture(page, `${OUT_DIR}/v1110-hero-390px-fold.png`, { x: 0, y: 0, width: 390, height: 844 });

    // ── 3. USA country card on homepage destinations section ─────────────────────
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    // Find USA card
    const usaCard = await page.evaluateHandle(() => {
      const cards = Array.from(document.querySelectorAll('[data-country-card]'));
      return cards.find(c => c.getAttribute('data-country-name') === 'united states') || cards.find(c => c.textContent.includes('United States')) || null;
    });
    if (usaCard && usaCard.asElement()) {
      const box = await usaCard.asElement().boundingBox();
      if (box) await capture(page, `${OUT_DIR}/v1110-usa-homepage-card.png`, { x: box.x - 8, y: box.y - 8, width: box.width + 16, height: box.height + 16 });
    }

    // ── 4. Countries directory at 1440px ────────────────────────────────────────
    await page.goto(`${BASE_URL}/study-abroad/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await capture(page, `${OUT_DIR}/v1110-countries-dir-1440px.png`, { x: 0, y: 0, width: 1440, height: 900 });

    // ── 5. USA country detail page ───────────────────────────────────────────────
    await page.goto(`${BASE_URL}/study-abroad/usa/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await capture(page, `${OUT_DIR}/v1110-usa-detail-hero.png`, { x: 0, y: 0, width: 1440, height: 820 });

    // ── 6. Full homepage at 1366px ───────────────────────────────────────────────
    await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 1 });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await capture(page, `${OUT_DIR}/v1110-homepage-1366px-fold.png`, { x: 0, y: 0, width: 1366, height: 768 });

    // Measure hero height
    const heroMetrics = await page.evaluate(() => {
      const hero = document.querySelector('section');
      if (!hero) return null;
      const r = hero.getBoundingClientRect();
      const h1 = hero.querySelector('h1');
      const h1Styles = h1 ? window.getComputedStyle(h1) : null;
      return {
        heroHeight: Math.round(r.height),
        heroTop: Math.round(r.top),
        heroBottom: Math.round(r.bottom),
        h1FontSize: h1Styles ? h1Styles.fontSize : 'N/A',
        h1LineHeight: h1Styles ? h1Styles.lineHeight : 'N/A',
      };
    });
    console.log('\n📐 Hero metrics at 1366px:', heroMetrics);

    console.log('\n✅ All screenshots captured successfully!');

  } finally {
    await browser.close();
  }
}

run().catch(e => { console.error('Screenshot error:', e); process.exit(1); });
