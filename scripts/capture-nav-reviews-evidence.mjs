import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\5db0c23b-424d-42d8-acd3-62fb5a754759\\screenshots';

const server = http.createServer((req, res) => {
  let file = path.join(DIST, req.url === '/' ? 'index.html' : req.url);
  if (!path.extname(file)) {
    if (fs.existsSync(file + '.html')) file += '.html';
    else if (fs.existsSync(path.join(file, 'index.html'))) file = path.join(file, 'index.html');
  }
  if (fs.existsSync(file) && fs.statSync(file).isFile()) {
    const ext = path.extname(file);
    const m = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' }[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': m });
    fs.createReadStream(file).pipe(res);
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(4337, async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: true });
  const page = await browser.newPage();
  
  // 1. Desktop Nav Header at 1440px
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:4337/', { waitUntil: 'networkidle0' });
  const headerEl = await page.$('header');
  if (headerEl) {
    await headerEl.screenshot({ path: path.join(ARTIFACTS_DIR, 'nav-desktop-rebalanced-1440px.png') });
  }

  // 2. Mobile Nav Drawer open at 375px
  await page.setViewport({ width: 375, height: 750, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:4337/', { waitUntil: 'networkidle0' });
  await page.click('#open-mobile-menu-btn');
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'nav-mobile-drawer-clean-375px.png') });

  // 3. Desktop Reviews Auto-Scroll Section
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:4337/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.getElementById('reviews-section')?.scrollIntoView());
  await new Promise(r => setTimeout(r, 500));
  const reviewsEl = await page.$('#reviews-section');
  if (reviewsEl) {
    await reviewsEl.screenshot({ path: path.join(ARTIFACTS_DIR, 'reviews-autoscroll-desktop-1440px.png') });
  }

  // 4. Mobile Reviews Section
  await page.setViewport({ width: 375, height: 750, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:4337/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.getElementById('reviews-section')?.scrollIntoView());
  await new Promise(r => setTimeout(r, 500));
  const reviewsMobileEl = await page.$('#reviews-section');
  if (reviewsMobileEl) {
    await reviewsMobileEl.screenshot({ path: path.join(ARTIFACTS_DIR, 'reviews-autoscroll-mobile-375px.png') });
  }

  console.log('All verification screenshots captured.');
  await browser.close();
  server.close();
});
