import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');
const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\7ca130ef-5e70-4578-88a2-0879acc42caa';
const PORT = 4332;

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

const VIEWPORTS = [
  { width: 320, height: 640, label: '320px' },
  { width: 375, height: 667, label: '375px' },
  { width: 390, height: 844, label: '390px' },
  { width: 430, height: 932, label: '430px' },
  { width: 768, height: 1024, label: '768px' },
  { width: 1024, height: 768, label: '1024px' },
  { width: 1366, height: 768, label: '1366px' },
  { width: 1440, height: 900, label: '1440px' },
  { width: 1920, height: 1080, label: '1920px' },
];

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
  console.log(`Server listening on port ${PORT}`);

  const browser = await puppeteer.launch({
    executablePath: findEdgeBinary(),
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  for (const vp of VIEWPORTS) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    // Capture Hero viewport
    const filename = `homepage-redesign-${vp.label}.png`;
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, filename),
      clip: { x: 0, y: 0, width: vp.width, height: Math.min(vp.height, 900) },
    });
    console.log(`Saved ${filename}`);

    // Check overflow
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    if (overflow) {
      console.error(`HORIZONTAL OVERFLOW DETECTED AT ${vp.label}!`);
    } else {
      console.log(`No overflow at ${vp.label}`);
    }
  }

  // Also capture full services section screenshot on desktop
  await page.setViewport({ width: 1440, height: 900 });
  const servicesEl = await page.$('#services');
  if (servicesEl) {
    await servicesEl.screenshot({ path: path.join(ARTIFACTS_DIR, 'homepage-services-pathways.png') });
    console.log('Saved homepage-services-pathways.png');
  }

  await browser.close();
  server.close();
  console.log('All responsive viewport checks complete!');
}

main().catch(console.error);
