import type { PartnershipTrack } from '../types';

export const partnershipsData = {
  hero: {
    badge: 'Institutional & B2B Collaboration',
    title: 'Ethical Partnerships for Global Education & Student Success',
    subtitle: 'Visa Convention collaborates with accredited international universities, regional education institutes, and verified referral associates on a foundation of strict legal compliance, credential authentication, and genuine student recruitment.',
  },

  compliancePillars: [
    {
      title: 'Genuine Student Pipeline',
      description: 'We connect institutions with authentic, academically prepared candidates from Hanumangarh and Northern Rajasthan with bona fide intentions and verified financial capacity.',
      metric: '100% Verified Profiles',
    },
    {
      title: 'Rigorous Pre-Screening Audits',
      description: 'Prior to application submission, every candidate file undergoes preliminary academic evaluation, English assessment (IELTS/PTE), and source-of-funds verification.',
      metric: 'Multi-Point File Check',
    },
    {
      title: 'Strict Consular Compliance',
      description: 'Zero tolerance for document falsification, exaggerated work histories, or bogus claims. We maintain flawless institutional integrity with host-nation immigration bodies.',
      metric: 'Zero-Fraud Tolerance',
    },
    {
      title: 'Transparent B2B Communication',
      description: 'Timely status updates, direct application tracking, and professional case coordination handled through our dedicated Hanumangarh leadership team.',
      metric: 'Dedicated Account Liaison',
    },
  ],

  collaborationTracks: [
    {
      id: 'track-universities',
      title: 'For International Universities & Colleges',
      subtitle: 'Accredited Higher Education Providers',
      targetAudience: 'Global university admissions offices, international recruitment teams, and pathway colleges.',
      description: 'Partner with Visa Convention to recruit high-quality, pre-screened students from one of Northern India’s most aspirational regions. We organize dedicated spot-admission sessions, faculty seminars, and transparent applicant counseling.',
      offerings: [
        'Pre-submission credential verification against specific institutional cutoffs',
        'Direct coordination of academic fee remittances through authorized banking channels',
        'Pre-departure orientation covering campus arrival, climate adaptation, and compliance',
        'Comprehensive marketing and profile seminars held at our Hanumangarh center',
      ],
      eligibilityCriteria: [
        'Recognized degree-granting accreditation by host-nation Ministry of Education',
        'Transparent international fee schedules and official refund policies',
        'Designated Learning Institution (DLI) or equivalent regulatory status',
      ],
      icon: 'academic',
    },
    {
      id: 'track-coaching',
      title: 'For Regional Coaching Centers & Language Academies',
      subtitle: 'IELTS / PTE / OET Training Institutes & Schools',
      targetAudience: 'Reputed test preparation institutes, language schools, and senior secondary academies in Rajasthan, Punjab, and Haryana.',
      description: 'Give your high-scoring language students access to ethical, uncompromised visa filing. We partner with coaching centers under transparent referral frameworks, protecting your reputation with professional consular documentation.',
      offerings: [
        'Dedicated counselor assigned to your center’s referred students',
        'Regular free study abroad orientation workshops for your enrolled batches',
        'Transparent, timely referral incentives with full audit tracking',
        'Joint university information sessions featuring visiting institutional delegates',
      ],
      eligibilityCriteria: [
        'Registered educational business or test preparation academy',
        'Commitment to honest student counseling and privacy protection',
        'Strict refusal to endorse forged or deceptive financial paperwork',
      ],
      icon: 'school',
    },
    {
      id: 'track-subagents',
      title: 'For Associate Consultants & Sub-Agents',
      subtitle: 'B2B Educational Associates',
      targetAudience: 'Independent education advisors and regional visa agents seeking reliable master-consultancy application processing.',
      description: 'Scale your business by leveraging our extensive catalog of 1,015+ institutions across 35 countries. We handle complex application portals, SOP editing, and consular compliance while respecting your client relationships.',
      offerings: [
        'Access to our comprehensive admissions infrastructure across 35+ countries',
        'Direct tracking of university offers, CAS/I-20 issuances, and embassy lodgements',
        'Ethical, protected revenue-sharing agreements with prompt disbursement',
        'Expert guidance on complex cases (study gaps, previous refusals, financial structuring)',
      ],
      eligibilityCriteria: [
        'Documented track record of lawful consultancy operations',
        'Adherence to Visa Convention’s Non-Fabrication and Anti-Fraud Charter',
        'Signed mutual nondisclosure and client confidentiality agreement',
      ],
      icon: 'network',
    },
    {
      id: 'track-travel',
      title: 'For Travel Agents & Corporate Partners',
      subtitle: 'Flight Reservation & Logistics Networks',
      targetAudience: 'IATA-certified ticketing agencies, travel operators, and student accommodation platforms.',
      description: 'Collaborate to support seamless international transitions for students, tourists, and business delegates requiring genuine flight reservation holds, student baggage allowances, and foreign exchange.',
      offerings: [
        'Group departure coordination for incoming university cohorts',
        'Verified airline itinerary holds matching strict embassy visa filing timelines',
        'Student excess baggage (40kg+) fare negotiation assistance',
        'Cross-referral for overseas student health cover (OSHC) and forex solutions',
      ],
      eligibilityCriteria: [
        'Strict policy against generating fake tickets or bogus PNR numbers',
        'Real-time ticketing confirmation capabilities through verified GDS systems',
        'Transparent cancellation and rescheduling terms for students',
      ],
      icon: 'airplane',
    },
  ] as PartnershipTrack[],

  partnerIntegrityPolicy: {
    title: 'Institutional Representation & Logo Policy',
    content: 'Visa Convention maintains direct counseling relationships, institutional portal access, and verified aggregator linkages for over 1,015 universities globally. In strict compliance with regulatory ethics, we do not publicly display university or corporate logos without signed bilateral media authorization agreements on file. Prospective B2B partners may review our compliance credentials and institutional agreements during formal partnership discussions at our Hanumangarh office.',
  },
};
