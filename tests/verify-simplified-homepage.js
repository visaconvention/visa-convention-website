import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\7ca130ef-5e70-4578-88a2-0879acc42caa';
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
    assert(!bodyText.includes('Read More About Our Team & Ethics'), 'Read More link removed from homepage DOM');
    assert(!bodyText.includes('Featured Study Destinations'), 'Featured Study Destinations absent from homepage DOM');
    assert(!bodyText.includes('Ready to Plan Your Next Step?'), 'Redundant promotional CTA banner removed from homepage DOM');

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
    assert(studyAbroad?.img === '/assets/images/services/service-study-visa.jpg', 'Card 1 has distinct study visa photograph');

    const mbbsPhd = serviceCards.find(c => c.title === 'MBBS / PhD Abroad');
    assert(mbbsPhd && mbbsPhd.link === '/services/mbbs/', 'Card 2 (MBBS / PhD Abroad) links directly to /services/mbbs/');
    assert(mbbsPhd?.img === '/assets/images/mbbs-education.jpg', 'Card 2 has distinct medical education photograph');

    const touristVisa = serviceCards.find(c => c.title === 'Tourist Visa');
    assert(touristVisa && touristVisa.link === '/services/tourist-visa/', 'Card 3 (Tourist Visa) links directly to /services/tourist-visa/');
    assert(touristVisa?.img === '/assets/images/services/service-tourist-visa.jpg', 'Card 3 has distinct tourist visa photograph');

    const workVisa = serviceCards.find(c => c.title === 'Work Visa');
    assert(workVisa && workVisa.link === '/services/work-visa/', 'Card 4 (Work Visa) links directly to /services/work-visa/');
    assert(workVisa?.img === '/assets/images/services/service-work-visa.jpg', 'Card 4 has distinct work visa photograph');

    const flightBooking = serviceCards.find(c => c.title === 'Flight Booking');
    assert(flightBooking && flightBooking.link === '/services/flight-booking/', 'Card 5 (Flight Booking) links directly to /services/flight-booking/');
    assert(flightBooking?.img === '/assets/images/flight-hero-aviation.jpg', 'Card 5 has distinct aviation photograph');

    const findUniversities = serviceCards.find(c => c.title === 'Find Universities');
    assert(findUniversities && findUniversities.link === '/universities/', 'Card 6 (Find Universities) links directly to /universities/');
    assert(findUniversities?.img === '/assets/images/services/service-universities.jpg', 'Card 6 has distinct university campus architecture photograph');

    // Check all 6 images are unique
    const uniqueImages = new Set(serviceCards.map(c => c.img));
    assert(uniqueImages.size === 6, `All 6 service card images are strictly unique (Unique count: ${uniqueImages.size})`);

    console.log('\n--- TEST GROUP 3: Compact Three-Step Process & Disclosures ---');
    const hasProcess = await page.evaluate(() => {
      const html = document.body.innerHTML;
      return html.includes('How It Works') && html.includes('Our Consultation Process');
    });
    assert(hasProcess, 'Homepage includes compact How It Works process section');
    const hasDisclaimer = bodyText.includes('Visa issuance decisions remain under the sole prerogative of sovereign embassies and consulates');
    assert(hasDisclaimer, 'Homepage displays mandatory non-guarantee statutory disclaimer');

    console.log('\n--- TEST GROUP 4: Navigation, Consultation & Trust Signals ---');
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
