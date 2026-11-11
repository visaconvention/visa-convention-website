import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync('client-content/countries/countries.json', 'utf8'));
const countries = Array.isArray(data) ? data : (data.countries || []);
console.log('Total countries in countries.json:', countries.length);

const published = countries.filter(c => c.publicationStatus === 'published');
console.log('Published countries count:', published.length);

const missing = [];
const existing = [];

published.forEach((c, idx) => {
  const cardImg = c.cardImage || '';
  const heroImg = c.heroImage || '';
  const cardExists = cardImg ? fs.existsSync('public' + cardImg) : false;
  const heroExists = heroImg ? fs.existsSync('public' + heroImg) : false;
  
  const status = {
    index: idx + 1,
    name: c.name,
    id: c.id,
    cardImage: cardImg,
    cardExists,
    heroImage: heroImg,
    heroExists,
    alt: c.cardImageAlt || ''
  };

  if (!cardExists || !cardImg.startsWith('/assets/images/destinations/')) {
    missing.push(status);
  } else {
    existing.push(status);
  }
});

console.log(`\n--- EXISTING / PROPERLY CONFIGURED (${existing.length}) ---`);
existing.forEach(e => console.log(`✓ ${e.name} (${e.id}): ${e.cardImage}`));

console.log(`\n--- MISSING OR INCORRECTLY CONFIGURED (${missing.length}) ---`);
missing.forEach(m => console.log(`✗ ${m.name} (${m.id}): card=${m.cardImage} (exists=${m.cardExists}), hero=${m.heroImage}`));
