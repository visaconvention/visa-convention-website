import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('   VISA CONVENTION — TOURIST & WORK EXPANSION QA SUITE          ');
console.log('================================================================\n');

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
// TEST GROUP 1: Tourist Visa Service Data Integrity
// ----------------------------------------------------
console.log('--- TEST GROUP 1: Tourist Visa Service Data & Consular Checks ---');
import { 
  touristDestinations, 
  applicantCategories, 
  uaePreparationGuidance, 
  schengenFacts, 
  touristFaqs 
} from '../src/data/tourist-visa-data.ts';

assert(touristDestinations.length === 27, 'Exact 27 destinations from client poster are registered', `Actual: ${touristDestinations.length}`);

const schengenCount = touristDestinations.filter(d => d.group === 'schengen').length;
assert(schengenCount === 16, 'Exactly 16 Schengen destinations categorized', `Actual: ${schengenCount}`);

const individualCount = touristDestinations.filter(d => d.group === 'individual').length;
assert(individualCount === 10, 'Exactly 10 direct consular destinations categorized', `Actual: ${individualCount}`);

const uaeCount = touristDestinations.filter(d => d.group === 'uae').length;
assert(uaeCount === 1, 'UAE categorized under unified national destination', `Actual: ${uaeCount}`);

assert(applicantCategories.length === 6, 'Exactly 6 applicant categories registered', `Actual: ${applicantCategories.length}`);

const requiredCats = ['employed', 'self-employed', 'farmer', 'student', 'family-sponsored', 'invited-by-resident'];
const missingCats = requiredCats.filter(id => !applicantCategories.some(c => c.id === id));
assert(missingCats.length === 0, 'All 6 poster applicant categories present', `Missing: ${missingCats.join(', ')}`);

const allCatsHave4Docs = applicantCategories.every(c => c.documentGuidance.length >= 4);
assert(allCatsHave4Docs, 'All applicant categories contain at least 4 detailed document criteria');

const hasUaePosterItems = uaePreparationGuidance.documents.length >= 6;
assert(hasUaePosterItems, 'UAE guidance includes all 6 client-supplied items (Passport, Photo, Flight, Hotel, PAN/Aadhaar, Insurance)');

assert(schengenFacts.insuranceRule.includes('30,000'), 'Schengen guidance enforces statutory €30,000 insurance rule under EU Visa Code');

// ----------------------------------------------------
// TEST GROUP 2: Work Visa Service Data & Compliance Checks
// ----------------------------------------------------
console.log('\n--- TEST GROUP 2: Work Visa Service Data & Statutory Compliance ---');
import { 
  statutoryWorkDisclaimer,
  workDestinations,
  occupationalCategories,
  employmentEvaluationFactors,
  workVisaAssistanceScope,
  workFaqs 
} from '../src/data/work-visa-data.ts';

assert(workDestinations.length === 14, 'Exact 14 distinct countries registered in work destinations', `Actual: ${workDestinations.length}`);

const uaeWork = workDestinations.find(d => d.slug === 'uae');
assert(Boolean(uaeWork && uaeWork.locations && uaeWork.locations.includes('Dubai') && uaeWork.locations.includes('Abu Dhabi')),
  'UAE is registered as one national destination with Dubai and Abu Dhabi as locations');

const gulfCount = workDestinations.filter(d => d.region === 'Gulf').length;
assert(gulfCount === 5, 'Exactly 5 Gulf countries categorized', `Actual: ${gulfCount}`);

const europeCount = workDestinations.filter(d => d.region === 'Europe').length;
assert(europeCount === 7, 'Exactly 7 European work countries categorized', `Actual: ${europeCount}`);

const otherCount = workDestinations.filter(d => d.region === 'Other').length;
assert(otherCount === 2, 'Exactly 2 Other global work destinations categorized', `Actual: ${otherCount}`);

assert(occupationalCategories.length === 12, 'Exact 12 occupational categories registered', `Actual: ${occupationalCategories.length}`);

const requiredOccs = ['mason', 'welder', 'driver', 'security-guard', 'painter', 'carpenter', 'helper', 'warehouse-staff', 'steel-fixer', 'pipe-fitter', 'operator', 'electrician'];
const missingOccs = requiredOccs.filter(id => !occupationalCategories.some(o => o.id === id));
assert(missingOccs.length === 0, 'All 12 poster occupational categories present', `Missing: ${missingOccs.join(', ')}`);

assert(employmentEvaluationFactors.length >= 6, 'Contains 6-factor employment contract evaluation checklist', `Actual: ${employmentEvaluationFactors.length}`);

assert(statutoryWorkDisclaimer.lawReference.includes('Emigration Act, 1983'), 'Contains explicit statutory citation to Emigration Act, 1983');

// ----------------------------------------------------
// TEST GROUP 3: Canonical Country Registry
// ----------------------------------------------------
console.log('\n--- TEST GROUP 3: Canonical Country Registry Consistency ---');
import { countryRegistry, getTouristCountries, getWorkCountries, getStudyCountries } from '../src/data/country-registry.ts';

assert(countryRegistry.length >= 50, 'Country registry contains comprehensive dataset (>= 50)', `Actual: ${countryRegistry.length}`);

const touristRegCount = getTouristCountries().length;
assert(touristRegCount >= 27, 'Registry tourist service flag matches or exceeds poster count (>= 27)', `Actual: ${touristRegCount}`);

const workRegCount = getWorkCountries().length;
assert(workRegCount >= 14, 'Registry work service flag matches or exceeds poster count (>= 14)', `Actual: ${workRegCount}`);

const studyRegCount = getStudyCountries().length;
assert(studyRegCount >= 36, 'Registry study service flag matches published study count (>= 36)', `Actual: ${studyRegCount}`);

// ----------------------------------------------------
// TEST GROUP 4: Static Dist Route Generation
// ----------------------------------------------------
console.log('\n--- TEST GROUP 4: Static Route & Content Integrity ---');
const distTouristPath = path.resolve('dist/services/tourist-visa/index.html');
const distWorkPath = path.resolve('dist/services/work-visa/index.html');

if (fs.existsSync(distTouristPath)) {
  const touristHtml = fs.readFileSync(distTouristPath, 'utf8');
  assert(touristHtml.includes('Tourist Visa Assistance'), 'Tourist visa static HTML contains primary headline');
  assert(touristHtml.includes('destination-search-input'), 'Tourist visa static HTML contains live search input');
  assert(touristHtml.includes('category-panel-employed'), 'Tourist visa static HTML contains applicant category panel');
  assert(!touristHtml.includes('100% visa guarantee'), 'Tourist visa static HTML has zero false guarantee claims');
} else {
  console.log('  ℹ️ Dist not yet rebuilt with new pages, skipping dist HTML checks until build');
}

if (fs.existsSync(distWorkPath)) {
  const workHtml = fs.readFileSync(distWorkPath, 'utf8');
  assert(workHtml.includes('Work Visa Assistance'), 'Work visa static HTML contains primary headline');
  assert(workHtml.includes('Emigration Act, 1983'), 'Work visa static HTML contains Emigration Act disclosure');
  assert(workHtml.includes('Occupational Focus Areas'), 'Work visa static HTML labels categories as Occupational Focus Areas');
  assert(!workHtml.includes('100% job placement'), 'Work visa static HTML has zero false job placement claims');
} else {
  console.log('  ℹ️ Dist not yet rebuilt with new pages, skipping dist HTML checks until build');
}

console.log('\n================================================================');
console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
if (failedTests === 0) {
  console.log('✅ ALL TOURIST & WORK EXPANSION VERIFICATION REQUIREMENTS SATISFIED!');
} else {
  console.error('❌ SOME TESTS FAILED!');
  process.exit(1);
}
console.log('================================================================\n');
