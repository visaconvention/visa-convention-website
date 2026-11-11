import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\7ca130ef-5e70-4578-88a2-0879acc42caa';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const DIST_DIR = path.resolve('dist');
const LEADS_FILE = path.resolve('client-content/leads/enquiries.json');
const PORT = 4334;

console.log('=====================================================');
console.log('   VISA CONVENTION - FLIGHT & IMAGE QA SUITE         ');
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

      // Handle Flight Submission Endpoint
      if (req.method === 'POST' && url === '/api/enquiry') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);

            // Spam check: honeypot
            if (data.airline_preference_hp || data.website_url_check) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, message: 'Spam detected.' }));
              return;
            }

            // Flight Validation
            if (data.submissionType === 'flight') {
              if (!data.fullName || !data.phone || !data.service || !data.departureCity || !data.destinationCity || !data.departureDate) {
                res.writeHead(422, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Missing required flight fields.' }));
                return;
              }

              // Return date comparison for round-trip
              if (data.tripType === 'round-trip' && data.returnDate && data.returnDate < data.departureDate) {
                res.writeHead(422, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Invalid return date.' }));
                return;
              }
            }

            const leadId = `VC-FLT-${Date.now().toString().slice(-6)}`;
            const currentLeads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8') || '[]');
            currentLeads.push({
              leadId,
              ...data,
              receivedAt: new Date().toISOString(),
            });
            fs.writeFileSync(LEADS_FILE, JSON.stringify(currentLeads, null, 2), 'utf8');

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, leadId }));
          } catch (e) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: e.message }));
          }
        });
        return;
      }

      // Static File Serving
      let cleanUrl = url;
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

    server.listen(PORT, () => resolve(server));
  });
}

async function runTests() {
  const server = await startServer();
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    // ----------------------------------------------------
    // TEST SECTION 1: FLIGHT BOOKING ROUTE & STRUCTURE
    // ----------------------------------------------------
    console.log('\n--- Test Section 1: Flight Booking Page & Content Integrity ---');
    await page.goto(`http://localhost:${PORT}/services/flight-booking/`, { waitUntil: 'networkidle0' });

    const title = await page.title();
    assert(title.includes('Flight Booking & Reservation Assistance'), 'Page title is correct and branded');

    const metaDesc = await page.$eval('meta[name="description"]', el => el.getAttribute('content'));
    assert(metaDesc && metaDesc.length >= 50 && metaDesc.length <= 175, 'Meta description length conforms to SEO standards (50-175 chars)', `Length: ${metaDesc?.length}`);

    // Aviation Hero Image Check
    const heroImgSrc = await page.$eval('img[src*="flight-hero-aviation.jpg"]', el => el.getAttribute('src'));
    assert(heroImgSrc.includes('flight-hero-aviation.jpg'), 'Aviation hero photograph is present in the DOM');

    const heroImgAlt = await page.$eval('img[src*="flight-hero-aviation.jpg"]', el => el.getAttribute('alt'));
    assert(heroImgAlt && heroImgAlt.toLowerCase().includes('clouds'), 'Aviation hero photograph has descriptive alt text');

    // 3 Service Pathways Present
    const bodyText = await page.$eval('body', el => el.innerText);
    assert(bodyText.includes('Confirmed Flight Ticket'), 'Service option 1 (Confirmed Flight Ticket) is articulated');
    assert(bodyText.includes('Flight Reservation Hold'), 'Service option 2 (Flight Reservation Hold) is articulated');
    assert(bodyText.includes('Travel Itinerary Assistance'), 'Service option 3 (Travel Itinerary Assistance) is articulated');

    // Statutory Consular Integrity Notice
    assert(bodyText.includes('U.S. Department of State'), 'U.S. Department of State consular advisory is cited');
    assert(bodyText.includes('strictly refuses to create or distribute fake tickets'), 'Zero fake PNR / dummy ticket disclaimer is present');

    // ----------------------------------------------------
    // TEST SECTION 2: INTERACTIVE FLIGHT ENQUIRY FORM
    // ----------------------------------------------------
    console.log('\n--- Test Section 2: Interactive Flight Enquiry Form UX ---');
    const formExists = await page.$('#flight-assistance-form');
    assert(formExists !== null, 'Flight assistance form element exists');

    // Button label is "Request Flight Assistance" (NOT "Book Now")
    const submitBtnText = await page.$eval('#flight-submit-btn', el => el.innerText.trim());
    assert(submitBtnText.includes('Request Flight Assistance'), 'Action button is labeled "Request Flight Assistance" (not "Book Now")');

    // Verify Honeypot exists
    const honeypot = await page.$('input[name="airline_preference_hp"]');
    assert(honeypot !== null, 'Anti-spam honeypot field is embedded');

    // Test Trip Type Toggle: One-Way disables return date
    await page.click('#trip-oneway-label');
    const returnDisabled = await page.$eval('#flight-return-date', el => el.disabled);
    assert(returnDisabled === true, 'Selecting One-Way disables return date input');

    // Toggle back to Round-Trip: enables return date
    await page.click('#trip-round-label');
    const returnEnabled = await page.$eval('#flight-return-date', el => !el.disabled);
    assert(returnEnabled === true, 'Selecting Round-Trip re-enables return date input');

    // Test Client-Side Validation on Empty Submit
    await page.click('#flight-submit-btn');
    const originError = await page.$eval('#flight-departure-city-error', el => !el.classList.contains('hidden'));
    assert(originError === true, 'Empty form submit triggers departure city validation error');

    // Fill valid form details
    await page.type('#flight-departure-city', 'Delhi (DEL)');
    await page.type('#flight-destination-city', 'Toronto Pearson (YYZ)');
    
    // Future travel dates
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const depDateStr = futureDate.toISOString().split('T')[0];
    
    const futureReturn = new Date();
    futureReturn.setDate(futureReturn.getDate() + 60);
    const retDateStr = futureReturn.toISOString().split('T')[0];

    await page.$eval('#flight-departure-date', (el, val) => {
      el.value = val;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, depDateStr);

    await page.$eval('#flight-return-date', (el, val) => {
      el.value = val;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, retDateStr);
    await page.type('#flight-full-name', 'Gurpreet Singh');
    await page.type('#flight-phone', '+91 94144 04040');
    await page.type('#flight-email', 'gurpreet.travel@example.com');
    await page.type('#flight-special-notes', 'International student, University of Toronto offer holder; require 46kg student baggage.');

    // Check privacy consent
    await page.click('#flight-consent');

    // Submit valid form
    await page.click('#flight-submit-btn');

    // Wait for success view
    await page.waitForSelector('#flight-success-view:not(.hidden)', { timeout: 5000 });
    const successVisible = await page.$eval('#flight-success-view', el => !el.classList.contains('hidden'));
    assert(successVisible === true, 'Valid flight enquiry submits successfully and renders confirmation view');

    const refText = await page.$eval('#flight-success-ref-badge', el => el.innerText);
    assert(refText.includes('VC-FLT-'), 'Success view displays unique verifiable VC-FLT reference badge', refText);

    // Verify WhatsApp confirmation link prefilled with ref ID
    const waHref = await page.$eval('#flight-success-whatsapp-link', el => el.getAttribute('href'));
    assert(waHref.includes('wa.me') && waHref.includes('VC-FLT-'), 'Direct WhatsApp confirmation link includes reference badge');

    // Check lead recorded to disk
    const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
    assert(leads.length === 1, 'Lead recorded accurately to server persistent storage');
    assert(leads[0].departureCity === 'Delhi (DEL)', 'Lead payload preserves departure city');
    assert(leads[0].destinationCity === 'Toronto Pearson (YYZ)', 'Lead payload preserves destination city');
    assert(leads[0].submissionType === 'flight', 'Lead payload is typed as submissionType=flight');

    // ----------------------------------------------------
    // TEST SECTION 3: MBBS & PHD SERVICE HERO IMAGES
    // ----------------------------------------------------
    console.log('\n--- Test Section 3: MBBS & PhD Visual Upgrades ---');
    await page.goto(`http://localhost:${PORT}/services/mbbs/`, { waitUntil: 'networkidle0' });
    const mbbsImg = await page.$('img[src*="mbbs-education.jpg"]');
    assert(mbbsImg !== null, 'MBBS Abroad service hero renders authentic medical education photograph');

    await page.goto(`http://localhost:${PORT}/services/phd/`, { waitUntil: 'networkidle0' });
    const phdImg = await page.$('img[src*="phd-research.jpg"]');
    assert(phdImg !== null, 'PhD Abroad service hero renders authentic doctoral research photograph');

    // ----------------------------------------------------
    // TEST SECTION 4: IMAGE AUDIT & REGISTRY SYSTEM
    // ----------------------------------------------------
    console.log('\n--- Test Section 4: Image Inventory & Country Registry ---');
    assert(fs.existsSync(path.resolve('IMAGE_AUDIT.md')), 'IMAGE_AUDIT.md exists at project root');

    const auditContent = fs.readFileSync(path.resolve('IMAGE_AUDIT.md'), 'utf8');
    assert(auditContent.includes('flight-hero-aviation.jpg'), 'IMAGE_AUDIT.md documents flight-hero-aviation.jpg');
    assert(auditContent.includes('mbbs-education.jpg'), 'IMAGE_AUDIT.md documents mbbs-education.jpg');
    assert(auditContent.includes('phd-research.jpg'), 'IMAGE_AUDIT.md documents phd-research.jpg');

  } catch (err) {
    console.error('Test execution failed:', err);
    assert(false, 'Test execution completed without crash', err.message);
  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n=====================================================');
  console.log(`TOTAL CHECKS: ${totalTests}`);
  console.log(`PASSED: ${passedTests}`);
  console.log(`FAILED: ${failedTests}`);
  console.log(`PASS RATE: ${Math.round((passedTests / totalTests) * 100)}%`);
  console.log('=====================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTests();
