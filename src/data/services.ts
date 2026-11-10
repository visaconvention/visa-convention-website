import type { Service } from '../types';

export const servicesData: Service[] = [
  {
    id: 'study-visa',
    slug: 'study-visa',
    title: 'Study Visa Guidance',
    subtitle: 'Strategic Admissions & Visa Filing for 35+ Global Destinations',
    shortDescription: 'Comprehensive guidance from university course selection and SOP crafting to financial documentation and mock visa interviews.',
    iconName: 'GraduationCap',
    targetAudience: [
      'High school students seeking undergraduate degrees overseas',
      'Bachelor degree holders applying for Master’s & PG Diplomas',
      'Career switchers seeking accredited international certifications',
    ],
    keyOfferings: [
      'Personalized university and course eligibility matching',
      'Academic statement of purpose (SOP) & resume review',
      'Scholarship application guidance and financial profiling',
      'End-to-end embassy visa application filing',
      'Biometric appointment scheduling and visa interview briefing',
    ],
    stepByStepProcess: [
      { stepNumber: 1, title: 'Profile Evaluation', description: 'Review academic records, backlogs, test scores (IELTS/PTE/TOEFL), and financial viability.' },
      { stepNumber: 2, title: 'Shortlisting & Application', description: 'Select 3–5 institutions matching your budget and academic goals, then submit formal admission files.' },
      { stepNumber: 3, title: 'Offer Letter & Acceptance', description: 'Secure conditional or unconditional offer letters and fulfill university acceptance prerequisites.' },
      { stepNumber: 4, title: 'Financial & Visa Dossier', description: 'Organize required proof of funds, sponsorship affidavits, and official visa application forms.' },
      { stepNumber: 5, title: 'Filing & Pre-Departure', description: 'Submit visa petition to the designated consulate, monitor processing, and complete travel briefing upon approval.' },
    ],
    eligibilityChecklist: [
      'Recognized secondary school or undergraduate degree transcripts',
      'Valid English language test scores (IELTS / PTE / TOEFL / Duolingo where accepted)',
      'Valid passport with at least 18 months validity remaining',
      'Verifiable financial proof covering tuition and living expenses as required by host nation',
    ],
    disclaimer: 'Visa issuance is subject strictly to immigration authorities. Visa Convention facilitates honest, diligent documentation without guaranteeing embassy outcomes.',
    faqs: [
      {
        question: 'When should I begin my study abroad application process?',
        answer: 'We recommend starting 8 to 12 months before your intended intake to allow adequate time for language testing, university offer issuance, and embassy visa processing.'
      },
      {
        question: 'Can I apply for scholarships through Visa Convention?',
        answer: 'Yes, our counselors assist in identifying merit-based and early-application entrance scholarships offered directly by institutions.'
      }
    ],
    publicationStatus: 'published',
  },
  {
    id: 'mbbs',
    slug: 'mbbs',
    title: 'MBBS Abroad Admissions',
    subtitle: 'Accredited Medical Degrees in NMC & WHO Recognized International Faculties',
    shortDescription: 'Guidance for medical aspirants seeking English-medium MBBS degrees abroad with transparent fee structures and global clinical recognition.',
    iconName: 'Stethoscope',
    targetAudience: [
      'NEET-qualified candidates exploring cost-effective international medical education',
      'Students targeting top government and state medical universities across Europe and Asia',
    ],
    keyOfferings: [
      'Guidance for universities recognized by NMC (India) and WHO directory',
      '100% English-medium curriculum verification',
      'Direct admissions without capitation fees or donations',
      'Hostel and Indian dining facility verification',
      'FMGE / NExT screening exam orientation support',
    ],
    stepByStepProcess: [
      { stepNumber: 1, title: 'Eligibility & NEET Check', description: 'Verify 10+2 PCB aggregate criteria (50% general / 40% reserved) and valid NEET scorecard.' },
      { stepNumber: 2, title: 'University Selection', description: 'Compare university infrastructure, clinical hospital beds, and living costs.' },
      { stepNumber: 3, title: 'Ministry Approval & LOA', description: 'Procure formal ministry admission permit and university letter of acceptance.' },
      { stepNumber: 4, title: 'Student Visa Filing', description: 'Submit medical fitness certificate, apostilled documents, and visa application.' },
      { stepNumber: 5, title: 'Airport Departure & Arrival', description: 'Group travel coordination and campus orientation support.' },
    ],
    eligibilityChecklist: [
      'Minimum 50% aggregate in Physics, Chemistry & Biology (PCB) in 10+2',
      'Qualified score in the National Eligibility cum Entrance Test (NEET-UG)',
      'Valid passport and apostilled educational certificates',
      'Authorized medical certificate including HIV negative report',
    ],
    disclaimer: 'Medical practice rights in India require passing the mandated National Exit Test (NExT) / screening examination conducted by the National Medical Commission (NMC).',
    faqs: [
      {
        question: 'Is NEET qualification mandatory for pursuing MBBS abroad?',
        answer: 'Yes, as per NMC regulations, Indian citizens aspiring to study medicine abroad must qualify in NEET-UG to be eligible to practice in India upon graduation.'
      }
    ],
    publicationStatus: 'published',
  },
  {
    id: 'phd',
    slug: 'phd',
    title: 'PhD Abroad Guidance',
    subtitle: 'Doctoral Research Proposals & Funded Assistantship Guidance',
    shortDescription: 'Specialized support for doctoral scholars, research proposal structuring, academic supervisor outreach, and scholarship applications.',
    iconName: 'BookOpen',
    targetAudience: [
      'Master’s degree holders seeking research fellowships and PhD placements',
      'Academics and industry professionals targeting terminal doctoral credentials',
    ],
    keyOfferings: [
      'Research proposal structuring and academic alignment',
      'Faculty supervisor identification and outreach briefing',
      'Graduate teaching assistantship (GTA) and research assistantship (GRA) guidance',
      'Postgraduate student visa documentation',
    ],
    stepByStepProcess: [
      { stepNumber: 1, title: 'Research Area Definition', description: 'Refine research hypotheses and academic literature review.' },
      { stepNumber: 2, title: 'Supervisor Matching', description: 'Identify active research groups and principal investigators matching your domain.' },
      { stepNumber: 3, title: 'Proposal & Formal Filing', description: 'Submit comprehensive research statement and formal university application.' },
      { stepNumber: 4, title: 'Funding & Visa', description: 'Confirm stipend/fellowship award letter and apply for researcher visa.' },
    ],
    eligibilityChecklist: [
      'Accredited Master’s degree with strong academic record',
      'Structured research proposal or writing sample',
      'Academic references from prior professors or research guides',
      'English proficiency certification where applicable',
    ],
    disclaimer: 'PhD admissions and supervisor acceptances depend entirely on faculty research fit and institutional peer review.',
    faqs: [
      {
        question: 'Are international PhD programs usually funded?',
        answer: 'Many doctoral programs in North America, Europe, and the UK offer funding via research assistantships, teaching assistantships, or external research grants.'
      }
    ],
    publicationStatus: 'published',
  },
  {
    id: 'tourist-visa',
    slug: 'tourist-visa',
    title: 'Tourist & Visitor Visa Assistance',
    subtitle: 'Meticulous Documentation & Itinerary Planning for Global Leisure & Family Visits',
    shortDescription: 'End-to-end guidance for tourist, visitor, and family visa applications, including documentation audit, cover letters, and appointment scheduling.',
    iconName: 'Compass',
    targetAudience: [
      'Individuals and families traveling for holidays and sightseeing',
      'Parents visiting students or family members living abroad',
      'Professionals attending conferences, trade shows, or business meetings',
    ],
    keyOfferings: [
      'Customized document checklist aligned with specific embassy guidelines',
      'Day-wise travel itinerary formulation and hotel voucher verification',
      'Sponsorship letters and financial standing documentation review',
      'Biometric and consular interview appointment scheduling',
      'Travel insurance guidance',
    ],
    stepByStepProcess: [
      { stepNumber: 1, title: 'Purpose Assessment', description: 'Identify appropriate visa category (Tourist, Family Visit, Business Visitor).' },
      { stepNumber: 2, title: 'Financial & Ties Audit', description: 'Verify strong ties to India (employment, business, property) and liquid funds.' },
      { stepNumber: 3, title: 'Dossier Preparation', description: 'Draft purpose statement, cover letter, and complete visa portal submissions.' },
      { stepNumber: 4, title: 'Appointment & Biometrics', description: 'Attend VFS / Embassy biometric submission with prepared files.' },
    ],
    eligibilityChecklist: [
      'Original passport with at least 6 months validity from return date',
      'Bank statements reflecting sufficient traveling funds and stability',
      'Income Tax Returns (ITR) for the past 2–3 financial years',
      'Proof of employment, leave sanction letter, or business registration',
    ],
    disclaimer: 'Consular officers hold complete discretion over tourist visa decisions. Visa Convention does not guarantee visa issuance.',
    faqs: [
      {
        question: 'How much bank balance is required for a tourist visa?',
        answer: 'Requirements vary by destination country and duration of stay. Generally, applicants should demonstrate liquid savings sufficient to cover flights, lodging, and daily expenses without financial distress.'
      }
    ],
    publicationStatus: 'published',
  },
  {
    id: 'work-visa',
    slug: 'work-visa',
    title: 'Work Visa & Permit Guidance',
    subtitle: 'Administrative Documentation & Compliance for Sponsored Foreign Employment',
    shortDescription: 'Guidance on work permit paperwork, points-based immigration eligibility, and regulatory compliance for candidates holding foreign job offers.',
    iconName: 'Briefcase',
    targetAudience: [
      'Professionals with confirmed foreign employer sponsorship or job offer',
      'Applicants eligible for points-tested skilled migration programs',
      'Spouses and dependents accompanying skilled foreign workers',
    ],
    keyOfferings: [
      'Immigration regulatory compliance review',
      'Educational credential assessment (ECA) guidance (WES, ACS, etc.)',
      'Employer compliance document review assistance',
      'Dependent and family reunification filing support',
    ],
    stepByStepProcess: [
      { stepNumber: 1, title: 'Sponsorship Review', description: 'Review employer sponsorship letter, LMIA, CoS, or regional nomination.' },
      { stepNumber: 2, title: 'Credential Verification', description: 'Organize verified diplomas, work experience letters, and language test records.' },
      { stepNumber: 3, title: 'Application Dossier', description: 'Compile legal forms, police clearance certificates, and medical examinations.' },
      { stepNumber: 4, title: 'Permit Submission', description: 'Submit through official immigration portals and track biometric clearance.' },
    ],
    eligibilityChecklist: [
      'Valid job offer or labor market sponsorship document from authorized overseas employer',
      'Recognized academic degrees and documented relevant work experience',
      'Police Clearance Certificate (PCC) from regional passport office',
      'Designated panel physician medical examination clearance',
    ],
    disclaimer: 'Visa Convention provides legal document filing assistance only. We are not an overseas recruitment agency and do not provide employment offers or sell jobs.',
    faqs: [
      {
        question: 'Does Visa Convention arrange jobs in foreign countries?',
        answer: 'No. Visa Convention is an educational and visa documentation advisory, not a manpower recruitment agency. We assist clients who already possess valid job offers or qualify for points-based skilled migration.'
      }
    ],
    publicationStatus: 'published',
  },
  {
    id: 'flight-booking',
    slug: 'flight-booking',
    title: 'Air Ticket & Flight Reservation Assistance',
    subtitle: 'Student Baggage Optimization & Verifiable Embassy Travel Itineraries',
    shortDescription: 'Dedicated flight itinerary reservation and ticket booking assistance with student discounts, extra baggage allowances, and transit route planning.',
    iconName: 'Plane',
    targetAudience: [
      'Students departing for global university semesters needing 40kg+ baggage allowance',
      'Visa applicants requiring verified itinerary reservations for embassy files',
      'International travelers seeking optimal transit connections and multi-city fares',
    ],
    keyOfferings: [
      'Student discount fares with verified airline student baggage allowances',
      'Genuine, verifiable flight reservations for visa interview documentation',
      'Optimal routing with comfortable layover times and transit visa guidance',
      'Date change, rescheduling, and cancellation coordination support',
    ],
    stepByStepProcess: [
      { stepNumber: 1, title: 'Route & Date Inquiry', description: 'Share travel dates, origin, destination, and baggage requirements.' },
      { stepNumber: 2, title: 'Option Comparison', description: 'Compare direct and 1-stop options across leading international carriers.' },
      { stepNumber: 3, title: 'Reservation / Ticketing', description: 'Hold genuine itinerary for visa file or issue confirmed e-tickets upon visa grant.' },
      { stepNumber: 4, title: 'Travel Checklist', description: 'Receive web check-in support, meal selection, and baggage allowance verification.' },
    ],
    eligibilityChecklist: [
      'Clear copy of valid passport bio page',
      'Approved student/travel visa (for ticket issuance)',
      'University student ID or offer letter (for student baggage allowance eligibility)',
    ],
    disclaimer: 'All reservation holds and flight tickets are issued through licensed global travel reservation systems. Visa Convention never issues fake PNRs or dummy tickets.',
    faqs: [
      {
        question: 'Can I get extra baggage allowance for my student flight?',
        answer: 'Yes, many international airlines provide 40kg to 46kg (2 pieces of 23kg) baggage allowance for international students holding a valid study visa.'
      }
    ],
    publicationStatus: 'published',
  },
  {
    id: 'additional-services',
    slug: 'additional-services',
    title: 'Additional Travel & Student Services',
    subtitle: 'Forex Cards, Travel Insurance, Student Housing & Pre-Departure Briefings',
    shortDescription: 'Essential auxiliary support ensuring comfortable travel, foreign currency cards, comprehensive student health coverage, and campus transition.',
    iconName: 'ShieldCheck',
    targetAudience: [
      'Students preparing for departure to international universities',
      'Families and leisure travelers requiring travel insurance and currency cards',
      'First-time international travelers needing transit and baggage guidance',
    ],
    keyOfferings: [
      'Student Forex card issuance with zero markup and multi-currency loading',
      'Overseas student health cover (OSHC) & mandatory travel insurance',
      'Vetted on-campus dorm and off-campus student accommodation guidance',
      'Pre-departure orientation on customs, immigration clearance, and local transit',
    ],
    stepByStepProcess: [
      { stepNumber: 1, title: 'Requirement Audit', description: 'Review host nation insurance mandates, luggage limits, and foreign exchange needs.' },
      { stepNumber: 2, title: 'Service Provider Comparison', description: 'Compare licensed forex providers, institutional insurance, and verified student housing.' },
      { stepNumber: 3, title: 'Activation & Dossier', description: 'Issue policy documents, card delivery, and accommodation confirmation vouchers.' },
      { stepNumber: 4, title: 'Pre-Departure Briefing', description: 'Attend personalized briefing covering airport transit, customs rules, and arrival steps.' },
    ],
    eligibilityChecklist: [
      'Valid passport and issued foreign visa',
      'University offer letter / admission confirmation (for student rates)',
      'Basic KYC documents for foreign exchange card issuance',
    ],
    disclaimer: 'Auxiliary financial and insurance products are facilitated through licensed third-party banking and insurance entities in compliance with RBI regulations.',
    faqs: [
      {
        question: 'Is student health insurance mandatory for studying abroad?',
        answer: 'Yes, destination countries like Australia (OSHC), Germany (Statutory Health Insurance), and the UK (Immigration Health Surcharge) legally require valid medical coverage.'
      }
    ],
    publicationStatus: 'published',
  },
];

export function getHomepageServices(): Service[] {
  // Returns the exact 6 business categories for the homepage:
  // 1. Study Visa, 2. MBBS / PhD, 3. Tourist Visa, 4. Work Visa, 5. Flight Ticket / Reservation Assistance, 6. Additional Services
  const study = servicesData.find(s => s.id === 'study-visa')!;
  const mbbs = servicesData.find(s => s.id === 'mbbs')!;
  const tourist = servicesData.find(s => s.id === 'tourist-visa')!;
  const work = servicesData.find(s => s.id === 'work-visa')!;
  const flight = servicesData.find(s => s.id === 'flight-booking')!;
  const additional = servicesData.find(s => s.id === 'additional-services')!;

  const mbbsPhd: Service = {
    ...mbbs,
    title: 'MBBS / PhD Abroad',
    subtitle: 'NMC Recognized Medical Faculties & Doctoral Research Roadmaps',
    shortDescription: 'Guidance for medical aspirants pursuing WHO/NMC recognized MBBS degrees, alongside research proposals and funded PhD assistantships abroad.',
  };

  return [study, mbbsPhd, tourist, work, flight, additional];
}
