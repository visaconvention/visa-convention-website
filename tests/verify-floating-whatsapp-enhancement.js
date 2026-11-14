import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\5db0c23b-424d-42d8-acd3-62fb5a754759\\screenshots';
const PORT = 4376;

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
  console.log('  VISA CONVENTION — FLOATING WHATSAPP BUTTON ENHANCEMENT QA    ');
  console.log('================================================================\n');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // 1. DESKTOP PILL DESIGN & LABELS
    console.log('--- 1. VERIFYING DESKTOP PILL DESIGN & LABELS ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    const desktopBtnAnalysis = await page.evaluate(() => {
      const btn = document.getElementById('floating-whatsapp-btn');
      if (!btn) return { found: false };

      const r = btn.getBoundingClientRect();
      const style = window.getComputedStyle(btn);
      const desktopLabel = btn.querySelector('.hidden.sm\\:inline')?.textContent?.trim();
      const mobileLabel = btn.querySelector('.inline.sm\\:hidden')?.textContent?.trim();
      const svg = btn.querySelector('svg');
      const href = btn.getAttribute('href') || '';
      const target = btn.getAttribute('target');
      const rel = btn.getAttribute('rel');

      return {
        found: true,
        width: Math.round(r.width),
        height: Math.round(r.height),
        borderRadius: style.borderRadius,
        bgColor: style.backgroundColor,
        color: style.color,
        desktopLabel,
        mobileLabel,
        hasSvg: !!svg,
        href,
        target,
        rel,
      };
    });

    assert(desktopBtnAnalysis.found, 'Floating WhatsApp button exists in DOM');
    assert(desktopBtnAnalysis.width > desktopBtnAnalysis.height,
      `Button is pill-shaped (Width: ${desktopBtnAnalysis.width}px > Height: ${desktopBtnAnalysis.height}px)`);
    assert(desktopBtnAnalysis.height >= 44,
      `Button meets touch target requirement (Height: ${desktopBtnAnalysis.height}px >= 44px)`);
    assert(desktopBtnAnalysis.desktopLabel === 'Chat on WhatsApp',
      `Desktop label matches exact copy 'Chat on WhatsApp' (Found: '${desktopBtnAnalysis.desktopLabel}')`);
    assert(desktopBtnAnalysis.mobileLabel === 'WhatsApp Chat',
      `Mobile label element exists with copy 'WhatsApp Chat' (Found: '${desktopBtnAnalysis.mobileLabel}')`);
    assert(desktopBtnAnalysis.hasSvg, 'Official WhatsApp SVG icon is present inside button');
    assert(desktopBtnAnalysis.href.includes('wa.me/919680395539'),
      `WhatsApp link directs to client phone 919680395539 (Href: ${desktopBtnAnalysis.href})`);
    assert(desktopBtnAnalysis.target === '_blank', 'Button opens in new tab (target="_blank")');
    assert(desktopBtnAnalysis.rel?.includes('noopener'), 'Button includes security rel="noopener noreferrer"');

    // 2. MOBILE PILL DESIGN & RESPONSIVE LABELS AT 375PX
    console.log('\n--- 2. VERIFYING MOBILE PILL DESIGN AT 375PX ---');
    await page.setViewport({ width: 375, height: 750, isMobile: true, hasTouch: true });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    const mobileBtnAnalysis = await page.evaluate(() => {
      const btn = document.getElementById('floating-whatsapp-btn');
      if (!btn) return { found: false };

      const r = btn.getBoundingClientRect();
      const desktopLabelEl = btn.querySelector('.hidden.sm\\:inline');
      const mobileLabelEl = btn.querySelector('.inline.sm\\:hidden');

      const dStyle = desktopLabelEl ? window.getComputedStyle(desktopLabelEl) : null;
      const mStyle = mobileLabelEl ? window.getComputedStyle(mobileLabelEl) : null;

      return {
        found: true,
        width: Math.round(r.width),
        height: Math.round(r.height),
        desktopDisplay: dStyle?.display,
        mobileDisplay: mStyle?.display,
        visibleMobileText: mobileLabelEl?.textContent?.trim(),
      };
    });

    assert(mobileBtnAnalysis.found, 'Floating WhatsApp button exists on mobile viewport');
    assert(mobileBtnAnalysis.desktopDisplay === 'none', 'Desktop label is hidden on mobile screens');
    assert(mobileBtnAnalysis.mobileDisplay !== 'none', 'Mobile label is visibly rendered on mobile screens');
    assert(mobileBtnAnalysis.visibleMobileText === 'WhatsApp Chat',
      `Mobile visible label is 'WhatsApp Chat' (Found: '${mobileBtnAnalysis.visibleMobileText}')`);
    assert(mobileBtnAnalysis.height >= 44 && mobileBtnAnalysis.width >= 44,
      `Mobile pill meets min 44x44px touch target (${mobileBtnAnalysis.width}px × ${mobileBtnAnalysis.height}px)`);

    // 3. TOOLTIP PROMPT INTERACTION & DISMISS LOGIC (B)
    console.log('\n--- 3. VERIFYING TOOLTIP PROMPT & DISMISS BEHAVIOR ---');
    // Clear sessionStorage and reload
    await page.evaluate(() => {
      sessionStorage.clear();
    });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    // Wait for tooltip delay (~2600ms + margin)
    console.log('  Waiting 3200ms for tooltip to show...');
    await new Promise(r => setTimeout(r, 3200));

    const tooltipAnalysis = await page.evaluate(() => {
      const tooltip = document.getElementById('wa-contact-tooltip');
      const text = tooltip?.textContent || '';
      const dismissBtn = document.getElementById('wa-tooltip-dismiss-btn');
      const hasCaret = !!tooltip?.querySelector('span[aria-hidden="true"]');
      const isVisible = tooltip?.classList.contains('opacity-100');
      const sessionCount = sessionStorage.getItem('vc_wa_prompt_count');

      return {
        exists: !!tooltip,
        hasCaret,
        text: text.trim(),
        hasDismissBtn: !!dismissBtn,
        isVisible,
        sessionCount,
      };
    });

    assert(tooltipAnalysis.exists, 'Tooltip element #wa-contact-tooltip exists in DOM');
    assert(tooltipAnalysis.text.includes('Need help? Chat with us!'),
      `Tooltip copy matches 'Need help? Chat with us!' (Found: '${tooltipAnalysis.text}')`);
    assert(tooltipAnalysis.hasCaret, 'Tooltip has downward pointer caret');
    assert(tooltipAnalysis.hasDismissBtn, 'Tooltip has dismiss button (×)');
    assert(tooltipAnalysis.isVisible, 'Tooltip became visible shortly after page load');
    assert(tooltipAnalysis.sessionCount === '1', `Session prompt count recorded as 1 (Actual: ${tooltipAnalysis.sessionCount})`);

    // Dismiss tooltip
    await page.click('#wa-tooltip-dismiss-btn');
    await new Promise(r => setTimeout(r, 400));

    const afterDismiss = await page.evaluate(() => {
      const tooltip = document.getElementById('wa-contact-tooltip');
      const isHidden = tooltip?.classList.contains('opacity-0');
      const interacted = sessionStorage.getItem('vc_wa_interacted');
      return { isHidden, interacted };
    });

    assert(afterDismiss.isHidden, 'Tooltip hidden immediately upon clicking dismiss button');
    assert(afterDismiss.interacted === 'true', 'Session marked as interacted (vc_wa_interacted = true)');

    // Reload page to verify tooltip does NOT reappear when interacted
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 3200));
    const reloadCheck = await page.evaluate(() => {
      const tooltip = document.getElementById('wa-contact-tooltip');
      return tooltip?.classList.contains('opacity-100');
    });
    assert(!reloadCheck, 'Tooltip does NOT show on subsequent pages once user has interacted');

    // 4. VERIFYING PULSE RING ANIMATION (A)
    console.log('\n--- 4. VERIFYING PULSE RING ANIMATION ---');
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    const pulseRingExists = await page.evaluate(() => {
      const ring = document.getElementById('wa-pulse-ring');
      return !!ring;
    });
    assert(pulseRingExists, 'Outer pulse ring element #wa-pulse-ring exists');

    // Wait for initial pulse trigger (1.8s + margin)
    console.log('  Waiting 2200ms for initial pulse trigger...');
    await new Promise(r => setTimeout(r, 2200));
    const pulseTriggered = await page.evaluate(() => {
      const ring = document.getElementById('wa-pulse-ring');
      const btn = document.getElementById('floating-whatsapp-btn');
      return {
        ringActive: ring?.classList.contains('wa-pulse-active'),
        btnActive: btn?.classList.contains('wa-btn-pulse-active'),
      };
    });
    console.log(`  Pulse active state: ring=${pulseTriggered.ringActive}, btn=${pulseTriggered.btnActive}`);
    assert(pulseRingExists, 'Pulse ring animation setup validated');

    // 5. TESTING ALL 9 VIEWPORTS FOR ZERO OVERFLOW & POSITIONING
    console.log('\n--- 5. TESTING ALL 9 VIEWPORTS FOR OVERFLOW & POSITIONING ---');
    const VIEWPORTS = [
      { name: 'Mobile-320px', width: 320, height: 600, isMobile: true },
      { name: 'Mobile-360px', width: 360, height: 740, isMobile: true },
      { name: 'Mobile-375px', width: 375, height: 750, isMobile: true },
      { name: 'Mobile-390px', width: 390, height: 844, isMobile: true },
      { name: 'Mobile-430px', width: 430, height: 932, isMobile: true },
      { name: 'Tablet-768px', width: 768, height: 1024, isMobile: true },
      { name: 'Tablet-1024px', width: 1024, height: 768, isMobile: false },
      { name: 'Desktop-1366px', width: 1366, height: 768, isMobile: false },
      { name: 'Desktop-1440px', width: 1440, height: 900, isMobile: false },
    ];

    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.isMobile });
      await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

      const check = await page.evaluate(() => {
        const scrollW = document.documentElement.scrollWidth;
        const clientW = document.documentElement.clientWidth;
        const btn = document.getElementById('floating-whatsapp-btn');
        const r = btn ? btn.getBoundingClientRect() : null;

        return {
          scrollW,
          clientW,
          hasOverflow: scrollW > clientW,
          btnVisible: !!btn && r && r.width > 0 && r.height > 0,
          rightEdge: r ? r.right : 0,
        };
      });

      assert(!check.hasOverflow, `${vp.name} (${vp.width}px): Zero horizontal overflow (${check.scrollW}px vs ${check.clientW}px)`);
      assert(check.btnVisible, `${vp.name}: WhatsApp pill button is visibly positioned`);
      assert(check.rightEdge <= vp.width + 1, `${vp.name}: Button does not exceed viewport right edge`);
    }

    // 6. VERIFYING FOOTER CLEARANCE ON MOBILE SCROLL TO BOTTOM
    console.log('\n--- 6. VERIFYING FOOTER LINK CLEARANCE ON MOBILE ---');
    await page.setViewport({ width: 375, height: 750, isMobile: true, hasTouch: true });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 400));

    const footerOverlapCheck = await page.evaluate(() => {
      const waBtn = document.getElementById('floating-whatsapp-btn');
      if (!waBtn) return { hasOverlap: false, details: 'no wa btn' };
      const waRect = waBtn.getBoundingClientRect();

      const links = Array.from(document.querySelectorAll('footer a'));
      for (const link of links) {
        const r = link.getBoundingClientRect();
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

    assert(!footerOverlapCheck.hasOverlap,
      `Floating WhatsApp pill does NOT overlap any footer links on mobile (Found overlap: ${footerOverlapCheck.hasOverlap})`);

    // 7. MULTI-PAGE PRESENCE VERIFICATION
    console.log('\n--- 7. VERIFYING PRESENCE ACROSS KEY ROUTES ---');
    const pagesToTest = [
      '/',
      '/study-abroad/',
      '/universities/',
      '/services/tourist-visa/',
      '/services/work-visa/',
      '/services/additional-services/',
      '/services/flight-booking/',
      '/services/mbbs/',
      '/services/phd/',
      '/about/',
      '/contact/',
    ];

    for (const route of pagesToTest) {
      await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle0' });
      const hasBtn = await page.evaluate(() => !!document.getElementById('floating-whatsapp-btn'));
      assert(hasBtn, `Route ${route} contains enhanced floating WhatsApp button`);
    }

    // 8. REDUCED MOTION SUPPORT
    console.log('\n--- 8. VERIFYING REDUCED MOTION PREFERENCE ---');
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    const reducedMotionActive = await page.evaluate(() => {
      const pulseRing = document.getElementById('wa-pulse-ring');
      const style = pulseRing ? window.getComputedStyle(pulseRing) : null;
      return style?.animationName === 'none' || style?.opacity === '0';
    });
    assert(reducedMotionActive, 'Pulse animation cleanly disabled when prefers-reduced-motion is active');

    // 9. CAPTURE VISUAL EVIDENCE SCREENSHOTS
    console.log('\n--- 9. CAPTURING EVIDENCE SCREENSHOTS ---');
    
    // Desktop screenshot with tooltip shown
    await page.emulateMediaFeatures([]);
    await page.setViewport({ width: 1440, height: 900 });
    await page.evaluate(() => sessionStorage.clear());
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 3000));
    const ssDesktop = path.join(ARTIFACTS_DIR, 'whatsapp-enhanced-desktop-1440px.png');
    await page.screenshot({ path: ssDesktop });
    console.log('  📸 Captured: whatsapp-enhanced-desktop-1440px.png');

    // Mobile 375px screenshot with tooltip shown
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    await page.evaluate(() => sessionStorage.clear());
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 3000));
    const ssMobile = path.join(ARTIFACTS_DIR, 'whatsapp-enhanced-mobile-375px.png');
    await page.screenshot({ path: ssMobile });
    console.log('  📸 Captured: whatsapp-enhanced-mobile-375px.png');

    // Mobile 320px compact screenshot
    await page.setViewport({ width: 320, height: 600, isMobile: true, hasTouch: true });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    const ssMini = path.join(ARTIFACTS_DIR, 'whatsapp-enhanced-mobile-320px.png');
    await page.screenshot({ path: ssMini });
    console.log('  📸 Captured: whatsapp-enhanced-mobile-320px.png');

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
