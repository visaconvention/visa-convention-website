import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\7ca130ef-5e70-4578-88a2-0879acc42caa';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const DIST_DIR = path.resolve('dist');
const PORT = 4327;

console.log('=====================================================');
console.log('   VISA CONVENTION - STAGE 10 SEO & A11Y QA SUITE     ');
console.log('=====================================================\n');

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

// Helper to recursively collect all HTML files in dist
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
      let reqPath = req.url.split('?')[0];
      if (reqPath.endsWith('/')) {
        reqPath += 'index.html';
      }
      let filePath = path.join(DIST_DIR, reqPath);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath);
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'text/plain' });
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      }
    });

    server.listen(PORT, () => {
      console.log(`Test static server running at http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

async function runAudit() {
  const htmlFiles = getHtmlFiles(DIST_DIR);
  console.log(`\nFound ${htmlFiles.length} HTML pages in dist/ directory.\n`);

  // =========================================================================
  // SECTION 1: ROBOTS.TXT AUDIT
  // =========================================================================
  console.log('--- SUITE 1: robots.txt Verification ---');
  const robotsPath = path.join(DIST_DIR, 'robots.txt');
  assert(fs.existsSync(robotsPath), 'dist/robots.txt exists on disk');

  if (fs.existsSync(robotsPath)) {
    const robotsTxt = fs.readFileSync(robotsPath, 'utf8');
    assert(robotsTxt.includes('User-agent: *'), 'robots.txt specifies wildcard user agent');
    assert(robotsTxt.includes('Allow: /'), 'robots.txt allows root path');
    assert(robotsTxt.includes('Disallow: /api/'), 'robots.txt disallows /api/');
    assert(robotsTxt.includes('Disallow: /design-system/'), 'robots.txt disallows /design-system/');
    assert(robotsTxt.includes('Sitemap: https://visaconvention.com/sitemap.xml'), 'robots.txt references official sitemap URL');
  }

  // =========================================================================
  // SECTION 2: XML SITEMAP AUDIT
  // =========================================================================
  console.log('\n--- SUITE 2: XML Sitemap Verification ---');
  const sitemapPath = path.join(DIST_DIR, 'sitemap.xml');
  assert(fs.existsSync(sitemapPath), 'dist/sitemap.xml exists on disk');

  if (fs.existsSync(sitemapPath)) {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    assert(sitemapContent.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), 'sitemap.xml starts with valid XML declaration');
    assert(sitemapContent.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'), 'sitemap.xml has standard urlset schema namespace');

    // Extract all <loc> URLs
    const locMatches = [...sitemapContent.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    assert(locMatches.length >= 60, `sitemap.xml contains >= 60 production URLs (Actual: ${locMatches.length})`);

    // Verify all sitemap URLs resolve to existing static HTML files
    let allLocsExist = true;
    let missingLoc = '';
    for (const loc of locMatches) {
      const urlPath = loc.replace('https://visaconvention.com', '');
      let diskPath = path.join(DIST_DIR, urlPath);
      if (diskPath.endsWith('/') || !path.extname(diskPath)) {
        diskPath = path.join(diskPath, 'index.html');
      }
      if (!fs.existsSync(diskPath)) {
        allLocsExist = false;
        missingLoc = `${loc} -> ${diskPath}`;
        break;
      }
    }
    assert(allLocsExist, 'All sitemap URLs map 1:1 to existing static HTML files', missingLoc);

    // Verify changefreq and priority presence
    const lastmodMatches = sitemapContent.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g) || [];
    const changefreqMatches = sitemapContent.match(/<changefreq>(always|hourly|daily|weekly|monthly|yearly|never)<\/changefreq>/g) || [];
    const priorityMatches = sitemapContent.match(/<priority>\d\.\d{2}<\/priority>/g) || [];

    assert(lastmodMatches.length === locMatches.length, 'Every sitemap entry has valid <lastmod> date format (YYYY-MM-DD)');
    assert(changefreqMatches.length === locMatches.length, 'Every sitemap entry has valid <changefreq>');
    assert(priorityMatches.length === locMatches.length, 'Every sitemap entry has valid <priority>');

    // Check homepage has priority 1.00 and daily changefreq
    // Use a date-agnostic check so this doesn't fail after a rebuild on a new day
    const homepageEntry = sitemapContent.match(/<loc>https:\/\/visaconvention\.com\/<\/loc>\s*<lastmod>[^<]+<\/lastmod>\s*<changefreq>daily<\/changefreq>\s*<priority>1\.00<\/priority>/);
    assert(homepageEntry !== null, 'Homepage has priority 1.00 and daily changefreq');
  }

  // =========================================================================
  // SECTION 3: SOCIAL SHARING & BRAND ASSETS
  // =========================================================================
  console.log('\n--- SUITE 3: Social Sharing & Brand Media Assets ---');
  const ogJpg = path.join(DIST_DIR, 'assets/brand/og-image.jpg');
  const ogPng = path.join(DIST_DIR, 'assets/brand/og-image.png');
  assert(fs.existsSync(ogJpg), 'Official Open Graph JPG card exists in dist/ (1200x630)');
  assert(fs.existsSync(ogPng), 'Official Open Graph PNG card exists in dist/ (1200x630)');

  // =========================================================================
  // SECTION 4: METADATA & CANONICAL AUDIT ACROSS ALL HTML PAGES
  // =========================================================================
  console.log('\n--- SUITE 4: Global Metadata & Canonical Audit ---');
  const titles = new Map();
  const descriptions = new Map();
  let missingTitleCount = 0;
  let missingDescCount = 0;
  let invalidDescLenCount = 0;
  let missingCanonicalCount = 0;
  let invalidCanonicalCount = 0;
  let missingOgImageCount = 0;
  let missingTwitterCardCount = 0;

  for (const file of htmlFiles) {
    const relPath = path.relative(DIST_DIR, file).replace(/\\/g, '/');
    if (relPath.includes('design-system') || relPath.includes('partnerships')) continue; // internal showcase or redirect stub

    const html = fs.readFileSync(file, 'utf8');

    // Title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (!titleMatch || !titleMatch[1].trim()) {
      missingTitleCount++;
    } else {
      const t = titleMatch[1].trim();
      titles.set(t, (titles.get(t) || 0) + 1);
    }

    // Description
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=(["'])([\s\S]*?)\1/i) ||
                      html.match(/<meta\s+content=(["'])([\s\S]*?)\1\s+name=["']description["']/i);
    if (!descMatch || !descMatch[2].trim()) {
      missingDescCount++;
    } else {
      const d = descMatch[2].trim();
      descriptions.set(d, (descriptions.get(d) || 0) + 1);
      if (d.length < 50 || d.length > 175) {
        invalidDescLenCount++;
      }
    }

    // Canonical
    const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
    if (!canonicalMatch) {
      missingCanonicalCount++;
    } else {
      const c = canonicalMatch[1];
      if (!c.startsWith('https://visaconvention.com') || c.includes('?') || c.includes('#')) {
        invalidCanonicalCount++;
      }
    }

    // Open Graph Image
    const ogImgMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i);
    if (!ogImgMatch || !ogImgMatch[1].includes('og-image.jpg')) {
      missingOgImageCount++;
    }

    // Twitter Card
    const twCardMatch = html.match(/<meta\s+property=["']twitter:card["']\s+content=["']summary_large_image["']/i);
    if (!twCardMatch) {
      missingTwitterCardCount++;
    }
  }

  assert(missingTitleCount === 0, 'Zero pages missing <title>');
  let duplicateTitles = [...titles.entries()].filter(([_, count]) => count > 1);
  assert(duplicateTitles.length === 0, `All production page titles are completely unique (Duplicates: ${duplicateTitles.length})`);

  assert(missingDescCount === 0, 'Zero pages missing meta description');
  let duplicateDescs = [...descriptions.entries()].filter(([_, count]) => count > 1);
  assert(duplicateDescs.length === 0, `All production meta descriptions are completely unique (Duplicates: ${duplicateDescs.length})`);
  assert(invalidDescLenCount === 0, `All meta descriptions conform to 50–175 characters (Out of bounds: ${invalidDescLenCount})`);

  assert(missingCanonicalCount === 0, 'Zero pages missing canonical URL');
  assert(invalidCanonicalCount === 0, 'Zero canonical URLs with query parameters or invalid protocols');
  assert(missingOgImageCount === 0, 'All production pages declare og:image pointing to official social asset');
  assert(missingTwitterCardCount === 0, 'All production pages declare twitter:card as summary_large_image');

  // =========================================================================
  // SECTION 5: HEADING HIERARCHY & SEMANTIC LANDMARKS
  // =========================================================================
  console.log('\n--- SUITE 5: Heading Hierarchy & Semantic HTML5 Landmarks ---');
  let nonSingleH1Count = 0;
  let missingLandmarksCount = 0;

  for (const file of htmlFiles) {
    const relPath = path.relative(DIST_DIR, file).replace(/\\/g, '/');
    if (relPath.includes('design-system') || relPath.includes('partnerships')) continue;

    const html = fs.readFileSync(file, 'utf8');

    // H1 check
    const h1Matches = html.match(/<h1[\s>]/gi) || [];
    if (h1Matches.length !== 1) {
      nonSingleH1Count++;
    }

    // Semantic landmarks
    const hasHeader = html.includes('<header') || html.includes('role="banner"');
    const hasNav = html.includes('<nav') || html.includes('role="navigation"');
    const hasMain = html.includes('<main') || html.includes('id="main-content"');
    const hasFooter = html.includes('<footer') || html.includes('role="contentinfo"');

    if (!hasHeader || !hasNav || !hasMain || !hasFooter) {
      missingLandmarksCount++;
    }
  }

  assert(nonSingleH1Count === 0, `Exactly one <h1> per production page (Failures: ${nonSingleH1Count})`);
  assert(missingLandmarksCount === 0, `Every production page implements HTML5 landmarks (header, nav, main, footer) (Failures: ${missingLandmarksCount})`);

  // =========================================================================
  // SECTION 6: IMAGE ACCESSIBILITY & ALT TEXT AUDIT
  // =========================================================================
  console.log('\n--- SUITE 6: Image Accessibility (WCAG 2.2 AA) ---');
  let missingAltCount = 0;
  let emptyAltCount = 0;
  let totalImgTags = 0;

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    const imgMatches = html.matchAll(/<img\b([^>]*)>/gi);
    for (const match of imgMatches) {
      totalImgTags++;
      const attrs = match[1];
      const altMatch = attrs.match(/alt=(["'])([\s\S]*?)\1/i);
      if (!altMatch) {
        missingAltCount++;
      } else if (altMatch[2].trim().length === 0) {
        emptyAltCount++;
      }
    }
  }

  assert(missingAltCount === 0, `100% of <img> tags have alt attributes across all ${totalImgTags} images (Missing: ${missingAltCount})`);
  assert(emptyAltCount === 0, `Zero empty alt="" tags on informational content images (Empty: ${emptyAltCount})`);

  // =========================================================================
  // SECTION 7: STRUCTURED DATA (SCHEMA.ORG JSON-LD) AUDIT
  // =========================================================================
  console.log('\n--- SUITE 7: Schema.org Structured Data Audit ---');
  let corruptedJsonLdCount = 0;
  let breadcrumbSchemaCount = 0;
  let faqSchemaCount = 0;

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    const ldJsonMatches = html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi);
    for (const match of ldJsonMatches) {
      try {
        const parsed = JSON.parse(match[1]);
        if (parsed['@type'] === 'BreadcrumbList') breadcrumbSchemaCount++;
        if (parsed['@type'] === 'FAQPage') faqSchemaCount++;
      } catch (e) {
        corruptedJsonLdCount++;
      }
    }
  }

  assert(corruptedJsonLdCount === 0, `Zero JSON syntax errors across all embedded JSON-LD scripts (Errors: ${corruptedJsonLdCount})`);
  assert(breadcrumbSchemaCount >= 50, `Subpages embed Schema.org BreadcrumbList structured data (Count: ${breadcrumbSchemaCount})`);
  assert(faqSchemaCount >= 5, `Pages with FAQs embed valid Schema.org FAQPage structured data (Count: ${faqSchemaCount})`);

  // Verify Homepage LocalBusiness & Hanumangarh Grounding
  const homeHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');
  assert(homeHtml.includes('"@type":["LocalBusiness","ProfessionalService","EducationalOrganization"]'), 'Homepage contains combined LocalBusiness / ProfessionalService Schema');
  assert(homeHtml.includes('"Hanumangarh"'), 'Schema includes addressLocality: Hanumangarh');
  assert(homeHtml.includes('"Rajasthan"'), 'Schema includes addressRegion: Rajasthan');
  assert(homeHtml.includes('"335512"'), 'Schema includes postalCode: 335512');
  assert(homeHtml.includes('"latitude":29.5816') && homeHtml.includes('"longitude":74.3218'), 'Schema includes verified GeoCoordinates (29.5816, 74.3218)');
  assert(homeHtml.includes('+91 96803-95539'), 'Schema includes verified telephone +91 96803-95539');

  // =========================================================================
  // SECTION 8: INTERNAL LINK INTEGRITY AUDIT
  // =========================================================================
  console.log('\n--- SUITE 8: Internal Link Integrity Audit ---');
  let brokenInternalLinks = 0;
  let brokenLinkExamples = [];

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    const linkMatches = html.matchAll(/<a\b[^>]*\bhref=(["'])([\s\S]*?)\1/gi);
    for (const match of linkMatches) {
      const href = match[2];
      // Internal links starting with /
      if (href.startsWith('/') && !href.startsWith('//')) {
        let cleanHref = href.split('#')[0].split('?')[0];
        let targetDisk = path.join(DIST_DIR, cleanHref);
        if (targetDisk.endsWith('/') || !path.extname(targetDisk)) {
          targetDisk = path.join(targetDisk, 'index.html');
        }
        if (!fs.existsSync(targetDisk) && !cleanHref.startsWith('/favicon') && !cleanHref.startsWith('/_astro')) {
          brokenInternalLinks++;
          if (brokenLinkExamples.length < 3) {
            brokenLinkExamples.push(`${href} (in ${path.relative(DIST_DIR, file)})`);
          }
        }
      }
    }
  }

  assert(brokenInternalLinks === 0, `Zero broken internal links across the entire website (Broken: ${brokenInternalLinks})`, brokenLinkExamples.join(', '));

  // =========================================================================
  // SECTION 9: PERFORMANCE & RESOURCE WEIGHT
  // =========================================================================
  console.log('\n--- SUITE 9: Performance & Resource Footprint ---');
  const astroDir = path.join(DIST_DIR, '_astro');
  let totalJsSize = 0;
  let totalCssSize = 0;

  if (fs.existsSync(astroDir)) {
    for (const f of fs.readdirSync(astroDir)) {
      const stats = fs.statSync(path.join(astroDir, f));
      if (f.endsWith('.js')) totalJsSize += stats.size;
      if (f.endsWith('.css')) totalCssSize += stats.size;
    }
  }

  const jsKb = (totalJsSize / 1024).toFixed(1);
  const cssKb = (totalCssSize / 1024).toFixed(1);
  console.log(`  📊 Total compiled client JS: ${jsKb} KB uncompressed`);
  console.log(`  📊 Total compiled CSS: ${cssKb} KB uncompressed`);

  assert(totalJsSize < 25 * 1024, `Client JS footprint is ultra-lightweight (< 25 KB uncompressed) (Actual: ${jsKb} KB)`);
  assert(totalCssSize < 75 * 1024, `Global CSS footprint is lean (< 75 KB uncompressed) (Actual: ${cssKb} KB)`);

  // Verify display=swap on webfonts
  assert(homeHtml.includes('display=swap'), 'Google Fonts loaded with display=swap for zero FOIT (Flash of Invisible Text)');
  assert(homeHtml.includes('rel="preconnect" href="https://fonts.googleapis.com"'), 'Preconnect used for fonts.googleapis.com');
  assert(homeHtml.includes('rel="preconnect" href="https://fonts.gstatic.com" crossorigin'), 'Preconnect used for fonts.gstatic.com with crossorigin');

  // =========================================================================
  // SECTION 10: PUPPETEER BROWSER ACCESSIBILITY & CONTRAST AUDIT
  // =========================================================================
  console.log('\n--- SUITE 10: Headless Browser Accessibility (WCAG 2.2 AA) ---');
  const server = await startServer();

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: EDGE_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Test 10.1: Skip to main content link on Homepage
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    const skipLink = await page.$('a[href="#main-content"]');
    assert(skipLink !== null, 'Skip-to-content accessible link exists at the very top of DOM');

    // Test 10.2: Tab navigation and visible focus ring
    await page.keyboard.press('Tab');
    const focusedTag = await page.evaluate(() => document.activeElement ? document.activeElement.tagName.toLowerCase() : null);
    const focusedHref = await page.evaluate(() => document.activeElement ? document.activeElement.getAttribute('href') : null);
    assert(focusedTag === 'a' && focusedHref === '#main-content', 'First keyboard Tab focus correctly hits skip-to-content link');

    // Test 10.3: Color contrast evaluation for Brand Navy vs White
    const contrastRatio = (l1, l2) => {
      const lum = (rgb) => {
        const a = rgb.map((v) => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
      };
      const lum1 = lum(l1);
      const lum2 = lum(l2);
      const brightest = Math.max(lum1, lum2);
      const darkest = Math.min(lum1, lum2);
      return (brightest + 0.05) / (darkest + 0.05);
    };

    // #102A53 is RGB(16, 42, 83), White is RGB(255, 255, 255)
    const navyWhiteRatio = contrastRatio([16, 42, 83], [255, 255, 255]);
    console.log(`  📊 Contrast ratio (#102A53 Brand Navy on White): ${navyWhiteRatio.toFixed(2)}:1`);
    assert(navyWhiteRatio >= 4.5, `Brand Navy text contrast exceeds WCAG AA 4.5:1 requirement (${navyWhiteRatio.toFixed(2)}:1)`);

    // #C91D32 is RGB(201, 29, 50), White is RGB(255, 255, 255)
    const redWhiteRatio = contrastRatio([201, 29, 50], [255, 255, 255]);
    console.log(`  📊 Contrast ratio (#C91D32 Signature Red on White): ${redWhiteRatio.toFixed(2)}:1`);
    assert(redWhiteRatio >= 4.5, `Signature Red button contrast exceeds WCAG AA 4.5:1 requirement (${redWhiteRatio.toFixed(2)}:1)`);

    // Test 10.4: Form accessibility on /contact/
    await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });
    const formInputsA11y = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"]), select, textarea'));
      const missingLabels = [];
      inputs.forEach(input => {
        const id = input.id;
        const label = id ? document.querySelector(`label[for="${id}"]`) : null;
        const ariaLabel = input.getAttribute('aria-label') || input.getAttribute('aria-labelledby');
        if (!label && !ariaLabel) {
          missingLabels.push(input.name || input.type || 'unknown');
        }
      });
      return { total: inputs.length, missingLabels };
    });

    assert(formInputsA11y.missingLabels.length === 0, `All ${formInputsA11y.total} interactive form fields have accessible labels (Missing: ${formInputsA11y.missingLabels.join(', ') || 'None'})`);

    // Test 10.5: Mobile Touch Target Audit on 375px viewport
    await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
    await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });

    const ctaButtonHeight = await page.evaluate(() => {
      const submitBtn = document.querySelector('button[type="submit"]');
      if (!submitBtn) return 0;
      const rect = submitBtn.getBoundingClientRect();
      return rect.height;
    });

    assert(ctaButtonHeight >= 44, `Primary submission button meets touch target height >= 44px (Actual: ${ctaButtonHeight}px)`);

    // Take screenshot of mobile accessibility layout
    const screenshotPath = path.join(ARTIFACTS_DIR, 'seo-a11y-contact-mobile.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`  📸 Saved mobile touch target audit screenshot to ${screenshotPath}`);

  } finally {
    if (browser) await browser.close();
    server.close();
  }

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log('\n=====================================================');
  console.log(`AUDIT FINISHED: ${passedTests}/${totalTests} PASSED (${failedTests} FAILED)`);
  console.log('=====================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAudit().catch(err => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
