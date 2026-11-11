/**
 * Final hero proportion verification after mobile refinements.
 * Run: node scripts/verify-hero-final.mjs
 */
import puppeteer from 'puppeteer-core';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE = 'http://localhost:4326';
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

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: true,
    args: ['--no-sandbox'],
  });

  const results = [];

  try {
    const page = await browser.newPage();

    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.w, height: vp.h, deviceScaleFactor: 1 });
      await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 500));

      const m = await page.evaluate(() => {
        const hero = document.querySelector('section');
        if (!hero) return null;
        const heroR = hero.getBoundingClientRect();
        const img = hero.querySelector('img');
        const imgR = img ? img.getBoundingClientRect() : null;
        const h1 = hero.querySelector('h1');
        const h1Fs = h1 ? window.getComputedStyle(h1).fontSize : 'N/A';
        const overflow = document.documentElement.scrollWidth > window.innerWidth;
        return {
          heroH: Math.round(heroR.height),
          imgW: imgR ? Math.round(imgR.width) : 'N/A',
          imgH: imgR ? Math.round(imgR.height) : 'N/A',
          h1Fs,
          overflow,
        };
      });

      results.push({ vp: vp.label, ...m });

      await page.screenshot({
        path: `${OUT}\\final-hero-${vp.label}.png`,
        clip: { x: 0, y: 0, width: vp.w, height: vp.h },
      });

      const status = m.overflow ? '⚠️ OVERFLOW' : '✅';
      console.log(`${status} ${vp.label.padEnd(6)}: hero=${m.heroH}px, img=${m.imgW}×${m.imgH}, h1=${m.h1Fs}`);
    }

    console.log('\n── Final Summary ───────────────────────────────────────');
    console.log('VP      | HeroH | ImgW×ImgH   | H1 size  | Overflow');
    console.log('--------|-------|-------------|----------|--------');
    for (const r of results) {
      console.log(`${r.vp.padEnd(7)} | ${String(r.heroH).padEnd(5)} | ${(r.imgW+'×'+r.imgH).padEnd(11)} | ${r.h1Fs.padEnd(8)} | ${r.overflow ? 'YES ⚠️' : 'No ✅'}`);
    }

  } finally {
    await browser.close();
  }
}

run().catch(e => { console.error(e); process.exit(1); });
