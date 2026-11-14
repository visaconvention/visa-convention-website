import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\5db0c23b-424d-42d8-acd3-62fb5a754759\\screenshots';
const PORT = 4371;

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
  console.log('    VISA CONVENTION — VISA SERVICES NAVIGATION REFINEMENT QA    ');
  console.log('================================================================\n');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // 1. DESKTOP NAVIGATION CHECKS
    console.log('--- 1. VERIFYING DESKTOP VISA SERVICES DROPDOWN ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    // Hover over the Visa Services menu button
    const visaBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('nav button'));
      return btns.find(b => b.textContent && b.textContent.includes('Visa Services'));
    });

    assert(visaBtn !== null, 'Visa Services button exists in Desktop Navigation');

    if (visaBtn) {
      await visaBtn.hover();
      await new Promise(r => setTimeout(r, 400));
    }

    const desktopNavAnalysis = await page.evaluate(() => {
      // Find the Visa Services dropdown
      const dropdowns = Array.from(document.querySelectorAll('nav .group'));
      const visaGroup = dropdowns.find(g => g.querySelector('button')?.textContent.includes('Visa Services'));
      if (!visaGroup) return { foundGroup: false };

      const dropdownEl = visaGroup.querySelector('div.absolute');
      const text = dropdownEl ? dropdownEl.innerText : '';
      const links = dropdownEl ? Array.from(dropdownEl.querySelectorAll('a')).map(a => ({
        text: a.innerText.trim(),
        href: a.getAttribute('href'),
      })) : [];

      const rect = dropdownEl ? dropdownEl.getBoundingClientRect() : null;

      return {
        foundGroup: true,
        text,
        links,
        rect: rect ? { width: Math.round(rect.width), height: Math.round(rect.height) } : null,
      };
    });

    assert(desktopNavAnalysis.foundGroup, 'Found Visa Services dropdown group in desktop navigation');
    assert(!desktopNavAnalysis.text.includes('All Services Overview'),
      'Item 1: "All Services Overview" completely excised from desktop dropdown');
    assert(!desktopNavAnalysis.text.includes('Comparative matrix of all'),
      'Item 1: Description "Comparative matrix of all 7 service verticals" completely excised from desktop dropdown');
    assert(!desktopNavAnalysis.text.includes('Compare Services'),
      'Item 2: "Compare Services →" completely excised from desktop dropdown header');

    // Verify 3 preserved services in dropdown
    const touristLink = desktopNavAnalysis.links.find(l => l.href === '/services/tourist-visa/');
    assert(touristLink && touristLink.text.includes('Tourist & Visitor Visa'),
      'Preserved: "Tourist & Visitor Visa" link intact (/services/tourist-visa/)');

    const workLink = desktopNavAnalysis.links.find(l => l.href === '/services/work-visa/');
    assert(workLink && workLink.text.includes('Work Visa Support'),
      'Preserved: "Work Visa Support" link intact (/services/work-visa/)');

    const additionalLink = desktopNavAnalysis.links.find(l => l.href === '/services/additional-services/');
    assert(additionalLink && additionalLink.text.includes('Additional Services'),
      'Preserved: "Additional Services" link intact (/services/additional-services/)');

    // Verify total direct service links in dropdown is exactly 3
    const directServiceLinks = desktopNavAnalysis.links.filter(l => l.href.startsWith('/services/'));
    assert(directServiceLinks.length === 3,
      `Dropdown contains exactly 3 direct service links (Found: ${directServiceLinks.length})`);

    // Verify bottom action link
    const consultationLink = desktopNavAnalysis.links.find(l => l.href === '/contact/');
    assert(consultationLink && consultationLink.text.includes('Book Desk Consultation'),
      'Bottom bar: "Book Desk Consultation →" intact');

    console.log(`  Dropdown dimensions: ${desktopNavAnalysis.rect?.width}px wide × ${desktopNavAnalysis.rect?.height}px tall`);
    assert(desktopNavAnalysis.rect && desktopNavAnalysis.rect.width >= 400 && desktopNavAnalysis.rect.width <= 440,
      `Dropdown width is rebalanced and compact (${desktopNavAnalysis.rect?.width}px)`);

    // 2. MOBILE NAVIGATION DRAWER CHECKS
    console.log('\n--- 2. VERIFYING MOBILE NAVIGATION DRAWER ---');
    await page.setViewport({ width: 375, height: 750, isMobile: true, hasTouch: true });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    // Open mobile menu drawer
    await page.click('#open-mobile-menu-btn');
    await new Promise(r => setTimeout(r, 400));

    const mobileDrawerAnalysis = await page.evaluate(() => {
      const drawer = document.getElementById('mobile-menu-drawer');
      if (!drawer) return { foundDrawer: false };

      // Find the Visa Services group inside the drawer
      const groups = Array.from(drawer.querySelectorAll('.border-b'));
      const visaGroup = groups.find(g => g.querySelector('span')?.textContent.trim() === 'Visa Services');
      if (!visaGroup) return { foundDrawer: true, foundVisaGroup: false };

      const links = Array.from(visaGroup.querySelectorAll('a')).map(a => ({
        text: a.innerText.trim(),
        href: a.getAttribute('href'),
      }));

      const text = visaGroup.innerText;

      return {
        foundDrawer: true,
        foundVisaGroup: true,
        text,
        links,
      };
    });

    assert(mobileDrawerAnalysis.foundDrawer, 'Mobile menu drawer opens cleanly');
    assert(mobileDrawerAnalysis.foundVisaGroup, 'Found Visa Services group in mobile drawer');
    assert(!mobileDrawerAnalysis.text.includes('All Services Overview'),
      'Item 1: "All Services Overview" completely excised from mobile drawer');
    assert(!mobileDrawerAnalysis.text.includes('Compare Services'),
      'Item 2: "Compare Services" completely absent from mobile drawer');

    // Child links in mobile drawer
    const mobileChildLinks = mobileDrawerAnalysis.links.filter(l => l.href !== '/services/');
    assert(mobileChildLinks.length === 3,
      `Mobile drawer contains exactly 3 child service links (Found: ${mobileChildLinks.length})`);
    assert(mobileChildLinks.some(l => l.href === '/services/tourist-visa/' && l.text.includes('Tourist & Visitor Visa')),
      'Mobile: "Tourist & Visitor Visa" link intact');
    assert(mobileChildLinks.some(l => l.href === '/services/work-visa/' && l.text.includes('Work Visa Support')),
      'Mobile: "Work Visa Support" link intact');
    assert(mobileChildLinks.some(l => l.href === '/services/additional-services/' && l.text.includes('Additional Services')),
      'Mobile: "Additional Services" link intact');

    // 3. VERIFY UNDERLYING SERVICE PAGES REMAIN ACCESSIBLE
    console.log('\n--- 3. VERIFYING UNDERLYING ROUTES REMAIN ACCESSIBLE ---');
    const routesToTest = [
      '/services/',
      '/services/tourist-visa/',
      '/services/work-visa/',
      '/services/additional-services/',
      '/services/flight-booking/',
      '/services/mbbs/',
      '/services/phd/',
    ];

    for (const r of routesToTest) {
      const resp = await page.goto(`http://localhost:${PORT}${r}`, { waitUntil: 'networkidle0' });
      assert(resp.status() === 200, `Underlying route ${r} returns 200 OK (Preserved)`);
    }

    // 4. CAPTURE VISUAL EVIDENCE SCREENSHOTS
    console.log('\n--- 4. CAPTURING EVIDENCE SCREENSHOTS ---');
    
    // Screenshot 1: Desktop with Visa Services dropdown open
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    const visaBtnAgain = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('nav button'));
      return btns.find(b => b.textContent && b.textContent.includes('Visa Services'));
    });
    if (visaBtnAgain) {
      await visaBtnAgain.hover();
      await new Promise(r => setTimeout(r, 400));
    }
    const ssDesktop = path.join(ARTIFACTS_DIR, 'visa-services-dropdown-desktop-1440px.png');
    await page.screenshot({ path: ssDesktop });
    console.log('  📸 Captured: visa-services-dropdown-desktop-1440px.png');

    // Screenshot 2: Mobile drawer showing Visa Services
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    await page.click('#open-mobile-menu-btn');
    await new Promise(r => setTimeout(r, 500));
    const ssMobile = path.join(ARTIFACTS_DIR, 'visa-services-drawer-mobile-375px.png');
    await page.screenshot({ path: ssMobile });
    console.log('  📸 Captured: visa-services-drawer-mobile-375px.png');

    console.log('\n================================================================');
    console.log(`TOTAL CHECKS : ${totalTests}`);
    console.log(`PASSED       : ${passedTests}`);
    console.log(`FAILED       : ${failedTests}`);
    console.log(`PASS RATE    : ${Math.round((passedTests / totalTests) * 100)}%`);
    console.log('================================================================\n');

    await browser.close();
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    server.close();
  }
});
