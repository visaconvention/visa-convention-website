import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

// Simple static server for dist
const PORT = 4328;
const DIST_DIR = path.resolve('dist');

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  const filePath = path.join(DIST_DIR, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml'
    };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, async () => {
  console.log(`Test static server running at http://localhost:${PORT}`);

  const edgePaths = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  const executablePath = edgePaths.find(p => fs.existsSync(p));

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const artifactDir = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\7ca130ef-5e70-4578-88a2-0879acc42caa';

  // 1. Desktop 1366px Study Abroad Directory
  await page.setViewport({ width: 1366, height: 900 });
  await page.goto(`http://localhost:${PORT}/study-abroad/`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(artifactDir, 'study-abroad-directory-desktop-1366px.png'), fullPage: false });
  console.log('✓ Captured study-abroad-directory-desktop-1366px.png');

  // Verify cards grid
  const cardStats = await page.evaluate(() => {
    const cards = document.querySelectorAll('[data-country-card]');
    const images = document.querySelectorAll('[data-country-card] img');
    return {
      totalCards: cards.length,
      cardsWithImages: images.length,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  });
  console.log(`Cards audit: Total=${cardStats.totalCards}, Images=${cardStats.cardsWithImages}, Desktop Overflow=${cardStats.overflow}`);

  // 2. Mobile 390px Study Abroad Directory
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(`http://localhost:${PORT}/study-abroad/`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(artifactDir, 'study-abroad-directory-mobile-390px.png'), fullPage: false });
  console.log('✓ Captured study-abroad-directory-mobile-390px.png');

  const mobileOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  console.log(`Mobile 390px Overflow: ${mobileOverflow}`);

  // 3. Country Profile Hero (Canada) Desktop
  await page.setViewport({ width: 1366, height: 900 });
  await page.goto(`http://localhost:${PORT}/study-abroad/canada/`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(artifactDir, 'study-abroad-country-profile-desktop.png'), fullPage: false });
  console.log('✓ Captured study-abroad-country-profile-desktop.png');

  // 4. Country Profile Hero (Germany) Mobile
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(`http://localhost:${PORT}/study-abroad/germany/`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(artifactDir, 'study-abroad-country-profile-mobile.png'), fullPage: false });
  console.log('✓ Captured study-abroad-country-profile-mobile.png');

  await browser.close();
  server.close(() => {
    console.log('Server closed. Verification finished!');
  });
});
