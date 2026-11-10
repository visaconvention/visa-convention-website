import fs from 'fs';
import path from 'path';

function getHtmlFiles(dir, files = []) {
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      getHtmlFiles(fullPath, files);
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

const htmlFiles = getHtmlFiles('dist');
console.log('Total HTML files found:', htmlFiles.length);

const titles = new Map();
const descs = new Map();
let issues = 0;

for (const file of htmlFiles) {
  const relPath = path.relative('dist', file).replace(/\\/g, '/');
  if (relPath.includes('design-system')) continue;

  const html = fs.readFileSync(file, 'utf8');

  // Check single h1
  const h1Matches = html.match(/<h1[\s>]/gi) || [];
  if (h1Matches.length !== 1) {
    console.log(`[H1 ISSUE] ${relPath} has ${h1Matches.length} <h1> tags`);
    issues++;
  }

  // Check title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    console.log(`[TITLE MISSING] ${relPath}`);
    issues++;
  } else {
    const title = titleMatch[1].trim();
    if (titles.has(title)) {
      console.log(`[DUPLICATE TITLE] "${title}" in ${relPath} and ${titles.get(title)}`);
      issues++;
    } else {
      titles.set(title, relPath);
    }
  }

  // Check meta description
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
                    html.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
  if (!descMatch || !descMatch[1].trim()) {
    console.log(`[DESC MISSING] ${relPath}`);
    issues++;
  } else {
    const desc = descMatch[1].trim();
    if (desc.length < 50 || desc.length > 170) {
      console.log(`[DESC LENGTH ${desc.length}] ${relPath}: "${desc.substring(0, 40)}..."`);
    }
    if (descs.has(desc)) {
      console.log(`[DUPLICATE DESC] in ${relPath} and ${descs.get(desc)}`);
      issues++;
    } else {
      descs.set(desc, relPath);
    }
  }

  // Check canonical
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
  if (!canonicalMatch) {
    console.log(`[CANONICAL MISSING] ${relPath}`);
    issues++;
  } else {
    const canonical = canonicalMatch[1];
    if (canonical.includes('?') || canonical.includes('#')) {
      console.log(`[CANONICAL WITH QUERY/HASH] ${relPath}: ${canonical}`);
      issues++;
    }
  }

  // Check image alt attributes
  const imgMatches = html.matchAll(/<img\b([^>]*)>/gi);
  for (const match of imgMatches) {
    const attrs = match[1];
    if (!attrs.includes('alt=')) {
      console.log(`[IMG WITHOUT ALT] ${relPath}: ${match[0]}`);
      issues++;
    }
  }

  // Check JSON-LD
  const ldJsonMatches = html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi);
  for (const match of ldJsonMatches) {
    try {
      JSON.parse(match[1]);
    } catch (e) {
      console.log(`[INVALID JSON-LD] ${relPath}:`, e.message);
      issues++;
    }
  }
}

console.log(`\nAudit finished. Unique titles: ${titles.size}, Unique descs: ${descs.size}, Issues: ${issues}`);
