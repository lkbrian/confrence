-- Conference feedback (/feedback). Run in the MAIN project: Supabase → SQL editor (safe to re-run).
-- Anyone (anon) may submit and read feedback; only signed-in admins can delete spam.

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  name text check (name is null or char_length(name) <= 120),     -- optional
  rating smallint check (rating between 1 and 5),                  -- optional
  message text not null check (char_length(btrim(message)) between 2 and 2000),
  created_at timestamptz not null default now()
);

alter table public.feedback enable row level security;

drop policy if exists "public feedback" on public.feedback;
create policy "public feedback" on public.feedback
  for insert to anon, authenticated with check (true);

drop policy if exists "admin read" on public.feedback;
drop policy if exists "public read" on public.feedback;
create policy "public read" on public.feedback
  for select to anon, authenticated using (true);

drop policy if exists "admin delete" on public.feedback;
create policy "admin delete" on public.feedback
  for delete to authenticated using (true);
