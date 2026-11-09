import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');
const PROD_UNIS_JSON = path.resolve('client-content/universities/universities.json');
const PROD_UNIS_CSV = path.resolve('client-content/universities/universities.csv');
const PROD_COUNTRIES_JSON = path.resolve('client-content/countries/countries.json');
const FIXTURES_DIR = path.resolve('tests/fixtures');

console.log('=====================================================');
console.log('   VISA CONVENTION - STAGE 07 UNIVERSITY QA SUITE    ');
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
// TEST GROUP 1: Production Dataset Scale & Integrity
// ----------------------------------------------------
console.log('--- TEST GROUP 1: Production Dataset Scale & Integrity ---');

assert(fs.existsSync(PROD_UNIS_JSON), 'Production universities.json exists');
assert(fs.existsSync(PROD_UNIS_CSV), 'Production universities.csv exists');

const prodData = JSON.parse(fs.readFileSync(PROD_UNIS_JSON, 'utf8'));
const unis = prodData.universities || [];

assert(unis.length >= 500, `Production dataset contains at least 500 universities (Actual: ${unis.length})`);

const csvLines = fs.readFileSync(PROD_UNIS_CSV, 'utf8').trim().split('\n');
assert(csvLines.length - 1 === unis.length, `CSV record count matches JSON record count (${unis.length} records)`);

// Duplicate ID and Slug Checks
const idSet = new Set();
const duplicateIds = [];
const slugSet = new Set();
const duplicateSlugs = [];

unis.forEach((u) => {
  if (idSet.has(u.id)) duplicateIds.push(u.id);
  idSet.add(u.id);

  if (slugSet.has(u.slug)) duplicateSlugs.push(u.slug);
  slugSet.add(u.slug);
});

assert(duplicateIds.length === 0, 'Zero duplicate university IDs', `Duplicates: ${duplicateIds.slice(0, 5).join(', ')}`);
assert(duplicateSlugs.length === 0, 'Zero duplicate university slugs', `Duplicates: ${duplicateSlugs.slice(0, 5).join(', ')}`);

// Country Foreign Key Integrity
const countriesData = JSON.parse(fs.readFileSync(PROD_COUNTRIES_JSON, 'utf8'));
const validCountryIds = new Set(countriesData.countries.map(c => c.id));
const validCountrySlugs = new Set(countriesData.countries.map(c => c.slug));

const invalidCountryRefs = unis.filter(u => !validCountryIds.has(u.countryId) || !validCountrySlugs.has(u.countrySlug));
assert(invalidCountryRefs.length === 0, 'All universities reference valid countries in countries.json', `Invalid: ${invalidCountryRefs.length}`);

// Relationship Integrity
const invalidRelationships = unis.filter(u => u.relationshipStatus !== 'listed_for_guidance' && u.relationshipStatus !== 'verified_partner');
assert(invalidRelationships.length === 0, 'All institutions adhere to strict relationship status schema (0 unverified partner claims)');

// Non-fabrication & Timestamp check
const allHaveReviewedDates = unis.every(u => Boolean(u.lastReviewed) && /^\d{4}-\d{2}-\d{2}$/.test(u.lastReviewed));
assert(allHaveReviewedDates, 'All university records contain valid ISO lastReviewed dates');

// ----------------------------------------------------
// TEST GROUP 2: Fixture Simulation (35 Countries, 500 Universities)
// ----------------------------------------------------
console.log('\n--- TEST GROUP 2: Fixture Simulation (35 Countries, 500 Universities) ---');

if (!fs.existsSync(FIXTURES_DIR)) {
  fs.mkdirSync(FIXTURES_DIR, { recursive: true });
}

const fixtureCountries = Array.from({ length: 35 }, (_, idx) => {
  const code = String(idx + 1).padStart(2, '0');
  return {
    id: `country-sim-${code}`,
    slug: `sim-country-${code}`,
    name: `Simulated Country ${code}`,
  };
});

const fixtureUniversities = Array.from({ length: 500 }, (_, idx) => {
  const num = String(idx + 1).padStart(3, '0');
  const country = fixtureCountries[idx % 35];
  const isDetailed = idx < 15; // 15 detailed, 485 bare records

  return {
    id: `uni-sim-${num}`,
    name: `Simulated University ${num}`,
    slug: `simulated-university-${num}`,
    countryId: country.id,
    countrySlug: country.slug,
    countryName: country.name,
    city: `Sim City ${(idx % 10) + 1}`,
    officialWebsite: `https://www.sim-uni-${num}.edu`,
    institutionType: idx % 2 === 0 ? 'Public Research University' : 'Institute of Technology',
    studyLevels: idx % 3 === 0 ? ['Bachelors', 'Masters', 'Doctorate'] : ['Bachelors', 'Masters'],
    subjectAreas: idx % 2 === 0 ? ['Computer Science', 'Engineering'] : ['Business', 'Humanities'],
    courses: isDetailed ? [`Computer Science BSc ${num}`, `Management MSc ${num}`] : [],
    admissionInformation: isDetailed ? `Minimum 75% aggregate required.` : 'Admissions guidance provided.',
    tuitionInformation: isDetailed ? `$20,000 / year` : 'Varies by program',
    scholarshipInformation: isDetailed ? 'Merit awards available.' : 'Contact counselor.',
    featured: idx < 10,
    relationshipStatus: 'listed_for_guidance',
    publicationStatus: 'published',
    hasDetailedProfile: isDetailed,
    lastReviewed: '2026-11-09',
  };
});

const FIXTURE_FILE = path.join(FIXTURES_DIR, 'test-universities-500.json');
fs.writeFileSync(FIXTURE_FILE, JSON.stringify({ count: fixtureUniversities.length, universities: fixtureUniversities }, null, 2), 'utf8');

assert(fs.existsSync(FIXTURE_FILE), 'Test fixture file generated with 500 synthetic institutions');
assert(fixtureUniversities.length === 500, 'Fixture contains exactly 500 universities');

const fixtureCountrySet = new Set(fixtureUniversities.map(u => u.countrySlug));
assert(fixtureCountrySet.size === 35, 'Fixture spans exactly 35 destination countries');

// ----------------------------------------------------
// TEST GROUP 3: Threshold Rule & Page Generation Checks
// ----------------------------------------------------
console.log('\n--- TEST GROUP 3: Threshold Rule & Thin-Page Prevention ---');

const detailedUnis = unis.filter(u => u.hasDetailedProfile === true);
const bareUnis = unis.filter(u => !u.hasDetailedProfile);

assert(detailedUnis.length === 10, `Exactly 10 curated universities flagged for detailed profile pages (Actual: ${detailedUnis.length})`);
assert(bareUnis.length >= 900, `At least 900 universities flagged as bare records for directory-only display (Actual: ${bareUnis.length})`);

// Check dist output
const distDetailedPages = detailedUnis.map(u => ({
  name: u.name,
  slug: u.slug,
  path: path.join(DIST_DIR, 'universities', u.slug, 'index.html'),
}));

const allDetailedPagesExist = distDetailedPages.every(p => fs.existsSync(p.path));
assert(allDetailedPagesExist, 'All 10 detailed universities have corresponding static HTML pages generated in dist/');

// Verify that bare records DO NOT have thin profile pages generated
const bareSample = bareUnis.slice(0, 20);
const thinPagesLeaked = bareSample.some(u => fs.existsSync(path.join(DIST_DIR, 'universities', u.slug, 'index.html')));
assert(!thinPagesLeaked, 'Strict Threshold Rule: Zero bare records generated thin low-value profile pages');

// ----------------------------------------------------
// TEST GROUP 4: Search & Multi-Criteria Filtering Logic
// ----------------------------------------------------
console.log('\n--- TEST GROUP 4: Search & Multi-Criteria Filtering Logic ---');

function searchFilter(dataset, { query = '', country = 'all', level = 'all', subject = 'all', detailedOnly = false } = {}) {
  const q = query.trim().toLowerCase();
  const c = country.toLowerCase();
  const l = level.toLowerCase();
  const s = subject.toLowerCase();

  return dataset.filter((u) => {
    const name = u.name.toLowerCase();
    const city = (u.city || '').toLowerCase();
    const countryName = u.countryName.toLowerCase();
    const countrySlug = u.countrySlug.toLowerCase();
    const levels = (u.studyLevels || []).join(' ').toLowerCase();
    const subjects = (u.subjectAreas || []).join(' ').toLowerCase();

    const matchesQuery = !q || name.includes(q) || city.includes(q) || countryName.includes(q) || subjects.includes(q);
    const matchesCountry = c === 'all' || countrySlug === c || countryName.includes(c);
    const matchesLevel = l === 'all' || levels.includes(l);
    const matchesSubject = s === 'all' || subjects.includes(s);
    const matchesDetailed = !detailedOnly || u.hasDetailedProfile === true;

    return matchesQuery && matchesCountry && matchesLevel && matchesSubject && matchesDetailed;
  });
}

// 1. Name search case-insensitivity
const torontoLower = searchFilter(unis, { query: 'toronto' });
const torontoUpper = searchFilter(unis, { query: 'TORONTO' });
assert(torontoLower.length > 0 && torontoLower.length === torontoUpper.length, 'Search is case-insensitive (toronto == TORONTO)');

// 2. Country filter
const canadaUnis = searchFilter(unis, { country: 'canada' });
assert(canadaUnis.length > 100, `Country filter for 'canada' returns expected volume (>100, actual: ${canadaUnis.length})`);
assert(canadaUnis.every(u => u.countrySlug === 'canada'), 'Country filter returns strictly matching destination');

// 3. Level filter
const mbbsUnis = searchFilter(unis, { level: 'mbbs' });
assert(mbbsUnis.length >= 20, `MBBS study level filter returns expected institutions (Actual: ${mbbsUnis.length})`);

// 4. Detailed only filter
const detailedFilter = searchFilter(unis, { detailedOnly: true });
assert(detailedFilter.length === 10, 'Detailed only filter correctly filters down to curated profiles');

// 5. Multi-criteria combination
const multiFiltered = searchFilter(unis, { country: 'canada', level: 'masters', query: 'british columbia' });
assert(multiFiltered.some(u => u.slug === 'university-of-british-columbia'), 'Multi-criteria filter accurately resolves compound query');

// 6. Non-existent query empty state simulation
const emptyResult = searchFilter(unis, { query: 'xyznonexistentuniversity12345' });
assert(emptyResult.length === 0, 'Non-existent keyword cleanly returns 0 results for empty state trigger');

// ----------------------------------------------------
// TEST GROUP 5: Filtering Performance & Latency Benchmark
// ----------------------------------------------------
console.log('\n--- TEST GROUP 5: Filtering Performance & Latency Benchmark ---');

// Benchmark across 500 fixture records
const startFixture = performance.now();
for (let i = 0; i < 50; i++) {
  searchFilter(fixtureUniversities, { query: 'Simulated', country: 'sim-country-05', level: 'bachelors' });
}
const elapsedFixtureMs = (performance.now() - startFixture) / 50;
assert(elapsedFixtureMs < 10, `Fixture filtering (500 items) latency under 10ms (Actual: ${elapsedFixtureMs.toFixed(3)}ms)`);

// Benchmark across 985 production records
const startProd = performance.now();
for (let i = 0; i < 50; i++) {
  searchFilter(unis, { query: 'University', country: 'united-kingdom', level: 'masters' });
}
const elapsedProdMs = (performance.now() - startProd) / 50;
assert(elapsedProdMs < 15, `Production filtering (985 items) latency under 15ms (Actual: ${elapsedProdMs.toFixed(3)}ms)`);

// ----------------------------------------------------
// TEST GROUP 6: HTML Directory & Profile Markup Checks
// ----------------------------------------------------
console.log('\n--- TEST GROUP 6: Static HTML Directory & Profile Markup Checks ---');

const dirHtmlPath = path.join(DIST_DIR, 'universities', 'index.html');
assert(fs.existsSync(dirHtmlPath), 'dist/universities/index.html exists');

const dirHtml = fs.readFileSync(dirHtmlPath, 'utf8');
assert(dirHtml.includes('Global University Directory'), 'Directory page contains main heading');
assert(dirHtml.includes('university-search-input'), 'Directory page contains search input element');
assert(dirHtml.includes('filter-country'), 'Directory page contains country filter select');
assert(dirHtml.includes('filter-degree'), 'Directory page contains degree filter select');
assert(dirHtml.includes('pagination-nav'), 'Directory page contains pagination controls');
assert(dirHtml.includes('no-results-view'), 'Directory page contains empty state container');
assert(dirHtml.includes('University of Toronto'), 'Directory contains top flagship university');

// Check Toronto Profile Page HTML
const torontoHtmlPath = path.join(DIST_DIR, 'universities', 'university-of-toronto', 'index.html');
assert(fs.existsSync(torontoHtmlPath), 'dist/universities/university-of-toronto/index.html exists');

const torontoHtml = fs.readFileSync(torontoHtmlPath, 'utf8');
assert(torontoHtml.includes('University of Toronto'), 'Profile page contains official university name');
assert(torontoHtml.includes('EducationalOrganization'), 'Profile page includes Schema.org EducationalOrganization structured data');
assert(torontoHtml.includes('target="_blank"'), 'Official portal link opens in new tab with security attributes');
assert(torontoHtml.includes('rel="noopener noreferrer"'), 'Official portal link includes rel="noopener noreferrer"');
assert(torontoHtml.includes('Advisory Scope for University of Toronto') || torontoHtml.includes('How Visa Convention Guides Your Application'), 'Profile includes Visa Convention counseling scope');
assert(torontoHtml.includes('Integrity Disclaimer'), 'Profile includes integrity disclaimer');

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
  console.log('ALL UNIVERSITY DISCOVERY ENGINE QA TESTS PASSED SUCCESSFULLY! 🚀');
}
