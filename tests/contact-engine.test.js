import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\7ca130ef-5e70-4578-88a2-0879acc42caa';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const DIST_DIR = path.resolve('dist');
const LEADS_FILE = path.resolve('client-content/leads/enquiries.json');
const PORT = 4326;

console.log('=====================================================');
console.log('   VISA CONVENTION - STAGE 09 CONTACT QA SUITE       ');
console.log('=====================================================\n');

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

// Reset leads file
if (fs.existsSync(LEADS_FILE)) {
  fs.unlinkSync(LEADS_FILE);
}
fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2), 'utf8');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

// Start Mock Delivery Server
function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = req.url.split('?')[0];

      // Handle Form Submission Endpoint
      if (req.method === 'POST' && url === '/api/enquiry') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);

            // Spam check: honeypot
            if (data.website_url_check) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, message: 'Spam detected.' }));
              return;
            }

            // Validation
            if (data.submissionType === 'business') {
              if (!data.organizationName || !data.contactPerson || !data.email || !data.phone) {
                res.writeHead(422, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Missing required business fields.' }));
                return;
              }
            } else {
              if (!data.fullName || !data.phone || !data.email || !data.service) {
                res.writeHead(422, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Missing required candidate fields.' }));
                return;
              }
            }

            // Record to disk
            const leadId = `VC-LEAD-${Date.now().toString().slice(-6)}`;
            const currentLeads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
            const newLead = { leadId, ...data, receivedAt: new Date().toISOString() };
            currentLeads.push(newLead);
            fs.writeFileSync(LEADS_FILE, JSON.stringify(currentLeads, null, 2), 'utf8');

            console.log(`     [Server] New lead recorded to disk: ${leadId} (${data.submissionType})`);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, leadId }));
          } catch (e) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Server parsing error.' }));
          }
        });
        return;
      }

      // Handle Failure Simulation Endpoint
      if (req.method === 'POST' && url === '/api/enquiry-fail') {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Internal Server Error (Simulated).' }));
        return;
      }

      // Serve Static Files
      let reqPath = decodeURI(url);
      if (reqPath.endsWith('/')) reqPath += 'index.html';
      let filePath = path.join(DIST_DIR, reqPath);

      if (!path.extname(filePath)) {
        if (fs.existsSync(path.join(filePath, 'index.html'))) {
          filePath = path.join(filePath, 'index.html');
        } else if (fs.existsSync(filePath + '.html')) {
          filePath = filePath + '.html';
        }
      }

      fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
          return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
      });
    });

    server.listen(PORT, () => {
      console.log(`  [Server] Delivery test server active at http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

async function runTests() {
  const server = await startServer();

  console.log('  [Browser] Launching Edge Chromium via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  // ----------------------------------------------------
  // TEST GROUP 1: Contact Page Rendering & Trust Signals
  // ----------------------------------------------------
  console.log('\n--- TEST GROUP 1: Contact Page Rendering & Trust Signals ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });

  const pageTitle = await page.title();
  assert(pageTitle.includes('Contact Our Office') && pageTitle.includes('Visa Convention'), 'Contact page title matches brand');

  const pageText = await page.evaluate(() => document.body.innerText);
  assert(pageText.includes('Shop No.115, Durga Market') && pageText.includes('Hanumangarh, Rajasthan 335512'), 'Displays verified Hanumangarh physical address');
  assert(pageText.includes('Monday – Saturday: 9:30 AM – 6:30 PM IST'), 'Displays office counseling hours');
  assert(pageText.includes('visaconvention064@gmail.com'), 'Displays official electronic mail');
  assert(pageText.includes('Initial Inquiry Privacy Guarantee'), 'Displays strict initial inquiry privacy guarantee');
  assert(pageText.includes('never request passport scans'), 'Explicitly notes no passport scans requested on web form');

  // ----------------------------------------------------
  // TEST GROUP 2: WhatsApp Link & Floating Widget
  // ----------------------------------------------------
  console.log('\n--- TEST GROUP 2: WhatsApp Link & Context Prefill ---');
  const waBtn = await page.$('#contact-whatsapp-link');
  assert(waBtn !== null, 'Contact page contains direct WhatsApp channel link');

  const waHref = await page.$eval('#contact-whatsapp-link', el => el.getAttribute('href'));
  assert(waHref.includes('wa.me/919680395539'), 'WhatsApp URL contains approved business phone number', waHref);
  assert(waHref.includes('text='), 'WhatsApp URL contains prefilled context parameter', waHref);

  const floatingBtn = await page.$('#floating-whatsapp-btn');
  assert(floatingBtn !== null, 'Sitewide non-intrusive floating WhatsApp widget present in DOM');

  // ----------------------------------------------------
  // TEST GROUP 3: Invalid Fields & Accessible Error Handling
  // ----------------------------------------------------
  console.log('\n--- TEST GROUP 3: Invalid Fields & Error Handling ---');
  
  // Submit without selecting anything
  await page.click('#enquiry-submit-btn');

  const serviceInvalid = await page.$eval('#form-service', el => el.getAttribute('aria-invalid'));
  assert(serviceInvalid === 'true', 'Service dropdown flagged with aria-invalid="true" when empty');

  const serviceErrorVisible = await page.$eval('#form-service-error', el => !el.classList.contains('hidden'));
  assert(serviceErrorVisible, 'Inline accessible error message displayed for service category');

  const nameInvalid = await page.$eval('#form-full-name', el => el.getAttribute('aria-invalid'));
  assert(nameInvalid === 'true', 'Full Name field flagged with aria-invalid="true" when empty');

  const consentInvalid = await page.$eval('#form-consent', el => el.getAttribute('aria-invalid'));
  assert(consentInvalid === 'true', 'Consent checkbox flagged with aria-invalid="true" when unchecked');

  // ----------------------------------------------------
  // TEST GROUP 4: Keyboard Interaction & Field Input
  // ----------------------------------------------------
  console.log('\n--- TEST GROUP 4: Keyboard Interaction & Navigation ---');
  
  await page.focus('#form-service');
  await page.keyboard.press('ArrowDown');
  await page.select('#form-service', 'study-visa');

  await page.focus('#form-full-name');
  await page.keyboard.type('Test Candidate (Automated)');

  await page.focus('#form-phone');
  await page.keyboard.type('+91 98765 12345');

  await page.focus('#form-email');
  await page.keyboard.type('candidate.qa@visaconvention.test');

  await page.select('#form-country', 'canada');

  await page.focus('#form-university');
  await page.keyboard.type('University of Toronto');

  await page.focus('#form-message');
  await page.keyboard.type('Completed B.Tech Computer Science with 8.2 CGPA; seeking Fall 2026 Masters admissions.');

  await page.click('#form-consent');

  const filledName = await page.$eval('#form-full-name', el => el.value);
  assert(filledName === 'Test Candidate (Automated)', 'Keyboard typing accurately populated form field');

  // ----------------------------------------------------
  // TEST GROUP 5: Actual Delivery to Destination on Disk
  // ----------------------------------------------------
  console.log('\n--- TEST GROUP 5: Actual Successful Form Delivery Verification ---');
  
  // Submit form
  await page.click('#enquiry-submit-btn');

  // Wait for success view
  await page.waitForSelector('#enquiry-success-view:not(.hidden)', { timeout: 5000 });
  const successVisible = await page.$eval('#enquiry-success-view', el => !el.classList.contains('hidden'));
  assert(successVisible, 'UI displays confirmation view upon successful delivery');

  const refBadgeText = await page.$eval('#success-ref-badge', el => el.innerText);
  assert(refBadgeText.includes('VC-LEAD-'), 'Displays verified Reference Tracking ID', refBadgeText);

  // VERIFY ACTUAL DELIVERY TO DESTINATION ON DISK:
  const diskLeads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
  const deliveredLead = diskLeads.find(l => l.fullName === 'Test Candidate (Automated)');

  assert(deliveredLead !== undefined, 'CRITICAL: Lead actually reached server storage destination on disk!');
  assert(deliveredLead?.service === 'study-visa', 'Delivered lead contains selected service (study-visa)');
  assert(deliveredLead?.targetCountry === 'canada', 'Delivered lead contains selected country (canada)');
  assert(deliveredLead?.targetUniversity === 'University of Toronto', 'Delivered lead contains target university');

  // ----------------------------------------------------
  // TEST GROUP 6: Error State When Delivery Fails
  // ----------------------------------------------------
  console.log('\n--- TEST GROUP 6: Error State When Delivery Fails ---');
  
  // Reset form via "Submit Another Request"
  await page.click('#submit-another-btn');
  const formVisibleAgain = await page.$eval('#visa-enquiry-form', el => !el.classList.contains('hidden'));
  assert(formVisibleAgain, 'Clicking "Submit Another Request" resets form view');

  // Point action to failing endpoint
  await page.evaluate(() => {
    const formEl = document.getElementById('visa-enquiry-form');
    // Monkey patch fetch to fail or route to /api/enquiry-fail
    const origFetch = window.fetch;
    window.fetch = (url, opts) => {
      return origFetch('/api/enquiry-fail', opts);
    };
  });

  // Re-fill form
  await page.select('#form-service', 'mbbs');
  await page.type('#form-full-name', 'MBBS Aspirant (Fail Test)');
  await page.type('#form-phone', '+91 99999 88888');
  await page.type('#form-email', 'mbbs.fail@test.com');
  await page.click('#form-consent');

  await page.click('#enquiry-submit-btn');

  // Wait for error banner
  await page.waitForSelector('#enquiry-delivery-error:not(.hidden)', { timeout: 5000 });
  const errorBannerVisible = await page.$eval('#enquiry-delivery-error', el => !el.classList.contains('hidden'));
  assert(errorBannerVisible, 'Delivery failure displays accessible error alert banner');

  const successStillHidden = await page.$eval('#enquiry-success-view', el => el.classList.contains('hidden'));
  assert(successStillHidden, 'CRITICAL RULE: UI does NOT claim success when delivery fails!');

  const fallbackWa = await page.$('#error-fallback-whatsapp');
  assert(fallbackWa !== null, 'Failure alert provides immediate WhatsApp contact fallback');

  // ----------------------------------------------------
  // TEST GROUP 7: Business Partnership Dynamic Mode
  // ----------------------------------------------------
  console.log('\n--- TEST GROUP 7: Business Partnership Dynamic Fields ---');
  await page.reload({ waitUntil: 'networkidle0' });

  await page.select('#form-service', 'business-partnership');

  const candidateFieldsHidden = await page.$eval('#standard-candidate-fields', el => el.classList.contains('hidden'));
  assert(candidateFieldsHidden, 'Selecting Business Partnership hides standard candidate fields');

  const businessFieldsVisible = await page.$eval('#business-partnership-fields', el => !el.classList.contains('hidden'));
  assert(businessFieldsVisible, 'Selecting Business Partnership displays organization & B2B fields');

  // Fill business fields
  await page.type('#form-business-org', 'Northern Rajasthan Language Academy');
  await page.type('#form-business-contact', 'Vikas Choudhary (Managing Director)');
  await page.type('#form-business-email', 'director@nr-academy.com');
  await page.type('#form-business-phone', '+91 94140 12345');
  await page.type('#form-business-scope', 'Seeking ethical referral partnership for 60+ IELTS students per year.');
  await page.click('#form-consent');

  await page.click('#enquiry-submit-btn');

  await page.waitForSelector('#enquiry-success-view:not(.hidden)', { timeout: 5000 });
  
  // Verify business lead recorded to disk
  const updatedDiskLeads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
  const businessLead = updatedDiskLeads.find(l => l.organizationName === 'Northern Rajasthan Language Academy');
  assert(businessLead !== undefined, 'Business partnership inquiry successfully reached destination on disk!');
  assert(businessLead?.submissionType === 'business', 'Business lead categorized as submissionType: business');

  // ----------------------------------------------------
  // TEST GROUP 8: Mobile Layout & Viewport Verification
  // ----------------------------------------------------
  console.log('\n--- TEST GROUP 8: Mobile Layout (390px Viewport) ---');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });

  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  assert(bodyWidth <= 390, `No horizontal overflow on mobile 390px (Actual width: ${bodyWidth}px)`);

  const submitBtnHeight = await page.$eval('#enquiry-submit-btn', el => el.getBoundingClientRect().height);
  assert(submitBtnHeight >= 44, `Submit button meets minimum 44px touch target (Actual: ${submitBtnHeight}px)`);

  // Capture Contact page screenshots for artifacts
  console.log('\nCapturing contact preview screenshots...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'contact-desktop.png') });

  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'contact-mobile.png') });

  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'contact-fullpage.png'), fullPage: true });

  await browser.close();
  server.close();

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log('\n=====================================================');
  console.log(`TOTAL TESTS : ${totalTests}`);
  console.log(`PASSED      : ${passedTests}`);
  console.log(`FAILED      : ${failedTests}`);
  console.log('=====================================================');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    console.log('ALL ENQUIRY & CONTACT SYSTEM QA TESTS PASSED SUCCESSFULLY! 🚀');
  }
}

runTests().catch(err => {
  console.error('Fatal error during contact tests:', err);
  process.exit(1);
});
