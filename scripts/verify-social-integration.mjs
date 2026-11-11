import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const DIST_DIR = path.resolve('dist');
const OUT_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\7ca130ef-5e70-4578-88a2-0879acc42caa';
const PORT = 4328;

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
      let reqPath = decodeURI(req.url.split('?')[0]);
      if (reqPath.endsWith('/')) reqPath += 'index.html';
      let filePath = path.join(DIST_DIR, reqPath);

      if (!path.extname(filePath)) {
        if (fs.existsSync(path.join(filePath, 'index.html'))) {
          filePath = path.join(filePath, 'index.html');
        } else if (fs.existsSync(filePath + '.html')) {
          filePath = filePath + '.html';
        }
      }

      fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
          return;
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
      });
    });
    server.listen(PORT, () => resolve(server));
  });
}

async function run() {
  const server = await startServer();
  console.log(`Test server running at http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // ── 1. Footer Social Links Audit on Homepage ─────────────────────────────
    console.log('\n--- SUITE 1: Footer Social Media Audit ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    const footerSocials = await page.evaluate(() => {
      const footer = document.querySelector('footer');
      if (!footer) return null;
      const links = Array.from(footer.querySelectorAll('a[href*="instagram.com"], a[href*="youtube.com"], a[href*="facebook.com"]'));
      return links.map(a => {
        const rect = a.getBoundingClientRect();
        const svg = a.querySelector('svg');
        const svgRect = svg ? svg.getBoundingClientRect() : null;
        return {
          href: a.href,
          target: a.getAttribute('target'),
          rel: a.getAttribute('rel'),
          ariaLabel: a.getAttribute('aria-label'),
          title: a.getAttribute('title'),
          targetWidth: Math.round(rect.width),
          targetHeight: Math.round(rect.height),
          iconWidth: svgRect ? Math.round(svgRect.width) : null,
          iconHeight: svgRect ? Math.round(svgRect.height) : null,
        };
      });
    });

    console.log(`Found ${footerSocials.length} published social links in footer:`);
    footerSocials.forEach(s => {
      console.log(`  ✓ ${s.title}: ${s.href}`);
      console.log(`    Target size: ${s.targetWidth}×${s.targetHeight}px, Icon: ${s.iconWidth}×${s.iconHeight}px, target=${s.target}, rel=${s.rel}`);
      if (s.target !== '_blank') throw new Error(`Target is not _blank: ${s.href}`);
      if (!s.rel.includes('noopener') || !s.rel.includes('noreferrer')) throw new Error(`Missing rel security attributes: ${s.rel}`);
      if (!s.ariaLabel) throw new Error(`Missing aria-label on ${s.href}`);
    });

    // Capture footer screenshot
    const footerEl = await page.$('footer');
    if (footerEl) {
      await footerEl.screenshot({ path: `${OUT_DIR}\\social-footer-desktop.png` });
      console.log('📸 Saved social-footer-desktop.png');
    }

    // ── 2. Contact Page "Follow Us" Audit ────────────────────────────────────
    console.log('\n--- SUITE 2: Contact Page "Follow Us" Audit ---');
    await page.goto(`http://localhost:${PORT}/contact/`, { waitUntil: 'networkidle0' });

    const contactSocials = await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('strong, h4, h3')).find(el => el.textContent.trim() === 'Follow Us');
      if (!heading) return { hasHeading: false };
      const container = heading.nextElementSibling;
      const links = container ? Array.from(container.querySelectorAll('a')) : [];
      return {
        hasHeading: true,
        links: links.map(a => {
          const rect = a.getBoundingClientRect();
          const svg = a.querySelector('svg');
          const svgRect = svg ? svg.getBoundingClientRect() : null;
          return {
            href: a.href,
            target: a.getAttribute('target'),
            rel: a.getAttribute('rel'),
            ariaLabel: a.getAttribute('aria-label'),
            title: a.getAttribute('title'),
            targetWidth: Math.round(rect.width),
            targetHeight: Math.round(rect.height),
            iconWidth: svgRect ? Math.round(svgRect.width) : null,
            iconHeight: svgRect ? Math.round(svgRect.height) : null,
          };
        }),
      };
    });

    console.log('Contact Page Heading "Follow Us" present:', contactSocials.hasHeading);
    contactSocials.links.forEach(s => {
      console.log(`  ✓ Contact ${s.title}: ${s.href}`);
      console.log(`    Target size: ${s.targetWidth}×${s.targetHeight}px, Icon: ${s.iconWidth}×${s.iconHeight}px`);
      if (s.target !== '_blank') throw new Error(`Contact target not _blank`);
      if (!s.rel.includes('noopener')) throw new Error(`Contact missing noopener`);
      if (!s.ariaLabel) throw new Error(`Contact missing aria-label`);
    });

    // Capture Contact Social Section element
    const followUsHeading = await page.evaluateHandle(() => {
      return Array.from(document.querySelectorAll('strong, h4, h3')).find(el => el.textContent.trim() === 'Follow Us');
    });
    if (followUsHeading) {
      const parent = await followUsHeading.evaluateHandle(el => el.closest('div'));
      if (parent && parent.asElement()) {
        await parent.asElement().screenshot({ path: `${OUT_DIR}\\social-contact-follow-us.png` });
        console.log('📸 Saved social-contact-follow-us.png');
      }
    }

    // ── 3. Structured Data Organization / LocalBusiness sameAs Audit ─────────
    console.log('\n--- SUITE 3: Structured Data (sameAs) Audit ---');
    const sameAsList = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
      for (const s of scripts) {
        try {
          const json = JSON.parse(s.textContent);
          if (json.sameAs && Array.isArray(json.sameAs)) {
            return json.sameAs;
          }
        } catch {}
      }
      return null;
    });

    console.log('Schema.org sameAs list:', sameAsList);
    if (!sameAsList || !sameAsList.includes('https://www.instagram.com/visaconvention/')) {
      throw new Error('Schema sameAs missing Instagram');
    }
    if (!sameAsList.includes('https://www.youtube.com/@VisaConvention')) {
      throw new Error('Schema sameAs missing YouTube');
    }
    if (sameAsList.some(u => u.includes('facebook.com') || u.includes('linkedin.com'))) {
      throw new Error('Schema sameAs contains unverified social accounts');
    }
    console.log('  ✅ PASS: Organization structured data contains only verified accounts');

    // ── 4. Mobile Responsiveness & Touch Target Audit (390px) ─────────────────
    console.log('\n--- SUITE 4: Mobile Responsive & Touch Target Audit ---');
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log('Mobile 390px horizontal overflow:', mobileOverflow ? 'FAIL' : 'NONE (PASS)');
    if (mobileOverflow) throw new Error('Mobile overflow detected');

    const mobileFooter = await page.$('footer');
    if (mobileFooter) {
      await mobileFooter.screenshot({ path: `${OUT_DIR}\\social-footer-mobile.png` });
      console.log('📸 Saved social-footer-mobile.png');
    }

    console.log('\n=====================================================');
    console.log('✅ ALL SOCIAL MEDIA INTEGRATION CHECKS PASSED!');
    console.log('=====================================================');

  } finally {
    await browser.close();
    server.close();
  }
}

run().catch(e => {
  console.error('Audit failure:', e.message);
  process.exit(1);
});
