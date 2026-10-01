-- ==============================================================================
-- SEED DATA SUPABASE: MUHAMMAD AZIZI ABDILLAH PORTFOLIO
-- ==============================================================================

-- 1. PROFILES
insert into public.profiles (id, display_name, title, intro, email, location, availability, portrait_url)
values
  (
    '00000000-0000-0000-0000-000000000001',
    'Muhammad Azizi Abdillah',
    'Mahasiswa Informatika | UI/UX & Front-End',
    'Menikmati setiap proses, tumbuh dari setiap tantangan, dan berkarya dengan penuh antusias.',
    'izzi.azizi29@gmail.com',
    'Yogyakarta, Indonesia',
    'open',
    '{"home":"https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1786268953212-g7tu9z7.webp","about":"https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1786427958283-qnyi4uo.webp"}'
  )
on conflict (id) do update set
  display_name = excluded.display_name,
  title = excluded.title,
  intro = excluded.intro,
  email = excluded.email,
  location = excluded.location,
  availability = excluded.availability,
  portrait_url = excluded.portrait_url,
  updated_at = now();

-- 2. SITE SETTINGS
insert into public.site_settings (id, site_title, site_tagline, meta_description, open_internship, contact_email)
values
  (
    1,
    'Portfolio',
    'Crafting Digital Products with Joy.',
    'Portofolio UI/UX Designer & Front-End Developer Muhammad Azizi Abdillah. Mahasiswa Informatika UNU Yogyakarta.',
    true,
    'izzi.azizi29@gmail.com'
  )
on conflict (id) do update set
  site_title = excluded.site_title,
  site_tagline = excluded.site_tagline,
  meta_description = excluded.meta_description,
  open_internship = excluded.open_internship,
  contact_email = excluded.contact_email,
  updated_at = now();

-- 3. PROJECTS
insert into public.projects (
  id, sort_order, slug, title, subtitle, description, category, subcategory, year, role,
  tools, tags, status, featured, cover_url, overview, problem, result,
  github_url, live_url, figma_url, video_url, instagram_url, drive_url, sections
)
values
  (
    '6eaeb218-5f69-44a1-90de-58bc84ecdacd',
    1,
    'nataartha-finance-app',
    'NataArtha',
    'Personal Finance Tracker & Management App',
    'Aplikasi pelacak keuangan cerdas untuk mengelola arus kas harian, memantau alokasi budget, dan menganalisis tren pengeluaran dengan visualisasi data interaktif bertema dark luxury.',
    'Engineering & Tech',
    'Mobile Application',
    '2026',
    'Mobile App Developer & UI/UX Designer',
    array['React Native', 'Expo SDK 54', 'Firebase Authentication', 'Cloud Firestore', 'React Navigation v7', 'React Native SVG', 'AsyncStorage', 'JavaScript'],
    array['Mobile App Development', 'Mobile App', 'React Native', 'Firebase', 'Personal Finance', 'Fintech', 'Data Visualization', 'Dark Mode', 'UI/UX'],
    'published',
    true,
    'https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787375108485-0bdkd4j.webp',
    'NataArtha (berasal dari kata Nata yang berarti menata/mengatur dan Artha yang berarti uang/keuangan) adalah aplikasi mobile manajemen keuangan pribadi yang dirancang untuk mempermudah mahasiswa dan profesional muda dalam mengontrol arus kas (cash flow). Aplikasi ini mengatasi problem pencatatan manual yang lambat dan antarmuka aplikasi keuangan yang kaku dengan menghadirkan pengalaman visual dark luxury yang elegan serta alur pencatatan transaksi kilat.',
    '- Pencatatan Cepat & Tanpa Hambatan: Pengguna sering malas mencatat transaksi karena proses formulir yang rumit. Solusinya dirancang form satu layar terintegrasi dengan custom calendar picker dan pemilihan kategori berbasis ikon instan.
- Ketergantungan Jaringan (Offline-Resilience): Mengimplementasikan antrean penyimpanan lokal berbasis AsyncStorage (@nataartha:pending_transactions) yang secara otomatis melakukan sinkronisasi dengan Cloud Firestore saat koneksi internet kembali online.
- Visualisasi Data Ringan & Responsif: Mengembangkan komponen grafik analitik kustom berbasis React Native SVG (Bézier Line Chart, Donut Breakdown, dan Rasio Tabungan) untuk performa rendering yang mulus tanpa lag.
- Arsitektur Komponen Modular: Membangun struktur clean architecture dengan pemisahan context auth, layanan API Firebase terisolasi, serta komponen UI reusable.',
    '- Interactive Financial Dashboard: Menampilkan total saldo riil, pemasukan, pengeluaran, serta persentase savings rate dengan filter rentang waktu dinamis (1 Bulan, 3 Bulan, 6 Bulan, 1 Tahun).
- Custom Visual Analytics Engine: Grafik tren arus kas harian dan diagram proporsi pengeluaran per kategori (Makanan, Tagihan, Transportasi, Pendidikan, Hiburan, Belanja, dan lainnya).
- Quick Transaction Entry: Input transaksi cepat dengan validasi nominal otomatis, pemilih tanggal kalender kustom, kategori visual, dan catatan tambahan.
- Smart History & Filtering: Riwayat transaksi lengkap dengan penyaringan cerdas berdasarkan jenis (Income/Expense), kategori, rentang tanggal, serta fitur pencarian instan.
- Secure Multi-Device Authentication: Autentikasi aman berbasis Firebase Auth yang terisolasi per akun pengguna dengan sinkronisasi data cloud real-time.',
    'https://github.com/mazizi29/NataArtha',
    'https://nataartha.netlify.app/',
    '',
    '',
    '',
    '',
    '[]'::jsonb
  ),
  (
    'f9e5e929-27ef-4aad-bad3-3959abf6ad4b',
    2,
    'dea-digital-forensic-automation',
    'DEA (Digital Evidence Automation)',
    'Digital Forensics CLI & AI-Assisted Reporting Engine',
    'Sistem orkestrasi otomatisasi investigasi digital forensik berbasis Python yang mengintegrasikan ExifTool, Tesseract OCR, The Sleuth Kit, dan AI Explanation Engine untuk menghasilkan laporan investigasi PDF standar akademik secara instan dengan jaminan integritas bukti 100% (read-only).',
    'Engineering & Tech',
    'System Automation',
    '2026',
    'System Architect & Python Backend Developer',
    array['Python', 'Typer', 'Rich', 'ReportLab', 'Google Gemini API', 'Ollama', 'ExifTool', 'Tesseract OCR', 'The Sleuth Kit (TSK)', 'OpenCV', 'Pillow', 'Git'],
    array['System Automation', 'Python', 'CLI Automation', 'Cybersecurity', 'AI / LLM', 'ReportLab', 'Systems Architecture', 'Data Integrity'],
    'published',
    true,
    'https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787335244108-y1wkhig.webp',
    'DEA (Digital Evidence Automation / Digital Forensic Investigation Automation System) adalah sistem orkestrasi investigasi digital forensik yang dirancang untuk mengotomatisasi alur kerja analisis bukti digital secara end-to-end. Dalam praktiknya, investigasi digital forensik sering kali melibatkan proses berulang (repetitif), penggunaan berbagai command-line tools terpisah yang terisolasi (siloed tools), serta penyusunan laporan formal yang memakan waktu dan rentan human error.

Proyek ini dibangun sebagai solusi automasi terpusat yang membaca berkas barang bukti (gambar, dokumen PDF, hingga disk image .dd/.E01), mengeksekusi tools forensik standar industri (ExifTool, Tesseract OCR, The Sleuth Kit), memvalidasi integritas data bit-per-bit (MD5 & SHA256), serta memanfaatkan AI Explanation Engine (Google Gemini & Local Ollama Llama-3.2) yang dilengkapi Strict Guardrails untuk menyusun laporan akademik siap uji dalam format PDF profesional menggunakan ReportLab.',
    '- Jaminan Integritas Bukti (Chain of Custody & Immutability): Bukti digital sangat rapuh. Kesalahan kecil dalam proses pembacaan file dapat merusak timestamp atau metadata asli. Sistem harus memproses seluruh bukti secara strictly read-only serta menghitung nilai hash ganda (MD5 & SHA256) sebelum dan sesudah eksekusi.
- Fragmentasi Alat Forensik: Analis forensik biasanya harus menjalankan ExifTool untuk metadata, Tesseract untuk OCR teks pada tangkapan layar, dan The Sleuth Kit untuk partisi disk image secara manual, lalu merekap hasilnya satu per satu.
- Tantangan Halusinasi AI pada Domain Hukum/Forensik: Mengintegrasikan LLM untuk membantu penulisan narasi laporan berisiko fatal jika AI berhalusinasi, menambahkan fakta fiktif, atau membuat spekulasi/kesimpulan tendensius (seperti menetapkan tersangka/motif).
- Kompleksitas Laporan PDF Dinamis: Menyusun laporan teknis yang mencakup tabel metadata, visualisasi timeline, preview bukti, serta rekap statistik secara otomatis dan terstruktur rapi sesuai standar akademik forensik.

Solusi yang Diterapkan:
1. Mengembangkan arsitektur modular (Evidence Detector, Forensic Runner, Case Manager) dengan mekanisme subprocess wrapper yang aman dan non-destruktif.
2. Menerapkan Two-Tier Explanation Architecture: Draf faktual murni (Rule-Based) dihasilkan terlebih dahulu sebagai ground truth, kemudian AI hanya bertindak sebagai Technical Writing Assistant (PUEBI formal) tanpa izin menambah/mengurangi fakta teknis.
3. Menyediakan sistem Automatic Fallback: Jika API AI offline atau gagal validasi keamanan, sistem otomatis beralih ke narasi Rule-Based Engine.',
    '- Efisiensi Waktu Signifikan: Memangkas waktu investigasi dan penyusunan laporan komprehensif dari yang biasanya memakan waktu berjam-jam menjadi hitungan detik secara otomatis.
- Kepatuhan Standar Forensik 100%: Berhasil mempertahankan integritas hash berkas bukti digital tanpa modifikasi Modified Date/Access Date pada sistem operasi.
- Laporan Otomatis Siap Uji: Menghasilkan dokumen PDF multi-halaman berstandar akademik yang mencakup Executive Summary, Chain of Custody, Metadata Deep-Dive, OCR Transcript, Disk Partition Map, hingga Summary of Findings.
- Antarmuka CLI Modern & Interaktif: Menggunakan Typer dan Rich untuk memberikan visualisasi proses, tabel interaktif, dan status inspeksi yang bersih di terminal.
- Pembelajaran Utama: Memperdalam pemahaman tentang prinsip legal digital forensik, manipulasi proses I/O tingkat rendah (low-level subprocess handling), pembuatan engine dokumen dinamis dengan ReportLab, serta penerapan Prompt Engineering berdisiplin tinggi (Defensive AI Prompting) untuk mencegah halusinasi data teknis.',
    'https://github.com/mazizi29/DEA',
    '',
    '',
    '',
    '',
    '',
    '[]'::jsonb
  ),
  (
    'aea9eb66-326c-43c9-a196-96e926d3ee26',
    3,
    'rekapan-uiux-app',
    'Rekapan',
    'UMKM Financial & Inventory Management App',
    'Desain antarmuka aplikasi mobile yang dirancang khusus untuk mempermudah pelaku UMKM dalam mencatat arus kas keuangan harian, memonitor ketersediaan stok barang, serta memantau kesehatan bisnis secara praktis dan intuitif.',
    'UI/UX & Product Design',
    'Mobile App Design',
    '2026',
    'UI/UX Designer & Product Researcher',
    array['Figma', 'Design System', 'Mobile UI Design', 'User Flow', 'Wireframing', 'Interactive Prototyping'],
    array['UI/UX', 'Mobile App', 'Fintech', 'Inventory', 'MSME Solution', 'Design System', 'Product Design'],
    'published',
    true,
    'https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787394730783-86nu685.webp',
    '- **Latar Belakang:** Banyak pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) di Indonesia masih mengandalkan pencatatan pembukuan keuangan dan stok barang secara manual di buku tulis kertas. Metode ini rentan terhadap kesalahan hitung, risiko kehilangan data, serta menyulitkan evaluasi keuntungan bisnis secara real-time.
- **Tujuan Desain:** Merancang pengalaman aplikasi mobile bernama Rekapan yang ramah pengguna awam, efisien, dan menghilangkan kompleksitas akuntansi tradisional.
- **Visi Produk:** Memberdayakan pemilik usaha warung, toko kelontong, dan jasa kuliner agar dapat mencatat keuangan, mengelola stok barang, dan memantau perkembangan bisnis dalam satu genggaman tangan.',
    '- Pencatatan yang Memakan Waktu: Pedagang sering kali terlalu sibuk melayani pelanggan sehingga menunda atau lupa mencatat transaksi masuk dan keluar saat jam sibuk.
- Kekhawatiran Stok Habis Tiba-tiba: Tidak adanya sistem peringatan dini ketika stok barang dagangan yang laris mendekati batas kritis atau habis.
- Keengganan terhadap Aplikasi Rumit: Pemilik usaha mikro enggan memakai software akuntansi perbankan yang rumit dan dipenuhi istilah teknis yang membingungkan.
- Kebutuhan Input Cepat: Antarmuka harus mengutamakan kecepatan pencatatan transaksi dalam kurang dari 3 langkah sentuhan di layar ponsel.',
    '- Dashboard Saldo & Arus Kas: Menghadirkan kartu saldo utama yang besar dengan visualisasi ringkas antara total pemasukan hijau dan pengeluaran merah.
- Tombol Aksi Cepat (Floating Action Button): Meletakkan tombol koin melayang di tengah navigasi bawah untuk input transaksi kilat tanpa harus berpindah halaman.
- Manajemen Stok Berbasis Indikator Warna:
  1. Tersedia (Badge Hijau): Kuantitas stok dalam batas aman operasional.
  2. Hampir Habis (Badge Kuning): Peringatan otomatis saat stok menyentuh batas minimum.
  3. Habis (Badge Merah): Notifikasi visual agar pemilik segera melakukan pembelian ulang.
- Fleksibilitas Metode Pembayaran: Mendukung pencatatan transaksi Tunai, Transfer Bank, hingga QRIS.',
    '',
    '',
    'https://www.figma.com/proto/PcQc6ino5Jak3tweSGDyLG/UI-UX-DESIGN--86?node-id=86-14&p=f&t=6EYqs5dB5cQJOU2x-1&scaling=scale-down&content-scaling=fixed&page-id=83%3A2&starting-point-node-id=86%3A14',
    '',
    '',
    '',
    '[]'::jsonb
  ),
  (
    'e117ac2f-bc5f-4d33-a946-cbc32d8578eb',
    4,
    'desain-identitas-visual',
    'Koleksi Identitas Visual & Logo',
    'Brand Guidelines & Visual Identity Systems Collection',
    'Koleksi perancangan identitas visual, perancangan logo institusi/komunitas, dan pedoman tata visual (brand guidelines) yang memadukan filosofi makna dengan kesederhanaan bentuk modern.',
    'Creative & Multimedia',
    'Visual Identity & Logo',
    '2025-2026',
    'Brand Designer & Graphic Specialist',
    array['Adobe Illustrator', 'Paper Sketching', 'Figma'],
    array['Visual Identity & Logo', 'Branding', 'Visual Identity', 'Logo Design', 'Typography'],
    'published',
    true,
    'https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787407481430-xlo9c01.webp',
    'Perancangan identitas visual dan logo untuk berbagai entitas, komunitas, dan produk digital.',
    'Tantangan dalam memadukan nilai filosofis organisasi ke dalam bentuk logo yang sederhana, mudah diingat, dan aplikatif di berbagai media cetak maupun digital.',
    'Tersusunnya sistem identitas visual yang solid, mencakup filosofi bentuk, palet warna, tipografi, dan panduan penggunaan logo.',
    '',
    '',
    '',
    '',
    '',
    '',
    '[]'::jsonb
  ),
  (
    '3704d818-87c1-4385-b351-267a7fa1fa38',
    5,
    'sosial-media-post-feeds',
    'Social Media Visuals & Feeds',
    'Editorial Feeds, Event Posters & Digital Campaign Systems',
    'Koleksi perancangan konten media sosial, publikasi kegiatan, dan kampanye visual digital untuk institusi pendidikan, organisasi pemuda, komunitas teknologi, dan entitas kuliner. Dirancang dengan komposisi tipografi yang kuat, hierarki informasi yang terarah, serta estetika visual yang relevan dengan target audiens.',
    'Creative & Multimedia',
    'Social Media & Content Design',
    '2024 - 2026',
    'Graphic Designer & Content Strategist',
    array['Adobe Illustrator', 'Adobe Photoshop', 'Figma'],
    array['Social Media & Content Design', 'Social Media', 'Graphic Design', 'Poster Design', 'Campaign', 'Content Strategy'],
    'published',
    true,
    'https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787413535180-av8h31i.webp',
    'Perancangan konten media sosial multi-platform dengan pendekatan desain editorial dan komunikasi visual yang efektif.',
    'Menyampaikan pesan yang padat dan informatif dalam batasan format feed/story media sosial tanpa mengurangi estetika dan keterbacaan.',
    'Peningkatan engagement audiens dan konsistensi visual feed pada akun-akun yang dikelola.',
    '',
    '',
    '',
    '',
    '',
    '',
    '[]'::jsonb
  ),
  (
    'd1f43382-453c-405e-a3e8-6c1d4cbf8568',
    6,
    'bts-ep4-mental-anak-rapuh',
    'Bakat Talks Series (BTS)',
    'Educational Parenting & K-12 Podcast Video',
    'Bakat Talks Series dari Halobakat TV bersama Bunda Rika. Membahas realita pendidikan K-12, peran support system, serta pentingnya pembentukan karakter dan kesehatan mental anak di tengah tuntutan akademis.',
    'Creative & Multimedia',
    'Video Production & Editing',
    '2026',
    'Creative Producer & Video Editor',
    array['Adobe Premier Pro', 'YouTube', 'Huly'],
    array['Commercial Videography', 'Podcast', 'Edukasi', 'Parenting', 'Mental Health', 'Character Building'],
    'published',
    true,
    'https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787380938782-sqj47re.webp',
    '- Mengangkat isu sosial dan tantangan edukasi sistem pendidikan K-12 (TK hingga SMA) pasca-pandemi yang relevan bagi banyak keluarga.
- Pesan utama berfokus pada pentingnya kolaborasi guru dan orang tua, serta penyadaran bahwa nilai akademis tinggi tidak akan bertahan lama jika anak tidak dibekali mental yang sehat, daya juang (adversity quotient), dan karakter kuat (seperti tanggung jawab, kejujuran, dll).
- Dibawakan melalui diskusi kasual dan interaktif antara dua host (Syakban & Safa) bersama praktisi dan pengelola pendidikan berpengalaman 25+ tahun, Bunda Rika.',
    '- Format acara bincang santai (Talkshow/Podcast) berdurasi kurang lebih 57 menit.
- Produksi dilakukan di dalam ruangan dengan set-up obrolan yang nyaman agar pemaparan narasumber terasa hangat dan mendalam.',
    '- Episode ini dipublikasikan pada akhir Juni 2026 di kanal YouTube Halobakat TV, menyasar audiens orang tua, guru, hingga remaja agar memiliki refleksi baru dalam memaknai pendidikan.',
    '',
    'https://www.youtube.com/watch?v=Td6xYN8Ep7k&t=170s&pp=ygUTaGFsb2Jha2F0IGluZG9uZXNpYQ%3D%3D',
    '',
    'https://www.youtube.com/watch?v=Td6xYN8Ep7k&t=170s&pp=ygUTaGFsb2Jha2F0IGluZG9uZXNpYQ%3D%3D',
    '',
    '',
    '[]'::jsonb
  ),
  (
    '5c0feaa5-eb07-42f9-98b2-234eb654f367',
    7,
    'video-profil-kelurahan-kepil-kpm-unsiq-2025',
    'Video Profil Kelurahan Kepil',
    'Community Documentary & Village Profile Video',
    'Video profil Kelurahan Kepil hasil karya KPM Kelompok 20 UNSIQ. Menyoroti pesona alam, komoditas unggulan, UMKM madu lokal, hingga budaya kebersamaan warga.',
    'Creative & Multimedia',
    'Video Production & Editing',
    '2026',
    'Director of Photography (DoP) & Video Editor',
    array['DJI Drone', 'Mobile Cinema Rig', 'Wireless Audio System', 'CapCut Pro'],
    array['Commercial Videography', 'Video Profil', 'Dokumenter', 'KPM UNSIQ', 'Kelurahan Kepil', 'Wonosobo', 'UMKM'],
    'published',
    true,
    'https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787382131991-x91v803.webp',
    '- Proyek video profil dokumenter ini dikerjakan sebagai bagian dari program KPM (Kuliah Pengabdian Masyarakat) Kelompok 20 UNSIQ tahun 2025 di Kelurahan Kepil.
- Mengangkat storyline tentang keharmonisan sosial dan pesona alam, mencakup luas wilayah 6,47 km² dengan 6.074 jiwa warga.
- Fokus konten menyoroti komoditas lokal (kelapa, durian, duku), potensi industri kayu, produk unggulan UMKM madu lokal, fasilitas pendidikan/keagamaan, hingga tradisi budaya dan festival layang-layang lokal.',
    'Pengambilan gambar (syuting) dilakukan di berbagai point of interest Kelurahan Kepil. Mencakup pengambilan video lanskap udara (drone), wawancara dengan pengelola UMKM madu, liputan aktivitas pendidikan/pengajian rutin warga, dan sambutan resmi dari Kepala Kelurahan Kepil, Bapak Herul Sunadi.',
    'Proses editing berfokus pada penyajian visual yang sinematik dengan iringan voice over informatif dan backsound inspiratif. Pengaturan color grading dilakukan untuk memunculkan kehangatan aktivitas sosial warga dan keindahan alam.',
    '',
    'https://www.youtube.com/watch?v=rGq-UYb1Wpk&t=70s&pp=ygURcHJvZmlsIGRlc2Ega2VwaWw%3D',
    '',
    'https://www.youtube.com/watch?v=rGq-UYb1Wpk&t=70s&pp=ygURcHJvZmlsIGRlc2Ega2VwaWw%3D',
    '',
    '',
    '[]'::jsonb
  ),
  (
    'bbef649c-3d45-4b03-87ea-05e6082c2ad4',
    8,
    'fotografi-dokumentasi-visual',
    'Fotografi & Dokumentasi Visual',
    'Visual Storytelling & Commercial Photography',
    'Koleksi fotografi komersial, dokumentasi acara berskala besar, potret human interest, dan visual editorial yang mengabadikan momen autentik melalui penguasaan pencahayaan dan komposisi dinamis.',
    'Creative & Multimedia',
    'Commercial Photography',
    '2026',
    'Lead Photographer & Colorist',
    array['Sony Alpha Series', 'Prime & Zoom Lenses', 'Adobe Lightroom Classic', 'Adobe Photoshop'],
    array['Commercial Photography', 'Visual Storytelling', 'Event Documentation', 'Human Interest', 'Lightroom Color Grading', 'Portraiture'],
    'published',
    false,
    'https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787539497504-k2hhlw1.webp',
    'Kompilasi karya fotografi dan dokumentasi visual yang mencakup berbagai spektrum kebutuhan visual—mulai dari eksplorasi human interest bernuansa spiritual, potret wisuda & arsitektur, dokumentasi panggung acara berskala besar, hingga fotografi malam hari (urban long exposure). Setiap bidikan dirancang dengan kepekaan komposisi, pemanfaatan cahaya alami maupun buatan, dan kejelian menangkap decisive moment yang autentik.',
    '- Pengendalian Cahaya Dinamis: Menghadapi kondisi pencahayaan yang sangat bervariasi, mulai dari pencahayaan kontras tinggi di panggung acara (stage lighting), cahaya senja yang cepat memudar (golden hour), hingga situasi minim cahaya (low light) di malam hari tanpa merusak naturalitas warna.
- Komposisi & Storytelling Visual: Menangkap interaksi manusia dan suasana sakral tanpa menginterupsi jalannya ritual atau acara, memanfaatkan teknik framing arsitektural dan slow shutter untuk menghadirkan dinamika visual.
- Konsistensi Color Grading: Mengolah berkas RAW secara konsisten agar setiap seri foto memiliki mood, tonalitas warna, dan kedalaman karakter visual yang matang serta elegan.',
    '- Galeri Dokumentasi Multi-Disiplin: Menghasilkan koleksi 8 karya visual unggulan beresolusi tinggi dengan narasi cerita yang kuat dan estetika sinematik.
- Penguasaan Pasca-Produksi: Penerapan color grading kustom di Adobe Lightroom Classic dengan kalibrasi kurva warna warm-earthy yang memberikan kesan hangat, timeless, dan profesional.
- Portofolio Visual yang Komprehensif: Memperkaya kapabilitas visual Layar Putih Creative Studio dalam melayani kebutuhan dokumentasi instansi, media sosial, profil komersial, maupun karya seni fotografi independen.',
    '',
    '',
    '',
    '',
    '',
    '',
    '[]'::jsonb
  )
on conflict (slug) do update set
  sort_order = excluded.sort_order,
  title = excluded.title,
  subtitle = excluded.subtitle,
  description = excluded.description,
  category = excluded.category,
  subcategory = excluded.subcategory,
  year = excluded.year,
  role = excluded.role,
  tools = excluded.tools,
  tags = excluded.tags,
  status = excluded.status,
  featured = excluded.featured,
  cover_url = excluded.cover_url,
  overview = excluded.overview,
  problem = excluded.problem,
  result = excluded.result,
  github_url = excluded.github_url,
  live_url = excluded.live_url,
  figma_url = excluded.figma_url,
  video_url = excluded.video_url,
  instagram_url = excluded.instagram_url,
  drive_url = excluded.drive_url,
  sections = excluded.sections,
  updated_at = now();

-- 4. PROJECT GALLERY ITEMS (Fotografi)
insert into public.project_gallery (id, project_id, image_url, title, caption, sort_order)
values
  (
    'a0000001-0000-0000-0000-000000000001',
    'bbef649c-3d45-4b03-87ea-05e6082c2ad4',
    'https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787539497504-k2hhlw1.webp',
    'The Stillness in Motion (Ketenangan dalam Dinamika)',
    'Eksplorasi teknik slow shutter yang membekukan kekhusyukan seorang santri mendaras Al-Qur''an di tengah dinamika figur orang yang berlalu-lalang dengan efek motion blur.',
    1
  ),
  (
    'a0000001-0000-0000-0000-000000000002',
    'bbef649c-3d45-4b03-87ea-05e6082c2ad4',
    'https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787539498567-lvofybt.webp',
    'Halaqah: Di Bawah Cahaya Pengetahuan',
    'Komposisi simetris yang menangkap momen sorogan dan halaqah santri di depan jendela berarsitektur klasik dengan rim lighting alami yang elegan.',
    2
  ),
  (
    'a0000001-0000-0000-0000-000000000003',
    'bbef649c-3d45-4b03-87ea-05e6082c2ad4',
    'https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787539499277-5htzm85.webp',
    'Keadilan dalam Bingkai: Wisuda FH UGM',
    'Potret wisudawan dengan teknik foreground framing geometris yang mensejajarkan subjek dengan patung Dewi Keadilan di Fakultas Hukum UGM.',
    3
  ),
  (
    'a0000001-0000-0000-0000-000000000004',
    'bbef649c-3d45-4b03-87ea-05e6082c2ad4',
    'https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787539499591-q5ri7i0.webp',
    'Dokumentasi Khidmat: Upacara & Stage Performance',
    'Dokumentasi panggung dengan high dynamic range yang menangkap momen khidmat penghormatan bendera di auditorium utama.',
    4
  ),
  (
    'a0000001-0000-0000-0000-000000000005',
    'bbef649c-3d45-4b03-87ea-05e6082c2ad4',
    'https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787539500241-fc5z3r1.webp',
    'Atmosfer & Spontanitas Audiens',
    'Potret candid interaksi spontan audiens yang menangkap gelak tawa dan ekspresi hangat dengan tone warna warm earthy yang humanis.',
    5
  ),
  (
    'a0000001-0000-0000-0000-000000000006',
    'bbef649c-3d45-4b03-87ea-05e6082c2ad4',
    'https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787539501821-u20fequ.webp',
    'Detail & Simbol Prestasi Akademik',
    'Bidikan detail still life dari buku tesis, selempang kelulusan, dan buket bunga segar dengan shallow depth of field yang tajam dan bertekstur.',
    6
  ),
  (
    'a0000001-0000-0000-0000-000000000007',
    'bbef649c-3d45-4b03-87ea-05e6082c2ad4',
    'https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787539502906-d9cabni.webp',
    'Nadi Kota: Arus Waktu di Tugu Jogja',
    'Fotografi malam hari memanfaatkan teknik long exposure untuk merekam jejak cahaya kendaraan yang mengitari monumen bersejarah Tugu Yogyakarta.',
    7
  ),
  (
    'a0000001-0000-0000-0000-000000000008',
    'bbef649c-3d45-4b03-87ea-05e6082c2ad4',
    'https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787539503271-60bjxfa.webp',
    'Refleksi Senja di Tepian Langit',
    'Potret siluet seseorang membaca di atas atap berlatarkan kubah masjid dan semburat awan keemasan waktu senja (golden hour).',
    8
  )
on conflict (id) do update set
  image_url = excluded.image_url,
  title = excluded.title,
  caption = excluded.caption,
  sort_order = excluded.sort_order;

-- 5. EXPERIENCE
insert into public.experience (id, sort_order, organization, position, type, start_date, end_date, description, skills, status)
values
  (
    'e0000001-0000-0000-0000-000000000001',
    1,
    'SMK Syubbanul Wathon',
    'Multimedia',
    'Education',
    '2020-07-01',
    '2023-06-25',
    'Mempelajari desain grafis, fotografi, videografi, dan editing sebagai dasar produksi konten visual untuk media digital.',
    array['Graphic Design', 'Photography', 'Videography', 'Video Editing'],
    'completed'
  ),
  (
    'e0000001-0000-0000-0000-000000000002',
    8,
    'ESWE TV',
    'Desainer Grafis',
    'Freelance',
    '2021-12-25',
    '2023-01-25',
    'Merancang kebutuhan visual untuk publikasi dan media sosial serta mengolah materi visual melalui proses editing. Berkolaborasi dengan tim produksi untuk menjaga konsistensi visual dan menyesuaikan konten dengan kebutuhan audiens.',
    array['Graphic Design', 'Visual Editing', 'Social Media'],
    'completed'
  ),
  (
    'e0000001-0000-0000-0000-000000000003',
    7,
    'MJTV',
    'Produser',
    'Project',
    '2022-09-01',
    '2022-11-30',
    'Mengembangkan konsep dan alur produksi konten, mengoordinasikan proses produksi, serta memastikan hasil akhir sesuai dengan tujuan dan target audiens.',
    array['Production Management', 'Concept Development', 'Art Direction'],
    'completed'
  ),
  (
    'e0000001-0000-0000-0000-000000000004',
    5,
    'Al Munawwir TV',
    'Koor. Desain Grafis',
    'Freelance',
    '2023-09-01',
    '2025-03-31',
    'Mengoordinasikan tim desain, membagi tugas, dan menjaga konsistensi visual untuk kebutuhan publikasi dan media sosial.',
    array['Team Leadership', 'Brand Consistency', 'Graphic Design'],
    'completed'
  ),
  (
    'e0000001-0000-0000-0000-000000000005',
    2,
    'Universitas Nahdlatul Ulama’ Yogyakarta',
    'Informatika',
    'Education',
    '2023-09-30',
    null,
    'Mempelajari pengembangan perangkat lunak, basis data, pemrograman, UI/UX, dan teknologi web maupun mobile. Mengembangkan berbagai proyek digital melalui proses perancangan, implementasi, dan pengujian.',
    array['UI/UX Design', 'Web Development', 'Mobile Programming', 'Database', 'Software Engineering'],
    'active'
  ),
  (
    'e0000001-0000-0000-0000-000000000006',
    0,
    'Layar Putih Creative Studio',
    'Creative & Visual Media',
    'Work',
    '2025-01-10',
    null,
    'Mengelola berbagai kebutuhan produksi visual, mulai dari desain grafis, fotografi, hingga editing foto dan video. Terlibat dalam proses kreatif dari perencanaan konsep, produksi, hingga penyempurnaan hasil akhir dengan memperhatikan kebutuhan dan tujuan setiap karya.',
    array['Creative Direction', 'Visual Production', 'Photography', 'Video Editing'],
    'active'
  ),
  (
    'e0000001-0000-0000-0000-000000000007',
    6,
    'Al Munawwir TV',
    'Ketua',
    'Freelance',
    '2025-04-01',
    '2025-10-30',
    'Memimpin tim dan mengatur strategi kerja, perencanaan program, serta pelaksanaan produksi media.',
    array['Strategic Planning', 'Team Leadership', 'Media Production'],
    'completed'
  ),
  (
    'e0000001-0000-0000-0000-000000000008',
    3,
    'Halobakat Indonesia',
    'Social Media Specialist',
    'Project',
    '2026-04-01',
    '2026-06-30',
    'Mengelola kebutuhan konten media sosial, mengoordinasikan produksi visual, serta memastikan materi publikasi sesuai dengan identitas dan strategi komunikasi.',
    array['Content Strategy', 'Social Media Management', 'Visual Campaign'],
    'completed'
  ),
  (
    'e0000001-0000-0000-0000-000000000009',
    4,
    'IPNU PAC Mantrijeron',
    'Wakil Ketua',
    'Freelance',
    '2025-01-01',
    null,
    'Mendukung koordinasi organisasi, membantu perencanaan program kerja, serta mengoordinasikan kebutuhan publikasi dan dokumentasi kegiatan.',
    array['Organizational Leadership', 'Program Planning', 'Event Documentation'],
    'active'
  )
on conflict (id) do update set
  sort_order = excluded.sort_order,
  organization = excluded.organization,
  position = excluded.position,
  type = excluded.type,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  description = excluded.description,
  skills = excluded.skills,
  status = excluded.status,
  updated_at = now();

-- 6. SKILLS
insert into public.skills (id, category, name, order_index)
values
  -- Soft Skills (category: 'design')
  ('0fe74b10-fc12-4ef6-9817-2fcc74993058', 'design', 'Problem Solving', 0),
  ('59f5995d-6afe-4c09-b7b5-edc98048e7e0', 'design', 'Berpikir Kritis', 1),
  ('bd241caa-5bca-435c-9343-60ef9d93e335', 'design', 'Komunikasi', 2),
  ('a27a53be-d2ba-4a27-bc0e-b6ea6387d989', 'design', 'Kerja Tim', 3),
  ('2233a3f6-38a2-4bf2-bf2a-7d221e71e9c3', 'design', 'Kepemimpinan', 4),

  -- Hard Skills (category: 'build')
  ('8809f2e7-a856-4b74-b645-547012bf8d9b', 'build', 'UI/UX Design', 0),
  ('86f57b37-f0a2-4bbb-ae61-9b254d6a29c2', 'build', 'Desain Grafis & Visual', 1),
  ('52d0f90e-38c3-42b2-8bad-cae75534b6b7', 'build', 'Fotografi & Pengolahan Media', 2),
  ('14920954-1303-4467-8224-163a147f781e', 'build', 'Pengembangan Web & Aplikasi', 3),
  ('27dd8d71-5506-4b47-8840-2b2f356b08d1', 'build', 'Analisis & Perancangan Sistem', 4),
  ('10fd763b-3f57-4d80-94d4-b919b7a304bf', 'build', 'Basis Data', 5),

  -- Tools / Alat (category: 'visual')
  ('46debc13-a3f7-435f-85bd-302530a484e4', 'visual', 'Figma', 0),
  ('0f4e1565-2de4-43e6-a9cb-3cf3151a252e', 'visual', 'Visual Studio Code', 1),
  ('14793b00-b975-45bf-9581-867bd764a2ba', 'visual', 'Git & GitHub', 2),
  ('e704ca10-cb00-44f0-9e8a-cfad23ae55eb', 'visual', 'Firebase', 3),
  ('6809a6ea-25b6-4ff0-a56f-93a2a6e71322', 'visual', 'Adobe Illustrator', 4),
  ('1612313f-3d1d-47da-bf7e-98e19454eefe', 'visual', 'Adobe Lightroom', 5),
  ('1de94c8d-ee8f-4c31-baac-f8b26ce772f5', 'visual', 'Adobe After Effects', 6)
on conflict (category, name) do update set
  order_index = excluded.order_index,
  updated_at = now();
