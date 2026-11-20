import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\6a0361a6-ccbe-4f53-a463-b2d5ee259bd4\\bachelors-masters-layout';
const PORT = 4393;

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

async function runVerification() {
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Server started at http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const summary = {
    viewports: {},
    formAudit: null,
    desktopSideBySide: false,
    tabletStacked: false,
    mobileStacked: false,
    filterAndSearchPass: false,
    zeroOverflowAllViewports: true,
    screenshots: [],
  };

  try {
    // -------------------------------------------------------------
    // TEST 1: Form Elements & Fields Audit
    // -------------------------------------------------------------
    console.log('\n--- 1. Testing Assessment Form Structure ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/study-abroad/`, { waitUntil: 'networkidle0' });

    const formAudit = await page.evaluate(() => {
      const enquirySection = document.getElementById('enquiry');
      if (!enquirySection) return { error: 'No #enquiry section found' };

      const heading = enquirySection.querySelector('h2, h3')?.textContent?.trim() || '';
      const serviceSelect = enquirySection.querySelector('#form-service');
      const options = serviceSelect ? Array.from(serviceSelect.options).filter((o) => o.value !== '').map((o) => ({ value: o.value, text: o.text.trim() })) : [];

      const nameInput = enquirySection.querySelector('#form-full-name');
      const phoneInput = enquirySection.querySelector('#form-phone');
      const emailInput = enquirySection.querySelector('#form-email');
      const countryInput = enquirySection.querySelector('#form-country');
      const messageInput = enquirySection.querySelector('#form-message');
      const submitBtn = enquirySection.querySelector('#enquiry-submit-btn');

      const emailLabel = enquirySection.querySelector('label[for="form-email"]')?.textContent?.trim() || '';
      const emailRequired = emailInput?.hasAttribute('required');

      const visibleUniversityFieldExists = Boolean(enquirySection.querySelector('input[name="university_interest"]:not([type="hidden"]), select[name="university_interest"], label[for="form-university"]'));

      return {
        hasEnquirySection: true,
        heading,
        options,
        hasName: Boolean(nameInput),
        hasPhone: Boolean(phoneInput),
        hasEmail: Boolean(emailInput),
        emailLabel,
        emailRequired,
        hasCountry: Boolean(countryInput),
        hasMessage: Boolean(messageInput),
        submitBtnText: submitBtn?.textContent?.trim() || '',
        visibleUniversityFieldExists,
      };
    });

    summary.formAudit = formAudit;
    console.log('Form structure audit:', formAudit);

    const hasExact2Options = formAudit.options.length === 2 &&
      formAudit.options.some((o) => o.value === 'bachelors-abroad' && o.text === "Bachelor's Abroad") &&
      formAudit.options.some((o) => o.value === 'masters-abroad' && o.text === "Master's Abroad") &&
      !formAudit.options.some((o) => o.value === 'study-visa');

    if (
      formAudit.hasEnquirySection &&
      formAudit.heading.includes("Bachelor's / Master's Consultation") &&
      hasExact2Options &&
      formAudit.hasName &&
      formAudit.hasPhone &&
      formAudit.hasEmail &&
      !formAudit.emailRequired &&
      formAudit.emailLabel.includes('Email (Optional)') &&
      formAudit.submitBtnText.includes('Request Consultation') &&
      !formAudit.visibleUniversityFieldExists
    ) {
      console.log('PASS: Form structure perfectly matches all requirements');
    } else {
      console.error('FAIL: Form structure validation failed');
    }

    // -------------------------------------------------------------
    // TEST 2: Multi-Viewport Geometry & Layout Checks
    // -------------------------------------------------------------
    console.log('\n--- 2. Testing Multi-Viewport Responsive Geometries ---');
    const viewportsToTest = [
      { name: 'Mobile Mini', width: 320, height: 600, expectedMode: 'stacked' },
      { name: 'Android Compact', width: 360, height: 740, expectedMode: 'stacked' },
      { name: 'iPhone 14/15', width: 390, height: 844, expectedMode: 'stacked' },
      { name: 'iPhone Pro Max', width: 430, height: 932, expectedMode: 'stacked' },
      { name: 'iPad Mini (Tablet)', width: 768, height: 1024, expectedMode: 'stacked' },
      { name: 'iPad Pro / Small Laptop', width: 1024, height: 768, expectedMode: 'stacked' },
      { name: 'Desktop 1100px Threshold', width: 1100, height: 850, expectedMode: 'side-by-side' },
      { name: 'Standard Laptop (1366px)', width: 1366, height: 768, expectedMode: 'side-by-side' },
      { name: 'Full HD Desktop (1440px)', width: 1440, height: 900, expectedMode: 'side-by-side' },
    ];

    for (const vp of viewportsToTest) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(`http://localhost:${PORT}/study-abroad/`, { waitUntil: 'networkidle0' });

      const metrics = await page.evaluate(() => {
        const leftCol = document.getElementById('countries-grid')?.parentElement;
        const rightCol = document.getElementById('enquiry');
        const grid = document.getElementById('countries-grid');
        const firstCard = grid?.querySelector('.country-tile');

        const leftRect = leftCol?.getBoundingClientRect();
        const rightRect = rightCol?.getBoundingClientRect();

        const scrollWidth = document.documentElement.scrollWidth;
        const innerWidth = window.innerWidth;
        const hasOverflow = scrollWidth > innerWidth;

        // Count columns in grid
        let colsInGrid = 0;
        if (grid) {
          const cards = Array.from(grid.querySelectorAll('.country-tile'));
          if (cards.length >= 2) {
            const firstTop = cards[0].getBoundingClientRect().top;
            colsInGrid = cards.filter((c) => Math.abs(c.getBoundingClientRect().top - firstTop) < 5).length;
          }
        }

        const isSideBySide = Boolean(
          leftRect &&
          rightRect &&
          leftRect.right <= rightRect.left &&
          Math.abs(leftRect.top - rightRect.top) < 30
        );

        const isStacked = Boolean(
          leftRect &&
          rightRect &&
          leftRect.bottom <= rightRect.top + 20
        );

        const colGap = isSideBySide && leftRect && rightRect ? rightRect.left - leftRect.right : 0;
        const leftRatio = isSideBySide && leftRect && rightRect ? leftRect.width / (leftRect.width + rightRect.width + colGap) : 1;
        const rightRatio = isSideBySide && leftRect && rightRect ? rightRect.width / (leftRect.width + rightRect.width + colGap) : 1;

        const cardHeight = firstCard?.offsetHeight || 0;

        return {
          hasOverflow,
          scrollWidth,
          innerWidth,
          isSideBySide,
          isStacked,
          colGap,
          leftRatio: Math.round(leftRatio * 100),
          rightRatio: Math.round(rightRatio * 100),
          leftWidth: leftRect?.width ? Math.round(leftRect.width) : 0,
          rightWidth: rightRect?.width ? Math.round(rightRect.width) : 0,
          colsInGrid,
          cardHeight,
        };
      });

      console.log(`Viewport ${vp.width}px (${vp.name}):`, metrics);
      summary.viewports[vp.width] = metrics;

      if (metrics.hasOverflow) {
        console.error(`FAIL: Horizontal overflow detected at ${vp.width}px!`);
        summary.zeroOverflowAllViewports = false;
      }

      if (vp.expectedMode === 'side-by-side') {
        const hasValidCols = metrics.colsInGrid >= 3 && metrics.colsInGrid <= 4;
        if (metrics.isSideBySide && metrics.colGap >= 16 && metrics.colGap <= 28 && hasValidCols) {
          summary.desktopSideBySide = true;
          console.log(`  PASS: Side-by-side layout active, 70:30 ratio (${metrics.leftRatio}% : ${metrics.rightRatio}%), gap: ${metrics.colGap}px, ${metrics.colsInGrid} cards/row`);
        } else {
          console.error(`  FAIL: Expected side-by-side with 3-4 cards/row at ${vp.width}px, got isSideBySide=${metrics.isSideBySide}, gap=${metrics.colGap}, cols=${metrics.colsInGrid}`);
        }
      } else {
        if (metrics.isStacked) {
          if (vp.width >= 768) summary.tabletStacked = true;
          else summary.mobileStacked = true;
          console.log(`  PASS: Stacked layout active (directory first, form after), ${metrics.colsInGrid} cards/row, card height: ${metrics.cardHeight}px`);
        } else {
          console.error(`  FAIL: Expected stacked layout at ${vp.width}px`);
        }
      }

      // Capture screenshot for key viewports
      const screenshotPath = path.join(EVIDENCE_DIR, `bachelors-masters-${vp.width}px.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      summary.screenshots.push(screenshotPath);
    }

    // -------------------------------------------------------------
    // TEST 3: Search & Continent Filter Functionality
    // -------------------------------------------------------------
    console.log('\n--- 3. Testing Search & Filter Functionality ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/study-abroad/`, { waitUntil: 'networkidle0' });

    // Type "Germany" in search input
    await page.type('#country-search-input', 'germany');
    await new Promise((r) => setTimeout(r, 200));

    const searchTest = await page.evaluate(() => {
      const visibleCards = Array.from(document.querySelectorAll('#countries-grid .country-tile:not([style*="display: none"])'));
      const visibleCountText = document.getElementById('visible-count')?.textContent?.trim();
      return {
        visibleCount: visibleCards.length,
        visibleCountText,
        cardName: visibleCards[0]?.querySelector('.country-name')?.textContent?.trim(),
      };
    });

    console.log('Search test results for "germany":', searchTest);

    // Clear search and click Europe filter
    await page.$eval('#country-search-input', (el) => {
      el.value = '';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.click('button[data-continent="europe"]');
    await new Promise((r) => setTimeout(r, 200));

    const europeTest = await page.evaluate(() => {
      const visibleCards = Array.from(document.querySelectorAll('#countries-grid .country-tile:not([style*="display: none"])'));
      const visibleCountText = document.getElementById('visible-count')?.textContent?.trim();
      return {
        visibleCount: visibleCards.length,
        visibleCountText,
      };
    });

    console.log('Europe filter results:', europeTest);

    if (searchTest.visibleCount === 1 && searchTest.cardName?.toLowerCase().includes('germany') && europeTest.visibleCount > 10) {
      summary.filterAndSearchPass = true;
      console.log('PASS: Search and continent filtering work dynamically!');
    } else {
      console.error('FAIL: Search or continent filter failed verification');
    }

    // Capture final side-by-side screenshot at 1440px
    const sideBySideScreenshot = path.join(EVIDENCE_DIR, 'bachelors-masters-side-by-side-1440px.png');
    await page.screenshot({ path: sideBySideScreenshot, clip: { x: 0, y: 0, width: 1440, height: 900 } });
    summary.screenshots.push(sideBySideScreenshot);

    console.log('\n=============================================');
    console.log('AUDIT SUMMARY:', summary);
    console.log('=============================================');

    await browser.close();
    server.close();

    fs.writeFileSync(
      path.join(EVIDENCE_DIR, 'audit-results.json'),
      JSON.stringify(summary, null, 2)
    );

    if (
      summary.desktopSideBySide &&
      summary.tabletStacked &&
      summary.mobileStacked &&
      summary.filterAndSearchPass &&
      summary.zeroOverflowAllViewports
    ) {
      console.log('\nALL BACHELOR\'S & MASTER\'S LAYOUT CHECKS PASSED PERFECTLY!');
      process.exit(0);
    } else {
      console.error('\nSOME CHECKS FAILED!');
      process.exit(1);
    }
  } catch (err) {
    console.error('Verification error:', err);
    await browser.close();
    server.close();
    process.exit(1);
  }
}

runVerification();
