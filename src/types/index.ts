/**
 * Visa Convention — Core Type Definitions & Schemas
 * Type-safe models for countries, universities, services, navigation, and inquiries.
 */

export type PublicationStatus = 'draft' | 'published';

export type Continent = 'North America' | 'Europe' | 'Asia' | 'Oceania' | 'South America' | 'Africa';

export type StudyLevel = 'Bachelors' | 'Masters' | 'Doctorate' | 'Diploma' | 'MBBS' | 'Foundation';

export type UniversityRelationship = 'listed_for_guidance';

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
  cardImage?: string;                                  // Canonical card/directory photograph path
  cardImageAlt?: string;                               // Descriptive alt text for card image
  imageObjectPosition?: string;                        // CSS object-position for card image cropping
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
 * Centralized schema populating both country pages and the global searchable directory.
 * Scalable to thousands of institution records.
 */
export interface University {
  // Core schema fields required by specification:
  id: string;                                          // Unique identifier, e.g., "uni-toronto"
  name: string;                                        // Official university or college name
  slug: string;                                        // Stable kebab-case URL slug
  countryId: string;                                   // References Country.id
  city?: string;                                       // City or campus location
  officialWebsite?: string;                            // Official verified institutional portal
  institutionType?: string;                            // e.g., "Public Research University", "Technical Institute"
  studyLevels: StudyLevel[];                          // Available study levels (Bachelors, Masters, etc.)
  subjectAreas: string[];                              // Subject domains (Computer Science, Business, etc.)
  courses: string[];                                   // Program offerings or course highlights
  admissionInformation?: string;                       // Entry criteria, GPA, and test requirements
  tuitionInformation?: string;                         // Advisory tuition range
  scholarshipInformation?: string;                     // Institutional grants or awards
  featured: boolean;                                   // Featured on homepage or top directory picks
  relationshipStatus: UniversityRelationship;          // STRICT: "listed_for_guidance" (independent advisory)
  logoAsset?: string;                                  // University crest/logo asset path
  coverImage?: string;                                 // Campus photograph path
  sourceLinks?: Array<{ label: string; url: string }> | string[]; // Official reference sources
  lastReviewed: string;                                // ISO date (YYYY-MM-DD)
  publicationStatus: PublicationStatus;                // "published" | "draft"
  hasDetailedProfile?: boolean;                        // True if record contains full profile content (prevents thin pages)

  // Backward-compatibility properties:
  countryName: string;                                 // Display name of destination country
  countrySlug: string;                                 // Slug for linking to country page
  worldRanking?: string;                               // Ranking indicator (e.g., "Top 25 Global")
  averageTuition?: string;                             // Alias for tuitionInformation
  description?: string;                                // Institution overview narrative
  popularDisciplines: string[];                        // Alias for subjectAreas
  campusLocations?: string[];
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
 * Team & Leadership Profile Model
 */
export interface TeamMember {
  id: string;
  roleTitle: string;
  department: string;
  specialization: string;
  experienceYears?: string;
  responsibilities: string[];
  bio: string;
  name?: string;
  photoUrl?: string;
  isLeadership?: boolean;
}

/**
 * Verified Candidate Outcome & Case Study Model
 */
export interface SuccessStory {
  id: string;
  candidateIdentifier: string;         // Anonymized/redacted candidate label e.g., "M.S." or verified name
  originCity: string;                  // e.g., "Hanumangarh, Rajasthan"
  destinationCountry: string;          // e.g., "Canada"
  destinationCountrySlug: string;      // e.g., "canada"
  institutionName: string;             // e.g., "University of British Columbia"
  programLevel: string;                // e.g., "Postgraduate Diploma" or "Bachelor of Engineering"
  courseName: string;                  // e.g., "Data Analytics & Software Systems"
  visaCategory: string;                // e.g., "Study Permit (SDS)" or "Tier 4 Student Visa"
  yearGranted: string;                 // e.g., "2025"
  quote: string;                       // Genuine client review/testimonial
  keyMilestones: string[];             // e.g., ["IELTS 7.5", "SOP Refinement", "28-day Embassy Turnaround"]
  verificationStatus: "verified" | "redacted_for_privacy" | "pending_consent";
  category: "study" | "mbbs" | "phd" | "tourist" | "work";
}

/**
 * Institutional & B2B Partnership Track Model
 */
export interface PartnershipTrack {
  id: string;
  title: string;
  subtitle: string;
  targetAudience: string;
  description: string;
  offerings: string[];
  eligibilityCriteria: string[];
  icon: string;
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
