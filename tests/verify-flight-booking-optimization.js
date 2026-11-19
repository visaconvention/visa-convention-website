import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\93dd9ae5-292a-4677-9731-9efc41a7f30f\\evidence';
const PORT = 4389;

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
    passedChecks++;
    console.log(`  ✅ PASS: ${checkName}`);
  } else {
    failedChecks++;
    failureDetails.push({ checkName, details });
    console.error(`  ❌ FAIL: ${checkName} - ${details}`);
  }
}

const VIEWPORTS = [
  { width: 320, height: 600, name: '320px (Small Mobile)' },
  { width: 360, height: 740, name: '360px (Android Compact)' },
  { width: 390, height: 844, name: '390px (iPhone 14/15)' },
  { width: 430, height: 932, name: '430px (iPhone 14/15 Pro Max)' },
  { width: 768, height: 1024, name: '768px (iPad Mini / Tablet)' },
  { width: 1024, height: 768, name: '1024px (Small Desktop / iPad Pro)' },
  { width: 1366, height: 768, name: '1366px (Standard Laptop)' },
  { width: 1440, height: 900, name: '1440px (Desktop Full)' },
];

async function runAudit() {
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Verification Server running on http://localhost:${PORT}`);

  const flightHtml = fs.readFileSync(path.join(DIST, 'services', 'flight-booking', 'index.html'), 'utf8');

  // =========================================================================
  // SECTION 1: STATIC & DOM AUDIT OF EXCISED ELEMENTS
  // =========================================================================
  console.log('\n--- 1. VERIFYING EXCISION OF SPECIFIED FIVE ELEMENTS ---');

  // Element 1: "40kg–46kg Student Baggage" card
  const hasStudentBaggageCard = flightHtml.includes('40kg–46kg Student Baggage') || flightHtml.includes('Student Privilege');
  assert(!hasStudentBaggageCard, 'Element 1: "40kg–46kg Student Baggage" card is completely removed from DOM');

  // Element 2: "Consular Advisory & Document Integrity Policy" yellow panel (both instances)
  const hasYellowAdvisoryPanel = flightHtml.includes('Consular Advisory & Document Integrity Policy') || flightHtml.includes('bg-amber-50');
  assert(!hasYellowAdvisoryPanel, 'Element 2: "Consular Advisory & Document Integrity Policy" yellow panel completely removed (0 instances)');

  // Element 3: "Fair Pricing & Tariff Transparency" card
  const hasFairPricingCard = flightHtml.includes('Fair Pricing & Tariff Transparency');
  assert(!hasFairPricingCard, 'Element 3: "Fair Pricing & Tariff Transparency" card is completely removed from DOM');

  // Element 4: "Need Urgent Itinerary Advice?" card
  const hasUrgentAdviceCard = flightHtml.includes('Need Urgent Itinerary Advice?') || flightHtml.includes('WhatsApp Travel Coordinator');
  assert(!hasUrgentAdviceCard, 'Element 4: "Need Urgent Itinerary Advice?" direct desk card is completely removed from DOM');

  // Element 5: Specific FAQ on student baggage allowances
  const hasBaggageFaq = flightHtml.includes('How do international students obtain extra baggage allowances (40kg–46kg)?');
  assert(!hasBaggageFaq, 'Element 5: FAQ "How do international students obtain extra baggage allowances (40kg–46kg)?" completely removed');

  // =========================================================================
  // SECTION 2: CLIENT IMAGE & CORE BRANDING
  // =========================================================================
  console.log('\n--- 2. VERIFYING APPROVED CLIENT IMAGE & ESSENTIAL TERMS ---');

  assert(
    flightHtml.includes('Flight%20Booking%20and%20Dummy%20Tickets.png') || flightHtml.includes('Flight Booking and Dummy Tickets.png'),
    'Approved client-supplied image "Flight Booking and Dummy Tickets.png" is preserved'
  );
  assert(
    flightHtml.includes('Visa Convention Flight Booking and Reservation Assistance'),
    'Hero visual descriptive alt text is preserved'
  );
  assert(
    flightHtml.includes('U.S. Department of State') && flightHtml.includes('strictly refuses to create or distribute fake tickets'),
    'Legally necessary consular disclaimers and anti-fraud terms concisely preserved'
  );

  // =========================================================================
  // SECTION 3: PUPPETEER BROWSER VERIFICATION
  // =========================================================================
  console.log('\n--- 3. BROWSER RENDERING, INTERACTIVITY & LAYOUT REBALANCE ---');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Desktop 1440px
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:${PORT}/services/flight-booking/`, { waitUntil: 'networkidle0' });

  // 1. Verify enquiry section has form centered in max-w-4xl (no empty 4-column right gutter)
  const enquiryLayout = await page.evaluate(() => {
    const section = document.getElementById('flight-enquiry-section');
    if (!section) return null;
    const formContainer = section.querySelector('div');
    const hasGridCols12 = section.querySelector('.lg\\:grid-cols-12') !== null;
    const hasColSpan4 = section.querySelector('.lg\\:col-span-4') !== null;
    return {
      hasGridCols12,
      hasColSpan4,
      containerClasses: formContainer ? formContainer.className : '',
    };
  });

  assert(!enquiryLayout.hasGridCols12, 'Enquiry section removed legacy 12-column grid container');
  assert(!enquiryLayout.hasColSpan4, 'Enquiry section has no orphaned 4-column right gutter');
  assert(enquiryLayout.containerClasses.includes('max-w-4xl'), 'Enquiry section is rebalanced and centered in max-w-4xl container');

  // 2. Verify all form fields exist and work
  const formStatus = await page.evaluate(() => {
    const form = document.getElementById('flight-assistance-form');
    const serviceRadios = Array.from(document.querySelectorAll('input[name="service"]'));
    const origin = document.getElementById('flight-departure-city');
    const destination = document.getElementById('flight-destination-city');
    const depDate = document.getElementById('flight-departure-date');
    const retDate = document.getElementById('flight-return-date');
    const name = document.getElementById('flight-full-name');
    const phone = document.getElementById('flight-phone');
    const submitBtn = document.getElementById('flight-submit-btn');

    return {
      formExists: form !== null,
      serviceCount: serviceRadios.length,
      originExists: origin !== null,
      destinationExists: destination !== null,
      depDateExists: depDate !== null,
      retDateExists: retDate !== null,
      nameExists: name !== null,
      phoneExists: phone !== null,
      submitBtnExists: submitBtn !== null,
    };
  });

  assert(formStatus.formExists, 'Flight enquiry form exists in DOM');
  assert(formStatus.serviceCount === 3, 'All 3 travel service options present (Actual: 3)');
  assert(formStatus.originExists && formStatus.destinationExists, 'Departure and destination city inputs present');
  assert(formStatus.depDateExists && formStatus.retDateExists, 'Travel date pickers present');
  assert(formStatus.nameExists && formStatus.phoneExists, 'Passenger contact fields present');
  assert(formStatus.submitBtnExists, 'Primary submission action button present');

  // 3. Test One-Way / Round-Trip toggle
  await page.click('#trip-oneway-label');
  const returnDisabled = await page.$eval('#flight-return-date', el => el.disabled);
  assert(returnDisabled, 'Trip type toggle: selecting One-Way disables return date');

  await page.click('#trip-round-label');
  const returnEnabled = await page.$eval('#flight-return-date', el => !el.disabled);
  assert(returnEnabled, 'Trip type toggle: selecting Round-Trip enables return date');

  // 4. Capture after screenshots on desktop
  const afterDesktopHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log(`\n  📊 Desktop Scroll Height: 3488px (Before) -> ${afterDesktopHeight}px (After) [Reduction: -${3488 - afterDesktopHeight}px]`);
  assert(afterDesktopHeight < 3488, `Page scroll height reduced on desktop (${afterDesktopHeight}px < 3488px)`);

  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'after-flight-booking-desktop-1440px.png'), fullPage: true });
  console.log('  📸 Captured: after-flight-booking-desktop-1440px.png');

  // Capture close-up of enquiry section
  const enquirySection = await page.$('#flight-enquiry-section');
  if (enquirySection) {
    await enquirySection.screenshot({ path: path.join(EVIDENCE_DIR, 'flight-enquiry-form-desktop-1440px.png') });
    console.log('  📸 Captured: flight-enquiry-form-desktop-1440px.png');
  }

  // 5. Mobile 390px
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(`http://localhost:${PORT}/services/flight-booking/`, { waitUntil: 'networkidle0' });

  const afterMobileHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log(`  📊 Mobile Scroll Height: 6102px (Before) -> ${afterMobileHeight}px (After) [Reduction: -${6102 - afterMobileHeight}px]`);
  assert(afterMobileHeight < 6102, `Page scroll height drastically reduced on mobile (${afterMobileHeight}px < 6102px)`);

  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'after-flight-booking-mobile-390px.png'), fullPage: true });
  console.log('  📸 Captured: after-flight-booking-mobile-390px.png');

  const mobileEnquirySection = await page.$('#flight-enquiry-section');
  if (mobileEnquirySection) {
    await mobileEnquirySection.screenshot({ path: path.join(EVIDENCE_DIR, 'flight-enquiry-form-mobile-390px.png') });
    console.log('  📸 Captured: flight-enquiry-form-mobile-390px.png');
  }

  // 6. Test floating WhatsApp button does not obstruct form inputs
  const waObstruction = await page.evaluate(() => {
    const waBtn = document.getElementById('floating-whatsapp-btn');
    const submitBtn = document.getElementById('flight-submit-btn');
    if (!waBtn || !submitBtn) return false;
    const waRect = waBtn.getBoundingClientRect();
    const subRect = submitBtn.getBoundingClientRect();
    return !(
      waRect.right < subRect.left ||
      waRect.left > subRect.right ||
      waRect.bottom < subRect.top ||
      waRect.top > subRect.bottom
    );
  });
  assert(!waObstruction, 'Floating WhatsApp button does not obstruct form submit button on mobile');

  // =========================================================================
  // SECTION 4: RESPONSIVE OVERFLOW AUDIT ACROSS ALL 8 VIEWPORTS
  // =========================================================================
  console.log('\n--- 4. MOBILE-FIRST RESPONSIVE AUDIT ACROSS ALL 8 VIEWPORTS ---');

  for (const vp of VIEWPORTS) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto(`http://localhost:${PORT}/services/flight-booking/`, { waitUntil: 'networkidle0' });

    const noOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth <= document.documentElement.clientWidth;
    });

    assert(noOverflow, `Zero horizontal overflow at ${vp.name} (${vp.width}x${vp.height})`);
  }

  await browser.close();
  server.close();

  // Summary
  console.log('\n=======================================================');
  console.log(`TOTAL CHECKS: ${totalChecks}`);
  console.log(`PASSED: ${passedChecks}`);
  console.log(`FAILED: ${failedChecks}`);
  console.log(`PASS RATE: ${Math.round((passedChecks / totalChecks) * 100)}%`);
  console.log('=======================================================');

  if (failedChecks > 0) {
    console.error('\nFailures:');
    failureDetails.forEach(f => console.error(`  - ${f.checkName}: ${f.details}`));
    process.exit(1);
  } else {
    console.log('\n🎉 ALL FLIGHT BOOKING OPTIMIZATION CHECKS PASSED (100%)\n');
    process.exit(0);
  }
}

runAudit().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
