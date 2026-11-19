# MedExpert – rules for Claude Code

Product: MedExpert, a home medicine manager for India. Hindi + English. Mobile-first PWA (Android + iPhone).

## Stack (fixed unless a doc says otherwise)
Next.js (App Router) + TypeScript strict, Tailwind CSS, next-intl (hi, en), Supabase (Postgres, Auth, Storage, RLS), Zod validation, Serwist (service worker, offline), Web Push (VAPID), Resend (email), WhatsApp Cloud API, Upstash Redis (rate limit, cache), Sentry (errors), Vitest + Playwright, GitHub Actions, Vercel hosting.

## Non-negotiable rules
1. NEVER show a medicine fact (ingredient, use, warning, dosage) that does not come from a cited catalog_facts row. No facts from model memory. No invented data.
2. Every medicine shows Verified or Unverified. Unverified shows only user-typed fields.
3. No diagnosis, no personal dosing advice, no "take this". Ask AI answers only list the user's own Verified medicines whose cited label lists the use, with warnings and a see-a-doctor note.
4. The app must work fully with AI switched off (search, alerts, reminders, records).
5. All AI goes through the provider interface in docs/05. Never call a model directly from UI code.
6. Every table with user data has RLS enabled and tested. No service-role key in client code.
7. No fake or demo data in production. Dev fixtures live in `supabase/seed.dev.sql` and are never run in production.
8. Accessibility: WCAG 2.1 AA target, large text, status never by colour alone, labels on every icon.
9. Never log health data or personal data to Sentry or logs.
10. Emergency numbers must be confirmed against official sources before launch; keep them in one config file with a source comment.

## Working style
- Work phase by phase (see master prompt). Commit small, with clear messages.
- Write tests for RLS, verification rules, reminders scheduling and the AI guardrails.
- Keep `.env.example` current. Never commit secrets.
- If a doc is ambiguous or a real data source is unknown, STOP and ask; do not guess.
- Read all files in /docs before writing code.
