import { SupabaseClient } from "@supabase/supabase-js"
import { projects as fallbackProjects, experience as fallbackExperiences } from "@/data/mockData"

export interface MediaUsageLocation {
  type: "cover" | "gallery" | "content" | "profile" | "settings" | "experience"
  sourceName: string
  detail: string
}

export interface MediaUsageInfo {
  isUsed: boolean
  locations: MediaUsageLocation[]
}

/**
 * Extracts a clean normalized filename / identifier from any URL or filename.
 */
export function extractMediaFileName(input?: string | null): string {
  if (!input) return ""
  let clean = String(input).trim()
  if (!clean) return ""

  // Remove query parameters or hash
  clean = clean.split("?")[0].split("#")[0]

  // If it's a Supabase storage URL: .../storage/v1/object/public/media/filename.ext
  const storageMatch = clean.match(
    /\/storage\/v1\/object\/public\/[^\/]+\/(.+)$/i,
  )
  if (storageMatch && storageMatch[1]) {
    clean = storageMatch[1]
  } else {
    // If it's a general URL path, grab the last segment
    const lastSlash = clean.lastIndexOf("/")
    if (lastSlash !== -1) {
      clean = clean.substring(lastSlash + 1)
    }
  }

  try {
    return decodeURIComponent(clean).toLowerCase()
  } catch {
    return clean.toLowerCase()
  }
}

/**
 * Scans all database tables and fallback data to build an exhaustive media usage map.
 */
export async function fetchMediaUsageMap(
  supabase: SupabaseClient,
): Promise<Map<string, MediaUsageInfo>> {
  const usageMap = new Map<string, MediaUsageInfo>()

  const registerUsage = (
    urlOrName: string | null | undefined,
    location: MediaUsageLocation,
  ) => {
    if (!urlOrName) return
    const trimmed = String(urlOrName).trim()
    if (!trimmed) return

    const normalizedName = extractMediaFileName(trimmed)
    if (!normalizedName) return

    // Register by normalized file name
    const existing = usageMap.get(normalizedName) || {
      isUsed: true,
      locations: [],
    }

    const isDuplicate = existing.locations.some(
      (loc) =>
        loc.sourceName === location.sourceName &&
        loc.detail === location.detail,
    )

    if (!isDuplicate) {
      existing.locations.push(location)
    }

    usageMap.set(normalizedName, existing)
    // Also register full URL key as secondary lookup
    usageMap.set(trimmed.toLowerCase(), existing)
  }

  try {
    // 1. Fetch tables with safe select("*")
    const [projectsRes, galleryRes, profilesRes, settingsRes, experienceRes] =
      await Promise.allSettled([
        supabase.from("projects").select("*"),
        supabase.from("project_gallery").select("*"),
        supabase.from("profiles").select("*"),
        supabase.from("site_settings").select("*"),
        supabase.from("experience").select("*"),
      ])

    const projectTitleMap = new Map<string, string>()

    // Determine active projects source (Supabase data or fallback mock data)
    let projectsData: any[] = []
    if (
      projectsRes.status === "fulfilled" &&
      projectsRes.value.data &&
      projectsRes.value.data.length > 0
    ) {
      projectsData = projectsRes.value.data
    } else {
      projectsData = fallbackProjects as any[]
    }

    // Process Projects
    for (const p of projectsData) {
      const pTitle = p.title || "Proyek Tanpa Judul"
      if (p.id) projectTitleMap.set(String(p.id), pTitle)

      // 1. Project Cover
      if (p.cover_url) {
        registerUsage(p.cover_url, {
          type: "cover",
          sourceName: `Proyek: ${pTitle}`,
          detail: "Cover Utama Proyek",
        })
      }

      // 2. Project Gallery (if stored in project object or JSON)
      if (Array.isArray(p.gallery)) {
        p.gallery.forEach((gItem: any, idx: number) => {
          const imgUrl = typeof gItem === "string" ? gItem : gItem?.image_url
          if (imgUrl) {
            registerUsage(imgUrl, {
              type: "gallery",
              sourceName: `Proyek: ${pTitle}`,
              detail: `Galeri #${idx + 1}${gItem?.title ? ` (${gItem.title})` : ""}`,
            })
          }
        })
      } else if (typeof p.gallery === "string" && p.gallery.startsWith("[")) {
        try {
          const parsed = JSON.parse(p.gallery)
          if (Array.isArray(parsed)) {
            parsed.forEach((gItem: any, idx: number) => {
              const imgUrl = typeof gItem === "string" ? gItem : gItem?.image_url
              if (imgUrl) {
                registerUsage(imgUrl, {
                  type: "gallery",
                  sourceName: `Proyek: ${pTitle}`,
                  detail: `Galeri #${idx + 1}${gItem?.title ? ` (${gItem.title})` : ""}`,
                })
              }
            })
          }
        } catch {}
      }

      // 3. Project Content (overview, problem, result, sections)
      const checkTextForImages = (
        content: string | undefined,
        sectionLabel: string,
      ) => {
        if (!content) return
        const imageRegex = /!\[.*?\]\((.*?)\)|(?:src|href)=["'](.*?)["']/gi
        let match: RegExpExecArray | null
        while ((match = imageRegex.exec(content)) !== null) {
          const matchedUrl = match[1] || match[2]
          if (matchedUrl) {
            registerUsage(matchedUrl, {
              type: "content",
              sourceName: `Proyek: ${pTitle}`,
              detail: `Konten ${sectionLabel}`,
            })
          }
        }
      }

      checkTextForImages(p.overview, "Overview")
      checkTextForImages(p.problem, "Problem")
      checkTextForImages(p.result, "Result")

      if (Array.isArray(p.sections)) {
        p.sections.forEach((sec: any, idx: number) => {
          checkTextForImages(
            sec?.content,
            sec?.label || `Section ${idx + 1}`,
          )
        })
      }
    }

    // 2. Dedicated project_gallery Table
    if (galleryRes.status === "fulfilled" && galleryRes.value.data) {
      for (const g of galleryRes.value.data) {
        const pTitle =
          projectTitleMap.get(String(g.project_id)) || "Proyek Terhubung"
        if (g.image_url) {
          registerUsage(g.image_url, {
            type: "gallery",
            sourceName: `Proyek: ${pTitle}`,
            detail: `Galeri${g.title ? ` (${g.title})` : ""}`,
          })
        }
      }
    }

    // 3. Profiles (About page / Avatar / Portrait)
    let profilesData: any[] = []
    if (
      profilesRes.status === "fulfilled" &&
      profilesRes.value.data &&
      profilesRes.value.data.length > 0
    ) {
      profilesData = profilesRes.value.data
    }

    for (const prof of profilesData) {
      const name = prof.display_name || prof.full_name || "Profil Admin"

      // Check portrait_url (JSON or string)
      if (prof.portrait_url) {
        if (typeof prof.portrait_url === "string" && prof.portrait_url.startsWith("{")) {
          try {
            const parsed = JSON.parse(prof.portrait_url)
            if (parsed.home) {
              registerUsage(parsed.home, {
                type: "profile",
                sourceName: name,
                detail: "Foto Beranda (Home Portrait)",
              })
            }
            if (parsed.about) {
              registerUsage(parsed.about, {
                type: "profile",
                sourceName: name,
                detail: "Foto Tentang Saya (About Portrait)",
              })
            }
          } catch {}
        } else {
          registerUsage(prof.portrait_url, {
            type: "profile",
            sourceName: name,
            detail: "Foto Profil",
          })
        }
      }

      if (prof.avatar_url) {
        registerUsage(prof.avatar_url, {
          type: "profile",
          sourceName: name,
          detail: "Avatar Profil",
        })
      }
    }

    // 4. Site Settings (Logo, Favicon, CV)
    if (settingsRes.status === "fulfilled" && settingsRes.value.data) {
      for (const setting of settingsRes.value.data) {
        if (setting.avatar_url) {
          registerUsage(setting.avatar_url, {
            type: "settings",
            sourceName: "Pengaturan Website",
            detail: "Avatar Utama",
          })
        }
        if (setting.site_logo) {
          registerUsage(setting.site_logo, {
            type: "settings",
            sourceName: "Pengaturan Website",
            detail: "Logo Website",
          })
        }
        if (setting.favicon_url) {
          registerUsage(setting.favicon_url, {
            type: "settings",
            sourceName: "Pengaturan Website",
            detail: "Favicon",
          })
        }
      }
    }

    // 5. Experience (Company Logos)
    let experienceData: any[] = []
    if (
      experienceRes.status === "fulfilled" &&
      experienceRes.value.data &&
      experienceRes.value.data.length > 0
    ) {
      experienceData = experienceRes.value.data
    } else if (Array.isArray(fallbackExperiences)) {
      experienceData = fallbackExperiences
    }

    for (const exp of experienceData) {
      const company = exp.company || exp.role || "Pengalaman Kerja"
      if (exp.company_logo) {
        registerUsage(exp.company_logo, {
          type: "experience",
          sourceName: `Pengalaman: ${company}`,
          detail: "Logo Perusahaan",
        })
      }
      if (exp.logo_url) {
        registerUsage(exp.logo_url, {
          type: "experience",
          sourceName: `Pengalaman: ${company}`,
          detail: "Logo Instansi",
        })
      }
    }
  } catch (err) {
    console.error("Error building media usage map:", err)
  }

  return usageMap
}

/**
 * Checks whether a given media item (by filename or URL) is in use.
 */
export function getMediaUsage(
  filenameOrUrl: string,
  usageMap: Map<string, MediaUsageInfo>,
): MediaUsageInfo {
  if (!filenameOrUrl) return { isUsed: false, locations: [] }

  const cleanInput = filenameOrUrl.trim().toLowerCase()
  const normalizedName = extractMediaFileName(cleanInput)

  // 1. Check normalized filename
  if (normalizedName && usageMap.has(normalizedName)) {
    return usageMap.get(normalizedName)!
  }

  // 2. Check full URL
  if (usageMap.has(cleanInput)) {
    return usageMap.get(cleanInput)!
  }

  return { isUsed: false, locations: [] }
}
