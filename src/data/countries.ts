import type { Country, Continent, StudyLevel } from '../types';
import masterData from '../../client-content/countries/countries.json';

// Helper to normalize and map raw JSON records to the validated Country model
function normalizeCountry(raw: any): Country {
  const tuitionRange = typeof raw.costInformation === 'object' && raw.costInformation !== null
    ? raw.costInformation.tuitionRange || 'Advisory Fee Structure'
    : typeof raw.costInformation === 'string'
      ? raw.costInformation
      : 'Varies by Program';

  const livingRange = typeof raw.costInformation === 'object' && raw.costInformation !== null
    ? raw.costInformation.livingCostRange || 'Subject to Location'
    : 'Subject to Location';

  const intakesList = typeof raw.admissionGuidance === 'object' && raw.admissionGuidance !== null && Array.isArray(raw.admissionGuidance.intakePeriods)
    ? raw.admissionGuidance.intakePeriods
    : ['Autumn / Spring'];

  const visaSummary = typeof raw.visaGuidance === 'object' && raw.visaGuidance !== null
    ? raw.visaGuidance.overview || ''
    : typeof raw.visaGuidance === 'string'
      ? raw.visaGuidance
      : '';

  const workRightsSummary = typeof raw.visaGuidance === 'object' && raw.visaGuidance !== null
    ? raw.visaGuidance.workRights || 'Work rights subject to immigration permit.'
    : 'Work rights subject to immigration permit.';

  const disclaimerText = typeof raw.visaGuidance === 'object' && raw.visaGuidance !== null && raw.visaGuidance.disclaimer
    ? raw.visaGuidance.disclaimer
    : 'Visa issuance is subject strictly to host-nation immigration authorities. Visa Convention facilitates diligent documentation without guaranteeing embassy outcomes.';

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    flagCode: raw.flagCode,
    continent: raw.continent as Continent,
    heroImage: raw.heroImage || `/assets/images/destinations/${raw.slug}-hero.webp`,
    shortDescription: raw.shortDescription,
    introduction: raw.introduction,
    whyStudyHere: Array.isArray(raw.whyStudyHere) ? raw.whyStudyHere : [],
    educationSystem: raw.educationSystem,
    studyLevels: (raw.studyLevels || ['Undergraduate', 'Postgraduate']) as StudyLevel[],
    admissionGuidance: raw.admissionGuidance,
    visaGuidance: raw.visaGuidance,
    costInformation: raw.costInformation,
    scholarshipInformation: raw.scholarshipInformation,
    servicesAvailable: Array.isArray(raw.servicesAvailable) ? raw.servicesAvailable : [],
    faqs: Array.isArray(raw.faqs) ? raw.faqs : [],
    relatedUniversityIds: Array.isArray(raw.relatedUniversityIds) ? raw.relatedUniversityIds : [],
    featured: Boolean(raw.featured),
    active: Boolean(raw.active),
    publicationStatus: raw.publicationStatus || 'published',
    sourceLinks: raw.sourceLinks || [],
    lastReviewed: raw.lastReviewed || '2026-11-09',

    // Backward-compatibility properties
    isoCode: raw.flagCode,
    shortSummary: raw.shortDescription,
    overview: raw.introduction,
    keyHighlights: Array.isArray(raw.whyStudyHere) ? raw.whyStudyHere : [],
    popularCourses: ['Engineering', 'Computer Science', 'Business', 'Healthcare'],
    intakes: intakesList,
    estimatedTuitionRange: tuitionRange,
    estimatedLivingCost: livingRange,
    workRights: workRightsSummary,
    visaGuidanceSummary: visaSummary,
    sourceDisclaimer: disclaimerText,
    capital: raw.capital,
    currency: typeof raw.costInformation === 'object' ? raw.costInformation?.currency : undefined,
    flagEmoji: undefined,
    flagSvg: undefined,
  };
}

// Master dataset parsed from client-content/countries/countries.json
export const countriesData: Country[] = (masterData.countries || []).map(normalizeCountry);

/**
 * Returns all active & published countries (sorted: featured first, then alphabetical).
 */
export function getAllCountries(): Country[] {
  return countriesData
    .filter((c) => c.active && c.publicationStatus === 'published')
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.name.localeCompare(b.name);
    });
}

/**
 * Returns all published countries regardless of featured status.
 */
export function getPublishedCountries(): Country[] {
  return countriesData.filter((c) => c.publicationStatus === 'published');
}

/**
 * Returns featured countries (used for homepage and header quick navigation).
 */
export function getFeaturedCountries(): Country[] {
  return countriesData
    .filter((c) => c.featured && c.active && c.publicationStatus === 'published')
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Finds a country by its URL slug.
 */
export function getCountryBySlug(slug: string): Country | undefined {
  return countriesData.find((c) => c.slug === slug);
}

/**
 * Returns related destination countries in the same continent or popular alternatives.
 */
export function getRelatedCountries(currentCountry: Country, limit = 3): Country[] {
  return countriesData
    .filter(
      (c) =>
        c.slug !== currentCountry.slug &&
        c.publicationStatus === 'published' &&
        (c.continent === currentCountry.continent || c.featured)
    )
    .slice(0, limit);
}

/**
 * Returns unique continents among published destinations.
 */
export function getContinents(): string[] {
  const published = getPublishedCountries();
  return Array.from(new Set(published.map((c) => c.continent)));
}
