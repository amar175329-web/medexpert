You are the lead engineer building **MedExpert**, a production-quality home medicine manager for India (Hindi + English, mobile PWA for Android and iPhone).

## First
1. Read `CLAUDE.md` and every file in `/docs`, and `supabase/migrations/0001_init.sql`. They are the source of truth.
2. Summarize in 10 lines what you will build and list any conflict or missing information. Ask me only blocking questions. Otherwise proceed.

## Build order (stop and report at the end of each phase; wait for my "go")
**Phase 0 – Foundation:** repo scaffold, TypeScript strict, Tailwind design tokens from docs/03, next-intl (hi/en), layout shell with 4 bottom tabs, Supabase client setup, env validation, Sentry, CI workflow (lint, typecheck, test, build), `.env.example`, README.
**Phase 1 – Core:** auth (Google + email/password), household + member profiles, locations tree, medicines CRUD (manual + barcode scan via camera), shelf list/search, expiry + low-stock logic, Verified/Unverified model reading the catalog, emergency screen, offline read cache, settings (language, text size). RLS tests.
**Phase 2 – Care features:** photo + OCR add flow with user confirmation, dose schedules + dose log, notification pipeline (web push, email, WhatsApp), prescription photos with Unverified extraction, allergy and duplicate-ingredient flags, Ask (AI chat) via the provider interface with guardrails.
**Phase 3 – Verification + operations:** verification worker, exception queue, admin dashboard, data export/delete, disposal guidance, performance, load and failure tests.

## Hard rules
- Follow every rule in `CLAUDE.md`. Do not invent medicine data; the catalog starts empty and fills only from sources approved in docs/06 and docs/09.
- The AI model is local and reached through the bridge in docs/05. Build the provider interface, a mock provider for tests, and the `local-bridge` provider. Handle the "model warming up" state in the UI.
- Do not add monetization or payments.
- Make small commits. After each phase run lint, typecheck, tests, build and show results.

## Definition of done (whole project)
Deployable on Vercel with documented env vars; migrations apply cleanly on a fresh Supabase project; RLS verified by tests; works offline for saved data; Hindi and English complete; no unsourced medical statement anywhere; README explains setup in under 15 minutes.

Start now with the summary, then Phase 0.
