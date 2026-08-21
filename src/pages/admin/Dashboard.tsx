import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '@/layouts/admin/AdminLayout'
import { getSupabaseClient } from '@/lib/supabase'
import type { Project } from './Projects'
import { getExperienceBadge, sortExperiencesChronological } from './Experience'

const supabase = getSupabaseClient()

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [experiences, setExperiences] = useState<any[]>([])
  const [expCount, setExpCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      
      // Fetch projects
      const { data: projData } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (projData) {
        setProjects(projData)
      }

      // Fetch experience
      const { data: expData, count } = await supabase
        .from('experience')
        .select('*', { count: 'exact' })
        .order('start_date', { ascending: true })
      
      if (expData) {
        setExperiences(sortExperiencesChronological(expData))
      }
      setExpCount(count || expData?.length || 0)
      
      setLoading(false)
    }
    fetchData()
  }, [])

  const published = projects.filter((p) => p.status === 'published').length
  const drafts = projects.filter((p) => p.status === 'draft').length

  const stats = [
    { label: 'Total Proyek', value: projects.length },
    { label: 'Published', value: published },
    { label: 'Drafts', value: drafts },
    { label: 'Total Pengalaman', value: expCount },
  ]

  return (
    <AdminLayout title="Dashboard">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <p className="text-xs font-mono mb-1" style={{ color: 'var(--color-muted)', letterSpacing: '0.08em' }}>
            Selamat datang kembali
          </p>
          <h2
            className="font-sans font-semibold text-2xl"
            style={{ color: 'var(--color-ink)', letterSpacing: '-0.02em' }}
          >
            Ringkasan Portfolio
          </h2>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm" style={{ color: 'var(--color-muted)' }}>
            Memuat data ringkasan...
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px mb-8" style={{ backgroundColor: 'var(--color-border)' }}>
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col p-6"
                  style={{ backgroundColor: 'var(--color-surface)' }}
                >
                  <span
                    className="font-sans font-semibold text-3xl mb-1"
                    style={{ color: 'var(--color-ink)', letterSpacing: '-0.03em' }}
                  >
                    {s.value}
                  </span>
                  <span className="font-mono text-xs" style={{ color: 'var(--color-muted)', letterSpacing: '0.06em' }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Projects */}
              <div
                className="border"
                style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)' }}
              >
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <p className="font-sans font-semibold text-sm" style={{ color: 'var(--color-ink)' }}>
                    Proyek Terakhir
                  </p>
                  <Link
                    to="/admin/projects"
                    className="font-mono text-xs link-underline"
                    style={{ color: 'var(--color-muted)', letterSpacing: '0.06em' }}
                  >
                    Kelola Proyek →
                  </Link>
                </div>
                <div className="flex flex-col gap-0">
                  {projects.length === 0 ? (
                    <div className="px-6 py-8 text-center text-xs" style={{ color: 'var(--color-muted)' }}>Belum ada proyek.</div>
                  ) : projects.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-4 px-6 py-3 border-b last:border-0"
                      style={{ borderColor: 'var(--color-border-light)' }}
                    >
                      <div
                        className="w-8 h-8 shrink-0 overflow-hidden bg-gray-100 flex items-center justify-center text-gray-400 text-[10px]"
                        style={{ backgroundColor: 'var(--color-border-light)', borderRadius: 'var(--radius-sm)' }}
                      >
                        {p.cover_url ? <img src={p.cover_url} alt="" className="w-full h-full object-cover" /> : 'Img'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate" style={{ color: 'var(--color-ink)' }}>
                          {p.title}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                          {p.updated_at ? p.updated_at.slice(0, 10) : ''}
                        </p>
                      </div>
                      <span
                        className="font-mono text-xs px-1.5 py-0.5 shrink-0"
                        style={{
                          backgroundColor: p.status === 'published' ? '#0A0A0A' : 'var(--color-border-light)',
                          color: p.status === 'published' ? 'var(--color-paper)' : 'var(--color-muted)',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Experiences */}
              <div
                className="border"
                style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)' }}
              >
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <p className="font-sans font-semibold text-sm" style={{ color: 'var(--color-ink)' }}>
                    Pengalaman &amp; Pendidikan
                  </p>
                  <Link
                    to="/admin/experience"
                    className="font-mono text-xs link-underline"
                    style={{ color: 'var(--color-muted)', letterSpacing: '0.06em' }}
                  >
                    Kelola Pengalaman →
                  </Link>
                </div>
                <div className="flex flex-col gap-0">
                  {experiences.length === 0 ? (
                    <div className="px-6 py-8 text-center text-xs" style={{ color: 'var(--color-muted)' }}>Belum ada entri pengalaman.</div>
                  ) : experiences.slice(0, 4).map((exp) => {
                    const badge = getExperienceBadge(exp.type)
                    return (
                      <div
                        key={exp.id}
                        className="flex items-center gap-3 px-6 py-3 border-b last:border-0"
                        style={{ borderColor: 'var(--color-border-light)' }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate" style={{ color: 'var(--color-ink)' }}>
                            {exp.position}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                            {exp.organization}
                          </p>
                        </div>
                        <span
                          className="font-mono text-[10px] px-2 py-0.5 rounded-full border shrink-0 font-semibold"
                          style={{ color: badge.color, backgroundColor: badge.bg, borderColor: badge.border }}
                        >
                          {badge.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
