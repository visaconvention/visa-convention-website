# CHANGELOG.md — Project Activity & Version History

All notable changes to the **Visa Convention Official Website** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased] - Planned Stages 06–12
### Planned
- **Stage 06:** Ingestion of all 31 client Excel workbooks into dynamic country engine.
- **Stage 07:** University directory expanded database and detailed profiles.
- **Stage 08:** About, verified trust, success stories, and partnership pages.
- **Stage 09:** Contact forms and multi-step inquiry journeys.
- **Stage 10:** Technical SEO, Schema.org JSON-LD structured data, and Web Vitals optimization.
- **Stage 11:** Comprehensive accessibility (WCAG 2.1 AA), cross-browser, and responsiveness QA.
- **Stage 12:** Production build verification and client handover documentation.

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
