import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import PublicLayout from "@/layouts/public/PublicLayout"
import { WorkSkeleton } from "@/components/common/Skeleton"
import SafeImage from "@/components/common/SafeImage"
import LaptopMockup from "@/components/common/LaptopMockup"
import InstagramPostMockup, { SlideItem } from "@/components/common/InstagramPostMockup"
import LogoMatrixGrid, { LogoItem } from "@/components/common/LogoMatrixGrid"
import PhotographyShowcase from "@/components/common/PhotographyShowcase"
import { getSupabaseClient } from "@/lib/supabase"
import { projects as mockProjects } from "@/data/mockData"
import {
  MAIN_CATEGORIES,
  MainCategory,
  normalizeCategory,
  getProjectSubcategory,
  normalizeGallery,
  sortProjectsByOrder,
  getProjectLinks,
  getYouTubeEmbedUrl,
  Project,
  GalleryItem,
} from "@/types/project"

const supabase = getSupabaseClient()

function getLogoInitials(name: string) {
  const clean = name.replace(/^(Logo|Brand|Mark)\s+/i, "").trim()
  const words = clean.split(/\s+/)
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return (clean.slice(0, 2) || "LP").toUpperCase()
}

function getYouTubeThumb(url?: string): string | null {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11
    ? `https://img.youtube.com/vi/${match[2]}/mqdefault.jpg`
    : null
}

/** Small reusable card for logo marquee – rendered twice for seamless infinite loop */
function LogoCard({
  logo,
  "aria-hidden": ariaHidden,
}: {
  logo: {
    id?: string
    name: string
    logoUrl?: string
    industry?: string
    conceptNote?: string
  }
  "aria-hidden"?: "true"
}) {
  return (
    <div
      className="shrink-0 w-56 sm:w-64 border rounded-xl p-4 bg-white flex flex-col justify-between hover:shadow-md hover:border-black/50 transition-all duration-300"
      style={{ borderColor: "var(--color-border)" }}
      aria-hidden={ariaHidden}
    >
      <div className="aspect-square w-full rounded-lg overflow-hidden bg-[#FAF9F7] flex items-center justify-center p-4 mb-3 border border-stone-100">
        {logo.logoUrl ? (
          <SafeImage
            src={logo.logoUrl}
            alt={logo.name}
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-stone-900 text-white flex flex-col items-center justify-center font-mono font-bold shadow-xs">
            <span className="text-xl tracking-widest leading-none">
              {getLogoInitials(logo.name)}
            </span>
            <span className="text-[8px] uppercase tracking-wider text-stone-400 mt-1">
              Mark
            </span>
          </div>
        )}
      </div>
      <div>
        <span className="font-mono text-[10px] text-gray-400 block mb-1">
          {logo.industry || "Visual Identity"}
        </span>
        <h4
          className="font-sans font-bold text-sm"
          style={{ color: "var(--color-ink)" }}
        >
          {logo.name}
        </h4>
        {logo.conceptNote && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {logo.conceptNote}
          </p>
        )}
      </div>
    </div>
  )
}

export default function Work() {
  const [projects, setProjects] = useState<Project[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("Semua")
  const [activeSubcategory, setActiveSubcategory] = useState<string>("Semua")
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Supabase fetch timeout")), 2500),
      )
      const fetchPromise = supabase
        .from("projects")
        .select("*, project_gallery(*)")
        .eq("status", "published")
        .order("created_at", { ascending: false })

      const { data }: any = await Promise.race([fetchPromise, timeoutPromise])

      if (data && data.length > 0) {
        const formatted: Project[] = data.map((p: any) => {
          const links = getProjectLinks(p)
          return {
            ...p,
            category: normalizeCategory(p.category),
            subcategory: getProjectSubcategory(p),
            video_url: links.video_url || p.video_url || "",
            live_url: links.live_url || p.live_url || "",
            figma_url: links.figma_url || p.figma_url || "",
            instagram_url: links.instagram_url || p.instagram_url || "",
            drive_url: links.drive_url || p.drive_url || "",
            github_url: links.github_url || p.github_url || "",
            gallery: normalizeGallery(
              Array.isArray(p.project_gallery) && p.project_gallery.length > 0
                ? p.project_gallery
                : p.gallery,
              p.tags,
            ),
          }
        })
        setProjects(sortProjectsByOrder(formatted))
      } else {
        const sortedMock = mockProjects.map((p) => {
          const links = getProjectLinks(p)
          return {
            ...p,
            category: normalizeCategory(p.category),
            subcategory: getProjectSubcategory(p),
            video_url: links.video_url || p.video_url || "",
            live_url: links.live_url || p.live_url || "",
            figma_url: links.figma_url || p.figma_url || "",
            instagram_url: links.instagram_url || p.instagram_url || "",
            drive_url: links.drive_url || p.drive_url || "",
            github_url: links.github_url || p.github_url || "",
            gallery: normalizeGallery(p.gallery, p.tags),
          }
        })
        setProjects(sortProjectsByOrder(sortedMock))
      }
    } catch (e) {
      console.warn("Fallback to mock projects:", e)
      const sortedMock = mockProjects.map((p) => {
        const links = getProjectLinks(p)
        return {
          ...p,
          category: normalizeCategory(p.category),
          subcategory: getProjectSubcategory(p),
          video_url: links.video_url || p.video_url || "",
          live_url: links.live_url || p.live_url || "",
          figma_url: links.figma_url || p.figma_url || "",
          instagram_url: links.instagram_url || p.instagram_url || "",
          drive_url: links.drive_url || p.drive_url || "",
          github_url: links.github_url || p.github_url || "",
          gallery: normalizeGallery(p.gallery, p.tags),
        }
      })
      setProjects(sortProjectsByOrder(sortedMock))
    }
    setLoading(false)
  }

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat)
    setActiveSubcategory("Semua")
  }

  // Filter logic: match main category and optionally subcategory
  const categoryFiltered =
    activeCategory === "Semua"
      ? projects
      : projects.filter((p) => normalizeCategory(p.category) === activeCategory)

  // Compute available subcategories for the active main category
  const availableSubcategories = [
    "Semua",
    ...Array.from(
      new Set(
        categoryFiltered
          .map((p) => getProjectSubcategory(p))
          .filter(Boolean),
      ),
    ),
  ]

  const filtered = categoryFiltered.filter((p) => {
    if (activeSubcategory === "Semua") return true
    return getProjectSubcategory(p) === activeSubcategory
  })

  const filterTabs = ["Semua", ...MAIN_CATEGORIES]

  // Highlight 1: Desain Grafis & Identitas Visual
  const logoProject = projects.find(
    (p) =>
      p.slug === "desain-identitas-visual" ||
      getProjectSubcategory(p).toLowerCase().includes("visual identity") ||
      getProjectSubcategory(p).toLowerCase().includes("logo"),
  )
  const feedsProject = projects.find(
    (p) =>
      p.slug === "sosial-media-post-feeds" ||
      getProjectSubcategory(p).toLowerCase().includes("social") ||
      getProjectSubcategory(p).toLowerCase().includes("content design"),
  )

  // Extract logo items for inline preview (tanpa cover fallback)
  const previewLogoItems: LogoItem[] = (() => {
    if (!logoProject) return []
    const normalized = normalizeGallery(logoProject.gallery, logoProject.tags)
    const items = normalized
      .map((item, idx) => ({
        id: item.id || `logo-prev-${idx}`,
        name: item.title || `Brand Mark ${idx + 1}`,
        logoUrl: item.image_url,
        industry: item.caption?.split("·")[0]?.trim() || "Visual Identity",
        conceptNote: item.caption,
        year: logoProject.year,
        bgTone: idx % 3 === 0 ? "light" : idx % 3 === 1 ? "cream" : "dark",
      }))
      .filter((it) => Boolean(it.name))

    return items
  })()

  // Extract Instagram slides for inline preview (rasio 1080 × 1350, tanpa cover fallback)
  const previewSlides: SlideItem[] = (() => {
    if (!feedsProject) return []
    const normalized = normalizeGallery(feedsProject.gallery, feedsProject.tags)
    const slides = normalized
      .map((item, idx) => ({
        imageUrl: item.image_url,
        alt: item.title || `Slide ${idx + 1}`,
        title: item.title || `Slide ${idx + 1}`,
        caption: item.caption || "",
      }))
      .filter((s) => Boolean(s.imageUrl))

    return slides
  })()

  const [activeDesignSlide, setActiveDesignSlide] = useState<number>(0)
  const currentDesignSlide =
    previewSlides[activeDesignSlide] ||
    previewSlides[0] || { imageUrl: "", title: "", caption: "" }

  // Auto-advance feed slides scroll animation with hover pause
  const [isFeedHovered, setIsFeedHovered] = useState(false)
  useEffect(() => {
    if (previewSlides.length <= 1 || isFeedHovered) return
    const timer = setInterval(() => {
      setActiveDesignSlide((prev) => (prev + 1) % previewSlides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [previewSlides.length, isFeedHovered])

  const designProjects = [logoProject, feedsProject].filter(Boolean) as Project[]

  // Auto-scroll logic for Brand Identity / Logo Marks
  const logoScrollRef = useRef<HTMLDivElement | null>(null)
  const [isLogoPaused, setIsLogoPaused] = useState(false)

  // Logo marquee: track hover/touch pause only (CSS handles the animation)
  const scrollLogo = (direction: "left" | "right") => {
    const el = logoScrollRef.current
    if (!el) return
    const offset = direction === "left" ? -300 : 300
    el.scrollBy({ left: offset, behavior: "smooth" })
  }

  // Highlight 2: Fotografi Komersial (Tampilkan SEMUA karya foto tanpa batasan slice)
  const photoProjects = projects.filter(
    (p) =>
      p.slug === "fotografi-dokumentasi-visual" ||
      getProjectSubcategory(p).toLowerCase().includes("photo") ||
      getProjectSubcategory(p).toLowerCase().includes("fotografi"),
  )
  const featuredPhotos: GalleryItem[] = (() => {
    const all = photoProjects.flatMap((p) =>
      normalizeGallery(p.gallery, p.tags),
    )
    const seen = new Set<string>()
    return all.filter((item) => {
      const key = item.image_url || item.id || ""
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })
  })()

  // Highlight 3: Video Production & Reels
  const primaryVideoProject = projects.find(
    (p) =>
      p.slug === "video-profil-kelurahan-kepil-kpm-unsiq-2025" ||
      getProjectSubcategory(p).toLowerCase().includes("video") ||
      Boolean(p.video_url),
  )

  const videoProjects = projects.filter((p) => {
    const sub = getProjectSubcategory(p).toLowerCase()
    return (
      (sub.includes("video") || sub.includes("reels") || Boolean(p.video_url)) &&
      p.slug !== primaryVideoProject?.slug
    )
  }).slice(0, 3)

  // Active Video in Laptop Frame
  const [activeVideo, setActiveVideo] = useState({
    title: "Video Profil Kelurahan Kepil",
    embedUrl: "https://www.youtube-nocookie.com/embed/rGq-UYb1Wpk",
    urlBarText: "youtube.com/watch?v=rGq-UYb1Wpk",
    meta: "🎬 Video Profil Kelurahan Kepil · KPM UNSIQ 2026 · DoP & Editor: Muhammad Azizi",
  })

  // Synchronize initial primary video if custom url loaded from Supabase
  useEffect(() => {
    if (primaryVideoProject?.video_url) {
      const embed = getYouTubeEmbedUrl(primaryVideoProject.video_url)
      if (embed) {
        setActiveVideo({
          title: primaryVideoProject.title,
          embedUrl: embed,
          urlBarText: primaryVideoProject.video_url.replace(/^https?:\/\/(www\.)?/, ""),
          meta: `🎬 ${primaryVideoProject.title} · ${primaryVideoProject.year || "2026"} · ${primaryVideoProject.role || "DoP & Editor"}`,
        })
      }
    }
  }, [primaryVideoProject?.video_url, primaryVideoProject?.title])

  // Highlight project IDs so we don't duplicate them in Proyek Lain
  const highlightSlugs = new Set([
    "desain-identitas-visual",
    "sosial-media-post-feeds",
    "fotografi-dokumentasi-visual",
    "video-profil-kelurahan-kepil-kpm-unsiq-2025",
    ...(primaryVideoProject ? [primaryVideoProject.slug] : []),
    ...videoProjects.map((v) => v.slug),
  ])

  // "Proyek Lain" = All projects not in primary highlights, or categorized archive
  const otherProjects = projects.filter((p) => !highlightSlugs.has(p.slug))

  const filteredOtherProjects =
    activeCategory === "Semua"
      ? otherProjects
      : otherProjects.filter((p) => normalizeCategory(p.category) === activeCategory)

  if (loading) {
    return <WorkSkeleton />
  }

  return (
    <PublicLayout>
      <div
        style={{ backgroundColor: "var(--color-paper)", minHeight: "100vh" }}
      >
        <section className="max-w-[1440px] mx-auto px-6 md:px-16 pt-36 md:pt-44 pb-20">
          {/* Headline */}
          <div className="mb-10 md:mb-14">
            <p
              className="font-mono text-xs tracking-widest uppercase mb-3"
              style={{ color: "var(--color-muted)", letterSpacing: "0.14em" }}
            >
              Koleksi Proyek
            </p>
            <h1
              className="font-sans font-bold leading-none mb-4"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                letterSpacing: "-0.04em",
                color: "var(--color-ink)",
              }}
            >
              Proyek &amp;{" "}
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontVariationSettings: '"opsz" 60',
                }}
              >
                Karya Kreatif
              </span>
            </h1>
            <p
              className="text-sm md:text-base max-w-2xl leading-relaxed mb-6"
              style={{
                color: "var(--color-muted)",
                fontFamily: "var(--font-sans)",
              }}
            >
              Showcase langsung karya unggulan Desain Grafis, Fotografi Komersial,
              dan Produksi Video / Reels — disusul arsip proyek digital dan sistem lainnya.
            </p>

            {/* Quick Anchor Navigation */}
            <div className="flex flex-wrap gap-2 pt-2">
              <a
                href="#highlight-desain"
                className="font-mono text-xs px-3 py-1.5 rounded-full border bg-white hover:bg-black hover:text-white transition-all shadow-2xs"
                style={{ borderColor: "var(--color-border)", color: "var(--color-ink)" }}
              >
                ✦ Desain &amp; Identitas Visual
              </a>
              <a
                href="#highlight-fotografi"
                className="font-mono text-xs px-3 py-1.5 rounded-full border bg-white hover:bg-black hover:text-white transition-all shadow-2xs"
                style={{ borderColor: "var(--color-border)", color: "var(--color-ink)" }}
              >
                📷 Fotografi Komersial
              </a>
              <a
                href="#highlight-video"
                className="font-mono text-xs px-3 py-1.5 rounded-full border bg-white hover:bg-black hover:text-white transition-all shadow-2xs"
                style={{ borderColor: "var(--color-border)", color: "var(--color-ink)" }}
              >
                ▶ Video &amp; Sinematografi
              </a>
              <a
                href="#proyek-lain"
                className="font-mono text-xs px-3 py-1.5 rounded-full border bg-stone-100 hover:bg-black hover:text-white transition-all shadow-2xs"
                style={{ borderColor: "var(--color-border)", color: "var(--color-muted)" }}
              >
                📂 Proyek Lain ({otherProjects.length})
              </a>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              01. DIRECT HIGHLIGHT: DESAIN GRAFIS & IDENTITAS VISUAL
          ══════════════════════════════════════════════════════════════════════ */}
          {/* ══════════════════════════════════════════════════════════════════════
              01. DIRECT HIGHLIGHT: DESAIN GRAFIS & SOCIAL MEDIA FEEDS
          ══════════════════════════════════════════════════════════════════════ */}
          <section id="highlight-desain" className="mb-24 pt-8 border-t" style={{ borderColor: "var(--color-border)" }}>
            <div className="mb-8">
              <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-amber-100 text-amber-900 inline-block mb-2">
                01 · Visual Design &amp; Content Systems
              </span>
              <h2
                className="font-sans font-bold text-2xl sm:text-3xl md:text-4xl"
                style={{ color: "var(--color-ink)", letterSpacing: "-0.03em" }}
              >
                Desain Feeds Media Sosial &amp; Identitas Visual
              </h2>
              <p className="text-xs sm:text-sm mt-1 max-w-2xl" style={{ color: "var(--color-muted)" }}>
                Eksplorasi karya perancangan visual feed Instagram (rasio 1080 × 1350) dalam frame handphone dengan narasi per-slide yang sinkron, disusul logo marks dan sistem identitas brand.
              </p>
            </div>

            {/* A. Social Media Feeds: Phone Mockup (1080x1350) + Dynamic Synchronized Side Explanation Panel */}
            {feedsProject && previewSlides.length > 0 && (
              <div
                className="mb-14 p-6 md:p-8 rounded-2xl border bg-[#FAF9F7] transition-all"
                style={{ borderColor: "var(--color-border)" }}
                onMouseEnter={() => setIsFeedHovered(true)}
                onMouseLeave={() => setIsFeedHovered(false)}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Left Column: Phone Mockup with 1080x1350 ratio */}
                  <div className="lg:col-span-5 flex flex-col items-center gap-2">
                    <InstagramPostMockup
                      slides={previewSlides}
                      activeSlideIndex={activeDesignSlide}
                      onSlideChange={setActiveDesignSlide}
                      caption={currentDesignSlide.caption || feedsProject.description}
                      brandTag={feedsProject.title}
                      accountName="Layar Putih Studio"
                      accountHandle="layarputih.studio"
                      maxWidth="420px"
                    />
                    <span className="font-mono text-[10px] text-stone-400 mt-1">
                      {isFeedHovered ? "⏸ Slideshow Dijeda" : "▶ Slide Otomatis Aktif"}
                    </span>
                  </div>

                  {/* Right Column: Dynamic Slide-Synchronized Narrative Panel */}
                  <div className="lg:col-span-7 flex flex-col gap-5">
                    <div className="p-6 md:p-8 rounded-2xl border bg-white shadow-xs" style={{ borderColor: "var(--color-border)" }}>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b" style={{ borderColor: "var(--color-border-light)" }}>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-pink-100 text-pink-700">
                            📸 Social Media Feeds
                          </span>
                          <span className="font-mono text-xs text-gray-400">
                            Rasio 1080 × 1350 (4:5)
                          </span>
                        </div>
                        {previewSlides.length > 1 && (
                          <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-black text-white">
                            Slide {activeDesignSlide + 1} / {previewSlides.length}
                          </span>
                        )}
                      </div>

                      {/* Dynamic Title for Active Slide */}
                      <h3 className="font-sans font-bold text-xl sm:text-2xl mb-2.5" style={{ color: "var(--color-ink)" }}>
                        {currentDesignSlide.title || feedsProject.title}
                      </h3>

                      {/* Dynamic Explanation / Caption for Active Slide (Customizable via Admin) */}
                      <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--color-muted)" }}>
                        {currentDesignSlide.caption || feedsProject.description}
                      </p>

                      {/* Minimalis Slide Navigation Strip */}
                      {previewSlides.length > 1 && (
                        <div className="pt-4 border-t" style={{ borderColor: "var(--color-border-light)" }}>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-stone-400 font-semibold">
                              Slide
                            </span>
                            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                              {activeDesignSlide + 1} / {previewSlides.length}
                            </span>
                          </div>
                          {/* Horizontal scroll strip of compact slide thumbnails */}
                          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1" style={{ scrollbarWidth: "none" }}>
                            {previewSlides.map((slide, sIdx) => {
                              const isActive = activeDesignSlide === sIdx
                              return (
                                <button
                                  key={sIdx}
                                  type="button"
                                  onClick={() => setActiveDesignSlide(sIdx)}
                                  title={slide.title || `Slide #${sIdx + 1}`}
                                  className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-mono transition-all duration-200 cursor-pointer whitespace-nowrap ${
                                    isActive
                                      ? "bg-stone-900 text-white border-stone-900 font-semibold"
                                      : "bg-stone-50 text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-700"
                                  }`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? "bg-emerald-400" : "bg-stone-300"}`} />
                                  <span className="max-w-[96px] truncate">{slide.title || `#${sIdx + 1}`}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Metadata Row */}
                      <div className="mt-5 pt-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-gray-500" style={{ borderColor: "var(--color-border-light)" }}>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-black">Peran:</span>
                          <span>{feedsProject.role || "Graphic Designer & Content Strategist"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-black">Tahun:</span>
                          <span>{feedsProject.year || "2024 - 2026"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* B. Brand Identity & Logo Marks Showcase with Horizontal Auto-Scroll */}
            {logoProject && previewLogoItems.length > 0 && (
              <div
                className="pt-4"
                onMouseEnter={() => setIsLogoPaused(true)}
                onMouseLeave={() => setIsLogoPaused(false)}
                onTouchStart={() => setIsLogoPaused(true)}
                onTouchEnd={() => setIsLogoPaused(false)}
              >
                <div className="mb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 inline-block mb-1.5">
                      ✦ Brandmarks &amp; Identity
                    </span>
                    <h3 className="font-sans font-bold text-xl sm:text-2xl" style={{ color: "var(--color-ink)" }}>
                      Koleksi Logo &amp; Identitas Visual
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 max-w-xl">
                      Perancangan simbol visual, tipografi identitas, dan perancangan logo institusional &amp; komersial.
                    </p>
                  </div>

                  {/* Logo Auto-Scroll Status & Nav Controls */}
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full border border-stone-200">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isLogoPaused
                            ? "bg-amber-400"
                            : "bg-emerald-500 animate-pulse"
                        }`}
                      />
                      <span>{isLogoPaused ? "Dijeda" : "Auto-Scroll Aktif"}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => scrollLogo("left")}
                        className="w-7 h-7 rounded-lg border border-stone-300 bg-white hover:bg-black hover:text-white hover:border-black text-stone-800 transition-all flex items-center justify-center cursor-pointer shadow-2xs active:scale-95 text-xs font-bold"
                        aria-label="Geser logo ke kiri"
                        title="Geser Kiri"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollLogo("right")}
                        className="w-7 h-7 rounded-lg border border-stone-300 bg-white hover:bg-black hover:text-white hover:border-black text-stone-800 transition-all flex items-center justify-center cursor-pointer shadow-2xs active:scale-95 text-xs font-bold"
                        aria-label="Geser logo ke kanan"
                        title="Geser Kanan"
                      >
                        →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Logo Infinite Marquee - CSS animation, seamless loop */}
                <div className="relative w-full overflow-hidden">
                  {/* Fade edges */}
                  <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-[var(--color-paper,#FAF9F6)] to-transparent pointer-events-none z-10" />
                  <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[var(--color-paper,#FAF9F6)] to-transparent pointer-events-none z-10" />

                  {/* The marquee track: two copies of the items side by side */}
                  <div
                    className="flex gap-4 pb-4 pt-1"
                    style={{
                      animation: `logo-marquee ${Math.max(18, previewLogoItems.length * 4)}s linear infinite`,
                      animationPlayState: isLogoPaused ? "paused" : "running",
                      width: "max-content",
                    }}
                  >
                    {/* First copy */}
                    {previewLogoItems.map((logo, li) => (
                      <LogoCard key={`a-${logo.id || li}`} logo={logo} />
                    ))}
                    {/* Second copy (seamless loop) */}
                    {previewLogoItems.map((logo, li) => (
                      <LogoCard key={`b-${logo.id || li}`} logo={logo} aria-hidden="true" />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* ══════════════════════════════════════════════════════════════════════
              02. DIRECT HIGHLIGHT: FOTOGRAFI & DOKUMENTASI VISUAL
          ══════════════════════════════════════════════════════════════════════ */}
          <section id="highlight-fotografi" className="mb-24 pt-8 border-t" style={{ borderColor: "var(--color-border)" }}>
            <div className="mb-8">
              <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-emerald-100 text-emerald-900 inline-block mb-2">
                02 · Photography &amp; Visual Storytelling
              </span>
              <h2
                className="font-sans font-bold text-2xl sm:text-3xl md:text-4xl"
                style={{ color: "var(--color-ink)", letterSpacing: "-0.03em" }}
              >
                Fotografi &amp; Dokumentasi Komersial
              </h2>
              <p className="text-xs sm:text-sm mt-1 max-w-2xl" style={{ color: "var(--color-muted)" }}>
                Koleksi visual editorial, human interest, dan liputan acara berskala besar dengan penguasaan pencahayaan alami dan color grading warm earthy. Disajikan dalam rasio alami tanpa pemotongan gambar yang tidak sesuai.
              </p>
            </div>

            {/* Flexible Animated Photography Showcase */}
            <PhotographyShowcase
              photos={featuredPhotos}
              autoPlayInterval={3500}
              onPhotoZoom={(photo) => setSelectedPhoto(photo)}
            />
          </section>

          {/* ══════════════════════════════════════════════════════════════════════
              03. DIRECT HIGHLIGHT: VIDEO EDITING & SINEMATOGRAFI
          ══════════════════════════════════════════════════════════════════════ */}
          <section id="highlight-video" className="mb-24 pt-8 border-t" style={{ borderColor: "var(--color-border)" }}>
            <div className="mb-8">
              <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-red-100 text-red-900 inline-block mb-2">
                03 · Cinematography &amp; Video Production
              </span>
              <h2
                className="font-sans font-bold text-2xl sm:text-3xl md:text-4xl"
                style={{ color: "var(--color-ink)", letterSpacing: "-0.03em" }}
              >
                Produksi Video, Dokumenter &amp; Reels
              </h2>
              <p className="text-xs sm:text-sm mt-1 max-w-2xl" style={{ color: "var(--color-muted)" }}>
                Produksi audio visual sinematik: video profil wilayah, serial podcast edukasi K-12, dan video pendek short-form. Langsung dapat ditonton melalui display frame laptop di bawah.
              </p>
            </div>

            {/* Video Showcase featuring Laptop Mockup + Video Switcher */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Laptop Frame Column */}
              <div className="lg:col-span-8 flex flex-col gap-2">
                <LaptopMockup
                  videoEmbedUrl={activeVideo.embedUrl}
                  urlBarText={activeVideo.urlBarText}
                  alt={activeVideo.title}
                  maxWidth="100%"
                />
                <div className="px-1 pt-1 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-mono text-gray-500">
                    {activeVideo.meta}
                  </p>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-red-50 text-red-700 font-semibold border border-red-200">
                    ▶ Sedang Diputar di Laptop
                  </span>
                </div>
              </div>

              {/* Video Playlist Cards (Clicking switches the video in Laptop Frame) */}
              <div className="lg:col-span-4 flex flex-col gap-3">
                <p className="font-mono text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Pilih Video Lain:
                </p>

                {/* Primary video card option */}
                {primaryVideoProject && (
                  <div
                    onClick={() => {
                      const effectiveUrl =
                        primaryVideoProject.video_url ||
                        primaryVideoProject.live_url ||
                        getProjectLinks(primaryVideoProject).video_url ||
                        "https://www.youtube-nocookie.com/embed/rGq-UYb1Wpk"
                      const embed =
                        getYouTubeEmbedUrl(effectiveUrl) || effectiveUrl
                      setActiveVideo({
                        title: primaryVideoProject.title,
                        embedUrl: embed,
                        urlBarText: effectiveUrl.replace(/^https?:\/\/(www\.)?/, "") || "youtube.com",
                        meta: `🎬 ${primaryVideoProject.title} · ${primaryVideoProject.year} · ${primaryVideoProject.role || "Video Production"}`,
                      })
                    }}
                    className={`group rounded-xl border p-2.5 flex gap-3 items-center cursor-pointer transition-all ${
                      activeVideo.title === primaryVideoProject.title
                        ? "bg-stone-100 border-black shadow-xs ring-1 ring-black"
                        : "bg-white hover:bg-stone-50 border-stone-200"
                    }`}
                  >
                    <div className="w-24 h-16 rounded-lg overflow-hidden bg-black shrink-0 relative">
                      {getYouTubeThumb(primaryVideoProject.video_url || primaryVideoProject.live_url) || primaryVideoProject.cover_url ? (
                        <SafeImage
                          src={
                            getYouTubeThumb(primaryVideoProject.video_url || primaryVideoProject.live_url) ||
                            primaryVideoProject.cover_url
                          }
                          alt={primaryVideoProject.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-stone-900 text-stone-400 font-mono text-[10px]">
                          🎬 Video
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">
                          ▶
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-[10px] text-gray-400 block mb-0.5">
                        {primaryVideoProject.year} · {primaryVideoProject.role || "Video Editor"}
                      </span>
                      <h4 className="font-sans font-bold text-xs line-clamp-2" style={{ color: "var(--color-ink)" }}>
                        {primaryVideoProject.title}
                      </h4>
                    </div>
                  </div>
                )}

                {videoProjects.map((vp) => {
                  const isCurrent = activeVideo.title === vp.title
                  const vpThumb =
                    getYouTubeThumb(vp.video_url || vp.live_url || getProjectLinks(vp).video_url) ||
                    vp.cover_url

                  return (
                    <div
                      key={vp.id}
                      onClick={() => {
                        const effectiveUrl =
                          vp.video_url ||
                          vp.live_url ||
                          getProjectLinks(vp).video_url ||
                          ""
                        const embed =
                          getYouTubeEmbedUrl(effectiveUrl) || effectiveUrl
                        setActiveVideo({
                          title: vp.title,
                          embedUrl: embed,
                          urlBarText: effectiveUrl.replace(/^https?:\/\/(www\.)?/, "") || "youtube.com",
                          meta: `🎬 ${vp.title} · ${vp.year} · ${vp.role || "Video Editor"}`,
                        })
                      }}
                      className={`group rounded-xl border p-2.5 flex gap-3 items-center cursor-pointer transition-all ${
                        isCurrent
                          ? "bg-stone-100 border-black shadow-xs ring-1 ring-black"
                          : "bg-white hover:bg-stone-50 border-stone-200"
                      }`}
                    >
                      <div className="w-24 h-16 rounded-lg overflow-hidden bg-black shrink-0 relative">
                        {vpThumb ? (
                          <SafeImage
                            src={vpThumb}
                            alt={vp.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-stone-900 text-stone-400 font-mono text-[10px]">
                            🎬 Video
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">
                            ▶
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-mono text-[10px] text-gray-400 block mb-0.5">
                          {vp.year} · {vp.role || "Video Editor"}
                        </span>
                        <h4 className="font-sans font-bold text-xs line-clamp-2" style={{ color: "var(--color-ink)" }}>
                          {vp.title}
                        </h4>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════════
              04. PROYEK LAIN (ARSIP & DIGITAL SYSTEMS / UI UX / ENGINEERING)
          ══════════════════════════════════════════════════════════════════════ */}
          <section id="proyek-lain" className="pt-10 border-t" style={{ borderColor: "var(--color-border)" }}>
            <div className="mb-8">
              <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-stone-200 text-stone-800 inline-block mb-2">
                04 · Archive &amp; Digital Solutions
              </span>
              <h2
                className="font-sans font-bold text-2xl sm:text-3xl md:text-4xl mb-2"
                style={{ color: "var(--color-ink)", letterSpacing: "-0.03em" }}
              >
                Proyek Lain &amp; Eksplorasi Digital
              </h2>
              <p className="text-xs sm:text-sm max-w-2xl leading-relaxed" style={{ color: "var(--color-muted)" }}>
                Koleksi perancangan produk antarmuka (UI/UX Design), aplikasi mobile, sistem automasi digital forensics, dan software tools. Klik tombol “Selengkapnya” pada tiap kartu untuk melihat studi kasus teknis komprehensif.
              </p>
            </div>

            {/* Filter Categories for Proyek Lain */}
            <div className="flex flex-wrap gap-2 mb-8">
              {filterTabs.map((cat) => {
                const count =
                  cat === "Semua"
                    ? otherProjects.length
                    : otherProjects.filter(
                        (p) => normalizeCategory(p.category) === cat,
                      ).length

                const isActive = activeCategory === cat

                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className="font-mono text-xs px-4 py-2 border tracking-wider uppercase transition-all cursor-pointer flex items-center gap-2"
                    style={{
                      borderColor: isActive
                        ? "var(--color-ink)"
                        : "var(--color-border)",
                      backgroundColor: isActive
                        ? "var(--color-ink)"
                        : "transparent",
                      color: isActive
                        ? "var(--color-paper)"
                        : "var(--color-muted)",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    <span>{cat}</span>
                    <span
                      className="text-[10px] px-1.5 py-0.2 rounded"
                      style={{
                        backgroundColor: isActive
                          ? "rgba(255,255,255,0.2)"
                          : "rgba(0,0,0,0.05)",
                        color: isActive ? "#fff" : "inherit",
                      }}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Grid for Proyek Lain */}
            {filteredOtherProjects.length === 0 ? (
              <div
                className="py-16 text-center text-sm border rounded-md"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-muted)",
                }}
              >
                Belum ada proyek dalam kategori arsip ini.
              </div>
            ) : (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px border"
                style={{
                  backgroundColor: "var(--color-border)",
                  borderColor: "var(--color-border)",
                }}
              >
                {filteredOtherProjects.map((project, i) => (
                  <ProjectCard
                    key={project.id || i}
                    project={project}
                    index={i}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Lightbox Modal for Photo Zoom with Next / Prev Navigation */}
          {selectedPhoto && (
            <div
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 select-none"
              onClick={() => setSelectedPhoto(null)}
            >
              <div
                className="relative max-w-5xl max-h-[92vh] flex flex-col items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative flex items-center justify-center">
                  <img
                    src={selectedPhoto.image_url}
                    alt={selectedPhoto.title}
                    className="max-h-[72vh] max-w-full w-auto object-contain rounded-xl shadow-2xl"
                  />

                  {/* Previous Photo Button */}
                  {featuredPhotos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const idx = featuredPhotos.findIndex(
                          (p) => p.image_url === selectedPhoto.image_url,
                        )
                        const prevIdx =
                          (idx - 1 + featuredPhotos.length) % featuredPhotos.length
                        setSelectedPhoto(featuredPhotos[prevIdx])
                      }}
                      className="absolute -left-3 sm:-left-14 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg"
                      title="Foto Sebelumnya (←)"
                    >
                      ←
                    </button>
                  )}

                  {/* Next Photo Button */}
                  {featuredPhotos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const idx = featuredPhotos.findIndex(
                          (p) => p.image_url === selectedPhoto.image_url,
                        )
                        const nextIdx = (idx + 1) % featuredPhotos.length
                        setSelectedPhoto(featuredPhotos[nextIdx])
                      }}
                      className="absolute -right-3 sm:-right-14 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg"
                      title="Foto Selanjutnya (→)"
                    >
                      →
                    </button>
                  )}
                </div>

                <div className="mt-4 text-center text-white max-w-2xl px-4">
                  <h3 className="font-sans font-bold text-base sm:text-xl mb-1 text-white">
                    {selectedPhoto.title}
                  </h3>
                  {selectedPhoto.caption && (
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                      {selectedPhoto.caption}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute -top-10 right-0 sm:right-2 text-stone-300 hover:text-white font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>✕ Tutup</span>
                  <span className="text-[10px] text-stone-500 font-mono">[ESC]</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </PublicLayout>
  )
}

function ProjectCard({
  project,
  index,
}: {
  project: Project
  index: number
}) {
  const displayId = index < 9 ? `0${index + 1}` : `${index + 1}`
  const projectCover = project.cover_url || ""
  const canonicalCategory = normalizeCategory(project.category)
  const subcategory = getProjectSubcategory(project)

  const tools = Array.isArray(project.tools)
    ? project.tools
    : typeof project.tools === "string"
      ? (project.tools as string)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : []

  const hasVideo = Boolean(
    (project.video_url && project.video_url.trim()) ||
      subcategory.toLowerCase().includes("video"),
  )
  const isSocial = Boolean(
    subcategory.toLowerCase().includes("social") ||
      subcategory.toLowerCase().includes("content design"),
  )
  const isLogo = Boolean(
    subcategory.toLowerCase().includes("logo") ||
      subcategory.toLowerCase().includes("visual identity"),
  )
  const isPhoto = Boolean(
    subcategory.toLowerCase().includes("photo") ||
      subcategory.toLowerCase().includes("fotografi"),
  )

  return (
    <Link
      to={`/work/${project.slug}`}
      className="project-card group flex flex-col justify-between relative overflow-hidden transition-colors"
      style={{ backgroundColor: "var(--color-paper)" }}
    >
      <div>
        {/* Uniform Thumbnail Image Container */}
        <div
          className="overflow-hidden relative"
          style={{
            height: "250px",
            backgroundColor: "var(--color-border-light)",
          }}
        >
          <SafeImage
            src={projectCover}
            alt={project.title}
            className="project-image w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Adaptive Category / Format Indicator Pill */}
          <div className="absolute top-3.5 left-3.5 z-10 flex flex-wrap gap-1.5">
            {hasVideo && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 text-white font-mono text-[10px] font-semibold backdrop-blur-xs shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                ▶ Video
              </span>
            )}
            {isSocial && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-900/85 text-pink-100 font-mono text-[10px] font-semibold backdrop-blur-xs shadow-md">
                📸 Social Feeds
              </span>
            )}
            {isLogo && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/85 text-amber-200 font-mono text-[10px] font-semibold backdrop-blur-xs shadow-md">
                ✦ Brand Mark
              </span>
            )}
            {isPhoto && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/85 text-emerald-200 font-mono text-[10px] font-semibold backdrop-blur-xs shadow-md">
                📷 Fotografi
              </span>
            )}
          </div>
        </div>

        <div className="p-5 md:p-6 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2.5">
            <span
              className="font-mono text-xs"
              style={{ color: "var(--color-muted)", letterSpacing: "0.06em" }}
            >
              {displayId} — {project.year}
            </span>

            {/* Category & Subcategory Badges */}
            <div className="flex flex-wrap items-center gap-1">
              <span
                className="font-mono text-[10px] font-semibold px-2 py-0.5 border"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-ink)",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "rgba(0,0,0,0.03)",
                }}
              >
                {canonicalCategory}
              </span>
              {subcategory && (
                <span
                  className="font-mono text-[10px] font-medium px-1.5 py-0.5 rounded truncate max-w-[130px]"
                  style={{
                    backgroundColor: "#EAEAE6",
                    color: "var(--color-ink)",
                  }}
                  title={subcategory}
                >
                  {subcategory}
                </span>
              )}
            </div>
          </div>

          <h3
            className="font-sans font-bold text-lg mb-1 group-hover:text-black transition-colors line-clamp-1"
            style={{ color: "var(--color-ink)", letterSpacing: "-0.02em" }}
            title={project.title}
          >
            {project.title}
          </h3>

          {project.subtitle && (
            <p
              className="font-serif text-xs italic mb-2 line-clamp-1"
              style={{ color: "var(--color-muted)" }}
            >
              {project.subtitle}
            </p>
          )}

          {/* Prominent Designer Role Badge */}
          {project.role && (
            <div className="mb-3">
              <span
                className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold px-2 py-0.5 rounded border"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-ink)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {project.role}
              </span>
            </div>
          )}

          <p
            className="text-xs mb-4 line-clamp-2 leading-relaxed"
            style={{ color: "var(--color-muted)" }}
          >
            {project.description}
          </p>

          {/* Tools Badges */}
          {tools.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {tools.slice(0, 3).map((tool) => (
                <span
                  key={tool}
                  className="font-mono text-[9px] px-1.5 py-0.5 border rounded"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-muted)",
                    backgroundColor: "var(--color-surface)",
                  }}
                >
                  {tool}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-5 md:px-6 pb-5 pt-0">
        <div
          className="flex items-center gap-1.5 font-mono text-[11px] tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ color: "var(--color-ink)", letterSpacing: "0.08em" }}
        >
          Lihat Detail Proyek →
        </div>
      </div>
    </Link>
  )
}

