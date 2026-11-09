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

  // 1. Desktop Design System (1440x900)
  console.log('Capturing Desktop Design System...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:4321/design-system/', { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'design-system-desktop.png'),
    fullPage: false,
  });

  // 2. Mobile Design System (390x844 - iPhone 14 / modern smartphone)
  console.log('Capturing Mobile Design System...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto('http://localhost:4321/design-system/', { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'design-system-mobile.png'),
    fullPage: false,
  });

  // 3. Desktop Homepage (1440x900)
  console.log('Capturing Desktop Homepage...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'homepage-desktop.png'),
    fullPage: false,
  });

  // 4. Mobile Homepage (390x844)
  console.log('Capturing Mobile Homepage...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'homepage-mobile.png'),
    fullPage: false,
  });

  await browser.close();
  console.log('All screenshots captured successfully in artifact directory!');
}

capture().catch((err) => {
  console.error('Error capturing preview:', err);
  process.exit(1);
});
