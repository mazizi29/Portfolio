import { useState, useEffect } from 'react'
import AdminLayout from '@/layouts/admin/AdminLayout'
import FormattedContent from '@/components/common/FormattedContent'
import { getSupabaseClient } from '@/lib/supabase'
import { uploadImage } from '@/lib/upload'
import {
  Project,
  ProjectSection,
  MAIN_CATEGORIES,
  MainCategory,
  SUBCATEGORY_SUGGESTIONS,
  CASE_STUDY_PRESETS,
  normalizeCategory,
  getProjectSubcategory,
  getYouTubeEmbedUrl,
} from '@/types/project'

const supabase = getSupabaseClient()

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list' | 'form'>('list')
  const [editing, setEditing] = useState<Project | null>(null)
  const [deleteModal, setDeleteModal] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*, project_gallery(*)')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching projects from Supabase:', error)
      } else {
        const formatted: Project[] = (data || []).map((p: any) => ({
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
        setProjects(formatted)
      }
    } catch (e) {
      console.warn('Failed to fetch projects from remote:', e)
    }
    setLoading(false)
  }

  const startNew = () => {
    setEditing(null)
    setView('form')
  }

  const startEdit = (p: Project) => {
    setEditing(p)
    setView('form')
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) {
      console.error('Error deleting project:', error)
      alert('Gagal menghapus proyek.')
    } else {
      setProjects((prev) => prev.filter((p) => p.id !== id))
    }
    setDeleteModal(null)
  }

  const handleSave = async (data: Partial<Project>) => {
    setLoading(true)
    try {
      const { gallery, ...projectPayload } = data
      let targetProjectId = editing?.id

      const payload: Record<string, any> = {
        ...projectPayload,
        updated_at: new Date().toISOString(),
      }

      if (editing) {
        const { error, data: updatedData } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', editing.id)
          .select()
          .single()

        if (error) {
          console.warn('Update fallback to core fields:', error.message)
          const corePayload = {
            title: payload.title,
            slug: payload.slug,
            subtitle: payload.subtitle,
            description: payload.description,
            category: payload.category,
            year: payload.year,
            role: payload.role,
            tools: payload.tools,
            tags: payload.tags,
            status: payload.status,
            featured: payload.featured,
            cover_url: payload.cover_url,
            overview: payload.overview,
            problem: payload.problem,
            result: payload.result,
            github_url: payload.github_url,
            live_url: payload.live_url,
            updated_at: payload.updated_at,
          }
          const { error: retryError, data: retryData } = await supabase
            .from('projects')
            .update(corePayload)
            .eq('id', editing.id)
            .select()
            .single()

          if (retryError) throw retryError
          targetProjectId = retryData.id
        } else {
          targetProjectId = updatedData.id
        }
      } else {
        const slug =
          projectPayload.slug ||
          projectPayload.title
            ?.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-') ||
          `project-${Date.now()}`

        const insertPayload = {
          ...payload,
          slug,
          status: projectPayload.status || 'published',
          created_at: new Date().toISOString(),
        }

        const { error, data: insertedData } = await supabase
          .from('projects')
          .insert(insertPayload)
          .select()
          .single()

        if (error) {
          console.warn('Insert fallback to core fields:', error.message)
          const coreInsertPayload = {
            title: insertPayload.title,
            slug: insertPayload.slug,
            subtitle: insertPayload.subtitle,
            description: insertPayload.description,
            category: insertPayload.category,
            year: insertPayload.year,
            role: insertPayload.role,
            tools: insertPayload.tools,
            tags: insertPayload.tags,
            status: insertPayload.status,
            featured: insertPayload.featured,
            cover_url: insertPayload.cover_url,
            overview: insertPayload.overview,
            problem: insertPayload.problem,
            result: insertPayload.result,
            github_url: insertPayload.github_url,
            live_url: insertPayload.live_url,
            created_at: insertPayload.created_at,
            updated_at: insertPayload.updated_at,
          }
          const { error: retryError, data: retryData } = await supabase
            .from('projects')
            .insert(coreInsertPayload)
            .select()
            .single()

          if (retryError) throw retryError
          targetProjectId = retryData.id
        } else {
          targetProjectId = insertedData.id
        }
      }

      if (targetProjectId && Array.isArray(gallery)) {
        await supabase.from('project_gallery').delete().eq('project_id', targetProjectId)

        const cleanGalleryUrls = gallery.filter(
          (url) => url && typeof url === 'string' && url.trim().length > 0
        )
        if (cleanGalleryUrls.length > 0) {
          const galleryRows = cleanGalleryUrls.map((imgUrl, idx) => ({
            project_id: targetProjectId,
            image_url: imgUrl.trim(),
            sort_order: idx + 1,
          }))
          const { error: galleryError } = await supabase.from('project_gallery').insert(galleryRows)
          if (galleryError) {
            console.warn('Warning: Error syncing project gallery:', galleryError)
          }
        }
      }

      await fetchProjects()
      setView('list')
      setEditing(null)
    } catch (err: any) {
      console.error('Error saving project:', err)
      alert(`Gagal menyimpan proyek: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter((p) => {
    const matchesCategory =
      filterCategory === 'all' || normalizeCategory(p.category) === filterCategory
    const subcategory = getProjectSubcategory(p)
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.subtitle && p.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      subcategory.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (view === 'form') {
    return (
      <AdminLayout title={editing ? 'Edit Proyek' : 'Tambah Proyek Baru'}>
        <ProjectForm
          project={editing}
          onSave={handleSave}
          onCancel={() => {
            setView('list')
            setEditing(null)
          }}
          loading={loading}
        />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Kelola Proyek">
      <div className="max-w-6xl mx-auto pb-16">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2
              className="font-sans font-bold text-xl md:text-2xl"
              style={{ color: 'var(--color-ink)', letterSpacing: '-0.02em' }}
            >
              Semua Karya &amp; Proyek
            </h2>
            <p className="text-xs font-mono mt-1" style={{ color: 'var(--color-muted)' }}>
              Total {projects.length} karya terdaftar · 3 Kategori Utama
            </p>
          </div>
          <button
            onClick={startNew}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold tracking-widest uppercase cursor-pointer disabled:opacity-50 transition-opacity hover:opacity-85 shadow-sm"
            style={{
              backgroundColor: 'var(--color-ink)',
              color: 'var(--color-paper)',
              letterSpacing: '0.08em',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            + Tambah Proyek
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div
          className="p-4 mb-6 border flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between"
          style={{
            borderColor: 'var(--color-border)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-surface)',
          }}
        >
          <div className="flex flex-wrap gap-2 items-center">
            <span className="font-mono text-xs uppercase tracking-wider mr-1" style={{ color: 'var(--color-muted)' }}>
              Filter:
            </span>
            <button
              onClick={() => setFilterCategory('all')}
              className="font-mono text-xs px-3 py-1.5 border rounded cursor-pointer transition-colors"
              style={{
                borderColor: filterCategory === 'all' ? 'var(--color-ink)' : 'var(--color-border)',
                backgroundColor: filterCategory === 'all' ? 'var(--color-ink)' : 'transparent',
                color: filterCategory === 'all' ? 'var(--color-paper)' : 'var(--color-muted)',
                fontWeight: filterCategory === 'all' ? '600' : '400',
              }}
            >
              Semua ({projects.length})
            </button>
            {MAIN_CATEGORIES.map((cat) => {
              const count = projects.filter((p) => normalizeCategory(p.category) === cat).length
              const isActive = filterCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className="font-mono text-xs px-3 py-1.5 border rounded cursor-pointer transition-colors"
                  style={{
                    borderColor: isActive ? 'var(--color-ink)' : 'var(--color-border)',
                    backgroundColor: isActive ? 'var(--color-ink)' : 'transparent',
                    color: isActive ? 'var(--color-paper)' : 'var(--color-muted)',
                    fontWeight: isActive ? '600' : '400',
                  }}
                >
                  {cat} ({count})
                </button>
              )
            })}
          </div>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Cari judul / subkategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-8 py-1.5 text-xs border rounded outline-none"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-ink)',
                backgroundColor: '#FFFFFF',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs hover:opacity-80"
                style={{ color: 'var(--color-muted)' }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Project List */}
        {loading ? (
          <div className="py-16 text-center text-sm font-mono tracking-widest uppercase" style={{ color: 'var(--color-muted)' }}>
            Memuat data proyek...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div
            className="py-16 text-center text-sm border flex flex-col items-center justify-center gap-3"
            style={{
              borderColor: 'var(--color-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-muted)',
              backgroundColor: 'var(--color-surface)',
            }}
          >
            <p>Tidak ada proyek yang sesuai dengan kriteria filter.</p>
            <button
              onClick={startNew}
              className="text-xs font-mono underline uppercase tracking-wider hover:opacity-80 cursor-pointer"
              style={{ color: 'var(--color-ink)' }}
            >
              + Buat Proyek Baru
            </button>
          </div>
        ) : (
          <div
            className="border overflow-hidden shadow-xs"
            style={{
              borderColor: 'var(--color-border)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-surface)',
            }}
          >
            {/* Header Table (Desktop) */}
            <div
              className="hidden md:grid gap-4 px-5 py-3 border-b text-xs font-mono tracking-widest uppercase font-semibold"
              style={{
                gridTemplateColumns: '48px 1fr 200px 100px 80px 100px 70px',
                borderColor: 'var(--color-border)',
                color: 'var(--color-muted)',
                letterSpacing: '0.08em',
                backgroundColor: '#F7F7F5',
              }}
            >
              <div>Cover</div>
              <div>Judul &amp; Subtitle</div>
              <div>Kategori &amp; Subkategori</div>
              <div>Status</div>
              <div>Featured</div>
              <div>Update</div>
              <div className="text-right">Aksi</div>
            </div>

            {filteredProjects.map((p) => {
              const canonicalCat = normalizeCategory(p.category)
              const subcategory = getProjectSubcategory(p)

              return (
                <div
                  key={p.id}
                  className="border-b last:border-0 px-4 md:px-5 py-4 transition-colors hover:bg-black/2"
                  style={{ borderColor: 'var(--color-border-light)' }}
                >
                  {/* Mobile Layout */}
                  <div className="flex items-start gap-3 md:hidden">
                    <div
                      className="w-14 h-14 shrink-0 overflow-hidden bg-gray-100 flex items-center justify-center text-xs border"
                      style={{
                        borderColor: 'var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--color-border-light)',
                      }}
                    >
                      {p.cover_url ? (
                        <img src={p.cover_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-mono" style={{ color: 'var(--color-muted)' }}>No Img</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-ink)' }}>
                          {p.title}
                        </p>
                        <span
                          className="font-mono text-[10px] px-1.5 py-0.5 shrink-0 uppercase tracking-wider rounded"
                          style={{
                            backgroundColor:
                              p.status === 'published' ? 'var(--color-ink)' : 'var(--color-border-light)',
                            color:
                              p.status === 'published' ? 'var(--color-paper)' : 'var(--color-muted)',
                          }}
                        >
                          {p.status}
                        </span>
                      </div>
                      <p className="text-xs mb-1 truncate" style={{ color: 'var(--color-muted)' }}>
                        <span className="font-medium" style={{ color: 'var(--color-ink)' }}>{canonicalCat}</span>
                        {subcategory ? ` · ${subcategory}` : ''}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-dashed" style={{ borderColor: 'var(--color-border-light)' }}>
                        <span className="text-[11px] font-mono" style={{ color: 'var(--color-muted)' }}>
                          {p.featured ? '★ Featured' : ''} {p.year ? `· ${p.year}` : ''}
                        </span>
                        <div className="flex gap-3">
                          <button
                            onClick={() => startEdit(p)}
                            className="font-mono text-xs underline cursor-pointer"
                            style={{ color: 'var(--color-ink)' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteModal(p.id)}
                            className="font-mono text-xs text-red-600 cursor-pointer font-bold"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div
                    className="hidden md:grid gap-4 items-center"
                    style={{ gridTemplateColumns: '48px 1fr 200px 100px 80px 100px 70px' }}
                  >
                    <div
                      className="w-11 h-11 overflow-hidden flex items-center justify-center border"
                      style={{
                        borderColor: 'var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--color-border-light)',
                      }}
                    >
                      {p.cover_url ? (
                        <img src={p.cover_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[9px] font-mono" style={{ color: 'var(--color-muted)' }}>No Img</span>
                      )}
                    </div>
                    <div className="min-w-0 pr-2">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-ink)' }}>
                        {p.title}
                      </p>
                      <p className="text-xs truncate font-serif italic" style={{ color: 'var(--color-muted)' }}>
                        {p.subtitle || p.description || 'Tidak ada ringkasan'}
                      </p>
                    </div>
                    <div className="min-w-0 flex flex-col gap-0.5">
                      <span
                        className="inline-block font-mono text-[11px] font-semibold px-2 py-0.5 border rounded truncate max-w-full w-fit"
                        style={{
                          borderColor: 'var(--color-border)',
                          backgroundColor: '#F7F7F5',
                          color: 'var(--color-ink)',
                        }}
                      >
                        {canonicalCat}
                      </span>
                      {subcategory ? (
                        <span
                          className="font-mono text-[10px] px-1.5 py-0.2 rounded w-fit truncate"
                          style={{ backgroundColor: '#EAEAE6', color: 'var(--color-ink)' }}
                        >
                          {subcategory}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-gray-300">-</span>
                      )}
                    </div>
                    <div>
                      <span
                        className="font-mono text-xs px-2 py-0.5 rounded uppercase tracking-wider inline-block"
                        style={{
                          backgroundColor:
                            p.status === 'published' ? 'var(--color-ink)' : 'var(--color-border-light)',
                          color:
                            p.status === 'published' ? 'var(--color-paper)' : 'var(--color-muted)',
                        }}
                      >
                        {p.status}
                      </span>
                    </div>
                    <div>
                      <span
                        className="font-mono text-xs"
                        style={{ color: p.featured ? '#10B981' : 'var(--color-muted)' }}
                      >
                        {p.featured ? 'Ya ★' : 'Tidak'}
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-xs" style={{ color: 'var(--color-muted)' }}>
                        {p.updated_at ? p.updated_at.slice(0, 10) : p.year || '-'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 justify-end">
                      <button
                        onClick={() => startEdit(p)}
                        className="font-mono text-xs underline cursor-pointer hover:opacity-80"
                        style={{ color: 'var(--color-ink)' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteModal(p.id)}
                        className="font-mono text-xs text-red-600 font-bold hover:opacity-80 cursor-pointer"
                        title="Hapus proyek"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ backgroundColor: 'rgba(10,10,10,0.4)' }}
          >
            <div
              className="w-full max-w-sm p-6 border shadow-xl"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <h3
                className="font-sans font-bold text-base mb-2 text-red-600"
              >
                Hapus Proyek Ini?
              </h3>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                Tindakan ini akan menghapus proyek dan seluruh galeri terkait secara permanen. Tindakan ini tidak bisa dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(deleteModal)}
                  className="flex-1 py-2.5 text-xs font-semibold tracking-widest uppercase cursor-pointer"
                  style={{
                    backgroundColor: '#c0392b',
                    color: '#fff',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  Ya, Hapus
                </button>
                <button
                  onClick={() => setDeleteModal(null)}
                  className="flex-1 py-2.5 text-xs font-semibold tracking-widest uppercase border cursor-pointer hover:bg-black/5"
                  style={{
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-ink)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PROJECT FORM WITH 4 TABS & PRESETS
// ─────────────────────────────────────────────────────────────────────────────

function ProjectForm({
  project,
  onSave,
  onCancel,
  loading,
}: {
  project: Project | null
  onSave: (data: Partial<Project>) => void
  onCancel: () => void
  loading: boolean
}) {
  const [activeTab, setActiveTab] = useState<'basic' | 'role' | 'content' | 'media'>('basic')

  const parseArrayToString = (arr: any) => {
    if (!arr) return ''
    if (Array.isArray(arr)) return arr.join(', ')
    return String(arr)
  }

  const getInitialSections = (): ProjectSection[] => {
    if (project?.sections && Array.isArray(project.sections) && project.sections.length > 0) {
      return project.sections
    }
    const list: ProjectSection[] = []
    if (project?.overview) {
      list.push({ id: '01', label: 'Overview', sublabel: 'Gambaran Umum & Tujuan', content: project.overview })
    }
    if (project?.problem) {
      list.push({ id: '02', label: 'Problem & Architecture', sublabel: 'Tantangan & Permasalahan', content: project.problem })
    }
    if (project?.result) {
      list.push({ id: '03', label: 'Result & Impact', sublabel: 'Hasil & Solusi', content: project.result })
    }
    if (list.length === 0) {
      return [
        { id: '01', label: 'Overview', sublabel: 'Gambaran Umum & Tujuan', content: '' },
        { id: '02', label: 'Problem / Process', sublabel: 'Tantangan & Proses Kerja', content: '' },
        { id: '03', label: 'Result & Impact', sublabel: 'Hasil & Pembelajaran', content: '' },
      ]
    }
    return list
  }

  const initialSubcategory = getProjectSubcategory(project)

  // Filter out subcategory from initial tags display so tags don't duplicate subcategory
  const getInitialTags = () => {
    const rawArr = Array.isArray(project?.tags)
      ? project.tags
      : typeof project?.tags === 'string'
      ? (project.tags as string).split(',').map((s) => s.trim()).filter(Boolean)
      : []
    return rawArr.filter((t) => t !== initialSubcategory).join(', ')
  }

  const [form, setForm] = useState({
    title: project?.title || '',
    slug: project?.slug || '',
    subtitle: project?.subtitle || '',
    description: project?.description || '',
    category: (project?.category ? normalizeCategory(project.category) : 'Engineering & Tech') as MainCategory,
    subcategory: initialSubcategory,
    year: project?.year || new Date().getFullYear().toString(),
    status: project?.status || 'published',
    featured: project?.featured ?? true,

    // Role & Tools
    role: project?.role || '',
    toolsText: parseArrayToString(project?.tools),
    tagsText: getInitialTags(),

    // Smart Links
    github_url: project?.github_url || '',
    live_url: project?.live_url || '',
    figma_url: project?.figma_url || '',
    video_url: project?.video_url || '',
    instagram_url: project?.instagram_url || '',
    drive_url: project?.drive_url || '',

    // Case Study Sections
    sections: getInitialSections(),

    // Media
    cover_url: project?.cover_url || '',
    gallery: Array.isArray(project?.gallery) ? project.gallery : [],
  })

  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [newGalleryUrl, setNewGalleryUrl] = useState('')
  const [previewSectionId, setPreviewSectionId] = useState<string | null>(null)

  const activeSuggestions = SUBCATEGORY_SUGGESTIONS[form.category] || []

  const applyPreset = (presetName: string) => {
    const preset = CASE_STUDY_PRESETS.find((p) => p.name === presetName)
    if (!preset) return

    if (
      form.sections.some((s) => s.content.trim()) &&
      !confirm(`Ganti section dengan template "${preset.name}"? Konten section saat ini akan ditimpa.`)
    ) {
      return
    }

    const newSections: ProjectSection[] = preset.sections.map((sec, idx) => ({
      id: idx < 9 ? `0${idx + 1}` : `${idx + 1}`,
      label: sec.label,
      sublabel: sec.sublabel,
      content: '',
    }))

    setForm((prev) => ({
      ...prev,
      category: preset.category,
      sections: newSections,
    }))
  }

  const handleAddSection = () => {
    const nextIdx = form.sections.length + 1
    const nextId = nextIdx < 9 ? `0${nextIdx}` : `${nextIdx}`
    setForm((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        { id: nextId, label: `Section ${nextIdx}`, sublabel: 'Keterangan Tambahan', content: '' },
      ],
    }))
  }

  const handleRemoveSection = (index: number) => {
    if (form.sections.length <= 1) {
      alert('Minimal harus ada 1 section studi kasus.')
      return
    }
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, idx) => idx !== index),
    }))
  }

  const handleUpdateSection = (index: number, field: keyof ProjectSection, value: string) => {
    setForm((prev) => {
      const updated = [...prev.sections]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, sections: updated }
    })
  }

  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return
    setForm((prev) => ({
      ...prev,
      gallery: [...prev.gallery, newGalleryUrl.trim()],
    }))
    setNewGalleryUrl('')
  }

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, idx) => idx !== indexToRemove),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const subcategoryTrim = form.subcategory.trim()

    const toolsArray = form.toolsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    let tagsArray = form.tagsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    // Store subcategory at index 0 of tags as safe fallback
    if (subcategoryTrim && !tagsArray.includes(subcategoryTrim)) {
      tagsArray = [subcategoryTrim, ...tagsArray]
    }

    const overviewText = form.sections[0]?.content || ''
    const problemText = form.sections[1]?.content || ''
    const resultText = form.sections[2]?.content || ''

    onSave({
      title: form.title,
      slug: form.slug.trim() || undefined,
      subtitle: form.subtitle,
      description: form.description,
      category: form.category,
      subcategory: subcategoryTrim,
      year: form.year,
      status: form.status as 'draft' | 'published',
      featured: form.featured,
      role: form.role,
      tools: toolsArray,
      tags: tagsArray,
      github_url: form.github_url.trim(),
      live_url: form.live_url.trim(),
      figma_url: form.figma_url.trim(),
      video_url: form.video_url.trim(),
      instagram_url: form.instagram_url.trim(),
      drive_url: form.drive_url.trim(),
      overview: overviewText,
      problem: problemText,
      result: resultText,
      sections: form.sections,
      cover_url: form.cover_url.trim(),
      gallery: form.gallery,
    })
  }

  const videoEmbedUrl = getYouTubeEmbedUrl(form.video_url)

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Navigation Tabs Header */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 border rounded-md overflow-hidden"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
        >
          {[
            { key: 'basic', label: '1. Info Utama' },
            { key: 'role', label: '2. Peran & Tautan' },
            { key: 'content', label: `3. Studi Kasus (${form.sections.length})` },
            { key: 'media', label: `4. Media & Galeri (${form.gallery.length + (form.cover_url ? 1 : 0)})` },
          ].map((tab) => {
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as any)}
                className="py-3.5 px-4 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer text-center"
                style={{
                  backgroundColor: isActive ? 'var(--color-ink)' : 'transparent',
                  color: isActive ? 'var(--color-paper)' : 'var(--color-muted)',
                  fontWeight: isActive ? '600' : '400',
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* ── TAB 1: INFORMASI UTAMA ─────────────────────────────────────── */}
        {activeTab === 'basic' && (
          <div
            className="p-6 md:p-8 border rounded-lg flex flex-col gap-5 shadow-xs"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
          >
            <div>
              <h3 className="font-sans font-bold text-lg mb-1" style={{ color: 'var(--color-ink)' }}>
                Informasi Utama Proyek
              </h3>
              <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                Tentukan judul, kategori payung, subkategori spesifik, dan ringkasan tampilan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs tracking-widest uppercase font-semibold" style={{ color: 'var(--color-muted)' }}>
                  Judul Proyek *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  disabled={loading}
                  placeholder="Contoh: NataArtha / Layar Putih Reel"
                  className="w-full px-4 py-2.5 text-sm border outline-none rounded-md"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)', backgroundColor: '#FFFFFF' }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs tracking-widest uppercase font-semibold" style={{ color: 'var(--color-muted)' }}>
                  Slug URL (Opsional)
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  disabled={loading}
                  placeholder="otomatis-dibuat-jika-kosong"
                  className="w-full px-4 py-2.5 text-sm border outline-none rounded-md font-mono"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)', backgroundColor: '#FFFFFF' }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs tracking-widest uppercase font-semibold" style={{ color: 'var(--color-muted)' }}>
                Subtitle / Tipe Proyek
              </label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                disabled={loading}
                placeholder="Contoh: Personal Finance Management App / Commercial Showreel"
                className="w-full px-4 py-2.5 text-sm border outline-none rounded-md"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)', backgroundColor: '#FFFFFF' }}
              />
            </div>

            {/* Kategori Utama (Locked Dropdown) & Subkategori */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 border rounded-md"
              style={{ borderColor: 'var(--color-border)', backgroundColor: '#F7F7F5' }}
            >
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs tracking-widest uppercase font-bold" style={{ color: 'var(--color-ink)' }}>
                  Kategori Utama (Terkunci 3 Pilihan) *
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as MainCategory })}
                  disabled={loading}
                  className="w-full px-4 py-2.5 text-sm border outline-none rounded-md font-medium cursor-pointer"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)', backgroundColor: '#FFFFFF' }}
                >
                  {MAIN_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} style={{ color: '#0A0A0A', backgroundColor: '#FFFFFF' }}>
                      {cat}
                    </option>
                  ))}
                </select>
                <p className="text-[11px]" style={{ color: 'var(--color-muted)' }}>
                  Filter publik di katalog hanya menggunakan 3 kategori ini.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs tracking-widest uppercase font-bold" style={{ color: 'var(--color-ink)' }}>
                  Subkategori Spesifik (Tampil di Kartu &amp; Detail)
                </label>
                <input
                  type="text"
                  value={form.subcategory}
                  onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                  disabled={loading}
                  placeholder="Contoh: Web Development / Mobile App / Videography"
                  className="w-full px-4 py-2.5 text-sm border outline-none rounded-md"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)', backgroundColor: '#FFFFFF' }}
                />
                
                {/* Suggestions Pills */}
                {activeSuggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="text-[10px] font-mono mr-1 self-center" style={{ color: 'var(--color-muted)' }}>
                      Rekomendasi:
                    </span>
                    {activeSuggestions.map((sug) => {
                      const isSelected = form.subcategory === sug
                      return (
                        <button
                          type="button"
                          key={sug}
                          onClick={() => setForm({ ...form, subcategory: sug })}
                          className="text-[10px] font-mono px-2 py-0.5 border rounded cursor-pointer transition-colors"
                          style={{
                            borderColor: isSelected ? 'var(--color-ink)' : 'var(--color-border)',
                            backgroundColor: isSelected ? 'var(--color-ink)' : '#FFFFFF',
                            color: isSelected ? 'var(--color-paper)' : 'var(--color-muted)',
                            fontWeight: isSelected ? '600' : '400',
                          }}
                        >
                          {sug}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs tracking-widest uppercase font-semibold" style={{ color: 'var(--color-muted)' }}>
                  Tahun Pengerjaan
                </label>
                <input
                  type="text"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  disabled={loading}
                  placeholder="2024"
                  className="w-full px-4 py-2.5 text-sm border outline-none rounded-md"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)', backgroundColor: '#FFFFFF' }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs tracking-widest uppercase font-semibold" style={{ color: 'var(--color-muted)' }}>
                  Status Publikasi
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                  disabled={loading}
                  className="w-full px-4 py-2.5 text-sm border outline-none rounded-md cursor-pointer"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)', backgroundColor: '#FFFFFF' }}
                >
                  <option value="published" style={{ color: '#0A0A0A', backgroundColor: '#FFFFFF' }}>Published (Tampil di Website)</option>
                  <option value="draft" style={{ color: '#0A0A0A', backgroundColor: '#FFFFFF' }}>Draft (Disembunyikan)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                disabled={loading}
                className="w-4 h-4 rounded cursor-pointer"
              />
              <label htmlFor="featured" className="text-sm font-medium cursor-pointer" style={{ color: 'var(--color-ink)' }}>
                Tampilkan di Bagian Karya Pilihan (Featured) di Beranda
              </label>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs tracking-widest uppercase font-semibold" style={{ color: 'var(--color-muted)' }}>
                Deskripsi Singkat (Ringkasan untuk kartu proyek di katalog)
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                disabled={loading}
                placeholder="Tulis 1-2 kalimat ringkasan yang menarik dan menjelaskan esensi karya ini..."
                className="w-full px-4 py-2.5 text-sm border outline-none resize-none rounded-md"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)', backgroundColor: '#FFFFFF' }}
              />
            </div>
          </div>
        )}

        {/* ── TAB 2: PERAN & TAUTAN ───────────────────────────────────────── */}
        {activeTab === 'role' && (
          <div
            className="p-6 md:p-8 border rounded-lg flex flex-col gap-5 shadow-xs"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
          >
            <div>
              <h3 className="font-sans font-bold text-lg mb-1" style={{ color: 'var(--color-ink)' }}>
                Peran, Tools &amp; Tautan Pintar
              </h3>
              <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                Tentukan kontribusi Anda, tools yang digunakan, serta link eksternal (GitHub, Figma, Live Demo, YouTube, dll.).
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs tracking-widest uppercase font-semibold" style={{ color: 'var(--color-muted)' }}>
                Peran / Kontribusi Anda (Role)
              </label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                disabled={loading}
                placeholder="Contoh: Fullstack Developer / UI Designer / Director & Cinematographer"
                className="w-full px-4 py-2.5 text-sm border outline-none rounded-md"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)', backgroundColor: '#FFFFFF' }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs tracking-widest uppercase font-semibold" style={{ color: 'var(--color-muted)' }}>
                  Tools &amp; Tech Stack (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={form.toolsText}
                  onChange={(e) => setForm({ ...form, toolsText: e.target.value })}
                  disabled={loading}
                  placeholder="Figma, React Native, Firebase, Premiere Pro, Python"
                  className="w-full px-4 py-2.5 text-sm border outline-none rounded-md"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)', backgroundColor: '#FFFFFF' }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs tracking-widest uppercase font-semibold" style={{ color: 'var(--color-muted)' }}>
                  Tags / Filter Tambahan (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={form.tagsText}
                  onChange={(e) => setForm({ ...form, tagsText: e.target.value })}
                  disabled={loading}
                  placeholder="UI/UX, Frontend, Commercial Video, Systems"
                  className="w-full px-4 py-2.5 text-sm border outline-none rounded-md"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)', backgroundColor: '#FFFFFF' }}
                />
              </div>
            </div>

            {/* Smart Links Section */}
            <div className="pt-4 border-t flex flex-col gap-4" style={{ borderColor: 'var(--color-border)' }}>
              <p className="font-mono text-xs tracking-widest uppercase font-bold" style={{ color: 'var(--color-ink)' }}>
                Tautan Eksternal Pintar (Smart Links)
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs tracking-wider flex items-center gap-1.5" style={{ color: 'var(--color-ink)' }}>
                    <span>🌐 Live Demo / Website URL</span>
                  </label>
                  <input
                    type="url"
                    value={form.live_url}
                    onChange={(e) => setForm({ ...form, live_url: e.target.value })}
                    disabled={loading}
                    placeholder="https://example.com"
                    className="w-full px-3.5 py-2.5 text-xs border outline-none rounded"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)', backgroundColor: '#FFFFFF' }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs tracking-wider flex items-center gap-1.5" style={{ color: 'var(--color-ink)' }}>
                    <span>🐙 GitHub Repository URL</span>
                  </label>
                  <input
                    type="url"
                    value={form.github_url}
                    onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                    disabled={loading}
                    placeholder="https://github.com/mazizi29/..."
                    className="w-full px-3.5 py-2.5 text-xs border outline-none rounded"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)', backgroundColor: '#FFFFFF' }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs tracking-wider flex items-center gap-1.5" style={{ color: 'var(--color-ink)' }}>
                    <span>🎨 Figma Prototype / File URL</span>
                  </label>
                  <input
                    type="url"
                    value={form.figma_url}
                    onChange={(e) => setForm({ ...form, figma_url: e.target.value })}
                    disabled={loading}
                    placeholder="https://www.figma.com/file/..."
                    className="w-full px-3.5 py-2.5 text-xs border outline-none rounded"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)', backgroundColor: '#FFFFFF' }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs tracking-wider flex items-center gap-1.5" style={{ color: 'var(--color-ink)' }}>
                    <span>🎬 YouTube / Vimeo Video URL (Embed)</span>
                  </label>
                  <input
                    type="url"
                    value={form.video_url}
                    onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                    disabled={loading}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3.5 py-2.5 text-xs border outline-none rounded"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)', backgroundColor: '#FFFFFF' }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs tracking-wider flex items-center gap-1.5" style={{ color: 'var(--color-ink)' }}>
                    <span>📷 Instagram Post / Reel URL</span>
                  </label>
                  <input
                    type="url"
                    value={form.instagram_url}
                    onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
                    disabled={loading}
                    placeholder="https://instagram.com/p/..."
                    className="w-full px-3.5 py-2.5 text-xs border outline-none rounded"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)', backgroundColor: '#FFFFFF' }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs tracking-wider flex items-center gap-1.5" style={{ color: 'var(--color-ink)' }}>
                    <span>📁 Google Drive / Asset Portfolio URL</span>
                  </label>
                  <input
                    type="url"
                    value={form.drive_url}
                    onChange={(e) => setForm({ ...form, drive_url: e.target.value })}
                    disabled={loading}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3.5 py-2.5 text-xs border outline-none rounded"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)', backgroundColor: '#FFFFFF' }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: STUDI KASUS (SECTIONS DINAMIS & PRESETS) ─────────────── */}
        {activeTab === 'content' && (
          <div
            className="p-6 md:p-8 border rounded-lg flex flex-col gap-6 shadow-xs"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
          >
            <div>
              <h3 className="font-sans font-bold text-lg mb-1" style={{ color: 'var(--color-ink)' }}>
                Studi Kasus &amp; Struktur Konten
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                Gunakan template cepat (*1-click presets*) atau sesuaikan judul dan poin studi kasus secara fleksibel.
                Awali baris dengan tanda minus (<code className="font-semibold px-1 py-0.5 rounded bg-gray-200">-</code>) atau angka (<code className="font-semibold px-1 py-0.5 rounded bg-gray-200">1.</code>) untuk otomatis membuat daftar poin rapi.
              </p>
            </div>

            {/* Presets Bar */}
            <div className="p-4 border rounded-md" style={{ borderColor: 'var(--color-border)', backgroundColor: '#F7F7F5' }}>
              <p className="font-mono text-[11px] uppercase tracking-wider font-bold mb-2.5" style={{ color: 'var(--color-ink)' }}>
                ⚡ 1-Click Template Presets:
              </p>
              <div className="flex flex-wrap gap-2">
                {CASE_STUDY_PRESETS.map((preset) => (
                  <button
                    type="button"
                    key={preset.name}
                    onClick={() => applyPreset(preset.name)}
                    className="text-xs font-mono px-3 py-1.5 border rounded transition-colors cursor-pointer"
                    style={{
                      borderColor: 'var(--color-border)',
                      backgroundColor: '#FFFFFF',
                      color: 'var(--color-ink)',
                    }}
                  >
                    + Template: {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Sections List */}
            <div className="flex flex-col gap-6">
              {form.sections.map((sec, idx) => (
                <div
                  key={idx}
                  className="p-5 border rounded-md flex flex-col gap-3 relative"
                  style={{
                    borderColor: 'var(--color-border)',
                    backgroundColor: '#FAFAFA',
                  }}
                >
                  <div className="flex items-center justify-between gap-3 border-b pb-3" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex items-center gap-2 flex-1">
                      <span
                        className="font-mono text-xs font-bold px-2 py-0.5 rounded"
                        style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-ink)' }}
                      >
                        {sec.id || `0${idx + 1}`}
                      </span>
                      <input
                        type="text"
                        value={sec.label}
                        onChange={(e) => handleUpdateSection(idx, 'label', e.target.value)}
                        placeholder="Label Utama (contoh: Overview / Problem / Solution)"
                        className="font-sans font-bold text-sm bg-transparent outline-none border-b border-dashed px-1 py-0.5 flex-1"
                        style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPreviewSectionId(previewSectionId === sec.id ? null : sec.id)}
                        className="font-mono text-xs underline cursor-pointer hover:opacity-80"
                        style={{ color: 'var(--color-muted)' }}
                      >
                        {previewSectionId === sec.id ? 'Tutup Preview' : '👁️ Preview'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(idx)}
                        className="text-xs font-mono text-red-600 font-bold px-2 py-1 rounded hover:bg-red-50 cursor-pointer"
                        title="Hapus section"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-mono" style={{ color: 'var(--color-muted)' }}>Sublabel / Keterangan Judul:</label>
                    <input
                      type="text"
                      value={sec.sublabel || ''}
                      onChange={(e) => handleUpdateSection(idx, 'sublabel', e.target.value)}
                      placeholder="Contoh: Gambaran Umum &amp; Latar Belakang Masalah"
                      className="text-xs px-3 py-2 border rounded outline-none"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)', backgroundColor: '#FFFFFF' }}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-mono" style={{ color: 'var(--color-muted)' }}>Isi Konten Studi Kasus:</label>
                    <textarea
                      rows={5}
                      value={sec.content}
                      onChange={(e) => handleUpdateSection(idx, 'content', e.target.value)}
                      placeholder="Tuliskan penjelasan atau daftar poin terstruktur..."
                      className="w-full px-3.5 py-2.5 text-xs md:text-sm border outline-none resize-y rounded-md font-sans"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)', backgroundColor: '#FFFFFF' }}
                    />
                  </div>

                  {previewSectionId === sec.id && sec.content.trim() && (
                    <div className="p-4 border rounded-md" style={{ borderColor: 'var(--color-border)', backgroundColor: '#FFFFFF' }}>
                      <p className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: 'var(--color-muted)' }}>
                        Pratinjau Tampilan Publik:
                      </p>
                      <FormattedContent text={sec.content} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddSection}
              className="py-2.5 px-4 text-xs font-mono uppercase tracking-wider border border-dashed rounded-md hover:bg-black/5 transition-colors cursor-pointer text-center"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
            >
              + Tambah Section Kustom
            </button>
          </div>
        )}

        {/* ── TAB 4: MEDIA & GALERI ───────────────────────────────────────── */}
        {activeTab === 'media' && (
          <div
            className="p-6 md:p-8 border rounded-lg flex flex-col gap-6 shadow-xs"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
          >
            <div>
              <h3 className="font-sans font-bold text-lg mb-1" style={{ color: 'var(--color-ink)' }}>
                Cover &amp; Galeri Media
              </h3>
              <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                Upload cover utama, sematkan video embed YouTube, dan tambahkan galeri mockup/foto resolusi tinggi.
              </p>
            </div>

            {/* Cover Section */}
            <div className="flex flex-col gap-2 p-4 border rounded-md" style={{ borderColor: 'var(--color-border)', backgroundColor: '#FAFAFA' }}>
              <label className="font-mono text-xs tracking-widest uppercase font-bold" style={{ color: 'var(--color-ink)' }}>
                Gambar Cover Proyek (Wajib) *
              </label>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.cover_url}
                  onChange={(e) => setForm({ ...form, cover_url: e.target.value })}
                  disabled={loading}
                  placeholder="Masukkan URL gambar atau klik tombol Upload..."
                  className="flex-1 px-4 py-2.5 text-sm border outline-none rounded-md"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)', backgroundColor: '#FFFFFF' }}
                />
                <label
                  className="px-4 py-2.5 text-xs font-semibold tracking-widest uppercase cursor-pointer flex items-center justify-center shrink-0 disabled:opacity-50 transition-opacity hover:opacity-85"
                  style={{
                    backgroundColor: 'var(--color-ink)',
                    color: 'var(--color-paper)',
                    letterSpacing: '0.05em',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  Upload File
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={loading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const { url, error } = await uploadImage(file)
                      if (error || !url) alert('Gagal upload: ' + error)
                      else setForm({ ...form, cover_url: url })
                      e.target.value = ''
                    }}
                  />
                </label>
              </div>

              {form.cover_url && (
                <div className="mt-2 w-full max-w-md h-48 border rounded overflow-hidden relative group" style={{ borderColor: 'var(--color-border)' }}>
                  <img src={form.cover_url} alt="Cover preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-mono">
                    Pratinjau Cover
                  </div>
                </div>
              )}
            </div>

            {/* Video Player Preview if Video URL is provided */}
            {form.video_url && (
              <div className="p-4 border rounded-md" style={{ borderColor: 'var(--color-border)', backgroundColor: '#F7F7F5' }}>
                <p className="font-mono text-xs tracking-wider uppercase font-bold mb-2" style={{ color: 'var(--color-ink)' }}>
                  🎬 Pratinjau Pemutar Video (YouTube / Vimeo Embed):
                </p>
                {videoEmbedUrl ? (
                  <div className="aspect-video w-full max-w-xl rounded overflow-hidden border bg-black" style={{ borderColor: 'var(--color-border)' }}>
                    <iframe
                      src={videoEmbedUrl}
                      title="Video Preview"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <p className="text-xs font-mono text-amber-700">
                    URL video terisi: {form.video_url}
                  </p>
                )}
              </div>
            )}

            {/* Multi-Image Gallery */}
            <div className="flex flex-col gap-3 pt-2">
              <label className="font-mono text-xs tracking-widest uppercase font-bold" style={{ color: 'var(--color-ink)' }}>
                Galeri Gambar Tambahan / Tangkapan Layar ({form.gallery.length})
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGalleryUrl}
                  onChange={(e) => setNewGalleryUrl(e.target.value)}
                  disabled={loading || uploadingGallery}
                  placeholder="Masukkan URL gambar atau klik tombol Upload Galeri..."
                  className="flex-1 px-4 py-2.5 text-sm border outline-none rounded-md"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)', backgroundColor: '#FFFFFF' }}
                />
                <button
                  type="button"
                  onClick={handleAddGalleryUrl}
                  disabled={!newGalleryUrl.trim() || loading || uploadingGallery}
                  className="px-4 py-2.5 text-xs font-semibold tracking-widest uppercase border disabled:opacity-40 cursor-pointer"
                  style={{
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-ink)',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  + Tambah URL
                </button>
                <label
                  className="px-4 py-2.5 text-xs font-semibold tracking-widest uppercase cursor-pointer flex items-center justify-center shrink-0 disabled:opacity-50"
                  style={{
                    backgroundColor: '#EBEBEB',
                    color: 'var(--color-ink)',
                    letterSpacing: '0.05em',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  {uploadingGallery ? 'Mengupload...' : 'Upload File'}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    disabled={loading || uploadingGallery}
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || [])
                      if (files.length === 0) return
                      setUploadingGallery(true)
                      const uploadedUrls: string[] = []
                      for (const file of files) {
                        const { url } = await uploadImage(file)
                        if (url) uploadedUrls.push(url)
                      }
                      setUploadingGallery(false)
                      if (uploadedUrls.length > 0) {
                        setForm((prev) => ({ ...prev, gallery: [...prev.gallery, ...uploadedUrls] }))
                      }
                      e.target.value = ''
                    }}
                  />
                </label>
              </div>

              {/* Gallery Grid */}
              {form.gallery.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                  {form.gallery.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative group border rounded overflow-hidden h-28"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute top-1.5 right-1.5 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-90 hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                        title="Hapus gambar"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── BOTTOM ACTION BAR ───────────────────────────────────────────── */}
        <div
          className="p-4 border rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 z-40 shadow-lg"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: 'var(--color-border)',
          }}
        >
          {/* Tab Prev / Next helpers */}
          <div className="flex gap-2">
            {activeTab !== 'basic' && (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'role') setActiveTab('basic')
                  if (activeTab === 'content') setActiveTab('role')
                  if (activeTab === 'media') setActiveTab('content')
                }}
                className="px-3.5 py-2 text-xs font-mono uppercase tracking-wider border rounded cursor-pointer transition-colors hover:bg-gray-100"
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-ink)',
                  backgroundColor: '#FFFFFF',
                }}
              >
                ← Tab Sebelumnya
              </button>
            )}
            {activeTab !== 'media' && (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'basic') setActiveTab('role')
                  if (activeTab === 'role') setActiveTab('content')
                  if (activeTab === 'content') setActiveTab('media')
                }}
                className="px-3.5 py-2 text-xs font-mono uppercase tracking-wider border rounded cursor-pointer transition-colors hover:bg-gray-100"
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-ink)',
                  backgroundColor: '#F7F7F5',
                }}
              >
                Tab Berikutnya →
              </button>
            )}
          </div>

          {/* Submit & Cancel */}
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none px-8 py-3 text-xs font-semibold tracking-widest uppercase disabled:opacity-50 transition-opacity hover:opacity-85 cursor-pointer shadow-sm"
              style={{
                backgroundColor: 'var(--color-ink)',
                color: 'var(--color-paper)',
                letterSpacing: '0.1em',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {loading ? 'Menyimpan...' : 'Simpan Proyek'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-3 text-xs font-semibold tracking-widest uppercase border disabled:opacity-50 transition-colors hover:bg-gray-50 cursor-pointer"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-ink)',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              Batal
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
