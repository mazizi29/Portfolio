export const MAIN_CATEGORIES = [
  "Engineering & Tech",
  "UI/UX & Product Design",
  "Creative & Multimedia",
] as const

export type MainCategory = typeof MAIN_CATEGORIES[number]

export const SUBCATEGORY_SUGGESTIONS: Record<MainCategory, string[]> = {
  "Engineering & Tech": [
    "Web Development",
    "Mobile Application",
    "Backend & API",
    "Digital Forensics",
    "System Automation",
    "Full-Stack App",
    "Open Source Tool",
  ],
  "UI/UX & Product Design": [
    "Mobile App Design",
    "Web & Landing Page",
    "UX Case Study",
    "Design System",
    "Interactive Prototype",
    "Product Redesign",
  ],
  "Creative & Multimedia": [
    "Branding & Visual Identity",
    "Commercial Videography",
    "Video Editing & Motion",
    "Commercial Photography",
    "Graphic Design & Poster",
    "Editorial & Print",
  ],
}

export interface ProjectSection {
  id: string
  label: string
  sublabel?: string
  content: string
}

export interface Project {
  id: string
  sort_order?: number
  slug: string
  title: string
  subtitle?: string
  description?: string
  category: MainCategory | string
  subcategory?: string
  year?: string
  role?: string
  tools?: string[] | string
  tags?: string[] | string
  status: "draft" | "published"
  featured: boolean
  cover_url: string
  gallery?: string[]

  // Legacy / fallback case study fields
  overview?: string
  problem?: string
  result?: string

  // Dynamic structured case study sections
  sections?: ProjectSection[]

  // Smart external links
  github_url?: string
  live_url?: string
  video_url?: string
  figma_url?: string
  instagram_url?: string
  drive_url?: string

  created_at?: string
  updated_at?: string
}

export const CASE_STUDY_PRESETS: {
  name: string
  category: MainCategory
  sections: { label: string sublabel: string placeholder: string }[]
}[] = [
  {
    name: "Engineering / Software App",
    category: "Engineering & Tech",
    sections: [
      {
        label: "Overview",
        sublabel: "Gambaran Umum & Tujuan",
        placeholder:
          "Jelaskan latar belakang, arsitektur, dan tujuan sistem atau aplikasi ini dibangun...",
      },
      {
        label: "Problem & Architecture",
        sublabel: "Tantangan & Arsitektur Teknis",
        placeholder:
          "Contoh format poin:\n- Bottleneck performa pemrosesan data manual\n- Kebutuhan integritas data real-time\n- Skalabilitas sistem dan keamanan otentikasi",
      },
      {
        label: "Key Features & Execution",
        sublabel: "Fitur Utama & Eksekusi",
        placeholder:
          "Contoh format poin:\n- Otomasi hashing dan verifikasi berkas\n- Dashboard pemantauan analitik terintegrasi\n- API modular dengan response time di bawah 100ms",
      },
      {
        label: "Result & Impact",
        sublabel: "Hasil, Metrik & Solusi",
        placeholder:
          "Contoh format poin:\n- Efisiensi waktu pemrosesan meningkat hingga 65%\n- Dokumentasi data menjadi lebih terstruktur dan audit-ready\n- Berhasil diuji coba pada lingkungan praktikum/produksi",
      },
    ],
  },
  {
    name: "UI/UX & Product Design",
    category: "UI/UX & Product Design",
    sections: [
      {
        label: "Overview",
        sublabel: "Ringkasan Studi Kasus",
        placeholder:
          "Jelaskan konteks produk, target pengguna, dan tujuan perancangan antarmuka...",
      },
      {
        label: "Design Problem & Research",
        sublabel: "Tantangan Desain & Riset Pengguna",
        placeholder:
          "Contoh format poin:\n- Pengguna kesulitan menavigasi menu pencatatan transaksi utama\n- Tingkat drop-off pengguna baru mencapai 40% saat onboarding\n- Kurangnya hierarki visual dan keterbacaan data grafik",
      },
      {
        label: "Design Process & Prototyping",
        sublabel: "Proses Desain & Eksplorasi",
        placeholder:
          "Contoh format poin:\n- Perancangan user flow dan information architecture baru\n- Wireframing low-fidelity hingga high-fidelity prototype interaktif\n- Pengujian usability testing dengan 5 target partisipan",
      },
      {
        label: "Final Solution & Impact",
        sublabel: "Solusi Akhir & Dampak Pengguna",
        placeholder:
          "Contoh format poin:\n- Task success rate meningkat dari 62% menjadi 94%\n- Desain antarmuka yang lebih intuitif, bersih, dan konsisten\n- Prototipe Figma siap diimplementasikan oleh tim developer",
      },
    ],
  },
  {
    name: "Branding & Visual Identity",
    category: "Creative & Multimedia",
    sections: [
      {
        label: "Creative Brief",
        sublabel: "Konsep & Latar Belakang Klien",
        placeholder:
          "Jelaskan visi merek, target audiens, dan pesan utama yang ingin disampaikan...",
      },
      {
        label: "Visual Exploration",
        sublabel: "Eksplorasi Visual & Filosofi",
        placeholder:
          "Contoh format poin:\n- Penentuan logogram dengan makna kesederhanaan dan profesionalitas\n- Pemilihan palet warna primer dan sekunder yang kontras namun elegan\n- Sistem tipografi modern untuk media cetak dan digital",
      },
      {
        label: "Deliverables & Application",
        sublabel: "Penerapan & Hasil Desain",
        placeholder:
          "Contoh format poin:\n- Brand guidelines lengkap (logo usage, color codes, font rules)\n- Desain stasioneri, kartu nama, packaging, dan media sosial\n- Landing page portofolio studio dengan identitas baru yang kohesif",
      },
    ],
  },
  {
    name: "Commercial Videography & Editing",
    category: "Creative & Multimedia",
    sections: [
      {
        label: "Story & Concept",
        sublabel: "Konsep Cerita & Arahan Visual",
        placeholder:
          "Jelaskan pesan video, tone & mood, storyboard, dan target emosi penonton...",
      },
      {
        label: "Production & Shooting",
        sublabel: "Proses Produksi & Sinematografi",
        placeholder:
          "Contoh format poin:\n- Penggunaan lighting high-key untuk kesan bersih dan dinamis\n- Komposisi framing sinematik dan pergerakan kamera stabil\n- Pengambilan footage B-roll detail produk dan atmosfer lokasi",
      },
      {
        label: "Post-Production & Delivery",
        sublabel: "Editing, Color Grading & Sound",
        placeholder:
          "Contoh format poin:\n- Pacing editing dinamis selaras dengan beat musik latar\n- Color grading khusus untuk menghasilkan tone warna khas dan dramatis\n- Sound design dan mixing audio jernih untuk media sosial dan promosi",
      },
    ],
  },
  {
    name: "Photography Showcase",
    category: "Creative & Multimedia",
    sections: [
      {
        label: "Concept & Context",
        sublabel: "Konsep & Latar Belakang Foto",
        placeholder:
          "Jelaskan momen, tema sesi foto, dan tujuan karya fotografi ini...",
      },
      {
        label: "Style & Execution",
        sublabel: "Gaya Visual, Lighting & Komposisi",
        placeholder:
          "Contoh format poin:\n- Memanfaatkan natural light saat golden hour untuk nuansa hangat\n- Eksplorasi sudut pandang unik dan depth of field sempit\n- Komposisi rule of thirds dan framing alami subjek",
      },
      {
        label: "Post-Processing & Output",
        sublabel: "Retouching & Kurasi Karya",
        placeholder:
          "Contoh format poin:\n- Color grading presisi dengan Adobe Lightroom & Photoshop\n- Retouching kulit dan pencahayaan tanpa menghilangkan tekstur alami\n- Kurasi seri foto terpilih untuk publikasi komersial/editorial",
      },
    ],
  },
]

/**
 * Normalizes any category string (including legacy ones like 'Mobile App', 'Systems', 'Branding')
 * into one of the 3 canonical main categories.
 */
export function normalizeCategory(rawCategory?: string): MainCategory {
  if (!rawCategory) return "Engineering & Tech"

  const trimmed = rawCategory.trim()
  if (MAIN_CATEGORIES.includes(trimmed as MainCategory)) {
    return trimmed as MainCategory
  }

  const lower = trimmed.toLowerCase()

  // UI/UX matches
  if (
    lower.includes("ui") ||
    lower.includes("ux") ||
    lower.includes("experience") ||
    lower.includes("product design") ||
    lower.includes("prototype") ||
    lower.includes("wireframe") ||
    lower.includes("figma")
  ) {
    return "UI/UX & Product Design"
  }

  // Creative & Multimedia matches
  if (
    lower.includes("creative") ||
    lower.includes("media") ||
    lower.includes("multimedia") ||
    lower.includes("brand") ||
    lower.includes("photo") ||
    lower.includes("video") ||
    lower.includes("cinema") ||
    lower.includes("graphic") ||
    lower.includes("art") ||
    lower.includes("visual")
  ) {
    return "Creative & Multimedia"
  }

  // Engineering & Tech matches (default)
  return "Engineering & Tech"
}

/**
 * Parses video URLs (YouTube watch, YouTube Shorts, Vimeo) and returns responsive embed URLs.
 */
export function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null
  const clean = url.trim()

  // YouTube watch / share link
  const watchMatch = clean.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
  )
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${watchMatch[1]}`
  }

  // YouTube Shorts
  const shortsMatch = clean.match(/youtube\.com\/shorts\/([^"&?\/\s]{11})/i)
  if (shortsMatch && shortsMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${shortsMatch[1]}`
  }

  // Vimeo
  const vimeoMatch = clean.match(
    /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)/i,
  )
  if (vimeoMatch && vimeoMatch[3]) {
    return `https://player.vimeo.com/video/${vimeoMatch[3]}`
  }

  return null
}

/**
 * Returns the effective subcategory for a project, with graceful fallback
 * to the raw category or tags if the subcategory column is not yet in the DB.
 */
export function getProjectSubcategory(
  project?: Partial<Project> | null,
): string {
  if (!project) return ""
  if (project.subcategory && project.subcategory.trim()) {
    return project.subcategory.trim()
  }
  const rawCat =
    typeof project.category === "string" ? project.category.trim() : ""
  const canonical = normalizeCategory(rawCat)
  if (rawCat && rawCat !== canonical) {
    return rawCat
  }
  if (
    Array.isArray(project.tags) &&
    project.tags.length > 0 &&
    typeof project.tags[0] === "string"
  ) {
    const firstTag = project.tags[0].trim()
    if (firstTag && firstTag !== canonical) {
      return firstTag
    }
  }
  return ""
}

/**
 * Normalizes project case study sections from DB JSON/JSONB or legacy overview/problem/result columns.
 */
export function normalizeProjectSections(
  sections?: any,
  overview?: string,
  problem?: string,
  result?: string,
): ProjectSection[] {
  let parsed = sections
  if (typeof sections === "string") {
    try {
      parsed = JSON.parse(sections)
    } catch {
      parsed = null
    }
  }

  if (Array.isArray(parsed) && parsed.length > 0) {
    return parsed.map((s, idx) => ({
      id: s.id || (idx < 9 ? `0${idx + 1}` : `${idx + 1}`),
      label: s.label || `Section ${idx + 1}`,
      sublabel: s.sublabel || "",
      content: typeof s.content === "string" ? s.content : "",
    }))
  }

  const list: ProjectSection[] = []
  if (overview && overview.trim()) {
    list.push({
      id: "01",
      label: "Overview",
      sublabel: "Gambaran Umum & Tujuan",
      content: overview,
    })
  }
  if (problem && problem.trim()) {
    list.push({
      id: "02",
      label: "Problem & Architecture",
      sublabel: "Tantangan & Permasalahan",
      content: problem,
    })
  }
  if (result && result.trim()) {
    list.push({
      id: "03",
      label: "Result & Impact",
      sublabel: "Hasil & Solusi",
      content: result,
    })
  }

  if (list.length === 0) {
    return [
      {
        id: "01",
        label: "Overview",
        sublabel: "Gambaran Umum & Tujuan",
        content: "",
      },
      {
        id: "02",
        label: "Problem & Architecture",
        sublabel: "Tantangan & Permasalahan",
        content: "",
      },
      {
        id: "03",
        label: "Result & Impact",
        sublabel: "Hasil & Solusi",
        content: "",
      },
    ]
  }

  return list
}

/**
 * Sorts projects deterministically based on sort_order ascending,
 * falling back to created_at descending if sort_order is not defined.
 */
export function sortProjectsByOrder(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    const orderA =
      typeof a.sort_order === "number" && a.sort_order > 0
        ? a.sort_order
        : 999999
    const orderB =
      typeof b.sort_order === "number" && b.sort_order > 0
        ? b.sort_order
        : 999999
    if (orderA !== orderB) {
      return orderA - orderB
    }
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
    return dateB - dateA
  })
}

export interface ProjectLinks {
  live_url: string
  github_url: string
  video_url: string
  figma_url: string
  instagram_url: string
  drive_url: string
}

/**
 * Extracts all links from project fields, tags fallback prefix (__video:, __figma:, etc.),
 * or smart URL detection (e.g. if live_url is a YouTube link or Figma link).
 */
export function getProjectLinks(
  project?: Partial<Project> | null,
): ProjectLinks {
  const links: ProjectLinks = {
    live_url: project?.live_url?.trim() || "",
    github_url: project?.github_url?.trim() || "",
    video_url: project?.video_url?.trim() || "",
    figma_url: project?.figma_url?.trim() || "",
    instagram_url: project?.instagram_url?.trim() || "",
    drive_url: project?.drive_url?.trim() || "",
  }

  // Parse from tags if encoded as metadata prefix
  if (Array.isArray(project?.tags)) {
    for (const tag of project.tags) {
      if (typeof tag === "string") {
        const trimmed = tag.trim()
        if (trimmed.startsWith("__video:") && !links.video_url) {
          links.video_url = trimmed.slice(8).trim()
        } else if (trimmed.startsWith("__figma:") && !links.figma_url) {
          links.figma_url = trimmed.slice(8).trim()
        } else if (trimmed.startsWith("__insta:") && !links.instagram_url) {
          links.instagram_url = trimmed.slice(8).trim()
        } else if (trimmed.startsWith("__drive:") && !links.drive_url) {
          links.drive_url = trimmed.slice(8).trim()
        } else if (trimmed.startsWith("__github:") && !links.github_url) {
          links.github_url = trimmed.slice(9).trim()
        } else if (trimmed.startsWith("__live:") && !links.live_url) {
          links.live_url = trimmed.slice(7).trim()
        }
      }
    }
  }

  // Smart detection: if live_url or github_url was used to paste a YouTube/Figma/Drive/Instagram link
  if (links.live_url) {
    const lower = links.live_url.toLowerCase()
    if (
      (lower.includes("youtube.com") ||
        lower.includes("youtu.be") ||
        lower.includes("vimeo.com")) &&
      !links.video_url
    ) {
      links.video_url = links.live_url
    } else if (lower.includes("figma.com") && !links.figma_url) {
      links.figma_url = links.live_url
    } else if (
      (lower.includes("instagram.com") || lower.includes("instagr.am")) &&
      !links.instagram_url
    ) {
      links.instagram_url = links.live_url
    } else if (
      (lower.includes("drive.google.com") || lower.includes("dropbox.com")) &&
      !links.drive_url
    ) {
      links.drive_url = links.live_url
    } else if (lower.includes("github.com") && !links.github_url) {
      links.github_url = links.live_url
    }
  }

  return links
}

/**
 * Encodes smart links into tags array so they persist safely even if custom columns do not exist in DB.
 */
export function encodeProjectTags(
  tags: string[],
  links: Partial<ProjectLinks>,
): string[] {
  const cleanTags = tags.filter(
    (t) =>
      typeof t === "string" &&
      !t.startsWith("__video:") &&
      !t.startsWith("__figma:") &&
      !t.startsWith("__insta:") &&
      !t.startsWith("__drive:") &&
      !t.startsWith("__github:") &&
      !t.startsWith("__live:"),
  )

  if (links.video_url && links.video_url.trim()) {
    cleanTags.push(`__video:${links.video_url.trim()}`)
  }
  if (links.figma_url && links.figma_url.trim()) {
    cleanTags.push(`__figma:${links.figma_url.trim()}`)
  }
  if (links.instagram_url && links.instagram_url.trim()) {
    cleanTags.push(`__insta:${links.instagram_url.trim()}`)
  }
  if (links.drive_url && links.drive_url.trim()) {
    cleanTags.push(`__drive:${links.drive_url.trim()}`)
  }

  return cleanTags
}

/**
 * Cleans tags for public display by removing internal metadata prefix tags.
 */
export function getCleanPublicTags(tags?: any): string[] {
  if (!Array.isArray(tags)) return []
  return tags.filter(
    (t) =>
      typeof t === "string" &&
      t.trim() &&
      !t.startsWith("__video:") &&
      !t.startsWith("__figma:") &&
      !t.startsWith("__insta:") &&
      !t.startsWith("__drive:") &&
      !t.startsWith("__github:") &&
      !t.startsWith("__live:"),
  )
}
