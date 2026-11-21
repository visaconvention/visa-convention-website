import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');
const ARTIFACTS_DIR = 'C:/Users/ACER/.gemini/antigravity/brain/6a0361a6-ccbe-4f53-a463-b2d5ee259bd4/flight-pages-final-optimization';
const PORT = 4365;

if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

function findEdgeBinary() {
  const edgePaths = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  for (const p of edgePaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const VIEWPORTS = [
  { width: 320, height: 600, label: '320px' },
  { width: 360, height: 640, label: '360px' },
  { width: 390, height: 844, label: '390px' },
  { width: 430, height: 932, label: '430px' },
  { width: 768, height: 1024, label: '768px' },
  { width: 1024, height: 768, label: '1024px' },
  { width: 1440, height: 900, label: '1440px' },
];

async function main() {
  console.log('=== Starting Flight Pages Final Optimization Verification ===');
  const server = http.createServer((req, res) => {
    let cleanUrl = req.url.split('?')[0];
    if (cleanUrl.endsWith('/')) cleanUrl += 'index.html';
    const filePath = path.join(DIST_DIR, cleanUrl);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      res.end(fs.readFileSync(filePath));
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Test server running at http://localhost:${PORT}`);

  const edgeBin = findEdgeBinary();
  if (!edgeBin) throw new Error('Edge binary not found');

  const browser = await puppeteer.launch({
    executablePath: edgeBin,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  [PASS] ${message}`);
    } else {
      failedTests++;
      console.error(`  [FAIL] ${message}`);
    }
  }

  // ==========================================
  // 1. DUMMY TICKETS PAGE VERIFICATION
  // ==========================================
  console.log('\n--- 1. Auditing Dummy Tickets Page (/services/dummy-tickets/) ---');
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(`http://localhost:${PORT}/services/dummy-tickets/`, { waitUntil: 'networkidle0' });

  const dummyData = await page.evaluate(() => {
    const html = document.body.innerHTML;
    const text = document.body.innerText;
    
    // Check banner image
    const imgs = Array.from(document.querySelectorAll('img')).map(img => img.src);
    const hasFlightBanner = imgs.some(src => src.includes('Flight%20Booking%20and%20Dummy%20Tickets.png') || src.includes('Flight Booking'));
    const hasAspectVideoOr169 = document.querySelector('.aspect-\\[16\\/9\\]') !== null;

    // Check sentence removal
    const deletedSentence = "Depending on the arrangement, it may include passenger information, departure and arrival airports, proposed travel dates and flight details.";
    const hasDeletedSentence = text.includes(deletedSentence) || html.includes(deletedSentence);

    // Check remaining explanation paragraph
    const expectedExplanation = "A dummy flight ticket generally refers to a temporary flight reservation or proposed travel itinerary showing intended flight details without necessarily purchasing a fully issued airline ticket.";
    const hasExpectedExplanation = text.includes(expectedExplanation);

    // Check 3 use cases
    const useCases = [
      'Visa Application Documentation',
      'Travel Planning Before Visa Approval',
      'Temporary Reservation Requirements'
    ];
    const hasAllUseCases = useCases.every(uc => text.includes(uc));

    // Check pre-form
    const hasPreFormHeading = text.includes('Need a Flight Reservation?');
    const hasPreFormText = text.includes('Share your intended travel details through the enquiry form below');

    // Check form
    const form = document.querySelector('form');
    const hasNameInput = form ? form.querySelector('input[name="fullName"]') !== null : false;
    const hasPhoneInput = form ? form.querySelector('input[name="phone"]') !== null : false;
    const hasMessageInput = form ? form.querySelector('textarea[name="message"]') !== null : false;
    const hasConsent = form ? form.querySelector('input[name="privacy_consent"]') !== null : false;
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
    const submitBtnText = submitBtn ? submitBtn.innerText.trim() : '';

    return {
      hasFlightBanner,
      hasAspectVideoOr169,
      hasDeletedSentence,
      hasExpectedExplanation,
      hasAllUseCases,
      hasPreFormHeading,
      hasPreFormText,
      hasNameInput,
      hasPhoneInput,
      hasMessageInput,
      hasConsent,
      submitBtnText,
    };
  });

  assert(!dummyData.hasFlightBanner, 'Dummy Tickets: Promotional banner image is completely absent');
  assert(!dummyData.hasAspectVideoOr169, 'Dummy Tickets: Promotional banner container (.aspect-[16/9]) is absent from component tree');
  assert(!dummyData.hasDeletedSentence, 'Dummy Tickets: Sentence ("Depending on the arrangement...") is completely deleted');
  assert(dummyData.hasExpectedExplanation, 'Dummy Tickets: Remaining explanation paragraph is intact');
  assert(dummyData.hasAllUseCases, 'Dummy Tickets: All 3 use cases are intact');
  assert(dummyData.hasPreFormHeading, 'Dummy Tickets: Pre-form heading ("Need a Flight Reservation?") is present');
  assert(dummyData.hasPreFormText, 'Dummy Tickets: Pre-form text is present');
  assert(dummyData.hasNameInput && dummyData.hasPhoneInput && dummyData.hasMessageInput && dummyData.hasConsent, 'Dummy Tickets: Minimal form fields (name, phone, message) and privacy consent are present');
  assert(dummyData.submitBtnText.includes('Request Assistance'), `Dummy Tickets: Submit button text matches ("${dummyData.submitBtnText}")`);

  // ==========================================
  // 2. CONFIRMED FLIGHT TICKETS PAGE VERIFICATION
  // ==========================================
  console.log('\n--- 2. Auditing Confirmed Flight Tickets Page (/services/confirmed-flight-tickets/) ---');
  await page.goto(`http://localhost:${PORT}/services/confirmed-flight-tickets/`, { waitUntil: 'networkidle0' });

  const confirmedData = await page.evaluate(() => {
    const html = document.body.innerHTML;
    const text = document.body.innerText;

    // Check banner image
    const imgs = Array.from(document.querySelectorAll('img')).map(img => img.src);
    const hasFlightBanner = imgs.some(src => src.includes('Flight%20Booking%20and%20Dummy%20Tickets.png') || src.includes('Flight Booking'));
    const hasAspectVideoOr169 = document.querySelector('.aspect-\\[16\\/9\\]') !== null;

    // Check exact 2 paragraphs
    const para1 = "A confirmed flight ticket is an airline-issued ticket issued after booking and payment, containing flight details, a booking reference (PNR), and an e-ticket number.";
    const para2 = "Visa Convention assists travelers with comparing flight options and arranging confirmed bookings based on their travel preferences.";
    const hasPara1 = text.includes(para1);
    const hasPara2 = text.includes(para2);

    // Check old superseded text is NOT present
    const oldPara1 = "A confirmed flight ticket is an airline-issued ticket obtained after completing the required booking and payment process.";
    const oldPara2 = "It typically includes passenger details, departure and arrival airports, flight dates, booking reference (PNR), and an electronic ticket number.";
    const oldPara3 = "Visa Convention assists travelers with exploring available flights, comparing travel options, and arranging confirmed ticket bookings according to their destinations, schedules, and preferences.";
    const hasOldText = text.includes(oldPara1) || text.includes(oldPara2) || text.includes(oldPara3);

    // Check form introduction deletion
    const deletedIntro = "Share your contact details through the enquiry form below, and our team will assist you with available flights, fares, baggage options, and booking arrangements.";
    const hasDeletedIntro = text.includes(deletedIntro) || html.includes(deletedIntro);

    // Check pre-form heading is kept
    const hasPreFormHeading = text.includes('Ready to Book Your Flight?');

    // Check form
    const form = document.querySelector('form');
    const hasNameInput = form ? form.querySelector('input[name="fullName"]') !== null : false;
    const hasPhoneInput = form ? form.querySelector('input[name="phone"]') !== null : false;
    const hasMessageInput = form ? form.querySelector('textarea[name="message"]') !== null : false;
    const hasConsent = form ? form.querySelector('input[name="privacy_consent"]') !== null : false;
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
    const submitBtnText = submitBtn ? submitBtn.innerText.trim() : '';

    return {
      hasFlightBanner,
      hasAspectVideoOr169,
      hasPara1,
      hasPara2,
      hasOldText,
      hasDeletedIntro,
      hasPreFormHeading,
      hasNameInput,
      hasPhoneInput,
      hasMessageInput,
      hasConsent,
      submitBtnText,
    };
  });

  assert(!confirmedData.hasFlightBanner, 'Confirmed Flights: Promotional banner image is completely absent');
  assert(!confirmedData.hasAspectVideoOr169, 'Confirmed Flights: Promotional banner container (.aspect-[16/9]) is absent from component tree');
  assert(confirmedData.hasPara1, 'Confirmed Flights: Paragraph 1 matches exact required copy');
  assert(confirmedData.hasPara2, 'Confirmed Flights: Paragraph 2 matches exact required copy');
  assert(!confirmedData.hasOldText, 'Confirmed Flights: Superseded description text is completely absent');
  assert(!confirmedData.hasDeletedIntro, 'Confirmed Flights: Form introduction sentence is completely deleted');
  assert(confirmedData.hasPreFormHeading, 'Confirmed Flights: Pre-form heading ("Ready to Book Your Flight?") is preserved');
  assert(confirmedData.hasNameInput && confirmedData.hasPhoneInput && confirmedData.hasMessageInput && confirmedData.hasConsent, 'Confirmed Flights: Minimal form fields (name, phone, message) and privacy consent are present');
  assert(confirmedData.submitBtnText.includes('Request Flight Assistance'), `Confirmed Flights: Submit button text matches ("${confirmedData.submitBtnText}")`);

  // ==========================================
  // 3. HOMEPAGE CARD 5 INTEGRITY VERIFICATION
  // ==========================================
  console.log('\n--- 3. Auditing Homepage Card 5 Integrity (/ & /#services) ---');
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

  const homeData = await page.evaluate(() => {
    const card5Link = document.querySelector('a[href="/services/flight-booking/"]');
    const card5Parent = card5Link ? card5Link.closest('.group') : null;
    const card5Img = card5Parent ? card5Parent.querySelector('img') : null;
    return {
      card5Exists: card5Link !== null,
      imgSrc: card5Img ? card5Img.src : '',
      imgAlt: card5Img ? card5Img.alt : '',
    };
  });

  assert(homeData.card5Exists, 'Homepage: Flight Booking service card (Card 5) exists with route /services/flight-booking/');
  assert(homeData.imgSrc.includes('Flight%20Booking%20and%20Dummy%20Tickets.png'), `Homepage: Card 5 retains original Flight Booking image (${homeData.imgSrc})`);

  // ==========================================
  // 4. RESPONSIVE VIEWPORT TESTING
  // ==========================================
  console.log('\n--- 4. Auditing Responsive Viewports (320, 360, 390, 430, 768, 1024, 1440px) ---');
  const targetRoutes = [
    { url: '/services/dummy-tickets/', name: 'Dummy Tickets' },
    { url: '/services/confirmed-flight-tickets/', name: 'Confirmed Flight Tickets' },
  ];

  for (const r of targetRoutes) {
    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(`http://localhost:${PORT}${r.url}`, { waitUntil: 'networkidle0' });

      const vpMetrics = await page.evaluate(() => {
        const header = document.querySelector('header');
        const headerBottom = header ? header.getBoundingClientRect().bottom : 0;
        const breadcrumbNav = document.querySelector('nav[aria-label="Breadcrumb"]');
        const targetTop = breadcrumbNav ? breadcrumbNav.getBoundingClientRect().top : 0;
        const gap = Math.round(targetTop - headerBottom);
        const hasHorizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;
        return { gap, hasHorizontalOverflow };
      });

      assert(!vpMetrics.hasHorizontalOverflow, `${r.name} @ ${vp.label}: No horizontal overflow (scrollWidth <= ${vp.width})`);
      assert(vpMetrics.gap >= 16 && vpMetrics.gap <= 32, `${r.name} @ ${vp.label}: Header-to-content gap is standardized (${vpMetrics.gap}px)`);
    }
  }

  // ==========================================
  // 5. HIGH-RES SCREENSHOT CAPTURES
  // ==========================================
  console.log('\n--- 5. Capturing High-Res Verification Screenshots ---');
  
  // Desktop 1366px screenshots
  await page.setViewport({ width: 1366, height: 768 });
  
  await page.goto(`http://localhost:${PORT}/services/dummy-tickets/`, { waitUntil: 'networkidle0' });
  const dtDesktopPath = path.join(ARTIFACTS_DIR, 'dummy-tickets-desktop-clean.png');
  await page.screenshot({ path: dtDesktopPath, clip: { x: 0, y: 0, width: 1366, height: 600 } });
  console.log('  Saved dummy-tickets-desktop-clean.png');

  await page.goto(`http://localhost:${PORT}/services/confirmed-flight-tickets/`, { waitUntil: 'networkidle0' });
  const cftDesktopPath = path.join(ARTIFACTS_DIR, 'confirmed-flight-tickets-desktop-clean.png');
  await page.screenshot({ path: cftDesktopPath, clip: { x: 0, y: 0, width: 1366, height: 600 } });
  console.log('  Saved confirmed-flight-tickets-desktop-clean.png');

  await page.goto(`http://localhost:${PORT}/#services`, { waitUntil: 'networkidle0' });
  const homeCardPath = path.join(ARTIFACTS_DIR, 'homepage-flight-card-intact.png');
  await page.screenshot({ path: homeCardPath, clip: { x: 0, y: 0, width: 1366, height: 700 } });
  console.log('  Saved homepage-flight-card-intact.png');

  // Mobile 375px screenshots
  await page.setViewport({ width: 375, height: 667 });

  await page.goto(`http://localhost:${PORT}/services/dummy-tickets/`, { waitUntil: 'networkidle0' });
  const dtMobilePath = path.join(ARTIFACTS_DIR, 'dummy-tickets-mobile-375px.png');
  await page.screenshot({ path: dtMobilePath, fullPage: true });
  console.log('  Saved dummy-tickets-mobile-375px.png');

  await page.goto(`http://localhost:${PORT}/services/confirmed-flight-tickets/`, { waitUntil: 'networkidle0' });
  const cftMobilePath = path.join(ARTIFACTS_DIR, 'confirmed-flight-tickets-mobile-375px.png');
  await page.screenshot({ path: cftMobilePath, fullPage: true });
  console.log('  Saved confirmed-flight-tickets-mobile-375px.png');

  // Write results JSON
  const resultsJson = {
    timestamp: new Date().toISOString(),
    totalTests,
    passedTests,
    failedTests,
    summary: `${passedTests}/${totalTests} tests passed (${Math.round((passedTests / totalTests) * 100)}%)`,
  };
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'audit-results.json'), JSON.stringify(resultsJson, null, 2));

  console.log(`\n=== Verification Complete: ${passedTests}/${totalTests} tests passed ===`);

  await browser.close();
  server.close();

  if (failedTests > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
