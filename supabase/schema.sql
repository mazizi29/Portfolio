create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  title text not null default '',
  intro text not null default '',
  email text not null default '',
  location text not null default '',
  availability text not null default '',
  portrait_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id smallint primary key default 1,
  site_title text not null default 'Portfolio',
  site_tagline text not null default '',
  meta_description text not null default '',
  open_internship boolean not null default true,
  contact_email text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,
  slug text not null unique,
  title text not null,
  subtitle text not null default '',
  description text not null default '',
  category text not null default '',
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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_gallery (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

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

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('design', 'build', 'visual')),
  name text not null,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category, name)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  sent_at timestamptz not null default now()
);

create index if not exists projects_status_idx on public.projects (status);
create index if not exists projects_featured_idx on public.projects (featured);
create index if not exists projects_sort_order_idx on public.projects (sort_order);
create index if not exists experience_sort_order_idx on public.experience (sort_order);
create index if not exists skills_category_idx on public.skills (category);
create index if not exists messages_read_idx on public.messages (read);
