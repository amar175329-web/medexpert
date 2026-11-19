# MedExpert – TRD v1.0

## 1. Architecture
```
Phone/Browser (PWA, Next.js, Serwist offline cache)
        │ HTTPS
Vercel: Next.js (React Server Components, Route Handlers, Server Actions)
        │                    │                     │
   Supabase               Upstash Redis        Notification senders
 (Postgres+RLS,          (rate limit,        (Web Push, Resend email,
  Auth, Storage)          cache)              WhatsApp Cloud API)
        │
 Background jobs: reminders scheduler, verification worker
        │
 AI provider interface ──► local-bridge ──► local model (on-demand, sleeps after 5 min)
```

## 2. Stack
| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js App Router, TypeScript strict, Tailwind, next-intl | SSR, PWA, hi/en |
| Offline | Serwist service worker + IndexedDB (idb) for saved shelf, profiles, schedules | read offline |
| Backend | Route Handlers + Server Actions, Zod validation | one codebase |
| DB | Supabase Postgres with RLS | strong isolation |
| Storage | Supabase Storage, private buckets, signed URLs | photos, prescriptions |
| Auth | Supabase Auth: Google OAuth + email/password | decided |
| Cache/limits | Upstash Redis | rate limit, hot cache |
| Notifications | Web Push (VAPID), Resend, WhatsApp Cloud API | decided channels |
| Barcode | BarcodeDetector API with ZXing-wasm fallback | camera scan |
| OCR | Tesseract.js (eng+hin) in a Web Worker as v1; swappable | separate from chat model |
| Errors | Sentry (PII scrubbing on) | tracking |
| CI/CD | GitHub Actions → Vercel | decided |
All versions must be pinned and checked for current stable at build time.

## 3. Modules
auth, households, profiles, locations, medicines, catalog (read-only to users), search, ask, reminders, notifications, prescriptions, verification (worker + admin), emergency, settings, export/delete, ai (provider interface), observability.

## 4. API surface (Route Handlers, all validated with Zod, auth required unless noted)
- `POST /api/medicines`, `PATCH/DELETE /api/medicines/:id`, `GET /api/medicines?q=`
- `POST /api/medicines/match` (barcode/OCR text → ranked catalog candidates)
- `GET/POST /api/profiles`, `GET/POST /api/locations`
- `POST/PATCH /api/schedules`, `POST /api/dose-logs`
- `POST /api/ask` → AI pipeline (see 6)
- `POST /api/prescriptions` (upload) and `POST /api/prescriptions/:id/extract`
- `POST /api/push/subscribe`, `PATCH /api/notification-prefs`
- `GET /api/export`, `DELETE /api/account`
- `GET /api/health` (public, no data) for uptime checks
- Admin (role-gated): `GET /api/admin/verification/queue`, `POST /api/admin/verification/:id/decision`
- Internal cron endpoints protected by a secret header: `/api/cron/reminders`, `/api/cron/verify`, `/api/cron/reverify`.

## 5. Data model and RLS
See `supabase/migrations/0001_init.sql`. Rule: every household table is readable and writable only by members of that household (`is_member(household_id)`). Catalog tables are read-only to users; writes only by the service role in the verification worker. Storage paths are `household_id/...` with matching storage policies.

## 6. Ask pipeline (guardrails)
1. Receive question. 2. Model converts it to a structured query (JSON schema validated by Zod; reject anything else). 3. Server runs the query via parameterized DB access under the user's RLS context. 4. Server builds the answer from rows; the model may only rephrase fields given to it. 5. Output filter: any medical statement must map to a cited catalog_facts row or it is removed. 6. Always append the see-a-doctor note for symptom questions. 7. If the model is warming up, unavailable or times out, return the plain Search results with a friendly notice.

## 7. Reminders
Schedules stored per member. A scheduler (Supabase pg_cron calling the cron endpoints, or Vercel Cron if the plan allows the needed frequency) runs every minute window, selects due doses and expiry/low-stock events, dedups using a notification_events table, respects quiet hours, and fans out to channels. WhatsApp uses approved templates and the user's explicit opt-in. Idempotency key per (user, event, channel, date).

## 8. Offline
Cache: app shell, shelf, profiles, schedules, emergency numbers. Writes while offline are queued and synced (conflict rule: last write wins per field with updated_at). Show a clear "offline" banner. iPhone offline reminders are not guaranteed; show this in settings help.

## 9. Security
RLS on all tables with tests; no service key on client; CSP, HSTS, secure cookies; rate limits per IP and per user on auth, ask, upload and match; file type/size checks and image re-encode; secrets in env only; audit_log for sensitive actions; PII scrubbed from logs; DPDP-style consent, deletion and export; dependency scanning in CI.

## 10. Observability
Sentry for errors (no health data), structured logs with request id, uptime check on /api/health, job metrics (reminders sent, failures, verification queue, rollback rate) shown on the admin dashboard.

## 11. Performance and scale
Server components and caching for catalog reads; indexes in the migration; image resizing; pagination; target LCP under 2.5s on mid-range Android over 4G. Scale path: Vercel scales stateless; Supabase upgrade plans and read replicas later; queue workers separate from web.

## 12. Environments and CI/CD
Branches: main (production), preview per PR. GitHub Actions: install, lint, typecheck, unit tests, RLS tests against a Supabase test DB, build, Playwright smoke tests on preview. Migrations are forward-only and reviewed.

## 13. Recovery
Daily DB backups (confirm plan features), tested restore procedure, storage backup script, documented rollback in Vercel, status runbook in docs/07.
