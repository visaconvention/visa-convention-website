import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');
const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\7ca130ef-5e70-4578-88a2-0879acc42caa';
const PORT = 4335;

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
  console.log(`Server running on port ${PORT}`);

  const edgeBin = findEdgeBinary();
  const browser = await puppeteer.launch({
    executablePath: edgeBin,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  console.log('\n--- VERIFYING FLIGHT BOOKING PAGE ACROSS 9 VIEWPORTS ---');
  let hasOverflow = false;

  for (const vp of VIEWPORTS) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto(`http://localhost:${PORT}/services/flight-booking/`, { waitUntil: 'networkidle0' });

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

    const isOk = overflow.overflowPx <= 1; // 1px sub-pixel tolerance
    if (!isOk) hasOverflow = true;
    console.log(`  [${vp.name}] Width: ${vp.width}px | ScrollWidth: ${overflow.docWidth}px | Overflow: ${overflow.overflowPx}px -> ${isOk ? '✅ PASS' : '❌ FAIL'}`);

    // Capture screenshot
    const screenshotPath = path.join(ARTIFACTS_DIR, `flight-booking-${vp.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: vp.width <= 768 });
  }

  // Also capture MBBS and PhD desktop heroes for visual report
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:${PORT}/services/mbbs/`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'mbbs-hero-desktop.png') });
  console.log('  Captured mbbs-hero-desktop.png');

  await page.goto(`http://localhost:${PORT}/services/phd/`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'phd-hero-desktop.png') });
  console.log('  Captured phd-hero-desktop.png');

  await browser.close();
  server.close();

  if (hasOverflow) {
    console.error('\n❌ Horizontal overflow detected in one or more viewports!');
    process.exit(1);
  } else {
    console.log('\n✅ 100% RESPONSIVE: ZERO HORIZONTAL OVERFLOW ACROSS ALL 9 VIEWPORTS!');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
