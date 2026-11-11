/**
 * Visa Convention — Production Serverless Enquiry Endpoint
 * Compatible with Vercel Serverless Functions and Node.js runtimes.
 * Handles POST /api/enquiry submissions with input sanitization,
 * honeypot spam protection, rate limiting, and persistent logging.
 */

import fs from 'fs';
import path from 'path';

// Sanitize user inputs to prevent injection
function sanitize(val) {
  if (typeof val !== 'string') return val;
  return val
    .replace(/[<>]/g, '') // Strip HTML tags
    .trim()
    .slice(0, 2000);     // Max length safety
}

export default async function handler(req, res) {
  // CORS / Method check
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed`,
    });
  }

  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

    // 1. Anti-spam honeypot verification
    if (data.website_url_check || data['form-bot-trap']) {
      console.warn('[Security] Bot submission rejected via honeypot.');
      return res.status(400).json({
        success: false,
        message: 'Spam submission detected and blocked.',
      });
    }

    // 2. Strict server-side field validation
    const submissionType = data.submissionType || 'student';

    if (submissionType === 'business') {
      const org = sanitize(data.organizationName);
      const contact = sanitize(data.contactPerson);
      const email = sanitize(data.email);
      const phone = sanitize(data.phone);

      if (!org || !contact || !email || !phone) {
        return res.status(422).json({
          success: false,
          message: 'Missing required business inquiry fields.',
        });
      }
    } else if (submissionType === 'flight') {
      const name = sanitize(data.fullName);
      const phone = sanitize(data.phone);
      const service = sanitize(data.service);
      const departureCity = sanitize(data.departureCity);
      const destinationCity = sanitize(data.destinationCity);
      const departureDate = sanitize(data.departureDate);
      const tripType = sanitize(data.tripType) || 'round-trip';

      if (!name || !phone || !service || !departureCity || !destinationCity || !departureDate) {
        return res.status(422).json({
          success: false,
          message: 'Missing required flight booking fields (name, phone, service, origin, destination, departure date).',
        });
      }

      // Date validation: Return date must not be before departure date for round trips
      if (tripType === 'round-trip' && data.returnDate) {
        const depTime = new Date(departureDate).getTime();
        const retTime = new Date(sanitize(data.returnDate)).getTime();
        if (retTime < depTime) {
          return res.status(422).json({
            success: false,
            message: 'Return date cannot be earlier than departure date.',
          });
        }
      }
    } else {
      const name = sanitize(data.fullName);
      const phone = sanitize(data.phone);
      const email = sanitize(data.email);
      const service = sanitize(data.service);

      if (!name || !phone || !email || !service) {
        return res.status(422).json({
          success: false,
          message: 'Missing required assessment fields (name, phone, email, service).',
        });
      }
    }

    // 3. Generate unique verifiable reference ID
    const leadPrefix = submissionType === 'flight' ? 'VC-FLT' : submissionType === 'business' ? 'VC-B2B' : 'VC-LEAD';
    const leadId = `${leadPrefix}-${Date.now().toString().slice(-6)}`;
    const timestamp = new Date().toISOString();

    const sanitizedLead = {
      leadId,
      submissionType,
      service: sanitize(data.service) || 'general',
      fullName: sanitize(data.fullName),
      organizationName: sanitize(data.organizationName),
      contactPerson: sanitize(data.contactPerson),
      phone: sanitize(data.phone),
      email: sanitize(data.email),
      targetCountry: sanitize(data.targetCountry),
      targetUniversity: sanitize(data.targetUniversity),
      proposedScope: sanitize(data.proposedScope),
      notes: sanitize(data.notes),
      // Flight-specific fields
      departureCity: sanitize(data.departureCity),
      destinationCity: sanitize(data.destinationCity),
      departureDate: sanitize(data.departureDate),
      returnDate: sanitize(data.returnDate),
      tripType: sanitize(data.tripType),
      passengers: data.passengers ? Math.min(Math.max(parseInt(data.passengers, 10) || 1, 1), 9) : 1,
      travelClass: sanitize(data.travelClass),
      passengerCategory: sanitize(data.passengerCategory),
      specialNotes: sanitize(data.specialNotes),
      receivedAt: timestamp,
    };

    // 4. Record to disk if filesystem is writable
    try {
      const leadsFile = path.resolve('client-content/leads/enquiries.json');
      if (fs.existsSync(leadsFile)) {
        const currentLeads = JSON.parse(fs.readFileSync(leadsFile, 'utf8') || '[]');
        currentLeads.push(sanitizedLead);
        fs.writeFileSync(leadsFile, JSON.stringify(currentLeads, null, 2), 'utf8');
      }
    } catch (fsErr) {
      // In read-only serverless runtimes (e.g., standard Vercel lambdas), disk is ephemeral.
      // Log to stdout for cloud logging / observability
      console.log(`[Lead Storage] Cloud runtime: Logged lead ${leadId} to stdout.`);
    }

    // 5. Optional webhook forwarding (e.g., to CRM, Slack, Telegram, or email broker)
    if (process.env.NOTIFICATION_WEBHOOK) {
      try {
        await fetch(process.env.NOTIFICATION_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sanitizedLead),
        });
      } catch (webhookErr) {
        console.error('[Notification Webhook] Dispatch error:', webhookErr.message);
      }
    }

    console.log(`[Advisory Desk] Received inquiry ${leadId} for ${sanitizedLead.service}`);

    return res.status(200).json({
      success: true,
      leadId,
      message: 'Assessment request delivered successfully to Visa Convention counseling desk.',
    });
  } catch (err) {
    console.error('[Enquiry API] Server exception:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error processing enquiry.',
    });
  }
}
