-- Live conference hub (/happening) + admin (/admin)
-- Paste into Supabase → SQL editor and run once (safe to re-run).
--
-- Admin login is passwordless email OTP. One-time dashboard setup:
--   1. Authentication → Sign In / Providers → Email: enabled; turn OFF "Allow new users to sign up".
--   2. Authentication → Email Templates → "Magic Link": include the code, e.g.
--        <h2>Your sign-in code</h2><p>{{ .Token }}</p>
--      (without {{ .Token }} Supabase emails a link instead of a code).
--   3. Authentication → Users → Add user → Create new user for each admin's real email,
--      tick "Auto Confirm User". Any password; it is never used.
--      Every user in this project is an admin: anyone who can sign in can edit the live page,
--      which is why sign-ups MUST stay disabled.
--   4. Storage: the bucket (VITE_BUCKET_NAME, here 'confrence') is created by you in the dashboard
--      and must be PUBLIC so visitors can see photos. This script only adds its access policies.
-- Supabase's built-in email sender is heavily rate-limited; for the event, configure custom SMTP
-- (Authentication → Emails → SMTP Settings) so codes always arrive.

-- ── Content tables ──────────────────────────────────────────────────────────
create table if not exists public.event_extensions (
  event_id text primary key,               -- e.g. 'd1-4' (day 1, 5th item)
  minutes int not null default 0 check (minutes between -240 and 240),
  updated_at timestamptz not null default now()
);

create table if not exists public.live_updates (
  id uuid primary key default gen_random_uuid(),
  day int not null check (day between 1 and 3),
  kind text not null default 'general' check (kind in ('photo', 'session', 'notice', 'general')),
  title text not null,
  body text,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  day int check (day between 1 and 3),     -- null = applies to every day
  category text not null default 'general' check (category in ('transport', 'meals', 'venue', 'lost-found', 'general')),
  title text not null,
  body text,
  created_at timestamptz not null default now()
);

create table if not exists public.day_recaps (
  day int primary key check (day between 1 and 3),
  text text,
  images text[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- ── RLS: everyone reads, signed-in admins write ──────────────────────────────────
do $$
declare t text;
begin
  foreach t in array array['event_extensions', 'live_updates', 'announcements', 'day_recaps'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('create policy "public read" on public.%I for select to anon, authenticated using (true)', t);
    execute format('drop policy if exists "admin insert" on public.%I', t);
    execute format('create policy "admin insert" on public.%I for insert to authenticated with check (true)', t);
    execute format('drop policy if exists "admin update" on public.%I', t);
    execute format('create policy "admin update" on public.%I for update to authenticated using (true) with check (true)', t);
    execute format('drop policy if exists "admin delete" on public.%I', t);
    execute format('create policy "admin delete" on public.%I for delete to authenticated using (true)', t);
  end loop;
end $$;

-- ── Realtime ────────────────────────────────────────────────────────────────
do $$
declare t text;
begin
  foreach t in array array['event_extensions', 'live_updates', 'announcements', 'day_recaps'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;

-- ── Storage: photos (bucket 'confrence' already exists — policies only) ─────

drop policy if exists "happening photos public read" on storage.objects;
create policy "happening photos public read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'confrence');

drop policy if exists "happening photos admin insert" on storage.objects;
create policy "happening photos admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'confrence');

drop policy if exists "happening photos admin delete" on storage.objects;
create policy "happening photos admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'confrence');

-- ── Seed a few announcements (safe to delete) ───────────────────────────────
insert into public.announcements (category, title, body)
select * from (values
  ('meals', 'Meals', 'Tea and lunch are served in the church dining hall. Please carry your delegate badge.'),
  ('lost-found', 'Lost & Found', 'Lost an item? Visit the registration / information desk at the main entrance.')
) as v(category, title, body)
where not exists (select 1 from public.announcements);
