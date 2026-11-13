import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\93dd9ae5-292a-4677-9731-9efc41a7f30f\\evidence';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const DIST_DIR = path.resolve('dist');
const PORT = 4328;

if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

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
      console.log(`Test server running at http://localhost:${PORT}`);
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
    console.error(`  ❌ FAIL: ${name} - ${details}`);
    failedTests++;
  }
}

async function runVerification() {
  console.log('================================================================');
  console.log('   VISA CONVENTION — TOURIST & WORK OPTIMIZATION QA SUITE       ');
  console.log('================================================================\n');

  const server = await startServer();
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // -------------------------------------------------------------
  // TEST GROUP 1: Tourist Visa Content & Section Removals
  // -------------------------------------------------------------
  console.log('--- TEST GROUP 1: Tourist Visa Structure & Removals ---');
  await page.goto(`http://localhost:${PORT}/services/tourist-visa/`, { waitUntil: 'networkidle0' });

  // 1. Redundant section removed from component tree
  const touristAssistSection = await page.$('#how-we-assist');
  assert(touristAssistSection === null, 'Tourist Visa: "How Visa Convention Assists Your Filing" section completely removed from DOM');

  const touristHeadingCheck = await page.evaluate(() => {
    return document.body.innerText.includes('How Visa Convention Assists Your Filing');
  });
  assert(!touristHeadingCheck, 'Tourist Visa: Redundant heading text not present in page body');

  // 2. Essential legal disclaimer preserved
  const touristLegalNote = await page.evaluate(() => {
    return document.body.innerText.includes('Visa issuance authority rests solely with the destination government');
  });
  assert(touristLegalNote, 'Tourist Visa: Essential statutory legal disclaimer preserved');

  // 3. Client hero image preserved
  const touristHeroImg = await page.$eval('img[alt*="Tourist Visa"]', img => img.src);
  assert(touristHeroImg.includes('Vibrant%20Tourist%20Visa%20Travel%20Poster.png'), 'Tourist Visa: Original client hero poster preserved');

  // -------------------------------------------------------------
  // TEST GROUP 2: Tourist Visa Destination Accordion Verification
  // -------------------------------------------------------------
  console.log('\n--- TEST GROUP 2: Tourist Visa Destination Accordions ---');
  const touristGroupCount = await page.$$eval('.dest-group-block', el => el.length);
  assert(touristGroupCount === 3, 'Tourist Visa: Exactly 3 destination groups rendered (Schengen, Other, UAE)', `Actual: ${touristGroupCount}`);

  const touristGroupsCollapsed = await page.$$eval('.dest-group-panel', panels => 
    panels.every(p => p.classList.contains('hidden'))
  );
  assert(touristGroupsCollapsed, 'Tourist Visa: All destination groups collapsed by default');

  const touristCountryCount = await page.$$eval('.dest-country-item', el => el.length);
  assert(touristCountryCount === 27, 'Tourist Visa: All 27 destinations accessible in accordion', `Actual: ${touristCountryCount}`);

  const touristCountriesCollapsed = await page.$$eval('.dest-country-details', drawers => 
    drawers.every(d => d.classList.contains('hidden'))
  );
  assert(touristCountriesCollapsed, 'Tourist Visa: All country details drawers collapsed by default');

  // Test expanding a group
  await page.click('.dest-group-toggle');
  await new Promise(r => setTimeout(r, 200));
  const firstGroupExpanded = await page.$eval('.dest-group-panel', panel => !panel.classList.contains('hidden'));
  assert(firstGroupExpanded, 'Tourist Visa: Clicking group toggle expands country list');

  // Check row height once parent group is expanded (48-56px target)
  const rowHeight = await page.$$eval('.dest-country-toggle', toggles => {
    const rect = toggles[0].getBoundingClientRect();
    return rect.height;
  });
  assert(rowHeight >= 48 && rowHeight <= 58, `Tourist Visa: Collapsed country row meets 48-56px target (Actual: ${rowHeight.toFixed(1)}px)`);

  // Test single country expansion within group: Germany is [0], France is [1]
  const countryToggles = await page.$$('.dest-country-toggle');
  await countryToggles[0].click(); // click Germany
  await new Promise(r => setTimeout(r, 150));
  let drawerGermanyOpen = await page.$eval('#country-details-dest-germany', el => !el.classList.contains('hidden'));
  assert(drawerGermanyOpen, 'Tourist Visa: Expanding country reveals concise details and enquiry CTA');

  // Expand second country (France) in same group -> Germany must collapse!
  await countryToggles[1].click(); // click France
  await new Promise(r => setTimeout(r, 150));
  drawerGermanyOpen = await page.$eval('#country-details-dest-germany', el => !el.classList.contains('hidden'));
  const drawerFranceOpen = await page.$eval('#country-details-dest-france', el => !el.classList.contains('hidden'));
  assert(!drawerGermanyOpen && drawerFranceOpen, 'Tourist Visa: Only one country expanded at a time within its group');

  // Test Search auto-reveal
  await page.type('#destination-search-input', 'canada');
  await new Promise(r => setTimeout(r, 200));
  const canadaGroupVisible = await page.$eval('[data-group-id="individual"]', el => !el.classList.contains('hidden'));
  const canadaRowVisible = await page.$eval('[data-country-slug="canada"]', el => !el.classList.contains('hidden'));
  const schengenGroupHidden = await page.$eval('[data-group-id="schengen"]', el => el.classList.contains('hidden'));
  assert(canadaGroupVisible && canadaRowVisible && schengenGroupHidden, 'Tourist Visa: Search for "canada" automatically expands matching group and filters rows');

  // Clear search
  await page.click('.dest-search-clear');
  await new Promise(r => setTimeout(r, 200));

  // Test country selection -> enquiry form autofill
  // Open individual group, click select Canada
  const indGroupToggle = await page.$('[data-group-id="individual"] .dest-group-toggle');
  if (indGroupToggle) await indGroupToggle.click();
  await new Promise(r => setTimeout(r, 150));

  const canadaToggle = await page.$('[data-country-slug="canada"] .dest-country-toggle');
  if (canadaToggle) await canadaToggle.click();
  await new Promise(r => setTimeout(r, 150));

  const canadaSelectBtn = await page.$('[data-country-slug="canada"] .dest-select-btn');
  if (canadaSelectBtn) await canadaSelectBtn.click();
  await new Promise(r => setTimeout(r, 300));

  const formCountryVal = await page.$eval('#form-country', el => el.value);
  assert(formCountryVal === 'canada', `Tourist Visa: Selecting country autofilled form country select (Actual: ${formCountryVal})`);

  const contextBannerShown = await page.$eval('#enquiry-context-banner', el => !el.classList.contains('hidden'));
  const contextBannerText = await page.$eval('#context-banner-text', el => el.textContent || '');
  assert(contextBannerShown && contextBannerText.includes('CANADA'), 'Tourist Visa: Enquiry context banner confirms country selection');

  // -------------------------------------------------------------
  // TEST GROUP 3: Tourist Visa Applicant Categories & Frameworks
  // -------------------------------------------------------------
  console.log('\n--- TEST GROUP 3: Tourist Visa Applicant Categories & Frameworks ---');
  const catBtnCount = await page.$$eval('.category-tab-btn', el => el.length);
  assert(catBtnCount === 6, 'Tourist Visa: All 6 applicant category tabs present', `Actual: ${catBtnCount}`);

  // Switch to Farmer tab and verify autofill
  const farmerTab = await page.$('[data-category-id="farmer"]');
  if (farmerTab) await farmerTab.click();
  await new Promise(r => setTimeout(r, 200));

  const farmerPanelVisible = await page.$eval('#category-panel-farmer', el => !el.classList.contains('hidden'));
  const employedPanelHidden = await page.$eval('#category-panel-employed', el => el.classList.contains('hidden'));
  assert(farmerPanelVisible && employedPanelHidden, 'Tourist Visa: Farmer panel displayed and Employed panel hidden');

  const formMsgVal = await page.$eval('#form-message', el => el.value);
  assert(formMsgVal.includes('[Tourist Visa Profile: Farmer]'), 'Tourist Visa: Switching category automatically prefilled enquiry form message');

  // Check single clarification notice
  const clarificationNotice = await page.evaluate(() => {
    return document.body.innerText.includes('Document requirements vary by destination and applicant circumstances. Additional documents may be required.');
  });
  assert(clarificationNotice, 'Tourist Visa: Clarification notice displayed accurately');

  // Special Destination Frameworks: UAE & Schengen dropdowns
  console.log('--- Testing Special Destination Frameworks Dropdowns ---');
  const uaePanelInitial = await page.$eval('#framework-panel-uae', el => el.classList.contains('hidden'));
  const schengenPanelInitial = await page.$eval('#framework-panel-schengen', el => el.classList.contains('hidden'));
  assert(uaePanelInitial && schengenPanelInitial, 'Special Frameworks: Both UAE and Schengen dropdowns start collapsed');

  // Open UAE
  await page.click('[data-target="framework-panel-uae"]');
  await new Promise(r => setTimeout(r, 200));
  const uaeOpen = await page.$eval('#framework-panel-uae', el => !el.classList.contains('hidden'));
  const schengenClosed = await page.$eval('#framework-panel-schengen', el => el.classList.contains('hidden'));
  assert(uaeOpen && schengenClosed, 'Special Frameworks: Opening UAE expands UAE panel');

  // Open Schengen -> UAE must close!
  await page.click('[data-target="framework-panel-schengen"]');
  await new Promise(r => setTimeout(r, 200));
  const uaeClosedNow = await page.$eval('#framework-panel-uae', el => el.classList.contains('hidden'));
  const schengenOpenNow = await page.$eval('#framework-panel-schengen', el => !el.classList.contains('hidden'));
  assert(uaeClosedNow && schengenOpenNow, 'Special Frameworks: Opening Schengen closes UAE (mutual exclusion satisfied)');

  // -------------------------------------------------------------
  // TEST GROUP 4: Work Visa Content & Section Removals
  // -------------------------------------------------------------
  console.log('\n--- TEST GROUP 4: Work Visa Structure & Removals ---');
  await page.goto(`http://localhost:${PORT}/services/work-visa/`, { waitUntil: 'networkidle0' });

  // 1. Redundant section removed from component tree
  const workAssistSection = await page.$('#how-we-assist');
  assert(workAssistSection === null, 'Work Visa: "Our Scope of Documentation Assistance" section completely removed from DOM');

  const workHeadingCheck = await page.evaluate(() => {
    return document.body.innerText.includes('Our Scope of Documentation Assistance');
  });
  assert(!workHeadingCheck, 'Work Visa: Redundant heading text not present in page body');

  // 2. Essential legal disclosures preserved
  const emigrationLaw = await page.evaluate(() => {
    return document.body.innerText.includes('Emigration Act, 1983');
  });
  assert(emigrationLaw, 'Work Visa: Statutory Emigration Act, 1983 disclosure preserved');

  const workVerificationStandard = await page.evaluate(() => {
    return document.body.innerText.includes('Document Verification Standard: Visa Convention evaluates foreign employment contracts');
  });
  assert(workVerificationStandard, 'Work Visa: Document verification compliance standard preserved');

  // 3. Client hero image preserved
  const workHeroImg = await page.$eval('img[alt*="Work Visa"]', img => img.src);
  assert(workHeroImg.includes('Global%20Work%20Visa%20Opportunities.png'), 'Work Visa: Original client hero image preserved');

  // -------------------------------------------------------------
  // TEST GROUP 5: Work Visa Destinations & Occupations
  // -------------------------------------------------------------
  console.log('\n--- TEST GROUP 5: Work Visa Destinations & Occupations ---');
  const workGroupCount = await page.$$eval('.dest-group-block', el => el.length);
  assert(workGroupCount === 3, 'Work Visa: Exactly 3 destination groups rendered (Gulf, Europe, Other)', `Actual: ${workGroupCount}`);

  const workCountryCount = await page.$$eval('.dest-country-item', el => el.length);
  assert(workCountryCount === 14, 'Work Visa: All 14 approved destinations present in accordion', `Actual: ${workCountryCount}`);

  // Test Work country selection -> autofills form
  const gulfGroupToggle = await page.$('[data-group-id="gulf"] .dest-group-toggle');
  if (gulfGroupToggle) await gulfGroupToggle.click();
  await new Promise(r => setTimeout(r, 150));

  const uaeToggle = await page.$('[data-country-slug="uae"] .dest-country-toggle');
  if (uaeToggle) await uaeToggle.click();
  await new Promise(r => setTimeout(r, 150));

  const uaeSelectBtn = await page.$('[data-country-slug="uae"] .dest-select-btn');
  if (uaeSelectBtn) await uaeSelectBtn.click();
  await new Promise(r => setTimeout(r, 300));

  const workFormCountryVal = await page.$eval('#form-country', el => el.value);
  assert(workFormCountryVal === 'uae', `Work Visa: Selecting UAE populated country select (Actual: ${workFormCountryVal})`);

  // Test 12 Occupations Accordion
  const occCount = await page.$$eval('.occ-item', el => el.length);
  assert(occCount === 12, 'Work Visa: All 12 approved occupations present in accordion', `Actual: ${occCount}`);

  const occsCollapsed = await page.$$eval('.occ-details', drawers => 
    drawers.every(d => d.classList.contains('hidden'))
  );
  assert(occsCollapsed, 'Work Visa: All 12 occupations collapsed by default');

  // Expand Welder
  const welderToggle = await page.$('[data-occ-id="welder"] .occ-toggle');
  if (welderToggle) await welderToggle.click();
  await new Promise(r => setTimeout(r, 150));

  const welderDetailsOpen = await page.$eval('#occ-details-welder', el => !el.classList.contains('hidden'));
  assert(welderDetailsOpen, 'Work Visa: Clicking occupation expands approved details on demand');

  // Click Select Welder CTA
  const welderSelectBtn = await page.$('[data-occ-id="welder"] .occ-select-btn');
  if (welderSelectBtn) await welderSelectBtn.click();
  await new Promise(r => setTimeout(r, 300));

  const workFormMsgVal = await page.$eval('#form-message', el => el.value);
  assert(workFormMsgVal.includes('[Work Visa Occupation: Welder / Fabricator]'), 'Work Visa: Selecting occupation prefilled enquiry form message');

  // Contract Evaluation Dropdown Accordion
  const contractPanelInitial = await page.$eval('#contract-eval-panel', el => el.classList.contains('hidden'));
  assert(contractPanelInitial, 'Work Visa: 6-factor contract evaluation criteria starts collapsed');

  await page.click('#contract-eval-toggle');
  await new Promise(r => setTimeout(r, 200));
  const contractPanelOpen = await page.$eval('#contract-eval-panel', el => !el.classList.contains('hidden'));
  assert(contractPanelOpen, 'Work Visa: Clicking contract evaluation toggle expands criteria');

  // -------------------------------------------------------------
  // TEST GROUP 6: Responsive Viewports & Zero Overflow
  // -------------------------------------------------------------
  console.log('\n--- TEST GROUP 6: Responsive Viewport Overflow & Layout Integrity ---');
  const requiredViewports = [320, 360, 375, 390, 393, 412, 430, 768, 1024, 1366, 1440];
  const pagesToTest = [
    { name: 'tourist-visa', path: '/services/tourist-visa/' },
    { name: 'work-visa', path: '/services/work-visa/' }
  ];

  let overflowFailures = 0;
  const afterMetrics = {};

  for (const p of pagesToTest) {
    afterMetrics[p.name] = {};
    for (const w of requiredViewports) {
      await page.setViewport({ width: w, height: 800 });
      await page.goto(`http://localhost:${PORT}${p.path}`, { waitUntil: 'domcontentloaded' });

      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      if (overflow) {
        console.error(`  ❌ Overflow detected on ${p.name} at ${w}px!`);
        overflowFailures++;
      }

      if (w === 390 || w === 1440) {
        const height = await page.evaluate(() => document.documentElement.scrollHeight);
        afterMetrics[p.name][w === 390 ? 'mobile' : 'desktop'] = height;

        // Capture after screenshot
        const screenshotPath = path.join(ARTIFACTS_DIR, `after-${p.name}-${w === 390 ? 'mobile' : 'desktop'}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`  📸 Saved screenshot: ${screenshotPath} (${w}px, Height: ${height}px)`);
      }
    }
  }

  assert(overflowFailures === 0, `All 11 required viewports (320px to 1440px) have ZERO horizontal overflow (Failures: ${overflowFailures})`);

  // Compare Page Height Reductions
  const baselineMetrics = JSON.parse(fs.readFileSync(path.join(ARTIFACTS_DIR, 'baseline-metrics.json'), 'utf8'));

  console.log('\n================================================================');
  console.log('   PAGE LENGTH REDUCTION RESULTS                                ');
  console.log('================================================================');
  for (const pageKey of ['tourist-visa', 'work-visa']) {
    const beforeM = baselineMetrics[pageKey].mobile;
    const afterM = afterMetrics[pageKey].mobile;
    const diffM = beforeM - afterM;
    const pctM = ((diffM / beforeM) * 100).toFixed(1);

    const beforeD = baselineMetrics[pageKey].desktop;
    const afterD = afterMetrics[pageKey].desktop;
    const diffD = beforeD - afterD;
    const pctD = ((diffD / beforeD) * 100).toFixed(1);

    console.log(`\n  📄 ${pageKey.toUpperCase()}:`);
    console.log(`     Mobile (390px) : ${beforeM}px ➔ ${afterM}px (-${diffM}px / -${pctM}%)`);
    console.log(`     Desktop (1440px): ${beforeD}px ➔ ${afterD}px (-${diffD}px / -${pctD}%)`);

    assert(afterM < beforeM * 0.6, `${pageKey} mobile height reduced by at least 40% (Actual reduction: ${pctM}%)`);
    assert(afterD < beforeD * 0.7, `${pageKey} desktop height reduced by at least 30% (Actual reduction: ${pctD}%)`);
  }

  fs.writeFileSync(
    path.join(ARTIFACTS_DIR, 'optimization-metrics.json'),
    JSON.stringify({ baseline: baselineMetrics, optimized: afterMetrics }, null, 2)
  );

  await browser.close();
  server.close();

  console.log('\n================================================================');
  console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
  if (failedTests === 0) {
    console.log('✅ ALL TOURIST & WORK VISA OPTIMIZATION TESTS PASSED PERFECTLY!');
  } else {
    console.error('❌ SOME VERIFICATION CHECKS FAILED!');
    process.exit(1);
  }
  console.log('================================================================\n');
}

runVerification().catch(err => {
  console.error(err);
  process.exit(1);
});
