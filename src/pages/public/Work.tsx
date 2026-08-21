import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PublicLayout from '@/layouts/public/PublicLayout'
import { getSupabaseClient } from '@/lib/supabase'
import { projects as mockProjects } from '@/data/mockData'

const supabase = getSupabaseClient()

export default function Work() {
  const [projects, setProjects] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>(['Semua'])
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        
      if (data && data.length > 0) {
        setProjects(data)
        const uniqueCats = Array.from(new Set(data.map(p => p.category).filter(Boolean))) as string[]
        setCategories(['Semua', ...uniqueCats])
      } else {
        // Fallback to mock projects
        setProjects(mockProjects)
        const uniqueCats = Array.from(new Set(mockProjects.map(p => p.category).filter(Boolean))) as string[]
        setCategories(['Semua', ...uniqueCats])
      }
    } catch (e) {
      console.warn('Fallback to mock projects:', e)
      setProjects(mockProjects)
      const uniqueCats = Array.from(new Set(mockProjects.map(p => p.category).filter(Boolean))) as string[]
      setCategories(['Semua', ...uniqueCats])
    }
    setLoading(false)
  }

  const filtered = activeCategory === 'Semua'
    ? projects
    : projects.filter((p) => p.category === activeCategory)

  if (loading) {
    return (
      <PublicLayout>
        <div style={{ backgroundColor: 'var(--color-paper)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--color-muted)' }}>Memuat Karya...</p>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <div style={{ backgroundColor: 'var(--color-paper)', minHeight: '100vh' }}>

      <section className="max-w-[1440px] mx-auto px-6 md:px-16 pt-36 md:pt-44 pb-16">
        <div className="mb-12 md:mb-16">
          <p
            className="font-mono text-xs tracking-widest uppercase mb-3"
            style={{ color: 'var(--color-muted)', letterSpacing: '0.14em' }}
          >
            Selected Works
          </p>
          <h1
            className="font-sans font-bold leading-none"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '-0.04em', color: 'var(--color-ink)' }}
          >
            Karya &{' '}
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 400,
                fontVariationSettings: '"opsz" 60',
              }}
            >
              Studi Kasus
            </span>
          </h1>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="font-mono text-xs px-4 py-2 border tracking-widest uppercase transition-all cursor-pointer"
              style={{
                borderColor: activeCategory === cat ? 'var(--color-ink)' : 'var(--color-border)',
                backgroundColor: activeCategory === cat ? 'var(--color-ink)' : 'transparent',
                color: activeCategory === cat ? 'var(--color-paper)' : 'var(--color-muted)',
                letterSpacing: '0.08em',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ backgroundColor: 'var(--color-border)' }}>
          {filtered.map((project, i) => (
            <ProjectCard key={project.id || i} project={project} large={i === 0} index={i} />
          ))}
        </div>
      </section>

      </div>
    </PublicLayout>
  )
}

function ProjectCard({ project, large, index }: { project: any; large?: boolean, index: number }) {
  const displayId = index < 9 ? `0${index + 1}` : `${index + 1}`
  const projectCover = project.cover_url || project.cover || ''

  return (
    <Link
      to={`/work/${project.slug}`}
      className="project-card group block relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-paper)' }}
    >
      <div
        className="overflow-hidden relative"
        style={{
          height: large ? '480px' : '320px',
          backgroundColor: 'var(--color-border-light)',
        }}
      >
        {projectCover ? (
          <img
            src={projectCover}
            alt={project.title}
            className="project-image w-full h-full object-cover transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs font-mono" style={{ color: 'var(--color-muted)' }}>No Image</div>
        )}
      </div>

      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between mb-4">
          <span className="font-mono text-xs" style={{ color: 'var(--color-muted)', letterSpacing: '0.06em' }}>
            {displayId} — {project.year}
          </span>
          <span
            className="font-mono text-xs px-2 py-0.5 border"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)', borderRadius: 'var(--radius-sm)' }}
          >
            {project.category}
          </span>
        </div>

        <h3
          className="font-sans font-bold text-xl mb-2"
          style={{ color: 'var(--color-ink)', letterSpacing: '-0.025em' }}
        >
          {project.title}
        </h3>
        <p className="text-sm mb-5 line-clamp-2" style={{ color: 'var(--color-muted)' }}>
          {project.description}
        </p>

        <div
          className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ color: 'var(--color-ink)', letterSpacing: '0.1em' }}
        >
          Lihat Studi Kasus →
        </div>
      </div>
    </Link>
  )
}
