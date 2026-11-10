import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\7ca130ef-5e70-4578-88a2-0879acc42caa';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const DIST_DIR = path.resolve('dist');
const PORT = 4334;

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

function startServer() {
  const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0];
    if (reqUrl.endsWith('/')) reqUrl += 'index.html';
    let filePath = path.join(DIST_DIR, reqUrl);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'text/plain' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  return new Promise((resolve) => {
    server.listen(PORT, () => {
      resolve(server);
    });
  });
}

async function run() {
  const server = await startServer();
  console.log(`Server started on port ${PORT}`);

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
  });

  const page = await browser.newPage();

  // 1. Desktop Home Redesign (1440px)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ux-redesign-home-desktop.png') });
  console.log('Saved ux-redesign-home-desktop.png');

  // 2. Mobile Home Redesign (390px)
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ux-redesign-home-mobile.png') });
  console.log('Saved ux-redesign-home-mobile.png');

  // 3. Mobile Navigation Drawer Opened
  const menuBtn = await page.$('#open-mobile-menu-btn');
  if (menuBtn) {
    await menuBtn.click();
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ux-redesign-mobile-drawer.png') });
    console.log('Saved ux-redesign-mobile-drawer.png');
  }

  // 4. Desktop Study Abroad
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:${PORT}/study-abroad/`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ux-redesign-study-abroad.png') });
  console.log('Saved ux-redesign-study-abroad.png');

  // 5. Desktop University Directory with Active Filter Chips (filter to Germany)
  await page.goto(`http://localhost:${PORT}/universities/?country=germany`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ux-redesign-universities-filtered.png') });
  console.log('Saved ux-redesign-universities-filtered.png');

  // 6. Contact Page with Pre-Selected Context
  await page.goto(`http://localhost:${PORT}/contact/?service=study-visa&country=germany&university=Technical+University+of+Munich`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ux-redesign-contact-with-context.png') });
  console.log('Saved ux-redesign-contact-with-context.png');

  await browser.close();
  server.close();
  console.log('Redesign screenshot capture complete!');
}

run().catch(console.error);
