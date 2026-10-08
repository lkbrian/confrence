-- Expressions of interest for the next Pastors Conference (/next-conference).
-- Run in the 4th annual conference project (VITE_FOURTH_URL), not the main one:
-- Supabase → SQL editor, paste and run once (safe to re-run).
--
-- Visitors (anon) may only INSERT; they can never read the list back. Signed-in users of that
-- project can read, edit and delete rows; keep its sign-ups disabled like the main project's.

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 2 and 120),
  phone text not null check (phone ~ '^\+?[0-9]{9,15}$'),   -- stored normalised, e.g. 254712345678
  mpesa_code text check (mpesa_code is null or mpesa_code ~ '^[A-Z0-9]{8,12}$'),
  area text not null check (char_length(btrim(area)) between 2 and 120),  -- where they are coming from
  created_at timestamptz not null default now()
);

-- One registration per phone number.
create unique index if not exists registrations_phone_key
  on public.registrations (phone);

alter table public.registrations enable row level security;

drop policy if exists "public register" on public.registrations;
create policy "public register" on public.registrations
  for insert to anon, authenticated with check (true);

drop policy if exists "admin read" on public.registrations;
create policy "admin read" on public.registrations
  for select to authenticated using (true);

drop policy if exists "admin update" on public.registrations;
create policy "admin update" on public.registrations
  for update to authenticated using (true) with check (true);

drop policy if exists "admin delete" on public.registrations;
create policy "admin delete" on public.registrations
  for delete to authenticated using (true);

-- ── Changes: listings are admin-only; visitors view their own registration by phone ──
-- Nobody signs in to this project, so the table is closed to every client. Admins read it through
-- the main project's `fourth-registrations` edge function (supabase/functions/), which checks their
-- main-project session and then uses this project's service role key (service role bypasses RLS).
-- Visitors keep insert-only access and can fetch the one registration matching a phone number.

drop policy if exists "admin read" on public.registrations;
drop policy if exists "admin update" on public.registrations;
drop policy if exists "admin delete" on public.registrations;

-- Phones are stored normalised (2547…), and registrations_phone_key keeps them unique,
-- so this returns at most one row.
create or replace function public.my_registration(p_phone text)
returns table (name text, phone text, mpesa_code text, area text, created_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select r.name, r.phone, r.mpesa_code, r.area, r.created_at
  from public.registrations r
  where r.phone = p_phone
  limit 1
$$;

revoke all on function public.my_registration(text) from public;
grant execute on function public.my_registration(text) to anon, authenticated;

-- ── Changes: registering upserts on the phone number ─────────────────────────────
-- Submitting the form again with the same phone updates that registration instead of failing.
-- A blank M-Pesa code keeps the one already on file, so pastors can add it later but not lose it.
-- Visitors now go through register() only, so direct inserts are closed.

alter table public.registrations add column if not exists updated_at timestamptz not null default now();

drop policy if exists "public register" on public.registrations;

create or replace function public.register(p_name text, p_phone text, p_mpesa_code text, p_area text)
returns table (name text, phone text, mpesa_code text, area text, created_at timestamptz, updated boolean)
language sql
volatile
security definer
set search_path = ''
as $$
  insert into public.registrations as r (name, phone, mpesa_code, area)
  values (p_name, p_phone, nullif(p_mpesa_code, ''), p_area)
  on conflict (phone) do update
    set name = excluded.name,
        area = excluded.area,
        mpesa_code = coalesce(excluded.mpesa_code, r.mpesa_code),
        updated_at = now()
  -- xmax is 0 for a freshly inserted row and set when the conflict path updated it.
  returning r.name, r.phone, r.mpesa_code, r.area, r.created_at, (r.xmax <> 0) as updated
$$;

revoke all on function public.register(text, text, text, text) from public;
grant execute on function public.register(text, text, text, text) to anon, authenticated;
