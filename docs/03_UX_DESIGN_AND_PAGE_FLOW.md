# MedExpert – UX Design and Page Flow

## 1. Feeling
"Your home's health is in good hands." Warm, calm, caring and capable. It must NOT feel like a sick person's app or a hospital. Focus on readiness, order and looking after family. Never alarmist; red only for real danger. Trust comes from clear Verified/Unverified labels and visible sources, not from clinical styling.

## 2. Visual system
**Colours (tokens):**
- `--bg` #FBF8F2 (warm cream), `--surface` #FFFFFF, `--ink` #1F2A2E (deep slate), `--ink-soft` #55646A
- `--primary` #2F8F6B (care green), `--primary-dark` #1F6B4F, `--primary-tint` #E3F3EC
- `--accent` #E9A23B (warm gold, highlights)
- `--ok` #2F8F6B, `--warn` #B26A00 on `--warn-bg` #FFF1D6, `--danger` #B3261E on `--danger-bg` #FDE7E5
- Contrast: text on backgrounds at least 4.5:1 (7:1 for body where possible).
**Type:** Noto Sans Devanagari + Noto Sans (self-hosted via next/font). Base 18px, scale 14/16/18/20/24/32; user text-size setting (S/M/L/XL). Line-height 1.5. Hindi and English share sizes.
**Shape:** radius 16px cards, 999px chips, 56px minimum touch targets, 8px spacing grid. Soft shadows. Motion minimal and slow; respect reduced-motion.
**Imagery:** friendly line illustrations of a home, leaf, heart, family, shelf. No syringes, red crosses or pill piles.
**Status chips (always colour + word + symbol):** ✓ Verified (green) · ! Unverified (gold, "Added by you") · ⏳ Expiring soon (amber) · ✕ Expired (red) · ↓ Low stock (amber).

## 3. Navigation (bottom tabs, icon + word)
| English | Hindi | Route |
|---|---|---|
| Today | आज की देखभाल | `/today` |
| Shelf | सेहत की अलमारी | `/shelf` |
| Ask | पूछो | `/ask` |
| Family | परिवार | `/family` |
Top bar: app name, language toggle (हिं/EN), emergency button (always visible), profile/settings.

## 4. Sitemap and routes
`/` landing (public) · `/login` · `/signup` · `/onboarding` (household, first member, language, notifications) · `/today` · `/shelf` · `/shelf/add` · `/shelf/add/scan` · `/shelf/add/photo` · `/shelf/add/manual` · `/shelf/[id]` · `/shelf/[id]/edit` · `/ask` · `/family` · `/family/[profileId]` · `/family/[profileId]/schedule` · `/prescriptions` · `/prescriptions/[id]` · `/locations` · `/emergency` · `/settings` (language, text size, notifications, privacy, export, delete) · `/help/offline` · `/admin/verification` (role-gated) · legal pages `/terms` `/privacy` `/disclaimer`.

## 5. Screens
- **Today:** greeting ("नमस्ते, {name}"); upcoming doses by member with big Taken / Skip / Snooze buttons; expiring-soon strip; empty state "आज सब कुछ सही जगह पर है ✓".
- **Shelf:** search bar on top; filters (member, location, status, form); medicine cards (name, form, location, expiry chip, status chip); floating big "दवाई जोड़ें / Add medicine" button.
- **Add (3 doors):** Scan barcode · Photograph the pack · Type it yourself. Step-by-step (max 4 short steps with progress). After a match, always a "Is this your medicine?" confirmation card showing source for Verified or a clear "Added by you" for Unverified.
- **Medicine detail:** header with name, status chip, expiry, quantity; "Where it is" prominent; sections: Used for, Ingredients, Warnings, Storage (Verified only, each with source link and date); for Unverified a calm note explaining what is and is not shown and a "Check this medicine" action that queues verification.
- **Ask:** one input with two tabs "Search" and "Ask". Answers show source chips and the see-a-doctor note for symptom questions. Warming state: "सहायक तैयार हो रहा है… तब तक खोज के नतीजे देखें" with plain search results.
- **Family:** member cards (age, allergies); each opens profile with their medicines and schedule.
- **Emergency:** big buttons: national emergency number, ambulance, poison control; works offline; plain-language note "Call first, then use the app".
- **Admin verification:** queue, evidence side by side, decision log, metrics.

## 6. Key flows
1. **Onboarding:** sign in → name household → add first member (age, allergies) → pick language and text size → enable notifications (explain each channel) → land on Today with a friendly empty state.
2. **Add via barcode:** scan → candidates → confirm → location → expiry → quantity → optional price/source → save → shows Verified card.
3. **Add via photo:** photograph → OCR text → candidates → confirm or "None of these" → continue as manual (Unverified, verification queued).
4. **Dose reminder:** notification → opens Today → Taken/Skip/Snooze → log.
5. **Expiry:** notification at 30/15/7 days → Shelf filtered to that item → disposal guidance when expired.
6. **Ask:** type question → answer from own data with sources, or graceful fallback.

## 7. Copy tone (examples, hi / en)
- Empty shelf: "अपनी पहली दवाई जोड़ें, हम संभाल लेंगे" / "Add your first medicine, we'll look after it."
- Dose: "{name} की दवाई का समय हो गया" / "It's time for {name}'s medicine."
- Unverified: "आपने यह जानकारी जोड़ी है। हम इसकी जाँच कर रहे हैं।" / "You added this. We're checking it."
- Never say "patient", "disease", "sick" in headings or navigation.

## 8. Accessibility checklist
Text scalable to 200%; contrast checked; every icon has a visible label; focus order and screen-reader labels (hi and en); no colour-only meaning; large touch targets; reduced motion; error messages say what to do next; forms in short steps with autosuggest and pre-fill; voice dictation allowed in text fields.
