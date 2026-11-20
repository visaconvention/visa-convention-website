import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';
import assert from 'assert';

const DIST = path.resolve('dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\6a0361a6-ccbe-4f53-a463-b2d5ee259bd4\\dropdown-header-cleanup';
const PORT = 4401;

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
    flightsDropdown: {},
    additionalServicesDropdown: {},
    aboutDropdown: {},
    mobileDrawer: {},
    viewports: {},
    screenshots: [],
    allPass: true,
  };

  try {
    // Set desktop viewport
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    // -------------------------------------------------------------
    // 1. FLIGHTS DROPDOWN HEADER EXCISION & RETENTION
    // -------------------------------------------------------------
    console.log('\n=== 1. Verifying Flights Dropdown Header Removal ===');
    const flightsAudit = await page.evaluate(() => {
      const panel = document.getElementById('nav-menu-flights');
      if (!panel) return { error: 'Flights panel not found' };

      const panelHtml = panel.innerHTML;
      const panelText = panel.innerText;

      const headerFound = /flight coordination desk/i.test(panelText) || /flight coordination desk/i.test(panelHtml);
      const subheaderFound = /verifiable reservation holds/i.test(panelText) || /confirmed e-tickets/i.test(panelText);
      const overviewFound = panelText.includes('Overview →') || panelText.includes('Overview') && panelHtml.includes('/services/flight-booking/');

      const links = Array.from(panel.querySelectorAll('a')).map(a => ({
        label: a.querySelector('span.font-bold')?.textContent?.trim() || a.textContent.trim(),
        href: a.getAttribute('href'),
        hasIcon: a.textContent.includes('✈'),
      }));

      const hasDummyTickets = links.some(l => l.label.includes('Dummy Tickets'));
      const hasConfirmedTickets = links.some(l => l.label.includes('Confirmed Flight Tickets'));

      return {
        headerFound,
        subheaderFound,
        overviewFound,
        linkCount: links.length,
        links,
        hasDummyTickets,
        hasConfirmedTickets,
      };
    });

    console.log('Flights Dropdown Audit:', flightsAudit);
    results.flightsDropdown = flightsAudit;

    assert(!flightsAudit.headerFound, 'Flights header "FLIGHT COORDINATION DESK" must be completely removed');
    assert(!flightsAudit.subheaderFound, 'Flights subheader "Verifiable reservation holds & confirmed e-tickets" must be completely removed');
    assert(!flightsAudit.overviewFound, 'Flights "Overview →" link must be completely removed');
    assert.strictEqual(flightsAudit.linkCount, 2, `Flights dropdown must contain exactly 2 links, found: ${flightsAudit.linkCount}`);
    assert(flightsAudit.hasDummyTickets && flightsAudit.hasConfirmedTickets, 'Dummy Tickets and Confirmed Flight Tickets must be preserved');
    console.log('✓ Flights dropdown header excised and 2 flight options preserved: PASS');

    // Capture Flights dropdown screenshot
    await page.hover('button[aria-controls="nav-menu-flights"]');
    await new Promise(r => setTimeout(r, 200));
    const flightsDropdownEl = await page.$('#nav-menu-flights');
    if (flightsDropdownEl) {
      const shotPath = path.join(EVIDENCE_DIR, 'dropdown-flights-compact-1440px.png');
      await flightsDropdownEl.screenshot({ path: shotPath });
      results.screenshots.push('dropdown-flights-compact-1440px.png');
      console.log('Saved:', shotPath);
    }
    await page.mouse.move(0, 0);

    // -------------------------------------------------------------
    // 2. ADDITIONAL SERVICES DROPDOWN HEADER EXCISION & RETENTION
    // -------------------------------------------------------------
    console.log('\n=== 2. Verifying Additional Services Dropdown Header Removal ===');
    const addAudit = await page.evaluate(() => {
      const panel = document.getElementById('nav-menu-additional-services');
      if (!panel) return { error: 'Additional Services panel not found' };

      const panelHtml = panel.innerHTML;
      const panelText = panel.innerText;

      // Check header row elements absence
      const subheaderFound = /passport, documentation, attestation & legalizations/i.test(panelText);
      const viewAllFound = panelText.includes('View All →') || (panelText.includes('View All') && panelHtml.includes('/services/additional-services/'));
      // In panel, ensure no uppercase header inside panel card
      const headerDivFound = Boolean(panel.querySelector('.border-b'));

      const links = Array.from(panel.querySelectorAll('a')).map((a, idx) => ({
        index: idx + 1,
        label: a.querySelector('span.font-bold')?.textContent?.trim() || a.textContent.trim(),
        href: a.getAttribute('href'),
        badgeText: a.querySelector('div')?.textContent?.trim(),
      }));

      return {
        subheaderFound,
        viewAllFound,
        headerDivFound,
        linkCount: links.length,
        links,
      };
    });

    console.log('Additional Services Dropdown Audit:', addAudit);
    results.additionalServicesDropdown = addAudit;

    assert(!addAudit.subheaderFound, 'Additional Services subheader "Passport, documentation, attestation & legalizations" must be completely removed');
    assert(!addAudit.viewAllFound, 'Additional Services "View All →" link must be completely removed');
    assert(!addAudit.headerDivFound, 'Additional Services header border-b container must be removed');
    assert.strictEqual(addAudit.linkCount, 6, `Additional Services dropdown must contain exactly 6 links, found: ${addAudit.linkCount}`);
    console.log('✓ Additional Services dropdown header excised and 6 services preserved: PASS');

    // Capture Additional Services dropdown screenshot
    await page.hover('button[aria-controls="nav-menu-additional-services"]');
    await new Promise(r => setTimeout(r, 200));
    const addDropdownEl = await page.$('#nav-menu-additional-services');
    if (addDropdownEl) {
      const shotPath = path.join(EVIDENCE_DIR, 'dropdown-additional-services-compact-1440px.png');
      await addDropdownEl.screenshot({ path: shotPath });
      results.screenshots.push('dropdown-additional-services-compact-1440px.png');
      console.log('Saved:', shotPath);
    }
    await page.mouse.move(0, 0);

    // -------------------------------------------------------------
    // 3. ABOUT DROPDOWN HEADER EXCISION & RETENTION
    // -------------------------------------------------------------
    console.log('\n=== 3. Verifying About Dropdown Header Removal ===');
    const aboutAudit = await page.evaluate(() => {
      const panel = document.getElementById('nav-menu-about');
      if (!panel) return { error: 'About panel not found' };

      const panelHtml = panel.innerHTML;
      const panelText = panel.innerText;

      const headerFound = /corporate credibility & team/i.test(panelText);
      const subheaderFound = /rooted in hanumangarh, serving global aspirants/i.test(panelText);
      const overviewFound = panelText.includes('Overview →') || (panelText.includes('Overview') && panelHtml.includes('/about/'));
      const headerDivFound = Boolean(panel.querySelector('.border-b'));

      const links = Array.from(panel.querySelectorAll('a')).map(a => ({
        label: a.querySelector('span.font-bold')?.textContent?.trim() || a.textContent.trim(),
        href: a.getAttribute('href'),
        badge: a.querySelector('div')?.textContent?.trim(),
      }));

      return {
        headerFound,
        subheaderFound,
        overviewFound,
        headerDivFound,
        linkCount: links.length,
        links,
      };
    });

    console.log('About Dropdown Audit:', aboutAudit);
    results.aboutDropdown = aboutAudit;

    assert(!aboutAudit.headerFound, 'About header "CORPORATE CREDIBILITY & TEAM" must be completely removed');
    assert(!aboutAudit.subheaderFound, 'About subheader "Rooted in Hanumangarh, serving global aspirants" must be completely removed');
    assert(!aboutAudit.overviewFound, 'About "Overview →" link must be completely removed');
    assert(!aboutAudit.headerDivFound, 'About header border-b container must be removed');
    assert.strictEqual(aboutAudit.linkCount, 2, `About dropdown must contain exactly 2 menu items, found: ${aboutAudit.linkCount}`);
    console.log('✓ About dropdown header excised and menu options preserved: PASS');

    // Capture About dropdown screenshot
    await page.hover('button[aria-controls="nav-menu-about"]');
    await new Promise(r => setTimeout(r, 200));
    const aboutDropdownEl = await page.$('#nav-menu-about');
    if (aboutDropdownEl) {
      const shotPath = path.join(EVIDENCE_DIR, 'dropdown-about-compact-1440px.png');
      await aboutDropdownEl.screenshot({ path: shotPath });
      results.screenshots.push('dropdown-about-compact-1440px.png');
      console.log('Saved:', shotPath);
    }
    await page.mouse.move(0, 0);

    // -------------------------------------------------------------
    // 4. MOBILE DRAWER CLEANUP (375px)
    // -------------------------------------------------------------
    console.log('\n=== 4. Verifying Mobile Navigation Drawer ===');
    await page.setViewport({ width: 375, height: 812 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    // Open mobile menu
    await page.click('#open-mobile-menu-btn');
    await new Promise(r => setTimeout(r, 300));

    const mobileAudit = await page.evaluate(() => {
      const drawer = document.getElementById('mobile-menu-drawer');
      if (!drawer) return { error: 'Mobile drawer not found' };

      const drawerText = drawer.innerText;
      const drawerHtml = drawer.innerHTML;

      // Check absence of removed header phrases
      const hasCoordination = /flight coordination desk/i.test(drawerText);
      const hasHolds = /verifiable reservation holds/i.test(drawerText);
      const hasCorporate = /corporate credibility & team/i.test(drawerText);
      const hasAspirants = /rooted in hanumangarh/i.test(drawerText);
      const hasPassportSub = /passport, documentation, attestation & legalizations/i.test(drawerText);
      const hasViewAll = drawerText.includes('View All →');

      // Check Overview links inside groups
      const groups = Array.from(drawer.querySelectorAll('.border-b'));
      const groupSummaries = groups.map(g => {
        const title = g.querySelector('span.text-brand-navy')?.textContent?.trim() || '';
        const overviewLink = g.querySelector('a[href*="/"]');
        const overviewText = overviewLink?.textContent?.trim() || '';
        const hasOverview = overviewText.includes('Overview →');
        const sublinks = Array.from(g.querySelectorAll('.space-y-1 a')).map(a => a.textContent.trim());
        return { title, hasOverview, sublinkCount: sublinks.length, sublinks };
      });

      return {
        hasCoordination,
        hasHolds,
        hasCorporate,
        hasAspirants,
        hasPassportSub,
        hasViewAll,
        groupSummaries,
      };
    });

    console.log('Mobile Drawer Audit:', JSON.stringify(mobileAudit, null, 2));
    results.mobileDrawer = mobileAudit;

    assert(!mobileAudit.hasCoordination, 'Mobile drawer must not contain Flight Coordination Desk');
    assert(!mobileAudit.hasHolds, 'Mobile drawer must not contain Verifiable reservation holds');
    assert(!mobileAudit.hasCorporate, 'Mobile drawer must not contain Corporate Credibility & Team');
    assert(!mobileAudit.hasAspirants, 'Mobile drawer must not contain Rooted in Hanumangarh');
    assert(!mobileAudit.hasPassportSub, 'Mobile drawer must not contain Passport, documentation subtext');
    assert(!mobileAudit.hasViewAll, 'Mobile drawer must not contain View All →');

    // Flights group check on mobile
    const flightsMobile = mobileAudit.groupSummaries.find(g => g.title === 'FLIGHTS');
    if (flightsMobile) {
      assert(!flightsMobile.hasOverview, 'Flights group on mobile must not have Overview →');
      assert.strictEqual(flightsMobile.sublinkCount, 2, `Flights group on mobile must have 2 sublinks, found: ${flightsMobile.sublinkCount}`);
    }

    // Additional Services group check on mobile
    const addMobile = mobileAudit.groupSummaries.find(g => g.title === 'ADDITIONAL SERVICES');
    if (addMobile) {
      assert(!addMobile.hasOverview, 'Additional Services group on mobile must not have Overview →');
      assert.strictEqual(addMobile.sublinkCount, 6, `Additional Services group on mobile must have 6 sublinks, found: ${addMobile.sublinkCount}`);
    }

    // About group check on mobile
    const aboutMobile = mobileAudit.groupSummaries.find(g => g.title === 'ABOUT');
    if (aboutMobile) {
      assert(!aboutMobile.hasOverview, 'About group on mobile must not have Overview →');
      assert.strictEqual(aboutMobile.sublinkCount, 2, `About group on mobile must have 2 sublinks, found: ${aboutMobile.sublinkCount}`);
    }

    console.log('✓ Mobile drawer header elements excised and groups preserved: PASS');

    // Capture mobile drawer screenshot
    const mobileDrawerEl = await page.$('#mobile-menu-drawer > div');
    if (mobileDrawerEl) {
      const shotPath = path.join(EVIDENCE_DIR, 'mobile-navigation-drawer-375px.png');
      await mobileDrawerEl.screenshot({ path: shotPath });
      results.screenshots.push('mobile-navigation-drawer-375px.png');
      console.log('Saved:', shotPath);
    }

    // Close mobile menu
    await page.click('#close-mobile-menu-btn');
    await new Promise(r => setTimeout(r, 200));

    // -------------------------------------------------------------
    // 5. MULTI-VIEWPORT OVERFLOW AUDIT (8 Viewports)
    // -------------------------------------------------------------
    console.log('\n=== 5. Multi-Viewport Overflow Audit across 8 Viewports ===');
    const viewports = [320, 360, 390, 430, 768, 1024, 1366, 1440];
    const testPages = [
      { name: 'Homepage', path: '/' },
      { name: 'Flight Booking', path: '/services/flight-booking/' },
      { name: 'Additional Services', path: '/services/additional-services/' },
      { name: 'About', path: '/about/' },
    ];

    let allViewportsPass = true;

    for (const vpWidth of viewports) {
      await page.setViewport({ width: vpWidth, height: 850 });
      results.viewports[vpWidth] = {};

      for (const p of testPages) {
        await page.goto(`http://localhost:${PORT}${p.path}`, { waitUntil: 'networkidle0' });
        const overflow = await page.evaluate(() => {
          const doc = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth);
          const clientWidth = doc.clientWidth;
          return {
            hasOverflow: scrollWidth > clientWidth,
            scrollWidth,
            clientWidth,
            diff: scrollWidth - clientWidth,
          };
        });

        results.viewports[vpWidth][p.name] = overflow;
        if (overflow.hasOverflow) {
          console.error(`❌ Overflow at ${vpWidth}px on ${p.name}: diff=${overflow.diff}px`);
          allViewportsPass = false;
        } else {
          console.log(`✓ ${vpWidth}px on ${p.name}: No overflow (scrollWidth: ${overflow.scrollWidth}, clientWidth: ${overflow.clientWidth})`);
        }
      }
    }

    assert(allViewportsPass, 'Zero horizontal overflow required across all 8 viewports');
    console.log('✓ Multi-viewport overflow audit: ALL 8 VIEWPORTS PASSED');

    // Save audit results to JSON
    fs.writeFileSync(path.join(EVIDENCE_DIR, 'audit-results.json'), JSON.stringify(results, null, 2));
    console.log('\n========================================');
    console.log('OVERALL TEST STATUS: PASSED ✅');
    console.log('========================================\n');

  } catch (err) {
    console.error('Test failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.close();
  }
}

runVerification();
