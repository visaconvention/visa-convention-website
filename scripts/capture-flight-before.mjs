import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');
const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\7ca130ef-5e70-4578-88a2-0879acc42caa';
const PORT = 4333;

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
  console.log(`Server running on port ${PORT}`);

  const edgeBin = findEdgeBinary();
  const browser = await puppeteer.launch({
    executablePath: edgeBin,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // 1. Flight Booking Desktop Before
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:${PORT}/services/flight-booking/`, { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'flight-booking-before-desktop.png'),
    fullPage: true,
  });
  console.log('Captured flight-booking-before-desktop.png');

  // 2. Flight Booking Mobile Before
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(`http://localhost:${PORT}/services/flight-booking/`, { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'flight-booking-before-mobile.png'),
    fullPage: true,
  });
  console.log('Captured flight-booking-before-mobile.png');

  await browser.close();
  server.close();
  console.log('Done capturing before screenshots.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
