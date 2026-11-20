import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';
import assert from 'assert';

const DIST = path.resolve('dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\6a0361a6-ccbe-4f53-a463-b2d5ee259bd4\\homepage-services-optimization';
const PORT = 4397;

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
    sectionCleanup: {},
    splitCardAudit: {},
    allSixCardsAudit: {},
    geometryAudit: {},
    viewports: {},
    screenshots: [],
    allPass: true,
  };

  try {
    console.log('\n=== 1. Verifying Services Section Cleanup ===');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    const cleanupAudit = await page.evaluate(() => {
      const servicesSection = document.getElementById('services');
      if (!servicesSection) return { error: 'Services section not found' };

      const heading = servicesSection.querySelector('h2');
      const headingText = heading?.textContent.trim() || '';

      const html = servicesSection.innerHTML;
      const text = servicesSection.innerText;

      const oldHeadingFound = text.includes('Services & Areas of Guidance') || html.includes('Services & Areas of Guidance');
      const oldDescFound = text.includes('From European university admissions') || html.includes('From European university admissions');
      const directoryBtnFound = text.includes('View All Services Directory') ||
                                html.includes('View All Services Directory') ||
                                Boolean(servicesSection.querySelector('a[href="/services/"]'));

      // Check distance from heading to grid
      const grid = servicesSection.querySelector('.grid');
      let headingToGridGap = 0;
      if (heading && grid) {
        const hRect = heading.getBoundingClientRect();
        const gRect = grid.getBoundingClientRect();
        headingToGridGap = Math.round(gRect.top - hRect.bottom);
      }

      return {
        headingText,
        oldHeadingFound,
        oldDescFound,
        directoryBtnFound,
        headingToGridGap,
      };
    });

    console.log('Cleanup Audit:', JSON.stringify(cleanupAudit, null, 2));
    results.sectionCleanup = cleanupAudit;

    assert.strictEqual(cleanupAudit.headingText, 'Services', `Heading should be 'Services', found: '${cleanupAudit.headingText}'`);
    assert(!cleanupAudit.oldHeadingFound, 'Old heading "Services & Areas of Guidance" should be removed');
    assert(!cleanupAudit.oldDescFound, 'Old description should be removed');
    assert(!cleanupAudit.directoryBtnFound, 'Directory button "View All Services Directory" should be removed');
    assert(cleanupAudit.headingToGridGap >= 16 && cleanupAudit.headingToGridGap <= 32, `Heading to grid gap should be balanced (16-32px), found: ${cleanupAudit.headingToGridGap}px`);
    console.log('✓ Services section heading and clean spacing: PASS');

    // -------------------------------------------------------------
    // 2. VERIFY ALL 6 SERVICE CARDS
    // -------------------------------------------------------------
    console.log('\n=== 2. Verifying All 6 Service Cards Presence & Structure ===');
    const cardsAudit = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('#services .grid > div.card-premium'));
      return cards.map((card, idx) => {
        const titleEl = card.querySelector('h3');
        const titleText = titleEl ? titleEl.textContent.trim() : '';
        const titleLinks = Array.from(titleEl ? titleEl.querySelectorAll('a') : []).map(a => a.getAttribute('href'));
        const allCardLinks = Array.from(card.querySelectorAll('a')).map(a => ({
          href: a.getAttribute('href'),
          ariaLabel: a.getAttribute('aria-label'),
          classes: a.getAttribute('class'),
          text: a.textContent.trim(),
        }));
        const nestedLinks = card.querySelectorAll('a a');
        const img = card.querySelector('img');
        const rect = card.getBoundingClientRect();

        return {
          cardIndex: idx + 1,
          titleText,
          titleHasLinks: titleLinks.length > 0,
          titleLinks,
          allCardLinks,
          nestedLinksCount: nestedLinks.length,
          hasImg: Boolean(img),
          imgSrc: img?.getAttribute('src') || '',
          height: Math.round(rect.height),
        };
      });
    });

    console.log('All Cards Audit:', JSON.stringify(cardsAudit, null, 2));
    results.allSixCardsAudit = cardsAudit;

    assert.strictEqual(cardsAudit.length, 6, `Expected exactly 6 cards, found: ${cardsAudit.length}`);
    assert.strictEqual(cardsAudit[0].titleText, 'Study Abroad', 'Card 1 is Study Abroad');
    assert.strictEqual(cardsAudit[1].titleText, 'MBBS / PhD Abroad', 'Card 2 is MBBS / PhD Abroad');
    assert.strictEqual(cardsAudit[2].titleText, 'Work Visa', 'Card 3 is Work Visa');
    assert.strictEqual(cardsAudit[3].titleText, 'Tourist Visa', 'Card 4 is Tourist Visa');
    assert.strictEqual(cardsAudit[4].titleText, 'Flight Booking', 'Card 5 is Flight Booking');
    assert.strictEqual(cardsAudit[5].titleText, 'Additional Services', 'Card 6 is Additional Services');

    // Check all cards have images
    assert(cardsAudit.every(c => c.hasImg), 'All 6 cards have valid image elements');
    // Check no nested links on any card
    assert(cardsAudit.every(c => c.nestedLinksCount === 0), 'No card contains nested <a> tags');
    console.log('✓ All 6 service cards verified: PASS');

    // -------------------------------------------------------------
    // 3. VERIFY CARD 2 SPLIT NAVIGATION (MBBS / PhD)
    // -------------------------------------------------------------
    console.log('\n=== 3. Verifying Card 2 Split Navigation (MBBS left 50%, PhD right 50%) ===');
    const card2Audit = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('#services .grid > div.card-premium'));
      const card2 = cards[1];
      if (!card2) return { error: 'Card 2 not found' };

      const titleEl = card2.querySelector('h3');
      const titleLinks = titleEl ? titleEl.querySelectorAll('a') : [];

      const imgWrapper = card2.querySelector('.aspect-video');
      const img = imgWrapper ? imgWrapper.querySelector('img') : null;
      const splitLinks = Array.from(imgWrapper ? imgWrapper.querySelectorAll('a') : []);

      const mbbsLink = splitLinks.find(a => a.getAttribute('href') === '/services/mbbs/');
      const phdLink = splitLinks.find(a => a.getAttribute('href') === '/services/phd/');

      let mbbsRect = null;
      let phdRect = null;
      let imgRect = null;

      if (mbbsLink && phdLink && imgWrapper) {
        mbbsRect = mbbsLink.getBoundingClientRect();
        phdRect = phdLink.getBoundingClientRect();
        imgRect = imgWrapper.getBoundingClientRect();
      }

      // Check single card wrapper link absence
      const fullCardLinks = card2.querySelectorAll(':scope > a, a.after\\:inset-0');

      return {
        titleText: titleEl?.textContent.trim(),
        titleIsNonClickable: titleLinks.length === 0,
        hasImg: Boolean(img),
        imgSrc: img?.getAttribute('src'),
        splitLinksCount: splitLinks.length,
        hasMbbsLink: Boolean(mbbsLink),
        mbbsAriaLabel: mbbsLink?.getAttribute('aria-label'),
        hasPhdLink: Boolean(phdLink),
        phdAriaLabel: phdLink?.getAttribute('aria-label'),
        hasFullCardOverlay: fullCardLinks.length > 0,
        geometry: {
          wrapperWidth: imgRect ? Math.round(imgRect.width) : 0,
          wrapperHeight: imgRect ? Math.round(imgRect.height) : 0,
          mbbsWidth: mbbsRect ? Math.round(mbbsRect.width) : 0,
          mbbsLeft: mbbsRect ? Math.round(mbbsRect.left - imgRect.left) : 0,
          phdWidth: phdRect ? Math.round(phdRect.width) : 0,
          phdLeft: phdRect ? Math.round(phdRect.left - imgRect.left) : 0,
          totalWidthSum: (mbbsRect && phdRect) ? Math.round(mbbsRect.width + phdRect.width) : 0,
        },
      };
    });

    console.log('Card 2 Split Audit:', JSON.stringify(card2Audit, null, 2));
    results.splitCardAudit = card2Audit;

    assert(card2Audit.titleIsNonClickable, 'Card 2 title must be non-clickable (no <a> tags)');
    assert.strictEqual(card2Audit.titleText, 'MBBS / PhD Abroad', 'Card 2 title should be "MBBS / PhD Abroad"');
    assert(card2Audit.hasMbbsLink, 'Card 2 should have MBBS link (/services/mbbs/)');
    assert(card2Audit.hasPhdLink, 'Card 2 should have PhD link (/services/phd/)');
    assert.strictEqual(card2Audit.mbbsAriaLabel, 'Explore MBBS Abroad', 'MBBS link must have accessible name "Explore MBBS Abroad"');
    assert.strictEqual(card2Audit.phdAriaLabel, 'Explore PhD Abroad', 'PhD link must have accessible name "Explore PhD Abroad"');
    assert(!card2Audit.hasFullCardOverlay, 'Card 2 must not have a full-card redirect overlay');
    
    // Check 50/50 split geometry
    const geom = card2Audit.geometry;
    assert(Math.abs(geom.mbbsWidth - geom.wrapperWidth / 2) <= 1, `MBBS width (${geom.mbbsWidth}px) should be ~50% of wrapper (${geom.wrapperWidth / 2}px)`);
    assert(Math.abs(geom.phdWidth - geom.wrapperWidth / 2) <= 1, `PhD width (${geom.phdWidth}px) should be ~50% of wrapper (${geom.wrapperWidth / 2}px)`);
    assert(Math.abs(geom.totalWidthSum - geom.wrapperWidth) <= 1, 'Split links should seamlessly cover 100% of wrapper width without gaps');
    assert.strictEqual(geom.mbbsLeft, 0, 'MBBS link should start at left: 0');
    console.log('✓ Card 2 split image navigation (50/50, accessible, non-clickable title): PASS');

    // -------------------------------------------------------------
    // 4. TEST MOUSE, TOUCH & KEYBOARD INTERACTION ON CARD 2
    // -------------------------------------------------------------
    console.log('\n=== 4. Testing Mouse, Touch and Keyboard Interactions ===');
    
    // Test mouse click coordinates on MBBS (left 25% of image) and PhD (right 75% of image)
    const interactionAudit = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('#services .grid > div.card-premium'));
      const card2 = cards[1];
      const imgWrapper = card2.querySelector('.aspect-video');
      const rect = imgWrapper.getBoundingClientRect();

      // Find element at 25% width (left half)
      const leftTarget = document.elementFromPoint(rect.left + rect.width * 0.25, rect.top + rect.height * 0.5);
      const leftLink = leftTarget?.closest('a');

      // Find element at 75% width (right half)
      const rightTarget = document.elementFromPoint(rect.left + rect.width * 0.75, rect.top + rect.height * 0.5);
      const rightLink = rightTarget?.closest('a');

      // Find element at title
      const titleEl = card2.querySelector('h3');
      const tRect = titleEl.getBoundingClientRect();
      const titleTarget = document.elementFromPoint(tRect.left + 10, tRect.top + tRect.height * 0.5);
      const titleLink = titleTarget?.closest('a');

      return {
        leftClickHref: leftLink?.getAttribute('href'),
        leftClickAria: leftLink?.getAttribute('aria-label'),
        rightClickHref: rightLink?.getAttribute('href'),
        rightClickAria: rightLink?.getAttribute('aria-label'),
        titleClickHasLink: Boolean(titleLink),
      };
    });

    console.log('Interaction Target Audit:', interactionAudit);
    assert.strictEqual(interactionAudit.leftClickHref, '/services/mbbs/', 'Clicking left half of image must target /services/mbbs/');
    assert.strictEqual(interactionAudit.rightClickHref, '/services/phd/', 'Clicking right half of image must target /services/phd/');
    assert(!interactionAudit.titleClickHasLink, 'Clicking title must not trigger any navigation');
    console.log('✓ Mouse and touch target resolution: PASS');

    // Test keyboard focusability
    const keyboardAudit = await page.evaluate(async () => {
      const mbbsLink = document.querySelector('a[aria-label="Explore MBBS Abroad"]');
      const phdLink = document.querySelector('a[aria-label="Explore PhD Abroad"]');

      if (!mbbsLink || !phdLink) return { error: 'Links not found' };

      mbbsLink.focus();
      const mbbsFocused = document.activeElement === mbbsLink;

      phdLink.focus();
      const phdFocused = document.activeElement === phdLink;

      return {
        mbbsFocused,
        phdFocused,
      };
    });

    console.log('Keyboard Focus Audit:', keyboardAudit);
    assert(keyboardAudit.mbbsFocused, 'MBBS link must be focusable via keyboard');
    assert(keyboardAudit.phdFocused, 'PhD link must be focusable via keyboard');
    console.log('✓ Keyboard focusability: PASS');

    // -------------------------------------------------------------
    // 5. CAPTURE HIGH-RES SCREENSHOTS
    // -------------------------------------------------------------
    console.log('\n=== 5. Capturing High-Res Screenshots ===');
    const servicesEl = await page.$('#services');
    if (servicesEl) {
      const desktopShot = path.join(EVIDENCE_DIR, 'services-desktop-1440px.png');
      await servicesEl.screenshot({ path: desktopShot });
      results.screenshots.push('services-desktop-1440px.png');
      console.log('Saved:', desktopShot);
    }

    // Capture Card 2 specifically
    const cards = await page.$$('#services .card-premium');
    if (cards[1]) {
      const card2Shot = path.join(EVIDENCE_DIR, 'card-2-split-navigation-desktop.png');
      await cards[1].screenshot({ path: card2Shot });
      results.screenshots.push('card-2-split-navigation-desktop.png');
      console.log('Saved:', card2Shot);
    }

    // Mobile screenshot
    await page.setViewport({ width: 375, height: 812 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    const servicesMobile = await page.$('#services');
    if (servicesMobile) {
      const mobileShot = path.join(EVIDENCE_DIR, 'services-mobile-375px.png');
      await servicesMobile.screenshot({ path: mobileShot });
      results.screenshots.push('services-mobile-375px.png');
      console.log('Saved:', mobileShot);
    }

    // -------------------------------------------------------------
    // 6. MULTI-VIEWPORT AUDIT (320, 360, 390, 430, 768, 1024, 1366, 1440px)
    // -------------------------------------------------------------
    console.log('\n=== 6. Multi-Viewport Responsive & Split Geometry Audit ===');
    const targetViewports = [320, 360, 390, 430, 768, 1024, 1366, 1440];
    let allViewportsPass = true;

    for (const vpWidth of targetViewports) {
      await page.setViewport({ width: vpWidth, height: 850 });
      await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

      const vpAudit = await page.evaluate(() => {
        const docEl = document.documentElement;
        const body = document.body;
        const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
        const clientWidth = docEl.clientWidth;
        const hasOverflow = scrollWidth > clientWidth + 1;

        // Card 2 split geometry at this viewport
        const cards = Array.from(document.querySelectorAll('#services .grid > div.card-premium'));
        const card2 = cards[1];
        const imgWrapper = card2?.querySelector('.aspect-video');
        const mbbsLink = imgWrapper?.querySelector('a[href="/services/mbbs/"]');
        const phdLink = imgWrapper?.querySelector('a[href="/services/phd/"]');

        let geomOk = false;
        let wWidth = 0, mWidth = 0, pWidth = 0;
        if (imgWrapper && mbbsLink && phdLink) {
          const iRect = imgWrapper.getBoundingClientRect();
          const mRect = mbbsLink.getBoundingClientRect();
          const pRect = phdLink.getBoundingClientRect();
          wWidth = Math.round(iRect.width);
          mWidth = Math.round(mRect.width);
          pWidth = Math.round(pRect.width);
          // Check that left and right each take 50%
          geomOk = Math.abs(mWidth - wWidth / 2) <= 1 && Math.abs(pWidth - wWidth / 2) <= 1;
        }

        return {
          scrollWidth,
          clientWidth,
          hasOverflow,
          wWidth,
          mWidth,
          pWidth,
          geomOk,
        };
      });

      results.viewports[vpWidth] = vpAudit;
      if (vpAudit.hasOverflow) {
        console.error(`❌ Overflow at ${vpWidth}px!`);
        allViewportsPass = false;
      } else {
        console.log(`✓ ${vpWidth}px: No overflow (scrollWidth: ${vpAudit.scrollWidth}, clientWidth: ${vpAudit.clientWidth}), Card 2 split 50/50: ${vpAudit.geomOk} (wrapper: ${vpAudit.wWidth}px, mbbs: ${vpAudit.mWidth}px, phd: ${vpAudit.pWidth}px)`);
      }
    }

    results.allPass = !cleanupAudit.oldHeadingFound &&
                      !cleanupAudit.oldDescFound &&
                      !cleanupAudit.directoryBtnFound &&
                      card2Audit.hasMbbsLink &&
                      card2Audit.hasPhdLink &&
                      card2Audit.titleIsNonClickable &&
                      allViewportsPass;

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
