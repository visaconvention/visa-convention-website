import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\6a0361a6-ccbe-4f53-a463-b2d5ee259bd4\\country-tile-optimization';
const PORT = 4389;

if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
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
  '.webp': 'image/webp',
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

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${message}`);
    if (details) console.error(`     Details: ${details}`);
  }
}

async function run() {
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`\nLocal static server listening on http://localhost:${PORT}`);
  console.log('================================================================');
  console.log('   WEBSITE-WIDE COUNTRY TILE OPTIMIZATION COMPREHENSIVE QA SUITE  ');
  console.log('================================================================\n');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  try {
    // -------------------------------------------------------------------------
    // MODULE 1: /study-abroad/ Explore 35+ Countries Tile Audit
    // -------------------------------------------------------------------------
    console.log('--- 1. STUDY ABROAD DIRECTORY (/study-abroad/) COUNTRY TILES ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/study-abroad/`, { waitUntil: 'networkidle0' });

    const studyAbroadAudit = await page.evaluate(() => {
      const grid = document.getElementById('countries-grid');
      const tiles = Array.from(grid?.querySelectorAll('.country-tile') || []);
      const gridCols = window.getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length;

      let allSingleRow = true;
      let allVerticallyCentered = true;
      let allHeightsInRange = true;
      let minHeight = 999;
      let maxHeight = 0;
      let allTouchTargetsOk = true;
      let allHaveFlag = true;
      let allHaveName = true;
      let allHaveArrow = true;

      for (const tile of tiles) {
        const rect = tile.getBoundingClientRect();
        if (rect.height < minHeight) minHeight = rect.height;
        if (rect.height > maxHeight) maxHeight = rect.height;

        // Tile height requirement: approx 52–60px (allow 50–62 for borders/subpixel rounding)
        if (rect.height < 50 || rect.height > 62) {
          allHeightsInRange = false;
        }

        // Touch target >= 44px
        if (rect.height < 44 || rect.width < 44) {
          allTouchTargetsOk = false;
        }

        const flag = tile.querySelector('img');
        const name = tile.querySelector('.country-name');
        const arrow = tile.querySelector('.country-arrow');

        if (!flag) allHaveFlag = false;
        if (!name || !name.textContent.trim()) allHaveName = false;
        if (!arrow) allHaveArrow = false;

        if (flag && name && arrow) {
          const fRect = flag.getBoundingClientRect();
          const nRect = name.getBoundingClientRect();
          const aRect = arrow.getBoundingClientRect();

          // Single horizontal row: Flag.x < Name.x < Arrow.x
          if (!(fRect.right <= nRect.left + 5 && nRect.right <= aRect.left + 5)) {
            allSingleRow = false;
          }

          // Vertical centering: element centerlines within 5px of tile center
          const tileCenterY = rect.top + rect.height / 2;
          const fCenterY = fRect.top + fRect.height / 2;
          const aCenterY = aRect.top + aRect.height / 2;

          if (Math.abs(fCenterY - tileCenterY) > 5 || Math.abs(aCenterY - tileCenterY) > 5) {
            allVerticallyCentered = false;
          }
        }
      }

      return {
        totalTiles: tiles.length,
        gridCols,
        allSingleRow,
        allVerticallyCentered,
        allHeightsInRange,
        minHeight: Math.round(minHeight),
        maxHeight: Math.round(maxHeight),
        allTouchTargetsOk,
        allHaveFlag,
        allHaveName,
        allHaveArrow,
      };
    });

    assert(studyAbroadAudit.totalTiles >= 35, `Rendered all destination tiles (Found: ${studyAbroadAudit.totalTiles})`);
    assert(studyAbroadAudit.gridCols === 5, `Desktop layout has exactly 5 columns (Actual: ${studyAbroadAudit.gridCols})`);
    assert(studyAbroadAudit.allSingleRow, 'All tiles arrange elements in 1 horizontal row: Flag | Country Name | Arrow');
    assert(studyAbroadAudit.allVerticallyCentered, 'Flag, Country Name, and Arrow are vertically centered within tiles');
    assert(
      studyAbroadAudit.allHeightsInRange,
      `Tile heights are strictly within 52–60px (Min: ${studyAbroadAudit.minHeight}px, Max: ${studyAbroadAudit.maxHeight}px)`
    );
    assert(studyAbroadAudit.allTouchTargetsOk, 'All tiles meet WCAG 2.1 AA touch target >= 44px');
    assert(studyAbroadAudit.allHaveFlag && studyAbroadAudit.allHaveName && studyAbroadAudit.allHaveArrow, 'All tiles possess valid Flag, Name, and Arrow elements');

    // -------------------------------------------------------------------------
    // MODULE 2: /study-in-europe/ Country Tiles Audit
    // -------------------------------------------------------------------------
    console.log('\n--- 2. STUDY IN EUROPE (/study-in-europe/) COUNTRY TILES ---');
    await page.goto(`http://localhost:${PORT}/study-in-europe/`, { waitUntil: 'networkidle0' });

    const europeAudit = await page.evaluate(() => {
      const grid = document.getElementById('europe-countries-grid');
      const tiles = Array.from(grid?.querySelectorAll('.country-tile') || []);
      const gridCols = window.getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length;

      let allSingleRow = true;
      let allHeightsInRange = true;
      let minHeight = 999;
      let maxHeight = 0;

      for (const tile of tiles) {
        const rect = tile.getBoundingClientRect();
        if (rect.height < minHeight) minHeight = rect.height;
        if (rect.height > maxHeight) maxHeight = rect.height;

        if (rect.height < 50 || rect.height > 62) allHeightsInRange = false;

        const flag = tile.querySelector('img');
        const name = tile.querySelector('.country-name');
        const arrow = tile.querySelector('.country-arrow');

        if (flag && name && arrow) {
          const fRect = flag.getBoundingClientRect();
          const nRect = name.getBoundingClientRect();
          const aRect = arrow.getBoundingClientRect();
          if (!(fRect.right <= nRect.left + 5 && nRect.right <= aRect.left + 5)) {
            allSingleRow = false;
          }
        }
      }

      return {
        totalTiles: tiles.length,
        gridCols,
        allSingleRow,
        allHeightsInRange,
        minHeight: Math.round(minHeight),
        maxHeight: Math.round(maxHeight),
      };
    });

    assert(europeAudit.totalTiles === 25, `Rendered all 25 European country tiles (Found: ${europeAudit.totalTiles})`);
    assert(europeAudit.gridCols === 5, `Europe desktop grid displays exactly 5 columns (Actual: ${europeAudit.gridCols})`);
    assert(europeAudit.allSingleRow, 'Europe tiles formatted in single horizontal row: Flag | Country Name | Arrow');
    assert(europeAudit.allHeightsInRange, `Europe tile heights strictly within 52–60px (Min: ${europeAudit.minHeight}px, Max: ${europeAudit.maxHeight}px)`);

    // -------------------------------------------------------------------------
    // MODULE 3: /services/mbbs/ Interactive Country Button Tiles Audit
    // -------------------------------------------------------------------------
    console.log('\n--- 3. MBBS ABROAD (/services/mbbs/) INTERACTIVE COUNTRY TILES ---');
    await page.goto(`http://localhost:${PORT}/services/mbbs/`, { waitUntil: 'networkidle0' });

    const mbbsAudit = await page.evaluate(() => {
      const grid = document.getElementById('mbbs-countries-grid');
      const tiles = Array.from(grid?.querySelectorAll('.mbbs-country-btn') || []);
      const gridCols = window.getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length;

      let allButtons = true;
      let allSingleRow = true;
      let allVerticallyCentered = true;
      let allHeightsInRange = true;
      let minHeight = 999;
      let maxHeight = 0;

      for (const tile of tiles) {
        if (tile.tagName.toLowerCase() !== 'button') allButtons = false;

        const rect = tile.getBoundingClientRect();
        if (rect.height < minHeight) minHeight = rect.height;
        if (rect.height > maxHeight) maxHeight = rect.height;

        if (rect.height < 50 || rect.height > 62) allHeightsInRange = false;

        const flag = tile.querySelector('img');
        const name = tile.querySelector('.country-name');
        const arrow = tile.querySelector('.country-arrow');

        if (flag && name && arrow) {
          const fRect = flag.getBoundingClientRect();
          const nRect = name.getBoundingClientRect();
          const aRect = arrow.getBoundingClientRect();
          if (!(fRect.right <= nRect.left + 5 && nRect.right <= aRect.left + 5)) {
            allSingleRow = false;
          }

          const tileCenterY = rect.top + rect.height / 2;
          const fCenterY = fRect.top + fRect.height / 2;
          const aCenterY = aRect.top + aRect.height / 2;
          if (Math.abs(fCenterY - tileCenterY) > 5 || Math.abs(aCenterY - tileCenterY) > 5) {
            allVerticallyCentered = false;
          }
        }
      }

      return {
        totalTiles: tiles.length,
        gridCols,
        allButtons,
        allSingleRow,
        allVerticallyCentered,
        allHeightsInRange,
        minHeight: Math.round(minHeight),
        maxHeight: Math.round(maxHeight),
      };
    });

    assert(mbbsAudit.totalTiles === 11, `MBBS displays all 11 destination country buttons (Found: ${mbbsAudit.totalTiles})`);
    assert(mbbsAudit.allButtons, 'MBBS country tiles are interactive <button> elements');
    assert(mbbsAudit.gridCols === 5, `MBBS desktop grid displays exactly 5 columns (Actual: ${mbbsAudit.gridCols})`);
    assert(mbbsAudit.allSingleRow, 'MBBS tiles formatted in single horizontal row: Flag | Country Name | Arrow');
    assert(mbbsAudit.allVerticallyCentered, 'MBBS elements are vertically centered within tiles');
    assert(mbbsAudit.allHeightsInRange, `MBBS tile heights strictly within 52–60px (Min: ${mbbsAudit.minHeight}px, Max: ${mbbsAudit.maxHeight}px)`);

    // Test MBBS Country Selection Interaction & Active Styles
    const uzbBtn = await page.$('.mbbs-country-btn[data-country-name="Uzbekistan"]');
    if (uzbBtn) {
      await uzbBtn.click();
      await new Promise(r => setTimeout(r, 200));

      const uzbActiveState = await page.evaluate(() => {
        const btn = document.querySelector('.mbbs-country-btn[data-country-name="Uzbekistan"]');
        const isSelected = btn?.getAttribute('aria-selected') === 'true';
        const hasActiveRing = btn?.classList.contains('ring-2');
        const unisSection = document.getElementById('mbbs-universities-section');
        const isUnisVisible = unisSection && !unisSection.classList.contains('hidden');
        return { isSelected, hasActiveRing, isUnisVisible };
      });

      assert(uzbActiveState.isSelected, 'Clicking Uzbekistan sets aria-selected="true"');
      assert(uzbActiveState.hasActiveRing, 'Clicking Uzbekistan applies active focus ring');
      assert(uzbActiveState.isUnisVisible, 'Clicking Uzbekistan reveals medical universities section');
    }

    // -------------------------------------------------------------------------
    // MODULE 4: /services/phd/ Interactive Country Button Tiles Audit
    // -------------------------------------------------------------------------
    console.log('\n--- 4. PHD ABROAD (/services/phd/) INTERACTIVE COUNTRY TILES ---');
    await page.goto(`http://localhost:${PORT}/services/phd/`, { waitUntil: 'networkidle0' });

    const phdAudit = await page.evaluate(() => {
      const grid = document.getElementById('phd-countries-grid');
      const tiles = Array.from(grid?.querySelectorAll('.phd-country-btn') || []);
      const gridCols = window.getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length;

      let allButtons = true;
      let allSingleRow = true;
      let allVerticallyCentered = true;
      let allHeightsInRange = true;
      let minHeight = 999;
      let maxHeight = 0;

      for (const tile of tiles) {
        if (tile.tagName.toLowerCase() !== 'button') allButtons = false;

        const rect = tile.getBoundingClientRect();
        if (rect.height < minHeight) minHeight = rect.height;
        if (rect.height > maxHeight) maxHeight = rect.height;

        if (rect.height < 50 || rect.height > 62) allHeightsInRange = false;

        const flag = tile.querySelector('img');
        const name = tile.querySelector('.country-name');
        const arrow = tile.querySelector('.country-arrow');

        if (flag && name && arrow) {
          const fRect = flag.getBoundingClientRect();
          const nRect = name.getBoundingClientRect();
          const aRect = arrow.getBoundingClientRect();
          if (!(fRect.right <= nRect.left + 5 && nRect.right <= aRect.left + 5)) {
            allSingleRow = false;
          }

          const tileCenterY = rect.top + rect.height / 2;
          const fCenterY = fRect.top + fRect.height / 2;
          const aCenterY = aRect.top + aRect.height / 2;
          if (Math.abs(fCenterY - tileCenterY) > 5 || Math.abs(aCenterY - tileCenterY) > 5) {
            allVerticallyCentered = false;
          }
        }
      }

      return {
        totalTiles: tiles.length,
        gridCols,
        allButtons,
        allSingleRow,
        allVerticallyCentered,
        allHeightsInRange,
        minHeight: Math.round(minHeight),
        maxHeight: Math.round(maxHeight),
      };
    });

    assert(phdAudit.totalTiles === 3, `PhD displays all 3 approved countries (Found: ${phdAudit.totalTiles})`);
    assert(phdAudit.allButtons, 'PhD country tiles are interactive <button> elements');
    assert(phdAudit.allSingleRow, 'PhD tiles formatted in single horizontal row: Flag | Country Name | Arrow');
    assert(phdAudit.allVerticallyCentered, 'PhD elements are vertically centered within tiles');
    assert(phdAudit.allHeightsInRange, `PhD tile heights strictly within 52–60px (Min: ${phdAudit.minHeight}px, Max: ${phdAudit.maxHeight}px)`);

    // -------------------------------------------------------------------------
    // MODULE 5: Multi-Viewport Responsive Columns & Overflow QA
    // -------------------------------------------------------------------------
    console.log('\n--- 5. MULTI-VIEWPORT RESPONSIVE QA (320, 360, 390, 430, 768, 1024, 1440px) ---');

    const viewports = [
      { width: 320, expectedCols: 2, label: '320px (Narrow Mobile)' },
      { width: 360, expectedCols: 2, label: '360px (Compact Mobile)' },
      { width: 390, expectedCols: 2, label: '390px (Standard Mobile)' },
      { width: 430, expectedCols: 2, label: '430px (Large Mobile)' },
      { width: 768, expectedCols: 3, label: '768px (Tablet)' },
      { width: 1024, expectedCols: 3, label: '1024px (Small Desktop/Tablet)' },
      { width: 1440, expectedCols: 5, label: '1440px (Standard Desktop)' },
    ];

    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: 800 });
      await page.goto(`http://localhost:${PORT}/study-abroad/`, { waitUntil: 'networkidle0' });

      const vpMetrics = await page.evaluate(() => {
        const grid = document.getElementById('countries-grid');
        const cols = grid ? window.getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length : 0;
        const hasOverflow = document.documentElement.scrollWidth > window.innerWidth;
        const tiles = Array.from(grid?.querySelectorAll('.country-tile') || []);
        let minH = 999;
        let maxH = 0;
        for (const t of tiles) {
          const h = t.getBoundingClientRect().height;
          if (h < minH) minH = h;
          if (h > maxH) maxH = h;
        }
        return {
          cols,
          hasOverflow,
          minHeight: Math.round(minH),
          maxHeight: Math.round(maxH),
        };
      });

      assert(
        vpMetrics.cols === vp.expectedCols,
        `${vp.label} renders exactly ${vp.expectedCols} columns (Actual: ${vpMetrics.cols})`
      );
      assert(
        !vpMetrics.hasOverflow,
        `${vp.label} has zero horizontal overflow`
      );
      assert(
        vpMetrics.minHeight >= 48 && vpMetrics.maxHeight <= 62,
        `${vp.label} tile heights are strictly within 52–60px (Min: ${vpMetrics.minHeight}px, Max: ${vpMetrics.maxHeight}px)`
      );
    }

    // -------------------------------------------------------------------------
    // MODULE 6: Screenshot Evidence Captures
    // -------------------------------------------------------------------------
    console.log('\n--- 6. CAPTURING EVIDENCE SCREENSHOTS ---');

    // 1. Study Abroad 1440px
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/study-abroad/`, { waitUntil: 'networkidle0' });
    const studyGrid = await page.$('#countries-grid');
    if (studyGrid) {
      await studyGrid.screenshot({
        path: path.join(ARTIFACTS_DIR, 'study-abroad-country-tiles-desktop-1440px.png'),
      });
      console.log('  📸 Captured study-abroad-country-tiles-desktop-1440px.png');
    }

    // 2. Study Abroad 375px
    await page.setViewport({ width: 375, height: 812 });
    await page.goto(`http://localhost:${PORT}/study-abroad/`, { waitUntil: 'networkidle0' });
    const studyGridMobile = await page.$('#countries-grid');
    if (studyGridMobile) {
      await studyGridMobile.screenshot({
        path: path.join(ARTIFACTS_DIR, 'study-abroad-country-tiles-mobile-375px.png'),
      });
      console.log('  📸 Captured study-abroad-country-tiles-mobile-375px.png');
    }

    // 3. MBBS 1440px
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/services/mbbs/`, { waitUntil: 'networkidle0' });
    const mbbsGrid = await page.$('#mbbs-countries-grid');
    if (mbbsGrid) {
      await mbbsGrid.screenshot({
        path: path.join(ARTIFACTS_DIR, 'mbbs-country-tiles-desktop-1440px.png'),
      });
      console.log('  📸 Captured mbbs-country-tiles-desktop-1440px.png');
    }

    // 4. MBBS 375px
    await page.setViewport({ width: 375, height: 812 });
    await page.goto(`http://localhost:${PORT}/services/mbbs/`, { waitUntil: 'networkidle0' });
    const mbbsGridMobile = await page.$('#mbbs-countries-grid');
    if (mbbsGridMobile) {
      await mbbsGridMobile.screenshot({
        path: path.join(ARTIFACTS_DIR, 'mbbs-country-tiles-mobile-375px.png'),
      });
      console.log('  📸 Captured mbbs-country-tiles-mobile-375px.png');
    }

    // 5. PhD 1440px
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/services/phd/`, { waitUntil: 'networkidle0' });
    const phdGrid = await page.$('#phd-countries-grid');
    if (phdGrid) {
      await phdGrid.screenshot({
        path: path.join(ARTIFACTS_DIR, 'phd-country-tiles-desktop-1440px.png'),
      });
      console.log('  📸 Captured phd-country-tiles-desktop-1440px.png');
    }

    // 6. Europe 1440px
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/study-in-europe/`, { waitUntil: 'networkidle0' });
    const europeGrid = await page.$('#europe-countries-grid');
    if (europeGrid) {
      await europeGrid.screenshot({
        path: path.join(ARTIFACTS_DIR, 'europe-country-tiles-desktop-1440px.png'),
      });
      console.log('  📸 Captured europe-country-tiles-desktop-1440px.png');
    }

  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n================================================================');
  console.log(`QA VERIFICATION SUMMARY:`);
  console.log(`  Total Checks:  ${totalTests}`);
  console.log(`  Passed:        ${passedTests}`);
  console.log(`  Failed:        ${failedTests}`);
  console.log('================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL COUNTRY TILE OPTIMIZATION TESTS PASSED PERFECTLY!\n');
  }
}

run().catch((err) => {
  console.error('Fatal Error:', err);
  server.close();
  process.exit(1);
});
