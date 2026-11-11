/**
 * Capture hero proportion audit screenshots across 9 viewports.
 * Also measures exact pixel dimensions of hero, image, and next section.
 * Run: node scripts/capture-hero-proportion-audit.mjs
 */
import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE = 'http://localhost:4325';
const OUT = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\7ca130ef-5e70-4578-88a2-0879acc42caa';

const VIEWPORTS = [
  { w: 320,  h: 700,  label: '320px' },
  { w: 375,  h: 812,  label: '375px' },
  { w: 390,  h: 844,  label: '390px' },
  { w: 430,  h: 932,  label: '430px' },
  { w: 768,  h: 1024, label: '768px' },
  { w: 1024, h: 768,  label: '1024px' },
  { w: 1366, h: 768,  label: '1366px' },
  { w: 1440, h: 900,  label: '1440px' },
  { w: 1920, h: 1080, label: '1920px' },
];

async function measure(page, vp) {
  return page.evaluate(() => {
    const hero = document.querySelector('section');
    if (!hero) return null;

    const heroR = hero.getBoundingClientRect();
    const img = hero.querySelector('img');
    const imgR = img ? img.getBoundingClientRect() : null;
    const h1 = hero.querySelector('h1');
    const h1Style = h1 ? window.getComputedStyle(h1) : null;
    const nextSection = hero.nextElementSibling;
    const nextR = nextSection ? nextSection.getBoundingClientRect() : null;

    // Horizontal overflow check
    const overflow = document.documentElement.scrollWidth > window.innerWidth;

    return {
      heroHeight: Math.round(heroR.height),
      heroTop: Math.round(heroR.top),
      heroBottom: Math.round(heroR.bottom),
      imgW: imgR ? Math.round(imgR.width) : 'N/A',
      imgH: imgR ? Math.round(imgR.height) : 'N/A',
      imgTop: imgR ? Math.round(imgR.top) : 'N/A',
      imgBottom: imgR ? Math.round(imgR.bottom) : 'N/A',
      spaceAboveImg: imgR ? Math.round(imgR.top - heroR.top) : 'N/A',
      spaceBelowImg: imgR ? Math.round(heroR.bottom - imgR.bottom) : 'N/A',
      h1Size: h1Style ? h1Style.fontSize : 'N/A',
      nextSectionTop: nextR ? Math.round(nextR.top) : 'N/A',
      overflow,
    };
  });
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  const results = [];

  try {
    const page = await browser.newPage();

    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.w, height: vp.h, deviceScaleFactor: 1 });
      await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 600));

      const m = await measure(page, vp);
      results.push({ vp: vp.label, ...m });

      // Fold screenshot (above-the-fold only)
      const name = `hero-prop-${vp.label}-fold.png`;
      await page.screenshot({
        path: `${OUT}\\${name}`,
        clip: { x: 0, y: 0, width: vp.w, height: vp.h },
      });
      console.log(`📸 ${name}  hero=${m?.heroHeight}px  img=${m?.imgW}×${m?.imgH}  overflow=${m?.overflow}`);
    }

    console.log('\n── Dimension Table ──────────────────────────────────────────────');
    console.log('VP      | HeroH | ImgW  | ImgH  | AboveImg | BelowImg | H1px  | NextTop | Overflow');
    console.log('--------|-------|-------|-------|----------|----------|-------|---------|--------');
    for (const r of results) {
      console.log(
        `${r.vp.padEnd(7)} | ${String(r.heroHeight).padEnd(5)} | ${String(r.imgW).padEnd(5)} | ${String(r.imgH).padEnd(5)} | ${String(r.spaceAboveImg).padEnd(8)} | ${String(r.spaceBelowImg).padEnd(8)} | ${String(r.h1Size).padEnd(5)} | ${String(r.nextSectionTop).padEnd(7)} | ${r.overflow}`
      );
    }

  } finally {
    await browser.close();
  }
}

run().catch(e => { console.error(e); process.exit(1); });
