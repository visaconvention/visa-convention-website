# Visa Convention — Comprehensive Website Image Inventory & Audit (IMAGE_AUDIT.md)

**Project:** Visa Convention — Official Commercial Website  
**Date:** November 11, 2026  
**Auditor:** Principal Full-Stack Architect & UI/UX Design Director  
**Governance:** AGENTS.md Section 3 (Strict Content Rules) & Phase 6/7/8 Visual Mandate  

---

## 1. Executive Summary & Photography Policy

Visa Convention maintains a strict, zero-fabrication visual policy:
1. **Authenticity Over Clutter:** Every image on the website must serve a clear purpose—identifying a destination, illustrating an actual service, or grounding the real business. No images are placed merely to fill whitespace.
2. **Strict Editorial Aesthetics:** Only natural lighting, authentic architectural/landscape photography, and restrained color grading are permitted. Prohibited anti-patterns:
   - No cartoon airplanes or clip-art globes
   - No fake airline boarding passes, simulated tickets, or fabricated PNRs
   - No generic corporate stock smiles passed off as Visa Convention employees
   - No copyrighted university logos used without explicit authorization
3. **Single Source of Truth:** Destination country photographs are governed by [`src/data/country-registry.ts`](file:///c:/Users/ACER/Desktop/Visa%20MASTER/visa-convention-wesbite/src/data/country-registry.ts). The same approved primary image is used across the homepage, study abroad directory, country profiles, tourist visa, and work visa, with responsive cropping where appropriate.
4. **Accessible Fallbacks:** If an approved photograph has not been verified for a destination, the system renders an accessible, high-contrast ISO country code badge (`flagCode`) rather than silently inserting an unrelated or unverified placeholder.

---

## 2. Complete Asset Inventory

### 2.1 Final Client-Approved Service Visual Assets (Local System Sourced)

| Asset Name | Website Asset Path | Target Pages & Components | Aspect Ratio | Dimensions | Size | SHA-256 Hash | Status |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- | :---: |
| **`Study Abroad_ Your Global Future.png`** | `/assets/images/services/Study%20Abroad_%20Your%20Global%20Future.png` | Homepage Card 1, `/services/study-visa/`, `/services/` | 16:9 | 1672 × 941 | 2.76 MB | `31F275A30DE6B8C49DC1D4C3E0F2F2442A90FA1EAF83462336BE1CE28B63B524` | ✅ Verified & Active |
| **`Vibrant Tourist Visa Travel Poster.png`** | `/assets/images/services/Vibrant%20Tourist%20Visa%20Travel%20Poster.png` | Homepage Card 3, `/services/tourist-visa/`, `/services/` | 16:9 | 1672 × 941 | 2.15 MB | `967DABCD0B84D6ABB68EC0AF8F312776660433E738329FE7DBFAFE28A9832EE4` | ✅ Verified & Active |
| **`Global Work Visa Opportunities.png`** | `/assets/images/services/Global%20Work%20Visa%20Opportunities.png` | Homepage Card 4, `/services/work-visa/`, `/services/` | 16:9 | 1672 × 941 | 2.27 MB | `3266DABA0520F6B40E4F449750B849D7BFFE90D582A4D9261822A25B441F2CDE` | ✅ Verified & Active |
| **`MBBS & PhD Courses Abroad.png`** | `/assets/images/services/MBBS%20&%20PhD%20Courses%20Abroad.png` | Homepage Card 5, `/services/mbbs/`, `/services/phd/`, `/services/` | 16:9 | 1671 × 941 | 2.35 MB | `E4D68BCC1C16FA172D339D30227D09C3ED26D15C9D3FD7DC376FB8E41FCD5A7D` | ✅ Verified & Active |
| **`Flight Booking and Dummy Tickets.png`** | `/assets/images/services/Flight%20Booking%20and%20Dummy%20Tickets.png` | Homepage Card 6, `/services/flight-booking/`, `/services/` | 16:9 | 1672 × 941 | 2.08 MB | `B87019B5256E98580672B830A2CFC819F49A93902F4C01428E35667CC53B6D81` | ✅ Verified & Active |
| **`Additional Visa Services Guide.png`** | `/assets/images/services/Additional%20Visa%20Services%20Guide.png` | `/services/additional-services/`, `/services/` | 16:9 | 1672 × 941 | 2.35 MB | `2C09B8812E7EC77C6ACC41E653B77D0B013A172E92BCA24E18E3DA27950C7057` | ✅ Verified & Active |

### 2.2 Architectural & Landmark Assets

| Asset Name | Current Source / Path | Target Page & Section | Subject / What It Shows | Dimensions | Size | License & Provenance | Alt Text & Accessibility | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`hero-landmarks.jpg`** | `/assets/images/hero-landmarks.jpg` | Homepage Hero (`HeroSection.astro`) | Four world landmarks (Statue of Liberty, Big Ben, Eiffel Tower, Sydney Opera House) under golden-hour twilight | 1536 × 1024 | 722 KB | Sourced Architectural Editorial Composite | *"World iconic landmarks including the Statue of Liberty, Big Ben, Eiffel Tower, and Sydney Opera House"* | ✅ Active & Approved |
| **`service-universities.jpg`** | `/assets/images/services/service-universities.jpg` | Homepage Card 2 (University Directory) | Students walking on international campus | 600 × 340 | 219 KB | Sourced Academic Architecture | *"International college students walking outside campus academic building"* | ✅ Active & Approved |
| **`flight-hero-aviation.jpg`** | `/assets/images/flight-hero-aviation.jpg` | Secondary Aviation Archive | Commercial passenger jet airliner wing soaring above sunset clouds | 1536 × 1024 | 655 KB | Sourced Aviation Archive | *"Commercial passenger jetliner wing soaring above sunset clouds"* | 📦 Secondary Archive |
| **`mbbs-education.jpg`** | `/assets/images/mbbs-education.jpg` | Secondary Clinical Archive | International medical students in clinical laboratory | 1200 × 800 | 99 KB | Unsplash Commercial License | *"International medical student training in modern university medical faculty"* | 📦 Secondary Archive |
| **`phd-research.jpg`** | `/assets/images/phd-research.jpg` | Secondary Academic Archive | Doctoral research scholar studying in grand university library | 1536 × 1024 | 802 KB | Sourced Academic Asset | *"Doctoral research scholar conducting dissertation research in an academic university library"* | 📦 Secondary Archive |
| **`hero-education.jpg`** | `/assets/images/hero-education.jpg` | Auxiliary / General Education Archive | University students walking across campus lawn | 1200 × 800 | 203 KB | Unsplash Commercial License | *"Students walking on an international university campus"* | 📦 Archived / Secondary |
| **`canada.jpg`** | `/assets/images/destinations/canada.jpg` | Homepage, Country Directory, Canada Profile | Downtown Toronto skyline, CN Tower, and Lake Ontario | 1200 × 800 | 80 KB | Unsplash Commercial License (`photo-1517935703635-2717090c2210`) | *"Downtown Toronto skyline and Lake Ontario, Canada"* | ✅ Active & Approved |
| **`united-kingdom.jpg`** | `/assets/images/destinations/united-kingdom.jpg` | Homepage, Country Directory, UK Profile | Palace of Westminster and Big Ben over River Thames, London | 1200 × 800 | 71 KB | Unsplash Commercial License (`photo-1513635269975-59663e0ac1ad`) | *"Palace of Westminster and Big Ben clock tower over River Thames, London, United Kingdom"* | ✅ Active & Approved |
| **`australia.jpg`** | `/assets/images/destinations/australia.jpg` | Homepage, Country Directory, Australia Profile | Sydney Opera House and harbor under clear blue skies | 1200 × 800 | 31 KB | Unsplash Commercial License (`photo-1506973035872-a4ec16b8e8d9`) | *"Sydney Opera House and harbor under blue skies, Sydney, Australia"* | ✅ Active & Approved |
| **`usa.jpg`** | `/assets/images/destinations/usa.jpg` | Homepage, Country Directory, USA Profile | Lower Manhattan skyline featuring One World Trade Center, New York City | 1200 × 800 | 112 KB | Unsplash Commercial License (`photo-1485871981521-5b1fd3805eee`) | *"Lower Manhattan skyline and One World Trade Center, New York City, USA"* | ✅ Active & Approved |
| **`germany.jpg`** | `/assets/images/destinations/germany.jpg` | Homepage, Country Directory, Germany Profile | Historic Berlin Cathedral and Spree River, Berlin | 1200 × 800 | 74 KB | Unsplash Commercial License (`photo-1467269204594-9661b134dd2b`) | *"Historic Berlin Cathedral and Spree River, Berlin, Germany"* | ✅ Active & Approved |
| **`ireland.jpg`** | `/assets/images/destinations/ireland.jpg` | Homepage, Country Directory, Ireland Profile | Cliffs of Moher and Atlantic coastline, Ireland | 1200 × 800 | 68 KB | Unsplash Commercial License (`photo-1590089415225-401ed6f9db8e`) | *"Cliffs of Moher and Atlantic coastline, Ireland"* | ✅ Active & Approved |

---

## 3. Page-by-Page Audit & Strategy

### 3.1 Homepage (`/`)
- **Hero Section:** Employs `hero-landmarks.jpg` in a calibrated 2-column editorial grid (~55% copy, ~45% visual). Sized appropriately at `clamp(380px, 32vw, 480px)` height to prevent pushing service pathways below the fold.
- **Service Pathways:** Uses SVG iconography and structured pathway cards. Zero stock clutter.
- **Featured Destinations:** Renders 6 priority countries (Canada, UK, Australia, USA, Germany, Ireland) utilizing verified local assets from `public/assets/images/destinations/`.
- **Directory Banner & About:** Clean typography, statistics counter, and physical Hanumangarh center credentials.

### 3.2 Flight Booking & Reservation Assistance (`/services/flight-booking/`)
- **Hero Section:** Features `flight-hero-aviation.jpg` in a clean, modern aviation composition.
- **Core Visual Function:** Replaces client promotional banner with a high-conversion, interactive booking and reservation enquiry form.
- **Service Differentiation Panel:** Explains the distinct differences between:
  1. Confirmed Flight Ticket Enquiry
  2. Flight Reservation Assistance (for Visa Dossiers)
  3. Travel Itinerary Assistance
- **Strict Integrity Rule:** Zero fake boarding passes, zero simulated PNR codes, and zero deceptive "dummy ticket" graphics.

### 3.3 Study Abroad Directory (`/study-abroad/`)
- **Card Display:** Top featured countries display approved landmark photography. The remaining 30 destinations display clean, high-contrast ISO country badges (`flagCode`) with continent labels.
- **Search & Filters:** Real-time continent filters and text search. Cards maintain a uniform 48px header or 180px image height.

### 3.4 MBBS Abroad (`/services/mbbs/`)
- **Hero / Header:** Incorporates `mbbs-education.jpg` illustrating an authentic university medical simulation lab.
- **Faculty Listings:** Structured tables detailing curriculum, clinical training hospitals, and National Medical Commission (NMC) compliance.

### 3.5 PhD Abroad (`/services/phd/`)
- **Hero / Header:** Incorporates `phd-research.jpg` illustrating a doctoral research scholar in an academic graduate library.
- **Advisory Scope:** Research proposal formulation, supervisor matching, and funding fellowship pathways.

### 3.6 Tourist Visa (`/services/tourist-visa/`)
- **Hero & Content:** Editorial travel advisory layout covering 27 destinations (16 Schengen, 10 Direct Consular, 1 UAE).
- **Interactive Destination Grid:** Uses high-contrast ISO flag markers, stream labels, and prefilled consultation triggers.

### 3.7 Work Visa (`/services/work-visa/`)
- **Hero & Content:** Professional compliance layout covering 14 countries across the Gulf, Europe, and Asia-Pacific.
- **Occupational Focus Areas:** Features 12 occupational sectors clearly categorized as advisory focus areas with statutory Indian Emigration Act, 1983 disclosures.

### 3.8 About Us (`/about/`) & Contact (`/contact/`)
- **Current State:** Clean typographic presentation, Hanumangarh physical consultation address, verified social handles (Instagram, YouTube), and operating hours.
- **Pending Client Items:** Awaiting client-supplied, verified photographs of the actual Hanumangarh office exterior/interior and counseling staff. No generic stock photos are substituted.

---

## 4. Centralized Country Registry Integration

All 51 countries in [`src/data/country-registry.ts`](file:///c:/Users/ACER/Desktop/Visa%20MASTER/visa-convention-wesbite/src/data/country-registry.ts) are strictly indexed with:
- `countryId` (string)
- `countryName` (string)
- `slug` (string)
- `primaryImage` (string)
- `altText` (string)
- `sourceUrl` (string)
- `license` (string)
- `objectPosition` (string)
- `approvalStatus` (`'approved' | 'pending' | 'draft'`)

This guarantees that whenever a country card is rendered anywhere across the site, it pulls from the single canonical registry.
