import type { APIRoute } from 'astro';
import { getAllCountries } from '../data/countries';
import { getDetailedProfileUniversities } from '../data/universities';
import { siteConfig } from '../data/site-config';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export const GET: APIRoute = async () => {
  const baseUrl = siteConfig.domain.replace(/\/$/, '');
  const today = new Date().toISOString().split('T')[0];

  const countries = getAllCountries();
  const universities = getDetailedProfileUniversities();

  const staticUrls: SitemapUrl[] = [
    { loc: `${baseUrl}/`, changefreq: 'daily', priority: 1.0, lastmod: today },
    { loc: `${baseUrl}/study-in-europe/`, changefreq: 'weekly', priority: 0.95, lastmod: today },
    { loc: `${baseUrl}/about/`, changefreq: 'monthly', priority: 0.85, lastmod: today },
    { loc: `${baseUrl}/services/`, changefreq: 'weekly', priority: 0.9, lastmod: today },
    { loc: `${baseUrl}/services/study-visa/`, changefreq: 'weekly', priority: 0.9, lastmod: today },
    { loc: `${baseUrl}/services/mbbs/`, changefreq: 'weekly', priority: 0.9, lastmod: today },
    { loc: `${baseUrl}/services/phd/`, changefreq: 'monthly', priority: 0.8, lastmod: today },
    { loc: `${baseUrl}/services/tourist-visa/`, changefreq: 'weekly', priority: 0.85, lastmod: today },
    { loc: `${baseUrl}/services/work-visa/`, changefreq: 'weekly', priority: 0.85, lastmod: today },
    { loc: `${baseUrl}/services/flight-booking/`, changefreq: 'weekly', priority: 0.8, lastmod: today },
    { loc: `${baseUrl}/services/additional-services/`, changefreq: 'monthly', priority: 0.75, lastmod: today },
    { loc: `${baseUrl}/study-abroad/`, changefreq: 'weekly', priority: 0.9, lastmod: today },
    { loc: `${baseUrl}/universities/`, changefreq: 'weekly', priority: 0.9, lastmod: today },
    { loc: `${baseUrl}/success-stories/`, changefreq: 'weekly', priority: 0.8, lastmod: today },
    { loc: `${baseUrl}/contact/`, changefreq: 'monthly', priority: 0.85, lastmod: today },
    { loc: `${baseUrl}/privacy-policy/`, changefreq: 'yearly', priority: 0.4, lastmod: today },
    { loc: `${baseUrl}/terms/`, changefreq: 'yearly', priority: 0.4, lastmod: today },
  ];

  // Country dynamic URLs
  const countryUrls: SitemapUrl[] = countries.map((c) => ({
    loc: `${baseUrl}/study-abroad/${c.slug}/`,
    changefreq: 'weekly',
    priority: c.featured ? 0.85 : 0.8,
    lastmod: c.lastReviewed || today,
  }));

  // Curated University profile URLs (strictly excluding bare records to prevent thin content indexing)
  const universityUrls: SitemapUrl[] = universities.map((u) => ({
    loc: `${baseUrl}/universities/${u.slug}/`,
    changefreq: 'weekly',
    priority: u.featured ? 0.8 : 0.75,
    lastmod: u.lastReviewed || today,
  }));

  const allUrls = [...staticUrls, ...countryUrls, ...universityUrls];

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority.toFixed(2)}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xmlContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
