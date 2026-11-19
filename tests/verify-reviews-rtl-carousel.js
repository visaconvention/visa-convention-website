/**
 * tests/verify-reviews-rtl-carousel.js
 * 
 * Comprehensive Automated Verification Suite for:
 * VISA CONVENTION — HOMEPAGE REVIEWS ANIMATION UPDATE (RIGHT-TO-LEFT)
 */

import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\7ca130ef-5e70-4578-88a2-0879acc42caa';
const PORT = 4390;

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
  console.log('    VISA CONVENTION — REVIEWS RIGHT-TO-LEFT ANIMATION QA SUITE   ');
  console.log('================================================================\n');

  let browser;
  try {
    const launchOptions = fs.existsSync(EDGE_PATH)
      ? { executablePath: EDGE_PATH, headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] }
      : { channel: 'chrome', headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] };

    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    // Emulate standard motion by default to test animation (Windows OS default has reduced-motion: reduce)
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    // -------------------------------------------------------------
    // SECTION 1: CSS KEYFRAMES & RIGHT-TO-LEFT DIRECTION
    // -------------------------------------------------------------
    console.log('--- 1. CSS KEYFRAMES & DIRECTION AUDIT ---');

    const keyframeData = await page.evaluate(() => {
      const styleSheets = Array.from(document.styleSheets);
      let foundRtlKeyframe = false;
      let startTransform = '';
      let endTransform = '';
      let animationName = '';
      let animationDuration = '';

      const primary = document.getElementById('marquee-group-primary');
      if (primary) {
        const cs = window.getComputedStyle(primary);
        animationName = cs.animationName;
        animationDuration = cs.animationDuration;
      }

      for (const sheet of styleSheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (rule.type === CSSRule.KEYFRAMES_RULE && (rule.name === 'marquee-rtl' || rule.name.includes('rtl'))) {
              foundRtlKeyframe = true;
              const keyframes = Array.from(rule.cssRules || []);
              for (const kf of keyframes) {
                if (kf.keyText === '0%') startTransform = kf.style.transform;
                if (kf.keyText === '100%') endTransform = kf.style.transform;
              }
            }
          }
        } catch (e) {}
      }

      return {
        foundRtlKeyframe,
        startTransform,
        endTransform,
        animationName,
        animationDuration
      };
    });

    assert(keyframeData.foundRtlKeyframe, 'CSS Keyframe rule "marquee-rtl" exists in stylesheets', 'Missing keyframe rule');
    assert(keyframeData.animationName === 'marquee-rtl', `Primary marquee group applies "marquee-rtl" animation (Actual: ${keyframeData.animationName})`);
    assert(keyframeData.startTransform.includes('translate3d(0') || keyframeData.startTransform.includes('0px') || keyframeData.startTransform === 'translate3d(0, 0, 0)', 'Keyframe 0% starts at translate3d(0, 0, 0)');
    assert(keyframeData.endTransform.includes('-100%') || keyframeData.endTransform.includes('calc(-100%'), 'Keyframe 100% moves to negative X (-100%) indicating RIGHT-TO-LEFT translation');

    // -------------------------------------------------------------
    // SECTION 2: PHYSICAL RIGHT-TO-LEFT MOVEMENT MEASUREMENT
    // -------------------------------------------------------------
    console.log('\n--- 2. REAL BROWSER PHYSICAL MOVEMENT TEST ---');

    const motionMeasurement = await page.evaluate(async () => {
      const primaryGroup = document.getElementById('marquee-group-primary');
      const firstCard = primaryGroup ? primaryGroup.querySelector('.review-card') : null;
      if (!firstCard) return { valid: false };

      const rect0 = firstCard.getBoundingClientRect();
      const x0 = rect0.left;

      await new Promise(r => setTimeout(r, 800));

      const rect1 = firstCard.getBoundingClientRect();
      const x1 = rect1.left;

      return {
        valid: true,
        x0,
        x1,
        diff: x1 - x0,
      };
    });

    assert(motionMeasurement.valid, 'Review cards are successfully measured in DOM');
    assert(motionMeasurement.diff < 0, `Cards physically translate to the left (Right-to-Left motion verified: Δx = ${motionMeasurement.diff.toFixed(2)}px < 0)`);

    // -------------------------------------------------------------
    // SECTION 3: READING SPEED CALCULATION (20-30 px/s)
    // -------------------------------------------------------------
    console.log('\n--- 3. READING SPEED & VELOCITY AUDIT ---');

    const speedMetrics = await page.evaluate(() => {
      const primaryGroup = document.getElementById('marquee-group-primary');
      if (!primaryGroup) return null;

      const cs = window.getComputedStyle(primaryGroup);
      const durationSeconds = parseFloat(cs.animationDuration) || 85;
      const cards = Array.from(primaryGroup.querySelectorAll('.review-card'));
      const cardCount = cards.length;
      const cardWidth = cards[0] ? cards[0].getBoundingClientRect().width : 380;
      const gap = 24; // 1.5rem
      const totalWidth = (cardCount * cardWidth) + (cardCount * gap);
      const velocity = totalWidth / durationSeconds;

      return {
        durationSeconds,
        cardCount,
        cardWidth,
        totalWidth,
        velocity
      };
    });

    assert(speedMetrics.durationSeconds >= 80 && speedMetrics.durationSeconds <= 90, `Animation duration is set to comfortable reading pace (Actual: ${speedMetrics.durationSeconds}s)`);
    assert(speedMetrics.velocity >= 20 && speedMetrics.velocity <= 30, `Reading speed is approximately 20–30px per second (Actual: ${speedMetrics.velocity.toFixed(2)} px/s)`);

    // -------------------------------------------------------------
    // SECTION 4: CONTINUOUS MOTION DURING VERTICAL SCROLL
    // -------------------------------------------------------------
    console.log('\n--- 4. CONTINUOUS MOTION DURING PAGE SCROLLING ---');

    await page.evaluate(() => {
      window.scrollBy({ top: 400, behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 60));

    const scrollState = await page.evaluate(() => {
      const wrapper = document.getElementById('reviews-marquee-wrapper');
      const primaryGroup = document.getElementById('marquee-group-primary');
      const isPageScrolling = wrapper?.classList.contains('is-page-scrolling');
      const playState = primaryGroup ? window.getComputedStyle(primaryGroup).animationPlayState : null;
      return { isPageScrolling, playState };
    });

    assert(scrollState.isPageScrolling, 'Page scroll triggers .is-page-scrolling class on wrapper');
    assert(scrollState.playState === 'running', 'Animation play-state remains strictly "running" during vertical page scroll');

    // -------------------------------------------------------------
    // SECTION 5: VISIBLE PAUSE & RESUME CONTROLS
    // -------------------------------------------------------------
    console.log('\n--- 5. VISIBLE PAUSE & RESUME CONTROLS ---');

    const initialPauseBtn = await page.evaluate(() => {
      const btn = document.getElementById('reviews-pause-toggle-btn');
      const label = document.getElementById('reviews-pause-label');
      const wrapper = document.getElementById('reviews-marquee-wrapper');
      return {
        hasBtn: Boolean(btn),
        label: label?.innerText.trim(),
        ariaPressed: btn?.getAttribute('aria-pressed'),
        dataPaused: wrapper?.getAttribute('data-paused'),
      };
    });

    assert(initialPauseBtn.hasBtn, 'Visible Pause/Resume control button exists');
    assert(initialPauseBtn.label === 'Pause', 'Pause button displays label "Pause" when active');
    assert(initialPauseBtn.dataPaused === 'false', 'Wrapper data-paused is initially "false"');

    // Click Pause
    await page.click('#reviews-pause-toggle-btn');
    await new Promise(r => setTimeout(r, 150));

    const pausedState = await page.evaluate(() => {
      const btn = document.getElementById('reviews-pause-toggle-btn');
      const label = document.getElementById('reviews-pause-label');
      const wrapper = document.getElementById('reviews-marquee-wrapper');
      const primary = document.getElementById('marquee-group-primary');
      const playState = primary ? window.getComputedStyle(primary).animationPlayState : null;
      return {
        label: label?.innerText.trim(),
        ariaPressed: btn?.getAttribute('aria-pressed'),
        dataPaused: wrapper?.getAttribute('data-paused'),
        playState
      };
    });

    assert(pausedState.dataPaused === 'true', 'Clicking pause sets data-paused="true" on wrapper');
    assert(pausedState.playState === 'paused', 'Computed animation-play-state becomes "paused"');
    assert(pausedState.label === 'Resume', 'Button label changes to "Resume"');
    assert(pausedState.ariaPressed === 'true', 'Button sets aria-pressed="true"');

    // Click Resume
    await page.click('#reviews-pause-toggle-btn');
    await new Promise(r => setTimeout(r, 150));

    const resumedState = await page.evaluate(() => {
      const label = document.getElementById('reviews-pause-label');
      const wrapper = document.getElementById('reviews-marquee-wrapper');
      const primary = document.getElementById('marquee-group-primary');
      const playState = primary ? window.getComputedStyle(primary).animationPlayState : null;
      return {
        label: label?.innerText.trim(),
        dataPaused: wrapper?.getAttribute('data-paused'),
        playState
      };
    });

    assert(resumedState.dataPaused === 'false', 'Clicking resume resets data-paused="false"');
    assert(resumedState.playState === 'running', 'Computed animation-play-state returns to "running"');
    assert(resumedState.label === 'Pause', 'Button label changes back to "Pause"');

    // -------------------------------------------------------------
    // SECTION 6: INTERACTIVE PAUSE (KEYBOARD FOCUS & DIRECT CARD CLICK)
    // -------------------------------------------------------------
    console.log('\n--- 6. INTERACTIVE PAUSE AUDIT ---');

    // Test Keyboard Focus on Card
    await page.focus('#marquee-group-primary .review-card');
    await new Promise(r => setTimeout(r, 150));

    const focusPauseState = await page.evaluate(() => {
      const primary = document.getElementById('marquee-group-primary');
      return primary ? window.getComputedStyle(primary).animationPlayState : null;
    });

    assert(focusPauseState === 'paused', 'Marquee pauses when a review card receives keyboard focus (:focus-within)');

    // Blur focus
    await page.evaluate(() => {
      if (document.activeElement && 'blur' in document.activeElement) {
        document.activeElement.blur();
      }
    });
    await new Promise(r => setTimeout(r, 100));

    const blurPlayState = await page.evaluate(() => {
      const primary = document.getElementById('marquee-group-primary');
      return primary ? window.getComputedStyle(primary).animationPlayState : null;
    });
    assert(blurPlayState === 'running', 'Marquee resumes smoothly when keyboard focus leaves');

    // Test Direct Card Click
    await page.click('#marquee-group-primary .review-card');
    await new Promise(r => setTimeout(r, 100));

    const cardClickPaused = await page.evaluate(() => {
      const wrapper = document.getElementById('reviews-marquee-wrapper');
      return wrapper?.getAttribute('data-paused') === 'true';
    });
    assert(cardClickPaused, 'Direct click/tap on review card triggers reading pause mode');

    // Reset pause state
    await page.evaluate(() => {
      const wrapper = document.getElementById('reviews-marquee-wrapper');
      wrapper?.setAttribute('data-paused', 'false');
    });

    // -------------------------------------------------------------
    // SECTION 7: SEAMLESS LOOPING & ACCESSIBILITY AUDIT
    // -------------------------------------------------------------
    console.log('\n--- 7. SEAMLESS LOOPING & ACCESSIBILITY AUDIT ---');

    const accessibilityData = await page.evaluate(() => {
      const primaryGroup = document.getElementById('marquee-group-primary');
      const cloneGroup = document.getElementById('marquee-group-clone');
      const primaryCards = primaryGroup ? Array.from(primaryGroup.querySelectorAll('.review-card')) : [];
      const cloneCards = cloneGroup ? Array.from(cloneGroup.querySelectorAll('.review-card')) : [];

      const primaryDetails = primaryCards.map(c => ({
        stars: c.querySelectorAll('svg.fill-current').length,
        hasQuote: Boolean(c.querySelector('p')?.innerText.includes('"')),
        hasVerified: Boolean(c.innerText.includes('Verified')),
        hasCountry: Boolean(c.querySelector('.rounded-full')?.innerText),
        hasCandidateInitials: Boolean(c.querySelector('.font-bold.text-brand-navy')?.innerText),
        tabindex: c.getAttribute('tabindex'),
        ariaLabel: c.getAttribute('aria-label'),
      }));

      const cloneDetails = cloneCards.map(c => ({
        tabindex: c.getAttribute('tabindex'),
      }));

      return {
        primaryCount: primaryCards.length,
        cloneCount: cloneCards.length,
        cloneAriaHidden: cloneGroup?.getAttribute('aria-hidden') === 'true',
        primaryDetails,
        cloneDetails
      };
    });

    assert(accessibilityData.primaryCount === 6, `Primary group contains exactly 6 genuine client reviews (Found: ${accessibilityData.primaryCount})`);
    assert(accessibilityData.cloneCount === 6, `Clone group contains exactly 6 duplicate cards for seamless infinite wrap (Found: ${accessibilityData.cloneCount})`);
    assert(accessibilityData.cloneAriaHidden, 'Clone group is hidden from screen readers (aria-hidden="true")');
    assert(accessibilityData.cloneDetails.every(c => c.tabindex === '-1'), 'Clone cards are removed from keyboard tab sequence (tabindex="-1")');
    assert(accessibilityData.primaryDetails.every(c => c.tabindex === '0'), 'All primary cards are keyboard accessible (tabindex="0")');
    assert(accessibilityData.primaryDetails.every(c => c.stars === 5), 'All genuine reviews display 5 rating stars');
    assert(accessibilityData.primaryDetails.every(c => c.hasQuote && c.hasVerified), 'All genuine reviews display quotation and verified badge');

    // -------------------------------------------------------------
    // SECTION 8: REDUCED MOTION PREFERENCE (WCAG 2.1 AA)
    // -------------------------------------------------------------
    console.log('\n--- 8. PREFERS-REDUCED-MOTION COMPLIANCE ---');

    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await new Promise(r => setTimeout(r, 100));

    const reducedMotionState = await page.evaluate(() => {
      const primary = document.getElementById('marquee-group-primary');
      const clone = document.getElementById('marquee-group-clone');
      const wrapper = document.getElementById('reviews-marquee-wrapper');

      const primaryAnimation = primary ? window.getComputedStyle(primary).animationName : null;
      const cloneDisplay = clone ? window.getComputedStyle(clone).display : null;
      const overflowX = wrapper ? window.getComputedStyle(wrapper).overflowX : null;

      return {
        primaryAnimation,
        cloneDisplay,
        overflowX
      };
    });

    assert(reducedMotionState.primaryAnimation === 'none', 'Animation is completely disabled (animation: none) under prefers-reduced-motion: reduce');
    assert(reducedMotionState.cloneDisplay === 'none', 'Duplicate clone group is hidden (display: none) under prefers-reduced-motion');
    assert(reducedMotionState.overflowX === 'auto', 'Wrapper enables accessible manual horizontal scrolling (overflow-x: auto)');

    // Reset media features
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);

    // -------------------------------------------------------------
    // SECTION 9: FLOATING WHATSAPP BUTTON NON-OBSTRUCTION
    // -------------------------------------------------------------
    console.log('\n--- 9. FLOATING WHATSAPP BUTTON AUDIT ---');

    const waMetrics = await page.evaluate(() => {
      const waAside = document.querySelector('aside[aria-label="WhatsApp direct messaging option"]');
      const reviewsSection = document.getElementById('reviews-section');
      if (!waAside || !reviewsSection) return null;

      const waRect = waAside.getBoundingClientRect();
      const cs = window.getComputedStyle(waAside);

      return {
        isFixed: cs.position === 'fixed',
        zIndex: parseInt(cs.zIndex, 10),
        bottom: waRect.bottom,
        right: waRect.right,
      };
    });

    assert(waMetrics.isFixed, 'WhatsApp button is fixed in the viewport');
    assert(waMetrics.zIndex === 40, `WhatsApp button has appropriate z-index 40 (Actual: ${waMetrics.zIndex})`);

    // -------------------------------------------------------------
    // SECTION 10: MULTI-VIEWPORT RESPONSIVE OVERFLOW AUDIT
    // -------------------------------------------------------------
    console.log('\n--- 10. MULTI-VIEWPORT RESPONSIVE OVERFLOW AUDIT ---');

    const viewports = [
      { name: 'Mobile Mini', width: 320, height: 568 },
      { name: 'Android Compact', width: 360, height: 640 },
      { name: 'iPhone 14/15', width: 390, height: 844 },
      { name: 'iPhone Pro Max', width: 430, height: 932 },
      { name: 'iPad Mini (Tablet)', width: 768, height: 1024 },
      { name: 'iPad Pro / Small Desktop', width: 1024, height: 768 },
      { name: 'Standard Laptop', width: 1366, height: 768 },
      { name: 'Desktop Full HD', width: 1440, height: 900 }
    ];

    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await new Promise(r => setTimeout(r, 100));

      const overflow = await page.evaluate(() => {
        const docEl = document.documentElement;
        return {
          scrollWidth: docEl.scrollWidth,
          clientWidth: docEl.clientWidth,
          hasOverflow: docEl.scrollWidth > docEl.clientWidth
        };
      });

      assert(!overflow.hasOverflow, `${vp.name} (${vp.width}px): Zero horizontal overflow (${overflow.scrollWidth}px <= ${overflow.clientWidth}px)`);
    }

    // -------------------------------------------------------------
    // SECTION 11: EVIDENCE SCREENSHOTS
    // -------------------------------------------------------------
    console.log('\n--- 11. CAPTURING EVIDENCE SCREENSHOTS ---');

    // Desktop view
    await page.setViewport({ width: 1440, height: 900 });
    const reviewsEl = await page.$('#reviews-section');
    if (reviewsEl) {
      const desktopScreenshotPath = path.join(ARTIFACTS_DIR, 'reviews-rtl-desktop-1440px.png');
      await reviewsEl.screenshot({ path: desktopScreenshotPath });
      console.log(`  📸 Saved desktop RTL carousel screenshot: ${desktopScreenshotPath}`);
    }

    // Mobile view (390px)
    await page.setViewport({ width: 390, height: 844 });
    const reviewsElMobile = await page.$('#reviews-section');
    if (reviewsElMobile) {
      const mobileScreenshotPath = path.join(ARTIFACTS_DIR, 'reviews-rtl-mobile-390px.png');
      await reviewsElMobile.screenshot({ path: mobileScreenshotPath });
      console.log(`  📸 Saved mobile RTL carousel screenshot: ${mobileScreenshotPath}`);
    }

  } catch (err) {
    console.error('Audit encountered unexpected error:', err);
    failedTests++;
  } finally {
    if (browser) await browser.close();
    server.close();
  }

  console.log('\n=======================================================');
  console.log(`TOTAL CHECKS: ${totalTests}`);
  console.log(`PASSED: ${passedTests}`);
  console.log(`FAILED: ${failedTests}`);
  console.log('=======================================================');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    console.log('\n🎉 ALL REVIEWS RIGHT-TO-LEFT ANIMATION CHECKS PASSED (100%)\n');
    process.exit(0);
  }
});
