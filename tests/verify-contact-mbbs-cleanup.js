import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\6a0361a6-ccbe-4f53-a463-b2d5ee259bd4\\contact-mbbs-cleanup';
const PORT = 4399;

if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  let cleanUrl = decodeURIComponent(req.url.split('?')[0]);
  if (cleanUrl.endsWith('/')) cleanUrl += 'index.html';
  let file = path.join(DIST, cleanUrl);
  if (!path.extname(file)) {
    if (fs.existsSync(file + '.html')) file += '.html';
    else if (fs.existsSync(path.join(file, 'index.html'))) file = path.join(file, 'index.html');
  }
  if (fs.existsSync(file) && fs.statSync(file).isFile()) {
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
const failureDetails = [];

function assert(condition, checkName, details = '') {
  totalChecks++;
  if (condition) {
    console.log(`  ✅ PASS: ${checkName}`);
    passedChecks++;
  } else {
    console.error(`  ❌ FAIL: ${checkName} ${details ? '- ' + details : ''}`);
    failedChecks++;
    failureDetails.push({ checkName, details });
  }
}

const VIEWPORTS = [
  { name: 'Mobile-320px', width: 320, height: 640 },
  { name: 'Mobile-360px', width: 360, height: 740 },
  { name: 'Mobile-375px', width: 375, height: 667 },
  { name: 'Mobile-390px', width: 390, height: 844 },
  { name: 'Mobile-430px', width: 430, height: 932 },
  { name: 'Tablet-768px', width: 768, height: 1024 },
  { name: 'Tablet-1024px', width: 1024, height: 768 },
  { name: 'Desktop-1366px', width: 1366, height: 768 },
  { name: 'Desktop-1440px', width: 1440, height: 900 },
];

async function runQA() {
  console.log('================================================================');
  console.log('    CONTACT & MBBS PAGE CLEANUP COMPREHENSIVE QA VERIFICATION   ');
  console.log('================================================================\n');

  await new Promise((resolve) => server.listen(PORT, resolve));
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  try {
    // -------------------------------------------------------------
    // PART 1: STATIC DIST VERIFICATION
    // -------------------------------------------------------------
    console.log('--- PART 1: Static HTML File Audits ---');
    const contactHtml = fs.readFileSync(path.join(DIST, 'contact', 'index.html'), 'utf8');
    const mbbsHtml = fs.readFileSync(path.join(DIST, 'services', 'mbbs', 'index.html'), 'utf8');

    // Contact assertions
    const contactBannedParagraph = 'Visit our consultation center in Hanumangarh, Rajasthan, or submit an assessment request below';
    assert(!contactHtml.includes(contactBannedParagraph), 'Contact HTML: Removed paragraph is completely absent');

    // MBBS assertions
    const mbbsBannedTitle = 'National Medical Commission (NMC) FMGL Compliance & Standards';
    const mbbsBannedBadge = 'WDOMS & WHO Directory Recognized';
    const mbbsBannedText = '54-month minimum course duration + 12-month clinical internship';
    assert(!mbbsHtml.includes(mbbsBannedTitle), 'MBBS HTML: NMC Compliance title is completely absent');
    assert(!mbbsHtml.includes(mbbsBannedBadge), 'MBBS HTML: WDOMS & WHO badge is completely absent');
    assert(!mbbsHtml.includes(mbbsBannedText), 'MBBS HTML: Banner description text is completely absent');

    // -------------------------------------------------------------
    // PART 2: CONTACT PAGE LIVE BROWSER AUDIT
    // -------------------------------------------------------------
    console.log('\n--- PART 2: Contact Page Live Browser Layout & Spacing ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });

    const contactAudit = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const sectionHeading = h1?.closest('div');
      const pTags = sectionHeading ? Array.from(sectionHeading.querySelectorAll('p')) : [];
      const grid = h1?.closest('section')?.querySelector('.grid');
      const form = document.getElementById('visa-enquiry-form');
      const officeCard = document.querySelector('.bg-white.rounded-2xl');

      const h1Rect = h1?.getBoundingClientRect();
      const gridRect = grid?.getBoundingClientRect();
      const spacingBetweenHeadingAndGrid = gridRect && h1Rect ? gridRect.top - h1Rect.bottom : 0;

      return {
        h1Text: h1?.textContent?.trim(),
        pTagCount: pTags.length,
        spacingBetweenHeadingAndGrid,
        hasForm: !!form,
        hasOfficeCard: !!officeCard,
      };
    });

    assert(contactAudit.h1Text === 'Connect with Visa Convention', 'Contact page H1 is "Connect with Visa Convention"');
    assert(contactAudit.pTagCount === 0, 'No descriptive paragraph rendered in SectionHeading');
    assert(
      contactAudit.spacingBetweenHeadingAndGrid >= 16 && contactAudit.spacingBetweenHeadingAndGrid <= 36,
      `Clean, natural spacing between heading and grid (actual: ${contactAudit.spacingBetweenHeadingAndGrid.toFixed(1)}px)`
    );
    assert(contactAudit.hasForm, 'Contact enquiry form is preserved and present');
    assert(contactAudit.hasOfficeCard, 'Office address and channels card is preserved and present');

    // -------------------------------------------------------------
    // PART 3: MBBS PAGE LIVE BROWSER AUDIT
    // -------------------------------------------------------------
    console.log('\n--- PART 3: MBBS Page Live Browser Layout & Verification ---');
    await page.goto(`http://localhost:${PORT}/services/mbbs/`, { waitUntil: 'networkidle0' });

    const mbbsAudit = await page.evaluate(() => {
      const hero = document.querySelector('section');
      const unisSection = document.getElementById('universities');
      const countryGrid = document.getElementById('mbbs-countries-grid');
      const countryBtns = document.querySelectorAll('.mbbs-country-btn');
      const integrityNotice = Array.from(unisSection?.querySelectorAll('p') || []).find((p) =>
        p.textContent.includes('Integrity Notice:')
      );
      const faqAccordion = document.querySelector('#enquiry')?.previousElementSibling;

      const heroRect = hero?.getBoundingClientRect();
      const unisRect = unisSection?.getBoundingClientRect();
      const distanceHeroToUnis = unisRect && heroRect ? unisRect.top - heroRect.bottom : 0;

      // Check whether any navy banner exists
      const bodyText = document.body.innerText;
      const hasNmcBannerText = bodyText.includes('National Medical Commission (NMC) FMGL Compliance & Standards');
      const hasWdomsBadge = bodyText.includes('WDOMS & WHO Directory Recognized');

      return {
        hasHero: !!hero,
        hasUnisSection: !!unisSection,
        countryBtnCount: countryBtns.length,
        hasIntegrityNotice: !!integrityNotice,
        distanceHeroToUnis,
        hasNmcBannerText,
        hasWdomsBadge,
      };
    });

    assert(!mbbsAudit.hasNmcBannerText, 'Live MBBS DOM: Zero occurrences of NMC Compliance title');
    assert(!mbbsAudit.hasWdomsBadge, 'Live MBBS DOM: Zero occurrences of WDOMS badge');
    assert(mbbsAudit.hasHero, 'Hero section is present');
    assert(mbbsAudit.hasUnisSection, 'Universities discovery section is present');
    assert(mbbsAudit.countryBtnCount === 11, `Preserved all 11 destination countries (Found: ${mbbsAudit.countryBtnCount})`);
    assert(mbbsAudit.hasIntegrityNotice, 'Regulatory integrity disclaimer is preserved');
    assert(
      Math.abs(mbbsAudit.distanceHeroToUnis) <= 2,
      `Hero section connects directly to Universities section without empty gap (offset: ${mbbsAudit.distanceHeroToUnis}px)`
    );

    // Test clicking a country card to ensure full interactive functionality
    const clickUzbekistan = await page.evaluate(async () => {
      const btn = Array.from(document.querySelectorAll('.mbbs-country-btn')).find((b) =>
        b.getAttribute('data-country-name') === 'Uzbekistan'
      );
      if (btn) btn.click();
      await new Promise((r) => setTimeout(r, 200));

      const heading = document.getElementById('mbbs-selected-country-heading')?.innerText;
      const visibleUnis = Array.from(document.querySelectorAll('#mbbs-universities-grid .uni-card'))
        .filter((c) => !c.classList.contains('hidden'));

      return {
        heading,
        visibleCount: visibleUnis.length,
      };
    });

    assert(clickUzbekistan.heading === 'Guided Medical Universities in Uzbekistan (4)', 'Country selection reveals Uzbekistan medical faculties');
    assert(clickUzbekistan.visibleCount === 4, 'Displays all 4 Uzbekistan universities');

    // -------------------------------------------------------------
    // PART 4: MULTI-VIEWPORT RESPONSIVENESS & ZERO OVERFLOW
    // -------------------------------------------------------------
    console.log('\n--- PART 4: Multi-Viewport Responsiveness & Zero Overflow (9 Viewports) ---');
    const pagesToTest = ['/contact/', '/services/mbbs/'];

    for (const pPath of pagesToTest) {
      for (const vp of VIEWPORTS) {
        await page.setViewport({ width: vp.width, height: vp.height });
        await page.goto(`http://localhost:${PORT}${pPath}`, { waitUntil: 'networkidle0' });

        const overflow = await page.evaluate(() => {
          return {
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
            hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
          };
        });

        assert(
          !overflow.hasOverflow,
          `Zero overflow on ${pPath} at ${vp.name} (${overflow.scrollWidth}px <= ${overflow.innerWidth}px)`
        );
      }
    }

    // -------------------------------------------------------------
    // PART 5: HIGH-RESOLUTION SCREENSHOT CAPTURES
    // -------------------------------------------------------------
    console.log('\n--- PART 5: Capturing Clean Evidence Screenshots ---');

    // Contact Desktop (1440px)
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'contact-clean-desktop-1440px.png'), fullPage: false });

    // Contact Mobile (375px)
    await page.setViewport({ width: 375, height: 667 });
    await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'contact-clean-mobile-375px.png'), fullPage: false });

    // MBBS Desktop (1440px)
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/services/mbbs/`, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'mbbs-clean-hero-desktop-1440px.png'), fullPage: false });

    // MBBS Mobile (375px)
    await page.setViewport({ width: 375, height: 667 });
    await page.goto(`http://localhost:${PORT}/services/mbbs/`, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'mbbs-clean-hero-mobile-375px.png'), fullPage: false });

    console.log(`\nScreenshots successfully saved to ${ARTIFACTS_DIR}`);

  } catch (err) {
    console.error('Fatal execution error during QA test:', err);
    assert(false, 'Fatal QA test error', err.message);
  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n================================================================');
  console.log(`   QA SUMMARY: ${passedChecks}/${totalChecks} CHECKS PASSED`);
  if (failedChecks > 0) {
    console.log(`   FAILED CHECKS: ${failedChecks}`);
    for (const f of failureDetails) {
      console.log(`     - ${f.checkName}: ${f.details}`);
    }
  }
  console.log('================================================================\n');

  if (failedChecks > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runQA();
