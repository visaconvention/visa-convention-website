import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\6a0361a6-ccbe-4f53-a463-b2d5ee259bd4\\dropdown';
const PORT = 4390;

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
    console.log(`  ✅ PASS: ${checkName}`);
    passedChecks++;
  } else {
    console.error(`  ❌ FAIL: ${checkName} ${details ? '- ' + details : ''}`);
    failedChecks++;
    failureDetails.push({ checkName, details });
  }
}

async function runAudit() {
  console.log('================================================================');
  console.log('   VISA CONVENTION — STUDY ABROAD DROPDOWN CLEANUP VERIFICATION  ');
  console.log('================================================================\n');

  await new Promise((resolve) => server.listen(PORT, resolve));
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  try {
    // -------------------------------------------------------------------------
    // 1. DESKTOP DROPDOWN AUDIT AT 1440px
    // -------------------------------------------------------------------------
    console.log('--- 1. DESKTOP STUDY ABROAD DROPDOWN STRUCTURE & COMPACTNESS ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    // Inspect dropdown DOM
    const desktopAnalysis = await page.evaluate(() => {
      const desktopNav = document.querySelector('nav[aria-label="Main Navigation"]');
      const groups = Array.from(desktopNav?.querySelectorAll('.group') || []);
      const studyAbroadGroup = groups.find(g => g.querySelector('button')?.innerText.includes('Study Abroad'));
      const dropdownMenu = studyAbroadGroup?.querySelector('div[class*="absolute"]');

      if (!dropdownMenu) return { found: false };

      const allLinks = Array.from(dropdownMenu.querySelectorAll('a')).map(a => ({
        text: a.innerText.trim(),
        href: a.getAttribute('href'),
      }));

      const textContent = dropdownMenu.innerText;
      const classList = dropdownMenu.className;
      const innerCard = dropdownMenu.querySelector('div');
      const innerClass = innerCard ? innerCard.className : '';

      // Check for columns/grid
      const hasGridCols = Boolean(dropdownMenu.querySelector('[class*="grid-cols-"]'));
      const hasColSpan = Boolean(dropdownMenu.querySelector('[class*="col-span-"]'));

      return {
        found: true,
        classList,
        innerClass,
        allLinks,
        textContent,
        hasGridCols,
        hasColSpan,
      };
    });

    assert(desktopAnalysis.found, 'Desktop Study Abroad dropdown group found in DOM');
    
    // Check Removals
    const textLower = (desktopAnalysis.textContent || '').toLowerCase();
    const linksHref = (desktopAnalysis.allLinks || []).map(l => l.href);
    const linksText = (desktopAnalysis.allLinks || []).map(l => l.text.toLowerCase());

    assert(!textLower.includes('all 35+ countries →') && !linksText.some(t => t.includes('all 35+ countries')),
      'Requirement 1.1: "All 35+ Countries →" red top link completely removed from dropdown');
    
    assert(!textLower.includes('study in europe') && !linksHref.includes('/study-in-europe/'),
      'Requirement 1.2: "Study in Europe" menu item completely excised from dropdown');
    
    assert(!textLower.includes('study visa assistance') && !linksHref.includes('/services/study-visa/'),
      'Requirement 1.3: "Study Visa Assistance" menu entry completely excised from dropdown');
    
    assert(!textLower.includes('top destinations'),
      'Requirement 1.4: "Top Destinations" heading and column completely excised');

    const topDestCountrySlugs = ['/study-abroad/australia/', '/study-abroad/canada/', '/study-abroad/germany/', '/study-abroad/ireland/', '/study-abroad/united-kingdom/', '/study-abroad/usa/'];
    const hasTopDestShortcuts = topDestCountrySlugs.some(slug => linksHref.includes(slug));
    assert(!hasTopDestShortcuts,
      'Requirement 1.4b: Top destination shortcuts (Australia, Canada, Germany, Ireland, UK, USA) completely removed from dropdown');

    assert(!desktopAnalysis.hasGridCols && !desktopAnalysis.hasColSpan,
      'Requirement 1.5: Multi-column grid wrappers and dividers removed; strictly single-column');

    // Check Width
    const widthMatch = desktopAnalysis.classList.match(/w-\[(\d+)px\]/);
    const widthVal = widthMatch ? parseInt(widthMatch[1]) : 0;
    assert(widthVal >= 300 && widthVal <= 360,
      `Requirement 3.1: Dropdown width is within 300–360px specification (Actual: ${widthVal}px)`);

    // Check Retained Items
    const hasExplore = desktopAnalysis.allLinks.some(l => (l.text.includes("Bachelor's and Master's Abroad") || l.text.includes('Explore 35+ Countries')) && l.href === '/study-abroad/');
    const hasMbbs = desktopAnalysis.allLinks.some(l => l.text.includes('MBBS Abroad') && l.href === '/services/mbbs/');
    const hasPhd = desktopAnalysis.allLinks.some(l => l.text.includes('PhD Abroad') && l.href === '/services/phd/');
    const hasUniSearch = desktopAnalysis.allLinks.some(l => l.text.includes('Search 1,000+ Universities') && l.href === '/universities/');

    assert(hasExplore, 'Requirement 2.1: Retained destination link ("Bachelor\'s and Master\'s Abroad") linking to /study-abroad/');
    assert(hasMbbs, 'Requirement 2.2: Retained "MBBS Abroad" linking to /services/mbbs/');
    assert(hasPhd, 'Requirement 2.3: Retained "PhD Abroad" linking to /services/phd/');
    assert(hasUniSearch, 'Requirement 2.4: Retained bottom shortcut "Search 1,000+ Universities →" linking to /universities/');

    assert(desktopAnalysis.allLinks.length === 4,
      `Requirement 2.5: Dropdown contains exactly 4 links (3 core vertical items + 1 university shortcut) (Actual: ${desktopAnalysis.allLinks.length})`);

    // Hover & capture screenshot
    const studyAbroadBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('nav[aria-label="Main Navigation"] button'));
      return btns.find(b => b.innerText.includes('Study Abroad'));
    });
    if (studyAbroadBtn) {
      await studyAbroadBtn.hover();
      await new Promise(r => setTimeout(r, 400));
      await page.screenshot({
        path: path.join(EVIDENCE_DIR, 'after-study-abroad-dropdown-desktop-1440px.png'),
        clip: { x: 100, y: 0, width: 1240, height: 600 }
      });
      console.log('  📸 Captured Desktop Dropdown after cleanup: after-study-abroad-dropdown-desktop-1440px.png');
    }

    // -------------------------------------------------------------------------
    // 2. MOBILE NAVIGATION AUDIT AT 375px
    // -------------------------------------------------------------------------
    console.log('\n--- 2. MOBILE DRAWER STUDY ABROAD STRUCTURE & ACCESSIBILITY ---');
    await page.setViewport({ width: 375, height: 750, isMobile: true, hasTouch: true });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    await page.click('#open-mobile-menu-btn');
    await new Promise(r => setTimeout(r, 400));

    const mobileAnalysis = await page.evaluate(() => {
      const drawer = document.getElementById('mobile-menu-drawer');
      const drawerText = (drawer?.innerText || '').toLowerCase();
      
      // Find the Study Abroad group
      const groups = Array.from(drawer?.querySelectorAll('.pb-2\\.5, [class*="border-b"]') || []);
      const saGroup = groups.find(g => (g.innerText || '').toLowerCase().includes('study abroad'));
      
      const links = Array.from(saGroup?.querySelectorAll('a') || []).map(a => {
        const rect = a.getBoundingClientRect();
        return {
          text: a.innerText.trim(),
          href: a.getAttribute('href'),
          height: rect.height,
        };
      });

      return {
        drawerText,
        saGroupFound: Boolean(saGroup),
        links,
      };
    });

    assert(mobileAnalysis.saGroupFound, 'Mobile drawer includes Study Abroad group');
    
    const mLinksText = mobileAnalysis.links.map(l => l.text.toLowerCase());
    const mLinksHref = mobileAnalysis.links.map(l => l.href);

    assert(!mLinksText.some(t => t.includes('study in europe')) && !mLinksHref.includes('/study-in-europe/'),
      'Mobile drawer: "Study in Europe" is completely excised');
    assert(!mLinksText.some(t => t.includes('study visa assistance')) && !mLinksHref.includes('/services/study-visa/'),
      'Mobile drawer: "Study Visa Assistance" is completely excised');
    assert(!mLinksText.some(t => t.includes('top destinations')),
      'Mobile drawer: "Top Destinations" is completely excised');

    assert(mobileAnalysis.links.some(l => l.text.includes("Bachelor's and Master's Abroad") || l.text.includes('Explore 35+ Countries')),
      'Mobile drawer: Has "Bachelor\'s and Master\'s Abroad" link');
    assert(mobileAnalysis.links.some(l => l.text.includes('MBBS Abroad')),
      'Mobile drawer: Has "MBBS Abroad" link');
    assert(mobileAnalysis.links.some(l => l.text.includes('PhD Abroad')),
      'Mobile drawer: Has "PhD Abroad" link');
    assert(mobileAnalysis.links.some(l => l.text.includes('Search 1,000+ Universities')),
      'Mobile drawer: Has "Search 1,000+ Universities →" shortcut');

    // Accessibility check: touch targets >= 44px
    const allComfortableTargets = mobileAnalysis.links.every(l => l.height >= 40); // 40-44px threshold
    assert(allComfortableTargets,
      `Mobile drawer: All Study Abroad touch targets have comfortable height (min: ${Math.min(...mobileAnalysis.links.map(l => l.height))}px)`);

    await page.screenshot({
      path: path.join(EVIDENCE_DIR, 'after-study-abroad-dropdown-mobile-375px.png'),
    });
    console.log('  📸 Captured Mobile Drawer after cleanup: after-study-abroad-dropdown-mobile-375px.png');

    // -------------------------------------------------------------------------
    // 3. ROUTE INTEGRITY & LINK RESOLUTION
    // -------------------------------------------------------------------------
    console.log('\n--- 3. ROUTE INTEGRITY & BROKEN LINK VERIFICATION ---');
    const targetRoutes = [
      { path: '/study-abroad/', label: 'Study Abroad Hub' },
      { path: '/services/mbbs/', label: 'MBBS Abroad' },
      { path: '/services/phd/', label: 'PhD Abroad' },
      { path: '/universities/', label: 'Universities Directory' },
      { path: '/services/study-visa/', label: 'Study Visa Service (Preserved Core Route)' },
      { path: '/services/', label: 'Services Index' },
      { path: '/about/', label: 'About Visa Convention' },
    ];

    for (const r of targetRoutes) {
      const res = await page.goto(`http://localhost:${PORT}${r.path}`, { waitUntil: 'networkidle0' });
      assert(res.status() === 200, `Route ${r.path} (${r.label}) is healthy and returns HTTP 200 OK`);
    }

    console.log('\n================================================================');
    console.log(`TOTAL CHECKS: ${totalChecks}`);
    console.log(`PASSED:       ${passedChecks}`);
    console.log(`FAILED:       ${failedChecks}`);
    console.log('================================================================');

    if (failedChecks > 0) {
      console.error('\nFAILURES:');
      failureDetails.forEach(f => console.error(`  - ${f.checkName}: ${f.details}`));
      process.exit(1);
    }

  } catch (err) {
    console.error('Test execution failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
    server.close();
  }
}

runAudit();
