import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\93dd9ae5-292a-4677-9731-9efc41a7f30f\\evidence';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const DIST_DIR = path.resolve('dist');
const PORT = 4325;

if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
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
      console.log(`Server running at http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

async function capture() {
  const server = await startServer();
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  const pages = [
    { name: 'tourist-visa', path: '/services/tourist-visa/' },
    { name: 'work-visa', path: '/services/work-visa/' }
  ];

  const viewports = [
    { name: 'mobile', width: 390, height: 844 },
    { name: 'desktop', width: 1440, height: 900 }
  ];

  const baselineMetrics = {};

  for (const p of pages) {
    baselineMetrics[p.name] = {};
    for (const v of viewports) {
      await page.setViewport({ width: v.width, height: v.height });
      await page.goto(`http://localhost:${PORT}${p.path}`, { waitUntil: 'networkidle0' });

      const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      baselineMetrics[p.name][v.name] = scrollHeight;

      const screenshotPath = path.join(ARTIFACTS_DIR, `before-${p.name}-${v.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`Saved baseline: ${screenshotPath} (Height: ${scrollHeight}px)`);
    }
  }

  fs.writeFileSync(
    path.join(ARTIFACTS_DIR, 'baseline-metrics.json'),
    JSON.stringify(baselineMetrics, null, 2)
  );

  await browser.close();
  server.close();
  console.log('Baseline capture complete!');
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
