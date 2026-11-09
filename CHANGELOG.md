# CHANGELOG.md — Project Activity & Version History

All notable changes to the **Visa Convention Official Website** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased] - Planned Stages 04–12
### Planned
- **Stage 04:** High-converting corporate homepage implementation.
- **Stage 05:** Service pages deep-content enhancement.
- **Stage 06:** Ingestion of all 31 client Excel workbooks into dynamic country engine.
- **Stage 07:** University directory expanded database and detailed profiles.
- **Stage 08:** About, verified trust, success stories, and partnership pages.
- **Stage 09:** Contact forms and multi-step inquiry journeys.
- **Stage 10:** Technical SEO, Schema.org JSON-LD structured data, and Web Vitals optimization.
- **Stage 11:** Comprehensive accessibility (WCAG 2.1 AA), cross-browser, and responsiveness QA.
- **Stage 12:** Production build verification and client handover documentation.

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
