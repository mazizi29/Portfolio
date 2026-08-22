import type { Project } from "@/types/project"

export const projects: Project[] = [
  {
    id: "01",
    slug: "nataArtha",
    title: "NataArtha",
    subtitle: "Personal Finance Management App",
    description:
      "Aplikasi pencatatan keuangan pribadi yang dirancang untuk membantu mahasiswa dan profesional muda mengelola anggaran bulanan dengan visualisasi arus kas yang intuitif.",
    category: "Engineering & Tech",
    subcategory: "Mobile Application",
    year: "2024",
    role: "UI/UX Design · Front-End Development",
    tools: ["Figma", "React Native", "Firebase"],
    tags: ["UI/UX", "React Native", "Firebase", "Mobile App"],
    status: "published",
    featured: true,
    cover_url:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=800&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&auto=format",
    ],
    overview:
      "NataArtha dikembangkan untuk mengatasi kebiasaan pencatatan pengeluaran yang tidak konsisten di kalangan mahasiswa dan fresh graduate dengan pendekatan antarmuka yang bersih dan interaktif.",
    problem:
      "Banyak aplikasi keuangan terasa terlalu rumit atau justru terlalu minim fitur analisis. Diperlukan solusi tengah yang memudahkan input harian sekaligus menyajikan ringkasan visual yang mudah dipahami.",
    result:
      "Menghadirkan alur onboarding dan pencatatan transaksi yang ringkas, menghasilkan prototipe interaktif dengan kepuasan navigasi yang baik pada pengujian pengguna.",
    sections: [
      {
        id: "01",
        label: "Overview",
        sublabel: "Gambaran Umum & Tujuan",
        content:
          "NataArtha dikembangkan untuk mengatasi kebiasaan pencatatan pengeluaran yang tidak konsisten di kalangan mahasiswa dan fresh graduate dengan pendekatan antarmuka yang bersih dan interaktif.",
      },
      {
        id: "02",
        label: "Problem & Architecture",
        sublabel: "Tantangan & Arsitektur Teknis",
        content:
          "- Pengguna sering lupa mencatat pengeluaran karena alur input terlalu rumit\n- Visualisasi grafik keuangan yang membingungkan bagi pemula\n- Integrasi database lokal dan sinkronisasi cloud real-time Firebase",
      },
      {
        id: "03",
        label: "Result & Impact",
        sublabel: "Hasil, Metrik & Solusi",
        content:
          "- Berhasil mereduksi waktu input transaksi harian hingga kurang dari 15 detik\n- Prototipe interaktif diuji pada 10 pengguna dengan tingkat kepuasan di atas 90%\n- Struktur kode front-end modular siap dikembangkan ke skala produksi",
      },
    ],
    github_url: "https://github.com/mazizi29",
    live_url: "",
    figma_url: "https://figma.com/@mazizi29",
    updated_at: "2024-11-15",
  },
  {
    id: "02",
    slug: "javanese-invitation",
    title: "Interactive Javanese Invitation",
    subtitle: "Interactive Cultural Digital Experience",
    description:
      "Eksplorasi undangan digital interaktif yang memadukan ornamen visual budaya Jawa dengan teknik animasi web dan transisi modern.",
    category: "UI/UX & Product Design",
    subcategory: "Web Experience & UI Design",
    year: "2024",
    role: "UI Design · Frontend Development",
    tools: ["Figma", "HTML", "CSS", "JavaScript", "GSAP"],
    tags: ["UI Design", "HTML", "CSS", "JavaScript", "GSAP"],
    status: "published",
    featured: true,
    cover_url:
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200&h=800&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200&h=800&fit=crop&auto=format",
    ],
    overview:
      "Proyek eksplorasi front-end yang menggabungkan estetika tipografi dan motif budaya tradisional ke dalam media web interaktif.",
    problem:
      "Undangan digital sering kali menggunakan template kaku dengan animasi yang generik. Proyek ini bertujuan menciptakan pengalaman visual yang lebih berkarakter dan dinamis.",
    result:
      "Berhasil mengimplementasikan interaksi berbasis scroll (scroll-triggered animations) yang responsif dan ringan diakses dari berbagai perangkat.",
    sections: [
      {
        id: "01",
        label: "Overview",
        sublabel: "Ringkasan Studi Kasus",
        content:
          "Proyek eksplorasi front-end yang menggabungkan estetika tipografi dan motif budaya tradisional ke dalam media web interaktif.",
      },
      {
        id: "02",
        label: "Design Process",
        sublabel: "Eksplorasi Visual & Tipografi",
        content:
          "- Perancangan wireframe bertema editorial Jawa di Figma\n- Implementasi animasi GSAP ScrollTrigger yang halus dan optimal di mobile\n- Optimasi aset vektor aksara Jawa agar bobot halaman tetap di bawah 1.5MB",
      },
      {
        id: "03",
        label: "Final Solution",
        sublabel: "Pengalaman Interaktif & Hasil",
        content:
          "- Menghasilkan pengalaman navigasi yang imersif dan berkarakter budaya kuat\n- Skor performa Lighthouse mencapai 95+ pada kategori Accessibility & Best Practices",
      },
    ],
    github_url: "https://github.com/mazizi29",
    live_url: "",
    figma_url: "https://figma.com/@mazizi29",
    updated_at: "2024-09-03",
  },
  {
    id: "03",
    slug: "digital-forensic-automation",
    title: "Digital Forensic Automation",
    subtitle: "Digital Forensic Investigation System",
    description:
      "Sistem otomasi skrip untuk membantu alur analisis bukti digital, ekstraksi artefak, dan dokumentasi chain-of-custody dalam lingkungan praktikum forensik digital.",
    category: "Engineering & Tech",
    subcategory: "Digital Forensics & Systems",
    year: "2024",
    role: "Backend Development · System Design",
    tools: ["Python", "Automation", "Digital Forensics"],
    tags: ["Python", "Automation", "Digital Forensics", "Systems"],
    status: "published",
    featured: true,
    cover_url:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=800&fit=crop&auto=format",
    gallery: [],
    overview:
      "Toolkit berbasis Python untuk mengotomasi tahapan verifikasi hash integritas berkas dan pengelompokan artefak digital secara berurutan.",
    problem:
      "Proses pemeriksaan integritas bukti secara manual memerlukan waktu dan rentan terhadap ketidakkonsistenan pencatatan log verifikasi.",
    result:
      "Menghasilkan alur kerja modular yang mempermudah ekstraksi metadata berkas dan pembuatan laporan audit trail digital terstruktur.",
    sections: [
      {
        id: "01",
        label: "Overview",
        sublabel: "Gambaran Umum Sistem",
        content:
          "Toolkit berbasis Python untuk mengotomasi tahapan verifikasi hash integritas berkas dan pengelompokan artefak digital secara berurutan.",
      },
      {
        id: "02",
        label: "Problem & Architecture",
        sublabel: "Tantangan Investigasi & Otomasi",
        content:
          "- Pemeriksaan integritas bukti manual memakan waktu berjam-jam\n- Risiko inkonsistensi penulisan hash (MD5, SHA-256) pada chain-of-custody\n- Kebutuhan ekstraksi metadata berkas yang aman tanpa merusak timestamps asli",
      },
      {
        id: "03",
        label: "Results & Impact",
        sublabel: "Hasil & Solusi",
        content:
          "- Mampu memproses dan memvalidasi ratusan berkas bukti dalam hitungan detik\n- Menghasilkan laporan audit trail terstruktur dalam format JSON dan PDF secara otomatis",
      },
    ],
    github_url: "https://github.com/mazizi29",
    live_url: "",
    updated_at: "2024-07-22",
  },
  {
    id: "04",
    slug: "visual-identity-showcase",
    title: "Visual Identity & Brand Assets",
    subtitle: "Simor, Inisiatif Kita & Brand Systems",
    description:
      "Eksplorasi sistem identitas visual, logo guidelines, dan mockup aplikasi merek untuk produk kemasan dan inisiatif kreatif.",
    category: "Creative & Multimedia",
    subcategory: "Visual Identity & Logo",
    year: "2024",
    role: "Brand Designer · Art Direction",
    tools: ["Adobe Illustrator", "Photoshop", "Figma"],
    tags: ["Branding", "Visual Identity", "Logo Design", "Packaging"],
    status: "published",
    featured: true,
    cover_url:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=800&fit=crop&auto=format",
    gallery: [
      {
        id: "g1",
        image_url:
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=800&fit=crop&auto=format",
        title: "Stationery & Brand Guidelines Set",
        caption:
          "Penerapan elemen visual pada kartu nama, kop surat, dan merchandise resmi.",
      },
      {
        id: "g2",
        image_url:
          "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=1200&h=800&fit=crop&auto=format",
        title: "Simor Herbal Product Packaging",
        caption:
          "Desain label botol dan kemasan sachet minuman herbal dengan aksen warna botani.",
      },
      {
        id: "g3",
        image_url:
          "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&h=800&fit=crop&auto=format",
        title: "Logo Construction Grid",
        caption:
          "Ketentuan proporsi geometri, safe margin, dan palet warna primer.",
      },
      {
        id: "g4",
        image_url:
          "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=1200&h=800&fit=crop&auto=format",
        title: "Corporate Identity Suite",
        caption: "",
      },
    ],
    sections: [],
    github_url: "",
    live_url: "",
    instagram_url: "https://instagram.com",
    drive_url: "",
    updated_at: "2024-11-20",
  },
  {
    id: "05",
    slug: "social-media-campaign",
    title: "Social Media & Marketing Visuals",
    subtitle: "Curated Feeds, Editorial Carousels & Event Posters",
    description:
      "Perancangan konten media sosial komprehensif mulai dari feed Instagram terstruktur, carousel edukasi, hingga materi publikasi event.",
    category: "Creative & Multimedia",
    subcategory: "Social Media & Content Design",
    year: "2024",
    role: "Graphic Designer · Content Strategist",
    tools: ["Adobe Photoshop", "Illustrator", "Canva Pro"],
    tags: ["Social Media", "Graphic Design", "Content Creation", "Feeds"],
    status: "published",
    featured: true,
    cover_url:
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&h=800&fit=crop&auto=format",
    gallery: [
      {
        id: "sm1",
        image_url:
          "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&h=800&fit=crop&auto=format",
        title: "Ruang 412 Instagram Feed System",
        caption:
          "Tata letak feed terstruktur dan konsisten untuk meningkatkan engagement audiens muda.",
      },
      {
        id: "sm2",
        image_url:
          "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=1200&h=800&fit=crop&auto=format",
        title: "Akademi Rasa Editorial Carousel",
        caption:
          "Format carousel edukatif dengan tipografi elegan untuk audiens kuliner gastronomi.",
      },
      {
        id: "sm3",
        image_url:
          "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=800&fit=crop&auto=format",
        title: "Matasba Event Campaign Poster",
        caption:
          "Poster publikasi masa ta'aruf santri baru dengan komposisi visual dinamis dan tegas.",
      },
    ],
    sections: [],
    github_url: "",
    live_url: "",
    instagram_url: "https://instagram.com",
    drive_url: "",
    updated_at: "2024-10-15",
  },
  {
    id: "06",
    slug: "commercial-cinematic-reel",
    title: "Cinematic Reel & Visual Stories",
    subtitle: "Short Movie, Event Documentation & Motion Visuals",
    description:
      "Kompilasi video dokumentasi, short trailer, dan bumper motion graphic untuk kebutuhan publikasi audio visual modern.",
    category: "Creative & Multimedia",
    subcategory: "Video Production & Editing",
    year: "2024",
    role: "Videographer · Editor",
    tools: ["Sony FX3", "Premiere Pro", "DaVinci Resolve", "After Effects"],
    tags: ["Videography", "Cinematography", "Color Grading", "Video Editing"],
    status: "published",
    featured: true,
    cover_url:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&h=800&fit=crop&auto=format",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    gallery: [
      {
        id: "v1",
        image_url:
          "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&h=800&fit=crop&auto=format",
        title: "Short Movie Stills & Lighting",
        caption:
          "Pemanfaatan pencahayaan natural dan framing sinematik pada sesi pengambilan gambar.",
      },
      {
        id: "v2",
        image_url:
          "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&h=800&fit=crop&auto=format",
        title: "Event Documentation Highlights",
        caption:
          "Perekaman momen krusial panggung dan atmosfer interaksi audiens secara dinamis.",
      },
    ],
    sections: [],
    github_url: "",
    live_url: "",
    instagram_url: "https://instagram.com",
    updated_at: "2024-10-01",
  },
]

export const experience = [
  {
    id: "1",
    organization: "Universitas Nahdlatul Ulama’ Yogyakarta",
    position: "Informatika",
    type: "Education",
    startDate: "2023-01",
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
    id: "2",
    organization: "SMK Syubbanul Wathon",
    position: "Multimedia",
    type: "Education",
    startDate: "2020-01",
    endDate: "2023-01",
    description:
      "Mempelajari desain grafis, fotografi, videografi, dan editing sebagai dasar produksi konten visual untuk media digital.",
    skills: ["Graphic Design", "Photography", "Videography", "Visual Editing"],
    status: "completed",
  },
  {
    id: "3",
    organization: "Halobakat Indonesia",
    position: "Social Media Specialist",
    type: "Work",
    startDate: "2026-01",
    endDate: "2026-01",
    description:
      "Mengelola kebutuhan konten media sosial, mengoordinasikan produksi visual, serta memastikan materi publikasi sesuai dengan identitas dan strategi komunikasi.",
    skills: ["Social Media", "Visual Coordination", "Content Strategy"],
    status: "active",
  },
  {
    id: "4",
    organization: "IPNU PAC Mantrijeron",
    position: "Wakil Ketua",
    type: "Organization",
    startDate: "2025-01",
    endDate: null,
    description:
      "Mendukung koordinasi organisasi, membantu perencanaan program kerja, serta mengoordinasikan kebutuhan publikasi dan dokumentasi kegiatan.",
    skills: ["Leadership", "Team Coordination", "Event Media"],
    status: "active",
  },
  {
    id: "5",
    organization: "Al Munawwir TV",
    position: "Ketua & Koor. Desain Grafis",
    type: "Organization",
    startDate: "2023-01",
    endDate: "2025-01",
    description:
      "Mengoordinasikan tim desain, membagi tugas, menjaga konsistensi visual, serta memimpin perencanaan produksi media publikasi.",
    skills: ["Art Direction", "Team Leadership", "Graphic Design"],
    status: "completed",
  },
  {
    id: "6",
    organization: "MJTV",
    position: "Produser",
    type: "Internship",
    startDate: "2022-01",
    endDate: "2022-01",
    description:
      "Mengembangkan konsep dan alur produksi konten, mengoordinasikan proses produksi, serta memastikan hasil akhir sesuai dengan tujuan audiens.",
    skills: ["Production Management", "Concept Development"],
    status: "completed",
  },
  {
    id: "7",
    organization: "ESWE TV",
    position: "Desainer Grafis",
    type: "Organization",
    startDate: "2021-01",
    endDate: "2023-01",
    description:
      "Merancang kebutuhan visual untuk publikasi dan media sosial serta mengolah materi visual melalui proses editing.",
    skills: ["Graphic Design", "Visual Editing", "Motion Graphics"],
    status: "completed",
  },
]

export const skills = {
  soft_skill: [
    { id: "1", name: "Problem Solving", category: "design", order: 1 },
    { id: "2", name: "Berpikir Kritis", category: "design", order: 2 },
    { id: "3", name: "Komunikasi", category: "design", order: 3 },
    { id: "4", name: "Kerja Tim", category: "design", order: 4 },
    { id: "5", name: "Kepemimpinan", category: "design", order: 5 },
  ],
  hard_skill: [
    { id: "6", name: "UI/UX Design", category: "build", order: 1 },
    {
      id: "7",
      name: "Pengembangan Web & Aplikasi",
      category: "build",
      order: 2,
    },
    {
      id: "8",
      name: "Analisis & Perancangan Sistem",
      category: "build",
      order: 3,
    },
    { id: "9", name: "Basis Data", category: "build", order: 4 },
    { id: "10", name: "Desain Grafis & Visual", category: "build", order: 5 },
    {
      id: "11",
      name: "Fotografi & Pengolahan Media",
      category: "build",
      order: 6,
    },
  ],
  alat: [
    { id: "12", name: "Figma", category: "visual", order: 1 },
    { id: "13", name: "Visual Studio Code", category: "visual", order: 2 },
    { id: "14", name: "Git & GitHub", category: "visual", order: 3 },
    { id: "15", name: "Firebase", category: "visual", order: 4 },
    { id: "16", name: "Adobe Illustrator", category: "visual", order: 5 },
    { id: "17", name: "Adobe Lightroom", category: "visual", order: 6 },
    { id: "18", name: "Adobe After Effects", category: "visual", order: 7 },
  ],
}
