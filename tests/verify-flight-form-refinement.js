import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\5db0c23b-424d-42d8-acd3-62fb5a754759\\screenshots';
const PORT = 4355;

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
  // Mock API endpoint for testing enquiry submissions
  if (req.method === 'POST' && req.url.startsWith('/api/enquiry')) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          leadId: 'VC-FLT-TEST-8899',
          message: 'Flight request received successfully',
          receivedData: parsed,
        }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid JSON' }));
      }
    });
    return;
  }

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

const VIEWPORTS = [
  { name: 'Mobile-320px', width: 320, height: 600, isMobile: true },
  { name: 'Mobile-360px', width: 360, height: 740, isMobile: true },
  { name: 'Mobile-375px', width: 375, height: 667, isMobile: true },
  { name: 'Mobile-390px', width: 390, height: 844, isMobile: true },
  { name: 'Mobile-412px', width: 412, height: 915, isMobile: true },
  { name: 'Tablet-768px', width: 768, height: 1024, isMobile: false },
  { name: 'Tablet-1024px', width: 1024, height: 768, isMobile: false },
  { name: 'Desktop-1366px', width: 1366, height: 768, isMobile: false },
  { name: 'Desktop-1440px', width: 1440, height: 900, isMobile: false },
];

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
  console.log('   VISA CONVENTION — FLIGHT BOOKING FORM REFINEMENT QA SUITE    ');
  console.log('================================================================\n');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // 1. VERIFY DOM PURGE OF CONSENT & DATA SECURITY PANEL
    console.log('--- 1. VERIFYING REMOVAL OF CONSENT & DATA SECURITY PANEL ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/services/flight-booking/`, { waitUntil: 'networkidle0' });

    const consentChecks = await page.evaluate(() => {
      const consentInput = document.getElementById('flight-consent');
      const consentError = document.getElementById('flight-consent-error');
      const pageText = document.body.innerText;
      
      const hasConsentText = pageText.includes('I consent to being contacted by Visa Convention regarding this flight assistance request');
      const hasDataSecText = pageText.includes('Data Security: Passport bio-pages are requested only when proceeding');
      const hasHoldText = pageText.includes('reservations provided for visa applications are legitimate airline hold bookings and that no passport numbers');

      return {
        consentInputExists: Boolean(consentInput),
        consentErrorExists: Boolean(consentError),
        hasConsentText,
        hasDataSecText,
        hasHoldText,
      };
    });

    assert(!consentChecks.consentInputExists, 'Checkbox #flight-consent is completely absent from DOM');
    assert(!consentChecks.consentErrorExists, 'Consent error element #flight-consent-error is completely absent from DOM');
    assert(!consentChecks.hasConsentText, 'Lengthy consent declaration text is completely removed');
    assert(!consentChecks.hasDataSecText, 'Data Security notice regarding passport bio-pages is completely removed');
    assert(!consentChecks.hasHoldText, 'Lengthy hold disclaimer text inside grey panel is completely removed');

    // 2. VERIFY FORM FIELD RENAMING & PLACEHOLDER
    console.log('\n--- 2. VERIFYING FIELD RENAMING & OPTIONAL DESIGNATION ---');
    const fieldChecks = await page.evaluate(() => {
      const label = document.querySelector('label[for="flight-special-notes"]');
      const textarea = document.getElementById('flight-special-notes');
      const pageText = document.body.innerText;

      return {
        labelExists: Boolean(label),
        labelText: label ? label.textContent.trim() : '',
        textareaExists: Boolean(textarea),
        placeholder: textarea ? textarea.getAttribute('placeholder') : '',
        nameAttr: textarea ? textarea.getAttribute('name') : '',
        hasOldLabel: pageText.includes('Special Routing, Student Baggage, or Flexibility Notes'),
        hasOldPlaceholder: textarea ? (textarea.getAttribute('placeholder') || '').includes('Dates flexible by ±2 days') : false,
      };
    });

    assert(fieldChecks.labelExists, 'Label for flight-special-notes exists');
    assert(fieldChecks.labelText.includes('Additional Notes (Optional)'), `Label text matches "Additional Notes (Optional)" (Found: "${fieldChecks.labelText}")`);
    assert(fieldChecks.nameAttr === 'specialNotes', 'Textarea retains backend field name="specialNotes"');
    assert(fieldChecks.placeholder === 'Any additional travel preferences or requirements…', `Placeholder matches target (Found: "${fieldChecks.placeholder}")`);
    assert(!fieldChecks.hasOldLabel, 'Old label "Special Routing, Student Baggage, or Flexibility Notes" is absent');
    assert(!fieldChecks.hasOldPlaceholder, 'Old placeholder with ±2 days is absent');

    // 3. VERIFY PRIVACY POLICY NOTICE & STATUTORY COMPLIANCE
    console.log('\n--- 3. VERIFYING STATUTORY PRIVACY POLICY NOTICE ---');
    const privacyChecks = await page.evaluate(() => {
      const form = document.getElementById('flight-assistance-form');
      const privacyLink = form ? form.querySelector('a[href="/privacy-policy/"]') : null;
      const privacyTextEl = privacyLink ? privacyLink.closest('p') : null;

      return {
        linkExists: Boolean(privacyLink),
        linkHref: privacyLink ? privacyLink.getAttribute('href') : '',
        noticeText: privacyTextEl ? privacyTextEl.innerText.trim() : '',
      };
    });

    assert(privacyChecks.linkExists, 'Privacy Policy hyperlink exists near submit button');
    assert(privacyChecks.linkHref === '/privacy-policy/', `Privacy Policy links to /privacy-policy/ (Found: ${privacyChecks.linkHref})`);
    assert(privacyChecks.noticeText.includes('Privacy Policy') && privacyChecks.noticeText.includes('submitting'), 'Privacy disclosure text is present and legible');

    // 4. VERIFY FORM VALIDATION & SUBMISSION WITHOUT CONSENT CHECKBOX
    console.log('\n--- 4. FUNCTIONAL SUBMISSION & OPTIONALITY TESTING ---');

    // Test A: Empty submission should trigger required fields validation
    await page.click('#flight-submit-btn');
    const validationErrors = await page.evaluate(() => {
      const depCityErr = document.getElementById('flight-departure-city-error');
      const destCityErr = document.getElementById('flight-destination-city-error');
      const depDateErr = document.getElementById('flight-departure-date-error');
      const nameErr = document.getElementById('flight-full-name-error');
      const phoneErr = document.getElementById('flight-phone-error');
      const consentErr = document.getElementById('flight-consent-error');

      return {
        depCityErrVisible: depCityErr && !depCityErr.classList.contains('hidden'),
        destCityErrVisible: destCityErr && !destCityErr.classList.contains('hidden'),
        depDateErrVisible: depDateErr && !depDateErr.classList.contains('hidden'),
        nameErrVisible: nameErr && !nameErr.classList.contains('hidden'),
        phoneErrVisible: phoneErr && !phoneErr.classList.contains('hidden'),
        consentErrExists: Boolean(consentErr),
      };
    });

    assert(validationErrors.depCityErrVisible, 'Departure city validation error shown when empty');
    assert(validationErrors.destCityErrVisible, 'Destination city validation error shown when empty');
    assert(validationErrors.nameErrVisible, 'Full name validation error shown when empty');
    assert(validationErrors.phoneErrVisible, 'Phone validation error shown when empty');
    assert(!validationErrors.consentErrExists, 'No consent error element triggered');

    // Test B: Fill required fields, leave "Additional Notes" empty, and submit
    await page.evaluate(() => {
      const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) {
          el.value = val;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }
      };

      setVal('flight-departure-city', 'Delhi (DEL)');
      setVal('flight-destination-city', 'London (LHR)');
      setVal('flight-departure-date', '2026-12-15');
      setVal('flight-return-date', '2026-12-25');
      setVal('flight-full-name', 'Rajesh Sharma');
      setVal('flight-phone', '+91 9876543210');
      // Intentionally leave flight-special-notes empty!
      const notesEl = document.getElementById('flight-special-notes');
      if (notesEl) notesEl.value = '';
    });

    await page.click('#flight-submit-btn');
    await new Promise(r => setTimeout(r, 1200));

    const submissionSuccess = await page.evaluate(() => {
      const formEl = document.getElementById('flight-assistance-form');
      const successView = document.getElementById('flight-success-view');
      const badge = document.getElementById('flight-success-ref-badge');

      return {
        formHidden: formEl ? formEl.classList.contains('hidden') : false,
        successViewVisible: successView ? !successView.classList.contains('hidden') : false,
        badgeText: badge ? badge.innerText : '',
      };
    });

    assert(submissionSuccess.formHidden, 'Form hides upon successful submission without additional notes');
    assert(submissionSuccess.successViewVisible, 'Success view displays properly without requiring consent checkbox');
    assert(submissionSuccess.badgeText.includes('VC-FLT'), `Lead ID generated in success confirmation (${submissionSuccess.badgeText})`);

    // 5. VIEWPORT RESPONSIVENESS & OVERFLOW CHECKS
    console.log('\n--- 5. VIEWPORT RESPONSIVENESS & ZERO OVERFLOW AUDIT ---');
    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.isMobile });
      await page.goto(`http://localhost:${PORT}/services/flight-booking/`, { waitUntil: 'networkidle0' });

      const metrics = await page.evaluate(() => {
        const formCard = document.getElementById('flight-form-card');
        const formEl = document.getElementById('flight-assistance-form');
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const hasHorizontalScroll = docWidth > winWidth;

        return {
          hasHorizontalScroll,
          docWidth,
          winWidth,
          cardWidth: formCard ? formCard.offsetWidth : 0,
          formWidth: formEl ? formEl.offsetWidth : 0,
        };
      });

      assert(
        !metrics.hasHorizontalScroll,
        `Viewport ${vp.name} (${vp.width}x${vp.height}): Zero horizontal overflow (docWidth=${metrics.docWidth}px, winWidth=${metrics.winWidth}px)`
      );
    }

    // 6. CAPTURE ARTIFACT SCREENSHOTS
    console.log('\n--- 6. CAPTURING EVIDENCE SCREENSHOTS ---');
    
    // Desktop 1440px
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/services/flight-booking/`, { waitUntil: 'networkidle0' });
    const formCardDesktop = await page.$('#flight-form-card');
    if (formCardDesktop) {
      const desktopPath = path.join(ARTIFACTS_DIR, 'flight-form-after-desktop-1440px.png');
      await formCardDesktop.screenshot({ path: desktopPath });
      console.log(`  📸 Desktop screenshot captured: ${desktopPath}`);
    }

    // Mobile 375px
    await page.setViewport({ width: 375, height: 812, isMobile: true });
    await page.goto(`http://localhost:${PORT}/services/flight-booking/`, { waitUntil: 'networkidle0' });
    const formCardMobile375 = await page.$('#flight-form-card');
    if (formCardMobile375) {
      const mobile375Path = path.join(ARTIFACTS_DIR, 'flight-form-after-mobile-375px.png');
      await formCardMobile375.screenshot({ path: mobile375Path });
      console.log(`  📸 Mobile (375px) screenshot captured: ${mobile375Path}`);
    }

    // Mobile 320px
    await page.setViewport({ width: 320, height: 600, isMobile: true });
    await page.goto(`http://localhost:${PORT}/services/flight-booking/`, { waitUntil: 'networkidle0' });
    const formCardMobile320 = await page.$('#flight-form-card');
    if (formCardMobile320) {
      const mobile320Path = path.join(ARTIFACTS_DIR, 'flight-form-after-mobile-320px.png');
      await formCardMobile320.screenshot({ path: mobile320Path });
      console.log(`  📸 Mobile (320px) screenshot captured: ${mobile320Path}`);
    }

    console.log('\n================================================================');
    console.log(`RESULTS: ${passedTests}/${totalTests} PASSED (${failedTests} FAILED)`);
    console.log('================================================================');

    await browser.close();
    server.close();
    process.exit(failedTests > 0 ? 1 : 0);
  } catch (err) {
    console.error('Fatal error during QA verification:', err);
    await browser.close();
    server.close();
    process.exit(1);
  }
});
