import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const targetDir = 'public/assets/images/destinations';

const remainingDestinations = [
  { slug: 'norway', name: 'Norway', photoId: 'photo-1506701165534-2611a6f1a7e8', fallbackId: 'photo-1516483638261-f4dbaf036963' }, // Fjord / Reine
  { slug: 'iceland', name: 'Iceland', photoId: 'photo-1504893524553-b855bce32c67', fallbackId: 'photo-1529963183134-61a90db47eaf' }, // Kirkjufell
  { slug: 'slovenia', name: 'Slovenia', photoId: 'photo-1518098268026-4e89f1a2fb8a', fallbackId: 'photo-1533105079780-92b9be482077' }, // Lake Bled
  { slug: 'slovakia', name: 'Slovakia', photoId: 'photo-1563277028-2c26227dbb34', fallbackId: 'photo-1541849546-216549ae216d' }, // Bratislava
  { slug: 'bahrain', name: 'Bahrain', photoId: 'photo-1512453979798-5ea266f8880c', fallbackId: 'photo-1518684079-3c830dcef090' }, // Manama
  { slug: 'oman', name: 'Oman', photoId: 'photo-1548013146-72479768bada', fallbackId: 'photo-1518684079-3c830dcef090' }, // Muscat
  { slug: 'kuwait', name: 'Kuwait', photoId: 'photo-1580674684081-7617fbf3d745', fallbackId: 'photo-1512453979798-5ea266f8880c' }, // Kuwait Towers
  { slug: 'saudi-arabia', name: 'Saudi Arabia', photoId: 'photo-1586724237569-f3d0c1dee8c6', fallbackId: 'photo-1512453979798-5ea266f8880c' }, // Riyadh
  { slug: 'china', name: 'China', photoId: 'photo-1508804185872-d7badad00f7d', fallbackId: 'photo-1547981609-4b6bfe67ca0b' }, // Great Wall
  { slug: 'brazil', name: 'Brazil', photoId: 'photo-1483729558449-99ef09a8c325', fallbackId: 'photo-1516306580123-e6e52b1b7b5f' }, // Rio / Christ Redeemer
  { slug: 'israel', name: 'Israel', photoId: 'photo-1544971587-b842c27f8e14', fallbackId: 'photo-1555993539-1732b0258235' }, // Jerusalem Old City
  { slug: 'lithuania', name: 'Lithuania', photoId: 'photo-1588668214407-6ea9a6d8c272', fallbackId: 'photo-1519197924294-4ba991a11128' }, // Vilnius
  { slug: 'moldova', name: 'Moldova', photoId: 'photo-1563277028-2c26227dbb34', fallbackId: 'photo-1582234372722-50d7ccc30ebd' }, // Chisinau
  { slug: 'azerbaijan', name: 'Azerbaijan', photoId: 'photo-1579606032822-e7587f7b247c', fallbackId: 'photo-1512453979798-5ea266f8880c' } // Baku Flame Towers
];

console.log(`Starting download for remaining ${remainingDestinations.length} destinations...`);

for (const dest of remainingDestinations) {
  const filePath = path.join(targetDir, `${dest.slug}.jpg`);
  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 20000) {
    console.log(`Already exists: ${dest.slug}.jpg`);
    continue;
  }
  
  console.log(`\nFetching ${dest.name} (${dest.slug})...`);
  let success = false;
  const idsToTry = [dest.photoId, dest.fallbackId].filter(Boolean);
  
  for (const id of idsToTry) {
    const url = `https://images.unsplash.com/${id}?w=1200&auto=format&fit=crop&q=80`;
    try {
      execSync(`curl.exe -L -s -o "${filePath}" "${url}"`, { stdio: 'pipe', timeout: 25000 });
      const stats = fs.statSync(filePath);
      if (stats.size > 20000) {
        console.log(`  ✓ Success! Saved ${dest.slug}.jpg (${Math.round(stats.size / 1024)} KB)`);
        success = true;
        break;
      }
    } catch (err) {
      console.log(`  ✗ Error: ${err.message}`);
    }
  }
}

console.log('\nAll destination downloads complete.');
