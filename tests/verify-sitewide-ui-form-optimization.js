import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\6a0361a6-ccbe-4f53-a463-b2d5ee259bd4\\sitewide-ui-form-optimization';
const PORT = 4388;

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

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

async function runQA() {
  console.log('================================================================');
  console.log('   SITEWIDE UI & FORM OPTIMIZATION COMPREHENSIVE VERIFICATION   ');
  console.log('================================================================\n');

  await new Promise((resolve) => server.listen(PORT, resolve));
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  try {
    // -------------------------------------------------------------
    // PART 1: STATIC AUDIT OF DIST HTML FILES (REDUNDANT STRINGS)
    // -------------------------------------------------------------
    console.log('\n--- PART 1: Static Verification of Removed Content in dist/ ---');
    const htmlFiles = getAllHtmlFiles(DIST);
    assert(htmlFiles.length >= 60, `Found ${htmlFiles.length} generated HTML files in dist`);

    const bannedStrings = [
      'Submit your details for personalized university recommendations, transparent fee structures, and NEET eligibility guidance.',
      'Advisory Evaluation',
      'Official Counseling Desk',
      'Doctoral Advisory Desk',
      'Travel Coordination Desk',
      'Medical Admissions Desk',
      'Doctoral Research Advisory',
      'Direct Advisory Access',
    ];

    for (const bStr of bannedStrings) {
      const offendingFiles = [];
      for (const f of htmlFiles) {
        const content = fs.readFileSync(f, 'utf8');
        // Check for exact visible text badge/string occurrences
        // Allow in scripts/analytics if applicable, but none should be present in rendered HTML body
        if (content.includes(bStr)) {
          offendingFiles.push(path.relative(DIST, f));
        }
      }
      assert(
        offendingFiles.length === 0,
        `Zero occurrences of banned text: "${bStr}"`,
        offendingFiles.join(', ')
      );
    }

    // -------------------------------------------------------------
    // PART 2: FORM PADDING, SPACING & TWO-COLUMN GRID VERIFICATION
    // -------------------------------------------------------------
    console.log('\n--- PART 2: Form Dimensions, Spacing & 2-Column Grid Verification ---');

    // Test Contact Page Form at Desktop (1440px)
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });

    const desktopDims = await page.evaluate(() => {
      const card = document.getElementById('enquiry-card-container');
      const form = document.getElementById('visa-enquiry-form');
      const nameInput = document.getElementById('form-full-name');
      const phoneInput = document.getElementById('form-phone');
      const emailInput = document.getElementById('form-email');
      const countryInput = document.getElementById('form-country');
      const messageInput = document.getElementById('form-message');
      const submitBtn = document.getElementById('enquiry-submit-btn');

      if (!card || !nameInput || !phoneInput || !emailInput || !countryInput || !messageInput) {
        return null;
      }

      const cardStyle = window.getComputedStyle(card);
      const nameRect = nameInput.getBoundingClientRect();
      const phoneRect = phoneInput.getBoundingClientRect();
      const emailRect = emailInput.getBoundingClientRect();
      const countryRect = countryInput.getBoundingClientRect();
      const messageRect = messageInput.getBoundingClientRect();
      const submitRect = submitBtn.getBoundingClientRect();

      const nameLabel = nameInput.previousElementSibling;
      const nameLabelStyle = window.getComputedStyle(nameLabel);

      return {
        cardPaddingTop: parseFloat(cardStyle.paddingTop),
        cardPaddingRight: parseFloat(cardStyle.paddingRight),
        cardPaddingBottom: parseFloat(cardStyle.paddingBottom),
        cardPaddingLeft: parseFloat(cardStyle.paddingLeft),
        nameTop: nameRect.top,
        phoneTop: phoneRect.top,
        nameHeight: nameRect.height,
        phoneHeight: phoneRect.height,
        emailTop: emailRect.top,
        countryTop: countryRect.top,
        messageHeight: messageRect.height,
        submitHeight: submitRect.height,
        labelMarginBottom: parseFloat(nameLabelStyle.marginBottom),
        areNamePhoneAlignedY: Math.abs(nameRect.top - phoneRect.top) < 4,
        areEmailCountryAlignedY: Math.abs(emailRect.top - countryRect.top) < 4,
      };
    });

    assert(desktopDims !== null, 'Contact page EnquiryForm elements found');
    if (desktopDims) {
      assert(
        desktopDims.cardPaddingTop >= 16 && desktopDims.cardPaddingTop <= 25,
        `EnquiryForm desktop padding is 16–24px (actual: ${desktopDims.cardPaddingTop}px)`
      );
      assert(
        desktopDims.areNamePhoneAlignedY,
        `Desktop 2-column grid: Full Name and Phone inputs aligned horizontally (Name Y: ${desktopDims.nameTop}, Phone Y: ${desktopDims.phoneTop})`
      );
      assert(
        desktopDims.areEmailCountryAlignedY,
        `Desktop 2-column grid: Email and Country inputs aligned horizontally (Email Y: ${desktopDims.emailTop}, Country Y: ${desktopDims.countryTop})`
      );
      assert(
        desktopDims.nameHeight >= 44 && desktopDims.nameHeight <= 48,
        `Input height matches 44–48px range (actual: ${desktopDims.nameHeight}px)`
      );
      assert(
        desktopDims.messageHeight >= 80 && desktopDims.messageHeight <= 100,
        `Textarea initial height matches 80–100px range (actual: ${desktopDims.messageHeight}px)`
      );
      assert(
        desktopDims.labelMarginBottom >= 5 && desktopDims.labelMarginBottom <= 7,
        `Label gap matches ~6px (mb-1.5, actual: ${desktopDims.labelMarginBottom}px)`
      );
      assert(
        desktopDims.submitHeight >= 44,
        `Submit button meets minimum 44px touch target (actual: ${desktopDims.submitHeight}px)`
      );
    }

    // Test Contact Page Form at Mobile (375px) - Single column stacked
    await page.setViewport({ width: 375, height: 667 });
    await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });

    const mobileDims = await page.evaluate(() => {
      const card = document.getElementById('enquiry-card-container');
      const nameInput = document.getElementById('form-full-name');
      const phoneInput = document.getElementById('form-phone');
      const emailInput = document.getElementById('form-email');
      const countryInput = document.getElementById('form-country');

      if (!card || !nameInput || !phoneInput || !emailInput || !countryInput) return null;

      const cardStyle = window.getComputedStyle(card);
      const nameRect = nameInput.getBoundingClientRect();
      const phoneRect = phoneInput.getBoundingClientRect();
      const emailRect = emailInput.getBoundingClientRect();
      const countryRect = countryInput.getBoundingClientRect();

      return {
        cardPaddingTop: parseFloat(cardStyle.paddingTop),
        isPhoneBelowName: phoneRect.top >= nameRect.bottom,
        isCountryBelowEmail: countryRect.top >= emailRect.bottom,
      };
    });

    assert(mobileDims !== null, 'Mobile contact EnquiryForm elements found');
    if (mobileDims) {
      assert(
        mobileDims.cardPaddingTop >= 16 && mobileDims.cardPaddingTop <= 24,
        `EnquiryForm mobile padding is 16–24px (actual: ${mobileDims.cardPaddingTop}px)`
      );
      assert(
        mobileDims.isPhoneBelowName,
        'Mobile 1-column layout: Phone input stacked vertically below Full Name'
      );
      assert(
        mobileDims.isCountryBelowEmail,
        'Mobile 1-column layout: Destination Country stacked vertically below Email'
      );
    }

    // -------------------------------------------------------------
    // PART 3: FLIGHT ASSISTANCE FORM COMPACT DIMS & PADDING
    // -------------------------------------------------------------
    console.log('\n--- PART 3: Flight Assistance Form Optimization Verification ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/services/flight-booking/`, { waitUntil: 'networkidle0' });

    const flightDims = await page.evaluate(() => {
      const card = document.getElementById('flight-form-card');
      const depCity = document.getElementById('flight-departure-city');
      const notes = document.getElementById('flight-special-notes');
      const btn = document.getElementById('flight-submit-btn');

      if (!card || !depCity || !notes || !btn) return null;

      const cardStyle = window.getComputedStyle(card);
      const depRect = depCity.getBoundingClientRect();
      const notesRect = notes.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();

      return {
        cardPaddingTop: parseFloat(cardStyle.paddingTop),
        inputHeight: depRect.height,
        notesHeight: notesRect.height,
        btnHeight: btnRect.height,
      };
    });

    assert(flightDims !== null, 'Flight assistance form card found');
    if (flightDims) {
      assert(
        flightDims.cardPaddingTop >= 16 && flightDims.cardPaddingTop <= 25,
        `FlightForm card padding is 16–24px (actual: ${flightDims.cardPaddingTop}px)`
      );
      assert(
        flightDims.inputHeight >= 44 && flightDims.inputHeight <= 48,
        `FlightForm input height is 44–48px (actual: ${flightDims.inputHeight}px)`
      );
      assert(
        flightDims.notesHeight >= 80 && flightDims.notesHeight <= 100,
        `FlightForm special notes initial height is 80–100px (actual: ${flightDims.notesHeight}px)`
      );
      assert(
        flightDims.btnHeight >= 44,
        `FlightForm button meets minimum 44px touch target (actual: ${flightDims.btnHeight}px)`
      );
    }

    // -------------------------------------------------------------
    // PART 4: WORK VISA & MBBS SPECIFIC FORM HEADINGS
    // -------------------------------------------------------------
    console.log('\n--- PART 4: Single Clear Heading & Duplicate Removal ---');

    // Work Visa Page: Verify no duplicate outer heading above form
    await page.goto(`http://localhost:${PORT}/services/work-visa/`, { waitUntil: 'networkidle0' });
    const workVisaHeadings = await page.evaluate(() => {
      const enquirySection = document.getElementById('enquiry');
      if (!enquirySection) return null;
      const h2s = enquirySection.querySelectorAll('h2');
      const h3s = enquirySection.querySelectorAll('h3');
      const formHeading = enquirySection.querySelector('#enquiry-card-container h3, #enquiry-card-container h2');
      return {
        h2Count: h2s.length,
        formHeadingText: formHeading?.textContent?.trim() || '',
      };
    });

    assert(workVisaHeadings !== null, 'Work Visa enquiry section found');
    if (workVisaHeadings) {
      assert(
        workVisaHeadings.h2Count === 0,
        `Zero redundant outer h2 headings above Work Visa form (actual h2 count in #enquiry: ${workVisaHeadings.h2Count})`
      );
      assert(
        workVisaHeadings.formHeadingText === 'Request Work Visa Documentation Guidance',
        `Work Visa form displays single clear heading: "${workVisaHeadings.formHeadingText}"`
      );
    }

    // MBBS Page: Verify form heading and omission of banned sentence
    await page.goto(`http://localhost:${PORT}/services/mbbs/`, { waitUntil: 'networkidle0' });
    const mbbsFormInfo = await page.evaluate(() => {
      const card = document.getElementById('enquiry-card-container');
      const h3 = card?.querySelector('h3');
      const p = card?.querySelector('p');
      return {
        heading: h3?.textContent?.trim(),
        subtitle: p?.textContent?.trim(),
      };
    });

    assert(mbbsFormInfo.heading === 'Request MBBS Admission Assessment', 'MBBS form heading is clear');
    assert(
      !mbbsFormInfo.subtitle?.includes('personalized university recommendations, transparent fee structures'),
      'MBBS form does not contain redundant sentence'
    );

    // -------------------------------------------------------------
    // PART 5: FORM SUBMISSION INTERACTIVE QA (OPTIONAL EMAIL, ETC.)
    // -------------------------------------------------------------
    console.log('\n--- PART 5: Form Submission Verification (Blank Email & Validation) ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });

    // Mock API response in browser
    await page.evaluate(() => {
      window.fetch = async (url, opts) => {
        if (typeof url === 'string' && url.includes('/api/enquiry')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              referenceId: 'VC-2026-TEST-OK',
              message: 'Assessment received',
            }),
          };
        }
        return window.originalFetch ? window.originalFetch(url, opts) : { ok: true, json: async () => ({}) };
      };
    });

    // Test 1: Submit with Blank Email (Valid)
    await page.select('#form-service', 'study-visa');
    await page.type('#form-full-name', 'Aarav Patel');
    await page.type('#form-phone', '+91 98765 43210');
    // form-email is left blank
    await page.type('#form-message', 'Testing blank email submission');
    await page.click('#form-consent');
    await page.click('#enquiry-submit-btn');

    await page.waitForFunction(() => {
      const successView = document.getElementById('enquiry-success-view');
      return successView && !successView.classList.contains('hidden');
    }, { timeout: 4000 });

    const blankEmailSuccess = await page.evaluate(() => {
      const successView = document.getElementById('enquiry-success-view');
      return successView && !successView.classList.contains('hidden');
    });
    assert(blankEmailSuccess, 'Form submission succeeds with blank Optional Email');

    // Test 2: Invalid Email format validation
    await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });
    await page.select('#form-service', 'study-visa');
    await page.type('#form-full-name', 'Aarav Patel');
    await page.type('#form-phone', '+91 98765 43210');
    await page.type('#form-email', 'invalid-email-no-domain');
    await page.click('#form-consent');
    await page.click('#enquiry-submit-btn');

    const invalidEmailBlocked = await page.evaluate(() => {
      const emailError = document.getElementById('form-email-error');
      const successView = document.getElementById('enquiry-success-view');
      return (
        emailError &&
        !emailError.classList.contains('hidden') &&
        successView &&
        successView.classList.contains('hidden')
      );
    });
    assert(invalidEmailBlocked, 'Invalid email format displays inline error and prevents submission');

    // -------------------------------------------------------------
    // PART 6: MULTI-VIEWPORT RESPONSIVENESS & ZERO OVERFLOW
    // -------------------------------------------------------------
    console.log('\n--- PART 6: Multi-Viewport Responsiveness & Zero Overflow (9 Viewports) ---');
    const testPages = [
      '/contact/',
      '/services/mbbs/',
      '/services/phd/',
      '/services/work-visa/',
      '/services/flight-booking/',
      '/services/tourist-visa/',
    ];

    for (const pagePath of testPages) {
      for (const vp of VIEWPORTS) {
        await page.setViewport({ width: vp.width, height: vp.height });
        await page.goto(`http://localhost:${PORT}${pagePath}`, { waitUntil: 'networkidle0' });

        const overflow = await page.evaluate(() => {
          return {
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
            hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
          };
        });

        assert(
          !overflow.hasOverflow,
          `Zero horizontal overflow on ${pagePath} at ${vp.name} (${overflow.scrollWidth}px <= ${overflow.innerWidth}px)`
        );
      }
    }

    // -------------------------------------------------------------
    // PART 7: CAPTURE HIGH-RES DESKTOP & MOBILE SCREENSHOTS
    // -------------------------------------------------------------
    console.log('\n--- PART 7: Capturing Before/After Artifact Screenshots ---');

    // 1. Contact Form (Desktop & Mobile)
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });
    const contactCardDesk = await page.$('#enquiry-card-container');
    if (contactCardDesk) {
      await contactCardDesk.screenshot({ path: path.join(ARTIFACTS_DIR, 'contact-form-desktop-1440px.png') });
    }
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'contact-page-full-desktop-1440px.png'), fullPage: false });

    await page.setViewport({ width: 375, height: 667 });
    await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });
    const contactCardMob = await page.$('#enquiry-card-container');
    if (contactCardMob) {
      await contactCardMob.screenshot({ path: path.join(ARTIFACTS_DIR, 'contact-form-mobile-375px.png') });
    }

    // 2. MBBS Page (Desktop & Mobile)
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/services/mbbs/`, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'mbbs-page-desktop-1440px.png') });

    await page.setViewport({ width: 375, height: 667 });
    await page.goto(`http://localhost:${PORT}/services/mbbs/`, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'mbbs-page-mobile-375px.png') });

    // 3. Work Visa Form (Desktop & Mobile)
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/services/work-visa/`, { waitUntil: 'networkidle0' });
    const workCardDesk = await page.$('#enquiry-card-container');
    if (workCardDesk) {
      await workCardDesk.screenshot({ path: path.join(ARTIFACTS_DIR, 'work-visa-form-desktop-1440px.png') });
    }

    await page.setViewport({ width: 375, height: 667 });
    await page.goto(`http://localhost:${PORT}/services/work-visa/`, { waitUntil: 'networkidle0' });
    const workCardMob = await page.$('#enquiry-card-container');
    if (workCardMob) {
      await workCardMob.screenshot({ path: path.join(ARTIFACTS_DIR, 'work-visa-form-mobile-375px.png') });
    }

    // 4. Flight Assistance Form (Desktop & Mobile)
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/services/flight-booking/`, { waitUntil: 'networkidle0' });
    const flightCardDesk = await page.$('#flight-form-card');
    if (flightCardDesk) {
      await flightCardDesk.screenshot({ path: path.join(ARTIFACTS_DIR, 'flight-form-desktop-1440px.png') });
    }

    await page.setViewport({ width: 375, height: 667 });
    await page.goto(`http://localhost:${PORT}/services/flight-booking/`, { waitUntil: 'networkidle0' });
    const flightCardMob = await page.$('#flight-form-card');
    if (flightCardMob) {
      await flightCardMob.screenshot({ path: path.join(ARTIFACTS_DIR, 'flight-form-mobile-375px.png') });
    }

    console.log(`\nScreenshots successfully saved to ${ARTIFACTS_DIR}`);

  } catch (err) {
    console.error('Fatal execution error during QA test:', err);
    assert(false, 'Fatal QA test error', err.message);
  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n================================================================');
  console.log(`   QA SUMMARY: ${passedChecks}/${totalChecks} CHECKS PASSED`);
  if (failedChecks > 0) {
    console.log(`   FAILED CHECKS: ${failedChecks}`);
    for (const f of failureDetails) {
      console.log(`     - ${f.checkName}: ${f.details}`);
    }
  }
  console.log('================================================================\n');

  if (failedChecks > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runQA();
