import fs from 'fs';
import path from 'path';

const DB_PATH = path.resolve('client-content/countries/countries.json');
const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

console.log('--- VALIDATING COUNTRIES DATABASE SCHEMA ---');
console.log(`Checking ${data.countries.length} country records...`);

const requiredFields = [
  'id', 'name', 'slug', 'flagCode', 'continent', 'heroImage',
  'shortDescription', 'introduction', 'whyStudyHere', 'educationSystem',
  'studyLevels', 'admissionGuidance', 'visaGuidance', 'servicesAvailable',
  'faqs', 'relatedUniversityIds', 'featured', 'active', 'publicationStatus',
  'sourceLinks', 'lastReviewed'
];

const validContinents = ['North America', 'Europe', 'Asia', 'Oceania', 'South America', 'Africa'];
const validPublicationStatuses = ['published', 'draft', 'archived'];

let errorCount = 0;
const seenSlugs = new Set();
const seenIds = new Set();

data.countries.forEach((c, idx) => {
  // Check required fields
  for (const field of requiredFields) {
    if (c[field] === undefined || c[field] === null || c[field] === '') {
      console.error(`❌ Record #${idx} (${c.name || 'Unknown'}): Missing required field '${field}'`);
      errorCount++;
    }
  }

  // Check unique slug and id
  if (seenSlugs.has(c.slug)) {
    console.error(`❌ Duplicate slug: ${c.slug}`);
    errorCount++;
  }
  seenSlugs.add(c.slug);

  if (seenIds.has(c.id)) {
    console.error(`❌ Duplicate id: ${c.id}`);
    errorCount++;
  }
  seenIds.add(c.id);

  // Check continent
  if (!validContinents.includes(c.continent)) {
    console.error(`❌ Invalid continent '${c.continent}' for ${c.name}`);
    errorCount++;
  }

  // Check publicationStatus
  if (!validPublicationStatuses.includes(c.publicationStatus)) {
    console.error(`❌ Invalid publicationStatus '${c.publicationStatus}' for ${c.name}`);
    errorCount++;
  }

  // Check whyStudyHere is array
  if (!Array.isArray(c.whyStudyHere) || c.whyStudyHere.length < 2) {
    console.error(`❌ whyStudyHere must have at least 2 items for ${c.name}`);
    errorCount++;
  }

  // Check faqs is array
  if (!Array.isArray(c.faqs)) {
    console.error(`❌ faqs must be array for ${c.name}`);
    errorCount++;
  }

  // Check for placeholder text like [insert...]
  const jsonStr = JSON.stringify(c);
  if (/\[insert/i.test(jsonStr) || /\[placeholder/i.test(jsonStr) || /\[todo/i.test(jsonStr)) {
    console.error(`❌ Bracketed placeholder detected in ${c.name}!`);
    errorCount++;
  }
});

console.log(`\nValidation complete. Checked ${data.countries.length} records.`);
if (errorCount === 0) {
  console.log('✅ ALL 36 COUNTRIES PASSED SCHEMA INTEGRITY CHECKS!');
} else {
  console.error(`❌ FOUND ${errorCount} SCHEMA VIOLATIONS!`);
  process.exit(1);
}