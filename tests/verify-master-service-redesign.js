/**
 * Visa Convention — Master Service Page Redesign & Cleanup Verification Test
 * Tests all 8 redesigned service pages, minimal enquiry forms, and page-specific removals.
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';

const PAGES_DIR = path.resolve('src/pages');

console.log('--- STARTING MASTER SERVICE PAGE REDESIGN & CLEANUP VERIFICATION ---');

let totalTests = 0;
let passedTests = 0;

function test(description, fn) {
  totalTests++;
  try {
    fn();
    console.log(`[PASS] ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] ${description}`);
    console.error(`       Error: ${err.message}`);
  }
}

// 1. Verify 8 Service Pages Exist
const expectedServicePages = [
  { file: 'services/dummy-tickets.astro', title: 'Dummy Flight Ticket & Reservation Assistance', serviceName: 'Dummy Tickets', btn: 'Request Assistance' },
  { file: 'services/confirmed-flight-tickets.astro', title: 'Confirmed Flight Tickets & Booking Assistance', serviceName: 'Confirmed Flight Tickets', btn: 'Request Flight Assistance' },
  { file: 'services/passport-assistance.astro', title: 'Passport Application Assistance', serviceName: 'Passport Application Assistance', btn: 'Request Passport Assistance' },
  { file: 'services/itr-filing.astro', title: 'Income Tax Return (ITR) Filing Assistance', serviceName: 'ITR Filing Assistance', btn: 'Request ITR Assistance' },
  { file: 'services/company-registration.astro', title: 'Company Registration Assistance', serviceName: 'Company Registration Assistance', btn: 'Request Registration Assistance' },
  { file: 'services/pcc-assistance.astro', title: 'Police Clearance Certificate (PCC) Assistance', serviceName: 'Police Clearance Certificate', btn: 'Request PCC Assistance' },
  { file: 'services/document-apostille.astro', title: 'Document Apostille Assistance', serviceName: 'Document Apostille', btn: 'Request Apostille Assistance' },
  { file: 'services/document-translation.astro', title: 'Document Translation Assistance', serviceName: 'Document Translation', btn: 'Request Translation Assistance' },
];

for (const sp of expectedServicePages) {
  test(`Service page file exists: src/pages/${sp.file}`, () => {
    const fullPath = path.join(PAGES_DIR, sp.file);
    assert.strictEqual(fs.existsSync(fullPath), true, `File src/pages/${sp.file} must exist`);
    const content = fs.readFileSync(fullPath, 'utf8');
    assert(content.includes(sp.title), `Must contain title: "${sp.title}"`);
    assert(content.includes(sp.serviceName), `Must contain service metadata: "${sp.serviceName}"`);
    assert(content.includes(sp.btn), `Must contain submit button text: "${sp.btn}"`);
  });
}

// 2. Exact Content Checks for Dummy Tickets
test('Dummy Tickets page has exact approved content and 3 use cases', () => {
  const content = fs.readFileSync(path.join(PAGES_DIR, 'services/dummy-tickets.astro'), 'utf8');
  assert(content.includes('Plan Your Travel Itinerary Without Purchasing a Confirmed Flight Ticket Upfront'));
  assert(content.includes('What Is a Dummy Flight Ticket?'));
  assert(content.includes('When Can It Be Useful?'));
  assert(content.includes('Visa Application Documentation'));
  assert(content.includes('Travel Planning Before Visa Approval'));
  assert(content.includes('Temporary Reservation Requirements'));
  assert(content.includes('Need a Flight Reservation?'));
});

// 3. Exact Content Checks for Confirmed Flight Tickets
test('Confirmed Flight Tickets page has exact approved content and 3 use cases', () => {
  const content = fs.readFileSync(path.join(PAGES_DIR, 'services/confirmed-flight-tickets.astro'), 'utf8');
  assert(content.includes('Book Your Flights with Reliable Assistance and Convenient Travel Options'));
  assert(content.includes('What Is a Confirmed Flight Ticket?'));
  assert(content.includes('Who Can Benefit from This Service?'));
  assert(content.includes('Students Travelling Abroad'));
  assert(content.includes('Tourists & Family Travelers'));
  assert(content.includes('Business & Work Travelers'));
  assert(content.includes('Ready to Book Your Flight?'));
});

// 4. Exact Content Checks for Passport Assistance
test('Passport Assistance page has exact approved content and 3 use cases', () => {
  const content = fs.readFileSync(path.join(PAGES_DIR, 'services/passport-assistance.astro'), 'utf8');
  assert(content.includes('Simplify Your Passport Application Process with Professional Guidance'));
  assert(content.includes('What Is Passport Application Assistance?'));
  assert(content.includes('First-Time Passport Applicants'));
  assert(content.includes('Passport Renewal & Re-Issue Applicants'));
  assert(content.includes('Passport Correction & Update Applicants'));
});

// 5. Exact Content Checks for ITR Filing Assistance
test('ITR Filing page has exact approved content and 3 use cases', () => {
  const content = fs.readFileSync(path.join(PAGES_DIR, 'services/itr-filing.astro'), 'utf8');
  assert(content.includes('Simplify Your Income Tax Return Filing with Professional Guidance'));
  assert(content.includes('What Is ITR Filing Assistance?'));
  assert(content.includes('Salaried Individuals'));
  assert(content.includes('Self-Employed Professionals'));
  assert(content.includes('Business Owners & Freelancers'));
});

// 6. Exact Content Checks for Company Registration Assistance
test('Company Registration page has exact approved content and 3 use cases', () => {
  const content = fs.readFileSync(path.join(PAGES_DIR, 'services/company-registration.astro'), 'utf8');
  assert(content.includes('Start Your Business with Professional Registration Guidance'));
  assert(content.includes('What Is Company Registration Assistance?'));
  assert(content.includes('First-Time Business Owners'));
  assert(content.includes('Entrepreneurs Starting Companies'));
  assert(content.includes('Businesses Seeking Incorporation Guidance'));
});

// 7. Exact Content Checks for PCC Assistance
test('PCC Assistance page has exact approved content and 3 use cases', () => {
  const content = fs.readFileSync(path.join(PAGES_DIR, 'services/pcc-assistance.astro'), 'utf8');
  assert(content.includes('Simplify Your Police Clearance Certificate Application Process'));
  assert(content.includes('What Is PCC Assistance?'));
  assert(content.includes('Overseas Employment Applicants'));
  assert(content.includes('Immigration & Long-Term Visa Applicants'));
  assert(content.includes('Individuals Requiring Police Clearance'));
});

// 8. Exact Content Checks for Document Apostille Assistance
test('Document Apostille page has exact approved content and 3 use cases', () => {
  const content = fs.readFileSync(path.join(PAGES_DIR, 'services/document-apostille.astro'), 'utf8');
  assert(content.includes('Simplify Document Authentication for International Use'));
  assert(content.includes('What Is Document Apostille Assistance?'));
  assert(content.includes('Students Applying Abroad'));
  assert(content.includes('Overseas Employment & Immigration Applicants'));
  assert(content.includes('Individuals and Businesses Requiring Document Authentication'));
});

// 9. Exact Content Checks for Document Translation Assistance
test('Document Translation page has exact approved content and 3 use cases', () => {
  const content = fs.readFileSync(path.join(PAGES_DIR, 'services/document-translation.astro'), 'utf8');
  assert(content.includes('Professional Document Translation Support for International Requirements'));
  assert(content.includes('What Is Document Translation Assistance?'));
  assert(content.includes('Students & University Applicants'));
  assert(content.includes('Visa & Immigration Applicants'));
  assert(content.includes('Individuals and Businesses Requiring Translated Documents'));
});

// 10. Minimal Service Form component verification
test('MinimalServiceForm component has exactly 3 visible inputs + consent and spam trap', () => {
  const formContent = fs.readFileSync(path.resolve('src/components/forms/MinimalServiceForm.astro'), 'utf8');
  assert(formContent.includes('name="fullName"'), 'Must have fullName input');
  assert(formContent.includes('name="phone"'), 'Must have phone input');
  assert(formContent.includes('name="message"'), 'Must have message textarea');
  assert(formContent.includes('name="privacy_consent"'), 'Must have privacy_consent checkbox');
  assert(formContent.includes('name="website_url_check"'), 'Must have honeypot spam protection');
  assert(formContent.includes('name="submissionType" value="service"'), 'Must pass submissionType=service');
  assert(formContent.includes('name="service"'), 'Must pass service metadata');

  // Verify nonessential fields are NOT present
  assert(!formContent.includes('name="email"'), 'Must not have email field');
  assert(!formContent.includes('name="departureCity"'), 'Must not have departureCity');
  assert(!formContent.includes('name="passengers"'), 'Must not have passengers');
  assert(!formContent.includes('name="passportNumber"'), 'Must not have sensitive passportNumber');
});

// 11. Removals on PhD Abroad page
test('PhD Abroad page has both Advisory Notices removed', () => {
  const phdContent = fs.readFileSync(path.join(PAGES_DIR, 'services/phd.astro'), 'utf8');
  assert(!phdContent.includes('Doctoral admission and supervisor acceptance depend entirely on faculty departmental evaluation'), 'Hero advisory box must be removed');
  assert(!phdContent.includes('Listings do not imply formal partnership or institutional endorsement'), 'Grid advisory notice paragraph must be removed');
  // Check directory is preserved
  assert(phdContent.includes('Latvia') && phdContent.includes('Lithuania') && phdContent.includes('Portugal'), '3 countries preserved');
});

// 12. Removals on MBBS Abroad page
test('MBBS Abroad page has Integrity Notice removed', () => {
  const mbbsContent = fs.readFileSync(path.join(PAGES_DIR, 'services/mbbs.astro'), 'utf8');
  assert(!mbbsContent.includes('Tuition fees are payable directly to official university bank accounts'), 'Integrity Notice must be removed');
  assert(!mbbsContent.includes('Integrity Notice:'), 'Integrity Notice label must be removed');
  // Check directory preserved
  assert(mbbsContent.includes('Universities for Application Guidance'), 'MBBS directory preserved');
  assert(mbbsContent.includes('mbbs-countries-grid'), 'Country grid preserved');
});

// 13. Removals on Flight Pages
test('Flight pages have Travel Itinerary card and Booking Terms notice removed', () => {
  const flightBookingContent = fs.readFileSync(path.join(PAGES_DIR, 'services/flight-booking.astro'), 'utf8');
  assert(!flightBookingContent.includes('Booking Terms & Consular Notice:'), 'Booking Terms & Consular Notice must be removed from flight-booking');
  assert(!flightBookingContent.includes('Consular authorities (including the U.S. Department of State'), 'Consular text must be removed');

  const flightFormContent = fs.readFileSync(path.resolve('src/components/forms/FlightEnquiryForm.astro'), 'utf8');
  assert(!flightFormContent.includes('id: \'travel-itinerary\''), 'Travel Itinerary card removed from FlightEnquiryForm');
  assert(!flightFormContent.includes('Route Planning'), 'Route Planning tag removed');
});

// 14. Removals on About page
test('About page has Hanumangarh Advisory Team banner removed', () => {
  const aboutContent = fs.readFileSync(path.join(PAGES_DIR, 'about.astro'), 'utf8');
  assert(!aboutContent.includes('Meet Our Hanumangarh Advisory Team'), 'Advisory Team banner must be removed');
  assert(!aboutContent.includes('ConsultationCTA'), 'ConsultationCTA import/usage must be removed');
});

// 15. Backend API test
test('api/enquiry.js handles submissionType=service with minimal payload', async () => {
  const apiHandler = (await import(path.resolve('api/enquiry.js'))).default;
  
  let responseCode = null;
  let responseData = null;
  const mockRes = {
    setHeader() {},
    status(code) {
      responseCode = code;
      return {
        json(data) {
          responseData = data;
          return data;
        }
      };
    }
  };

  const mockReq = {
    method: 'POST',
    body: {
      submissionType: 'service',
      service: 'Dummy Tickets',
      fullName: 'Rahul Sharma',
      phone: '+919876543210',
      message: 'Need temporary reservation for Schengen visa',
      website_url_check: '',
    }
  };

  await apiHandler(mockReq, mockRes);
  assert.strictEqual(responseCode, 200, `Expected 200, got ${responseCode}`);
  assert.strictEqual(responseData.success, true, 'API response must have success=true');
  assert(responseData.leadId.startsWith('VC-SRV-'), `Lead ID must start with VC-SRV-, got ${responseData.leadId}`);
});

console.log(`\n--- TEST SUMMARY: ${passedTests}/${totalTests} PASSED ---`);
if (passedTests === totalTests) {
  console.log('ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
  process.exit(0);
} else {
  console.error('SOME CHECKS FAILED!');
  process.exit(1);
}
