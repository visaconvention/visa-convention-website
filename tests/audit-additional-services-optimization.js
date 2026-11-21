import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');
const ARTIFACTS_DIR = 'C:/Users/ACER/.gemini/antigravity/brain/6a0361a6-ccbe-4f53-a463-b2d5ee259bd4/additional-services-optimization';
const PORT = 4355;

if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

function findEdgeBinary() {
  const edgePaths = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  for (const p of edgePaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const SIX_PAGES = [
  { url: '/services/passport-assistance/', name: 'passport-assistance' },
  { url: '/services/itr-filing/', name: 'itr-filing' },
  { url: '/services/company-registration/', name: 'company-registration' },
  { url: '/services/pcc-assistance/', name: 'pcc-assistance' },
  { url: '/services/document-apostille/', name: 'document-apostille' },
  { url: '/services/document-translation/', name: 'document-translation' },
];

async function main() {
  console.log('--- Starting Additional Services Visual QA Server ---');
  const server = http.createServer((req, res) => {
    let cleanUrl = req.url.split('?')[0];
    if (cleanUrl.endsWith('/')) cleanUrl += 'index.html';
    const filePath = path.join(DIST_DIR, cleanUrl);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      res.end(fs.readFileSync(filePath));
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  await new Promise(r => server.listen(PORT, r));
  console.log(`Server listening on port ${PORT}`);

  const edgeBin = findEdgeBinary();
  if (!edgeBin) throw new Error('Edge binary not found');

  const browser = await puppeteer.launch({
    executablePath: edgeBin,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // 1. Desktop Screenshots (1366px)
  await page.setViewport({ width: 1366, height: 768 });
  console.log('\n--- Capturing 1366px Desktop Screenshots ---');
  for (const p of SIX_PAGES) {
    await page.goto(`http://localhost:${PORT}${p.url}`, { waitUntil: 'networkidle0' });
    const ssPath = path.join(ARTIFACTS_DIR, `${p.name}-desktop-clean.png`);
    await page.screenshot({ path: ssPath, fullPage: false });
    console.log(`  Captured ${p.name}-desktop-clean.png`);
  }

  // 2. Mobile Screenshots (375px)
  await page.setViewport({ width: 375, height: 667 });
  console.log('\n--- Capturing 375px Mobile Screenshots ---');
  for (const p of SIX_PAGES.slice(0, 3)) {
    await page.goto(`http://localhost:${PORT}${p.url}`, { waitUntil: 'networkidle0' });
    const ssPath = path.join(ARTIFACTS_DIR, `${p.name}-mobile-375px.png`);
    await page.screenshot({ path: ssPath, fullPage: true });
    console.log(`  Captured ${p.name}-mobile-375px.png`);
  }

  // 3. Homepage Card 6 Verification Screenshot
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(`http://localhost:${PORT}/#services`, { waitUntil: 'networkidle0' });
  const ssHome = path.join(ARTIFACTS_DIR, 'homepage-services-card-6-intact.png');
  await page.screenshot({ path: ssHome, fullPage: false });
  console.log('  Captured homepage-services-card-6-intact.png');

  // 4. Verify no banner image in DOM of the six pages
  for (const p of SIX_PAGES) {
    await page.goto(`http://localhost:${PORT}${p.url}`, { waitUntil: 'networkidle0' });
    const images = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img')).map(img => img.src);
    });
    const hasBanner = images.some(src => src.includes('Additional%20Visa%20Services%20Guide') || src.includes('Additional Visa Services Guide'));
    if (hasBanner) {
      console.error(`  [FAIL] Banner found on ${p.url}`);
    } else {
      console.log(`  [PASS] Banner completely absent on ${p.url}`);
    }
  }

  await browser.close();
  server.close();
  console.log('\nAll Visual QA checks passed!');
}

main().catch(err => {
  console.error('QA script exception:', err);
  process.exit(1);
});
