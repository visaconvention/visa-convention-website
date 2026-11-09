# AGENTS.md — Master Project Rules & Governance

**Project:** Visa Convention — Official Website  
**Client:** Visa Convention (Hanumangarh, Rajasthan, India & Global)  
**Status:** ACTIVE GOVERNANCE  
**Authority:** Permanent repository root instruction file for Antigravity and all AI development sessions.

---

## 1. Project Overview & Primary Mission

Visa Convention is a legitimate visa, international education, and travel services consultancy based in Hanumangarh, Rajasthan, India, serving both local Indian students/travellers and international clients.

- **Primary Objective:** Build a visually outstanding, professional, trustworthy, fast, secure, responsive, and easily maintainable business website.
- **Design Bar:** Must project the authority and polish of an established national/international consultancy (comparable to premier global education advisories), entirely distinct from generic local visa-agent templates.
- **Business Service Spectrum:**
  1. Study Visa
  2. MBBS / PhD Abroad
  3. Tourist Visa
  4. Work Visa
  5. Air Ticket / Flight Reservation Assistance
  6. Additional Services (exact details pending client verification)
- **Study Abroad Scope:** Scalable support for 25–35+ destination countries and country-specific university listings without code duplication or hardcoded pages.

---

## 2. Engineering & Design Roles

Antigravity operates with the combined expertise of:
- **Principal Software Architect:** Designing clean, scalable, decoupled systems and strict data models.
- **Senior Full-Stack Engineer:** Writing robust, type-safe, maintainable code with zero unnecessary dependencies.
- **UI/UX Design Director:** Enforcing high-end corporate aesthetics, whitespace, typography, and cohesive component systems.
- **Frontend Specialist:** Crafting ultra-fast, static-first, lightweight interactive interfaces.
- **Technical SEO Engineer:** Building semantic HTML5, Schema.org JSON-LD structured data, metadata, and crawl-friendly routing.
- **Accessibility Expert:** Ensuring strict WCAG 2.1 AA compliance, accessible color contrast, keyboard navigation, and ARIA patterns.
- **Security Engineer:** Hardening forms against spam/injection, preventing PII leaks, enforcing CSP, and zero credential exposure.
- **Senior QA Lead:** Enforcing test-driven verification, rigorous validation of links/routes/data schemas, and factual reporting.

---

## 3. Strict Content Rules (Non-Negotiable)

Compliance with these rules is mandatory across all code, content, and commits:

1. **Zero Falsification:**
   - Never invent visa success statistics (e.g., "99.8% approval rate").
   - Never invent university affiliations, partnerships, or representations.
   - Never generate fake testimonials, fake client names, or fabricated reviews.
   - Never invent employees, academic degrees, professional credentials, or awards.
2. **No Guaranteed Visa Claims:**
   - Never state or imply that visa issuance is guaranteed. Visa decisions are the sole prerogative of respective government embassies/consulates.
3. **University Relationship Integrity:**
   - Never imply or state that listed universities are "partner universities" or "direct affiliations" unless formally verified with signed contracts. Use accurate labels such as *"Universities Guided / Eligible for Application"*.
4. **No Fabricated Travel Documents:**
   - Never create, display, or generate fake airline tickets, fake boarding passes, or fraudulent PNR numbers.
5. **Draft Isolation:**
   - All unverified or placeholder content must remain in clearly demarcated draft storage (`client-content/` or tagged `publicationStatus: "draft"`).
   - Unverified content must never appear as a genuine claim on the public website.
6. **Regulatory & Fee Factual Accuracy:**
   - Do not publish specific visa requirements, embassy fee amounts, or processing timelines as static facts without verified official sources and disclaimer timestamps.
7. **Client-Supplied Data Protocol:**
   - Treat all client-provided spreadsheets and notes as unverified drafts until reviewed, cross-checked, and approved.

---

## 4. Brand Identity & Visual Guidelines

- **Brand Essence:** Professional, established, modern, transparent, and globally oriented.
- **Logo Motif:** Globe and airplane motif with blue, red, and white.
- **Mandated Color Palette:**
  - **Deep Navy:** `#102A53` (Dominant brand color, headings, primary structure)
  - **Signature Red:** `#C91D32` (Accents, primary call-to-actions, badges)
  - **Professional Blue:** `#2367A4` (Secondary accents, links, active states)
  - **Clean Background:** `#F5F8FC` (Off-white section alternates, subtle surfaces)
  - **Pure White:** `#FFFFFF` (Card surfaces, primary background)
- **Visual Anti-Patterns (STRICTLY PROHIBITED):**
  - No low-budget visa agent visuals (garish gradients, clip-art airplanes, cluttered banners).
  - No low-resolution, generic stock photos with awkward watermarks.
  - No overwhelming animations or flashing promotional badges.
- **Visual Design Directives:**
  - High typographic hierarchy using modern, clean sans-serif typefaces (e.g., Plus Jakarta Sans / Inter).
  - Generous whitespace, refined card borders, subtle box shadows (`0 1px 3px rgba(16,42,83,0.06)`).
  - Authentic, tasteful imagery representing international higher education and global destinations.

---

## 5. Development & Architectural Principles

1. **Architecture Before Code:** Formulate plans, schemas, and routes before writing components.
2. **Data-Driven Scalability:** The system must support 35+ destination countries and hundreds of universities without manual template duplication or route-by-route hardcoding.
3. **Static-First & Zero-JS Default:** Utilize static site generation (Astro recommended) for blazing speed, instant TTFB, and optimal SEO. Client-side JS is restricted to lightweight interactive islands (search/filtering, navigation toggles, form submission).
4. **Zero Unnecessary Databases:** Avoid costly, complex server databases when flat typed data (JSON, Markdown, CSV, Content Collections) satisfies all requirements.
5. **Security & Privacy:**
   - Zero hardcoded API keys, webhook URLs, or credentials.
   - Robust form validation with honeypot spam protection, rate limiting, and sanitization.
6. **Accessibility First (WCAG 2.1 AA):**
   - Minimum 4.5:1 text contrast ratio on all interactive and body elements.
   - Visible keyboard focus rings.
   - Semantic HTML5 landmark structure (`header`, `nav`, `main`, `section`, `footer`).
7. **No Deployment Without Explicit User Approval:** Build, verify, and report locally. Never push to production without explicit confirmation.

---

## 6. Project Management & Scope Categorization

Every requirement and task item must be categorized under one of four unambiguous states:

| Category | Definition |
| :--- | :--- |
| **`CONFIRMED`** | Formally agreed, explicitly documented, and verified. |
| **`PROPOSED`** | Architectural, UX, or technical recommendation pending user review. |
| **`AWAITING CLIENT CONTENT`** | Blocked on specific client copy, images, credentials, or lists. |
| **`OUT OF SCOPE`** | Explicitly excluded to protect project timeline and security. |

*Rule:* Never silently convert a `PROPOSED` item into contractual `CONFIRMED` scope without user sign-off.

---

## 7. Major Stage Execution Protocol

For each stage in the 12-stage roadmap:
1. **Inspect:** Examine existing files and workspace state before touching code.
2. **Preserve:** Protect existing working code and data. Never make destructive blind edits.
3. **Explain:** Present proposed architecture, file changes, and rationale clearly.
4. **Implement:** Write high-quality, type-safe, reusable code.
5. **Verify & Test:** Run automated checks, type checks, schema validation, and accessibility tests.
6. **Report:** Provide transparent, fact-based reports. Never claim success without tangible evidence.
7. **Maintain Tracking Files:** Keep `PROJECT_PLAN.md`, `REQUIREMENTS.md`, `ARCHITECTURE.md`, `CONTENT_STATUS.md`, `TEST_REPORT.md`, and `CHANGELOG.md` fully up to date.
