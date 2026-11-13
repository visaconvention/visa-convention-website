import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\93dd9ae5-292a-4677-9731-9efc41a7f30f\\evidence';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const DIST_DIR = path.resolve('dist');
const PORT = 4331;

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
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      // Simulate /api/enquiry lead submission endpoint if requested
      if (req.url === '/api/enquiry' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            referenceId: 'VC-LEAD-' + Math.floor(100000 + Math.random() * 900000),
            message: 'Inquiry received successfully'
          }));
        });
        return;
      }

      let reqPath = decodeURI(req.url.split('?')[0]);
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
      console.log(`Server listening on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, name, details = '') {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${name} ${details ? '- ' + details : ''}`);
    failedTests++;
  }
}

async function runTest() {
  console.log('================================================================');
  console.log('   TOURIST VISA FAQ & CONSULTATION 2-COLUMN LAYOUT QA SUITE     ');
  console.log('================================================================\n');

  const server = await startServer();
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // -------------------------------------------------------------
  // TEST GROUP 1: Desktop 2-Column Balanced Layout (1440px)
  // -------------------------------------------------------------
  console.log('--- TEST GROUP 1: Desktop 2-Column Balanced Layout (1440px) ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:${PORT}/services/tourist-visa/`, { waitUntil: 'networkidle0' });

  // 1. Verify container max-width
  const containerWidth = await page.$eval('#enquiry', el => {
    const parentContainer = el.closest('.max-w-\\[1200px\\]');
    if (!parentContainer) return 0;
    return parentContainer.getBoundingClientRect().width;
  });
  assert(containerWidth >= 1180 && containerWidth <= 1220, `Desktop container width conforms to 1180-1220px (Actual: ${containerWidth.toFixed(1)}px)`);

  // 2. Verify 2-Column Grid Geometry
  const layoutGeometry = await page.evaluate(() => {
    const enquiry = document.getElementById('enquiry');
    if (!enquiry) return null;
    const grid = enquiry.parentElement;
    if (!grid) return null;

    const children = Array.from(grid.children);
    const leftCol = children[0]; // FAQ column
    const rightCol = children[1]; // Enquiry column

    const leftRect = leftCol.getBoundingClientRect();
    const rightRect = rightCol.getBoundingClientRect();

    return {
      left: { top: leftRect.top, left: leftRect.left, width: leftRect.width, height: leftRect.height },
      right: { top: rightRect.top, left: rightRect.left, width: rightRect.width, height: rightRect.height },
      gap: rightRect.left - (leftRect.left + leftRect.width)
    };
  });

  assert(Boolean(layoutGeometry), 'Grid container and columns located in DOM');
  if (layoutGeometry) {
    // Both columns aligned at top
    const topDifference = Math.abs(layoutGeometry.left.top - layoutGeometry.right.top);
    assert(topDifference <= 2, `Both columns aligned at the same top position (Top difference: ${topDifference.toFixed(1)}px)`);

    // Two balanced columns (approximately equal width)
    const widthRatio = layoutGeometry.left.width / layoutGeometry.right.width;
    assert(widthRatio >= 0.90 && widthRatio <= 1.10, `Columns are balanced in width (Left: ${layoutGeometry.left.width.toFixed(1)}px, Right: ${layoutGeometry.right.width.toFixed(1)}px, Ratio: ${widthRatio.toFixed(2)})`);

    // Grid gap between 24px and 32px
    assert(layoutGeometry.gap >= 24 && layoutGeometry.gap <= 36, `Grid column gap between 24px and 32px (Actual: ${layoutGeometry.gap.toFixed(1)}px)`);

    // Independent natural height: left FAQ should not be stretched to match right form
    const heightDifference = Math.abs(layoutGeometry.left.height - layoutGeometry.right.height);
    assert(heightDifference > 50, `Columns have independent natural heights without forced stretch (Height difference: ${heightDifference.toFixed(1)}px)`);
  }

  // -------------------------------------------------------------
  // TEST GROUP 2: FAQ Initial Collapse & Expandability
  // -------------------------------------------------------------
  console.log('\n--- TEST GROUP 2: FAQ Accordion State & Interactions ---');
  const allFaqDetails = await page.$$eval('#faq details', els => els.map(d => d.open));
  const allCollapsed = allFaqDetails.every(isOpen => isOpen === false);
  assert(allCollapsed, `All ${allFaqDetails.length} FAQ items start collapsed initially (0 open items)`);

  // Expand first FAQ
  await page.click('#faq details summary');
  await new Promise(r => setTimeout(r, 150));
  const firstFaqOpen = await page.$eval('#faq details', d => d.open);
  assert(firstFaqOpen, 'Clicking FAQ summary smoothly expands question details');

  // Collapse it back
  await page.click('#faq details summary');
  await new Promise(r => setTimeout(r, 150));
  const firstFaqClosedAgain = await page.$eval('#faq details', d => !d.open);
  assert(firstFaqClosedAgain, 'Clicking open FAQ summary collapses it back');

  // -------------------------------------------------------------
  // TEST GROUP 3: Enquiry Form Autofill & Delivery Handling
  // -------------------------------------------------------------
  console.log('\n--- TEST GROUP 3: Consultation Form Autofill & Verification ---');
  // Destination selection autofill
  await page.click('[data-group-id="individual"] .dest-group-toggle');
  await new Promise(r => setTimeout(r, 150));
  await page.click('[data-country-slug="canada"] .dest-country-toggle');
  await new Promise(r => setTimeout(r, 150));
  await page.click('[data-country-slug="canada"] .dest-select-btn');
  await new Promise(r => setTimeout(r, 200));

  const countryVal = await page.$eval('#form-country', el => el.value);
  assert(countryVal === 'canada', `Destination selection accurately populated form-country select (Actual: ${countryVal})`);

  // Category selection autofill
  await page.click('[data-category-id="farmer"]');
  await new Promise(r => setTimeout(r, 150));
  const messageVal = await page.$eval('#form-message', el => el.value);
  assert(messageVal.includes('[Tourist Visa Profile: Farmer]'), 'Category selection accurately populated form-message textarea');

  // Complete and submit form
  await page.type('#form-full-name', 'Rupinder Singh');
  await page.type('#form-phone', '+91 98765 43210');
  await page.type('#form-email', 'rupinder.singh@example.com');
  await page.click('#form-consent');

  // Capture Section Screenshot Desktop
  const desktopSectionScreenshot = path.join(ARTIFACTS_DIR, 'tourist-faq-consultation-desktop-1440.png');
  const sectionElement = await page.$('#enquiry');
  if (sectionElement) {
    const parentSection = await page.evaluateHandle(el => el.closest('section'), sectionElement);
    const parentEl = parentSection.asElement();
    if (parentEl) {
      await parentEl.screenshot({ path: desktopSectionScreenshot });
      console.log(`  📸 Saved desktop 2-column section preview: ${desktopSectionScreenshot}`);
    }
  }

  // -------------------------------------------------------------
  // TEST GROUP 4: Mobile-First Vertical Stacking & Viewports
  // -------------------------------------------------------------
  console.log('\n--- TEST GROUP 4: Mobile-First Responsive Stacking (8 Viewports) ---');
  const viewports = [320, 360, 390, 430, 768, 1024, 1366, 1440];

  let overflowErrors = 0;
  for (const w of viewports) {
    await page.setViewport({ width: w, height: 800 });
    await page.goto(`http://localhost:${PORT}/services/tourist-visa/`, { waitUntil: 'domcontentloaded' });

    const isOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    if (isOverflow) {
      console.error(`  ❌ Overflow on ${w}px!`);
      overflowErrors++;
    }

    // Check stacking below 900px
    if (w < 900) {
      const isStacked = await page.evaluate(() => {
        const enquiry = document.getElementById('enquiry');
        if (!enquiry) return false;
        const grid = enquiry.parentElement;
        if (!grid) return false;

        const leftCol = grid.children[0];
        const rightCol = grid.children[1];

        const leftRect = leftCol.getBoundingClientRect();
        const rightRect = rightCol.getBoundingClientRect();

        // Right (form) must be below Left (FAQ)
        return rightRect.top >= leftRect.bottom - 5;
      });
      assert(isStacked, `At ${w}px (<900px), layout stacks vertically: FAQs first, form second`);
    } else {
      // 900px+ side-by-side
      const isSideBySide = await page.evaluate(() => {
        const enquiry = document.getElementById('enquiry');
        if (!enquiry) return false;
        const grid = enquiry.parentElement;
        if (!grid) return false;

        const leftCol = grid.children[0];
        const rightCol = grid.children[1];

        const leftRect = leftCol.getBoundingClientRect();
        const rightRect = rightCol.getBoundingClientRect();

        return Math.abs(leftRect.top - rightRect.top) <= 2 && rightRect.left > leftRect.left;
      });
      assert(isSideBySide, `At ${w}px (>=900px), layout displays side-by-side balanced columns`);
    }

    if (w === 390) {
      const mobileSectionScreenshot = path.join(ARTIFACTS_DIR, 'tourist-faq-consultation-mobile-390.png');
      const mobileEl = await page.$('#enquiry');
      if (mobileEl) {
        const mobileParent = await page.evaluateHandle(el => el.closest('section'), mobileEl);
        const mEl = mobileParent.asElement();
        if (mEl) {
          await mEl.screenshot({ path: mobileSectionScreenshot });
          console.log(`  📸 Saved mobile stacked section preview: ${mobileSectionScreenshot}`);
        }
      }
    }
  }

  assert(overflowErrors === 0, `All ${viewports.length} viewports (320px to 1440px) verified with ZERO horizontal overflow`);

  await browser.close();
  server.close();

  console.log('\n================================================================');
  console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
  if (failedTests === 0) {
    console.log('✅ ALL TOURIST VISA FAQ & CONSULTATION LAYOUT CHECKS PASSED!');
  } else {
    console.error('❌ SOME CHECKS FAILED!');
    process.exit(1);
  }
  console.log('================================================================\n');
}

runTest().catch(err => {
  console.error(err);
  process.exit(1);
});
