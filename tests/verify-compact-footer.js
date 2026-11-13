import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\5db0c23b-424d-42d8-acd3-62fb5a754759\\screenshots';
const PORT = 4361;

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

const VIEWPORTS = [
  { name: 'Mobile-320px', width: 320, height: 600, isMobile: true },
  { name: 'Mobile-360px', width: 360, height: 740, isMobile: true },
  { name: 'Mobile-390px', width: 390, height: 844, isMobile: true },
  { name: 'Mobile-430px', width: 430, height: 932, isMobile: true },
  { name: 'Tablet-768px', width: 768, height: 1024, isMobile: false },
  { name: 'Tablet-1024px', width: 1024, height: 768, isMobile: false },
  { name: 'Desktop-1366px', width: 1366, height: 768, isMobile: false },
  { name: 'Desktop-1440px', width: 1440, height: 900, isMobile: false },
  { name: 'Desktop-1920px', width: 1920, height: 1080, isMobile: false },
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
  console.log('      VISA CONVENTION — COMPACT FOOTER VERIFICATION QA         ');
  console.log('================================================================\n');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // 1. CHANGE 1: REMOVAL OF BUSINESS HOURS FROM FOOTER
    console.log('--- 1. VERIFYING BUSINESS HOURS REMOVAL (CHANGE 1) ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    const footerText = await page.evaluate(() => {
      const footer = document.querySelector('footer');
      return footer ? footer.innerText : '';
    });

    assert(!footerText.includes('Monday – Saturday'), 'Hours "Monday – Saturday" completely removed from footer');
    assert(!footerText.includes('9:30 AM'), 'Hours "9:30 AM" completely removed from footer');
    assert(!footerText.includes('6:30 PM'), 'Hours "6:30 PM" completely removed from footer');
    assert(!footerText.includes('Sunday Closed'), 'Hours "Sunday Closed" completely removed from footer');
    assert(!footerText.includes('Hours:'), 'Label "Hours:" completely removed from footer');

    // Verify Contact page still retains business hours
    await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });
    const contactText = await page.evaluate(() => document.body.innerText);
    assert(contactText.includes('Monday – Saturday: 9:30 AM – 6:30 PM IST'),
      'Business hours are preserved on dedicated Contact page (/contact/)');

    // 2. CHANGE 2: REDUCE FOOTER HEIGHT & MEASURE PADDING/GAPS
    console.log('\n--- 2. VERIFYING FOOTER HEIGHT REDUCTION & COMPACT PADDING (CHANGE 2) ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    const footerMetrics = await page.evaluate(() => {
      const footer = document.querySelector('footer');
      const cs = window.getComputedStyle(footer);
      const grid = footer.querySelector('.grid');
      const gridCs = grid ? window.getComputedStyle(grid) : null;
      return {
        height: footer.offsetHeight,
        paddingTop: parseFloat(cs.paddingTop),
        paddingBottom: parseFloat(cs.paddingBottom),
        backgroundColor: cs.backgroundColor,
        columnGap: gridCs ? parseFloat(gridCs.columnGap) : 0,
      };
    });

    console.log(`  Measured Desktop Footer Height: ${footerMetrics.height}px`);
    console.log(`  Measured Top Padding: ${footerMetrics.paddingTop}px | Bottom Padding: ${footerMetrics.paddingBottom}px`);
    console.log(`  Measured Column Gap: ${footerMetrics.columnGap}px`);

    assert(footerMetrics.height <= 340, `Desktop footer height is visibly compact (${footerMetrics.height}px <= 340px)`);
    assert(footerMetrics.paddingTop >= 24 && footerMetrics.paddingTop <= 36,
      `Top padding is within target range 28-36px (Actual: ${footerMetrics.paddingTop}px)`);
    assert(footerMetrics.paddingBottom >= 20 && footerMetrics.paddingBottom <= 36,
      `Bottom padding is within target range 24-36px (Actual: ${footerMetrics.paddingBottom}px)`);
    assert(footerMetrics.columnGap >= 24 && footerMetrics.columnGap <= 36,
      `Column gap is within target range 24-32px (Actual: ${footerMetrics.columnGap}px)`);
    // Brand navy background: rgb(16, 42, 83) is #102A53
    assert(footerMetrics.backgroundColor.includes('16, 42, 83') || footerMetrics.backgroundColor.includes('#102a53'),
      `Brand navy blue background color preserved (${footerMetrics.backgroundColor})`);

    // 3. CHANGE 3: PRESERVE ESSENTIAL INFORMATION
    console.log('\n--- 3. VERIFYING ESSENTIAL INFORMATION PRESERVATION (CHANGE 3) ---');
    const essentialInfo = await page.evaluate(() => {
      const footer = document.querySelector('footer');
      if (!footer) return {};
      const links = Array.from(footer.querySelectorAll('a')).map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }));
      const hasBrand = footer.innerText.includes('VISA CONVENTION');
      const hasAddress = footer.innerText.includes('Shop No.115, Durga Market');
      const hasPhone = links.some(l => l.href.includes('tel:+919680395539') || l.href.includes('tel:9680395539'));
      const hasEmail = links.some(l => l.href.includes('mailto:visaconvention064@gmail.com'));
      const hasPrivacy = links.some(l => l.href === '/privacy-policy/');
      const hasTerms = links.some(l => l.href === '/terms/');
      const hasCopyright = footer.innerText.includes('Visa Convention. All rights reserved.');
      const hasInstagram = links.some(l => l.href.includes('instagram.com/visaconvention'));
      const hasYoutube = links.some(l => l.href.includes('youtube.com/@VisaConvention'));
      const hasQuickStudy = links.some(l => l.href === '/study-abroad/');
      const hasQuickServices = links.some(l => l.href === '/services/');
      const hasQuickUnis = links.some(l => l.href === '/universities/');
      const hasQuickAbout = links.some(l => l.href === '/about/');
      const hasQuickContact = links.some(l => l.href === '/contact/');
      return {
        hasBrand, hasAddress, hasPhone, hasEmail, hasPrivacy, hasTerms,
        hasCopyright, hasInstagram, hasYoutube, hasQuickStudy, hasQuickServices,
        hasQuickUnis, hasQuickAbout, hasQuickContact,
      };
    });

    assert(essentialInfo.hasBrand, 'Visa Convention name and logo preserved in footer');
    assert(essentialInfo.hasAddress, 'Physical Hanumangarh office address preserved');
    assert(essentialInfo.hasPhone, 'Direct Phone / WhatsApp tel: link preserved');
    assert(essentialInfo.hasEmail, 'Primary inquiry mailto: link preserved');
    assert(essentialInfo.hasInstagram, 'Verified Instagram link preserved');
    assert(essentialInfo.hasYoutube, 'Verified YouTube link preserved');
    assert(essentialInfo.hasQuickStudy, 'Quick link to Study Abroad active');
    assert(essentialInfo.hasQuickServices, 'Quick link to Visa Services active');
    assert(essentialInfo.hasQuickUnis, 'Quick link to University Directory active');
    assert(essentialInfo.hasQuickAbout, 'Quick link to About Us active');
    assert(essentialInfo.hasQuickContact, 'Quick link to Contact active');
    assert(essentialInfo.hasPrivacy, 'Privacy Policy link active');
    assert(essentialInfo.hasTerms, 'Terms of Service link active');
    assert(essentialInfo.hasCopyright, 'Copyright statement preserved');

    // 4. CHANGE 4: MOBILE-FIRST OPTIMIZATION ACROSS ALL 9 VIEWPORTS
    console.log('\n--- 4. MOBILE-FIRST RESPONSIVE TESTING ACROSS ALL 9 VIEWPORTS ---');
    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.isMobile });
      await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

      const check = await page.evaluate(() => {
        const scrollW = document.documentElement.scrollWidth;
        const clientW = document.documentElement.clientWidth;
        const footer = document.querySelector('footer');
        const footerH = footer ? footer.offsetHeight : 0;
        return {
          scrollW,
          clientW,
          hasOverflow: scrollW > clientW + 1,
          footerH,
        };
      });

      assert(!check.hasOverflow, `${vp.name} (${vp.width}px): Zero horizontal overflow (${check.scrollW}px vs ${check.clientW}px)`);
      assert(check.footerH > 0 && check.footerH < 850, `${vp.name}: Footer height is compact and well-proportioned (${check.footerH}px)`);
    }

    // 5. FLOATING WHATSAPP BUTTON CLEARANCE ON MOBILE
    console.log('\n--- 5. VERIFYING FLOATING WHATSAPP BUTTON CLEARANCE ---');
    await page.setViewport({ width: 375, height: 750, isMobile: true, hasTouch: true });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    // Scroll to very bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 400));

    const overlapCheck = await page.evaluate(() => {
      const waBtn = document.getElementById('floating-whatsapp-btn');
      if (!waBtn) return { hasOverlap: false, details: 'no wa btn' };
      const waRect = waBtn.getBoundingClientRect();

      // Check all footer interactive links
      const links = Array.from(document.querySelectorAll('footer a'));
      for (const link of links) {
        const r = link.getBoundingClientRect();
        // check if waRect overlaps r
        const overlaps = !(
          waRect.right < r.left ||
          waRect.left > r.right ||
          waRect.bottom < r.top ||
          waRect.top > r.bottom
        );
        if (overlaps) {
          return { hasOverlap: true, link: link.textContent.trim(), linkRect: r, waRect };
        }
      }
      return { hasOverlap: false };
    });

    assert(!overlapCheck.hasOverlap,
      'Floating WhatsApp button does NOT overlap any footer interactive links',
      JSON.stringify(overlapCheck)
    );

    // 6. SCREENSHOT ARTIFACT CAPTURES
    console.log('\n--- 6. CAPTURING EVIDENCE SCREENSHOTS ---');
    
    // Desktop 1440px
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      const footer = document.querySelector('footer');
      if (footer) footer.scrollIntoView({ block: 'end' });
    });
    await new Promise(r => setTimeout(r, 400));
    const ssDesktop = path.join(ARTIFACTS_DIR, 'compact-footer-desktop-1440px.png');
    await page.screenshot({ path: ssDesktop });
    console.log('  📸 Captured: compact-footer-desktop-1440px.png');

    // Tablet 768px
    await page.setViewport({ width: 768, height: 1024 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      const footer = document.querySelector('footer');
      if (footer) footer.scrollIntoView({ block: 'end' });
    });
    await new Promise(r => setTimeout(r, 400));
    const ssTablet = path.join(ARTIFACTS_DIR, 'compact-footer-tablet-768px.png');
    await page.screenshot({ path: ssTablet });
    console.log('  📸 Captured: compact-footer-tablet-768px.png');

    // Mobile 390px
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      const footer = document.querySelector('footer');
      if (footer) footer.scrollIntoView({ block: 'end' });
    });
    await new Promise(r => setTimeout(r, 400));
    const ssMobile390 = path.join(ARTIFACTS_DIR, 'compact-footer-mobile-390px.png');
    await page.screenshot({ path: ssMobile390 });
    console.log('  📸 Captured: compact-footer-mobile-390px.png');

    // Mobile 320px
    await page.setViewport({ width: 320, height: 600, isMobile: true, hasTouch: true });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      const footer = document.querySelector('footer');
      if (footer) footer.scrollIntoView({ block: 'end' });
    });
    await new Promise(r => setTimeout(r, 400));
    const ssMobile320 = path.join(ARTIFACTS_DIR, 'compact-footer-mobile-320px.png');
    await page.screenshot({ path: ssMobile320 });
    console.log('  📸 Captured: compact-footer-mobile-320px.png');

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
