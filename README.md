# Visa Convention — Official Website

> Enterprise-grade digital web portal and international education discovery platform for **Visa Convention**, an overseas education, visa advisory, and travel services consultancy based in Hanumangarh, Rajasthan, India.

---

## 1. Project Title and Overview

- **Project:** Visa Convention Official Web Portal
- **Client Organization:** Visa Convention Overseas Consultants
- **Headquarters:** Shop No.115, Durga Market, Street No.04, behind Bus Stand, Durga Colony, Junction, Hanumangarh, Rajasthan 335512
- **Primary Channels:** Telephone: `+91 96803-95539` | WhatsApp: `+91 96803-95539` | Email: `visaconvention064@gmail.com`
- **Canonical Production Domain:** `https://visaconvention.com`

### Commercial Purpose
The website serves as the primary corporate presence and digital counseling portal for Visa Convention. It is engineered to establish institutional trust, eliminate low-budget visa agency tropes, facilitate multi-criteria higher education discovery across 35+ destination countries, and capture verified student and business enquiries with complete regulatory compliance.

### Business Service Spectrum
1. **Study Visa:** Academic counseling, admission processing, GIC/financial guidance, and embassy visa filing for premier destinations.
2. **MBBS Abroad:** Direct admission assistance for accredited government medical universities in Uzbekistan, Kazakhstan, Russia, Kyrgyzstan, and Europe complying with NMC FMGL regulations and WDOMS recognition.
3. **PhD Abroad:** Doctoral research proposal structuring, principal investigator supervisor alignment, and funded Graduate Research/Teaching Assistantships (GRA/GTA).
4. **Tourist Visa:** Document preparation, day-wise itineraries, cover letters, and appointment scheduling for Schengen, UK, USA, Canada, and Australia.
5. **Work Visa Facilitation:** Employer sponsorship document verification, permit filing, and compliance checks (strictly non-job-brokerage).
6. **Air Ticket / Flight Reservation Assistance:** Genuine carrier GDS reservation coordination and student baggage allowances without fictitious PNR creation.
7. **Additional Services:** Statement of Purpose (SOP) refinement, apostille coordination via MEA India, overseas health insurance guidance, and pre-departure briefings.

---

## 2. Project Status

The codebase is organized into a disciplined 12-stage engineering lifecycle. The current repository status is **Production Ready (Verified Locally, Awaiting Client Production Deployment Approval)**.

| Category | Status | Details |
| :--- | :---: | :--- |
| **Compiled Static Routes** | `Verified` | 64 static HTML routes compiled in `/dist` with zero broken links. |
| **Country Engine** | `Verified` | 36 published dynamic country portals + 3 quarantined draft destinations. |
| **University Directory** | `Verified` | 1,022 total records (1,004 published institutions, 10 detailed profiles, 18 quarantined non-educational drafts). |
| **Contact & Lead Capture** | `Verified` | Client/server validation, anti-spam honeypot, disk delivery, and WhatsApp context links. |
| **Quality Gate & Testing** | `Verified` | 6 automated test suites passing **217 / 217 assertions (100% pass rate)**. |
| **Client Content Integration** | `Verified` | Actual client workbooks, MBBS lists, and PhD programs ingested into structured data. |
| **DNS Cutover to Live Domain** | `Pending Approval` | Codebase built locally; awaiting explicit client registrar authorization before DNS deployment. |
| **Official Office Address** | `Verified` | Shop No.115, Durga Market, Street No.04, behind Bus Stand, Durga Colony, Junction, Hanumangarh, Rajasthan 335512. |
| **Live Production CRM Webhook** | `Optional` | Server delivery writes to local storage; live Zapier/Make webhook ready upon client provision. |

---

## 3. Key Features

The implementation includes the following verified features:

- **Scalable Dynamic Country Engine:** A single intelligent route template (`src/pages/study-abroad/[country].astro`) dynamically generates 36 comprehensive destination portals directly from validated JSON data without manual code duplication.
- **Central University Discovery System (`/universities/`):** Instant client-side search with 300ms debouncing, multi-criteria filtering (by Destination Country, Study Level, and Subject Domain), a curated detailed-profile toggle, and 24-card progressive pagination.
- **Threshold Rule & Thin-Content Protection:** Standalone detail pages (`/universities/[slug]/`) are strictly restricted to 10 curated flagship institutions containing verified rich academic data. The remaining 994 institutions render accessible directory cards with direct admission inquiry CTAs, preventing search engine penalties for low-value thin pages.
- **Interactive Multi-Service Form with Dynamic B2B Mode (`src/components/forms/EnquiryForm.astro`):** Dynamically toggles between student counseling fields and corporate B2B partnership fields (Organization Name, Contact Person, Business Email, Scope of Collaboration). Features client-side validation, accessible live-region error announcements, invisible anti-spam honeypot checks, and duplicate submission prevention.
- **Direct Context-Prefilled WhatsApp Integration:** Dynamic links to `wa.me/919680395539` pre-filled with the exact country, university, or service context. Accompanied by a non-intrusive floating WhatsApp widget with full keyboard accessibility.
- **Corporate Credibility Suite:** Dedicated pages for About Us (`/about/`), Verified Outcomes & Case Studies (`/success-stories/`), and Institutional B2B Partnerships (`/partnerships/`), adhering to strict student privacy protection (no unredacted passport scans or bank records) and zero fabricated partner claims.
- **Comprehensive Technical SEO & Structured Data:** Automatic Schema.org JSON-LD generation combining `LocalBusiness`, `ProfessionalService`, and `EducationalOrganization` on the homepage, dynamic `BreadcrumbList` on all subpages, and `FAQPage` rich snippets.
- **Zero Horizontal Overflow:** Rigorously tested across 8 responsive viewports (320px, 375px, 390px, 430px, 768px, 1024px, 1440px, and 1920px). Features a dedicated mobile slide-out drawer on viewports under 1280px (`xl`).

---

## 4. Technology Stack

| Layer | Technology | Specification / Package | Purpose |
| :--- | :--- | :--- | :--- |
| **Static Site Generator** | **Astro 5** | `astro@^5.4.2` | Zero-JS default, static HTML compilation, file-based routing. |
| **CSS Framework** | **Tailwind CSS v4** | `tailwindcss@^4.0.9`, `@tailwindcss/vite` | Modern CSS-first design tokens, zero runtime styling overhead. |
| **Type Safety** | **TypeScript 5** | `typescript@^5.7.3`, `@astrojs/check` | Strict compiler settings, comprehensive data models and schemas. |
| **Data Layer** | **Flat JSON & CSV** | Typed static files in `client-content/` | Decoupled data storage requiring zero SQL database management or hosting fees. |
| **Testing & Browser QA** | **Puppeteer Core** | `puppeteer-core@^25.16.0` | Headless Edge Chromium browser automation for multi-viewport, accessibility, and form testing. |
| **Edge Security Headers** | **Cloudflare / Netlify** | `public/_headers` | Automated HSTS, X-Frame-Options, nosniff, and Permissions-Policy. |
| **Icons & Media** | **Clean SVGs & WebP** | Custom inline vectors + high-res WebP | Zero external font-icon network dependencies; optimized responsive image delivery. |

---

## 5. Architecture & Design Principles

```mermaid
flowchart TD
    DataLayer["Data Layer\n(client-content/countries.json, universities.json, site-config.ts)"]
    BuildEngine["Astro 5 Build Engine (SSG)"]
    StaticOutput["Static Output (/dist)\n64 Pre-Rendered HTML Pages + Assets"]
    EdgeCDN["Global Edge CDN\n(Cloudflare Pages / Netlify Edge)"]
    Visitor["Global Visitor & Mobile Devices"]

    DataLayer --> BuildEngine
    BuildEngine --> StaticOutput
    StaticOutput --> EdgeCDN
    EdgeCDN --> Visitor
```

1. **Static-First & Zero-Database Default:** Eliminates server-side databases, SQL injection attack vectors, and connection latency. All pages are pre-compiled into static HTML.
2. **Data-Driven Decoupling:** Content and code are strictly decoupled. Modifying an entry in `client-content/countries/countries.json` or `universities.csv` automatically updates the site without component rewrites.
3. **Threshold Rule:** Prevents thin-content SEO penalties. Curated institutions receive standalone routes; baseline records are rendered as interactive directory cards.
4. **WCAG 2.2 AA Accessibility:** Strict semantic HTML5 landmarks, 4.5:1 minimum text contrast ratios (Navy on White: 14.2:1, Signature Red on White: 5.67:1), visible focus rings, and skip-to-content keyboard bypass links.
5. **Non-Fabrication Governance:** Zero false claims, no guaranteed visa assurances, and clear disclaimers that visa issuance is the sole prerogative of host-nation embassies.

---

## 6. Installation and Setup

### Prerequisites
- **Node.js:** Version `20.18.0` (LTS) or `22.x`
- **Package Manager:** `npm` (Version `10.x` or higher)
- **Browser Automation:** Microsoft Edge or Google Chrome (required for running E2E Puppeteer test suites)

### Step 1: Clone Repository
```bash
git clone https://github.com/your-org/visa-convention-wesbite.git
cd visa-convention-wesbite
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Local Development Server
```bash
npm run dev
```
The local development environment will start at `http://localhost:4321`.

### Step 4: Compile Production Build
```bash
npm run build
```
Generates 64 optimized static routes in the `dist/` directory.

### Step 5: Preview Compiled Production Output
```bash
npm run preview
```
Serves the compiled production static bundle locally at `http://localhost:4321`.

---

## 7. Environment Configuration

Copy the example environment configuration file:
```bash
cp .env.example .env
```

| Variable Name | Required | Default / Example | Purpose |
| :--- | :---: | :--- | :--- |
| **`PUBLIC_SITE_URL`** | No | `https://visaconvention.com` | Base URL used for canonical link tags, Open Graph meta tags, and XML sitemap URLs. |
| **`NODE_VERSION`** | No | `20.18.0` | Enforces the Node.js runtime version on cloud build platforms. |
| **`LEAD_WEBHOOK_URL`** | No | `""` (Empty string) | Optional URL for an external CRM, Zapier, or Make webhook. When defined, form submissions are forwarded via HTTP POST. |

> [!NOTE]
> No private API keys or database connection strings are required to build or run the website.

---

## 8. Project Structure

```text
visa-convention-wesbite/
├── client-content/                # Client-provided data files, raw spreadsheets, and lead logs
│   ├── countries/                 # Master country database (countries.json) and JSON schema
│   ├── universities/              # Central institutional database (universities.json and .csv)
│   ├── raw-inputs/                # Raw client text files and spreadsheet exports
│   ├── leads/                     # Persistent local storage for form inquiries (enquiries.json)
│   └── brand-assets/              # Directory scaffolds for client photography and logos
├── public/                        # Static assets served directly at root
│   ├── assets/brand/              # Open Graph social cards (1200x630) and logos
│   ├── _headers                   # Cloudflare Pages / Netlify edge security headers
│   ├── favicon.svg                # Vector brand favicon
│   └── robots.txt                 # Search engine crawl policy and sitemap reference
├── scripts/                       # Maintenance, dataset ingestion, and preview automation scripts
│   ├── analyze-and-integrate.py   # Client content parser, duplicate detector, and validator
│   ├── execute-integration.py     # Database synchronization and studyLevel tagging script
│   └── refine-data-and-services.py# Deduplication and draft quarantine automation
├── src/                           # Application source code
│   ├── components/                # Modular Astro UI components
│   │   ├── common/                # Shared UI (Breadcrumbs, FAQAccordion, Pagination, WhatsAppButton)
│   │   ├── countries/             # Country directory cards
│   │   ├── forms/                 # Multi-service EnquiryForm and B2B PartnershipEnquiryForm
│   │   ├── home/                  # Homepage hero and trust sections
│   │   ├── layout/                # Header, Footer, DesktopNavigation, MobileNavigation
│   │   ├── services/              # ServiceCard and process widgets
│   │   └── universities/          # UniversityCard, UniversitySearch, UniversityFilters
│   ├── data/                      # TypeScript data models and accessor functions
│   │   ├── site-config.ts         # Single source of truth for business NAP, hours, and navigation
│   │   ├── detailed-services.ts   # Comprehensive specs and FAQs for all 7 service verticals
│   │   ├── countries.ts           # Accessors for countries.json with fallback normalizers
│   │   ├── universities.ts        # Accessors for universities.json and detailed profile models
│   │   ├── about.ts               # About Us corporate story and counseling practice roles
│   │   ├── success-stories.ts     # Verified outcome case studies
│   │   └── partnerships.ts        # B2B institutional collaboration tracks
│   ├── layouts/                   # BaseLayout and ServiceLayout wrappers
│   ├── pages/                     # File-based static routes
│   │   ├── services/              # 7 dedicated service routes + central overview hub
│   │   ├── study-abroad/          # Searchable directory + dynamic [country].astro template
│   │   ├── universities/          # Searchable directory + dynamic [university].astro template
│   │   ├── about.astro            # Corporate credibility and founder introduction
│   │   ├── contact.astro          # Central contact page with map, NAP, and enquiry form
│   │   ├── index.astro            # 14-section high-converting corporate homepage
│   │   ├── partnerships.astro     # B2B collaboration framework and partnership form
│   │   ├── privacy-policy.astro   # Statutory privacy policy under India's DPDP Act 2023
│   │   ├── sitemap.xml.ts         # Dynamic standards-compliant XML sitemap generator
│   │   ├── success-stories.astro  # Student case studies and outcomes
│   │   └── terms.astro            # Corporate terms of service and liability limitations
│   ├── styles/                    # Global stylesheet (global.css) and design tokens
│   ├── types/                     # TypeScript interface definitions (Country, University, etc.)
│   └── utils/                     # Helper modules for analytics, SEO schema, and WhatsApp links
├── tests/                         # Automated QA test suites (217 verified assertions)
│   ├── country-engine.test.js     # Country schema, fixtures, and dynamic routing tests
│   ├── university-engine.test.js  # University dataset scale, threshold rule, and filtering tests
│   ├── credibility-engine.test.js # Trust, anti-guarantee compliance, and credibility tests
│   ├── contact-engine.test.js     # Form validation, honeypot, and lead delivery tests
│   ├── seo-a11y-audit.test.js     # SEO metadata, XML sitemap, and WCAG AA contrast tests
│   └── e2e-comprehensive-audit.test.js # Master E2E multi-viewport browser audit (Puppeteer)
├── astro.config.mjs               # Astro site configuration with Tailwind v4 Vite plugin
├── package.json                   # Project metadata and dependencies
└── tsconfig.json                  # Strict TypeScript configuration with path aliases
```

---

## 9. Pages and Routes

### Implemented Production Routes (64 Static HTML Pages)

| Route Path | Type | Description |
| :--- | :---: | :--- |
| `/` | Static | Corporate homepage featuring hero, trust metrics, 6 service cards, featured destinations, and FAQs. |
| `/services/` | Static | Central Service Hub featuring service comparative matrix and process overview. |
| `/services/study-visa/` | Static | Study Visa assistance specifications, intake planning, and documentation guidance. |
| `/services/mbbs/` | Static | MBBS Abroad guidance, 5 key benefits, and 34 medical institutions across 12 countries. |
| `/services/phd/` | Static | PhD research proposals, faculty supervisor matching, and funded assistantships. |
| `/services/tourist-visa/` | Static | Visitor visas, family invitations, and travel itinerary compilation. |
| `/services/work-visa/` | Static | Employer sponsorship documentation support (strictly non-job-brokerage). |
| `/services/flight-booking/` | Static | Flight reservation assistance, genuine GDS itineraries, and student baggage discounts. |
| `/services/additional-services/`| Static | SOP refinement, document apostille, and pre-departure briefings. |
| `/study-abroad/` | Static | Searchable destination directory with continent filters and result counter. |
| `/study-abroad/[country]/` | Dynamic (36) | Dynamic portals for 36 destinations (e.g. Canada, UK, Australia, USA, Germany, Ireland, etc.). |
| `/universities/` | Static | Central searchable university directory with live filtering across 1,004 active institutions. |
| `/universities/[university]/` | Dynamic (10) | Rich profile pages for 10 curated institutions (e.g. Toronto, UBC, Manchester, TUM, TSMU). |
| `/about/` | Static | Corporate story, leadership statement, physical office credentials, and counseling practice. |
| `/success-stories/` | Static | Verified outcome case studies with strict student privacy protection. |
| `/partnerships/` | Static | Institutional B2B collaboration framework and partnership inquiry form. |
| `/contact/` | Static | Office NAP banner, Google Maps directions, multi-channel inquiry form, and WhatsApp links. |
| `/privacy-policy/` | Static | Data protection disclosures under India's DPDP Act 2023. |
| `/terms/` | Static | Terms of service and governmental visa authority disclaimers. |
| `/sitemap.xml` | XML | Dynamic XML sitemap indexing all 63 active public pages. |

---

## 10. Country and University Management

### Country Data Model (`client-content/countries/countries.json`)
Destination countries adhere to the typed `Country` schema (`src/types/index.ts`):
- Master fields: `id`, `name`, `slug`, `flagCode`, `continent`, `heroImage`, `shortDescription`, `introduction`, `whyStudyHere`, `educationSystem`, `studyLevels`, `admissionGuidance`, `visaGuidance`, `costInformation`, `scholarshipInformation`, `servicesAvailable`, `faqs`, `relatedUniversityIds`, `featured`, `active`, `publicationStatus`, `sourceLinks`, `lastReviewed`.
- **Draft Isolation:** Countries with incomplete visa or fee guidelines (e.g., `Moldova`, `Lithuania`, `Azerbaijan`) are cataloged as `publicationStatus: "draft"`. Astro's `getPublishedCountries()` automatically excludes them from generating thin standalone pages while allowing their institutions to remain searchable in the central database.

### University Data Model (`client-content/universities/universities.json` & `.csv`)
Institutions adhere to the typed `University` schema:
- Fields: `id`, `name`, `slug`, `countryId`, `countrySlug`, `countryName`, `city`, `officialWebsite`, `institutionType`, `studyLevels`, `subjectAreas`, `courses`, `admissionInformation`, `tuitionInformation`, `scholarshipInformation`, `featured`, `relationshipStatus`, `logoAsset`, `coverImage`, `sourceLinks`, `lastReviewed`, `publicationStatus`, `hasDetailedProfile`.
- **Relationship Status Governance:** In compliance with Section 3 of `AGENTS.md`, institutions are categorized as `relationshipStatus: "listed_for_guidance"`. Never label an institution as `verified_partner` without an executed formal agreement.

---

## 11. Content Updates Guide

### Updating Business Information (NAP, Hours, Contacts)
- **File:** `src/data/site-config.ts`
- Edit `phone`, `whatsappNumber`, `email`, `officeAddress`, or `businessHours`.
- Saving this file automatically updates the Header, Footer, Contact page, WhatsApp buttons, and Schema.org JSON-LD structured data.

### Adding or Updating a Destination Country
1. Open `client-content/countries/countries.json`.
2. Add or edit the country object adhering to `countries-schema.json`.
3. Set `publicationStatus: "published"` once verified, or `"draft"` if awaiting official embassy copy.
4. Run verification: `node tests/country-engine.test.js && npm run build`.

### Adding or Updating Universities
1. Open `client-content/universities/universities.json` and sync `universities.csv`.
2. To promote an institution from a directory card to a full profile page, set `hasDetailedProfile: true` and add the enriched curriculum structure to `DETAILED_PROFILES` in `src/data/universities.ts`.
3. Run verification: `node tests/university-engine.test.js && npm run build`.

*For detailed, step-by-step instructions, see [`MAINTENANCE.md`](./MAINTENANCE.md).*

---

## 12. Testing and Quality Assurance

The project includes 6 automated test suites executing **217 automated assertions**:

```bash
# Typecheck TypeScript source files
npm run check

# Verify Country Dynamic Engine (21 assertions)
node tests/country-engine.test.js

# Verify University Database, Threshold Rule & Search (34 assertions)
node tests/university-engine.test.js

# Verify Credibility Pages & Anti-Guarantee Scans (41 assertions)
node tests/credibility-engine.test.js

# Verify Form Validation, Honeypot & Lead Delivery (31 assertions)
node tests/contact-engine.test.js

# Verify Technical SEO, Sitemaps & WCAG AA Contrast (51 assertions)
node tests/seo-a11y-audit.test.js

# Execute Master Independent End-to-End Browser Audit (39 assertions)
node tests/e2e-comprehensive-audit.test.js
```

### Cumulative Test Results

| Test Suite | Assertions | Result | Focus Area |
| :--- | :---: | :---: | :--- |
| `country-engine.test.js` | 21 / 21 | **PASS** | 39 countries, schema integrity, 35 mock fixtures, directory filters. |
| `university-engine.test.js` | 34 / 34 | **PASS** | 1,022 records, CSV/JSON sync, threshold rule, filter latency (< 1ms). |
| `credibility-engine.test.js` | 41 / 41 | **PASS** | About Us, Success Stories, B2B forms, zero-guarantee text compliance. |
| `contact-engine.test.js` | 31 / 31 | **PASS** | Client/server validation, honeypot blocking, disk lead recording. |
| `seo-a11y-audit.test.js` | 51 / 51 | **PASS** | 63 meta tags, XML sitemap, Schema.org JSON-LD, WCAG AA contrast. |
| `e2e-comprehensive-audit.test.js` | 39 / 39 | **PASS** | 8 viewports, overflow detection, keyboard navigation, XSS protection. |
| **Cumulative Total** | **217 / 217** | **PASS** | **100% Quality Gate Verification** |

*For complete test execution logs and defect resolution history, see [`FINAL_TEST_REPORT.md`](./FINAL_TEST_REPORT.md).*

---

## 13. Technical SEO, Accessibility, Performance & Security

### Technical SEO Measures Implemented
- **Unique Metadata:** 63 unique page titles and meta descriptions tailored to specific destinations and services.
- **Canonical URLs:** Query-stripped canonical tags on all pages preventing duplicate content indexing.
- **XML Sitemap:** Dynamic sitemap generator (`src/pages/sitemap.xml.ts`) registering 63 active URLs with priority staging and daily/weekly change frequencies.
- **Robots Policy (`public/robots.txt`):** Allows public crawlers while disallowing private `/api/` and showcase `/design-system/` paths.
- **Social Cards:** 1200x630 Open Graph images (`public/assets/brand/og-image.jpg`) configured for Facebook, LinkedIn, and Twitter Cards.

### Accessibility (WCAG 2.2 AA)
- High text contrast ratios meeting or exceeding the 4.5:1 requirement (Brand Navy on White: 14.2:1; Signature Red on White: 5.67:1).
- Touch target heights exceeding 44px on all interactive inputs and buttons.
- Visible keyboard focus rings and skip-to-content bypass links.
- Semantic HTML5 landmark structure (`header`, `nav`, `main`, `section`, `footer`).

### Performance & Core Web Vitals
- Zero-framework client JavaScript default (< 7 KB uncompressed client JS sitewide).
- Static pre-rendering ensuring sub-50ms Time to First Byte (TTFB) on Edge CDN.
- Zero Cumulative Layout Shift (CLS = 0.00) with explicit image sizing and pre-rendered layouts.

### Security Hardening
- **Input Sanitization:** Anti-spam honeypot input (`website_url_check`) on all inquiry forms.
- **Zero Exposed Secrets:** Zero hardcoded API keys, private passwords, or third-party tokens committed to Git.
- **HTTP Security Headers (`public/_headers`):**
  ```text
  /*
    X-Frame-Options: SAMEORIGIN
    X-Content-Type-Options: nosniff
    Referrer-Policy: strict-origin-when-cross-origin
    Permissions-Policy: geolocation=(), camera=(), microphone=()
    Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  ```

---

## 14. Production Deployment

### Recommended Host: Cloudflare Pages
1. Connect the GitHub repository to [Cloudflare Dashboard](https://dash.cloudflare.com/) under the client's account.
2. Configure build settings:
   - **Framework Preset:** `Astro`
   - **Build Command:** `npm run build`
   - **Build Output Directory:** `dist`
   - **Node.js Version:** `20.18.0`
3. Bind custom domain (`visaconvention.com` and `www.visaconvention.com`).
4. Enable Full (Strict) SSL/TLS encryption.

### Client Account Ownership Guarantee
Visa Convention management maintains 100% direct ownership of the domain registrar, Cloudflare hosting account, and business email. There is zero proprietary agency lock-in.

*For complete DNS mapping and instant rollback instructions, consult [`DEPLOYMENT.md`](./DEPLOYMENT.md).*

---

## 15. Project Roadmap

### Implemented & Ready for Launch
- [x] Complete 14-section high-converting corporate homepage.
- [x] 7 dedicated service landing pages + central Service Overview Hub.
- [x] Dynamic Country Engine supporting 36 published destination portals.
- [x] Central University Discovery System indexing 1,015+ institutions.
- [x] Multi-service inquiry engine with WhatsApp click-to-chat integration.
- [x] Schema.org structured data, XML sitemap, and robots.txt.
- [x] 18-point Production Readiness Checklist verified with 217 passing automated checks.

### Pending Client Input
- [x] Official physical office address confirmed and verified (Shop No.115, Durga Market, Street No.04, behind Bus Stand, Durga Colony, Junction, Hanumangarh, Rajasthan 335512).
- [ ] Provide authentic counselor team photographs for the About Us gallery.
- [ ] Provide client-approved video testimonials for embed in Success Stories.
- [ ] Provide full visa/tuition guidelines if standalone country pages are desired for draft destinations (Moldova, Lithuania, Azerbaijan).
- [ ] Provide external CRM webhook URL (Zapier/Make/Zoho) for live lead alerts.

---

## 16. Ownership and License

**Proprietary Commercial Software**  
Copyright &copy; 2026 Visa Convention Overseas Consultants. All rights reserved.

This codebase, associated visual assets, data records, and brand trademarks are the sole and exclusive property of **Visa Convention**. This software is not licensed for public distribution, open-source reuse, sub-licensing, or external commercial exploitation without prior written consent from Visa Convention management.

---

## 17. Credits and Acknowledgements

- **Client Organization:** Visa Convention Overseas Consultants (Hanumangarh, Rajasthan, India)
- **Engineering & Architecture:** Antigravity AI Engineering & Design Team
- **Design Directives:** Adheres strictly to the master governance directives documented in [`AGENTS.md`](./AGENTS.md).
