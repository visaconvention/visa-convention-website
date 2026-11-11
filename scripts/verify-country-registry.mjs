import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('   VISA CONVENTION — CANONICAL COUNTRY REGISTRY & IMAGE AUDIT   ');
console.log('================================================================\n');

const countriesJsonPath = path.resolve('client-content/countries/countries.json');
const registryTsPath = path.resolve('src/data/country-registry.ts');
const publicDir = path.resolve('public');

// 1. Read countries.json
const rawCountriesJson = JSON.parse(fs.readFileSync(countriesJsonPath, 'utf8'));
const studyCountries = rawCountriesJson.countries || [];
console.log(`Found ${studyCountries.length} countries in client-content/countries/countries.json`);

// 2. Read country-registry.ts
const registryContent = fs.readFileSync(registryTsPath, 'utf8');

// Simple regex extraction for registry entries
const idMatches = [...registryContent.matchAll(/id:\s*'([^']+)'/g)].map(m => m[1]);
const nameMatches = [...registryContent.matchAll(/name:\s*'([^']+)'/g)].map(m => m[1]);
const slugMatches = [...registryContent.matchAll(/slug:\s*'([^']+)'/g)].map(m => m[1]);
const srcMatches = [...registryContent.matchAll(/src:\s*'([^']+)'/g)].map(m => m[1]);
const licenseMatches = [...registryContent.matchAll(/license:\s*'([^']+)'/g)].map(m => m[1]);
const approvedMatches = [...registryContent.matchAll(/approved:\s*(true|false)/g)].map(m => m[1] === 'true');

console.log(`Found ${idMatches.length} countries in src/data/country-registry.ts\n`);

let passedChecks = 0;
let totalChecks = 0;

function assert(condition, message, details = '') {
  totalChecks++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedChecks++;
  } else {
    console.error(`  ❌ FAIL: ${message} - ${details}`);
  }
}

// Check 1: Registry scale
assert(idMatches.length >= 50, 'Registry contains at least 50 comprehensive destination countries', `Actual: ${idMatches.length}`);

// Check 2: All 36 published study countries exist in registry
const publishedStudySlugs = studyCountries.filter(c => c.publicationStatus === 'published').map(c => c.slug);
const missingStudy = publishedStudySlugs.filter(slug => !slugMatches.includes(slug));
assert(missingStudy.length === 0, '100% of published study abroad countries exist in country registry', `Missing: ${missingStudy.join(', ')}`);

// Check 3: Check distinct image assets on disk
console.log('\n--- Checking Physical Image Assets in public/ ---');
const imageFiles = fs.readdirSync(path.join(publicDir, 'assets/images/destinations'));
console.log(`Found ${imageFiles.length} destination image files on disk:`, imageFiles);

let onDiskImages = 0;
srcMatches.forEach(src => {
  const relativePath = src.startsWith('/') ? src.slice(1) : src;
  const fullDiskPath = path.join(publicDir, relativePath);
  if (fs.existsSync(fullDiskPath)) {
    onDiskImages++;
  }
});
console.log(`Verified ${onDiskImages} primary high-res destination assets directly resolved on disk.`);

// Check 4: Licensing metadata presence
const allHaveLicenses = licenseMatches.length === idMatches.length;
assert(allHaveLicenses, 'All registry countries have documented licensing metadata');

// Check 5: Zero duplicate IDs or slugs in registry
const uniqueIds = new Set(idMatches);
assert(uniqueIds.size === idMatches.length, 'Zero duplicate country IDs in registry', `Unique: ${uniqueIds.size}, Total: ${idMatches.length}`);

const uniqueSlugs = new Set(slugMatches);
assert(uniqueSlugs.size === slugMatches.length, 'Zero duplicate country slugs in registry', `Unique: ${uniqueSlugs.size}, Total: ${slugMatches.length}`);

console.log('\n================================================================');
console.log(`AUDIT COMPLETE: ${passedChecks}/${totalChecks} CHECKS PASSED`);
console.log('================================================================\n');
