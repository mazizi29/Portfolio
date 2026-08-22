-- Migration Projects v2: Menambahkan kolom subkategori, video embed, smart links, dynamic sections, dan caption galeri
-- Jalankan query ini di SQL Editor Supabase jika ingin menyimpan kolom baru secara native.

alter table public.projects 
  add column if not exists subcategory text not null default '',
  add column if not exists video_url text not null default '',
  add column if not exists figma_url text not null default '',
  add column if not exists instagram_url text not null default '',
  add column if not exists drive_url text not null default '',
  add column if not exists sections jsonb not null default '[]'::jsonb;

-- Kolom opsional judul & keterangan pada item galeri karya visual
alter table public.project_gallery
  add column if not exists title text not null default '',
  add column if not exists caption text not null default '';

-- Tambahkan komentar dokumentasi
comment on column public.projects.subcategory is 'Subkategori spesifik dari 3 kategori utama';
comment on column public.projects.video_url is 'URL video YouTube / Vimeo untuk disematkan di detail karya';
comment on column public.projects.figma_url is 'Tautan file atau prototype Figma';
comment on column public.projects.instagram_url is 'Tautan postingan atau reel Instagram';
comment on column public.projects.drive_url is 'Tautan Google Drive atau cloud storage';
comment on column public.projects.sections is 'Studi kasus dinamis: array of {id, label, sublabel, content}';
comment on column public.project_gallery.title is 'Judul visual opsional untuk item galeri';
comment on column public.project_gallery.caption is 'Keterangan/deskripsi singkat maks 1 kalimat untuk item galeri';
