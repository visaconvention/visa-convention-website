# REQUIREMENTS.md — Project Requirements Specification

**Project:** Visa Convention — Official Website  
**Version:** 1.0.0  
**Last Updated:** November 9, 2026  
**Status:** Baseline Established  

This document tracks all project requirements categorized strictly into four states. No item in `PROPOSED` or `AWAITING CLIENT CONTENT` will be treated as contractual scope until formally confirmed.

---

## 1. CONFIRMED REQUIREMENTS

These requirements have been explicitly approved and agreed upon as the foundation of the project.

### 1.1 Brand Identity & Visual Design
- **REQ-C-01:** Implement the official brand color palette:
  - Deep Navy: `#102A53`
  - Signature Red: `#C91D32`
  - Professional Blue: `#2367A4`
  - Background Neutral: `#F5F8FC`
  - White: `#FFFFFF`
- **REQ-C-02:** Retain and modernize the recognized brand motif featuring a globe and airplane design.
- **REQ-C-03:** Adhere to an established international corporate aesthetic (clean typography, generous whitespace, subtle shadows, professional imagery).
- **REQ-C-04:** Strictly avoid generic low-cost visa agent visual styles (garish gradients, animated promotional badges, clip-art clutter).

### 1.2 Core Business Verticals
- **REQ-C-05:** Provide dedicated, comprehensive coverage for the 6 core business verticals:
  1. Study Visa
  2. MBBS / PhD Abroad
  3. Tourist Visa
  4. Work Visa
  5. Air Ticket / Flight Reservation Assistance
  6. Additional Services (exact scope managed via pending client data)

### 1.3 Data-Driven Country & University Architecture
- **REQ-C-06:** Architect a data-driven dynamic country engine supporting 25–35+ destination countries without manual page duplication or code changes.
- **REQ-C-07:** Enable country-specific university listings fed from structured data files (JSON/CSV/Content Collections).
- **REQ-C-08:** Centralize university records so the same university appears under both its respective country page and the sitewide university directory.

### 1.4 Strict Content & Factual Integrity Rules
- **REQ-C-09:** Zero fabricated statistics, approval rates, client reviews, or staff credentials.
- **REQ-C-10:** Clear disclaimers stating visa decisions are made exclusively by government embassies/consulates (no "guaranteed visa" claims).
- **REQ-C-11:** No representation of listed universities as formal contractual partners unless legally verified.
- **REQ-C-12:** Zero fake flight tickets, boarding passes, or fraudulent PNR numbers.
- **REQ-C-13:** Segregate all unverified placeholder text into editable draft files.

### 1.5 Architecture, Performance & Governance
- **REQ-C-14:** Static-first website architecture ensuring sub-second page loads and zero server database overhead.
- **REQ-C-15:** Fully responsive mobile-first design supporting 320px to 4K displays.
- **REQ-C-16:** Accessibility adherence to WCAG 2.1 AA standards (contrast, focus states, screen reader semantics).
- **REQ-C-17:** Zero secrets or credentials committed to source code.
- **REQ-C-18:** Explicit user approval required prior to any production deployment.

---

## 2. PROPOSED REQUIREMENTS

These technical and architectural enhancements are recommended by the engineering team and await client/stakeholder confirmation.

- **REQ-P-01 (Technology Stack):** Use **Astro 5.x** with **TypeScript** and **Tailwind CSS v4** as the primary framework for static-first performance, content collections validation, and minimal client JS. *(IMPLEMENTED & VERIFIED IN STAGE 02)*
- **REQ-P-02 (Client-Side Search):** Implement a lightweight client-side indexing engine for instant university directory searching and filtering without backend database dependencies. *(IMPLEMENTED & VERIFIED IN STAGE 02)*
- **REQ-P-03 (Lead Handling Mechanism):** Recommend **Web3Forms** or **Formspree** (or cloud serverless function) with honeypot spam protection for inquiry forms, eliminating database management and ongoing server costs.
- **REQ-P-04 (Quick Connect Widget):** Add a floating, accessible WhatsApp CTA with pre-filled consultation message targeting the official Hanumangarh office line.
- **REQ-P-05 (Structured Data SEO):** Implement rich Schema.org JSON-LD snippets (`LocalBusiness`, `EducationalOrganization`, `FAQPage`, `BreadcrumbList`) across all service, country, and university routes.
- **REQ-P-06 (Automated Excel Ingestion Script):** Build a Node/Python build-time utility to transform the 31 client-supplied Excel workbooks into validated typed JSON/CSV collections.

---

## 3. AWAITING CLIENT CONTENT

These items require client-supplied assets, business data, or verification before public display.

- **REQ-ACC-01 (Business Registration & Identity):**
  - Official registered legal business name and registration numbers.
  - Complete Hanumangarh physical office address, pincode, and Google Maps pin link.
  - Primary contact phone numbers, official email addresses, and official WhatsApp number.
  - Business operating hours (IST).
- **REQ-ACC-02 (Brand Assets):**
  - High-resolution vector logo files (`.svg`, `.ai`, or high-res transparent `.png`).
  - High-resolution photographs of the Hanumangarh office, reception, and counseling rooms.
  - Professional headshots and verified bios for key leadership and counselors.
- **REQ-ACC-03 (Study Abroad & University Data Verification):**
  - Formal review of the 31 raw Excel workbooks currently in `../data/` (Australia, Canada, UK, USA, Germany, MBBS, PhD, etc.).
  - Verification of fee ranges, intake dates, and eligibility criteria before public publication.
  - Classification of university relationships (e.g., "Listed University" vs. "Authorized Representative").
- **REQ-ACC-04 (Social Proof & Testimonials):**
  - Written consent and verified testimonial copy from real visa recipients and international students.
  - Authentic visa grant approval notices (with all private PII redacted).
- **REQ-ACC-05 (Legal Policies):**
  - Client-reviewed Privacy Policy, Terms of Service, and Refund/Cancellation Policy.

---

## 4. OUT OF SCOPE

The following features are explicitly excluded from the current phase to prevent scope creep, excessive infrastructure complexity, and security liabilities.

- **REQ-OOS-01 (Direct Financial Transactions / Payment Gateway):** No online payment processing or credit card handling on the website. Consultations and fee payments occur via established banking or in-office channels.
- **REQ-OOS-02 (User Accounts & Client Portal):** No login, registration, or password-protected client dashboard. Case tracking is handled through direct counselor communication.
- **REQ-OOS-03 (Live Global GDS Flight Booking Engine):** No live Amadeus/Sabre API integration for real-time seat reservation or ticket issuance. Flight services will operate as a structured inquiry and reservation assistance request form.
- **REQ-OOS-04 (Relational Server Database):** No ongoing maintenance of PostgreSQL/MySQL/MongoDB servers; all data is managed via typed static content collections.
- **REQ-OOS-05 (Automated AI Chatbots with Unvetted Responses):** No unconstrained conversational AI bots that could generate inaccurate legal or visa advice.
