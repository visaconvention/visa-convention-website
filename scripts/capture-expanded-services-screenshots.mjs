import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');
const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\7ca130ef-5e70-4578-88a2-0879acc42caa';
const PORT = 4330;

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
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

async function main() {
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
  console.log(`Test server running on port ${PORT}`);

  const browser = await puppeteer.launch({
    executablePath: findEdgeBinary(),
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  // 1. Tourist Visa Desktop (1440px)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:${PORT}/services/tourist-visa/`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'tourist-visa-desktop-hero.png'), clip: { x: 0, y: 0, width: 1440, height: 900 } });
  console.log('Saved tourist-visa-desktop-hero.png');

  // Screenshot destinations section
  const destEl = await page.$('#destinations');
  if (destEl) {
    await destEl.screenshot({ path: path.join(ARTIFACTS_DIR, 'tourist-visa-destinations.png') });
    console.log('Saved tourist-visa-destinations.png');
  }

  // Screenshot applicant categories section
  const catEl = await page.$('#applicant-categories');
  if (catEl) {
    await catEl.screenshot({ path: path.join(ARTIFACTS_DIR, 'tourist-visa-categories.png') });
    console.log('Saved tourist-visa-categories.png');
  }

  // Screenshot special guidance section
  const guidanceEl = await page.$('#specific-guidance');
  if (guidanceEl) {
    await guidanceEl.screenshot({ path: path.join(ARTIFACTS_DIR, 'tourist-visa-guidance.png') });
    console.log('Saved tourist-visa-guidance.png');
  }

  // 2. Tourist Visa Mobile (390px)
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(`http://localhost:${PORT}/services/tourist-visa/`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'tourist-visa-mobile.png'), clip: { x: 0, y: 0, width: 390, height: 900 } });
  console.log('Saved tourist-visa-mobile.png');

  // 3. Work Visa Desktop (1440px)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:${PORT}/services/work-visa/`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'work-visa-desktop-hero.png'), clip: { x: 0, y: 0, width: 1440, height: 900 } });
  console.log('Saved work-visa-desktop-hero.png');

  // Screenshot work destinations section
  const workDestEl = await page.$('#destinations');
  if (workDestEl) {
    await workDestEl.screenshot({ path: path.join(ARTIFACTS_DIR, 'work-visa-destinations.png') });
    console.log('Saved work-visa-destinations.png');
  }

  // Screenshot work occupations section
  const workOccEl = await page.$('#occupations');
  if (workOccEl) {
    await workOccEl.screenshot({ path: path.join(ARTIFACTS_DIR, 'work-visa-occupations.png') });
    console.log('Saved work-visa-occupations.png');
  }

  // Screenshot employment contract factors
  const contractEl = await page.$('#contract-factors');
  if (contractEl) {
    await contractEl.screenshot({ path: path.join(ARTIFACTS_DIR, 'work-visa-contract-factors.png') });
    console.log('Saved work-visa-contract-factors.png');
  }

  // 4. Work Visa Mobile (390px)
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(`http://localhost:${PORT}/services/work-visa/`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'work-visa-mobile.png'), clip: { x: 0, y: 0, width: 390, height: 900 } });
  console.log('Saved work-visa-mobile.png');

  await browser.close();
  server.close();
  console.log('All screenshots captured successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
