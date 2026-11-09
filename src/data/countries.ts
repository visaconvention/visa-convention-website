import type { Country } from '../types';

export const countriesData: Country[] = [
  {
    id: 'country-canada',
    slug: 'canada',
    name: 'Canada',
    isoCode: 'CA',
    continent: 'North America',
    capital: 'Ottawa',
    currency: 'CAD',
    featured: true,
    active: true,
    heroImage: '/assets/images/destinations/canada-hero.webp',
    shortSummary: 'World-class universities, post-graduation work opportunities, and vibrant multicultural cities.',
    overview: 'Canada stands among the most favored study destinations globally, combining academic distinction across research universities and colleges with transparent post-graduation work permit (PGWP) pathways.',
    keyHighlights: [
      'Post-Graduation Work Permit (PGWP) up to 3 years',
      'Globally ranked research universities and technical colleges',
      'Affordable education compared to peer English-speaking nations',
      'Safe, welcoming, and culturally diverse communities',
    ],
    popularCourses: ['Computer Science', 'Data Analytics', 'Business Management', 'Engineering', 'Healthcare'],
    intakes: ['Fall (September)', 'Winter (January)', 'Summer (May)'],
    estimatedTuitionRange: 'CAD 18,000 – CAD 38,000 / year',
    estimatedLivingCost: 'CAD 12,000 – CAD 20,635 / year (as per IRCC guidelines)',
    workRights: 'Off-campus work allowed during academic semesters within regulated hours, and full-time during breaks.',
    visaGuidanceSummary: 'Study Permit applications require a Provincial Attestation Letter (PAL), official LOA from a Designated Learning Institution (DLI), and GIC financial proof.',
    faqs: [
      {
        question: 'What is a Provincial Attestation Letter (PAL)?',
        answer: 'A PAL is a verification document issued by the Canadian province where your chosen institution is located, confirming your study permit spot under national caps.'
      },
      {
        question: 'Can international students work off-campus?',
        answer: 'Yes, eligible students holding a valid study permit may work off-campus up to government-regulated hours during academic terms.'
      }
    ],
    sourceDisclaimer: 'Immigration regulations and financial proof thresholds are subject to ongoing updates by Immigration, Refugees and Citizenship Canada (IRCC).',
    lastReviewed: '2026-11-09',
    publicationStatus: 'published',
  },
  {
    id: 'country-uk',
    slug: 'united-kingdom',
    name: 'United Kingdom',
    isoCode: 'GB',
    continent: 'Europe',
    capital: 'London',
    currency: 'GBP',
    featured: true,
    active: true,
    heroImage: '/assets/images/destinations/uk-hero.webp',
    shortSummary: 'Centuries of academic excellence, 1-year master’s programs, and the UK Graduate Route.',
    overview: 'The United Kingdom offers internationally respected academic qualifications, intensive 1-year master’s courses, and post-study work rights through the Graduate Route.',
    keyHighlights: [
      'Intensive 1-year master’s degree format saving time and living expenses',
      '2-year Graduate Route post-study work visa (3 years for PhDs)',
      'Home to prestigious Russell Group research universities',
      'Strong historical ties and large active Indian student communities',
    ],
    popularCourses: ['Business Analytics', 'Finance & Accounting', 'Law', 'Mechanical Engineering', 'Creative Arts'],
    intakes: ['Autumn (September/October)', 'Spring (January/February)'],
    estimatedTuitionRange: '£14,000 – £28,000 / year',
    estimatedLivingCost: '£9,207 – £12,006 / 9 months (outside/inside London)',
    workRights: 'Up to 20 hours per week during term time and full-time during vacations for degree-level students.',
    visaGuidanceSummary: 'Requires a Confirmation of Acceptance for Studies (CAS) from a student visa sponsor institution and proof of 28-day financial funds.',
    faqs: [
      {
        question: 'What is the duration of the UK Graduate Route visa?',
        answer: 'The Graduate Route provides international graduates 2 years (or 3 years for doctoral graduates) to work or search for work in the UK.'
      }
    ],
    sourceDisclaimer: 'UK Visas and Immigration (UKVI) regulations govern student visas and dependants eligibility.',
    lastReviewed: '2026-11-09',
    publicationStatus: 'published',
  },
  {
    id: 'country-australia',
    slug: 'australia',
    name: 'Australia',
    isoCode: 'AU',
    continent: 'Oceania',
    capital: 'Canberra',
    currency: 'AUD',
    featured: true,
    active: true,
    heroImage: '/assets/images/destinations/australia-hero.webp',
    shortSummary: 'High living standards, globally top-ranked Group of Eight universities, and clear post-study pathways.',
    overview: 'Australia delivers world-class higher education, robust quality assurance frameworks (ESOS/CRICOS), and generous post-study work opportunities in major and regional cities.',
    keyHighlights: [
      '7 universities consistently ranked in the global Top 100',
      'Temporary Graduate Visa (Subclass 485) post-study work rights',
      'High minimum student wage and work protections',
      'Multicultural lifestyle across Sydney, Melbourne, Brisbane, and Adelaide',
    ],
    popularCourses: ['Information Technology', 'Civil & Mining Engineering', 'Nursing', 'MBA', 'Cybersecurity'],
    intakes: ['Semester 1 (February/March)', 'Semester 2 (July/August)'],
    estimatedTuitionRange: 'AUD 22,000 – AUD 42,000 / year',
    estimatedLivingCost: 'AUD 24,505 / year (Department of Home Affairs benchmark)',
    workRights: 'Up to 48 hours per fortnight during term time and unrestricted hours during vacations.',
    visaGuidanceSummary: 'Student Visa (Subclass 500) requires Confirmation of Enrolment (CoE), Genuine Student (GS) assessment, and OSHC health cover.',
    faqs: [
      {
        question: 'What is the Genuine Student (GS) requirement?',
        answer: 'The GS requirement evaluates applicant intentions, course relevance, and economic circumstances to confirm genuine study intent in Australia.'
      }
    ],
    sourceDisclaimer: 'Visa requirements are set by the Australian Department of Home Affairs.',
    lastReviewed: '2026-11-09',
    publicationStatus: 'published',
  },
  {
    id: 'country-usa',
    slug: 'usa',
    name: 'United States of America',
    isoCode: 'US',
    continent: 'North America',
    capital: 'Washington, D.C.',
    currency: 'USD',
    featured: true,
    active: true,
    heroImage: '/assets/images/destinations/usa-hero.webp',
    shortSummary: 'The world’s largest higher education ecosystem with unparalleled STEM OPT training opportunities.',
    overview: 'The United States leads global academic research, hosting thousands of accredited colleges and universities with extensive campus funding and up to 3 years of STEM OPT practical training.',
    keyHighlights: [
      'Unmatched research facilities and industry networking',
      '3-year STEM OPT work authorization for science, tech, engineering, and math graduates',
      'Extensive on-campus assistantships (TA/RA) and tuition waivers',
      'Flexible curriculum structures with major/minor specializations',
    ],
    popularCourses: ['Computer Science', 'Artificial Intelligence', 'Biotechnology', 'Data Science', 'Business Analytics'],
    intakes: ['Fall (August/September)', 'Spring (January)', 'Summer (May)'],
    estimatedTuitionRange: '$20,000 – $50,000 / year',
    estimatedLivingCost: '$12,000 – $18,000 / year',
    workRights: 'On-campus work up to 20 hours/week during term; OPT/CPT authorization for practical training.',
    visaGuidanceSummary: 'F-1 Student Visa requires Form I-20, SEVIS fee payment, and an in-person consular visa interview.',
    faqs: [
      {
        question: 'What is the 24-month STEM OPT extension?',
        answer: 'Graduates with qualifying STEM degrees are eligible for an additional 24 months of Optional Practical Training, totaling 36 months of US work authorization.'
      }
    ],
    sourceDisclaimer: 'F-1 visa decisions are determined exclusively by US consular officers during mandatory interviews.',
    lastReviewed: '2026-11-09',
    publicationStatus: 'published',
  },
  {
    id: 'country-germany',
    slug: 'germany',
    name: 'Germany',
    isoCode: 'DE',
    continent: 'Europe',
    capital: 'Berlin',
    currency: 'EUR',
    featured: true,
    active: true,
    heroImage: '/assets/images/destinations/germany-hero.webp',
    shortSummary: 'Zero tuition fees at most public universities and powerhouse engineering industries.',
    overview: 'Germany provides tuition-free or nominal-cost higher education at prestigious public universities, recognized worldwide for engineering, automotive, and technology leadership.',
    keyHighlights: [
      'Zero tuition fees at public universities across most federal states',
      '18-month post-study job search visa for international graduates',
      'Leading European economy with acute demand for STEM professionals',
      'Abundant English-taught Master’s programs',
    ],
    popularCourses: ['Mechanical Engineering', 'Automotive Engineering', 'Renewable Energy', 'Informatics', 'International Business'],
    intakes: ['Winter (October)', 'Summer (April)'],
    estimatedTuitionRange: '€0 – €3,000 / year (Nominal semester administrative fees at public universities)',
    estimatedLivingCost: '€11,208 / year (Blocked account requirement)',
    workRights: '140 full days or 280 half days per calendar year.',
    visaGuidanceSummary: 'German National Visa requires an APS Certificate, formal university admission, and a Sperrkonto (Blocked Account).',
    faqs: [
      {
        question: 'Is the APS certificate mandatory for Indian students?',
        answer: 'Yes, an APS certificate verifying Indian academic credentials is mandatory for German student visa applications.'
      }
    ],
    sourceDisclaimer: 'Visa requirements are regulated by the German Embassy and regional Ausländerbehörde.',
    lastReviewed: '2026-11-09',
    publicationStatus: 'published',
  },
  {
    id: 'country-ireland',
    slug: 'ireland',
    name: 'Ireland',
    isoCode: 'IE',
    continent: 'Europe',
    capital: 'Dublin',
    currency: 'EUR',
    featured: true,
    active: true,
    heroImage: '/assets/images/destinations/ireland-hero.webp',
    shortSummary: 'The European tech hub with English-speaking education and a 2-year Third Level Graduate Scheme.',
    overview: 'Ireland serves as the European headquarters for Google, Meta, Pfizer, and Microsoft, offering intensive 1-year master’s programs and 2 years of post-study stay-back work authorization.',
    keyHighlights: [
      'European headquarters of global tech, pharmaceutical, and financial leaders',
      '2-year Third Level Graduate Scheme post-study work visa',
      'Sole native English-speaking nation in the European Union',
      'High graduate employability rates',
    ],
    popularCourses: ['Software Engineering', 'Pharmaceutical Sciences', 'Fintech', 'Cloud Computing', 'Data Analytics'],
    intakes: ['Autumn (September)', 'Spring (January/February)'],
    estimatedTuitionRange: '€11,000 – €25,000 / year',
    estimatedLivingCost: '€10,000 – €14,000 / year',
    workRights: 'Up to 20 hours/week during term time and 40 hours/week during holidays.',
    visaGuidanceSummary: 'Requires AVATS online application, acceptance from an Irish education provider, and verified financial funds.',
    faqs: [
      {
        question: 'Can graduates work in Ireland after finishing a Master’s degree?',
        answer: 'Yes, under the Third Level Graduate Scheme (Stamp 1G), eligible master’s graduates receive a 24-month work permit.'
      }
    ],
    sourceDisclaimer: 'Irish Naturalisation and Immigration Service (INIS) guidelines apply.',
    lastReviewed: '2026-11-09',
    publicationStatus: 'published',
  },
];

export function getAllCountries(): Country[] {
  return countriesData.filter(c => c.active && c.publicationStatus === 'published');
}

export function getFeaturedCountries(): Country[] {
  return countriesData.filter(c => c.featured && c.active && c.publicationStatus === 'published');
}

export function getCountryBySlug(slug: string): Country | undefined {
  return countriesData.find(c => c.slug.toLowerCase() === slug.toLowerCase());
}
