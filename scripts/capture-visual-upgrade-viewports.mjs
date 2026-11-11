import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');
const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\7ca130ef-5e70-4578-88a2-0879acc42caa';
const PORT = 4337;

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
  { name: '320px', width: 320, height: 640 },
  { name: '375px', width: 375, height: 667 },
  { name: '390px', width: 390, height: 844 },
  { name: '430px', width: 430, height: 932 },
  { name: '768px', width: 768, height: 1024 },
  { name: '1024px', width: 1024, height: 768 },
  { name: '1366px', width: 1366, height: 768 },
  { name: '1440px', width: 1440, height: 900 },
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

  console.log('\n--- VERIFYING REDESIGNED HOMEPAGE ACROSS 9 VIEWPORTS ---');
  let hasOverflow = false;

  for (const vp of VIEWPORTS) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    // Check horizontal overflow
    const overflow = await page.evaluate(() => {
      const docWidth = document.documentElement.scrollWidth;
      const winWidth = window.innerWidth;
      return {
        docWidth,
        winWidth,
        overflowPx: Math.max(0, docWidth - winWidth),
      };
    });

    const isOk = overflow.overflowPx <= 1;
    if (!isOk) hasOverflow = true;
    console.log(`  [${vp.name}] Width: ${vp.width}px | ScrollWidth: ${overflow.docWidth}px | Overflow: ${overflow.overflowPx}px -> ${isOk ? '✅ PASS' : '❌ FAIL'}`);

    // Capture screenshot
    const ssPath = path.join(ARTIFACTS_DIR, `visual-upgrade-home-${vp.name}.png`);
    await page.screenshot({ path: ssPath, fullPage: vp.width <= 768 });
  }

  // Specifically capture the new 6-card service section on desktop and mobile
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:${PORT}/#services`, { waitUntil: 'networkidle0' });
  const servicesEl = await page.$('#services');
  if (servicesEl) {
    await servicesEl.screenshot({ path: path.join(ARTIFACTS_DIR, 'services-grid-desktop.png') });
    console.log('  Captured services-grid-desktop.png');
  }

  await page.setViewport({ width: 390, height: 844 });
  await page.goto(`http://localhost:${PORT}/#services`, { waitUntil: 'networkidle0' });
  const servicesMobileEl = await page.$('#services');
  if (servicesMobileEl) {
    await servicesMobileEl.screenshot({ path: path.join(ARTIFACTS_DIR, 'services-grid-mobile.png') });
    console.log('  Captured services-grid-mobile.png');
  }

  await browser.close();
  server.close();

  if (hasOverflow) {
    console.error('\n❌ Horizontal overflow detected!');
    process.exit(1);
  } else {
    console.log('\n✅ 100% RESPONSIVE: ZERO HORIZONTAL OVERFLOW ACROSS ALL 9 VIEWPORTS!');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
