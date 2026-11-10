import type { TeamMember } from '../types';

export const aboutData = {
  hero: {
    badge: 'About Visa Convention',
    title: 'Integrity, Precision & Truth in International Education',
    subtitle: 'Headquartered in Hanumangarh, Rajasthan, Visa Convention was founded to bring transparent, ethical, and high-caliber visa advisory to regional students and families. We replace deceptive marketing and empty promises with factual profile screening, rigorous consular documentation, and personalized counseling.',
    trustPillars: [
      { label: 'Physical Center', value: 'Hanumangarh, RJ' },
      { label: 'Destination Reach', value: '35+ Countries' },
      { label: 'Guided Institutions', value: '1,015+ Records' },
      { label: 'Transparency', value: '100% Zero-Deception' },
    ],
  },

  story: {
    headline: 'Bridging Hanumangarh to the World’s Leading Institutions',
    paragraphs: [
      'For decades, students and families across Northern Rajasthan aspiring to study abroad faced an unfortunate dilemma: either navigate complex international admissions alone, or fall prey to generic local visa agencies making fraudulent claims of "100% guaranteed visas" or pushing students into low-quality unaccredited colleges.',
      'Visa Convention was established in Hanumangarh to change that narrative permanently. We built our consultancy on a singular, unwavering principle: factual counseling without inflated promises. Every student who walks into our office receives an honest assessment of their academic profile, language test scores, financial readiness, and realistic visa feasibility.',
      'Today, our scope encompasses over 35 destination countries across North America, Europe, the United Kingdom, Australia, New Zealand, and Central Asia. From competitive engineering and business programs in Canada and the UK, to English-medium MBBS degrees in top Central Asian medical universities, we guide each file with uncompromising legal and procedural diligence.',
    ],
  },

  missionPhilosophy: {
    mission: 'To empower regional Indian students and international travelers with honest, legally compliant, and strategically sound pathways to world-class higher education and global mobility.',
    pillars: [
      {
        title: 'Strict Consular Honesty',
        description: 'Visa issuance is the exclusive legal prerogative of sovereign embassies, consulates, and high commissions. We never promise guaranteed approvals, but we ensure every application is meticulously compliant, authentic, and transparent.',
        icon: 'shield',
      },
      {
        title: 'Academic Merit & Budget Alignment',
        description: 'We do not steer students toward commission-driven colleges. We shortlist universities based strictly on academic criteria, recognized accreditations, transparent tuition fee structures, and genuine post-study prospects.',
        icon: 'academic',
      },
      {
        title: 'Zero Hidden Costs',
        description: 'Every fee, whether for university application charges, official language assessments, medical examinations, or embassy processing fees, is fully disclosed upfront before documentation begins.',
        icon: 'currency',
      },
      {
        title: 'Documentary Anti-Fraud Protocol',
        description: 'We enforce an absolute zero-tolerance policy against forged academic transcripts, bogus bank balance certificates, or fabricated employment records. We protect our students from irreversible visa bans.',
        icon: 'document',
      },
    ],
  },

  directorsMessage: {
    title: 'A Message from the Directorship Desk',
    quote: 'Our commitment to Hanumangarh is simple: we will never tell a family what they want to hear simply to secure a file. We will tell you the absolute truth about your eligibility, your risks, and your legitimate path forward. Your trust is our greatest asset.',
    context: 'Directorship & Lead Advisory Office, Hanumangarh, Rajasthan',
    invitation: 'We welcome students, parents, and working professionals to visit our Hanumangarh center for an open, unhurried counseling session. Bring your marksheets, your aspirations, and your honest questions.',
  },

  teamMembers: [
    {
      id: 'team-north-america',
      roleTitle: 'Lead Education Counselor — North America & UK',
      department: 'Admissions & University Strategy',
      specialization: 'Canada SDS, UK Russell Group & Tier-4 Compliance',
      responsibilities: [
        'Academic transcript pre-screening and GPA conversion',
        'Statement of Purpose (SOP) refinement and narrative structure',
        'Post-Graduation Work Permit (PGWP) eligibility alignment',
      ],
      bio: 'Directs university shortlisting and application strategy for premier destinations including Canada, the United Kingdom, and the United States.',
    },
    {
      id: 'team-medical',
      roleTitle: 'Medical Admissions Advisor — MBBS Central Asia & Europe',
      department: 'Medical Education Abroad',
      specialization: 'NMC FMGL 2021 Compliance & NEET Verification',
      responsibilities: [
        'Verification of National Medical Commission (NMC) curriculum compliance',
        'Indian mess, hostel security, and English-medium clinical rotation audits',
        'Coordination with government medical universities in Uzbekistan, Kazakhstan, and Russia',
      ],
      bio: 'Specializes exclusively in medical admissions for Indian aspirants, ensuring complete regulatory alignment with NMC Foreign Medical Graduate Licentiate guidelines.',
    },
    {
      id: 'team-phd-europe',
      roleTitle: 'Doctoral & European Education Coordinator',
      department: 'European & Postgraduate Studies',
      specialization: 'Germany Public Universities, Ireland & PhD Fellowships',
      responsibilities: [
        'Research proposal alignment and supervisor outreach advisory',
        'DAAD, APS certificate, and blocked account coordination for Germany',
        'Postgraduate admission criteria across Ireland, Netherlands, and Nordic countries',
      ],
      bio: 'Guides postgraduate scholars seeking tuition-free or subsidized public education across continental Europe, with specialized focus on technical and doctoral programs.',
    },
    {
      id: 'team-compliance',
      roleTitle: 'Consular Compliance & Documentation Lead',
      department: 'Visa Filing & Regulatory Audit',
      specialization: 'Financial Justification, Ties to Home Country & GTE/GS Audits',
      responsibilities: [
        'Multi-point documentation audit prior to embassy submission',
        'Source of funds and tax filing verification to eliminate consular discrepancies',
        'Interview preparation and genuine temporary entrant (GTE/GS) stress testing',
      ],
      bio: 'Oversees final file compilation and legal compliance, ensuring that every submission presents an authentic, verifiable, and airtight case to the respective high commission.',
    },
  ] as TeamMember[],

  physicalOffice: {
    city: 'Hanumangarh',
    state: 'Rajasthan',
    country: 'India',
    pincode: '335512',
    address: 'Main Commercial Market / Advisory Hub, Hanumangarh, Rajasthan 335512, India',
    businessHours: 'Monday – Saturday: 9:30 AM – 6:30 PM IST (Sunday Closed)',
    consultationMode: 'Walk-in appointments welcomed; scheduled consultations recommended',
    features: [
      {
        title: 'Dedicated Consultation Suites',
        description: 'Private 1-on-1 counseling rooms where students and parents discuss academic records and financial plans with total confidentiality.',
      },
      {
        title: 'Document Verification Desk',
        description: 'Equipped with document scanning, authentic apostille checks, and strict pre-submission auditing stations.',
      },
      {
        title: 'Alumni & Resource Lounge',
        description: 'Access official course prospectuses, country-specific student visa guides, and pre-departure checklists.',
      },
      {
        title: 'Digital Portal Stations',
        description: 'High-speed secure terminals dedicated to university portal tracking, fee remissions, and biometrics scheduling.',
      },
    ],
  },

  verifiedMilestones: [
    {
      metric: '35+',
      label: 'Destination Countries',
      detail: 'Fully researched destination guides with verified consular links.',
    },
    {
      metric: '1,015+',
      label: 'Universities Cataloged',
      detail: 'Accredited international universities actively indexed for admissions guidance.',
    },
    {
      metric: '6',
      label: 'Core Service Categories',
      detail: 'Study Visa, MBBS, PhD, Tourist Visa, Work Visa Compliance, and Air Ticketing.',
    },
    {
      metric: '100%',
      label: 'Zero-Fabrication Policy',
      detail: 'Zero fake documents, zero bogus PNRs, zero deceptive visa guarantees.',
    },
  ],
};
