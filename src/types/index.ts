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
  | 'flight-booking';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

/**
 * Country Data Model
 * Scalable schema supporting 35+ countries without template duplication.
 */
export interface Country {
  id: string;                      // Unique identifier, e.g., "country-canada"
  slug: string;                    // URL slug, e.g., "canada"
  name: string;                    // Formal display name, e.g., "Canada"
  isoCode: string;                 // Two-letter ISO country code, e.g., "CA"
  continent: Continent;
  capital?: string;
  currency?: string;
  featured: boolean;               // Appears in featured destinations on homepage
  active: boolean;                 // Whether the country is open for intake/guidance
  heroImage: string;               // Curated landscape image path
  flagEmoji?: string;              // Unicode flag
  flagSvg?: string;                // Vector flag path
  shortSummary: string;            // 1-2 sentence overview
  overview: string;                // Full markdown/text introduction
  keyHighlights: string[];         // 3-5 core benefits for international students
  popularCourses: string[];        // Popular academic fields
  intakes: string[];               // Major intakes, e.g., ["Fall (Sept)", "Winter (Jan)"]
  estimatedTuitionRange: string;   // Advisory tuition range
  estimatedLivingCost: string;     // Advisory cost of living
  workRights: string;              // Work while studying and post-study work summary
  visaGuidanceSummary: string;     // Overview of embassy requirements
  faqs: FAQItem[];
  sourceDisclaimer: string;        // Mandatory disclaimer regarding consular discretion
  lastReviewed: string;            // ISO date
  publicationStatus: PublicationStatus;
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
