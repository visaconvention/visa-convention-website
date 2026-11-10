import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\7ca130ef-5e70-4578-88a2-0879acc42caa';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const DIST_DIR = path.resolve('dist');

function startServer(port = 45912) {
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
    await page.setViewport({ width, height, deviceScaleFactor: 2 });
    await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle0' });

    // Full page screenshot
    const fullPath = path.join(ARTIFACT_DIR, `ruthless-audit-${width}px-full.png`);
    await page.screenshot({ path: fullPath, fullPage: true });

    // Fold screenshot
    const foldPath = path.join(ARTIFACT_DIR, `ruthless-audit-${width}px-fold.png`);
    await page.screenshot({ path: foldPath, fullPage: false });

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
      const headerContainer = getRect('header .site-container');
      const logo = getRect('header a[href="/"]');
      const headerCta = getRect('header a[href="/contact/"]');
      
      // Hero
      const heroSection = getRect('section.bg-white.border-b');
      const heroContainer = getRect('section.bg-white.border-b .site-container');
      const heroH1 = getRect('section.bg-white.border-b h1');
      const heroLeftCol = getRect('section.bg-white.border-b .lg\\:col-span-7');
      const heroRightCol = getRect('section.bg-white.border-b .lg\\:col-span-5');
      const heroButtons = getRect('section.bg-white.border-b a.btn-primary');

      // Services
      const servicesSection = getRect('section#services');
      const serviceCardFirst = getRect('section#services .card-premium');

      // Destinations
      const destSection = getRect('section.bg-white.border-y');
      const destContainer = getRect('section.bg-white.border-y .site-container');
      const destCardFirst = getRect('section.bg-white.border-y .card-premium');
      const destImage = getRect('section.bg-white.border-y img');

      // About
      const aboutSection = getRect('section.py-10.sm\\:py-14.site-container:not(#services)');

      // Process
      const processSections = document.querySelectorAll('section.bg-white.border-y');
      const processSectionEl = processSections.length > 1 ? processSections[1] : null;
      const processSection = processSectionEl ? {
        left: Math.round(processSectionEl.getBoundingClientRect().left),
        top: Math.round(processSectionEl.getBoundingClientRect().top),
        width: Math.round(processSectionEl.getBoundingClientRect().width),
        height: Math.round(processSectionEl.getBoundingClientRect().height)
      } : null;
      const processCardFirst = processSectionEl?.querySelector('.card-premium') ? {
        left: Math.round(processSectionEl.querySelector('.card-premium').getBoundingClientRect().left),
        top: Math.round(processSectionEl.querySelector('.card-premium').getBoundingClientRect().top),
        width: Math.round(processSectionEl.querySelector('.card-premium').getBoundingClientRect().width),
        height: Math.round(processSectionEl.querySelector('.card-premium').getBoundingClientRect().height)
      } : null;

      // CTA
      const ctaCard = getRect('div.site-container > section.bg-brand-navy');

      // Footer
      const footer = getRect('footer');
      const footerContainer = getRect('footer .site-container');

      // WhatsApp widget
      const whatsapp = getRect('#floating-whatsapp-btn');

      return {
        bodyScrollWidth: document.body.scrollWidth,
        windowInnerWidth: window.innerWidth,
        header,
        headerContainer,
        logo,
        headerCta,
        heroSection,
        heroContainer,
        heroH1,
        heroLeftCol,
        heroRightCol,
        heroButtons,
        servicesSection,
        serviceCardFirst,
        destSection,
        destContainer,
        destCardFirst,
        destImage,
        aboutSection,
        processSection,
        processCardFirst,
        ctaCard,
        footer,
        footerContainer,
        whatsapp
      };
    });

    measurements[`${width}px`] = metrics;
    console.log(`Measured refined ${width}px:`);
    console.log(`  - Header container left: ${metrics.headerContainer?.left}px, width: ${metrics.headerContainer?.width}px`);
    console.log(`  - Hero container left: ${metrics.heroContainer?.left}px, width: ${metrics.heroContainer?.width}px`);
    console.log(`  - Services container left: ${metrics.servicesSection?.left}px, width: ${metrics.servicesSection?.width}px`);
    console.log(`  - Destinations container left: ${metrics.destContainer?.left}px, width: ${metrics.destContainer?.width}px`);
    console.log(`  - Footer container left: ${metrics.footerContainer?.left}px, width: ${metrics.footerContainer?.width}px`);
    console.log(`  - Service Card height: ${metrics.serviceCardFirst?.height}px`);
    console.log(`  - Destination Card height: ${metrics.destCardFirst?.height}px`);
  }

  // Also capture isolated section screenshots on Desktop (1366px)
  await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 2 });
  await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle0' });

  // 1. Header
  const headerEl = await page.$('header');
  if (headerEl) {
    await headerEl.screenshot({ path: path.join(ARTIFACT_DIR, 'ruthless-section-header.png') });
  }

  // 2. Hero
  const heroEl = await page.$('section.bg-white.border-b');
  if (heroEl) {
    await heroEl.screenshot({ path: path.join(ARTIFACT_DIR, 'ruthless-section-hero.png') });
  }

  // 3. Services
  const servicesEl = await page.$('section#services');
  if (servicesEl) {
    await servicesEl.screenshot({ path: path.join(ARTIFACT_DIR, 'ruthless-section-services.png') });
  }

  // 4. Destinations
  const destEl = await page.$('section.bg-white.border-y');
  if (destEl) {
    await destEl.screenshot({ path: path.join(ARTIFACT_DIR, 'ruthless-section-destinations.png') });
  }

  // 5. About
  const aboutEl = await page.$('section.py-10.sm\\:py-14.site-container:not(#services)');
  if (aboutEl) {
    await aboutEl.screenshot({ path: path.join(ARTIFACT_DIR, 'ruthless-section-about.png') });
  }

  // 6. Final CTA
  const ctaEl = await page.$('div.site-container > section.bg-brand-navy');
  if (ctaEl) {
    await ctaEl.screenshot({ path: path.join(ARTIFACT_DIR, 'ruthless-section-cta.png') });
  }

  // 7. Footer
  const footerEl = await page.$('footer');
  if (footerEl) {
    await footerEl.screenshot({ path: path.join(ARTIFACT_DIR, 'ruthless-section-footer.png') });
  }

  fs.writeFileSync(
    path.join(ARTIFACT_DIR, 'stage2-refined-measurements.json'),
    JSON.stringify(measurements, null, 2)
  );

  await browser.close();
  server.close();
  console.log('Stage 2 refined measurement complete! Saved to stage2-refined-measurements.json');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
