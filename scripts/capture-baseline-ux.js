import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\7ca130ef-5e70-4578-88a2-0879acc42caa';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const DIST_DIR = path.resolve('dist');
const PORT = 4333;

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

  // 1. Desktop Home
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ux-baseline-home-desktop.png') });
  console.log('Saved ux-baseline-home-desktop.png');

  // 2. Mobile Home
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ux-baseline-home-mobile.png') });
  console.log('Saved ux-baseline-home-mobile.png');

  // 3. Desktop Study Abroad
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:${PORT}/study-abroad/`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ux-baseline-study-abroad.png') });
  console.log('Saved ux-baseline-study-abroad.png');

  // 4. Desktop Country Page (Germany)
  await page.goto(`http://localhost:${PORT}/study-abroad/germany/`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ux-baseline-country-germany.png') });
  console.log('Saved ux-baseline-country-germany.png');

  // 5. Desktop Universities
  await page.goto(`http://localhost:${PORT}/universities/`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ux-baseline-universities.png') });
  console.log('Saved ux-baseline-universities.png');

  // 6. Desktop Services
  await page.goto(`http://localhost:${PORT}/services/`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ux-baseline-services-hub.png') });
  console.log('Saved ux-baseline-services-hub.png');

  // 7. Desktop Contact
  await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ux-baseline-contact.png') });
  console.log('Saved ux-baseline-contact.png');

  await browser.close();
  server.close();
  console.log('Baseline capture complete!');
}

run().catch(console.error);
