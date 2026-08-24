import type { Project } from "@/types/project"

export const projects: Project[] = [
  {
    id: "6eaeb218-5f69-44a1-90de-58bc84ecdacd",
    sort_order: 1,
    slug: "nataartha-finance-app",
    title: "NataArtha",
    subtitle: "Personal Finance Tracker & Management App",
    description:
      "Aplikasi pelacak keuangan cerdas untuk mengelola arus kas harian, memantau alokasi budget, dan menganalisis tren pengeluaran dengan visualisasi data interaktif bertema dark luxury.",
    category: "Engineering & Tech",
    subcategory: "Mobile Application",
    year: "2026",
    role: "Mobile App Developer & UI/UX Designer",
    tools: [
      "React Native",
      "Expo SDK 54",
      "Firebase Authentication",
      "Cloud Firestore",
      "React Navigation v7",
      "React Native SVG",
      "AsyncStorage",
      "JavaScript",
    ],
    tags: [
      "Mobile App Development",
      "Mobile App",
      "React Native",
      "Firebase",
      "Personal Finance",
      "Fintech",
      "Data Visualization",
      "Dark Mode",
      "UI/UX",
    ],
    status: "published",
    featured: true,
    cover_url:
      "https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787375108485-0bdkd4j.webp",
    gallery: [],
    overview:
      "NataArtha (berasal dari kata Nata yang berarti menata/mengatur dan Artha yang berarti uang/keuangan) adalah aplikasi mobile manajemen keuangan pribadi yang dirancang untuk mempermudah mahasiswa dan profesional muda dalam mengontrol arus kas (cash flow). Aplikasi ini mengatasi problem pencatatan manual yang lambat dan antarmuka aplikasi keuangan yang kaku dengan menghadirkan pengalaman visual dark luxury yang elegan serta alur pencatatan transaksi kilat.",
    problem:
      "- Pencatatan Cepat & Tanpa Hambatan: Pengguna sering malas mencatat transaksi karena proses formulir yang rumit. Solusinya dirancang form satu layar terintegrasi dengan custom calendar picker dan pemilihan kategori berbasis ikon instan.\n- Ketergantungan Jaringan (Offline-Resilience): Mengimplementasikan antrean penyimpanan lokal berbasis AsyncStorage (@nataartha:pending_transactions) yang secara otomatis melakukan sinkronisasi dengan Cloud Firestore saat koneksi internet kembali online.\n- Visualisasi Data Ringan & Responsif: Mengembangkan komponen grafik analitik kustom berbasis React Native SVG (Bézier Line Chart, Donut Breakdown, dan Rasio Tabungan) untuk performa rendering yang mulus tanpa lag.\n- Arsitektur Komponen Modular: Membangun struktur clean architecture dengan pemisahan context auth, layanan API Firebase terisolasi, serta komponen UI reusable.",
    result:
      "- Interactive Financial Dashboard: Menampilkan total saldo riil, pemasukan, pengeluaran, serta persentase savings rate dengan filter rentang waktu dinamis (1 Bulan, 3 Bulan, 6 Bulan, 1 Tahun).\n- Custom Visual Analytics Engine: Grafik tren arus kas harian dan diagram proporsi pengeluaran per kategori (Makanan, Tagihan, Transportasi, Pendidikan, Hiburan, Belanja, dan lainnya).\n- Quick Transaction Entry: Input transaksi cepat dengan validasi nominal otomatis, pemilih tanggal kalender kustom, kategori visual, dan catatan tambahan.\n- Smart History & Filtering: Riwayat transaksi lengkap dengan penyaringan cerdas berdasarkan jenis (Income/Expense), kategori, rentang tanggal, serta fitur pencarian instan.\n- Secure Multi-Device Authentication: Autentikasi aman berbasis Firebase Auth yang terisolasi per akun pengguna dengan sinkronisasi data cloud real-time.",
    github_url: "https://github.com/mazizi29/NataArtha",
    live_url: "https://nataartha.netlify.app/",
    created_at: "2026-08-22T05:05:17.791Z",
    updated_at: "2026-08-22T05:05:17.791Z",
  },
  {
    id: "f9e5e929-27ef-4aad-bad3-3959abf6ad4b",
    sort_order: 2,
    slug: "dea-digital-forensic-automation",
    title: "DEA (Digital Evidence Automation)",
    subtitle: "Digital Forensics CLI & AI-Assisted Reporting Engine",
    description:
      "Sistem orkestrasi otomatisasi investigasi digital forensik berbasis Python yang mengintegrasikan ExifTool, Tesseract OCR, The Sleuth Kit, dan AI Explanation Engine untuk menghasilkan laporan investigasi PDF standar akademik secara instan dengan jaminan integritas bukti 100% (read-only).",
    category: "Engineering & Tech",
    subcategory: "System Automation",
    year: "2026",
    role: "System Architect & Python Backend Developer",
    tools: [
      "Python",
      "Typer",
      "Rich",
      "ReportLab",
      "Google Gemini API",
      "Ollama",
      "ExifTool",
      "Tesseract OCR",
      "The Sleuth Kit (TSK)",
      "OpenCV",
      "Pillow",
      "Git",
    ],
    tags: [
      "System Automation",
      "Python",
      "CLI Automation",
      "Cybersecurity",
      "AI / LLM",
      "ReportLab",
      "Systems Architecture",
      "Data Integrity",
    ],
    status: "published",
    featured: true,
    cover_url:
      "https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787335244108-y1wkhig.webp",
    gallery: [],
    overview:
      "DEA (Digital Evidence Automation / Digital Forensic Investigation Automation System) adalah sistem orkestrasi investigasi digital forensik yang dirancang untuk mengotomatisasi alur kerja analisis bukti digital secara end-to-end. Dalam praktiknya, investigasi digital forensik sering kali melibatkan proses berulang (repetitif), penggunaan berbagai command-line tools terpisah yang terisolasi (siloed tools), serta penyusunan laporan formal yang memakan waktu dan rentan human error.\n\nProyek ini dibangun sebagai solusi automasi terpusat yang membaca berkas barang bukti (gambar, dokumen PDF, hingga disk image .dd/.E01), mengeksekusi tools forensik standar industri (ExifTool, Tesseract OCR, The Sleuth Kit), memvalidasi integritas data bit-per-bit (MD5 & SHA256), serta memanfaatkan AI Explanation Engine (Google Gemini & Local Ollama Llama-3.2) yang dilengkapi Strict Guardrails untuk menyusun laporan akademik siap uji dalam format PDF profesional menggunakan ReportLab.",
    problem:
      "- Jaminan Integritas Bukti (Chain of Custody & Immutability): Bukti digital sangat rapuh. Kesalahan kecil dalam proses pembacaan file dapat merusak timestamp atau metadata asli. Sistem harus memproses seluruh bukti secara strictly read-only serta menghitung nilai hash ganda (MD5 & SHA256) sebelum dan sesudah eksekusi.\n- Fragmentasi Alat Forensik: Analis forensik biasanya harus menjalankan ExifTool untuk metadata, Tesseract untuk OCR teks pada tangkapan layar, dan The Sleuth Kit untuk partisi disk image secara manual, lalu merekap hasilnya satu per satu.\n- Tantangan Halusinasi AI pada Domain Hukum/Forensik: Mengintegrasikan LLM untuk membantu penulisan narasi laporan berisiko fatal jika AI berhalusinasi, menambahkan fakta fiktif, atau membuat spekulasi/kesimpulan tendensius (seperti menetapkan tersangka/motif).\n- Kompleksitas Laporan PDF Dinamis: Menyusun laporan teknis yang mencakup tabel metadata, visualisasi timeline, preview bukti, serta rekap statistik secara otomatis dan terstruktur rapi sesuai standar akademik forensik.\n\nSolusi yang Diterapkan:\n1. Mengembangkan arsitektur modular (Evidence Detector, Forensic Runner, Case Manager) dengan mekanisme subprocess wrapper yang aman dan non-destruktif.\n2. Menerapkan Two-Tier Explanation Architecture: Draf faktual murni (Rule-Based) dihasilkan terlebih dahulu sebagai ground truth, kemudian AI hanya bertindak sebagai Technical Writing Assistant (PUEBI formal) tanpa izin menambah/mengurangi fakta teknis.\n3. Menyediakan sistem Automatic Fallback: Jika API AI offline atau gagal validasi keamanan, sistem otomatis beralih ke narasi Rule-Based Engine.",
    result:
      "- Efisiensi Waktu Signifikan: Memangkas waktu investigasi dan penyusunan laporan komprehensif dari yang biasanya memakan waktu berjam-jam menjadi hitungan detik secara otomatis.\n- Kepatuhan Standar Forensik 100%: Berhasil mempertahankan integritas hash berkas bukti digital tanpa modifikasi Modified Date/Access Date pada sistem operasi.\n- Laporan Otomatis Siap Uji: Menghasilkan dokumen PDF multi-halaman berstandar akademik yang mencakup Executive Summary, Chain of Custody, Metadata Deep-Dive, OCR Transcript, Disk Partition Map, hingga Summary of Findings.\n- Antarmuka CLI Modern & Interaktif: Menggunakan Typer dan Rich untuk memberikan visualisasi proses, tabel interaktif, dan status inspeksi yang bersih di terminal.\n- Pembelajaran Utama: Memperdalam pemahaman tentang prinsip legal digital forensik, manipulasi proses I/O tingkat rendah (low-level subprocess handling), pembuatan engine dokumen dinamis dengan ReportLab, serta penerapan Prompt Engineering berdisiplin tinggi (Defensive AI Prompting) untuk mencegah halusinasi data teknis.",
    github_url: "https://github.com/mazizi29/DEA",
    live_url: "",
    created_at: "2026-08-09T07:24:48.939Z",
    updated_at: "2026-08-22T03:54:32.463Z",
  },
  {
    id: "aea9eb66-326c-43c9-a196-96e926d3ee26",
    sort_order: 3,
    slug: "rekapan-uiux-app",
    title: "Rekapan",
    subtitle: "UMKM Financial & Inventory Management App",
    description:
      "Desain antarmuka aplikasi mobile yang dirancang khusus untuk mempermudah pelaku UMKM dalam mencatat arus kas keuangan harian, memonitor ketersediaan stok barang, serta memantau kesehatan bisnis secara praktis dan intuitif.",
    category: "UI/UX & Product Design",
    subcategory: "Mobile App Design",
    year: "2026",
    role: "UI/UX Designer & Product Researcher",
    tools: [
      "Figma",
      "Design System",
      "Mobile UI Design",
      "User Flow",
      "Wireframing",
      "Interactive Prototyping",
    ],
    tags: [
      "UI/UX",
      "Mobile App",
      "Fintech",
      "Inventory",
      "MSME Solution",
      "Design System",
      "Product Design",
      "__figma:https://www.figma.com/proto/PcQc6ino5Jak3tweSGDyLG/UI-UX-DESIGN--86?node-id=86-14&p=f&t=6EYqs5dB5cQJOU2x-1&scaling=scale-down&content-scaling=fixed&page-id=83%3A2&starting-point-node-id=86%3A14",
    ],
    status: "published",
    featured: true,
    cover_url:
      "https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787394730783-86nu685.webp",
    gallery: [],
    overview:
      "- **Latar Belakang:** Banyak pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) di Indonesia masih mengandalkan pencatatan pembukuan keuangan dan stok barang secara manual di buku tulis kertas. Metode ini rentan terhadap kesalahan hitung, risiko kehilangan data, serta menyulitkan evaluasi keuntungan bisnis secara real-time.\n- **Tujuan Desain:** Merancang pengalaman aplikasi mobile bernama Rekapan yang ramah pengguna awam, efisien, dan menghilangkan kompleksitas akuntansi tradisional.\n- **Visi Produk:** Memberdayakan pemilik usaha warung, toko kelontong, dan jasa kuliner agar dapat mencatat keuangan, mengelola stok barang, dan memantau perkembangan bisnis dalam satu genggaman tangan.",
    problem:
      "- Pencatatan yang Memakan Waktu: Pedagang sering kali terlalu sibuk melayani pelanggan sehingga menunda atau lupa mencatat transaksi masuk dan keluar saat jam sibuk.\n- Kekhawatiran Stok Habis Tiba-tiba: Tidak adanya sistem peringatan dini ketika stok barang dagangan yang laris mendekati batas kritis atau habis.\n- Keengganan terhadap Aplikasi Rumit: Pemilik usaha mikro enggan memakai software akuntansi perbankan yang rumit dan dipenuhi istilah teknis yang membingungkan.\n- Kebutuhan Input Cepat: Antarmuka harus mengutamakan kecepatan pencatatan transaksi dalam kurang dari 3 langkah sentuhan di layar ponsel.",
    result:
      "- Dashboard Saldo & Arus Kas: Menghadirkan kartu saldo utama yang besar dengan visualisasi ringkas antara total pemasukan hijau dan pengeluaran merah.\n- Tombol Aksi Cepat (Floating Action Button): Meletakkan tombol koin melayang di tengah navigasi bawah untuk input transaksi kilat tanpa harus berpindah halaman.\n- Manajemen Stok Berbasis Indikator Warna:\n  1. Tersedia (Badge Hijau): Kuantitas stok dalam batas aman operasional.\n  2. Hampir Habis (Badge Kuning): Peringatan otomatis saat stok menyentuh batas minimum.\n  3. Habis (Badge Merah): Notifikasi visual agar pemilik segera melakukan pembelian ulang.\n- Fleksibilitas Metode Pembayaran: Mendukung pencatatan transaksi Tunai, Transfer Bank, hingga QRIS.",
    figma_url:
      "https://www.figma.com/proto/PcQc6ino5Jak3tweSGDyLG/UI-UX-DESIGN--86?node-id=86-14&p=f&t=6EYqs5dB5cQJOU2x-1&scaling=scale-down&content-scaling=fixed&page-id=83%3A2&starting-point-node-id=86%3A14",
    created_at: "2026-08-22T10:05:30.615Z",
    updated_at: "2026-08-22T10:47:06.262Z",
  },
  {
    id: "e117ac2f-bc5f-4d33-a946-cbc32d8578eb",
    sort_order: 4,
    slug: "desain-identitas-visual",
    title: "Koleksi Identitas Visual & Logo",
    subtitle: "Brand Guidelines & Visual Identity Systems Collection",
    description:
      "Koleksi perancangan identitas visual, perancangan logo institusi/komunitas, dan pedoman tata visual (brand guidelines) yang memadukan filosofi makna dengan kesederhanaan bentuk modern.",
    category: "Creative & Multimedia",
    subcategory: "Visual Identity & Logo",
    year: "2025-2026",
    role: "Brand Designer & Graphic Specialist",
    tools: ["Adobe Illustrator", "Paper Sketching", "Figma"],
    tags: [
      "Visual Identity & Logo",
      "Branding",
      "Visual Identity",
      "Logo Design",
      "Typography",
      '__gmeta:[{"idx":0,"title":"Logo Layar Putih Creative Studio","caption":"Agensi Multimedia"},{"idx":1,"title":"Logo Lakmud 2026","caption":"Event Kaderisasi Ikatan Pelajar NU"},{"idx":2,"title":"Logo JSC 01","caption":"Event Tahunan Ikatan Pelajar NU"},{"idx":3,"title":"Logo JSC 02","caption":"Event Tahunan Ikatan Pelajar NU"},{"idx":4,"title":"Logo NataArtha App","caption":"Aplikasi Pencatatan Keuangan Pribadi"},{"idx":5,"title":"Logo Rekapan App","caption":"Aplikasi UMKM Financial & Inventory Management"},{"idx":6,"title":"Logo Hari Jadi Kabupaten Tegal ke 425","caption":"Juara 4 Kontes Logo Hari Jadi Kabupaten Tegal ke 425"}]',
    ],
    status: "published",
    featured: true,
    cover_url:
      "https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787407481430-xlo9c01.webp",
    gallery: [],
    created_at: "2026-08-22T14:03:54.359Z",
    updated_at: "2026-08-22T14:49:49.927Z",
  },
  {
    id: "3704d818-87c1-4385-b351-267a7fa1fa38",
    sort_order: 5,
    slug: "sosial-media-post-feeds",
    title: "Social Media Visuals & Feeds",
    subtitle: "Editorial Feeds, Event Posters & Digital Campaign Systems",
    description:
      "Koleksi perancangan konten media sosial, publikasi kegiatan, dan kampanye visual digital untuk institusi pendidikan, organisasi pemuda, komunitas teknologi, dan entitas kuliner. Dirancang dengan komposisi tipografi yang kuat, hierarki informasi yang terarah, serta estetika visual yang relevan dengan target audiens.",
    category: "Creative & Multimedia",
    subcategory: "Social Media & Content Design",
    year: "2024 - 2026",
    role: "Graphic Designer & Content Strategist",
    tools: ["Adobe Illustrator", "Adobe Photoshop", "Figma"],
    tags: [
      "Social Media & Content Design",
      "Social Media",
      "Graphic Design",
      "Poster Design",
      "Campaign",
      "Content Strategy",
      '__gmeta:[{"idx":0,"title":"Dokumentasi Sholat Khusuf","caption":"Feed Dokumentasi Acara di PP Al Munawwir Krapyak"},{"idx":1,"title":"Dokumentasi Sholat Iedul Fitri","caption":"Feed Dokumentasi Acara di PP Al Munawwir Krapyak"},{"idx":2,"title":"Malam Tirakatan Muharroman 1446 H","caption":"Poster Acara di PP Al Munawwir Krapyak"},{"idx":3,"title":"Dokumentasi Majelis Haul ke-86","caption":"Feed Dokumentasi Acara di PP Al Munawwir Krapyak"},{"idx":4,"title":"Countdown PPDB MI Tahfidz Al-Fatimiyah","caption":"Post PPDB MI Tahfidz Al Fatimiyah Krapyak"},{"idx":5,"title":"Ucapan Ramadhan","caption":"Post Ucapan Hari Besar Islam di PPPA Al Fatimiyah Krapyak"},{"idx":6,"title":"Dokumentasi LAKMUD 2026","caption":"Feed Dokumentasi Event Kaderisasi Pelajar Nu Kota Yogyakarta"},{"idx":7,"title":"JSC MLBB Tournament 2025","caption":"Poster Event Tahunan Pelajar Nu Kota Yogyakarta"},{"idx":8,"title":"Informatic Studios","caption":"Poster Event HMP Informatika UNU Yogyakarta"},{"idx":9,"title":"Makrab Informatika 2024","caption":"Poster Event HMP Informatika UNU Yogyakarta"},{"idx":10,"title":"Katalog Menu Seafood Kedai Monstera","caption":"Feed Menu di Kedai Monstera"}]',
    ],
    status: "published",
    featured: true,
    cover_url:
      "https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787413535180-av8h31i.webp",
    gallery: [],
    created_at: "2026-08-22T15:48:57.223Z",
    updated_at: "2026-08-22T15:58:05.672Z",
  },
  {
    id: "d1f43382-453c-405e-a3e8-6c1d4cbf8568",
    sort_order: 6,
    slug: "bts-ep4-mental-anak-rapuh",
    title: "Bakat Talks Series (BTS)",
    subtitle: "Educational Parenting & K-12 Podcast Video",
    description:
      "Bakat Talks Series dari Halobakat TV bersama Bunda Rika. Membahas realita pendidikan K-12, peran support system, serta pentingnya pembentukan karakter dan kesehatan mental anak di tengah tuntutan akademis.",
    category: "Creative & Multimedia",
    subcategory: "Video Production & Editing",
    year: "2026",
    role: "Creative Producer & Video Editor",
    tools: ["Adobe Premier Pro", "YouTube", "Huly"],
    tags: [
      "Commercial Videography",
      "Podcast",
      "Edukasi",
      "Parenting",
      "Mental Health",
      "Character Building",
      "__video:https://www.youtube.com/watch?v=Td6xYN8Ep7k&t=170s&pp=ygUTaGFsb2Jha2F0IGluZG9uZXNpYQ%3D%3D",
    ],
    status: "published",
    featured: true,
    cover_url:
      "https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787380938782-sqj47re.webp",
    gallery: [],
    overview:
      "- Mengangkat isu sosial dan tantangan edukasi sistem pendidikan K-12 (TK hingga SMA) pasca-pandemi yang relevan bagi banyak keluarga.\n- Pesan utama berfokus pada pentingnya kolaborasi guru dan orang tua, serta penyadaran bahwa nilai akademis tinggi tidak akan bertahan lama jika anak tidak dibekali mental yang sehat, daya juang (adversity quotient), dan karakter kuat (seperti tanggung jawab, kejujuran, dll).\n- Dibawakan melalui diskusi kasual dan interaktif antara dua host (Syakban & Safa) bersama praktisi dan pengelola pendidikan berpengalaman 25+ tahun, Bunda Rika.",
    problem:
      "- Format acara bincang santai (Talkshow/Podcast) berdurasi kurang lebih 57 menit.\n- Produksi dilakukan di dalam ruangan dengan set-up obrolan yang nyaman agar pemaparan narasumber terasa hangat dan mendalam.",
    result:
      "- Episode ini dipublikasikan pada akhir Juni 2026 di kanal YouTube Halobakat TV, menyasar audiens orang tua, guru, hingga remaja agar memiliki refleksi baru dalam memaknai pendidikan.",
    video_url:
      "https://www.youtube.com/watch?v=Td6xYN8Ep7k&t=170s&pp=ygUTaGFsb2Jha2F0IGluZG9uZXNpYQ%3D%3D",
    live_url:
      "https://www.youtube.com/watch?v=Td6xYN8Ep7k&t=170s&pp=ygUTaGFsb2Jha2F0IGluZG9uZXNpYQ%3D%3D",
    created_at: "2026-08-22T06:13:52.648Z",
    updated_at: "2026-08-22T09:46:42.873Z",
  },
  {
    id: "5c0feaa5-eb07-42f9-98b2-234eb654f367",
    sort_order: 7,
    slug: "video-profil-kelurahan-kepil-kpm-unsiq-2025",
    title: "Video Profil Kelurahan Kepil",
    subtitle: "Community Documentary & Village Profile Video",
    description:
      "Video profil Kelurahan Kepil hasil karya KPM Kelompok 20 UNSIQ. Menyoroti pesona alam, komoditas unggulan, UMKM madu lokal, hingga budaya kebersamaan warga.",
    category: "Creative & Multimedia",
    subcategory: "Video Production & Editing",
    year: "2026",
    role: "Director of Photography (DoP) & Video Editor",
    tools: [
      "DJI Drone",
      "Mobile Cinema Rig",
      "Wireless Audio System",
      "CapCut Pro",
    ],
    tags: [
      "Commercial Videography",
      "Video Profil",
      "Dokumenter",
      "KPM UNSIQ",
      "Kelurahan Kepil",
      "Wonosobo",
      "UMKM",
      "__video:https://www.youtube.com/watch?v=rGq-UYb1Wpk&t=70s&pp=ygURcHJvZmlsIGRlc2Ega2VwaWw%3D",
    ],
    status: "published",
    featured: true,
    cover_url:
      "https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787382131991-x91v803.webp",
    gallery: [],
    overview:
      "- Proyek video profil dokumenter ini dikerjakan sebagai bagian dari program KPM (Kuliah Pengabdian Masyarakat) Kelompok 20 UNSIQ tahun 2025 di Kelurahan Kepil.\n- Mengangkat storyline tentang keharmonisan sosial dan pesona alam, mencakup luas wilayah 6,47 km² dengan 6.074 jiwa warga.\n- Fokus konten menyoroti komoditas lokal (kelapa, durian, duku), potensi industri kayu, produk unggulan UMKM madu lokal, fasilitas pendidikan/keagamaan, hingga tradisi budaya dan festival layang-layang lokal.",
    problem:
      "Pengambilan gambar (syuting) dilakukan di berbagai point of interest Kelurahan Kepil. Mencakup pengambilan video lanskap udara (drone), wawancara dengan pengelola UMKM madu, liputan aktivitas pendidikan/pengajian rutin warga, dan sambutan resmi dari Kepala Kelurahan Kepil, Bapak Herul Sunadi.",
    result:
      "Proses editing berfokus pada penyajian visual yang sinematik dengan iringan voice over informatif dan backsound inspiratif. Pengaturan color grading dilakukan untuk memunculkan kehangatan aktivitas sosial warga dan keindahan alam.",
    video_url:
      "https://www.youtube.com/watch?v=rGq-UYb1Wpk&t=70s&pp=ygURcHJvZmlsIGRlc2Ega2VwaWw%3D",
    live_url:
      "https://www.youtube.com/watch?v=rGq-UYb1Wpk&t=70s&pp=ygURcHJvZmlsIGRlc2Ega2VwaWw%3D",
    created_at: "2026-08-22T06:53:53.132Z",
    updated_at: "2026-08-22T09:47:39.937Z",
  },
  {
    id: "bbef649c-3d45-4b03-87ea-05e6082c2ad4",
    sort_order: 8,
    slug: "fotografi-dokumentasi-visual",
    title: "Fotografi & Dokumentasi Visual",
    subtitle: "Visual Storytelling & Commercial Photography",
    description:
      "Koleksi fotografi komersial, dokumentasi acara berskala besar, potret human interest, dan visual editorial yang mengabadikan momen autentik melalui penguasaan pencahayaan dan komposisi dinamis.",
    category: "Creative & Multimedia",
    subcategory: "Commercial Photography",
    year: "2026",
    role: "Lead Photographer & Colorist",
    tools: [
      "Sony Alpha Series",
      "Prime & Zoom Lenses",
      "Adobe Lightroom Classic",
      "Adobe Photoshop",
    ],
    tags: [
      "Commercial Photography",
      "Visual Storytelling",
      "Event Documentation",
      "Human Interest",
      "Lightroom Color Grading",
      "Portraiture",
      '__gmeta:[{"idx":0,"title":"The Stillness in Motion (Ketenangan dalam Dinamika)","caption":"Eksplorasi teknik slow shutter yang membekukan kekhusyukan seorang santri mendaras Al-Qur\'an di tengah dinamika figur orang yang berlalu-lalang dengan efek motion blur."},{"idx":1,"title":"Halaqah: Di Bawah Cahaya Pengetahuan","caption":"Komposisi simetris yang menangkap momen sorogan dan halaqah santri di depan jendela berarsitektur klasik dengan rim lighting alami yang elegan."},{"idx":2,"title":"Keadilan dalam Bingkai: Wisuda FH UGM","caption":"Potret wisudawan dengan teknik foreground framing geometris yang mensejajarkan subjek dengan patung Dewi Keadilan di Fakultas Hukum UGM."},{"idx":3,"title":"Dokumentasi Khidmat: Upacara & Stage Performance","caption":"Dokumentasi panggung dengan high dynamic range yang menangkap momen khidmat penghormatan bendera di auditorium utama."},{"idx":4,"title":"Atmosfer & Spontanitas Audiens","caption":"Potret candid interaksi spontan audiens yang menangkap gelak tawa dan ekspresi hangat dengan tone warna warm earthy yang humanis."},{"idx":5,"title":"Detail & Simbol Prestasi Akademik","caption":"Bidikan detail still life dari buku tesis, selempang kelulusan, dan buket bunga segar dengan shallow depth of field yang tajam dan bertekstur."},{"idx":6,"title":"Nadi Kota: Arus Waktu di Tugu Jogja","caption":"Fotografi malam hari memanfaatkan teknik long exposure untuk merekam jejak cahaya kendaraan yang mengitari monumen bersejarah Tugu Yogyakarta."},{"idx":7,"title":"Refleksi Senja di Tepian Langit","caption":"Potret siluet seseorang membaca di atas atap berlatarkan kubah masjid dan semburat awan keemasan waktu senja (golden hour)."}]',
    ],
    status: "published",
    featured: false,
    cover_url:
      "https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787539497504-k2hhlw1.webp",
    gallery: [
      {
        id: "gallery-photo-1",
        project_id: "bbef649c-3d45-4b03-87ea-05e6082c2ad4",
        image_url:
          "https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787539497504-k2hhlw1.webp",
        title: "The Stillness in Motion (Ketenangan dalam Dinamika)",
        caption:
          "Eksplorasi teknik slow shutter yang membekukan kekhusyukan seorang santri mendaras Al-Qur'an di tengah dinamika figur orang yang berlalu-lalang dengan efek motion blur.",
        sort_order: 1,
      },
      {
        id: "gallery-photo-2",
        project_id: "bbef649c-3d45-4b03-87ea-05e6082c2ad4",
        image_url:
          "https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787539498567-lvofybt.webp",
        title: "Halaqah: Di Bawah Cahaya Pengetahuan",
        caption:
          "Komposisi simetris yang menangkap momen sorogan dan halaqah santri di depan jendela berarsitektur klasik dengan rim lighting alami yang elegan.",
        sort_order: 2,
      },
      {
        id: "gallery-photo-3",
        project_id: "bbef649c-3d45-4b03-87ea-05e6082c2ad4",
        image_url:
          "https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787539499277-5htzm85.webp",
        title: "Keadilan dalam Bingkai: Wisuda FH UGM",
        caption:
          "Potret wisudawan dengan teknik foreground framing geometris yang mensejajarkan subjek dengan patung Dewi Keadilan di Fakultas Hukum UGM.",
        sort_order: 3,
      },
      {
        id: "gallery-photo-4",
        project_id: "bbef649c-3d45-4b03-87ea-05e6082c2ad4",
        image_url:
          "https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787539499591-q5ri7i0.webp",
        title: "Dokumentasi Khidmat: Upacara & Stage Performance",
        caption:
          "Dokumentasi panggung dengan high dynamic range yang menangkap momen khidmat penghormatan bendera di auditorium utama.",
        sort_order: 4,
      },
      {
        id: "gallery-photo-5",
        project_id: "bbef649c-3d45-4b03-87ea-05e6082c2ad4",
        image_url:
          "https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787539500241-fc5z3r1.webp",
        title: "Atmosfer & Spontanitas Audiens",
        caption:
          "Potret candid interaksi spontan audiens yang menangkap gelak tawa dan ekspresi hangat dengan tone warna warm earthy yang humanis.",
        sort_order: 5,
      },
      {
        id: "gallery-photo-6",
        project_id: "bbef649c-3d45-4b03-87ea-05e6082c2ad4",
        image_url:
          "https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787539501821-u20fequ.webp",
        title: "Detail & Simbol Prestasi Akademik",
        caption:
          "Bidikan detail still life dari buku tesis, selempang kelulusan, dan buket bunga segar dengan shallow depth of field yang tajam dan bertekstur.",
        sort_order: 6,
      },
      {
        id: "gallery-photo-7",
        project_id: "bbef649c-3d45-4b03-87ea-05e6082c2ad4",
        image_url:
          "https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787539502906-d9cabni.webp",
        title: "Nadi Kota: Arus Waktu di Tugu Jogja",
        caption:
          "Fotografi malam hari memanfaatkan teknik long exposure untuk merekam jejak cahaya kendaraan yang mengitari monumen bersejarah Tugu Yogyakarta.",
        sort_order: 7,
      },
      {
        id: "gallery-photo-8",
        project_id: "bbef649c-3d45-4b03-87ea-05e6082c2ad4",
        image_url:
          "https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1787539503271-60bjxfa.webp",
        title: "Refleksi Senja di Tepian Langit",
        caption:
          "Potret siluet seseorang membaca di atas atap berlatarkan kubah masjid dan semburat awan keemasan waktu senja (golden hour).",
        sort_order: 8,
      },
    ],
    overview:
      "Kompilasi karya fotografi dan dokumentasi visual yang mencakup berbagai spektrum kebutuhan visual—mulai dari eksplorasi human interest bernuansa spiritual, potret wisuda & arsitektur, dokumentasi panggung acara berskala besar, hingga fotografi malam hari (urban long exposure). Setiap bidikan dirancang dengan kepekaan komposisi, pemanfaatan cahaya alami maupun buatan, dan kejelian menangkap decisive moment yang autentik.",
    problem:
      "- Pengendalian Cahaya Dinamis: Menghadapi kondisi pencahayaan yang sangat bervariasi, mulai dari pencahayaan kontras tinggi di panggung acara (stage lighting), cahaya senja yang cepat memudar (golden hour), hingga situasi minim cahaya (low light) di malam hari tanpa merusak naturalitas warna.\n- Komposisi & Storytelling Visual: Menangkap interaksi manusia dan suasana sakral tanpa menginterupsi jalannya ritual atau acara, memanfaatkan teknik framing arsitektural dan slow shutter untuk menghadirkan dinamika visual.\n- Konsistensi Color Grading: Mengolah berkas RAW secara konsisten agar setiap seri foto memiliki mood, tonalitas warna, dan kedalaman karakter visual yang matang serta elegan.",
    result:
      "- Galeri Dokumentasi Multi-Disiplin: Menghasilkan koleksi 8 karya visual unggulan beresolusi tinggi dengan narasi cerita yang kuat dan estetika sinematik.\n- Penguasaan Pasca-Produksi: Penerapan color grading kustom di Adobe Lightroom Classic dengan kalibrasi kurva warna warm-earthy yang memberikan kesan hangat, timeless, dan profesional.\n- Portofolio Visual yang Komprehensif: Memperkaya kapabilitas visual Layar Putih Creative Studio dalam melayani kebutuhan dokumentasi instansi, media sosial, profil komersial, maupun karya seni fotografi independen.",
    created_at: "2026-08-23T23:58:45.597Z",
    updated_at: "2026-08-24T00:12:07.652Z",
  },
]

export const profile = {
  id: "00000000-0000-0000-0000-000000000001",
  display_name: "Muhammad Azizi Abdillah",
  title: "Mahasiswa Informatika | UI/UX & Front-End",
  intro:
    "Menikmati setiap proses, tumbuh dari setiap tantangan, dan berkarya dengan penuh antusias.",
  email: "izzi.azizi29@gmail.com",
  location: "Yogyakarta, Indonesia",
  availability: "open",
  portrait_url: JSON.stringify({
    home: "https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1786268953212-g7tu9z7.webp",
    about:
      "https://pbezjyedxiydebfuxclj.supabase.co/storage/v1/object/public/media/1786427958283-qnyi4uo.webp",
  }),
}

export const settings = {
  site_title: "Portfolio",
  site_tagline: "Crafting Digital Products with Joy.",
  meta_description: "Personal portfolio of a design-minded Informatics student.",
  open_internship: true,
  contact_email: "izzi.azizi29@gmail.com",
}

export const experience = [
  {
    id: "1",
    sort_order: 1,
    organization: "SMK Syubbanul Wathon",
    position: "Multimedia",
    type: "Education",
    startDate: "2020-07-01",
    endDate: "2023-06-25",
    description:
      "Mempelajari desain grafis, fotografi, videografi, dan editing sebagai dasar produksi konten visual untuk media digital.",
    skills: ["Graphic Design", "Photography", "Videography", "Video Editing"],
    status: "completed",
  },
  {
    id: "2",
    sort_order: 8,
    organization: "ESWE TV",
    position: "Desainer Grafis",
    type: "Freelance",
    startDate: "2021-12-25",
    endDate: "2023-01-25",
    description:
      "Merancang kebutuhan visual untuk publikasi dan media sosial serta mengolah materi visual melalui proses editing. Berkolaborasi dengan tim produksi untuk menjaga konsistensi visual dan menyesuaikan konten dengan kebutuhan audiens.",
    skills: ["Graphic Design", "Visual Editing", "Social Media"],
    status: "completed",
  },
  {
    id: "3",
    sort_order: 7,
    organization: "MJTV",
    position: "Produser",
    type: "Project",
    startDate: "2022-09-01",
    endDate: "2022-11-30",
    description:
      "Mengembangkan konsep dan alur produksi konten, mengoordinasikan proses produksi, serta memastikan hasil akhir sesuai dengan tujuan dan target audiens.",
    skills: ["Production Management", "Concept Development", "Art Direction"],
    status: "completed",
  },
  {
    id: "4",
    sort_order: 5,
    organization: "Al Munawwir TV",
    position: "Koor. Desain Grafis",
    type: "Freelance",
    startDate: "2023-09-01",
    endDate: "2025-03-31",
    description:
      "Mengoordinasikan tim desain, membagi tugas, dan menjaga konsistensi visual untuk kebutuhan publikasi dan media sosial.",
    skills: ["Team Leadership", "Brand Consistency", "Graphic Design"],
    status: "completed",
  },
  {
    id: "5",
    sort_order: 2,
    organization: "Universitas Nahdlatul Ulama’ Yogyakarta",
    position: "Informatika",
    type: "Education",
    startDate: "2023-09-30",
    endDate: null,
    description:
      "Mempelajari pengembangan perangkat lunak, basis data, pemrograman, UI/UX, dan teknologi web maupun mobile. Mengembangkan berbagai proyek digital melalui proses perancangan, implementasi, dan pengujian.",
    skills: [
      "UI/UX Design",
      "Web Development",
      "Mobile Programming",
      "Database",
      "Software Engineering",
    ],
    status: "active",
  },
  {
    id: "6",
    sort_order: 0,
    organization: "Layar Putih Creative Studio",
    position: "Creative & Visual Media",
    type: "Work",
    startDate: "2025-01-10",
    endDate: null,
    description:
      "Mengelola berbagai kebutuhan produksi visual, mulai dari desain grafis, fotografi, hingga editing foto dan video. Terlibat dalam proses kreatif dari perencanaan konsep, produksi, hingga penyempurnaan hasil akhir dengan memperhatikan kebutuhan dan tujuan setiap karya.",
    skills: ["Creative Direction", "Visual Production", "Photography", "Video Editing"],
    status: "active",
  },
  {
    id: "7",
    sort_order: 6,
    organization: "Al Munawwir TV",
    position: "Ketua",
    type: "Freelance",
    startDate: "2025-04-01",
    endDate: "2025-10-30",
    description:
      "Memimpin tim dan mengatur strategi kerja, perencanaan program, serta pelaksanaan produksi media.",
    skills: ["Strategic Planning", "Team Leadership", "Media Production"],
    status: "completed",
  },
  {
    id: "8",
    sort_order: 3,
    organization: "Halobakat Indonesia",
    position: "Social Media Specialist",
    type: "Project",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    description:
      "Mengelola kebutuhan konten media sosial, mengoordinasikan produksi visual, serta memastikan materi publikasi sesuai dengan identitas dan strategi komunikasi.",
    skills: ["Content Strategy", "Social Media Management", "Visual Campaign"],
    status: "completed",
  },
]

export const skills = {
  soft_skill: [
    { id: "0fe74b10-fc12-4ef6-9817-2fcc74993058", name: "Problem Solving", category: "design", order: 0 },
    { id: "59f5995d-6afe-4c09-b7b5-edc98048e7e0", name: "Berpikir Kritis", category: "design", order: 1 },
    { id: "bd241caa-5bca-435c-9343-60ef9d93e335", name: "Komunikasi", category: "design", order: 2 },
    { id: "a27a53be-d2ba-4a27-bc0e-b6ea6387d989", name: "Kerja Tim", category: "design", order: 3 },
    { id: "2233a3f6-38a2-4bf2-bf2a-7d221e71e9c3", name: "Kepemimpinan", category: "design", order: 4 },
  ],
  hard_skill: [
    { id: "8809f2e7-a856-4b74-b645-547012bf8d9b", name: "UI/UX Design", category: "build", order: 0 },
    { id: "86f57b37-f0a2-4bbb-ae61-9b254d6a29c2", name: "Desain Grafis & Visual", category: "build", order: 1 },
    { id: "52d0f90e-38c3-42b2-8bad-cae75534b6b7", name: "Fotografi & Pengolahan Media", category: "build", order: 2 },
    { id: "14920954-1303-4467-8224-163a147f781e", name: "Pengembangan Web & Aplikasi", category: "build", order: 3 },
    { id: "27dd8d71-5506-4b47-8840-2b2f356b08d1", name: "Analisis & Perancangan Sistem", category: "build", order: 4 },
    { id: "10fd763b-3f57-4d80-94d4-b919b7a304bf", name: "Basis Data", category: "build", order: 5 },
  ],
  alat: [
    { id: "46debc13-a3f7-435f-85bd-302530a484e4", name: "Figma", category: "visual", order: 0 },
    { id: "0f4e1565-2de4-43e6-a9cb-3cf3151a252e", name: "Visual Studio Code", category: "visual", order: 1 },
    { id: "14793b00-b975-45bf-9581-867bd764a2ba", name: "Git & GitHub", category: "visual", order: 2 },
    { id: "e704ca10-cb00-44f0-9e8a-cfad23ae55eb", name: "Firebase", category: "visual", order: 3 },
    { id: "6809a6ea-25b6-4ff0-a56f-93a2a6e71322", name: "Adobe Illustrator", category: "visual", order: 4 },
    { id: "1612313f-3d1d-47da-bf7e-98e19454eefe", name: "Adobe Lightroom", category: "visual", order: 5 },
    { id: "1de94c8d-ee8f-4c31-baac-f8b26ce772f5", name: "Adobe After Effects", category: "visual", order: 6 },
  ],
}
