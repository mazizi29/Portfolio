import { useState, useEffect } from "react"
import { useParams, Link, Navigate } from "react-router-dom"
import PublicLayout from "@/layouts/public/PublicLayout"
import { ProjectDetailSkeleton } from "@/components/common/Skeleton"
import FormattedContent from "@/components/common/FormattedContent"
import SafeImage from "@/components/common/SafeImage"
import InstagramPostMockup, { SlideItem } from "@/components/common/InstagramPostMockup"
import LaptopMockup from "@/components/common/LaptopMockup"
import PhoneReelsMockup from "@/components/common/PhoneReelsMockup"
import LogoMatrixGrid, { LogoItem } from "@/components/common/LogoMatrixGrid"
import PhotographyShowcase from "@/components/common/PhotographyShowcase"
import { getSupabaseClient } from "@/lib/supabase"
import { projects as mockProjects } from "@/data/mockData"
import {
  normalizeCategory,
  getProjectSubcategory,
  normalizeProjectSections,
  normalizeGallery,
  sortProjectsByOrder,
  getProjectLinks,
  getProjectDisplayMode,
  getYouTubeEmbedUrl,
  Project,
  GalleryItem,
} from "@/types/project"

const supabase = getSupabaseClient()

// ── BRAND SVG ICONS ──────────────────────────────────────────────────────────

function YouTubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function FigmaIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 38 57" fill="currentColor">
      <path
        fill="#F24E1E"
        d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"
      />
      <path
        fill="#A259FF"
        d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"
      />
      <path fill="#0ACF83" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
      <path
        fill="#FF7262"
        d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"
      />
      <path
        fill="#1ABCFE"
        d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"
      />
    </svg>
  )
}

function GitHubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function GoogleDriveIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 87.3 78" fill="currentColor">
      <path
        d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z"
        fill="#0066da"
      />
      <path
        d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44A8.94 8.94 0 0 0 0 53h27.5z"
        fill="#00ac47"
      />
      <path
        d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l6.85 11.85z"
        fill="#ea4335"
      />
      <path
        d="M43.65 25H71.1c0-1.55-.4-3.1-1.2-4.5l-7.65-13.25c-.8-1.4-1.95-2.5-3.3-3.3z"
        fill="#00832d"
      />
      <path
        d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
        fill="#2684fc"
      />
      <path d="M73.4 26.5 60.1 53h27.2c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00" />
    </svg>
  )
}

function GlobeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [prevProject, setPrevProject] = useState<Project | null>(null)
  const [nextProject, setNextProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedItem, setSelectedItem] = useState<{
    image_url: string
    title?: string
    caption?: string
  } | null>(null)
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0)

  useEffect(() => {
    setActiveSlideIndex(0)
    fetchProject()
    window.scrollTo(0, 0)
  }, [slug])

  const fetchProject = async () => {
    setLoading(true)
    setError(false)

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

      const sortedMock = sortProjectsByOrder(mockProjects)

      const rawList: Project[] =
        data && data.length > 0
          ? data.map((p: any) => {
              const links = getProjectLinks(p)
              return {
                ...p,
                category: normalizeCategory(p.category),
                subcategory: getProjectSubcategory(p),
                sections: normalizeProjectSections(
                  p.sections,
                  p.overview,
                  p.problem,
                  p.result,
                ),
                video_url: links.video_url,
                figma_url: links.figma_url,
                instagram_url: links.instagram_url,
                drive_url: links.drive_url,
                github_url: links.github_url,
                live_url: links.live_url,
                gallery: normalizeGallery(
                  Array.isArray(p.project_gallery) &&
                  p.project_gallery.length > 0
                    ? p.project_gallery
                    : p.gallery,
                  p.tags,
                ),
              }
            })
          : sortedMock

      const projectList = sortProjectsByOrder(rawList)
      const index = projectList.findIndex((p) => p.slug === slug)

      if (index === -1) {
        const mockIdx = sortedMock.findIndex((p) => p.slug === slug)
        if (mockIdx !== -1) {
          const m = sortedMock[mockIdx]
          const links = getProjectLinks(m)
          setProject({
            ...m,
            ...links,
            gallery: normalizeGallery(m.gallery),
          })
          setPrevProject(sortedMock[mockIdx - 1] || null)
          setNextProject(sortedMock[mockIdx + 1] || null)
          setLoading(false)
          return
        }
        setError(true)
        setLoading(false)
        return
      }

      setProject(projectList[index])
      setPrevProject(projectList[index - 1] || null)
      setNextProject(projectList[index + 1] || null)
    } catch (e) {
      console.warn("Fallback to mock projects in detail view:", e)
      const sortedMock = sortProjectsByOrder(mockProjects)
      const mockIdx = sortedMock.findIndex((p) => p.slug === slug)
      if (mockIdx !== -1) {
        const m = sortedMock[mockIdx]
        const links = getProjectLinks(m)
        setProject({
          ...m,
          ...links,
          gallery: normalizeGallery(m.gallery),
        })
        setPrevProject(sortedMock[mockIdx - 1] || null)
        setNextProject(sortedMock[mockIdx + 1] || null)
      } else {
        setError(true)
      }
    }
    setLoading(false)
  }

  if (loading) {
    return <ProjectDetailSkeleton />
  }

  if (error || !project) {
    return <Navigate to="/work" replace />
  }

  const sections = normalizeProjectSections(
    project.sections,
    project.overview,
    project.problem,
    project.result,
  ).filter((s) => s.content && s.content.trim() !== "")

  const tools = Array.isArray(project.tools)
    ? project.tools
    : typeof project.tools === "string"
      ? (project.tools as string)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : []

  const gallery: GalleryItem[] = normalizeGallery(project.gallery, project.tags)
  const links = getProjectLinks(project)
  const videoEmbedUrl = getYouTubeEmbedUrl(links.video_url || links.live_url)
  const canonicalCategory = normalizeCategory(project.category)
  const subcategory = getProjectSubcategory(project)

  // Check if there are active smart links
  const hasLive = Boolean(links.live_url && links.live_url !== links.video_url)
  const hasVideo = Boolean(
    links.video_url || (links.live_url && getYouTubeEmbedUrl(links.live_url)),
  )
  const effectiveVideoUrl =
    links.video_url ||
    (getYouTubeEmbedUrl(links.live_url) ? links.live_url : "")
  const hasGithub = Boolean(links.github_url)
  const hasFigma = Boolean(links.figma_url)
  const hasInstagram = Boolean(links.instagram_url)
  const hasDrive = Boolean(links.drive_url)
  const hasAnyLinks =
    hasLive || hasVideo || hasGithub || hasFigma || hasInstagram || hasDrive

  // Determine special visual framing modes (explicit display mode from admin OR auto subcategory detection)
  const explicitDisplayMode = getProjectDisplayMode(project)

  const isSocialMedia =
    explicitDisplayMode === "instagram" ||
    (explicitDisplayMode === "auto" &&
      Boolean(
        subcategory.toLowerCase().includes("social") ||
          subcategory.toLowerCase().includes("content design") ||
          (Array.isArray(project.tags) &&
            project.tags.some(
              (t) =>
                typeof t === "string" &&
                ["social media", "instagram", "feeds"].some((kw) =>
                  t.toLowerCase().includes(kw),
                ),
            )),
      ))

  const isVisualIdentity =
    explicitDisplayMode === "logo_matrix" ||
    (explicitDisplayMode === "auto" &&
      Boolean(
        subcategory.toLowerCase().includes("visual identity") ||
          subcategory.toLowerCase().includes("logo") ||
          (Array.isArray(project.tags) &&
            project.tags.some(
              (t) =>
                typeof t === "string" &&
                ["visual identity", "logo design", "brand identity"].some((kw) =>
                  t.toLowerCase().includes(kw),
                ),
            )),
      ))

  const isPhotography =
    explicitDisplayMode === "photography" ||
    (explicitDisplayMode === "auto" &&
      Boolean(
        subcategory.toLowerCase().includes("photo") ||
          subcategory.toLowerCase().includes("fotografi") ||
          canonicalCategory.toLowerCase().includes("photo") ||
          canonicalCategory.toLowerCase().includes("fotografi") ||
          (Array.isArray(project.tags) &&
            project.tags.some(
              (t) =>
                typeof t === "string" &&
                [
                  "photo",
                  "fotografi",
                  "commercial photography",
                  "portraiture",
                  "visual storytelling",
                ].some((kw) => t.toLowerCase().includes(kw)),
            )),
      ))

  const isVerticalVideo =
    explicitDisplayMode === "vertical_video" ||
    (explicitDisplayMode === "auto" &&
      Boolean(
        (subcategory.toLowerCase().includes("video") ||
          subcategory.toLowerCase().includes("reels") ||
          subcategory.toLowerCase().includes("motion")) &&
          Array.isArray(project.tags) &&
          project.tags.some(
            (t) =>
              typeof t === "string" &&
              ["reels", "tiktok", "shorts", "vertical", "short-form"].some((kw) =>
                t.toLowerCase().includes(kw),
              ),
          ),
      ))

  // Extract Instagram slides (no cover fallback needed)
  const instagramSlides: SlideItem[] = (() => {
    if (gallery.length > 0) {
      return gallery.map((item, idx) => ({
        imageUrl: item.image_url,
        alt: item.title || `Slide ${idx + 1}`,
        title: item.title || `Slide ${idx + 1}`,
        caption: item.caption || "",
      }))
    }
    if (Array.isArray(project.tags)) {
      for (const tag of project.tags) {
        if (
          typeof tag === "string" &&
          (tag.startsWith("__gmeta:") || tag.startsWith("__gallery_meta:"))
        ) {
          try {
            const prefixLen = tag.startsWith("__gmeta:") ? 8 : 15
            const parsed = JSON.parse(tag.slice(prefixLen))
            if (Array.isArray(parsed) && parsed.length > 0) {
              return parsed
                .filter((m: any) => Boolean(m.image_url))
                .map((m: any, idx: number) => ({
                  imageUrl: m.image_url,
                  alt: m.title || `Slide ${idx + 1}`,
                  title: m.title || `Slide ${idx + 1}`,
                  caption: m.caption || "",
                }))
            }
          } catch {
            // ignore JSON error
          }
        }
      }
    }
    return []
  })()

  const currentSlide =
    instagramSlides[activeSlideIndex] || instagramSlides[0] || { imageUrl: "" }

  // Extract Logo items (no cover fallback)
  const logoItems: LogoItem[] =
    gallery.length > 0
      ? gallery.map((item, idx) => ({
          id: item.id || `logo-${idx}`,
          name: item.title || `Brand Mark ${idx + 1}`,
          logoUrl: item.image_url,
          industry: item.caption?.split("·")[0]?.trim() || "Visual Identity",
          conceptNote: item.caption,
          year: project.year,
          bgTone: idx % 3 === 0 ? "light" : idx % 3 === 1 ? "cream" : "dark",
        }))
      : (function () {
          if (Array.isArray(project.tags)) {
            for (const tag of project.tags) {
              if (
                typeof tag === "string" &&
                (tag.startsWith("__gmeta:") || tag.startsWith("__gallery_meta:"))
              ) {
                try {
                  const prefixLen = tag.startsWith("__gmeta:") ? 8 : 15
                  const parsed = JSON.parse(tag.slice(prefixLen))
                  if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed
                      .filter((m: any) => Boolean(m.image_url))
                      .map((m: any, idx: number) => ({
                        id: `gmeta-${idx}`,
                        name: m.title || `Brand Mark ${idx + 1}`,
                        logoUrl: m.image_url,
                        industry:
                          m.caption?.split("·")[0]?.trim() || "Brand Identity",
                        conceptNote: m.caption,
                        year: project.year,
                        bgTone:
                          idx % 3 === 0
                            ? "light"
                            : idx % 3 === 1
                              ? "cream"
                              : "dark",
                      }))
                  }
                } catch {
                  // ignore JSON parse error
                }
              }
            }
          }
          return []
        })()

  // Suppress bottom attachments/gallery if the hero interactive mockup showcases the assets
  const showBottomGallery =
    !isSocialMedia &&
    !isVisualIdentity &&
    !isVerticalVideo &&
    !isPhotography &&
    gallery.length > 0

  return (
    <PublicLayout>
      <div
        style={{ backgroundColor: "var(--color-paper)", minHeight: "100vh" }}
      >
        {/* Top Header Section */}
        <section className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-16 pt-32 sm:pt-36 md:pt-44 pb-10 md:pb-12">
          <Link
            to="/work"
            className="link-underline font-mono text-xs tracking-widest uppercase mb-8 md:mb-10 inline-flex items-center gap-1.5 transition-colors hover:text-black"
            style={{ color: "var(--color-muted)", letterSpacing: "0.12em" }}
          >
            ← Kembali ke Semua Proyek
          </Link>

          <div className="grid md:grid-cols-3 gap-8 md:gap-16 mb-8 md:mb-12">
            <div className="md:col-span-2">
              {/* Category, Subcategory, Role Badge & Year */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className="font-mono text-xs font-semibold px-2.5 py-1 border tracking-wider uppercase rounded-xs"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "#FFFFFF",
                    color: "var(--color-ink)",
                  }}
                >
                  {canonicalCategory}
                </span>
                {subcategory && (
                  <span
                    className="font-mono text-xs font-medium px-2.5 py-1 rounded"
                    style={{
                      backgroundColor: "#EAEAE6",
                      color: "var(--color-ink)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {subcategory}
                  </span>
                )}
                {project.role && (
                  <span
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold px-2.5 py-1 rounded border"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "var(--color-border)",
                      color: "var(--color-ink)",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {project.role}
                  </span>
                )}
                {project.year && (
                  <span
                    className="font-mono text-xs tracking-wider"
                    style={{
                      color: "var(--color-muted)",
                      letterSpacing: "0.08em",
                    }}
                  >
                    · {project.year}
                  </span>
                )}
              </div>

              <h1
                className="font-sans font-bold leading-tight mb-3"
                style={{
                  fontSize: "clamp(2rem, 5vw, 4rem)",
                  letterSpacing: "-0.035em",
                  color: "var(--color-ink)",
                }}
              >
                {project.title}
              </h1>

              {project.subtitle && (
                <p
                  className="font-serif leading-relaxed mb-6"
                  style={{
                    fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
                    color: "var(--color-muted)",
                    fontWeight: 400,
                    fontStyle: "italic",
                    fontVariationSettings: '"opsz" 18',
                  }}
                >
                  {project.subtitle}
                </p>
              )}

              {/* Action Link Buttons (Single Prominent Location) */}
              {hasAnyLinks && (
                <div className="flex flex-wrap gap-2.5 pt-2">
                  {hasLive && (
                    <a
                      href={links.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded text-xs font-mono tracking-wider uppercase font-semibold transition-all hover:opacity-85 shadow-xs"
                      style={{
                        backgroundColor: "var(--color-ink)",
                        color: "var(--color-paper)",
                        letterSpacing: "0.06em",
                      }}
                    >
                      <GlobeIcon className="w-3.5 h-3.5 text-emerald-400" />
                      Live Website ↗
                    </a>
                  )}

                  {hasVideo && effectiveVideoUrl && (
                    <a
                      href={effectiveVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded text-xs font-mono tracking-wider uppercase font-semibold border transition-all hover:bg-red-100 shadow-xs"
                      style={{
                        borderColor: "#FF0000",
                        color: "#CC0000",
                        backgroundColor: "#FFF5F5",
                        letterSpacing: "0.06em",
                      }}
                    >
                      <YouTubeIcon className="w-4 h-4 text-red-600" />
                      Tonton di YouTube ↗
                    </a>
                  )}

                  {hasGithub && (
                    <a
                      href={links.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded text-xs font-mono tracking-wider uppercase font-semibold border transition-all hover:bg-black/5"
                      style={{
                        borderColor: "var(--color-border)",
                        color: "var(--color-ink)",
                        backgroundColor: "#FFFFFF",
                        letterSpacing: "0.06em",
                      }}
                    >
                      <GitHubIcon className="w-4 h-4" />
                      Repositori GitHub ↗
                    </a>
                  )}

                  {hasFigma && (
                    <a
                      href={links.figma_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded text-xs font-mono tracking-wider uppercase font-semibold border transition-all hover:bg-purple-100 shadow-xs"
                      style={{
                        borderColor: "#A259FF",
                        color: "#6B21A8",
                        backgroundColor: "#FAF5FF",
                        letterSpacing: "0.06em",
                      }}
                    >
                      <FigmaIcon className="w-3.5 h-4" />
                      Prototipe Figma ↗
                    </a>
                  )}

                  {hasInstagram && (
                    <a
                      href={links.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded text-xs font-mono tracking-wider uppercase font-semibold border transition-all hover:bg-pink-100 shadow-xs"
                      style={{
                        borderColor: "#E1306C",
                        color: "#BE185D",
                        backgroundColor: "#FDF2F8",
                        letterSpacing: "0.06em",
                      }}
                    >
                      <InstagramIcon className="w-4 h-4 text-[#E1306C]" />
                      Lihat di Instagram ↗
                    </a>
                  )}

                  {hasDrive && (
                    <a
                      href={links.drive_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded text-xs font-mono tracking-wider uppercase font-semibold border transition-all hover:bg-blue-100 shadow-xs"
                      style={{
                        borderColor: "#2684FC",
                        color: "#1E40AF",
                        backgroundColor: "#EFF6FF",
                        letterSpacing: "0.06em",
                      }}
                    >
                      <GoogleDriveIcon className="w-4 h-4" />
                      Dokumen Drive ↗
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Metadata Column (Focused on Role & Tech Stack) */}
            <div
              className="flex flex-col gap-6 md:border-l md:pl-8"
              style={{ borderColor: "var(--color-border)" }}
            >
              {project.role && (
                <div>
                  <p
                    className="font-mono text-xs tracking-widest uppercase mb-1.5 font-semibold"
                    style={{
                      color: "var(--color-muted)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Peran / Kontribusi
                  </p>
                  <p
                    className="text-sm leading-relaxed font-medium"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {project.role}
                  </p>
                </div>
              )}

              {tools.length > 0 && (
                <div>
                  <p
                    className="font-mono text-xs tracking-widest uppercase mb-2 font-semibold"
                    style={{
                      color: "var(--color-muted)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Tools &amp; Stack
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {tools.map((t: string) => (
                      <span
                        key={t}
                        className="font-mono text-xs px-2.5 py-1 border"
                        style={{
                          borderColor: "var(--color-border)",
                          color: "var(--color-ink)",
                          borderRadius: "var(--radius-sm)",
                          backgroundColor: "var(--color-surface)",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── HERO MEDIA SECTION: DYNAMIC FRAMING (INSTAGRAM, REELS, LOGO MATRIX, VIDEO, OR COVER) ── */}
        <section className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-16 pb-12 md:pb-16">
          {isVisualIdentity && logoItems.length > 0 ? (
            /* Visual Identity Mode: Logo Matrix Grid Showcase */
            <div
              className="p-6 sm:p-10 rounded-2xl border shadow-sm"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <LogoMatrixGrid
                title="Selected Brand Identity & Logo Marks"
                subtitle={project.subtitle || "Koleksi logo dan identitas visual yang dirancang untuk beragam institusi dan brand."}
                items={logoItems}
                columns={4}
              />
            </div>
          ) : isSocialMedia && instagramSlides.length > 0 ? (
            /* Social Media Mode: Compact Case Study with Instagram Post Mockup */
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Instagram Post Mockup */}
              <div className="lg:col-span-5 flex justify-center">
                <InstagramPostMockup
                  slides={instagramSlides}
                  activeSlideIndex={activeSlideIndex}
                  onSlideChange={(idx) => setActiveSlideIndex(idx)}
                  caption={currentSlide.caption || project.subtitle || project.description}
                  brandTag={project.title}
                  likeCount="2.4K"
                  accountName="Layar Putih Studio"
                  accountHandle="layarputih.studio"
                  maxWidth="460px"
                />
              </div>

              {/* Right Column: Case Study Highlights with Slide-Synchronized Narrative */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div
                  className="p-6 sm:p-8 rounded-2xl border transition-all duration-300 shadow-xs"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <div
                    className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b"
                    style={{ borderColor: "var(--color-border-light)" }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-pink-100 text-pink-700">
                        Instagram Content Design
                      </span>
                      <span className="font-mono text-xs text-gray-400">
                        · Multi-Format Showcase
                      </span>
                    </div>
                    {instagramSlides.length > 1 && (
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-black text-white">
                        Slide {activeSlideIndex + 1} / {instagramSlides.length}
                      </span>
                    )}
                  </div>

                  {/* Dynamic Slide Title */}
                  <h3
                    className="font-sans font-bold text-xl sm:text-2xl mb-3 transition-all duration-200"
                    style={{
                      color: "var(--color-ink)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {currentSlide.title || "Strategi Desain & Hierarki Informasi"}
                  </h3>

                  {/* Dynamic Slide Caption / Narrative */}
                  <p
                    className="text-sm leading-relaxed mb-6 transition-all duration-200"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {currentSlide.caption ||
                      project.description ||
                      "Perancangan konten visual berorientasi engagement dan estetika editorial. Menggabungkan layout modular, tipografi yang tegas, dan palet warna selaras untuk membangun identitas visual yang konsisten di linimasa media sosial."}
                  </p>

                  {/* Interactive Slide Selector Pills */}
                  {instagramSlides.length > 1 && (
                    <div
                      className="mb-6 pt-4 border-t"
                      style={{ borderColor: "var(--color-border-light)" }}
                    >
                      <p className="font-mono text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2.5 flex items-center justify-between">
                        <span>Pilih Slide ({instagramSlides.length} Format):</span>
                        <span className="text-[10px] text-gray-400 font-normal">
                          Klik untuk berganti slide
                        </span>
                      </p>
                      <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                        {instagramSlides.map((slide, sIdx) => {
                          const isActive = sIdx === activeSlideIndex
                          return (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => setActiveSlideIndex(sIdx)}
                              className="text-left font-mono text-[11px] px-2.5 py-1.5 rounded border transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                              style={{
                                borderColor: isActive
                                  ? "var(--color-ink)"
                                  : "var(--color-border)",
                                backgroundColor: isActive
                                  ? "var(--color-ink)"
                                  : "#FFFFFF",
                                color: isActive
                                  ? "#FFFFFF"
                                  : "var(--color-ink)",
                                fontWeight: isActive ? 700 : 400,
                              }}
                            >
                              <span className="opacity-70 text-[10px]">
                                {sIdx + 1}.
                              </span>
                              <span className="truncate max-w-[160px]">
                                {slide.title || `Slide ${sIdx + 1}`}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Deliverables & Strategic Focus */}
                  <div
                    className="grid sm:grid-cols-2 gap-4 pt-4 border-t"
                    style={{ borderColor: "var(--color-border-light)" }}
                  >
                    <div>
                      <h4 className="font-mono text-xs uppercase tracking-wider text-gray-500 mb-1 font-semibold">
                        Format Deliverables
                      </h4>
                      <p
                        className="text-xs font-medium"
                        style={{ color: "var(--color-ink)" }}
                      >
                        Potret 4:5 (1080×1350), Story 9:16, Campaign Posters
                      </p>
                    </div>
                    <div>
                      <h4 className="font-mono text-xs uppercase tracking-wider text-gray-500 mb-1 font-semibold">
                        Fokus Utama
                      </h4>
                      <p
                        className="text-xs font-medium"
                        style={{ color: "var(--color-ink)" }}
                      >
                        Readability, Visual Hook, Brand Recall
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ) : isPhotography && gallery.length > 0 ? (
            /* Photography Mode: Auto-scroll Flexible Showcase in Natural Aspect Ratios (Tanpa Cover) */
            <div className="w-full flex flex-col gap-4">
              <PhotographyShowcase
                photos={gallery}
                autoPlayInterval={3500}
                onPhotoZoom={(photo) => setSelectedItem(photo)}
              />
            </div>
          ) : isVerticalVideo ? (
            /* Vertical Reels / TikTok Mode: Phone Frame (Tanpa Perlu Cover) */
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-5 flex justify-center">
                <PhoneReelsMockup
                  posterUrl={project.cover_url || ""}
                  videoUrl={effectiveVideoUrl}
                  title={project.title}
                  roleLabel={project.role || "Videographer & Editor"}
                  clientName={project.subtitle}
                />
              </div>
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div
                  className="p-6 sm:p-8 rounded-2xl border"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700 inline-block mb-3">
                    Short-Form &amp; Vertical Video
                  </span>
                  <h3
                    className="font-sans font-bold text-xl sm:text-2xl mb-3"
                    style={{ color: "var(--color-ink)", letterSpacing: "-0.02em" }}
                  >
                    Produksi Sinematografi &amp; Editing Vertikal
                  </h3>
                  <p
                    className="text-sm leading-relaxed mb-4"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {project.description ||
                      "Perancangan video dengan pendekatan visual storytelling dinamis, ritme editing presisi, dan color grading sinematik yang dirancang khusus untuk konsumsi layar smartphone."}
                  </p>
                  {effectiveVideoUrl && (
                    <p className="font-mono text-xs text-gray-500">
                      ▶ Klik layar ponsel untuk memutar / menjeda video langsung di browser.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : videoEmbedUrl ? (
            /* 16:9 Landscape Video in MacBook / Laptop Mockup Frame (Tanpa Perlu Cover) */
            <div className="w-full flex justify-center">
              <LaptopMockup
                videoEmbedUrl={videoEmbedUrl}
                alt={project.title}
                urlBarText={effectiveVideoUrl ? "youtube.com/watch?v=..." : undefined}
                maxWidth="960px"
              />
            </div>
          ) : project.cover_url ? (
            /* Standard High-Res Cover Frame (Hanya bila ada cover) */
            <div
              className="w-full rounded-lg md:rounded-xl overflow-hidden border shadow-md relative group cursor-pointer transition-all duration-300"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "#0F0F11",
              }}
              onClick={() =>
                project.cover_url &&
                setSelectedItem({
                  image_url: project.cover_url,
                  title: project.title,
                  caption: project.subtitle || project.description,
                })
              }
            >
              <div className="w-full flex items-center justify-center p-2 sm:p-4 md:p-6 min-h-[260px] sm:min-h-[320px] max-h-[760px] overflow-hidden">
                <SafeImage
                  src={project.cover_url}
                  alt={project.title}
                  className="w-full h-auto max-h-[700px] object-contain rounded-md transition-transform duration-500 group-hover:scale-[1.01]"
                />
              </div>
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="bg-black/85 text-white font-mono text-xs px-4 py-2 rounded-full shadow-xl backdrop-blur-xs">
                  🔍 Klik untuk memperbesar foto
                </span>
              </div>
            </div>
          ) : gallery.length > 0 ? (
            /* Galeri visual alternatif jika cover tidak diatur */
            <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedItem(item)}
                  className="aspect-square rounded-xl overflow-hidden border bg-stone-100 cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <SafeImage
                    src={item.image_url}
                    alt={item.title || ""}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </section>

        {/* ── MODULAR CASE STUDY SECTIONS (HANYA RENDER JIKA ADA DATA) ─── */}
        {sections.length > 0 && (
          <section className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-16 py-12 md:py-20">
            <div className="flex flex-col gap-0">
              {sections.map((sec, idx) => (
                <div
                  key={sec.id || idx}
                  className="grid md:grid-cols-4 gap-4 md:gap-8 py-10 md:py-14 border-t"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <div className="flex flex-col gap-1">
                    <span
                      className="font-mono text-xs font-semibold"
                      style={{
                        color: "var(--color-muted)",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {sec.id || (idx < 9 ? `0${idx + 1}` : `${idx + 1}`)}
                    </span>
                    <h3
                      className="font-sans font-bold text-base sm:text-lg leading-snug"
                      style={{
                        color: "var(--color-ink)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {sec.label}
                    </h3>
                    {sec.sublabel && (
                      <p
                        className="font-mono text-[11px] sm:text-xs uppercase tracking-wider text-gray-400 mt-0.5"
                        style={{ letterSpacing: "0.05em" }}
                      >
                        {sec.sublabel}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-3 mt-2 md:mt-0">
                    <FormattedContent text={sec.content} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── ADAPTIVE GALLERY & SCREENSHOTS SECTION ───────────────────── */}
        {showBottomGallery && (
          <section className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-16 pb-16 md:pb-24">
            <div
              className="flex items-center justify-between mb-6 pb-2 border-b"
              style={{ borderColor: "var(--color-border)" }}
            >
              <p
                className="font-mono text-xs tracking-widest uppercase font-semibold"
                style={{ color: "var(--color-muted)", letterSpacing: "0.14em" }}
              >
                {canonicalCategory === "Creative & Multimedia"
                  ? `Galeri Desain & Visual Proyek (${gallery.length})`
                  : canonicalCategory === "Engineering & Tech"
                    ? `Tangkapan Layar & Dokumentasi Sistem (${gallery.length})`
                    : `Galeri Desain & Tangkapan Layar (${gallery.length})`}
              </p>
              <span className="font-mono text-[11px] text-gray-400 hidden sm:inline-block">
                Klik gambar untuk resolusi penuh
              </span>
            </div>

            {/* Adaptive Grid: Shows natural framing with optional title & 1-sentence caption */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {gallery.map((item: GalleryItem, i: number) => {
                const hasCaptionInfo = Boolean(
                  (item.title && item.title.trim()) ||
                    (item.caption && item.caption.trim()),
                )

                return (
                  <div
                    key={item.id || i}
                    className="group relative flex flex-col justify-between border cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      borderRadius: "var(--radius-md)",
                      borderColor: "var(--color-border)",
                    }}
                    onClick={() =>
                      setSelectedItem({
                        image_url: item.image_url,
                        title: item.title,
                        caption: item.caption,
                      })
                    }
                  >
                    {/* Visual Media Frame */}
                    <div className="w-full flex items-center justify-center overflow-hidden bg-[#F4F4F2] p-2.5 sm:p-4 min-h-[220px] max-h-[460px]">
                      <SafeImage
                        src={item.image_url}
                        alt={item.title || `Visual ${i + 1}`}
                        loading="lazy"
                        className="w-full h-auto max-h-[420px] object-contain transition-transform duration-300 group-hover:scale-[1.02] drop-shadow-xs"
                      />
                    </div>

                    {/* Editorial Micro-Caption: Clean & only rendered if title or caption exists */}
                    {hasCaptionInfo && (
                      <div
                        className="p-3.5 sm:p-4 border-t bg-white flex flex-col gap-1"
                        style={{ borderColor: "var(--color-border-light)" }}
                      >
                        {item.title && item.title.trim() && (
                          <h4
                            className="font-sans font-bold text-xs sm:text-sm leading-snug line-clamp-1"
                            style={{
                              color: "var(--color-ink)",
                              letterSpacing: "-0.01em",
                            }}
                            title={item.title}
                          >
                            {item.title}
                          </h4>
                        )}
                        {item.caption && item.caption.trim() && (
                          <p
                            className="text-[11px] sm:text-xs leading-relaxed line-clamp-2"
                            style={{ color: "var(--color-muted)" }}
                            title={item.caption}
                          >
                            {item.caption}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Hover Badge */}
                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs pointer-events-none">
                      <span className="bg-black/85 text-white font-mono text-xs px-3.5 py-1.5 rounded-full shadow-lg">
                        🔍 Perbesar
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ── NAVIGATION BETWEEN PROJECTS (RESPONSIVE & OVERLAP-PROOF) ─── */}
        <section
          className="border-t"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-surface)",
          }}
        >
          <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-16 py-8 md:py-10">
            {/* Desktop Layout (md and up) */}
            <div className="hidden md:flex items-center justify-between gap-8">
              <div className="w-1/3 min-w-0 flex justify-start">
                {prevProject ? (
                  <Link
                    to={`/work/${prevProject.slug}`}
                    className="flex flex-col gap-1 items-start group max-w-[260px]"
                  >
                    <span
                      className="font-mono text-xs tracking-widest uppercase group-hover:text-ink transition-colors"
                      style={{
                        color: "var(--color-muted)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      ← Sebelumnya
                    </span>
                    <span
                      className="font-sans font-bold text-sm truncate w-full"
                      style={{ color: "var(--color-ink)" }}
                      title={prevProject.title}
                    >
                      {prevProject.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
              </div>

              <div className="shrink-0 flex justify-center">
                <Link
                  to="/work"
                  className="font-mono text-xs tracking-widest uppercase link-underline text-center px-4 py-2 border rounded hover:bg-black/3 transition-colors"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-ink)",
                    letterSpacing: "0.1em",
                  }}
                >
                  Semua Proyek
                </Link>
              </div>

              <div className="w-1/3 min-w-0 flex justify-end text-right">
                {nextProject ? (
                  <Link
                    to={`/work/${nextProject.slug}`}
                    className="flex flex-col gap-1 items-end group max-w-[260px]"
                  >
                    <span
                      className="font-mono text-xs tracking-widest uppercase group-hover:text-ink transition-colors"
                      style={{
                        color: "var(--color-muted)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      Berikutnya →
                    </span>
                    <span
                      className="font-sans font-bold text-sm truncate w-full"
                      style={{ color: "var(--color-ink)" }}
                      title={nextProject.title}
                    >
                      {nextProject.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            </div>

            {/* Mobile Layout (< md): Clean Side-by-Side Cards with Zero Overlap */}
            <div className="flex flex-col gap-3 md:hidden">
              <div className="grid grid-cols-2 gap-3">
                {prevProject ? (
                  <Link
                    to={`/work/${prevProject.slug}`}
                    className="p-3.5 border rounded flex flex-col gap-1 justify-between transition-colors hover:bg-black/2 min-w-0"
                    style={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-paper)",
                    }}
                  >
                    <span
                      className="font-mono text-[10px] tracking-wider uppercase text-gray-500"
                      style={{ letterSpacing: "0.08em" }}
                    >
                      ← Sebelumnya
                    </span>
                    <span
                      className="font-sans font-bold text-xs line-clamp-2"
                      style={{ color: "var(--color-ink)" }}
                    >
                      {prevProject.title}
                    </span>
                  </Link>
                ) : (
                  <div
                    className="p-3.5 border rounded border-dashed opacity-40 flex items-center justify-center text-[10px] font-mono"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    Awal Proyek
                  </div>
                )}

                {nextProject ? (
                  <Link
                    to={`/work/${nextProject.slug}`}
                    className="p-3.5 border rounded flex flex-col gap-1 justify-between text-right transition-colors hover:bg-black/2 min-w-0"
                    style={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-paper)",
                    }}
                  >
                    <span
                      className="font-mono text-[10px] tracking-wider uppercase text-gray-500"
                      style={{ letterSpacing: "0.08em" }}
                    >
                      Berikutnya →
                    </span>
                    <span
                      className="font-sans font-bold text-xs line-clamp-2"
                      style={{ color: "var(--color-ink)" }}
                    >
                      {nextProject.title}
                    </span>
                  </Link>
                ) : (
                  <div
                    className="p-3.5 border rounded border-dashed opacity-40 flex items-center justify-center text-[10px] font-mono"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    Akhir Proyek
                  </div>
                )}
              </div>

              <Link
                to="/work"
                className="w-full py-2.5 text-center font-mono text-xs uppercase tracking-wider border rounded transition-colors"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-ink)",
                  backgroundColor: "var(--color-surface)",
                  letterSpacing: "0.08em",
                }}
              >
                Semua Proyek
              </Link>
            </div>
          </div>
        </section>

        {/* ── LIGHTBOX MODAL FULLSCREEN ──────────────────────────────── */}
        {selectedItem && (
          <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="relative max-w-5xl max-h-[90vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute -top-10 right-0 text-white font-mono text-xs px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer flex items-center gap-1.5 shadow-lg"
              >
                <span>Tutup</span>
                <span>✕</span>
              </button>

              {/* Full Image */}
              <SafeImage
                src={selectedItem.image_url}
                alt={selectedItem.title || "Detail preview"}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
              />

              {/* Lightbox Caption Bar (Only if title or caption exists) */}
              {(selectedItem.title || selectedItem.caption) && (
                <div className="mt-3.5 px-5 py-3 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 text-center max-w-2xl shadow-xl">
                  {selectedItem.title && (
                    <p className="text-white font-sans font-bold text-sm sm:text-base leading-snug">
                      {selectedItem.title}
                    </p>
                  )}
                  {selectedItem.caption && (
                    <p className="text-gray-300 font-sans text-xs sm:text-sm mt-1 leading-relaxed">
                      {selectedItem.caption}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  )
}

