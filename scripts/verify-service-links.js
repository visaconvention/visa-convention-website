import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');

const servicePages = [
  'services/index.html',
  'services/study-visa/index.html',
  'services/mbbs/index.html',
  'services/phd/index.html',
  'services/tourist-visa/index.html',
  'services/work-visa/index.html',
  'services/flight-booking/index.html',
  'services/additional-services/index.html',
];

console.log('--- VERIFYING SERVICE PAGE LINKS ---');

let totalLinksChecked = 0;
let errorsFound = 0;

for (const relPage of servicePages) {
  const fullPath = path.join(DIST_DIR, relPage);
  if (!fs.existsSync(fullPath)) {
    console.error(`ERROR: Missing page ${relPage}`);
    errorsFound++;
    continue;
  }

  const html = fs.readFileSync(fullPath, 'utf8');
  // Match hrefs
  const hrefMatches = [...html.matchAll(/href="([^"#][^"]*)"/g)];
  
  console.log(`\nChecking ${relPage} (${hrefMatches.length} links)...`);

  for (const match of hrefMatches) {
    const href = match[1];
    
    // Ignore external urls, mailto, tel
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      continue;
    }

    totalLinksChecked++;

    // Internal link
    let targetPath = href.split('?')[0];
    if (targetPath.endsWith('/')) targetPath += 'index.html';
    if (!path.extname(targetPath)) {
      if (fs.existsSync(path.join(DIST_DIR, targetPath, 'index.html'))) {
        targetPath = path.join(targetPath, 'index.html');
      } else {
        targetPath += '.html';
      }
    }

    // Clean leading slash
    if (targetPath.startsWith('/')) targetPath = targetPath.slice(1);

    const exists = fs.existsSync(path.join(DIST_DIR, targetPath));
    if (!exists) {
      console.error(`  ❌ BROKEN LINK: ${href} (Resolved to ${targetPath})`);
      errorsFound++;
    }
  }
}

console.log(`\nSummary: Checked ${totalLinksChecked} internal links across ${servicePages.length} service pages.`);
if (errorsFound === 0) {
  console.log('✅ ALL INTERNAL SERVICE LINKS ARE VALID AND REACHABLE!');
} else {
  console.error(`❌ FOUND ${errorsFound} BROKEN LINKS!`);
  process.exit(1);
}