import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const targetDir = 'public/assets/images/destinations';
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 17 Published Study Abroad destinations needing local high-res photos
const destinations = [
  {
    slug: 'belgium',
    name: 'Belgium',
    photoId: 'photo-1572883454114-1cf0031ede2a', // Grand Place, Brussels
    fallbackId: 'photo-1559113202-c916b8e44373',
    subject: 'Grand Place gilded guildhalls in Brussels; Belgium',
    alt: 'Grand Place gilded baroque guildhalls and square in Brussels, Belgium',
    objectPosition: 'center 35%'
  },
  {
    slug: 'portugal',
    name: 'Portugal',
    photoId: 'photo-1555881400-74d7acaacd8b', // Porto Ribeira / Dom Luis I Bridge
    fallbackId: 'photo-1509356843151-3e7d96241e11',
    subject: 'Ribeira waterfront and Dom Luis I Bridge in Porto; Portugal',
    alt: 'Ribeira waterfront and historic Dom Luis I Bridge in Porto, Portugal',
    objectPosition: 'center 35%'
  },
  {
    slug: 'greece',
    name: 'Greece',
    photoId: 'photo-1555993539-1732b0258235', // Athens Acropolis / Parthenon
    fallbackId: 'photo-1503152394-c571994fd383',
    subject: 'Parthenon temple atop the Acropolis in Athens; Greece',
    alt: 'Parthenon temple atop the ancient Acropolis in Athens, Greece',
    objectPosition: 'center 35%'
  },
  {
    slug: 'malta',
    name: 'Malta',
    photoId: 'photo-1516483638261-f4dbaf036963', // Valletta Grand Harbour
    fallbackId: 'photo-1563277028-2c26227dbb34',
    subject: 'Historic Grand Harbour and Valletta fortifications; Malta',
    alt: 'Historic Grand Harbour and Valletta baroque fortifications in Malta',
    objectPosition: 'center 35%'
  },
  {
    slug: 'cyprus',
    name: 'Cyprus',
    photoId: 'photo-1580835239846-5bb9ce03c8c3', // Cape Greco coastline
    fallbackId: 'photo-1533105079780-92b9be482077',
    subject: 'Mediterranean coastal cliffs and turquoise waters; Cyprus',
    alt: 'Mediterranean coastal cliffs and turquoise waters in Cyprus',
    objectPosition: 'center 40%'
  },
  {
    slug: 'croatia',
    name: 'Croatia',
    photoId: 'photo-1533105079780-92b9be482077', // Dubrovnik Old Town walls
    fallbackId: 'photo-1584646098378-0874589d76b1',
    subject: 'Dubrovnik Old Town walls overlooking the Adriatic Sea; Croatia',
    alt: 'Dubrovnik historic walled city overlooking the Adriatic Sea in Croatia',
    objectPosition: 'center 35%'
  },
  {
    slug: 'finland',
    name: 'Finland',
    photoId: 'photo-1538332576228-eb5b4c4de6f5', // Helsinki Cathedral
    fallbackId: 'photo-1513622470522-26c3c8a854bc',
    subject: 'Helsinki Cathedral and Senate Square; Finland',
    alt: 'Neoclassical Helsinki Cathedral standing above Senate Square in Finland',
    objectPosition: 'center 30%'
  },
  {
    slug: 'sweden',
    name: 'Sweden',
    photoId: 'photo-1509356843151-3e7d96241e11', // Stockholm Gamla Stan
    fallbackId: 'photo-1513622470522-26c3c8a854bc',
    subject: 'Gamla Stan waterfront and historic architecture in Stockholm; Sweden',
    alt: 'Gamla Stan historic waterfront and colourful buildings in Stockholm, Sweden',
    objectPosition: 'center 35%'
  },
  {
    slug: 'denmark',
    name: 'Denmark',
    photoId: 'photo-1513622470522-26c3c8a854bc', // Copenhagen Nyhavn
    fallbackId: 'photo-1509356843151-3e7d96241e11',
    subject: 'Nyhavn colorful harbour houses and wooden ships in Copenhagen; Denmark',
    alt: 'Colourful 17th-century townhouses along Nyhavn canal in Copenhagen, Denmark',
    objectPosition: 'center 35%'
  },
  {
    slug: 'poland',
    name: 'Poland',
    photoId: 'photo-1519197924294-4ba991a11128', // Warsaw Old Town Market Square
    fallbackId: 'photo-1541849546-216549ae216d',
    subject: 'Warsaw Old Town Market Square with historic merchant houses; Poland',
    alt: 'Warsaw Old Town Market Square with ornate historic merchant houses in Poland',
    objectPosition: 'center 35%'
  },
  {
    slug: 'czech-republic',
    name: 'Czech Republic',
    photoId: 'photo-1541849546-216549ae216d', // Prague Charles Bridge & Castle
    fallbackId: 'photo-1549877452-9c387954fbc2',
    subject: 'Charles Bridge and Prague Castle across the Vltava River; Czech Republic',
    alt: 'Charles Bridge and Prague Castle across the Vltava River in Prague, Czech Republic',
    objectPosition: 'center 35%'
  },
  {
    slug: 'hungary',
    name: 'Hungary',
    photoId: 'photo-1549877452-9c387954fbc2', // Budapest Parliament
    fallbackId: 'photo-1541849546-216549ae216d',
    subject: 'Hungarian Parliament Building along the Danube River in Budapest; Hungary',
    alt: 'Gothic revival Hungarian Parliament Building along the Danube River in Budapest',
    objectPosition: 'center 35%'
  },
  {
    slug: 'latvia',
    name: 'Latvia',
    photoId: 'photo-1582234372722-50d7ccc30ebd', // Riga Old Town
    fallbackId: 'photo-1519197924294-4ba991a11128',
    subject: 'House of the Black Heads and historic Old Town square in Riga; Latvia',
    alt: 'Gothic House of the Black Heads and historic Old Town square in Riga, Latvia',
    objectPosition: 'center 35%'
  },
  {
    slug: 'romania',
    name: 'Romania',
    photoId: 'photo-1584646098378-0874589d76b1', // Peleș Castle, Sinaia
    fallbackId: 'photo-1549877452-9c387954fbc2',
    subject: 'Historic Peleș Castle nestled in the Carpathian Mountains; Romania',
    alt: 'Neo-Renaissance Peleș Castle nestled in the Carpathian Mountains of Romania',
    objectPosition: 'center 35%'
  },
  {
    slug: 'kyrgyzstan',
    name: 'Kyrgyzstan',
    photoId: 'photo-1569429553455-87c2b535d886', // Ala-Archa alpine scenery
    fallbackId: 'photo-1528728329032-2972f65dfb3f',
    subject: 'Ala-Archa national park alpine scenery and Tian Shan peaks; Kyrgyzstan',
    alt: 'Tian Shan mountain peaks and alpine river valley in Ala-Archa, Kyrgyzstan',
    objectPosition: 'center 35%'
  },
  {
    slug: 'georgia',
    name: 'Georgia',
    photoId: 'photo-1565008447742-97f6f38c985c', // Tbilisi Old Town & Narikala
    fallbackId: 'photo-1582234372722-50d7ccc30ebd',
    subject: 'Tbilisi Old Town with Narikala Fortress and Mtkvari River; Georgia',
    alt: 'Historic Tbilisi Old Town with cliffside houses and Narikala Fortress in Georgia',
    objectPosition: 'center 35%'
  },
  {
    slug: 'mauritius',
    name: 'Mauritius',
    photoId: 'photo-1544735716-392fe2489ffa', // Le Morne Brabant
    fallbackId: 'photo-1580835239846-5bb9ce03c8c3',
    subject: 'Le Morne Brabant mountain and turquoise lagoon; Mauritius',
    alt: 'UNESCO World Heritage Le Morne Brabant mountain rising above the Indian Ocean lagoon in Mauritius',
    objectPosition: 'center 40%'
  }
];

console.log(`Starting download for ${destinations.length} Study Abroad destination images...`);

for (const dest of destinations) {
  const filePath = path.join(targetDir, `${dest.slug}.jpg`);
  console.log(`\nFetching ${dest.name} (${dest.slug})...`);
  
  let success = false;
  const idsToTry = [dest.photoId, dest.fallbackId].filter(Boolean);
  
  for (const id of idsToTry) {
    const url = `https://images.unsplash.com/${id}?w=1200&auto=format&fit=crop&q=80`;
    console.log(`  Trying ID ${id}...`);
    try {
      execSync(`curl.exe -L -s -o "${filePath}" "${url}"`, { stdio: 'pipe', timeout: 25000 });
      const stats = fs.statSync(filePath);
      if (stats.size > 20000) {
        console.log(`  ✓ Success! Saved ${dest.slug}.jpg (${Math.round(stats.size / 1024)} KB)`);
        success = true;
        break;
      } else {
        console.log(`  ✗ File too small (${stats.size} bytes), trying fallback...`);
      }
    } catch (err) {
      console.log(`  ✗ Error downloading ${id}: ${err.message}`);
    }
  }

  if (!success) {
    console.error(`  ❌ FAILED to download valid image for ${dest.name}`);
  }
}

console.log('\nDestination image download batch finished.');
