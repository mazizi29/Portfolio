-- ==============================================================================
-- SCHEMA SUPABASE: MUHAMMAD AZIZI ABDILLAH PORTFOLIO
-- ==============================================================================

create extension if not exists pgcrypto;

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  title text not null default '',
  intro text not null default '',
  email text not null default '',
  location text not null default '',
  availability text not null default 'open',
  portrait_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. SITE SETTINGS TABLE
create table if not exists public.site_settings (
  id smallint primary key default 1,
  site_title text not null default 'Portfolio',
  site_tagline text not null default '',
  meta_description text not null default '',
  open_internship boolean not null default true,
  contact_email text not null default '',
  updated_at timestamptz not null default now()
);

-- 3. PROJECTS TABLE (Includes v2 native columns)
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,
  slug text not null unique,
  title text not null,
  subtitle text not null default '',
  description text not null default '',
  category text not null default '',
  subcategory text not null default '',
  year text not null default '',
  role text not null default '',
  tools text[] not null default '{}',
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean not null default false,
  cover_url text not null default '',
  overview text not null default '',
  problem text not null default '',
  result text not null default '',
  github_url text not null default '',
  live_url text not null default '',
  figma_url text not null default '',
  video_url text not null default '',
  instagram_url text not null default '',
  drive_url text not null default '',
  sections jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. PROJECT GALLERY TABLE (Includes v2 title & caption)
create table if not exists public.project_gallery (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  image_url text not null,
  title text not null default '',
  caption text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- 5. EXPERIENCE TABLE
create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,
  organization text not null,
  position text not null,
  type text not null check (type in ('Education', 'Work', 'Freelance', 'Project')),
  start_date date not null,
  end_date date,
  description text not null default '',
  skills text[] not null default '{}',
  status text not null default 'active' check (status in ('active', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. SKILLS TABLE
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('design', 'build', 'visual')),
  name text not null,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category, name)
);

-- 7. MESSAGES TABLE
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  sent_at timestamptz not null default now()
);

-- ── INDEXES ───────────────────────────────────────────────────────────────────
create index if not exists projects_status_idx on public.projects (status);
create index if not exists projects_featured_idx on public.projects (featured);
create index if not exists projects_sort_order_idx on public.projects (sort_order);
create index if not exists experience_sort_order_idx on public.experience (sort_order);
create index if not exists skills_category_idx on public.skills (category);
create index if not exists project_gallery_project_id_idx on public.project_gallery (project_id);
create index if not exists messages_read_idx on public.messages (read);

-- ── TRIGGER UPDATED_AT ────────────────────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.handle_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
  before update on public.projects
  for each row execute function public.handle_updated_at();

drop trigger if exists set_experience_updated_at on public.experience;
create trigger set_experience_updated_at
  before update on public.experience
  for each row execute function public.handle_updated_at();

drop trigger if exists set_skills_updated_at on public.skills;
create trigger set_skills_updated_at
  before update on public.skills
  for each row execute function public.handle_updated_at();

-- ── ROW LEVEL SECURITY (RLS) ─────────────────────────────────────────────────

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.projects enable row level security;
alter table public.project_gallery enable row level security;
alter table public.experience enable row level security;
alter table public.skills enable row level security;
alter table public.messages enable row level security;

-- 1. Profiles Policies
drop policy if exists "profiles_select_public" on public.profiles;
create policy "profiles_select_public" on public.profiles
  for select using (true);

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 2. Site Settings Policies
drop policy if exists "site_settings_select_public" on public.site_settings;
create policy "site_settings_select_public" on public.site_settings
  for select using (true);

drop policy if exists "site_settings_admin_all" on public.site_settings;
create policy "site_settings_admin_all" on public.site_settings
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 3. Projects Policies
drop policy if exists "projects_select_published" on public.projects;
create policy "projects_select_published" on public.projects
  for select using (status = 'published' or auth.role() = 'authenticated');

drop policy if exists "projects_admin_all" on public.projects;
create policy "projects_admin_all" on public.projects
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 4. Project Gallery Policies
drop policy if exists "gallery_select_public" on public.project_gallery;
create policy "gallery_select_public" on public.project_gallery
  for select using (true);

drop policy if exists "gallery_admin_all" on public.project_gallery;
create policy "gallery_admin_all" on public.project_gallery
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 5. Experience Policies
drop policy if exists "experience_select_public" on public.experience;
create policy "experience_select_public" on public.experience
  for select using (true);

drop policy if exists "experience_admin_all" on public.experience;
create policy "experience_admin_all" on public.experience
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 6. Skills Policies
drop policy if exists "skills_select_public" on public.skills;
create policy "skills_select_public" on public.skills
  for select using (true);

drop policy if exists "skills_admin_all" on public.skills;
create policy "skills_admin_all" on public.skills
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 7. Messages Policies
drop policy if exists "messages_insert_public" on public.messages;
create policy "messages_insert_public" on public.messages
  for insert with check (true);

drop policy if exists "messages_admin_all" on public.messages;
create policy "messages_admin_all" on public.messages
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ── STORAGE POLICIES FOR 'media' BUCKET ───────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media_auth_upload" on storage.objects;
create policy "media_auth_upload" on storage.objects
  for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "media_auth_update" on storage.objects;
create policy "media_auth_update" on storage.objects
  for update using (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "media_auth_delete" on storage.objects;
create policy "media_auth_delete" on storage.objects
  for delete using (bucket_id = 'media' and auth.role() = 'authenticated');
