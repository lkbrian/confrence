-- Conference programme as a table (mirrors `schedule` in src/data.ts).
-- Paste into Supabase → SQL editor and run. Safe to re-run: existing rows are never overwritten.
-- Anyone can read. Signed-in admins (every user in this project — sign-ups are disabled) can add,
-- edit and delete sessions from /admin/schedules. The site loads this table and falls back to
-- src/data.ts if it is empty or unreachable.
--
-- id matches event_extensions.event_id: 'd<day>-<position>' (position is 0-based within the day),
-- so extensions keep pointing at the right session.

create table if not exists public.schedules (
  id text primary key,
  day int not null check (day between 1 and 3),
  day_label text not null,                 -- 'Day 1'
  date_label text not null,                -- 'Tuesday, 6th October 2026'
  iso_date date not null,
  position int not null,                   -- order within the day, 0-based
  start_time time not null,                -- Africa/Nairobi local time
  end_time time not null,
  activity text not null,
  facilitator text,
  updated_at timestamptz not null default now(),
  unique (day, position),
  check (end_time > start_time)
);

alter table public.schedules enable row level security;

drop policy if exists "public read" on public.schedules;
create policy "public read" on public.schedules
  for select to anon, authenticated using (true);

drop policy if exists "admin insert" on public.schedules;
create policy "admin insert" on public.schedules
  for insert to authenticated with check (true);

drop policy if exists "admin update" on public.schedules;
create policy "admin update" on public.schedules
  for update to authenticated using (true) with check (true);

drop policy if exists "admin delete" on public.schedules;
create policy "admin delete" on public.schedules
  for delete to authenticated using (true);

grant select on public.schedules to anon, authenticated;
grant insert, update, delete on public.schedules to authenticated;

-- Realtime: open pages pick up schedule edits without a reload.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'schedules'
  ) then
    alter publication supabase_realtime add table public.schedules;
  end if;
end $$;

insert into public.schedules (id, day, day_label, date_label, iso_date, position, start_time, end_time, activity, facilitator)
values
  ('d1-0', 1, 'Day 1', 'Tuesday, 6th October 2026', '2026-10-06', 0, '07:30', '08:30', 'Registration', 'Secretariat'),
  ('d1-1', 1, 'Day 1', 'Tuesday, 6th October 2026', '2026-10-06', 1, '08:30', '08:50', 'Hymn Moment', 'Pr. Odu'),
  ('d1-2', 1, 'Day 1', 'Tuesday, 6th October 2026', '2026-10-06', 2, '08:50', '09:00', 'Host Welcome', 'Bishop Dr. Stephen Mairori'),
  ('d1-3', 1, 'Day 1', 'Tuesday, 6th October 2026', '2026-10-06', 3, '09:00', '09:15', 'Devotion and Conference Opening', 'Bishop Abraham Mulwa (Presiding Bishop, AIC Kenya)'),
  ('d1-4', 1, 'Day 1', 'Tuesday, 6th October 2026', '2026-10-06', 4, '09:15', '10:15', 'Plenary 1: Mutual Trust and Vulnerability', 'Bishop DR David Kipsoi'),
  ('d1-5', 1, 'Day 1', 'Tuesday, 6th October 2026', '2026-10-06', 5, '10:15', '10:45', 'Morning Tea Break', 'Hospitality / Secretariat'),
  ('d1-6', 1, 'Day 1', 'Tuesday, 6th October 2026', '2026-10-06', 6, '10:45', '11:00', 'Hymn Moment / Partners Ads', 'Pr. Odu / Media'),
  ('d1-7', 1, 'Day 1', 'Tuesday, 6th October 2026', '2026-10-06', 7, '11:00', '12:00', 'Panel Interview', null),
  ('d1-8', 1, 'Day 1', 'Tuesday, 6th October 2026', '2026-10-06', 8, '12:00', '13:00', 'Plenary 2: Mentoring Civility: Relationship between Church and State', 'Jeff Coleman'),
  ('d1-9', 1, 'Day 1', 'Tuesday, 6th October 2026', '2026-10-06', 9, '13:00', '14:00', 'Lunch', 'Hospitality / Secretariat'),
  ('d1-10', 1, 'Day 1', 'Tuesday, 6th October 2026', '2026-10-06', 10, '14:00', '14:15', 'Hymn Moment / Partners Ads', 'Pr. Odu / Media'),
  ('d1-11', 1, 'Day 1', 'Tuesday, 6th October 2026', '2026-10-06', 11, '14:15', '15:45', 'Pastoral Charge 1: The Mosaic-Joshua Paradigm', 'Daniel Woodring'),
  ('d1-12', 1, 'Day 1', 'Tuesday, 6th October 2026', '2026-10-06', 12, '15:45', '16:00', 'Conclusions / Announcement / Closing', 'Organizing Committee'),
  ('d2-0', 2, 'Day 2', 'Wednesday, 7th October 2026', '2026-10-07', 0, '08:00', '08:30', 'Registration', 'Secretariat'),
  ('d2-1', 2, 'Day 2', 'Wednesday, 7th October 2026', '2026-10-07', 1, '08:30', '08:45', 'Hymn Moment', 'Pr. Odu'),
  ('d2-2', 2, 'Day 2', 'Wednesday, 7th October 2026', '2026-10-07', 2, '08:45', '09:00', 'Devotions', 'Bishop Dr. Simeon Adera'),
  ('d2-3', 2, 'Day 2', 'Wednesday, 7th October 2026', '2026-10-07', 3, '09:00', '10:00', 'Plenary 3: Mental Health and Pastoral Wellness', 'Prof. Frank Njenga'),
  ('d2-4', 2, 'Day 2', 'Wednesday, 7th October 2026', '2026-10-07', 4, '10:00', '10:45', 'Morning Tea Break', 'Hospitality / Secretariat'),
  ('d2-5', 2, 'Day 2', 'Wednesday, 7th October 2026', '2026-10-07', 5, '10:45', '11:45', 'Plenary 4: Clashing Ministry Philosophies', 'Pr. Bill Dindi'),
  ('d2-6', 2, 'Day 2', 'Wednesday, 7th October 2026', '2026-10-07', 6, '11:45', '12:00', 'Hymn Moment / Partners Ads', 'Pr. Odu / Media'),
  ('d2-7', 2, 'Day 2', 'Wednesday, 7th October 2026', '2026-10-07', 7, '12:00', '13:00', 'Plenary 5: Authority vs. Collaboration', 'Daniel Woodring'),
  ('d2-8', 2, 'Day 2', 'Wednesday, 7th October 2026', '2026-10-07', 8, '13:00', '14:00', 'Lunch', 'Hospitality / Secretariat'),
  ('d2-9', 2, 'Day 2', 'Wednesday, 7th October 2026', '2026-10-07', 9, '14:00', '14:15', 'Hymn Moment / Partners Ads', 'Pr. Odu / Media'),
  ('d2-10', 2, 'Day 2', 'Wednesday, 7th October 2026', '2026-10-07', 10, '14:15', '15:45', 'Pastoral Charge 2: Pauline Mentorship Models', 'Kevin Howard'),
  ('d2-11', 2, 'Day 2', 'Wednesday, 7th October 2026', '2026-10-07', 11, '15:45', '16:00', 'Conclusions and Announcement', 'Organizing Committee'),
  ('d3-0', 3, 'Day 3', 'Thursday, 8th October 2026', '2026-10-08', 0, '08:00', '08:30', 'Registration', 'Secretariat'),
  ('d3-1', 3, 'Day 3', 'Thursday, 8th October 2026', '2026-10-08', 1, '08:30', '08:45', 'Hymn Moment / Partners Ads', 'Pr. Odu / Media'),
  ('d3-2', 3, 'Day 3', 'Thursday, 8th October 2026', '2026-10-08', 2, '08:45', '09:00', 'Devotions', 'Rev. Peter Ng''ok'),
  ('d3-3', 3, 'Day 3', 'Thursday, 8th October 2026', '2026-10-08', 3, '09:00', '10:00', 'Plenary 6: Conflict & Culture – Navigating Friction Constructively', 'Kevin Howard'),
  ('d3-4', 3, 'Day 3', 'Thursday, 8th October 2026', '2026-10-08', 4, '10:00', '10:45', 'Morning Tea Break', 'Hospitality / Secretariat'),
  ('d3-5', 3, 'Day 3', 'Thursday, 8th October 2026', '2026-10-08', 5, '10:45', '11:45', 'Plenary 7: Youth, Culture & Faith', 'Pr. Bill Dindi'),
  ('d3-6', 3, 'Day 3', 'Thursday, 8th October 2026', '2026-10-08', 6, '11:45', '11:50', 'Hymn Moment', 'Pr. Odu'),
  ('d3-7', 3, 'Day 3', 'Thursday, 8th October 2026', '2026-10-08', 7, '11:50', '13:00', 'Q & A Session', 'Rev. John Kitala'),
  ('d3-8', 3, 'Day 3', 'Thursday, 8th October 2026', '2026-10-08', 8, '13:00', '13:30', 'Conference Closing / Resolutions / Certification', 'Organizing Committee / Bishop Abraham Mulwa'),
  ('d3-9', 3, 'Day 3', 'Thursday, 8th October 2026', '2026-10-08', 9, '13:30', '14:00', 'Lunch / Departure', 'Hospitality / Secretariat')
-- Existing rows are left alone so re-running never overwrites edits made in /admin/schedules.
on conflict (id) do nothing;
