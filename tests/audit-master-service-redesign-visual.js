import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');
const ARTIFACTS_DIR = 'C:/Users/ACER/.gemini/antigravity/brain/6a0361a6-ccbe-4f53-a463-b2d5ee259bd4/master-service-page-redesign';
const PORT = 4348;

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
  { name: '320px', width: 320, height: 640 },
  { name: '360px', width: 360, height: 740 },
  { name: '375px', width: 375, height: 667 },
  { name: '390px', width: 390, height: 844 },
  { name: '430px', width: 430, height: 932 },
  { name: '768px', width: 768, height: 1024 },
  { name: '1024px', width: 1024, height: 768 },
  { name: '1366px', width: 1366, height: 768 },
  { name: '1440px', width: 1440, height: 900 },
];

const PAGES_TO_TEST = [
  { url: '/services/dummy-tickets/', name: 'dummy-tickets' },
  { url: '/services/confirmed-flight-tickets/', name: 'confirmed-flight-tickets' },
  { url: '/services/passport-assistance/', name: 'passport-assistance' },
  { url: '/services/itr-filing/', name: 'itr-filing' },
  { url: '/services/company-registration/', name: 'company-registration' },
  { url: '/services/pcc-assistance/', name: 'pcc-assistance' },
  { url: '/services/document-apostille/', name: 'document-apostille' },
  { url: '/services/document-translation/', name: 'document-translation' },
  { url: '/services/flight-booking/', name: 'flight-booking' },
  { url: '/services/additional-services/', name: 'additional-services' },
  { url: '/services/phd/', name: 'phd' },
  { url: '/services/mbbs/', name: 'mbbs' },
  { url: '/about/', name: 'about' },
];

async function main() {
  console.log('--- Starting Visual & Mobile-First QA Server ---');
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

  await new Promise(r => server.listen(PORT, r));
  console.log(`Server listening on port ${PORT}`);

  const edgeBin = findEdgeBinary();
  if (!edgeBin) throw new Error('Edge binary not found');

  const browser = await puppeteer.launch({
    executablePath: edgeBin,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  const auditResults = {
    viewportsTested: VIEWPORTS.map(v => v.name),
    pagesTested: PAGES_TO_TEST.map(p => p.url),
    overflowChecks: [],
    screenshotsCaptured: [],
    formChecks: [],
    removalsVerified: {},
  };

  // 1. Audit Horizontal Overflow across all viewports for key redesigned pages
  console.log('\n--- 1. Testing Horizontal Overflows across 9 Viewports ---');
  for (const vp of VIEWPORTS) {
    await page.setViewport({ width: vp.width, height: vp.height });
    for (const p of PAGES_TO_TEST.slice(0, 8)) {
      await page.goto(`http://localhost:${PORT}${p.url}`, { waitUntil: 'networkidle0' });
      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.offsetWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const bodyScrollWidth = document.body.scrollWidth;
        const maxScroll = Math.max(scrollWidth, bodyScrollWidth);
        const hasOverflow = maxScroll > docWidth + 1;
        return { docWidth, maxScroll, hasOverflow };
      });

      const checkKey = `${p.name} @ ${vp.name}`;
      if (overflow.hasOverflow) {
        console.error(`  [OVERFLOW FAIL] ${checkKey}: docWidth=${overflow.docWidth}, maxScroll=${overflow.maxScroll}`);
      } else {
        // ok
      }
      auditResults.overflowChecks.push({ check: checkKey, ...overflow, pass: !overflow.hasOverflow });
    }
  }

  const overflowFails = auditResults.overflowChecks.filter(c => !c.pass);
  console.log(`  Overflow audit complete: ${auditResults.overflowChecks.length - overflowFails.length}/${auditResults.overflowChecks.length} checks passed with ZERO overflow.`);

  // 2. Capture Key Screenshots
  console.log('\n--- 2. Capturing Verification Screenshots ---');
  // Desktop 1366px for all 8 service pages
  await page.setViewport({ width: 1366, height: 768 });
  for (const p of PAGES_TO_TEST.slice(0, 8)) {
    await page.goto(`http://localhost:${PORT}${p.url}`, { waitUntil: 'networkidle0' });
    const ssName = `${p.name}-desktop-1366px.png`;
    const ssPath = path.join(ARTIFACTS_DIR, ssName);
    await page.screenshot({ path: ssPath, fullPage: true });
    auditResults.screenshotsCaptured.push(ssName);
    console.log(`  Captured ${ssName}`);
  }

  // Mobile 375px for Dummy Tickets & Confirmed Flights & Passport
  await page.setViewport({ width: 375, height: 667 });
  for (const p of PAGES_TO_TEST.slice(0, 3)) {
    await page.goto(`http://localhost:${PORT}${p.url}`, { waitUntil: 'networkidle0' });
    const ssName = `${p.name}-mobile-375px.png`;
    const ssPath = path.join(ARTIFACTS_DIR, ssName);
    await page.screenshot({ path: ssPath, fullPage: true });
    auditResults.screenshotsCaptured.push(ssName);
    console.log(`  Captured ${ssName}`);
  }

  // Ultra-compact 320px for Dummy Tickets
  await page.setViewport({ width: 320, height: 640 });
  await page.goto(`http://localhost:${PORT}/services/dummy-tickets/`, { waitUntil: 'networkidle0' });
  const ss320 = path.join(ARTIFACTS_DIR, 'dummy-tickets-mobile-320px.png');
  await page.screenshot({ path: ss320, fullPage: true });
  auditResults.screenshotsCaptured.push('dummy-tickets-mobile-320px.png');
  console.log(`  Captured dummy-tickets-mobile-320px.png`);

  // Verify PhD notices removed screenshot
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(`http://localhost:${PORT}/services/phd/`, { waitUntil: 'networkidle0' });
  const ssPhd = path.join(ARTIFACTS_DIR, 'phd-abroad-clean-1366px.png');
  await page.screenshot({ path: ssPhd, fullPage: false });
  auditResults.screenshotsCaptured.push('phd-abroad-clean-1366px.png');
  console.log(`  Captured phd-abroad-clean-1366px.png`);

  // Verify MBBS integrity notice removed screenshot
  await page.goto(`http://localhost:${PORT}/services/mbbs/`, { waitUntil: 'networkidle0' });
  const ssMbbs = path.join(ARTIFACTS_DIR, 'mbbs-abroad-clean-1366px.png');
  await page.screenshot({ path: ssMbbs, fullPage: false });
  auditResults.screenshotsCaptured.push('mbbs-abroad-clean-1366px.png');
  console.log(`  Captured mbbs-abroad-clean-1366px.png`);

  // Verify Flight booking clean screenshot
  await page.goto(`http://localhost:${PORT}/services/flight-booking/`, { waitUntil: 'networkidle0' });
  const ssFlight = path.join(ARTIFACTS_DIR, 'flight-booking-clean-1366px.png');
  await page.screenshot({ path: ssFlight, fullPage: false });
  auditResults.screenshotsCaptured.push('flight-booking-clean-1366px.png');
  console.log(`  Captured flight-booking-clean-1366px.png`);

  // Verify About bottom banner removed screenshot
  await page.goto(`http://localhost:${PORT}/about/`, { waitUntil: 'networkidle0' });
  const ssAbout = path.join(ARTIFACTS_DIR, 'about-bottom-clean-1366px.png');
  await page.screenshot({ path: ssAbout, fullPage: true });
  auditResults.screenshotsCaptured.push('about-bottom-clean-1366px.png');
  console.log(`  Captured about-bottom-clean-1366px.png`);

  // 3. Inspect Form Fields & Interaction on Dummy Tickets
  console.log('\n--- 3. Verifying Form Inputs & Interaction in DOM ---');
  await page.goto(`http://localhost:${PORT}/services/dummy-tickets/`, { waitUntil: 'networkidle0' });
  const formAudit = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"]):not([style*="display: none"]):not(.hidden)'));
    const textareas = Array.from(document.querySelectorAll('textarea:not(.hidden)'));
    const selects = Array.from(document.querySelectorAll('select:not(.hidden)'));
    const submitBtn = document.querySelector('button[type="submit"]');

    return {
      visibleInputsCount: inputs.length + textareas.length + selects.length,
      inputDetails: [
        ...inputs.map(i => ({ tag: 'input', type: i.type, name: i.name })),
        ...textareas.map(t => ({ tag: 'textarea', name: t.name })),
        ...selects.map(s => ({ tag: 'select', name: s.name })),
      ],
      submitBtnText: submitBtn?.textContent?.trim() || '',
    };
  });
  console.log('  Form audit on /services/dummy-tickets/:', JSON.stringify(formAudit, null, 2));
  auditResults.formChecks.push(formAudit);

  // Write audit results
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'audit-results.json'), JSON.stringify(auditResults, null, 2));
  console.log('\nAudit complete! Results written to master-service-page-redesign/audit-results.json');

  await browser.close();
  server.close();
}

main().catch(err => {
  console.error('Audit script exception:', err);
  process.exit(1);
});
