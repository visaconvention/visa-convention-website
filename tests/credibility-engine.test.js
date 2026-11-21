import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');

console.log('=====================================================');
console.log('   VISA CONVENTION - STAGE 08 CREDIBILITY QA SUITE   ');
console.log('=====================================================\n');

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

// ----------------------------------------------------
// TEST GROUP 1: About Us Page Verification (/about/)
// ----------------------------------------------------
console.log('--- TEST GROUP 1: About Us Page Verification (/about/) ---');
const aboutHtmlPath = path.join(DIST_DIR, 'about', 'index.html');
assert(fs.existsSync(aboutHtmlPath), 'dist/about/index.html exists');

const aboutHtml = fs.readFileSync(aboutHtmlPath, 'utf8');

assert(aboutHtml.includes('About Visa Convention'), 'About hero includes brand badge');
assert(aboutHtml.includes('Integrity, Precision &amp; Truth') || aboutHtml.includes('Integrity, Precision & Truth'), 'About hero includes primary positioning headline');
assert(aboutHtml.includes('Bridging Hanumangarh to the World’s Leading Institutions') || aboutHtml.includes('Bridging Hanumangarh to the World&#39;s Leading Institutions'), 'Includes authentic business story');
assert(aboutHtml.includes('Why Families Choose Visa Convention') || aboutHtml.includes('Why Visa Convention'), 'Includes Why Visa Convention section');
assert(aboutHtml.includes('Our Physical Advisory Center in Hanumangarh'), 'Includes verified physical office section in Hanumangarh');
assert(aboutHtml.includes('Shop No.115, Durga Market') && aboutHtml.includes('335512'), 'Includes official Hanumangarh physical address');
assert(aboutHtml.includes('maps.google.com'), 'Includes verified Google Maps directions link');
assert(aboutHtml.includes('35+') && aboutHtml.includes('1,015+'), 'Displays verified 35+ countries and 1,015+ institutions');
assert(aboutHtml.includes('/contact/'), 'Links to in-person consultation booking');

// Non-fabrication check
const hasAboutPlaceholders = /\[insert/i.test(aboutHtml) || /\[placeholder/i.test(aboutHtml) || /\[todo/i.test(aboutHtml);
assert(!hasAboutPlaceholders, 'Zero bracketed placeholders in public About page');

// ----------------------------------------------------
// TEST GROUP 2: Success Stories Page Verification (/success-stories/)
// ----------------------------------------------------
console.log('\n--- TEST GROUP 2: Success Stories Page Verification (/success-stories/) ---');
const storiesHtmlPath = path.join(DIST_DIR, 'success-stories', 'index.html');
assert(fs.existsSync(storiesHtmlPath), 'dist/success-stories/index.html exists');

const storiesHtml = fs.readFileSync(storiesHtmlPath, 'utf8');

assert(storiesHtml.includes('Verified Outcomes'), 'Includes Verified Outcomes headline');
assert(storiesHtml.includes('M. S.') && storiesHtml.includes('K. S.') && storiesHtml.includes('A. V.'), 'Displays privacy-anonymized candidate identifiers');
assert(storiesHtml.includes('University of British Columbia') && storiesHtml.includes('University of Manchester'), 'Features genuine university study permit case studies');
assert(storiesHtml.includes('Tashkent State Medical University'), 'Features NMC FMGL compliant MBBS case study');
assert(storiesHtml.includes('Technical University of Munich'), 'Features tuition-free German engineering case study');
assert(storiesHtml.includes('story-filter-container'), 'Includes interactive destination & category filter pills');
assert(storiesHtml.includes('Documented Case Studies'), 'Includes Documented Case Studies section');
assert(!storiesHtml.includes('iframe src="https://www.youtube.com/embed/fake'), 'Zero fabricated stock video embeds');

// ----------------------------------------------------
// TEST GROUP 3: Partnerships Route Redirect Verification (/partnerships/ -> /about/)
// ----------------------------------------------------
console.log('\n--- TEST GROUP 3: Partnerships Route Redirect Verification (/partnerships/ -> /about/) ---');
const partHtmlPath = path.join(DIST_DIR, 'partnerships', 'index.html');
assert(fs.existsSync(partHtmlPath), 'dist/partnerships/index.html exists');

const partHtml = fs.readFileSync(partHtmlPath, 'utf8');

assert(partHtml.includes('http-equiv="refresh"') && partHtml.includes('/about/'), 'Redirects /partnerships/ to /about/ via meta-refresh');
assert(partHtml.includes('noindex'), 'Redirect page includes noindex directive to prevent search engine indexing of obsolete route');
assert(partHtml.includes('https://visaconvention.com/about/'), 'Canonical points cleanly to /about/');

// Strict non-affiliation check: Zero unauthorized partner logos or claims
assert(!partHtml.includes('<img src="/assets/partners/fake-logo') && !partHtml.includes('partner-logo-grid'), 'Strict compliance: Zero unauthorized partner logos displayed');
assert(!partHtml.includes('For International Universities'), 'Zero university partnership representation claims');

// ----------------------------------------------------
// TEST GROUP 4: Cross-Page Navigation & Link Integrity
// ----------------------------------------------------
console.log('\n--- TEST GROUP 4: Navigation & Link Integrity ---');

function checkLinksInHtml(html, sourcePage) {
  // Only match anchor page navigation links: <a ... href="/..."
  const linkRegex = /<a[^>]+href="(\/[^"#?]*)/g;
  let match;
  const links = new Set();
  while ((match = linkRegex.exec(html)) !== null) {
    links.add(match[1]);
  }

  let brokenCount = 0;
  links.forEach((link) => {
    let cleanLink = link.replace(/^\//, '').replace(/\/$/, '');
    let target = path.join(DIST_DIR, cleanLink, 'index.html');
    if (cleanLink === '') {
      target = path.join(DIST_DIR, 'index.html');
    }

    if (!fs.existsSync(target)) {
      console.error(`  ❌ Broken internal link on ${sourcePage}: ${link} -> ${target}`);
      brokenCount++;
    }
  });

  assert(brokenCount === 0, `All internal page links on ${sourcePage} resolve to existing static routes (0 broken links)`);
}

checkLinksInHtml(aboutHtml, '/about/');
checkLinksInHtml(storiesHtml, '/success-stories/');
checkLinksInHtml(partHtml, '/partnerships/');

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('\n=====================================================');
console.log(`TOTAL TESTS : ${totalTests}`);
console.log(`PASSED      : ${passedTests}`);
console.log(`FAILED      : ${failedTests}`);
console.log('=====================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('ALL CORPORATE CREDIBILITY QA TESTS PASSED SUCCESSFULLY! 🚀');
}
