import { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import PublicLayout from '@/layouts/public/PublicLayout'
import FormattedContent from '@/components/common/FormattedContent'
import { getSupabaseClient } from '@/lib/supabase'
import { projects as mockProjects } from '@/data/mockData'
import {
  normalizeCategory,
  getProjectSubcategory,
  normalizeProjectSections,
  getYouTubeEmbedUrl,
  Project,
  ProjectSection,
} from '@/types/project'

const supabase = getSupabaseClient()

export default function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [prevProject, setPrevProject] = useState<Project | null>(null)
  const [nextProject, setNextProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    fetchProject()
    window.scrollTo(0, 0)
  }, [slug])

  const fetchProject = async () => {
    setLoading(true)
    setError(false)

    try {
      const { data } = await supabase
        .from('projects')
        .select('*, project_gallery(*)')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      const projectList: Project[] =
        data && data.length > 0
          ? data.map((p: any) => ({
              ...p,
              category: normalizeCategory(p.category),
              subcategory: getProjectSubcategory(p),
              gallery:
                Array.isArray(p.project_gallery) && p.project_gallery.length > 0
                  ? [...p.project_gallery]
                      .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
                      .map((g: any) => g.image_url)
                  : Array.isArray(p.gallery)
                  ? p.gallery
                  : [],
            }))
          : mockProjects

      const index = projectList.findIndex((p) => p.slug === slug)

      if (index === -1) {
        const mockIdx = mockProjects.findIndex((p) => p.slug === slug)
        if (mockIdx !== -1) {
          setProject(mockProjects[mockIdx])
          setPrevProject(mockProjects[mockIdx - 1] || null)
          setNextProject(mockProjects[mockIdx + 1] || null)
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
      console.warn('Fallback to mock projects in detail view:', e)
      const mockIdx = mockProjects.findIndex((p) => p.slug === slug)
      if (mockIdx !== -1) {
        setProject(mockProjects[mockIdx])
        setPrevProject(mockProjects[mockIdx - 1] || null)
        setNextProject(mockProjects[mockIdx + 1] || null)
      } else {
        setError(true)
      }
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <PublicLayout>
        <div
          style={{
            backgroundColor: 'var(--color-paper)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--color-muted)' }}>
            Memuat Proyek...
          </p>
        </div>
      </PublicLayout>
    )
  }

  if (error || !project) {
    return <Navigate to="/work" replace />
  }

  const sections = normalizeProjectSections(
    project.sections,
    project.overview,
    project.problem,
    project.result
  ).filter((s) => s.content && s.content.trim() !== '')

  const tools = Array.isArray(project.tools)
    ? project.tools
    : typeof project.tools === 'string'
    ? (project.tools as string).split(',').map((s) => s.trim()).filter(Boolean)
    : []

  const gallery = Array.isArray(project.gallery) ? project.gallery.filter(Boolean) : []
  const videoEmbedUrl = getYouTubeEmbedUrl(project.video_url)
  const canonicalCategory = normalizeCategory(project.category)
  const subcategory = getProjectSubcategory(project)

  return (
    <PublicLayout>
      <div style={{ backgroundColor: 'var(--color-paper)', minHeight: '100vh' }}>
        
        {/* Top Header Section */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-16 pt-36 md:pt-44 pb-12">
          <Link
            to="/work"
            className="link-underline font-mono text-xs tracking-widest uppercase mb-10 inline-flex items-center gap-1.5 transition-colors hover:text-black"
            style={{ color: 'var(--color-muted)', letterSpacing: '0.12em' }}
          >
            ← Kembali ke Semua Karya
          </Link>

          <div className="grid md:grid-cols-3 gap-12 md:gap-16 mb-12">
            <div className="md:col-span-2">
              
              {/* Category, Subcategory & Year Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className="font-mono text-xs font-semibold px-2.5 py-1 border tracking-wider uppercase rounded-xs"
                  style={{
                    borderColor: 'var(--color-border)',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--color-ink)',
                  }}
                >
                  {canonicalCategory}
                </span>
                {subcategory && (
                  <span
                    className="font-mono text-xs font-medium px-2.5 py-1 rounded"
                    style={{
                      backgroundColor: '#EAEAE6',
                      color: 'var(--color-ink)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {subcategory}
                  </span>
                )}
                {project.year && (
                  <span
                    className="font-mono text-xs tracking-wider"
                    style={{ color: 'var(--color-muted)', letterSpacing: '0.08em' }}
                  >
                    · {project.year}
                  </span>
                )}
              </div>

              <h1
                className="font-sans font-bold leading-tight mb-3"
                style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', letterSpacing: '-0.035em', color: 'var(--color-ink)' }}
              >
                {project.title}
              </h1>

              {project.subtitle && (
                <p
                  className="font-serif"
                  style={{
                    fontSize: '1.25rem',
                    color: 'var(--color-muted)',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    fontVariationSettings: '"opsz" 18',
                  }}
                >
                  {project.subtitle}
                </p>
              )}
            </div>

            {/* Metadata Column */}
            <div className="flex flex-col gap-6 md:border-l md:pl-8" style={{ borderColor: 'var(--color-border)' }}>
              {project.role && (
                <div>
                  <p
                    className="font-mono text-xs tracking-widest uppercase mb-2 font-semibold"
                    style={{ color: 'var(--color-muted)', letterSpacing: '0.1em' }}
                  >
                    Peran / Kontribusi
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink)' }}>
                    {project.role}
                  </p>
                </div>
              )}

              {tools.length > 0 && (
                <div>
                  <p
                    className="font-mono text-xs tracking-widest uppercase mb-2 font-semibold"
                    style={{ color: 'var(--color-muted)', letterSpacing: '0.1em' }}
                  >
                    Tools &amp; Stack
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {tools.map((t: string) => (
                      <span
                        key={t}
                        className="font-mono text-xs px-2.5 py-1 border"
                        style={{
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-ink)',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--color-surface)',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Smart External Links */}
              {(project.live_url ||
                project.github_url ||
                project.figma_url ||
                project.video_url ||
                project.instagram_url ||
                project.drive_url) && (
                <div className="flex flex-col gap-2 pt-2 border-t" style={{ borderColor: 'var(--color-border-light)' }}>
                  <p
                    className="font-mono text-[11px] tracking-widest uppercase font-semibold text-gray-400 mb-1"
                  >
                    Tautan Proyek:
                  </p>

                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase transition-opacity hover:opacity-80 font-bold"
                      style={{ color: 'var(--color-ink)' }}
                    >
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      Live Demo / Website ↗
                    </a>
                  )}

                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase transition-opacity hover:opacity-80"
                      style={{ color: 'var(--color-ink)' }}
                    >
                      <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        />
                      </svg>
                      Lihat di GitHub ↗
                    </a>
                  )}

                  {project.figma_url && (
                    <a
                      href={project.figma_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase transition-opacity hover:opacity-80"
                      style={{ color: 'var(--color-ink)' }}
                    >
                      <span className="text-sm">🎨</span>
                      Buka di Figma ↗
                    </a>
                  )}

                  {project.video_url && (
                    <a
                      href={project.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase transition-opacity hover:opacity-80 font-medium"
                      style={{ color: 'var(--color-ink)' }}
                    >
                      <span className="text-sm">🎬</span>
                      Tonton Video Eksternal ↗
                    </a>
                  )}

                  {project.instagram_url && (
                    <a
                      href={project.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase transition-opacity hover:opacity-80"
                      style={{ color: 'var(--color-ink)' }}
                    >
                      <span className="text-sm">📷</span>
                      Lihat di Instagram ↗
                    </a>
                  )}

                  {project.drive_url && (
                    <a
                      href={project.drive_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase transition-opacity hover:opacity-80"
                      style={{ color: 'var(--color-ink)' }}
                    >
                      <span className="text-sm">📁</span>
                      Berkas &amp; Aset Proyek ↗
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── HERO MEDIA SECTION: Video Embed or High-Res Cover Frame ─────────── */}
        {videoEmbedUrl ? (
          <section className="max-w-[1440px] mx-auto px-6 md:px-16 pb-16">
            <div
              className="w-full aspect-video rounded-lg md:rounded-xl overflow-hidden shadow-xl border bg-black"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <iframe
                src={videoEmbedUrl}
                title={project.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        ) : (
          <section className="max-w-[1440px] mx-auto px-6 md:px-16 pb-16">
            <div
              className="w-full rounded-lg md:rounded-xl overflow-hidden border shadow-md relative group cursor-pointer transition-all duration-300"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: '#0F0F11',
              }}
              onClick={() => project.cover_url && setSelectedImage(project.cover_url)}
            >
              {project.cover_url ? (
                <>
                  <div className="w-full flex items-center justify-center p-2 sm:p-4 md:p-6 min-h-[320px] max-h-[760px] overflow-hidden">
                    <img
                      src={project.cover_url}
                      alt={project.title}
                      className="w-full h-auto max-h-[700px] object-contain rounded-md transition-transform duration-500 group-hover:scale-[1.01]"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="bg-black/85 text-white font-mono text-xs px-4 py-2 rounded-full shadow-xl backdrop-blur-xs">
                      🔍 Klik untuk memperbesar foto cover
                    </span>
                  </div>
                </>
              ) : (
                <div className="py-24 text-center">
                  <p className="font-mono text-xs" style={{ color: 'var(--color-muted)' }}>Tidak ada gambar cover</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── MODULAR CASE STUDY SECTIONS ─────────────────────────────── */}
        {sections.length > 0 && (
          <section className="max-w-[1440px] mx-auto px-6 md:px-16 py-20">
            <div className="flex flex-col gap-0">
              {sections.map((sec, idx) => (
                <div
                  key={sec.id || idx}
                  className="grid md:grid-cols-4 gap-6 md:gap-8 py-14 border-t"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-xs font-semibold" style={{ color: 'var(--color-muted)', letterSpacing: '0.08em' }}>
                      {sec.id || (idx < 9 ? `0${idx + 1}` : `${idx + 1}`)}
                    </span>
                    <h3 className="font-sans font-bold text-lg leading-snug" style={{ color: 'var(--color-ink)', letterSpacing: '-0.01em' }}>
                      {sec.label}
                    </h3>
                    {sec.sublabel && (
                      <p className="font-mono text-xs uppercase tracking-wider text-gray-400 mt-0.5" style={{ letterSpacing: '0.05em' }}>
                        {sec.sublabel}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-3">
                    <FormattedContent text={sec.content} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── GALLERY & SCREENSHOTS SECTION ───────────────────────────── */}
        {gallery.length > 0 && (
          <section className="max-w-[1440px] mx-auto px-6 md:px-16 pb-20">
            <p
              className="font-mono text-xs tracking-widest uppercase mb-6 font-semibold"
              style={{ color: 'var(--color-muted)', letterSpacing: '0.14em' }}
            >
              Galeri &amp; Tangkapan Layar ({gallery.length})
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {gallery.map((img: string, i: number) => (
                <div
                  key={i}
                  className="overflow-hidden cursor-pointer group relative border"
                  style={{
                    height: '280px',
                    backgroundColor: 'var(--color-border-light)',
                    borderRadius: 'var(--radius-md)',
                    borderColor: 'var(--color-border)',
                  }}
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={img}
                    alt={`Gallery ${i}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-black/80 text-white font-mono text-xs px-3.5 py-2 rounded-full shadow-md">
                      Perbesar ↗
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── NAVIGATION BETWEEN PROJECTS ─────────────────────────────── */}
        <section
          className="border-t"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
        >
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-10 flex items-center justify-between">
            <div className="w-1/3 flex justify-start">
              {prevProject && (
                <Link to={`/work/${prevProject.slug}`} className="flex flex-col gap-1 items-start group">
                  <span
                    className="font-mono text-xs tracking-widest uppercase group-hover:text-ink transition-colors"
                    style={{ color: 'var(--color-muted)', letterSpacing: '0.1em' }}
                  >
                    ← Sebelumnya
                  </span>
                  <span
                    className="font-sans font-bold text-sm truncate max-w-[200px]"
                    style={{ color: 'var(--color-ink)' }}
                  >
                    {prevProject.title}
                  </span>
                </Link>
              )}
            </div>
            <div className="w-1/3 flex justify-center">
              <Link
                to="/work"
                className="font-mono text-xs tracking-widest uppercase link-underline text-center"
                style={{ color: 'var(--color-muted)', letterSpacing: '0.1em' }}
              >
                Semua Karya
              </Link>
            </div>
            <div className="w-1/3 flex justify-end text-right">
              {nextProject && (
                <Link to={`/work/${nextProject.slug}`} className="flex flex-col gap-1 items-end group">
                  <span
                    className="font-mono text-xs tracking-widest uppercase group-hover:text-ink transition-colors"
                    style={{ color: 'var(--color-muted)', letterSpacing: '0.1em' }}
                  >
                    Berikutnya →
                  </span>
                  <span
                    className="font-sans font-bold text-sm truncate max-w-[200px]"
                    style={{ color: 'var(--color-ink)' }}
                  >
                    {nextProject.title}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* ── LIGHTBOX MODAL FULLSCREEN ──────────────────────────────── */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-10 right-0 text-white font-mono text-sm px-3 py-1 rounded bg-white/20 hover:bg-white/40 cursor-pointer"
              >
                Tutup ✕
              </button>
              <img
                src={selectedImage}
                alt="Detail preview"
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
