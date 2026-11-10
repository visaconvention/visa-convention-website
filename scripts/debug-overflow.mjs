import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const DIST_DIR = path.resolve('dist');
const PORT = 4330;

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  let filePath = path.join(DIST_DIR, reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.writeHead(200);
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 768 });
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

  const overflowInfo = await page.evaluate(() => {
    const docWidth = document.documentElement.scrollWidth;
    const bodyWidth = document.body.scrollWidth;
    const elements = Array.from(document.querySelectorAll('*'));
    const overflowing = elements
      .filter(el => {
        const r = el.getBoundingClientRect();
        return r.right > 1024;
      })
      .map(el => ({
        tag: el.tagName,
        id: el.id,
        className: el.className ? (typeof el.className === 'string' ? el.className.slice(0, 80) : '') : '',
        right: el.getBoundingClientRect().right,
        width: el.getBoundingClientRect().width,
        outerHTML: el.outerHTML.slice(0, 150)
      }));
    return { docWidth, bodyWidth, overflowing: overflowing.slice(0, 10) };
  });

  console.log('Document scrollWidth:', overflowInfo.docWidth);
  console.log('Body scrollWidth:', overflowInfo.bodyWidth);
  console.log('Top overflowing elements:', JSON.stringify(overflowInfo.overflowing, null, 2));

  await browser.close();
  server.close();
});
