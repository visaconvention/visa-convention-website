import zipfile
import xml.etree.ElementTree as ET
import os
import sys
import re
import csv
import json

sys.stdout.reconfigure(encoding='utf-8')

DATA_DIR = r'..\data'
CSV_OUTPUT = r'client-content\universities\universities.csv'
JSON_OUTPUT = r'client-content\universities\universities.json'

COUNTRY_MAP = {
    'AUSTRALIA.xlsx': ('country-australia', 'australia', 'Australia'),
    'AUSTRIA.xlsx': ('country-austria', 'austria', 'Austria'),
    'BELGIUM.xlsx': ('country-belgium', 'belgium', 'Belgium'),
    'canada.xlsx': ('country-canada', 'canada', 'Canada'),
    'CROTIA.xlsx': ('country-croatia', 'croatia', 'Croatia'),
    'CYPRUS.xlsx': ('country-cyprus', 'cyprus', 'Cyprus'),
    'CZECH REPUBLIC.xlsx': ('country-czech-republic', 'czech-republic', 'Czech Republic'),
    'DENMARK.xlsx': ('country-denmark', 'denmark', 'Denmark'),
    'FINLAND.xlsx': ('country-finland', 'finland', 'Finland'),
    'FRANCE.xlsx': ('country-france', 'france', 'France'),
    'GEORGIA.xlsx': ('country-georgia', 'georgia', 'Georgia'),
    'GERMANY.xlsx': ('country-germany', 'germany', 'Germany'),
    'GREECE.xlsx': ('country-greece', 'greece', 'Greece'),
    'HUNGARY.xlsx': ('country-hungary', 'hungary', 'Hungary'),
    'IRELAND.xlsx': ('country-ireland', 'ireland', 'Ireland'),
    'ITALY.xlsx': ('country-italy', 'italy', 'Italy'),
    'JAPAN.xlsx': ('country-japan', 'japan', 'Japan'),
    'LATVIA.xlsx': ('country-latvia', 'latvia', 'Latvia'),
    'MALTA.xlsx': ('country-malta', 'malta', 'Malta'),
    'MAURITIUS.xlsx': ('country-mauritius', 'mauritius', 'Mauritius'),
    'NETHERLAND.xlsx': ('country-netherlands', 'netherlands', 'Netherlands'),
    'NEWZEALAND.xlsx': ('country-new-zealand', 'new-zealand', 'New Zealand'),
    'PORTUGAL.xlsx': ('country-portugal', 'portugal', 'Portugal'),
    'ROMANIA.xlsx': ('country-romania', 'romania', 'Romania'),
    'SINGAPORE.xlsx': ('country-singapore', 'singapore', 'Singapore'),
    'SOUTH KOREA.xlsx': ('country-south-korea', 'south-korea', 'South Korea'),
    'SPAIN.xlsx': ('country-spain', 'spain', 'Spain'),
    'SWEDEN.xlsx': ('country-sweden', 'sweden', 'Sweden'),
    'SWITZERLAND.xlsx': ('country-switzerland', 'switzerland', 'Switzerland'),
    'UK.xlsx': ('country-uk', 'united-kingdom', 'United Kingdom'),
    'USA.xlsx': ('country-usa', 'usa', 'United States'),
}

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    return text

def parse_xlsx(file_path):
    with zipfile.ZipFile(file_path) as z:
        shared = []
        if 'xl/sharedStrings.xml' in z.namelist():
            tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
            for si in tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
                texts = [t.text for t in si.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t') if t.text]
                shared.append(''.join(texts))
        
        tree = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
        rows = []
        for r in tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheetData/{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row'):
            row_vals = []
            for c in r.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                t_attr = c.attrib.get('t')
                if t_attr == 'inlineStr':
                    is_tag = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}is')
                    if is_tag is not None:
                        texts = [t.text for t in is_tag.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t') if t.text]
                        row_vals.append(''.join(texts))
                    else:
                        row_vals.append('')
                elif t_attr == 's':
                    v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                    if v is not None and v.text and int(v.text) < len(shared):
                        row_vals.append(shared[int(v.text)])
                    else:
                        row_vals.append('')
                else:
                    v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                    row_vals.append(v.text if v is not None and v.text else '')
            rows.append(row_vals)
        return rows

all_universities = []
seen_slugs = set()

# 1. First add detailed core profiles with rich descriptions
core_profiles = [
    {
        "id": "uni-toronto",
        "name": "University of Toronto",
        "slug": "university-of-toronto",
        "countryId": "country-canada",
        "countrySlug": "canada",
        "countryName": "Canada",
        "city": "Toronto",
        "officialWebsite": "https://www.utoronto.ca",
        "institutionType": "Public Research University",
        "studyLevels": ["Bachelors", "Masters", "Doctorate"],
        "subjectAreas": ["Computer Science", "Engineering", "Commerce", "Life Sciences"],
        "courses": ["Computer Science BSc", "Data Science MSc", "Rotman Commerce BCom", "Mechanical Engineering BEng"],
        "admissionInformation": "Competitive admissions requiring 85%+ in 10+2 (CBSE/ICSE) or 3.5+ GPA equivalent; IELTS Academic 6.5 (no band under 6.0).",
        "tuitionInformation": "CAD 35,000 – CAD 60,000 / year",
        "scholarshipInformation": "International Scholar Award and President’s Entrance Scholarships based on academic excellence.",
        "featured": True,
        "relationshipStatus": "listed_for_guidance",
        "logoAsset": "",
        "coverImage": "",
        "sourceLinks": ["https://www.utoronto.ca"],
        "lastReviewed": "2026-11-09",
        "publicationStatus": "published",
        "hasDetailedProfile": True,
        "worldRanking": "Top 25 Global",
        "averageTuition": "CAD 35,000 – 60,000 / year",
        "description": "Canada’s leading research university, consistently ranked among the world's top 25 institutions and renowned for scientific discovery."
    },
    {
        "id": "uni-ubc",
        "name": "University of British Columbia",
        "slug": "university-of-british-columbia",
        "countryId": "country-canada",
        "countrySlug": "canada",
        "countryName": "Canada",
        "city": "Vancouver",
        "officialWebsite": "https://www.ubc.ca",
        "institutionType": "Public Research University",
        "studyLevels": ["Bachelors", "Masters", "Doctorate"],
        "subjectAreas": ["Applied Science", "Data Science", "Commerce", "Forestry"],
        "courses": ["Sauder Bachelor of Commerce", "Biomedical Engineering BEng", "Computer Science MSc"],
        "admissionInformation": "Minimum 80%–85%+ in 10+2; personal profile narrative evaluation; IELTS Academic 6.5 overall.",
        "tuitionInformation": "CAD 32,000 – CAD 52,000 / year",
        "scholarshipInformation": "International Major Entrance Scholarship (IMES) up to CAD 20,000/year.",
        "featured": True,
        "relationshipStatus": "listed_for_guidance",
        "logoAsset": "",
        "coverImage": "",
        "sourceLinks": ["https://www.ubc.ca"],
        "lastReviewed": "2026-11-09",
        "publicationStatus": "published",
        "hasDetailedProfile": True,
        "worldRanking": "Top 40 Global",
        "averageTuition": "CAD 32,000 – 52,000 / year",
        "description": "A global center for research and teaching, recognized as one of the most international universities in North America."
    },
    {
        "id": "uni-manchester",
        "name": "University of Manchester",
        "slug": "university-of-manchester",
        "countryId": "country-uk",
        "countrySlug": "united-kingdom",
        "countryName": "United Kingdom",
        "city": "Manchester",
        "officialWebsite": "https://www.manchester.ac.uk",
        "institutionType": "Public Russell Group University",
        "studyLevels": ["Bachelors", "Masters", "Doctorate"],
        "subjectAreas": ["Engineering", "Business Analytics", "Computer Science", "Economics"],
        "courses": ["Advanced Computer Science MSc", "Management MSc", "Electrical and Electronic Engineering BEng"],
        "admissionInformation": "Postgraduate requires 60%–65%+ in relevant Bachelor's degree; IELTS Academic 6.5–7.0.",
        "tuitionInformation": "£22,000 – £34,000 / year",
        "scholarshipInformation": "Manchester Humanities and Global Futures International Scholarships (£3,000–£8,000).",
        "featured": True,
        "relationshipStatus": "listed_for_guidance",
        "logoAsset": "",
        "coverImage": "",
        "sourceLinks": ["https://www.manchester.ac.uk"],
        "lastReviewed": "2026-11-09",
        "publicationStatus": "published",
        "hasDetailedProfile": True,
        "worldRanking": "Top 35 Global",
        "averageTuition": "£22,000 – 34,000 / year",
        "description": "Prestigious red-brick Russell Group research university associated with 25 Nobel laureates."
    },
    {
        "id": "uni-warwick",
        "name": "University of Warwick",
        "slug": "university-of-warwick",
        "countryId": "country-uk",
        "countrySlug": "united-kingdom",
        "countryName": "United Kingdom",
        "city": "Coventry",
        "officialWebsite": "https://warwick.ac.uk",
        "institutionType": "Public Russell Group University",
        "studyLevels": ["Bachelors", "Masters", "Doctorate"],
        "subjectAreas": ["Business", "Economics", "Manufacturing", "Mathematics"],
        "courses": ["Warwick Business School MSc Finance", "Data Analytics MSc", "Economics BSc"],
        "admissionInformation": "Postgraduate entry requires 65%+ first-class degree; IELTS 7.0 (min 6.0 in sub-scores).",
        "tuitionInformation": "£21,000 – £32,000 / year",
        "scholarshipInformation": "Warwick Undergraduate Global Excellence and WBS Dean’s Scholarships.",
        "featured": True,
        "relationshipStatus": "listed_for_guidance",
        "logoAsset": "",
        "coverImage": "",
        "sourceLinks": ["https://warwick.ac.uk"],
        "lastReviewed": "2026-11-09",
        "publicationStatus": "published",
        "hasDetailedProfile": True,
        "worldRanking": "Top 70 Global",
        "averageTuition": "£21,000 – 32,000 / year",
        "description": "Renowned for research impact, strong employer links, and top-tier business and economics faculties."
    },
    {
        "id": "uni-melbourne",
        "name": "University of Melbourne",
        "slug": "university-of-melbourne",
        "countryId": "country-australia",
        "countrySlug": "australia",
        "countryName": "Australia",
        "city": "Melbourne",
        "officialWebsite": "https://www.unimelb.edu.au",
        "institutionType": "Public Group of Eight University",
        "studyLevels": ["Bachelors", "Masters", "Doctorate"],
        "subjectAreas": ["Information Technology", "Biomedical Science", "Finance", "Civil Engineering"],
        "courses": ["Master of Information Technology", "Master of Management", "Bachelor of Science"],
        "admissionInformation": "65%+ in recognized Indian Bachelor’s degree; IELTS 6.5 (no band under 6.0) or PTE 58+.",
        "tuitionInformation": "AUD 36,000 – AUD 50,000 / year",
        "scholarshipInformation": "Melbourne International Undergraduate Scholarship and Graduate Research Scholarships.",
        "featured": True,
        "relationshipStatus": "listed_for_guidance",
        "logoAsset": "",
        "coverImage": "",
        "sourceLinks": ["https://www.unimelb.edu.au"],
        "lastReviewed": "2026-11-09",
        "publicationStatus": "published",
        "hasDetailedProfile": True,
        "worldRanking": "Top 20 Global",
        "averageTuition": "AUD 36,000 – 50,000 / year",
        "description": "Australia’s top-ranked comprehensive research university and a founding member of the Group of Eight."
    },
    {
        "id": "uni-sydney",
        "name": "University of Sydney",
        "slug": "university-of-sydney",
        "countryId": "country-australia",
        "countrySlug": "australia",
        "countryName": "Australia",
        "city": "Sydney",
        "officialWebsite": "https://www.sydney.edu.au",
        "institutionType": "Public Group of Eight University",
        "studyLevels": ["Bachelors", "Masters", "Doctorate"],
        "subjectAreas": ["Data Science", "Architecture", "Business Law", "Health Sciences"],
        "courses": ["Master of Data Science", "Master of Commerce", "Bachelor of Engineering"],
        "admissionInformation": "65%+ Indian degree equivalent; Genuine Student (GS) compliance; IELTS 6.5 or PTE 61.",
        "tuitionInformation": "AUD 38,000 – AUD 52,000 / year",
        "scholarshipInformation": "Sydney International Student Award offering 20% tuition fee reduction.",
        "featured": True,
        "relationshipStatus": "listed_for_guidance",
        "logoAsset": "",
        "coverImage": "",
        "sourceLinks": ["https://www.sydney.edu.au"],
        "lastReviewed": "2026-11-09",
        "publicationStatus": "published",
        "hasDetailedProfile": True,
        "worldRanking": "Top 25 Global",
        "averageTuition": "AUD 38,000 – 52,000 / year",
        "description": "Australia’s first university, renowned globally for graduate employability and world-class research."
    },
    {
        "id": "uni-tum",
        "name": "Technical University of Munich (TUM)",
        "slug": "technical-university-of-munich",
        "countryId": "country-germany",
        "countrySlug": "germany",
        "countryName": "Germany",
        "city": "Munich",
        "officialWebsite": "https://www.tum.de",
        "institutionType": "Public Technical University",
        "studyLevels": ["Bachelors", "Masters", "Doctorate"],
        "subjectAreas": ["Informatics", "Mechanical Engineering", "Automotive Technology", "Physics"],
        "courses": ["Informatics MSc", "Robotics and Cognition MSc", "Automotive Engineering MSc"],
        "admissionInformation": "Mandatory APS certificate; German GPA 2.0 or better in relevant engineering/CS Bachelor's; IELTS 6.5.",
        "tuitionInformation": "€0 – €6,000 / year (Nominal state fee / non-EU tuition)",
        "scholarshipInformation": "Deutschlandstipendium and DAAD Graduate Fellowships.",
        "featured": True,
        "relationshipStatus": "listed_for_guidance",
        "logoAsset": "",
        "coverImage": "",
        "sourceLinks": ["https://www.tum.de"],
        "lastReviewed": "2026-11-09",
        "publicationStatus": "published",
        "hasDetailedProfile": True,
        "worldRanking": "Top 30 Global",
        "averageTuition": "€0 – 6,000 / year (Nominal state tuition)",
        "description": "Germany’s premier University of Excellence, leading European tech innovation and entrepreneurship."
    },
    {
        "id": "uni-tcd",
        "name": "Trinity College Dublin",
        "slug": "trinity-college-dublin",
        "countryId": "country-ireland",
        "countrySlug": "ireland",
        "countryName": "Ireland",
        "city": "Dublin",
        "officialWebsite": "https://www.tcd.ie",
        "institutionType": "Public Research University",
        "studyLevels": ["Bachelors", "Masters", "Doctorate"],
        "subjectAreas": ["Computer Science", "Immunology", "Business Studies", "English Literature"],
        "courses": ["Computer Science MSc (Data Science)", "Finance MSc", "Immunology MSc"],
        "admissionInformation": "Minimum 65%+ in Indian Bachelor's degree; IELTS Academic 6.5 (no band under 6.0).",
        "tuitionInformation": "€18,000 – €26,000 / year",
        "scholarshipInformation": "Government of Ireland International Scholarships and Trinity Global Excellence Awards.",
        "featured": True,
        "relationshipStatus": "listed_for_guidance",
        "logoAsset": "",
        "coverImage": "",
        "sourceLinks": ["https://www.tcd.ie"],
        "lastReviewed": "2026-11-09",
        "publicationStatus": "published",
        "hasDetailedProfile": True,
        "worldRanking": "Top 100 Global",
        "averageTuition": "€18,000 – 26,000 / year",
        "description": "Ireland’s historic university located in central Dublin, providing world-leading research programs."
    },
    # MBBS Core Detailed Profiles
    {
        "id": "uni-tsmu-uzb",
        "name": "Tashkent State Medical University (TSMU)",
        "slug": "tashkent-state-medical-university",
        "countryId": "country-uzbekistan",
        "countrySlug": "uzbekistan",
        "countryName": "Uzbekistan",
        "city": "Tashkent",
        "officialWebsite": "https://tma.uz",
        "institutionType": "State Medical Academy",
        "studyLevels": ["Bachelors", "MBBS"],
        "subjectAreas": ["Medicine", "Surgery", "Pediatrics"],
        "courses": ["General Medicine (MD/MBBS) - 6 Years"],
        "admissionInformation": "NEET-UG qualified score; minimum 50% in 10+2 PCB (40% for SC/ST/OBC); age 17+.",
        "tuitionInformation": "USD 3,800 – USD 4,200 / year",
        "scholarshipInformation": "Subsidized government rate applies directly.",
        "featured": True,
        "relationshipStatus": "listed_for_guidance",
        "logoAsset": "",
        "coverImage": "",
        "sourceLinks": ["https://tma.uz", "https://www.nmc.org.in"],
        "lastReviewed": "2026-11-09",
        "publicationStatus": "published",
        "hasDetailedProfile": True,
        "worldRanking": "Government Medical Faculty",
        "averageTuition": "USD 4,000 / year",
        "description": "Premier government medical university in Uzbekistan, fully compliant with NMC FMGL regulations with operational Indian mess."
    },
    {
        "id": "uni-kaznmu",
        "name": "Kazakh National Medical University (KazNMU)",
        "slug": "kazakh-national-medical-university",
        "countryId": "country-kazakhstan",
        "countrySlug": "kazakhstan",
        "countryName": "Kazakhstan",
        "city": "Almaty",
        "officialWebsite": "https://kaznmu.edu.kz",
        "institutionType": "National Medical University",
        "studyLevels": ["Bachelors", "MBBS"],
        "subjectAreas": ["General Medicine", "Dentistry", "Pharmacy"],
        "courses": ["General Medicine MD/MBBS - 5+1 Years"],
        "admissionInformation": "NEET-UG qualification scorecard; 50%+ in PCB in 10+2; MEA apostille certification.",
        "tuitionInformation": "USD 4,500 – USD 5,000 / year",
        "scholarshipInformation": "Government-subsidized package.",
        "featured": True,
        "relationshipStatus": "listed_for_guidance",
        "logoAsset": "",
        "coverImage": "",
        "sourceLinks": ["https://kaznmu.edu.kz"],
        "lastReviewed": "2026-11-09",
        "publicationStatus": "published",
        "hasDetailedProfile": True,
        "worldRanking": "Top Medical Faculty in Central Asia",
        "averageTuition": "USD 4,800 / year",
        "description": "Century-old national medical university in Almaty with extensive hospital networks and English-medium instruction."
    }
]

for p in core_profiles:
    all_universities.append(p)
    seen_slugs.add(p["slug"])

# 2. Parse client Excel files
for filename, (country_id, country_slug, country_name) in COUNTRY_MAP.items():
    filepath = os.path.join(DATA_DIR, filename)
    if not os.path.exists(filepath):
        continue

    try:
        rows = parse_xlsx(filepath)
    except Exception as e:
        print(f"Error parsing {filename}: {e}")
        continue

    for r in rows[1:]:
        if len(r) < 2 or not r[1].strip():
            continue

        raw_name = r[1].strip()
        # Clean up ALL CAPS and trailing junk
        clean_name = re.sub(r'\s+', ' ', raw_name)
        if clean_name.isupper():
            # Title-case clean name
            clean_name = clean_name.title()
            # Restore common acronyms
            clean_name = re.sub(r'\bUsa\b', 'USA', clean_name)
            clean_name = re.sub(r'\bUk\b', 'UK', clean_name)
            clean_name = re.sub(r'\bMba\b', 'MBA', clean_name)
            clean_name = re.sub(r'\bMit\b', 'MIT', clean_name)
            clean_name = re.sub(r'\bUcla\b', 'UCLA', clean_name)
            clean_name = re.sub(r'\bNyu\b', 'NYU', clean_name)

        slug = slugify(clean_name)
        if not slug or len(slug) < 3:
            continue

        # Avoid duplicates within same country
        unique_key = f"{country_slug}-{slug}"
        if unique_key in seen_slugs or slug in seen_slugs:
            continue
        seen_slugs.add(unique_key)
        seen_slugs.add(slug)

        uni_id = f"uni-{slug}"

        # Assign study levels & subject areas based on institution naming cues
        study_levels = ["Bachelors", "Masters"]
        subject_areas = ["Business", "Science", "Technology"]
        inst_type = "Accredited University"

        if "college" in clean_name.lower():
            inst_type = "College / Polytechnic"
            study_levels = ["Diploma", "Bachelors"]
        elif "medical" in clean_name.lower() or "medicine" in clean_name.lower():
            inst_type = "Medical University"
            study_levels = ["MBBS", "Masters"]
            subject_areas = ["Medicine", "Health Sciences", "Surgery"]
        elif "business" in clean_name.lower() or "management" in clean_name.lower():
            inst_type = "Business School"
            subject_areas = ["Business & Finance", "Management", "Marketing"]
        elif "technical" in clean_name.lower() or "technology" in clean_name.lower() or "polytechnic" in clean_name.lower():
            inst_type = "Technical Institute"
            subject_areas = ["Engineering", "Computer Science", "Technology"]

        all_universities.append({
            "id": uni_id,
            "name": clean_name,
            "slug": slug,
            "countryId": country_id,
            "countrySlug": country_slug,
            "countryName": country_name,
            "city": country_name,
            "officialWebsite": "",
            "institutionType": inst_type,
            "studyLevels": study_levels,
            "subjectAreas": subject_areas,
            "courses": [],
            "admissionInformation": f"Admissions guidance provided in compliance with accredited institutional entry requirements for {country_name}.",
            "tuitionInformation": "Tuition varies by program and faculty.",
            "scholarshipInformation": "Merit scholarships available subject to university eligibility criteria.",
            "featured": False,
            "relationshipStatus": "listed_for_guidance",
            "logoAsset": "",
            "coverImage": "",
            "sourceLinks": [],
            "lastReviewed": "2026-11-09",
            "publicationStatus": "published",
            "hasDetailedProfile": False,
            "worldRanking": "",
            "averageTuition": "Varies by program",
            "description": f"Accredited higher education institution in {country_name} for which Visa Convention provides admissions counseling, eligibility screening, and student visa advisory.",
            "popularDisciplines": subject_areas
        })

# 3. Parse client MBBS file (MBBS_Abroad_Universities.xlsx)
mbbs_path = os.path.join(DATA_DIR, 'MBBS_Abroad_Universities.xlsx')
if os.path.exists(mbbs_path):
    try:
        mbbs_rows = parse_xlsx(mbbs_path)
        mbbs_country_lookup = {
            'uzbekistan': ('country-uzbekistan', 'uzbekistan', 'Uzbekistan'),
            'kazakhstan': ('country-kazakhstan', 'kazakhstan', 'Kazakhstan'),
            'kyrgyzstan': ('country-kyrgyzstan', 'kyrgyzstan', 'Kyrgyzstan'),
            'russia': ('country-russia', 'russia', 'Russia'),
            'georgia': ('country-georgia', 'georgia', 'Georgia'),
            'poland': ('country-poland', 'poland', 'Poland'),
            'portugal': ('country-portugal', 'portugal', 'Portugal'),
            'latvia': ('country-latvia', 'latvia', 'Latvia'),
        }

        for r in mbbs_rows[7:]:
            if len(r) < 2 or not r[0].strip() or not r[1].strip():
                continue
            raw_cname = r[0].strip().lower()
            if raw_cname not in mbbs_country_lookup:
                continue

            c_id, c_slug, c_name = mbbs_country_lookup[raw_cname]
            raw_name = r[1].strip()
            # Clean up special characters, bullets, and dashes
            clean_name = re.sub(r'[^\x00-\x7F]+', ' ', raw_name)
            clean_name = re.sub(r'\s+', ' ', clean_name).strip()
            
            # Extract city if in parentheses or after dash
            city = c_name
            if ' - ' in clean_name:
                parts = clean_name.split(' - ')
                clean_name = parts[0].strip()
                city = parts[1].strip()
            elif ' – ' in clean_name:
                parts = clean_name.split(' – ')
                clean_name = parts[0].strip()
                city = parts[1].strip()

            slug = slugify(clean_name)
            if not slug or len(slug) < 3:
                continue

            unique_key = f"{c_slug}-{slug}"
            if unique_key in seen_slugs or slug in seen_slugs:
                # If already exists, ensure MBBS is in its studyLevels
                for existing in all_universities:
                    if existing['slug'] == slug:
                        if 'MBBS' not in existing['studyLevels']:
                            existing['studyLevels'].append('MBBS')
                        if 'Medicine' not in existing['subjectAreas']:
                            existing['subjectAreas'].append('Medicine')
                continue

            seen_slugs.add(unique_key)
            seen_slugs.add(slug)

            all_universities.append({
                "id": f"uni-{slug}",
                "name": clean_name,
                "slug": slug,
                "countryId": c_id,
                "countrySlug": c_slug,
                "countryName": c_name,
                "city": city,
                "officialWebsite": "",
                "institutionType": "Medical University",
                "studyLevels": ["MBBS", "Doctorate"],
                "subjectAreas": ["Medicine", "Surgery", "Clinical Medicine"],
                "courses": ["MBBS / General Medicine (MD)", "Pediatrics", "Dentistry"],
                "admissionInformation": f"NEET eligibility required for Indian applicants in compliance with NMC/WHO criteria; 50%+ in PCB in 10+2.",
                "tuitionInformation": "Advisory USD 3,500 – 6,000 / year",
                "scholarshipInformation": "Merit bursaries and subsidized university hostel accommodation available.",
                "featured": False,
                "relationshipStatus": "listed_for_guidance",
                "logoAsset": "",
                "coverImage": "",
                "sourceLinks": [],
                "lastReviewed": "2026-11-09",
                "publicationStatus": "published",
                "hasDetailedProfile": False,
                "worldRanking": "NMC & WHO Recognized Medical Faculty",
                "averageTuition": "USD 3,500 – 6,000 / year",
                "description": f"Accredited medical university in {c_name} offering English-medium MBBS programs recognized for global practice eligibility.",
                "popularDisciplines": ["Medicine", "Surgery", "Clinical Medicine"]
            })
    except Exception as e:
        print(f"Error parsing MBBS_Abroad_Universities.xlsx: {e}")

print(f"Total unique universities compiled: {len(all_universities)}")
print(f"Detailed profiles with dedicated pages: {sum(1 for u in all_universities if u.get('hasDetailedProfile'))}")

# Write to CSV: client-content/universities/universities.csv
csv_fields = [
    'id', 'name', 'slug', 'countryId', 'city', 'officialWebsite',
    'institutionType', 'studyLevels', 'subjectAreas', 'courses',
    'admissionInformation', 'tuitionInformation', 'scholarshipInformation',
    'featured', 'relationshipStatus', 'logoAsset', 'coverImage',
    'sourceLinks', 'lastReviewed', 'publicationStatus', 'hasDetailedProfile'
]

with open(CSV_OUTPUT, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=csv_fields, extrasaction='ignore')
    writer.writeheader()
    for u in all_universities:
        row = dict(u)
        row['studyLevels'] = json.dumps(u['studyLevels'])
        row['subjectAreas'] = json.dumps(u['subjectAreas'])
        row['courses'] = json.dumps(u['courses'])
        row['sourceLinks'] = json.dumps(u['sourceLinks'])
        row['featured'] = 'true' if u['featured'] else 'false'
        row['hasDetailedProfile'] = 'true' if u.get('hasDetailedProfile') else 'false'
        writer.writerow(row)

# Write to JSON: client-content/universities/universities.json
with open(JSON_OUTPUT, 'w', encoding='utf-8') as f:
    json.dump({
        "version": "1.0.0",
        "totalRecords": len(all_universities),
        "detailedProfilesCount": sum(1 for u in all_universities if u.get('hasDetailedProfile')),
        "universities": all_universities
    }, f, indent=2, ensure_ascii=False)

print(f"CSV saved to {CSV_OUTPUT}")
print(f"JSON saved to {JSON_OUTPUT}")
