import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');
const ARTIFACTS_DIR = 'C:/Users/ACER/.gemini/antigravity/brain/6a0361a6-ccbe-4f53-a463-b2d5ee259bd4/about-pages-audit-redesign';
const PORT = 4370;

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
  { width: 320, height: 600, label: '320px', cat: 'mobile', min: 16, max: 20 },
  { width: 360, height: 640, label: '360px', cat: 'mobile', min: 16, max: 20 },
  { width: 375, height: 667, label: '375px', cat: 'mobile', min: 16, max: 20 },
  { width: 390, height: 844, label: '390px', cat: 'mobile', min: 16, max: 20 },
  { width: 430, height: 932, label: '430px', cat: 'mobile', min: 16, max: 20 },
  { width: 768, height: 1024, label: '768px', cat: 'tablet', min: 20, max: 24 },
  { width: 1024, height: 768, label: '1024px', cat: 'desktop', min: 24, max: 32 },
  { width: 1366, height: 768, label: '1366px', cat: 'desktop', min: 24, max: 32 },
  { width: 1440, height: 900, label: '1440px', cat: 'desktop', min: 24, max: 32 },
];

async function main() {
  console.log('=== Starting About Pages Audit & Redesign Verification Suite ===');
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
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  [PASS] ${message}`);
    } else {
      failedTests++;
      console.error(`  [FAIL] ${message}`);
    }
  }

  // =========================================================================
  // 1. AUDIT ABOUT PAGE (/about/) STRUCTURE & ANTI-REPETITION
  // =========================================================================
  console.log('\n--- 1. Auditing Redesigned /about/ Page ---');
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(`http://localhost:${PORT}/about/`, { waitUntil: 'networkidle0' });

  const aboutMetrics = await page.evaluate(() => {
    const text = document.body.innerText;
    const html = document.body.innerHTML;
    const sections = Array.from(document.querySelectorAll('main > section'));

    // Section 1: Our Story
    const hasOurStory = text.includes('Integrity, Precision & Truth') && text.includes('Bridging Hanumangarh');
    const hasPrinciples = text.includes('Our Counseling Principles') && text.includes('Factual Eligibility Screening');

    // Section 2: Why Visa Convention
    const hasWhyUs = text.includes('Why Families Choose Visa Convention');
    const hasZeroGuarantees = text.includes('Zero Visa Guarantees & Consular Integrity');
    const hasDocDiscipline = text.includes('End-to-End Documentation Discipline');
    const hasLocalAccountability = text.includes('Local Accountability with Global Reach');

    // Section 3: Our Office
    const hasOfficeHeading = text.includes('Our Physical Advisory Center in Hanumangarh');
    const hasAddressLine1 = text.includes('Shop No.115, Durga Market, Street No.04');
    const hasAddressLine2 = text.includes('Behind Bus Stand, Durga Colony');
    const hasAddressLine3 = text.includes('Hanumangarh Junction, Rajasthan – 335512, India');
    const hasHours = text.includes('Monday – Saturday: 9:30 AM – 6:30 PM IST');
    const hasPhone = text.includes('+91 96803 95539');
    const hasEmail = text.includes('visaconvention064@gmail.com');

    // Functional actions
    const mapsLink = document.querySelector('a[href*="maps.google.com"]');
    const hasMapsAction = mapsLink !== null && mapsLink.getAttribute('target') === '_blank';
    const consultationLink = document.querySelector('a[href="/contact/"]');
    const hasConsultationAction = consultationLink !== null;

    // Google Maps iframe embed
    const mapIframe = document.querySelector('iframe[src*="google.com/maps"]');
    const hasMapIframe = mapIframe !== null;

    // Anti-repetition & removed pseudo-elements
    const hasOldDirectorship = text.includes('Message from the Directorship Desk');
    const hasOldPseudoTeam = text.includes('Our Specialized Counseling Practice') || text.includes('Lead Education Counselor');
    const hasOldNotice = text.includes('Authentic Facility Notice: We feature genuine office facilities only');
    const hasDuplicateMilestones = text.includes('Measurable Institutional Scale');

    return {
      sectionCount: sections.length,
      hasOurStory,
      hasPrinciples,
      hasWhyUs,
      hasZeroGuarantees,
      hasDocDiscipline,
      hasLocalAccountability,
      hasOfficeHeading,
      hasAddressLine1,
      hasAddressLine2,
      hasAddressLine3,
      hasHours,
      hasPhone,
      hasEmail,
      hasMapsAction,
      hasConsultationAction,
      hasMapIframe,
      hasOldDirectorship,
      hasOldPseudoTeam,
      hasOldNotice,
      hasDuplicateMilestones,
    };
  });

  assert(aboutMetrics.sectionCount === 3, `About page consists of exactly 3 meaningful sections (found ${aboutMetrics.sectionCount})`);
  assert(aboutMetrics.hasOurStory && aboutMetrics.hasPrinciples, 'Section 1 (Our Story): Concise narrative & counseling principles card present');
  assert(aboutMetrics.hasWhyUs && aboutMetrics.hasZeroGuarantees && aboutMetrics.hasDocDiscipline && aboutMetrics.hasLocalAccountability, 'Section 2 (Why Visa Convention): 3 distinct credible differentiator cards present');
  assert(aboutMetrics.hasOfficeHeading && aboutMetrics.hasAddressLine1 && aboutMetrics.hasAddressLine2 && aboutMetrics.hasAddressLine3, 'Section 3 (Our Office): Verified address in Hanumangarh Junction present');
  assert(aboutMetrics.hasHours && aboutMetrics.hasPhone && aboutMetrics.hasEmail, 'Section 3 (Our Office): Operating hours, telephone and email present');
  assert(aboutMetrics.hasMapsAction, 'Section 3 (Our Office): Google Maps directions link with target="_blank" is functional');
  assert(aboutMetrics.hasConsultationAction, 'Section 3 (Our Office): In-person consultation link to /contact/ is functional');
  assert(aboutMetrics.hasMapIframe, 'Section 3 (Our Office): Interactive Google Maps iframe embed is present');
  assert(!aboutMetrics.hasOldDirectorship, 'Anti-Repetition: Superseded directorship banner removed from component tree');
  assert(!aboutMetrics.hasOldPseudoTeam, 'Anti-Repetition: Superseded pseudo-team cards removed from component tree');
  assert(!aboutMetrics.hasOldNotice, 'Anti-Repetition: Superseded photo availability disclaimer removed');
  assert(!aboutMetrics.hasDuplicateMilestones, 'Anti-Repetition: Superseded duplicate milestone cards removed');

  // =========================================================================
  // 2. AUDIT SUCCESS STORIES PAGE (/success-stories/)
  // =========================================================================
  console.log('\n--- 2. Auditing /success-stories/ Page ---');
  await page.goto(`http://localhost:${PORT}/success-stories/`, { waitUntil: 'networkidle0' });

  const storiesMetrics = await page.evaluate(() => {
    const text = document.body.innerText;
    const hasPrivacyNotice = text.includes('Candidate Privacy & Data Protection Guarantee');
    const hasFilterBar = document.getElementById('story-filter-container') !== null;
    const storiesCount = document.querySelectorAll('.story-card').length;
    const hasCTA = document.querySelector('a[href*="/contact/"]') !== null;
    return {
      hasPrivacyNotice,
      hasFilterBar,
      storiesCount,
      hasCTA,
    };
  });

  assert(storiesMetrics.hasPrivacyNotice, 'Success Stories: Mandatory privacy and data protection guarantee box is present');
  assert(storiesMetrics.hasFilterBar, 'Success Stories: Interactive destination category filter bar is present');
  assert(storiesMetrics.storiesCount > 0, `Success Stories: Verified outcome cards rendered (${storiesMetrics.storiesCount} cards)`);
  assert(storiesMetrics.hasCTA, 'Success Stories: Consultation CTA is present');

  // =========================================================================
  // 3. RESPONSIVE TESTING ACROSS ALL 9 VIEWPORTS
  // =========================================================================
  console.log('\n--- 3. Testing 9 Responsive Viewports (320, 360, 375, 390, 430, 768, 1024, 1366, 1440px) ---');
  const testRoutes = [
    { url: '/about/', name: 'About Us' },
    { url: '/success-stories/', name: 'Success Stories' },
  ];

  for (const r of testRoutes) {
    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(`http://localhost:${PORT}${r.url}`, { waitUntil: 'networkidle0' });

      const resMetrics = await page.evaluate(() => {
        const header = document.querySelector('header');
        const headerBottom = header ? header.getBoundingClientRect().bottom : 0;
        const breadcrumbNav = document.querySelector('nav[aria-label="Breadcrumb"]');
        const targetTop = breadcrumbNav ? breadcrumbNav.getBoundingClientRect().top : 0;
        const gap = Math.round(targetTop - headerBottom);
        const hasHorizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;
        return { gap, hasHorizontalOverflow };
      });

      assert(!resMetrics.hasHorizontalOverflow, `${r.name} @ ${vp.label}: No horizontal overflow (scrollWidth <= ${vp.width})`);
      assert(resMetrics.gap >= vp.min && resMetrics.gap <= vp.max, `${r.name} @ ${vp.label}: Top spacing gap is standardized (${resMetrics.gap}px)`);
    }
  }

  // =========================================================================
  // 4. CAPTURE HIGH-RES VISUAL SCREENSHOTS
  // =========================================================================
  console.log('\n--- 4. Capturing High-Res Verification Screenshots ---');

  // Desktop (1366px)
  await page.setViewport({ width: 1366, height: 768 });

  await page.goto(`http://localhost:${PORT}/about/`, { waitUntil: 'networkidle0' });
  const aboutDesktop = path.join(ARTIFACTS_DIR, 'about-page-desktop-1366px.png');
  await page.screenshot({ path: aboutDesktop, fullPage: true });
  console.log('  Saved about-page-desktop-1366px.png');

  await page.goto(`http://localhost:${PORT}/success-stories/`, { waitUntil: 'networkidle0' });
  const storiesDesktop = path.join(ARTIFACTS_DIR, 'success-stories-desktop-1366px.png');
  await page.screenshot({ path: storiesDesktop, fullPage: true });
  console.log('  Saved success-stories-desktop-1366px.png');

  // Mobile (375px)
  await page.setViewport({ width: 375, height: 667 });

  await page.goto(`http://localhost:${PORT}/about/`, { waitUntil: 'networkidle0' });
  const aboutMobile = path.join(ARTIFACTS_DIR, 'about-page-mobile-375px.png');
  await page.screenshot({ path: aboutMobile, fullPage: true });
  console.log('  Saved about-page-mobile-375px.png');

  await page.goto(`http://localhost:${PORT}/success-stories/`, { waitUntil: 'networkidle0' });
  const storiesMobile = path.join(ARTIFACTS_DIR, 'success-stories-mobile-375px.png');
  await page.screenshot({ path: storiesMobile, fullPage: true });
  console.log('  Saved success-stories-mobile-375px.png');

  // Write audit results
  const resultsJson = {
    timestamp: new Date().toISOString(),
    totalTests,
    passedTests,
    failedTests,
    summary: `${passedTests}/${totalTests} tests passed (${Math.round((passedTests / totalTests) * 100)}%)`,
  };
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'audit-results.json'), JSON.stringify(resultsJson, null, 2));

  console.log(`\n=== Verification Complete: ${passedTests}/${totalTests} tests passed ===`);

  await browser.close();
  server.close();

  if (failedTests > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
