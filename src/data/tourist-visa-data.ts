import type { ApplicantCategory, TouristDestination, FAQItem } from '../types';

/**
 * Visa Convention — Tourist & Visitor Visa Service Data
 * 
 * Source Material: Client Service Poster (November 2026)
 * Reconciled & Vetted Against:
 * - EU Visa Code (Regulation EC No 810/2009)
 * - German Federal Foreign Office & Schengen Guidelines in India
 * - UK Visas and Immigration (UKVI) Standard Visitor Rules
 * - IRCC Canada Visitor Visa Guidelines
 * - GDRFA / ICP United Arab Emirates Tourist Entry Regulations
 */

export const touristDestinations: TouristDestination[] = [
  // Individual Global Destinations (10)
  {
    id: 'dest-canada',
    name: 'Canada',
    slug: 'canada',
    group: 'individual',
    flagCode: 'CA',
    visaStream: 'Visitor Visa (V-1 / TRV)',
    stayDuration: 'Up to 6 months per entry',
    keyRequirementsOverview: 'Valid passport, travel itinerary, proof of financial support, ties to India (employment/property), clear criminal and medical record.',
    highlightNotice: 'Biometrics required at VFS Global. Multiple-entry validity typically issued up to passport expiry date.',
  },
  {
    id: 'dest-uk',
    name: 'United Kingdom',
    slug: 'united-kingdom',
    group: 'individual',
    flagCode: 'GB',
    visaStream: 'Standard Visitor Visa',
    stayDuration: '6 months (options for 2, 5, or 10 years)',
    keyRequirementsOverview: 'Passport, genuine intention to visit, 6 months bank statements, proof of earnings/employment, accommodation arrangements.',
    highlightNotice: 'Online submission via AccessUK followed by biometric appointment at VFS / TLScontact.',
  },
  {
    id: 'dest-usa',
    name: 'United States',
    slug: 'usa',
    group: 'individual',
    flagCode: 'US',
    visaStream: 'B1/B2 Visitor Visa',
    stayDuration: 'Up to 6 months per entry (10-year multiple)',
    keyRequirementsOverview: 'Form DS-160 confirmation, consular interview, strong social/economic ties to India under INA 214(b), liquid funds.',
    highlightNotice: 'Two-step process: VAC biometrics appointment followed by in-person consular officer interview.',
  },
  {
    id: 'dest-australia',
    name: 'Australia',
    slug: 'australia',
    group: 'individual',
    flagCode: 'AU',
    visaStream: 'Visitor Visa (Subclass 600)',
    stayDuration: '3, 6, or 12 months',
    keyRequirementsOverview: 'Online ImmiAccount petition, bank statements, employment verification, travel itinerary, genuine temporary entrant intent.',
    highlightNotice: 'Electronic visa (evisa) with no physical passport vignette sticker required.',
  },
  {
    id: 'dest-new-zealand',
    name: 'New Zealand',
    slug: 'new-zealand',
    group: 'individual',
    flagCode: 'NZ',
    visaStream: 'Visitor Visa',
    stayDuration: 'Up to 9 months within 18-month window',
    keyRequirementsOverview: 'Passport, evidence of sufficient funds (NZ$1,000/mo or NZ$400/mo with prepaid accommodation), onward travel ticket.',
    highlightNotice: 'Online application via Immigration New Zealand portal.',
  },
  {
    id: 'dest-singapore',
    name: 'Singapore',
    slug: 'singapore',
    group: 'individual',
    flagCode: 'SG',
    visaStream: 'e-Visa via Authorized Visa Agents',
    stayDuration: 'Up to 30 days per entry',
    keyRequirementsOverview: 'Form 14A, confirmed air tickets, 3-6 months bank statement, hotel booking, passport with 6 months validity.',
    highlightNotice: 'Processed electronically through authorized visa processing agents.',
  },
  {
    id: 'dest-japan',
    name: 'Japan',
    slug: 'japan',
    group: 'individual',
    flagCode: 'JP',
    visaStream: 'Temporary Visitor Visa (Tourism)',
    stayDuration: '15 to 90 days',
    keyRequirementsOverview: 'Schedule of stay (day-wise itinerary), tax certificate / ITR-V, bank statements, hotel confirmation.',
    highlightNotice: 'Paper dossier submitted via VFS Japan application centers.',
  },
  {
    id: 'dest-south-korea',
    name: 'South Korea',
    slug: 'south-korea',
    group: 'individual',
    flagCode: 'KR',
    visaStream: 'C-3-9 Ordinary Tourist Visa',
    stayDuration: 'Up to 90 days',
    keyRequirementsOverview: 'Passport, visa application form, past 1-2 years ITR, 6 months bank statement, travel schedule.',
    highlightNotice: 'Application submitted through designated Korea Visa Application Centers (KVAC).',
  },
  {
    id: 'dest-brazil',
    name: 'Brazil',
    slug: 'brazil',
    group: 'individual',
    flagCode: 'BR',
    visaStream: 'Visitor Visa (VIVIS)',
    stayDuration: 'Up to 90 days per visit',
    keyRequirementsOverview: 'Online RER form, bank statements showing financial stability, flight reservation, hotel reservation or host letter.',
    highlightNotice: 'Consular submission requiring notarized translations where documents are not in English or Portuguese.',
  },
  {
    id: 'dest-china',
    name: 'China',
    slug: 'china',
    group: 'individual',
    flagCode: 'CN',
    visaStream: 'L-Visa (Tourist)',
    stayDuration: '30 to 60 days',
    keyRequirementsOverview: 'Air ticket booking confirmation, hotel reservation or formal invitation letter from entity/individual in China, bank proof.',
    highlightNotice: 'Processed through Chinese Visa Application Service Center (CVASC).',
  },

  // Schengen Destinations (16 Named in Client Poster)
  {
    id: 'dest-germany',
    name: 'Germany',
    slug: 'germany',
    group: 'schengen',
    flagCode: 'DE',
    visaStream: 'Schengen Uniform Short-Stay (Type C)',
    stayDuration: '90 days within any 180-day period',
    keyRequirementsOverview: 'VIDEX form, €30,000 travel insurance, 3 months bank statements, employment leave letter, flight/hotel bookings.',
    highlightNotice: 'Official German checklist specifies 3 months bank statement (not 6 months). Processing via VFS Global.',
  },
  {
    id: 'dest-france',
    name: 'France',
    slug: 'france',
    group: 'schengen',
    flagCode: 'FR',
    visaStream: 'Schengen Uniform Short-Stay (Type C)',
    stayDuration: '90 days within any 180-day period',
    keyRequirementsOverview: 'France-Visas receipt, travel medical insurance (€30k), detailed itinerary, bank statements, ITR proof.',
    highlightNotice: 'Appointment booking through VFS France centers across India.',
  },
  {
    id: 'dest-italy',
    name: 'Italy',
    slug: 'italy',
    group: 'schengen',
    flagCode: 'IT',
    visaStream: 'Schengen Uniform Short-Stay (Type C)',
    stayDuration: '90 days within any 180-day period',
    keyRequirementsOverview: 'Schengen application form, confirmed roundtrip booking, hotel vouchers, 3-6 months bank statement, cover letter.',
    highlightNotice: 'Processed via VFS Italy in New Delhi, Jalandhar, Chandigarh, and Mumbai.',
  },
  {
    id: 'dest-switzerland',
    name: 'Switzerland',
    slug: 'switzerland',
    group: 'schengen',
    flagCode: 'CH',
    visaStream: 'Schengen Uniform Short-Stay (Type C)',
    stayDuration: '90 days within any 180-day period',
    keyRequirementsOverview: 'Swiss Schengen form, travel medical insurance, verifiable hotel vouchers, bank statements with official seal.',
    highlightNotice: 'Processed through VFS Global for the Embassy of Switzerland in New Delhi.',
  },
  {
    id: 'dest-hungary',
    name: 'Hungary',
    slug: 'hungary',
    group: 'schengen',
    flagCode: 'HU',
    visaStream: 'Schengen Uniform Short-Stay (Type C)',
    stayDuration: '90 days within any 180-day period',
    keyRequirementsOverview: 'Schengen dossier, travel health insurance, accommodation proof, 3 months bank statements, employment NOC.',
    highlightNotice: 'Hungarian consular processing via VFS Global.',
  },
  {
    id: 'dest-norway',
    name: 'Norway',
    slug: 'norway',
    group: 'schengen',
    flagCode: 'NO',
    visaStream: 'Schengen Uniform Short-Stay (Type C)',
    stayDuration: '90 days within any 180-day period',
    keyRequirementsOverview: 'UDI Application Portal receipt, €30,000 insurance, proof of accommodation, employment leave letter, bank funds.',
    highlightNotice: 'Processed for the Royal Norwegian Embassy via VFS Global.',
  },
  {
    id: 'dest-finland',
    name: 'Finland',
    slug: 'finland',
    group: 'schengen',
    flagCode: 'FI',
    visaStream: 'Schengen Uniform Short-Stay (Type C)',
    stayDuration: '90 days within any 180-day period',
    keyRequirementsOverview: 'Finland Schengen petition, travel insurance, detailed itinerary, verifiable funds, employment proof.',
    highlightNotice: 'Handled via VFS Finland centers.',
  },
  {
    id: 'dest-austria',
    name: 'Austria',
    slug: 'austria',
    group: 'schengen',
    flagCode: 'AT',
    visaStream: 'Schengen Uniform Short-Stay (Type C)',
    stayDuration: '90 days within any 180-day period',
    keyRequirementsOverview: 'Austrian Schengen form, travel medical coverage, bank statements, ITR records, travel reservation holds.',
    highlightNotice: 'Submitted via VFS Austria.',
  },
  {
    id: 'dest-iceland',
    name: 'Iceland',
    slug: 'iceland',
    group: 'schengen',
    flagCode: 'IS',
    visaStream: 'Schengen Uniform Short-Stay (Type C)',
    stayDuration: '90 days within any 180-day period',
    keyRequirementsOverview: 'Schengen dossier, comprehensive itinerary (cruises/tours), €30,000 health insurance, bank statements.',
    highlightNotice: 'Consular representation handled through the Embassy of Denmark / VFS.',
  },
  {
    id: 'dest-spain',
    name: 'Spain',
    slug: 'spain',
    group: 'schengen',
    flagCode: 'ES',
    visaStream: 'Schengen Uniform Short-Stay (Type C)',
    stayDuration: '90 days within any 180-day period',
    keyRequirementsOverview: 'BLS International submission, confirmed travel plan, 3-6 months bank statement, hotel reservations.',
    highlightNotice: 'Spain visa applications in India are processed through BLS International (not VFS).',
  },
  {
    id: 'dest-poland',
    name: 'Poland',
    slug: 'poland',
    group: 'schengen',
    flagCode: 'PL',
    visaStream: 'Schengen Uniform Short-Stay (Type C)',
    stayDuration: '90 days within any 180-day period',
    keyRequirementsOverview: 'e-Konsulat application form, travel medical insurance, hotel booking, salary slips, 3 months bank statements.',
    highlightNotice: 'Appointments secured through Polish consular portal / VFS.',
  },
  {
    id: 'dest-portugal',
    name: 'Portugal',
    slug: 'portugal',
    group: 'schengen',
    flagCode: 'PT',
    visaStream: 'Schengen Uniform Short-Stay (Type C)',
    stayDuration: '90 days within any 180-day period',
    keyRequirementsOverview: 'Portugal Schengen dossier, travel health insurance, proof of accommodation, bank statements, leave certificate.',
    highlightNotice: 'Processed through VFS Portugal.',
  },
  {
    id: 'dest-czech-republic',
    name: 'Czech Republic',
    slug: 'czech-republic',
    group: 'schengen',
    flagCode: 'CZ',
    visaStream: 'Schengen Uniform Short-Stay (Type C)',
    stayDuration: '90 days within any 180-day period',
    keyRequirementsOverview: 'Czech Schengen petition, roundtrip flight reservation, hotel voucher, 3 months bank statement, travel insurance.',
    highlightNotice: 'Submitted via VFS Czech Republic.',
  },
  {
    id: 'dest-greece',
    name: 'Greece',
    slug: 'greece',
    group: 'schengen',
    flagCode: 'GR',
    visaStream: 'Schengen Uniform Short-Stay (Type C)',
    stayDuration: '90 days within any 180-day period',
    keyRequirementsOverview: 'Schengen dossier, medical travel insurance, flight itinerary, island ferry/hotel bookings, bank statements.',
    highlightNotice: 'Handled via GVCW (Global Visa Center World) / designated centers in India.',
  },
  {
    id: 'dest-malta',
    name: 'Malta',
    slug: 'malta',
    group: 'schengen',
    flagCode: 'MT',
    visaStream: 'Schengen Uniform Short-Stay (Type C)',
    stayDuration: '90 days within any 180-day period',
    keyRequirementsOverview: 'Malta Schengen application, travel insurance, verifiable hotel accommodation, 3-6 months bank statement.',
    highlightNotice: 'Processed through VFS Malta.',
  },
  {
    id: 'dest-netherlands',
    name: 'Netherlands',
    slug: 'netherlands',
    group: 'schengen',
    flagCode: 'NL',
    visaStream: 'Schengen Uniform Short-Stay (Type C)',
    stayDuration: '90 days within any 180-day period',
    keyRequirementsOverview: 'Dutch Schengen petition, €30,000 health insurance, day-to-day itinerary, bank statements, employment verification.',
    highlightNotice: 'Processed through VFS Netherlands.',
  },

  // UAE (United Arab Emirates)
  {
    id: 'dest-uae',
    name: 'United Arab Emirates',
    slug: 'uae',
    group: 'uae',
    flagCode: 'AE',
    visaStream: 'Tourist Entry Permit (30 or 60 Days)',
    stayDuration: '30 or 60 days (Single or Multiple Entry)',
    keyRequirementsOverview: 'Clear passport bio-data scan (6+ mo validity), passport photo with white background, confirmed flight booking, hotel voucher or host proof.',
    highlightNotice: 'Processed through GDRFA (Dubai) or ICP (Abu Dhabi / Northern Emirates). Indian citizens with valid US B1/B2, UK, or EU visa/PR may qualify for UAE Visa on Arrival.',
  },
];

/**
 * 6 Applicant Categories
 * Extracted from client poster and vetted with official consular standards.
 */
export const applicantCategories: ApplicantCategory[] = [
  {
    id: 'employed',
    title: 'Employed / Salaried Professionals',
    shortLabel: 'Employed',
    description: 'For individuals working in private companies, government departments, public sector undertakings, or registered institutions.',
    icon: 'briefcase',
    documentGuidance: [
      {
        title: 'Employment Confirmation & Leave Sanction Letter',
        detail: 'Official letter on employer letterhead stating your job title, date of joining, current monthly salary, and explicitly approved leave dates with date of expected return.',
        conditionalNotice: 'Must include company contact details and signature of authorized HR/director.',
      },
      {
        title: 'Salary Slips (Recent 3 to 6 Months)',
        detail: 'Monthly pay slips stamped and signed by the employer or digitally authenticated.',
        conditionalNotice: 'The net salary shown on pay slips must correspond directly to bank statement credit entries.',
      },
      {
        title: 'Salary Bank Account Statement',
        detail: 'Active bank statement (3 to 6 months depending on consulate) with official bank branch seal and signature.',
        conditionalNotice: 'Consular officers look for regular salary credits and realistic balance maintaining daily expenses.',
      },
      {
        title: 'Income Tax Returns (ITR-V) / Form 16',
        detail: 'Past 2 to 3 financial years ITR acknowledgements showing annual taxable income.',
        conditionalNotice: 'If exempt from tax or newly employed, provide Form 16 or employer tax deduction certificates.',
      },
    ],
    officialNote: 'Mandatory documentation periods vary: Germany and France typically mandate 3 months of bank statements, whereas the UK and Canada prefer 6 months. Always confirm exact consulate criteria before submission.',
  },
  {
    id: 'self-employed',
    title: 'Self-Employed / Business Owners & Directors',
    shortLabel: 'Self-Employed',
    description: 'For proprietors, partners, company directors, freelancers, and independent practicing professionals.',
    icon: 'building-office',
    documentGuidance: [
      {
        title: 'Business Registration & Operating Proof',
        detail: 'GST Registration Certificate, Certificate of Incorporation (MCA), Partnership Deed, Udyam MSME Certificate, or Trade License.',
        conditionalNotice: 'Must demonstrate active, legitimate business operations in India.',
      },
      {
        title: 'Current Account & Personal Savings Bank Statements',
        detail: '6 months of bank statements for both the business current account and the personal savings account, verified by bank seal.',
        conditionalNotice: 'Reflects operating revenue and personal liquidity for trip funding.',
      },
      {
        title: 'Business & Personal Income Tax Returns (ITR)',
        detail: 'Past 2 to 3 years ITR-V with Computation of Income and audited balance sheets where statutory audits apply.',
        conditionalNotice: 'Establishes personal economic ties and steady annual business profitability.',
      },
      {
        title: 'Company Letterhead & Cover Letter',
        detail: 'Cover letter on official company letterhead explaining business nature, travel purpose, and self-sanctioned leave.',
      },
    ],
    officialNote: 'Clear separation between business turnover and personal disposable income is scrutinized by consular officers to prevent commercial misrepresentation.',
  },
  {
    id: 'farmer',
    title: 'Agricultural / Farmers & Landholders',
    shortLabel: 'Farmer',
    description: 'For agricultural landholders, farming families, and rural applicants in Rajasthan, Punjab, and across India.',
    icon: 'tractor',
    documentGuidance: [
      {
        title: 'Land Ownership Records (Jamabandi / Fard / Khasra-Khatauni)',
        detail: 'Official land revenue documentation certified by the local Tehsildar or Patwari proving agricultural acreage and registered ownership.',
        conditionalNotice: 'Key evidence of immovable property ties establishing strong intent to return to India.',
      },
      {
        title: 'Grain / Crop Sale Receipts (J-Forms)',
        detail: 'Authorized J-Forms issued by the Krishi Upaj Mandi Samiti (Agriculture Produce Market Committee) documenting produce sale proceeds over recent seasons.',
        conditionalNotice: 'Provides verifiable evidence of seasonal agricultural income.',
      },
      {
        title: 'Agricultural Bank Account & KCC Statements',
        detail: '6 to 12 months bank statement showing deposit of mandi proceeds and active Kisan Credit Card (KCC) account where applicable.',
      },
      {
        title: 'Self-Declaration of Agricultural Income',
        detail: 'Affidavit or revenue certificate summarizing agricultural crops (wheat, mustard, cotton) and annual agricultural earnings exempt from central income tax under Section 10(1).',
      },
    ],
    officialNote: 'Consular officers in Chandigarh and New Delhi are familiar with J-Forms and Jamabandi records. Proper certified translation into English with an authorized affidavit ensures smooth evaluation.',
  },
  {
    id: 'student',
    title: 'Students & Minors',
    shortLabel: 'Student',
    description: 'For school pupils, college students, and university scholars traveling for tourism, holidays, or educational exchange.',
    icon: 'academic-cap',
    documentGuidance: [
      {
        title: 'School / College Bonafide Certificate & Leave Approval',
        detail: 'Formal certificate on institutional letterhead certifying enrolled status, current semester/class, and approval of leave during travel dates.',
        conditionalNotice: 'Confirms active ongoing studies in India to which the student will return.',
      },
      {
        title: 'Valid Student Identity Card',
        detail: 'Copy of valid institutional ID card with current academic year enrollment.',
      },
      {
        title: 'Parental Sponsorship & Financial Undertaking',
        detail: 'Affidavit of Sponsorship from parent or legal guardian committing to fund all travel, lodging, and emergency medical costs.',
        conditionalNotice: 'Must be accompanied by sponsor’s 6 months bank statement, ITRs, and employment/business proof.',
      },
      {
        title: 'Notarized Parental NOC (For Minors)',
        detail: 'Notarized No Objection Certificate (NOC) signed by both parents if the minor travels with one parent or an authorized adult guardian, plus passport copies of both parents.',
      },
    ],
    officialNote: 'Minors traveling without both parents are subject to strict child protection verification across all Schengen, UK, and North American consulates.',
  },
  {
    id: 'family-sponsored',
    title: 'Family-Sponsored Applicants / Homemakers & Dependents',
    shortLabel: 'Family-Sponsored',
    description: 'For non-earning spouses, elderly parents, or dependent family members whose travel is funded by an immediate family member.',
    icon: 'users',
    documentGuidance: [
      {
        title: 'Sponsorship Declaration & Affidavit of Support',
        detail: 'Notarized affidavit from the sponsoring family member (spouse, parent, or son/daughter) accepting complete financial responsibility for the trip.',
      },
      {
        title: 'Proof of Relationship',
        detail: 'Government-issued records establishing family relationship: marriage certificate, birth certificate, or passport showing parents/spouse name.',
      },
      {
        title: 'Sponsor’s Financial & Income Proof',
        detail: 'Sponsor’s employment letter, salary slips, 6 months bank statement, and past 2 years ITR-V demonstrating adequate discretionary funds.',
      },
      {
        title: 'Applicant Ties & Domestic Circumstances',
        detail: 'Evidence of family roots in India (dependent children remaining at home, joint family property ownership, or community responsibilities).',
      },
    ],
    officialNote: 'Sponsorship from immediate family (spouse, parent, child) is treated with credibility. Third-party sponsorship from distant relatives or non-family friends requires stringent proof of relationship and rationale.',
  },
  {
    id: 'invited-by-resident',
    title: 'Visiting Friends & Relatives (VFR) / Invited by Resident',
    shortLabel: 'Invited by Resident',
    description: 'For travelers visiting friends, family members, or business associates legally residing in the destination country.',
    icon: 'envelope-open',
    documentGuidance: [
      {
        title: 'Formal Invitation Letter from Host',
        detail: 'Letter signed by the host detailing relationship to applicant, travel dates, trip purpose, and whether lodging and food are provided.',
        conditionalNotice: 'Must include host full address, contact details, and employer information.',
      },
      {
        title: 'Host Legal Status Proof',
        detail: 'Copy of host’s foreign passport bio page, permanent residency (PR card), or valid work/study permit visa vignette.',
      },
      {
        title: 'Host Proof of Accommodation',
        detail: 'Tenancy agreement, utility bill, council tax statement, or property title proving adequate room for guests.',
      },
      {
        title: 'Official Municipal Sponsorship Form (Where Required)',
        detail: 'Formal city/immigration sponsorship declaration where mandated by the destination government (e.g. Verpflichtungserklärung in Germany, Attestation d’accueil in France, Form 1188 in Australia).',
      },
    ],
    officialNote: 'An invitation letter does not replace the applicant’s own need to demonstrate sufficient reasons to return to India. Both host credibility and applicant ties are weighed.',
  },
];

/**
 * UAE / Dubai Specific Guidance Breakdown
 * Sourced directly from client poster with official GDRFA/ICP regulatory qualifications.
 */
export const uaePreparationGuidance = {
  headline: 'United Arab Emirates (Dubai & Abu Dhabi) Tourist Visa Preparation',
  overview: 'The client-supplied poster provides a straightforward documentation checklist for UAE entry permits. In accordance with UAE GDRFA and ICP immigration frameworks, Visa Convention organizes your submission file with verified parameters.',
  documents: [
    { name: 'Original Passport Bio-Data Scan', note: 'Clear color scan of front and back pages; minimum 6 months validity from entry date.' },
    { name: 'Passport-Sized Photograph', note: 'Recent color photograph with plain white background (no shadows, head straight).' },
    { name: 'Confirmed Return / Onward Flight Itinerary', note: 'Verifiable airline booking showing scheduled departure from the UAE.' },
    { name: 'Hotel Reservation / Host Address Proof', note: 'Confirmed hotel voucher or UAE resident host’s Ejari tenancy contract.' },
    { name: 'PAN Card & Aadhaar Card', note: 'Standard identity and KYC documentation for Indian travelers and foreign exchange regulations.' },
    { name: 'Travel Medical & Health Insurance', note: 'Mandatory coverage covering emergency medical treatment and COVID hospitalization in the UAE.' },
  ],
  regulatoryNotice: 'Tourist entry permits for Dubai and Abu Dhabi are processed electronically through immigration portals (GDRFA / ICP). Single-entry (30 or 60 days) and multiple-entry variants are available. Processing times typically range between 2 to 5 working days.',
  disclaimer: 'Visa approval is at the sole discretion of the UAE immigration authorities. Visa Convention facilitates administrative application filing without guaranteeing entry.',
};

/**
 * Schengen Regulatory Facts
 * EU Visa Code (Regulation EC No 810/2009)
 */
export const schengenFacts = {
  coverageTitle: 'Schengen Area Unified Visa Protocol',
  insuranceRule: 'Under Article 15 of the EU Visa Code, applicants must hold valid travel medical insurance covering any expenses which might arise in connection with repatriation for medical reasons, urgent medical attention, or emergency hospital treatment. The minimum coverage must be €30,000 (Euro), valid across all Schengen member states for the entire duration of the stay.',
  evidenceRule: 'Financial evidence periods differ by destination country: the German Embassy in India specifically requests 3 months of bank statements, whereas several other Schengen consulates request 6 months. We customize your file to the specific destination consulate representing your main travel purpose.',
  coverageCount: 'Visa Convention provides advisory support for the 16 primary Schengen destinations requested by regional travelers: Germany, France, Italy, Switzerland, Hungary, Norway, Finland, Austria, Iceland, Spain, Poland, Portugal, Czech Republic, Greece, Malta, and Netherlands. The full Schengen Area comprises 29 member states.',
};

/**
 * Tourist Visa FAQs
 */
export const touristFaqs: FAQItem[] = [
  {
    question: 'How much bank balance is required for a tourist visa?',
    answer: 'There is no universal fixed sum prescribed by embassies. Instead, consulates look for regular, transparent income patterns and sufficient disposable funds to cover your daily expenses, flights, and accommodation (typically INR 2.5 to 5 Lakhs for a 10 to 14-day European or UK trip). Large sudden unexplainable deposits just before filing are viewed with suspicion by visa officers.',
  },
  {
    question: 'Can farmers with agricultural income get tourist visas to Europe or the US?',
    answer: 'Yes. Thousands of farmers from Rajasthan and Punjab travel internationally every year. You do not need standard corporate salary slips; instead, we compile your file using certified Land Ownership Records (Jamabandi/Fard), Krishi Mandi J-Forms, and agricultural bank statements with proper English translations to demonstrate substantial domestic ties and income.',
  },
  {
    question: 'What is the most common reason for tourist visa rejection?',
    answer: 'The most frequent refusal reason is failure to demonstrate strong economic and social ties to India (e.g. under Section 214(b) for the US, or genuine visitor grounds under the Schengen Visa Code). Officers must be satisfied that you have compelling personal, professional, or property reasons that guarantee your return to India upon trip conclusion.',
  },
  {
    question: 'Does Visa Convention provide dummy tickets or fabricated hotel bookings?',
    answer: 'Never. Fabricated travel reservations or bogus PNRs can lead to immediate visa refusal and potential misrepresentation bans under immigration law. We coordinate genuine, authorized flight reservation holds and verifiable hotel vouchers through registered global reservation networks.',
  },
  {
    question: 'How far in advance should I apply for a tourist visa?',
    answer: 'For Schengen visas, applications can be submitted up to 6 months before your scheduled travel date, and no later than 15 calendar days prior. For the UK and Canada, applying 6 to 12 weeks in advance is recommended. For the United States, appointment wait times vary by consulate; planning several months in advance is essential.',
  },
];
