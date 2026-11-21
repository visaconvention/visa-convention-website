import type { NavItem } from '../types';

export const siteConfig = {
  name: 'Visa Convention',
  legalName: 'Visa Convention',
  tagline: 'Premier Visa, Higher Education Abroad & Travel Consultancy',
  shortDescription: 'Professional study visa counseling, MBBS/PhD admissions abroad, tourist/work visa facilitation, and flight reservation assistance based in Hanumangarh, Rajasthan.',
  domain: 'https://visaconvention.com',
  city: 'Hanumangarh Junction',
  state: 'Rajasthan',
  country: 'India',
  
  // Primary contact channels (Approved Hanumangarh advisory line & WhatsApp)
  phone: '+91 96803 95539',
  phoneTel: 'tel:+919680395539',
  whatsappNumber: '919680395539',
  whatsappDisplay: '+91 96803 95539',
  email: 'visaconvention064@gmail.com',
  admissionsEmail: 'visaconvention064@gmail.com',
  officeAddress: 'Shop No.115, Durga Market, Street No.04, Behind Bus Stand, Durga Colony, Hanumangarh Junction, Rajasthan – 335512, India',
  addressLines: [
    'Shop No.115, Durga Market, Street No.04',
    'Behind Bus Stand, Durga Colony',
    'Hanumangarh Junction, Rajasthan – 335512, India',
  ],
  googleMapsUrl: 'https://maps.google.com/?q=Visa+Convention,+Shop+No.115,+Durga+Market,+Street+No.04,+Behind+Bus+Stand,+Durga+Colony,+Hanumangarh+Junction,+Rajasthan+335512',
  businessHours: 'Monday – Saturday: 9:30 AM – 6:30 PM IST (Sunday Closed)',
  socialLinks: {
    instagram: 'https://www.instagram.com/visaconvention/',
    facebook: 'https://www.facebook.com/share/19vMnsSWV6/?mibextid=wwXIfr',
    youtube: 'https://www.youtube.com/@VisaConvention',
    googleMaps: 'https://maps.google.com/?q=Visa+Convention,+Shop+No.115,+Durga+Market,+Street+No.04,+Behind+Bus+Stand,+Durga+Colony,+Hanumangarh+Junction,+Rajasthan+335512',
  },

  // Verified, active social channels for public UI rendering across footer, contact & about
  publishedSocials: [
    {
      id: 'instagram',
      name: 'Instagram',
      url: 'https://www.instagram.com/visaconvention/',
      ariaLabel: 'Follow Visa Convention on Instagram (opens in a new tab)',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      url: 'https://www.facebook.com/share/19vMnsSWV6/?mibextid=wwXIfr',
      ariaLabel: 'Connect with Visa Convention on Facebook (opens in a new tab)',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      url: 'https://www.youtube.com/@VisaConvention',
      ariaLabel: 'Subscribe to Visa Convention on YouTube (opens in a new tab)',
    },
  ],
  
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
        { label: "Bachelor's and Master's Abroad", href: '/study-abroad/', description: 'Discover international study destinations' },
        { label: 'MBBS Abroad', href: '/services/mbbs/', description: 'WDOMS-listed faculties & NMC guidance' },
        { label: 'PhD Abroad', href: '/services/phd/', description: 'Doctoral research and funded proposals' },
      ],
    },
    {
      label: 'Tourist Visa',
      href: '/services/tourist-visa/',
    },
    {
      label: 'Work Visa',
      href: '/services/work-visa/',
    },
    {
      label: 'Flights',
      href: '/services/flight-booking/',
      children: [
        {
          label: 'Dummy Tickets',
          href: '/services/dummy-tickets/',
          description: 'Flight reservation / itinerary assistance for visa dossiers',
        },
        {
          label: 'Confirmed Flight Tickets',
          href: '/services/confirmed-flight-tickets/',
          description: 'Confirmed flight ticket enquiries with student tariffs',
        },
      ],
    },
    {
      label: 'Additional Services',
      href: '/services/additional-services/',
      children: [
        {
          label: 'Passport Application Assistance',
          href: '/services/passport-assistance/',
          description: 'Fresh passport filing, renewals & PSK appointment scheduling',
        },
        {
          label: 'ITR Filing Assistance',
          href: '/services/itr-filing/',
          description: 'Income tax returns & consular financial documentation',
        },
        {
          label: 'Company Registration Assistance',
          href: '/services/company-registration/',
          description: 'Incorporation records & GST filing for business travelers',
        },
        {
          label: 'Police Clearance Certificate (PCC)',
          href: '/services/pcc-assistance/',
          description: 'PCC application coordination & checklist verification',
        },
        {
          label: 'Document Apostille',
          href: '/services/document-apostille/',
          description: 'Ministry of External Affairs (MEA) apostille & legalizations',
        },
        {
          label: 'Document Translation',
          href: '/services/document-translation/',
          description: 'Certified translations for embassies & foreign universities',
        },
      ],
    },
    {
      label: 'About',
      href: '/about/',
      children: [
        { label: 'Our Story & Office', href: '/about/', description: 'Hanumangarh advisory center & counseling ethics' },
        { label: 'Verified Outcomes', href: '/success-stories/', description: 'Authentic student outcomes & privacy protection' },
      ],
    },
  ] as NavItem[],
};
