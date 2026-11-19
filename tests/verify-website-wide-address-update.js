import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\93dd9ae5-292a-4677-9731-9efc41a7f30f\\evidence';
const PORT = 4377;

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
    passedChecks++;
    console.log(`  ✓ [PASS] ${checkName}`);
  } else {
    failedChecks++;
    failureDetails.push({ checkName, details });
    console.error(`  ✗ [FAIL] ${checkName} - ${details}`);
  }
}

const VIEWPORTS = [
  { width: 320, height: 600, name: '320px (Small Mobile)' },
  { width: 360, height: 740, name: '360px (Android Compact)' },
  { width: 390, height: 844, name: '390px (iPhone 14/15)' },
  { width: 430, height: 932, name: '430px (iPhone 14/15 Pro Max)' },
  { width: 768, height: 1024, name: '768px (iPad Mini / Tablet)' },
  { width: 1024, height: 768, name: '1024px (Small Desktop / iPad Pro)' },
  { width: 1366, height: 768, name: '1366px (Standard Laptop)' },
  { width: 1440, height: 900, name: '1440px (Desktop Full)' },
];

async function runAudit() {
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Verification Server running on http://localhost:${PORT}`);

  // =========================================================================
  // SECTION 1: STATIC ARTIFACT & DIST AUDIT
  // =========================================================================
  console.log('\n--- TEST GROUP 1: Static Dist Scan for Address Inconsistencies ---');

  function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const fullPath = path.join(dir, f);
      if (fs.statSync(fullPath).isDirectory()) {
        getAllFiles(fullPath, fileList);
      } else {
        fileList.push(fullPath);
      }
    }
    return fileList;
  }

  const allDistFiles = getAllFiles(DIST).filter(f => f.endsWith('.html') || f.endsWith('.js') || f.endsWith('.json'));

  let outdatedAddressFound = false;
  let outdatedPhoneFound = false;
  let outdatedJunctionOrderFound = false;

  for (const file of allDistFiles) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('behind Bus Stand')) outdatedAddressFound = true;
    if (content.includes('+91 96803-95539')) outdatedPhoneFound = true;
    if (content.includes('Junction, Hanumangarh')) outdatedJunctionOrderFound = true;
  }

  assert(!outdatedAddressFound, 'Zero occurrences of outdated "behind Bus Stand" in dist');
  assert(!outdatedPhoneFound, 'Zero occurrences of outdated hyphenated phone "+91 96803-95539" in dist');
  assert(!outdatedJunctionOrderFound, 'Zero occurrences of outdated "Junction, Hanumangarh" in dist');

  // Contact Page verification
  const contactHtml = fs.readFileSync(path.join(DIST, 'contact', 'index.html'), 'utf8');
  assert(contactHtml.includes('Shop No.115, Durga Market, Street No.04'), 'Contact page contains Line 1: Shop No.115, Durga Market, Street No.04');
  assert(contactHtml.includes('Behind Bus Stand, Durga Colony'), 'Contact page contains Line 2: Behind Bus Stand, Durga Colony');
  assert(contactHtml.includes('Hanumangarh Junction, Rajasthan – 335512, India'), 'Contact page contains Line 3: Hanumangarh Junction, Rajasthan – 335512, India');
  assert(contactHtml.includes('+91 96803 95539'), 'Contact page displays official phone +91 96803 95539');
  assert(contactHtml.includes('tel:+919680395539'), 'Contact page click-to-call link href is tel:+919680395539');
  assert(contactHtml.includes('maps.google.com/?q=Visa+Convention'), 'Contact page has verified Google Maps search URL with exact address');

  // About Page verification
  const aboutHtml = fs.readFileSync(path.join(DIST, 'about', 'index.html'), 'utf8');
  assert(aboutHtml.includes('Shop No.115, Durga Market, Street No.04'), 'About page contains Line 1: Shop No.115, Durga Market, Street No.04');
  assert(aboutHtml.includes('Behind Bus Stand, Durga Colony'), 'About page contains Line 2: Behind Bus Stand, Durga Colony');
  assert(aboutHtml.includes('Hanumangarh Junction, Rajasthan – 335512, India'), 'About page contains Line 3: Hanumangarh Junction, Rajasthan – 335512, India');

  // Homepage / Global Footer verification
  const indexHtml = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
  assert(indexHtml.includes('Shop No.115, Durga Market, Street No.04'), 'Footer on homepage contains Line 1');
  assert(indexHtml.includes('Behind Bus Stand, Durga Colony'), 'Footer on homepage contains Line 2');
  assert(indexHtml.includes('Hanumangarh Junction, Rajasthan – 335512, India'), 'Footer on homepage contains Line 3');
  assert(indexHtml.includes('tel:+919680395539'), 'Footer contains click-to-call tel:+919680395539');

  // Schema.org JSON-LD verification
  assert(indexHtml.includes('"streetAddress":"Shop No.115, Durga Market, Street No.04, Behind Bus Stand, Durga Colony, Hanumangarh Junction, Rajasthan – 335512, India"'), 'Schema JSON-LD contains exact new official streetAddress');
  assert(indexHtml.includes('"addressLocality":"Hanumangarh Junction"'), 'Schema JSON-LD addressLocality is Hanumangarh Junction');
  assert(indexHtml.includes('"postalCode":"335512"'), 'Schema JSON-LD postalCode is 335512');
  assert(indexHtml.includes('"telephone":"+91 96803 95539"'), 'Schema JSON-LD telephone is +91 96803 95539');

  // Services verification
  const mbbsHtml = fs.readFileSync(path.join(DIST, 'services', 'mbbs', 'index.html'), 'utf8');
  const phdHtml = fs.readFileSync(path.join(DIST, 'services', 'phd', 'index.html'), 'utf8');
  assert(mbbsHtml.includes('Shop No.115, Durga Market, Street No.04, Behind Bus Stand'), 'MBBS service page displays updated office address');
  assert(phdHtml.includes('Shop No.115, Durga Market, Street No.04, Behind Bus Stand'), 'PhD service page displays updated office address');
  assert(mbbsHtml.includes('tel:+919680395539'), 'MBBS service page click-to-call link is tel:+919680395539');
  assert(phdHtml.includes('tel:+919680395539'), 'PhD service page click-to-call link is tel:+919680395539');

  // =========================================================================
  // SECTION 2: BROWSER RENDERING & INTERACTIVE VERIFICATION
  // =========================================================================
  console.log('\n--- TEST GROUP 2: Puppeteer Browser & Interactive Verification ---');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // 1. Contact Page at Desktop (1440px)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });

  const contactAddressText = await page.evaluate(() => {
    const card = document.querySelector('section .lg\\:col-span-5');
    return card ? card.innerText : '';
  });

  assert(contactAddressText.includes('Shop No.115, Durga Market, Street No.04'), 'Contact page rendered Line 1 on Desktop');
  assert(contactAddressText.includes('Behind Bus Stand, Durga Colony'), 'Contact page rendered Line 2 on Desktop');
  assert(contactAddressText.includes('Hanumangarh Junction, Rajasthan – 335512, India'), 'Contact page rendered Line 3 on Desktop');
  assert(contactAddressText.includes('+91 96803 95539'), 'Contact page rendered official phone number on Desktop');

  const contactPhoneHref = await page.evaluate(() => {
    const link = document.getElementById('contact-phone-link');
    return link ? link.getAttribute('href') : '';
  });
  assert(contactPhoneHref === 'tel:+919680395539', `Contact page Call link has exact href="tel:+919680395539" (Actual: ${contactPhoneHref})`);

  const contactWaHref = await page.evaluate(() => {
    const link = document.getElementById('contact-whatsapp-link');
    return link ? link.getAttribute('href') : '';
  });
  assert(contactWaHref.includes('wa.me/919680395539'), `Contact page WhatsApp link points to 919680395539 (Actual: ${contactWaHref})`);

  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'contact-address-desktop-1440px.png'), fullPage: false });

  // 2. Contact Page at Mobile (390px)
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });

  const contactMobileOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth <= document.documentElement.clientWidth;
  });
  assert(contactMobileOverflow, 'Contact page has no horizontal overflow at 390px mobile');

  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'contact-address-mobile-390px.png'), fullPage: false });

  // 3. About Page at Desktop (1440px)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:${PORT}/about/`, { waitUntil: 'networkidle0' });

  const aboutAddressText = await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h => h.innerText.includes('Our Physical Advisory Center in Hanumangarh'));
    const container = heading ? heading.closest('section') : null;
    return container ? container.innerText : '';
  });

  assert(aboutAddressText.includes('Shop No.115, Durga Market, Street No.04'), 'About page rendered Line 1 on Desktop');
  assert(aboutAddressText.includes('Behind Bus Stand, Durga Colony'), 'About page rendered Line 2 on Desktop');
  assert(aboutAddressText.includes('Hanumangarh Junction, Rajasthan – 335512, India'), 'About page rendered Line 3 on Desktop');

  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'about-address-desktop-1440px.png'), fullPage: false });

  // 4. About Page at Mobile (390px)
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(`http://localhost:${PORT}/about/`, { waitUntil: 'networkidle0' });

  const aboutMobileOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth <= document.documentElement.clientWidth;
  });
  assert(aboutMobileOverflow, 'About page has no horizontal overflow at 390px mobile');

  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'about-address-mobile-390px.png'), fullPage: false });

  // 5. Footer at Desktop (1440px) & Mobile (390px)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

  const footerText = await page.evaluate(() => {
    const footer = document.querySelector('footer');
    return footer ? footer.innerText : '';
  });

  assert(footerText.includes('Shop No.115, Durga Market, Street No.04'), 'Footer rendered Line 1 on Desktop');
  assert(footerText.includes('Behind Bus Stand, Durga Colony'), 'Footer rendered Line 2 on Desktop');
  assert(footerText.includes('Hanumangarh Junction, Rajasthan – 335512, India'), 'Footer rendered Line 3 on Desktop');
  assert(footerText.includes('+91 96803 95539'), 'Footer rendered official phone number');

  const footerPhoneHref = await page.evaluate(() => {
    const footerLinks = Array.from(document.querySelectorAll('footer a'));
    const phoneLink = footerLinks.find(a => a.getAttribute('href') && a.getAttribute('href').startsWith('tel:'));
    return phoneLink ? phoneLink.getAttribute('href') : '';
  });
  assert(footerPhoneHref === 'tel:+919680395539', `Footer phone link href is tel:+919680395539 (Actual: ${footerPhoneHref})`);

  // Scroll to footer and screenshot
  await page.evaluate(() => {
    const footer = document.querySelector('footer');
    if (footer) footer.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'footer-address-desktop-1440px.png') });

  // Footer on Mobile
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => {
    const footer = document.querySelector('footer');
    if (footer) footer.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'footer-address-mobile-390px.png') });

  // =========================================================================
  // SECTION 3: MULTI-VIEWPORT RESPONSIVE AUDIT
  // =========================================================================
  console.log('\n--- TEST GROUP 3: Multi-Viewport Responsive Overflow Audit ---');

  for (const vp of VIEWPORTS) {
    await page.setViewport({ width: vp.width, height: vp.height });
    
    // Test Contact
    await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });
    const contactNoOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
    assert(contactNoOverflow, `Contact page: no overflow at ${vp.name} (${vp.width}x${vp.height})`);

    // Test About
    await page.goto(`http://localhost:${PORT}/about/`, { waitUntil: 'networkidle0' });
    const aboutNoOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
    assert(aboutNoOverflow, `About page: no overflow at ${vp.name} (${vp.width}x${vp.height})`);

    // Test Home
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    const homeNoOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
    assert(homeNoOverflow, `Home page: no overflow at ${vp.name} (${vp.width}x${vp.height})`);
  }

  await browser.close();
  server.close();

  // Summary
  console.log('\n=======================================================');
  console.log(`TOTAL CHECKS: ${totalChecks}`);
  console.log(`PASSED: ${passedChecks}`);
  console.log(`FAILED: ${failedChecks}`);
  console.log('=======================================================');

  if (failedChecks > 0) {
    console.error('\nFailures:');
    failureDetails.forEach(f => console.error(`  - ${f.checkName}: ${f.details}`));
    process.exit(1);
  } else {
    console.log('\n🎉 ALL WEBSITE-WIDE ADDRESS UPDATE CHECKS PASSED (100%)\n');
    process.exit(0);
  }
}

runAudit().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
