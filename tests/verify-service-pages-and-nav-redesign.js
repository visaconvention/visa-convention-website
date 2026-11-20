import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\6a0361a6-ccbe-4f53-a463-b2d5ee259bd4\\service-pages-and-nav-redesign';
const PORT = 4394;

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

async function runVerification() {
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Verification test server running at http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const results = {
    navigation: {},
    mbbs: {},
    phd: {},
    workVisa: {},
    viewports: {},
    screenshots: [],
    allPass: true,
  };

  try {
    // -------------------------------------------------------------
    // 1. HEADER NAVIGATION VERIFICATION
    // -------------------------------------------------------------
    console.log('\n=== 1. Verifying Two-Line Header Navigation ===');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    const navAudit = await page.evaluate(() => {
      const nav = document.querySelector('nav[aria-label="Main Navigation"]');
      if (!nav) return { error: 'Desktop navigation nav element not found' };

      const items = Array.from(nav.children);
      const audit = items.map((el) => {
        const btn = el.querySelector('button');
        const link = el.tagName === 'A' ? el : el.querySelector('a');
        const target = btn || link;
        const text = target ? target.innerText.replace(/\s+/g, ' ').trim() : '';
        const lines = target ? Array.from(target.querySelectorAll('.leading-\\[1\\.15\\] > span')).map(s => s.textContent.trim()) : [];
        const hasChevron = Boolean(target?.querySelector('.chevron-icon'));
        const href = link?.getAttribute('href') || btn?.getAttribute('aria-controls') || '';
        const rect = target ? target.getBoundingClientRect() : null;

        return {
          text,
          lines,
          isDropdown: Boolean(btn),
          hasChevron,
          href,
          height: rect ? Math.round(rect.height) : 0,
          minTouchTargetPass: rect ? rect.height >= 44 : false,
        };
      });

      return { audit };
    });

    console.log('Desktop Nav Audit:', JSON.stringify(navAudit.audit, null, 2));
    results.navigation.desktop = navAudit.audit;

    // Check specific 4 items
    const studyAbroad = navAudit.audit.find(i => i.text.startsWith('Study Abroad'));
    const touristVisa = navAudit.audit.find(i => i.text === 'Tourist Visa');
    const workVisa = navAudit.audit.find(i => i.text === 'Work Visa');
    const additionalServices = navAudit.audit.find(i => i.text.startsWith('Additional Services'));
    const flights = navAudit.audit.find(i => i.text.startsWith('Flights'));
    const about = navAudit.audit.find(i => i.text.startsWith('About'));

    const studyAbroadPass = studyAbroad && studyAbroad.lines[0] === 'Study' && studyAbroad.lines[1] === 'Abroad' && studyAbroad.hasChevron;
    const touristVisaPass = touristVisa && touristVisa.lines[0] === 'Tourist' && touristVisa.lines[1] === 'Visa' && !touristVisa.hasChevron && touristVisa.href === '/services/tourist-visa/';
    const workVisaPass = workVisa && workVisa.lines[0] === 'Work' && workVisa.lines[1] === 'Visa' && !workVisa.hasChevron && workVisa.href === '/services/work-visa/';
    const additionalServicesPass = additionalServices && additionalServices.lines[0] === 'Additional' && additionalServices.lines[1] === 'Services' && additionalServices.hasChevron;
    const flightsPass = flights && flights.text.includes('Flights') && flights.hasChevron;
    const aboutPass = about && about.text.includes('About') && about.hasChevron;

    results.navigation.studyAbroadPass = studyAbroadPass;
    results.navigation.touristVisaPass = touristVisaPass;
    results.navigation.workVisaPass = workVisaPass;
    results.navigation.additionalServicesPass = additionalServicesPass;
    results.navigation.flightsPass = flightsPass;
    results.navigation.aboutPass = aboutPass;

    console.log(`Study Abroad 2-line pass: ${studyAbroadPass}`);
    console.log(`Tourist Visa 2-line pass: ${touristVisaPass}`);
    console.log(`Work Visa 2-line pass: ${workVisaPass}`);
    console.log(`Additional Services 2-line pass: ${additionalServicesPass}`);
    console.log(`Flights unchanged pass: ${flightsPass}`);
    console.log(`About unchanged pass: ${aboutPass}`);

    // Capture Header Screenshot at 1440px
    const headerEl = await page.$('header');
    if (headerEl) {
      const headerShotPath = path.join(EVIDENCE_DIR, 'header-navigation-desktop-1440px.png');
      await headerEl.screenshot({ path: headerShotPath });
      results.screenshots.push('header-navigation-desktop-1440px.png');
      console.log('Saved:', headerShotPath);
    }

    // Verify Mobile Navigation Drawer at 390px
    console.log('\n--- Verifying Mobile Navigation Menu (390px) ---');
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    await page.click('#open-mobile-menu-btn');
    await new Promise((r) => setTimeout(r, 400));

    const mobileNavAudit = await page.evaluate(() => {
      const drawer = document.getElementById('mobile-menu-drawer');
      const isVisible = drawer && !drawer.classList.contains('hidden');
      const links = drawer ? Array.from(drawer.querySelectorAll('a')).map(a => ({
        text: a.innerText.replace(/\s+/g, ' ').trim(),
        href: a.getAttribute('href') || '',
        height: Math.round(a.getBoundingClientRect().height),
        touchTargetPass: a.getBoundingClientRect().height >= 44,
      })) : [];

      return {
        isVisible,
        linksCount: links.length,
        hasTouristVisa: links.some(l => l.href === '/services/tourist-visa/' && l.text.includes('Tourist')),
        hasWorkVisa: links.some(l => l.href === '/services/work-visa/' && l.text.includes('Work')),
        allTouchTargetsPass: links.every(l => l.touchTargetPass),
        links,
      };
    });

    results.navigation.mobile = mobileNavAudit;
    console.log('Mobile Nav Audit:', mobileNavAudit);

    const mobileDrawerShot = path.join(EVIDENCE_DIR, 'header-navigation-mobile-390px.png');
    await page.screenshot({ path: mobileDrawerShot, fullPage: false });
    results.screenshots.push('header-navigation-mobile-390px.png');
    console.log('Saved:', mobileDrawerShot);

    // -------------------------------------------------------------
    // 2. MBBS ABROAD PAGE VERIFICATION
    // -------------------------------------------------------------
    console.log('\n=== 2. Verifying MBBS Abroad Page ===');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/services/mbbs/`, { waitUntil: 'networkidle0' });

    const mbbsAudit = await page.evaluate(() => {
      const html = document.body.innerHTML;
      const redundantSectionExists = html.includes('Plan Your Medical Degree Abroad') ||
                                    html.includes('Hanumangarh Counseling Office') ||
                                    html.includes('Direct Medical Desk');

      const leftCol = document.querySelector('section#universities .min-\\[1100px\\]\\:col-span-8');
      const rightAside = document.querySelector('aside#enquiry');
      const form = document.getElementById('visa-enquiry-form');

      const countryBtns = Array.from(document.querySelectorAll('.mbbs-country-btn'));
      const uniCards = Array.from(document.querySelectorAll('#mbbs-universities-grid .uni-card'));

      let sideBySide = false;
      let leftRect = null;
      let rightRect = null;

      if (leftCol && rightAside) {
        leftRect = leftCol.getBoundingClientRect();
        rightRect = rightAside.getBoundingClientRect();
        sideBySide = Math.abs(leftRect.top - rightRect.top) < 30 && rightRect.left >= leftRect.right;
      }

      return {
        redundantSectionExists,
        hasTwoColumnLayout: Boolean(leftCol && rightAside),
        sideBySide,
        leftRect,
        rightRect,
        countryBtnsCount: countryBtns.length,
        uniCardsCount: uniCards.length,
        hasForm: Boolean(form),
        formSingleColumn: form ? form.querySelector('.grid-cols-1') !== null : false,
      };
    });

    results.mbbs.desktop = mbbsAudit;
    console.log('MBBS Desktop Audit:', mbbsAudit);

    // Test MBBS Country Click & University autofill
    console.log('Testing MBBS Country click & university card autofill...');
    const mbbsInteractive = await page.evaluate(async () => {
      const firstCountryBtn = document.querySelector('.mbbs-country-btn');
      if (!firstCountryBtn) return { error: 'No MBBS country button found' };

      const countryName = firstCountryBtn.getAttribute('data-country-name');
      firstCountryBtn.click();

      const uniSection = document.getElementById('mbbs-universities-section');
      const uniSectionVisible = uniSection && !uniSection.classList.contains('hidden');
      const visibleCards = Array.from(document.querySelectorAll('#mbbs-universities-grid .uni-card')).filter(c => !c.classList.contains('hidden'));

      // Click first visible card
      let autofillSuccess = false;
      if (visibleCards.length > 0) {
        const firstCard = visibleCards[0];
        const cardUniName = firstCard.getAttribute('data-university-name');
        firstCard.click();

        const countrySelect = document.getElementById('form-country');
        const contextBanner = document.getElementById('enquiry-context-banner');
        const contextText = document.getElementById('context-banner-text')?.textContent || '';

        autofillSuccess = contextBanner && !contextBanner.classList.contains('hidden') && contextText.includes(cardUniName);
      }

      return {
        countryName,
        uniSectionVisible,
        visibleCardsCount: visibleCards.length,
        autofillSuccess,
      };
    });

    results.mbbs.interactive = mbbsInteractive;
    console.log('MBBS Interactive Test:', mbbsInteractive);

    // Capture MBBS Screenshots
    const mbbsDesktopShot = path.join(EVIDENCE_DIR, 'mbbs-desktop-1440px.png');
    await page.screenshot({ path: mbbsDesktopShot, fullPage: false });
    results.screenshots.push('mbbs-desktop-1440px.png');

    // Test Mobile Stacking on MBBS
    await page.setViewport({ width: 375, height: 812 });
    await page.goto(`http://localhost:${PORT}/services/mbbs/`, { waitUntil: 'networkidle0' });
    const mbbsMobileAudit = await page.evaluate(() => {
      const leftCol = document.querySelector('section#universities .min-\\[1100px\\]\\:col-span-8');
      const rightAside = document.querySelector('aside#enquiry');
      if (!leftCol || !rightAside) return { error: 'Missing elements' };

      const leftRect = leftCol.getBoundingClientRect();
      const rightRect = rightAside.getBoundingClientRect();
      const stacked = rightRect.top >= leftRect.bottom - 20;

      return {
        stacked,
        leftTop: Math.round(leftRect.top),
        rightTop: Math.round(rightRect.top),
        overflow: document.documentElement.scrollWidth > 375,
      };
    });
    results.mbbs.mobile = mbbsMobileAudit;
    console.log('MBBS Mobile Audit:', mbbsMobileAudit);

    const mbbsMobileShot = path.join(EVIDENCE_DIR, 'mbbs-mobile-375px.png');
    await page.screenshot({ path: mbbsMobileShot, fullPage: false });
    results.screenshots.push('mbbs-mobile-375px.png');

    // -------------------------------------------------------------
    // 3. PHD ABROAD PAGE VERIFICATION
    // -------------------------------------------------------------
    console.log('\n=== 3. Verifying PhD Abroad Page ===');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/services/phd/`, { waitUntil: 'networkidle0' });

    const phdAudit = await page.evaluate(() => {
      const html = document.body.innerHTML;
      const redundantSectionExists = html.includes('PhD Admissions Guidance') ||
                                    html.includes('Direct Research Desk');

      const leftCol = document.querySelector('section#universities .min-\\[1100px\\]\\:col-span-8');
      const rightAside = document.querySelector('aside#enquiry');
      const countryBtns = Array.from(document.querySelectorAll('.phd-country-btn'));
      const countryNames = countryBtns.map(b => b.getAttribute('data-country-name'));

      const uniCards = Array.from(document.querySelectorAll('#phd-university-grid .phd-uni-card'));
      const uniData = uniCards.map(c => ({
        name: c.getAttribute('data-university-name'),
        country: c.getAttribute('data-country-name'),
      }));

      let sideBySide = false;
      if (leftCol && rightAside) {
        const leftRect = leftCol.getBoundingClientRect();
        const rightRect = rightAside.getBoundingClientRect();
        sideBySide = Math.abs(leftRect.top - rightRect.top) < 30 && rightRect.left >= leftRect.right;
      }

      // Check initial collapse
      const uniSection = document.getElementById('phd-universities-section');
      const initiallyCollapsed = uniSection?.classList.contains('hidden');

      return {
        redundantSectionExists,
        sideBySide,
        countryNames,
        exact3Countries: countryNames.length === 3 && countryNames.includes('Latvia') && countryNames.includes('Lithuania') && countryNames.includes('Portugal'),
        totalUnis: uniData.length,
        exact7Unis: uniData.length === 7,
        initiallyCollapsed,
        uniData,
      };
    });

    results.phd.desktop = phdAudit;
    console.log('PhD Desktop Audit:', phdAudit);

    // Test PhD Country Click & University Filter Mapping
    console.log('Testing PhD university mapping per country...');
    const phdMapping = await page.evaluate(() => {
      const mapping = {};
      const countryBtns = Array.from(document.querySelectorAll('.phd-country-btn'));

      countryBtns.forEach(btn => {
        const country = btn.getAttribute('data-country-name');
        btn.click();
        const visibleUnis = Array.from(document.querySelectorAll('#phd-university-grid .phd-uni-card'))
          .filter(c => !c.classList.contains('hidden'))
          .map(c => c.getAttribute('data-university-name'));
        mapping[country] = visibleUnis;
      });

      return mapping;
    });

    console.log('PhD University Mapping:', JSON.stringify(phdMapping, null, 2));
    results.phd.mapping = phdMapping;

    const latviaMatch = phdMapping['Latvia']?.length === 2 && phdMapping['Latvia'].includes('Riga Technical University') && phdMapping['Latvia'].includes('Turība University');
    const lithuaniaMatch = phdMapping['Lithuania']?.length === 3 && phdMapping['Lithuania'].includes('Vilnius University (VU)') && phdMapping['Lithuania'].includes('Kaunas University of Technology (KTU)') && phdMapping['Lithuania'].includes('Vilnius Gediminas Technical University (Vilnius Tech)');
    const portugalMatch = phdMapping['Portugal']?.length === 2 && phdMapping['Portugal'].includes('University of Lisbon') && phdMapping['Portugal'].includes('University of Porto');

    results.phd.mappingPass = latviaMatch && lithuaniaMatch && portugalMatch;
    console.log(`PhD Latvia match: ${latviaMatch}`);
    console.log(`PhD Lithuania match: ${lithuaniaMatch}`);
    console.log(`PhD Portugal match: ${portugalMatch}`);

    const phdDesktopShot = path.join(EVIDENCE_DIR, 'phd-desktop-1440px.png');
    await page.screenshot({ path: phdDesktopShot, fullPage: false });
    results.screenshots.push('phd-desktop-1440px.png');

    // Test PhD Mobile Stacking
    await page.setViewport({ width: 375, height: 812 });
    await page.goto(`http://localhost:${PORT}/services/phd/`, { waitUntil: 'networkidle0' });
    const phdMobileAudit = await page.evaluate(() => {
      const leftCol = document.querySelector('section#universities .min-\\[1100px\\]\\:col-span-8');
      const rightAside = document.querySelector('aside#enquiry');
      if (!leftCol || !rightAside) return { error: 'Missing elements' };

      const leftRect = leftCol.getBoundingClientRect();
      const rightRect = rightAside.getBoundingClientRect();
      return {
        stacked: rightRect.top >= leftRect.bottom - 20,
        overflow: document.documentElement.scrollWidth > 375,
      };
    });
    results.phd.mobile = phdMobileAudit;
    console.log('PhD Mobile Audit:', phdMobileAudit);

    const phdMobileShot = path.join(EVIDENCE_DIR, 'phd-mobile-375px.png');
    await page.screenshot({ path: phdMobileShot, fullPage: false });
    results.screenshots.push('phd-mobile-375px.png');

    // -------------------------------------------------------------
    // 4. WORK VISA PAGE VERIFICATION
    // -------------------------------------------------------------
    console.log('\n=== 4. Verifying Work Visa Page ===');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/services/work-visa/`, { waitUntil: 'networkidle0' });

    const workVisaAudit = await page.evaluate(() => {
      const html = document.body.innerHTML;
      const redundantSectionExists = html.includes('Employment Terms & Contract Evaluation') ||
                                    html.includes('6 Essential Contract Evaluation Criteria') ||
                                    html.includes('Worker Protection Checklist') ||
                                    html.includes('Document Verification Standard');

      const statutoryNoticePreserved = html.includes('Emigration Act, 1983') ||
                                      html.includes('STATUTORY REGULATORY DISCLOSURE');

      const leftCol = document.querySelector('section .min-\\[1100px\\]\\:col-span-8');
      const rightAside = document.querySelector('aside#enquiry');
      const destinationsSection = document.getElementById('destinations');
      const occupationsSection = document.getElementById('occupations');

      let sideBySide = false;
      if (leftCol && rightAside) {
        const leftRect = leftCol.getBoundingClientRect();
        const rightRect = rightAside.getBoundingClientRect();
        sideBySide = Math.abs(leftRect.top - rightRect.top) < 30 && rightRect.left >= leftRect.right;
      }

      return {
        redundantSectionExists,
        statutoryNoticePreserved,
        sideBySide,
        hasDestinations: Boolean(destinationsSection),
        hasOccupations: Boolean(occupationsSection),
      };
    });

    results.workVisa.desktop = workVisaAudit;
    console.log('Work Visa Desktop Audit:', workVisaAudit);

    // Test Destination Accordion & Occupation Accordion in Left Column
    const workVisaInteractive = await page.evaluate(() => {
      // Check destinations
      const destGroupBtns = Array.from(document.querySelectorAll('.dest-group-toggle'));
      // Check occupations
      const occToggles = Array.from(document.querySelectorAll('.occ-toggle'));

      return {
        destGroupCount: destGroupBtns.length,
        occToggleCount: occToggles.length,
      };
    });
    results.workVisa.interactive = workVisaInteractive;
    console.log('Work Visa Interactive Elements:', workVisaInteractive);

    const workVisaDesktopShot = path.join(EVIDENCE_DIR, 'work-visa-desktop-1440px.png');
    await page.screenshot({ path: workVisaDesktopShot, fullPage: false });
    results.screenshots.push('work-visa-desktop-1440px.png');

    // Test Work Visa Mobile Stacking
    await page.setViewport({ width: 375, height: 812 });
    await page.goto(`http://localhost:${PORT}/services/work-visa/`, { waitUntil: 'networkidle0' });
    const workVisaMobileAudit = await page.evaluate(() => {
      const leftCol = document.querySelector('section .min-\\[1100px\\]\\:col-span-8');
      const rightAside = document.querySelector('aside#enquiry');
      if (!leftCol || !rightAside) return { error: 'Missing elements' };

      const leftRect = leftCol.getBoundingClientRect();
      const rightRect = rightAside.getBoundingClientRect();
      return {
        stacked: rightRect.top >= leftRect.bottom - 20,
        overflow: document.documentElement.scrollWidth > 375,
      };
    });
    results.workVisa.mobile = workVisaMobileAudit;
    console.log('Work Visa Mobile Audit:', workVisaMobileAudit);

    const workVisaMobileShot = path.join(EVIDENCE_DIR, 'work-visa-mobile-375px.png');
    await page.screenshot({ path: workVisaMobileShot, fullPage: false });
    results.screenshots.push('work-visa-mobile-375px.png');

    // -------------------------------------------------------------
    // 5. VIEWPORTS OVERFLOW AUDIT ACROSS ALL 8 TARGET WIDTHS
    // -------------------------------------------------------------
    console.log('\n=== 5. Verifying Responsive Viewports (320, 360, 390, 430, 768, 1024, 1366, 1440px) ===');
    const targetWidths = [320, 360, 390, 430, 768, 1024, 1366, 1440];
    const pagesToTest = ['/services/mbbs/', '/services/phd/', '/services/work-visa/'];

    for (const pUrl of pagesToTest) {
      results.viewports[pUrl] = {};
      for (const w of targetWidths) {
        await page.setViewport({ width: w, height: 800 });
        await page.goto(`http://localhost:${PORT}${pUrl}`, { waitUntil: 'networkidle0' });

        const overflowCheck = await page.evaluate((width) => {
          const docEl = document.documentElement;
          const bodyEl = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, bodyEl.scrollWidth);
          const hasOverflow = scrollWidth > width + 1; // 1px tolerance for fractional subpixel
          return {
            width,
            scrollWidth,
            hasOverflow,
          };
        }, w);

        results.viewports[pUrl][w] = overflowCheck;
        if (overflowCheck.hasOverflow) {
          console.warn(`WARNING: Overflow detected on ${pUrl} at ${w}px! scrollWidth: ${overflowCheck.scrollWidth}`);
          results.allPass = false;
        }
      }
      console.log(`Viewports check passed for ${pUrl}: zero horizontal scroll across all 8 widths.`);
    }

    // Write audit results JSON
    fs.writeFileSync(path.join(EVIDENCE_DIR, 'audit-results.json'), JSON.stringify(results, null, 2));
    console.log('\nVerification complete! Results written to audit-results.json');

  } catch (err) {
    console.error('Error during verification:', err);
    results.allPass = false;
    results.error = err.message;
  } finally {
    await browser.close();
    server.close();
  }

  return results;
}

runVerification();
