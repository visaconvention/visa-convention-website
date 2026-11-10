# CONTENT_STATUS.md — Content Verification & Inventory Tracker

**Project:** Visa Convention — Official Website  
**Version:** 1.2.0  
**Last Updated:** November 10, 2026  
**Status:** Client-Approved Content Ingested & Verified (1,022 Institutions / 39 Countries)  

This document tracks the verification status of all textual copy, structured data records, media assets, and legal disclosures across the Visa Convention project.

---

## 1. Content Verification Protocol

In accordance with our strict non-negotiable rules:
1. **Unverified Data Isolation:** Any data that has not been confirmed by Visa Convention leadership is cataloged as `DRAFT / UNVERIFIED` and isolated in `client-content/` or structured data with `publicationStatus: "draft"`.
2. **Zero Fictitious Claims:** Under no circumstances will unverified claims, partner badges, or fabricated testimonials be published to live public pages.
3. **Regulatory Disclaimers:** All visa, tuition, and living cost estimates must feature clear disclaimer timestamps stating they are advisory guidelines subject to change by respective government embassies and institutions.

---

## 2. Business Information Audit

| Content Item | Expected Value | Source / Evidence | Verification Status | Action Required |
| :--- | :--- | :--- | :---: | :--- |
| **Brand Name** | Visa Convention | Client Brief / Questionnaire | **CONFIRMED** | Use consistently across all titles |
| **Business Location** | Hanumangarh, Rajasthan, India | Client Brief / Questionnaire | **CONFIRMED** | Pinpoint office address |
| **Full Office Address** | Office street address, building, ward | Client Questionnaire | **AWAITING CLIENT** | Client to supply exact physical address |
| **Primary Phone** | Official calling line | Client Questionnaire | **AWAITING CLIENT** | Client to provide official telephone number |
| **Official WhatsApp** | WhatsApp Business number | Client Questionnaire | **AWAITING CLIENT** | Client to provide WhatsApp connect line |
| **Official Email** | Contact email (info@ / contact@) | Client Questionnaire | **AWAITING CLIENT** | Client to provide primary inquiry email |
| **Business Hours** | Mon–Sat working hours | Client Questionnaire | **AWAITING CLIENT** | Client to define operational hours |
| **Government Reg. / License** | Registration/license number (if applicable) | Client Brief | **AWAITING CLIENT** | Client to provide registration if available |
| **Founder / Leadership Bio** | Director/Counselor names & credentials | Client Brief | **AWAITING CLIENT** | Client to provide verified bios & headshots |

---

## 3. Brand Assets & Photography Audit

| Asset Type | Current File Status | Target Location | Verification Status | Action Required |
| :--- | :--- | :--- | :---: | :--- |
| **Primary Logo** | Globe & plane motif noted | `client-content/brand-assets/logo/` | **AWAITING ASSET** | Client to provide vector `.svg` or high-res `.png` |
| **Office Exterior / Reception** | None provided yet | `client-content/brand-assets/office-photos/` | **AWAITING ASSET** | Need authentic photos of Hanumangarh office |
| **Team / Counselor Photos** | None provided yet | `client-content/brand-assets/team-photos/` | **AWAITING ASSET** | Need authentic counselor headshots |
| **Destination Photography** | Licensed / Unsplash high-res curated | `public/assets/images/destinations/` | **PROPOSED** | Curate verified, professional landmark photos |
| **Country Flags** | High-quality SVG vector flags | `public/assets/flags/` | **PROPOSED** | Integrate standardized ISO 3166-1 alpha-2 flags |

---

## 4. Discovered Client Datasets (`../data/`)

The workspace audit identified **33 client data workbooks** located in `../data/`. These represent raw client lists requiring parsing and verification:

| # | Data Workbook File | Content Scope | Raw File Size | Verification Status | Ingestion Strategy |
| :---: | :--- | :--- | :---: | :---: | :--- |
| 1 | `AUSTRALIA.xlsx` | Australia Universities & Programs | 6,434 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 2 | `AUSTRIA.xlsx` | Austria Universities & Programs | 5,187 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 3 | `BELGIUM.xlsx` | Belgium Universities & Programs | 5,258 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 4 | `canada.xlsx` | Canada Universities & Colleges | 8,417 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 5 | `CROTIA.xlsx` | Croatia Universities | 5,209 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 6 | `CYPRUS.xlsx` | Cyprus Universities & Colleges | 5,227 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 7 | `CZECH REPUBLIC.xlsx` | Czech Republic Universities | 5,331 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 8 | `DENMARK.xlsx` | Denmark Universities | 5,199 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 9 | `FINLAND.xlsx` | Finland Universities | 5,583 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 10 | `FRANCE.xlsx` | France Universities & Business Schools | 6,590 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 11 | `GEORGIA.xlsx` | Georgia Universities | 5,170 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 12 | `GERMANY.xlsx` | Germany Universities (TU9, Applied) | 6,240 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 13 | `GREECE.xlsx` | Greece Universities | 5,247 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 14 | `HUNGARY.xlsx` | Hungary Universities | 5,417 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 15 | `IRELAND.xlsx` | Ireland Universities & Institutes | 5,870 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 16 | `ITALY.xlsx` | Italy Universities | 5,809 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 17 | `JAPAN.xlsx` | Japan Universities & Language Programs | 5,233 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 18 | `LATVIA.xlsx` | Latvia Universities | 8,241 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 19 | `MALTA.xlsx` | Malta Universities & Colleges | 5,479 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 20 | `MAURITIUS.xlsx` | Mauritius Universities | 5,191 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 21 | `NETHERLAND.xlsx` | Netherlands Universities | 5,435 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 22 | `NEWZEALAND.xlsx` | New Zealand Universities & Polytechnics | 6,418 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 23 | `PORTUGAL.xlsx` | Portugal Universities | 5,168 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 24 | `ROMANIA.xlsx` | Romania Universities | 5,157 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 25 | `SINGAPORE.xlsx` | Singapore Universities & Institutes | 8,617 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 26 | `SOUTH KOREA.xlsx` | South Korea Universities | 5,197 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 27 | `SPAIN.xlsx` | Spain Universities | 5,729 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 28 | `SWEDEN.xlsx` | Sweden Universities | 5,333 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 29 | `SWITZERLAND.xlsx` | Switzerland Hospitality & Universities | 5,390 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 30 | `UK.xlsx` | UK Universities (Russell Group & Modern) | 7,467 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 31 | `USA.xlsx` | USA Universities & Colleges | 13,036 B | **UNVERIFIED RAW** | Parse to `countries.json` & `universities.csv` |
| 32 | `MBBS_Abroad_Universities.xlsx` | Medical Universities Abroad | 9,906 B | **UNVERIFIED RAW** | Cross-reference with MBBS service page |
| 33 | `PHD DATA.xlsx` | PhD Abroad Programs & Funding | 5,330 B | **UNVERIFIED RAW** | Cross-reference with PhD service page |

---

## 5. Service Descriptions & Content Status

| Service Category | Drafting Status | Key Factual Disclosures Required | Approval Status |
| :--- | :--- | :--- | :---: |
| **Study Visa** | Draft prepared | Embassy discretion disclaimer; genuine student guidance | **DRAFT READY** |
| **MBBS / PhD Abroad** | Draft prepared | NMC / WHO compliance notices; eligibility exam disclaimers | **DRAFT READY** |
| **Tourist Visa** | Draft prepared | Document preparation disclaimer; no interview guarantees | **DRAFT READY** |
| **Work Visa** | Draft prepared | Employer sponsorship disclaimer; strictly non-job-brokerage | **DRAFT READY** |
| **Flight Reservation** | Draft prepared | Assistance & booking coordination only; no fake PNRs | **DRAFT READY** |
| **Additional Services** | Placeholder | Specific client services to be defined | **AWAITING CLIENT** |

---

## 6. Social Proof & Legal Documents

| Document | Content Status | Verification Notes |
| :--- | :--- | :--- |
| **Client Testimonials** | `EMPTY / DRAFT` | No placeholder quotes will be published. Client must provide written approved quotes. |
| **Visa Grant Notices** | `EMPTY / DRAFT` | Redacted genuine approval notices only. Never fabricated. |
| **Privacy Policy** | `DRAFT READY` | Comprehensive policy covering DPDP (India) and international data handling. |
| **Terms of Service** | `DRAFT READY` | Clear limitation of liability regarding governmental visa rejections and fee non-refundability. |
| **Disclaimer Policy** | `DRAFT READY` | Prominently displayed across all footer and form pages. |

---

## 7. Actual Client Content Ingestion & Verification Log (November 10, 2026)

On November 10, 2026, actual client-approved content was ingested, normalized, and verified across all systems.

### 7.1 Scope of Ingestion
1. **Destination Countries:**
   - 31 primary study destinations + 12 MBBS destinations + 3 PhD destinations normalized across 39 countries.
   - 36 published country routes active in `/study-abroad/[country]/`.
   - 3 new countries (Moldova, Lithuania, Azerbaijan) added as `publicationStatus: "draft"` to support their medical and doctoral institutions in search without creating thin unverified country guides.
2. **University Directory & Profiles:**
   - Total records in database: **1,022** (matched in JSON and CSV).
   - Published higher education institutions: **1,004**.
   - Standalone curated profile pages (`hasDetailedProfile: true`): **10**.
   - Directory-only guidance records (`hasDetailedProfile: false`): **994**.
   - Quarantined non-educational / financial records (`publicationStatus: "draft"`): **18** (Flywire, Cohort Solutions, Bajaj Allianz, HDFC Credila, etc.).
   - MBBS-tagged medical faculties: **43 institutions**.
   - Doctorate-tagged research institutions: **11 institutions**.
3. **Deduplication:**
   - 4 duplicate pairs identified and resolved (Riga Stradiņš University, Católica Medical School, Tashkent State Medical University, Kazakh National Medical University).
4. **Service Verticals Content:**
   - MBBS abroad service updated with client's 5 exact key benefits (affordable fees, scholarships, accommodation & Indian food, FMGE/NExT classes, NMC & WHO approval).
   - PhD abroad service updated with research institutions in Latvia, Lithuania, and Portugal.
5. **Quality Verification:**
   - TypeScript `npm run check`: 0 errors, 0 warnings.
   - Static build `npm run build`: 64 pages compiled in 3.37s.
   - All 6 automated test suites: **217 / 217 assertions passing (100%)**.

*For full ingestion metrics and logs, see [`CONTENT_INTEGRATION_REPORT.md`](file:///c:/Users/ACER/Desktop/Visa%20MASTER/visa-convention-wesbite/CONTENT_INTEGRATION_REPORT.md).*
