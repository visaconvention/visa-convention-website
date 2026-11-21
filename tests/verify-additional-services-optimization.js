/**
 * Visa Convention — Additional Services Page Optimization Verification
 * Verifies exact updated description copy and complete absence of promotional banner on all 6 pages.
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';

const PAGES_DIR = path.resolve('src/pages/services');

console.log('--- STARTING ADDITIONAL SERVICES PAGE OPTIMIZATION VERIFICATION ---');

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

const SIX_SERVICES = [
  {
    file: 'passport-assistance.astro',
    title: 'Passport Application Assistance',
    tagline: 'Simplify Your Passport Application Process with Professional Guidance',
    exactDescription: 'Visa Convention assists with new passport applications, renewals, re-issues, and corrections, including documentation, form completion, and appointment guidance through Passport Seva.',
    supersededText: 'Our team helps applicants understand documentation requirements, complete application forms, and navigate appointment procedures',
    useCases: [
      'First-Time Passport Applicants',
      'Passport Renewal & Re-Issue Applicants',
      'Passport Correction & Update Applicants',
    ],
    serviceMetadata: 'Passport Application Assistance',
    btnText: 'Request Passport Assistance',
  },
  {
    file: 'itr-filing.astro',
    title: 'Income Tax Return (ITR) Filing Assistance',
    tagline: 'Simplify Your Income Tax Return Filing with Professional Guidance',
    exactDescription: 'Visa Convention assists individuals and businesses with income tax return filing, document preparation, and procedures through the official Income Tax e-Filing portal.',
    supersededText: 'Our team helps applicants identify relevant filing requirements and coordinate documentation and filing assistance',
    useCases: [
      'Salaried Individuals',
      'Self-Employed Professionals',
      'Business Owners & Freelancers',
    ],
    serviceMetadata: 'ITR Filing Assistance',
    btnText: 'Request ITR Assistance',
  },
  {
    file: 'company-registration.astro',
    title: 'Company Registration Assistance',
    tagline: 'Start Your Business with Professional Registration Guidance',
    exactDescription: 'Visa Convention assists entrepreneurs and businesses with company registration, documentation, and incorporation procedures through the Ministry of Corporate Affairs.',
    supersededText: 'Our team provides procedural guidance and coordinates application documentation according to the proposed business structure',
    useCases: [
      'First-Time Business Owners',
      'Entrepreneurs Starting Companies',
      'Businesses Seeking Incorporation Guidance',
    ],
    serviceMetadata: 'Company Registration Assistance',
    btnText: 'Request Registration Assistance',
  },
  {
    file: 'pcc-assistance.astro',
    title: 'Police Clearance Certificate (PCC) Assistance',
    tagline: 'Simplify Your Police Clearance Certificate Application Process',
    exactDescription: 'Visa Convention assists with PCC applications, required documentation, and appointment procedures for overseas employment, immigration, and other applicable purposes.',
    supersededText: 'A Police Clearance Certificate may be required for overseas employment, immigration, long-term residence',
    useCases: [
      'Overseas Employment Applicants',
      'Immigration & Long-Term Visa Applicants',
      'Individuals Requiring Police Clearance',
    ],
    serviceMetadata: 'Police Clearance Certificate',
    btnText: 'Request PCC Assistance',
  },
  {
    file: 'document-apostille.astro',
    title: 'Document Apostille Assistance',
    tagline: 'Simplify Document Authentication for International Use',
    exactDescription: 'Visa Convention assists with document apostille requirements, preparation, and authentication procedures for international use in countries covered by the Hague Apostille Convention.',
    supersededText: 'An apostille authenticates the origin of a public document for use in countries where the Hague Apostille Convention applies',
    useCases: [
      'Students Applying Abroad',
      'Overseas Employment & Immigration Applicants',
      'Individuals and Businesses Requiring Document Authentication',
    ],
    serviceMetadata: 'Document Apostille',
    btnText: 'Request Apostille Assistance',
  },
  {
    file: 'document-translation.astro',
    title: 'Document Translation Assistance',
    tagline: 'Professional Document Translation Support for International Requirements',
    exactDescription: 'Visa Convention assists with translations of academic, personal, legal, and business documents for international use, including certified translation options where available.',
    supersededText: 'Our team helps applicants understand destination-specific translation requirements and available translation options',
    useCases: [
      'Students & University Applicants',
      'Visa & Immigration Applicants',
      'Individuals and Businesses Requiring Translated Documents',
    ],
    serviceMetadata: 'Document Translation',
    btnText: 'Request Translation Assistance',
  },
];

// Test 1-6: Exact copy, superseded text removed, no banner, use cases and metadata preserved
for (const s of SIX_SERVICES) {
  test(`${s.title}: Exact description matches, superseded text absent, banner removed`, () => {
    const fullPath = path.join(PAGES_DIR, s.file);
    assert.strictEqual(fs.existsSync(fullPath), true, `File ${s.file} must exist`);
    const content = fs.readFileSync(fullPath, 'utf8');

    // 1. Exact description present
    assert(content.includes(s.exactDescription), `Must contain exact description:\n"${s.exactDescription}"`);

    // 2. Superseded description absent
    assert(!content.includes(s.supersededText), `Superseded text must not be present: "${s.supersededText}"`);

    // 3. Promotional banner removed
    assert(!content.includes('Additional%20Visa%20Services%20Guide.png'), `Promotional image must not be present in ${s.file}`);
    assert(!content.includes('heroImage'), `heroImage prop must not be defined in ${s.file}`);

    // 4. Page title and tagline preserved
    assert(content.includes(s.title), `Must contain title "${s.title}"`);
    assert(content.includes(s.tagline), `Must contain tagline "${s.tagline}"`);

    // 5. 3 use cases preserved
    for (const uc of s.useCases) {
      assert(content.includes(uc), `Must contain use case "${uc}"`);
    }

    // 6. Service metadata and submit button preserved
    assert(content.includes(s.serviceMetadata), `Must contain metadata "${s.serviceMetadata}"`);
    assert(content.includes(s.btnText), `Must contain button text "${s.btnText}"`);
  });
}

// Test 7: Homepage service card 6 preserves original image
test('Homepage Additional Services card preserves original image', () => {
  const homeContent = fs.readFileSync(path.resolve('src/pages/index.astro'), 'utf8');
  assert(homeContent.includes('Additional%20Visa%20Services%20Guide.png'), 'Homepage must preserve Additional Services image');
  assert(homeContent.includes('alt="Visa Convention Additional Services Guide'), 'Homepage must preserve alt text');
});

// Test 8: Hub page additional-services.astro has exact copy
test('Hub page additional-services.astro has exact updated descriptions', () => {
  const hubContent = fs.readFileSync(path.join(PAGES_DIR, 'additional-services.astro'), 'utf8');
  for (const s of SIX_SERVICES) {
    assert(hubContent.includes(s.exactDescription), `Hub page must contain exact description for ${s.title}`);
  }
});

console.log(`\n--- TEST SUMMARY: ${passedTests}/${totalTests} PASSED ---`);
if (passedTests === totalTests) {
  console.log('ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
  process.exit(0);
} else {
  console.error('SOME CHECKS FAILED!');
  process.exit(1);
}
