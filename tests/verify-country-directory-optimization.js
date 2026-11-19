/**
 * tests/verify-country-directory-optimization.js
 * 
 * Comprehensive Automated Verification Suite for:
 * VISA CONVENTION — COUNTRY DIRECTORY & IMAGE OPTIMIZATION
 * 
 * Verifies:
 * 1. Consultation CTA section removal from /study-abroad/
 * 2. 5-column responsive grid layout on desktop (>=1200px)
 * 3. 3-column layout on tablet (768-1199px)
 * 4. 2-column layout on mobile (<768px)
 * 5. Replacement of country photos with official SVG flags sitewide
 * 6. Card structure: flag, country name, navigation indicator, entire card clickable
 * 7. Search & filter interactivity
 * 8. Zero horizontal overflow across 9 viewports
 * 9. High-res visual screenshot capture
 */

import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\6a0361a6-ccbe-4f53-a463-b2d5ee259bd4\\country-directory';
const PORT = 4398;

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
  '.webp': 'image/webp',
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

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message, details = '') {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message} - ${details}`);
    failedTests++;
  }
}

async function runVerification() {
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`\n===============================================================`);
  console.log(`  COUNTRY DIRECTORY & IMAGE OPTIMIZATION VERIFICATION SUITE  `);
  console.log(`===============================================================\n`);

  // -------------------------------------------------------------------------
  // MODULE 1: Static HTML & Asset Audit
  // -------------------------------------------------------------------------
  console.log('--- MODULE 1: Static HTML & Flag Asset Verification ---');
  
  const studyAbroadHtml = fs.readFileSync(path.join(DIST, 'study-abroad/index.html'), 'utf8');

  // Requirement 1: Consultation section removed
  assert(
    !studyAbroadHtml.includes('Need Advice on the Best Country for Your Career & Budget?'),
    'Consultation heading completely removed from /study-abroad/'
  );
  assert(
    !studyAbroadHtml.includes('Personalized Guidance'),
    '"Personalized Guidance" badge completely removed from /study-abroad/'
  );
  assert(
    !studyAbroadHtml.includes('Our experienced advisors evaluate your transcripts, backlog history'),
    'Consultation descriptive copy completely removed from /study-abroad/'
  );

  // Preserve global consultation and WhatsApp buttons
  assert(
    studyAbroadHtml.includes('id="whatsapp-chat-button"') || studyAbroadHtml.includes('Chat on WhatsApp') || studyAbroadHtml.includes('whatsapp'),
    'Global WhatsApp button preserved on /study-abroad/'
  );
  assert(
    studyAbroadHtml.includes('/contact/'),
    'Global consultation navigation links preserved on /study-abroad/'
  );

  // Requirement 3: SVG Flag Assets
  const flagsDir = path.resolve('public/assets/flags');
  const flagFiles = fs.readdirSync(flagsDir).filter(f => f.endsWith('.svg'));
  assert(
    flagFiles.length >= 50,
    `Official SVG flag library contains all destination flags (Found: ${flagFiles.length} flags)`
  );

  // Check critical flags
  assert(fs.existsSync(path.join(flagsDir, 'ca.svg')), 'Canada flag exists (ca.svg)');
  assert(fs.existsSync(path.join(flagsDir, 'gb.svg')), 'UK flag exists (gb.svg)');
  assert(fs.existsSync(path.join(flagsDir, 'de.svg')), 'Germany flag exists (de.svg)');
  assert(fs.existsSync(path.join(flagsDir, 'ae.svg')), 'UAE flag exists (ae.svg)');
  assert(fs.existsSync(path.join(flagsDir, 'us.svg')), 'USA flag exists (us.svg)');
  assert(fs.existsSync(path.join(flagsDir, 'au.svg')), 'Australia flag exists (au.svg)');

  // Requirement 3: Centralized database flags
  const countriesData = JSON.parse(fs.readFileSync('client-content/countries/countries.json', 'utf8'));
  const allCountriesHaveFlag = countriesData.countries.every(c => c.flagSvg && c.flagSvg.endsWith('.svg'));
  assert(
    allCountriesHaveFlag,
    'All countries in countries.json have centralized flagSvg referencing official SVGs'
  );

  // Requirement 3: No country photos inside country cards
  const cardPhotoUsage = (studyAbroadHtml.match(/src="\/assets\/images\/destinations\/[^"]+\.(jpg|webp)"/g) || []);
  assert(
    cardPhotoUsage.length === 0,
    'Zero country destination photos used in /study-abroad/ directory cards',
    `Found: ${cardPhotoUsage.length} photo occurrences`
  );

  // Requirement 3: Flag images used in cards
  const cardFlagUsage = (studyAbroadHtml.match(/src="\/assets\/flags\/[a-z]{2}\.svg"/g) || []);
  assert(
    cardFlagUsage.length >= 35,
    `Country directory cards display official SVG flags (Found: ${cardFlagUsage.length} flag images in HTML)`
  );

  // -------------------------------------------------------------------------
  // MODULE 2: Browser Responsive Grid Verification (Edge Headless)
  // -------------------------------------------------------------------------
  console.log('\n--- MODULE 2: Browser Responsive Grid & Layout Verification ---');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  // Test Desktop Viewport (1440px): Exactly 5 Columns
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:${PORT}/study-abroad/`, { waitUntil: 'networkidle0' });

  const desktopColCount = await page.evaluate(() => {
    const grid = document.getElementById('countries-grid');
    if (!grid) return 0;
    const style = window.getComputedStyle(grid);
    const columns = style.gridTemplateColumns.trim().split(/\s+/);
    return columns.length;
  });
  assert(
    desktopColCount === 5,
    'Desktop viewport (1440px >= 1200px) displays exactly 5 columns per row',
    `Computed columns: ${desktopColCount}`
  );

  // Row alignment check: Cards 1 through 5 on Row 1, Card 6 on Row 2
  const desktopRowLayout = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#countries-grid > div'));
    if (cards.length < 6) return null;
    const tops = cards.slice(0, 5).map(c => Math.round(c.getBoundingClientRect().top));
    const card6Top = Math.round(cards[5].getBoundingClientRect().top);
    const allSameTop = tops.every(t => Math.abs(t - tops[0]) <= 2);
    return { allSameTop, row1Top: tops[0], row2Top: card6Top };
  });
  assert(
    desktopRowLayout && desktopRowLayout.allSameTop && desktopRowLayout.row2Top > desktopRowLayout.row1Top,
    'Desktop grid cleanly places exactly 5 cards on Row 1, with Card 6 positioned on Row 2'
  );

  // Test Standard Desktop (1200px breakpoint): Exactly 5 Columns
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto(`http://localhost:${PORT}/study-abroad/`, { waitUntil: 'networkidle0' });
  const bp1200ColCount = await page.evaluate(() => {
    const grid = document.getElementById('countries-grid');
    return grid ? window.getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length : 0;
  });
  assert(
    bp1200ColCount === 5,
    'Desktop boundary viewport (1200px) displays exactly 5 columns per row',
    `Computed columns: ${bp1200ColCount}`
  );

  // Test Tablet Viewports (1024px & 768px): Exactly 3 Columns
  await page.setViewport({ width: 1024, height: 768 });
  const tablet1024ColCount = await page.evaluate(() => {
    const grid = document.getElementById('countries-grid');
    return grid ? window.getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length : 0;
  });
  assert(
    tablet1024ColCount === 3,
    'Tablet viewport (1024px) displays exactly 3 columns per row',
    `Computed columns: ${tablet1024ColCount}`
  );

  await page.setViewport({ width: 768, height: 1024 });
  const tablet768ColCount = await page.evaluate(() => {
    const grid = document.getElementById('countries-grid');
    return grid ? window.getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length : 0;
  });
  assert(
    tablet768ColCount === 3,
    'Tablet boundary viewport (768px) displays exactly 3 columns per row',
    `Computed columns: ${tablet768ColCount}`
  );

  // Test Mobile Viewports: Exactly 2 Columns
  const mobileWidths = [430, 390, 375, 360, 320];
  for (const w of mobileWidths) {
    await page.setViewport({ width: w, height: 800 });
    const mobColCount = await page.evaluate(() => {
      const grid = document.getElementById('countries-grid');
      return grid ? window.getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length : 0;
    });
    assert(
      mobColCount === 2,
      `Mobile viewport (${w}px) displays exactly 2 columns per row`,
      `Computed columns: ${mobColCount}`
    );
  }

  // -------------------------------------------------------------------------
  // MODULE 3: Card Structure, Accessibility & Touch Targets
  // -------------------------------------------------------------------------
  console.log('\n--- MODULE 3: Card Structure, Accessibility & Touch Targets ---');

  await page.setViewport({ width: 375, height: 667 });
  await page.goto(`http://localhost:${PORT}/study-abroad/`, { waitUntil: 'networkidle0' });

  const cardDetails = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#countries-grid > div'));
    let allHaveFlag = true;
    let allHaveName = true;
    let allHaveChevron = true;
    let allClickable = true;
    let minTouchHeight = 999;

    for (const card of cards) {
      const img = card.querySelector('img');
      if (!img || !img.src.includes('.svg') || !img.alt.includes('Flag')) allHaveFlag = false;

      const name = card.querySelector('span');
      if (!name || !name.textContent.trim()) allHaveName = false;

      const svg = card.querySelector('svg');
      if (!svg) allHaveChevron = false;

      const link = card.querySelector('a');
      if (!link || !link.href.includes('/study-abroad/')) allClickable = false;

      if (link) {
        const rect = link.getBoundingClientRect();
        if (rect.height < minTouchHeight) minTouchHeight = rect.height;
      }
    }

    return {
      totalCards: cards.length,
      allHaveFlag,
      allHaveName,
      allHaveChevron,
      allClickable,
      minTouchHeight: Math.round(minTouchHeight),
    };
  });

  assert(cardDetails.totalCards >= 35, `Rendered all ${cardDetails.totalCards} destination cards in grid`);
  assert(cardDetails.allHaveFlag, 'Every card displays an official SVG flag with appropriate alt text');
  assert(cardDetails.allHaveName, 'Every card displays a readable country name');
  assert(cardDetails.allHaveChevron, 'Every card displays a navigation chevron indicator');
  assert(cardDetails.allClickable, 'Every card contains a full-surface clickable link to its destination guide');
  assert(
    cardDetails.minTouchHeight >= 44,
    `Card touch target height meets WCAG 2.1 AA (44px min): Actual = ${cardDetails.minTouchHeight}px`
  );

  // -------------------------------------------------------------------------
  // MODULE 4: Horizontal Overflow Check Across 9 Viewports
  // -------------------------------------------------------------------------
  console.log('\n--- MODULE 4: Zero Horizontal Overflow Across 9 Viewports ---');
  const allViewports = [320, 360, 375, 390, 430, 768, 1024, 1366, 1440];
  let overflowFailures = 0;

  for (const width of allViewports) {
    await page.setViewport({ width, height: 800 });
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    if (hasOverflow) {
      console.error(`  ❌ Horizontal overflow detected at ${width}px!`);
      overflowFailures++;
    }
  }
  assert(overflowFailures === 0, `Zero horizontal overflow across all 9 viewports (320px - 1440px)`);

  // -------------------------------------------------------------------------
  // MODULE 5: Interactivity — Search & Continent Filtering
  // -------------------------------------------------------------------------
  console.log('\n--- MODULE 5: Search & Continent Filtering Interactivity ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:${PORT}/study-abroad/`, { waitUntil: 'networkidle0' });

  // 1. Search Query: "germany"
  const searchInput = await page.$('#country-search-input');
  if (searchInput) {
    await searchInput.type('germany');
    await new Promise(r => setTimeout(r, 200));

    const searchResult = await page.evaluate(() => {
      const visibleCards = Array.from(document.querySelectorAll('#countries-grid > div')).filter(
        c => !c.classList.contains('hidden') && c.style.display !== 'none'
      );
      const firstCardName = visibleCards[0]?.querySelector('span')?.textContent?.trim();
      return { count: visibleCards.length, name: firstCardName };
    });

    assert(
      searchResult.count === 1 && searchResult.name === 'Germany',
      'Searching "germany" isolates Germany study destination card',
      `Result: ${searchResult.count} cards, Name: ${searchResult.name}`
    );

    // Clear search
    await page.evaluate(() => {
      const input = document.getElementById('country-search-input');
      if (input) {
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await new Promise(r => setTimeout(r, 200));
  }

  // 2. Continent Filter: "Europe"
  const filterEurope = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.continent-btn'));
    const europeBtn = btns.find(b => b.textContent && b.textContent.includes('Europe'));
    if (europeBtn) {
      europeBtn.click();
      return true;
    }
    return false;
  });
  assert(filterEurope, 'Clicked "Europe" continent filter button');
  await new Promise(r => setTimeout(r, 200));

  const europeFilteredCount = await page.evaluate(() => {
    const visibleCards = Array.from(document.querySelectorAll('#countries-grid > div')).filter(
      c => !c.classList.contains('hidden') && c.style.display !== 'none'
    );
    return visibleCards.length;
  });
  assert(
    europeFilteredCount >= 20,
    `Continent filter displays European destinations (Found: ${europeFilteredCount} visible cards)`
  );

  // -------------------------------------------------------------------------
  // MODULE 6: Sitewide Flags Verification on Related Pages
  // -------------------------------------------------------------------------
  console.log('\n--- MODULE 6: Sitewide Country Flags on Other Pages ---');

  // European Directory: /study-in-europe/
  await page.goto(`http://localhost:${PORT}/study-in-europe/`, { waitUntil: 'networkidle0' });
  const europePageFlags = await page.evaluate(() => {
    const grid = document.getElementById('europe-countries-grid');
    if (!grid) return { cols: 0, flagCount: 0 };
    const cols = window.getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length;
    const flags = grid.querySelectorAll('img[src*="/assets/flags/"]');
    return { cols, flagCount: flags.length };
  });
  assert(
    europePageFlags.cols === 5,
    '/study-in-europe/ grid uses 5-column layout on desktop (>=1200px)',
    `Actual: ${europePageFlags.cols}`
  );
  assert(
    europePageFlags.flagCount >= 20,
    `/study-in-europe/ displays official SVG flags in country cards (Found: ${europePageFlags.flagCount} flags)`
  );

  // Detail Page: /study-abroad/canada/
  await page.goto(`http://localhost:${PORT}/study-abroad/canada/`, { waitUntil: 'networkidle0' });
  const canadaPageDetails = await page.evaluate(() => {
    const heroFlag = document.querySelector('img[src*="/assets/flags/ca.svg"]');
    const relatedFlags = document.querySelectorAll('section img[src*="/assets/flags/"]');
    return {
      hasHeroFlag: Boolean(heroFlag),
      relatedFlagCount: relatedFlags.length,
    };
  });
  assert(canadaPageDetails.hasHeroFlag, 'Canada destination page displays Canadian SVG flag in hero badges bar');
  assert(
    canadaPageDetails.relatedFlagCount >= 2,
    `Related destinations section displays official SVG flags (Found: ${canadaPageDetails.relatedFlagCount})`
  );

  // -------------------------------------------------------------------------
  // MODULE 7: Screenshot Captures
  // -------------------------------------------------------------------------
  console.log('\n--- MODULE 7: High-Resolution Screenshot Captures ---');

  // Desktop 1440px - /study-abroad/
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:${PORT}/study-abroad/`, { waitUntil: 'networkidle0' });
  const desktopCapturePath = path.join(ARTIFACTS_DIR, 'after-study-abroad-directory-desktop-1440px.png');
  await page.screenshot({ path: desktopCapturePath, fullPage: false });
  console.log(`  📸 Captured desktop directory screenshot: ${desktopCapturePath}`);

  // Mobile 375px - /study-abroad/
  await page.setViewport({ width: 375, height: 812 });
  await page.goto(`http://localhost:${PORT}/study-abroad/`, { waitUntil: 'networkidle0' });
  const mobileCapturePath = path.join(ARTIFACTS_DIR, 'after-study-abroad-directory-mobile-375px.png');
  await page.screenshot({ path: mobileCapturePath, fullPage: false });
  console.log(`  📸 Captured mobile directory screenshot: ${mobileCapturePath}`);

  // Desktop 1440px - /study-in-europe/
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:${PORT}/study-in-europe/`, { waitUntil: 'networkidle0' });
  const europeCapturePath = path.join(ARTIFACTS_DIR, 'after-study-in-europe-desktop-1440px.png');
  await page.screenshot({ path: europeCapturePath, fullPage: false });
  console.log(`  📸 Captured Europe directory screenshot: ${europeCapturePath}`);

  // Desktop 1440px - /study-abroad/canada/
  await page.goto(`http://localhost:${PORT}/study-abroad/canada/`, { waitUntil: 'networkidle0' });
  const canadaCapturePath = path.join(ARTIFACTS_DIR, 'after-study-abroad-canada-detail-1440px.png');
  await page.screenshot({ path: canadaCapturePath, fullPage: false });
  console.log(`  📸 Captured Canada destination page screenshot: ${canadaCapturePath}`);

  await browser.close();
  server.close();

  console.log('\n===============================================================');
  console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
  if (failedTests === 0) {
    console.log('🎉 ALL COUNTRY DIRECTORY & IMAGE OPTIMIZATION TESTS PASSED!');
    console.log('===============================================================\n');
    process.exit(0);
  } else {
    console.error('❌ VERIFICATION SUITE HAD FAILURES!');
    process.exit(1);
  }
}

runVerification().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
