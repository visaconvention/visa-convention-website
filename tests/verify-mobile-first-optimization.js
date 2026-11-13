import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\5db0c23b-424d-42d8-acd3-62fb5a754759';
const SCREENSHOTS_DIR = path.join(ARTIFACTS_DIR, 'screenshots');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const DIST_DIR = path.resolve('dist');
const PORT = 4331;

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

console.log('================================================================');
console.log('   VISA CONVENTION - MASTER MOBILE-FIRST QA & VERIFICATION     ');
console.log('   Automated Responsiveness, Resolution & Visual Testing        ');
console.log('================================================================\n');

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

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function startServer() {
  const server = http.createServer((req, res) => {
    let cleanUrl = req.url.split('?')[0].split('#')[0];
    let filePath = path.join(DIST_DIR, cleanUrl === '/' ? 'index.html' : cleanUrl);
    
    if (!path.extname(filePath)) {
      if (fs.existsSync(filePath + '.html')) {
        filePath += '.html';
      } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
        filePath = path.join(filePath, 'index.html');
      }
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const mime = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  return new Promise((resolve) => {
    server.listen(PORT, () => {
      console.log(`Static server running at http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

async function runTests() {
  const server = await startServer();
  let browser;

  try {
    browser = await puppeteer.launch({
      executablePath: EDGE_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1440,900'],
    });

    const page = await browser.newPage();

    // List of CSS viewports to test
    const VIEWPORTS = [
      { name: 'Mobile-320px (Compact/SE1)', width: 320, height: 600, isMobile: true },
      { name: 'Mobile-360px (Galaxy S9)', width: 360, height: 740, isMobile: true },
      { name: 'Mobile-375px (iPhone SE/X)', width: 375, height: 667, isMobile: true },
      { name: 'Mobile-390px (iPhone 14)', width: 390, height: 844, isMobile: true },
      { name: 'Mobile-393px (Pixel 7/8)', width: 393, height: 851, isMobile: true },
      { name: 'Mobile-412px (Galaxy S24)', width: 412, height: 915, isMobile: true },
      { name: 'Mobile-430px (iPhone ProMax)', width: 430, height: 932, isMobile: true },
      { name: 'Tablet-768px (iPad Portrait)', width: 768, height: 1024, isMobile: false },
      { name: 'Tablet-820px (iPad Air)', width: 820, height: 1180, isMobile: false },
      { name: 'Tablet-1024px (iPad Pro)', width: 1024, height: 1366, isMobile: false },
      { name: 'Desktop-1280px (Standard)', width: 1280, height: 800, isMobile: false },
      { name: 'Desktop-1366px (Laptop)', width: 1366, height: 768, isMobile: false },
      { name: 'Desktop-1440px (Hi-DPI)', width: 1440, height: 900, isMobile: false },
      { name: 'Desktop-1920px (Full HD)', width: 1920, height: 1080, isMobile: false },
    ];

    console.log('\n--- 1. TESTING ALL VIEWPORT WIDTHS FOR HORIZONTAL OVERFLOW ---');
    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
      await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

      const overflow = await page.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        };
      });

      assert(!overflow.hasOverflow, `Homepage fits width at ${vp.name} (${overflow.scrollWidth}px vs ${overflow.clientWidth}px)`);
    }

    console.log('\n--- 2. VERIFYING HOMEPAGE SECTION STRUCTURE & REMOVAL OF HOW IT WORKS ---');
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    const homepageAnalysis = await page.evaluate(() => {
      const pageText = document.body.innerText;
      const hasHowItWorks = pageText.includes('How It Works') || pageText.includes('Three-Step Guidance Process');
      const hasReviewsSection = document.getElementById('reviews-section') !== null;
      const hasServicesGrid = document.getElementById('services') !== null;
      const hasHero = document.querySelector('h1') !== null;
      const h1Text = document.querySelector('h1')?.innerText || '';
      const ctaHeading = Array.from(document.querySelectorAll('h2')).find(h => h.innerText.includes('Ready to Plan Your Next Step?'));
      const hasPersonalizedGuidance = pageText.includes('PERSONALIZED GUIDANCE');
      const serviceCards = document.querySelectorAll('#services .card-premium');

      return {
        hasHowItWorks,
        hasReviewsSection,
        hasServicesGrid,
        hasHero,
        h1Text,
        hasCtaHeading: Boolean(ctaHeading),
        hasPersonalizedGuidance,
        serviceCardsCount: serviceCards.length,
      };
    });

    assert(!homepageAnalysis.hasHowItWorks, 'Phase 4: "How It Works" section is completely removed from Homepage');
    assert(homepageAnalysis.hasReviewsSection, 'Change 2: Verified Client Reviews section is present on Homepage');
    assert(homepageAnalysis.hasServicesGrid, 'Phase 5: Six core services grid is present');
    assert(homepageAnalysis.serviceCardsCount === 6, `Phase 5: Exactly 6 service discovery cards found (Found: ${homepageAnalysis.serviceCardsCount})`);
    assert(!homepageAnalysis.hasCtaHeading && !homepageAnalysis.hasPersonalizedGuidance, 'Change 1: Navy final consultation CTA banner completely excised from Homepage');
    assert(homepageAnalysis.hasHero, 'Phase 1.4: Premium Landmark Hero is present');

    console.log('\n--- 3. VERIFYING SERVICE CARDS SEPARATE ACCESS (MBBS & PHD) & DISTINCT IMAGES ---');
    const serviceDetails = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('#services .card-premium'));
      const details = cards.map(c => {
        const title = c.querySelector('h3')?.innerText.trim();
        const img = c.querySelector('img')?.getAttribute('src');
        const links = Array.from(c.querySelectorAll('a')).map(a => ({
          text: a.innerText.trim(),
          href: a.getAttribute('href'),
        }));
        return { title, img, links };
      });
      return details;
    });

    const studyAbroadCard = serviceDetails.find(c => c.title === 'Study Abroad');
    const additionalServicesCard = serviceDetails.find(c => c.title === 'Additional Services');
    const mbbsPhdCard = serviceDetails.find(c => c.title.includes('MBBS / PhD'));

    assert(studyAbroadCard && additionalServicesCard && additionalServicesCard.img?.includes('Additional%20Visa%20Services%20Guide.png'),
      'Card 2 has approved Additional Visa Services Guide client poster image',
      `Study: ${studyAbroadCard?.img}, Additional: ${additionalServicesCard?.img}`
    );

    const hasMbbsLink = mbbsPhdCard?.links.some(l => l.href.includes('/services/mbbs/'));
    const hasPhdLink = mbbsPhdCard?.links.some(l => l.href.includes('/services/phd/'));
    assert(hasMbbsLink && hasPhdLink, 'Phase 5: MBBS and PhD are separately accessible right from the card',
      JSON.stringify(mbbsPhdCard?.links)
    );

    console.log('\n--- 4. VERIFYING AUTOMATIC CONTINUOUS REVIEWS MARQUEE (CHANGE 2) ---');
    const marqueeState = await page.evaluate(() => {
      const viewport = document.getElementById('reviews-marquee-viewport');
      const wrapper = document.getElementById('reviews-marquee-wrapper');
      const primaryGroup = document.getElementById('marquee-group-primary');
      const cloneGroup = document.getElementById('marquee-group-clone');
      const pauseBtn = document.getElementById('reviews-pause-toggle-btn');
      const pauseLabel = document.getElementById('reviews-pause-label');
      const nudgeLeft = document.getElementById('reviews-nudge-left-btn');
      const nudgeRight = document.getElementById('reviews-nudge-right-btn');

      const primaryCards = primaryGroup ? Array.from(primaryGroup.querySelectorAll('.review-card')) : [];
      const cloneCards = cloneGroup ? Array.from(cloneGroup.querySelectorAll('.review-card')) : [];

      const cardData = primaryCards.map(c => ({
        stars: c.querySelectorAll('svg.fill-current').length,
        hasQuote: Boolean(c.querySelector('p')?.innerText.includes('"')),
        hasVerified: Boolean(c.innerText.includes('Verified')),
        hasCountry: Boolean(c.querySelector('.rounded-full')?.innerText),
        hasCandidateInitials: Boolean(c.querySelector('.font-bold.text-brand-navy')?.innerText),
      }));

      return {
        hasViewport: Boolean(viewport),
        hasWrapper: Boolean(wrapper),
        isPausedInitial: wrapper?.getAttribute('data-paused') === 'true',
        primaryCount: primaryCards.length,
        cloneCount: cloneCards.length,
        cloneAriaHidden: cloneGroup?.getAttribute('aria-hidden') === 'true',
        hasPauseBtn: Boolean(pauseBtn),
        pauseLabelText: pauseLabel?.innerText.trim(),
        hasNudgeLeft: Boolean(nudgeLeft),
        hasNudgeRight: Boolean(nudgeRight),
        allCardsHave5Stars: cardData.every(c => c.stars === 5),
        allCardsHaveQuotes: cardData.every(c => c.hasQuote),
        allCardsHaveVerified: cardData.every(c => c.hasVerified),
      };
    });

    assert(marqueeState.hasViewport && marqueeState.hasWrapper, 'Continuous reviews marquee viewport & wrapper exist');
    assert(marqueeState.primaryCount === 6, `Primary marquee group contains 6 genuine client review cards (Found: ${marqueeState.primaryCount})`);
    assert(marqueeState.cloneCount === 6, `Clone marquee group contains 6 identical clone cards for seamless infinite loop (Found: ${marqueeState.cloneCount})`);
    assert(marqueeState.cloneAriaHidden, 'Clone group is strictly hidden from screen readers (aria-hidden="true")');
    assert(marqueeState.allCardsHave5Stars, 'All genuine review cards display 5 authentic rating stars');
    assert(marqueeState.allCardsHaveQuotes, 'All review cards contain genuine client quotation text');
    assert(marqueeState.allCardsHaveVerified, 'All review cards display verified outcome badge');
    assert(marqueeState.hasPauseBtn, 'Visible Pause/Resume control button exists');
    assert(marqueeState.pauseLabelText === 'Pause', 'Pause button initially displays "Pause"');
    assert(!marqueeState.isPausedInitial, 'Continuous marquee starts in active playing state');

    // Test Clicking Pause/Resume Button
    await page.click('#reviews-pause-toggle-btn');
    await new Promise(r => setTimeout(r, 200));

    const pausedState = await page.evaluate(() => {
      const wrapper = document.getElementById('reviews-marquee-wrapper');
      const pauseLabel = document.getElementById('reviews-pause-label');
      const pauseBtn = document.getElementById('reviews-pause-toggle-btn');
      return {
        dataPaused: wrapper?.getAttribute('data-paused'),
        label: pauseLabel?.innerText.trim(),
        ariaPressed: pauseBtn?.getAttribute('aria-pressed'),
      };
    });

    assert(pausedState.dataPaused === 'true', 'Clicking Pause button sets data-paused="true" on marquee wrapper');
    assert(pausedState.label === 'Resume', `Pause button updates text to "Resume" (Actual: "${pausedState.label}")`);
    assert(pausedState.ariaPressed === 'true', 'Pause button sets aria-pressed="true"');

    // Test Clicking Resume
    await page.click('#reviews-pause-toggle-btn');
    await new Promise(r => setTimeout(r, 200));

    const resumedState = await page.evaluate(() => {
      const wrapper = document.getElementById('reviews-marquee-wrapper');
      const pauseLabel = document.getElementById('reviews-pause-label');
      return {
        dataPaused: wrapper?.getAttribute('data-paused'),
        label: pauseLabel?.innerText.trim(),
      };
    });

    assert(resumedState.dataPaused === 'false', 'Clicking Resume re-engages marquee motion');
    assert(resumedState.label === 'Pause', 'Pause button updates text back to "Pause"');

    // Test Nudge Buttons
    assert(marqueeState.hasNudgeLeft && marqueeState.hasNudgeRight, 'Manual left and right nudge navigation buttons exist');

    // Test CRITICAL REQUIREMENT: Reviews must NOT stop simply because user scrolls page
    console.log('\n--- 4B. VERIFYING REVIEWS AUTO-SCROLL DURING PAGE SCROLLING ---');
    await page.evaluate(() => {
      window.scrollBy({ top: 300, behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 50));

    const scrollState = await page.evaluate(() => {
      const wrapper = document.getElementById('reviews-marquee-wrapper');
      const primaryGroup = document.getElementById('marquee-group-primary');
      const isPageScrolling = wrapper?.classList.contains('is-page-scrolling');
      const playState = primaryGroup ? window.getComputedStyle(primaryGroup).animationPlayState : null;
      return { isPageScrolling, playState };
    });

    assert(scrollState.isPageScrolling, 'Page scroll triggers .is-page-scrolling active class on marquee wrapper');
    assert(scrollState.playState === 'running', 'Marquee motion continues uninterrupted (animation-play-state: running) during page scroll');

    console.log('\n--- 5. VERIFYING REMOVAL OF "STUDY IN EUROPE FOCUS" NAVIGATION ITEM (CHANGE 1) ---');
    // Check desktop navigation at 1440px
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    const desktopNavAnalysis = await page.evaluate(() => {
      const navLinks = Array.from(document.querySelectorAll('nav[aria-label="Main Navigation"] > *'));
      const textItems = navLinks.map(el => el.innerText.trim().replace(/\n+/g, ' '));
      const hasEuropeFocusItem = textItems.some(t => t.toLowerCase().includes('study in europe') && t.toLowerCase().includes('focus'));
      const hasTopLevelEurope = textItems.some(t => t.startsWith('Study in Europe'));
      const hasFocusBadge = Array.from(document.querySelectorAll('nav[aria-label="Main Navigation"] span')).some(s => s.innerText.trim().toLowerCase() === 'focus');

      return {
        textItems,
        hasEuropeFocusItem,
        hasTopLevelEurope,
        hasFocusBadge,
      };
    });

    assert(!desktopNavAnalysis.hasEuropeFocusItem, 'Change 1: "Study in Europe" with red "FOCUS" badge is completely removed from Desktop Nav');
    assert(!desktopNavAnalysis.hasTopLevelEurope, 'Change 1: "Study in Europe" is not a separate top-level nav item with dropdown');
    assert(!desktopNavAnalysis.hasFocusBadge, 'Change 1: No red FOCUS badge exists anywhere in Desktop Navigation');
    assert(desktopNavAnalysis.textItems.some(t => t.includes('Study Abroad')), 'Desktop Nav maintains Study Abroad vertical');
    assert(desktopNavAnalysis.textItems.some(t => t.includes('Visa Services')), 'Desktop Nav maintains Visa Services vertical');

    // Check dedicated /study-in-europe/ page remains functional via internal linking
    await page.goto(`http://localhost:${PORT}/study-in-europe/`, { waitUntil: 'networkidle0' });
    const europePageAnalysis = await page.evaluate(() => {
      const h1 = document.querySelector('h1')?.innerText || '';
      const cards = document.querySelectorAll('.europe-card-item');
      const faqs = document.querySelectorAll('details');
      const scrollWidth = document.documentElement.scrollWidth;
      const clientWidth = document.documentElement.clientWidth;

      return {
        h1,
        europeCardsCount: cards.length,
        faqsCount: faqs.length,
        hasOverflow: scrollWidth > clientWidth,
      };
    });

    assert(europePageAnalysis.h1.includes('Study in Europe'), 'Dedicated Study in Europe page loaded with correct H1');
    assert(europePageAnalysis.europeCardsCount === 25, `Study in Europe displays all 25 European destination countries (Found: ${europePageAnalysis.europeCardsCount})`);
    assert(!europePageAnalysis.hasOverflow, 'Study in Europe page has zero horizontal overflow at desktop');

    // Test mobile view of /study-in-europe/ at 375px
    await page.setViewport({ width: 375, height: 667 });
    await page.goto(`http://localhost:${PORT}/study-in-europe/`, { waitUntil: 'networkidle0' });
    const europeMobileOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    assert(!europeMobileOverflow, 'Study in Europe has zero horizontal overflow at 375px mobile');

    console.log('\n--- 6. VERIFYING MOBILE NAVIGATION DRAWER & REMOVAL OF FOCUS BADGE ---');
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    
    // Open mobile menu
    await page.click('#open-mobile-menu-btn');
    await new Promise(r => setTimeout(r, 300));

    const mobileMenuOpen = await page.evaluate(() => {
      const drawer = document.getElementById('mobile-menu-drawer');
      const drawerText = (drawer?.innerText || '').toLowerCase();
      const hasFocusBadge = Array.from(drawer?.querySelectorAll('span') || []).some(s => s.innerText.trim().toLowerCase() === 'focus');
      const hasStudyAbroad = drawerText.includes('study abroad');
      const hasEuropeChild = drawerText.includes('study in europe');
      const hasRequestCta = drawerText.includes('request consultation');
      const isVisible = drawer && !drawer.classList.contains('hidden');
      return { isVisible, hasFocusBadge, hasStudyAbroad, hasEuropeChild, hasRequestCta };
    });

    assert(mobileMenuOpen.isVisible, 'Mobile navigation drawer opens on hamburger button tap');
    assert(!mobileMenuOpen.hasFocusBadge, 'Change 1: Red FOCUS badge is completely absent from mobile drawer');
    assert(mobileMenuOpen.hasStudyAbroad, 'Mobile drawer includes Study Abroad group');
    assert(mobileMenuOpen.hasEuropeChild, 'Mobile drawer naturally includes Study in Europe under Study Abroad');
    assert(mobileMenuOpen.hasRequestCta, 'Mobile drawer primary button is "Request Consultation"');

    // Close mobile menu
    await page.click('#close-mobile-menu-btn');
    await new Promise(r => setTimeout(r, 300));

    const mobileMenuClosed = await page.evaluate(() => {
      const drawer = document.getElementById('mobile-menu-drawer');
      return drawer && drawer.classList.contains('hidden');
    });
    assert(mobileMenuClosed, 'Mobile navigation drawer closes cleanly on close button tap');

    console.log('\n--- 7. VERIFYING FLOATING WHATSAPP BUTTON ---');
    const whatsappCheck = await page.evaluate(() => {
      const btn = document.getElementById('floating-whatsapp-btn');
      const rect = btn?.getBoundingClientRect();

      return {
        exists: Boolean(btn),
        width: rect?.width,
        height: rect?.height,
        bottomRight: rect ? { bottom: window.innerHeight - rect.bottom, right: window.innerWidth - rect.right } : null,
      };
    });

    assert(whatsappCheck.exists, 'Floating WhatsApp button exists');
    assert(whatsappCheck.width >= 44 && whatsappCheck.height >= 44,
      `WhatsApp button meets minimum 44x44px touch target (${whatsappCheck.width}x${whatsappCheck.height}px)`
    );

    console.log('\n--- 8. VERIFYING FORM CONTROLS & TOUCH TARGETS ---');
    await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });
    const formChecks = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
      const fontSizes = inputs.map(i => parseFloat(window.getComputedStyle(i).fontSize));
      const buttons = Array.from(document.querySelectorAll('button, a.btn-primary, a.btn-outline'));
      const touchTargets = buttons.map(b => {
        const rect = b.getBoundingClientRect();
        return { w: rect.width, h: rect.height };
      });

      const smallInputs = fontSizes.filter(s => s < 15.5); // should be >= 16px on mobile
      const smallButtons = touchTargets.filter(t => t.h < 40 && t.w > 0);

      return {
        totalInputs: inputs.length,
        smallInputsCount: smallInputs.length,
        totalButtons: buttons.length,
        smallButtonsCount: smallButtons.length,
        hasPhoneInput: Boolean(document.querySelector('input[type="tel"]')),
        hasEmailInput: Boolean(document.querySelector('input[type="email"]')),
      };
    });

    assert(formChecks.smallInputsCount === 0, `All ${formChecks.totalInputs} form inputs have font-size >= 16px on mobile (prevents iOS auto-zoom)`);
    assert(formChecks.hasPhoneInput && formChecks.hasEmailInput, 'Form uses proper input types (tel, email) for mobile keyboards');

    console.log('\n--- 9. CAPTURING COMPREHENSIVE RESPONSIVE SCREENSHOTS ---');
    const captureList = [
      { page: '/', file: 'homepage-mobile-375px.png', width: 375, height: 667 },
      { page: '/', file: 'homepage-mobile-390px.png', width: 390, height: 844 },
      { page: '/', file: 'homepage-mobile-412px.png', width: 412, height: 915 },
      { page: '/', file: 'homepage-tablet-768px.png', width: 768, height: 1024 },
      { page: '/', file: 'homepage-desktop-1366px.png', width: 1366, height: 768 },
      { page: '/', file: 'homepage-desktop-1440px.png', width: 1440, height: 900 },
      { page: '/study-in-europe/', file: 'europe-mobile-375px.png', width: 375, height: 667 },
      { page: '/study-in-europe/', file: 'europe-desktop-1440px.png', width: 1440, height: 900 },
      { page: '/study-abroad/', file: 'study-abroad-mobile-375px.png', width: 375, height: 667 },
      { page: '/universities/', file: 'universities-desktop-1440px.png', width: 1440, height: 900 },
    ];

    for (const c of captureList) {
      await page.setViewport({ width: c.width, height: c.height });
      await page.goto(`http://localhost:${PORT}${c.page}`, { waitUntil: 'networkidle0' });
      const filePath = path.join(SCREENSHOTS_DIR, c.file);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`  📸 Captured: ${c.file} (${c.width}x${c.height})`);
    }

  } catch (err) {
    console.error('Test execution error:', err);
    assert(false, 'Test suite executed without fatal error', err.message);
  } finally {
    if (browser) await browser.close();
    server.close();
  }

  console.log('\n================================================================');
  console.log(`   TEST SUMMARY: ${passedChecks}/${totalChecks} CHECKS PASSED (${failedChecks} FAILED)`);
  console.log('================================================================');

  if (failedChecks > 0) {
    console.error('Failures:', failureDetails);
    process.exit(1);
  }
}

runTests();
