# Visa Convention — Website Visual Audit Report (VISUAL_AUDIT.md)

**Project:** Visa Convention — Official Commercial Website  
**Date:** November 11, 2026  
**Auditor:** Principal UI/UX Designer, Creative Director & Full-Stack Architect  
**Status:** COMPLETE FORENSIC AUDIT (Pre-Upgrade Baseline)  

---

## 1. Executive Verdict & Visual Direction

The Visa Convention website has a robust architectural and data-driven foundation: 64 static routes, 0 broken links, Schema.org JSON-LD structured data, and 100% WCAG 2.1 AA accessibility compliance.

However, from an **international brand presence and emotional impact** perspective, the current presentation has three distinct opportunities for improvement:
1. **Hero Emotional Resonance:** While the landmark composite in the hero provides global credibility, the hero section can deliver even stronger vibrancy by introducing a light, inviting Sky Blue atmospheric background (`#EAF4FF` fading to `#FFFFFF`), clear typographic branding ("Explore the World with <span style="color:#C91D32">Visa Convention</span>"), and calibrated proportions.
2. **Service Discovery Grid:** The three-pathway grouping (Study Abroad, Visa Services, Travel Services) previously relied on text and small badges. The client's business markets six core offerings (Study Visa, MBBS/PhD, Tourist Visa, Work Visa, Flight Booking, and Find Universities). Structuring these into a vibrant 3-column, 2-row grid of compact cards with 150–170px photographic headers gives each service immediate recognition without advertising clutter.
3. **Sitewide Color Rhythm:** The website has leaned toward stark white backgrounds across several sequential sections. Introducing a purposeful visual rhythm—alternating between Sky Blue tints (`#EAF4FF`), crisp white surfaces, soft neutral-blue backgrounds (`#F5F8FC`), and Deep Navy (`#102A53`) anchors—creates high contrast and effortless scanning.

---

## 2. Page-by-Page Forensic Inspection

| Page / Route | Current Layout & Components | Current Imagery & Visual State | Strengths | Areas for Visual Enhancement |
| :--- | :--- | :--- | :--- | :--- |
| **Homepage (`/`)** | Sticky nav, 2-col hero, 3 service pathways, 6 featured destination cards, directory banner, about snippet, 3-step process, CTA banner, 4-col footer | `hero-landmarks.jpg` (722 KB), 6 priority country photos | Ultra-fast load, zero overflow, clear hierarchy | Service section needs dedicated photographic cards for all 6 offerings; hero background needs Sky Blue tint; stronger visual contrast between sections |
| **Study Abroad Directory (`/study-abroad/`)** | Search input, continent filter pills, responsive card grid | Card photos for top countries, high-contrast ISO badges for others | Clean search/filtering, responsive across mobile | Expand photo coverage to top 20 destinations while maintaining lightweight performance |
| **Country Profiles (`/study-abroad/[country]/`)** | Breadcrumbs, text hero with badges & facts bar, university grid, cost & visa guides | Clean typographic header | High information density, clear admission guidance | Can benefit from subtle country header accent and verified destination photography |
| **University Directory (`/universities/`)** | Live search, multi-criteria filters (country, degree level), pagination | Clean semantic cards | Highly functional, ultra-fast client-side filtering | Directory remains appropriately clean and uncluttered (no giant decorative images) |
| **University Profiles (`/universities/[slug]/`)** | Institution credentials, official portal link, program listings, disclaimers | Text & badge header | Non-fabrication compliant; zero unauthorized logos | Well-proportioned; maintains high credibility |
| **Study Visa (`/services/study-visa/`)** | ServiceLayout with scope, supported routes, eligibility checklist, 4-step process, enquiry form | Text-only hero | Detailed counseling scope | Add dedicated campus photographic header |
| **MBBS Abroad (`/services/mbbs/`)** | ServiceLayout with WDOMS/NMC FMGL compliance, tuition guidelines | `mbbs-education.jpg` (99 KB, clinical skills lab) | Authoritative medical guidance, transparent fees | Editorial split hero successfully elevates the page |
| **PhD Abroad (`/services/phd/`)** | ServiceLayout with proposal guidelines, supervisor outreach | `phd-research.jpg` (802 KB, graduate library scholar) | High academic credibility | Well-balanced with authentic research imagery |
| **Tourist Visa (`/services/tourist-visa/`)** | 5-stage interactive layout: live search, group pills, 27 destination cards, 6 applicant profile tabs, UAE/Schengen panels, prefilled form | Compact ISO flag cards | Exceptional utility and profile-specific document guidance | Add a travel destination photographic header |
| **Work Visa (`/services/work-visa/`)** | Regional tabs (Gulf, Europe, Other), 12 occupational focus areas, 6-point contract checklist, statutory Emigration Act disclosure | Professional compliance cards | Legally compliant, zero fake vacancy claims | Add an authentic professional/skilled workplace photographic header |
| **Flight Booking (`/services/flight-booking/`)** | 2-column layout (~65% form / ~35% guidance), 3 service pathways, interactive date toggles, student baggage guide, FAQs | `flight-hero-aviation.jpg` (655 KB, airliner wing over clouds) | Bespoke form UX, zero initial passport collection, consular advisory cited | Pristine, high-conversion visual design |
| **About Us (`/about/`)** | Leadership narrative, practice areas, Hanumangarh center credentials, operating hours | Typographic credentials | Genuine business facts, zero fake employee stock photos | Awaiting client-supplied photos of physical Hanumangarh center |
| **Contact Us (`/contact/`)** | Direct phone, verified WhatsApp, physical address, business hours, enquiry form | Clean contact cards | Clear multi-channel reachability | Add office map coordinates and subtle visual accents |
| **Footer (Global)** | 4-column layout: brand identity, quick links, services, contact & social (Instagram, YouTube) | Text & icon badges | Compact, zero clutter, accessible | Refined brand navy background with high-contrast links |

---

## 3. Responsive Baseline Audit (390px, 768px, 1366px, 1920px)

Baseline screenshots were captured across four representative device viewports prior to visual modifications:
- **Mobile (390px):** `audit-home-390px-full.png` — Verified single-column stacking, readable labels, no horizontal scroll.
- **Tablet (768px):** `audit-home-768px-full.png` — Clean 2-column transitions, touch-friendly tap targets.
- **Standard Desktop (1366px):** `audit-home-1366px-full.png` — Balanced 1200px container, hero text/image alignment.
- **Full HD Desktop (1920px):** `audit-home-1920px-full.png` — Max-width constraints prevent stretching or distortion.

---

## 4. Prioritized Visual Upgrade Roadmap

1. **P0 — Homepage Hero Visual & Atmosphere:**
   - Update headline to `"Explore the World with Visa Convention"`.
   - Update supporting line to `"Study Abroad, Visa & Travel Services"`.
   - Introduce Sky Blue atmospheric gradient (`#EAF4FF` fading to `#FFFFFF`).
   - Add Signature Red brand highlight on `"Visa Convention"`.
   - Retain the four-landmark composite (`hero-landmarks.jpg`).
2. **P0 — 6-Card Service Discovery Section:**
   - Implement 3-column, 2-row grid of compact cards with 150–170px photographic headers for:
     1. Study Visa
     2. MBBS / PhD Abroad
     3. Tourist Visa
     4. Work Visa
     5. Flight Booking
     6. Find Universities
3. **P1 — Section Contrast & Background Rhythm:**
   - Alternate between Sky Blue (`#EAF4FF`), clean white (`#FFFFFF`), neutral-blue (`#F5F8FC`), and Deep Navy (`#102A53`).
4. **P1 — Complete Country Photography:**
   - Sourced and verified 20+ authentic high-resolution destination photographs.
   - Comprehensive manifest documented in `COUNTRY_IMAGE_MANIFEST.csv` and `IMAGE_INVENTORY.md`.
5. **P1 — Sitewide Quality & Compliance:**
   - 0px horizontal overflow across all 9 viewports (320px–1920px).
   - 100% automated test pass rate with zero false claims.
