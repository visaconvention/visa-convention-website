import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\7ca130ef-5e70-4578-88a2-0879acc42caa';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const DIST_DIR = path.resolve('dist');

// Simple static server for dist
function startServer(port = 45782) {
  const mimeTypes = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2'
  };

  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath.endsWith('/')) reqPath += 'index.html';
    if (!path.extname(reqPath)) reqPath += '/index.html';

    const filePath = path.join(DIST_DIR, reqPath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  });

  return new Promise((resolve) => {
    server.listen(port, () => resolve({ server, port }));
  });
}

async function run() {
  const { server, port } = await startServer();
  console.log(`Server started on http://localhost:${port}`);

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const viewports = [
    { name: 'desktop-1440px', width: 1440, height: 900 },
    { name: 'laptop-1024px', width: 1024, height: 768 },
    { name: 'tablet-768px', width: 768, height: 1024 },
    { name: 'mobile-390px', width: 390, height: 844 },
    { name: 'mobile-320px', width: 320, height: 568 }
  ];

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
    await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle0' });

    // Full page screenshot
    const fullPath = path.join(ARTIFACT_DIR, `audit-post-${vp.name}-full.png`);
    await page.screenshot({ path: fullPath, fullPage: true });
    console.log(`Saved: audit-post-${vp.name}-full.png`);

    // Viewport fold screenshot
    const foldPath = path.join(ARTIFACT_DIR, `audit-post-${vp.name}-fold.png`);
    await page.screenshot({ path: foldPath, fullPage: false });
    console.log(`Saved: audit-post-${vp.name}-fold.png`);
  }

  // Also capture isolated section screenshots on Desktop (1440px)
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle0' });

  // 1. Hero Section
  const heroEl = await page.$('section.bg-white.border-b');
  if (heroEl) {
    await heroEl.screenshot({ path: path.join(ARTIFACT_DIR, 'audit-section-hero.png') });
    console.log('Saved: audit-section-hero.png');
  }

  // 2. Services Section
  const servicesEl = await page.$('section#services');
  if (servicesEl) {
    await servicesEl.screenshot({ path: path.join(ARTIFACT_DIR, 'audit-section-services.png') });
    console.log('Saved: audit-section-services.png');
  }

  // 3. Destinations & University shortcut Section
  const destEl = await page.$('section.bg-white.border-y');
  if (destEl) {
    await destEl.screenshot({ path: path.join(ARTIFACT_DIR, 'audit-section-destinations.png') });
    console.log('Saved: audit-section-destinations.png');
  }

  // 4. About Section
  const aboutEl = await page.$('section.py-12.sm\\:py-16.max-w-\\[1200px\\]');
  if (aboutEl) {
    await aboutEl.screenshot({ path: path.join(ARTIFACT_DIR, 'audit-section-about.png') });
    console.log('Saved: audit-section-about.png');
  }

  await browser.close();
  server.close();
  console.log('Visual audit capture complete!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
