import type { WorkDestination, WorkOccupation, FAQItem } from '../types';

/**
 * Visa Convention — Work Visa & Permit Documentation Service Data
 * 
 * Source Material: Client Service Poster (November 2026)
 * Vetted & Reconciled Against:
 * - Emigration Act, 1983 (Ministry of External Affairs, Government of India)
 * - Overseas Employment & Recruiting Agent (RA) Regulatory Compliance
 * - Gulf Cooperation Council (GCC) Labor & Residency Laws (MOHRE, LMRA, Qiwa)
 * - European Union National Work Permit Directives & EU Blue Card
 */

/**
 * Mandatory Statutory Regulatory Disclosure
 * Prominently displayed to ensure absolute compliance with Indian and foreign labor laws.
 */
export const statutoryWorkDisclaimer = {
  title: 'STATUTORY REGULATORY DISCLOSURE & ADVISORY SCOPE',
  lawReference: 'Emigration Act, 1983 — Ministry of External Affairs, Government of India',
  notice: 'Visa Convention operates strictly as an independent visa documentation, paperwork compliance, and procedural advisory service. We are NOT an overseas recruitment agency and DO NOT recruit workers, broker job placements, or sell employment offers.',
  rules: [
    'Visa Convention does not guarantee job placement, foreign salaries, overtime payments, or employment contracts.',
    'Under Indian law (Emigration Act, 1983), overseas recruitment must be conducted exclusively through registered Recruiting Agents (RAs) holding valid licenses from the Ministry of External Affairs or through direct government-to-government bilateral agreements.',
    'We assist candidates who ALREADY hold a genuine, verified job offer or sponsorship from an authorized employer abroad, or who qualify independently for points-tested immigration streams.',
    'We charge advisory fees exclusively for visa documentation processing, dossier organization, and appointment facilitation — never placement commissions or recruitment fees.',
  ],
};

/**
 * 14 Distinct Work Visa Destinations
 * Classified by region with single national entry for UAE (Dubai & Abu Dhabi).
 */
export const workDestinations: WorkDestination[] = [
  // Gulf Region (5 Countries)
  {
    id: 'work-uae',
    country: 'United Arab Emirates',
    slug: 'uae',
    region: 'Gulf',
    flagCode: 'AE',
    locations: ['Dubai', 'Abu Dhabi', 'Sharjah'],
    permitAuthority: 'Ministry of Human Resources and Emiratisation (MOHRE) & GDRFA / ICP',
    advisoryNote: 'Requires an official MOHRE employment quota approval, electronic work offer contract, and entry permit prior to residence visa stamping.',
  },
  {
    id: 'work-bahrain',
    country: 'Bahrain',
    slug: 'bahrain',
    region: 'Gulf',
    flagCode: 'BH',
    permitAuthority: 'Labour Market Regulatory Authority (LMRA)',
    advisoryNote: 'Work permits are issued through LMRA under approved company CR numbers, followed by GAMCA medical clearance and residence permit endorsement.',
  },
  {
    id: 'work-oman',
    country: 'Oman',
    slug: 'oman',
    region: 'Gulf',
    flagCode: 'OM',
    permitAuthority: 'Ministry of Labour & Royal Oman Police (ROP)',
    advisoryNote: 'Employer must hold an approved labor clearance (manpower clearance) and issue a verified employment visa for private sector contracts.',
  },
  {
    id: 'work-kuwait',
    country: 'Kuwait',
    slug: 'kuwait',
    region: 'Gulf',
    flagCode: 'KW',
    permitAuthority: 'Public Authority for Manpower (PAM) & Ministry of Interior',
    advisoryNote: 'Private sector employment operates under Article 18 work visas, requiring PAM work permits, authenticated degree/trade certificates, and PCC.',
  },
  {
    id: 'work-saudi-arabia',
    country: 'Saudi Arabia',
    slug: 'saudi-arabia',
    region: 'Gulf',
    flagCode: 'SA',
    permitAuthority: 'Ministry of Human Resources and Social Development (Qiwa Platform)',
    advisoryNote: 'Requires digital employment contract authentication via Qiwa platform, professional accreditation, GAMCA medical, and Saudi embassy visa stamping.',
  },

  // Europe Region (7 Countries)
  {
    id: 'work-greece',
    country: 'Greece',
    slug: 'greece',
    region: 'Europe',
    flagCode: 'GR',
    permitAuthority: 'Ministry of Migration and Asylum / Decentralized Administrations',
    advisoryNote: 'National D-type work visa based on employer-approved labor market authorization (Metaklisi procedure) or EU seasonal employment frameworks.',
  },
  {
    id: 'work-slovenia',
    country: 'Slovenia',
    slug: 'slovenia',
    region: 'Europe',
    flagCode: 'SI',
    permitAuthority: 'Employment Service of Slovenia (ZRSZ) & Administrative Units',
    advisoryNote: 'Single Work and Residence Permit (Enotno dovoljenje) issued under labour market shortage testing for verified industrial and technical positions.',
  },
  {
    id: 'work-latvia',
    country: 'Latvia',
    slug: 'latvia',
    region: 'Europe',
    flagCode: 'LV',
    permitAuthority: 'Office of Citizenship and Migration Affairs (PMLP)',
    advisoryNote: 'Requires an official employer invitation approved by the State Employment Agency (NVA) followed by a National Long-Stay (D) visa application.',
  },
  {
    id: 'work-romania',
    country: 'Romania',
    slug: 'romania',
    region: 'Europe',
    flagCode: 'RO',
    permitAuthority: 'General Inspectorate for Immigration (IGI)',
    advisoryNote: 'Employer secures a work authorization notice (Aviz de munca) from IGI under annual foreign worker quotas, enabling Romanian D/AM work visa filing.',
  },
  {
    id: 'work-slovakia',
    country: 'Slovakia',
    slug: 'slovakia',
    region: 'Europe',
    flagCode: 'SK',
    permitAuthority: 'Central Office of Labour, Social Affairs and Family (UPSVaR)',
    advisoryNote: 'Single permit (temporary residence for employment) issued on confirmation of vacant job positions matching technical qualifications.',
  },
  {
    id: 'work-portugal',
    country: 'Portugal',
    slug: 'portugal',
    region: 'Europe',
    flagCode: 'PT',
    permitAuthority: 'AIMA (Agency for Integration, Migration and Asylum)',
    advisoryNote: 'D1 visa for subordinate work requires a valid employment contract or promise of contract with an authorized Portuguese enterprise.',
  },
  {
    id: 'work-poland',
    country: 'Poland',
    slug: 'poland',
    region: 'Europe',
    flagCode: 'PL',
    permitAuthority: 'Voivodeship Office (Urzad Wojewodzki)',
    advisoryNote: 'Requires an official Voivode Work Permit (Zezwolenie na prace, Typ A) issued to the Polish employer before National D-06 visa filing.',
  },

  // Other Global Destinations (2 Countries)
  {
    id: 'work-israel',
    country: 'Israel',
    slug: 'israel',
    region: 'Other',
    flagCode: 'IL',
    permitAuthority: 'Population and Immigration Authority (PIBA)',
    advisoryNote: 'B-1 foreign expert / specialist work visa issued strictly under Ministry of Interior quotas and direct government bilateral agreements.',
  },
  {
    id: 'work-uzbekistan',
    country: 'Uzbekistan',
    slug: 'uzbekistan',
    region: 'Other',
    flagCode: 'UZ',
    permitAuthority: 'Agency of External Labor Migration',
    advisoryNote: 'Work permit confirmation for specialized engineering, construction, and technical project management roles.',
  },
];

/**
 * 12 Occupational Focus Areas
 * Sourced from the client poster and designated as occupational guidance domains.
 * Not advertised as live vacancies.
 */
export const occupationalCategories: WorkOccupation[] = [
  {
    id: 'mason',
    title: 'Mason / Bricklayer',
    sector: 'Trades & Construction',
    description: 'Skilled block-laying, plastering, stone masonry, and civil structural work across commercial and residential developments.',
    sampleRoles: ['Block Mason', 'Plasterer', 'Tile Mason', 'Stone Setter'],
    documentReadiness: ['Trade experience certificate', 'Civil contractor reference letters', 'Passport bio pages', 'Police Clearance Certificate (PCC)'],
  },
  {
    id: 'welder',
    title: 'Welder / Fabricator',
    sector: 'Trades & Construction',
    description: 'Arc, MIG, TIG, and structural welding for pipelines, steel frames, industrial infrastructure, and offshore installations.',
    sampleRoles: ['MIG Welder', 'TIG Welder', '6G Pipe Welder', 'Structural Fabricator'],
    documentReadiness: ['Welding certification (e.g. AWS, ISO 9606, or ITI diploma)', 'Trade test records', 'Visual acuity medical fitness test'],
  },
  {
    id: 'driver',
    title: 'Driver / Transport Operator',
    sector: 'Logistics & Warehousing',
    description: 'Heavy and light commercial vehicle driving, passenger transit, construction logistics, and fleet operations.',
    sampleRoles: ['Heavy Duty Driver (Trailer/Truck)', 'Light Duty Driver', 'Bus Operator', 'Delivery Driver'],
    documentReadiness: ['Valid Indian commercial driving license (minimum 3 years)', 'GCC driving license (if previous Gulf experience)', 'Clean driving record abstract'],
  },
  {
    id: 'security-guard',
    title: 'Security Guard / Surveillance Staff',
    sector: 'Security & Facilities',
    description: 'Physical premise security, access control, crowd management, CCTV monitoring, and corporate asset protection.',
    sampleRoles: ['Commercial Security Guard', 'Event Security Officer', 'CCTV Controller', 'Site Patrol Guard'],
    documentReadiness: ['Minimum height and physical fitness certificate', 'Police Clearance Certificate (PCC)', 'Basic English communication proficiency'],
  },
  {
    id: 'painter',
    title: 'Painter / Finishing Specialist',
    sector: 'Trades & Construction',
    description: 'Interior and exterior architectural painting, industrial protective coatings, spray painting, and surface preparation.',
    sampleRoles: ['Construction Painter', 'Spray Painter', 'Industrial Coating Applicator', 'Wallpaper Specialist'],
    documentReadiness: ['Trade experience verification', 'Employer reference letters', 'Medical fitness clearance'],
  },
  {
    id: 'carpenter',
    title: 'Carpenter / Shuttering Specialist',
    sector: 'Trades & Construction',
    description: 'Formwork shuttering for concrete framing, interior joinery, furniture installation, and structural woodworking.',
    sampleRoles: ['Shuttering Carpenter', 'Finishing / Joinery Carpenter', 'Furniture Assembler', 'Timber Framer'],
    documentReadiness: ['ITI Carpentry diploma or 3+ years documented site experience', 'Employer recommendation letters'],
  },
  {
    id: 'helper',
    title: 'General Helper / Site Assistant',
    sector: 'Trades & Construction',
    description: 'General labor assistance, material handling, site cleanup, and foundational support across construction and civil projects.',
    sampleRoles: ['Construction Helper', 'Warehouse Helper', 'Workshop Assistant', 'Civil Laborer'],
    documentReadiness: ['Passport with 2+ years validity', 'PCC clearance', 'GAMCA medical certification (for Gulf)'],
  },
  {
    id: 'warehouse-staff',
    title: 'Warehouse Staff / Material Handler',
    sector: 'Logistics & Warehousing',
    description: 'Inventory handling, order picking, packing, palletizing, and computerized logistics management in global fulfillment centers.',
    sampleRoles: ['Forklift Operator', 'Order Picker', 'Inventory Associate', 'Packaging Assistant'],
    documentReadiness: ['Forklift operator certification where applicable', '10th/12th education certificate', 'Basic computer/barcode scanner literacy'],
  },
  {
    id: 'steel-fixer',
    title: 'Steel Fixer / Rebar Specialist',
    sector: 'Trades & Construction',
    description: 'Reinforced concrete rebar installation, steel cage tying, beam alignment, and civil engineering foundation assembly.',
    sampleRoles: ['Rebar Steel Fixer', 'Reinforcement Assembler', 'Structural Ironworker'],
    documentReadiness: ['Documented civil engineering project experience', 'Trade test certification', 'Physical fitness report'],
  },
  {
    id: 'pipe-fitter',
    title: 'Pipe Fitter / Plumber',
    sector: 'Trades & Construction',
    description: 'Industrial and commercial piping assembly, high-pressure line installation, sanitary plumbing, and isometric drawing reading.',
    sampleRoles: ['Industrial Pipe Fitter', 'Plumber', 'Hydrostatic Testing Technician', 'Sanitary Installer'],
    documentReadiness: ['ITI Plumbing/Fitter certificate', 'Blueprint reading ability', 'Work history documentation'],
  },
  {
    id: 'operator',
    title: 'Equipment Operator / Heavy Machinery',
    sector: 'Technical & Equipment',
    description: 'Operating earthmoving equipment, excavators, cranes, loaders, bulldozers, and specialized industrial plant machinery.',
    sampleRoles: ['Excavator Operator', 'Crane Operator (Tower/Mobile)', 'JCB Operator', 'Plant Technician'],
    documentReadiness: ['Specialized heavy machinery operator license', 'Safety certification', 'Logbook of verified operating hours'],
  },
  {
    id: 'electrician',
    title: 'Electrician / Electrical Technician',
    sector: 'Technical & Equipment',
    description: 'Installation, wiring, maintenance, and troubleshooting of electrical panels, commercial distribution boards, and industrial systems.',
    sampleRoles: ['Building Electrician', 'Industrial Electrician', 'Panel Board Wireman', 'Maintenance Electrician'],
    documentReadiness: ['ITI Electrical wireman license / diploma', 'Demonstrated understanding of electrical safety codes', 'PCC and medical clearance'],
  },
];

/**
 * 6 Critical Factors Every Worker Must Evaluate
 * Converting the poster's promotional benefit claims into an objective, protective checklist.
 */
export const employmentEvaluationFactors = [
  {
    title: 'Legitimate Written Employment Contract',
    importance: 'The single most vital protection',
    detail: 'Never travel on an informal promise or a tourist visa. You must receive a signed, legally registered contract or electronic offer letter approved by the destination country’s ministry of labour (e.g. MOHRE in UAE, Qiwa in Saudi Arabia, Aviz de munca in Romania).',
  },
  {
    title: 'Basic Salary vs. Allowances',
    importance: 'Financial certainty',
    detail: 'Carefully verify the guaranteed basic wage versus variable allowances. Overtime, production bonuses, and tips cannot be guaranteed and depend on employer operational needs. Ensure the basic monthly salary covers your financial commitments.',
  },
  {
    title: 'Overtime Policy & Calculation',
    importance: 'Fair compensation',
    detail: 'Examine whether overtime is formally stipulated in the employment contract according to national labor statutes (typically 1.25x or 1.5x regular hourly rates for weekday overtime and 2.0x for rest days or public holidays).',
  },
  {
    title: 'Accommodation & Daily Transportation',
    importance: 'Living conditions and expenses',
    detail: 'Determine whether housing is employer-provided (camp, shared apartment) or if a housing allowance is paid in lieu. Confirm that company transportation to and from the worksite is explicitly included in the contract terms.',
  },
  {
    title: 'Health Insurance & Workmen’s Compensation',
    importance: 'Medical security abroad',
    detail: 'Confirm that the sponsoring enterprise provides comprehensive statutory health insurance and workmen’s injury compensation from the date of arrival in the host nation.',
  },
  {
    title: 'Permit & Sponsoring Entity Legitimacy',
    importance: 'Legal status & anti-fraud protection',
    detail: 'Verify that the sponsoring employer is actively licensed and solvent with local authorities. Visa Convention audits employer documentation to protect candidates from bogus shell companies and unverified middlemen.',
  },
];

/**
 * Scope of Visa Convention Work Visa Assistance
 */
export const workVisaAssistanceScope = [
  {
    stepNumber: 1,
    title: 'Job Offer & Sponsorship Document Audit',
    description: 'Thorough review of your foreign job offer letter, employer sponsorship approval, and employment contract to ensure conformity with immigration prerequisites.',
  },
  {
    stepNumber: 2,
    title: 'Educational & Trade Credential Verification',
    description: 'Guiding trade test certifications, ITI/diploma apostilles via the Ministry of External Affairs (MEA), and international credential evaluations.',
  },
  {
    stepNumber: 3,
    title: 'Police Clearance (PCC) & Medical Coordination',
    description: 'Structuring your appointment for the official Police Clearance Certificate (PCC) via the Regional Passport Office and coordinating GAMCA / panel clinic medical examinations.',
  },
  {
    stepNumber: 4,
    title: 'Visa Dossier Preparation & Embassy Submission',
    description: 'Meticulous preparation of visa petitions, embassy application forms, biometrics appointment scheduling, and verification tracking.',
  },
];

/**
 * Work Visa FAQs
 */
export const workFaqs: FAQItem[] = [
  {
    question: 'Does Visa Convention guarantee foreign jobs or arrange overseas interviews?',
    answer: 'No. Visa Convention is an independent education and visa documentation advisory, not a manpower recruitment company. We assist workers, tradespeople, and professionals who already hold a verified foreign job offer or employer sponsorship with the complex visa and regulatory documentation required to travel lawfully.',
  },
  {
    question: 'Can I travel abroad on a tourist visa and convert it to a work visa?',
    answer: 'Traveling on a tourist visa with the intention of working is illegal in almost all destinations and exposes workers to exploitation, wage withholding, arrest, and deportation. In the UAE, while legal status changes are permissible under strict MOHRE rules, working prior to the issuance of a formal work permit remains prohibited. In Europe, work permits must always be secured prior to arrival.',
  },
  {
    question: 'What is GAMCA medical examination for Gulf countries?',
    answer: 'GAMCA (now Wafid) is an association of approved medical diagnostic centers authorized by the health ministries of GCC countries (UAE, Saudi Arabia, Oman, Bahrain, Kuwait, Qatar). Candidates traveling for employment must undergo a mandatory medical screening (blood tests, chest X-rays) at an authorized center before their work visa is stamped.',
  },
  {
    question: 'How do I know if my foreign job offer is genuine?',
    answer: 'A genuine job offer will always be backed by an official government-issued permit or sponsorship license (e.g. MOHRE quota in UAE, Qiwa contract in Saudi Arabia, Urzad Wojewodzki permit in Poland). Warning signs of scams include requests for money sent to personal bank accounts, interview offers without trade tests, and promises of high salaries with zero qualifications.',
  },
  {
    question: 'Are accommodation and flight tickets provided free by foreign employers?',
    answer: 'This depends entirely on the employer, the destination country, and the specific employment contract. Many Gulf construction and technical enterprises provide company accommodation and bachelor barracks, whereas in Europe workers typically pay for shared accommodation or receive an all-inclusive salary. Always review the written contract.',
  },
];
