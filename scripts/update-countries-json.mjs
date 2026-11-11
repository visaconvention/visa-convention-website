import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync('client-content/countries/countries.json', 'utf8'));
const countries = data.countries || [];

// Destination specs with accurate geographical subject, alt, and position
const specs = {
  'belgium': {
    cardImage: '/assets/images/destinations/belgium.jpg',
    cardImageAlt: 'Grand Place gilded baroque guildhalls and square in Brussels, Belgium',
    imageObjectPosition: 'center 35%',
    heroImage: '/assets/images/destinations/belgium.jpg'
  },
  'portugal': {
    cardImage: '/assets/images/destinations/portugal.jpg',
    cardImageAlt: 'Ribeira waterfront and historic Dom Luis I Bridge in Porto, Portugal',
    imageObjectPosition: 'center 35%',
    heroImage: '/assets/images/destinations/portugal.jpg'
  },
  'greece': {
    cardImage: '/assets/images/destinations/greece.jpg',
    cardImageAlt: 'Parthenon temple atop the ancient Acropolis in Athens, Greece',
    imageObjectPosition: 'center 35%',
    heroImage: '/assets/images/destinations/greece.jpg'
  },
  'malta': {
    cardImage: '/assets/images/destinations/malta.jpg',
    cardImageAlt: 'Historic Grand Harbour and Valletta baroque fortifications in Malta',
    imageObjectPosition: 'center 35%',
    heroImage: '/assets/images/destinations/malta.jpg'
  },
  'cyprus': {
    cardImage: '/assets/images/destinations/cyprus.jpg',
    cardImageAlt: 'Mediterranean coastal cliffs and turquoise waters in Cyprus',
    imageObjectPosition: 'center 40%',
    heroImage: '/assets/images/destinations/cyprus.jpg'
  },
  'croatia': {
    cardImage: '/assets/images/destinations/croatia.jpg',
    cardImageAlt: 'Dubrovnik historic walled city overlooking the Adriatic Sea in Croatia',
    imageObjectPosition: 'center 35%',
    heroImage: '/assets/images/destinations/croatia.jpg'
  },
  'finland': {
    cardImage: '/assets/images/destinations/finland.jpg',
    cardImageAlt: 'Neoclassical Helsinki Cathedral standing above Senate Square in Finland',
    imageObjectPosition: 'center 30%',
    heroImage: '/assets/images/destinations/finland.jpg'
  },
  'sweden': {
    cardImage: '/assets/images/destinations/sweden.jpg',
    cardImageAlt: 'Gamla Stan historic waterfront and colourful buildings in Stockholm, Sweden',
    imageObjectPosition: 'center 35%',
    heroImage: '/assets/images/destinations/sweden.jpg'
  },
  'denmark': {
    cardImage: '/assets/images/destinations/denmark.jpg',
    cardImageAlt: 'Colourful 17th-century townhouses along Nyhavn canal in Copenhagen, Denmark',
    imageObjectPosition: 'center 35%',
    heroImage: '/assets/images/destinations/denmark.jpg'
  },
  'poland': {
    cardImage: '/assets/images/destinations/poland.jpg',
    cardImageAlt: 'Warsaw Old Town Market Square with ornate historic merchant houses in Poland',
    imageObjectPosition: 'center 35%',
    heroImage: '/assets/images/destinations/poland.jpg'
  },
  'czech-republic': {
    cardImage: '/assets/images/destinations/czech-republic.jpg',
    cardImageAlt: 'Charles Bridge and Prague Castle across the Vltava River in Prague, Czech Republic',
    imageObjectPosition: 'center 35%',
    heroImage: '/assets/images/destinations/czech-republic.jpg'
  },
  'hungary': {
    cardImage: '/assets/images/destinations/hungary.jpg',
    cardImageAlt: 'Gothic revival Hungarian Parliament Building along the Danube River in Budapest',
    imageObjectPosition: 'center 35%',
    heroImage: '/assets/images/destinations/hungary.jpg'
  },
  'latvia': {
    cardImage: '/assets/images/destinations/latvia.jpg',
    cardImageAlt: 'Gothic House of the Black Heads and historic Old Town square in Riga, Latvia',
    imageObjectPosition: 'center 35%',
    heroImage: '/assets/images/destinations/latvia.jpg'
  },
  'romania': {
    cardImage: '/assets/images/destinations/romania.jpg',
    cardImageAlt: 'Neo-Renaissance Peleș Castle nestled in the Carpathian Mountains of Romania',
    imageObjectPosition: 'center 35%',
    heroImage: '/assets/images/destinations/romania.jpg'
  },
  'kyrgyzstan': {
    cardImage: '/assets/images/destinations/kyrgyzstan.jpg',
    cardImageAlt: 'Tian Shan mountain peaks and alpine river valley in Ala-Archa, Kyrgyzstan',
    imageObjectPosition: 'center 35%',
    heroImage: '/assets/images/destinations/kyrgyzstan.jpg'
  },
  'georgia': {
    cardImage: '/assets/images/destinations/georgia.jpg',
    cardImageAlt: 'Historic Tbilisi Old Town with cliffside houses and Narikala Fortress in Georgia',
    imageObjectPosition: 'center 35%',
    heroImage: '/assets/images/destinations/georgia.jpg'
  },
  'mauritius': {
    cardImage: '/assets/images/destinations/mauritius.jpg',
    cardImageAlt: 'UNESCO World Heritage Le Morne Brabant mountain rising above the Indian Ocean lagoon in Mauritius',
    imageObjectPosition: 'center 40%',
    heroImage: '/assets/images/destinations/mauritius.jpg'
  }
};

let updatedCount = 0;

for (const country of countries) {
  const spec = specs[country.slug];
  if (spec) {
    country.cardImage = spec.cardImage;
    country.cardImageAlt = spec.cardImageAlt;
    country.imageObjectPosition = spec.imageObjectPosition;
    country.heroImage = spec.heroImage;
    updatedCount++;
    console.log(`Updated ${country.name} (${country.slug}): cardImage=${country.cardImage}`);
  }
}

fs.writeFileSync('client-content/countries/countries.json', JSON.stringify(data, null, 2), 'utf8');
console.log(`\nSuccessfully updated ${updatedCount} countries in client-content/countries/countries.json!`);
