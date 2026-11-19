# MedExpert – Full-Stack Production Checklist
Each layer: decision → what to build → done when.

1. **Frontend** – Next.js + Tailwind PWA per docs/03. Done when: Lighthouse PWA/accessibility pass, hi/en complete, LCP target met.
2. **APIs & Backend logic** – Route Handlers + Server Actions, Zod on every input, typed responses, idempotent writes. Done when: every endpoint in TRD §4 has validation and tests.
3. **Database & Storage** – Supabase Postgres, migrations in repo, private storage buckets. Done when: fresh project applies migration cleanly; indexes verified.
4. **Auth & Permissions** – Google + email/password, household roles (owner, member), admin role for verification. Done when: role tests pass.
5. **Hosting & Deployment** – Vercel, preview per PR, production on main. Done when: documented deploy under 15 minutes (docs/07).
6. **Cloud & Compute** – Stateless web on Vercel; background jobs via pg_cron/Cron endpoints; local model bridge separate (docs/05). Done when: jobs run on schedule and are idempotent.
7. **CI/CD & Version Control** – GitHub, protected main, Actions pipeline (lint, types, tests, RLS tests, build, e2e smoke). Done when: red pipeline blocks merge.
8. **Security & RLS** – RLS on every table with tests, CSP/HSTS, no secrets in client, dependency scan. Done when: cross-household access tests fail as expected.
9. **Rate Limiting** – Upstash limits on login, signup, ask, match, upload, notification endpoints. Done when: limits return 429 with friendly message and are tested.
10. **Caching & CDN** – Static assets on Vercel CDN, catalog reads cached with revalidation, service-worker cache for offline. Done when: cache invalidation on catalog change verified.
11. **Load Balancing & Scaling** – Vercel handles balancing; plan DB connection pooling; queue-based background work; documented scale-up path. Done when: load test results recorded.
12. **Error Tracking & Logs** – Sentry with PII scrubbing, structured logs with request ids, admin metrics. Done when: a forced error appears in Sentry without personal data.
13. **Availability & Recovery** – Uptime check on `/api/health`, backups, restore drill, rollback steps, status runbook. Done when: restore drill documented with timings.
