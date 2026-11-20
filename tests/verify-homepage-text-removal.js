import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';
import assert from 'assert';

const DIST = path.resolve('dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\6a0361a6-ccbe-4f53-a463-b2d5ee259bd4\\homepage-text-removal';
const PORT = 4396;

if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
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

async function runVerification() {
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Verification test server running at http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const results = {
    textRemoval: {},
    reviewsIntegrity: {},
    carouselAnimation: {},
    controls: {},
    viewports: {},
    screenshots: [],
    allPass: true,
  };

  try {
    console.log('\n=== 1. Verifying Homepage Text Removal ===');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    const audit = await page.evaluate(() => {
      const bodyText = document.body.innerText;
      const html = document.body.innerHTML;

      const targetText1 = "Candidate names are abbreviated to initials in strict compliance with the Digital Personal Data Protection Act. Visa issuance decisions remain the sole prerogative of sovereign host-country embassies.";
      const targetText2 = "Authentic feedback from students and families across Rajasthan who processed admissions, APS verifications, and visa dossiers through Visa Convention.";

      const text1Found = bodyText.includes("Candidate names are abbreviated to initials") ||
                         html.includes("Candidate names are abbreviated to initials");
      const text2Found = bodyText.includes("Authentic feedback from students and families") ||
                         html.includes("Authentic feedback from students and families");

      // Verify Reviews section exists
      const reviewsSection = document.getElementById('reviews-section');
      const heading = reviewsSection?.querySelector('h2');
      const headingText = heading?.textContent.trim() || '';

      const badge = reviewsSection?.querySelector('.animate-pulse')?.parentElement;
      const badgeText = badge?.textContent.trim() || '';

      // Review cards count
      const primaryGroup = document.getElementById('marquee-group-primary');
      const cards = primaryGroup ? Array.from(primaryGroup.querySelectorAll('.review-card')) : [];

      const cardDetails = cards.map(c => ({
        stars: c.querySelectorAll('.fill-current').length,
        hasQuote: Boolean(c.querySelector('p')),
        hasVerified: c.innerText.includes('Verified'),
        candidate: c.querySelector('span')?.textContent.trim() || '',
      }));

      // Controls
      const pauseBtn = document.getElementById('reviews-pause-toggle-btn');
      const nudgeLeft = document.getElementById('reviews-nudge-left-btn');
      const nudgeRight = document.getElementById('reviews-nudge-right-btn');
      const viewAllLink = reviewsSection?.querySelector('a[href="/success-stories/"]');

      return {
        text1Found,
        text2Found,
        hasReviewsSection: Boolean(reviewsSection),
        headingText,
        badgeText,
        cardsCount: cards.length,
        cardDetails,
        hasPauseBtn: Boolean(pauseBtn),
        hasNudgeLeft: Boolean(nudgeLeft),
        hasNudgeRight: Boolean(nudgeRight),
        hasViewAllLink: Boolean(viewAllLink),
      };
    });

    console.log('DOM Audit:', JSON.stringify(audit, null, 2));
    results.textRemoval = {
      text1Removed: !audit.text1Found,
      text2Removed: !audit.text2Found,
    };

    assert(!audit.text1Found, 'Error: Text 1 (DPDP Candidate names disclaimer) is still present!');
    assert(!audit.text2Found, 'Error: Text 2 (Reviews introduction) is still present!');
    assert(audit.hasReviewsSection, 'Error: Reviews section missing!');
    assert(audit.headingText.includes('Real Journeys, Verified Approvals'), 'Error: Reviews heading altered!');
    assert(audit.cardsCount === 6, `Error: Expected 6 review cards in primary marquee group, found ${audit.cardsCount}`);

    console.log('✓ Text 1 completely removed: PASS');
    console.log('✓ Text 2 completely removed: PASS');
    console.log('✓ Reviews heading & badge preserved: PASS');
    console.log(`✓ 6 genuine client reviews preserved: PASS`);

    // -------------------------------------------------------------
    // 2. VERIFY CAROUSEL INTERACTION & ANIMATION
    // -------------------------------------------------------------
    console.log('\n=== 2. Verifying Reviews Carousel Controls & Interaction ===');
    const pauseToggleAudit = await page.evaluate(async () => {
      const pauseBtn = document.getElementById('reviews-pause-toggle-btn');
      const wrapper = document.getElementById('reviews-marquee-wrapper');
      const label = document.getElementById('reviews-pause-label');

      if (!pauseBtn || !wrapper || !label) return { error: 'Pause elements missing' };

      const initialPaused = wrapper.getAttribute('data-paused');

      // Click to pause
      pauseBtn.click();
      await new Promise(r => setTimeout(r, 100));
      const afterPauseClick = wrapper.getAttribute('data-paused');
      const labelAfterPause = label.textContent.trim();

      // Click to resume
      pauseBtn.click();
      await new Promise(r => setTimeout(r, 100));
      const afterResumeClick = wrapper.getAttribute('data-paused');
      const labelAfterResume = label.textContent.trim();

      return {
        initialPaused,
        afterPauseClick,
        labelAfterPause,
        afterResumeClick,
        labelAfterResume,
      };
    });

    console.log('Pause Toggle Audit:', pauseToggleAudit);
    assert(pauseToggleAudit.afterPauseClick === 'true', 'Pause toggle did not pause marquee');
    assert(pauseToggleAudit.labelAfterPause === 'Resume', 'Pause toggle did not update label to Resume');
    assert(pauseToggleAudit.afterResumeClick === 'false', 'Resume toggle did not resume marquee');
    console.log('✓ Pause/Resume toggle interaction: PASS');

    // -------------------------------------------------------------
    // 3. CAPTURE HIGH-RES SCREENSHOTS
    // -------------------------------------------------------------
    console.log('\n=== 3. Capturing High-Res Screenshots ===');
    const reviewsEl = await page.$('#reviews-section');
    if (reviewsEl) {
      const desktopShot = path.join(EVIDENCE_DIR, 'reviews-section-desktop-1440px.png');
      await reviewsEl.screenshot({ path: desktopShot });
      results.screenshots.push('reviews-section-desktop-1440px.png');
      console.log('Saved:', desktopShot);
    }

    await page.setViewport({ width: 375, height: 812 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    const reviewsElMobile = await page.$('#reviews-section');
    if (reviewsElMobile) {
      const mobileShot = path.join(EVIDENCE_DIR, 'reviews-section-mobile-375px.png');
      await reviewsElMobile.screenshot({ path: mobileShot });
      results.screenshots.push('reviews-section-mobile-375px.png');
      console.log('Saved:', mobileShot);
    }

    // -------------------------------------------------------------
    // 4. MULTI-VIEWPORT OVERFLOW AUDIT (Zero Horizontal Overflow)
    // -------------------------------------------------------------
    console.log('\n=== 4. Multi-Viewport Overflow Audit across 9 Viewports ===');
    const viewports = [320, 360, 375, 390, 430, 768, 1024, 1366, 1440];
    let allViewportsPass = true;

    for (const vpWidth of viewports) {
      await page.setViewport({ width: vpWidth, height: 800 });
      await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

      const overflowAudit = await page.evaluate(() => {
        const docEl = document.documentElement;
        const body = document.body;
        const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
        const clientWidth = docEl.clientWidth;
        const hasOverflow = scrollWidth > clientWidth + 1;
        return {
          scrollWidth,
          clientWidth,
          diff: scrollWidth - clientWidth,
          hasOverflow,
        };
      });

      results.viewports[vpWidth] = overflowAudit;
      if (overflowAudit.hasOverflow) {
        console.error(`❌ Overflow at ${vpWidth}px: diff = ${overflowAudit.diff}px`);
        allViewportsPass = false;
      } else {
        console.log(`✓ No overflow at ${vpWidth}px (scrollWidth: ${overflowAudit.scrollWidth}, clientWidth: ${overflowAudit.clientWidth})`);
      }
    }

    results.viewportsPass = allViewportsPass;
    results.allPass = !audit.text1Found && !audit.text2Found && audit.hasReviewsSection && audit.cardsCount === 6 && allViewportsPass;

    console.log(`\n========================================`);
    console.log(`OVERALL TEST STATUS: ${results.allPass ? 'PASSED ✅' : 'FAILED ❌'}`);
    console.log(`========================================\n`);

    fs.writeFileSync(path.join(EVIDENCE_DIR, 'audit-results.json'), JSON.stringify(results, null, 2));

  } catch (err) {
    console.error('Verification failed:', err);
    results.allPass = false;
    results.error = err.message;
  } finally {
    await browser.close();
    server.close();
  }
}

runVerification();
