import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\93dd9ae5-292a-4677-9731-9efc41a7f30f\\evidence';
const PORT = 4366;

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

const EXPECTED_PHD_COUNTRIES = ['Latvia', 'Lithuania', 'Portugal'];
const EXPECTED_PHD_UNIS = [
  'Riga Technical University',
  'Turība University',
  'Vilnius University (VU)',
  'Kaunas University of Technology (KTU)',
  'Vilnius Gediminas Technical University (Vilnius Tech)',
  'University of Lisbon',
  'University of Porto',
];

async function runQA() {
  console.log('================================================================');
  console.log('   VISA CONVENTION — NAVIGATION, MBBS & PHD OPTIMIZATION QA     ');
  console.log('================================================================\n');

  await new Promise((resolve) => server.listen(PORT, resolve));
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  try {
    // -------------------------------------------------------------------------
    // TEST SECTION 1: STUDY ABROAD DROPDOWN OPTIMIZATION
    // -------------------------------------------------------------------------
    console.log('--- 1. VERIFYING STUDY ABROAD DROPDOWN OPTIMIZATION ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    const navData = await page.evaluate(() => {
      const desktopNav = document.querySelector('nav[aria-label="Main Navigation"]');
      const mobileDrawer = document.querySelector('#mobile-menu-drawer');

      // Check for "Find Universities" in desktop nav text
      const desktopText = desktopNav?.innerText || '';
      const mobileText = mobileDrawer?.innerText || '';

      // Find all links in Study Abroad dropdown
      const studyAbroadGroup = Array.from(desktopNav?.querySelectorAll('.group') || [])
        .find(g => g.innerText.includes('Study Abroad'));
      
      const studyAbroadLinks = Array.from(studyAbroadGroup?.querySelectorAll('a') || []).map(a => ({
        href: a.getAttribute('href'),
        text: a.innerText.trim(),
      }));

      // Check bottom shortcut
      const bottomShortcut = studyAbroadLinks.find(l => l.href === '/universities/');

      return {
        hasFindUnisDesktop: desktopText.includes('Find Universities'),
        hasFindUnisDescDesktop: desktopText.includes('Search 1,000+ universities & colleges'),
        hasFindUnisMobile: mobileText.includes('Find Universities'),
        bottomShortcutText: bottomShortcut?.text || '',
        bottomShortcutHref: bottomShortcut?.href || '',
        studyAbroadLinksCount: studyAbroadLinks.length,
      };
    });

    assert(!navData.hasFindUnisDesktop, 'Desktop Study Abroad dropdown: "Find Universities" item completely excised');
    assert(!navData.hasFindUnisDescDesktop, 'Desktop Study Abroad dropdown: "Search 1,000+ universities & colleges" description excised');
    assert(!navData.hasFindUnisMobile, 'Mobile Navigation drawer: "Find Universities" item completely excised');
    assert(navData.bottomShortcutHref === '/universities/', 'Desktop dropdown bottom shortcut preserved (href="/universities/")');
    assert(navData.bottomShortcutText.includes('Search 1,000+ Universities'), `Bottom shortcut text is "Search 1,000+ Universities →" (Actual: "${navData.bottomShortcutText}")`);

    // Verify universities directory route still exists and builds properly
    const uniRes = await page.goto(`http://localhost:${PORT}/universities/`, { waitUntil: 'networkidle0' });
    assert(uniRes.status() === 200, 'University directory /universities/ route remains accessible (HTTP 200 OK)');

    // -------------------------------------------------------------------------
    // TEST SECTION 2: MBBS ABROAD PAGE VERIFICATION
    // -------------------------------------------------------------------------
    console.log('\n--- 2. VERIFYING MBBS ABROAD PAGE OPTIMIZATION ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/services/mbbs/`, { waitUntil: 'networkidle0' });

    const mbbsData = await page.evaluate(() => {
      const pageText = document.body.innerText;
      const h1 = document.querySelector('h1')?.innerText?.trim() || '';
      const heroImg = document.querySelector('section img');
      const heroImgSrc = heroImg ? decodeURIComponent(heroImg.getAttribute('src')) : '';

      // Check for removed sections
      const hasStepProcess = pageText.includes('Step-by-Step Application Process');
      const hasWhyConsult = pageText.includes('Why Consult Visa Convention');
      const hasImportantConditions = pageText.includes('Important Conditions & Disclaimers');
      const hasOrphanedClarity = Array.from(document.querySelectorAll('span, p, h2, h3, h4'))
        .some(el => el.innerText.trim().toUpperCase() === 'CLARITY');

      // Check for preserved regulatory guidance
      const hasNmcCompliance = pageText.includes('National Medical Commission (NMC) FMGL Compliance') ||
                               pageText.includes('FMGL Regulations, 2021');
      const hasIntegrityNotice = pageText.includes('Integrity Notice') && pageText.includes('independent admissions guidance');

      // Check university directory
      const uniCards = Array.from(document.querySelectorAll('#universities .uni-card'));
      const uniNames = uniCards.map(c => c.querySelector('h3')?.innerText?.trim() || '');
      const uniLocations = uniCards.map(c => c.querySelector('span')?.innerText?.trim() || '');

      return {
        h1,
        heroImgSrc,
        hasStepProcess,
        hasWhyConsult,
        hasImportantConditions,
        hasOrphanedClarity,
        hasNmcCompliance,
        hasIntegrityNotice,
        uniCount: uniCards.length,
        firstThreeUnis: uniNames.slice(0, 3),
        firstThreeLocations: uniLocations.slice(0, 3),
      };
    });

    assert(mbbsData.h1 === 'MBBS Abroad Admissions', `MBBS H1 is "MBBS Abroad Admissions" (Actual: "${mbbsData.h1}")`);
    assert(mbbsData.heroImgSrc.includes('MBBS & PhD Courses Abroad.png'), 'MBBS hero renders original client image "MBBS & PhD Courses Abroad.png"');
    assert(!mbbsData.hasStepProcess, 'MBBS: "Step-by-Step Application Process" section completely removed');
    assert(!mbbsData.hasWhyConsult, 'MBBS: "Why Consult Visa Convention" promotional cards completely removed');
    assert(!mbbsData.hasImportantConditions, 'MBBS: "Important Conditions & Disclaimers" oversized panel completely removed');
    assert(!mbbsData.hasOrphanedClarity, 'MBBS: Orphaned "CLARITY" labels completely removed');
    assert(mbbsData.hasNmcCompliance, 'MBBS: Essential NMC FMGL Regulations, 2021 compliance notice concisely preserved');
    assert(mbbsData.hasIntegrityNotice, 'MBBS: Essential non-partnership integrity notice preserved');
    assert(mbbsData.uniCount === 34, `MBBS: Preserves every approved university record (Expected: 34, Actual: ${mbbsData.uniCount})`);
    assert(mbbsData.firstThreeUnis[0] === 'Tashkent State Medical University (TSMU)', `Card 1 shows full university name: "${mbbsData.firstThreeUnis[0]}"`);

    // Verify MBBS Responsive Grid Columns across Viewports
    console.log('\n--- 2B. VERIFYING MBBS UNIVERSITY GRID RESPONSIVENESS (1, 2, 3, 4 COLUMNS) ---');
    const gridBreakpoints = [
      { name: 'Desktop ≥1440px', width: 1440, expectedCols: 4 },
      { name: 'Desktop 1024-1439px', width: 1200, expectedCols: 3 },
      { name: 'Tablet 600-1023px', width: 768, expectedCols: 2 },
      { name: 'Mobile <600px', width: 390, expectedCols: 1 },
    ];

    for (const bp of gridBreakpoints) {
      await page.setViewport({ width: bp.width, height: 900 });
      await page.goto(`http://localhost:${PORT}/services/mbbs/`, { waitUntil: 'networkidle0' });

      const cols = await page.evaluate(() => {
        const grid = document.querySelector('#universities .grid');
        if (!grid) return 0;
        const cards = Array.from(grid.querySelectorAll('.uni-card'));
        if (cards.length < 2) return 1;
        const firstCardTop = cards[0].getBoundingClientRect().top;
        // Count cards sharing the same top position
        return cards.filter(c => Math.abs(c.getBoundingClientRect().top - firstCardTop) <= 4).length;
      });

      assert(cols === bp.expectedCols, `MBBS Grid at ${bp.name} (${bp.width}px): Displays exactly ${bp.expectedCols} columns (Actual: ${cols})`);
    }

    // Test MBBS Form Auto-population on card click
    console.log('\n--- 2C. TESTING MBBS UNIVERSITY CARD CLICK AUTO-POPULATION ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/services/mbbs/`, { waitUntil: 'networkidle0' });

    const mbbsAutofill = await page.evaluate(async () => {
      const firstCard = document.querySelector('#universities .uni-card');
      const uniName = firstCard?.getAttribute('data-university-name');
      firstCard?.click();

      // Give slight delay for event handler
      await new Promise(r => setTimeout(r, 200));

      const formUni = document.querySelector('#form-university')?.value;
      const formCountry = document.querySelector('#form-country')?.value;
      const bannerText = document.querySelector('#context-banner-text')?.innerText;

      return {
        clickedUni: uniName,
        formUni,
        formCountry,
        bannerText,
      };
    });

    assert(mbbsAutofill.formUni === mbbsAutofill.clickedUni, `Clicking university card populates #form-university with "${mbbsAutofill.clickedUni}" (Actual: "${mbbsAutofill.formUni}")`);
    assert(mbbsAutofill.formCountry.includes('uzbekistan'), `Clicking card selects appropriate country in #form-country (Actual: "${mbbsAutofill.formCountry}")`);

    // -------------------------------------------------------------------------
    // TEST SECTION 3: PHD ABROAD PAGE VERIFICATION
    // -------------------------------------------------------------------------
    console.log('\n--- 3. VERIFYING PHD ABROAD PAGE OPTIMIZATION ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/services/phd/`, { waitUntil: 'networkidle0' });

    const phdData = await page.evaluate((expectedUnis, expectedCountries) => {
      const pageText = document.body.innerText;
      const h1 = document.querySelector('h1')?.innerText?.trim() || '';
      const heroImg = document.querySelector('section img');
      const heroImgSrc = heroImg ? decodeURIComponent(heroImg.getAttribute('src')) : '';

      // Check removed sections
      const hasWhatIncludes = pageText.includes('What Our Guidance Includes');
      const hasStepProcess = pageText.includes('Step-by-Step Application Process');
      const hasWhyConsult = pageText.includes('Why Consult Visa Convention');
      const hasImportantConditions = pageText.includes('Important Conditions & Disclaimers');
      const hasFaqs = pageText.includes('Frequently Asked Questions');

      // Check country selectors
      const countryBtns = Array.from(document.querySelectorAll('.phd-country-filter-btn')).map(b => b.innerText.trim());

      // Check universities
      const uniCards = Array.from(document.querySelectorAll('#phd-university-grid .phd-uni-card'));
      const uniNames = uniCards.map(c => c.querySelector('h3')?.innerText?.trim() || '');
      const uniCountries = uniCards.map(c => c.getAttribute('data-country-name') || '');

      // Check enquiry form dropdown options
      const countryOptions = Array.from(document.querySelectorAll('#form-country option'))
        .map(o => o.text.trim())
        .filter(t => t && !t.includes('Select Country'));

      // Check that all 7 expected universities match
      const allExpectedUnisPresent = expectedUnis.every(u => uniNames.includes(u));
      const noUnapprovedUnis = uniNames.every(u => expectedUnis.includes(u));
      const allCountriesMatch = uniCountries.every(c => expectedCountries.includes(c));

      return {
        h1,
        heroImgSrc,
        hasWhatIncludes,
        hasStepProcess,
        hasWhyConsult,
        hasImportantConditions,
        hasFaqs,
        countryBtnCount: countryBtns.length,
        countryBtns,
        uniCount: uniCards.length,
        uniNames,
        allExpectedUnisPresent,
        noUnapprovedUnis,
        allCountriesMatch,
        countryOptions,
      };
    }, EXPECTED_PHD_UNIS, EXPECTED_PHD_COUNTRIES);

    assert(phdData.h1 === 'PhD Abroad Guidance', `PhD H1 is "PhD Abroad Guidance" (Actual: "${phdData.h1}")`);
    assert(phdData.heroImgSrc.includes('MBBS & PhD Courses Abroad.png'), 'PhD hero renders original client image "MBBS & PhD Courses Abroad.png"');
    assert(!phdData.hasWhatIncludes, 'PhD: "What Our Guidance Includes" section completely removed');
    assert(!phdData.hasStepProcess, 'PhD: "Step-by-Step Application Process" section completely removed');
    assert(!phdData.hasWhyConsult, 'PhD: "Why Consult Visa Convention" promotional cards completely removed');
    assert(!phdData.hasImportantConditions, 'PhD: "Important Conditions & Disclaimers" oversized panel completely removed');
    assert(!phdData.hasFaqs, 'PhD: "Frequently Asked Questions" section completely removed');

    assert(phdData.uniCount === 7, `PhD: Exactly 7 universities displayed (Actual: ${phdData.uniCount})`);
    assert(phdData.allExpectedUnisPresent, 'PhD: All 7 approved universities present (Riga Tech, Turība, VU, KTU, Vilnius Tech, U. Lisbon, U. Porto)');
    assert(phdData.noUnapprovedUnis, 'PhD: Zero unapproved universities present');
    assert(phdData.allCountriesMatch, 'PhD: Universities restricted exclusively to Latvia, Lithuania, and Portugal');

    assert(phdData.countryBtnCount === 4, `PhD: 4 filter controls present (All + 3 Countries) (Actual: ${phdData.countryBtnCount})`);
    assert(phdData.countryOptions.length === 3, `PhD enquiry form dropdown restricted to exactly 3 countries (Actual: ${phdData.countryOptions.length})`);
    assert(
      phdData.countryOptions.includes('Latvia') &&
      phdData.countryOptions.includes('Lithuania') &&
      phdData.countryOptions.includes('Portugal'),
      `PhD enquiry dropdown contains only Latvia, Lithuania, Portugal (Actual: ${phdData.countryOptions.join(', ')})`
    );

    // Test PhD Country Filter Interaction
    console.log('\n--- 3B. TESTING PHD COUNTRY SELECTOR INTERACTIVE FILTERING ---');
    const filterTests = [
      { country: 'latvia', expectedCount: 2, label: 'Latvia' },
      { country: 'lithuania', expectedCount: 3, label: 'Lithuania' },
      { country: 'portugal', expectedCount: 2, label: 'Portugal' },
      { country: 'all', expectedCount: 7, label: 'All Countries' },
    ];

    for (const ft of filterTests) {
      const visibleCount = await page.evaluate(async (countrySlug) => {
        const btn = document.querySelector(`.phd-country-filter-btn[data-country="${countrySlug}"]`);
        btn?.click();
        await new Promise(r => setTimeout(r, 150));
        const cards = Array.from(document.querySelectorAll('#phd-university-grid .phd-uni-card'));
        return cards.filter(c => !c.classList.contains('hidden')).length;
      }, ft.country);

      assert(visibleCount === ft.expectedCount, `PhD Country filter "${ft.label}": Shows exactly ${ft.expectedCount} universities (Actual: ${visibleCount})`);
    }

    // Test PhD Card Click Auto-population
    console.log('\n--- 3C. TESTING PHD UNIVERSITY CARD CLICK AUTO-POPULATION ---');
    const phdAutofill = await page.evaluate(async () => {
      // Click University of Lisbon card
      const uLisbonCard = Array.from(document.querySelectorAll('#phd-university-grid .phd-uni-card'))
        .find(c => c.getAttribute('data-university-name') === 'University of Lisbon');

      uLisbonCard?.click();
      await new Promise(r => setTimeout(r, 200));

      const formUni = document.querySelector('#form-university')?.value;
      const formCountry = document.querySelector('#form-country')?.value;
      const bannerText = document.querySelector('#context-banner-text')?.innerText;

      return {
        formUni,
        formCountry,
        bannerText,
      };
    });

    assert(phdAutofill.formUni === 'University of Lisbon', `Clicking University of Lisbon card populates #form-university with "University of Lisbon" (Actual: "${phdAutofill.formUni}")`);
    assert(phdAutofill.formCountry === 'portugal', `Clicking card selects "portugal" in #form-country (Actual: "${phdAutofill.formCountry}")`);

    // -------------------------------------------------------------------------
    // TEST SECTION 4: MULTI-VIEWPORT HORIZONTAL OVERFLOW & SCREENSHOTS
    // -------------------------------------------------------------------------
    console.log('\n--- 4. TESTING ALL 9 VIEWPORTS FOR OVERFLOW & CAPTURING EVIDENCE ---');
    
    // Check MBBS across all 9 viewports
    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(`http://localhost:${PORT}/services/mbbs/`, { waitUntil: 'networkidle0' });

      const overflow = await page.evaluate(() => {
        const root = document.documentElement;
        return {
          scrollW: Math.max(root.scrollWidth, document.body.scrollWidth),
          innerW: window.innerWidth,
        };
      });

      assert(overflow.scrollW <= overflow.innerW, `MBBS ${vp.name} (${vp.width}px): Zero horizontal overflow (${overflow.scrollW}px vs ${overflow.innerW}px)`);
    }

    // Check PhD across all 9 viewports
    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(`http://localhost:${PORT}/services/phd/`, { waitUntil: 'networkidle0' });

      const overflow = await page.evaluate(() => {
        const root = document.documentElement;
        return {
          scrollW: Math.max(root.scrollWidth, document.body.scrollWidth),
          innerW: window.innerWidth,
        };
      });

      assert(overflow.scrollW <= overflow.innerW, `PhD ${vp.name} (${vp.width}px): Zero horizontal overflow (${overflow.scrollW}px vs ${overflow.innerW}px)`);
    }

    // Capture Evidence Screenshots
    console.log('\n--- 5. CAPTURING EVIDENCE SCREENSHOTS ---');
    // MBBS Desktop 1440px
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/services/mbbs/`, { waitUntil: 'networkidle0' });
    const mbbsDesktopPath = path.join(EVIDENCE_DIR, 'mbbs-desktop-1440px.png');
    await page.screenshot({ path: mbbsDesktopPath, fullPage: false });
    console.log(`  📸 Captured MBBS Desktop screenshot: ${mbbsDesktopPath}`);
    assert(fs.existsSync(mbbsDesktopPath), 'MBBS Desktop 1440px screenshot saved successfully');

    // MBBS Mobile 390px
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(`http://localhost:${PORT}/services/mbbs/`, { waitUntil: 'networkidle0' });
    const mbbsMobilePath = path.join(EVIDENCE_DIR, 'mbbs-mobile-390px.png');
    await page.screenshot({ path: mbbsMobilePath, fullPage: false });
    console.log(`  📸 Captured MBBS Mobile screenshot: ${mbbsMobilePath}`);
    assert(fs.existsSync(mbbsMobilePath), 'MBBS Mobile 390px screenshot saved successfully');

    // PhD Desktop 1440px
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/services/phd/`, { waitUntil: 'networkidle0' });
    const phdDesktopPath = path.join(EVIDENCE_DIR, 'phd-desktop-1440px.png');
    await page.screenshot({ path: phdDesktopPath, fullPage: false });
    console.log(`  📸 Captured PhD Desktop screenshot: ${phdDesktopPath}`);
    assert(fs.existsSync(phdDesktopPath), 'PhD Desktop 1440px screenshot saved successfully');

    // PhD Mobile 390px
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(`http://localhost:${PORT}/services/phd/`, { waitUntil: 'networkidle0' });
    const phdMobilePath = path.join(EVIDENCE_DIR, 'phd-mobile-390px.png');
    await page.screenshot({ path: phdMobilePath, fullPage: false });
    console.log(`  📸 Captured PhD Mobile screenshot: ${phdMobilePath}`);
    assert(fs.existsSync(phdMobilePath), 'PhD Mobile 390px screenshot saved successfully');

    // Desktop Dropdown Open Screenshot
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    // Hover over Study Abroad button to show dropdown
    const studyAbroadBtn = await page.$('nav[aria-label="Main Navigation"] .group button');
    if (studyAbroadBtn) {
      await studyAbroadBtn.hover();
      await new Promise(r => setTimeout(r, 400));
      const navDesktopPath = path.join(EVIDENCE_DIR, 'study-abroad-nav-desktop-1440px.png');
      await page.screenshot({ path: navDesktopPath, fullPage: false });
      console.log(`  📸 Captured Study Abroad Nav Dropdown screenshot: ${navDesktopPath}`);
      assert(fs.existsSync(navDesktopPath), 'Study Abroad Nav Dropdown screenshot saved successfully');
    }

  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n================================================================');
  console.log(`TOTAL CHECKS : ${totalChecks}`);
  console.log(`PASSED       : ${passedChecks}`);
  console.log(`FAILED       : ${failedChecks}`);
  console.log(`PASS RATE    : ${Math.round((passedChecks / totalChecks) * 100)}%`);
  console.log('================================================================\n');

  if (failedChecks > 0) {
    process.exit(1);
  }
}

runQA().catch((err) => {
  console.error('Fatal error during QA:', err);
  process.exit(1);
});
