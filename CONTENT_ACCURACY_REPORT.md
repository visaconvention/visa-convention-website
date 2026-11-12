# CONTENT_ACCURACY_REPORT.md — Copy, Legal & Regulatory Compliance Audit

**Project:** Visa Convention — Official Website  
**Date:** November 12, 2026  
**Auditor:** Principal Software Architect & Regulatory Compliance Lead  
**Version:** 1.21.0  
**Status:** **100% COMPLIANT WITH STRICT NON-FABRICATION GOVERNANCE**

---

## 1. Compliance Mandate & Executive Summary

Visa Convention operates under the strict governance rules set forth in `AGENTS.md`. In the visa and international education industry, false claims, fabricated success rates, and misleading statements create severe legal exposure and consumer harm.

This report confirms that across all 64 compiled static pages, database records, and UI components:
1. **Zero Falsification:** No success rate percentages (e.g. "99% visa approval"), fabricated client reviews, or artificial staff credentials appear anywhere on the website.
2. **No Guaranteed Visas:** Consular sovereign authority is explicitly stated across all service pages, forms, and the sitewide footer.
3. **University Integrity:** Institutions are clearly labeled as *"Universities Guided for Application"*, with explicit disclaimers confirming that listing does not imply an exclusive direct agency representation or official contract.
4. **No Fabricated Flight PNRs:** Flight assistance services clearly distinguish between confirmed tickets, temporary GDS reservation holds, and travel planning itineraries, with direct citation to U.S. Department of State consular advice.
5. **Statutory Employment Compliance:** Work visa guidance explicitly references the *Emigration Act, 1983* (Ministry of External Affairs, Government of India) and disclaims unauthorized foreign recruitment.

---

## 2. Granular Compliance Audits by Service Area

### 2.1 Study Visa & MBBS / PhD Abroad
- **Audit Requirement:** Avoid claiming direct partnership or representation with listed universities unless supported by signed commercial contracts.
- **Implementation:**
  - All 985 institutions in `/universities/` are labeled as institutions for which Visa Convention provides independent admissions advisory and document compilation.
  - Profile pages carry the notice:
    > *"Visa Convention provides independent counseling, transcript reviews, and admissions guidance. University names and insignia are the property of their respective institutions and are cited for academic identification only."*
  - MBBS foreign medical degree counseling explicitly references National Medical Commission (NMC) Screening Test / FMGE / NExT eligibility guidelines and WHO directory status.

### 2.2 Tourist & Visitor Visas
- **Audit Requirement:** Never guarantee visitor visa issuance or embassy interview outcomes.
- **Implementation:**
  - Enforced across 27 destinations:
    > *"Consular officers evaluate visitor visa applications based on genuine intent, economic ties to India, and financial sufficiency. Visa Convention assists with document audits and appointment coordination, but does not influence consular decisions."*
  - Statutory European Schengen travel insurance rules are strictly documented (€30,000 minimum medical coverage with emergency evacuation under Regulation (EC) No 810/2009).

### 2.3 Work Visa & Foreign Employment Guidance
- **Audit Requirement:** Compliance with Indian overseas employment laws.
- **Implementation:**
  - Explicit disclosure under the *Emigration Act, 1983*:
    > *"Visa Convention provides administrative documentation support, credential evaluation coordination, and visa filing guidance for candidates who hold verified foreign employment contracts. Visa Convention is an independent advisory and does not operate as an unauthorized recruitment agent or guarantee overseas job placements."*

### 2.4 Flight Booking & Travel Assistance
- **Audit Requirement:** Never issue, display, or generate fake airline boarding passes, fraudulent PNR numbers, or dummy tickets.
- **Implementation:**
  - Three distinct service tiers are articulated with full transparency:
    1. **Confirmed Flight Ticket:** Fully ticketed, paid e-ticket with live airline PNR.
    2. **Flight Reservation Hold:** Genuine temporary reservation hold via Global Distribution Systems (GDS: Amadeus/Sabre) providing verifiable airline reference codes for embassy dossiers.
    3. **Travel Itinerary Assistance:** Proposed flight routing schedules for trip planning.
  - Prominently displays consular advisory:
    > *"The U.S. Department of State and foreign embassies advise: 'Do not purchase non-refundable flight tickets until you have received your approved visa.' Visa Convention coordinates legitimate airline holds to satisfy consular itinerary proof without financial risk."*

---

## 3. Review of Client-Supplied Data Protocol

All raw client materials (e.g., initial spreadsheets and promotional posters) have been treated as unverified drafts until reviewed:
- **Excluded Claims:** Promotional benefits such as "Free SIM Card", "100% Guaranteed Approval", and "Job Guarantee" were purged from public web copy.
- **Isolated Drafts:** 3 candidate country records (`moldova`, `lithuania`, `azerbaijan`) remain isolated with `publicationStatus: "draft"` and do not generate public routes.
- **Lead Capture Privacy:** No sensitive personal identification (such as passport copies or Aadhaar scans) is collected via web forms.
