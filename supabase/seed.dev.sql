-- MedExpert Development Seed Data (STRICTLY FOR LOCAL DEV & TESTING)
-- Per CLAUDE.md Rule 7: "No fake or demo data in production. Dev fixtures live in supabase/seed.dev.sql and are never run in production."

-- Test Catalog Sources
insert into public.catalog_sources (id, name, url, trust_tier, license_note, active)
values
  ('11111111-1111-1111-1111-111111111101', 'CDSCO Approved Drug List (Dev Mock)', 'https://cdsco.gov.in', 1, 'Public domain government gazette', true)
on conflict do nothing;

-- Test Catalog Medicine
insert into public.catalog_medicines (id, brand_name, generic_name, form, manufacturer, barcode, status, verified_at)
values
  ('22222222-2222-2222-2222-222222222201', 'Dolo 650', 'Paracetamol 650mg', 'Tablet', 'Micro Labs Ltd', '8901234567890', 'verified', now())
on conflict do nothing;

-- Test Catalog Ingredients
insert into public.catalog_ingredients (id, catalog_medicine_id, ingredient, strength)
values
  ('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', 'Paracetamol', '650 mg')
on conflict do nothing;

-- Test Catalog Facts
insert into public.catalog_facts (id, catalog_medicine_id, kind, text_en, text_hi, source_id, source_url, retrieved_at)
values
  ('44444444-4444-4444-4444-444444444401', '22222222-2222-2222-2222-222222222201', 'use', 'Relief of mild to moderate pain and fever.', 'हल्के से मध्यम दर्द और बुखार में राहत।', '11111111-1111-1111-1111-111111111101', 'https://cdsco.gov.in', now()),
  ('44444444-4444-4444-4444-444444444402', '22222222-2222-2222-2222-222222222201', 'warning', 'Do not exceed maximum daily dose of 4000mg. Overdose may cause severe liver damage.', 'प्रतिदिन 4000mg से अधिक न लें। अधिक मात्रा से लिवर को गंभीर नुकसान हो सकता है।', '11111111-1111-1111-1111-111111111101', 'https://cdsco.gov.in', now())
on conflict do nothing;
