# Panduan Lengkap — Portfolio Website

Dokumen ini menjelaskan struktur, cara kerja, dan panduan pengembangan proyek portfolio ini secara menyeluruh.

---

## Daftar Isi

1. [Tech Stack](#tech-stack)
2. [Struktur Proyek](#struktur-proyek)
3. [Cara Kerja Per Lapisan](#cara-kerja-per-lapisan)
4. [Sistem Desain](#sistem-desain)
5. [Halaman Publik](#halaman-publik)
6. [Area Admin](#area-admin)
7. [Autentikasi](#autentikasi)
8. [Alur Data](#alur-data)
9. [Deploy & Hosting](#deploy--hosting)
10. [Pengembangan Lanjutan](#pengembangan-lanjutan)

---

## Tech Stack

| Teknologi | Versi | Fungsi |
|---|---|---|
| React | 19.x | UI library utama |
| TypeScript | 5.7 | Type safety & autocompletion |
| Vite | 8.x | Build tool & development server |
| Tailwind CSS | v4 | Utility-first CSS framework |
| React Router | v7 | Client-side routing |
| Google Fonts | — | Fraunces, Manrope, JetBrains Mono |

---

## Struktur Proyek

```
portfolio/
├── index.html                    # HTML shell, titik masuk browser
├── vite.config.ts                # Konfigurasi Vite + Tailwind plugin
├── package.json                  # Dependensi & scripts
├── tsconfig.json                 # Konfigurasi TypeScript
├── GUIDE.md                      # Dokumen ini
│
└── src/
    ├── main.tsx                  # Entry point React
    ├── App.tsx                   # Definisi semua route
    ├── index.css                 # Global styles, font, design tokens
    │
    ├── context/
    │   └── AuthContext.tsx       # State & logika autentikasi global
    │
    ├── data/
    │   └── mockData.ts           # Data statis: proyek, pengalaman, pesan
    │
    ├── components/
    │   ├── public/
    │   │   ├── Navbar.tsx        # Navigasi halaman publik
    │   │   └── Footer.tsx        # Footer halaman publik
    │
    ├── layouts/
    │   ├── public/               # Shell halaman publik (Navbar + Footer)
    │   └── admin/                # Shell admin (sidebar + topbar)
    │
    └── pages/
        ├── public/
        │   ├── Home.tsx          # Beranda
        │   ├── Work.tsx          # Daftar karya
        │   ├── ProjectDetail.tsx # Studi kasus proyek
        │   ├── About.tsx         # Tentang saya
        │   └── Contact.tsx       # Kontak
        └── admin/
            ├── Login.tsx         # Halaman login admin
            ├── Dashboard.tsx     # Ringkasan statistik
            ├── Projects.tsx      # CRUD proyek
            ├── Experience.tsx    # CRUD pengalaman & pendidikan
            ├── Skills.tsx        # CRUD kemampuan
            ├── AboutAdmin.tsx    # Edit konten halaman tentang
            ├── Media.tsx         # Manajemen media/gambar
            ├── Messages.tsx      # Kotak pesan masuk
            └── Settings.tsx      # Pengaturan situs
```

Catatan struktur terbaru: halaman publik sekarang dibungkus lewat `src/layouts/public/PublicLayout.tsx`, sedangkan area admin memakai `src/layouts/admin/AdminLayout.tsx`. Komponen kecil seperti Navbar dan Footer tetap berada di `src/components/public/`.

---

## Cara Kerja Per Lapisan

### `index.html`

File HTML tunggal yang menjadi cangkang aplikasi. Browser memuat file ini pertama kali, lalu Vite menyuntikkan script React secara otomatis.

```html
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

### `src/main.tsx` — Entry Point

Titik masuk React. Merender komponen `App` ke dalam elemen `#root`.

```tsx
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
```

### `src/index.css` — Styling Global

Tiga bagian utama:

```css
/* 1. Import font dari Google Fonts — HARUS di baris paling atas */
@import url('https://fonts.googleapis.com/css2?family=Fraunces...');

/* 2. Aktifkan Tailwind CSS v4 */
@import 'tailwindcss';

/* 3. Design tokens sebagai CSS custom properties */
@theme {
  --color-ink:    #0A0A0A;   /* teks utama */
  --color-paper:  #F7F7F5;   /* background halaman */
  --color-muted:  #6F6F6F;   /* teks sekunder */
  --color-border: #DCDCDC;   /* garis pembatas */
  --font-sans:    'Manrope';
  --font-serif:   'Fraunces';
  --font-mono:    'JetBrains Mono';
}
```

Tailwind v4 membaca blok `@theme` dan otomatis membuat utility class. Misalnya `--color-ink` menjadi bisa dipakai sebagai `text-ink`, `bg-ink`, `border-ink`, dll.

### `src/App.tsx` — Router Utama

Semua route didefinisikan di sini menggunakan React Router v7.

```tsx
<BrowserRouter>
  <AuthProvider>
    <Routes>
      {/* Route publik — bebas diakses */}
      <Route path="/"            element={<Home />} />
      <Route path="/work"        element={<Work />} />
      <Route path="/work/:slug"  element={<ProjectDetail />} />
      <Route path="/about"       element={<About />} />
      <Route path="/contact"     element={<Contact />} />

      {/* Route admin — butuh login */}
      <Route path="/admin/login"      element={<Login />} />
      <Route path="/admin/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/projects"   element={<ProtectedRoute><AdminProjects /></ProtectedRoute>} />
      {/* ... dst */}

      {/* Fallback — URL tidak dikenal redirect ke beranda */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </AuthProvider>
</BrowserRouter>
```

`ProtectedRoute` adalah komponen penjaga. Jika pengguna belum login, otomatis diarahkan ke `/admin/login`.

```tsx
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />
}
```

---

## Sistem Desain

### Palet Warna

| Token | Nilai | Penggunaan |
|---|---|---|
| `--color-ink` | `#0A0A0A` | Teks utama, tombol primer, elemen dominan |
| `--color-paper` | `#F7F7F5` | Background halaman |
| `--color-surface` | `#FFFFFF` | Background kartu, panel |
| `--color-muted` | `#6F6F6F` | Teks sekunder, label |
| `--color-border` | `#DCDCDC` | Garis, border elemen |

### Tipografi

| Font | Jenis | Digunakan untuk |
|---|---|---|
| **Manrope** | Sans-serif geometrik | Body text, UI, label, tombol |
| **Fraunces** | Serif variabel, editorial | Judul besar, aksen italic di hero & section heading |
| **JetBrains Mono** | Monospace | Label kategori, nomor, kode, metadata |

### Spacing & Border

- Sistem spacing berbasis **4px / 8px** konsisten
- Border radius: `2px` (sharp), `4px` (default), `8px` (card)
- Border menggunakan garis tipis (`1px`) bukan shadow tebal
- Whitespace yang generous di setiap section

---

## Halaman Publik

### Navbar Publik (`Navbar.tsx`)

Navigasi sticky yang transparan saat di atas halaman, lalu mendapat background blur saat di-scroll.

```
Link navigasi: Beranda · Karya · Tentang · Kontak
```

`NavLink` dari React Router digunakan agar link aktif otomatis mendapat style berbeda. Link **Beranda** menggunakan prop `end={true}` agar tidak dianggap aktif di semua halaman (karena path-nya `/` yang merupakan prefix dari semua route).

```tsx
// end={true} → hanya aktif di "/" persis, bukan di "/work", "/about", dll.
<NavLink to="/" end={true}>Beranda</NavLink>
```

Di mobile, navigasi berubah menjadi drawer yang muncul dari atas saat tombol hamburger diklik.

---

### Beranda (`/`)

Terdiri dari 5 section bersusun vertikal:

```
┌──────────────────────────────────────────┐
│  Navbar (sticky, transparan → blur)      │
├──────────────────────────────────────────┤
│  Hero                                    │
│  ┌─────────────────┐  ┌───────────────┐  │
│  │ Status badge    │  │               │  │
│  │ Slogan besar    │  │  Foto portrait│  │
│  │ (Manrope+       │  │  (Unsplash)   │  │
│  │  Fraunces italic│  │               │  │
│  │ Subtitle ID     │  │ ┌───────────┐ │  │
│  │ Tag kemampuan   │  │ │ Stat card │ │  │
│  │ Tombol CTA      │  │ │ 4+ / 3+   │ │  │
│  └─────────────────┘  └───────────────┘  │
├──────────────────────────────────────────┤
│  Karya Pilihan                           │
│  · ProjectRow × 4 (featured)             │
├──────────────────────────────────────────┤
│  Tentang (background gelap #0A0A0A)      │
│  · Teks perkenalan bahasa Indonesia      │
│  · Timeline perjalanan (dot + garis)     │
├──────────────────────────────────────────┤
│  Kemampuan                               │
│  · 3 kolom: Desain / Bangun / Visual     │
├──────────────────────────────────────────┤
│  CTA "Ayo Buat Sesuatu"                  │
├──────────────────────────────────────────┤
│  Footer                                  │
└──────────────────────────────────────────┘
```

**Hero photo** diambil dari Unsplash dan ditampilkan di sisi kanan slogan dengan border-radius asimetris (`4px 40px 4px 40px`) untuk nuansa editorial. Di bawah foto terdapat stat card kecil yang menampilkan "4+ Proyek" dan "3+ Tahun Desain".

```tsx
// Struktur dua kolom hero: slogan kiri, foto kanan
// Collapse ke satu kolom di bawah breakpoint lg (1024px)
<div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
  <div className="flex-1">          {/* Slogan + CTA */} </div>
  <div style={{ maxWidth: '380px' }}> {/* Foto + stat card */} </div>
</div>
```

Di mobile (< `lg`), foto berada di bawah slogan dengan lebar penuh.

### Karya (`/work`)

- Filter kategori menggunakan `useState` untuk menyaring proyek
- Grid 2 kolom di desktop, 1 kolom di mobile
- Kartu pertama lebih besar (editorial emphasis)

### Studi Kasus (`/work/:slug`)

```tsx
const { slug } = useParams()
// slug diambil dari URL, misal: /work/nataArtha → slug = "nataArtha"
const project = projects.find(p => p.slug === slug)
```

Jika slug tidak cocok dengan data manapun, redirect otomatis ke `/work`.

### Tentang (`/about`)

- Grid 2 kolom: teks kiri, foto kanan (hidden di mobile)
- Timeline pengalaman dengan format editorial
- Section kemampuan dengan background gelap

### Kontak (`/contact`)

- Form dengan validasi HTML5 native (`required`)
- Setelah submit: ubah `sent` state ke `true`, tampilkan pesan konfirmasi
- Daftar link sosial dengan hover animation

> **Catatan:** Form saat ini tidak benar-benar mengirim email. Lihat bagian [Pengembangan Lanjutan](#pengembangan-lanjutan).

---

## Area Admin

Akses: `/admin/login`
Kredensial demo: `admin@portfolio.id` / `admin123`

Tombol akses tersembunyi ada di footer publik — titik kecil `·` di sebelah © 2026.

### Layout Admin (`AdminLayout.tsx`)

Semua halaman admin dibungkus komponen ini yang menyediakan:

```
┌──────────────┬────────────────────────────────────┐
│              │ [≡] Judul Halaman         Cari [A] │ ← Topbar
│   Sidebar    ├────────────────────────────────────┤
│   (gelap)    │                                    │
│              │  {children}                        │
│  ◈ Dashboard │  (konten halaman yang aktif)       │
│  ⬡ Proyek   │                                    │
│  ◉ Tentang  │                                    │
│  ◎ Pengalam │                                    │
│  ◐ Kemampuan│                                    │
│  ◫ Media    │                                    │
│  ◻ Pesan    │                                    │
│  ◌ Pengatur │                                    │
│              │                                    │
│  ⌂ Portfolio │                                    │
│  ⊠ Logout   │                                    │
└──────────────┴────────────────────────────────────┘
```

**Responsif sidebar — cara kerja teknikal:**

Sidebar menggunakan pendekatan dua-mode berdasarkan breakpoint:

```
Mobile (< 768px):
  position: fixed
  transform: translateX(-220px)  ← tersembunyi di kiri layar
  transform: translateX(0)       ← muncul saat open = true

Desktop (≥ 768px):
  position: sticky
  transform: translateX(0)       ← selalu tampil, dipaksa oleh CSS class
```

Masalah: inline style dari React (`transform: translateX(-220px)`) tidak bisa di-override oleh Tailwind class biasa karena spesifisitas inline style lebih tinggi. Solusinya adalah CSS rule statis di `src/index.css` yang menggunakan `!important`:

```css
/* src/index.css */
@media (min-width: 768px) {
  .admin-sidebar {
    transform: translateX(0) !important;
  }
}
```

Class `admin-sidebar` ditambahkan ke elemen `<aside>`. Rule ini di-load sekali saat aplikasi pertama buka — tidak dinamis, tidak menyebabkan lag.

> ⚠️ Jangan gunakan `<style>` tag di dalam JSX untuk override seperti ini. Tag style di dalam komponen React akan di-inject dan dihapus ulang setiap re-render, menyebabkan layout recalculation terus-menerus yang terasa sebagai lag.

Di samping sidebar terdapat spacer `<div>` dengan lebar `220px` yang hanya muncul di desktop (`hidden md:block`). Fungsinya mendorong konten utama ke kanan agar tidak tertimpa sidebar yang `sticky`.

### Dashboard (`/admin/dashboard`)

Menampilkan ringkasan data:
- 4 stat tile: Total Proyek, Published, Draft, Pengalaman
- Tabel proyek terbaru
- Daftar pesan masuk dengan indikator unread

### CRUD Proyek (`/admin/projects`)

```
State utama:
  projects[]   ← data proyek (dari mockData, bisa diubah)
  view         ← 'list' atau 'form'
  editing      ← proyek yang sedang diedit (null = mode tambah)
  deleteModal  ← id proyek yang akan dihapus

Alur tambah proyek:
  Klik "+ Tambah" → view = 'form', editing = null
  Isi form → Klik "Simpan" → tambah ke array → view = 'list'

Alur edit proyek:
  Klik "Edit" → view = 'form', editing = proyek
  Ubah form → Klik "Simpan" → update di array → view = 'list'

Alur hapus proyek:
  Klik "×" → deleteModal = id
  Modal konfirmasi muncul
  Klik "Hapus" → filter proyek → modal tutup
```

**Layout daftar proyek — responsif dua mode:**

Tabel dengan banyak kolom tidak cocok untuk mobile karena overflow horizontal. Solusinya adalah merender dua layout berbeda dalam satu komponen, dikontrol oleh Tailwind breakpoint:

```tsx
{/* Mobile: card layout — hanya tampil di bawah md */}
<div className="flex items-start gap-3 md:hidden">
  <img ... />                     {/* thumbnail kecil */}
  <div>
    <p>{p.title}</p>              {/* judul + status dalam satu baris */}
    <p>{p.category} · {p.updatedAt}</p>
    <div>Edit | Hapus</div>       {/* aksi teks biasa */}
  </div>
</div>

{/* Desktop: row grid — hanya tampil di md ke atas */}
<div className="hidden md:grid" style={{ gridTemplateColumns: '40px 1fr 120px 90px 100px 60px' }}>
  {/* thumbnail | judul | kategori | status | tanggal | aksi */}
</div>
```

Kedua layout ada di DOM bersamaan — CSS breakpoint yang menentukan mana yang tampil. Tidak ada JavaScript untuk deteksi ukuran layar.

### CRUD Pengalaman (`/admin/experience`)

Sama dengan proyek, tapi field disesuaikan:
- Organisasi, Posisi, Tipe (Education/Work/Freelance/Project)
- Tanggal mulai & selesai
- Deskripsi & teknologi

### CRUD Kemampuan (`/admin/skills`)

- Skills dikelompokkan per kategori: Desain, Bangun, Visual
- Tambah skill baru dengan nama + pilih kategori
- Hapus skill dengan tombol ×

### Tentang Admin (`/admin/about`)

Form untuk mengedit semua konten halaman `/about`:
- Headline, biografi, perkenalan singkat
- Lokasi, pendidikan, status ketersediaan (toggle)
- Link sosial media

### Media Library (`/admin/media`)

- Grid gambar dengan aspek rasio 16:9
- Klik gambar → panel detail muncul
- Fitur: Copy URL, Hapus
- Di mobile: panel muncul full-width di bagian bawah layar

### Pesan (`/admin/messages`)

- Split-pane: daftar pesan (kiri) + detail pesan (kanan)
- Di mobile: stack vertikal (list atas, detail bawah)
- Indikator titik hitam untuk pesan belum dibaca
- Aksi: Tandai dibaca, Hapus, Balas via Email

### Pengaturan (`/admin/settings`)

- Judul situs, tagline, meta description
- Toggle ketersediaan magang
- Email kontak

---

## Autentikasi

### Cara Kerja

```tsx
// AuthContext.tsx
const login = (email, password) => {
  if (email === 'admin@portfolio.id' && password === 'admin123') {
    localStorage.setItem('admin_auth', 'true')
    setIsAuthenticated(true)
    return true
  }
  return false
}
```

Status login disimpan di `localStorage` sehingga tidak hilang saat tab di-refresh. Saat browser ditutup dan dibuka kembali, pengguna tetap login.

Logout menghapus key dari localStorage:
```tsx
const logout = () => {
  localStorage.removeItem('admin_auth')
  setIsAuthenticated(false)
}
```

### Keterbatasan Keamanan

> ⚠️ Autentikasi ini bersifat **frontend-only** dan cocok hanya untuk demo/portfolio.

- Password dapat dilihat di source code browser (DevTools → Sources)
- Tidak ada enkripsi, tidak ada token, tidak ada sesi server
- Siapa pun yang tahu kredensialnya bisa login

Untuk keamanan produksi, lihat [Pengembangan Lanjutan](#pengembangan-lanjutan).

---

## Alur Data

### Kondisi Saat Ini (Statis)

```
mockData.ts (sumber data statis)
    │
    ▼
React useState (data di-copy ke state saat komponen mount)
    │
    ├──▶ Halaman Publik: membaca data langsung, tidak bisa mengubah
    │
    └──▶ Halaman Admin: bisa mengubah state lokal
              │
              └──▶ Perubahan HILANG saat halaman di-refresh
                   karena tidak ada koneksi ke database
```

### Database Awal (Supabase)

Database sekarang disiapkan di `supabase/schema.sql` dan `supabase/seed.sql`.

- `profiles` menyimpan profil owner untuk beranda, tentang, dan footer
- `site_settings` menyimpan judul situs, tagline, meta description, dan email kontak
- `projects` menyimpan data karya, termasuk slug, status, featured flag, tools, tags, dan konten studi kasus
- `project_gallery` menyimpan gambar galeri per proyek
- `experience` menyimpan pengalaman dan pendidikan
- `skills` menyimpan daftar kemampuan per kategori
- `messages` menyimpan pesan masuk dari form kontak

Helper Supabase ada di `src/lib/supabase.ts` dan membaca `VITE_SUPABASE_URL` serta `VITE_SUPABASE_ANON_KEY` dari environment.

Saat ini UI masih membaca `mockData.ts`; schema ini menjadi dasar migrasi ke database sebelum layer CRUD diubah.

### Contoh Alur Edit Proyek

```
1. AdminProjects mount
   → useState diisi dari mockData.projects

2. User klik "Edit" pada proyek A
   → editing = proyek A
   → view = 'form'

3. User ubah judul → Klik "Simpan"
   → setProjects(prev => prev.map(p =>
       p.id === editing.id ? { ...p, ...formData } : p
     ))
   → view = 'list'

4. Perubahan tampil di UI ✅
5. User refresh halaman → data kembali ke mockData ❌
```

---

## Deploy & Hosting

### Build untuk Produksi

```bash
# Install dependensi
pnpm install

# Build aplikasi
pnpm run build
# → Menghasilkan folder dist/ berisi file statis

# Preview hasil build secara lokal
pnpm run preview
```

### Platform Hosting yang Direkomendasikan

| Platform | Cara Deploy | Keunggulan |
|---|---|---|
| **Vercel** | Connect GitHub repo, otomatis deploy | Paling mudah, zero-config untuk Vite |
| **Netlify** | Drag & drop folder `dist/` | Mudah, ada form handling gratis |
| **Cloudflare Pages** | Connect GitHub repo | Performa edge network terbaik |
| **GitHub Pages** | Push ke branch `gh-pages` | Gratis, tapi perlu konfigurasi base URL |

### Langkah Deploy ke Vercel

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# Atau: push ke GitHub dan connect repo di vercel.com
```

### Konfigurasi Penting untuk SPA

Karena ini Single Page Application dengan client-side routing, server perlu dikonfigurasi agar semua URL dikembalikan ke `index.html`. Buat file berikut:

**Untuk Netlify** — buat file `public/_redirects`:
```
/*  /index.html  200
```

**Untuk Vercel** — sudah otomatis terdeteksi sebagai Vite project.

---

## Pengembangan Lanjutan

### 1. Persistensi Data dengan Supabase

Supabase adalah alternatif Firebase open-source dengan PostgreSQL.

```bash
pnpm add @supabase/supabase-js
```

```tsx
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Contoh: ambil proyek dari database
const { data: projects } = await supabase
  .from('projects')
  .select('*')
  .eq('status', 'published')
```

### 2. Autentikasi Aman dengan Supabase Auth

```tsx
// Login dengan Supabase Auth
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@portfolio.id',
  password: 'password_aman_di_server'
})

// Cek session
const { data: { session } } = await supabase.auth.getSession()
```

Dengan ini, password tidak pernah ada di frontend.

### 3. Form Kontak dengan EmailJS

```bash
pnpm add @emailjs/browser
```

```tsx
import emailjs from '@emailjs/browser'

const handleSubmit = async (e) => {
  e.preventDefault()
  await emailjs.send(
    'SERVICE_ID',
    'TEMPLATE_ID',
    { name: form.name, email: form.email, message: form.message },
    'PUBLIC_KEY'
  )
  setSent(true)
}
```

### 4. Upload Gambar dengan Supabase Storage

```tsx
const uploadImage = async (file: File) => {
  const { data } = await supabase.storage
    .from('portfolio-images')
    .upload(`covers/${file.name}`, file)

  const { data: { publicUrl } } = supabase.storage
    .from('portfolio-images')
    .getPublicUrl(data.path)

  return publicUrl
}
```

### 5. Animasi Transisi Halaman

Tambahkan Framer Motion untuk transisi antar halaman yang smooth:

```bash
pnpm add framer-motion
```

```tsx
import { motion } from 'framer-motion'

// Bungkus konten halaman
<motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.35 }}
>
  {children}
</motion.div>
```

---

## Scripts yang Tersedia

```bash
pnpm run dev      # Jalankan development server (port 8443)
pnpm run build    # Build untuk produksi → folder dist/
pnpm run preview  # Preview hasil build secara lokal
```

---

## Catatan Pengembang

- Semua perubahan data di admin bersifat sementara (hilang saat refresh). Untuk produksi nyata, hubungkan ke Supabase atau Firebase.
- Foto menggunakan URL Unsplash publik. Untuk produksi, upload gambar sendiri ke Supabase Storage atau Cloudinary.
- Kredensial admin (`admin@portfolio.id` / `admin123`) hanya untuk demo. Ganti dengan autentikasi server-side sebelum digunakan di produksi.
- Semua teks berbahasa Indonesia di UI publik, dengan istilah teknis tetap dalam bahasa Inggris.

---

*Dokumen ini dibuat sebagai bagian dari proyek portfolio.*
*Terakhir diperbarui: Agustus 2026 — mencakup hero photo, navbar Beranda, fix sidebar admin, dan layout responsif Projects.*
