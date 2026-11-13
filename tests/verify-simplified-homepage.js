import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\5db0c23b-424d-42d8-acd3-62fb5a754759\\screenshots';
if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const DIST_DIR = path.resolve('dist');
const PORT = 4329;

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

function startServer() {
  const server = http.createServer((req, res) => {
    let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
    if (!path.extname(filePath)) {
      if (fs.existsSync(filePath + '.html')) {
        filePath += '.html';
      } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
        filePath = path.join(filePath, 'index.html');
      }
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const mime = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  return new Promise((resolve) => {
    server.listen(PORT, () => {
      console.log(`Static server running at http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

const VIEWPORTS = [
  { name: 'Mobile Mini', width: 320, height: 568 },
  { name: 'Mobile Standard (iPhone SE)', width: 375, height: 667 },
  { name: 'Mobile Modern (iPhone 12/13/14)', width: 390, height: 844 },
  { name: 'Mobile Large (iPhone Pro Max)', width: 430, height: 932 },
  { name: 'Tablet Portrait (iPad Mini)', width: 768, height: 1024 },
  { name: 'Tablet Landscape (iPad Air)', width: 1024, height: 768 },
  { name: 'Desktop Standard (Laptop)', width: 1366, height: 768 },
  { name: 'Desktop Large (FHD)', width: 1440, height: 900 },
  { name: 'Desktop Ultrawide (1080p+)', width: 1920, height: 1080 },
];

async function run() {
  const server = await startServer();
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  console.log('\n=====================================================');
  console.log('   HOMEPAGE SIMPLIFICATION & RESPONSIVE QA SUITE     ');
  console.log('=====================================================\n');

  let passed = 0;
  let failed = 0;
  function assert(cond, name) {
    if (cond) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name}`);
      failed++;
    }
  }

  try {
    const page = await browser.newPage();
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    console.log('--- TEST GROUP 1: Absence of Removed Homepage Sections ---');
    const bodyText = await page.evaluate(() => document.body.innerText);
    assert(!bodyText.includes('Advising Students & Travelers from Hanumangarh'), 'About Visa Convention heading removed from homepage DOM');
    assert(!bodyText.includes('ABOUT VISA CONVENTION'), 'About Visa Convention badge removed from homepage DOM');
    assert(!bodyText.includes('GLOBAL CONSULTATION DESK'), 'Hero location badge (Global Consultation Desk) completely removed from hero DOM');
    assert(!bodyText.includes('HANUMANGARH, RAJASTHAN • GLOBAL CONSULTATION DESK'), 'Pill-shaped label container completely removed from hero');
    assert(!bodyText.includes('Read More About Our Team & Ethics'), 'Read More link removed from homepage DOM');
    assert(!bodyText.includes('Featured Study Destinations'), 'Featured Study Destinations absent from homepage DOM');

    console.log('\n--- TEST GROUP 2: Service Cards Presence & Navigation Integrity ---');
    const serviceCards = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('#services .card-premium'));
      return cards.map(c => {
        const title = c.querySelector('h3')?.textContent.trim();
        const link = c.querySelector('a')?.getAttribute('href');
        const img = c.querySelector('img')?.getAttribute('src');
        const imgAlt = c.querySelector('img')?.getAttribute('alt');
        return { title, link, img, imgAlt };
      });
    });

    assert(serviceCards.length === 6, `Homepage contains exactly 6 service cards (Actual: ${serviceCards.length})`);
    
    const studyAbroad = serviceCards.find(c => c.title === 'Study Abroad');
    assert(studyAbroad && studyAbroad.link === '/study-abroad/', 'Card 1 (Study Abroad) links directly to /study-abroad/');
    assert(studyAbroad?.img?.includes('Study%20Abroad') || studyAbroad?.img === '/assets/images/services/service-study-visa.jpg', 'Card 1 has distinct study visa asset');

    const mbbsPhd = serviceCards.find(c => c.title === 'MBBS / PhD Abroad');
    assert(mbbsPhd && (mbbsPhd.link === '/services/mbbs/' || mbbsPhd.link?.includes('/services/mbbs/')), 'Card (MBBS / PhD Abroad) links directly to /services/mbbs/');
    assert(mbbsPhd?.img?.includes('MBBS') || mbbsPhd?.img === '/assets/images/mbbs-education.jpg', 'Card has distinct medical education asset');

    const touristVisa = serviceCards.find(c => c.title === 'Tourist Visa');
    assert(touristVisa && touristVisa.link === '/services/tourist-visa/', 'Card (Tourist Visa) links directly to /services/tourist-visa/');
    assert(touristVisa?.img?.includes('Tourist%20Visa') || touristVisa?.img === '/assets/images/services/service-tourist-visa.jpg', 'Card has distinct tourist visa asset');

    const workVisa = serviceCards.find(c => c.title === 'Work Visa');
    assert(workVisa && workVisa.link === '/services/work-visa/', 'Card (Work Visa) links directly to /services/work-visa/');
    assert(workVisa?.img?.includes('Work%20Visa') || workVisa?.img === '/assets/images/services/service-work-visa.jpg', 'Card has distinct work visa asset');

    const flightBooking = serviceCards.find(c => c.title === 'Flight Booking');
    assert(flightBooking && flightBooking.link === '/services/flight-booking/', 'Card (Flight Booking) links directly to /services/flight-booking/');
    assert(flightBooking?.img?.includes('Flight%20Booking') || flightBooking?.img === '/assets/images/flight-hero-aviation.jpg', 'Card has distinct aviation asset');

    const additionalServices = serviceCards.find(c => c.title === 'Additional Services');
    assert(additionalServices && additionalServices.link === '/services/additional-services/', 'Card 2 (Additional Services) links directly to /services/additional-services/');
    assert(additionalServices?.img?.includes('Additional%20Visa%20Services%20Guide.png'), 'Card 2 has approved Additional Visa Services Guide client poster image');

    // Check all 6 images are unique
    const uniqueImages = new Set(serviceCards.map(c => c.img));
    assert(uniqueImages.size === 6, `All 6 service card images are strictly unique (Unique count: ${uniqueImages.size})`);

    console.log('\n--- TEST GROUP 3: Excised How It Works Process Section ---');
    const hasProcess = await page.evaluate(() => {
      const html = document.body.innerHTML;
      return html.includes('Three-Step Guidance Process') || (html.includes('How It Works') && html.includes('Our Consultation Process'));
    });
    assert(!hasProcess, 'Phase 4: How It Works process section is completely excised from Homepage');
    const hasDisclaimer = bodyText.includes('Visa issuance decisions remain the sole prerogative') ||
                          bodyText.includes('Visa decisions are made by the relevant government authorities');
    assert(hasDisclaimer, 'Homepage displays mandatory non-guarantee statutory disclaimer in reviews section notice');

    console.log('\n--- TEST GROUP 4: Verification of Removed Final Consultation Section (Change 1) ---');
    const ctaBannerPresent = await page.evaluate(() => {
      const h2s = Array.from(document.querySelectorAll('h2')).map(h => h.innerText.trim());
      const hasPlanHeading = h2s.some(t => t.includes('Ready to Plan Your Next Step?'));
      const hasPersonalizedBadge = document.body.innerText.includes('PERSONALIZED GUIDANCE');
      const consultationSection = document.querySelector('section.bg-brand-navy:has(a[href="/contact/"])');
      return Boolean(hasPlanHeading || hasPersonalizedBadge || consultationSection);
    });

    assert(!ctaBannerPresent, 'Change 1: Final Consultation section banner is completely excised from Homepage');

    const reviewsPrecedesFooter = await page.evaluate(() => {
      const reviews = document.getElementById('reviews-section');
      const footer = document.querySelector('footer');
      if (!reviews || !footer) return false;
      // footer should come after reviews
      return reviews.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING;
    });
    assert(Boolean(reviewsPrecedesFooter), 'Reviews section transitions cleanly into footer without extra banners');

    console.log('\n--- TEST GROUP 5: Navigation, Consultation & Trust Signals ---');
    const headerCta = await page.$('header a[href="/contact/"]');
    assert(headerCta !== null, 'Header contains functional Request Consultation button to /contact/');

    const whatsappWidget = await page.$('#whatsapp-chat-button, a[href*="whatsapp.com"], a[href*="wa.me"]');
    assert(whatsappWidget !== null, 'Floating WhatsApp channel accessible on homepage');

    const footerHasHours = await page.evaluate(() => {
      const footer = document.querySelector('footer');
      return footer ? footer.innerText.includes('Monday – Saturday: 9:30 AM – 6:30 PM IST') : false;
    });
    assert(footerHasHours, 'Footer contains compact business hours (Monday – Saturday: 9:30 AM – 6:30 PM IST)');

    const footerHasAddress = await page.evaluate(() => {
      const footer = document.querySelector('footer');
      return footer ? footer.innerText.includes('Hanumangarh, Rajasthan 335512') : false;
    });
    assert(footerHasAddress, 'Footer contains verified Hanumangarh physical address');

    console.log('\n--- TEST GROUP 5: Responsive Overflow Check Across 9 Viewports ---');
    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
      await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
      
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      assert(!overflow, `${vp.name} (${vp.width}px): Zero horizontal overflow`);
    }

    console.log('\n--- Capturing Evidence Screenshots ---');
    // Desktop 1366px
    await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 1 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    const desktopImgPath = path.join(ARTIFACTS_DIR, 'homepage-simplified-desktop-1366px.png');
    await page.screenshot({ path: desktopImgPath, fullPage: true });
    console.log(`Saved desktop screenshot: ${desktopImgPath}`);

    // Mobile 390px
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    const mobileImgPath = path.join(ARTIFACTS_DIR, 'homepage-simplified-mobile-390px.png');
    await page.screenshot({ path: mobileImgPath, fullPage: true });
    console.log(`Saved mobile screenshot: ${mobileImgPath}`);

    // Tablet 768px
    await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 1 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    const tabletImgPath = path.join(ARTIFACTS_DIR, 'homepage-simplified-tablet-768px.png');
    await page.screenshot({ path: tabletImgPath, fullPage: true });
    console.log(`Saved tablet screenshot: ${tabletImgPath}`);

    // Small Mobile 320px
    await page.setViewport({ width: 320, height: 568, deviceScaleFactor: 2 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    const smallMobileImgPath = path.join(ARTIFACTS_DIR, 'homepage-simplified-mobile-320px.png');
    await page.screenshot({ path: smallMobileImgPath, fullPage: true });
    console.log(`Saved small mobile screenshot: ${smallMobileImgPath}`);

    console.log(`\n=====================================================`);
    console.log(`TOTAL TESTS : ${passed + failed}`);
    console.log(`PASSED      : ${passed}`);
    console.log(`FAILED      : ${failed}`);
    console.log(`=====================================================\n`);

  } finally {
    await browser.close();
    server.close();
  }
}

run().catch(console.error);
