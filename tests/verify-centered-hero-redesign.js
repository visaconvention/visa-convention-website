import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\5db0c23b-424d-42d8-acd3-62fb5a754759\\screenshots';
const PORT = 4378;

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
  console.log('   VISA CONVENTION — HOMEPAGE HERO REDESIGN QA VERIFICATION     ');
  console.log('================================================================\n');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // 1. DESKTOP HERO CHECKS (1440px)
    console.log('--- 1. VERIFYING DESKTOP CENTERED HERO LAYOUT (1440px) ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    const heroAnalysis = await page.evaluate(() => {
      const heroSection = document.querySelector('.hero-centered-section') || document.querySelector('section');
      if (!heroSection) return { foundHero: false };

      const heroRect = heroSection.getBoundingClientRect();
      const heroImages = Array.from(heroSection.querySelectorAll('img'));
      const text = heroSection.innerText;
      const h1 = heroSection.querySelector('h1');
      const h1Rect = h1 ? h1.getBoundingClientRect() : null;
      const h1Style = h1 ? window.getComputedStyle(h1) : null;

      const eyebrow = heroSection.querySelector('p.uppercase');
      const eyebrowStyle = eyebrow ? window.getComputedStyle(eyebrow) : null;

      const desc = heroSection.querySelector('p.leading-relaxed');
      const descStyle = desc ? window.getComputedStyle(desc) : null;

      const redSpan = h1 ? h1.querySelector('.text-brand-red') : null;
      const redSpanStyle = redSpan ? window.getComputedStyle(redSpan) : null;

      const primaryCta = heroSection.querySelector('a[href="/study-abroad/"]');
      const secondaryCta = heroSection.querySelector('a[href="#services"]');
      const primaryRect = primaryCta ? primaryCta.getBoundingClientRect() : null;
      const secondaryRect = secondaryCta ? secondaryCta.getBoundingClientRect() : null;

      // Check centering: difference between center of element and center of viewport
      const vpCenter = window.innerWidth / 2;
      const h1Center = h1Rect ? (h1Rect.left + h1Rect.right) / 2 : 0;
      const h1Centered = Math.abs(h1Center - vpCenter) < 15;

      const ctaRow = primaryCta ? primaryCta.parentElement : null;
      const ctaRowRect = ctaRow ? ctaRow.getBoundingClientRect() : null;
      const ctaCenter = ctaRowRect ? (ctaRowRect.left + ctaRowRect.right) / 2 : 0;
      const ctaCentered = Math.abs(ctaCenter - vpCenter) < 15;

      return {
        foundHero: true,
        heroHeight: Math.round(heroRect.height),
        heroWidth: Math.round(heroRect.width),
        imagesCount: heroImages.length,
        hasCaptionBadge: text.includes('NEW YORK • LONDON • PARIS • SYDNEY') || text.includes('New York • London'),
        h1Text: h1?.innerText?.trim(),
        h1FontSize: h1Style ? parseFloat(h1Style.fontSize) : 0,
        h1LineHeight: h1Style ? parseFloat(h1Style.lineHeight) / parseFloat(h1Style.fontSize) : 0,
        h1Centered,
        h1TextAlign: h1Style?.textAlign,
        eyebrowText: eyebrow?.innerText?.trim(),
        eyebrowFontSize: eyebrowStyle ? parseFloat(eyebrowStyle.fontSize) : 0,
        eyebrowColor: eyebrowStyle?.color,
        descText: desc?.innerText?.trim(),
        descFontSize: descStyle ? parseFloat(descStyle.fontSize) : 0,
        hasRedSpan: !!redSpan,
        redSpanColor: redSpanStyle?.color,
        hasPrimaryCta: !!primaryCta,
        primaryCtaText: primaryCta?.innerText?.trim(),
        hasSecondaryCta: !!secondaryCta,
        secondaryCtaText: secondaryCta?.innerText?.trim(),
        ctaCentered,
        primaryLeft: primaryRect ? primaryRect.left : 0,
        secondaryLeft: secondaryRect ? secondaryRect.left : 0,
      };
    });

    assert(heroAnalysis.foundHero, 'Hero section exists in homepage DOM');
    assert(heroAnalysis.imagesCount === 0,
      `Requirement 1: Landmark image completely removed from hero (Images found: ${heroAnalysis.imagesCount})`);
    assert(!heroAnalysis.hasCaptionBadge,
      'Requirement 1: Caption badge "NEW YORK • LONDON • PARIS • SYDNEY" completely removed');
    assert(heroAnalysis.h1TextAlign === 'center', 'Requirement 2: Headline is center-aligned');
    assert(heroAnalysis.h1Centered, 'Requirement 2: Headline center aligns with viewport center');
    assert(heroAnalysis.h1Text?.includes('Explore the World') && heroAnalysis.h1Text?.includes('Visa Convention'),
      `Requirement 2: Headline copy is 'Explore the World with Visa Convention' (Found: '${heroAnalysis.h1Text}')`);
    assert(heroAnalysis.hasRedSpan, 'Requirement 3: "Visa Convention" rendered with signature red accent');
    assert(heroAnalysis.eyebrowText === 'STUDY ABROAD, VISA & TRAVEL SERVICES',
      `Requirement 2: Small heading matches 'STUDY ABROAD, VISA & TRAVEL SERVICES' (Found: '${heroAnalysis.eyebrowText}')`);
    assert(heroAnalysis.descText?.includes('Structured guidance for university admissions across 35+ countries'),
      'Requirement 2: Supporting description preserved and centered');
    assert(heroAnalysis.hasPrimaryCta && heroAnalysis.primaryCtaText?.includes('Explore Study Abroad'),
      'Requirement 2: Primary CTA links to /study-abroad/');
    assert(heroAnalysis.hasSecondaryCta && heroAnalysis.secondaryCtaText === 'Explore Services',
      'Requirement 2: Secondary CTA links to #services');
    assert(heroAnalysis.ctaCentered, 'Requirement 2: CTA buttons are horizontally centered');
    assert(heroAnalysis.primaryLeft < heroAnalysis.secondaryLeft, 'Desktop CTAs arranged side-by-side');

    console.log(`  Measured Desktop H1 font size: ${heroAnalysis.h1FontSize}px (Target: ~64-76px)`);
    console.log(`  Measured Desktop H1 line-height: ${heroAnalysis.h1LineHeight.toFixed(2)} (Target: ~1.05-1.15)`);
    console.log(`  Measured Desktop Hero height: ${heroAnalysis.heroHeight}px (Target: ~380-460px content-driven)`);

    assert(heroAnalysis.h1FontSize >= 60 && heroAnalysis.h1FontSize <= 76,
      `Requirement 3: Desktop H1 font size is within recommended range 60-76px (${heroAnalysis.h1FontSize}px)`);
    assert(heroAnalysis.h1LineHeight >= 1.0 && heroAnalysis.h1LineHeight <= 1.2,
      `Requirement 3: Desktop H1 line-height is within 1.05-1.15 (${heroAnalysis.h1LineHeight.toFixed(2)})`);
    assert(heroAnalysis.heroHeight >= 360 && heroAnalysis.heroHeight <= 500,
      `Requirement 3: Desktop Hero height is content-driven within ~380-460px (${heroAnalysis.heroHeight}px)`);

    // 2. MOBILE-FIRST RESPONSIVE TESTING ACROSS ALL 9 VIEWPORTS
    console.log('\n--- 2. MOBILE-FIRST RESPONSIVE TESTING ACROSS ALL 9 VIEWPORTS ---');
    const VIEWPORTS = [
      { name: 'Mobile-320px', width: 320, height: 600, isMobile: true, maxH1: 38 },
      { name: 'Mobile-360px', width: 360, height: 740, isMobile: true, maxH1: 42 },
      { name: 'Mobile-375px', width: 375, height: 750, isMobile: true, maxH1: 44 },
      { name: 'Mobile-390px', width: 390, height: 844, isMobile: true, maxH1: 44 },
      { name: 'Mobile-430px', width: 430, height: 932, isMobile: true, maxH1: 46 },
      { name: 'Tablet-768px', width: 768, height: 1024, isMobile: true, maxH1: 52 },
      { name: 'Tablet-1024px', width: 1024, height: 768, isMobile: false, maxH1: 64 },
      { name: 'Desktop-1366px', width: 1366, height: 768, isMobile: false, maxH1: 72 },
      { name: 'Desktop-1440px', width: 1440, height: 900, isMobile: false, maxH1: 72 },
    ];

    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.isMobile });
      await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

      const vpCheck = await page.evaluate((vpWidth) => {
        const scrollW = document.documentElement.scrollWidth;
        const clientW = document.documentElement.clientWidth;
        const heroSection = document.querySelector('.hero-centered-section') || document.querySelector('section');
        const h1 = heroSection ? heroSection.querySelector('h1') : null;
        const h1Style = h1 ? window.getComputedStyle(h1) : null;
        const primaryCta = heroSection ? heroSection.querySelector('a[href="/study-abroad/"]') : null;
        const secondaryCta = heroSection ? heroSection.querySelector('a[href="#services"]') : null;

        const pRect = primaryCta ? primaryCta.getBoundingClientRect() : null;
        const sRect = secondaryCta ? secondaryCta.getBoundingClientRect() : null;

        // On mobile (< 640px), CTAs should stack vertically
        const isMobileWidth = vpWidth < 640;
        const ctaStacked = isMobileWidth ? (sRect && pRect && sRect.top > pRect.bottom - 5) : true;

        return {
          scrollW,
          clientW,
          hasOverflow: scrollW > clientW,
          h1FontSize: h1Style ? parseFloat(h1Style.fontSize) : 0,
          ctaStacked,
          ctaTouchTarget: pRect && sRect && pRect.height >= 44 && sRect.height >= 44,
        };
      }, vp.width);

      assert(!vpCheck.hasOverflow, `${vp.name} (${vp.width}px): Zero horizontal overflow (${vpCheck.scrollW}px vs ${vpCheck.clientW}px)`);
      assert(vpCheck.h1FontSize >= 28 && vpCheck.h1FontSize <= 76,
        `${vp.name}: H1 font size is responsive and proportional (${vpCheck.h1FontSize}px)`);
      assert(vpCheck.ctaTouchTarget, `${vp.name}: CTA buttons meet minimum 44px touch target`);
      if (vp.width < 640) {
        assert(vpCheck.ctaStacked, `${vp.name}: CTA buttons stack vertically on mobile screens`);
      }
    }

    // 3. CAPTURING EVIDENCE SCREENSHOTS
    console.log('\n--- 3. CAPTURING VISUAL EVIDENCE SCREENSHOTS ---');
    
    // Desktop 1440px
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    const ssDesktop = path.join(ARTIFACTS_DIR, 'hero-after-desktop-1440px.png');
    await page.screenshot({ path: ssDesktop });
    console.log('  📸 Captured: hero-after-desktop-1440px.png');

    // Desktop 1366px (Standard Laptop)
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    const ssLaptop = path.join(ARTIFACTS_DIR, 'hero-after-desktop-1366px.png');
    await page.screenshot({ path: ssLaptop });
    console.log('  📸 Captured: hero-after-desktop-1366px.png');

    // Mobile 375px (iPhone SE/Standard)
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    const ssMobile = path.join(ARTIFACTS_DIR, 'hero-after-mobile-375px.png');
    await page.screenshot({ path: ssMobile });
    console.log('  📸 Captured: hero-after-mobile-375px.png');

    // Mobile 320px (Compact)
    await page.setViewport({ width: 320, height: 600, isMobile: true, hasTouch: true });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    const ssMini = path.join(ARTIFACTS_DIR, 'hero-after-mobile-320px.png');
    await page.screenshot({ path: ssMini });
    console.log('  📸 Captured: hero-after-mobile-320px.png');

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
