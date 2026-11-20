import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';
import assert from 'assert';

const DIST = path.resolve('dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\6a0361a6-ccbe-4f53-a463-b2d5ee259bd4\\master-cleanup-and-whatsapp-animation';
const PORT = 4398;

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
    touristVisa: {},
    workVisa: {},
    dropdowns: {},
    whatsApp: {},
    viewports: {},
    screenshots: [],
    allPass: true,
  };

  try {
    // -------------------------------------------------------------
    // 1. TOURIST VISA NOTICES ABSENCE
    // -------------------------------------------------------------
    console.log('\n=== 1. Verifying Tourist Visa Notices Removal ===');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/services/tourist-visa/`, { waitUntil: 'networkidle0' });

    const touristAudit = await page.evaluate(() => {
      const html = document.body.innerHTML;
      const text = document.body.innerText;

      // Check Schengen Zone Information Note absence
      const schengenNoteFound = text.includes('Schengen Zone Information: Visa Convention lists 16 primary Schengen destinations') ||
                                html.includes('Schengen Zone Information:');

      // Check Statutory Note absence
      const statutoryNoteFound = text.includes('Statutory Note: Visa issuance authority rests solely with destination government consular officers') ||
                                 (html.includes('Statutory Note:') && html.includes('consular officers'));

      // Check preservation of core functionality
      const destinationsGrid = document.getElementById('tourist-countries-grid');
      const countryTiles = Array.from(document.querySelectorAll('.tourist-country-btn, [data-country-btn]'));
      const form = document.getElementById('visa-enquiry-form');
      const detailsPanel = document.getElementById('tourist-details-panel');

      return {
        schengenNoteFound,
        statutoryNoteFound,
        hasGrid: Boolean(destinationsGrid),
        tilesCount: countryTiles.length,
        hasForm: Boolean(form),
        hasDetailsPanel: Boolean(detailsPanel),
      };
    });

    console.log('Tourist Visa Audit:', touristAudit);
    results.touristVisa = touristAudit;

    assert(!touristAudit.schengenNoteFound, 'Schengen Zone Information Note should be completely removed');
    assert(!touristAudit.statutoryNoteFound, 'Statutory Note should be completely removed');
    assert(touristAudit.hasGrid && touristAudit.tilesCount === 27, `Expected 27 country tiles, found: ${touristAudit.tilesCount}`);
    assert(touristAudit.hasForm, 'Assessment form must be preserved');
    console.log('✓ Tourist Visa notices removed & core directory preserved: PASS');

    // Capture Tourist Visa desktop & mobile screenshots
    const touristSection = await page.$('section:has(#destinations)');
    if (touristSection) {
      const shotPath = path.join(EVIDENCE_DIR, 'tourist-visa-clean-desktop-1440px.png');
      await touristSection.screenshot({ path: shotPath });
      results.screenshots.push('tourist-visa-clean-desktop-1440px.png');
      console.log('Saved:', shotPath);
    }

    // -------------------------------------------------------------
    // 2. WORK VISA NOTICE ABSENCE
    // -------------------------------------------------------------
    console.log('\n=== 2. Verifying Work Visa Notice Removal ===');
    await page.goto(`http://localhost:${PORT}/services/work-visa/`, { waitUntil: 'networkidle0' });

    const workAudit = await page.evaluate(() => {
      const html = document.body.innerHTML;
      const text = document.body.innerText;

      // Check Statutory Compliance Notice (Emigration Act 1983) absence
      const statutoryNoticeFound = text.includes('Statutory Compliance Notice') ||
                                   html.includes('Statutory Compliance Notice') ||
                                   html.includes('Emigration Act, 1983');

      const occupationsRoot = document.querySelector('.occupation-accordion-root');
      const occItems = document.querySelectorAll('.occ-item');
      const form = document.getElementById('visa-enquiry-form');

      return {
        statutoryNoticeFound,
        hasOccupationsRoot: Boolean(occupationsRoot),
        occCount: occItems.length,
        hasForm: Boolean(form),
      };
    });

    console.log('Work Visa Audit:', workAudit);
    results.workVisa = workAudit;

    assert(!workAudit.statutoryNoticeFound, 'Work Visa Statutory Compliance Notice should be completely removed');
    assert(workAudit.hasOccupationsRoot && workAudit.occCount === 12, `Expected 12 occupations, found: ${workAudit.occCount}`);
    assert(workAudit.hasForm, 'Assessment form must be preserved');
    console.log('✓ Work Visa Statutory Compliance Notice removed & grid preserved: PASS');

    const workSection = await page.$('section:has(#occupations)');
    if (workSection) {
      const shotPath = path.join(EVIDENCE_DIR, 'work-visa-clean-desktop-1440px.png');
      await workSection.screenshot({ path: shotPath });
      results.screenshots.push('work-visa-clean-desktop-1440px.png');
      console.log('Saved:', shotPath);
    }

    // -------------------------------------------------------------
    // 3. HEADER DROPDOWNS CLEANUP (Desktop & Mobile)
    // -------------------------------------------------------------
    console.log('\n=== 3. Verifying Header Dropdowns Cleanup ===');
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    const dropdownAudit = await page.evaluate(() => {
      const nav = document.querySelector('nav[aria-label="Main Navigation"]');
      const html = nav?.innerHTML || '';
      const text = nav?.innerText || '';

      // About dropdown checks
      const aboutAddressFound = text.includes('Shop No.115, Durga Market') || html.includes('Shop No.115, Durga Market');
      const aboutVisitFound = text.includes('Visit Center →') || html.includes('Visit Center →') || html.includes('Visit Center');

      // Flights dropdown checks
      const flightsPnrFound = text.includes('Zero Fake PNRs') || html.includes('Zero Fake PNRs');
      const flightsDeskFound = text.includes('Flight Booking Desk →') || html.includes('Flight Booking Desk');

      // Additional Services dropdown checks
      const addSupportFound = text.includes('Administrative Support from Hanumangarh') || html.includes('Administrative Support from Hanumangarh');
      const addViewAllFound = text.includes('View All Additional Services →') || html.includes('View All Additional Services');

      // Check retained items: Flights (Dummy & Confirmed), Additional Services (6 items), About items
      const flightLinks = Array.from(document.querySelectorAll('#nav-menu-flights a')).map(a => a.textContent.trim());
      const hasDummyTickets = flightLinks.some(t => t.includes('Dummy Tickets'));
      const hasConfirmedTickets = flightLinks.some(t => t.includes('Confirmed Flight Tickets'));

      const addLinks = Array.from(document.querySelectorAll('#nav-menu-additional-services a')).map(a => a.getAttribute('href'));
      const addCount = addLinks.filter(h => h && h.includes('/services/additional-services/')).length;

      const aboutLinks = Array.from(document.querySelectorAll('#nav-menu-about a')).map(a => a.getAttribute('href'));
      const aboutCount = aboutLinks.length;

      // Mobile menu drawer check
      const drawer = document.getElementById('mobile-menu-drawer');
      const drawerText = drawer?.innerText || '';
      const drawerAddressFound = drawerText.includes('Shop No.115, Durga Market');

      return {
        aboutAddressFound,
        aboutVisitFound,
        flightsPnrFound,
        flightsDeskFound,
        addSupportFound,
        addViewAllFound,
        hasDummyTickets,
        hasConfirmedTickets,
        addCount,
        aboutCount,
        drawerAddressFound,
      };
    });

    console.log('Dropdown Audit:', JSON.stringify(dropdownAudit, null, 2));
    results.dropdowns = dropdownAudit;

    assert(!dropdownAudit.aboutAddressFound, 'About dropdown address footer must be removed');
    assert(!dropdownAudit.aboutVisitFound, 'About dropdown "Visit Center →" must be removed');
    assert(!dropdownAudit.flightsPnrFound, 'Flights dropdown "Zero Fake PNRs" footer must be removed');
    assert(!dropdownAudit.flightsDeskFound, 'Flights dropdown "Flight Booking Desk →" must be removed');
    assert(!dropdownAudit.addSupportFound, 'Additional Services dropdown "Administrative Support" footer must be removed');
    assert(!dropdownAudit.addViewAllFound, 'Additional Services dropdown "View All Additional Services →" must be removed');
    assert(!dropdownAudit.drawerAddressFound, 'Mobile drawer bottom address text must be removed');
    assert(dropdownAudit.hasDummyTickets && dropdownAudit.hasConfirmedTickets, 'Dummy Tickets and Confirmed Tickets links must be preserved');
    assert(dropdownAudit.addCount >= 6, `Expected at least 6 additional services entries, found: ${dropdownAudit.addCount}`);
    console.log('✓ Dropdown footer rows removed & menu entries preserved: PASS');

    // Capture Header Dropdown Screenshots (hover/focus Flights, Additional Services, About)
    console.log('Capturing dropdown screenshots...');
    // Open Flights dropdown
    await page.hover('button[aria-controls="nav-menu-flights"]');
    await new Promise(r => setTimeout(r, 200));
    const flightsDropdown = await page.$('#nav-menu-flights');
    if (flightsDropdown) {
      const shotPath = path.join(EVIDENCE_DIR, 'dropdown-flights-clean-desktop.png');
      await flightsDropdown.screenshot({ path: shotPath });
      results.screenshots.push('dropdown-flights-clean-desktop.png');
      console.log('Saved:', shotPath);
    }

    // Open Additional Services dropdown
    await page.hover('button[aria-controls="nav-menu-additional-services"]');
    await new Promise(r => setTimeout(r, 200));
    const addDropdown = await page.$('#nav-menu-additional-services');
    if (addDropdown) {
      const shotPath = path.join(EVIDENCE_DIR, 'dropdown-additional-services-clean-desktop.png');
      await addDropdown.screenshot({ path: shotPath });
      results.screenshots.push('dropdown-additional-services-clean-desktop.png');
      console.log('Saved:', shotPath);
    }

    // Open About dropdown
    await page.hover('button[aria-controls="nav-menu-about"]');
    await new Promise(r => setTimeout(r, 200));
    const aboutDropdown = await page.$('#nav-menu-about');
    if (aboutDropdown) {
      const shotPath = path.join(EVIDENCE_DIR, 'dropdown-about-clean-desktop.png');
      await aboutDropdown.screenshot({ path: shotPath });
      results.screenshots.push('dropdown-about-clean-desktop.png');
      console.log('Saved:', shotPath);
    }

    // Unhover to close dropdown
    await page.mouse.move(0, 0);

    // -------------------------------------------------------------
    // 4. FLOATING WHATSAPP BUTTON ANIMATION & ACCESSIBILITY
    // -------------------------------------------------------------
    console.log('\n=== 4. Verifying Floating WhatsApp Animation & Accessibility ===');
    const waAudit = await page.evaluate(() => {
      const btn = document.getElementById('floating-whatsapp-btn');
      const tooltip = document.getElementById('wa-contact-tooltip');
      const pulseRing = document.getElementById('wa-pulse-ring');
      const aside = btn?.closest('aside');

      if (!btn) return { error: 'WhatsApp button not found' };

      const href = btn.getAttribute('href') || '';
      const ariaLabel = btn.getAttribute('aria-label') || '';
      const tooltipText = tooltip?.textContent.trim() || '';

      const asideStyle = aside?.getAttribute('style') || '';
      const hasSafeArea = asideStyle.includes('safe-area-inset-bottom') && asideStyle.includes('safe-area-inset-right');

      const computed = window.getComputedStyle(btn);
      const minHeight = parseInt(computed.minHeight, 10);
      const minWidth = parseInt(computed.minWidth, 10);

      // Check keyframes in document
      let hasPulseKeyframe = false;
      let hasShadow = false;
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules)) {
            if (rule.type === CSSRule.KEYFRAMES_RULE && rule.name === 'wa-btn-pulse') {
              hasPulseKeyframe = true;
              hasShadow = rule.cssText.includes('box-shadow');
            }
          }
        } catch (_) {}
      }

      return {
        href,
        hasCorrectNumber: href.includes('919680395539'),
        ariaLabel,
        tooltipText,
        hasTooltip: Boolean(tooltip),
        hasPulseRing: Boolean(pulseRing),
        hasSafeArea,
        minHeightPass: minHeight >= 44,
        minWidthPass: minWidth >= 44,
        hasPulseKeyframe,
        hasShadow,
      };
    });

    console.log('WhatsApp Audit:', waAudit);
    results.whatsApp = waAudit;

    assert(waAudit.hasCorrectNumber, `WhatsApp URL must contain 919680395539, found: ${waAudit.href}`);
    assert(waAudit.tooltipText.includes('Need help? Chat with us!'), `Tooltip text should include "Need help? Chat with us!", found: ${waAudit.tooltipText}`);
    assert(waAudit.minHeightPass && waAudit.minWidthPass, 'WhatsApp button must meet minimum 44px touch target');
    assert(waAudit.hasPulseKeyframe, 'CSS keyframes wa-btn-pulse must be defined');
    assert(waAudit.hasShadow, 'wa-btn-pulse must include green box-shadow animation');
    console.log('✓ WhatsApp button, animation keyframes, and accessibility: PASS');

    // Trigger pulse and capture screenshot of floating WhatsApp widget with active glow
    await page.evaluate(() => {
      const btn = document.getElementById('floating-whatsapp-btn');
      const pulseRing = document.getElementById('wa-pulse-ring');
      const tooltip = document.getElementById('wa-contact-tooltip');
      btn?.classList.add('wa-btn-pulse-active');
      pulseRing?.classList.add('wa-pulse-active');
      tooltip?.classList.remove('opacity-0', 'translate-y-2', 'pointer-events-none');
      tooltip?.classList.add('opacity-100', 'translate-y-0');
    });

    await new Promise(r => setTimeout(r, 200));
    const waAside = await page.$('aside[aria-label="WhatsApp direct messaging option"]');
    if (waAside) {
      const shotPath = path.join(EVIDENCE_DIR, 'whatsapp-floating-glow-and-tooltip.png');
      await waAside.screenshot({ path: shotPath });
      results.screenshots.push('whatsapp-floating-glow-and-tooltip.png');
      console.log('Saved:', shotPath);
    }

    // -------------------------------------------------------------
    // 5. MULTI-VIEWPORT AUDIT (Zero Horizontal Overflow across 9 viewports)
    // -------------------------------------------------------------
    console.log('\n=== 5. Multi-Viewport Overflow Audit across 9 Viewports ===');
    const viewports = [320, 360, 375, 390, 430, 768, 1024, 1366, 1440];
    const testPages = [
      { name: 'Homepage', path: '/' },
      { name: 'Tourist Visa', path: '/services/tourist-visa/' },
      { name: 'Work Visa', path: '/services/work-visa/' },
    ];

    let allViewportsPass = true;

    for (const vpWidth of viewports) {
      await page.setViewport({ width: vpWidth, height: 850 });
      results.viewports[vpWidth] = {};

      for (const p of testPages) {
        await page.goto(`http://localhost:${PORT}${p.path}`, { waitUntil: 'networkidle0' });
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
          console.log(`✓ ${vpWidth}px on ${p.name}: No overflow (scrollWidth: ${overflowAudit.scrollWidth}, clientWidth: ${overflowAudit.clientWidth})`);
        }
      }
    }

    results.allPass = !touristAudit.schengenNoteFound &&
                      !touristAudit.statutoryNoteFound &&
                      !workAudit.statutoryNoticeFound &&
                      !dropdownAudit.aboutAddressFound &&
                      !dropdownAudit.flightsPnrFound &&
                      !dropdownAudit.addSupportFound &&
                      waAudit.hasCorrectNumber &&
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
