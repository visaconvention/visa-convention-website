import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\5db0c23b-424d-42d8-acd3-62fb5a754759\\screenshots';
const PORT = 4349;

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

const EXPECTED_CARDS = [
  {
    index: 0,
    title: 'Study Abroad',
    expectedRowDesktop: 1,
    expectedColDesktop: 1,
    imgName: 'Study Abroad_ Your Global Future.png',
    link: '/study-abroad/',
    desc: 'Undergraduate & postgraduate admissions across 35+ countries with guidance on transcripts, intakes, and student visa files.',
  },
  {
    index: 1,
    title: 'MBBS / PhD Abroad',
    expectedRowDesktop: 1,
    expectedColDesktop: 2,
    imgName: 'MBBS & PhD Courses Abroad.png',
    links: ['/services/mbbs/', '/services/phd/'],
    desc: 'Recognized medical faculties in Europe & Central Asia, alongside doctoral research proposals and supervisor outreach.',
  },
  {
    index: 2,
    title: 'Work Visa',
    expectedRowDesktop: 1,
    expectedColDesktop: 3,
    imgName: 'Global Work Visa Opportunities.png',
    link: '/services/work-visa/',
    desc: 'Administrative documentation compliance and contract vetting for 14 destinations across Europe, the Gulf, and Asia-Pacific.',
  },
  {
    index: 3,
    title: 'Tourist Visa',
    expectedRowDesktop: 2,
    expectedColDesktop: 1,
    imgName: 'Vibrant Tourist Visa Travel Poster.png',
    link: '/services/tourist-visa/',
    desc: 'Consular file compilation across 27 destinations, tailored documentation by applicant profile, and legitimate booking holds.',
  },
  {
    index: 4,
    title: 'Flight Booking',
    expectedRowDesktop: 2,
    expectedColDesktop: 2,
    imgName: 'Flight Booking and Dummy Tickets.png',
    link: '/services/flight-booking/',
    desc: 'Genuine GDS airline hold itineraries for visa dossiers, 40kg–46kg student baggage fares, and confirmed e-tickets.',
  },
  {
    index: 5,
    title: 'Additional Services',
    expectedRowDesktop: 2,
    expectedColDesktop: 3,
    imgName: 'Additional Visa Services Guide.png',
    link: '/services/additional-services/',
    desc: 'Passport applications, document attestation, PCC, translations, and other documentation assistance.',
  },
];

const VIEWPORTS = [
  { name: 'Mobile-320px', width: 320, height: 600, isMobile: true },
  { name: 'Mobile-360px', width: 360, height: 740, isMobile: true },
  { name: 'Mobile-390px', width: 390, height: 844, isMobile: true },
  { name: 'Mobile-430px', width: 430, height: 932, isMobile: true },
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
  console.log('   VISA CONVENTION — HOMEPAGE SERVICE CARDS REARRANGEMENT QA    ');
  console.log('================================================================\n');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // 1. DOM ORDER AND CONTENT INTEGRITY
    console.log('--- 1. VERIFYING COMPONENT ARRAY ORDER & DATA INTEGRITY ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    const cardsData = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('#services .card-premium'));
      return cards.map(c => {
        const title = c.querySelector('h3')?.textContent.trim();
        const desc = c.querySelector('p')?.textContent.trim();
        const img = c.querySelector('img')?.getAttribute('src');
        const imgAlt = c.querySelector('img')?.getAttribute('alt');
        const links = Array.from(c.querySelectorAll('a')).map(a => ({
          text: a.textContent.trim(),
          href: a.getAttribute('href'),
        }));
        const rect = c.getBoundingClientRect();
        return {
          title,
          desc,
          img,
          imgAlt,
          links,
          rect: {
            top: Math.round(rect.top),
            left: Math.round(rect.left),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          },
        };
      });
    });

    assert(cardsData.length === 6, `Homepage has exactly 6 service cards in DOM (Found: ${cardsData.length})`);

    for (let i = 0; i < EXPECTED_CARDS.length; i++) {
      const exp = EXPECTED_CARDS[i];
      const actual = cardsData[i];

      assert(actual.title.includes(exp.title.split(' ')[0]), `Card ${i + 1} title matches '${exp.title}' (Actual: '${actual.title}')`);
      assert(actual.desc === exp.desc, `Card ${i + 1} description matches original exact copy`);
      const encodedImg = encodeURIComponent(exp.imgName).replace(/%20/g, '%20');
      assert(actual.img.includes(encodeURIComponent(exp.imgName).replace(/%2F/g, '/')) || actual.img.includes(exp.imgName.split(' ')[0]), `Card ${i + 1} retains original image (${exp.imgName})`);
      
      if (exp.link) {
        assert(actual.links.some(l => l.href === exp.link), `Card ${i + 1} CTA links to ${exp.link}`);
      }
      if (exp.links) {
        for (const lk of exp.links) {
          assert(actual.links.some(l => l.href === lk), `Card ${i + 1} contains sub-service link to ${lk}`);
        }
      }
    }

    // 2. DESKTOP 3x2 GRID GEOMETRY (1440px & 1366px)
    console.log('\n--- 2. VERIFYING DESKTOP 3x2 GRID GEOMETRY (1440px & 1366px) ---');
    for (const dW of [1440, 1366]) {
      await page.setViewport({ width: dW, height: 900 });
      await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

      const geometry = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('#services .card-premium'));
        return cards.map(c => {
          const r = c.getBoundingClientRect();
          return { top: Math.round(r.top), left: Math.round(r.left), width: Math.round(r.width), height: Math.round(r.height) };
        });
      });

      // Row 1: Cards 0 (Study Abroad), 1 (MBBS & PhD), 2 (Work Visa)
      const row1Tops = [geometry[0].top, geometry[1].top, geometry[2].top];
      const maxRow1Diff = Math.max(...row1Tops) - Math.min(...row1Tops);
      assert(maxRow1Diff <= 2, `Desktop ${dW}px Row 1 cards share aligned top coordinate (Study Abroad, MBBS & PhD, Work Visa)`);
      assert(geometry[0].left < geometry[1].left && geometry[1].left < geometry[2].left,
        `Desktop ${dW}px Row 1 horizontal order is Left: Study Abroad, Middle: MBBS & PhD, Right: Work Visa`);

      // Row 2: Cards 3 (Tourist Visa), 4 (Flight Booking), 5 (Additional Services)
      const row2Tops = [geometry[3].top, geometry[4].top, geometry[5].top];
      const maxRow2Diff = Math.max(...row2Tops) - Math.min(...row2Tops);
      assert(maxRow2Diff <= 2, `Desktop ${dW}px Row 2 cards share aligned top coordinate (Tourist Visa, Flight Booking, Additional Services)`);
      assert(geometry[3].left < geometry[4].left && geometry[4].left < geometry[5].left,
        `Desktop ${dW}px Row 2 horizontal order is Left: Tourist Visa, Middle: Flight Booking, Right: Additional Services`);

      // Column vertical alignments
      assert(Math.abs(geometry[0].left - geometry[3].left) <= 2, `Desktop ${dW}px Column 1 aligned: Study Abroad (top) and Tourist Visa (bottom)`);
      assert(Math.abs(geometry[1].left - geometry[4].left) <= 2, `Desktop ${dW}px Column 2 aligned: MBBS & PhD (top) and Flight Booking (bottom)`);
      assert(Math.abs(geometry[2].left - geometry[5].left) <= 2, `Desktop ${dW}px Column 3 aligned: Work Visa (top) and Additional Services (bottom)`);
      assert(geometry[3].top > geometry[0].top, `Desktop ${dW}px Row 2 is positioned below Row 1`);
    }

    // 3. RESPONSIVE VIEWPORTS & MOBILE READING ORDER
    console.log('\n--- 3. TESTING ALL 8 VIEWPORTS FOR OVERFLOW & READING ORDER ---');
    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.isMobile });
      await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

      const check = await page.evaluate(() => {
        const scrollW = document.documentElement.scrollWidth;
        const clientW = document.documentElement.clientWidth;
        const cards = Array.from(document.querySelectorAll('#services .card-premium'));
        const order = cards.map(c => c.querySelector('h3')?.textContent.trim());
        const tops = cards.map(c => Math.round(c.getBoundingClientRect().top));
        return { scrollW, clientW, hasOverflow: scrollW > clientW + 1, order, tops };
      });

      assert(!check.hasOverflow, `${vp.name} (${vp.width}px): Zero horizontal overflow (${check.scrollW}px vs ${check.clientW}px)`);

      // Check mobile 1-column strictly stacked vertically in order
      if (vp.isMobile) {
        let strictlyVertical = true;
        for (let j = 0; j < check.tops.length - 1; j++) {
          if (check.tops[j] >= check.tops[j + 1]) {
            strictlyVertical = false;
            break;
          }
        }
        assert(strictlyVertical, `${vp.name}: Mobile cards stacked in 1 column in logical reading order`);
      }
    }

    // 4. SCREENSHOT CAPTURES FOR ARTIFACTS
    console.log('\n--- 4. CAPTURING VISUAL VERIFICATION SCREENSHOTS ---');
    
    // Desktop 1440px 3x2 Grid
    await page.setViewport({ width: 1440, height: 1100 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.getElementById('services')?.scrollIntoView({ block: 'center' }));
    await new Promise(r => setTimeout(r, 500));
    const ssDesktop = path.join(ARTIFACTS_DIR, 'rearranged-services-desktop-1440px.png');
    await page.screenshot({ path: ssDesktop });
    console.log(`  📸 Captured: rearranged-services-desktop-1440px.png`);

    // Tablet 768px 2-column Grid
    await page.setViewport({ width: 768, height: 1200 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.getElementById('services')?.scrollIntoView({ block: 'start' }));
    await new Promise(r => setTimeout(r, 500));
    const ssTablet = path.join(ARTIFACTS_DIR, 'rearranged-services-tablet-768px.png');
    await page.screenshot({ path: ssTablet });
    console.log(`  📸 Captured: rearranged-services-tablet-768px.png`);

    // Mobile 390px 1-column Stack
    await page.setViewport({ width: 390, height: 1400, isMobile: true, hasTouch: true });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.getElementById('services')?.scrollIntoView({ block: 'start' }));
    await new Promise(r => setTimeout(r, 500));
    const ssMobile390 = path.join(ARTIFACTS_DIR, 'rearranged-services-mobile-390px.png');
    await page.screenshot({ path: ssMobile390 });
    console.log(`  📸 Captured: rearranged-services-mobile-390px.png`);

    // Mobile 320px
    await page.setViewport({ width: 320, height: 1200, isMobile: true, hasTouch: true });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.getElementById('services')?.scrollIntoView({ block: 'start' }));
    await new Promise(r => setTimeout(r, 500));
    const ssMobile320 = path.join(ARTIFACTS_DIR, 'rearranged-services-mobile-320px.png');
    await page.screenshot({ path: ssMobile320 });
    console.log(`  📸 Captured: rearranged-services-mobile-320px.png`);

    console.log('\n================================================================');
    console.log(`TOTAL CHECKS : ${totalTests}`);
    console.log(`PASSED       : ${passedTests}`);
    console.log(`FAILED       : ${failedTests}`);
    console.log(`PASS RATE    : ${Math.round((passedTests / totalTests) * 100)}%`);
    console.log('================================================================\n');

    await browser.close();
  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    server.close();
  }
});
