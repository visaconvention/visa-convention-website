import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');
const ARTIFACTS_DIR = 'C:/Users/ACER/.gemini/antigravity/brain/6a0361a6-ccbe-4f53-a463-b2d5ee259bd4/website-design-polish';
const PORT = 4398;

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
  320, 360, 375, 390, 430, 600, 768, 1024, 1100, 1280, 1366, 1440, 1920
];

const PAGES_TO_TEST = [
  '/',
  '/study-abroad/',
  '/study-abroad/canada/',
  '/services/mbbs/',
  '/services/phd/',
  '/services/study-visa/',
  '/services/tourist-visa/',
  '/services/work-visa/',
  '/services/flight-booking/',
  '/services/dummy-tickets/',
  '/services/additional-services/',
  '/about/',
  '/success-stories/',
  '/contact/',
  '/universities/',
];

async function main() {
  console.log('=== Starting Website Complete Design Audit & Polish Verification ===');

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
  // 1. HEADER & NAVIGATION AUDIT
  // =========================================================================
  console.log('\n--- 1. Testing Header & Navigation Consistency (Desktop & Mobile) ---');
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

  const headerMetrics = await page.evaluate(() => {
    const header = document.querySelector('header');
    const headerRect = header ? header.getBoundingClientRect() : null;
    const logo = document.querySelector('header a[href="/"]');
    const logoRect = logo ? logo.getBoundingClientRect() : null;
    const cta = document.querySelector('header a[href="/contact/"]');
    const ctaRect = cta ? cta.getBoundingClientRect() : null;
    const nav = document.querySelector('header nav[aria-label="Main Navigation"]');
    const navRect = nav ? nav.getBoundingClientRect() : null;

    const navItems = Array.from(document.querySelectorAll('header nav[aria-label="Main Navigation"] > *'));
    const items = navItems.map((el) => {
      const btn = el.querySelector('button') || el;
      const rect = btn.getBoundingClientRect();
      const chevron = btn.querySelector('.chevron-icon');
      const chevronRect = chevron ? chevron.getBoundingClientRect() : null;
      return {
        text: btn.innerText.replace(/\n/g, ' / ').trim(),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        top: Math.round(rect.top),
        chevronTop: chevronRect ? Math.round(chevronRect.top) : null,
      };
    });

    return {
      headerHeight: headerRect ? Math.round(headerRect.height) : null,
      logoTop: logoRect ? Math.round(logoRect.top) : null,
      ctaTop: ctaRect ? Math.round(ctaRect.top) : null,
      ctaHeight: ctaRect ? Math.round(ctaRect.height) : null,
      navTop: navRect ? Math.round(navRect.top) : null,
      items,
    };
  });

  assert(headerMetrics.headerHeight >= 74 && headerMetrics.headerHeight <= 78, `Header Height is consistent at 76px (actual: ${headerMetrics.headerHeight}px)`);
  assert(headerMetrics.ctaHeight === 44, `Consultation CTA button height strictly matches 44px nav items (actual: ${headerMetrics.ctaHeight}px)`);
  assert(headerMetrics.items.every(it => it.height === 44), 'All 6 navigation items have uniform 44px height for touch/click ergonomics');

  // Check two-line labels
  const studyAbroad = headerMetrics.items.find(i => i.text.includes('Study') && i.text.includes('Abroad'));
  const touristVisa = headerMetrics.items.find(i => i.text.includes('Tourist') && i.text.includes('Visa'));
  const workVisa = headerMetrics.items.find(i => i.text.includes('Work') && i.text.includes('Visa'));
  const additionalServices = headerMetrics.items.find(i => i.text.includes('Additional') && i.text.includes('Services'));
  const flights = headerMetrics.items.find(i => i.text.includes('Flights'));
  const about = headerMetrics.items.find(i => i.text.includes('About'));

  assert(studyAbroad && studyAbroad.text.includes('/'), 'Study Abroad is structured as a two-line label');
  assert(touristVisa && touristVisa.text.includes('/'), 'Tourist Visa is structured as a two-line label');
  assert(workVisa && workVisa.text.includes('/'), 'Work Visa is structured as a two-line label');
  assert(additionalServices && additionalServices.text.includes('/'), 'Additional Services is structured as a two-line label');
  assert(flights && !flights.text.includes('/'), 'Flights maintains clean single-line label');
  assert(about && !about.text.includes('/'), 'About maintains clean single-line label');

  // Verify dropdown chevrons
  assert(studyAbroad.chevronTop !== null && additionalServices.chevronTop !== null, 'Dropdown menus feature chevrons');
  assert(flights.chevronTop !== null && about.chevronTop !== null, 'Single-line dropdowns feature chevrons');

  // =========================================================================
  // 2. HOMEPAGE HERO, SERVICE CARDS & REVIEWS
  // =========================================================================
  console.log('\n--- 2. Auditing Homepage Layout, 6 Service Cards & Split MBBS/PhD ---');
  const homeMetrics = await page.evaluate(() => {
    // Hero checks
    const h1 = document.querySelector('h1');
    const heroCtas = Array.from(document.querySelectorAll('.hero-centered-section a'));

    // 6 Cards checks
    const cards = Array.from(document.querySelectorAll('#services .card-premium'));
    const cardImages = cards.map(c => c.querySelector('img')?.getAttribute('src'));
    const mbbsPhdCard = cards[1];
    const mbbsLink = mbbsPhdCard?.querySelector('a[href="/services/mbbs/"]');
    const phdLink = mbbsPhdCard?.querySelector('a[href="/services/phd/"]');

    // Reviews checks
    const reviewCards = Array.from(document.querySelectorAll('.review-card'));
    const marquee = document.getElementById('reviews-marquee-wrapper');
    const pauseBtn = document.getElementById('reviews-pause-toggle-btn');

    // Footer checks
    const footer = document.querySelector('footer');
    const socialLinks = Array.from(footer?.querySelectorAll('a[href*="facebook"], a[href*="instagram"], a[href*="youtube"]') || []);

    return {
      h1Text: h1?.innerText?.trim(),
      heroCtaCount: heroCtas.length,
      cardCount: cards.length,
      cardImages,
      hasMbbsSplit: Boolean(mbbsLink),
      hasPhdSplit: Boolean(phdLink),
      reviewCount: reviewCards.length,
      hasMarquee: Boolean(marquee),
      hasPauseBtn: Boolean(pauseBtn),
      socialCount: socialLinks.length,
    };
  });

  assert(homeMetrics.h1Text.includes('Explore the World') && homeMetrics.h1Text.includes('Visa Convention'), 'Hero H1 correctly renders "Explore the World with Visa Convention"');
  assert(homeMetrics.heroCtaCount === 2, 'Hero features exactly 2 balanced action CTAs');
  assert(homeMetrics.cardCount === 6, 'Services grid contains exactly 6 photographic cards');
  assert(homeMetrics.hasMbbsSplit && homeMetrics.hasPhdSplit, 'MBBS / PhD card retains both independent split clickable regions');
  assert(homeMetrics.reviewCount >= 6, `Reviews section retains all ${homeMetrics.reviewCount} client case studies`);
  assert(homeMetrics.hasMarquee && homeMetrics.hasPauseBtn, 'Reviews feature infinite right-to-left marquee with pause control');
  assert(homeMetrics.socialCount === 3, 'Footer includes verified social channels: Instagram | Facebook | YouTube');

  // =========================================================================
  // 3. TWO-COLUMN LAYOUT PROPORTIONS (~70:30 DESKTOP)
  // =========================================================================
  console.log('\n--- 3. Auditing Two-Column Layout Proportions (~70:30) Across Key Routes ---');
  const twoColRoutes = [
    { route: '/services/tourist-visa/', name: 'Tourist Visa' },
    { route: '/services/work-visa/', name: 'Work Visa' },
    { route: '/services/mbbs/', name: 'MBBS Abroad' },
    { route: '/services/phd/', name: 'PhD Abroad' },
    { route: '/services/study-visa/', name: 'Study Visa' },
    { route: '/study-abroad/canada/', name: 'Canada Destination' },
    { route: '/services/additional-services/', name: 'Additional Services Overview' },
    { route: '/services/dummy-tickets/', name: 'Dummy Tickets' },
  ];

  for (const item of twoColRoutes) {
    await page.goto(`http://localhost:${PORT}${item.route}`, { waitUntil: 'networkidle0' });
    const colMetrics = await page.evaluate(() => {
      const grid = document.querySelector('.grid.grid-cols-1.min-\\[1100px\\]\\:grid-cols-12') ||
                   document.querySelector('main .grid');
      if (!grid) return null;
      const left = grid.children[0]?.getBoundingClientRect();
      const right = grid.children[1]?.getBoundingClientRect();
      if (!left || !right) return null;
      const total = left.width + right.width;
      const leftPct = Math.round((left.width / total) * 100);
      const rightPct = Math.round((right.width / total) * 100);
      return { leftPct, rightPct, total: Math.round(total) };
    });

    if (colMetrics) {
      assert(
        colMetrics.leftPct >= 64 && colMetrics.leftPct <= 72,
        `${item.name} adheres to ~70:30 proportion (Left: ${colMetrics.leftPct}%, Right: ${colMetrics.rightPct}%)`
      );
    } else {
      assert(false, `${item.name}: Two-column grid not detected`);
    }
  }

  // =========================================================================
  // 4. EXPANDED-CARD BEHAVIOR & NON-STRETCHING
  // =========================================================================
  console.log('\n--- 4. Auditing Expanded-Card Behavior (Zero Neighbor Stretching) ---');
  await page.goto(`http://localhost:${PORT}/universities/`, { waitUntil: 'networkidle0' });
  const stretchTest = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.university-accordion-card'));
    if (cards.length < 2) return { pass: false, reason: 'insufficient cards' };

    const firstBtn = cards[0].querySelector('.uni-toggle-btn');
    const secondCardBefore = cards[1].getBoundingClientRect().height;

    // Expand first card
    firstBtn.click();
    const firstCardHeightExpanded = cards[0].getBoundingClientRect().height;
    const secondCardAfter = cards[1].getBoundingClientRect().height;

    return {
      firstCardExpanded: firstCardHeightExpanded > 60,
      secondCardStretched: Math.abs(secondCardAfter - secondCardBefore) > 5,
      secondCardBefore: Math.round(secondCardBefore),
      secondCardAfter: Math.round(secondCardAfter),
    };
  });

  assert(stretchTest.firstCardExpanded, 'University card expands smoothly on click');
  assert(!stretchTest.secondCardStretched, `Neighbor card height remains stable when card expands (before: ${stretchTest.secondCardBefore}px, after: ${stretchTest.secondCardAfter}px)`);

  // =========================================================================
  // 5. RESPONSIVE TESTING ACROSS ALL 13 SPECIFIED VIEWPORTS
  // =========================================================================
  console.log('\n--- 5. Testing ALL 13 Specified Viewports for Horizontal Overflow ---');
  // Specified viewports: 320, 360, 375, 390, 430, 600, 768, 1024, 1100, 1280, 1366, 1440, 1920px
  let allViewportsPass = true;
  for (const vp of VIEWPORTS) {
    await page.setViewport({ width: vp, height: 800 });
    let vpHasOverflow = false;

    for (const pagePath of PAGES_TO_TEST) {
      await page.goto(`http://localhost:${PORT}${pagePath}`, { waitUntil: 'networkidle0' });
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      if (overflow) {
        vpHasOverflow = true;
        allViewportsPass = false;
        console.error(`  [FAIL] Overflow on ${pagePath} @ ${vp}px`);
      }
    }

    assert(!vpHasOverflow, `Viewport ${vp}px: Zero horizontal overflow across representative pages`);
  }

  // =========================================================================
  // 6. CAPTURING HIGH-RES SCREENSHOT ARTIFACTS
  // =========================================================================
  console.log('\n--- 6. Capturing High-Res Verification Screenshots ---');

  // Desktop (1366px)
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
  const desktopHome = path.join(ARTIFACTS_DIR, 'polished-homepage-desktop-1366px.png');
  await page.screenshot({ path: desktopHome, fullPage: true });
  console.log('  Saved polished-homepage-desktop-1366px.png');

  // Services Grid Close-Up (1366px)
  const servicesGridImg = path.join(ARTIFACTS_DIR, 'polished-services-grid-1366px.png');
  await page.screenshot({ path: servicesGridImg, clip: { x: 0, y: 500, width: 1366, height: 750 } });
  console.log('  Saved polished-services-grid-1366px.png');

  // Tourist Visa 70:30 Desktop (1366px)
  await page.goto(`http://localhost:${PORT}/services/tourist-visa/`, { waitUntil: 'networkidle0' });
  const touristDesktop = path.join(ARTIFACTS_DIR, 'polished-tourist-visa-70-30-desktop.png');
  await page.screenshot({ path: touristDesktop, fullPage: true });
  console.log('  Saved polished-tourist-visa-70-30-desktop.png');

  // Work Visa 70:30 Desktop (1366px)
  await page.goto(`http://localhost:${PORT}/services/work-visa/`, { waitUntil: 'networkidle0' });
  const workDesktop = path.join(ARTIFACTS_DIR, 'polished-work-visa-70-30-desktop.png');
  await page.screenshot({ path: workDesktop, fullPage: true });
  console.log('  Saved polished-work-visa-70-30-desktop.png');

  // Canada Country Page Desktop (1366px)
  await page.goto(`http://localhost:${PORT}/study-abroad/canada/`, { waitUntil: 'networkidle0' });
  const canadaDesktop = path.join(ARTIFACTS_DIR, 'polished-country-page-desktop.png');
  await page.screenshot({ path: canadaDesktop, fullPage: true });
  console.log('  Saved polished-country-page-desktop.png');

  // Mobile (375px) - Homepage
  await page.setViewport({ width: 375, height: 667 });
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
  const mobileHome = path.join(ARTIFACTS_DIR, 'polished-homepage-mobile-375px.png');
  await page.screenshot({ path: mobileHome, fullPage: true });
  console.log('  Saved polished-homepage-mobile-375px.png');

  // Mobile (375px) - Tourist Visa
  await page.goto(`http://localhost:${PORT}/services/tourist-visa/`, { waitUntil: 'networkidle0' });
  const mobileTourist = path.join(ARTIFACTS_DIR, 'polished-tourist-visa-mobile-375px.png');
  await page.screenshot({ path: mobileTourist, fullPage: true });
  console.log('  Saved polished-tourist-visa-mobile-375px.png');

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
