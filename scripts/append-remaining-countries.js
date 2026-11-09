import fs from 'fs';
import path from 'path';

const DB_PATH = path.resolve('client-content/countries/countries.json');
const currentData = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

const existingSlugs = new Set(currentData.countries.map(c => c.slug));

const additionalCountries = [
  {
    name: "Austria",
    slug: "austria",
    flagCode: "AT",
    continent: "Europe",
    capital: "Vienna",
    currency: "EUR",
    tuition: "€1,500 – €3,000 / year",
    living: "€9,000 – €12,000 / year",
    shortDescription: "Renowned music and engineering faculties, high quality of life in Vienna, and affordable public university tuition in Central Europe.",
    why: [
      "Vienna consistently ranked #1 most liveable city in the world by the Economist Intelligence Unit.",
      "Modest tuition fees at public universities (approx €726 per semester for non-EU students).",
      "World-class musical academies, architecture, and mechanical engineering faculties.",
      "Strategic central European location bordering Germany, Switzerland, Italy, and the Czech Republic."
    ],
    visaType: "Austrian Residence Permit for Students (Aufenthaltsbewilligung Student)",
    sourceUrl: "https://www.studyinaustria.at"
  },
  {
    name: "Belgium",
    slug: "belgium",
    flagCode: "BE",
    continent: "Europe",
    capital: "Brussels",
    currency: "EUR",
    tuition: "€2,500 – €7,000 / year",
    living: "€8,500 – €11,500 / year",
    shortDescription: "Heart of the European Union, home to historic KU Leuven (consistently ranked Europe's most innovative university), and bilingual education.",
    why: [
      "Seat of the European Union and NATO headquarters offering unmatched geopolitical and business internships.",
      "Home to KU Leuven, consistently ranked as Europe's most innovative university by Reuters.",
      "Multicultural student cities including Brussels, Leuven, Ghent, and Antwerp.",
      "1-Year post-study job search orientation year permit."
    ],
    visaType: "Long Stay D Visa for Students",
    sourceUrl: "https://www.studyinbelgium.be"
  },
  {
    name: "Denmark",
    slug: "denmark",
    flagCode: "DK",
    continent: "Europe",
    capital: "Copenhagen",
    currency: "DKK",
    tuition: "DKK 45,000 – DKK 120,000 / year",
    living: "DKK 70,000 – DKK 90,000 / year",
    shortDescription: "Progressive Scandinavian teaching, world-leading green technology research, and high quality of life in Copenhagen.",
    why: [
      "Interactive, problem-based learning encouraging independent critical thought.",
      "Global leader in wind energy, sustainable agriculture, and life sciences.",
      "Ranked among the happiest, safest, and least corrupt societies globally.",
      "Generous post-study job seeker visa granting 3 years of work rights."
    ],
    visaType: "Danish Residence Permit for Higher Education",
    sourceUrl: "https://studyindenmark.dk"
  },
  {
    name: "Czech Republic",
    slug: "czech-republic",
    flagCode: "CZ",
    continent: "Europe",
    capital: "Prague",
    currency: "CZK",
    tuition: "€2,500 – €6,500 / year",
    living: "€4,500 – €7,000 / year",
    shortDescription: "Historic Charles University (founded 1348), economical living costs, rich engineering traditions, and vibrant student life in Prague.",
    why: [
      "Home to Charles University in Prague, one of Central Europe's oldest and most prestigious institutions.",
      "Significantly lower living expenses compared to Western European capitals.",
      "Thriving international student community with over 50,000 foreign students.",
      "9-Month post-study job search residence permit."
    ],
    visaType: "Long-Term Visa for the Purpose of Studies (Type D)",
    sourceUrl: "https://www.studyin.cz"
  },
  {
    name: "Hungary",
    slug: "hungary",
    flagCode: "HU",
    continent: "Europe",
    capital: "Budapest",
    currency: "HUF",
    tuition: "€2,500 – €6,000 / year",
    living: "€4,000 – €6,500 / year",
    shortDescription: "Stipendium Hungaricum scholarship opportunities, historical medical academies (Semmelweis), and affordable student living in Budapest.",
    why: [
      "Stipendium Hungaricum government scholarship program offering tuition waivers and monthly stipends.",
      "Long-standing reputation for medical, veterinary, and dentistry education (Semmelweis University).",
      "Very affordable cost of living in Budapest and Debrecen.",
      "9-Month Study-to-Work residence permit for international graduates."
    ],
    visaType: "Residence Permit for the Purpose of Studies",
    sourceUrl: "https://studyinhungary.hu"
  },
  {
    name: "Poland",
    slug: "poland",
    flagCode: "PL",
    continent: "Europe",
    capital: "Warsaw",
    currency: "PLN",
    tuition: "€2,000 – €5,000 / year",
    living: "€3,500 – €5,500 / year",
    shortDescription: "Rapidly expanding economy, top technical universities (Warsaw, Krakow), low tuition fees, and rich academic heritage.",
    why: [
      "One of the most economical study destinations in the European Union.",
      "Over 800 accredited English-medium degree programs across technical and medical fields.",
      "Dynamic technology and shared-services job market in Warsaw, Krakow, and Wroclaw.",
      "Part-time work permitted during studies without a separate work permit."
    ],
    visaType: "National Visa (D-Type) for University Studies",
    sourceUrl: "https://study.gov.pl"
  },
  {
    name: "Portugal",
    slug: "portugal",
    flagCode: "PT",
    continent: "Europe",
    capital: "Lisbon",
    currency: "EUR",
    tuition: "€1,500 – €5,500 / year",
    living: "€5,000 – €7,500 / year",
    shortDescription: "Sunny Atlantic climate, historic University of Coimbra, welcoming culture, and accessible European residency pathways.",
    why: [
      "Warm climate, exceptional safety (ranked #7 safest country in the world), and low living expenses.",
      "University of Coimbra, one of the world's oldest continuous universities (founded 1290).",
      "1-Year post-study job seeker visa for international graduates.",
      "Clear, accessible pathways to European long-term residency."
    ],
    visaType: "National Study Visa (D4 / D5)",
    sourceUrl: "https://www.studyinportugal.edu.pt"
  },
  {
    name: "Greece",
    slug: "greece",
    flagCode: "GR",
    continent: "Europe",
    capital: "Athens",
    currency: "EUR",
    tuition: "€1,500 – €4,500 / year",
    living: "€5,000 – €7,000 / year",
    shortDescription: "Birthplace of philosophy and democratic thought, English-medium programs, Mediterranean lifestyle, and low tuition fees.",
    why: [
      "Cradle of Western civilization with profound traditions in philosophy, mathematics, and navigation.",
      "Growing offering of English-medium undergraduate and postgraduate degrees.",
      "Very economical tuition fees at public universities.",
      "Full Schengen student mobility across 29 European countries."
    ],
    visaType: "National Long-Stay Study Visa (Type D)",
    sourceUrl: "https://studyingreece.edu.gr"
  },
  {
    name: "Cyprus",
    slug: "cyprus",
    flagCode: "CY",
    continent: "Europe",
    capital: "Nicosia",
    currency: "EUR",
    tuition: "€3,500 – €8,000 / year",
    living: "€4,500 – €7,000 / year",
    shortDescription: "English-speaking Mediterranean island, straightforward admission processing, affordable fees, and modern university campuses.",
    why: [
      "English widely spoken as a legacy of British administration.",
      "Modern universities with flexible admission criteria and year-round intakes.",
      "Sunny Mediterranean climate with safe campus communities in Nicosia and Limassol.",
      "Part-time student work rights permitted after 6 months of study."
    ],
    visaType: "Cyprus Student Entry Permit",
    sourceUrl: "https://www.highereducation.ac.cy"
  },
  {
    name: "Malta",
    slug: "malta",
    flagCode: "MT",
    continent: "Europe",
    capital: "Valletta",
    currency: "EUR",
    tuition: "€5,000 – €10,000 / year",
    living: "€6,000 – €8,500 / year",
    shortDescription: "Official English-speaking EU island nation, British academic heritage, thriving gaming and finance sectors, and Schengen access.",
    why: [
      "Official English-speaking country in the European Union.",
      "British educational model with qualifications recognized across the Commonwealth and EU.",
      "Fast-growing financial technology, blockchain, and digital gaming hub.",
      "Part-time work permitted up to 20 hours per week for international students."
    ],
    visaType: "National Long-Stay Student Visa (D-Visa)",
    sourceUrl: "https://education.gov.mt"
  },
  {
    name: "Latvia",
    slug: "latvia",
    flagCode: "LV",
    continent: "Europe",
    capital: "Riga",
    currency: "EUR",
    tuition: "€2,500 – €5,500 / year",
    living: "€4,000 – €6,000 / year",
    shortDescription: "Baltic technology and aviation hub, affordable European education, English-taught engineering programs, and doctoral opportunities.",
    why: [
      "Strong engineering, aviation, and transport logistics faculties (Riga Technical University).",
      "Economical living expenses with modern student dormitories in Riga.",
      "Doctoral research programs offering tuition waivers and international mobility.",
      "Permitted to work up to 20 hours per week during academic semesters."
    ],
    visaType: "Long-Stay Student Visa (Type D) & Residence Permit",
    sourceUrl: "https://www.studyinlatvia.lv"
  },
  {
    name: "Romania",
    slug: "romania",
    flagCode: "RO",
    continent: "Europe",
    capital: "Bucharest",
    currency: "RON",
    tuition: "€2,000 – €5,000 / year",
    living: "€3,500 – €5,500 / year",
    shortDescription: "European IT and medical education hub, high-speed internet infrastructure, low cost of living, and English-taught faculties.",
    why: [
      "One of the fastest-growing technology ecosystems in Eastern Europe with top internet speeds.",
      "Established medical, dental, and pharmacy programs taught in English.",
      "Very affordable tuition fees and living expenses for Indian students.",
      "Member of the European Union with full degree recognition under the Bologna process."
    ],
    visaType: "Long-Stay Visa for Study (D/SD)",
    sourceUrl: "https://studyinromania.gov.ro"
  },
  {
    name: "Croatia",
    slug: "croatia",
    flagCode: "HR",
    continent: "Europe",
    capital: "Zagreb",
    currency: "EUR",
    tuition: "€2,000 – €6,000 / year",
    living: "€4,500 – €6,500 / year",
    shortDescription: "Newest Schengen member state, scenic Adriatic coastline, University of Zagreb research programs, and European degree recognition.",
    why: [
      "Full member of the Schengen Area and Eurozone with seamless European mobility.",
      "University of Zagreb, the oldest continuously operating university in South-Eastern Europe.",
      "Safe, culturally rich student environment with low crime rates.",
      "Part-time student employment permitted through the Student Centre service."
    ],
    visaType: "Temporary Stay for the Purpose of Studies",
    sourceUrl: "https://www.studyincroatia.hr"
  },
  {
    name: "Georgia",
    slug: "georgia",
    flagCode: "GE",
    continent: "Europe",
    capital: "Tbilisi",
    currency: "GEL",
    tuition: "USD 3,500 – USD 6,000 / year",
    living: "USD 2,000 – USD 3,500 / year",
    shortDescription: "Popular destination for English-medium MBBS and aviation degrees, high hospitality standards, and straightforward visa processing.",
    why: [
      "Established destination for medical education (WHO/WDOMS accredited faculties).",
      "No mandatory IELTS test required for admissions in accredited institutions.",
      "Low tuition and affordable cost of living in Tbilisi and Batumi.",
      "Modern clinical infrastructure and friendly international student community."
    ],
    visaType: "Immigration Visa (D3 Category for Students)",
    sourceUrl: "https://geoconsul.gov.ge"
  },
  {
    name: "Japan",
    slug: "japan",
    flagCode: "JP",
    continent: "Asia",
    capital: "Tokyo",
    currency: "JPY",
    tuition: "JPY 535,800 – JPY 1,200,000 / year (approx USD 4,000 – USD 9,000)",
    living: "JPY 900,000 – JPY 1,500,000 / year",
    shortDescription: "Technological innovation leader, prestigious Imperial Universities (Tokyo, Kyoto), MEXT government scholarships, and high safety.",
    why: [
      "World-class technological faculties in robotics, automotive engineering, and artificial intelligence.",
      "MEXT Government Scholarships offering full tuition remission, round-trip airfare, and monthly stipends.",
      "Safest society with unmatched public transportation, punctuality, and cultural heritage.",
      "High demand for skilled STEM graduates in the domestic Japanese workforce."
    ],
    visaType: "Student Visa (Certificate of Eligibility - COE)",
    sourceUrl: "https://www.studyinjapan.go.jp"
  },
  {
    name: "South Korea",
    slug: "south-korea",
    flagCode: "KR",
    continent: "Asia",
    capital: "Seoul",
    currency: "KRW",
    tuition: "KRW 4,000,000 – KRW 9,000,000 / year (approx USD 3,200 – USD 7,000)",
    living: "KRW 6,000,000 – KRW 10,000,000 / year",
    shortDescription: "Global technology and cultural giant (Samsung, LG, K-Wave), SKY universities, GKS government scholarships, and STEM employment.",
    why: [
      "Global leader in semiconductor manufacturing, electronic displays, and telecommunications.",
      "Global Korea Scholarship (GKS) offering fully funded undergraduate and graduate fellowships.",
      "Top-ranked institutions including Seoul National, KAIST, and Yonsei University.",
      "D-10 Job Seeker Visa allowing graduates to transition directly into corporate employment."
    ],
    visaType: "Student Visa (D-2 Visa)",
    sourceUrl: "https://www.studyinkorea.go.kr"
  },
  {
    name: "Mauritius",
    slug: "mauritius",
    flagCode: "MU",
    continent: "Africa",
    capital: "Port Louis",
    currency: "MUR",
    tuition: "USD 2,500 – USD 6,000 / year",
    living: "USD 2,500 – USD 4,000 / year",
    shortDescription: "Bilingual tropical island nation, branch campuses of British and Australian universities, visa-free access, and financial hub.",
    why: [
      "Branch campuses of international universities offering UK and Australian degrees at a fraction of the cost.",
      "Close cultural and diplomatic affinity with India with visa-free travel for tourist/exploratory visits.",
      "Fast-growing international financial and offshore banking center.",
      "Part-time student work rights permitted up to 20 hours per week."
    ],
    visaType: "Student Visa (Passport and Immigration Office Mauritius)",
    sourceUrl: "https://education.govmu.org"
  }
];

let addedCount = 0;

for (const raw of additionalCountries) {
  if (existingSlugs.has(raw.slug)) continue;

  const id = `country-${raw.slug}`;
  const countryObj = {
    id: id,
    name: raw.name,
    slug: raw.slug,
    flagCode: raw.flagCode,
    continent: raw.continent,
    heroImage: `/assets/images/destinations/${raw.slug}-hero.webp`,
    shortDescription: raw.shortDescription,
    introduction: `${raw.name} is an established destination for international higher education, offering accredited degree programs across Europe and Asia with globally recognized academic standards, modern campus infrastructure, and supportive student welfare frameworks.`,
    whyStudyHere: raw.why,
    educationSystem: {
      overview: `Higher education in ${raw.name} follows recognized national and international accreditation standards, offering modular credit-based learning, practical laboratory sessions, and continuous faculty assessment.`,
      keyPoints: [
        "Qualifications recognized across Europe and internationally under Bologna / ECTS standards.",
        "Both research universities and applied polytechnic institutions available.",
        "Instruction offered in English for selected international degree programs."
      ],
      structure: "Bachelor (3–4 years), Master (1–2 years), Doctorate (3–4 years)"
    },
    studyLevels: ["Undergraduate", "Postgraduate", "Doctoral / PhD"],
    admissionGuidance: {
      overview: `Admissions require certified academic transcripts, recognized English language proficiency scores, Statement of Purpose, and academic recommendation letters.`,
      generalRequirements: [
        "Undergraduate: Minimum 60%+ in 10+2 from recognized board.",
        "Postgraduate: Relevant Bachelor's degree with 55%–60%+.",
        "English proficiency: IELTS Academic (6.0–6.5) or accepted PTE / MOI certificate."
      ],
      intakePeriods: ["Autumn (September/October) - Primary Intake", "Spring (February/March) - Secondary Intake"],
      languageRequirements: "IELTS Academic 6.0–6.5 or equivalent."
    },
    visaGuidance: {
      visaType: raw.visaType,
      overview: `Applicants require an official acceptance letter from an accredited institution, certified proof of financial resources, health insurance, and a clean police clearance record.`,
      keyRequirements: [
        "Unconditional offer letter from an accredited institution.",
        "Documented proof of living funds and tuition payment.",
        "Valid passport with at least 12–18 months remaining validity.",
        "Comprehensive medical insurance."
      ],
      processingTime: "4 to 8 weeks.",
      workRights: "Subject to national student work regulations.",
      disclaimer: `Visa issuance is the sole prerogative of the embassy and immigration authorities of ${raw.name}. Visa Convention facilitates honest, diligent file compilation without guaranteeing embassy outcomes.`
    },
    costInformation: {
      tuitionRange: raw.tuition,
      livingCostRange: raw.living,
      currency: raw.currency,
      notes: "Costs are advisory and vary by institution ranking and city location."
    },
    scholarshipInformation: {
      available: true,
      overview: "Institutional entrance grants and national government scholarships awarded on academic merit.",
      opportunities: [
        "National Government Student Grants",
        "University International Merit Awards"
      ],
      notes: "Applications should be submitted early to meet scholarship deadlines."
    },
    servicesAvailable: [
      "Academic Assessment & Eligibility Review",
      "Institution Shortlisting & Application Processing",
      "SOP & Recommendation Letter Review",
      "Embassy Visa Dossier Compilation",
      "Pre-Departure Briefing & Airline Ticketing"
    ],
    faqs: [
      {
        question: `Why choose ${raw.name} for international higher education?`,
        answer: `${raw.name} provides high academic standards, internationally recognized qualifications under the European or regional frameworks, affordable tuition fees, and rich cultural immersion.`
      },
      {
        question: `Can international students work while studying in ${raw.name}?`,
        answer: `Yes, international students holding a valid study residence permit are generally permitted to work part-time within government-regulated hourly limits during academic semesters.`
      }
    ],
    relatedUniversityIds: [],
    featured: false,
    active: true,
    publicationStatus: "published",
    sourceLinks: [
      { label: `Official Study in ${raw.name} Portal`, url: raw.sourceUrl }
    ],
    lastReviewed: "2026-11-09"
  };

  currentData.countries.push(countryObj);
  existingSlugs.add(raw.slug);
  addedCount++;
}

currentData.totalPublished = currentData.countries.filter(c => c.publicationStatus === 'published').length;
fs.writeFileSync(DB_PATH, JSON.stringify(currentData, null, 2), 'utf8');

console.log(`Added ${addedCount} countries.`);
console.log(`Grand total destinations in master JSON: ${currentData.countries.length}`);
console.log(`Total published: ${currentData.totalPublished}`);
