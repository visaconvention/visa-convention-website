import { siteConfig } from '../data/site-config';

export interface WhatsAppLinkOptions {
  phone?: string;
  service?: string;
  country?: string;
  university?: string;
  customMessage?: string;
}

/**
 * Builds a compliant click-to-chat WhatsApp URL with prefilled advisory context.
 * Strict Integrity: Never auto-sends messages; requires conscious user interaction.
 */
export function buildWhatsAppLink(options: WhatsAppLinkOptions = {}): string {
  const rawPhone = options.phone || siteConfig.whatsappNumber;
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');

  let message = 'Hello Visa Convention, ';

  if (options.customMessage) {
    message += options.customMessage.trim();
  } else if (options.university && options.country) {
    message += `I would like guidance regarding admissions and student visa processing for ${options.university} in ${options.country}.`;
  } else if (options.country && options.service) {
    message += `I would like guidance regarding ${options.service} for ${options.country}.`;
  } else if (options.country) {
    message += `I would like guidance about studying in ${options.country}.`;
  } else if (options.service) {
    message += `I would like guidance regarding ${options.service} services.`;
  } else {
    message += 'I would like to schedule a profile evaluation consultation at your Hanumangarh office.';
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function getDefaultWhatsAppUrl(): string {
  return buildWhatsAppLink();
}
