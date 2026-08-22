import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import PublicLayout from "@/layouts/public/PublicLayout"
import { getSupabaseClient } from "@/lib/supabase"
import { projects as mockProjects } from "@/data/mockData"
import {
  MAIN_CATEGORIES,
  MainCategory,
  normalizeCategory,
  getProjectSubcategory,
  sortProjectsByOrder,
  Project,
} from "@/types/project"

const supabase = getSupabaseClient()

export default function Work() {
  const [projects, setProjects] = useState<Project[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("Semua")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false })

      if (data && data.length > 0) {
        const formatted: Project[] = data.map((p: any) => ({
          ...p,
          category: normalizeCategory(p.category),
          subcategory: getProjectSubcategory(p),
        }))
        setProjects(sortProjectsByOrder(formatted))
      } else {
        setProjects(sortProjectsByOrder(mockProjects))
      }
    } catch (e) {
      console.warn("Fallback to mock projects:", e)
      setProjects(sortProjectsByOrder(mockProjects))
    }
    setLoading(false)
  }

  const filtered =
    activeCategory === "Semua"
      ? projects
      : projects.filter((p) => normalizeCategory(p.category) === activeCategory)

  const filterTabs = ["Semua", ...MAIN_CATEGORIES]

  if (loading) {
    return (
      <PublicLayout>
        <div
          style={{
            backgroundColor: "var(--color-paper)",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            className="font-mono text-xs tracking-widest uppercase"
            style={{ color: "var(--color-muted)" }}
          >
            Memuat Karya...
          </p>
        </div>
      </PublicLayout>
    )
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
              Selected Works
            </p>
            <h1
              className="font-sans font-bold leading-none mb-4"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                letterSpacing: "-0.04em",
                color: "var(--color-ink)",
              }}
            >
              Karya &amp;{" "}
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontVariationSettings: '"opsz" 60',
                }}
              >
                Studi Kasus
              </span>
            </h1>
            <p
              className="text-sm md:text-base max-w-2xl leading-relaxed"
              style={{
                color: "var(--color-muted)",
                fontFamily: "var(--font-sans)",
              }}
            >
              Eksplorasi rekayasa perangkat lunak, sistem digital, desain
              antarmuka, hingga produksi visual dan multimedia kreatif.
            </p>
          </div>

          {/* Filter Categories (3 Utama + Semua) */}
          <div className="flex flex-wrap gap-2 mb-12">
            {filterTabs.map((cat) => {
              const count =
                cat === "Semua"
                  ? projects.length
                  : projects.filter(
                      (p) => normalizeCategory(p.category) === cat,
                    ).length

              const isActive = activeCategory === cat

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="font-mono text-xs px-4 py-2.5 border tracking-wider uppercase transition-all cursor-pointer flex items-center gap-2"
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

          {/* 3-Column Uniform Grid */}
          {filtered.length === 0 ? (
            <div
              className="py-16 text-center text-sm border rounded-md"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-surface)",
                color: "var(--color-muted)",
              }}
            >
              Belum ada proyek dalam kategori ini.
            </div>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px border"
              style={{
                backgroundColor: "var(--color-border)",
                borderColor: "var(--color-border)",
              }}
            >
              {filtered.map((project, i) => (
                <ProjectCard
                  key={project.id || i}
                  project={project}
                  index={i}
                />
              ))}
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

  const hasVideo = Boolean(project.video_url && project.video_url.trim())

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
            height: "240px",
            backgroundColor: "var(--color-border-light)",
          }}
        >
          {projectCover ? (
            <img
              src={projectCover}
              alt={project.title}
              className="project-image w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-xs font-mono"
              style={{ color: "var(--color-muted)" }}
            >
              No Image
            </div>
          )}

          {/* Video Badge if project has video */}
          {hasVideo && (
            <div className="absolute top-3.5 left-3.5 z-10">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 text-white font-mono text-[10px] font-semibold backdrop-blur-xs shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                ▶ Video
              </span>
            </div>
          )}
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
              className="font-serif text-xs italic mb-2.5 line-clamp-1"
              style={{ color: "var(--color-muted)" }}
            >
              {project.subtitle}
            </p>
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
          Lihat Studi Kasus →
        </div>
      </div>
    </Link>
  )
}
