import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\7ca130ef-5e70-4578-88a2-0879acc42caa';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function capture() {
  console.log('Launching Edge via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  // 1. Desktop Homepage (1440x900)
  console.log('Capturing Desktop Homepage (1440x900)...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'homepage-desktop-1440.png'),
    fullPage: false,
  });

  // 2. Tablet Homepage (768x1024 - iPad / Medium Tablet)
  console.log('Capturing Tablet Homepage (768x1024)...');
  await page.setViewport({ width: 768, height: 1024, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'homepage-tablet-768.png'),
    fullPage: false,
  });

  // 3. Mobile Homepage (390x844 - iPhone / Modern Smartphone)
  console.log('Capturing Mobile Homepage (390x844)...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'homepage-mobile-390.png'),
    fullPage: false,
  });

  // 4. Full Page Desktop Homepage
  console.log('Capturing Full-Page Desktop Homepage...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'homepage-fullpage.png'),
    fullPage: true,
  });

  await browser.close();
  console.log('All responsive viewport screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Error capturing previews:', err);
  process.exit(1);
});
