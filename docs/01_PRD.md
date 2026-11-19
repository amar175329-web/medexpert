# MedExpert – PRD v1.0

## 1. Vision
MedExpert is the caring companion for a family's medicines in India. People record every medicine, where it is kept, what it is for and when it expires, so they can find the right one fast, avoid expired or duplicate medicines and take doses on time. It is an organizer and information tool, never a doctor. The feeling is "everything at home is in order and cared for", not "a sick person's app".

## 2. Problem
People buy medicine, put it away and forget what it is for, where it is and when it expires. When needed it cannot be found or identified, or it has expired. Families share medicines across members with different ages and allergies, and forget doses and refills.

## 3. Users
Indian households (individuals, families, elderly users, caregivers). Account owner creates a household and adds member profiles (profiles do not need a login). Internal: verification agents; the founder only for exceptions.

## 4. Principles
1. Source-grounded facts only. 2. Honest Verified/Unverified status. 3. No diagnosis, no personal dosing advice. 4. Fail safe: when unsure, stay Unverified. 5. One elderly-friendly design for everyone. 6. AI is local; the app works with AI off.

## 5. Platform
Mobile-first PWA for Android and iPhone. Hindi + English. India only (INR). Saved data viewable offline; offline reminders are best effort (iPhone limits).

## 6. Features
### 6.1 Medicine record
Brand name (req), generic name and active ingredients with strength (Verified only), form (req), used for (Verified only, cited), storage location (req, hierarchical), expiry date (req), quantity remaining (req), price INR (opt), purchased from (opt), purchase date, batch (opt), photos (opt), prescribed for (member), doctor, course duration, warnings/side effects/interactions/storage conditions (Verified only, cited).
### 6.2 Adding a medicine (user always confirms)
1. Barcode/QR scan matched to the verified catalog. 2. Photo of pack/strip with OCR proposing matches; never saved as fact on its own. 3. Manual entry always allowed. No method is claimed 100% accurate; accuracy comes from confirmation, catalog matching and honest labels.
### 6.3 Verified vs Unverified
Verified = matched to an authoritative source by verification agents with citation and date, source visible. Unverified = manual or unmatched: shows only user-typed fields; no ingredients/uses/warnings; AI does not describe it. Alerts, location lookup, stock and reminders still work.
### 6.4 Search and Ask
One bar, two modes. Search: instant lookup by name/ingredient/location/date, no AI. Ask: natural language over the user's own data (where is X, what expires next month, how much spent, what do I have labelled for fever). AI turns the question into a structured query and phrases the result; it never invents facts. Symptom questions list only the user's own Verified medicines whose cited label states that use, with warnings and a see-a-doctor note; never "take this", never a dose.
### 6.5 Reminders and records
Expiry alerts (30/15/7 days, expired), low-stock/refill alerts, dose reminders per member (time, frequency, course), dose log (taken/skipped/snoozed). Channels: push, WhatsApp, email, chosen per type.
### 6.6 Household profiles
Name, age, allergies, notes. Flags when a Verified ingredient matches an allergy, or the same active ingredient appears twice for one member. Flags are warnings, not advice.
### 6.7 Prescriptions
Save prescription photos per member. AI may extract names as Unverified suggestions; nothing is added until the user accepts; then verification tries to match.
### 6.8 Emergency
Persistent button with official numbers (national emergency number, ambulance, poison control), offline-capable. Numbers verified from official sources before release.
### 6.9 Other
Safe-disposal guidance (cited), export (PDF/CSV), account deletion and full data export.

## 7. Verification by agents (founder decision: agents, not humans)
Agents verify continuously under strict rules (see docs/06): only from authoritative cited sources, never from model memory, second independent check, full audit log, automatic rollback, exceptions queued, founder alerted only for exceptions.

## 8. AI scope
Local model only for now. Tasks: question to structured query; phrase results from retrieved verified text; (OCR is a separate component); never the final decider of verification. Provider interface so the model can be swapped by configuration.

## 9. Phases
Phase 1 core; Phase 2 care features (OCR, dose reminders, WhatsApp, prescriptions, Ask, flags); Phase 3 verification at scale, admin, export, polish.

## 10. Out of scope
Payments/monetization, e-pharmacy, telemedicine, doctor accounts, native apps, other countries.

## 11. Success metrics
Share of medicines Verified; verification error and rollback rate near zero; day-30 retention; reminders acknowledged on time; time to add and to find a medicine; zero unsourced medical statements.

## 12. Risks
Verified Indian medicine data source and licence (biggest); barcode coverage; free-tier limits and WhatsApp cost; iPhone offline reminders; small local model quality in Hindi/medical text; liability and legal review; accuracy of emergency numbers. See docs/09.
