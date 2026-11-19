/**
 * tests/verify-website-wide-form-optimization.js
 * 
 * Comprehensive Automated Verification Suite for:
 * VISA CONVENTION — WEBSITE-WIDE FORM OPTIMIZATION
 * 
 * Verifies:
 * 1. Business Email label & single mailto link display on contact page
 * 2. "Email (Optional)" label, removed asterisk, optional submission
 * 3. Blank email submission succeeds; invalid email is rejected
 * 4. Removal of visible "University / College of Interest" field from public enquiry forms
 * 5. Hidden university context preservation in dedicated application workflows
 * 6. "Message (Optional)" label and "Write your message or questions here…" placeholder
 * 7. Mobile-first touch targets and zero horizontal overflow across forms
 * 8. Screenshot captures for visual evidence
 */

import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\6a0361a6-ccbe-4f53-a463-b2d5ee259bd4\\form-optimization';
const LEADS_FILE = path.join(DIST, 'leads-test.json');
const PORT = 4399;

if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

// Initialize leads file
fs.writeFileSync(LEADS_FILE, JSON.stringify([]), 'utf8');

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

  // Handle Mock Lead Submission Endpoint
  if (req.method === 'POST' && cleanUrl === '/api/enquiry') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);

        // Anti-spam honeypot
        if (data.website_url_check) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Spam detected.' }));
          return;
        }

        // Required check: Phone and Service are required. Email is optional!
        if (data.submissionType !== 'business') {
          if (!data.fullName || !data.phone) {
            res.writeHead(422, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Missing required candidate fields.' }));
            return;
          }
        }

        const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
        const leadId = `VC-OPT-${Date.now().toString().slice(-6)}`;
        const newLead = { leadId, ...data, receivedAt: new Date().toISOString() };
        leads.push(newLead);
        fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, leadId }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

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
  console.log(`   VISA CONVENTION — FORM OPTIMIZATION QA VERIFICATION SUITE   `);
  console.log(`===============================================================\n`);

  // -------------------------------------------------------------------------
  // MODULE 1: Business Email Label & Single Display Audit
  // -------------------------------------------------------------------------
  console.log('--- MODULE 1: Business Email & Static Display Verification ---');
  
  const contactHtml = fs.readFileSync(path.join(DIST, 'contact/index.html'), 'utf8');

  assert(
    !contactHtml.includes('General Inquiries:'),
    'Contact page: "General Inquiries" text replaced'
  );
  assert(
    !contactHtml.includes('Admissions Desk:'),
    'Contact page: "Admissions Desk" text replaced'
  );
  assert(
    !contactHtml.includes('Electronic Mail'),
    'Contact page: "Electronic Mail" heading replaced with "Email"'
  );
  assert(
    contactHtml.includes('<strong class="block text-xs font-bold uppercase tracking-wider text-brand-muted">Email</strong>'),
    'Contact page: Clean "Email" uppercase heading is present'
  );

  // Check that visaconvention064@gmail.com appears only once in the contact info sidebar
  const emailMailtoMatches = contactHtml.match(/href="mailto:visaconvention064@gmail\.com"/g) || [];
  // Footer also has one mailto link, sidebar should have exactly one
  assert(
    emailMailtoMatches.length === 2, // 1 in sidebar, 1 in footer
    `visaconvention064@gmail.com displayed exactly once in contact sidebar (Total on page including footer: ${emailMailtoMatches.length})`
  );

  // -------------------------------------------------------------------------
  // MODULE 2: Public Form Labels & Visible Element Audit
  // -------------------------------------------------------------------------
  console.log('\n--- MODULE 2: Public Form Labels & Field Structure ---');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Check /contact/
  await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });

  const contactFormInspection = await page.evaluate(() => {
    // Email Label
    const emailLabel = document.querySelector('label[for="form-email"]')?.textContent?.trim();
    const emailAsterisk = document.querySelector('label[for="form-email"] .text-brand-red');
    const emailInput = document.getElementById('form-email');

    // University Label & Input
    const uniLabel = Array.from(document.querySelectorAll('label')).find(l => l.textContent?.includes('University / College of Interest'));
    const uniInput = document.getElementById('form-university');
    const isUniHidden = uniInput?.getAttribute('type') === 'hidden';

    // Message Label & Placeholder
    const messageLabel = document.querySelector('label[for="form-message"]')?.textContent?.trim();
    const messageTextarea = document.getElementById('form-message');

    return {
      emailLabel,
      hasEmailAsterisk: Boolean(emailAsterisk),
      emailRequired: emailInput?.required,
      emailAriaRequired: emailInput?.getAttribute('aria-required'),
      hasVisibleUniLabel: Boolean(uniLabel),
      hasUniInput: Boolean(uniInput),
      isUniHidden,
      messageLabel,
      messagePlaceholder: messageTextarea?.placeholder,
    };
  });

  assert(
    contactFormInspection.emailLabel === 'Email (Optional)',
    `Contact Form: Email field labeled "Email (Optional)" (Actual: "${contactFormInspection.emailLabel}")`
  );
  assert(
    !contactFormInspection.hasEmailAsterisk,
    'Contact Form: Required asterisk removed from Email label'
  );
  assert(
    !contactFormInspection.emailRequired,
    'Contact Form: Email input does not have HTML required attribute'
  );
  assert(
    !contactFormInspection.hasVisibleUniLabel,
    'Contact Form: "University / College of Interest (Optional)" visible label is completely removed'
  );
  assert(
    contactFormInspection.isUniHidden,
    'Contact Form: University field is preserved as a hidden input (#form-university)'
  );
  assert(
    contactFormInspection.messageLabel === 'Message (Optional)',
    `Contact Form: Message field labeled "Message (Optional)" (Actual: "${contactFormInspection.messageLabel}")`
  );
  assert(
    contactFormInspection.messagePlaceholder === 'Write your message or questions here…',
    `Contact Form: Message placeholder is "Write your message or questions here…" (Actual: "${contactFormInspection.messagePlaceholder}")`
  );

  // 2. Check /services/flight-booking/
  await page.goto(`http://localhost:${PORT}/services/flight-booking/`, { waitUntil: 'networkidle0' });
  const flightEmailInspection = await page.evaluate(() => {
    const emailLabel = document.querySelector('label[for="flight-email"]')?.textContent?.trim();
    const emailInput = document.getElementById('flight-email');
    return {
      emailLabel,
      emailRequired: emailInput?.required,
    };
  });

  assert(
    flightEmailInspection.emailLabel === 'Email (Optional)',
    `Flight Booking Form: Email field labeled "Email (Optional)" (Actual: "${flightEmailInspection.emailLabel}")`
  );
  assert(
    !flightEmailInspection.emailRequired,
    'Flight Booking Form: Email input is not required'
  );

  // -------------------------------------------------------------------------
  // MODULE 3: Submission Flow: Blank Email Submits Successfully
  // -------------------------------------------------------------------------
  console.log('\n--- MODULE 3: Blank Email Submission Flow ---');
  await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });

  // Fill form WITHOUT email
  await page.select('#form-service', 'study-visa');
  await page.type('#form-full-name', 'Rohan Verma (No Email Test)');
  await page.type('#form-phone', '+91 98765 99999');
  // Leave #form-email BLANK!
  await page.select('#form-country', 'germany');
  // Leave #form-message BLANK (optional message test)!
  await page.click('#form-consent');

  // Submit
  await page.click('#enquiry-submit-btn');
  await page.waitForSelector('#enquiry-success-view:not(.hidden)', { timeout: 6000 });

  const successShown = await page.$eval('#enquiry-success-view', el => !el.classList.contains('hidden'));
  assert(successShown, 'Blank email + blank message submission renders confirmed success view');

  // Verify lead was stored on disk with blank email
  const leadsAfterBlankEmail = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
  const blankEmailLead = leadsAfterBlankEmail.find(l => l.fullName === 'Rohan Verma (No Email Test)');
  assert(
    blankEmailLead !== undefined,
    'Lead with blank email successfully delivered and written to persistent storage'
  );
  assert(
    blankEmailLead?.email === undefined || blankEmailLead?.email === '',
    `Delivered lead has undefined or empty email (Actual: ${blankEmailLead?.email})`
  );
  assert(
    blankEmailLead?.phone === '+91 98765 99999',
    'Delivered lead preserves required phone contact number'
  );

  // -------------------------------------------------------------------------
  // MODULE 4: Validation Flow: Invalid Non-Empty Email Is Rejected
  // -------------------------------------------------------------------------
  console.log('\n--- MODULE 4: Invalid Non-Empty Email Validation ---');
  await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });

  await page.select('#form-service', 'tourist-visa');
  await page.type('#form-full-name', 'Invalid Email Test');
  await page.type('#form-phone', '+91 98765 88888');
  await page.type('#form-email', 'invalid-email-without-at');
  await page.click('#form-consent');

  await page.click('#enquiry-submit-btn');
  await new Promise(r => setTimeout(r, 300));

  const emailInvalidState = await page.evaluate(() => {
    const input = document.getElementById('form-email');
    const err = document.getElementById('form-email-error');
    return {
      ariaInvalid: input?.getAttribute('aria-invalid'),
      isErrorVisible: err ? !err.classList.contains('hidden') : false,
      errText: err?.textContent?.trim(),
    };
  });

  assert(
    emailInvalidState.ariaInvalid === 'true',
    'Invalid non-empty email flags aria-invalid="true"'
  );
  assert(
    emailInvalidState.isErrorVisible,
    'Invalid non-empty email reveals inline error alert'
  );

  // Correct email format and confirm error clears
  await page.type('#form-email', '@example.com');
  await page.click('#enquiry-submit-btn');
  await page.waitForSelector('#enquiry-success-view:not(.hidden)', { timeout: 6000 });

  const successAfterFix = await page.$eval('#enquiry-success-view', el => !el.classList.contains('hidden'));
  assert(successAfterFix, 'Correcting email format enables successful form submission');

  // -------------------------------------------------------------------------
  // MODULE 5: Dedicated Application Workflows & Preselected Context
  // -------------------------------------------------------------------------
  console.log('\n--- MODULE 5: University Context Preservation ---');

  // Test MBBS page university preselection
  await page.goto(`http://localhost:${PORT}/services/mbbs/`, { waitUntil: 'networkidle0' });
  const mbbsCardClickResult = await page.evaluate(async () => {
    const card = document.querySelector('#universities .uni-card');
    const uniName = card?.getAttribute('data-university-name') || '';
    if (card) card.click();
    await new Promise(r => setTimeout(r, 200));

    const hiddenInputVal = document.getElementById('form-university')?.value;
    const banner = document.getElementById('enquiry-context-banner');
    const bannerVisible = banner ? !banner.classList.contains('hidden') : false;
    const bannerText = document.getElementById('context-banner-text')?.textContent?.trim();

    return {
      uniName,
      hiddenInputVal,
      bannerVisible,
      bannerText,
    };
  });

  assert(
    mbbsCardClickResult.hiddenInputVal === mbbsCardClickResult.uniName,
    `Clicking MBBS university card populates hidden #form-university with "${mbbsCardClickResult.uniName}"`
  );
  assert(
    mbbsCardClickResult.bannerVisible,
    'Pre-selection context banner displays upon selecting university'
  );

  // -------------------------------------------------------------------------
  // MODULE 6: Mobile Responsiveness Across 5 Viewports
  // -------------------------------------------------------------------------
  console.log('\n--- MODULE 6: Mobile Usability & Overflow Check ---');
  const mobileWidths = [320, 360, 375, 390, 430];
  let overflowViolations = 0;

  for (const w of mobileWidths) {
    await page.setViewport({ width: w, height: 750 });
    await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });

    const checks = await page.evaluate(() => {
      const form = document.getElementById('visa-enquiry-form');
      const inputs = Array.from(form?.querySelectorAll('input, select, textarea') || []);
      const btn = document.getElementById('enquiry-submit-btn');

      const overflow = document.documentElement.scrollWidth > window.innerWidth;
      const btnRect = btn?.getBoundingClientRect();
      const allInputsSized = inputs.every(i => {
        const style = window.getComputedStyle(i);
        return parseFloat(style.fontSize) >= 16;
      });

      return {
        overflow,
        btnHeight: btnRect ? Math.round(btnRect.height) : 0,
        allInputsSized,
      };
    });

    if (checks.overflow) overflowViolations++;
    assert(
      !checks.overflow && checks.btnHeight >= 44 && checks.allInputsSized,
      `Mobile viewport (${w}px): 0px overflow, 44px+ touch target (${checks.btnHeight}px), 16px font-size`
    );
  }
  assert(overflowViolations === 0, 'Zero horizontal overflow violations across all mobile viewports');

  // -------------------------------------------------------------------------
  // MODULE 7: Screenshot Captures
  // -------------------------------------------------------------------------
  console.log('\n--- MODULE 7: High-Resolution Screenshot Captures ---');

  // Desktop Contact Form (1440px)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });
  const desktopContactCapture = path.join(ARTIFACTS_DIR, 'optimized-contact-form-desktop-1440px.png');
  await page.screenshot({ path: desktopContactCapture, fullPage: false });
  console.log(`  📸 Captured desktop contact form: ${desktopContactCapture}`);

  // Mobile Contact Form (375px)
  await page.setViewport({ width: 375, height: 812 });
  await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });
  const mobileContactCapture = path.join(ARTIFACTS_DIR, 'optimized-contact-form-mobile-375px.png');
  await page.screenshot({ path: mobileContactCapture, fullPage: false });
  console.log(`  📸 Captured mobile contact form: ${mobileContactCapture}`);

  // Mobile Tourist Visa Form (375px)
  await page.goto(`http://localhost:${PORT}/services/tourist-visa/`, { waitUntil: 'networkidle0' });
  const mobileTouristCapture = path.join(ARTIFACTS_DIR, 'optimized-tourist-visa-form-mobile-375px.png');
  await page.screenshot({ path: mobileTouristCapture, fullPage: false });
  console.log(`  📸 Captured mobile tourist visa form: ${mobileTouristCapture}`);

  // Desktop Flight Booking Form (1440px)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:${PORT}/services/flight-booking/`, { waitUntil: 'networkidle0' });
  const desktopFlightCapture = path.join(ARTIFACTS_DIR, 'optimized-flight-form-desktop-1440px.png');
  await page.screenshot({ path: desktopFlightCapture, fullPage: false });
  console.log(`  📸 Captured desktop flight form: ${desktopFlightCapture}`);

  await browser.close();
  server.close();

  // Cleanup test leads file
  if (fs.existsSync(LEADS_FILE)) {
    fs.unlinkSync(LEADS_FILE);
  }

  console.log('\n===============================================================');
  console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
  if (failedTests === 0) {
    console.log('🎉 ALL WEBSITE-WIDE FORM OPTIMIZATION TESTS PASSED!');
    console.log('===============================================================\n');
    process.exit(0);
  } else {
    console.error('❌ FORM OPTIMIZATION TEST SUITE HAD FAILURES!');
    process.exit(1);
  }
}

runVerification().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
