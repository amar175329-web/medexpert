# MedExpert (घर की सेहत, सुरक्षित हाथों में)

A caring home medicine manager for India (Hindi + English). Built as a mobile-first Progressive Web App (PWA) with strict medical source grounding and Row Level Security (RLS).

---

## 🚀 Quick Setup (Under 15 Minutes)

### 1. Prerequisites
- **Node.js**: v20 or v22+
- **npm**: v10+
- **Supabase Account**: (Free tier)
- **Git**

### 2. Clone and Install
```bash
git clone https://github.com/your-username/medexpert.git
cd medexpert
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in the Supabase URL and Anon Key from your Supabase dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only)
- `CRON_SECRET` (generate any secure random string)

### 4. Apply Database Migrations
In the Supabase SQL editor or via Supabase CLI, run:
```bash
supabase db push
# OR paste and run the contents of supabase/migrations/0001_init.sql
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 15 (App Router, Server Actions) | Mobile-first SSR & API routes |
| **Language** | TypeScript (Strict mode enabled) | End-to-end type safety |
| **Styling** | Tailwind CSS with custom design tokens | Warm, accessible Indian UX tokens |
| **Internationalization** | `next-intl` (Hindi `hi` & English `en`) | Full bilingual support |
| **Database & Auth** | Supabase Postgres + RLS | Zero data leakage across households |
| **Error Tracking** | Sentry (with strict PII/Health scrubbing) | Observability without sensitive data |
| **Testing** | Vitest + Testing Library | Deterministic testing |

---

## 🎨 Design System & Accessibility

Following `docs/03_UX_DESIGN_AND_PAGE_FLOW.md`:
- **Warm & Reassuring Palette**: Care green (`#2F8F6B`), Warm cream bg (`#FBF8F2`), Deep slate ink (`#1F2A2E`).
- **Clear Status System**: Status is never conveyed by color alone. Every chip features an icon, descriptive text, and high-contrast color.
  - ✓ **Verified** (`#2F8F6B`)
  - ! **Added by you** (Unverified)
  - ⏳ **Expiring soon**
  - ✕ **Expired**
  - ↓ **Low stock**
- **Touch-Friendly**: 56px minimum touch targets across all bottom tabs and action buttons.
- **Elderly-Friendly**: User-selectable font scale (S/M/L/XL), WCAG 2.1 AA compliant.

---

## 🔒 Non-Negotiable Medical Rules

1. **Source Grounding**: Never display any medicine fact (use, ingredient, warning, side effect) without an authoritative citation from `catalog_facts`. No hallucinations.
2. **Honest Labels**: Unverified medicines clearly show "Added by you" and display only user-typed values.
3. **No Diagnosis / Prescriptions**: The AI assistant never diagnoses conditions or provides personal dosing advice. It only matches against cited labels in the user's verified shelf and always directs users to consult a doctor.
4. **Offline Resilience**: Essential shelf records, family profiles, and emergency contacts work offline without internet.

---

## 🧪 Verification & CI/CD

Run quality checks locally:
```bash
# Run unit & integration tests
npm test

# Verify TypeScript types
npm run typecheck

# Check code formatting & lint
npm run lint

# Production build
npm run build
```

GitHub Actions pipeline (`.github/workflows/ci.yml`) runs on every push and pull request to enforce clean code and passing tests.
