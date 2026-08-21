import { useState, useEffect } from 'react'
import AdminLayout from '@/layouts/admin/AdminLayout'
import FormattedContent from '@/components/common/FormattedContent'
import { getSupabaseClient } from '@/lib/supabase'
import { uploadImage } from '@/lib/upload'

const supabase = getSupabaseClient()

export interface Project {
  id: string
  sort_order: number
  slug: string
  title: string
  subtitle: string
  description: string
  category: string
  year: string
  role: string
  tools: string[] | string
  tags: string[] | string
  status: 'draft' | 'published'
  featured: boolean
  cover_url: string
  gallery?: string[]
  overview: string
  problem: string
  result: string
  github_url: string
  live_url: string
  created_at?: string
  updated_at?: string
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list' | 'form'>('list')
  const [editing, setEditing] = useState<Project | null>(null)
  const [deleteModal, setDeleteModal] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*, project_gallery(*)')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching projects:', error)
    } else {
      const formatted = (data || []).map((p: any) => ({
        ...p,
        gallery: Array.isArray(p.project_gallery) && p.project_gallery.length > 0
          ? [...p.project_gallery].sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)).map((g: any) => g.image_url)
          : (Array.isArray(p.gallery) ? p.gallery : [])
      }))
      setProjects(formatted)
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

      if (editing) {
        // Update data
        const { error, data: updatedData } = await supabase
          .from('projects')
          .update({
            ...projectPayload,
            updated_at: new Date().toISOString()
          })
          .eq('id', editing.id)
          .select()
          .single()
        
        if (error) throw error
        targetProjectId = updatedData.id
      } else {
        // Insert data baru
        const slug = projectPayload.slug || projectPayload.title?.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') || `project-${Date.now()}`
        const { error, data: insertedData } = await supabase
          .from('projects')
          .insert({
            ...projectPayload,
            slug,
            status: projectPayload.status || 'published',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single()

        if (error) throw error
        targetProjectId = insertedData.id
      }

      // Sync gallery records in project_gallery table
      if (targetProjectId && Array.isArray(gallery)) {
        await supabase.from('project_gallery').delete().eq('project_id', targetProjectId)

        const cleanGalleryUrls = gallery.filter(url => url && typeof url === 'string' && url.trim().length > 0)
        if (cleanGalleryUrls.length > 0) {
          const galleryRows = cleanGalleryUrls.map((imgUrl, idx) => ({
            project_id: targetProjectId,
            image_url: imgUrl.trim(),
            sort_order: idx + 1
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

  if (view === 'form') {
    return (
      <AdminLayout title={editing ? 'Edit Project' : 'New Project'}>
        <ProjectForm
          project={editing}
          onSave={handleSave}
          onCancel={() => { setView('list'); setEditing(null) }}
          loading={loading}
        />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Proyek">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-sans font-semibold text-lg md:text-xl" style={{ color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>
            Semua Proyek
          </h2>
          <button
            onClick={startNew}
            disabled={loading}
            className="px-4 py-2 md:px-5 md:py-2.5 text-xs font-semibold tracking-widest uppercase whitespace-nowrap disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-ink)', color: 'var(--color-paper)', letterSpacing: '0.08em', borderRadius: 'var(--radius-sm)' }}
          >
            + Tambah Proyek
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm" style={{ color: 'var(--color-muted)' }}>
            Memuat data proyek...
          </div>
        ) : projects.length === 0 ? (
          <div className="py-12 text-center text-sm border" style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-muted)' }}>
            Belum ada proyek. Klik tombol + Tambah Proyek untuk mulai.
          </div>
        ) : (
          <div
            className="border overflow-hidden"
            style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)' }}
          >
            {/* Header row — hidden on mobile */}
            <div
              className="hidden md:grid gap-4 px-5 py-3 border-b text-xs font-mono tracking-widest uppercase"
              style={{
                gridTemplateColumns: '40px 1fr 120px 90px 80px 100px 60px',
                borderColor: 'var(--color-border)',
                color: 'var(--color-muted)',
                letterSpacing: '0.08em',
                backgroundColor: '#F7F7F5',
              }}
            >
              <div />
              <div>Judul</div>
              <div>Kategori</div>
              <div>Status</div>
              <div>Featured</div>
              <div>Update</div>
              <div />
            </div>

            {projects.map((p) => (
              <div
                key={p.id}
                className="border-b last:border-0 px-4 md:px-5 py-4"
                style={{ borderColor: 'var(--color-border-light)' }}
              >
                {/* Mobile card layout */}
                <div className="flex items-start gap-3 md:hidden">
                  <div
                    className="w-12 h-12 shrink-0 overflow-hidden bg-gray-100 flex items-center justify-center text-gray-400 text-xs"
                    style={{ backgroundColor: 'var(--color-border-light)', borderRadius: 'var(--radius-sm)' }}
                  >
                    {p.cover_url ? <img src={p.cover_url} alt="" className="w-full h-full object-cover" /> : 'No Img'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-ink)' }}>{p.title}</p>
                      <span
                        className="font-mono text-xs px-1.5 py-0.5 shrink-0"
                        style={{
                          backgroundColor: p.status === 'published' ? 'var(--color-ink)' : 'var(--color-border-light)',
                          color: p.status === 'published' ? 'var(--color-paper)' : 'var(--color-muted)',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        {p.status}
                      </span>
                    </div>
                    <p className="text-xs mb-2 truncate" style={{ color: 'var(--color-muted)' }}>
                      {p.category} · {p.featured ? '★ Featured · ' : ''}{p.updated_at ? p.updated_at.slice(0, 10) : ''}
                    </p>
                    <div className="flex gap-4">
                      <button onClick={() => startEdit(p)} className="font-mono text-xs" style={{ color: 'var(--color-muted)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>Edit</button>
                      <button onClick={() => setDeleteModal(p.id)} className="font-mono text-xs" style={{ color: '#c0392b' }}>Hapus</button>
                    </div>
                  </div>
                </div>

                {/* Desktop row layout */}
                <div
                  className="hidden md:grid gap-4 items-center"
                  style={{ gridTemplateColumns: '40px 1fr 120px 90px 80px 100px 60px' }}
                >
                  <div
                    className="w-9 h-9 overflow-hidden bg-gray-100 flex items-center justify-center text-gray-400 text-xs"
                    style={{ backgroundColor: 'var(--color-border-light)', borderRadius: 'var(--radius-sm)' }}
                  >
                    {p.cover_url ? <img src={p.cover_url} alt="" className="w-full h-full object-cover" /> : 'Img'}
                  </div>
                  <div className="min-w-0 truncate pr-2">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--color-ink)' }}>{p.title}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--color-muted)' }}>{p.subtitle}</p>
                  </div>
                  <span className="font-mono text-xs truncate" style={{ color: 'var(--color-muted)' }}>{p.category}</span>
                  <span
                    className="font-mono text-xs px-2 py-0.5 w-fit"
                    style={{
                      backgroundColor: p.status === 'published' ? 'var(--color-ink)' : 'var(--color-border-light)',
                      color: p.status === 'published' ? 'var(--color-paper)' : 'var(--color-muted)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    {p.status}
                  </span>
                  <span className="font-mono text-xs" style={{ color: p.featured ? '#10B981' : 'var(--color-muted)' }}>
                    {p.featured ? 'Ya ★' : 'Tidak'}
                  </span>
                  <span className="font-mono text-xs" style={{ color: 'var(--color-muted)' }}>{p.updated_at ? p.updated_at.slice(0, 10) : ''}</span>
                  <div className="flex items-center gap-3 justify-end">
                    <button onClick={() => startEdit(p)} className="font-mono text-xs" style={{ color: 'var(--color-muted)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>Edit</button>
                    <button onClick={() => setDeleteModal(p.id)} className="font-mono text-xs" style={{ color: '#c0392b' }}>×</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete modal */}
        {deleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(10,10,10,0.4)' }}>
            <div
              className="w-full max-w-sm p-8 border"
              style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: 'var(--radius-lg)' }}
            >
              <h3 className="font-sans font-semibold text-base mb-2" style={{ color: 'var(--color-ink)' }}>
                Hapus Proyek?
              </h3>
              <p className="text-sm mb-8" style={{ color: 'var(--color-muted)' }}>
                Tindakan ini tidak bisa dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(deleteModal)}
                  className="flex-1 py-2.5 text-xs font-semibold tracking-widest uppercase"
                  style={{ backgroundColor: '#c0392b', color: '#fff', borderRadius: 'var(--radius-sm)' }}
                >
                  Hapus
                </button>
                <button
                  onClick={() => setDeleteModal(null)}
                  className="flex-1 py-2.5 text-xs font-semibold tracking-widest uppercase border"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)', borderRadius: 'var(--radius-sm)' }}
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

function ProjectForm({
  project,
  onSave,
  onCancel,
  loading
}: {
  project: Project | null
  onSave: (data: Partial<Project>) => void
  onCancel: () => void
  loading: boolean
}) {
  const parseArrayToString = (arr: any) => {
    if (!arr) return ''
    if (Array.isArray(arr)) return arr.join(', ')
    return String(arr)
  }

  const [form, setForm] = useState({
    title: project?.title || '',
    slug: project?.slug || '',
    subtitle: project?.subtitle || '',
    description: project?.description || '',
    category: project?.category || '',
    year: project?.year || new Date().getFullYear().toString(),
    role: project?.role || '',
    toolsText: parseArrayToString(project?.tools),
    tagsText: parseArrayToString(project?.tags),
    status: project?.status || 'published',
    featured: project?.featured ?? true,
    cover_url: project?.cover_url || '',
    github_url: project?.github_url || '',
    live_url: project?.live_url || '',
    overview: project?.overview || '',
    problem: project?.problem || '',
    result: project?.result || '',
    gallery: Array.isArray(project?.gallery) ? project.gallery : []
  })

  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [newGalleryUrl, setNewGalleryUrl] = useState('')
  const [previewOverview, setPreviewOverview] = useState(false)
  const [previewProblem, setPreviewProblem] = useState(false)
  const [previewResult, setPreviewResult] = useState(false)

  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return
    setForm(prev => ({
      ...prev,
      gallery: [...prev.gallery, newGalleryUrl.trim()]
    }))
    setNewGalleryUrl('')
  }

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setForm(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, idx) => idx !== indexToRemove)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const toolsArray = form.toolsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    const tagsArray = form.tagsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    onSave({
      title: form.title,
      slug: form.slug.trim() || undefined,
      subtitle: form.subtitle,
      description: form.description,
      category: form.category,
      year: form.year,
      role: form.role,
      tools: toolsArray,
      tags: tagsArray,
      status: form.status as 'draft' | 'published',
      featured: form.featured,
      cover_url: form.cover_url,
      github_url: form.github_url,
      live_url: form.live_url,
      overview: form.overview,
      problem: form.problem,
      result: form.result,
      gallery: form.gallery
    })
  }

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Basic Info */}
        <div className="p-6 border rounded-lg flex flex-col gap-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
          <h3 className="font-sans font-bold text-base mb-1" style={{ color: 'var(--color-ink)' }}>Informasi Utama Proyek</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--color-muted)', letterSpacing: '0.1em' }}>
                Judul Proyek *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                disabled={loading}
                placeholder="Contoh: NataArtha"
                className="w-full px-4 py-2.5 text-sm border bg-transparent outline-none disabled:opacity-50 rounded-md"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--color-muted)', letterSpacing: '0.1em' }}>
                Slug URL (Opsional)
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                disabled={loading}
                placeholder="otomatis-dari-judul"
                className="w-full px-4 py-2.5 text-sm border bg-transparent outline-none disabled:opacity-50 rounded-md"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--color-muted)', letterSpacing: '0.1em' }}>
              Subtitle / Tipe Proyek
            </label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              disabled={loading}
              placeholder="Contoh: Personal Finance Management App"
              className="w-full px-4 py-2.5 text-sm border bg-transparent outline-none disabled:opacity-50 rounded-md"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--color-muted)', letterSpacing: '0.1em' }}>
                Kategori
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                disabled={loading}
                placeholder="Mobile App / Web Experience / Systems"
                className="w-full px-4 py-2.5 text-sm border bg-transparent outline-none disabled:opacity-50 rounded-md"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--color-muted)', letterSpacing: '0.1em' }}>
                Tahun
              </label>
              <input
                type="text"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                disabled={loading}
                placeholder="2024"
                className="w-full px-4 py-2.5 text-sm border bg-transparent outline-none disabled:opacity-50 rounded-md"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--color-muted)', letterSpacing: '0.1em' }}>
                Status Publikasi
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                disabled={loading}
                className="w-full px-4 py-2.5 text-sm border bg-transparent outline-none disabled:opacity-50 rounded-md"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
              >
                <option value="published">Published (Tampil)</option>
                <option value="draft">Draft (Sembunyikan)</option>
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
              Tampilkan di Bagian Featured / Karya Pilihan di Beranda
            </label>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--color-muted)', letterSpacing: '0.1em' }}>
              Deskripsi Singkat (Ringkasan untuk kartu karya)
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              disabled={loading}
              placeholder="Deskripsi singkat yang tampil di halaman katalog karya..."
              className="w-full px-4 py-2.5 text-sm border bg-transparent outline-none resize-none disabled:opacity-50 rounded-md"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
            />
          </div>
        </div>

        {/* Technical & Role */}
        <div className="p-6 border rounded-lg flex flex-col gap-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
          <h3 className="font-sans font-bold text-base mb-1" style={{ color: 'var(--color-ink)' }}>Peran &amp; Teknologi</h3>
          
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--color-muted)', letterSpacing: '0.1em' }}>
              Peran Anda (Role)
            </label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              disabled={loading}
              placeholder="Contoh: UI/UX Design · Front-End Development"
              className="w-full px-4 py-2.5 text-sm border bg-transparent outline-none disabled:opacity-50 rounded-md"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--color-muted)', letterSpacing: '0.1em' }}>
                Tools / Tech Stack (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={form.toolsText}
                onChange={(e) => setForm({ ...form, toolsText: e.target.value })}
                disabled={loading}
                placeholder="Figma, React Native, Firebase, Tailwind"
                className="w-full px-4 py-2.5 text-sm border bg-transparent outline-none disabled:opacity-50 rounded-md"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--color-muted)', letterSpacing: '0.1em' }}>
                Tags Filter (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={form.tagsText}
                onChange={(e) => setForm({ ...form, tagsText: e.target.value })}
                disabled={loading}
                placeholder="UI/UX, Mobile, Frontend"
                className="w-full px-4 py-2.5 text-sm border bg-transparent outline-none disabled:opacity-50 rounded-md"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--color-muted)', letterSpacing: '0.1em' }}>
                Tautan GitHub Repo (Opsional)
              </label>
              <input
                type="url"
                value={form.github_url}
                onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                disabled={loading}
                placeholder="https://github.com/mazizi29/..."
                className="w-full px-4 py-2.5 text-sm border bg-transparent outline-none disabled:opacity-50 rounded-md"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--color-muted)', letterSpacing: '0.1em' }}>
                Tautan Live Demo / Website (Opsional)
              </label>
              <input
                type="url"
                value={form.live_url}
                onChange={(e) => setForm({ ...form, live_url: e.target.value })}
                disabled={loading}
                placeholder="https://..."
                className="w-full px-4 py-2.5 text-sm border bg-transparent outline-none disabled:opacity-50 rounded-md"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
              />
            </div>
          </div>
        </div>

        {/* Case Study Details */}
        <div className="p-6 border rounded-lg flex flex-col gap-5" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
          <div>
            <h3 className="font-sans font-bold text-base mb-1" style={{ color: 'var(--color-ink)' }}>Detail Studi Kasus</h3>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
              Tulis penjelasan studi kasus. Awali baris dengan tanda minus (<code className="font-semibold px-1 py-0.5 rounded bg-black/5 dark:bg-white/10">-</code>) atau angka (<code className="font-semibold px-1 py-0.5 rounded bg-black/5 dark:bg-white/10">1.</code>) untuk otomatis membuat daftar poin berstruktur.
            </p>
          </div>
          
          {/* 1. Overview */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--color-muted)', letterSpacing: '0.1em' }}>
                1. Gambaran Umum (Overview)
              </label>
              {form.overview.trim() && (
                <button
                  type="button"
                  onClick={() => setPreviewOverview(!previewOverview)}
                  className="font-mono text-xs tracking-wider uppercase underline cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--color-muted)' }}
                >
                  {previewOverview ? 'Tutup Pratinjau' : '👁️ Pratinjau Tampilan'}
                </button>
              )}
            </div>
            <textarea
              rows={4}
              value={form.overview}
              onChange={(e) => setForm({ ...form, overview: e.target.value })}
              disabled={loading}
              placeholder="Jelaskan latar belakang, konteks, dan tujuan proyek ini dibangun..."
              className="w-full px-4 py-2.5 text-sm border bg-transparent outline-none resize-y disabled:opacity-50 rounded-md"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
            />
            {previewOverview && form.overview.trim() && (
              <div className="p-4 border rounded-md mt-1" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-paper)' }}>
                <p className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: 'var(--color-muted)' }}>
                  Pratinjau Gambaran Umum:
                </p>
                <FormattedContent text={form.overview} />
              </div>
            )}
          </div>

          {/* 2. Problem */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--color-muted)', letterSpacing: '0.1em' }}>
                2. Permasalahan &amp; Tantangan (Problem)
              </label>
              {form.problem.trim() && (
                <button
                  type="button"
                  onClick={() => setPreviewProblem(!previewProblem)}
                  className="font-mono text-xs tracking-wider uppercase underline cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--color-muted)' }}
                >
                  {previewProblem ? 'Tutup Pratinjau' : '👁️ Pratinjau Poin'}
                </button>
              )}
            </div>
            <textarea
              rows={4}
              value={form.problem}
              onChange={(e) => setForm({ ...form, problem: e.target.value })}
              disabled={loading}
              placeholder={"Contoh format poin:\n- Proses pencatatan masih manual dan memakan waktu lama\n- Risiko human error dan ketidakkonsistenan data\n- Kurangnya otomasi pelaporan hasil investigasi"}
              className="w-full px-4 py-2.5 text-sm border bg-transparent outline-none resize-y disabled:opacity-50 rounded-md"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
            />
            {previewProblem && form.problem.trim() && (
              <div className="p-4 border rounded-md mt-1" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-paper)' }}>
                <p className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: 'var(--color-muted)' }}>
                  Pratinjau Poin Permasalahan:
                </p>
                <FormattedContent text={form.problem} />
              </div>
            )}
          </div>

          {/* 3. Result */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--color-muted)', letterSpacing: '0.1em' }}>
                3. Hasil &amp; Pembelajaran (Result &amp; Impact)
              </label>
              {form.result.trim() && (
                <button
                  type="button"
                  onClick={() => setPreviewResult(!previewResult)}
                  className="font-mono text-xs tracking-wider uppercase underline cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--color-muted)' }}
                >
                  {previewResult ? 'Tutup Pratinjau' : '👁️ Pratinjau Poin'}
                </button>
              )}
            </div>
            <textarea
              rows={4}
              value={form.result}
              onChange={(e) => setForm({ ...form, result: e.target.value })}
              disabled={loading}
              placeholder={"Contoh format poin:\n- Efisiensi waktu pemrosesan meningkat hingga 60%\n- Dokumentasi data menjadi lebih terstruktur dan otomatis\n- Pengalaman navigasi pengguna dinilai intuitif pada uji coba"}
              className="w-full px-4 py-2.5 text-sm border bg-transparent outline-none resize-y disabled:opacity-50 rounded-md"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
            />
            {previewResult && form.result.trim() && (
              <div className="p-4 border rounded-md mt-1" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-paper)' }}>
                <p className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: 'var(--color-muted)' }}>
                  Pratinjau Poin Hasil:
                </p>
                <FormattedContent text={form.result} />
              </div>
            )}
          </div>
        </div>

        {/* Media & Images */}
        <div className="p-6 border rounded-lg flex flex-col gap-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
          <h3 className="font-sans font-bold text-base mb-1" style={{ color: 'var(--color-ink)' }}>Gambar Cover &amp; Galeri</h3>
          
          {/* Cover */}
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--color-muted)', letterSpacing: '0.1em' }}>
              URL Cover Proyek *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.cover_url}
                onChange={(e) => setForm({ ...form, cover_url: e.target.value })}
                disabled={loading}
                placeholder="https://..."
                className="flex-1 px-4 py-2.5 text-sm border bg-transparent outline-none disabled:opacity-50 rounded-md"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
              />
              <label
                className="px-4 py-2.5 text-xs font-semibold tracking-widest uppercase cursor-pointer flex items-center justify-center shrink-0 disabled:opacity-50"
                style={{ backgroundColor: 'var(--color-ink)', color: 'var(--color-paper)', letterSpacing: '0.05em', borderRadius: 'var(--radius-sm)' }}
              >
                Upload
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  disabled={loading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const { url, error } = await uploadImage(file);
                    if (error || !url) alert('Gagal upload: ' + error);
                    else setForm({ ...form, cover_url: url });
                    e.target.value = '';
                  }} 
                />
              </label>
            </div>
            {form.cover_url && (
              <div className="mt-2 w-48 h-28 border rounded overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
                <img src={form.cover_url} alt="Cover preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Gallery */}
          <div className="flex flex-col gap-2 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <label className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--color-muted)', letterSpacing: '0.1em' }}>
              Galeri Tangkapan Layar / Mockup Tambahan
            </label>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(e.target.value)}
                disabled={loading || uploadingGallery}
                placeholder="Masukkan URL gambar atau klik tombol Upload Galeri..."
                className="flex-1 px-4 py-2.5 text-sm border bg-transparent outline-none disabled:opacity-50 rounded-md"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
              />
              <button
                type="button"
                onClick={handleAddGalleryUrl}
                disabled={!newGalleryUrl.trim() || loading || uploadingGallery}
                className="px-4 py-2.5 text-xs font-semibold tracking-widest uppercase border disabled:opacity-40"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)', borderRadius: 'var(--radius-sm)' }}
              >
                + Tambah URL
              </button>
              <label
                className="px-4 py-2.5 text-xs font-semibold tracking-widest uppercase cursor-pointer flex items-center justify-center shrink-0 disabled:opacity-50"
                style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-ink)', letterSpacing: '0.05em', borderRadius: 'var(--radius-sm)' }}
              >
                {uploadingGallery ? 'Uploading...' : 'Upload File'}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  disabled={loading || uploadingGallery}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingGallery(true);
                    const { url, error } = await uploadImage(file);
                    setUploadingGallery(false);
                    if (error || !url) alert('Gagal upload: ' + error);
                    else {
                      setForm(prev => ({ ...prev, gallery: [...prev.gallery, url] }))
                    }
                    e.target.value = '';
                  }} 
                />
              </label>
            </div>

            {/* Gallery list preview */}
            {form.gallery.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                {form.gallery.map((imgUrl, idx) => (
                  <div key={idx} className="relative group border rounded overflow-hidden h-24" style={{ borderColor: 'var(--color-border)' }}>
                    <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 hover:opacity-100 transition-opacity"
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

        {/* Action Buttons */}
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 text-xs font-semibold tracking-widest uppercase disabled:opacity-50 transition-opacity hover:opacity-85"
            style={{ backgroundColor: 'var(--color-ink)', color: 'var(--color-paper)', letterSpacing: '0.1em', borderRadius: 'var(--radius-sm)' }}
          >
            {loading ? 'Menyimpan...' : 'Simpan Proyek'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3.5 text-xs font-semibold tracking-widest uppercase border disabled:opacity-50 transition-colors hover:bg-white"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)', borderRadius: 'var(--radius-sm)' }}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  )
}
