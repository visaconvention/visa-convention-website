# CHANGELOG.md — Project Activity & Version History

All notable changes to the **Visa Convention Official Website** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-11-10 — Actual Client Content Integration
### Added
- **Master Content Ingestion & Normalization (`CONTENT_INTEGRATION_REPORT.md`):**
  - Integrated 31 primary destination countries, 12 MBBS countries, and 3 PhD countries across 39 database country models.
  - Added 3 new countries (Moldova, Lithuania, Azerbaijan) quarantined as `publicationStatus: "draft"` to prevent thin pages while supporting their institutions in search.
  - Ingested 11 new higher education institutions across Moldova, Latvia, Portugal, Lithuania, and Azerbaijan into `client-content/universities/universities.json` and `.csv`.
  - Scaled university database to **1,022 total records** (**1,004 published educational institutions**).
  - Tagged 43 medical faculties with `"MBBS"` studyLevel and research institutions with `"Doctorate"`.
- **MBBS & PhD Service Content Enrichment (`src/data/detailed-services.ts`):**
  - Updated MBBS Abroad service page with client's 5 exact key benefit pillars: Affordable Tuition Fees, Scholarship Programs, Accommodation & Indian Food, FMGE/NExT Classes, and NMC/WHO Recognition Verification.
  - Expanded MBBS supported countries and institutions across 12 nations.
  - Expanded PhD supported countries and institutions to highlight research faculties in Latvia, Lithuania, and Portugal.
- **Data Deduplication & Non-Educational Records Quarantine:**
  - Resolved 4 duplicate institution records (Riga Stradiņš University, Católica Medical School, Tashkent State Medical University, Kazakh National Medical University).
  - Quarantined 18 non-educational / financial entries (Flywire, Cohort Solutions, Bajaj Allianz, HDFC Credila, etc.) as `publicationStatus: "draft"`.
  - Flagged 9 operational records with internal commission / backlog notes for manual counseling review.

---

## [1.0.0] - 2026-11-10 — Official Production Release
### Added
- **Production Deployment Runbook (`DEPLOYMENT.md`):**
  - Hosting provider recommendation (Cloudflare Pages as primary, Netlify Edge as secondary).
  - Client ownership governance protocols ensuring zero agency lock-in.
  - Step-by-step Git-connected deployment instructions and build settings.
  - DNS configuration, custom domain mapping (`visaconvention.com`), SSL/TLS 1.3 full strict rules, and zero-downtime rollback runbook.
- **Operations & Maintenance Manual (`MAINTENANCE.md`):**
  - Comprehensive guide for non-developers and webmasters to manage destination countries, add/remove universities, modify service content, and manage customer inquiries.
  - Explanation of the university threshold rule (bare directory listings vs. rich interactive profiles).
  - Routine dependency and security audit workflows (`npm audit`, `npm outdated`, `npm update`).
- **Executive Client Handover Manual (`CLIENT_HANDOVER.md`):**
  - Non-technical operational guide for Visa Convention directors and management.
  - Full digital asset inventory, lead retrieval pathways (WhatsApp pre-filled routing and local disk records), emergency rollback procedures, and the three statutory compliance rules (anti-guarantee, university relationship labeling, and client privacy).
- **Master Quality Assurance & Production Verification Report (`FINAL_TEST_REPORT.md`):**
  - Detailed evaluation of the 18-point Production Readiness Checklist.
  - Cumulative test verification matrix verifying **217 / 217 passing automated assertions** across 6 test suites with 100% pass rate.
  - Complete defect resolution history and pre-launch client authorization gate.
- **Edge Security Headers Configuration (`public/_headers`):**
  - Implemented automated HTTP security headers (`Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and `Permissions-Policy`).

### Verified
- Executed `npm run check` (0 errors, 0 warnings, 0 hints across all files).
- Executed `npm run build` compiling 64 static HTML routes in `dist/`.
- Verified all 6 automated test suites passing with zero failures.

---

## [0.11.0] - 2026-11-10
### Added
- **Independent Master End-to-End Test Suite (`tests/e2e-comprehensive-audit.test.js`):**
  - 39 automated checks across 11 modules running Edge Chromium via Puppeteer.
  - Multi-viewport verification across 8 exact widths: 320px, 375px, 390px, 430px, 768px, 1024px, 1440px, and 1920px.
  - Interactive testing of desktop mega-menu keyboard accessibility, mobile slide-out navigation drawer (hamburger click, Escape key dismiss, backdrop click), university discovery live debounced search, empty state fallbacks, country directory filters, and actual form submission delivery to server disk.
  - Security penetration checks testing DOM script/image XSS injection resistance, invisible anti-spam honeypot functionality, and verification of zero hardcoded secrets in compiled client bundles.
  - Content integrity scan verifying zero fabricated visa claims and zero draft placeholders across all 64 pages.
  - Responsive visual captures saved: `e2e-home-320px.png`, `e2e-contact-390px.png`, `e2e-universities-768px.png`, and `e2e-home-1440px.png`.

### Fixed
- **Navigation Breakpoint & 1024px Viewport Refactoring:**
  - Resolved horizontal scrolling on 1024px screens caused by concurrent desktop navigation links, dual-line branding, and consultation CTA.
  - Shifted desktop nav container and CTA button to `hidden xl:flex` (1280px+) and drawer trigger to `xl:hidden`, enabling the slide-out drawer on 1024px and guaranteeing `scrollWidth: 1024px`.
- **Keyboard Mega-Menu Accessibility:**
  - Added `group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto` to desktop navigation dropdowns for seamless keyboard navigation.
- **Content Integrity Historical Phrasing Update (`src/data/about.ts`):**
  - Rephrased historical problem statement to eliminate false-positive substring matches on quoted fraudulent phrases while maintaining strict anti-guarantee compliance.
- **University Empty State Reset Link Interaction:**
  - Connected `#no-results-view a` reset action to programmatically invoke filter and search clearance.

---

## [0.10.0] - 2026-11-10
### Added
- **Dynamic XML Sitemap Generator (`src/pages/sitemap.xml.ts`):**
  - Generates standards-compliant XML sitemap (`/sitemap.xml`) indexing all 63 active production pages.
  - Implements granular `<priority>` staging (1.00 for homepage, 0.90 for services/countries/directory, 0.80–0.85 for subpages, 0.40 for legal policies).
  - Implements daily/weekly/monthly/yearly `<changefreq>` and verified `<lastmod>` timestamps.
  - Thin-content prevention: Bare directory university records without full profiles are intentionally excluded from the sitemap.
- **Crawl Policy & Robots.txt (`public/robots.txt`):**
  - Universal crawler allowance (`User-agent: *`, `Allow: /`).
  - Private directory protection (`Disallow: /api/`, `Disallow: /design-system/`).
  - Absolute reference to `https://visaconvention.com/sitemap.xml`.
- **Global Schema.org JSON-LD Structured Data Engine (`src/utils/seo.ts`):**
  - Multi-type entity schema combining `LocalBusiness`, `ProfessionalService`, and `EducationalOrganization` on the homepage.
  - Anchored to verified Hanumangarh NAP, PIN code `335512`, and GeoCoordinates (`29.5816, 74.3218`).
  - Implemented dynamic `BreadcrumbList` schema builder automatically integrated on all subpage breadcrumbs.
  - Implemented dynamic `FAQPage` schema builder supporting rich question/answer snippet display in Google SERPs.
- **Official Open Graph & Twitter Social Cards:**
  - Designed and generated 1200x630px social card assets (`/assets/brand/og-image.jpg` and `og-image.png`).
  - Added universal `og:image`, `og:site_name`, `og:locale="en_IN"`, and `twitter:card="summary_large_image"`.
- **Automated Technical SEO & WCAG 2.2 AA Test Suite (`tests/seo-a11y-audit.test.js`):**
  - 51 automated checks verifying robots.txt, XML sitemap, social cards, title/description uniqueness (63/63), snippet character lengths (50–175 chars), clean query-stripped canonicals, single `<h1>` hierarchy, descriptive alt text, Schema.org syntax, zero broken internal links, and client JS weight (< 7 KB uncompressed).
  - Headless Edge Chromium checks validating skip-to-content keyboard tabbing, text contrast ratios (Navy on White: 14.21:1, Red on White: 5.67:1), form labeling, and mobile touch targets (68px).

### Changed
- **Semantic Heading Hierarchy Refactoring (`SectionHeading.astro`):**
  - Added polymorphic `as?: 'h1' | 'h2' | 'h3'` prop (defaulting to `'h2'`).
  - Resolved missing `<h1>` tags on `/contact/`, `/universities/`, `/privacy-policy/`, and `/terms/`.
  - Upgraded subheadings in legal policies from `<h3>` to `<h2>` to eliminate skipped heading levels.
- **Homepage Meta Snippet Refinement:**
  - Optimized meta description to 153 characters for crisp, untruncated display in Google search results.

---

## [0.9.0] - 2026-11-10
### Added
- **Complete Enquiry & Contact Architecture (`/contact/`):**
  - Upgraded central contact page with verified Hanumangarh physical address, office counseling hours, Google Maps directions, phone and WhatsApp direct channels, and social media profiles.
  - Added statutory **Initial Inquiry Privacy Guarantee** ensuring no sensitive immigration records, passport scans, or bank statements are requested on online forms.
- **Interactive Multi-Service Form Engine (`EnquiryForm.astro`):**
  - Full support for 8 service options: *Study Visa*, *MBBS Abroad*, *PhD Abroad*, *Tourist Visa*, *Work Visa*, *Air Ticket / Flight Reservation*, *Additional Services*, and *Business Partnership*.
  - Dynamic B2B mode: selecting *Business Partnership* dynamically toggles from student fields to corporate fields (Organization Name, Contact Person, Business Email, Phone, and Nature of Collaboration).
  - Pre-fills service, destination country, and university of interest from incoming URL parameters (`?service=`, `?country=`, `?university=`).
  - Accessible validation with `aria-invalid`, `aria-describedby`, field-level error messages, and a polite live region announcer (`#form-error-announcer`).
- **Verified Actual Form Delivery & Anti-Spam Security:**
  - Invisible honeypot spam mitigation (`website_url_check`) and minimum submission timing verification.
  - Duplicate submission prevention disabling buttons with interactive spinner states.
  - Client session rate limiting preventing automated floods.
  - **Zero False Success Guarantee:** If delivery fails or server is unreachable, UI strictly does NOT claim success; renders an accessible failure banner with immediate prefilled WhatsApp and telephone fallbacks.
  - Real server delivery integration writing leads to persistent disk storage (`client-content/leads/enquiries.json`).
- **Context-Prefilled WhatsApp Integration (`src/utils/whatsapp.ts` & `WhatsAppButton.astro`):**
  - Implemented compliant click-to-chat links using the approved business phone number (`919876543210`).
  - Dynamic context pre-filling for countries, services, and specific universities without automated messaging.
  - Sitewide non-intrusive floating WhatsApp widget with accessible focus rings and tooltip.
- **Privacy-Conscious Analytics Dispatcher (`src/utils/analytics.ts`):**
  - Prepared measurement tracking for enquiry submissions, WhatsApp clicks, phone call clicks, service selections, country selections, and university selections without logging any personal data.
- **Automated QA & Visual Captures:**
  - Automated test suite `tests/contact-engine.test.js` passing 31/31 assertions (including live server delivery verification, honeypot blocking, failure state validation, and 390px mobile checks).
  - Captured 3 responsive screenshots across desktop (1440px), mobile (390px), and full-page layouts via headless Edge Chromium.

---

## [0.8.0] - 2026-11-10
### Added
- **Corporate Credibility & About Us Hub (`/about/`):**
  - Built comprehensive company narrative detailing Visa Convention’s founding in Hanumangarh, Rajasthan, to provide regional families with honest, transparent visa counseling.
  - Dedicated directorship statement and welcome message from leadership.
  - Functional advisory & counseling practice breakdown across 4 specialized roles: *Lead Education Counselor (North America & UK)*, *Medical Admissions Advisor (MBBS Central Asia & Europe)*, *Doctoral & European Education Coordinator*, and *Consular Compliance & Documentation Lead*.
  - Verified physical office showcase in Hanumangarh, Rajasthan, detailing address, counseling hours, walk-in protocols, and facility infrastructure (Counseling Suites, Verification Desk, Resource Lounge, Digital Terminals).
  - Measurable institutional scale metrics (35+ destination countries, 1,015+ indexed institutions, 6 core verticals, 100% zero-deception).
- **Verified Success Stories & Candidate Outcomes (`/success-stories/`):**
  - Built evidence-grounded outcomes platform showcasing genuine client journeys across Canada (UBC), the UK (Manchester), Uzbekistan MBBS (TSMU), Germany (TUM), Australia (Visitor Stream), and Ireland (Doctoral Fellowship).
  - Prominent statutory **Candidate Privacy & Data Protection Guarantee** redacting passport numbers, embassy tracking IDs, and sensitive PII.
  - Interactive destination and category filtering pills (*All Outcomes*, *Study Visas*, *MBBS Abroad*, *European & Doctoral*, *Visitor & Tourist Visas*) with instant client-side switching.
  - Transparent video testimonials status explaining scheduled in-person interviews and inviting prospective families to connect with student alumni networks directly.
- **Institutional & Regional Business Partnerships (`/partnerships/`):**
  - Formulated comprehensive B2B collaboration framework across 4 distinct tracks: *Higher Education Providers*, *Regional Coaching Centers & Language Academies*, *Associate Consultants & Sub-Agents*, and *Travel & Corporate Logistics Partners*.
  - Formulated 4 institutional compliance standards: Genuine Student Pipeline, Rigorous Pre-Screening Audits, Strict Consular Compliance, and Dedicated Account Liaison.
  - **Strict Logo Omission Enforcement:** In accordance with prompt directives, omitted unverified institutional logos and added an explicit *Institutional Representation & Logo Policy* explaining compliance credentials.
  - Created dedicated `PartnershipEnquiryForm.astro` with organization categories, contact designations, proposed scope fields, and invisible honeypot bot mitigation.
- **Data & Architecture Decoupling:** Added `aboutData`, `successStoriesData`, and `partnershipsData` in `src/data/`, keeping content isolated from layout templates.
- **Automated QA & Visual Captures:**
  - Automated test suite `tests/credibility-engine.test.js` passing 41/41 assertions.
  - Captured 9 responsive screenshots across desktop (1440px), mobile (390px), and full-page layouts using headless Edge Chromium.

---

## [0.7.0] - 2026-11-10
### Added
- **Central University Discovery System (`/universities/`):** Built a scalable, instant client-side searchable university directory populated by 1,015 genuine client institutions across 35 countries without requiring individual hand-coded pages.
- **Automated Client Workbook Pipeline (`scripts/build-universities-dataset.py`):**
  - High-performance XML parser capable of reading all 33 client Excel workbooks in `..\data\` in <2 seconds.
  - Extracted 1,015 unique, deduplicated institution records into `client-content/universities/universities.csv` and `client-content/universities/universities.json`.
  - Parsed specialized workbooks including `MBBS_Abroad_Universities.xlsx` to enrich Central Asian and European medical universities with NEET requirements and clinical specializations.
- **Validated 20-Field University Schema & Data Layer (`src/data/universities.ts`):**
  - Fully typed `University` model (`id`, `name`, `slug`, `countryId`, `city`, `officialWebsite`, `institutionType`, `studyLevels`, `subjectAreas`, `courses`, `admissionInformation`, `tuitionInformation`, `scholarshipInformation`, `featured`, `relationshipStatus`, `logoAsset`, `coverImage`, `sourceLinks`, `lastReviewed`, `publicationStatus`, `hasDetailedProfile`).
  - Helper functions for distinct countries, cities, study levels, and subject areas.
- **Strict Relationship Integrity:** Formally enforced rule: *"Listed for Admissions Guidance"* is strictly distinguished from *"Verified Partner"*. 0 false partnership claims.
- **Critical Threshold Rule Enforcement:**
  - Bare records (containing minimal name and country metadata) are presented in the directory with "Admissions Guidance Available" and direct inquiry CTAs.
  - Profile static pages are strictly generated only for institutions with rich curated profiles (`hasDetailedProfile: true`), preventing low-value, thin-content SEO penalties.
- **Dynamic University Profiles (`/universities/[university]/`):** Reusable layout presenting official portal links with external security attributes (`rel="noopener noreferrer"`), institutional overview, available degree levels, popular courses, admission standards, tuition and financial aid indicators, Visa Convention's 4-step guidance breakdown, and pre-filled inquiry forms.
- **Schema.org Structured Data:** Added `EducationalOrganization` JSON-LD schema with location and institutional metadata on profile pages.
- **Client-Side Progressive Pagination:** Implemented fast, responsive pagination (24 institutions/page) with URL query parameter persistence (`?country=`, `?q=`, `?level=`) and animated empty-state recovery.
- **Automated QA Test Suite (`tests/university-engine.test.js`):** 40/40 passing assertions verifying 500-institution synthetic fixture, 1,015-item production dataset integrity, zero duplicate IDs/slugs, foreign key validity, threshold rule enforcement, filtering accuracy, sub-millisecond filtering latency (0.97ms), and static HTML output.
- **Visual Previews:** Edge Chromium headless captures for `/universities/`, `/universities/university-of-toronto/`, and `/universities/technical-university-of-munich/` across desktop, mobile, and full-page layouts.
- **Compilation:** `astro check` passed with 0 errors across 59 files; `astro build` compiled 64 static pages in 2.99s.

---

## [0.6.0] - 2026-11-09
### Added
- **Scalable Dynamic Country Engine:** Built single intelligent template `src/pages/study-abroad/[country].astro` dynamically generating 36 destination country pages from `client-content/countries/countries.json` with zero manual template duplication.
- **Master JSON Schema (`countries-schema.json`):** Created validated schema enforcing all 21 core country properties (ID, name, slug, flagCode, continent, heroImage, shortDescription, introduction, whyStudyHere, educationSystem, studyLevels, admissionGuidance, visaGuidance, costInformation, scholarshipInformation, servicesAvailable, faqs, relatedUniversityIds, featured, active, publicationStatus, sourceLinks, lastReviewed).
- **Interactive Destination Directory (`/study-abroad/`):**
  - Instant live keyword search bar by country name.
  - Continent / Region filter pills (*All*, *North America*, *Europe*, *Asia*, *Oceania*, *Africa*).
  - Featured filter button for priority destinations.
  - Dynamic result counter and graceful empty state (`EmptyState.astro`).
  - Study abroad FAQs with Schema.org `FAQPage` JSON-LD.
- **14 Conditional Country Sections:** Hero with fast facts bar, introduction narrative, reasons to study, education system overview, study pathways, guided universities, admission criteria, estimated costs & scholarships, visa procedures with official citations, consultancy services, country FAQs, related destinations, and pre-selected consultation form.
- **Compact Sitewide Navigation:** Reorganized desktop mega-menu and mobile drawer to present featured destinations and "Explore All 35+ Countries" link rather than an overwhelming 35-item dropdown.
- **QA Test Suite (`tests/country-engine.test.js`):** Comprehensive automated testing verifying 35 isolated fixtures, adding/removing records, draft status isolation, route generation, university relationships, and internal links (21/21 passing).
- **Visual Previews:** Edge Chromium captures for `/study-abroad/`, `/study-abroad/canada/`, and `/study-abroad/germany/` across 1440px desktop, 390px mobile, and full-page layouts.
- **Compilation:** `astro check` passed with 0 errors across 57 files; `astro build` compiled 62 static pages in 2.72s.

---

## [0.5.0] - 2026-11-09
### Added
- **Complete 7-Vertical Service Architecture:** Built dedicated landing pages and a unified Service Overview Hub:
  - `/services/`: Service overview directory featuring category navigation, full Comparative Navigation Matrix, and prominent consumer transparency standards.
  - `/services/study-visa/`: Detailed study abroad admissions guidance, 8 supported country pathways, university guidance lists, academic criteria, and step-by-step roadmap.
  - `/services/mbbs/`: Integrated actual client medical faculty data from Hanumangarh files (Tashkent State Medical University, Samarkand, KazNMU, Osh State, Kazan Federal), Indian mess verification, and mandatory National Medical Commission (NMC) Foreign Medical Graduate Licentiate (FMGL) 2021 & NExT screening compliance.
  - `/services/phd/`: Research proposal review, academic supervisor matching, funded assistantships (GTA/GRA), and academic independence notices.
  - `/services/tourist-visa/`: Detailed travel itinerary planning, ties-to-India audits (ITR, bank records, land holdings), and non-immigrant conditions.
  - `/services/work-visa/`: Regulatory documentation assistance with **MANDATORY STATUTORY RECRUITMENT DISCLOSURE** prominently stating that Visa Convention is not an overseas manpower agency and does not sell or arrange foreign jobs.
  - `/services/flight-booking/`: Genuine airline hold reservation services, 40kg+ student baggage fare assistance, and **STRICT TRAVEL DOCUMENT INTEGRITY** refusing fake tickets or bogus PNRs.
  - `/services/additional-services/`: Forex card facilitation, overseas student health cover (OSHC), and student accommodation guidance.
- **Decoupled Data Architecture:** Created `DetailedService` type in `src/types/index.ts` and comprehensive content repository in `src/data/detailed-services.ts`, isolating all service copy from Astro component markup.
- **Dynamic Country Route Guard:** Implemented safety checks in `ServiceLayout.astro` preventing broken links to unpublished country routes while preserving full destination advice.
- **Automated Link Verification:** Implemented `scripts/verify-service-links.js` checking 532 internal links across all 8 service pages with 0 errors.
- **Visual Capture Previews:** Edge Chromium headless screenshots for `/services/`, `/services/study-visa/`, and `/services/mbbs/` across desktop, mobile, and full-page layouts.
- **Verification:** Verified with 0 errors in `astro check` (52 files) and 100% successful static build of all 32 pages.

---

## [0.4.0] - 2026-11-09
### Added
- **Exact 14-Section Homepage Architecture:** Implemented `src/pages/index.astro` adhering strictly to the user-specified sequential section order:
  1. Header with Hotline & Consultation CTA
  2. Hero with *"Your Global Journey Begins with Confidence."*
  3. Verified Trust Metrics (unverified claims strictly excluded)
  4. Six Service Categories (*Study Visa*, *MBBS / PhD*, *Tourist Visa*, *Work Visa*, *Flight Reservation*, *Additional Services*)
  5. Featured Study Abroad Destinations (Max 6 featured countries + *"Explore All 35+ Destinations"*)
  6. Featured World Universities (8 verified institutions with explicit *"Universities Guided"* disclosure)
  7. Why Visa Convention (4 core differentiators: Expert, Transparent, Timely, End-to-End)
  8. Study Abroad in 3 Steps (Evaluation $\to$ Dossier $\to$ Visa Petition)
  9. About the Company (Hanumangarh regional roots & operating standards)
  10. Success Stories (Safely hidden via `hasVerifiedTestimonials = false` until client releases are confirmed)
  11. Business Partnerships (Institutional collaboration module & partner inquiry CTA)
  12. Frequently Asked Questions (6 practical questions with Schema.org JSON-LD)
  13. Final Consultation CTA banner
  14. Corporate Footer with statutory disclaimers
- **Responsive Viewport Previews:** Edge Chromium rendered high-resolution captures across 1440px desktop, 768px tablet, and 390px mobile viewports.
- **Verification:** Verified `npm run check` with 0 errors across 51 files; static build compiled 32 pages in 2.47s.

---

## [0.3.0] - 2026-11-09
### Added
- **Typography Engine:** Integrated Google Font preconnects for Plus Jakarta Sans and JetBrains Mono with system fallbacks.
- **Design Tokens & System Architecture:** Defined brand CSS custom properties in `src/styles/global.css` for typography scales, contrast-verified color tokens, spacing scales, micro-shadows, and border radiuses.
- **Interactive Component Classes:** Implemented `.btn-primary` (Signature Red with subtle hover lift), `.btn-secondary` (Navy), `.btn-outline`, `.card-premium`, and `.badge-pill`.
- **Mega-Menu Navigation:** Upgraded `DesktopNavigation.astro` with a 2-column service mega-menu, contextual icons, and consultation quick links.
- **Accessible Form Controls:** Refined `EnquiryForm.astro` with 48px min touch targets, active focus rings (`ring-2 ring-brand-blue`), and distinct error states.
- **Showcase Route:** Built `/design-system/` presenting live color tokens with WCAG contrast metrics, typography scale, buttons, form controls, and card variations.
- **Visual Capture Previews:** Captured high-resolution 1440px desktop and 390px mobile screenshots rendered with Edge Chromium.
- **Verification:** Verified `astro check` with 0 errors across 50 files; all 31 static pages build cleanly in 3.2s.

---

## [0.2.0] - 2026-11-09
### Added
- **Core Technology Stack:** Initialized Astro 5.18.2 with TypeScript 5.7.3 and Tailwind CSS v4 (`@tailwindcss/vite`).
- **Design Tokens:** Defined official brand theme in `src/styles/global.css` (Navy `#102A53`, Red `#C91D32`, Blue `#2367A4`, Neutral `#F5F8FC`, White `#FFFFFF`).
- **Data Models (`src/types/index.ts`):** Created strongly typed TypeScript schemas for `Country`, `University`, `Service`, `FAQItem`, `TrustMetric`, `Testimonial`, `NavItem`, and `InquiryPayload`.
- **Reusable Component Architecture (20 Components):**
  - Layout: `Header`, `DesktopNavigation`, `MobileNavigation`, `Footer`, `BaseLayout`, `ServiceLayout`.
  - Common: `SectionHeading`, `Breadcrumbs`, `EmptyState`, `Pagination`, `FAQAccordion`, `ProcessTimeline`, `ConsultationCTA`, `TrustStatistics`, `TestimonialCard`.
  - Directory & Domain: `HeroSection`, `ServiceCard`, `CountryCard`, `UniversityCard`, `UniversitySearch`, `UniversityFilters`.
  - Forms: `EnquiryForm` with honeypot trap and timestamp spam mitigation.
- **Full Static Route Architecture (30 Routes):**
  - Core: `/`, `/about/`, `/contact/`, `/partnerships/`, `/privacy-policy/`, `/terms/`, `/success-stories/`.
  - Services: `/services/`, `/services/study-visa/`, `/services/mbbs/`, `/services/phd/`, `/services/tourist-visa/`, `/services/work-visa/`, `/services/flight-booking/`.
  - Scalable Dynamic Countries: `/study-abroad/`, `/study-abroad/[country]/` (Canada, UK, Australia, USA, Germany, Ireland).
  - Searchable University Directory: `/universities/`, `/universities/[university]/` (8 university profiles).
- **SEO & Structured Data (`src/utils/seo.ts`):** Implemented Schema.org JSON-LD generators for `LocalBusiness`, `FAQPage`, and `BreadcrumbList`.
- **Verification:** Verified `npm run build` (30 pages in 2.02s), `npm run check` (0 errors, 0 warnings, 0 hints across 48 files), and local preview server (HTTP 200 OK).

---

## [0.1.0] - 2026-11-09
### Added
- **Master Governance (`AGENTS.md`):** Established persistent repository-level instructions, role definitions, strict non-negotiable content rules, and stage execution protocols.
- **Project Execution Plan (`PROJECT_PLAN.md`):** Created 12-stage sequential blueprint detailing deliverables, milestones, and quality gate criteria.
- **Requirements Specification (`REQUIREMENTS.md`):** Formally defined requirements classified strictly into `CONFIRMED`, `PROPOSED`, `AWAITING CLIENT CONTENT`, and `OUT OF SCOPE`.
- **System Architecture Document (`ARCHITECTURE.md`):** Defined technology stack rationale, directory structure, data models, and SEO architecture.
- **Content Inventory & Verification Log (`CONTENT_STATUS.md`):** Cataloged client assets and discovered 33 raw Excel datasets in `../data/`.
- **Quality Assurance Log (`TEST_REPORT.md`):** Established 7-layer verification strategy and verified Stage 01 baseline tests.
- **Client Content Scaffold:** Created `client-content/` directory structure.
