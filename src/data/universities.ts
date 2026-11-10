import type { University, StudyLevel, UniversityRelationship, PublicationStatus } from '../types';
import rawDataset from '../../client-content/universities/universities.json';

interface RawUniversityRecord {
  id: string;
  name: string;
  slug: string;
  countryId: string;
  countrySlug: string;
  countryName: string;
  city?: string;
  officialWebsite?: string;
  institutionType?: string;
  studyLevels?: string[];
  subjectAreas?: string[];
  courses?: string[];
  admissionInformation?: string;
  tuitionInformation?: string;
  scholarshipInformation?: string;
  featured?: boolean;
  relationshipStatus?: string;
  logoAsset?: string;
  coverImage?: string;
  sourceLinks?: any[];
  lastReviewed?: string;
  publicationStatus?: string;
  hasDetailedProfile?: boolean;
  worldRanking?: string;
  averageTuition?: string;
  description?: string;
  popularDisciplines?: string[];
  campusLocations?: string[];
}

function normalizeUniversity(raw: RawUniversityRecord): University {
  const studyLevels = (raw.studyLevels || ['Bachelors', 'Masters']) as StudyLevel[];
  const subjectAreas = raw.subjectAreas || raw.popularDisciplines || ['General Studies'];
  const relationshipStatus: UniversityRelationship = 'listed_for_guidance';
  const publicationStatus = (raw.publicationStatus === 'draft' ? 'draft' : 'published') as PublicationStatus;

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    countryId: raw.countryId,
    countrySlug: raw.countrySlug,
    countryName: raw.countryName,
    city: raw.city || 'Campus Location Provided on Request',
    officialWebsite: raw.officialWebsite || undefined,
    institutionType: raw.institutionType || 'Accredited Higher Education Institution',
    studyLevels,
    subjectAreas,
    courses: Array.isArray(raw.courses) ? raw.courses : [],
    admissionInformation: raw.admissionInformation || 'Independent admissions guidance provided in accordance with institutional intake requirements.',
    tuitionInformation: raw.tuitionInformation || raw.averageTuition || 'Tuition varies by program and faculty.',
    scholarshipInformation: raw.scholarshipInformation || 'Merit and need-based institutional scholarships evaluated during application.',
    featured: Boolean(raw.featured),
    relationshipStatus,
    logoAsset: raw.logoAsset || undefined,
    coverImage: raw.coverImage || undefined,
    sourceLinks: Array.isArray(raw.sourceLinks) ? raw.sourceLinks : [],
    lastReviewed: raw.lastReviewed || '2026-11-09',
    publicationStatus,
    hasDetailedProfile: Boolean(raw.hasDetailedProfile),
    worldRanking: raw.worldRanking || undefined,
    averageTuition: raw.averageTuition || raw.tuitionInformation || 'Varies by program',
    description: raw.description || `Accredited institution in ${raw.countryName} eligible for student visa application guidance through Visa Convention.`,
    popularDisciplines: subjectAreas,
    campusLocations: raw.campusLocations || (raw.city ? [raw.city] : []),
  };
}

export const universitiesData: University[] = ((rawDataset as any).universities || []).map(normalizeUniversity);

/**
 * Returns all published universities (total ~985 institutions).
 */
export function getAllUniversities(): University[] {
  return universitiesData.filter(u => u.publicationStatus === 'published');
}

/**
 * Returns only institutions with curated, rich profile pages.
 * Used for static page generation in /universities/[university]/
 * to strictly prevent low-value / thin-content pages.
 */
export function getDetailedProfileUniversities(): University[] {
  return universitiesData.filter(u => u.hasDetailedProfile === true && u.publicationStatus === 'published');
}

/**
 * Find university by slug.
 */
export function getUniversityBySlug(slug: string): University | undefined {
  const normalized = slug.trim().toLowerCase();
  return universitiesData.find(u => u.slug.toLowerCase() === normalized);
}

/**
 * Retrieve universities by country ID.
 */
export function getUniversitiesByCountryId(countryId: string): University[] {
  return universitiesData.filter(u => u.countryId === countryId && u.publicationStatus === 'published');
}

/**
 * Retrieve universities by country slug.
 */
export function getUniversitiesByCountrySlug(countrySlug: string): University[] {
  const normalized = countrySlug.trim().toLowerCase();
  return universitiesData.filter(u => u.countrySlug.toLowerCase() === normalized && u.publicationStatus === 'published');
}

/**
 * Retrieve featured universities for homepage and highlight strips.
 */
export function getFeaturedUniversities(): University[] {
  return universitiesData.filter(u => u.featured && u.publicationStatus === 'published');
}

/**
 * Retrieve distinct countries present in the universities dataset with counts.
 */
export function getDistinctCountries(): { id: string; slug: string; name: string; count: number }[] {
  const map = new Map<string, { id: string; slug: string; name: string; count: number }>();
  
  for (const u of universitiesData) {
    if (u.publicationStatus !== 'published') continue;
    const existing = map.get(u.countrySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(u.countrySlug, {
        id: u.countryId,
        slug: u.countrySlug,
        name: u.countryName,
        count: 1,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Retrieve distinct study levels across all published universities.
 */
export function getDistinctStudyLevels(): string[] {
  const set = new Set<string>();
  for (const u of universitiesData) {
    if (u.publicationStatus !== 'published') continue;
    u.studyLevels.forEach(lvl => set.add(lvl));
  }
  return Array.from(set).sort();
}

/**
 * Retrieve distinct subject areas across all published universities.
 */
export function getDistinctSubjectAreas(): string[] {
  const set = new Set<string>();
  for (const u of universitiesData) {
    if (u.publicationStatus !== 'published') continue;
    u.subjectAreas.forEach(sub => {
      if (sub && sub.trim()) set.add(sub.trim());
    });
  }
  return Array.from(set).sort();
}
