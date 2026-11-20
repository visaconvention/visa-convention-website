import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\6a0361a6-ccbe-4f53-a463-b2d5ee259bd4\\master-ui-and-service-optimization';
const PORT = 4395;

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
    navigation: {},
    homepageCards: {},
    touristVisa: {},
    workVisa: {},
    viewports: {},
    screenshots: [],
    allPass: true,
  };

  try {
    // -------------------------------------------------------------
    // 1. HEADER NAVIGATION VERIFICATION
    // -------------------------------------------------------------
    console.log('\n=== 1. Verifying Two-Line Header Navigation & Chevron Centering ===');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    const navAudit = await page.evaluate(() => {
      const nav = document.querySelector('nav[aria-label="Main Navigation"]');
      if (!nav) return { error: 'Desktop navigation nav element not found' };

      const items = Array.from(nav.children);
      const audit = items.map((el) => {
        const btn = el.querySelector('button');
        const link = el.tagName === 'A' ? el : el.querySelector('a');
        const target = btn || link;
        const text = target ? target.innerText.replace(/\s+/g, ' ').trim() : '';
        const lines = target ? Array.from(target.querySelectorAll('.leading-\\[1\\.15\\] > span')).map(s => s.textContent.trim()) : [];
        const hasChevron = Boolean(target?.querySelector('.chevron-icon'));
        const chevron = target?.querySelector('.chevron-icon');
        const textBlock = target?.querySelector('.leading-\\[1\\.15\\]');
        const href = link?.getAttribute('href') || btn?.getAttribute('aria-controls') || '';
        const rect = target ? target.getBoundingClientRect() : null;

        let chevronVerticallyCentered = false;
        if (chevron && textBlock) {
          const cRect = chevron.getBoundingClientRect();
          const tRect = textBlock.getBoundingClientRect();
          const cCenter = cRect.top + cRect.height / 2;
          const tCenter = tRect.top + tRect.height / 2;
          chevronVerticallyCentered = Math.abs(cCenter - tCenter) <= 2;
        }

        return {
          text,
          lines,
          isDropdown: Boolean(btn),
          hasChevron,
          chevronVerticallyCentered,
          href,
          height: rect ? Math.round(rect.height) : 0,
          minTouchTargetPass: rect ? rect.height >= 44 : false,
        };
      });

      const header = document.querySelector('header');
      const headerHeight = header ? Math.round(header.getBoundingClientRect().height) : 0;
      const ctaBtn = document.querySelector('header a[href*="contact"], header a[href*="enquiry"]');

      return { audit, headerHeight, hasCtaBtn: Boolean(ctaBtn) };
    });

    console.log('Desktop Nav Audit:', JSON.stringify(navAudit, null, 2));
    results.navigation.desktop = navAudit;

    const study = navAudit.audit.find(i => i.text.startsWith('Study Abroad'));
    const tourist = navAudit.audit.find(i => i.text === 'Tourist Visa');
    const work = navAudit.audit.find(i => i.text === 'Work Visa');
    const additional = navAudit.audit.find(i => i.text.startsWith('Additional Services'));
    const flights = navAudit.audit.find(i => i.text.startsWith('Flights'));
    const about = navAudit.audit.find(i => i.text.startsWith('About'));

    const navPass = study && study.lines.length === 2 && study.hasChevron && study.chevronVerticallyCentered &&
                    tourist && tourist.lines.length === 2 && !tourist.hasChevron && tourist.href === '/services/tourist-visa/' &&
                    work && work.lines.length === 2 && !work.hasChevron && work.href === '/services/work-visa/' &&
                    additional && additional.lines.length === 2 && additional.hasChevron && additional.chevronVerticallyCentered &&
                    flights && flights.lines.length === 0 && flights.hasChevron &&
                    about && about.lines.length === 0 && about.hasChevron &&
                    navAudit.headerHeight >= 70 && navAudit.headerHeight <= 85;

    results.navigation.pass = Boolean(navPass);
    console.log(`Navigation requirements passed: ${navPass}`);

    const headerEl = await page.$('header');
    if (headerEl) {
      const shot = path.join(EVIDENCE_DIR, 'header-navigation-desktop-1440px.png');
      await headerEl.screenshot({ path: shot });
      results.screenshots.push('header-navigation-desktop-1440px.png');
      console.log('Saved:', shot);
    }

    console.log('\n--- Verifying Mobile Navigation Menu (390px) ---');
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    await page.click('#open-mobile-menu-btn');
    await new Promise((r) => setTimeout(r, 400));

    const mobileNavAudit = await page.evaluate(() => {
      const drawer = document.getElementById('mobile-menu-drawer');
      const isVisible = drawer && !drawer.classList.contains('hidden');
      const links = drawer ? Array.from(drawer.querySelectorAll('a')).map(a => ({
        text: a.innerText.replace(/\s+/g, ' ').trim(),
        href: a.getAttribute('href') || '',
        height: Math.round(a.getBoundingClientRect().height),
        touchTargetPass: a.getBoundingClientRect().height >= 44,
      })) : [];

      return {
        isVisible,
        linksCount: links.length,
        hasTouristVisa: links.some(l => l.href === '/services/tourist-visa/' && l.text.includes('Tourist')),
        hasWorkVisa: links.some(l => l.href === '/services/work-visa/' && l.text.includes('Work')),
        allTouchTargetsPass: links.every(l => l.touchTargetPass),
      };
    });

    results.navigation.mobile = mobileNavAudit;
    console.log('Mobile Nav Audit:', mobileNavAudit);

    const mobileDrawerShot = path.join(EVIDENCE_DIR, 'header-navigation-mobile-390px.png');
    await page.screenshot({ path: mobileDrawerShot, fullPage: false });
    results.screenshots.push('header-navigation-mobile-390px.png');
    console.log('Saved:', mobileDrawerShot);

    // -------------------------------------------------------------
    // 2. HOMEPAGE SERVICE CARDS VERIFICATION
    // -------------------------------------------------------------
    console.log('\n=== 2. Verifying Homepage Service Cards (No Bottom CTAs, Full Navigation) ===');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    const cardsAudit = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('#services .grid > div.card-premium'));
      const prohibitedStrings = [
        'Explore Study Abroad',
        'MBBS Abroad →',
        'PhD Abroad →',
        'Work Visa Assistance',
        'Tourist Visa Assistance',
        'Request Flight Assistance',
        'Explore Additional Services'
      ];

      const audit = cards.map((card, idx) => {
        const text = card.innerText;
        const violations = prohibitedStrings.filter(str => text.includes(str));

        const allLinks = Array.from(card.querySelectorAll('a')).map(a => ({
          text: a.innerText.trim(),
          href: a.getAttribute('href'),
          classes: a.getAttribute('class') || '',
          hasAfterOverlay: a.className.includes('after:absolute') || a.className.includes('after:inset-0'),
        }));

        const nestedAnchors = card.querySelectorAll('a a');
        const img = card.querySelector('img');
        const imgSrc = img?.getAttribute('src') || '';
        const rect = card.getBoundingClientRect();

        return {
          cardIndex: idx + 1,
          height: Math.round(rect.height),
          violations,
          hasImg: Boolean(img),
          imgSrc,
          allLinks,
          nestedAnchorsCount: nestedAnchors.length,
        };
      });

      return {
        cardsCount: cards.length,
        audit,
      };
    });

    console.log('Homepage Cards Audit:', JSON.stringify(cardsAudit, null, 2));
    results.homepageCards = cardsAudit;

    const cardsViolations = cardsAudit.audit.some(c => c.violations.length > 0);
    const hasNested = cardsAudit.audit.some(c => c.nestedAnchorsCount > 0);
    const card2 = cardsAudit.audit[1];
    const card2HasSeparateLinks = card2 && card2.allLinks.some(l => l.href.includes('mbbs')) && card2.allLinks.some(l => l.href.includes('phd'));

    const cardsPass = cardsAudit.cardsCount === 6 && !cardsViolations && !hasNested && card2HasSeparateLinks;
    results.homepageCards.pass = cardsPass;
    console.log(`Homepage cards check passed: ${cardsPass}`);

    const servicesSection = await page.$('#services');
    if (servicesSection) {
      const desktopCardsShot = path.join(EVIDENCE_DIR, 'homepage-service-cards-desktop-1440px.png');
      await servicesSection.screenshot({ path: desktopCardsShot });
      results.screenshots.push('homepage-service-cards-desktop-1440px.png');
      console.log('Saved:', desktopCardsShot);
    }

    await page.setViewport({ width: 375, height: 812 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    const servicesMobile = await page.$('#services');
    if (servicesMobile) {
      const mobileCardsShot = path.join(EVIDENCE_DIR, 'homepage-service-cards-mobile-375px.png');
      await servicesMobile.screenshot({ path: mobileCardsShot });
      results.screenshots.push('homepage-service-cards-mobile-375px.png');
      console.log('Saved:', mobileCardsShot);
    }

    // -------------------------------------------------------------
    // 3. TOURIST VISA PAGE VERIFICATION
    // -------------------------------------------------------------
    console.log('\n=== 3. Verifying Tourist Visa Page (70:30 Layout & No Applicant Categories) ===');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/services/tourist-visa/`, { waitUntil: 'networkidle0' });

    const touristAudit = await page.evaluate(() => {
      const html = document.body.innerHTML;
      const applicantCategoriesExists = Boolean(document.getElementById('applicant-categories')) ||
                                        html.includes('Applicant Category Guidance') ||
                                        html.includes('Consular Consistency');

      const leftCol = document.getElementById('destinations');
      const rightAside = document.querySelector('aside#enquiry');
      const form = document.getElementById('visa-enquiry-form');

      const countryTiles = Array.from(document.querySelectorAll('.tourist-country-btn, [data-country-btn]'));
      const searchInput = document.getElementById('tourist-search-input');
      const filterPills = Array.from(document.querySelectorAll('.tourist-group-btn'));
      const detailsPanel = document.getElementById('tourist-details-panel');

      let sideBySide = false;
      let leftRect = null;
      let rightRect = null;

      if (leftCol && rightAside) {
        leftRect = leftCol.getBoundingClientRect();
        rightRect = rightAside.getBoundingClientRect();
        sideBySide = Math.abs(leftRect.top - rightRect.top) < 30 && rightRect.left >= leftRect.right;
      }

      return {
        applicantCategoriesExists,
        hasTwoColumnLayout: Boolean(leftCol && rightAside),
        sideBySide,
        leftRect,
        rightRect,
        countryTilesCount: countryTiles.length,
        hasSearchInput: Boolean(searchInput),
        filterPillsCount: filterPills.length,
        hasDetailsPanel: Boolean(detailsPanel),
        hasForm: Boolean(form),
        formSingleColumn: form ? form.querySelector('.grid-cols-1') !== null : false,
      };
    });

    console.log('Tourist Visa Desktop Audit:', JSON.stringify(touristAudit, null, 2));
    results.touristVisa.desktop = touristAudit;

    // Test clicking a country tile in Tourist Visa
    console.log('Testing Tourist Visa Country Tile Click & Details Panel...');
    const touristInteractive = await page.evaluate(async () => {
      const firstTile = document.querySelector('.tourist-country-btn, [data-country-btn]');
      if (!firstTile) return { error: 'No country tile found' };

      const countryName = firstTile.getAttribute('data-country-name') || firstTile.getAttribute('data-dest-name');
      const countrySlug = firstTile.getAttribute('data-country-slug') || firstTile.getAttribute('data-dest-slug');
      firstTile.click();

      await new Promise(r => setTimeout(r, 200));

      const panel = document.getElementById('tourist-details-panel');
      const panelVisible = panel && !panel.classList.contains('hidden');
      const panelTitle = document.getElementById('detail-title')?.textContent || '';
      const countrySelect = document.getElementById('form-country');
      const selectedValue = countrySelect ? countrySelect.value : '';

      return {
        clickedCountry: countryName,
        clickedSlug: countrySlug,
        panelVisible,
        panelTitle,
        selectedValue,
        autofillMatch: selectedValue === countrySlug || panelTitle.includes(countryName),
      };
    });

    console.log('Tourist Visa Interaction Audit:', touristInteractive);
    results.touristVisa.interaction = touristInteractive;

    const touristPass = !touristAudit.applicantCategoriesExists &&
                        touristAudit.hasTwoColumnLayout &&
                        touristAudit.sideBySide &&
                        touristAudit.countryTilesCount === 27 &&
                        touristAudit.hasSearchInput &&
                        touristAudit.filterPillsCount === 4 &&
                        touristInteractive.panelVisible &&
                        touristInteractive.autofillMatch;

    results.touristVisa.pass = Boolean(touristPass);
    console.log(`Tourist Visa check passed: ${touristPass}`);

    const touristSection = await page.$('section:has(#destinations)');
    if (touristSection) {
      const desktopTouristShot = path.join(EVIDENCE_DIR, 'tourist-visa-70-30-desktop-1440px.png');
      await touristSection.screenshot({ path: desktopTouristShot });
      results.screenshots.push('tourist-visa-70-30-desktop-1440px.png');
      console.log('Saved:', desktopTouristShot);
    }

    await page.setViewport({ width: 375, height: 812 });
    await page.goto(`http://localhost:${PORT}/services/tourist-visa/`, { waitUntil: 'networkidle0' });
    const mobileTouristSection = await page.$('section:has(#destinations)');
    if (mobileTouristSection) {
      const mobileTouristShot = path.join(EVIDENCE_DIR, 'tourist-visa-mobile-375px.png');
      await mobileTouristSection.screenshot({ path: mobileTouristShot });
      results.screenshots.push('tourist-visa-mobile-375px.png');
      console.log('Saved:', mobileTouristShot);
    }

    // -------------------------------------------------------------
    // 4. WORK VISA PAGE VERIFICATION
    // -------------------------------------------------------------
    console.log('\n=== 4. Verifying Work Visa Page (Removed Notices, 2-Col Occupation Grid) ===');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/services/work-visa/`, { waitUntil: 'networkidle0' });

    const workVisaAudit = await page.evaluate(() => {
      const html = document.body.innerHTML;
      const statutoryBoxRemoved = !html.includes('Statutory Regulatory Disclosure & Advisory Scope');
      const uaeNoticeRemoved = !html.includes('Single UAE Country Entry') && !html.includes('UAE-specific labor entry regulations');
      const adminNoticeRemoved = !html.includes('Administrative Guidance Notice') && !html.includes('Occupational categories listed reflect high-demand technical');

      const hasConciseDisclaimer = html.includes('Statutory Compliance Notice') &&
                                   html.includes('Emigration Act, 1983');

      const root = document.querySelector('.occupation-accordion-root');
      const occItems = Array.from(document.querySelectorAll('.occ-item'));
      const occToggles = Array.from(document.querySelectorAll('.occ-toggle'));

      const heights = occToggles.map(h => Math.round(h.getBoundingClientRect().height));
      const hasBadgesInHeaders = occToggles.some(h => h.querySelector('.badge') || h.querySelector('span.rounded-full'));

      return {
        statutoryBoxRemoved,
        uaeNoticeRemoved,
        adminNoticeRemoved,
        hasConciseDisclaimer,
        hasRoot: Boolean(root),
        occCount: occItems.length,
        averageHeaderHeight: Math.round(heights.reduce((a, b) => a + b, 0) / heights.length),
        minHeight: Math.min(...heights),
        maxHeight: Math.max(...heights),
        hasBadgesInHeaders,
      };
    });

    console.log('Work Visa Desktop Audit:', JSON.stringify(workVisaAudit, null, 2));
    results.workVisa.desktop = workVisaAudit;

    // Test Occupation accordion expansion & autofill
    console.log('Testing Work Visa Occupation Accordion & Autofill...');
    const workVisaInteractive = await page.evaluate(async () => {
      const firstOccToggle = document.querySelector('.occ-toggle');
      if (!firstOccToggle) return { error: 'No occupation toggle found' };

      const occItem = firstOccToggle.closest('.occ-item');
      const occId = occItem ? occItem.getAttribute('data-occ-id') : null;
      firstOccToggle.click();

      await new Promise(r => setTimeout(r, 200));

      const drawer = document.getElementById(`occ-details-${occId}`);
      const isExpanded = drawer && !drawer.classList.contains('hidden');

      const applyBtn = drawer?.querySelector('.occ-select-btn');
      let messageAutofilled = false;
      let formValue = '';
      if (applyBtn) {
        applyBtn.click();
        const msgTextarea = document.getElementById('form-message');
        formValue = msgTextarea ? msgTextarea.value : '';
        messageAutofilled = formValue.includes('Work Visa Occupation');
      }

      return {
        occId,
        isExpanded,
        messageAutofilled,
        formValue,
      };
    });

    console.log('Work Visa Interaction Audit:', workVisaInteractive);
    results.workVisa.interaction = workVisaInteractive;

    const workVisaPass = workVisaAudit.statutoryBoxRemoved &&
                         workVisaAudit.uaeNoticeRemoved &&
                         workVisaAudit.adminNoticeRemoved &&
                         workVisaAudit.hasConciseDisclaimer &&
                         workVisaAudit.occCount === 12 &&
                         !workVisaAudit.hasBadgesInHeaders &&
                         workVisaInteractive.isExpanded &&
                         workVisaInteractive.messageAutofilled;

    results.workVisa.pass = Boolean(workVisaPass);
    console.log(`Work Visa check passed: ${workVisaPass}`);

    const occSection = await page.$('section:has(#occupations)');
    if (occSection) {
      const desktopWorkShot = path.join(EVIDENCE_DIR, 'work-visa-compact-occupations-desktop-1440px.png');
      await occSection.screenshot({ path: desktopWorkShot });
      results.screenshots.push('work-visa-compact-occupations-desktop-1440px.png');
      console.log('Saved:', desktopWorkShot);
    }

    await page.setViewport({ width: 375, height: 812 });
    await page.goto(`http://localhost:${PORT}/services/work-visa/`, { waitUntil: 'networkidle0' });
    const mobileOccSection = await page.$('section:has(#occupations)');
    if (mobileOccSection) {
      const mobileWorkShot = path.join(EVIDENCE_DIR, 'work-visa-mobile-375px.png');
      await mobileOccSection.screenshot({ path: mobileWorkShot });
      results.screenshots.push('work-visa-mobile-375px.png');
      console.log('Saved:', mobileWorkShot);
    }

    // -------------------------------------------------------------
    // 5. RESPONSIVE MULTI-VIEWPORT AUDIT (Zero Horizontal Overflow)
    // -------------------------------------------------------------
    console.log('\n=== 5. Multi-Viewport Overflow Audit across 9 Viewports ===');
    const viewports = [320, 360, 375, 390, 430, 768, 1024, 1366, 1440];
    const pagesToCheck = [
      { name: 'Homepage', url: `http://localhost:${PORT}/` },
      { name: 'Tourist Visa', url: `http://localhost:${PORT}/services/tourist-visa/` },
      { name: 'Work Visa', url: `http://localhost:${PORT}/services/work-visa/` },
    ];

    let allViewportsPass = true;

    for (const vpWidth of viewports) {
      await page.setViewport({ width: vpWidth, height: 800 });
      results.viewports[vpWidth] = {};

      for (const p of pagesToCheck) {
        await page.goto(p.url, { waitUntil: 'networkidle0' });
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

        results.viewports[vpWidth][p.name] = overflowAudit;
        if (overflowAudit.hasOverflow) {
          console.error(`❌ Overflow at ${vpWidth}px on ${p.name}: diff = ${overflowAudit.diff}px`);
          allViewportsPass = false;
        } else {
          console.log(`✓ No overflow at ${vpWidth}px on ${p.name}`);
        }
      }
    }

    results.viewportsPass = allViewportsPass;
    results.allPass = navPass && cardsPass && touristPass && workVisaPass && allViewportsPass;

    console.log(`\n========================================`);
    console.log(`OVERALL TEST STATUS: ${results.allPass ? 'PASSED ✅' : 'FAILED ❌'}`);
    console.log(`========================================\n`);

    // Write audit results to json
    fs.writeFileSync(path.join(EVIDENCE_DIR, 'audit-results.json'), JSON.stringify(results, null, 2));

  } catch (err) {
    console.error('Verification failed with error:', err);
    results.allPass = false;
    results.error = err.message;
  } finally {
    await browser.close();
    server.close();
  }
}

runVerification();
