import json
import csv
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

COUNTRIES_FILE = r'client-content\countries\countries.json'
UNIS_JSON_FILE = r'client-content\universities\universities.json'
UNIS_CSV_FILE = r'client-content\universities\universities.csv'

print('=== EXECUTING CLIENT CONTENT INTEGRATION ===')

# 1. UPDATE COUNTRIES.JSON
with open(COUNTRIES_FILE, 'r', encoding='utf-8') as f:
    countries_data = json.load(f)

existing_slugs = {c['slug'] for c in countries_data['countries']}

new_countries = [
    {
        "id": "country-moldova",
        "name": "Moldova",
        "slug": "moldova",
        "flagCode": "MD",
        "continent": "Europe",
        "heroImage": "/assets/images/destinations/moldova-hero.webp",
        "shortDescription": "Eastern European hub for affordable medical and technical higher education recognized globally.",
        "introduction": "Moldova offers recognized medical and technical degree programs with English-language instruction, established hospital clinical networks, and economical tuition structures for international students.",
        "whyStudyHere": [
            "Affordable government medical university tuition fees with recognized clinical degrees.",
            "English-medium general medicine programs complying with international health directives.",
            "Safe, welcoming European study environment with moderate living costs."
        ],
        "educationSystem": {
            "overview": "Moldovan higher education adheres to the Bologna Process, offering European Credit Transfer System (ECTS) accredited qualifications across public state universities.",
            "keyPoints": [
                "Bologna ECTS modular qualification system.",
                "English-medium medical faculties with hospital clinical rotations."
            ],
            "structure": "Bachelor (3–4 years), Integrated Medical MD/MBBS (6 years), Master (1–2 years), Doctorate (3–4 years)"
        },
        "studyLevels": ["Undergraduate", "Postgraduate", "MBBS", "Doctoral / PhD"],
        "admissionGuidance": {
            "overview": "Admissions require certified high school 10+2 certificates with Physics, Chemistry, and Biology prerequisites.",
            "generalRequirements": [
                "10+2 with minimum 50% in PCB (40% for reserved categories).",
                "Qualified NEET-UG scorecard for Indian medical applicants."
            ],
            "intakePeriods": ["Autumn Intake (September / October)"],
            "languageRequirements": "English-medium institutional interview or assessment."
        },
        "visaGuidance": {
            "visaType": "Long-Stay Student Visa (Type D) & Temporary Residence Permit",
            "overview": "Immigration clearance requires formal ministerial acceptance letter, certified medical fitness, living expense support, and consular interview.",
            "keyRequirements": [
                "Official university acceptance letter.",
                "Valid passport with at least 18 months remaining validity.",
                "Proof of tuition deposit and maintenance funds."
            ],
            "processingTime": "3 to 6 weeks.",
            "workRights": "Subject to national student residence regulations.",
            "disclaimer": "Visa issuance is the sole prerogative of the embassy and immigration authorities of the Republic of Moldova. Visa Convention facilitates diligent documentation without guaranteeing embassy outcomes."
        },
        "costInformation": {
            "tuitionRange": "€3,500 – €5,000 / year (Medical Faculty)",
            "livingCostRange": "€3,000 – €4,500 / year",
            "currency": "EUR",
            "notes": "Tuition figures are set by state university rectorates and subject to annual review."
        },
        "scholarshipInformation": {
            "available": False,
            "overview": "International medical programs offer subsidized baseline tuition fees in lieu of separate direct scholarships.",
            "opportunities": [],
            "notes": "Tuition structures are kept economical directly by government ministries."
        },
        "servicesAvailable": [
            "Eligibility Assessment & Document Verification",
            "Ministry Invitation Processing",
            "Embassy Visa Dossier Compilation",
            "Pre-Departure Briefing & Airport Welcoming"
        ],
        "faqs": [
            {
                "question": "Are Moldovan medical degrees recognized by NMC and WHO?",
                "answer": "Yes, institutions like Nicolae Testemițanu State University of Medicine and Pharmacy are listed in the World Directory of Medical Schools (WDOMS) and comply with NMC FMGL regulations."
            }
        ],
        "relatedUniversityIds": ["uni-technical-university-of-moldova", "uni-nicolae-testemitanu-state-medical-university"],
        "featured": False,
        "active": True,
        "publicationStatus": "draft",
        "sourceLinks": [
            {
                "label": "Ministry of Education and Research of Moldova",
                "url": "https://mec.gov.md/en"
            }
        ],
        "lastReviewed": "2026-11-10"
    },
    {
        "id": "country-lithuania",
        "name": "Lithuania",
        "slug": "lithuania",
        "flagCode": "LT",
        "continent": "Europe",
        "heroImage": "/assets/images/destinations/lithuania-hero.webp",
        "shortDescription": "Baltic innovation center offering premier English-taught degrees, medical schools, and funded doctoral research positions.",
        "introduction": "Lithuania is an advanced European Union and Schengen member state offering high-standard higher education across world-ranked research universities, medical academies, and technical institutions.",
        "whyStudyHere": [
            "European Union accredited degrees fully recognized worldwide under Bologna / ECTS standards.",
            "English-medium medical and health science programs (LSMU) with modern university hospitals.",
            "State-funded PhD positions offering tuition remission and research grant stipends.",
            "Permitted to work up to 20 hours per week during studies and 15-month stay-back job search permit."
        ],
        "educationSystem": {
            "overview": "Lithuania has an internationally renowned higher education system comprising state research universities and universities of applied sciences.",
            "keyPoints": [
                "Full European Union and Bologna Process compliance.",
                "Strong emphasis on biotechnology, lasers, medical sciences, and ICT."
            ],
            "structure": "Bachelor (3–4 years), Master (1.5–2 years), Integrated Medicine (6 years), Doctorate (4 years)"
        },
        "studyLevels": ["Undergraduate", "Postgraduate", "MBBS", "Doctoral / PhD"],
        "admissionGuidance": {
            "overview": "Admissions require certified secondary / bachelor's transcripts, recognized English proficiency (IELTS 6.0+), and motivation letter.",
            "generalRequirements": [
                "Undergraduate: Minimum 65%+ in 10+2 from recognized board.",
                "MBBS: Biology and Chemistry prerequisites, entrance exam, NEET for Indian candidates.",
                "PhD: Recognized Master's degree, research proposal, supervisor agreement."
            ],
            "intakePeriods": ["Autumn (September) - Primary Intake", "Spring (February) - Selected Programs"],
            "languageRequirements": "IELTS Academic 6.0–6.5, TOEFL iBT 80+, or equivalent."
        },
        "visaGuidance": {
            "visaType": "National Long-Stay Visa (Type D) & Temporary Residence Permit (TRP)",
            "overview": "Applications are submitted through MIGRIS (Lithuanian Migration Department) and authorized VFS Global visa application centers.",
            "keyRequirements": [
                "Mediation letter from Lithuanian university via MIGRIS.",
                "Proof of financial subsistence (approx. €450/month) and tuition payment.",
                "Police clearance certificate apostilled by MEA."
            ],
            "processingTime": "4 to 8 weeks.",
            "workRights": "International students are permitted to work up to 20 hours per week during term.",
            "disclaimer": "Visa issuance is the sole prerogative of the Migration Department under the Ministry of the Interior of the Republic of Lithuania. Visa Convention facilitates honest, diligent file compilation without guaranteeing embassy outcomes."
        },
        "costInformation": {
            "tuitionRange": "€3,000 – €7,500 / year (Engineering/Business); €12,500 – €13,500 / year (Medicine)",
            "livingCostRange": "€5,000 – €7,000 / year",
            "currency": "EUR",
            "notes": "Living expenses in Vilnius and Kaunas are highly competitive compared to Western Europe."
        },
        "scholarshipInformation": {
            "available": True,
            "overview": "Lithuanian State Scholarships provide tuition waivers and monthly stipends for international Master's and PhD candidates.",
            "opportunities": [
                "Lithuanian State Scholarships for Master's Studies",
                "Institutional Doctoral Fellowships with Monthly Stipend"
            ],
            "notes": "State scholarship applications open annually in February."
        },
        "servicesAvailable": [
            "Academic Counseling & Institutional Shortlisting",
            "Application & Motivation Letter Review",
            "MIGRIS Mediation Letter Coordination",
            "Embassy Visa Dossier Compilation",
            "Pre-Departure Briefing & Student Ticketing"
        ],
        "faqs": [
            {
                "question": "Can international students work in Lithuania during their studies?",
                "answer": "Yes, international students holding a valid Lithuanian Temporary Residence Permit (TRP) are legally permitted to work up to 20 hours per week during academic semesters."
            }
        ],
        "relatedUniversityIds": [
            "uni-lithuanian-university-of-health-sciences",
            "uni-vilnius-university",
            "uni-kaunas-university-of-technology",
            "uni-vilnius-gediminas-technical-university"
        ],
        "featured": False,
        "active": True,
        "publicationStatus": "draft",
        "sourceLinks": [
            {
                "label": "Official Study in Lithuania Portal",
                "url": "https://www.studyinlithuania.lt"
            },
            {
                "label": "Lithuanian Migration Department (MIGRIS)",
                "url": "https://www.migracija.lt"
            }
        ],
        "lastReviewed": "2026-11-10"
    },
    {
        "id": "country-azerbaijan",
        "name": "Azerbaijan",
        "slug": "azerbaijan",
        "flagCode": "AZ",
        "continent": "Asia",
        "heroImage": "/assets/images/destinations/azerbaijan-hero.webp",
        "shortDescription": "Emerging destination for English-taught medical education, modern Caspian campus facilities, and economical living.",
        "introduction": "Azerbaijan is an emerging center for international higher education, offering English-medium degree programs in medicine, petroleum engineering, and international business.",
        "whyStudyHere": [
            "Affordable government medical university tuition fees with recognized clinical degrees.",
            "English-medium general medicine programs complying with international health directives.",
            "Modern campus facilities in Baku with rich cultural heritage and safe urban living."
        ],
        "educationSystem": {
            "overview": "Azerbaijan's higher education system operates under the Bologna Process across state universities and specialized academies.",
            "keyPoints": [
                "Credit-based modular system aligned with ECTS.",
                "English-medium international medical and engineering faculties."
            ],
            "structure": "Bachelor (4 years), Master (2 years), Integrated Medical MD/MBBS (6 years), Doctorate (3–4 years)"
        },
        "studyLevels": ["Undergraduate", "Postgraduate", "MBBS", "Doctoral / PhD"],
        "admissionGuidance": {
            "overview": "Admissions require secondary school certification (10+2 with PCB for medical programs), NEET qualification for Indian students, and medical clearance.",
            "generalRequirements": [
                "Minimum 50% in 10+2 PCB subjects.",
                "Valid NEET qualifying scorecard for Indian medical aspirants."
            ],
            "intakePeriods": ["Autumn Intake (September / October)"],
            "languageRequirements": "English-medium interview or institutional test."
        },
        "visaGuidance": {
            "visaType": "Student Visa & State Migration Service Residence Permit",
            "overview": "International students receive an official invitation letter registered with the State Migration Service, followed by student visa clearance.",
            "keyRequirements": [
                "Official invitation letter from the Ministry of Science and Education.",
                "Passport with at least 12 months validity.",
                "Medical fitness certificate including HIV and hepatitis clearance."
            ],
            "processingTime": "3 to 5 weeks.",
            "workRights": "Subject to national student residence permits.",
            "disclaimer": "Visa issuance is the sole prerogative of the State Migration Service and Embassy of the Republic of Azerbaijan. Visa Convention facilitates honest, diligent file compilation without guaranteeing embassy outcomes."
        },
        "costInformation": {
            "tuitionRange": "$4,000 – $5,000 / year (Medical Faculty)",
            "livingCostRange": "$3,000 – $4,500 / year",
            "currency": "USD",
            "notes": "Living expenses in Baku are economical with subsidized university dormitory accommodation."
        },
        "scholarshipInformation": {
            "available": False,
            "overview": "Tuition fees for international students are kept affordable directly through government state university structures.",
            "opportunities": [],
            "notes": "State university tuition rates are fixed and highly competitive."
        },
        "servicesAvailable": [
            "Eligibility Assessment & Document Verification",
            "State Migration Service Invitation Processing",
            "Embassy Visa Dossier Compilation",
            "Pre-Departure Briefing & Airport Welcoming"
        ],
        "faqs": [
            {
                "question": "Is Azerbaijan Medical University recognized internationally?",
                "answer": "Yes, Azerbaijan Medical University is listed in the World Directory of Medical Schools (WDOMS) and recognized by the Ministry of Science and Education of Azerbaijan."
            }
        ],
        "relatedUniversityIds": ["uni-azerbaijan-medical-university"],
        "featured": False,
        "active": True,
        "publicationStatus": "draft",
        "sourceLinks": [
            {
                "label": "Ministry of Science and Education of the Republic of Azerbaijan",
                "url": "https://edu.gov.az/en"
            }
        ],
        "lastReviewed": "2026-11-10"
    }
]

added_countries = 0
for nc in new_countries:
    if nc['slug'] not in existing_slugs:
        countries_data['countries'].append(nc)
        added_countries += 1
        print(f"Added draft country: {nc['name']} ({nc['slug']})")

countries_data['totalPublished'] = len([c for c in countries_data['countries'] if c.get('publicationStatus') == 'published'])

with open(COUNTRIES_FILE, 'w', encoding='utf-8') as f:
    json.dump(countries_data, f, indent=2, ensure_ascii=False)

print(f"Countries updated. Total countries in JSON: {len(countries_data['countries'])}, Total Published: {countries_data['totalPublished']}")

# 2. UPDATE UNIVERSITIES.JSON & CSV
with open(UNIS_JSON_FILE, 'r', encoding='utf-8') as f:
    unis_data = json.load(f)

existing_unis = unis_data.get('universities', [])
existing_uni_ids = {u['id'] for u in existing_unis}
existing_uni_slugs = {u['slug'] for u in existing_unis}

# 11 new institutions
new_unis = [
    {
        "id": "uni-technical-university-of-moldova",
        "name": "Technical University of Moldova",
        "slug": "technical-university-of-moldova",
        "countryId": "country-moldova",
        "countrySlug": "moldova",
        "countryName": "Moldova",
        "city": "Chișinău",
        "officialWebsite": "https://utm.md/en/",
        "institutionType": "Public Technical & Medical University",
        "studyLevels": ["MBBS", "Bachelors", "Masters"],
        "subjectAreas": ["Medicine", "Engineering", "Biomedical Technology"],
        "courses": ["General Medicine (MD/MBBS)", "Biomedical Engineering"],
        "admissionInformation": "High school secondary completion with Biology and Chemistry prerequisites. Direct application review.",
        "tuitionInformation": "Advisory medical tuition: €3,500 – €4,500 / year.",
        "scholarshipInformation": "Subsidized government baseline fee structure.",
        "featured": False,
        "relationshipStatus": "listed_for_guidance",
        "publicationStatus": "published",
        "hasDetailedProfile": False,
        "sourceLinks": [{"label": "Official Portal", "url": "https://utm.md/en/"}],
        "lastReviewed": "2026-11-10"
    },
    {
        "id": "uni-nicolae-testemitanu-state-medical-university",
        "name": "Nicolae Testemițanu State University of Medicine and Pharmacy",
        "slug": "nicolae-testemitanu-state-medical-university",
        "countryId": "country-moldova",
        "countrySlug": "moldova",
        "countryName": "Moldova",
        "city": "Chișinău",
        "officialWebsite": "https://usmf.md/en",
        "institutionType": "State Medical University",
        "studyLevels": ["MBBS"],
        "subjectAreas": ["Medicine", "Pharmacy", "Dentistry"],
        "courses": ["General Medicine (MD/MBBS)", "Dentistry", "Pharmacy"],
        "admissionInformation": "10+2 with PCB, recognized NEET qualification for Indian nationals. 6-year English medium program.",
        "tuitionInformation": "Advisory medical tuition: €4,000 – €5,000 / year.",
        "scholarshipInformation": "Transparent state tuition fees.",
        "featured": False,
        "relationshipStatus": "listed_for_guidance",
        "publicationStatus": "published",
        "hasDetailedProfile": False,
        "sourceLinks": [{"label": "Official Portal", "url": "https://usmf.md/en"}],
        "lastReviewed": "2026-11-10"
    },
    {
        "id": "uni-riga-stradins-university",
        "name": "Riga Stradiņš University (RSU)",
        "slug": "riga-stradins-university",
        "countryId": "country-latvia",
        "countrySlug": "latvia",
        "countryName": "Latvia",
        "city": "Riga",
        "officialWebsite": "https://www.rsu.lv/en",
        "institutionType": "Public Research Medical University",
        "studyLevels": ["MBBS", "Masters", "Doctorate"],
        "subjectAreas": ["Medicine", "Health Sciences", "Dentistry"],
        "courses": ["Doctor of Medicine (MD/MBBS)", "Dental Medicine"],
        "admissionInformation": "High school secondary completion with 2 semesters of Biology and Chemistry. English proficiency (IELTS 6.0+).",
        "tuitionInformation": "Advisory medical tuition: €13,500 / year.",
        "scholarshipInformation": "Institutional academic merit awards.",
        "featured": False,
        "relationshipStatus": "listed_for_guidance",
        "publicationStatus": "published",
        "hasDetailedProfile": False,
        "sourceLinks": [{"label": "Official Portal", "url": "https://www.rsu.lv/en"}],
        "lastReviewed": "2026-11-10"
    },
    {
        "id": "uni-catolica-medical-school",
        "name": "Católica Medical School",
        "slug": "catolica-medical-school",
        "countryId": "country-portugal",
        "countrySlug": "portugal",
        "countryName": "Portugal",
        "city": "Lisbon",
        "officialWebsite": "https://medicina.ucp.pt/en",
        "institutionType": "Private Medical Faculty",
        "studyLevels": ["MBBS"],
        "subjectAreas": ["Medicine", "Biomedical Sciences"],
        "courses": ["Integrated Master in Medicine (MD/MBBS)"],
        "admissionInformation": "English-taught integrated medicine curriculum in partnership with Maastricht University.",
        "tuitionInformation": "Institutional fee schedule provided upon admissions eligibility review.",
        "scholarshipInformation": "Merit scholarships evaluated during admission review.",
        "featured": False,
        "relationshipStatus": "listed_for_guidance",
        "publicationStatus": "published",
        "hasDetailedProfile": False,
        "sourceLinks": [{"label": "Official Portal", "url": "https://medicina.ucp.pt/en"}],
        "lastReviewed": "2026-11-10"
    },
    {
        "id": "uni-lithuanian-university-of-health-sciences",
        "name": "Lithuanian University of Health Sciences (LSMU)",
        "slug": "lithuanian-university-of-health-sciences",
        "countryId": "country-lithuania",
        "countrySlug": "lithuania",
        "countryName": "Lithuania",
        "city": "Kaunas",
        "officialWebsite": "https://lsmu.lt/en/",
        "institutionType": "Public Medical & Health University",
        "studyLevels": ["MBBS", "Masters", "Doctorate"],
        "subjectAreas": ["Medicine", "Veterinary Medicine", "Pharmacy", "Public Health"],
        "courses": ["General Medicine (MD/MBBS)", "Odontology", "Pharmacy"],
        "admissionInformation": "Recognized secondary diploma with strong marks in Biology and Chemistry, institutional entrance examination.",
        "tuitionInformation": "Advisory medical tuition: €12,500 – €13,500 / year.",
        "scholarshipInformation": "Lithuanian state and university merit scholarships.",
        "featured": False,
        "relationshipStatus": "listed_for_guidance",
        "publicationStatus": "published",
        "hasDetailedProfile": False,
        "sourceLinks": [{"label": "Official Portal", "url": "https://lsmu.lt/en/"}],
        "lastReviewed": "2026-11-10"
    },
    {
        "id": "uni-azerbaijan-medical-university",
        "name": "AZERBAIJAN MEDICAL University",
        "slug": "azerbaijan-medical-university",
        "countryId": "country-azerbaijan",
        "countrySlug": "azerbaijan",
        "countryName": "Azerbaijan",
        "city": "Baku",
        "officialWebsite": "https://amu.edu.az/en",
        "institutionType": "Public State Medical University",
        "studyLevels": ["MBBS"],
        "subjectAreas": ["Medicine", "Dentistry", "Pharmacy", "Public Health"],
        "courses": ["General Medicine (MBBS/MD)", "Dentistry", "Pharmacy"],
        "admissionInformation": "Secondary 10+2 with PCB, NEET qualification for Indian students. English-medium faculty.",
        "tuitionInformation": "Advisory medical tuition: $4,000 – $5,000 / year.",
        "scholarshipInformation": "Economical government tuition fee schedule.",
        "featured": False,
        "relationshipStatus": "listed_for_guidance",
        "publicationStatus": "published",
        "hasDetailedProfile": False,
        "sourceLinks": [{"label": "Official Portal", "url": "https://amu.edu.az/en"}],
        "lastReviewed": "2026-11-10"
    },
    {
        "id": "uni-vilnius-university",
        "name": "Vilnius University (VU)",
        "slug": "vilnius-university",
        "countryId": "country-lithuania",
        "countrySlug": "lithuania",
        "countryName": "Lithuania",
        "city": "Vilnius",
        "officialWebsite": "https://www.vu.lt/en/",
        "institutionType": "Flagship Public Research University",
        "studyLevels": ["Doctorate", "Masters", "Bachelors"],
        "subjectAreas": ["Doctoral Research", "Physical Sciences", "Humanities", "Medicine", "Informatics"],
        "courses": ["PhD Physics", "PhD Computer Science", "PhD Medicine", "Master Programs"],
        "admissionInformation": "Master's degree or equivalent, research project proposal, publication record and supervisor alignment.",
        "tuitionInformation": "State-funded doctoral assistantships available with monthly researcher scholarships.",
        "scholarshipInformation": "Lithuanian state research scholarships and tuition remission.",
        "featured": False,
        "relationshipStatus": "listed_for_guidance",
        "publicationStatus": "published",
        "hasDetailedProfile": False,
        "sourceLinks": [{"label": "Official Portal", "url": "https://www.vu.lt/en/"}],
        "lastReviewed": "2026-11-10"
    },
    {
        "id": "uni-kaunas-university-of-technology",
        "name": "Kaunas University of Technology (KTU)",
        "slug": "kaunas-university-of-technology",
        "countryId": "country-lithuania",
        "countrySlug": "lithuania",
        "countryName": "Lithuania",
        "city": "Kaunas",
        "officialWebsite": "https://en.ktu.edu/",
        "institutionType": "Public Research Technical University",
        "studyLevels": ["Doctorate", "Masters"],
        "subjectAreas": ["Doctoral Research", "Engineering", "Technology", "Informatics"],
        "courses": ["PhD Materials Engineering", "PhD Informatics", "PhD Chemical Engineering"],
        "admissionInformation": "Master's degree in engineering/sciences, academic recommendation, research outline.",
        "tuitionInformation": "Funded PhD positions offering tuition remission and research grant stipends.",
        "scholarshipInformation": "Funded research assistantships.",
        "featured": False,
        "relationshipStatus": "listed_for_guidance",
        "publicationStatus": "published",
        "hasDetailedProfile": False,
        "sourceLinks": [{"label": "Official Portal", "url": "https://en.ktu.edu/"}],
        "lastReviewed": "2026-11-10"
    },
    {
        "id": "uni-vilnius-gediminas-technical-university",
        "name": "Vilnius Gediminas Technical University (Vilnius Tech)",
        "slug": "vilnius-gediminas-technical-university",
        "countryId": "country-lithuania",
        "countrySlug": "lithuania",
        "countryName": "Lithuania",
        "city": "Vilnius",
        "officialWebsite": "https://vilniustech.lt/index.php?lang=2",
        "institutionType": "Public Technical Research University",
        "studyLevels": ["Doctorate", "Masters"],
        "subjectAreas": ["Doctoral Research", "Civil Engineering", "Aviation", "Environmental Engineering"],
        "courses": ["PhD Civil Engineering", "PhD Transport Engineering", "PhD Environmental Sciences"],
        "admissionInformation": "Recognized Master's qualification, certified research proposal and academic advisor consent.",
        "tuitionInformation": "Eligible for institutional doctoral fellowships and Erasmus+ mobility grants.",
        "scholarshipInformation": "Doctoral research fellowships.",
        "featured": False,
        "relationshipStatus": "listed_for_guidance",
        "publicationStatus": "published",
        "hasDetailedProfile": False,
        "sourceLinks": [{"label": "Official Portal", "url": "https://vilniustech.lt/"}],
        "lastReviewed": "2026-11-10"
    },
    {
        "id": "uni-university-of-lisbon",
        "name": "University of Lisbon",
        "slug": "university-of-lisbon",
        "countryId": "country-portugal",
        "countrySlug": "portugal",
        "countryName": "Portugal",
        "city": "Lisbon",
        "officialWebsite": "https://www.ulisboa.pt/en",
        "institutionType": "Major Public Research University",
        "studyLevels": ["Doctorate", "Masters", "Bachelors"],
        "subjectAreas": ["Doctoral Research", "Science", "Law", "Medicine", "Engineering"],
        "courses": ["PhD Computational Sciences", "PhD Biomedical Engineering", "PhD Climate Change"],
        "admissionInformation": "Master's degree, academic supervisor sponsorship, comprehensive doctoral research proposal.",
        "tuitionInformation": "Portuguese FCT (Fundação para a Ciência e a Tecnologia) doctoral research grants available.",
        "scholarshipInformation": "FCT national doctoral research fellowships.",
        "featured": False,
        "relationshipStatus": "listed_for_guidance",
        "publicationStatus": "published",
        "hasDetailedProfile": False,
        "sourceLinks": [{"label": "Official Portal", "url": "https://www.ulisboa.pt/en"}],
        "lastReviewed": "2026-11-10"
    },
    {
        "id": "uni-university-of-porto",
        "name": "University of Porto",
        "slug": "university-of-porto",
        "countryId": "country-portugal",
        "countrySlug": "portugal",
        "countryName": "Portugal",
        "city": "Porto",
        "officialWebsite": "https://sigarra.up.pt/up/en/",
        "institutionType": "Leading Public Research University",
        "studyLevels": ["Doctorate", "Masters"],
        "subjectAreas": ["Doctoral Research", "Engineering (FEUP)", "Biomedical Sciences (ICBAS)", "Economics"],
        "courses": ["PhD Informatics Engineering", "PhD Biomedical Sciences", "PhD Sustainable Chemistry"],
        "admissionInformation": "Master's degree with high GPA, supervisor approval, research plan.",
        "tuitionInformation": "Doctoral funding available via national FCT fellowships and European Horizon projects.",
        "scholarshipInformation": "National FCT and institutional research stipends.",
        "featured": False,
        "relationshipStatus": "listed_for_guidance",
        "publicationStatus": "published",
        "hasDetailedProfile": False,
        "sourceLinks": [{"label": "Official Portal", "url": "https://sigarra.up.pt/up/en/"}],
        "lastReviewed": "2026-11-10"
    }
]

# Tag existing medical universities with MBBS in studyLevels
mbbs_keywords = [
    'medical', 'medicine', 'bukhara state medical', 'samarkand state medical',
    'tashkent state medical', 'kazakh national medical', 'kazakh russian medical',
    'south kazakhstan medical', 'astana medical', 'ural state medical',
    'bashkir state medical', 'orenburg state medical', 'volgograd state medical',
    'perm state medical', 'osh state university', 'osh international medical',
    'central asian international medical', 'jalal-abad university medical',
    'medical university of warsaw', 'poznan university of medical',
    'medical university of silesia', 'wroclaw medical university',
    'tbilisi state medical', 'nova medical school'
]

tagged_mbbs = 0
for u in existing_unis:
    u_lower = u['name'].lower()
    if any(k in u_lower for k in mbbs_keywords):
        if 'MBBS' not in u['studyLevels']:
            u['studyLevels'].append('MBBS')
            tagged_mbbs += 1

print(f"Tagged {tagged_mbbs} existing medical universities with 'MBBS' studyLevel.")

# Ensure PhD universities have Doctorate
phd_keywords = ['riga technical university', 'turiba university']
for u in existing_unis:
    u_lower = u['name'].lower()
    if any(k in u_lower for k in phd_keywords):
        if 'Doctorate' not in u['studyLevels']:
            u['studyLevels'].append('Doctorate')

# Append 11 new universities
added_unis = 0
for nu in new_unis:
    if nu['id'] not in existing_uni_ids and nu['slug'] not in existing_uni_slugs:
        existing_unis.append(nu)
        existing_uni_ids.add(nu['id'])
        existing_uni_slugs.add(nu['slug'])
        added_unis += 1
        print(f"Added new university: {nu['name']} ({nu['countryName']})")

unis_data['universities'] = existing_unis
unis_data['totalRecords'] = len(existing_unis)

with open(UNIS_JSON_FILE, 'w', encoding='utf-8') as f:
    json.dump(unis_data, f, indent=2, ensure_ascii=False)

print(f"Universities JSON updated. Total universities: {unis_data['totalRecords']}")

# Update universities.csv to match exactly
fieldnames = [
    "id", "name", "slug", "countryId", "countrySlug", "countryName",
    "city", "officialWebsite", "institutionType", "studyLevels",
    "subjectAreas", "courses", "admissionInformation", "tuitionInformation",
    "scholarshipInformation", "featured", "relationshipStatus", "logoAsset",
    "coverImage", "sourceLinks", "lastReviewed", "publicationStatus", "hasDetailedProfile"
]

with open(UNIS_CSV_FILE, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(fieldnames)
    for u in existing_unis:
        levels_str = "; ".join(u.get("studyLevels", []))
        subjects_str = "; ".join(u.get("subjectAreas", []))
        courses_str = "; ".join(u.get("courses", []))
        sources_str = "; ".join([s.get("url", "") if isinstance(s, dict) else str(s) for s in u.get("sourceLinks", [])])
        writer.writerow([
            u.get("id", ""),
            u.get("name", ""),
            u.get("slug", ""),
            u.get("countryId", ""),
            u.get("countrySlug", ""),
            u.get("countryName", ""),
            u.get("city", ""),
            u.get("officialWebsite", ""),
            u.get("institutionType", ""),
            levels_str,
            subjects_str,
            courses_str,
            u.get("admissionInformation", ""),
            u.get("tuitionInformation", ""),
            u.get("scholarshipInformation", ""),
            str(u.get("featured", False)),
            u.get("relationshipStatus", "listed_for_guidance"),
            u.get("logoAsset", ""),
            u.get("coverImage", ""),
            sources_str,
            u.get("lastReviewed", "2026-11-10"),
            u.get("publicationStatus", "published"),
            str(u.get("hasDetailedProfile", False))
        ])

print(f"Universities CSV updated with {len(existing_unis)} records.")
