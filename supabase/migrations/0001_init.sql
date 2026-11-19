-- MedExpert initial schema. Postgres (Supabase). RLS on every table.
create extension if not exists pgcrypto;

-- ============ Core ============
create table public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.household_users (
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','member')),
  primary key (household_id, user_id)
);
create index on public.household_users (user_id);

create table public.app_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create or replace function public.is_member(h uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.household_users
                 where household_id = h and user_id = auth.uid());
$$;

create or replace function public.is_owner(h uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.household_users
                 where household_id = h and user_id = auth.uid() and role = 'owner');
$$;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.app_admins where user_id = auth.uid());
$$;

create or replace function public.add_owner_membership() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.household_users (household_id, user_id, role)
  values (new.id, new.owner_id, 'owner');
  return new;
end $$;
create trigger trg_households_owner after insert on public.households
  for each row execute function public.add_owner_membership();

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null,
  birth_year int check (birth_year between 1900 and 2100),
  allergies text[] not null default '{}',
  notes text,
  created_at timestamptz not null default now()
);
create index on public.profiles (household_id);

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  parent_id uuid references public.locations(id) on delete set null,
  name text not null
);
create index on public.locations (household_id);

-- ============ Verified catalog (read-only for users) ============
create table public.catalog_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text,
  trust_tier smallint not null check (trust_tier between 1 and 3),
  license_note text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.catalog_medicines (
  id uuid primary key default gen_random_uuid(),
  brand_name text not null,
  generic_name text,
  form text,
  manufacturer text,
  barcode text,
  status text not null default 'verified' check (status in ('verified','rolled_back')),
  verified_at timestamptz,
  created_at timestamptz not null default now()
);
create index on public.catalog_medicines (barcode);
create index on public.catalog_medicines using gin (to_tsvector('simple', brand_name || ' ' || coalesce(generic_name,'')));

create table public.catalog_ingredients (
  id uuid primary key default gen_random_uuid(),
  catalog_medicine_id uuid not null references public.catalog_medicines(id) on delete cascade,
  ingredient text not null,
  strength text
);
create index on public.catalog_ingredients (catalog_medicine_id);

create table public.catalog_facts (
  id uuid primary key default gen_random_uuid(),
  catalog_medicine_id uuid not null references public.catalog_medicines(id) on delete cascade,
  kind text not null check (kind in ('use','warning','side_effect','interaction','storage','dosage_label','disposal')),
  text_en text not null,
  text_hi text,
  source_id uuid not null references public.catalog_sources(id),
  source_url text not null,
  retrieved_at timestamptz not null,
  verification_job_id uuid
);
create index on public.catalog_facts (catalog_medicine_id, kind);

-- ============ User data ============
create table public.user_medicines (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  catalog_medicine_id uuid references public.catalog_medicines(id) on delete set null,
  display_name text not null,
  form text,
  location_id uuid references public.locations(id) on delete set null,
  expiry_date date not null,
  quantity numeric,
  quantity_unit text,
  low_stock_threshold numeric,
  price_inr numeric(10,2),
  purchased_from text,
  purchase_date date,
  batch_no text,
  prescribed_for uuid references public.profiles(id) on delete set null,
  doctor text,
  verification_status text not null default 'unverified' check (verification_status in ('verified','unverified')),
  photo_paths text[] not null default '{}',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.user_medicines (household_id, expiry_date);
create index on public.user_medicines (household_id, lower(display_name));

create table public.dose_schedules (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  user_medicine_id uuid not null references public.user_medicines(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  times time[] not null,
  days_of_week int[] not null default '{1,2,3,4,5,6,7}',
  start_date date not null,
  end_date date,
  instructions text,
  timezone text not null default 'Asia/Kolkata',
  active boolean not null default true
);
create index on public.dose_schedules (household_id, active);

create table public.dose_logs (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  schedule_id uuid not null references public.dose_schedules(id) on delete cascade,
  scheduled_at timestamptz not null,
  status text not null check (status in ('taken','skipped','snoozed','missed')),
  logged_at timestamptz not null default now(),
  unique (schedule_id, scheduled_at)
);

create table public.prescriptions (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  photo_path text not null,
  doctor text,
  rx_date date,
  extracted jsonb,
  created_at timestamptz not null default now()
);

create table public.notification_prefs (
  user_id uuid primary key references auth.users(id) on delete cascade,
  push boolean not null default true,
  whatsapp boolean not null default false,
  whatsapp_number text,
  email boolean not null default true,
  expiry_days int[] not null default '{30,15,7}',
  quiet_start time,
  quiet_end time
);

create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  keys jsonb not null,
  created_at timestamptz not null default now()
);

create table public.notification_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  channel text not null check (channel in ('push','whatsapp','email')),
  idempotency_key text not null unique,
  status text not null default 'pending' check (status in ('pending','sent','failed')),
  created_at timestamptz not null default now()
);

-- ============ Verification (service role writes) ============
create table public.verification_jobs (
  id uuid primary key default gen_random_uuid(),
  user_medicine_id uuid references public.user_medicines(id) on delete set null,
  query jsonb not null,
  status text not null default 'queued' check (status in ('queued','running','verified','needs_review','failed')),
  attempts int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.verification_jobs (status, created_at);

create table public.verification_audit (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.verification_jobs(id) on delete cascade,
  agent text not null,
  decision text not null,
  evidence jsonb,
  created_at timestamptz not null default now()
);

create table public.audit_log (
  id bigserial primary key,
  user_id uuid,
  action text not null,
  entity text,
  entity_id uuid,
  meta jsonb,
  at timestamptz not null default now()
);

-- ============ RLS ============
alter table public.households enable row level security;
alter table public.household_users enable row level security;
alter table public.app_admins enable row level security;
alter table public.profiles enable row level security;
alter table public.locations enable row level security;
alter table public.catalog_sources enable row level security;
alter table public.catalog_medicines enable row level security;
alter table public.catalog_ingredients enable row level security;
alter table public.catalog_facts enable row level security;
alter table public.user_medicines enable row level security;
alter table public.dose_schedules enable row level security;
alter table public.dose_logs enable row level security;
alter table public.prescriptions enable row level security;
alter table public.notification_prefs enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.notification_events enable row level security;
alter table public.verification_jobs enable row level security;
alter table public.verification_audit enable row level security;
alter table public.audit_log enable row level security;

create policy households_select on public.households for select using (public.is_member(id));
create policy households_insert on public.households for insert with check (owner_id = auth.uid());
create policy households_update on public.households for update using (public.is_owner(id)) with check (public.is_owner(id));
create policy households_delete on public.households for delete using (public.is_owner(id));

create policy hu_select on public.household_users for select using (public.is_member(household_id));
create policy hu_owner_manage on public.household_users for all using (public.is_owner(household_id)) with check (public.is_owner(household_id));

-- household-scoped tables
do $$
declare t text;
begin
  foreach t in array array['profiles','locations','user_medicines','dose_schedules','dose_logs','prescriptions']
  loop
    execute format('create policy %I_rw on public.%I for all using (public.is_member(household_id)) with check (public.is_member(household_id))', t, t);
  end loop;
end $$;

-- catalog: read for signed-in users, no client writes (service role bypasses RLS)
create policy catalog_sources_read on public.catalog_sources for select to authenticated using (true);
create policy catalog_medicines_read on public.catalog_medicines for select to authenticated using (status = 'verified');
create policy catalog_ingredients_read on public.catalog_ingredients for select to authenticated using (true);
create policy catalog_facts_read on public.catalog_facts for select to authenticated using (true);

-- own rows
create policy notif_prefs_own on public.notification_prefs for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy push_subs_own on public.push_subscriptions for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy notif_events_own_read on public.notification_events for select using (user_id = auth.uid());

-- verification + audit: admins read only; writes by service role
create policy vjobs_admin_read on public.verification_jobs for select using (public.is_admin());
create policy vaudit_admin_read on public.verification_audit for select using (public.is_admin());
create policy audit_admin_read on public.audit_log for select using (public.is_admin());
create policy admins_self on public.app_admins for select using (user_id = auth.uid());

-- ============ Housekeeping ============
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger trg_user_medicines_touch before update on public.user_medicines
  for each row execute function public.touch_updated_at();
create trigger trg_vjobs_touch before update on public.verification_jobs
  for each row execute function public.touch_updated_at();

-- ============ Storage (create buckets in the dashboard, then policies) ============
-- Buckets: medicine-photos, prescriptions (both PRIVATE). Object path: <household_id>/<file>.
-- Policy idea (adapt in the Storage UI or a follow-up migration):
--   allow select/insert/update/delete on storage.objects where bucket_id in ('medicine-photos','prescriptions')
--   and public.is_member( (split_part(name,'/',1))::uuid ).
