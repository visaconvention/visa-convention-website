import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_DIR = path.resolve('public/assets/brand');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1200px;
      height: 630px;
      background: linear-gradient(135deg, #102A53 0%, #0B1C38 100%);
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      color: #FFFFFF;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 70px 80px;
      position: relative;
      overflow: hidden;
    }
    .glow-1 {
      position: absolute;
      top: -100px;
      right: -100px;
      width: 450px;
      height: 450px;
      background: rgba(35, 103, 164, 0.35);
      border-radius: 50%;
      filter: blur(80px);
    }
    .glow-2 {
      position: absolute;
      bottom: -120px;
      left: -100px;
      width: 400px;
      height: 400px;
      background: rgba(201, 29, 50, 0.25);
      border-radius: 50%;
      filter: blur(80px);
    }
    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      z-index: 10;
    }
    .brand-mark {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .logo-box {
      width: 56px;
      height: 56px;
      background: #C91D32;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px rgba(201, 29, 50, 0.4);
    }
    .logo-box svg {
      width: 32px;
      height: 32px;
      fill: #FFFFFF;
    }
    .brand-name {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #FFFFFF;
    }
    .badge {
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 8px 18px;
      border-radius: 30px;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #F5F8FC;
    }
    .content {
      position: relative;
      z-index: 10;
      max-width: 950px;
    }
    h1 {
      font-size: 54px;
      font-weight: 900;
      line-height: 1.15;
      letter-spacing: -1.5px;
      margin-bottom: 20px;
    }
    h1 span {
      color: #C91D32;
    }
    p {
      font-size: 22px;
      line-height: 1.5;
      color: #CBD5E1;
      font-weight: 400;
    }
    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      padding-top: 28px;
      position: relative;
      z-index: 10;
      font-size: 16px;
      color: #94A3B8;
      font-weight: 600;
    }
    .tags {
      display: flex;
      gap: 24px;
    }
    .tag {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #E2E8F0;
    }
    .tag-dot {
      width: 8px;
      height: 8px;
      background: #C91D32;
      border-radius: 50%;
    }
  </style>
</head>
<body>
  <div class="glow-1"></div>
  <div class="glow-2"></div>

  <div class="top-bar">
    <div class="brand-mark">
      <div class="logo-box">
        <svg viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      </div>
      <div class="brand-name">VISA CONVENTION</div>
    </div>
    <div class="badge">Hanumangarh • Rajasthan • Global</div>
  </div>

  <div class="content">
    <h1>Your Trusted Partner for <span>Global Visas</span> &amp; International Education</h1>
    <p>Professional study visa counseling, MBBS/PhD admissions, tourist visa facilitation, and flight reservation assistance across 35+ destination countries.</p>
  </div>

  <div class="footer">
    <div class="tags">
      <div class="tag"><div class="tag-dot"></div> 35+ Countries Guided</div>
      <div class="tag"><div class="tag-dot"></div> 1,015+ Universities</div>
      <div class="tag"><div class="tag-dot"></div> Zero Hidden Fees</div>
    </div>
    <div>visaconvention.com</div>
  </div>
</body>
</html>
`;

async function generate() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630 });
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const jpgPath = path.join(OUTPUT_DIR, 'og-image.jpg');
  const pngPath = path.join(OUTPUT_DIR, 'og-image.png');

  await page.screenshot({ path: jpgPath, type: 'jpeg', quality: 90 });
  await page.screenshot({ path: pngPath, type: 'png' });

  console.log(`Generated OG images:\n  ${jpgPath}\n  ${pngPath}`);
  await browser.close();
}

generate().catch(console.error);
