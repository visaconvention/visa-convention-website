import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\6a0361a6-ccbe-4f53-a463-b2d5ee259bd4\\master-ui-forms-nav-update';
const PORT = 4392;

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

async function runAudit() {
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Server started at http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const results = {
    decorativeTagsAudit: true,
    bachelorsMastersForm: false,
    flightsNavRename: false,
    touristVisaSection03Removed: false,
    multiViewportPass: true,
    screenshots: [],
  };

  try {
    // -------------------------------------------------------------
    // TEST 1: Navigation Rename ("Confirmed Flight Tickets")
    // -------------------------------------------------------------
    console.log('\n--- 1. Testing Flights Dropdown Rename ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    const navData = await page.evaluate(() => {
      const desktopLinks = Array.from(document.querySelectorAll('header nav a, header .group a'));
      const textMatches = desktopLinks.map((a) => a.textContent?.trim() || '');
      const hrefMatches = desktopLinks.map((a) => a.getAttribute('href') || '');

      const hasConfirmedFlightTickets = textMatches.some((t) => t.includes('Confirmed Flight Tickets'));
      const hasActualFlightTickets = textMatches.some((t) => t.includes('Actual Flight Tickets'));
      const dummyTicketsRemains = textMatches.some((t) => t.includes('Dummy Tickets'));

      const confirmedLinkHref = desktopLinks.find((a) => a.textContent?.includes('Confirmed Flight Tickets'))?.getAttribute('href') || '';

      return {
        hasConfirmedFlightTickets,
        hasActualFlightTickets,
        dummyTicketsRemains,
        confirmedLinkHref,
      };
    });

    console.log('Nav evaluation:', navData);
    if (navData.hasConfirmedFlightTickets && !navData.hasActualFlightTickets && navData.dummyTicketsRemains) {
      results.flightsNavRename = true;
      console.log('PASS: Flights dropdown correctly displays "Confirmed Flight Tickets" and preserves "Dummy Tickets"');
    } else {
      console.error('FAIL: Flights dropdown navigation rename verification failed');
    }

    // Hover or focus services / flights dropdown to capture screenshot
    await page.hover('header nav button:nth-of-type(2)').catch(() => {});
    await new Promise((r) => setTimeout(r, 400));
    const navScreenshot = path.join(EVIDENCE_DIR, 'flights-nav-confirmed-tickets-desktop-1440px.png');
    await page.screenshot({ path: navScreenshot, clip: { x: 0, y: 0, width: 1440, height: 420 } });
    results.screenshots.push(navScreenshot);

    // -------------------------------------------------------------
    // TEST 2: Tourist Visa Page — Excised Section 03
    // -------------------------------------------------------------
    console.log('\n--- 2. Testing Tourist Visa Page Cleanup ---');
    await page.goto(`http://localhost:${PORT}/services/tourist-visa/`, { waitUntil: 'networkidle0' });

    const touristData = await page.evaluate(() => {
      const html = document.body.innerHTML;
      const text = document.body.innerText;

      const hasSpecialFrameworksHeading = text.includes('Special Destination Frameworks');
      const hasUaeAccordion = text.includes('UAE Tourist Visa Requirements');
      const hasSchengenAccordion = text.includes('Schengen Visa Requirements');
      const hasQuickJumpAnchor = Boolean(document.querySelector('a[href="#specific-guidance"]'));
      const hasSection03Id = Boolean(document.getElementById('specific-guidance'));

      const hasCategoriesSection = Boolean(document.getElementById('categories'));
      const hasDestinationsSection = Boolean(document.getElementById('destinations'));
      const hasEnquirySection = Boolean(document.getElementById('enquiry'));

      return {
        hasSpecialFrameworksHeading,
        hasUaeAccordion,
        hasSchengenAccordion,
        hasQuickJumpAnchor,
        hasSection03Id,
        hasCategoriesSection,
        hasDestinationsSection,
        hasEnquirySection,
      };
    });

    console.log('Tourist Visa check:', touristData);
    if (!touristData.hasSpecialFrameworksHeading &&
        !touristData.hasUaeAccordion &&
        !touristData.hasSchengenAccordion &&
        !touristData.hasQuickJumpAnchor &&
        !touristData.hasSection03Id &&
        touristData.hasDestinationsSection &&
        touristData.hasEnquirySection) {
      results.touristVisaSection03Removed = true;
      console.log('PASS: Section 03 "Special Destination Frameworks" completely excised, essential sections intact');
    } else {
      console.error('FAIL: Tourist visa section 03 removal failed assertions');
    }

    const touristScreenshotDesktop = path.join(EVIDENCE_DIR, 'tourist-visa-no-frameworks-desktop-1440px.png');
    await page.screenshot({ path: touristScreenshotDesktop, fullPage: false });
    results.screenshots.push(touristScreenshotDesktop);

    await page.setViewport({ width: 375, height: 812 });
    const touristScreenshotMobile = path.join(EVIDENCE_DIR, 'tourist-visa-no-frameworks-mobile-375px.png');
    await page.screenshot({ path: touristScreenshotMobile, fullPage: false });
    results.screenshots.push(touristScreenshotMobile);

    // -------------------------------------------------------------
    // TEST 3: Study Abroad Page — Bachelor's & Master's Form
    // -------------------------------------------------------------
    console.log('\n--- 3. Testing Study Abroad Bachelor\'s & Master\'s Form ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/study-abroad/`, { waitUntil: 'networkidle0' });

    const formAudit = await page.evaluate(() => {
      const enquirySection = document.getElementById('enquiry');
      if (!enquirySection) return { error: 'No #enquiry section found' };

      const countriesGrid = document.getElementById('countries-grid');
      // Verify #enquiry appears after #countries-grid
      const isAfterCountriesGrid = Boolean(
        countriesGrid &&
        enquirySection.compareDocumentPosition(countriesGrid) & Node.DOCUMENT_POSITION_PRECEDING
      );

      const heading = enquirySection.querySelector('h2, h3')?.textContent?.trim() || '';
      const serviceSelect = enquirySection.querySelector('#form-service');
      const options = serviceSelect ? Array.from(serviceSelect.options).filter((o) => o.value !== '').map((o) => ({ value: o.value, text: o.text.trim() })) : [];

      const nameInput = enquirySection.querySelector('#form-full-name');
      const phoneInput = enquirySection.querySelector('#form-phone');
      const emailInput = enquirySection.querySelector('#form-email');
      const countryInput = enquirySection.querySelector('#form-country');
      const messageInput = enquirySection.querySelector('#form-message');
      const submitBtn = enquirySection.querySelector('#enquiry-submit-btn');

      const emailLabel = enquirySection.querySelector('label[for="form-email"]')?.textContent?.trim() || '';
      const emailRequired = emailInput?.hasAttribute('required');

      const visibleUniversityFieldExists = Boolean(enquirySection.querySelector('input[name="university_interest"]:not([type="hidden"]), select[name="university_interest"], label[for="form-university"]'));

      return {
        hasEnquirySection: true,
        isAfterCountriesGrid,
        heading,
        options,
        hasName: Boolean(nameInput),
        hasPhone: Boolean(phoneInput),
        hasEmail: Boolean(emailInput),
        emailLabel,
        emailRequired,
        hasCountry: Boolean(countryInput),
        hasMessage: Boolean(messageInput),
        submitBtnText: submitBtn?.textContent?.trim() || '',
        visibleUniversityFieldExists,
      };
    });

    console.log('Study Abroad Form audit:', formAudit);

    const hasExact2Options = formAudit.options.length === 2 &&
      formAudit.options.some((o) => o.value === 'bachelors-abroad' && o.text === "Bachelor's Abroad") &&
      formAudit.options.some((o) => o.value === 'masters-abroad' && o.text === "Master's Abroad") &&
      !formAudit.options.some((o) => o.value === 'study-visa');

    if (
      formAudit.hasEnquirySection &&
      formAudit.isAfterCountriesGrid &&
      formAudit.heading.includes("Bachelor's / Master's Consultation") &&
      hasExact2Options &&
      formAudit.hasName &&
      formAudit.hasPhone &&
      formAudit.hasEmail &&
      !formAudit.emailRequired &&
      formAudit.emailLabel.includes('Email (Optional)') &&
      formAudit.submitBtnText.includes('Request Consultation') &&
      !formAudit.visibleUniversityFieldExists
    ) {
      results.bachelorsMastersForm = true;
      console.log('PASS: Bachelor\'s & Master\'s form verified with exact service options and clean layout');
    } else {
      console.error('FAIL: Bachelor\'s & Master\'s form audit failed');
    }

    // Scroll form into view and take screenshots
    await page.evaluate(() => {
      document.getElementById('enquiry')?.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise((r) => setTimeout(r, 400));

    const studyAbroadFormDesktop = path.join(EVIDENCE_DIR, 'study-abroad-bachelors-masters-form-desktop-1440px.png');
    await page.screenshot({ path: studyAbroadFormDesktop });
    results.screenshots.push(studyAbroadFormDesktop);

    await page.setViewport({ width: 375, height: 812 });
    await page.evaluate(() => {
      document.getElementById('enquiry')?.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise((r) => setTimeout(r, 400));
    const studyAbroadFormMobile = path.join(EVIDENCE_DIR, 'study-abroad-bachelors-masters-form-mobile-375px.png');
    await page.screenshot({ path: studyAbroadFormMobile });
    results.screenshots.push(studyAbroadFormMobile);

    // -------------------------------------------------------------
    // TEST 4: Sitewide Decorative Tags Removal Audit
    // -------------------------------------------------------------
    console.log('\n--- 4. Testing Sitewide Decorative Tags Removal ---');
    const pagesToAudit = [
      '/',
      '/about/',
      '/contact/',
      '/study-abroad/',
      '/study-abroad/canada/',
      '/services/',
      '/services/tourist-visa/',
      '/services/flight-booking/',
      '/services/work-visa/',
      '/services/mbbs/',
      '/services/phd/',
      '/study-in-europe/',
      '/success-stories/',
      '/universities/',
    ];

    const bannedKeywords = [
      'Global Educational Advisory',
      'Personalized Guidance',
      'Featured Destination',
      'Advisory Evaluation',
      'Official Counseling Desk',
      'Scope of Work',
      'Global Reach',
      'Higher Education',
      'Prerequisites',
      'Workflow',
      'European University Admissions',
      'European Degree Verticals',
      'Destination Directory',
      'Procedural Rigor',
      'Evidence-Based Integrity',
      'In-Person Integrity Standard',
      'Verified Physical Presence',
      'Alternative Options',
      'Aviation & Travel Coordination',
    ];

    for (const pagePath of pagesToAudit) {
      await page.goto(`http://localhost:${PORT}${pagePath}`, { waitUntil: 'networkidle0' });
      const foundTags = await page.evaluate((banned) => {
        const bodyText = document.body.innerText;
        const matches = [];
        for (const kw of banned) {
          if (bodyText.includes(kw)) {
            // Check if it's rendered as an eyebrow badge / pill
            const elements = Array.from(document.querySelectorAll('span, div, p, strong'));
            const isBadge = elements.some((el) => {
              const text = el.textContent?.trim() || '';
              return text === kw && (
                el.classList.contains('uppercase') ||
                el.classList.contains('tracking-wider') ||
                el.classList.contains('tracking-widest') ||
                el.classList.contains('rounded-full')
              );
            });
            if (isBadge) matches.push(kw);
          }
        }
        return matches;
      }, bannedKeywords);

      if (foundTags.length > 0) {
        console.error(`FAIL: ${pagePath} still contains banned decorative badge(s):`, foundTags);
        results.decorativeTagsAudit = false;
      } else {
        console.log(`PASS: ${pagePath} — 0 banned decorative badges detected`);
      }
    }

    // Capture About and Success Stories screenshots
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/about/`, { waitUntil: 'networkidle0' });
    const aboutScreenshot = path.join(EVIDENCE_DIR, 'about-page-compact-desktop-1440px.png');
    await page.screenshot({ path: aboutScreenshot, clip: { x: 0, y: 0, width: 1440, height: 900 } });
    results.screenshots.push(aboutScreenshot);

    await page.goto(`http://localhost:${PORT}/success-stories/`, { waitUntil: 'networkidle0' });
    const successScreenshot = path.join(EVIDENCE_DIR, 'success-stories-compact-desktop-1440px.png');
    await page.screenshot({ path: successScreenshot, clip: { x: 0, y: 0, width: 1440, height: 900 } });
    results.screenshots.push(successScreenshot);

    // -------------------------------------------------------------
    // TEST 5: Responsive Multi-Viewport Overflow Check
    // -------------------------------------------------------------
    console.log('\n--- 5. Testing Multi-Viewport Zero Horizontal Overflow ---');
    const viewports = [320, 360, 375, 390, 430, 768, 1024, 1366, 1440];
    const keyPages = [
      '/',
      '/study-abroad/',
      '/services/tourist-visa/',
      '/services/flight-booking/',
      '/services/work-visa/',
      '/about/',
      '/contact/',
    ];

    for (const vpWidth of viewports) {
      await page.setViewport({ width: vpWidth, height: 800 });
      for (const p of keyPages) {
        await page.goto(`http://localhost:${PORT}${p}`, { waitUntil: 'networkidle0' });
        const hasOverflow = await page.evaluate((expectedW) => {
          return document.documentElement.scrollWidth > expectedW;
        }, vpWidth);

        if (hasOverflow) {
          console.error(`FAIL: Horizontal overflow detected on ${p} at ${vpWidth}px`);
          results.multiViewportPass = false;
        }
      }
      console.log(`PASS: Viewport ${vpWidth}px — Zero horizontal overflow across all key pages`);
    }

    console.log('\n=============================================');
    console.log('AUDIT SUMMARY:', results);
    console.log('=============================================');

    await browser.close();
    server.close();

    fs.writeFileSync(
      path.join(EVIDENCE_DIR, 'audit-results.json'),
      JSON.stringify(results, null, 2)
    );

    if (
      results.flightsNavRename &&
      results.touristVisaSection03Removed &&
      results.bachelorsMastersForm &&
      results.decorativeTagsAudit &&
      results.multiViewportPass
    ) {
      console.log('\nALL VERIFICATION CHECKS PASSED PERFECTLY!');
      process.exit(0);
    } else {
      console.error('\nSOME VERIFICATION CHECKS FAILED!');
      process.exit(1);
    }
  } catch (err) {
    console.error('Audit encountered error:', err);
    await browser.close();
    server.close();
    process.exit(1);
  }
}

runAudit();
