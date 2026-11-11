# CHANGELOG.md — Project Activity & Version History

All notable changes to the **Visa Convention Official Website** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.17.0] - 2026-11-11 — Flight Booking Integration & Website-Wide Photography Upgrade

### Added
- **Dedicated Flight Booking & Reservation Assistance Page (`src/pages/services/flight-booking.astro`):**
  - Redesigned as a bespoke, conversion-optimized service page with compact photographic hero featuring authentic commercial aviation photography (`/assets/images/flight-hero-aviation.jpg`).
  - Clear three-option service distinction:
    1. **Confirmed Flight Ticket Enquiry:** Direct e-ticketing post-visa grant with student baggage codes.
    2. **Flight Reservation Assistance (for Visa Applications):** Genuine verifiable GDS airline reservation holds for embassy dossiers.
    3. **Travel Itinerary Assistance:** Proposed route scheduling and transit optimization without upfront booking hold.
  - Prominent consular advisory citation (U.S. Department of State, UKVI, and European consulates advising applicants against non-refundable ticket purchases prior to visa issuance) and explicit zero fake PNR / dummy ticket disclaimer.
  - Supporting guidance column (~35% width) detailing the 4-step workflow, 40kg–46kg student luggage allowance optimization (British Airways, Air India, Emirates, Qatar Airways, Lufthansa, Virgin Atlantic), tariff transparency, and direct WhatsApp / phone contact desk.
  - Interactive FAQ accordion with Schema.org `FAQPage` JSON-LD structured data.
- **Interactive Flight Enquiry Form (`src/components/forms/FlightEnquiryForm.astro`):**
  - Responsive two-column form (~65% width) with segmented journey type toggle (`Round-Trip` vs. `One-Way`).
  - Dynamic conditional return date field (automatically disabled and tucked when `One-Way` is selected; client-side date comparison ensuring return date is on or after departure date).
  - Validated origin and destination city/airport inputs.
  - Passenger count and cabin class selectors with specialized `Student (Baggage Allowance Request)` passenger profile.
  - Strict privacy protection: Zero initial passport bio-data collection on web forms (collected later only through secure direct channel if proceeding to ticket issuance).
  - Anti-spam honeypot (`airline_preference_hp`) and session rate limiting.
  - Verified confirmation view with unique reference ID (`VC-FLT-XXXXXX`) and direct prefilled WhatsApp confirmation link.
- **Serverless Endpoint Flight Handling (`api/enquiry.js`):**
  - Extended production serverless function to support `submissionType === 'flight'` with strict server-side validation, date logic, input sanitization, and persistent storage.
- **Website-Wide Photography & Image Governance System:**
  - Created `IMAGE_AUDIT.md` comprehensive forensic inventory documenting every image asset, purpose, dimensions, license, alt text, and status across all pages.
  - Added authentic medical education photograph (`/assets/images/mbbs-education.jpg`) to MBBS Abroad page (`src/pages/services/mbbs.astro`).
  - Added authentic doctoral research scholar photograph (`/assets/images/phd-research.jpg`) to PhD Abroad page (`src/pages/services/phd.astro`).
  - Updated `ServiceLayout.astro` with conditional editorial split layout for services with hero photography.
  - Normalized `src/data/country-registry.ts` and `src/types/index.ts` to directly provide `countryId`, `countryName`, `slug`, `primaryImage`, `altText`, `sourceUrl`, `license`, `objectPosition`, and `approvalStatus` for all 51 countries.
- **Automated QA Suite (`tests/flight-booking-and-images.test.js`):**
  - 28 automated checks verifying metadata, DOM integrity, form toggling, client-side validation, serverless dispatch, persistent storage, and image asset resolution.

### Verified
- Automated test suites: **235 / 235 tests passing (100%)** across all 7 QA suites.
- Static compilation: **64 static routes compiled cleanly in 3.69s**.
- Responsive layout verification: **Zero horizontal overflow across all 9 viewports** (320px, 375px, 390px, 430px, 768px, 1024px, 1366px, 1440px, 1920px).
- Captured before/after screenshots and responsive audit logs in artifact directory.

---

## [1.16.0] - 2026-11-11 — Premium International Homepage Redesign & Landmark Architecture

### Changed
- **International Landmark Hero Section (`src/components/home/HeroSection.astro` & `src/pages/index.astro`):**
  - Integrated high-end editorial landmark visual (`/assets/images/hero-landmarks.jpg`) showcasing the Statue of Liberty (USA), Big Ben / Westminster (UK), Eiffel Tower (France), and Sydney Opera House (Australia) with tranquil waterfront reflections and natural golden hour lighting.
  - Zero decorative clutter: strictly no floating badges, no cartoon clip-art airplanes, no fake 3D globes, and no text embedded in artwork.
  - Balanced editorial split layout: ~55% content column and ~45% image column (`grid-template-columns: 1fr minmax(0, 520px)`, gap `clamp(2rem, 3.5vw, 3rem)`).
  - Clear typographic scale: 52–60px H1 headline (`Study Abroad, Visa & Travel Services`), 18–19px supporting description, and min 50px tall primary/secondary CTA buttons.
- **Three-Pathway Service Architecture (`src/pages/index.astro`):**
  - Restructured service overview into three core pathways incorporating all six client verticals without neon advertisement panels:
    - **Study Abroad:** Higher education admissions, MBBS abroad faculties, and doctoral research fellowships across 35+ countries, with direct links to Study Visa, MBBS Abroad, and PhD Guidance.
    - **Visa Services:** Consular dossier audits, tailored applicant profiles, and administrative work permit compliance, with direct links to Tourist Visa and Work Visa pages.
    - **Travel Services:** Airline ticket reservations, embassy reservation holds, and student baggage discounts, with direct links to Flight Booking and Additional Services.
- **Featured Study Destinations Grid:**
  - Expanded homepage destination showcase to 6 priority global destinations (Canada, UK, Australia, USA, Germany, Ireland) in a balanced 3×2 grid, each displaying verified landmark photography.

### Verified
- Automated test suites: **246 / 246 tests passing (100%)** across all 7 QA suites.
- Static compilation: **64 static routes compiled cleanly in 4.28s**.
- Responsive layout verification: **Zero horizontal overflow across all 9 viewports** (320px, 375px, 390px, 430px, 768px, 1024px, 1366px, 1440px, 1920px).
- Captured before/after screenshots and responsive audit logs.

---

### Added
- **Structured Service Data Models:**
  - `src/data/tourist-visa-data.ts`: Structured dataset with 27 supported destinations (10 direct consular, 16 Schengen, 1 UAE), 6 applicant categories with 4-part evidence requirements, UAE preparation panel, and EU Visa Code €30,000 insurance rules.
  - `src/data/work-visa-data.ts`: Structured dataset with 14 distinct countries (5 Gulf, 7 Europe, 2 Other), 12 occupational focus areas, 6 critical employment contract evaluation factors, and Emigration Act, 1983 statutory recruitment disclosures.
  - `src/data/country-registry.ts`: Canonical registry reconciling 51 destination countries across Study Abroad, Tourist Visa, and Work Visa services with licensing metadata and image provenance.
- **Dedicated Interactive Tourist Visa Landing Page (`src/pages/services/tourist-visa.astro`):**
  - Live destination search and grouping filters (Schengen, Direct Consular, UAE).
  - Interactive applicant category switcher (Employed, Self-Employed, Farmer, Student, Family-Sponsored, Invited by Resident).
  - Specialized guidance cards for UAE (Dubai & Abu Dhabi) and Schengen Article 15 medical insurance.
  - One-click context population that pre-selects destination and applicant category in the assessment form.
- **Dedicated Interactive Work Visa Landing Page (`src/pages/services/work-visa.astro`):**
  - High-visibility Statutory Regulatory Disclosure citing the Emigration Act, 1983 and Ministry of External Affairs rules (documentation only, zero job recruitment or placement fees).
  - Regional destination classification (Gulf, Europe, Other) with Dubai and Abu Dhabi unified under UAE.
  - 12 occupational focus areas designated as career areas, strictly avoiding live vacancy claims.
  - Protective 6-factor foreign employment contract evaluation guide.
  - One-click context population into the assessment form.
- **Form Context Enhancement (`src/components/forms/EnquiryForm.astro`):**
  - Integrated `allDropdownCountries` resolving against `countryRegistry` for 51 countries.
  - Enhanced URL and client-side prefilling for `category` and `occupation` with dynamic context banner display.
- **QA & Verification Battery:**
  - Created `tests/tourist-work-services.test.js` (30 automated tests).
  - Created `scripts/verify-country-registry.mjs` (canonical country image & data validation).
  - Created `scripts/capture-expanded-services-screenshots.mjs` capturing 10 desktop and mobile screenshots.

### Changed
- Calibrated meta descriptions for `/services/tourist-visa/` and `/services/work-visa/` to fit within 50–175 character SEO bounds.

### Compliance & Governance
- Zero unsupported visa success rates or guarantees published.
- Zero fake job vacancies or unverified salary promises.
- Mandatory €30,000 EU Visa Code insurance requirement cited (correcting poster's US$50k figure).
- Unified UAE entry handling Dubai and Abu Dhabi as emirates rather than separate nations.

### Verified
- Automated test suites: **246 / 246 tests passing (100%)** across all 7 QA suites.
- Static compilation: **64 static routes compiled cleanly in 5.12s**.
- Zero horizontal overflow across all 8 mobile, tablet, and desktop viewports.

---

### Added
- **Centralized Social Media Configuration (`src/data/site-config.ts`):**
  - Integrated official verified accounts:
    - **Instagram:** `https://www.instagram.com/visaconvention/` (Verified handle & entity: *Dipika Arora (Visa Consultant)@Hanumangarh*)
    - **YouTube:** `https://www.youtube.com/@VisaConvention` (Verified official channel matching telephone `+91 96803-95539` & email `visaconvention@yahoo.com`)
  - Added structured `publishedSocials` array providing single source of truth for UI rendering.
  - Registered candidate Facebook URL (`https://www.facebook.com/visaconvention/`) as `facebookCandidate` held in unverified status.
- **Accessible Social Icon Integrations:**
  - **Footer (`src/components/layout/Footer.astro`):** Added compact row of social media icons directly below the business description in Column 1.
  - **Contact Page (`src/pages/contact.astro`):** Added matching social icons under the "Follow Us" heading in the official channels card.
  - Form-factor compliant: 40×40px tap targets with 20×20px SVG icons, satisfying WCAG 2.2 AA target size criteria.
  - Full security and accessibility compliance: `target="_blank"`, `rel="noopener noreferrer"`, descriptive `aria-label`, visible keyboard focus rings, and high contrast.

### Changed
- **Schema.org Structured Data (`src/utils/seo.ts`):**
  - Updated `sameAs` array in `LocalBusiness` / `EducationalOrganization` JSON-LD schema to dynamically reference verified public channels (Instagram, YouTube, Google Maps) while excluding unverified candidate profiles.

### Security & Governance
- **Strict Verification Protocol Enforced:**
  - Facebook candidate URL was verified via live HTTP probe and search indexing. Because Facebook currently serves a generic login redirect without entity metadata for `visaconvention`, the link was **held unpublished** from all public UI and structured data per user instructions until client confirms page status.
- **Zero Follower Counts / Verification Badges:**
  - Strictly avoided fabricated social proof, follower numbers, or promotional badges.

### Verified
- **Automated Verification Script (`scripts/verify-social-integration.mjs`):**
  - Tested on headless Edge across desktop (1440px) and mobile (390px) viewports.
  - Zero horizontal overflow (0px).
  - Both footer and contact page links verified for correct URLs, `target="_blank"`, and `rel="noopener noreferrer"`.
  - Organization JSON-LD confirmed to include verified accounts only.
- **Test Suites:** **216 / 216 tests passing (100%)** across all 6 test engines.

---

### Added
- **Production Serverless Enquiry Endpoint (`api/enquiry.js`):**
  - Native Vercel and Node.js serverless function handling `POST /api/enquiry`.
  - Anti-spam honeypot detection (`form-bot-trap` and `website_url_check`).
  - Strict server-side validation for both student and B2B inquiry formats.
  - XSS sanitization on all text fields.
  - Verifiable Reference ID generator (`VC-LEAD-XXXXXX`).
  - Extensible webhook forwarding support (`process.env.NOTIFICATION_WEBHOOK`).
  - Writable file logging to `client-content/leads/enquiries.json` with cloud stdout fallback.

### Changed
- **Medical Education Terminology Precision:**
  - Removed inaccurate "WHO Recognized" terminology across `detailed-services.ts`, `services.ts`, and `site-config.ts` (World Health Organization co-sponsors the World Directory of Medical Schools / WDOMS, but does not recognize or accredit individual institutions).
  - Replaced with legally precise regulatory phrasing: `"WDOMS-Listed & NMC FMGL-Compliant Faculties"` and `"Medical faculties & NMC guidelines"`.
- **Directory Description Accuracy:**
  - Replaced blanket `"Search 1,000+ accredited institutions"` in navigation with honest, factual `"Search 1,000+ universities & colleges"`.
- **Form Input Hygiene:**
  - Replaced RFC 2606 placeholder `example.com` in `EnquiryForm.astro` with standard user-friendly placeholder.

### Verified
- Automated test suites: **216 / 216 tests passing (100%)** across all 6 QA suites.
- Static build: **64 static routes compiled cleanly in 4.03s**.
- Zero horizontal overflow across all 8 mobile/tablet/desktop viewports.
- All non-fabrication, statutory disclaimer, and data integrity checks confirmed green.

---

## [1.12.0] - 2026-11-11 — Hero Section Proportion & Space Optimization

### Changed
- **Optimized Hero Proportion & Image-to-Text Balance (`HeroSection.astro`):**
  - Replaced rigid 12-column layout with a precision grid (`1fr minmax(0, 505px)` on desktop, gap `clamp(2rem, 3vw, 3rem)`).
  - Increased image presence: image width expanded to **505px** (up from 460px, +10%) and height to **421px** (up from 381px, +10.5%).
  - Enforced exact **6:5 aspect ratio** (`aspect-ratio: 6 / 5`) with `object-fit: cover` and `object-position: center 30%` to keep graduates and caps prominent without distortion.
  - Reduced overall hero vertical height from 518px down to **476px** on 1366px desktop (measured in Edge browser, target: 460–485px).
  - Tightened top and bottom vertical breathing room from ~65px down to **27px above and 28px below** the image (target: 20–32px).
  - Calibrated desktop text column to **611px** with a **41px** gap between copy and image.
  - Simplified location eyebrow: replaced redundant "VISA CONVENTION · HANUMANGARH" badge with understated, elegant text (`HANUMANGARH, RAJASTHAN` in `text-xs font-semibold uppercase tracking-widest text-brand-subtle`).
- **Improved Service Discoverability:**
  - Services section (`#services`) top boundary moves up from ~595px to **553px** from viewport top.
  - **215px** of the service pathways section is now prominently visible above the 768px fold at 1366px viewport width.
- **Responsive Mobile Layout & Font Scaling:**
  - Added fluid headline scaling (`text-[1.95rem] min-[420px]:text-[2.2rem] sm:text-[2.9rem] lg:text-[3.4rem]`) to avoid awkward wrapping on small devices.
  - Constrained mobile image frame (`max-height: 260px` for viewports under 480px, `max-height: 300px` for tablets) while keeping the full image visible.
  - Zero horizontal overflow across all 9 tested viewports (320px–1920px).
- **Test Suite Date Resiliency (`tests/seo-a11y-audit.test.js`):**
  - Updated sitemap XML assertion for homepage to verify priority 1.00 and daily changefreq using a date-agnostic regex.

### Verified
- Build: **64 static pages, 4.84s** — 0 errors, 0 warnings.
- Tests: **216 / 216 passing (100%)** across all 6 suites (Country: 21/21, University: 40/40, Credibility: 34/34, Contact: 31/31, SEO/A11y: 51/51, E2E: 39/39).
- Responsive verification across 9 viewports: 320px, 375px, 390px, 430px, 768px, 1024px, 1366px, 1440px, 1920px (all zero overflow).

---

## [1.11.0] - 2026-11-10 — Centralized Country Image Registry, Real NYC Skyline for USA, Premium Hero Upgrade

### Added
- **Centralized Country Image Registry (data-driven):**
  - Added `cardImage`, `cardImageAlt`, and `imageObjectPosition` fields to the `Country` TypeScript type (`src/types/index.ts`).
  - Added `cardImage`, `cardImageAlt`, `imageObjectPosition` mapping in `normalizeCountry()` (`src/data/countries.ts`).
  - Populated `client-content/countries/countries.json` with canonical image metadata for all 6 photographed destinations via `scripts/add-card-images.mjs`.
  - One authoritative image source per country — same record used by cards, directory, related cards, and future components.
- **Real NYC Skyline for United States:**
  - Replaced the abstract multicolored USA placeholder (`usa.jpg`, 83KB) with an AI-generated photorealistic New York City skyline featuring One World Trade Center, daytime, wide-angle composition.
  - Optimized to 112KB via `sharp` (resize 1200×675, quality 82, mozjpeg).
  - Alt text: `"New York City skyline featuring One World Trade Center, United States"`.
  - `imageObjectPosition: 'center 50%'` for optimal card cropping.

### Changed
- **`CountryCard.astro` — Data-Driven Images:**
  - Removed all hardcoded `DESTINATIONS_WITH_PHOTOS` Set, `ALT_TEXTS` Map, `POLISHED_DESCRIPTIONS` Map, and static `imagePath` construction.
  - Now reads `country.cardImage`, `country.cardImageAlt`, and `country.imageObjectPosition` directly from the normalized data layer.
  - Cards with no `cardImage` fall back gracefully to the ISO code flag display (unchanged behavior for the 30+ countries without photos).
  - Descriptions now read from `country.shortDescription` from the JSON data — no component-level overrides.
- **`HeroSection.astro` — Premium Visual Upgrade:**
  - H1 font size: `text-[2.6rem] sm:text-[3.1rem] lg:text-[3.4rem]` — measured **54.4px at 1366px** (target: 52–62px ✅).
  - Hero content height: **511px at 1366px** (target: 450–520px ✅).
  - Section padding: `py-10 sm:py-14 lg:py-16` (up from `py-8 sm:py-10 lg:py-12`).
  - Description copy size: `text-lg sm:text-xl` (up from `text-base sm:text-lg`).
  - Buttons: `min-h-[52px] px-7 py-3.5` (up from `min-h-[48px] px-6 py-3`).
  - Image height: `h-[240px] sm:h-[300px] lg:h-[380px]` (up from `h-[220px] sm:h-[270px] lg:h-[300px]`).
  - Description copy updated to: `"Explore study destinations, discover universities, and get guidance for your international plans."`
  - Secondary CTA changed from `"Book Consultation"` → `"Contact Us"`.
- **`src/pages/index.astro`:** Updated HeroSection props to pass updated subheadline and CTA text.

### Verified
- Build: **64 static routes, 4.12s** — zero errors.
- Tests: **216/216 passing** (all 6 suites: country-engine 21/21, university-engine 40/40, credibility-engine 34/34, contact-engine 31/31, seo-a11y 51/51, e2e-comprehensive 39/39).
- Zero horizontal overflow across all tested viewports.
- Screenshots captured: homepage fold (1440px, 1366px, 390px mobile), countries directory, USA country detail page.

---

## [1.10.0] - 2026-11-10 — Ruthless Homepage Design & Proportion Audit & Global 1160px Alignment
### Changed
- **Unified 1160px Design System Container (`global.css`):**
  - Standardized `--site-width: 1160px` and `--container-width: 1160px` across the entire design system.
  - Eliminated the 32px horizontal offset between the hero and subsequent sections. At 1366px viewport width, all main content containers (`Header`, `Hero`, `Services`, `Destinations`, `About`, `Process`, `CTA`, `Footer`) start at an exact, measured **103px** from the left border.
  - Standardized mobile gutters to 20px on narrow viewports (320px–430px).
- **Header Proportional Refinement (`Header.astro`):**
  - Replaced manual `max-w-[1200px]` with `.site-container`.
  - Calibrated header height to a crisp 76px (`h-[76px]`).
  - Preserved compact logo (229px) and navigation alignment with zero text wrapping.
- **Hero Spatial Balance & Content Density (`HeroSection.astro`):**
  - Updated primary H1 headline to: `"Study Abroad, Visa & Travel Services"` (48px on desktop, line-height 1.08).
  - Maintained 58% copy / 42% educational visual split with authentic campus photography (`hero-education.jpg`), bringing content-led height to ~406px.
  - Primary button: `"Explore Services"` (`#services`), Secondary button: `"Book Consultation"` (`/contact/`).
  - Service section now enters the viewport earlier (starting at 489px from top instead of 526px+).
- **Service Cards Height Reduction (`src/pages/index.astro`):**
  - Removed bulky checklist bullet points and oversized icon wrappers from preview cards.
  - Reduced service card height from 436px down to ~260px (a 175px reduction in height).
  - Maintained 3 equal pathways (*Study Abroad*, *Visa Services*, *Flight Booking*) with 26px icon boxes, 20px headings, 14px 2-line descriptions, and aligned single action links.
- **Section Headings & Consultation CTA Tightening (`SectionHeading.astro`, `ConsultationCTA.astro`):**
  - Reduced section heading bottom margins (`mb-7 sm:mb-9`) and typography scale (`2rem` desktop).
  - Removed excessive `my-16` margin from `ConsultationCTA.astro`, reducing overall CTA section height to ~175px.
- **Automated Verification & Measurement:**
  - 100% pass rate across all 6 test suites (**216 / 216 tests passed**).
  - Zero horizontal overflow across all 8 tested viewports (320px–1920px).
  - Puppeteer measurement verification across 9 viewports (320px, 375px, 390px, 430px, 768px, 1024px, 1366px, 1440px, 1920px).
  - Saved full-page and fold screenshots to artifact directory.

---

## [1.9.0] - 2026-11-10 — Evidence-Based Homepage Optimization & Streamlined Layout Hierarchy
### Changed
- **Homepage Fold Optimization & Padding Reduction (`HeroSection.astro`):**
  - Reduced vertical section padding from `py-12 sm:py-16 lg:py-20` down to `py-8 sm:py-12 lg:py-14` (~120px height saved).
  - Scaled educational visual height to `h-[240px] sm:h-[290px] lg:h-[330px]` so the 3 service gateway cards emerge immediately near the desktop fold on standard 1366px and 1440px displays.
- **Strict 6-Section Sequence & Removal of Homepage Testimonial Drag (`src/pages/index.astro`):**
  - Section 1: Hero & Strategic Actions (`Request Consultation`, `Explore Services`)
  - Section 2: Three Main Service Pathways (`Study Abroad`, `Visa Services`, `Flight Booking`) with 1:1 equal-width cards
  - Section 3: Three Priority Study Destinations (`Canada`, `United Kingdom`, `Australia`) + Full-Width University Directory Shortcut (`Find Universities →`)
  - Section 4: About Visa Convention (Hanumangarh office center, counseling ethics, direct contact box)
  - Section 5: Three-Step Advisory Process (1. Profile Evaluation, 2. Documentation & Applications, 3. Visa Filing & Pre-Departure)
  - Section 6: Final Consultation Call-to-Action (`Ready to Plan Your Next Step?`)
  - Removed redundant anonymized testimonials section from the homepage to eliminate placeholder scrutiny and vertical drag; comprehensive candidate stories preserved on dedicated `/success-stories/` page.
- **Three Priority Study Destinations Cadence (`src/pages/index.astro`):**
  - Selected top 3 priority destinations by default (Canada, United Kingdom, Australia) to establish a clean 3-column visual cadence matching the 3 service pathways above.
  - Linked to full 39-country directory via prominent `"View All 35+ Countries →"` action and global university shortcut banner.
- **Verification & Testing:**
  - 100% pass rate across all 6 test suites (**216 / 216 tests passed**):
    - Country Engine: 21/21 passed
    - University Engine: 40/40 passed
    - Credibility & Ethics Engine: 34/34 passed
    - Contact & Lead Engine: 31/31 passed
    - SEO & Accessibility Engine: 51/51 passed
    - End-to-End Suite: 39/39 passed across 11 modules and 8 responsive viewports
  - Zero horizontal overflow across all tested viewports (320px–1920px).
  - Clean static build with 64 static routes compiled in 4.32s.

---

## [1.8.0] - 2026-11-10 — Destination Card Simplification & NYC Skyline Integration
### Changed
- **USA Destination Imagery Replacement (`public/assets/images/destinations/usa.jpg`):**
  - Replaced the abstract multicolored placeholder with an authentic photograph of the New York City skyline across the East River.
  - Sized and optimized for a 16:9 aspect ratio with `object-fit: cover` and explicit accessibility alt text: `"New York City skyline, United States"`.
- **Destination Card Streamlining & De-cluttering (`src/components/countries/CountryCard.astro`):**
  - Removed all repeated red `FEATURED` badge overlays.
  - Removed redundant country-code and continent badge pills (`IE EUROPE`, `GB EUROPE`, `US NORTH AMERICA`).
  - Removed prominent tuition estimate and primary intake boxes from the preview cards, keeping all verified detailed data on dedicated country pages.
  - Rewrote truncated descriptions into complete, short sentences without ellipses.
  - Streamlined card actions down to a single unambiguous primary action: `Explore [Country]` (e.g. `Explore United States`, `Explore Canada`, `Explore United Kingdom`) linking directly to the respective country guide.
  - Reduced overall card height to ~320–340px for a photography-led presentation.
- **University Directory Shortcut Banner (`src/pages/index.astro`):**
  - Added a dedicated full-width directory discovery shortcut directly beneath the 6 destination cards: *"Looking for a specific university? Search our comprehensive directory of 1,000+ accredited institutions..."* with a direct `"Find Universities →"` action.
- **Verification & Testing:**
  - 100% pass rate across all 6 test suites (**216 / 216 tests passed**).
  - Clean static build with 64 static routes compiled in 5.71s.
  - Captured targeted screenshots: `usa-skyline-card.png`, `destinations-streamlined-desktop.png`, `home-desktop-final.png`, `home-mobile-final.png`.

---

## [1.7.0] - 2026-11-10 — Premium Homepage Redesign & Multi-Viewport Optimization
### Changed
- **Header & Navigation Layout Optimization (`Header.astro`, `DesktopNavigation.astro`):**
  - Resolved desktop navigation label wrapping at 1366px and other standard viewports by applying `whitespace-nowrap shrink-0` across all menu labels, buttons, and links.
  - Refined the brand logo and subtitle into a responsive container (`min-w-0 truncate`) that prevents horizontal overflow down to 320px.
  - Standardized primary header call-to-action button to compact `"Request Consultation"`.
- **Editorial Two-Column Hero with Authentic Higher Education Photography (`HeroSection.astro`):**
  - Replaced plain text-only hero with a balanced editorial two-column layout (~58% text left, ~42% image right).
  - Headline: `"Your Plans Abroad Start Here."`, Eyebrow: `"VISA CONVENTION · HANUMANGARH"`, Description: `"Explore study destinations, find universities, and get assistance with visas and travel."`
  - Integrated authentic licensed educational campus photography (`public/assets/images/hero-education.jpg`) with full WCAG 2.2 AA alt text, crisp border, and subtle drop shadow.
- **Service Discovery Section (`src/pages/index.astro`):**
  - Created 3 equal-width primary service gateway cards (*Study Abroad*, *Visa Services*, *Flight Booking*) with dedicated icons, short descriptions, highlight checklists, and aligned primary buttons (`Explore Study Abroad`, `View Visa Services`, `Enquire About Flights`).
  - Added bottom link to full 7-vertical matrix (`/services/`).
- **Featured Study Destinations with Authentic Photography (`CountryCard.astro`, `src/pages/index.astro`):**
  - Integrated authentic destination imagery for the 6 featured countries (Canada, United Kingdom, Australia, USA, Germany, Ireland) in `public/assets/images/destinations/`.
  - Added explicit `"Explore Universities"` action linking to `/universities/?country=${country.slug}` alongside `"Country Guide"`.
  - Retained live directory search input for 1,000+ universities directly from the homepage.
- **Three-Step Client Process & Authentic Outcomes (`src/pages/index.astro`):**
  - Standardized 3-step advisory workflow (1. Profile Evaluation & Course Shortlisting, 2. Documentation & University Applications, 3. Visa Filing & Travel Preparation) with explicit sovereign consular discretion disclosures.
  - Displayed 2 privacy-anonymized candidate outcomes with transparent disclaimers.
- **Compact Accessible Floating WhatsApp Widget (`WhatsAppButton.astro`):**
  - Replaced bulky floating pill with an accessible, unobtrusive 48px circular control (`w-12 h-12 rounded-full`) with full `aria-label` and `title` tooltip, ensuring zero obstruction of page content or buttons.
- **Quality Assurance & Verification:**
  - 100% pass rate across all automated test suites (**216 / 216 tests passed**).
  - Zero horizontal overflow across all 8 tested viewports (320px–1920px).
  - Captured full before-and-after screenshots across viewports in Edge Chromium.

---

## [1.6.0] - 2026-11-10 — Sitewide Top Utility Bar Removal & Clean Header Transition
### Removed
- **Dark Navy Top Utility Bar (`src/components/layout/Header.astro`):**
  - Completely removed the dark navy horizontal information bar from every page across the entire website.
  - Removed all components of the utility bar: Hanumangarh location badge, service categories list, business hours, and duplicate "Contact Office / Book Consultation" links.
  - Eliminated the bar at the component template level (rather than hiding with CSS), preventing unnecessary DOM nodes and paint overhead.
- **Hero Eyebrow Label (`src/components/home/HeroSection.astro`):**
  - Removed promotional eyebrow label and pill badge (`Based in Hanumangarh, Rajasthan • Transparent International Advisory`) from the homepage hero.
  - Re-verified that the oversized "Verified Office" card on the right remains completely removed.

### Changed
- **Sticky Header Alignment & Spacing:**
  - Main white navigation header (`<header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-border">`) is now the immediate first visible element at the top of every page sitewide.
  - Maintained exact 80px (`h-20`) navigation bar height housing the brand logo motif, Study Abroad mega-menu dropdown, Visa Services dropdown, Flight Booking link, About dropdown, Contact link, red Book Consultation CTA button, and responsive mobile hamburger trigger.
  - Adjusted homepage hero top padding (`pt-10 sm:pt-14`) so content begins directly underneath the clean white header with zero leftover whitespace, gaps, or layout shift.
- **Anchor-Link Scrolling & Offsets (`src/styles/global.css`):**
  - Configured `scroll-padding-top: 5rem;` on `html` so that deep anchor links (such as `#services`, `#enquiry`, `#process`, etc.) cleanly offset to leave the 80px sticky header unobstructed.

### Verified & Retained
- **Integrity of Core Information:**
  - Full official contact details, physical office street address, telephone number, email, and business operating hours (Mon – Sat: 9:30 AM – 6:30 PM IST) remain completely intact on the `/contact/` and `/about/` pages and in the footer.
- **Responsive Navigation:**
  - Desktop, tablet (1024px/768px), and mobile (320px–430px) screen layouts verified with zero horizontal overflow (`scrollWidth <= viewportWidth`).
- **Automated Verification:**
  - All 6 automated test suites passed (223/223 tests passing).
  - Clean static build: 64 static HTML pages compiled in 5.2s.

---

## [1.5.0] - 2026-11-10 — Website Cleanup & Streamlined Redesign
### Changed
- **Hero Section Streamlining (`HeroSection.astro`):**
  - Completely removed the right-side "Verified Office" card and all certification badges.
  - Eliminated decorative dotted background grids, replacing them with a crisp, modern, text-led layout.
  - Simplified copy to clean, grounded messaging: Eyebrow: `VISA CONVENTION · HANUMANGARH`; Headline: `Study Abroad, Visa & Travel Services`; Description: `Explore universities abroad, learn about our visa services, and speak directly with our team about your plans.`; Primary CTA: `Contact Us`; Secondary CTA: `Explore Services`.
  - Integrated the 3 immediate pathways (*Study Abroad*, *Visa Services*, *Flight Booking*) directly beneath the hero copy.
- **Homepage Structure Shortening (`src/pages/index.astro`):**
  - Shortened homepage to exactly 7 useful, focused sections:
    1. Hero & 3 Pathways
    2. Find Your Service (6 core verticals: Study Visa, MBBS Abroad, PhD Programs, Tourist Visa, Work Visa, Flight Reservation)
    3. Study Destinations & Universities (6 destination shortcuts + directory search bar)
    4. About Visa Convention (office intro, counselor scope, contact details)
    5. How We Help You (3 plain-language steps: Initial Consultation, Profile & Document Assessment, Application & Visa Guidance)
    6. Client Experiences (2 authentic anonymized outcomes with legal disclaimers)
    7. Final Contact Call to Action
  - Removed duplicate 4-box "Why Choose Us" / "Evidence-Based Trust Signals" section.
  - Removed lengthy FAQ accordion from the homepage.
- **Sitewide Badge & Unsupported Claim Removal:**
  - Removed "Verified Office", "Transparent International Advisory", and "Zero false promises" badges and claims.
  - Eliminated marketing badges and unsubstantiated claims sitewide, relying on clean typography, verifiable office address, and transparent counseling scope.
- **Compact 3-Column Footer Redesign (`Footer.astro`):**
  - Replaced sprawling 850px footer with a disciplined 3-column layout (height ~360px):
    - Col 1: Business Identity & Description
    - Col 2: Quick Links (Services, Study Destinations, Corporate, Legal)
    - Col 3: Hanumangarh Office & Direct Contact Details (Phone, Email, Full Street Address)
    - Bottom Row: Copyright, Privacy Policy, Terms of Service, and concise statutory consular disclaimer.
- **Header Refinement (`Header.astro`):**
  - Cleaned top utility bar to `"Hanumangarh, Rajasthan • Study Visa · MBBS · PhD · Tourist · Work · Flights"`.
  - Subtitle updated to `"Study Abroad, Visa & Travel Services"`.
- **Quality Assurance & Verification:**
  - 100% pass rate across all 6 automated test suites (**223 / 223 tests passed**):
    - `country-engine.test.js` (21/21)
    - `university-engine.test.js` (40/40)
    - `credibility-engine.test.js` (41/41)
    - `contact-engine.test.js` (31/31)
    - `seo-a11y-audit.test.js` (51/51)
    - `e2e-comprehensive-audit.test.js` (39/39)
  - Full static build: 64 routes compiled cleanly in 4.82s.
  - Visual verification screenshots captured: `cleanup-home-desktop.png`, `cleanup-home-mobile.png`, `cleanup-footer-desktop.png`, `cleanup-contact-desktop.png`.

---

## [1.4.0] - 2026-11-10 — Unified Layout, Typography & Alignment System
### Changed
- **Unified Design Tokens & Container Dimensions (`src/styles/global.css`):**
  - Standardized sitewide maximum content width to `1200px` (`.site-container` / `max-w-[1200px]`) across all 64 pages.
  - Standardized reading-content width to `720px` (`.reading-container` / `max-w-[760px]`) for readability across legal pages, FAQs, and long-form service descriptions.
  - Implemented responsive fluid type scale: H1 `clamp(2rem, 4.5vw, 3.5rem)`, H2 `clamp(1.5rem, 3vw, 2.25rem)`, H3 `clamp(1.125rem, 2vw, 1.375rem)`, body `1rem` with `line-height: 1.65`.
  - Added shared layout utility classes: `.page-hero`, `.card-grid`, `.info-card`, `.info-card__action`, `.section-space`, `.section-space-sm`.
- **Hero Alignment & Desktop Proportions:**
  - Standardized `HeroSection.astro` into a disciplined two-column grid (`~60%` content, `~40%` trust card).
  - Left-aligned headline, subheadline description, and CTA buttons sharing a single left edge.
  - Integrated high-trust authentic Hanumangarh advisory showcase card on the right.
- **Section Heading Predictable Alignment (`SectionHeading.astro`):**
  - Supported `align="left"` for informational blocks (Study Abroad, Universities, Requirements, Legal pages) and `align="center"` for short section introductions.
  - Added `text-balance` and constrained description width (`max-w-[62ch]`).
- **Equal-Height Cards & Bottom Action Pinning:**
  - Updated `ServiceCard.astro`, `CountryCard.astro`, and `UniversityCard.astro` with `h-full min-w-0` and bottom action rows pinned via `mt-auto`.
  - Buttons and link bars now align consistently across grid rows regardless of title or description length differences.
- **Layout Alignment Refinements Across All Page Templates:**
  - `BaseLayout.astro`, `ServiceLayout.astro`: Standardized container widths to `1200px` with 65/35 reading container and sticky form sidebar.
  - `src/pages/index.astro`: Aligned 8 sections with consistent `1200px` container, equal-height card grids, and left-aligned section headers.
  - `src/pages/contact.astro`: Two-column grid with office details and assessment form starting at the exact same vertical alignment.
  - `src/pages/universities/index.astro` & `[university].astro`: Top-left aligned heading, search field immediately below heading, left-aligned metadata, and bottom-aligned card actions.
  - `src/pages/study-abroad/index.astro` & `[country].astro`: Standardized `1200px` containers, left-aligned two-column hero, fast facts grid, and equal-height destination cards.
  - `privacy-policy.astro` & `terms.astro`: Restrained reading width `max-w-[760px]` with professional left-aligned document typography.
- **Automated Verification:**
  - 100% pass rate across all 6 test suites (**223 / 223 tests passed**).
  - Clean static build: 64 static routes compiled in 4.38s.

---

## [1.3.0] - 2026-11-10 — Comprehensive UX, IA & Conversion Optimization Redesign
### Changed
- **Global Navigation Hierarchy (5 Intent-Driven Categories):**
  - Consolidated header navigation from 8 cluttered links down to 5 distinct categories: *Study Abroad*, *Visa Services*, *Flight Booking*, *About*, and *Contact*.
  - Redesigned `DesktopNavigation.astro` with rich dual-column mega-menus for Study Abroad and Visa Services.
  - Redesigned `MobileNavigation.astro` into clean, expandable sections with direct Call/WhatsApp action buttons.
- **Homepage First Screen & Cognitive Load Reduction:**
  - Redesigned `HeroSection.astro` with concise, plain-language proposition: *"Study Abroad, Visa & Travel Assistance — Made Clear."*
  - Added immediate **3-Pathway Selector** (*Study Abroad*, *Visa Services*, *Flight Booking*) directly within the hero for instant 5-second self-segmentation.
  - Streamlined homepage from 14 sections down to 8 high-converting, focused sections.
- **University Discovery Usability (1,000+ Records):**
  - Added dynamic active filter chips (`#active-filters-chips`) with 1-click removal and "Clear All" functionality.
  - Added automatic URL search parameter reading (`?country=...`, `?q=...`, `?level=...`) and seamless `history.replaceState` updates.
  - Enabled direct enquiry actions on all cards pre-filling target university and destination country.
- **Country Page to University Linkage:**
  - Connected country page university CTAs directly to `/universities/?country=[slug]`, automatically filtering the 1,000+ catalog to that destination.
- **Zero-Friction Context-Aware Enquiries:**
  - Added visual **Enquiry Context Confirmation Banner** in `EnquiryForm.astro` that greets visitors with pre-filled details when navigating from university or country profiles.

---

## [1.2.0] - 2026-11-10 — Official Physical Office Address Integration
### Changed
- **Physical Headquarters & Office Address Updated Sitewide:**
  - Updated verified physical office address to: `"Shop No.115, Durga Market, Street No.04, behind Bus Stand, Durga Colony, Junction, Hanumangarh, Rajasthan 335512"`.
  - Updated `src/data/site-config.ts` (`officeAddress`, `googleMapsUrl`, and `socialLinks.googleMaps`).
  - Updated `src/data/about.ts` (`physicalOffice.address`).
  - Streamlined `src/layouts/ServiceLayout.astro` address renderer.
  - Updated Schema.org `LocalBusiness` / `PostalAddress` JSON-LD generation in `src/utils/seo.ts`.
  - Updated test assertions in `tests/contact-engine.test.js` and `tests/credibility-engine.test.js`.
  - Synchronized `README.md`, `MAINTENANCE.md`, `CONTENT_STATUS.md`, and `FINAL_TEST_REPORT.md`.

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
