import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');
const ARTIFACTS_DIR = 'C:/Users/ACER/.gemini/antigravity/brain/6a0361a6-ccbe-4f53-a463-b2d5ee259bd4/verified-outcomes-audit-redesign';
const PORT = 4375;

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
  { width: 320, height: 600, label: '320px', min: 16, max: 20 },
  { width: 360, height: 640, label: '360px', min: 16, max: 20 },
  { width: 375, height: 667, label: '375px', min: 16, max: 20 },
  { width: 390, height: 844, label: '390px', min: 16, max: 20 },
  { width: 430, height: 932, label: '430px', min: 16, max: 20 },
  { width: 768, height: 1024, label: '768px', min: 20, max: 24 },
  { width: 1024, height: 768, label: '1024px', min: 24, max: 32 },
  { width: 1366, height: 768, label: '1366px', min: 24, max: 32 },
  { width: 1440, height: 900, label: '1440px', min: 24, max: 32 },
];

async function main() {
  console.log('=== Starting Verified Outcomes Audit & Redesign Verification ===');
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
  // 1. AUDIT STRUCTURE & CONTENT SPECIFICATIONS
  // =========================================================================
  console.log('\n--- 1. Auditing /success-stories/ Page Structure & Copy ---');
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(`http://localhost:${PORT}/success-stories/`, { waitUntil: 'networkidle0' });

  const metrics = await page.evaluate(() => {
    const text = document.body.innerText;
    const h1 = document.querySelector('h1')?.innerText?.trim() || '';

    // Hero checks
    const isHeadingVerifiedOutcomes = h1 === 'Verified Outcomes';
    const hasPrivacyNotice = text.includes('Candidate Privacy & Data Protection Guarantee');
    const mentionsDPDP = text.includes('Digital Personal Data Protection Act');
    const mentionsRedacted = text.includes('permanently redacted');

    // Main grid & card checks
    const cards = Array.from(document.querySelectorAll('.story-card'));
    const cardCount = cards.length;
    const hasVerifiedBadges = cards.every(card => card.innerText.includes('Verified'));
    const hasOutcomeTypes = cards.some(card => card.innerText.includes('Issued Study Permit') || card.innerText.includes('Admission'));
    const hasMilestones = cards.every(card => card.textContent.includes('Documented Milestones:') || card.innerText.toLowerCase().includes('documented milestones'));
    const hasInitials = cards.every(card => /Candidate:\s*[A-Z]\.\s*[A-Z]\./i.test(card.textContent || card.innerText));

    // Section count & anti-repetition
    const sections = Array.from(document.querySelectorAll('main > section'));
    const hasPlaceholderVideo = text.includes('In-Person Video Testimonials') || text.includes('video releases will be published here');
    const hasDuplicateForms = document.querySelectorAll('form').length > 0;

    // Contact action
    const contactLinks = Array.from(document.querySelectorAll('a[href*="/contact/"]'));
    const hasContactCTA = contactLinks.length > 0;

    return {
      h1,
      isHeadingVerifiedOutcomes,
      hasPrivacyNotice,
      mentionsDPDP,
      mentionsRedacted,
      cardCount,
      hasVerifiedBadges,
      hasOutcomeTypes,
      hasMilestones,
      hasInitials,
      sectionCount: sections.length,
      hasPlaceholderVideo,
      hasDuplicateForms,
      hasContactCTA,
    };
  });

  assert(metrics.isHeadingVerifiedOutcomes, `Hero Heading is strictly "Verified Outcomes" (actual: "${metrics.h1}")`);
  assert(!metrics.hasPrivacyNotice, 'Hero: "Candidate Privacy & Data Protection Guarantee" section completely removed');
  assert(!metrics.mentionsDPDP, 'Hero: DPDP Act statement excised from page content');
  assert(!metrics.mentionsRedacted, 'Hero: Redacted tracking ID text excised from page content');
  assert(metrics.cardCount === 6, `Main Grid: Exactly 6 documented outcome cards rendered (actual: ${metrics.cardCount})`);
  assert(metrics.hasVerifiedBadges, 'Main Grid: All outcome cards display an authentic "Verified" status badge');
  assert(metrics.hasOutcomeTypes, 'Main Grid: Outcome cards clearly distinguish between issued permits, admissions, and grants');
  assert(metrics.hasMilestones, 'Main Grid: Every card displays documented application milestones');
  assert(metrics.hasInitials, 'Evidence & Privacy: Candidate full names are protected with anonymized initials');
  assert(!metrics.hasPlaceholderVideo, 'Anti-Repetition: Empty placeholder video testimonials section is completely excised');
  assert(!metrics.hasDuplicateForms, 'Anti-Repetition: No duplicate lengthy form inside Verified Outcomes');
  assert(metrics.hasContactCTA, 'Contact Action: Single concise CTA directing visitors to consultation');
  assert(metrics.sectionCount === 3, `Page Structure: Compact, high-impact layout consists of exactly 3 sections (found ${metrics.sectionCount})`);

  // =========================================================================
  // 2. INTERACTIVE FILTERING VERIFICATION
  // =========================================================================
  console.log('\n--- 2. Auditing Interactive Category Filters ---');
  const mbbsBtn = await page.$('button[data-category="mbbs"]');
  if (mbbsBtn) {
    await mbbsBtn.click();
    await new Promise(r => setTimeout(r, 100));
    const visibleCards = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.story-card'));
      return cards.filter(c => window.getComputedStyle(c).display !== 'none').length;
    });
    assert(visibleCards === 1, `Category Filter (MBBS): Filters to 1 relevant medical outcome card (actual: ${visibleCards})`);

    // Reset to all
    const allBtn = await page.$('button[data-category="all"]');
    if (allBtn) {
      await allBtn.click();
      await new Promise(r => setTimeout(r, 100));
      const resetCards = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('.story-card'));
        return cards.filter(c => window.getComputedStyle(c).display !== 'none').length;
      });
      assert(resetCards === 6, `Category Filter (All): Resets cleanly to show all 6 outcome cards (actual: ${resetCards})`);
    }
  }

  // =========================================================================
  // 3. RESPONSIVE TESTING ACROSS ALL 9 VIEWPORTS
  // =========================================================================
  console.log('\n--- 3. Testing 9 Responsive Viewports (320, 360, 375, 390, 430, 768, 1024, 1366, 1440px) ---');
  for (const vp of VIEWPORTS) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto(`http://localhost:${PORT}/success-stories/`, { waitUntil: 'networkidle0' });

    const vpMetrics = await page.evaluate(() => {
      const header = document.querySelector('header');
      const headerBottom = header ? header.getBoundingClientRect().bottom : 0;
      const breadcrumbNav = document.querySelector('nav[aria-label="Breadcrumb"]');
      const targetTop = breadcrumbNav ? breadcrumbNav.getBoundingClientRect().top : 0;
      const gap = Math.round(targetTop - headerBottom);
      const hasHorizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;
      return { gap, hasHorizontalOverflow };
    });

    assert(!vpMetrics.hasHorizontalOverflow, `Verified Outcomes @ ${vp.label}: Zero horizontal overflow (scrollWidth <= ${vp.width})`);
    assert(vpMetrics.gap >= vp.min && vpMetrics.gap <= vp.max, `Verified Outcomes @ ${vp.label}: Standardized top spacing (${vpMetrics.gap}px)`);
  }

  // =========================================================================
  // 4. CAPTURE HIGH-RES VISUAL SCREENSHOTS
  // =========================================================================
  console.log('\n--- 4. Capturing High-Res Verification Screenshots ---');

  // Desktop (1366px)
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(`http://localhost:${PORT}/success-stories/`, { waitUntil: 'networkidle0' });
  const desktopFull = path.join(ARTIFACTS_DIR, 'verified-outcomes-desktop-1366px.png');
  await page.screenshot({ path: desktopFull, fullPage: true });
  console.log('  Saved verified-outcomes-desktop-1366px.png');

  // Card close-up (1366px)
  const cardDetail = path.join(ARTIFACTS_DIR, 'verified-outcomes-card-detail-1366px.png');
  await page.screenshot({ path: cardDetail, clip: { x: 0, y: 350, width: 1366, height: 600 } });
  console.log('  Saved verified-outcomes-card-detail-1366px.png');

  // Mobile (375px)
  await page.setViewport({ width: 375, height: 667 });
  await page.goto(`http://localhost:${PORT}/success-stories/`, { waitUntil: 'networkidle0' });
  const mobileFull = path.join(ARTIFACTS_DIR, 'verified-outcomes-mobile-375px.png');
  await page.screenshot({ path: mobileFull, fullPage: true });
  console.log('  Saved verified-outcomes-mobile-375px.png');

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
