# Deployment: GitHub → Vercel (+ Supabase)

## 1. Accounts
GitHub, Vercel, Supabase, Upstash, Sentry, Resend, Meta (WhatsApp Cloud API) and Google Cloud (OAuth client).
NOTE: Vercel's free Hobby plan is intended for personal, non-commercial use. A public product will likely need a paid plan. Confirm the current terms and limits before launch (see docs/09). Also confirm cron frequency limits on the plan.

## 2. Supabase
1. New project (choose a region close to India). 2. Run `supabase/migrations/0001_init.sql` (SQL editor or Supabase CLI). 3. Enable Google provider and email auth; set redirect URLs. 4. Create private storage buckets `medicine-photos` and `prescriptions` with policies from the migration notes. 5. Copy URL, anon key, service-role key (server only).

## 3. Environment variables (also in `.env.example`)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # server only
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:you@example.com
RESEND_API_KEY=
WHATSAPP_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
CRON_SECRET=
AI_PROVIDER=local-bridge
AI_BRIDGE_URL=
AI_BRIDGE_TOKEN=
AI_REQUEST_TIMEOUT_MS=60000
MODEL_IDLE_SECONDS=300
NEXT_PUBLIC_APP_URL=
```

## 4. GitHub
Create an empty repo, copy this pack in, let Claude Code build, then `git push`. Protect `main`; require the CI workflow to pass.

## 5. Vercel
Import the GitHub repo → add env vars (Production and Preview) → deploy. Add the custom domain. Configure cron (or Supabase pg_cron) to call the `/api/cron/*` endpoints with `Authorization: Bearer $CRON_SECRET`.

## 6. Go-live checklist
Migrations applied · RLS tests green · env vars set · Google OAuth redirect correct · push, email and WhatsApp templates tested · emergency numbers verified · legal pages present · Sentry receives a test error without personal data · uptime check on `/api/health` · backup and restore drill done · rollback steps tested.

## 7. Rollback and recovery
Vercel: promote the previous deployment. Database: restore from backup per Supabase plan; migrations are forward-only so fix forward with a new migration.
