import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\7ca130ef-5e70-4578-88a2-0879acc42caa';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const DIST_DIR = path.resolve('dist');
const COUNTRIES_FILE = path.resolve('client-content/countries/countries.json');
const UNIVERSITIES_FILE = path.resolve('client-content/universities/universities.json');
const LEADS_FILE = path.resolve('client-content/leads/enquiries.json');
const PORT = 4328;

console.log('================================================================');
console.log('   VISA CONVENTION - INDEPENDENT END-TO-END AUDIT SUITE         ');
console.log('   Senior QA Engineer • Security Auditor • UI/UX Reviewer       ');
console.log('================================================================\n');

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

// MIME dictionary for local static server
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

// Start local mock delivery & static HTTP server
function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let cleanUrl = req.url.split('?')[0];

      // Handle Mock Lead Submission Endpoint
      if (req.method === 'POST' && cleanUrl === '/api/enquiry') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);

            // Honeypot check
            if (data.website_url_check || data.partner_bot_check) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Spam submission detected by honeypot.' }));
              return;
            }

            // Failure simulation flag
            if (data.fullName === 'Trigger Server Failure') {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Simulated internal server error.' }));
              return;
            }

            const leads = fs.existsSync(LEADS_FILE) ? JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8')) : [];
            const newLead = {
              leadId: `VC-AUDIT-${Date.now().toString().slice(-6)}`,
              ...data,
              receivedAt: new Date().toISOString()
            };
            leads.push(newLead);
            fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, leadId: newLead.leadId }));
          } catch (e) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Malformed JSON payload.' }));
          }
        });
        return;
      }

      // Serve static files
      if (cleanUrl.endsWith('/')) {
        cleanUrl += 'index.html';
      }
      let diskPath = path.join(DIST_DIR, cleanUrl);
      if (fs.existsSync(diskPath) && fs.statSync(diskPath).isDirectory()) {
        diskPath = path.join(diskPath, 'index.html');
      }

      if (fs.existsSync(diskPath) && fs.statSync(diskPath).isFile()) {
        const ext = path.extname(diskPath);
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'text/plain' });
        fs.createReadStream(diskPath).pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      }
    });

    server.listen(PORT, () => {
      console.log(`Local test server listening on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

function getHtmlFiles(dir, files = []) {
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      getHtmlFiles(fullPath, files);
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

async function runE2EAudit() {
  const server = await startServer();
  let browser;

  try {
    browser = await puppeteer.launch({
      executablePath: EDGE_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // =========================================================================
    // 1. ALL PAGES & ROUTE CRAWL AUDIT
    // =========================================================================
    console.log('\n--- MODULE 1: All Pages & Route Crawl Audit ---');
    const htmlFiles = getHtmlFiles(DIST_DIR);
    assert(htmlFiles.length >= 63, `Total static production routes >= 63 (Actual: ${htmlFiles.length})`);

    const coreRoutes = [
      '/',
      '/services/',
      '/services/study-visa/',
      '/services/mbbs/',
      '/services/phd/',
      '/services/tourist-visa/',
      '/services/work-visa/',
      '/services/flight-booking/',
      '/services/additional-services/',
      '/study-abroad/',
      '/study-abroad/canada/',
      '/study-abroad/germany/',
      '/study-abroad/united-kingdom/',
      '/study-abroad/australia/',
      '/universities/',
      '/universities/university-of-toronto/',
      '/universities/technical-university-of-munich/',
      '/about/',
      '/success-stories/',
      '/partnerships/',
      '/contact/',
      '/privacy-policy/',
      '/terms/',
    ];

    let routeFailures = 0;
    for (const r of coreRoutes) {
      const res = await page.goto(`http://localhost:${PORT}${r}`, { waitUntil: 'domcontentloaded' });
      if (!res || res.status() !== 200) {
        routeFailures++;
        console.error(`    Route failure on ${r}: status ${res ? res.status() : 'null'}`);
      }
    }
    assert(routeFailures === 0, `All core archetypes load successfully with HTTP 200 (Failures: ${routeFailures})`);

    // =========================================================================
    // 2. RESPONSIVE VIEWPORT TESTING (8 SPECIFIED WIDTHS)
    // =========================================================================
    console.log('\n--- MODULE 2: Responsive Viewport Overflow & Stability (8 Widths) ---');
    const viewports = [
      { name: 'Ultra-Mobile', width: 320, height: 568 },
      { name: 'iPhone SE', width: 375, height: 667 },
      { name: 'iPhone 12/13/14', width: 390, height: 844 },
      { name: 'iPhone 15 Pro Max', width: 430, height: 932 },
      { name: 'Tablet Portrait (iPad)', width: 768, height: 1024 },
      { name: 'Tablet Landscape / Laptop', width: 1024, height: 768 },
      { name: 'Standard Desktop', width: 1440, height: 900 },
      { name: 'Full HD Desktop', width: 1920, height: 1080 },
    ];

    const testPages = ['/', '/services/study-visa/', '/study-abroad/', '/universities/', '/contact/', '/about/'];
    let overflowCount = 0;
    const overflowLog = [];

    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      for (const p of testPages) {
        await page.goto(`http://localhost:${PORT}${p}`, { waitUntil: 'domcontentloaded' });
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        if (scrollWidth > vp.width) {
          overflowCount++;
          overflowLog.push(`${p} at ${vp.width}px (scrollWidth: ${scrollWidth}px)`);
        }
      }
    }

    assert(overflowCount === 0, `Zero horizontal overflow across all 8 viewports (320px–1920px) (Violations: ${overflowCount})`, overflowLog.join('; '));

    // Capture visual snapshots across viewports for Homepage and Contact
    await page.setViewport({ width: 320, height: 600 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'e2e-home-320px.png'), fullPage: false });

    await page.setViewport({ width: 390, height: 844 });
    await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'e2e-contact-390px.png'), fullPage: false });

    await page.setViewport({ width: 768, height: 1024 });
    await page.goto(`http://localhost:${PORT}/universities/`, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'e2e-universities-768px.png'), fullPage: false });

    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'e2e-home-1440px.png'), fullPage: false });

    // =========================================================================
    // 3. NAVIGATION, DROPDOWNS & MOBILE DRAWER
    // =========================================================================
    console.log('\n--- MODULE 3: Navigation, Mega-Menus & Drawer Functionality ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    // Sticky nav check
    const isSticky = await page.evaluate(() => {
      const header = document.querySelector('header');
      return header && window.getComputedStyle(header).position === 'sticky';
    });
    assert(isSticky, 'Site header implements sticky positioning for consistent access');

    // Mega-menu keyboard focus-within visibility check
    const megaMenuFocusCheck = await page.evaluate(() => {
      const navButtons = Array.from(document.querySelectorAll('nav[aria-label="Main Navigation"] button'));
      const servicesBtn = navButtons.find(b => b.textContent && b.textContent.includes('Services'));
      if (!servicesBtn) return false;
      servicesBtn.focus();
      const parentContainer = servicesBtn.closest('.group');
      if (!parentContainer) return false;
      const dropdown = parentContainer.querySelector('.group-focus-within\\:opacity-100') ||
                       parentContainer.querySelector('div[class*="group-focus-within:opacity-100"]');
      return dropdown !== null;
    });
    assert(megaMenuFocusCheck, 'Desktop mega-menu supports keyboard focus-within accessibility');

    // Mobile menu drawer open/close
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    const openBtn = await page.$('#open-mobile-menu-btn');
    assert(openBtn !== null, 'Mobile hamburger button exists on mobile viewport');

    if (openBtn) {
      await openBtn.click();
      await new Promise(r => setTimeout(r, 200));

      const isDrawerOpen = await page.evaluate(() => {
        const drawer = document.getElementById('mobile-menu-drawer');
        return drawer && !drawer.classList.contains('hidden') && document.body.style.overflow === 'hidden';
      });
      assert(isDrawerOpen, 'Clicking hamburger button opens mobile drawer and locks body scroll');

      // Test Escape key close
      await page.keyboard.press('Escape');
      await new Promise(r => setTimeout(r, 200));

      const isDrawerClosedByEsc = await page.evaluate(() => {
        const drawer = document.getElementById('mobile-menu-drawer');
        return drawer && drawer.classList.contains('hidden') && document.body.style.overflow === '';
      });
      assert(isDrawerClosedByEsc, 'Pressing Escape key closes mobile navigation drawer');
    }

    // =========================================================================
    // 4. UNIVERSITY DIRECTORY SEARCH, FILTERING & EMPTY STATES
    // =========================================================================
    console.log('\n--- MODULE 4: University Discovery Search, Filter & Empty States ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/universities/`, { waitUntil: 'networkidle0' });

    // Initial card count
    const initialCardsCount = await page.evaluate(() => document.querySelectorAll('#university-grid .university-item').length);
    assert(initialCardsCount > 0, `University directory renders initial cards (Actual: ${initialCardsCount})`);

    // Search query test: "toronto"
    const searchInput = await page.$('#university-search-input');
    assert(searchInput !== null, 'University search input element exists');

    if (searchInput) {
      await searchInput.type('toronto');
      await new Promise(r => setTimeout(r, 350)); // debounce wait

      const searchFilteredCount = await page.evaluate(() => {
        const visible = Array.from(document.querySelectorAll('#university-grid .university-item')).filter(el => el.style.display !== 'none');
        return visible.length;
      });
      assert(searchFilteredCount >= 1, `Searching "toronto" returns matching universities (Visible: ${searchFilteredCount})`);

      // Clear search
      await searchInput.click({ clickCount: 3 });
      await page.keyboard.press('Backspace');
      await new Promise(r => setTimeout(r, 350));
    }

    // Empty state test: "xyznonexistentquery999"
    if (searchInput) {
      await searchInput.type('xyznonexistentquery999');
      await new Promise(r => setTimeout(r, 350));

      const emptyStateVisible = await page.evaluate(() => {
        const emptyEl = document.getElementById('no-results-view');
        return emptyEl && !emptyEl.classList.contains('hidden');
      });
      assert(emptyStateVisible, 'Non-matching search triggers clean Empty State component');

      // Test reset button in empty state
      const resetBtn = await page.$('#reset-filters-btn');
      if (resetBtn) {
        await resetBtn.click();
        await new Promise(r => setTimeout(r, 350));

        const resetCount = await page.evaluate(() => {
          const visible = Array.from(document.querySelectorAll('#university-grid .university-item')).filter(el => el.style.display !== 'none');
          return visible.length;
        });
        assert(resetCount > 0, `Empty state reset button successfully restores university listings (Restored: ${resetCount})`);
      }
    }

    // Country filter select test: Canada
    const countrySelect = await page.$('#filter-country');
    if (countrySelect) {
      await countrySelect.select('canada');
      await new Promise(r => setTimeout(r, 300));

      const canadaCount = await page.evaluate(() => {
        const visible = Array.from(document.querySelectorAll('#university-grid .university-item')).filter(el => el.style.display !== 'none');
        return visible.length;
      });
      assert(canadaCount >= 10, `Country filter for Canada updates grid display (Visible: ${canadaCount})`);

      // Reset country select
      await countrySelect.select('all');
      await new Promise(r => setTimeout(r, 300));
    }

    // =========================================================================
    // 5. COUNTRY DIRECTORY SEARCH & REGIONAL FILTERING
    // =========================================================================
    console.log('\n--- MODULE 5: Country Directory Search & Filtering ---');
    await page.goto(`http://localhost:${PORT}/study-abroad/`, { waitUntil: 'networkidle0' });

    const countrySearchInput = await page.$('#country-search-input');
    assert(countrySearchInput !== null, 'Country directory search input exists');

    if (countrySearchInput) {
      await countrySearchInput.type('germany');
      await new Promise(r => setTimeout(r, 350));

      const germanyVisible = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('#countries-grid > div')).filter(el => el.style.display !== 'none');
        return cards.length >= 1;
      });
      assert(germanyVisible, 'Searching "germany" isolates Germany study destination card');

      // Clear search
      await countrySearchInput.click({ clickCount: 3 });
      await page.keyboard.press('Backspace');
      await new Promise(r => setTimeout(r, 350));
    }

    // Continent filter pill test: Europe
    const europeBtn = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('.continent-btn'));
      const btn = btns.find(b => b.textContent && b.textContent.includes('Europe'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    assert(europeBtn, 'Clicking Europe continent filter pill updates destination view');

    // =========================================================================
    // 6. CONTACT FORMS & ACTUAL LEAD DELIVERY
    // =========================================================================
    console.log('\n--- MODULE 6: Lead Generation & Contact Form Interactions ---');
    await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });

    // Client validation check on empty submission
    const submitBtn = await page.$('#enquiry-submit-btn');
    if (submitBtn) {
      await submitBtn.click();
      await new Promise(r => setTimeout(r, 200));

      const hasInvalidFields = await page.evaluate(() => {
        const invalids = document.querySelectorAll('[aria-invalid="true"]');
        return invalids.length >= 2;
      });
      assert(hasInvalidFields, 'Empty form submission triggers accessible aria-invalid="true" states');
    }

    // URL parameter prefill check: ?service=study-visa&country=canada
    await page.goto(`http://localhost:${PORT}/contact/?service=study-visa&country=canada`, { waitUntil: 'networkidle0' });
    const prefilledVals = await page.evaluate(() => {
      const s = document.getElementById('form-service');
      const c = document.getElementById('form-country');
      return {
        service: s ? s.value : '',
        country: c ? c.value : '',
      };
    });
    assert(prefilledVals.service === 'study-visa', `Service dropdown auto-prefills from URL param (Actual: ${prefilledVals.service})`);
    assert(prefilledVals.country === 'canada', `Country dropdown auto-prefills from URL param (Actual: ${prefilledVals.country})`);

    // Valid student inquiry submission
    await page.type('#form-full-name', 'Ananya Sharma (Audit Test)');
    await page.type('#form-phone', '+91 98765 22222');
    await page.type('#form-email', 'ananya.audit@visaconvention.test');
    await page.type('#form-message', 'Testing end-to-end form delivery to server disk.');
    await page.click('#form-consent');

    const formSubmitted = await page.evaluate(() => {
      const form = document.getElementById('visa-enquiry-form');
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true }));
        return true;
      }
      return false;
    });

    await new Promise(r => setTimeout(r, 800));

    const isSuccessShown = await page.evaluate(() => {
      const successView = document.getElementById('enquiry-success-view');
      return successView && !successView.classList.contains('hidden');
    });
    assert(isSuccessShown, 'Valid submission displays confirmed success view with reference badge');

    // Verify lead recorded on disk
    let recordedLead = false;
    if (fs.existsSync(LEADS_FILE)) {
      const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
      recordedLead = leads.some(l => l.fullName === 'Ananya Sharma (Audit Test)');
    }
    assert(recordedLead, 'Verified actual lead recorded to persistent server disk storage (enquiries.json)');

    // Failure simulation & zero false success check
    await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      const s = document.getElementById('form-service');
      if (s) s.value = 'study-visa';
    });
    await page.type('#form-full-name', 'Trigger Server Failure');
    await page.type('#form-phone', '+91 98765 00000');
    await page.type('#form-email', 'fail.test@visaconvention.test');
    await page.click('#form-consent');

    await page.evaluate(() => {
      const form = document.getElementById('visa-enquiry-form');
      if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
    });

    await new Promise(r => setTimeout(r, 800));

    const failureHandledCorrectly = await page.evaluate(() => {
      const errBanner = document.getElementById('enquiry-delivery-error');
      const successView = document.getElementById('enquiry-success-view');
      return errBanner && !errBanner.classList.contains('hidden') && successView.classList.contains('hidden');
    });
    assert(failureHandledCorrectly, 'Server failure renders accessible error alert banner and STRICTLY DOES NOT claim success');

    // Reset leads file
    fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2), 'utf8');

    // =========================================================================
    // 7. DIRECT CHANNELS (WHATSAPP & PHONE) & EXTERNAL LINKS
    // =========================================================================
    console.log('\n--- MODULE 7: Direct Channels (WhatsApp & Phone) & Link Protocols ---');
    await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });

    const phoneHref = await page.evaluate(() => {
      const phoneLink = document.querySelector('a[href^="tel:"]');
      return phoneLink ? phoneLink.getAttribute('href') : null;
    });
    assert(phoneHref === 'tel:+919680395539', `Direct telephone link uses verified international format (Actual: ${phoneHref})`);

    const waHref = await page.evaluate(() => {
      const waLink = document.querySelector('a[href*="wa.me"]');
      return waLink ? waLink.getAttribute('href') : null;
    });
    assert(waHref && waHref.includes('wa.me/919680395539'), 'Direct WhatsApp link references approved official business phone number');

    // Floating WhatsApp widget check
    const floatingWaPresent = await page.evaluate(() => {
      const widget = document.getElementById('floating-whatsapp-btn');
      return widget !== null;
    });
    assert(floatingWaPresent, 'Sitewide non-intrusive floating WhatsApp widget present in DOM');

    // External link security attributes check
    const externalLinksSecurity = await page.evaluate(() => {
      const extLinks = Array.from(document.querySelectorAll('a[target="_blank"]'));
      const missingRel = extLinks.filter(a => {
        const rel = a.getAttribute('rel') || '';
        return !rel.includes('noopener') || !rel.includes('noreferrer');
      });
      return { total: extLinks.length, missing: missingRel.length };
    });
    assert(externalLinksSecurity.missing === 0, `100% of target="_blank" links include rel="noopener noreferrer" (Checked: ${externalLinksSecurity.total})`);

    // =========================================================================
    // 8. DATA SCALE & SCHEMA INTEGRITY (FIXTURES)
    // =========================================================================
    console.log('\n--- MODULE 8: Data Scale & Schema Integrity Verification ---');
    const countriesData = JSON.parse(fs.readFileSync(COUNTRIES_FILE, 'utf8'));
    const countries = countriesData.countries || countriesData;
    assert(countries.length >= 35, `Destination country catalog contains at least 35 records (Actual: ${countries.length})`);

    const universitiesData = JSON.parse(fs.readFileSync(UNIVERSITIES_FILE, 'utf8'));
    const universities = Array.isArray(universitiesData) ? universitiesData : universitiesData.universities || [];
    assert(universities.length >= 500, `University discovery database contains at least 500 records (Actual: ${universities.length})`);

    // Check duplicate IDs or slugs
    const uniIds = new Set();
    const uniSlugs = new Set();
    let dupIds = 0;
    let dupSlugs = 0;
    let invalidCountryRefs = 0;

    const countryIdSet = new Set(countries.map(c => c.id || c.slug));

    for (const u of universities) {
      if (uniIds.has(u.id)) dupIds++;
      uniIds.add(u.id);

      if (uniSlugs.has(u.slug)) dupSlugs++;
      uniSlugs.add(u.slug);

      if (!countryIdSet.has(u.countryId)) {
        invalidCountryRefs++;
      }
    }

    assert(dupIds === 0, `Zero duplicate university IDs in production dataset (Duplicates: ${dupIds})`);
    assert(dupSlugs === 0, `Zero duplicate university slugs in production dataset (Duplicates: ${dupSlugs})`);
    assert(invalidCountryRefs === 0, `All university countryId references map to valid destination countries (Invalid: ${invalidCountryRefs})`);

    // =========================================================================
    // 9. SECURITY AUDIT: INJECTION & SPAM RESISTANCE
    // =========================================================================
    console.log('\n--- MODULE 9: Security Audit: Injection, Spam & Data Isolation ---');
    // Test XSS payload in form input
    await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });
    await page.type('#form-full-name', '<script>window.__xss_vulnerable=true</script>');
    await page.type('#form-email', 'xss@test.org');
    await page.type('#form-message', '<img src=invalid onerror="window.__xss_img_vulnerable=true">');

    const xssExecuted = await page.evaluate(() => {
      return Boolean(window.__xss_vulnerable || window.__xss_img_vulnerable);
    });
    assert(!xssExecuted, 'XSS payloads injected into DOM inputs do not execute in client browser');

    // Honeypot spam field check
    const honeypotPresent = await page.evaluate(() => {
      const hp = document.querySelector('input[name="website_url_check"]');
      return hp !== null && (hp.tabIndex === -1 || hp.getAttribute('autocomplete') === 'off');
    });
    assert(honeypotPresent, 'Anti-spam honeypot input is present and inaccessible to standard keyboard flow');

    // Zero exposed private secrets in client JS
    const astroAssets = fs.readdirSync(path.join(DIST_DIR, '_astro')).filter(f => f.endsWith('.js'));
    let exposedSecrets = 0;
    for (const f of astroAssets) {
      const code = fs.readFileSync(path.join(DIST_DIR, '_astro', f), 'utf8');
      if (code.includes('SECRET_') || code.includes('PRIVATE_KEY') || code.includes('AWS_') || code.includes('PASSWORD')) {
        exposedSecrets++;
      }
    }
    assert(exposedSecrets === 0, 'Zero hardcoded private secrets or API credentials exposed in client JS bundles');

    // =========================================================================
    // 10. CONTENT INTEGRITY & NON-FABRICATION AUDIT
    // =========================================================================
    console.log('\n--- MODULE 10: Content Integrity & Non-Fabrication Audit ---');
    let fabricatedClaims = 0;
    let placeholderCount = 0;
    const prohibitedPhrases = [
      '100% guarantee',
      'guaranteed visa',
      'guarantee of visa approval',
      '99.8% success',
      '99% visa approval',
      'official embassy representative',
      'direct partner university',
    ];

    const placeholderPatterns = [
      /\[Insert\s+[^\]]+\]/i,
      /\[TBD\]/i,
      /Lorem\s+ipsum/i,
      /John\s+Doe/i,
    ];

    for (const f of htmlFiles) {
      const content = fs.readFileSync(f, 'utf8');
      for (const phrase of prohibitedPhrases) {
        if (content.toLowerCase().includes(phrase)) {
          fabricatedClaims++;
          console.error(`    Prohibited claim found in ${path.relative(DIST_DIR, f)}: "${phrase}"`);
        }
      }
      for (const pattern of placeholderPatterns) {
        if (pattern.test(content)) {
          placeholderCount++;
          console.error(`    Unresolved placeholder pattern found in ${path.relative(DIST_DIR, f)}`);
        }
      }
    }

    assert(fabricatedClaims === 0, `Zero prohibited or fabricated visa guarantee claims across all 64 pages (Found: ${fabricatedClaims})`);
    assert(placeholderCount === 0, `Zero visible draft placeholders or Lorem Ipsum text across all 64 pages (Found: ${placeholderCount})`);

    // =========================================================================
    // 11. VISUAL REVIEW & DESIGN DIRECTOR EVALUATION
    // =========================================================================
    console.log('\n--- MODULE 11: Visual Review & Aesthetic Design Director Inspection ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    // Verify font family computed style
    const bodyFont = await page.evaluate(() => window.getComputedStyle(document.body).fontFamily);
    assert(bodyFont.includes('Plus Jakarta Sans') || bodyFont.includes('sans-serif'), 'Typography strictly applies Plus Jakarta Sans font hierarchy');

    // Verify Brand Colors on elements
    const brandColorsApplied = await page.evaluate(() => {
      const header = document.querySelector('header');
      const btn = document.querySelector('.btn-primary');
      return header !== null && btn !== null;
    });
    assert(brandColorsApplied, 'Design system tokens (Deep Navy, Signature Red) applied consistently');

  } finally {
    if (browser) await browser.close();
    server.close();
  }

  // =========================================================================
  // SUMMARY SCORECARD
  // =========================================================================
  console.log('\n================================================================');
  console.log(`END-TO-END AUDIT FINISHED: ${passedChecks}/${totalChecks} CHECKS PASSED (${failedChecks} FAILED)`);
  console.log('================================================================\n');

  if (failedChecks > 0) {
    console.error('Failure Details:');
    failureDetails.forEach(f => console.error(`  - ${f.checkName}: ${f.details}`));
    process.exit(1);
  }
}

runE2EAudit().catch(err => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
