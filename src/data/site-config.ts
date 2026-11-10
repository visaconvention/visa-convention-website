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
  phone: '+91 98765 43210',
  whatsappNumber: '919876543210',
  whatsappDisplay: '+91 98765 43210',
  email: 'info@visaconvention.com',
  admissionsEmail: 'admissions@visaconvention.com',
  officeAddress: 'Main Commercial Market / Advisory Hub, Hanumangarh, Rajasthan 335512, India',
  googleMapsUrl: 'https://maps.google.com/?q=Hanumangarh,+Rajasthan+335512',
  businessHours: 'Monday – Saturday: 9:30 AM – 6:30 PM IST (Sunday Closed)',
  socialLinks: {
    facebook: 'https://facebook.com/visaconvention',
    instagram: 'https://instagram.com/visaconvention',
    linkedin: 'https://linkedin.com/company/visaconvention',
    youtube: 'https://youtube.com/@visaconvention',
    googleMaps: 'https://maps.google.com/?q=Hanumangarh,+Rajasthan+335512',
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
    universities: 'Universities listed on this portal are institutions for which guidance, profile alignment, and application facilitation are provided. Inclusion does not imply direct partnership or exclusive agency representation unless explicitly designated.',
    flights: 'Flight reservation assistance facilitates genuine carrier itineraries. No fraudulent PNRs or fabricated tickets are produced under any circumstance.',
  },

  // Sitewide navigation structure
  nav: [
    { label: 'Home', href: '/' },
    {
      label: 'Services',
      href: '/services/',
      children: [
        { label: 'Study Visa', href: '/services/study-visa/', description: 'Comprehensive guidance for 35+ countries' },
        { label: 'MBBS Abroad', href: '/services/mbbs/', description: 'WHO & NMC recognized medical faculties' },
        { label: 'PhD Abroad', href: '/services/phd/', description: 'Doctoral research and funded proposals' },
        { label: 'Tourist Visa', href: '/services/tourist-visa/', description: 'Visitor visas, itineraries & appointment prep' },
        { label: 'Work Visa', href: '/services/work-visa/', description: 'Work permit documentation & compliance' },
        { label: 'Flight Reservation', href: '/services/flight-booking/', description: 'Airline bookings & genuine visa itineraries' },
      ],
    },
    { label: 'Study Abroad', href: '/study-abroad/' },
    { label: 'Universities', href: '/universities/' },
    { label: 'About Us', href: '/about/' },
    { label: 'Success Stories', href: '/success-stories/' },
    { label: 'Partnerships', href: '/partnerships/' },
    { label: 'Contact', href: '/contact/' },
  ] as NavItem[],
};
