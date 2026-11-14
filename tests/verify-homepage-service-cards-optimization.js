import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\93dd9ae5-292a-4677-9731-9efc41a7f30f\\evidence';
const PORT = 4358;

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
    console.log(`  ✅ PASS: ${checkName}`);
    passedChecks++;
  } else {
    console.error(`  ❌ FAIL: ${checkName} ${details ? '- ' + details : ''}`);
    failedChecks++;
    failureDetails.push({ checkName, details });
  }
}

const EXPECTED_SERVICES = [
  {
    index: 0,
    service: 'Study Abroad',
    fileName: 'Study Abroad_ Your Global Future.png',
    badgeText: 'HIGHER EDUCATION',
    primaryRoute: '/study-abroad/',
  },
  {
    index: 1,
    service: 'MBBS / PhD Abroad',
    fileName: 'MBBS & PhD Courses Abroad.png',
    badgeText: 'MEDICAL & DOCTORAL',
    primaryRoute: '/services/mbbs/',
    subRoutes: {
      mbbs: '/services/mbbs/',
      phd: '/services/phd/',
    },
  },
  {
    index: 2,
    service: 'Work Visa',
    fileName: 'Global Work Visa Opportunities.png',
    badgeText: 'ADMINISTRATIVE COMPLIANCE',
    primaryRoute: '/services/work-visa/',
  },
  {
    index: 3,
    service: 'Tourist Visa',
    fileName: 'Vibrant Tourist Visa Travel Poster.png',
    badgeText: 'VISITOR VISAS',
    primaryRoute: '/services/tourist-visa/',
  },
  {
    index: 4,
    service: 'Flight Booking',
    fileName: 'Flight Booking and Dummy Tickets.png',
    badgeText: 'AVIATION DESK',
    primaryRoute: '/services/flight-booking/',
  },
  {
    index: 5,
    service: 'Additional Services',
    fileName: 'Additional Visa Services Guide.png',
    badgeText: 'DOCUMENTATION SUPPORT',
    primaryRoute: '/services/additional-services/',
  },
];

const VIEWPORTS = [
  { name: 'Mobile-320px', width: 320, height: 640 },
  { name: 'Mobile-360px', width: 360, height: 740 },
  { name: 'Mobile-390px', width: 390, height: 844 },
  { name: 'Mobile-430px', width: 430, height: 932 },
  { name: 'Tablet-768px', width: 768, height: 1024 },
  { name: 'Tablet-1024px', width: 1024, height: 768 },
  { name: 'Desktop-1366px', width: 1366, height: 768 },
  { name: 'Desktop-1440px', width: 1440, height: 900 },
];

async function runQA() {
  console.log('================================================================');
  console.log('  VISA CONVENTION — HOMEPAGE SERVICE CARDS OPTIMIZATION QA     ');
  console.log('================================================================\n');

  // STEP 1: Verify Assets on Disk
  console.log('--- 1. VERIFYING CLIENT IMAGE ASSETS ON DISK ---');
  for (const item of EXPECTED_SERVICES) {
    const publicPath = path.join(process.cwd(), 'public', 'assets', 'images', 'services', item.fileName);
    const distPath = path.join(DIST, 'assets', 'images', 'services', item.fileName);
    assert(fs.existsSync(publicPath), `Public asset exists for ${item.service} (${item.fileName})`);
    assert(fs.existsSync(distPath), `Dist built asset exists for ${item.service} (${item.fileName})`);
  }

  // STEP 2: Start server and launch browser
  await new Promise((resolve) => server.listen(PORT, resolve));
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  try {
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    console.log('\n--- 2. VERIFYING BADGE REMOVAL & HTML SEMANTICS ---');
    const cardsData = await page.evaluate((expectedServices) => {
      const cards = Array.from(document.querySelectorAll('section#services .grid > div'));
      
      return {
        count: cards.length,
        cards: cards.map((c, idx) => {
          const img = c.querySelector('img');
          const title = c.querySelector('h3')?.innerText?.trim() || '';
          const p = c.querySelector('p')?.innerText?.trim() || '';
          const links = Array.from(c.querySelectorAll('a')).map((a) => ({
            href: a.getAttribute('href'),
            text: a.innerText.trim(),
            className: a.className,
          }));
          const nestedAnchors = Array.from(c.querySelectorAll('a a')).length;
          const imgStyle = img ? window.getComputedStyle(img).objectFit : '';
          const cardCursor = window.getComputedStyle(c).cursor;

          // Check for overlay badges over image or top of card
          const imgParent = img ? img.parentElement : null;
          const overlayElements = imgParent ? Array.from(imgParent.querySelectorAll('span, div')).filter(el => el !== img) : [];
          
          // Check if any badge text exists in card's badge-like elements
          const badgeTexts = expectedServices.map(s => s.badgeText);
          const foundBadges = Array.from(c.querySelectorAll('span, div')).filter(el => {
            const txt = el.innerText?.trim()?.toUpperCase();
            return badgeTexts.includes(txt);
          }).map(el => el.innerText.trim());

          return {
            idx,
            title,
            imgSrc: img ? img.getAttribute('src') : '',
            imgAlt: img ? img.getAttribute('alt') : '',
            imgStyle,
            desc: p,
            links,
            nestedAnchors,
            cardCursor,
            overlayElementsCount: overlayElements.length,
            foundBadges,
          };
        }),
      };
    }, EXPECTED_SERVICES);

    assert(cardsData.count === 6, 'Homepage has exactly 6 service cards in DOM', `Found: ${cardsData.count}`);

    for (let i = 0; i < EXPECTED_SERVICES.length; i++) {
      const exp = EXPECTED_SERVICES[i];
      const actual = cardsData.cards[i];
      assert(actual.title.includes(exp.service.split(' ')[0]), `Card ${i + 1} title matches '${exp.service}' (Actual: '${actual.title}')`);
      
      const decodedSrc = decodeURIComponent(actual.imgSrc);
      assert(decodedSrc.includes(exp.fileName), `Card ${i + 1} uses exact client image '${exp.fileName}' (Actual: '${actual.imgSrc}')`);
      assert(actual.imgStyle === 'contain', `Card ${i + 1} image applies object-fit: contain (Actual: '${actual.imgStyle}')`);
      assert(actual.nestedAnchors === 0, `Card ${i + 1} has zero nested anchors in DOM`);
      assert(actual.cardCursor === 'pointer', `Card ${i + 1} has cursor: pointer across its surface`);
      assert(actual.foundBadges.length === 0, `Card ${i + 1} has no category badge overlays (Forbidden badge '${exp.badgeText}' absent)`);
      assert(actual.overlayElementsCount === 0, `Card ${i + 1} image container has zero badge overlay sibling elements`);
    }

    console.log('\n--- 3. TESTING FULL CARD CLICKABILITY & STRETCHED LINK COVERAGE ---');

    for (let i = 0; i < EXPECTED_SERVICES.length; i++) {
      const exp = EXPECTED_SERVICES[i];
      const cardSelector = `section#services .grid > div:nth-child(${i + 1})`;

      // Test click on upper card area (Image)
      const imageClickTarget = await page.evaluate((sel) => {
        const card = document.querySelector(sel);
        card.scrollIntoView({ block: 'center', inline: 'nearest' });
        const rect = card.getBoundingClientRect();
        // Point in upper image area
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height * 0.25;
        const el = document.elementFromPoint(x, y);
        const link = el?.closest('a') || el;
        return {
          href: link?.getAttribute('href') || link?.closest('a')?.getAttribute('href'),
          tagName: el?.tagName,
        };
      }, cardSelector);

      assert(imageClickTarget.href === exp.primaryRoute, `Card ${i + 1} (${exp.service}) image area clicks through to ${exp.primaryRoute} (Actual: ${imageClickTarget.href})`);

      // Test click on description/content area
      const descClickTarget = await page.evaluate((sel) => {
        const card = document.querySelector(sel);
        card.scrollIntoView({ block: 'center', inline: 'nearest' });
        const rect = card.getBoundingClientRect();
        // Point in description body
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height * 0.55;
        const el = document.elementFromPoint(x, y);
        const link = el?.closest('a') || el;
        return {
          href: link?.getAttribute('href') || link?.closest('a')?.getAttribute('href'),
          tagName: el?.tagName,
        };
      }, cardSelector);

      assert(descClickTarget.href === exp.primaryRoute, `Card ${i + 1} (${exp.service}) description area clicks through to ${exp.primaryRoute} (Actual: ${descClickTarget.href})`);

      // Special check for Card 2 (MBBS / PhD Abroad) sub-links
      if (exp.subRoutes) {
        // Test MBBS sub-link click
        const mbbsSubTarget = await page.evaluate((sel) => {
          const card = document.querySelector(sel);
          card.scrollIntoView({ block: 'center', inline: 'nearest' });
          const link = Array.from(card.querySelectorAll('a')).find(a => a.innerText.trim().startsWith('MBBS Abroad'));
          if (!link) return null;
          const rect = link.getBoundingClientRect();
          const el = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
          return el?.closest('a')?.getAttribute('href');
        }, cardSelector);
        assert(mbbsSubTarget === exp.subRoutes.mbbs, `Card 2 MBBS sub-link clicks through to ${exp.subRoutes.mbbs} (Actual: ${mbbsSubTarget})`);

        // Test PhD sub-link click
        const phdSubTarget = await page.evaluate((sel) => {
          const card = document.querySelector(sel);
          card.scrollIntoView({ block: 'center', inline: 'nearest' });
          const link = Array.from(card.querySelectorAll('a')).find(a => a.innerText.trim().startsWith('PhD Abroad'));
          if (!link) return null;
          const rect = link.getBoundingClientRect();
          const el = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
          return el?.closest('a')?.getAttribute('href');
        }, cardSelector);
        assert(phdSubTarget === exp.subRoutes.phd, `Card 2 PhD sub-link clicks through to ${exp.subRoutes.phd} (Actual: ${phdSubTarget})`);
      }
    }

    console.log('\n--- 4. TESTING ALL 8 VIEWPORTS FOR OVERFLOW & RESPONSIVENESS ---');
    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

      const metrics = await page.evaluate(() => {
        const root = document.documentElement;
        const body = document.body;
        const scrollW = Math.max(root.scrollWidth, body.scrollWidth);
        const innerW = window.innerWidth;
        const servicesSec = document.querySelector('section#services');
        const secRect = servicesSec?.getBoundingClientRect();

        return {
          scrollW,
          innerW,
          hasOverflow: scrollW > innerW,
          secVisible: secRect && secRect.height > 0,
        };
      });

      assert(!metrics.hasOverflow, `${vp.name} (${vp.width}px): Zero horizontal overflow (${metrics.scrollW}px vs ${metrics.innerW}px)`);
      assert(metrics.secVisible, `${vp.name}: Services section is fully visible`);
    }

    console.log('\n--- 5. CAPTURING EVIDENCE SCREENSHOTS ---');
    // Desktop 1440px
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    const servicesSection = await page.$('section#services');
    if (servicesSection) {
      const desktopPath = path.join(EVIDENCE_DIR, 'after-service-cards-desktop-1440px.png');
      await servicesSection.screenshot({ path: desktopPath });
      console.log(`  📸 Captured desktop section screenshot: ${desktopPath}`);
      assert(fs.existsSync(desktopPath), 'Desktop 1440px screenshot saved successfully');
    }

    // Mobile 390px
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    const mobileServicesSection = await page.$('section#services');
    if (mobileServicesSection) {
      const mobilePath = path.join(EVIDENCE_DIR, 'after-service-cards-mobile-390px.png');
      await mobileServicesSection.screenshot({ path: mobilePath });
      console.log(`  📸 Captured mobile section screenshot: ${mobilePath}`);
      assert(fs.existsSync(mobilePath), 'Mobile 390px screenshot saved successfully');
    }

  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n================================================================');
  console.log(`TOTAL CHECKS : ${totalChecks}`);
  console.log(`PASSED       : ${passedChecks}`);
  console.log(`FAILED       : ${failedChecks}`);
  console.log(`PASS RATE    : ${Math.round((passedChecks / totalChecks) * 100)}%`);
  console.log('================================================================\n');

  if (failedChecks > 0) {
    process.exit(1);
  }
}

runQA().catch((err) => {
  console.error('Fatal error during QA:', err);
  process.exit(1);
});
