import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');
const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\7ca130ef-5e70-4578-88a2-0879acc42caa';
const PORT = 4336;

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
  { name: '390px', width: 390, height: 844 },
  { name: '768px', width: 768, height: 1024 },
  { name: '1366px', width: 1366, height: 768 },
  { name: '1920px', width: 1920, height: 1080 },
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

  const edgeBin = findEdgeBinary();
  const browser = await puppeteer.launch({
    executablePath: edgeBin,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  console.log('\n--- Capturing Homepage at Audit Viewports (390px, 768px, 1366px, 1920px) ---');
  for (const vp of VIEWPORTS) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    const ssPath = path.join(ARTIFACTS_DIR, `audit-home-${vp.name}-full.png`);
    await page.screenshot({ path: ssPath, fullPage: true });
    console.log(`  Captured audit-home-${vp.name}-full.png`);
  }

  // Also capture key service pages for baseline visual inspection
  const pagesToCapture = [
    { url: '/study-abroad/', name: 'study-abroad' },
    { url: '/universities/', name: 'universities' },
    { url: '/services/tourist-visa/', name: 'tourist-visa' },
    { url: '/services/work-visa/', name: 'work-visa' },
    { url: '/services/flight-booking/', name: 'flight-booking' },
    { url: '/services/mbbs/', name: 'mbbs' },
    { url: '/services/phd/', name: 'phd' },
    { url: '/about/', name: 'about' },
    { url: '/contact/', name: 'contact' },
  ];

  await page.setViewport({ width: 1366, height: 768 });
  for (const p of pagesToCapture) {
    await page.goto(`http://localhost:${PORT}${p.url}`, { waitUntil: 'networkidle0' });
    const ssPath = path.join(ARTIFACTS_DIR, `audit-${p.name}-1366px.png`);
    await page.screenshot({ path: ssPath, fullPage: false });
    console.log(`  Captured audit-${p.name}-1366px.png`);
  }

  await browser.close();
  server.close();
  console.log('\nAudit screenshots successfully captured.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
