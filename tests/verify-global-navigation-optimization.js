import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\7ca130ef-5e70-4578-88a2-0879acc42caa';
const PORT = 4382;

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

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName} - ${details}`);
    failedTests++;
  }
}

server.listen(PORT, async () => {
  console.log('================================================================');
  console.log('   VISA CONVENTION — GLOBAL NAVIGATION OPTIMIZATION QA SUITE    ');
  console.log('================================================================\n');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // =========================================================================
    // 1. DESKTOP NAVIGATION STRUCTURE & ORDER
    // =========================================================================
    console.log('--- 1. DESKTOP HEADER NAVIGATION ORDER & CONTACT REMOVAL ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    const headerNavOrder = await page.evaluate(() => {
      const navButtons = Array.from(document.querySelectorAll('header nav button, header nav > a')).map(el => el.textContent.trim());
      const ctaBtn = document.querySelector('header .btn-primary');
      return {
        navButtons,
        ctaText: ctaBtn ? ctaBtn.textContent.trim() : null,
        ctaHref: ctaBtn ? ctaBtn.getAttribute('href') : null,
      };
    });

    console.log('  Found desktop nav buttons:', headerNavOrder.navButtons);
    assert(headerNavOrder.navButtons.length === 5, `Desktop navigation contains exactly 5 trigger buttons (Found: ${headerNavOrder.navButtons.length})`);
    assert(headerNavOrder.navButtons[0] === 'Study Abroad', `Position 1 is Study Abroad (Actual: ${headerNavOrder.navButtons[0]})`);
    assert(headerNavOrder.navButtons[1] === 'Visa Services', `Position 2 is Visa Services (Actual: ${headerNavOrder.navButtons[1]})`);
    assert(headerNavOrder.navButtons[2] === 'Flights', `Position 3 is Flights (Actual: ${headerNavOrder.navButtons[2]})`);
    assert(headerNavOrder.navButtons[3] === 'Additional Services', `Position 4 is Additional Services (Actual: ${headerNavOrder.navButtons[3]})`);
    assert(headerNavOrder.navButtons[4] === 'About', `Position 5 is About (Actual: ${headerNavOrder.navButtons[4]})`);
    assert(!headerNavOrder.navButtons.includes('Contact'), 'Contact is completely absent from desktop navigation buttons');
    assert(headerNavOrder.ctaText && headerNavOrder.ctaText.includes('Request Consultation'), 'Header CTA is Request Consultation');
    assert(headerNavOrder.ctaHref === '/contact/', 'Header CTA links directly to /contact/');

    // Check one row alignment (no wrapping)
    const isSingleRow = await page.evaluate(() => {
      const navEl = document.querySelector('header nav');
      if (!navEl) return false;
      const items = Array.from(navEl.children);
      if (items.length <= 1) return true;
      const firstTop = items[0].getBoundingClientRect().top;
      return items.every(item => Math.abs(item.getBoundingClientRect().top - firstTop) < 4);
    });
    assert(isSingleRow, 'Desktop navigation items remain on one aligned row without wrapping');

    // =========================================================================
    // 2. VISA SERVICES DROPDOWN VERIFICATION
    // =========================================================================
    console.log('\n--- 2. VISA SERVICES DROPDOWN VERIFICATION ---');
    const visaServicesData = await page.evaluate(() => {
      const dropdowns = Array.from(document.querySelectorAll('nav [data-nav-dropdown]'));
      const visaGroup = dropdowns.find(g => g.querySelector('button')?.textContent.includes('Visa Services'));
      if (!visaGroup) return null;
      const menu = visaGroup.querySelector('.nav-dropdown-menu');
      if (!menu) return null;
      const links = Array.from(menu.querySelectorAll('a')).map(a => ({
        text: a.innerText.trim(),
        href: a.getAttribute('href'),
      }));
      return {
        text: menu.innerText,
        links,
      };
    });

    assert(visaServicesData !== null, 'Visa Services dropdown exists in DOM');
    assert(!visaServicesData.text.includes('Additional Services'), 'Additional Services completely removed from Visa Services dropdown');
    const touristLink = visaServicesData.links.find(l => l.href === '/services/tourist-visa/');
    assert(touristLink && touristLink.text.includes('Tourist & Visitor Visa'), 'Visa Services retains Tourist & Visitor Visa');
    const workLink = visaServicesData.links.find(l => l.href === '/services/work-visa/');
    assert(workLink && workLink.text.includes('Work Visa Support'), 'Visa Services retains Work Visa Support');

    // =========================================================================
    // 3. FLIGHTS DROPDOWN & PRE-SELECTION
    // =========================================================================
    console.log('\n--- 3. FLIGHTS DROPDOWN & BOOKING PRE-SELECTION ---');
    const flightsDropdownData = await page.evaluate(() => {
      const dropdowns = Array.from(document.querySelectorAll('nav [data-nav-dropdown]'));
      const flightsGroup = dropdowns.find(g => g.querySelector('button')?.textContent.includes('Flights'));
      if (!flightsGroup) return null;
      const menu = flightsGroup.querySelector('.nav-dropdown-menu');
      if (!menu) return null;
      const links = Array.from(menu.querySelectorAll('a')).map(a => ({
        text: a.innerText.trim(),
        href: a.getAttribute('href'),
      }));
      return {
        text: menu.innerText,
        links,
      };
    });

    assert(flightsDropdownData !== null, 'Flights dropdown exists in DOM');
    const dummyTicketOption = flightsDropdownData.links.find(l => l.text.includes('Dummy Tickets'));
    assert(dummyTicketOption !== undefined, 'Flights dropdown contains "Dummy Tickets" option');
    assert(dummyTicketOption.href.includes('service=reservation-hold'), '"Dummy Tickets" link passes service=reservation-hold URL param');
    assert(dummyTicketOption.href.includes('#flight-enquiry-section'), '"Dummy Tickets" link anchors to #flight-enquiry-section');

    const actualTicketOption = flightsDropdownData.links.find(l => l.text.includes('Confirmed Flight Tickets') || l.text.includes('Actual Flight Tickets'));
    assert(actualTicketOption !== undefined, 'Flights dropdown contains "Confirmed Flight Tickets" option');
    assert(actualTicketOption.href.includes('service=confirmed-ticket'), '"Confirmed Flight Tickets" link passes service=confirmed-ticket URL param');
    assert(actualTicketOption.href.includes('#flight-enquiry-section'), '"Confirmed Flight Tickets" link anchors to #flight-enquiry-section');

    // Test URL Parameter Pre-Selection for Dummy Tickets
    console.log('  Testing navigation with Dummy Tickets URL param...');
    await page.goto(`http://localhost:${PORT}/services/flight-booking/?service=reservation-hold#flight-enquiry-section`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 400));

    const dummyRadioState = await page.evaluate(() => {
      const radio = document.querySelector('input[name="service"][value="reservation-hold"]');
      const card = radio ? radio.closest('[data-service-card]') : null;
      return {
        checked: radio ? radio.checked : false,
        cardHasActiveBorder: card ? card.classList.contains('border-brand-blue') : false,
      };
    });
    assert(dummyRadioState.checked, 'Dummy Tickets URL param successfully pre-selects "reservation-hold" radio');
    assert(dummyRadioState.cardHasActiveBorder, 'Reservation hold card receives active highlighted border');

    // Test URL Parameter Pre-Selection for Confirmed Flight Tickets
    console.log('  Testing navigation with Confirmed Flight Tickets URL param...');
    await page.goto(`http://localhost:${PORT}/services/flight-booking/?service=confirmed-ticket#flight-enquiry-section`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 400));

    const actualRadioState = await page.evaluate(() => {
      const radio = document.querySelector('input[name="service"][value="confirmed-ticket"]');
      const card = radio ? radio.closest('[data-service-card]') : null;
      return {
        checked: radio ? radio.checked : false,
        cardHasActiveBorder: card ? card.classList.contains('border-brand-blue') : false,
      };
    });
    assert(actualRadioState.checked, 'Actual Flight Tickets URL param successfully pre-selects "confirmed-ticket" radio');
    assert(actualRadioState.cardHasActiveBorder, 'Confirmed ticket card receives active highlighted border');

    // =========================================================================
    // 4. ADDITIONAL SERVICES DROPDOWN & ANCHORED SECTIONS
    // =========================================================================
    console.log('\n--- 4. ADDITIONAL SERVICES DROPDOWN (6 EXACT OPTIONS) ---');
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    const additionalServicesData = await page.evaluate(() => {
      const dropdowns = Array.from(document.querySelectorAll('nav [data-nav-dropdown]'));
      const addGroup = dropdowns.find(g => g.querySelector('button')?.textContent.includes('Additional Services'));
      if (!addGroup) return null;
      const menu = addGroup.querySelector('.nav-dropdown-menu');
      if (!menu) return null;
      const links = Array.from(menu.querySelectorAll('a')).map(a => ({
        text: a.innerText.trim(),
        href: a.getAttribute('href'),
      }));
      return {
        text: menu.innerText,
        links,
      };
    });

    assert(additionalServicesData !== null, 'Additional Services dropdown exists in DOM');
    
    // Check the six options in order
    const expectedOptions = [
      { num: 1, name: 'Passport Application Assistance', anchor: '#passport-assistance' },
      { num: 2, name: 'ITR Filing Assistance', anchor: '#itr-filing' },
      { num: 3, name: 'Company Registration Assistance', anchor: '#company-registration' },
      { num: 4, name: 'Police Clearance Certificate (PCC)', anchor: '#pcc-assistance' },
      { num: 5, name: 'Document Apostille', anchor: '#document-apostille' },
      { num: 6, name: 'Document Translation', anchor: '#document-translation' },
    ];

    expectedOptions.forEach((opt) => {
      const foundLink = additionalServicesData.links.find(l => l.text.includes(opt.name));
      assert(foundLink !== undefined, `Option ${opt.num}: "${opt.name}" exists in Additional Services dropdown`);
      if (foundLink) {
        assert(foundLink.href.includes(opt.anchor), `Option ${opt.num} anchors correctly to ${opt.anchor}`);
      }
    });

    // Check overview links
    const overviewLinks = additionalServicesData.links.filter(l => l.href === '/services/additional-services/');
    assert(overviewLinks.length >= 1, 'Additional Services overview link is present in dropdown header / footer');

    // Verify anchored targets exist on /services/additional-services/
    console.log('  Verifying anchor targets on Additional Services page...');
    await page.goto(`http://localhost:${PORT}/services/additional-services/`, { waitUntil: 'networkidle0' });

    const anchorTargetsOnPage = await page.evaluate(() => {
      const targets = [
        'passport-assistance',
        'itr-filing',
        'company-registration',
        'pcc-assistance',
        'document-apostille',
        'document-translation',
      ];
      return targets.map(id => {
        const el = document.getElementById(id);
        return {
          id,
          exists: el !== null,
          hasScrollMargin: el ? el.classList.contains('scroll-mt-28') || el.classList.contains('scroll-mt-24') : false,
        };
      });
    });

    anchorTargetsOnPage.forEach((target) => {
      assert(target.exists, `Anchor target id="${target.id}" exists on /services/additional-services/`);
      assert(target.hasScrollMargin, `Anchor target id="${target.id}" has scroll-margin offset for sticky header`);
    });

    // =========================================================================
    // 5. ACCESSIBILITY & KEYBOARD NAVIGATION (ESCAPE-TO-CLOSE)
    // =========================================================================
    console.log('\n--- 5. ACCESSIBILITY & KEYBOARD INTERACTION ---');
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    // Test clicking dropdown trigger button
    const flightBtn = await page.$('#nav-btn-flights');
    assert(flightBtn !== null, 'Flight dropdown button has accessible id #nav-btn-flights');

    const initialAria = await page.evaluate(() => document.getElementById('nav-btn-flights')?.getAttribute('aria-expanded'));
    assert(initialAria === 'false', 'Initial aria-expanded is "false"');

    // Click to open
    await flightBtn.click();
    await new Promise(r => setTimeout(r, 200));

    const openAria = await page.evaluate(() => document.getElementById('nav-btn-flights')?.getAttribute('aria-expanded'));
    assert(openAria === 'true', 'Clicking trigger updates aria-expanded to "true"');

    // Press Escape to close
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 200));

    const closedAria = await page.evaluate(() => document.getElementById('nav-btn-flights')?.getAttribute('aria-expanded'));
    assert(closedAria === 'false', 'Pressing Escape updates aria-expanded back to "false"');

    const isRefocused = await page.evaluate(() => document.activeElement?.id === 'nav-btn-flights');
    assert(isRefocused, 'Pressing Escape refocuses the trigger button');

    // =========================================================================
    // 6. MOBILE NAVIGATION DRAWER & CONTACT RETENTION
    // =========================================================================
    console.log('\n--- 6. MOBILE NAVIGATION DRAWER & TOUCH TARGETS ---');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    // Open mobile menu
    const openMenuBtn = await page.$('#open-mobile-menu-btn');
    assert(openMenuBtn !== null, 'Mobile hamburger button exists');
    await openMenuBtn.click();
    await new Promise(r => setTimeout(r, 300));

    const drawerVisible = await page.evaluate(() => {
      const drawer = document.getElementById('mobile-menu-drawer');
      return drawer && !drawer.classList.contains('hidden');
    });
    assert(drawerVisible, 'Mobile drawer successfully opens on hamburger button click');

    const mobileMenuContent = await page.evaluate(() => {
      const drawer = document.getElementById('mobile-menu-drawer');
      if (!drawer) return null;
      const text = drawer.innerText;
      const links = Array.from(drawer.querySelectorAll('a')).map(a => ({
        text: a.innerText.trim(),
        href: a.getAttribute('href'),
      }));
      return { text, links };
    });

    const upperText = mobileMenuContent.text.toUpperCase();
    assert(upperText.includes('STUDY ABROAD'), 'Mobile drawer contains Study Abroad section');
    assert(upperText.includes('VISA SERVICES'), 'Mobile drawer contains Visa Services section');
    assert(upperText.includes('FLIGHTS'), 'Mobile drawer contains Flights section');
    assert(upperText.includes('ADDITIONAL SERVICES'), 'Mobile drawer contains Additional Services section');
    assert(upperText.includes('ABOUT'), 'Mobile drawer contains About section');

    assert(mobileMenuContent.links.some(l => l.text.includes('Dummy Tickets')), 'Mobile drawer contains Dummy Tickets link');
    assert(mobileMenuContent.links.some(l => l.text.includes('Confirmed Flight Tickets') || l.text.includes('Actual Flight Tickets')), 'Mobile drawer contains Confirmed Flight Tickets link');
    assert(mobileMenuContent.links.some(l => l.text.includes('Passport Application Assistance')), 'Mobile drawer contains Passport Application Assistance link');
    assert(mobileMenuContent.links.some(l => l.text.includes('Document Translation')), 'Mobile drawer contains Document Translation link');

    // Verify Contact is NOT a nav item but Request Consultation button exists
    const contactAsNavItem = mobileMenuContent.links.filter(l => l.href === '/contact/' && l.text === 'Contact');
    assert(contactAsNavItem.length === 0, 'Contact is absent from regular mobile navigation items');
    const mobileCta = mobileMenuContent.links.find(l => l.href === '/contact/' && l.text.includes('Request Consultation'));
    assert(mobileCta !== undefined, 'Mobile drawer preserves bottom Request Consultation CTA button');

    // Close mobile menu with Escape
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 300));
    const drawerClosed = await page.evaluate(() => {
      const drawer = document.getElementById('mobile-menu-drawer');
      return drawer && drawer.classList.contains('hidden');
    });
    assert(drawerClosed, 'Mobile drawer closes on Escape key');

    // =========================================================================
    // 7. MULTI-VIEWPORT RESPONSIVE OVERFLOW AUDIT & SCREENSHOTS
    // =========================================================================
    console.log('\n--- 7. MULTI-VIEWPORT RESPONSIVE OVERFLOW AUDIT ---');
    const viewports = [
      { name: 'Mobile Mini', width: 320, height: 600 },
      { name: 'Android Compact', width: 360, height: 740 },
      { name: 'iPhone SE', width: 375, height: 667 },
      { name: 'iPhone 14/15', width: 390, height: 844 },
      { name: 'iPhone Pro Max', width: 430, height: 932 },
      { name: 'iPad Mini (Tablet)', width: 768, height: 1024 },
      { name: 'iPad Pro / Small Desktop', width: 1024, height: 768 },
      { name: 'Standard Laptop', width: 1366, height: 768 },
      { name: 'Desktop Full HD', width: 1440, height: 900 },
    ];

    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 200));

      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        return {
          docWidth,
          winWidth,
          hasOverflow: docWidth > winWidth,
        };
      });

      assert(!overflow.hasOverflow, `${vp.name} (${vp.width}px): Zero horizontal overflow (${overflow.docWidth}px <= ${overflow.winWidth}px)`);
    }

    // Capture visual evidence screenshots
    console.log('\n--- CAPTURING EVIDENCE SCREENSHOTS ---');
    
    // Desktop 1440px with Flights Dropdown Open
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    const flightsBtnEl = await page.$('#nav-btn-flights');
    if (flightsBtnEl) {
      await flightsBtnEl.click();
      await new Promise(r => setTimeout(r, 300));
    }
    const desktopFlightsShot = path.join(ARTIFACTS_DIR, 'nav-desktop-flights-dropdown.png');
    await page.screenshot({ path: desktopFlightsShot, clip: { x: 0, y: 0, width: 1440, height: 500 } });
    console.log(`  📸 Saved desktop flights dropdown screenshot to: ${desktopFlightsShot}`);

    // Desktop 1440px with Additional Services Dropdown Open
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    const addBtnEl = await page.$('#nav-btn-additional-services');
    if (addBtnEl) {
      await addBtnEl.click();
      await new Promise(r => setTimeout(r, 300));
    }
    const desktopAddShot = path.join(ARTIFACTS_DIR, 'nav-desktop-additional-services-dropdown.png');
    await page.screenshot({ path: desktopAddShot, clip: { x: 0, y: 0, width: 1440, height: 600 } });
    console.log(`  📸 Saved desktop additional services dropdown screenshot to: ${desktopAddShot}`);

    // Desktop Header Overview (Clean)
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    const desktopHeaderShot = path.join(ARTIFACTS_DIR, 'nav-desktop-header-overview.png');
    await page.screenshot({ path: desktopHeaderShot, clip: { x: 0, y: 0, width: 1440, height: 200 } });
    console.log(`  📸 Saved desktop header screenshot to: ${desktopHeaderShot}`);

    // Mobile Drawer Open Screenshot
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    const mobOpenBtn = await page.$('#open-mobile-menu-btn');
    if (mobOpenBtn) {
      await mobOpenBtn.click();
      await new Promise(r => setTimeout(r, 400));
    }
    const mobileDrawerShot = path.join(ARTIFACTS_DIR, 'nav-mobile-drawer.png');
    await page.screenshot({ path: mobileDrawerShot });
    console.log(`  📸 Saved mobile drawer screenshot to: ${mobileDrawerShot}`);

    // Flight Booking Page with Pre-Selected Service
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(`http://localhost:${PORT}/services/flight-booking/?service=reservation-hold#flight-enquiry-section`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 400));
    const flightPreselectShot = path.join(ARTIFACTS_DIR, 'nav-flight-preselect-dummy-ticket.png');
    await page.screenshot({ path: flightPreselectShot, clip: { x: 100, y: 150, width: 1166, height: 550 } });
    console.log(`  📸 Saved flight booking preselect screenshot to: ${flightPreselectShot}`);

    console.log('\n=======================================================');
    console.log(`TOTAL CHECKS: ${totalTests}`);
    console.log(`PASSED: ${passedTests}`);
    console.log(`FAILED: ${failedTests}`);
    console.log('=======================================================');

    if (failedTests === 0) {
      console.log('\n🎉 ALL GLOBAL NAVIGATION OPTIMIZATION CHECKS PASSED (100%)');
    } else {
      console.error(`\n❌ ${failedTests} CHECKS FAILED`);
      process.exitCode = 1;
    }
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.close();
  }
});
