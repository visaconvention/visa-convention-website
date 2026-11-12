import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 4329;
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
  console.log(`Optimization test server active at http://localhost:${PORT}`);

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

  const viewports = [
    { name: '320px', width: 320, height: 640 },
    { name: '375px', width: 375, height: 667 },
    { name: '390px', width: 390, height: 844 },
    { name: '430px', width: 430, height: 932 },
    { name: '768px', width: 768, height: 1024 },
    { name: '1024px', width: 1024, height: 768 },
    { name: '1366px', width: 1366, height: 900 },
    { name: '1440px', width: 1440, height: 900 },
    { name: '1920px', width: 1920, height: 1080 }
  ];

  console.log('\n--- 9-VIEWPORT RESPONSIVE AUDIT ---');
  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    const overflowCheck = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
      };
    });

    const isOk = !overflowCheck.hasOverflow;
    console.log(`Viewport ${vp.name.padEnd(7)}: client=${overflowCheck.clientWidth}px, scroll=${overflowCheck.scrollWidth}px -> ${isOk ? '✅ 0px Overflow' : '❌ OVERFLOW'}`);

    // Capture screenshot
    const screenshotPath = path.join(artifactDir, `home-opt-${vp.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
  }

  // Component closeups at 1366px
  await page.setViewport({ width: 1366, height: 900 });
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

  // Services section
  const servicesEl = await page.$('#services');
  if (servicesEl) {
    await servicesEl.screenshot({ path: path.join(artifactDir, 'home-opt-services.png') });
    console.log('✓ Captured home-opt-services.png');
  }

  // Process section
  const processSection = await page.evaluate(() => {
    const el = document.querySelectorAll('section')[3];
    return el ? true : false;
  });
  if (processSection) {
    console.log('✓ Process section verified');
  }

  await browser.close();
  server.close(() => {
    console.log('\nServer closed. 9-viewport audit complete!');
  });
});
