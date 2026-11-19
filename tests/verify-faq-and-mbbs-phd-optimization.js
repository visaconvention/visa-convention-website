import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\6a0361a6-ccbe-4f53-a463-b2d5ee259bd4\\faq-and-mbbs-phd';
const PORT = 4377;

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
  console.log('   GLOBAL FAQ & MBBS/PHD DIRECTORY OPTIMIZATION VERIFICATION    ');
  console.log('================================================================\n');

  await new Promise((resolve) => server.listen(PORT, resolve));
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  try {
    // =========================================================================
    // 1. WEBSITE-WIDE FAQ OPTIMIZATION CHECKS
    // =========================================================================
    console.log('--- 1. VERIFYING WEBSITE-WIDE FAQ OPTIMIZATION ---');

    const faqPages = [
      {
        url: '/study-abroad/',
        name: 'Study Abroad Directory',
        forbiddenDescriptions: ['Key information regarding international admissions, intake calendars, and immigration compliance.'],
      },
      {
        url: '/study-in-europe/',
        name: 'Study in Europe',
        forbiddenDescriptions: [],
      },
      {
        url: '/study-abroad/canada/',
        name: 'Study Abroad Canada Detail',
        forbiddenDescriptions: [],
      },
      {
        url: '/services/tourist-visa/',
        name: 'Tourist Visa Service',
        forbiddenDescriptions: ['Essential consular and documentation guidance for tourist and visitor visa applicants.'],
      },
      {
        url: '/services/work-visa/',
        name: 'Work Visa Service',
        forbiddenDescriptions: ['Important legal and operational answers regarding work permit documentation.'],
      },
      {
        url: '/services/flight-booking/',
        name: 'Flight Booking Service',
        forbiddenDescriptions: ['Clear, transparent answers regarding flight reservation holds, ticketing policies, and consular requirements.'],
      },
      {
        url: '/services/study-visa/',
        name: 'Study Visa Service (ServiceLayout)',
        forbiddenDescriptions: [],
      },
      {
        url: '/services/additional-services/',
        name: 'Additional Services (ServiceLayout)',
        forbiddenDescriptions: [],
      },
      {
        url: '/services/mbbs/',
        name: 'MBBS Abroad Service',
        forbiddenDescriptions: [],
      },
      {
        url: '/services/phd/',
        name: 'PhD Abroad Service',
        forbiddenDescriptions: [],
      },
    ];

    for (const fp of faqPages) {
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto(`http://localhost:${PORT}${fp.url}`, { waitUntil: 'networkidle0' });

      const faqAudit = await page.evaluate((forbidden) => {
        const detailsList = Array.from(document.querySelectorAll('details'));
        const openCount = detailsList.filter((d) => d.hasAttribute('open')).length;
        const totalCount = detailsList.length;

        // Check summary touch targets
        const summaries = Array.from(document.querySelectorAll('details summary'));
        const touchTargetHeights = summaries.map((s) => s.getBoundingClientRect().height);
        const minTouchTarget = touchTargetHeights.length ? Math.min(...touchTargetHeights) : 0;

        // Check forbidden text in body
        const bodyText = document.body.innerText;
        const foundForbidden = forbidden.filter((text) => bodyText.includes(text));

        // Heading to first question spacing
        let headingToFirstGap = null;
        if (detailsList.length > 0) {
          const firstDetail = detailsList[0];
          // Find preceding heading (h2 or parent container)
          const faqContainer = firstDetail.closest('div.space-y-2') || firstDetail.parentElement;
          const section = firstDetail.closest('section') || firstDetail.closest('.border-t') || faqContainer?.parentElement;
          const heading = section?.querySelector('h2');
          if (heading) {
            const headingBottom = heading.getBoundingClientRect().bottom;
            const firstTop = firstDetail.getBoundingClientRect().top;
            headingToFirstGap = Math.round(firstTop - headingBottom);
          }
        }

        return {
          totalCount,
          openCount,
          minTouchTarget,
          foundForbidden,
          headingToFirstGap,
        };
      }, fp.forbiddenDescriptions);

      assert(faqAudit.totalCount > 0, `${fp.name}: FAQ questions rendered (Count: ${faqAudit.totalCount})`);
      assert(faqAudit.openCount === 0, `${fp.name}: All questions collapsed by default (Open: ${faqAudit.openCount}/${faqAudit.totalCount})`);
      assert(faqAudit.minTouchTarget >= 44, `${fp.name}: Summary touch targets meet WCAG >=44px (Min: ${faqAudit.minTouchTarget.toFixed(1)}px)`);
      if (fp.forbiddenDescriptions.length > 0) {
        assert(faqAudit.foundForbidden.length === 0, `${fp.name}: Unnecessary filler descriptions removed`);
      }
    }

    // Interactive Expand/Collapse & Chevron Animation Test
    console.log('\n--- 1B. VERIFYING ACCESSIBLE EXPAND/COLLAPSE & CHEVRON ANIMATION ---');
    await page.goto(`http://localhost:${PORT}/study-abroad/`, { waitUntil: 'networkidle0' });
    const interactiveTest = await page.evaluate(async () => {
      const firstSummary = document.querySelector('details summary');
      const firstDetails = document.querySelector('details');
      const chevron = firstSummary?.querySelector('svg')?.parentElement;

      // Initial state
      const initialOpen = firstDetails?.hasAttribute('open');

      // Click to open
      firstSummary?.click();
      await new Promise((r) => setTimeout(r, 250));
      const afterClickOpen = firstDetails?.hasAttribute('open');

      // Click to close
      firstSummary?.click();
      await new Promise((r) => setTimeout(r, 250));
      const afterSecondClickOpen = firstDetails?.hasAttribute('open');

      return {
        initialOpen,
        afterClickOpen,
        afterSecondClickOpen,
      };
    });

    assert(!interactiveTest.initialOpen, 'FAQ details initially collapsed');
    assert(interactiveTest.afterClickOpen, 'FAQ details opens smoothly on user click');
    assert(!interactiveTest.afterSecondClickOpen, 'FAQ details collapses smoothly on subsequent click');

    // =========================================================================
    // 2. MBBS ABROAD — COUNTRY-BASED UNIVERSITY SELECTION
    // =========================================================================
    console.log('\n--- 2. VERIFYING MBBS COUNTRY-BASED UNIVERSITY SELECTION ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/services/mbbs/`, { waitUntil: 'networkidle0' });

    const mbbsCountryAudit = await page.evaluate(() => {
      const countryBtns = Array.from(document.querySelectorAll('#mbbs-countries-grid .mbbs-country-btn'));
      const countryNames = countryBtns.map((b) => b.getAttribute('data-country-name'));
      const countryFlags = countryBtns.map((b) => b.querySelector('img')?.getAttribute('src'));
      const unisSection = document.getElementById('mbbs-universities-section');
      const isInitiallyHidden = unisSection?.classList.contains('hidden');

      const allUniCards = Array.from(document.querySelectorAll('#mbbs-universities-grid .uni-card'));
      const allCardsInitiallyHidden = allUniCards.every((c) => c.classList.contains('hidden'));

      return {
        countryCount: countryBtns.length,
        countryNames,
        countryFlags,
        isInitiallyHidden,
        allCardsCount: allUniCards.length,
        allCardsInitiallyHidden,
      };
    });

    assert(mbbsCountryAudit.countryCount === 11, `MBBS displays exactly 11 derived country cards (Actual: ${mbbsCountryAudit.countryCount})`);
    assert(mbbsCountryAudit.isInitiallyHidden, 'MBBS: Universities section is initially hidden (Only country cards visible)');
    assert(mbbsCountryAudit.allCardsCount === 34, `MBBS: Preserves all 34 approved university records in DOM (Count: ${mbbsCountryAudit.allCardsCount})`);
    assert(mbbsCountryAudit.allCardsInitiallyHidden, 'MBBS: University cards initially hidden awaiting country selection');

    // Test Clicking Uzbekistan
    console.log('\n--- 2B. TESTING MBBS COUNTRY CARD SELECTION (UZBEKISTAN) ---');
    const uzbTest = await page.evaluate(async () => {
      const uzbBtn = document.querySelector('.mbbs-country-btn[data-country-name="Uzbekistan"]');
      uzbBtn?.click();
      await new Promise((r) => setTimeout(r, 200));

      const unisSection = document.getElementById('mbbs-universities-section');
      const isSectionVisible = !unisSection?.classList.contains('hidden');
      const headingText = document.getElementById('mbbs-selected-country-heading')?.innerText || '';

      const visibleCards = Array.from(document.querySelectorAll('#mbbs-universities-grid .uni-card'))
        .filter((c) => !c.classList.contains('hidden'));
      const visibleNames = visibleCards.map((c) => c.querySelector('h4')?.innerText.trim());

      const isUzbHighlighted = uzbBtn?.classList.contains('ring-brand-blue');
      const formCountryVal = document.querySelector('#form-country')?.value;

      return {
        isSectionVisible,
        headingText,
        visibleCount: visibleCards.length,
        visibleNames,
        isUzbHighlighted,
        formCountryVal,
      };
    });

    assert(uzbTest.isSectionVisible, 'MBBS: Clicking Uzbekistan reveals universities container immediately below');
    assert(uzbTest.isUzbHighlighted, 'MBBS: Uzbekistan country card highlighted with active styling');
    assert(uzbTest.visibleCount === 4, `MBBS: Displays exactly 4 universities for Uzbekistan (Actual: ${uzbTest.visibleCount})`);
    assert(uzbTest.headingText.includes('Uzbekistan'), `MBBS: Heading updates to show selected country (Actual: "${uzbTest.headingText}")`);
    assert(uzbTest.formCountryVal.toLowerCase().includes('uzbekistan'), `MBBS: Enquiry form #form-country syncs to Uzbekistan (Actual: "${uzbTest.formCountryVal}")`);

    // Test Selecting Another Country (Kazakhstan)
    console.log('\n--- 2C. TESTING MBBS COUNTRY REPLACEMENT (KAZAKHSTAN) ---');
    const kazTest = await page.evaluate(async () => {
      const kazBtn = document.querySelector('.mbbs-country-btn[data-country-name="Kazakhstan"]');
      const uzbBtn = document.querySelector('.mbbs-country-btn[data-country-name="Uzbekistan"]');
      kazBtn?.click();
      await new Promise((r) => setTimeout(r, 200));

      const headingText = document.getElementById('mbbs-selected-country-heading')?.innerText || '';
      const visibleCards = Array.from(document.querySelectorAll('#mbbs-universities-grid .uni-card'))
        .filter((c) => !c.classList.contains('hidden'));
      const visibleNames = visibleCards.map((c) => c.querySelector('h4')?.innerText.trim());

      const isKazHighlighted = kazBtn?.classList.contains('ring-brand-blue');
      const isUzbUnhighlighted = !uzbBtn?.classList.contains('ring-brand-blue');
      const formCountryVal = document.querySelector('#form-country')?.value;

      return {
        headingText,
        visibleCount: visibleCards.length,
        visibleNames,
        isKazHighlighted,
        isUzbUnhighlighted,
        formCountryVal,
      };
    });

    assert(kazTest.visibleCount === 5, `MBBS: Selecting Kazakhstan replaces list with 5 Kazakh universities (Actual: ${kazTest.visibleCount})`);
    assert(kazTest.isKazHighlighted && kazTest.isUzbUnhighlighted, 'MBBS: Active highlight transitions from Uzbekistan to Kazakhstan');
    assert(kazTest.formCountryVal.toLowerCase().includes('kazakhstan'), `MBBS: Enquiry form syncs to Kazakhstan (Actual: "${kazTest.formCountryVal}")`);

    // Test University Card Autofill
    console.log('\n--- 2D. TESTING MBBS UNIVERSITY CARD SELECTION & AUTOFILL ---');
    const mbbsCardClickTest = await page.evaluate(async () => {
      const firstVisibleCard = document.querySelector('#mbbs-universities-grid .uni-card:not(.hidden)');
      const uniName = firstVisibleCard?.getAttribute('data-university-name') || '';
      firstVisibleCard?.click();
      await new Promise((r) => setTimeout(r, 300));

      const formUni = document.querySelector('#form-university')?.value;
      const bannerText = document.querySelector('#context-banner-text')?.innerText || '';
      const bannerVisible = !document.querySelector('#enquiry-context-banner')?.classList.contains('hidden');

      return {
        uniName,
        formUni,
        bannerText,
        bannerVisible,
      };
    });

    assert(mbbsCardClickTest.formUni === mbbsCardClickTest.uniName, `MBBS: Clicking university card fills #form-university with "${mbbsCardClickTest.uniName}"`);
    assert(mbbsCardClickTest.bannerVisible, 'MBBS: Pre-selected enquiry context banner is displayed');
    assert(mbbsCardClickTest.bannerText.includes(mbbsCardClickTest.uniName), `MBBS: Context banner displays university name`);

    // =========================================================================
    // 3. PHD ABROAD — COUNTRY-BASED UNIVERSITY SELECTION
    // =========================================================================
    console.log('\n--- 3. VERIFYING PHD COUNTRY-BASED UNIVERSITY SELECTION ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/services/phd/`, { waitUntil: 'networkidle0' });

    const phdCountryAudit = await page.evaluate(() => {
      const countryBtns = Array.from(document.querySelectorAll('#phd-countries-grid .phd-country-btn'));
      const countryNames = countryBtns.map((b) => b.getAttribute('data-country-name'));
      const countryFlags = countryBtns.map((b) => b.querySelector('img')?.getAttribute('src'));
      const unisSection = document.getElementById('phd-universities-section');
      const isInitiallyHidden = unisSection?.classList.contains('hidden');

      const allUniCards = Array.from(document.querySelectorAll('#phd-university-grid .phd-uni-card'));
      const allCardsInitiallyHidden = allUniCards.every((c) => c.classList.contains('hidden'));

      return {
        countryCount: countryBtns.length,
        countryNames,
        countryFlags,
        isInitiallyHidden,
        allCardsCount: allUniCards.length,
        allCardsInitiallyHidden,
      };
    });

    assert(phdCountryAudit.countryCount === 3, `PhD displays exactly 3 country cards (Actual: ${phdCountryAudit.countryCount})`);
    assert(
      phdCountryAudit.countryNames.includes('Latvia') &&
      phdCountryAudit.countryNames.includes('Lithuania') &&
      phdCountryAudit.countryNames.includes('Portugal'),
      `PhD countries restricted exclusively to Latvia, Lithuania, and Portugal`
    );
    assert(phdCountryAudit.isInitiallyHidden, 'PhD: Universities section is initially hidden (Only country cards visible)');
    assert(phdCountryAudit.allCardsCount === 7, `PhD: Preserves exactly 7 approved university records in DOM (Count: ${phdCountryAudit.allCardsCount})`);

    // Test Clicking Latvia
    console.log('\n--- 3B. TESTING PHD COUNTRY SELECTION (LATVIA) ---');
    const latviaTest = await page.evaluate(async () => {
      const btn = document.querySelector('.phd-country-btn[data-country-name="Latvia"]');
      btn?.click();
      await new Promise((r) => setTimeout(r, 200));

      const unisSection = document.getElementById('phd-universities-section');
      const isSectionVisible = !unisSection?.classList.contains('hidden');
      const headingText = document.getElementById('phd-selected-country-heading')?.innerText || '';

      const visibleCards = Array.from(document.querySelectorAll('#phd-university-grid .phd-uni-card'))
        .filter((c) => !c.classList.contains('hidden'));
      const visibleNames = visibleCards.map((c) => (c.querySelector('h3, h4')?.innerText || c.getAttribute('data-university-name') || '').trim());

      const isHighlighted = btn?.classList.contains('ring-brand-blue');
      const formCountryVal = document.querySelector('#form-country')?.value;

      return {
        isSectionVisible,
        headingText,
        visibleCount: visibleCards.length,
        visibleNames,
        isHighlighted,
        formCountryVal,
      };
    });

    assert(latviaTest.isSectionVisible, 'PhD: Clicking Latvia reveals universities container immediately below');
    assert(latviaTest.isHighlighted, 'PhD: Latvia country card highlighted with active styling');
    assert(latviaTest.visibleCount === 2, `PhD: Displays exactly 2 universities for Latvia (Actual: ${latviaTest.visibleCount})`);
    assert(
      latviaTest.visibleNames.includes('Riga Technical University') && latviaTest.visibleNames.includes('Turība University'),
      'PhD: Shows Riga Technical University & Turība University for Latvia'
    );
    assert(latviaTest.formCountryVal === 'latvia', `PhD: Enquiry form #form-country syncs to "latvia" (Actual: "${latviaTest.formCountryVal}")`);

    // Test Clicking Lithuania
    console.log('\n--- 3C. TESTING PHD COUNTRY SELECTION (LITHUANIA) ---');
    const lithuaniaTest = await page.evaluate(async () => {
      const btn = document.querySelector('.phd-country-btn[data-country-name="Lithuania"]');
      btn?.click();
      await new Promise((r) => setTimeout(r, 200));

      const visibleCards = Array.from(document.querySelectorAll('#phd-university-grid .phd-uni-card'))
        .filter((c) => !c.classList.contains('hidden'));
      const visibleNames = visibleCards.map((c) => (c.querySelector('h3, h4')?.innerText || c.getAttribute('data-university-name') || '').trim());
      const formCountryVal = document.querySelector('#form-country')?.value;

      return {
        visibleCount: visibleCards.length,
        visibleNames,
        formCountryVal,
      };
    });

    assert(lithuaniaTest.visibleCount === 3, `PhD: Selecting Lithuania replaces list with 3 universities (Actual: ${lithuaniaTest.visibleCount})`);
    assert(
      lithuaniaTest.visibleNames.includes('Vilnius University (VU)') &&
      lithuaniaTest.visibleNames.includes('Kaunas University of Technology (KTU)') &&
      lithuaniaTest.visibleNames.includes('Vilnius Gediminas Technical University (Vilnius Tech)'),
      'PhD: Shows VU, KTU, and Vilnius Tech for Lithuania'
    );
    assert(lithuaniaTest.formCountryVal === 'lithuania', `PhD: Form syncs to "lithuania"`);

    // Test Clicking Portugal
    console.log('\n--- 3D. TESTING PHD COUNTRY SELECTION (PORTUGAL) ---');
    const portugalTest = await page.evaluate(async () => {
      const btn = document.querySelector('.phd-country-btn[data-country-name="Portugal"]');
      btn?.click();
      await new Promise((r) => setTimeout(r, 200));

      const visibleCards = Array.from(document.querySelectorAll('#phd-university-grid .phd-uni-card'))
        .filter((c) => !c.classList.contains('hidden'));
      const visibleNames = visibleCards.map((c) => (c.querySelector('h3, h4')?.innerText || c.getAttribute('data-university-name') || '').trim());
      const formCountryVal = document.querySelector('#form-country')?.value;

      return {
        visibleCount: visibleCards.length,
        visibleNames,
        formCountryVal,
      };
    });

    assert(portugalTest.visibleCount === 2, `PhD: Selecting Portugal replaces list with 2 universities (Actual: ${portugalTest.visibleCount})`);
    assert(
      portugalTest.visibleNames.includes('University of Lisbon') &&
      portugalTest.visibleNames.includes('University of Porto'),
      'PhD: Shows University of Lisbon & University of Porto for Portugal'
    );
    assert(portugalTest.formCountryVal === 'portugal', `PhD: Form syncs to "portugal"`);

    // Test PhD University Card Click & Autofill
    console.log('\n--- 3E. TESTING PHD UNIVERSITY CARD CLICK AUTOFILL ---');
    const phdCardClickTest = await page.evaluate(async () => {
      const firstVisibleCard = document.querySelector('#phd-university-grid .phd-uni-card:not(.hidden)');
      const uniName = firstVisibleCard?.getAttribute('data-university-name') || '';
      firstVisibleCard?.click();
      await new Promise((r) => setTimeout(r, 300));

      const formUni = document.querySelector('#form-university')?.value;
      const bannerText = document.querySelector('#context-banner-text')?.innerText || '';
      const bannerVisible = !document.querySelector('#enquiry-context-banner')?.classList.contains('hidden');

      return {
        uniName,
        formUni,
        bannerText,
        bannerVisible,
      };
    });

    assert(phdCardClickTest.formUni === phdCardClickTest.uniName, `PhD: Clicking university card fills #form-university with "${phdCardClickTest.uniName}"`);
    assert(phdCardClickTest.bannerVisible, 'PhD: Pre-selected enquiry context banner is displayed');

    // =========================================================================
    // 4. MULTI-VIEWPORT RESPONSIVENESS & OVERFLOW CHECKS (9 VIEWPORTS)
    // =========================================================================
    console.log('\n--- 4. MULTI-VIEWPORT RESPONSIVENESS CHECKS (9 VIEWPORTS) ---');
    const testPages = ['/services/mbbs/', '/services/phd/', '/study-abroad/'];

    for (const testPath of testPages) {
      for (const vp of VIEWPORTS) {
        await page.setViewport({ width: vp.width, height: vp.height });
        await page.goto(`http://localhost:${PORT}${testPath}`, { waitUntil: 'networkidle0' });

        const overflow = await page.evaluate(() => {
          return {
            hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
          };
        });

        assert(!overflow.hasOverflow, `${testPath} at ${vp.name} (${vp.width}px): Zero horizontal overflow (${overflow.scrollWidth}px <= ${overflow.clientWidth}px)`);
      }
    }

    // =========================================================================
    // 5. CAPTURE VISUAL EVIDENCE SCREENSHOTS
    // =========================================================================
    console.log('\n--- 5. CAPTURING EVIDENCE SCREENSHOTS ---');

    // 1. MBBS Desktop (1440px)
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/services/mbbs/`, { waitUntil: 'networkidle0' });
    // Click Uzbekistan to show country highlight & universities
    await page.evaluate(() => {
      document.querySelector('.mbbs-country-btn[data-country-name="Uzbekistan"]')?.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'after-mbbs-country-selection-desktop-1440px.png'),
      fullPage: false,
    });
    console.log('  📸 Captured after-mbbs-country-selection-desktop-1440px.png');

    // 2. MBBS Mobile (375px)
    await page.setViewport({ width: 375, height: 812 });
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'after-mbbs-country-selection-mobile-375px.png'),
      fullPage: false,
    });
    console.log('  📸 Captured after-mbbs-country-selection-mobile-375px.png');

    // 3. PhD Desktop (1440px)
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/services/phd/`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      document.querySelector('.phd-country-btn[data-country-name="Lithuania"]')?.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'after-phd-country-selection-desktop-1440px.png'),
      fullPage: false,
    });
    console.log('  📸 Captured after-phd-country-selection-desktop-1440px.png');

    // 4. PhD Mobile (375px)
    await page.setViewport({ width: 375, height: 812 });
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'after-phd-country-selection-mobile-375px.png'),
      fullPage: false,
    });
    console.log('  📸 Captured after-phd-country-selection-mobile-375px.png');

    // 5. Global FAQ Accordion Desktop (1440px)
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/study-abroad/`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      const heading = document.querySelector('h2.text-brand-navy');
      heading?.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise((r) => setTimeout(r, 300));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'after-study-abroad-faq-desktop-1440px.png'),
      fullPage: false,
    });
    console.log('  📸 Captured after-study-abroad-faq-desktop-1440px.png');

    // 6. Global FAQ Accordion Mobile (375px)
    await page.setViewport({ width: 375, height: 812 });
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'after-study-abroad-faq-mobile-375px.png'),
      fullPage: false,
    });
    console.log('  📸 Captured after-study-abroad-faq-mobile-375px.png');

  } catch (err) {
    console.error('Fatal error during QA verification:', err);
    failedChecks++;
  } finally {
    await browser.close();
    server.close();

    console.log('\n================================================================');
    console.log(`QA VERIFICATION SUMMARY:`);
    console.log(`  Total Checks:  ${totalChecks}`);
    console.log(`  Passed:        ${passedChecks}`);
    console.log(`  Failed:        ${failedChecks}`);
    console.log('================================================================');

    if (failedChecks > 0) {
      console.log('\nFailed Checks Breakdown:');
      failureDetails.forEach((f, idx) => {
        console.log(`  ${idx + 1}. ${f.checkName} (${f.details})`);
      });
      process.exit(1);
    } else {
      console.log('\n🎉 ALL CHECKS PASSED PERFECTLY!');
      process.exit(0);
    }
  }
}

runQA();
