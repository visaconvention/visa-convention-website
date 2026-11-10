import json
import csv
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

UNIS_JSON_FILE = r'client-content\universities\universities.json'
UNIS_CSV_FILE = r'client-content\universities\universities.csv'

print('Refining universities database...')

with open(UNIS_JSON_FILE, 'r', encoding='utf-8') as f:
    unis_data = json.load(f)

unis = unis_data.get('universities', [])

# Remove redundant duplicate IDs
remove_ids = {
    'uni-riga-stradi-university-rsu',
    'uni-cat-lica-medical-school',
    'uni-tashkent-state-medical-university-tsmu-tashkent',
    'uni-kazakh-national-medical-university-kaznmu'
}

unis = [u for u in unis if u['id'] not in remove_ids]

# Ensure proper names on kept records
for u in unis:
    if u['id'] == 'uni-riga-stradins-university':
        u['name'] = 'Riga Stradiņš University (RSU)'
    elif u['id'] == 'uni-catolica-medical-school':
        u['name'] = 'Católica Medical School'

# Quarantine non-institutional records to draft
non_uni_ids = {
    'uni-flywire',
    'uni-cohort-solutions-pty-ltd-cohort-go',
    'uni-bajaj-allianz-general-insurance-company-limited',
    'uni-courseprogram',
    'uni-utp',
    'uni-foundation-studies-certificate',
    'uni-university-living-accommodation',
    'uni-outleap-technologies-private-ltd-education-loan',
    'uni-onestep-global-ets-toefl',
    'uni-hdfc-credila',
    'uni-uhomes-uhouzz-international-co-limited',
    'uni-saraswat-co-operative-bank-limited',
    'uni-j1-sim-cards',
    'uni-asego-travel-llp-overseas-medical-insurance',
    'uni-undergraduate-gssp',
    'uni-gssp',
    'uni-gssp-undergraduate',
    'uni-undergraduate-umass-boston-navitas-gssp',
}

quarantined = 0
for u in unis:
    if u['id'] in non_uni_ids:
        u['publicationStatus'] = 'draft'
        quarantined += 1

print(f'Quarantined {quarantined} non-educational records to publicationStatus: draft.')

unis_data['universities'] = unis
unis_data['totalRecords'] = len(unis)

with open(UNIS_JSON_FILE, 'w', encoding='utf-8') as f:
    json.dump(unis_data, f, indent=2, ensure_ascii=False)

print(f'Universities JSON saved with {len(unis)} records.')

# Write updated CSV
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
    for u in unis:
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

print(f'Universities CSV saved with {len(unis)} records.')
