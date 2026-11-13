import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\5db0c23b-424d-42d8-acd3-62fb5a754759\\screenshots';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const DIST_DIR = path.resolve('dist');
const DOWNLOADS_DIR = 'C:\\Users\\ACER\\Downloads';
const PORT = 4337;

console.log('================================================================');
console.log('   VISA CONVENTION - CLIENT APPROVED IMAGES VERIFICATION QA    ');
console.log('================================================================\n');

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

function getFileHash(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex').toUpperCase();
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let cleanUrl = decodeURIComponent(req.url.split('?')[0]);
      if (cleanUrl.endsWith('/')) cleanUrl += 'index.html';
      const filePath = path.join(DIST_DIR, cleanUrl);

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        res.end(fs.readFileSync(filePath));
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    });

    server.listen(PORT, () => resolve(server));
  });
}

const CLIENT_IMAGES = [
  {
    name: 'Study Abroad_ Your Global Future.png',
    service: 'Study Abroad / Study Visa',
    pageUrl: '/services/study-visa/',
    expectedWidth: 1672,
    expectedHeight: 941,
  },
  {
    name: 'Vibrant Tourist Visa Travel Poster.png',
    service: 'Tourist Visa',
    pageUrl: '/services/tourist-visa/',
    expectedWidth: 1672,
    expectedHeight: 941,
  },
  {
    name: 'Global Work Visa Opportunities.png',
    service: 'Work Visa',
    pageUrl: '/services/work-visa/',
    expectedWidth: 1672,
    expectedHeight: 941,
  },
  {
    name: 'MBBS & PhD Courses Abroad.png',
    service: 'MBBS Abroad',
    pageUrl: '/services/mbbs/',
    expectedWidth: 1671,
    expectedHeight: 941,
  },
  {
    name: 'Flight Booking and Dummy Tickets.png',
    service: 'Flight Booking',
    pageUrl: '/services/flight-booking/',
    expectedWidth: 1672,
    expectedHeight: 941,
  },
  {
    name: 'Additional Visa Services Guide.png',
    service: 'Additional Services',
    pageUrl: '/services/additional-services/',
    expectedWidth: 1672,
    expectedHeight: 941,
  },
];

async function runTests() {
  // ----------------------------------------------------
  // TEST GROUP 1: FILE SYSTEM EXISTENCE & BIT-FOR-BIT SHA-256 INTEGRITY
  // ----------------------------------------------------
  console.log('--- 1. VERIFYING SOURCE FILES & BIT-FOR-BIT SHA256 INTEGRITY ---');
  for (const item of CLIENT_IMAGES) {
    const srcPath = path.join(DOWNLOADS_DIR, item.name);
    const pubPath = path.resolve('public/assets/images/services', item.name);
    const distPath = path.resolve('dist/assets/images/services', item.name);

    assert(fs.existsSync(srcPath), `Source exists in Downloads: "${item.name}"`);
    assert(fs.existsSync(pubPath), `Copied to public/assets/images/services: "${item.name}"`);
    assert(fs.existsSync(distPath), `Built into dist/assets/images/services: "${item.name}"`);

    const srcHash = getFileHash(srcPath);
    const pubHash = getFileHash(pubPath);
    const distHash = getFileHash(distPath);

    assert(srcHash === pubHash, `Public copy SHA-256 matches source bit-for-bit (${item.name})`);
    assert(srcHash === distHash, `Dist copy SHA-256 matches source bit-for-bit (${item.name})`);
  }

  // ----------------------------------------------------
  // TEST GROUP 2: BROWSER RENDERING ON DESKTOP & MOBILE
  // ----------------------------------------------------
  const server = await startServer();
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // 2.1 Verify Homepage Service Discovery Cards
    console.log('\n--- 2. VERIFYING HOMEPAGE SERVICE CARDS DISPLAY ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    const cardImages = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('.card-premium img'));
      return imgs.map(img => ({
        src: img.getAttribute('src'),
        currentSrc: img.currentSrc,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        renderedWidth: img.clientWidth,
        renderedHeight: img.clientHeight,
        complete: img.complete,
      }));
    });

    assert(cardImages.length >= 6, `Homepage has 6 service cards with images (Found: ${cardImages.length})`);

    for (const img of cardImages) {
      assert(img.complete && img.naturalWidth > 0, `Image loaded successfully in DOM: ${img.src} (${img.naturalWidth}x${img.naturalHeight})`);
      assert(!img.src.includes('C:\\') && !img.src.includes('file://'), `Image src uses clean web-relative path (not absolute local): ${img.src}`);
    }

    // 2.2 Verify Individual Service Pages on Desktop & Mobile
    console.log('\n--- 3. VERIFYING SERVICE PAGES HERO IMAGES (DESKTOP & MOBILE) ---');

    for (const item of CLIENT_IMAGES) {
      // Desktop Check (1440px)
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto(`http://localhost:${PORT}${item.pageUrl}`, { waitUntil: 'networkidle0' });

      const desktopImg = await page.evaluate((expectedName) => {
        const imgs = Array.from(document.querySelectorAll('img'));
        const cleanName = expectedName.replace(/&/g, '').replace(/_/g, '').split(' ')[0];
        const img = imgs.find(i => {
          const s = i.getAttribute('src') || '';
          return s.includes(cleanName) || s.includes(expectedName);
        });
        if (!img) return null;
        return {
          src: img.getAttribute('src'),
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          complete: img.complete,
          aspectRatio: (img.naturalWidth / img.naturalHeight).toFixed(3),
        };
      }, item.name);

      assert(desktopImg !== null, `${item.service} displays approved client image on Desktop (${item.name})`);
      if (desktopImg) {
        assert(desktopImg.complete && desktopImg.naturalWidth > 0, `${item.service} image loaded with natural dimensions: ${desktopImg.naturalWidth}x${desktopImg.naturalHeight}`);
        assert(desktopImg.naturalWidth === item.expectedWidth, `${item.service} image width matches original ${item.expectedWidth}px`);
        assert(desktopImg.naturalHeight === item.expectedHeight, `${item.service} image height matches original ${item.expectedHeight}px`);
      }

      // Mobile Check (375px)
      await page.setViewport({ width: 375, height: 667 });
      await page.goto(`http://localhost:${PORT}${item.pageUrl}`, { waitUntil: 'networkidle0' });

      const mobileImg = await page.evaluate((expectedName) => {
        const imgs = Array.from(document.querySelectorAll('img'));
        const cleanName = expectedName.replace(/&/g, '').replace(/_/g, '').split(' ')[0];
        const img = imgs.find(i => {
          const s = i.getAttribute('src') || '';
          return s.includes(cleanName) || s.includes(expectedName);
        });
        if (!img) return null;
        const rect = img.getBoundingClientRect();
        const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth;
        return {
          visible: rect.width > 0 && rect.height > 0,
          renderedWidth: Math.round(rect.width),
          renderedHeight: Math.round(rect.height),
          hasHorizontalOverflow: overflow,
        };
      }, item.name);

      assert(mobileImg !== null && mobileImg.visible, `${item.service} image renders responsively on 375px mobile (${mobileImg?.renderedWidth}x${mobileImg?.renderedHeight}px)`);
      assert(mobileImg && !mobileImg.hasHorizontalOverflow, `${item.service} mobile layout has zero horizontal overflow with client image`);
    }

    // 2.3 Verify Main Services Directory (/services/)
    console.log('\n--- 4. VERIFYING MAIN SERVICES DIRECTORY (/services/) ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/services/`, { waitUntil: 'networkidle0' });

    // Scroll to bottom to trigger lazy loading of cards
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 300;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    // Wait a brief moment for images to paint
    await new Promise(r => setTimeout(r, 600));

    const directoryImages = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('#all-services img'));
      return imgs.map(img => ({
        src: img.getAttribute('src'),
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        complete: img.complete,
      }));
    });

    assert(directoryImages.length >= 6, `/services/ directory features all approved client service visuals (Found: ${directoryImages.length})`);
    for (const dImg of directoryImages) {
      assert(dImg.complete && dImg.naturalWidth > 0, `Directory image loaded: ${dImg.src}`);
    }

    // ----------------------------------------------------
    // TEST GROUP 5: CAPTURE SCREENSHOTS FOR ARTIFACT REVIEW
    // ----------------------------------------------------
    console.log('\n--- 5. CAPTURING VERIFICATION SCREENSHOTS ---');
    if (!fs.existsSync(ARTIFACTS_DIR)) {
      fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
    }

    // Homepage cards screenshot
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/#services`, { waitUntil: 'networkidle0' });
    const homepageServicesPath = path.join(ARTIFACTS_DIR, 'client-images-homepage-desktop.png');
    await page.screenshot({ path: homepageServicesPath, fullPage: false });
    console.log(`  📸 Captured: client-images-homepage-desktop.png`);

    // Homepage mobile cards screenshot
    await page.setViewport({ width: 375, height: 812 });
    await page.goto(`http://localhost:${PORT}/#services`, { waitUntil: 'networkidle0' });
    const homepageMobileServicesPath = path.join(ARTIFACTS_DIR, 'client-images-homepage-mobile.png');
    await page.screenshot({ path: homepageMobileServicesPath, fullPage: false });
    console.log(`  📸 Captured: client-images-homepage-mobile.png`);

    // Individual service heroes screenshots
    const serviceScreenshots = [
      { url: '/services/study-visa/', file: 'client-image-study-visa.png' },
      { url: '/services/tourist-visa/', file: 'client-image-tourist-visa.png' },
      { url: '/services/work-visa/', file: 'client-image-work-visa.png' },
      { url: '/services/flight-booking/', file: 'client-image-flight-booking.png' },
      { url: '/services/mbbs/', file: 'client-image-mbbs.png' },
      { url: '/services/additional-services/', file: 'client-image-additional-services.png' },
    ];

    for (const s of serviceScreenshots) {
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto(`http://localhost:${PORT}${s.url}`, { waitUntil: 'networkidle0' });
      const snapPath = path.join(ARTIFACTS_DIR, s.file);
      await page.screenshot({ path: snapPath, fullPage: false });
      console.log(`  📸 Captured: ${s.file}`);
    }

  } catch (err) {
    console.error('Test execution failed:', err);
    assert(false, 'Puppeteer execution error', err.message);
  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n================================================================');
  console.log(`TOTAL CHECKS: ${totalTests}`);
  console.log(`PASSED: ${passedTests}`);
  console.log(`FAILED: ${failedTests}`);
  console.log(`PASS RATE: ${Math.round((passedTests / totalTests) * 100)}%`);
  console.log('================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTests();
