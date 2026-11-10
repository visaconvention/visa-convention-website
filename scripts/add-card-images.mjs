/**
 * Adds cardImage, cardImageAlt, imageObjectPosition to country JSON records
 * for the 6 countries with verified destination photography.
 * Run once: node scripts/add-card-images.mjs
 */
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.join(__dirname, '../client-content/countries/countries.json');

const REGISTRY = {
  'canada': {
    cardImage: '/assets/images/destinations/canada.jpg',
    cardImageAlt: 'Vancouver cityscape with mountains and university campuses, Canada',
    imageObjectPosition: 'center',
  },
  'united-kingdom': {
    cardImage: '/assets/images/destinations/united-kingdom.jpg',
    cardImageAlt: 'London historic skyline featuring the Thames and landmark universities, United Kingdom',
    imageObjectPosition: 'center',
  },
  'australia': {
    cardImage: '/assets/images/destinations/australia.jpg',
    cardImageAlt: 'Sydney Harbour with Opera House and world-class universities, Australia',
    imageObjectPosition: 'center',
  },
  'usa': {
    cardImage: '/assets/images/destinations/usa.jpg',
    cardImageAlt: 'New York City skyline featuring One World Trade Center, United States',
    imageObjectPosition: 'center 50%',
  },
  'germany': {
    cardImage: '/assets/images/destinations/germany.jpg',
    cardImageAlt: 'Historic German architecture and premier research university campus, Germany',
    imageObjectPosition: 'center',
  },
  'ireland': {
    cardImage: '/assets/images/destinations/ireland.jpg',
    cardImageAlt: 'Dublin cityscape and technology education hub, Ireland',
    imageObjectPosition: 'center',
  },
};

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

let updated = 0;
data.countries = data.countries.map(c => {
  if (REGISTRY[c.slug]) {
    updated++;
    return { ...c, ...REGISTRY[c.slug] };
  }
  return c;
});

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
console.log(`Updated ${updated} country records with cardImage metadata.`);
data.countries
  .filter(c => REGISTRY[c.slug])
  .forEach(c => console.log(`  ✓ ${c.name}: ${c.cardImage}`));
