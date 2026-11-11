import type { NavItem } from '../types';

export const siteConfig = {
  name: 'Visa Convention',
  legalName: 'Visa Convention',
  tagline: 'Premier Visa, Higher Education Abroad & Travel Consultancy',
  shortDescription: 'Professional study visa counseling, MBBS/PhD admissions abroad, tourist/work visa facilitation, and flight reservation assistance based in Hanumangarh, Rajasthan.',
  domain: 'https://visaconvention.com',
  city: 'Hanumangarh',
  state: 'Rajasthan',
  country: 'India',
  
  // Primary contact channels (Approved Hanumangarh advisory line & WhatsApp)
  phone: '+91 96803-95539',
  whatsappNumber: '919680395539',
  whatsappDisplay: '+91 96803-95539',
  email: 'visaconvention064@gmail.com',
  admissionsEmail: 'visaconvention064@gmail.com',
  officeAddress: 'Shop No.115, Durga Market, Street No.04, behind Bus Stand, Durga Colony, Junction, Hanumangarh, Rajasthan 335512',
  googleMapsUrl: 'https://maps.google.com/?q=Shop+No.115,+Durga+Market,+Street+No.04,+behind+Bus+Stand,+Durga+Colony,+Junction,+Hanumangarh,+Rajasthan+335512',
  businessHours: 'Monday – Saturday: 9:30 AM – 6:30 PM IST (Sunday Closed)',
  socialLinks: {
    facebook: 'https://facebook.com/visaconvention',
    instagram: 'https://instagram.com/visaconvention',
    linkedin: 'https://linkedin.com/company/visaconvention',
    youtube: 'https://youtube.com/@visaconvention',
    googleMaps: 'https://maps.google.com/?q=Shop+No.115,+Durga+Market,+Street+No.04,+behind+Bus+Stand,+Durga+Colony,+Junction,+Hanumangarh,+Rajasthan+335512',
  },
  
  // Primary brand palette hex codes
  theme: {
    navy: '#102A53',
    red: '#C91D32',
    blue: '#2367A4',
    bg: '#F5F8FC',
    white: '#FFFFFF',
    border: '#E2E8F0',
    muted: '#475569',
  },

  // Disclaimers
  disclaimers: {
    statutory: 'Visa Convention provides professional educational advisory, documentation support, and travel coordination. Visa approval is the sole legal prerogative of respective government embassies, consulates, and high commissions. No visa outcome is or can be guaranteed.',
    universities: 'Visa Convention is an independent consultancy providing university application guidance and visa documentation assistance. Listing or mention of institutions does not imply formal partnership, affiliation, institutional agreement, or official endorsement.',
    flights: 'Flight reservation assistance facilitates genuine carrier itineraries. No fraudulent PNRs or fabricated tickets are produced under any circumstance.',
  },

  // Sitewide navigation structure (Grouped by visitor intent)
  nav: [
    {
      label: 'Study Abroad',
      href: '/study-abroad/',
      children: [
        { label: 'Explore 35+ Countries', href: '/study-abroad/', description: 'Discover international study destinations' },
        { label: 'Find Universities', href: '/universities/', description: 'Search 1,000+ universities & colleges' },
        { label: 'Study Visa Assistance', href: '/services/study-visa/', description: 'Comprehensive admissions & visa filing' },
        { label: 'MBBS Abroad', href: '/services/mbbs/', description: 'WDOMS-listed faculties & NMC guidance' },
        { label: 'PhD Abroad', href: '/services/phd/', description: 'Doctoral research and funded proposals' },
      ],
    },
    {
      label: 'Visa Services',
      href: '/services/',
      children: [
        { label: 'Tourist & Visitor Visa', href: '/services/tourist-visa/', description: 'Visitor visas, itineraries & appointment prep' },
        { label: 'Work Visa Support', href: '/services/work-visa/', description: 'Employer documentation & regulatory guidance' },
        { label: 'Additional Services', href: '/services/additional-services/', description: 'SOP review, apostille & pre-departure briefs' },
        { label: 'All Services Overview', href: '/services/', description: 'Comparative matrix of all 7 service verticals' },
      ],
    },
    {
      label: 'Flight Booking',
      href: '/services/flight-booking/',
    },
    {
      label: 'About',
      href: '/about/',
      children: [
        { label: 'Our Story & Office', href: '/about/', description: 'Hanumangarh advisory center & counseling ethics' },
        { label: 'Verified Outcomes', href: '/success-stories/', description: 'Authentic student outcomes & privacy protection' },
      ],
    },
    {
      label: 'Contact',
      href: '/contact/',
    },
  ] as NavItem[],
};
