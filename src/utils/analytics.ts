/**
 * Privacy-Conscious Analytics Event Dispatcher for Visa Convention
 * Respects Digital Personal Data Protection (DPDP) and GDPR guidelines.
 * Never collects or transmits PII (no names, phone numbers, email addresses).
 */

export interface TrackingPayload {
  eventName: string;
  service?: string;
  country?: string;
  university?: string;
  method?: string;
  location?: string;
  [key: string]: any;
}

declare global {
  interface Window {
    dataLayer?: any[];
  }
}

/**
 * Dispatches an event to dataLayer (for Google Tag Manager / GA4)
 * and fires a CustomEvent on window for local client listeners.
 */
export function trackEvent(payload: TrackingPayload): void {
  if (typeof window === 'undefined') return;

  const eventData = {
    ...payload,
    timestamp: new Date().toISOString(),
  };

  // Push to GTM dataLayer if present
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(eventData);

  // Dispatch custom DOM event
  try {
    const customEvent = new CustomEvent('vc:analytics', { detail: eventData });
    window.dispatchEvent(customEvent);
  } catch (err) {
    // Graceful fallback for older engines
  }
}

export function trackEnquirySubmission(params: {
  service: string;
  country?: string;
  university?: string;
  submissionType: 'student' | 'business';
}): void {
  trackEvent({
    eventName: 'enquiry_submission',
    service: params.service,
    country: params.country || 'unspecified',
    university: params.university || 'unspecified',
    submissionType: params.submissionType,
  });
}

export function trackWhatsAppClick(params: {
  service?: string;
  country?: string;
  university?: string;
  location?: string;
}): void {
  trackEvent({
    eventName: 'whatsapp_click',
    service: params.service || 'general',
    country: params.country || 'unspecified',
    university: params.university || 'unspecified',
    location: params.location || 'floating_button',
  });
}

export function trackPhoneClick(params: { location?: string } = {}): void {
  trackEvent({
    eventName: 'phone_call_click',
    location: params.location || 'contact_page',
  });
}

export function trackServiceSelect(service: string): void {
  trackEvent({
    eventName: 'service_selected',
    service,
  });
}

export function trackCountrySelect(country: string): void {
  trackEvent({
    eventName: 'country_selected',
    country,
  });
}

export function trackUniversitySelect(university: string): void {
  trackEvent({
    eventName: 'university_selected',
    university,
  });
}
