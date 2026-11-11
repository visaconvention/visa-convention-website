import fs from 'fs';
import path from 'path';

// Read raw text of country-registry.ts
const registryFile = path.resolve('src/data/country-registry.ts');
const content = fs.readFileSync(registryFile, 'utf8');

// Match entries
const entryRegex = /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*slug:\s*'([^']+)',\s*isoCode:\s*'([^']+)',\s*continent:\s*'([^']+)',\s*image:\s*\{([^}]+)\},\s*services:\s*\{([^}]+)\}/g;

const csvHeader = 'country_id,country_name,slug,iso_code,continent,primary_image,alt_text,landmark_subject,source_url,license,object_position,approval_status,services_supported\n';
let rows = [];

let match;
while ((match = entryRegex.exec(content)) !== null) {
  const [_, id, name, slug, isoCode, continent, imageBlock, servicesBlock] = match;
  
  const src = (imageBlock.match(/src:\s*'([^']+)'/) || [])[1] || '';
  const alt = ((imageBlock.match(/alt:\s*'([^']+)'/) || [])[1] || '').replace(/,/g, ';');
  const sourceUrl = (imageBlock.match(/sourceUrl:\s*'([^']+)'/) || [])[1] || 'https://images.unsplash.com';
  const license = (imageBlock.match(/license:\s*'([^']+)'/) || [])[1] || 'Unsplash Commercial License';
  const objectPosition = (imageBlock.match(/objectPosition:\s*'([^']+)'/) || [])[1] || 'center 35%';
  const approved = (imageBlock.match(/approved:\s*(true|false)/) || [])[1] === 'true';

  const study = servicesBlock.includes('study: true');
  const tourist = servicesBlock.includes('tourist: true');
  const work = servicesBlock.includes('work: true');
  const services = [study ? 'study' : '', tourist ? 'tourist' : '', work ? 'work' : ''].filter(Boolean).join('|');

  const landmark = alt.split(' in ')[0] || alt.split(' and ')[0] || name;

  rows.push([
    id,
    name,
    slug,
    isoCode,
    continent,
    src,
    `"${alt}"`,
    `"${landmark}"`,
    sourceUrl,
    `"${license}"`,
    objectPosition,
    approved ? 'approved' : 'pending',
    services
  ].join(','));
}

fs.writeFileSync('COUNTRY_IMAGE_MANIFEST.csv', csvHeader + rows.join('\n'), 'utf8');
console.log(`Generated COUNTRY_IMAGE_MANIFEST.csv with ${rows.length} records.`);
