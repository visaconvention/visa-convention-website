# ARCHITECTURE.md — System Architecture & Technical Specifications

**Project:** Visa Convention — Official Website  
**Version:** 1.0.0  
**Last Updated:** November 9, 2026  
**Status:** Baseline Architectural Specification  

---

## 1. Architectural Philosophy & Technology Evaluation

### 1.1 Recommended Technology Stack: Astro 5.x + TypeScript + Tailwind CSS
To satisfy the requirements of extreme speed, technical SEO supremacy, low operational cost, and zero server database complexity, we recommend an **Islands Architecture with Static Site Generation (SSG)** powered by:

1. **Astro 5.x:**
   - *Static-First:* Delivers zero client-side JavaScript by default for pure content pages (service overviews, country profiles, about pages).
   - *Content Collections:* Provides build-time type validation using Zod for all country and university structured datasets.
   - *Component Agnostic:* Allows embedding reactive UI islands (search, filters, interactive accordions) only where strictly needed.
2. **TypeScript:** Strict type safety across all data models, component props, and API interfaces.
3. **Tailwind CSS v4 / v3.4:** Utility-first CSS framework with customized design tokens adhering strictly to the brand palette (`#102A53`, `#C91D32`, `#2367A4`, `#F5F8FC`, `#FFFFFF`).
4. **Lightweight Client Search (Pagefind / Fuse.js):** Zero-server, client-side indexing for searching across hundreds of universities in milliseconds.
5. **Form Service (Web3Forms / Formspree):** Serverless form processing with honeypot bot prevention, eliminating server upkeep and database security liabilities.

### 1.2 Evaluation Against Alternatives
- **Why Not a React/Next.js SPA/SSR?** A Next.js application requires a continuous Node.js server runtime or edge runtime, introducing cold starts, hydration overhead, potential server maintenance, and higher hosting costs. A content-driven consultancy site benefits significantly more from static HTML generated at build time.
- **Why Not WordPress / Generic CMS?** WordPress introduces database vulnerabilities, plugin update bloat, slow page loads, and fragile styling. Astro provides version-controlled Markdown/JSON/CSV content editing with sub-second page performance.

---

## 2. Directory Structure & Organization

```
visa-convention-wesbite/
├── .github/                      # CI/CD automation workflows (lint, test, build)
├── client-content/               # Central repository for raw client-provided copy and data
│   ├── brand-assets/             # Logos, office photography, counselor portraits
│   ├── countries/                # Structured country records (countries.json)
│   ├── universities/             # Structured university catalog (universities.csv / json)
│   ├── business-information.md   # Official contact, address, registration details
│   ├── services.md               # Detailed service descriptions & checklists
│   ├── success-stories.md        # Verified testimonials and case studies
│   ├── partnerships.md           # Educational and institutional collaboration copy
│   └── legal-and-policies.md     # Terms, privacy policy, disclaimers
├── public/                       # Static public assets (favicons, manifest, robots.txt)
│   ├── assets/
│   │   ├── flags/                # Country flags (SVG / optimized WebP)
│   │   ├── images/               # Curated, authentic photography
│   │   └── brand/                # Modernized logo variations
├── src/
│   ├── components/
│   │   ├── common/               # SectionHeading, Breadcrumbs, EmptyState, Badge
│   │   ├── layout/               # Header, Footer, DesktopNav, MobileNav, BaseHead
│   │   ├── home/                 # HeroSection, TrustStatistics, ServiceGrid, FeaturedCountries
│   │   ├── services/             # ServiceCard, ServiceProcess, EligibilityList
│   │   ├── countries/            # CountryCard, CountryHeader, CostSummary, FaqAccordion
│   │   ├── universities/         # UniversityCard, UniversitySearch, UniversityFilters
│   │   └── forms/                # EnquiryForm, FlightAssistanceForm, Honeypot, FormStatus
│   ├── content/                  # Astro Content Collections (Zod-validated)
│   │   ├── config.ts             # Strict content collection schemas
│   │   ├── countries/            # Individual country Markdown / JSON entries
│   │   ├── universities/         # University records
│   │   └── services/             # Dedicated service content
│   ├── layouts/
│   │   ├── BaseLayout.astro      # Master HTML shell with metadata, fonts, header, footer
│   │   ├── ServiceLayout.astro   # Standard layout for all 6 service pages
│   │   └── CountryLayout.astro   # Dynamic layout for study abroad country destinations
│   ├── styles/
│   │   └── global.css            # Tailwind directives, CSS design tokens, typography scale
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces (Country, University, Service, Inquiry)
│   ├── utils/
│   │   ├── data.ts               # Country/University query helpers & filter logic
│   │   ├── seo.ts                # JSON-LD Schema generators (LocalBusiness, Breadcrumbs)
│   │   └── validation.ts         # Client/Server form validation utilities
│   └── pages/                    # File-based routing engine
└── astro.config.mjs              # Astro configuration (integrations, sitemap, tailwind)
```

---

## 3. Route Map & Page Taxonomy

All public routes adhere strictly to clean, descriptive, SEO-optimized URL patterns:

| Route Path | Template Type | Activation Condition | Description |
| :--- | :--- | :--- | :--- |
| `/` | Static Page | Confirmed | Corporate homepage |
| `/about/` | Static Page | Confirmed | About Visa Convention, mission, Hanumangarh team |
| `/services/` | Static Page | Confirmed | Overview of all 6 service verticals |
| `/services/study-visa/` | Static Page | Confirmed | Study visa counseling, process, checklist |
| `/services/mbbs/` | Static Page | Confirmed | MBBS & PhD abroad guidance |
| `/services/tourist-visa/` | Static Page | Confirmed | Tourist & visitor visa documentation assistance |
| `/services/work-visa/` | Static Page | Confirmed | Work permit guidance & general compliance |
| `/services/flight-booking/` | Static Page | Confirmed | Air ticket & flight reservation assistance inquiry |
| `/study-abroad/` | Static Page | Confirmed | Comprehensive directory of 35+ destination countries |
| `/study-abroad/[country]/` | Dynamic SSG | Data-driven | Individual country deep-dive (admissions, costs, universities) |
| `/universities/` | Static + Island | Confirmed | Central searchable university directory with filters |
| `/universities/[slug]/` | Dynamic SSG | Data-driven | Detailed university profile with verified metadata |
| `/success-stories/` | Static Page | Draft/Verified | Verified student success stories & visa grant notices |
| `/partnerships/` | Static Page | Confirmed | Collaboration page for sub-agents & university partners |
| `/contact/` | Static Page | Confirmed | Interactive contact page with map, office details, forms |
| `/privacy-policy/` | Static Page | Confirmed | Privacy & data protection statement |
| `/terms/` | Static Page | Confirmed | Terms of service and legal disclaimers |

*Safety Protocol:* Any dynamic route lacking approved content will resolve cleanly or remain unlinked in production builds.

---

## 4. Scalable Data Architecture

### 4.1 Country Data Schema
Every destination country is represented by a strictly typed record:

```typescript
export interface Country {
  id: string;                      // e.g., "country-canada"
  slug: string;                    // e.g., "canada"
  name: string;                    // e.g., "Canada"
  isoCode: string;                 // e.g., "CA"
  continent: 'North America' | 'Europe' | 'Asia' | 'Oceania';
  featured: boolean;               // Homepage display toggle
  heroImage: string;               // High-res landscape image
  flagImage: string;               // Vector flag asset
  summary: string;                 // High-level overview
  keyHighlights: string[];         // 3-5 core selling points (post-study work, etc.)
  educationSystem: string;         // Overview of higher ed structure
  admissionRequirements: string[]; // General entry criteria
  visaGuidanceSummary: string;     // Visa category and process overview
  estimatedTuitionRange: string;   // e.g., "CAD 15,000 - 35,000 / year"
  estimatedLivingCost: string;     // e.g., "CAD 12,000 - 18,000 / year"
  popularIntakes: string[];        // e.g., ["Fall (September)", "Winter (January)"]
  faqs: Array<{ question: string; answer: string }>;
  sourceDisclaimer: string;        // Disclaimers for regulatory accuracy
  lastReviewedDate: string;        // ISO date of last review
  publicationStatus: 'draft' | 'published';
}
```

### 4.2 University Data Schema
Universities are decoupled from country templates so they can populate both country pages and the global directory:

```typescript
export interface University {
  id: string;                      // e.g., "uni-toronto"
  slug: string;                    // e.g., "university-of-toronto"
  name: string;                    // e.g., "University of Toronto"
  countryId: string;               // Foreign key referencing Country.id
  countryName: string;
  city: string;
  officialWebsite: string;         // Direct official .edu / .ac URL
  studyLevels: Array<'Bachelors' | 'Masters' | 'Doctorate' | 'Diploma' | 'MBBS'>;
  popularDisciplines: string[];    // e.g., ["Engineering", "Business", "Medicine"]
  relationshipStatus: 'listed_for_guidance' | 'verified_partner';
  featured: boolean;
  notes: string;
  publicationStatus: 'draft' | 'published';
}
```

---

## 5. Security & Form Architecture

- **No Public API Keys:** Form submissions will use serverless handlers (Web3Forms access keys stored in environment variables, never committed).
- **Spam Mitigation:**
  - Invisible CSS honeypot field (`website_url_check`).
  - Client-side timestamp verification (forms submitted under 3 seconds flagged as automated bots).
  - Rate-limiting headers.
- **Input Sanitization:** All text inputs stripped of malicious script tags and HTML entities before processing.
- **Privacy Assurance:** Explicit user consent checkbox required for data handling under Indian Digital Personal Data Protection Act (DPDP) and GDPR standards.

---

## 6. Technical SEO & Performance Architecture

- **Sub-Second Performance:** Target 100/100 Lighthouse performance through pre-rendered HTML, inline critical CSS, and modern image formats (AVIF/WebP) with explicit width/height dimensions.
- **JSON-LD Schema Hierarchy:**
  - Sitewide: `LocalBusiness` / `EducationalOrganization` schema referencing Hanumangarh address, hours, contact info.
  - Service pages: `Service` schema detailing guidance scope.
  - Country/University pages: `Course` and `EducationalOrganization` schema.
  - FAQ sections: `FAQPage` schema for Google rich snippet search visibility.
- **OpenGraph & Twitter Cards:** Dynamic social sharing cards for all routes with brand palette.
- **XML Sitemap & Canonical Tags:** Automated sitemap generation with strict canonical URL tags to prevent duplicate content indexing.
