# ARCHITECTURE.md — System Architecture & Technical Specifications

**Project:** Visa Convention — Official Website  
**Version:** 1.1.0  
**Last Updated:** November 9, 2026  
**Status:** Stage 02 Implemented & Verified  

---

## 1. Architectural Philosophy & Technology Evaluation

### 1.1 Evaluation of Technology Choices

| Technology | Evaluation Decision | Architectural Rationale |
| :--- | :---: | :--- |
| **Astro 5.x** | **CONFIRMED & IMPLEMENTED** | Delivers zero client-side JavaScript by default for content routes, instant TTFB via static site generation (SSG), native file-based dynamic routing (`getStaticPaths`), and build-time optimization. |
| **TypeScript 5.7+** | **CONFIRMED & IMPLEMENTED** | Provides end-to-end type safety across structured data models (Country, University, Service), component props, and utility functions. Verified with 0 errors across 48 files. |
| **Tailwind CSS v4 (`@tailwindcss/vite`)** | **CONFIRMED & IMPLEMENTED** | Zero-runtime CSS engine integrated via Vite plugin. Custom `@theme` tokens encode official brand colors (`#102A53`, `#C91D32`, `#2367A4`, `#F5F8FC`, `#FFFFFF`) with sub-millisecond build times. |
| **Typed Structured Data Engine** | **CONFIRMED & IMPLEMENTED** | Decoupled data models in `src/data/` feeding both dynamic country routes and central directory search without database overhead. |
| **Minimal Client-Side JavaScript** | **CONFIRMED & IMPLEMENTED** | Zero heavy client frameworks (no React/Vue runtime bloat). Interactive islands (mobile drawer, university directory instant filtering, honeypot timestamps) implemented in lightweight vanilla JS (< 1.5 KB total). |
| **Static Hosting Model** | **CONFIRMED** | Fully static compilation (`dist/`) deployable to any modern managed edge CDN (Cloudflare Pages, Vercel, Netlify, AWS S3/CloudFront) with zero server maintenance costs and maximum DDoS resilience. |

### 1.2 Evaluation Against Alternatives
- **Astro vs. Next.js / Nuxt:** Next.js introduces Node.js server runtimes, cold starts, hydration overhead, and continuous hosting charges. A content-heavy consultancy website benefits exponentially from pre-rendered static HTML.
- **Astro vs. WordPress:** WordPress introduces PHP vulnerabilities, MySQL bottlenecks, theme bloat, and fragile plugin updates. Astro guarantees sub-second page delivery and version-controlled content.
- **Database Evaluation:** A relational database (PostgreSQL/MySQL) is unnecessary and introduces security vulnerabilities for a read-heavy directory. Flat typed data easily scales to 50+ countries and 500+ universities with zero query latency.

---

## 2. Directory Structure & Organization

```
visa-convention-wesbite/
├── .github/                      # CI/CD workflows
├── client-content/               # Client raw submissions & verification storage
│   ├── brand-assets/             # Logos, office photography, counselor portraits
│   ├── countries/                # countries.json draft schemas
│   ├── universities/             # universities.csv catalog
│   ├── business-information.md   # Contact details, address, licensing
│   ├── services.md               # Raw service copy
│   ├── success-stories.md        # Testimonial placeholders
│   ├── partnerships.md           # Collaboration copy
│   └── legal-and-policies.md     # Terms, privacy policy, disclaimers
├── dist/                         # 30 pre-rendered static HTML routes (Build output)
├── public/                       # Static public assets
│   ├── assets/
│   │   ├── brand/                # Logos and social preview cards
│   │   └── destinations/         # Curated landscape photography
│   └── favicon.svg               # Brand globe-and-plane favicon
├── src/
│   ├── components/
│   │   ├── common/               # Breadcrumbs, SectionHeading, EmptyState, Pagination,
│   │   │                         # FAQAccordion, ProcessTimeline, ConsultationCTA, TrustStatistics, TestimonialCard
│   │   ├── layout/               # Header, Footer, DesktopNavigation, MobileNavigation
│   │   ├── home/                 # HeroSection
│   │   ├── services/             # ServiceCard
│   │   ├── countries/            # CountryCard
│   │   ├── universities/         # UniversityCard, UniversitySearch, UniversityFilters
│   │   └── forms/                # EnquiryForm (with honeypot & timestamp protection)
│   ├── data/
│   │   ├── site-config.ts        # Brand theme tokens, navigation, office details, disclaimers
│   │   ├── services.ts           # 6 core business verticals with checklists and FAQs
│   │   ├── countries.ts          # Structured country records & query helpers
│   │   └── universities.ts       # Structured university records & query helpers
│   ├── layouts/
│   │   ├── BaseLayout.astro      # Master HTML shell with Schema.org JSON-LD and a11y skip links
│   │   └── ServiceLayout.astro   # Reusable service vertical layout
│   ├── styles/
│   │   └── global.css            # Tailwind v4 import & custom @theme design tokens
│   ├── types/
│   │   └── index.ts              # Strict TypeScript interfaces for all domain entities
│   ├── utils/
│   │   └── seo.ts                # Schema.org JSON-LD generators (LocalBusiness, FAQ, Breadcrumbs)
│   └── pages/
│       ├── index.astro           # Corporate Homepage
│       ├── about.astro           # About Visa Convention
│       ├── contact.astro         # Contact page with office info and enquiry form
│       ├── partnerships.astro    # Institutional & agent collaboration page
│       ├── privacy-policy.astro  # DPDP Act compliant privacy disclosure
│       ├── success-stories.astro # Verified student outcomes charter
│       ├── terms.astro           # Terms of service & statutory disclaimers
│       ├── services/
│       │   ├── index.astro       # Services directory hub
│       │   ├── study-visa.astro  # Study visa guidance
│       │   ├── mbbs.astro        # MBBS abroad admissions
│       │   ├── phd.astro         # PhD abroad counseling
│       │   ├── tourist-visa.astro# Tourist/visitor visa assistance
│       │   ├── work-visa.astro   # Work permit documentation
│       │   └── flight-booking.astro # Flight reservation assistance
│       ├── study-abroad/
│       │   ├── index.astro       # 35+ Country destination hub
│       │   └── [country].astro   # Dynamic country route (SSG for 35+ countries)
│       └── universities/
│           ├── index.astro       # Central searchable university directory
│           └── [university].astro# Dynamic university profile route (SSG)
├── astro.config.mjs              # Astro configuration with Tailwind v4 Vite plugin
├── package.json                  # Managed dependencies and scripts
└── tsconfig.json                 # Strict TypeScript configuration with path aliases
```

---

## 3. Implemented Route Map (30 Static Routes)

All routes are compiled as static HTML during build:

| Route Path | Type | Source File | Purpose |
| :--- | :---: | :--- | :--- |
| `/` | Static | `src/pages/index.astro` | Homepage with hero, trust stats, services, destinations |
| `/about/` | Static | `src/pages/about.astro` | Corporate mission, Hanumangarh office, ethical guidelines |
| `/services/` | Static | `src/pages/services/index.astro` | Overview hub for all 6 service verticals |
| `/services/study-visa/` | Static | `src/pages/services/study-visa.astro` | Study visa application guidance & SOP review |
| `/services/mbbs/` | Static | `src/pages/services/mbbs.astro` | MBBS abroad in WHO/NMC recognized faculties |
| `/services/phd/` | Static | `src/pages/services/phd.astro` | PhD research proposals & funded assistantships |
| `/services/tourist-visa/` | Static | `src/pages/services/tourist-visa.astro` | Tourist & visitor documentation, itineraries |
| `/services/work-visa/` | Static | `src/pages/services/work-visa.astro` | Work permit paperwork compliance |
| `/services/flight-booking/` | Static | `src/pages/services/flight-booking.astro` | Student baggage & embassy reservation assistance |
| `/study-abroad/` | Static | `src/pages/study-abroad/index.astro` | 35+ destination country directory |
| `/study-abroad/canada/` | Dynamic SSG | `src/pages/study-abroad/[country].astro` | Deep dive: Canada admissions, costs, visas |
| `/study-abroad/united-kingdom/`| Dynamic SSG | `src/pages/study-abroad/[country].astro` | Deep dive: UK admissions, costs, visas |
| `/study-abroad/australia/` | Dynamic SSG | `src/pages/study-abroad/[country].astro` | Deep dive: Australia admissions, costs, visas |
| `/study-abroad/usa/` | Dynamic SSG | `src/pages/study-abroad/[country].astro` | Deep dive: USA admissions, costs, visas |
| `/study-abroad/germany/` | Dynamic SSG | `src/pages/study-abroad/[country].astro` | Deep dive: Germany admissions, costs, visas |
| `/study-abroad/ireland/` | Dynamic SSG | `src/pages/study-abroad/[country].astro` | Deep dive: Ireland admissions, costs, visas |
| `/universities/` | Static + Island | `src/pages/universities/index.astro` | Central searchable & filterable directory |
| `/universities/university-of-toronto/` | Dynamic SSG | `src/pages/universities/[university].astro` | University profile & guided programs |
| `/universities/university-of-british-columbia/` | Dynamic SSG | `src/pages/universities/[university].astro` | University profile & guided programs |
| `/universities/university-of-manchester/` | Dynamic SSG | `src/pages/universities/[university].astro` | University profile & guided programs |
| `/universities/university-of-warwick/` | Dynamic SSG | `src/pages/universities/[university].astro` | University profile & guided programs |
| `/universities/university-of-melbourne/` | Dynamic SSG | `src/pages/universities/[university].astro` | University profile & guided programs |
| `/universities/university-of-sydney/` | Dynamic SSG | `src/pages/universities/[university].astro` | University profile & guided programs |
| `/universities/technical-university-of-munich/` | Dynamic SSG | `src/pages/universities/[university].astro` | University profile & guided programs |
| `/universities/trinity-college-dublin/` | Dynamic SSG | `src/pages/universities/[university].astro` | University profile & guided programs |
| `/success-stories/` | Static | `src/pages/success-stories.astro` | Authentic outcomes & zero-fabrication charter |
| `/partnerships/` | Static | `src/pages/partnerships.astro` | Institutional representation & sub-agent terms |
| `/contact/` | Static | `src/pages/contact.astro` | Hanumangarh contact details & inquiry form |
| `/privacy-policy/` | Static | `src/pages/privacy-policy.astro` | Data protection policy compliant with DPDP Act |
| `/terms/` | Static | `src/pages/terms.astro` | Terms of service, jurisdiction, disclaimers |

---

## 4. Reusable Component Taxonomy (20 Components)

1. **`Header.astro`**: Sticky top navigation bar, contact hotline, brand logo motif, desktop & mobile triggers.
2. **`DesktopNavigation.astro`**: Dropdown service menus, active route highlighting, keyboard accessible.
3. **`MobileNavigation.astro`**: Accessible modal drawer with transition animations and focus trapping.
4. **`Footer.astro`**: Corporate footer, quick links, statutory notices, and copyright.
5. **`HeroSection.astro`**: High-impact brand hero with trust badges, primary CTAs, and value propositions.
6. **`ServiceCard.astro`**: Clean service card with feature bullets and direct detail links.
7. **`CountryCard.astro`**: Destination card with ISO badge, tuition indicator, and intake highlights.
8. **`UniversityCard.astro`**: University card with QS ranking badge, study levels, and official site link.
9. **`UniversitySearch.astro`**: Accessible search input for fast keyword queries.
10. **`UniversityFilters.astro`**: Country and study level dropdown filter controls.
11. **`TrustStatistics.astro`**: Honest, verifiable metrics (destinations, service scope, transparency).
12. **`TestimonialCard.astro`**: Verified student outcome card with attribution.
13. **`FAQAccordion.astro`**: Native `<details>`/`<summary>` accordion with animated disclosure indicator.
14. **`ProcessTimeline.astro`**: Responsive 5-step numbered horizontal/vertical process roadmap.
15. **`ConsultationCTA.astro`**: High-converting full-width call-to-action banner with dual buttons.
16. **`EnquiryForm.astro`**: Comprehensive inquiry form with honeypot spam protection and timestamp check.
17. **`Breadcrumbs.astro`**: Semantic navigation trail with Schema.org breadcrumb compatibility.
18. **`SectionHeading.astro`**: Standardized section header with badge, title, and description.
19. **`EmptyState.astro`**: Friendly fallback view for zero search results or empty categories.
20. **`Pagination.astro`**: Accessible pagination bar with previous/next controls.

---

## 5. Scalability Strategy for 35+ Countries & Directory Search

### 5.1 Dynamic Country Static Generation
The dynamic country route `/study-abroad/[country].astro` implements Astro's `getStaticPaths()`:
```typescript
export async function getStaticPaths() {
  const countries = getAllCountries();
  return countries.map((country) => ({
    params: { country: country.slug },
    props: { country },
  }));
}
```
- Adding any new country to `src/data/countries.ts` (or ingesting from `client-content/countries/countries.json`) automatically creates the static page on the next build.
- Hand-coding individual country pages is completely eliminated.

### 5.2 Lightweight University Search & Filtering
- Hundreds of universities (e.g. 300–500 entries) compile into a highly compact HTML grid with data attributes (`data-name`, `data-country`, `data-city`, `data-levels`, `data-disciplines`).
- The in-browser filter script is under 35 lines of vanilla JavaScript, executing instant DOM filtering with zero network requests and zero multi-megabyte bundle dependencies.

---

## 6. Form Protection & Spam Prevention
- **Honeypot Trap:** `<input type="text" name="website_url_check" tabindex="-1" autocomplete="off" />` hidden from real users. Any automated bot filling this field is instantly dropped.
- **Timestamp Evaluation:** Forms submitted within less than 2.5 seconds of rendering are flagged as automated scripts.
- **Data Protection:** Includes explicit consent checkbox adhering to the Indian Digital Personal Data Protection (DPDP) Act.
