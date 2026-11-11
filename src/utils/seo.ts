import { siteConfig } from '../data/site-config';

/**
 * Enhanced Schema.org LocalBusiness & ProfessionalService JSON-LD
 * Accurately anchors Visa Convention to its verified Hanumangarh, Rajasthan physical office.
 */
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService', 'EducationalOrganization'],
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    description: siteConfig.shortDescription,
    url: siteConfig.domain,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.officeAddress,
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.state,
      postalCode: '335512',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 29.5816,
      longitude: 74.3218,
    },
    hasMap: siteConfig.googleMapsUrl,
    priceRange: '₹₹',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:30',
        closes: '18:30',
      },
    ],
    areaServed: [
      { '@type': 'City', name: 'Hanumangarh' },
      { '@type': 'State', name: 'Rajasthan' },
      { '@type': 'Country', name: 'India' },
      { '@type': 'Country', name: 'Global' },
    ],
    knowsAbout: [
      'Study Visa Counseling',
      'MBBS Abroad Admissions',
      'PhD Abroad Fellowships',
      'Tourist & Visitor Visa Compliance',
      'Work Visa Regulatory Support',
      'Air Ticket Reservation & Flight Booking',
    ],
    sameAs: [
      siteConfig.socialLinks.instagram,
      siteConfig.socialLinks.youtube,
      siteConfig.socialLinks.googleMaps,
    ].filter(Boolean),
  };
}

/**
 * Schema.org BreadcrumbList generator
 */
export function getBreadcrumbSchema(items: Array<{ label: string; href: string }>) {
  const baseUrl = siteConfig.domain.replace(/\/$/, '');
  
  const fullItems = [
    { label: 'Home', href: '/' },
    ...items,
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: fullItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href.startsWith('http') ? item.href : `${baseUrl}${item.href}`,
    })),
  };
}

/**
 * Schema.org FAQPage generator
 */
export function getFaqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
