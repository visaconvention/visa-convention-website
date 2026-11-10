import re
import json
import csv
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

RAW_UNIS_FILE = r'client-content\raw-inputs\client_input_2026_11_10.txt'
RAW_MBBS_PHD_FILE = r'client-content\raw-inputs\client_mbbs_phd_input_2026_11_10.txt'
COUNTRIES_JSON = r'client-content\countries\countries.json'
UNIS_JSON = r'client-content\universities\universities.json'
UNIS_CSV = r'client-content\universities\universities.csv'

# Country normalizer
COUNTRY_ALIASES = {
    'australia': ('country-australia', 'australia', 'Australia'),
    'austria': ('country-austria', 'austria', 'Austria'),
    'belgium': ('country-belgium', 'belgium', 'Belgium'),
    'canada': ('country-canada', 'canada', 'Canada'),
    'croatia': ('country-croatia', 'croatia', 'Croatia'),
    'crotia': ('country-croatia', 'croatia', 'Croatia'),
    'cyprus': ('country-cyprus', 'cyprus', 'Cyprus'),
    'czech republic': ('country-czech-republic', 'czech-republic', 'Czech Republic'),
    'denmark': ('country-denmark', 'denmark', 'Denmark'),
    'finland': ('country-finland', 'finland', 'Finland'),
    'france': ('country-france', 'france', 'France'),
    'georgia': ('country-georgia', 'georgia', 'Georgia'),
    'germany': ('country-germany', 'germany', 'Germany'),
    'greece': ('country-greece', 'greece', 'Greece'),
    'hungary': ('country-hungary', 'hungary', 'Hungary'),
    'hungry': ('country-hungary', 'hungary', 'Hungary'),
    'ireland': ('country-ireland', 'ireland', 'Ireland'),
    'italy': ('country-italy', 'italy', 'Italy'),
    'japan': ('country-japan', 'japan', 'Japan'),
    'latvia': ('country-latvia', 'latvia', 'Latvia'),
    'malta': ('country-malta', 'malta', 'Malta'),
    'mauritius': ('country-mauritius', 'mauritius', 'Mauritius'),
    'netherland': ('country-netherlands', 'netherlands', 'Netherlands'),
    'netherlands': ('country-netherlands', 'netherlands', 'Netherlands'),
    'newzealand': ('country-new-zealand', 'new-zealand', 'New Zealand'),
    'new zealand': ('country-new-zealand', 'new-zealand', 'New Zealand'),
    'portugal': ('country-portugal', 'portugal', 'Portugal'),
    'romania': ('country-romania', 'romania', 'Romania'),
    'romnia': ('country-romania', 'romania', 'Romania'),
    'singapore': ('country-singapore', 'singapore', 'Singapore'),
    'south korea': ('country-south-korea', 'south-korea', 'South Korea'),
    'spain': ('country-spain', 'spain', 'Spain'),
    'sweden': ('country-sweden', 'sweden', 'Sweden'),
    'switzerland': ('country-switzerland', 'switzerland', 'Switzerland'),
    'uk': ('country-uk', 'united-kingdom', 'United Kingdom'),
    'united kingdom': ('country-uk', 'united-kingdom', 'United Kingdom'),
    'usa': ('country-usa', 'usa', 'United States'),
    'united states': ('country-usa', 'usa', 'United States'),
    'uzbekistan': ('country-uzbekistan', 'uzbekistan', 'Uzbekistan'),
    'kazakhstan': ('country-kazakhstan', 'kazakhstan', 'Kazakhstan'),
    'russia': ('country-russia', 'russia', 'Russia'),
    'kyrgyzstan': ('country-kyrgyzstan', 'kyrgyzstan', 'Kyrgyzstan'),
    'moldova': ('country-moldova', 'moldova', 'Moldova'),
    'poland': ('country-poland', 'poland', 'Poland'),
    'lithuania': ('country-lithuania', 'lithuania', 'Lithuania'),
    'azerbaijan': ('country-azerbaijan', 'azerbaijan', 'Azerbaijan'),
}

# Non-university / finance / course keyword detectors
NON_UNIVERSITY_KEYWORDS = [
    'flywire', 'cohort solutions', 'bajaj allianz', 'hdfc credila',
    'saraswat co-operative bank', 'outleap technologies', 'j1 sim cards',
    'asego travel', 'uhomes', 'university living accommodation',
    'course/program', 'utp', 'foundation studies certificate',
    'direct admissions to queens college', 'gssp', 'academic english',
    'english as second language program', 'onestep global - ets',
    'edunation pathway', 'edunation master direct options', 'edunation bachelor direct options',
    'navitas - usa - follow on', 'uc international college (ucic) - follow on'
]

def is_non_university(name):
    lower = name.lower()
    for kw in NON_UNIVERSITY_KEYWORDS:
        if kw in lower:
            return True
    return False

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    return text

print('Starting analysis...')

# 1. Parse raw general universities
general_rows = []
with open(RAW_UNIS_FILE, 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if not line or line.startswith('Country Name\t') or line.startswith('Country Name'):
            continue
        parts = line.split('\t')
        if len(parts) >= 2:
            country_raw = parts[0].strip()
            uni_raw = parts[1].strip()
            if country_raw and uni_raw:
                general_rows.append((country_raw, uni_raw))
        elif len(parts) == 1 and ' ' in line:
            # Might be single tab or whitespace
            # check if country is at start
            match_found = False
            for k in sorted(COUNTRY_ALIASES.keys(), key=lambda x: -len(x)):
                if line.lower().startswith(k + '\t') or line.lower().startswith(k + ' '):
                    c = line[:len(k)].strip()
                    u = line[len(k):].strip()
                    if u:
                        general_rows.append((c, u))
                        match_found = True
                        break

print(f'Parsed {len(general_rows)} rows from general input file.')

# 2. Parse MBBS & PhD
mbbs_rows = []
phd_rows = []
current_section = None

with open(RAW_MBBS_PHD_FILE, 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if 'MBBS SERVICES:' in line:
            current_section = 'MBBS'
            continue
        elif 'PHD SERVICES:' in line:
            current_section = 'PHD'
            continue
        if not line or line.startswith('Country Name') or line.startswith('MBBS ABROAD') or line.startswith('•'):
            continue
        parts = line.split('\t')
        if len(parts) >= 2:
            c = parts[0].strip()
            u = parts[1].strip()
            if current_section == 'MBBS':
                mbbs_rows.append((c, u))
            elif current_section == 'PHD':
                phd_rows.append((c, u))

print(f'Parsed {len(mbbs_rows)} MBBS institutions.')
print(f'Parsed {len(phd_rows)} PhD institutions.')

# Analyze countries in raw input
all_raw_countries = set([r[0].lower() for r in general_rows] + [r[0].lower() for r in mbbs_rows] + [r[0].lower() for r in phd_rows])
print(f'\nDistinct raw countries found: {len(all_raw_countries)}')
for c in sorted(all_raw_countries):
    norm = COUNTRY_ALIASES.get(c)
    if norm:
        print(f'  {c} -> {norm[2]} ({norm[0]})')
    else:
        print(f'  UNKNOWN COUNTRY: {c}')

# Load existing countries
with open(COUNTRIES_JSON, 'r', encoding='utf-8') as f:
    countries_data = json.load(f)
existing_country_slugs = {c['slug']: c for c in countries_data['countries']}
existing_country_ids = {c['id']: c for c in countries_data['countries']}

print(f'\nExisting countries in countries.json: {len(countries_data["countries"])}')
missing_in_countries_json = []
for c in sorted(all_raw_countries):
    norm = COUNTRY_ALIASES.get(c)
    if norm and norm[1] not in existing_country_slugs:
        missing_in_countries_json.append(norm)

print(f'Countries needing addition to countries.json: {missing_in_countries_json}')

# Analyze non-university and duplicate records
invalid_records = []
uncertain_records = []
valid_unis = []
duplicate_records = []
seen_normalized = {}

for c_raw, u_raw in general_rows:
    norm_c = COUNTRY_ALIASES.get(c_raw.lower())
    if not norm_c:
        continue
    c_id, c_slug, c_name = norm_c
    
    # Check invalid/service
    if is_non_university(u_raw):
        invalid_records.append((c_name, u_raw, 'Non-educational service / financial intermediary / course snippet'))
        continue

    # Clean name for normalization check
    clean_name = re.sub(r'\(LG\)', '', u_raw, flags=re.I)
    clean_name = re.sub(r'\(MSQUARE\)', '', clean_name, flags=re.I)
    clean_name = re.sub(r'\(EDUCO\)', '', clean_name, flags=re.I)
    clean_name = re.sub(r'\(Through ApplyMalta\)', '', clean_name, flags=re.I)
    clean_name = re.sub(r'\(THROUGH GUS\)', '', clean_name, flags=re.I)
    clean_name = re.sub(r'\(THROUGH KAPLAN\)', '', clean_name, flags=re.I)
    clean_name = re.sub(r'\(Through Msquare\)', '', clean_name, flags=re.I)
    clean_name = re.sub(r'\(Through.*?Direct Tie Up.*?\)', '', clean_name, flags=re.I)
    clean_name = re.sub(r'- DIRECT TIE-?UP.*', '', clean_name, flags=re.I)
    clean_name = re.sub(r'-\s*DIRECT.*', '', clean_name, flags=re.I)
    clean_name = re.sub(r'-\s*Commission.*', '', clean_name, flags=re.I)
    clean_name = re.sub(r'-\s*No Commission.*', '', clean_name, flags=re.I)
    clean_name = clean_name.strip()

    # Check uncertain / manual review
    if any(k in u_raw.lower() for k in ['commission', 'backlog', 'sub-agent', 'sub agent', 'virtual class', 'except india']):
        uncertain_records.append((c_name, u_raw, 'Contains internal commission / recruitment / operational notes'))

    key = (c_slug, slugify(clean_name))
    if key in seen_normalized:
        duplicate_records.append((c_name, u_raw, f'Duplicate / variation of: {seen_normalized[key]}'))
    else:
        seen_normalized[key] = u_raw
        valid_unis.append((norm_c, u_raw, clean_name))

print(f'\nTotal raw general rows: {len(general_rows)}')
print(f'Valid unique general universities: {len(valid_unis)}')
print(f'Invalid non-institutional rows: {len(invalid_records)}')
print(f'Duplicate / variation rows detected: {len(duplicate_records)}')
print(f'Rows flagged for manual operational review: {len(uncertain_records)}')
