import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\7ca130ef-5e70-4578-88a2-0879acc42caa';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const DIST_DIR = path.resolve('dist');

function startServer(port = 45890) {
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
  const viewports = [320, 375, 390, 430, 768, 1024, 1366, 1440, 1920];
  const measurements = {};

  for (const width of viewports) {
    const height = width >= 1024 ? 900 : (width >= 768 ? 1024 : 800);
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle0' });

    // Capture screenshot
    const screenshotPath = path.join(ARTIFACT_DIR, `stage1-baseline-${width}px.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });

    // Measure key elements
    const metrics = await page.evaluate(() => {
      const getRect = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          left: Math.round(r.left),
          top: Math.round(r.top),
          width: Math.round(r.width),
          height: Math.round(r.height),
          scrollWidth: el.scrollWidth,
          scrollHeight: el.scrollHeight
        };
      };

      // Header
      const header = getRect('header');
      const logo = getRect('header a[href="/"]');
      const headerCta = getRect('header a[href="/contact/"]');
      
      // Hero
      const heroSection = getRect('section.bg-white.border-b');
      const heroContainer = getRect('section.bg-white.border-b > div');
      const heroH1 = getRect('section.bg-white.border-b h1');
      const heroLeftCol = getRect('section.bg-white.border-b .lg\\:col-span-7');
      const heroRightCol = getRect('section.bg-white.border-b .lg\\:col-span-5');
      const heroButtons = getRect('section.bg-white.border-b a.btn-primary');

      // Services
      const servicesSection = getRect('section#services');
      const servicesContainer = getRect('section#services > div.grid') || getRect('section#services');
      const serviceCardFirst = getRect('section#services .card-premium');

      // Destinations
      const destSection = getRect('section.bg-white.border-y');
      const destCardFirst = getRect('section.bg-white.border-y article') || getRect('section.bg-white.border-y .card-premium');
      const destImage = getRect('section.bg-white.border-y img');

      // About
      const aboutSection = getRect('section:has(#about-heading)') || getRect('section.py-12.sm\\:py-16:not(#services)');

      // Process
      const processSection = getRect('section:has(#process-heading)');

      // CTA
      const ctaSection = getRect('section:has(.bg-brand-navy)') || getRect('div.site-container .card-premium') || getRect('.bg-brand-navy.text-white.rounded-2xl');

      // Footer
      const footer = getRect('footer');

      // WhatsApp widget
      const whatsapp = getRect('#whatsapp-widget') || getRect('a[href*="whatsapp"]');

      return {
        bodyScrollWidth: document.body.scrollWidth,
        windowInnerWidth: window.innerWidth,
        header,
        logo,
        headerCta,
        heroSection,
        heroContainer,
        heroH1,
        heroLeftCol,
        heroRightCol,
        heroButtons,
        servicesSection,
        servicesContainer,
        serviceCardFirst,
        destSection,
        destCardFirst,
        destImage,
        aboutSection,
        processSection,
        ctaSection,
        footer,
        whatsapp
      };
    });

    measurements[`${width}px`] = metrics;
    console.log(`Measured ${width}px: Header height=${metrics.header?.height}px, Hero left=${metrics.heroContainer?.left}px, Services left=${metrics.servicesSection?.left}px`);
  }

  fs.writeFileSync(
    path.join(ARTIFACT_DIR, 'stage1-measurements.json'),
    JSON.stringify(measurements, null, 2)
  );

  await browser.close();
  server.close();
  console.log('Stage 1 measurement complete! Saved to stage1-measurements.json');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
