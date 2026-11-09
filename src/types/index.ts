/**
 * Visa Convention — Core Type Definitions & Schemas
 * Type-safe models for countries, universities, services, navigation, and inquiries.
 */

export type PublicationStatus = 'draft' | 'published';

export type Continent = 'North America' | 'Europe' | 'Asia' | 'Oceania' | 'South America' | 'Africa';

export type StudyLevel = 'Bachelors' | 'Masters' | 'Doctorate' | 'Diploma' | 'MBBS' | 'Foundation';

export type UniversityRelationship = 'listed_for_guidance' | 'verified_partner';

export type ServiceCategory = 
  | 'study-visa'
  | 'mbbs'
  | 'phd'
  | 'tourist-visa'
  | 'work-visa'
  | 'flight-booking'
  | 'additional-services';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

export interface CountryCostInformation {
  tuitionRange?: string;
  livingCostRange?: string;
  currency?: string;
  notes?: string;
}

export interface CountryScholarshipInformation {
  available: boolean;
  overview?: string;
  opportunities?: string[];
  notes?: string;
}

export interface CountryAdmissionGuidance {
  overview: string;
  generalRequirements?: string[];
  intakePeriods?: string[];
  languageRequirements?: string;
}

export interface CountryVisaGuidance {
  visaType?: string;
  overview: string;
  keyRequirements?: string[];
  processingTime?: string;
  workRights?: string;
  disclaimer?: string;
}

export interface CountryEducationSystem {
  overview: string;
  keyPoints?: string[];
  structure?: string;
}

export interface CountrySourceLink {
  label: string;
  url: string;
}

/**
 * Country Data Model
 * Scalable schema supporting 35+ countries dynamically without template duplication.
 */
export interface Country {
  // Master fields required by specification:
  id: string;                                          // e.g., "country-canada"
  name: string;                                        // Formal display name, e.g., "Canada"
  slug: string;                                        // URL slug, e.g., "canada"
  flagCode: string;                                    // Two-letter ISO country code, e.g., "CA"
  continent: Continent;                                // Region
  heroImage: string;                                   // Curated landscape photograph path
  shortDescription: string;                            // 1-2 sentence overview
  introduction: string;                                // Full introduction narrative
  whyStudyHere: string[];                              // Core reasons/benefits to consider
  educationSystem: CountryEducationSystem | string;   // Higher education framework
  studyLevels: StudyLevel[];                          // Available levels of study
  admissionGuidance: CountryAdmissionGuidance | string;// Entry requirements & intakes
  visaGuidance: CountryVisaGuidance | string;          // Official embassy permit procedures
  costInformation?: CountryCostInformation | string;   // Tuition and living expense indicators
  scholarshipInformation?: CountryScholarshipInformation | string; // Verified awards
  servicesAvailable: string[];                         // Consultancy scope for this country
  faqs: FAQItem[];                                     // Country-specific questions
  relatedUniversityIds: string[];                      // Foreign keys to universities
  featured: boolean;                                   // Featured on homepage
  active: boolean;                                     // Active counseling destination
  publicationStatus: PublicationStatus;                // "published" | "draft" | "archived"
  sourceLinks: CountrySourceLink[] | string[];         // Official government references
  lastReviewed: string;                                // ISO date (YYYY-MM-DD)

  // Backward-compatibility aliases for existing components:
  isoCode: string;
  shortSummary: string;
  overview: string;
  keyHighlights: string[];
  popularCourses: string[];
  intakes: string[];
  estimatedTuitionRange: string;
  estimatedLivingCost: string;
  workRights: string;
  visaGuidanceSummary: string;
  sourceDisclaimer: string;
  capital?: string;
  currency?: string;
  flagEmoji?: string;
  flagSvg?: string;
}

/**
 * University Data Model
 * Centralized schema populating both country pages and global directory.
 */
export interface University {
  id: string;                      // e.g., "uni-toronto"
  slug: string;                    // e.g., "university-of-toronto"
  name: string;                    // Official university name
  countryId: string;               // Foreign key referencing Country.id
  countrySlug: string;             // Slug for linking to country page
  countryName: string;             // Display name of destination country
  city: string;
  campusLocations?: string[];
  officialWebsite: string;         // Verified official .edu / .ac website
  studyLevels: StudyLevel[];
  popularDisciplines: string[];    // e.g., ["Computer Science", "Business", "Medicine"]
  relationshipStatus: UniversityRelationship;
  featured: boolean;               // Highlighted in university directory
  worldRanking?: string;           // QS/THE ranking bracket if verified (e.g., "Top 50")
  averageTuition?: string;         // Advisory tuition indicator
  description?: string;
  publicationStatus: PublicationStatus;
}

/**
 * Service Data Model
 * Model for the 6 core business verticals.
 */
export interface DetailedService {
  id: ServiceCategory;
  slug: string;
  title: string;
  heroHeadline: string;
  subtitle: string;
  shortDescription: string;
  badge: string;
  metaTitle: string;
  metaDescription: string;
  heroCtaText: string;
  heroCtaHref: string;
  assistanceIncludes: Array<{
    title: string;
    description: string;
  }>;
  supportedCountries: Array<{
    name: string;
    slug?: string;
    highlight: string;
  }>;
  featuredInstitutions?: Array<{
    name: string;
    country: string;
    city?: string;
    website?: string;
    notes?: string;
  }>;
  eligibilityAndCriteria: Array<{
    title: string;
    detail: string;
  }>;
  regulatoryCompliance?: {
    title: string;
    notice: string;
    points: string[];
  };
  stepByStepProcess: Array<{
    stepNumber: number;
    title: string;
    description: string;
  }>;
  whyConsultUs: Array<{
    title: string;
    description: string;
  }>;
  conditionsAndDisclaimers: string[];
  faqs: FAQItem[];
  publicationStatus: PublicationStatus;
}

export interface Service {
  id: ServiceCategory;
  slug: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  iconName: string;
  heroImage?: string;
  targetAudience: string[];
  keyOfferings: string[];
  stepByStepProcess: Array<{
    stepNumber: number;
    title: string;
    description: string;
  }>;
  eligibilityChecklist: string[];
  disclaimer: string;
  faqs: FAQItem[];
  publicationStatus: PublicationStatus;
}

/**
 * Trust Statistics Model
 */
export interface TrustMetric {
  value: string;
  label: string;
  sublabel: string;
  isVerified: boolean;
}

/**
 * Testimonial Model
 */
export interface Testimonial {
  id: string;
  studentName: string;
  originCity: string;
  destinationCountry: string;
  institutionName: string;
  program: string;
  intakeYear: string;
  quote: string;
  avatarUrl?: string;
  verified: boolean;
  publicationStatus: PublicationStatus;
}

/**
 * Navigation Item Model
 */
export interface NavItem {
  label: string;
  href: string;
  children?: Array<{
    label: string;
    href: string;
    description?: string;
    badge?: string;
  }>;
}

/**
 * Inquiry Submission Payload
 */
export interface InquiryPayload {
  fullName: string;
  phone: string;
  email: string;
  serviceCategory: ServiceCategory;
  destinationCountry?: string;
  preferredIntake?: string;
  academicBackground?: string;
  message?: string;
  honeypot?: string;               // Must be empty
  timestamp: number;
}
