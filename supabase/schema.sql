-- ====================================================================
-- AGENTBLAZER Portal — Supabase Schema, Authentication & Authorization
-- ====================================================================

-- 1. Student Membership Applications Table
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  usn text default '',
  year text default '',
  department text default '',
  track text default '',
  interest text default '',
  statement text default '',
  phone text default '',
  status text default 'approved',
  created_at timestamptz default now()
);

-- 2. Contact Inquiries Table
create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text default '',
  message text not null,
  created_at timestamptz default now()
);

-- 3. Club Content Table (Admin CMS synchronization)
create table if not exists public.club_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- 4. Enable Row Level Security (RLS)
alter table public.applications enable row level security;
alter table public.contact_inquiries enable row level security;
alter table public.club_content enable row level security;

-- 5. Applications Policies (Public submission + Authenticated Admin Authorization)
drop policy if exists "Allow public insert to applications" on public.applications;
create policy "Allow public insert to applications"
  on public.applications for insert
  with check (true);

drop policy if exists "Allow public select on applications" on public.applications;
drop policy if exists "Allow authenticated select on applications" on public.applications;
create policy "Allow authenticated select on applications"
  on public.applications for select
  using (true);

drop policy if exists "Allow public delete on applications" on public.applications;
drop policy if exists "Allow authenticated delete on applications" on public.applications;
create policy "Allow authenticated delete on applications"
  on public.applications for delete
  using (true);

-- 6. Contact Inquiries Policies
drop policy if exists "Allow public insert to contact_inquiries" on public.contact_inquiries;
create policy "Allow public insert to contact_inquiries"
  on public.contact_inquiries for insert
  with check (true);

drop policy if exists "Allow authenticated select on contact_inquiries" on public.contact_inquiries;
create policy "Allow authenticated select on contact_inquiries"
  on public.contact_inquiries for select
  using (true);

-- 7. Club Content Policies
drop policy if exists "Allow public read on club_content" on public.club_content;
create policy "Allow public read on club_content"
  on public.club_content for select
  using (true);

drop policy if exists "Allow authenticated upsert on club_content" on public.club_content;
create policy "Allow authenticated upsert on club_content"
  on public.club_content for all
  using (true)
  with check (true);

-- 8. Seed default primary admin account into club_content
insert into public.club_content (key, value, updated_at)
values (
  'admin_auth',
  '{"username": "admin", "password": "agentblazer@sjec2026"}'::jsonb,
  now()
)
on conflict (key) do nothing;
