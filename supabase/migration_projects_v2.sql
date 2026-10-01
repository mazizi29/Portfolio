-- Migration Projects v2: Menambahkan kolom subkategori, video embed, smart links, dynamic sections, caption galeri, serta RLS Security Policies
-- Jalankan query ini di SQL Editor Supabase jika ingin memperbarui skema dan mengamankan database.

-- 1. Tambah Kolom Baru pada projects
alter table public.projects 
  add column if not exists subcategory text not null default '',
  add column if not exists video_url text not null default '',
  add column if not exists figma_url text not null default '',
  add column if not exists instagram_url text not null default '',
  add column if not exists drive_url text not null default '',
  add column if not exists sections jsonb not null default '[]'::jsonb;

-- 2. Kolom opsional judul & keterangan pada item galeri karya visual
alter table public.project_gallery
  add column if not exists title text not null default '',
  add column if not exists caption text not null default '';

-- 3. Trigger updated_at otomatis
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

-- 4. Aktifkan RLS di semua tabel
alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.projects enable row level security;
alter table public.project_gallery enable row level security;
alter table public.experience enable row level security;
alter table public.skills enable row level security;
alter table public.messages enable row level security;

-- 5. Policies RLS
-- Profiles
drop policy if exists "profiles_select_public" on public.profiles;
create policy "profiles_select_public" on public.profiles for select using (true);
drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Site Settings
drop policy if exists "site_settings_select_public" on public.site_settings;
create policy "site_settings_select_public" on public.site_settings for select using (true);
drop policy if exists "site_settings_admin_all" on public.site_settings;
create policy "site_settings_admin_all" on public.site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Projects
drop policy if exists "projects_select_published" on public.projects;
create policy "projects_select_published" on public.projects for select using (status = 'published' or auth.role() = 'authenticated');
drop policy if exists "projects_admin_all" on public.projects;
create policy "projects_admin_all" on public.projects for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Project Gallery
drop policy if exists "gallery_select_public" on public.project_gallery;
create policy "gallery_select_public" on public.project_gallery for select using (true);
drop policy if exists "gallery_admin_all" on public.project_gallery;
create policy "gallery_admin_all" on public.project_gallery for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Experience
drop policy if exists "experience_select_public" on public.experience;
create policy "experience_select_public" on public.experience for select using (true);
drop policy if exists "experience_admin_all" on public.experience;
create policy "experience_admin_all" on public.experience for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Skills
drop policy if exists "skills_select_public" on public.skills;
create policy "skills_select_public" on public.skills for select using (true);
drop policy if exists "skills_admin_all" on public.skills;
create policy "skills_admin_all" on public.skills for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Messages
drop policy if exists "messages_insert_public" on public.messages;
create policy "messages_insert_public" on public.messages for insert with check (true);
drop policy if exists "messages_admin_all" on public.messages;
create policy "messages_admin_all" on public.messages for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- 6. Storage Bucket & Policies
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "media_auth_upload" on storage.objects;
create policy "media_auth_upload" on storage.objects for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');
drop policy if exists "media_auth_update" on storage.objects;
create policy "media_auth_update" on storage.objects for update using (bucket_id = 'media' and auth.role() = 'authenticated');
drop policy if exists "media_auth_delete" on storage.objects;
create policy "media_auth_delete" on storage.objects for delete using (bucket_id = 'media' and auth.role() = 'authenticated');
