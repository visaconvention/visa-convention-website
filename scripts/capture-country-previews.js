import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\7ca130ef-5e70-4578-88a2-0879acc42caa';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const DIST_DIR = path.resolve('dist');
const PORT = 4323;

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

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = decodeURI(req.url.split('?')[0]);
      if (reqPath.endsWith('/')) reqPath += 'index.html';
      
      let filePath = path.join(DIST_DIR, reqPath);
      
      if (!path.extname(filePath)) {
        if (fs.existsSync(path.join(filePath, 'index.html'))) {
          filePath = path.join(filePath, 'index.html');
        } else if (fs.existsSync(filePath + '.html')) {
          filePath = filePath + '.html';
        }
      }

      fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
          return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
      });
    });

    server.listen(PORT, () => {
      console.log(`Static server running at http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

async function capture() {
  const server = await startServer();

  console.log('Launching Edge via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  const targets = [
    { url: `http://localhost:${PORT}/study-abroad/`, name: 'country-directory' },
    { url: `http://localhost:${PORT}/study-abroad/canada/`, name: 'country-canada' },
    { url: `http://localhost:${PORT}/study-abroad/germany/`, name: 'country-germany' },
  ];

  for (const t of targets) {
    console.log(`Capturing ${t.name} (Desktop 1440x900)...`);
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
    await page.goto(t.url, { waitUntil: 'networkidle0' });
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, `${t.name}-desktop.png`),
      fullPage: false,
    });

    console.log(`Capturing ${t.name} (Mobile 390x844)...`);
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    await page.goto(t.url, { waitUntil: 'networkidle0' });
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, `${t.name}-mobile.png`),
      fullPage: false,
    });

    console.log(`Capturing ${t.name} (Fullpage Desktop)...`);
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto(t.url, { waitUntil: 'networkidle0' });
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, `${t.name}-fullpage.png`),
      fullPage: true,
    });
  }

  await browser.close();
  server.close();
  console.log('All Country preview screenshots captured successfully in artifacts dir!');
}

capture().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});