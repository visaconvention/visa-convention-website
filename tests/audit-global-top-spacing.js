import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');
const ARTIFACTS_DIR = 'C:/Users/ACER/.gemini/antigravity/brain/6a0361a6-ccbe-4f53-a463-b2d5ee259bd4/top-spacing-standardization';
const PORT = 4360;

if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

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
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const VIEWPORTS = [
  { width: 320, height: 600, category: 'mobile', min: 16, max: 20 },
  { width: 360, height: 640, category: 'mobile', min: 16, max: 20 },
  { width: 375, height: 667, category: 'mobile', min: 16, max: 20 },
  { width: 390, height: 844, category: 'mobile', min: 16, max: 20 },
  { width: 430, height: 932, category: 'mobile', min: 16, max: 20 },
  { width: 768, height: 1024, category: 'tablet', min: 20, max: 24 },
  { width: 1024, height: 768, category: 'desktop', min: 24, max: 32 },
  { width: 1366, height: 768, category: 'desktop', min: 24, max: 32 },
  { width: 1440, height: 900, category: 'desktop', min: 24, max: 32 },
];

const AUDIT_ROUTES = [
  { path: '/services/additional-services/', name: 'additional-services' },
  { path: '/services/passport-assistance/', name: 'passport-assistance' },
  { path: '/services/company-registration/', name: 'company-registration' },
  { path: '/services/dummy-tickets/', name: 'dummy-tickets' },
  { path: '/services/flight-booking/', name: 'flight-booking' },
  { path: '/services/mbbs/', name: 'mbbs' },
  { path: '/services/phd/', name: 'phd' },
  { path: '/services/tourist-visa/', name: 'tourist-visa' },
  { path: '/services/work-visa/', name: 'work-visa' },
  { path: '/study-abroad/', name: 'study-abroad' },
  { path: '/study-abroad/germany/', name: 'country-germany' },
  { path: '/about/', name: 'about' },
  { path: '/contact/', name: 'contact' },
  { path: '/', name: 'homepage' },
];

async function main() {
  console.log('=== Starting Global Top Spacing Audit ===');
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

  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Test server running at http://localhost:${PORT}`);

  const edgeBin = findEdgeBinary();
  if (!edgeBin) throw new Error('Edge binary not found');

  const browser = await puppeteer.launch({
    executablePath: edgeBin,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const results = [];
  let totalChecks = 0;
  let passedChecks = 0;
  let failedChecks = 0;

  for (const route of AUDIT_ROUTES) {
    console.log(`\nAuditing route: ${route.path} (${route.name})`);
    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(`http://localhost:${PORT}${route.path}`, { waitUntil: 'networkidle0' });

      const metrics = await page.evaluate(() => {
        const header = document.querySelector('header');
        const headerBottom = header ? header.getBoundingClientRect().bottom : 0;

        // Find first visible content element inside main
        const breadcrumbNav = document.querySelector('nav[aria-label="Breadcrumb"]');
        const gapWrapper = document.querySelector('.page-header-gap');
        const firstMainChild = document.querySelector('main > *:first-child');
        
        let targetEl = null;
        let targetType = '';
        if (breadcrumbNav) {
          targetEl = breadcrumbNav;
          targetType = 'Breadcrumb';
        } else if (gapWrapper) {
          targetEl = gapWrapper.firstElementChild || gapWrapper;
          targetType = 'GapWrapperChild';
        } else if (firstMainChild) {
          // On homepage or pages without breadcrumbs, find first content element
          const heroInner = firstMainChild.querySelector('.max-w-\\[1280px\\], .max-w-4xl, h1, span, p');
          targetEl = heroInner || firstMainChild;
          targetType = 'HeroInner';
        }

        const targetTop = targetEl ? targetEl.getBoundingClientRect().top : 0;
        const gap = Math.round(targetTop - headerBottom);

        const hasHorizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;

        return {
          headerBottom,
          targetTop,
          targetType,
          gap,
          hasHorizontalOverflow,
          pageTitle: document.title,
        };
      });

      totalChecks++;
      const withinSpec = metrics.gap >= vp.min && metrics.gap <= vp.max;
      if (withinSpec && !metrics.hasHorizontalOverflow) {
        passedChecks++;
      } else {
        failedChecks++;
      }

      results.push({
        route: route.path,
        name: route.name,
        viewportWidth: vp.width,
        viewportHeight: vp.height,
        category: vp.category,
        expectedMin: vp.min,
        expectedMax: vp.max,
        measuredGap: metrics.gap,
        withinSpec,
        hasHorizontalOverflow: metrics.hasHorizontalOverflow,
        targetType: metrics.targetType,
      });

      if (!withinSpec) {
        console.warn(`  [FAIL] ${vp.width}px (${vp.category}): measured ${metrics.gap}px (expected ${vp.min}-${vp.max}px)`);
      }
    }
  }

  console.log('\n--- Capturing High-Res Verification Screenshots ---');
  // Desktop 1366px screenshots
  await page.setViewport({ width: 1366, height: 768 });
  const desktopScreenshots = [
    { url: '/services/additional-services/', filename: 'additional-services-top-spacing-desktop.png' },
    { url: '/services/passport-assistance/', filename: 'passport-assistance-top-spacing-desktop.png' },
    { url: '/', filename: 'homepage-hero-top-spacing-desktop.png' },
    { url: '/services/mbbs/', filename: 'mbbs-top-spacing-desktop.png' },
    { url: '/contact/', filename: 'contact-top-spacing-desktop.png' },
    { url: '/study-abroad/', filename: 'study-abroad-top-spacing-desktop.png' },
  ];

  for (const s of desktopScreenshots) {
    await page.goto(`http://localhost:${PORT}${s.url}`, { waitUntil: 'networkidle0' });
    const p = path.join(ARTIFACTS_DIR, s.filename);
    await page.screenshot({ path: p, clip: { x: 0, y: 0, width: 1366, height: 450 } });
    console.log(`  Saved ${s.filename}`);
  }

  // Mobile 375px screenshots
  await page.setViewport({ width: 375, height: 667 });
  const mobileScreenshots = [
    { url: '/services/additional-services/', filename: 'additional-services-top-spacing-mobile.png' },
    { url: '/services/passport-assistance/', filename: 'passport-assistance-top-spacing-mobile.png' },
    { url: '/', filename: 'homepage-hero-top-spacing-mobile.png' },
    { url: '/services/mbbs/', filename: 'mbbs-top-spacing-mobile.png' },
    { url: '/contact/', filename: 'contact-top-spacing-mobile.png' },
  ];

  for (const s of mobileScreenshots) {
    await page.goto(`http://localhost:${PORT}${s.url}`, { waitUntil: 'networkidle0' });
    const p = path.join(ARTIFACTS_DIR, s.filename);
    await page.screenshot({ path: p, clip: { x: 0, y: 0, width: 375, height: 420 } });
    console.log(`  Saved ${s.filename}`);
  }

  // Save audit results json
  const reportPath = path.join(ARTIFACTS_DIR, 'audit-results.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    totalChecks,
    passedChecks,
    failedChecks,
    summary: `${passedChecks}/${totalChecks} checks passed (${Math.round((passedChecks / totalChecks) * 100)}%)`,
    results,
  }, null, 2));

  console.log(`\n=== Spacing Audit Completed ===`);
  console.log(`Summary: ${passedChecks}/${totalChecks} checks passed (${Math.round((passedChecks / totalChecks) * 100)}%)`);
  console.log(`Results saved to: ${reportPath}`);

  await browser.close();
  server.close();

  if (failedChecks > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
