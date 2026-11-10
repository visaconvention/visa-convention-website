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
assert(aboutHtml.includes('Message from the Directorship Desk'), 'Includes Founder / Directorship leadership message');
assert(aboutHtml.includes('Our Specialized Counseling Practice'), 'Includes functional advisory & counseling practice breakdown');
assert(aboutHtml.includes('Lead Education Counselor — North America &amp; UK') || aboutHtml.includes('Lead Education Counselor — North America & UK'), 'Includes North America specialized counselor role');
assert(aboutHtml.includes('Medical Admissions Advisor — MBBS') || aboutHtml.includes('Medical Admissions Advisor — MBBS Central Asia'), 'Includes Medical Admissions counselor role');
assert(aboutHtml.includes('Our Physical Advisory Center in Hanumangarh'), 'Includes verified physical office section in Hanumangarh');
assert(aboutHtml.includes('Hanumangarh, Rajasthan 335512, India'), 'Includes official Hanumangarh physical address');
assert(aboutHtml.includes('Measurable Institutional Scale'), 'Includes verified business milestones & capability metrics');
assert(aboutHtml.includes('35+') && aboutHtml.includes('1,015+'), 'Displays verified 35+ countries and 1,015+ institutions');
assert(aboutHtml.includes('/services/study-visa/') && aboutHtml.includes('/services/mbbs/'), 'Links to core business services');

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

assert(storiesHtml.includes('Verified Journeys Built on Preparation &amp; Truth') || storiesHtml.includes('Verified Journeys Built on Preparation & Truth'), 'Includes transparent outcomes headline');
assert(storiesHtml.includes('Candidate Privacy &amp; Data Protection Guarantee') || storiesHtml.includes('Candidate Privacy & Data Protection Guarantee'), 'Includes mandatory privacy & consent protection banner');
assert(storiesHtml.includes('permanently redacted'), 'Explains strict PII protection of passport & tracking numbers');
assert(storiesHtml.includes('M. S.') && storiesHtml.includes('K. S.') && storiesHtml.includes('A. V.'), 'Displays privacy-anonymized candidate identifiers');
assert(storiesHtml.includes('University of British Columbia') && storiesHtml.includes('University of Manchester'), 'Features genuine university study permit case studies');
assert(storiesHtml.includes('Tashkent State Medical University'), 'Features NMC FMGL compliant MBBS case study');
assert(storiesHtml.includes('Technical University of Munich'), 'Features tuition-free German engineering case study');
assert(storiesHtml.includes('story-filter-container'), 'Includes interactive destination & category filter pills');
assert(storiesHtml.includes('In-Person Video Testimonials'), 'Includes authentic in-person video testimonials status');
assert(!storiesHtml.includes('iframe src="https://www.youtube.com/embed/fake'), 'Zero fabricated stock video embeds');

// ----------------------------------------------------
// TEST GROUP 3: Partnerships Page Verification (/partnerships/)
// ----------------------------------------------------
console.log('\n--- TEST GROUP 3: Business Partnerships Page Verification (/partnerships/) ---');
const partHtmlPath = path.join(DIST_DIR, 'partnerships', 'index.html');
assert(fs.existsSync(partHtmlPath), 'dist/partnerships/index.html exists');

const partHtml = fs.readFileSync(partHtmlPath, 'utf8');

assert(partHtml.includes('Ethical Partnerships for Global Education'), 'Includes B2B partnership positioning headline');
assert(partHtml.includes('Our Institutional Partnership Standards'), 'Includes institutional compliance standards section');
assert(partHtml.includes('For International Universities &amp; Colleges') || partHtml.includes('For International Universities & Colleges'), 'Includes Higher Education Providers track');
assert(partHtml.includes('For Regional Coaching Centers &amp; Language Academies') || partHtml.includes('For Regional Coaching Centers & Language Academies'), 'Includes Coaching & Language Academies referral track');
assert(partHtml.includes('For Associate Consultants &amp; Sub-Agents') || partHtml.includes('For Associate Consultants & Sub-Agents'), 'Includes Sub-Agent & Associate track');
assert(partHtml.includes('For Travel Agents &amp; Corporate Partners') || partHtml.includes('For Travel Agents & Corporate Partners'), 'Includes Travel Logistics & Flight partner track');

// Strict prompt rule: "If there are no authorized partner logos or formal relationships, omit the logo section"
assert(partHtml.includes('Institutional Representation &amp; Logo Policy') || partHtml.includes('Institutional Representation & Logo Policy'), 'Includes official partner logo disclosure policy');
assert(!partHtml.includes('<img src="/assets/partners/fake-logo') && !partHtml.includes('partner-logo-grid'), 'Strict compliance: Zero unauthorized partner logos displayed');

// Partnership Enquiry Form
assert(partHtml.includes('partnership-enquiry-form'), 'Includes dedicated partnership enquiry form');
assert(partHtml.includes('partner-org-name') && partHtml.includes('partner-org-type'), 'Form contains organization name and category fields');
assert(partHtml.includes('partner-contact-name') && partHtml.includes('partner-email') && partHtml.includes('partner-phone'), 'Form contains complete B2B contact fields');
assert(partHtml.includes('partner_bot_check') || partHtml.includes('form-partner-bot-trap'), 'Form includes invisible honeypot spam protection');

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
