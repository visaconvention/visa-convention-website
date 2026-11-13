import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\5db0c23b-424d-42d8-acd3-62fb5a754759\\screenshots';

const server = http.createServer((req, res) => {
  let cleanUrl = decodeURIComponent(req.url.split('?')[0]);
  if (cleanUrl.endsWith('/')) cleanUrl += 'index.html';
  let file = path.join(DIST, cleanUrl);
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

server.listen(4339, async () => {
  try {
    const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: true });
    const page = await browser.newPage();
    
    // 1. Desktop Services Grid (1440px)
    await page.setViewport({ width: 1440, height: 1100 });
    await page.goto('http://localhost:4339/', { waitUntil: 'networkidle0' });
    const servicesEl = await page.$('#services');
    if (servicesEl) {
      await page.evaluate(() => document.getElementById('services')?.scrollIntoView());
      await new Promise(r => setTimeout(r, 400));
      await servicesEl.screenshot({ path: path.join(ARTIFACTS_DIR, 'homepage-services-grid-desktop-1440px.png') });
      console.log('Captured homepage-services-grid-desktop-1440px.png');
    }

    // 2. Mobile Service Card 2 (375px)
    await page.setViewport({ width: 375, height: 750, isMobile: true, hasTouch: true });
    await page.goto('http://localhost:4339/', { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      const cards = document.querySelectorAll('#services .group');
      if (cards.length > 1) {
        cards[1].scrollIntoView();
      }
    });
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'homepage-additional-services-card-mobile-375px.png') });
    console.log('Captured homepage-additional-services-card-mobile-375px.png');

    // 3. Dedicated Additional Services Page Desktop (1440px)
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://localhost:4339/services/additional-services/', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'additional-services-page-desktop-1440px.png') });
    console.log('Captured additional-services-page-desktop-1440px.png');

    // 4. Study Abroad Dropdown Mega-Menu showing Find Universities
    await page.goto('http://localhost:4339/', { waitUntil: 'networkidle0' });
    const studyAbroadBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('nav button'));
      return btns.find(b => b.textContent && b.textContent.includes('Study Abroad'));
    });
    if (studyAbroadBtn) {
      await studyAbroadBtn.hover();
      await new Promise(r => setTimeout(r, 500));
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'study-abroad-nav-dropdown-find-universities.png') });
      console.log('Captured study-abroad-nav-dropdown-find-universities.png');
    }

    await browser.close();
  } catch (err) {
    console.error('Error capturing evidence:', err);
  } finally {
    server.close();
  }
});
