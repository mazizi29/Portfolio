import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PublicLayout from '@/layouts/public/PublicLayout'
import { getSupabaseClient } from '@/lib/supabase'
import { experience as mockExperience, skills as mockSkills } from '@/data/mockData'
import { sortExperiencesChronological } from '@/pages/admin/Experience'

const supabase = getSupabaseClient()

export default function About() {
  const [profile, setProfile] = useState<any>(null)
  const [experiences, setExperiences] = useState<any[]>([])
  const [skillsData, setSkillsData] = useState<any>({ soft_skill: [], hard_skill: [], alat: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAboutData()
  }, [])

  const fetchAboutData = async () => {
    try {
      const [profRes, expRes, skillRes] = await Promise.all([
        supabase.from('profiles').select('*').limit(1).single(),
        supabase.from('experience').select('*').order('start_date', { ascending: true }),
        supabase.from('skills').select('*').order('order_index', { ascending: true })
      ])

      if (profRes.data) setProfile(profRes.data)
      
      if (expRes.data && expRes.data.length > 0) {
        const uniqueExp = Array.from(new Map(expRes.data.map((item: any) => [item.organization + item.position, item])).values())
        setExperiences(sortExperiencesChronological(uniqueExp))
      } else {
        setExperiences(sortExperiencesChronological(mockExperience.map(e => ({
          ...e,
          start_date: e.startDate,
          end_date: e.endDate,
        }))))
      }
      
      if (skillRes.data && skillRes.data.length > 0) {
        const grouped = {
          soft_skill: skillRes.data.filter((s: any) => s.category === 'design'),
          hard_skill: skillRes.data.filter((s: any) => s.category === 'build'),
          alat: skillRes.data.filter((s: any) => s.category === 'visual'),
        }
        setSkillsData(grouped)
      } else {
        setSkillsData(mockSkills)
      }
    } catch (e) {
      console.warn('Fallback to mock about data:', e)
      setExperiences(sortExperiencesChronological(mockExperience.map(e => ({
        ...e,
        start_date: e.startDate,
        end_date: e.endDate,
      }))))
      setSkillsData(mockSkills)
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <PublicLayout>
        <div style={{ backgroundColor: 'var(--color-paper)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--color-muted)' }}>Memuat Profil...</p>
        </div>
      </PublicLayout>
    )
  }

  const availabilityText = 
    profile?.availability === 'open' ? 'Terbuka untuk Magang' :
    profile?.availability === 'freelance' ? 'Tersedia untuk Freelance' : 'Sedang Tidak Tersedia'

  let aboutImage = '/pas_foto.jpg'
  if (profile?.portrait_url) {
    if (profile.portrait_url.startsWith('{')) {
      try {
        const parsed = JSON.parse(profile.portrait_url)
        if (parsed.about) aboutImage = parsed.about
        else if (parsed.home) aboutImage = parsed.home
      } catch(e) {}
    } else {
      aboutImage = profile.portrait_url
    }
  }

  return (
    <PublicLayout>
      <div style={{ backgroundColor: 'var(--color-paper)', minHeight: '100vh' }}>

      {/* Intro */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-16 pt-36 md:pt-44 pb-20">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
          <div>
            <p
              className="font-mono text-xs tracking-widest uppercase mb-4"
              style={{ color: 'var(--color-muted)', letterSpacing: '0.14em' }}
            >
              Tentang Saya
            </p>
            
            <h1
              className="font-sans font-bold leading-tight mb-2"
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                color: 'var(--color-ink)',
                letterSpacing: '-0.03em'
              }}
            >
              {profile?.display_name || 'Muhammad Azizi Abdillah'}
            </h1>
            
            <p
              className="font-serif italic mb-8"
              style={{
                fontSize: 'clamp(1.15rem, 2vw, 1.45rem)',
                color: 'var(--color-ink)',
                fontVariationSettings: '"opsz" 32',
              }}
            >
              Mahasiswa Informatika | UI/UX &amp; Front-End
            </p>
            
            <div className="space-y-4">
              <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-sans)', whiteSpace: 'pre-line' }}>
                {profile?.intro || 'Mahasiswa Informatika Universitas Nahdlatul Ulama’ Yogyakarta yang aktif mendalami UI/UX Design dan Front-End Development. Memiliki latar belakang multimedia yang membentuk pemahaman visual yang kuat — dari perancangan antarmuka hingga implementasi kode yang fungsional. Terbiasa bekerja secara terstruktur, kolaboratif, serta berorientasi pada kemudahan pengguna.'}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-0">
              <InfoRow label="Lokasi" value={profile?.location || 'Yogyakarta, Indonesia'} />
              <InfoRow label="Status" value={availabilityText} />
              <InfoRow label="Email" value={profile?.email || 'izzi.azizi29@gmail.com'} />
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/cv.pdf"
                download="CV_Muhammad_Azizi_Abdillah.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-xs font-semibold tracking-widest uppercase transition-opacity hover:opacity-85"
                style={{
                  backgroundColor: 'var(--color-ink)',
                  color: 'var(--color-paper)',
                  letterSpacing: '0.1em',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download CV (PDF)
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-semibold tracking-widest uppercase border transition-colors hover:bg-white"
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-ink)',
                  letterSpacing: '0.1em',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                Hubungi Saya →
              </Link>
            </div>
          </div>

          <div
            className="overflow-hidden relative shadow-lg"
            style={{ height: '520px', backgroundColor: 'var(--color-border-light)', borderRadius: '4px 36px 4px 36px', border: '1px solid var(--color-border)' }}
          >
            <img
              src={aboutImage}
              alt="Muhammad Azizi Abdillah"
              className="w-full h-full object-cover"
              style={{ objectPosition: 'top center' }}
            />
          </div>
        </div>
      </section>

      {/* Pengalaman & Pendidikan */}
      <section className="border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-20 md:py-24">
          <div className="mb-12">
            <p className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--color-muted)', letterSpacing: '0.14em' }}>
              Experience &amp; Education
            </p>
            <h2 className="font-sans font-bold text-2xl md:text-3xl" style={{ color: 'var(--color-ink)', letterSpacing: '-0.03em' }}>
              Pengalaman &amp; Pendidikan
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-16 md:gap-20">
            {/* Pendidikan */}
            <div>
              <h3 className="font-sans font-bold text-xl mb-8" style={{ color: 'var(--color-ink)' }}>Pendidikan</h3>
              <div className="flex flex-col gap-0 border-t" style={{ borderColor: 'var(--color-border)' }}>
                {experiences.filter(e => e.type === 'Education').map((exp, i) => {
                  const dateText = formatExperienceDate(exp.start_date, exp.end_date)
                  const badge = getExpBadge(exp.type, exp.position)
                  return (
                  <div key={exp.id || i} className="py-8 border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <span className="font-mono text-xs" style={{ color: 'var(--color-muted)', letterSpacing: '0.06em' }}>
                        {dateText}
                      </span>
                      <span
                        className="font-mono text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-semibold"
                        style={{ color: badge.color, backgroundColor: badge.bg, borderColor: badge.border }}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <h4 className="font-sans font-bold text-base mb-0.5" style={{ color: 'var(--color-ink)' }}>{exp.position}</h4>
                    <p className="text-sm mb-3 font-medium" style={{ color: 'var(--color-muted)' }}>{exp.organization}</p>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-muted)' }}>{exp.description}</p>
                    
                    {exp.skills && (
                      <div className="flex flex-wrap gap-1.5">
                        {(Array.isArray(exp.skills) ? exp.skills : exp.skills.split(',')).filter(Boolean).map((s: string) => (
                          <span
                            key={s}
                            className="font-mono text-xs px-2 py-0.5 border"
                            style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)', borderRadius: 'var(--radius-sm)' }}
                          >
                            {s.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )})}
              </div>
            </div>

            {/* Pengalaman */}
            <div>
              <h3 className="font-sans font-bold text-xl mb-8" style={{ color: 'var(--color-ink)' }}>Pengalaman</h3>
              <div className="flex flex-col gap-0 border-t" style={{ borderColor: 'var(--color-border)' }}>
                {experiences.filter(e => e.type !== 'Education').map((exp, i) => {
                  const dateText = formatExperienceDate(exp.start_date, exp.end_date)
                  const badge = getExpBadge(exp.type, exp.position)
                  return (
                  <div key={exp.id || i} className="py-8 border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <span className="font-mono text-xs" style={{ color: 'var(--color-muted)', letterSpacing: '0.06em' }}>
                        {dateText}
                      </span>
                      <span
                        className="font-mono text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-semibold"
                        style={{ color: badge.color, backgroundColor: badge.bg, borderColor: badge.border }}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <h4 className="font-sans font-bold text-base mb-0.5" style={{ color: 'var(--color-ink)' }}>{exp.position}</h4>
                    <p className="text-sm mb-3 font-medium" style={{ color: 'var(--color-muted)' }}>{exp.organization}</p>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-muted)' }}>{exp.description}</p>
                    
                    {exp.skills && (
                      <div className="flex flex-wrap gap-1.5">
                        {(Array.isArray(exp.skills) ? exp.skills : exp.skills.split(',')).filter(Boolean).map((s: string) => (
                          <span
                            key={s}
                            className="font-mono text-xs px-2 py-0.5 border"
                            style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)', borderRadius: 'var(--radius-sm)' }}
                          >
                            {s.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )})}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kemampuan (High Contrast WCAG AA) */}
      <section style={{ backgroundColor: 'var(--color-ink)' }}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-20 md:py-24">
          <div className="mb-12">
            <p className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: 'rgba(247,247,245,0.75)', letterSpacing: '0.14em' }}>
              Skills &amp; Tools
            </p>
            <h2 className="font-sans font-bold text-2xl md:text-3xl" style={{ color: 'var(--color-paper)', letterSpacing: '-0.03em' }}>
              Kemampuan &amp; Alat
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border-t" style={{ borderColor: 'rgba(247,247,245,0.15)' }}>
            {Object.entries(skillsData).map(([cat, list]: [string, any], i) => (
              <div
                key={cat}
                className="py-10"
                style={{
                  borderRight: i < 2 ? '1px solid rgba(247,247,245,0.15)' : 'none',
                  paddingLeft: i > 0 ? '36px' : '0',
                  paddingRight: i < 2 ? '36px' : '0',
                }}
              >
                <h3
                  className="font-sans font-bold text-base mb-1"
                  style={{ color: 'var(--color-paper)' }}
                >
                  {cat === 'soft_skill' ? 'Soft Skill' : cat === 'hard_skill' ? 'Hard Skill' : 'Alat'}
                </h3>
                <p className="font-mono text-xs mb-6" style={{ color: 'rgba(247,247,245,0.70)', letterSpacing: '0.08em' }}>
                  {cat === 'soft_skill' ? 'Interpersonal' : cat === 'hard_skill' ? 'Technical' : 'Tools & Software'}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {list.length === 0 ? (
                     <li className="text-sm" style={{ color: 'rgba(247,247,245,0.75)' }}>-</li>
                  ) : (
                    list.map((s: any) => (
                      <li key={s.id || s.name} className="text-sm flex items-center gap-2" style={{ color: 'rgba(247,247,245,0.90)' }}>
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: 'rgba(247,247,245,0.5)' }} />
                        {s.name}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-16 py-20 md:py-24 text-center">
        <p className="text-sm mb-4" style={{ color: 'var(--color-muted)' }}>
          Tertarik mendiskusikan peluang magang atau proyek?
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 font-sans font-bold link-underline"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--color-ink)', letterSpacing: '-0.02em' }}
        >
          Hubungi Saya →
        </Link>
      </section>

      </div>
    </PublicLayout>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 py-3.5 border-t" style={{ borderColor: 'var(--color-border)' }}>
      <span className="font-mono text-xs shrink-0" style={{ color: 'var(--color-muted)', letterSpacing: '0.06em', width: '6rem' }}>
        {label}
      </span>
      <span className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
        {value}
      </span>
    </div>
  )
}

function formatExperienceDate(startDate?: string, endDate?: string | null) {
  if (!startDate) return ''
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  
  const formatDatePart = (dStr: string) => {
    if (!dStr) return ''
    const parts = dStr.split('-')
    if (parts.length >= 2) {
      const y = parts[0]
      const mIdx = parseInt(parts[1], 10) - 1
      const mName = months[mIdx] || ''
      return mName ? `${mName} ${y}` : y
    }
    return dStr
  }

  const startFormatted = formatDatePart(startDate)
  const endFormatted = endDate ? formatDatePart(endDate) : 'Sekarang'

  if (startFormatted === endFormatted) return startFormatted
  return `${startFormatted} — ${endFormatted}`
}

function getExpBadge(type: string, position?: string) {
  const t = type?.toLowerCase() || ''
  const pos = position?.toLowerCase() || ''

  if (t === 'education' || t === 'pendidikan') {
    return { label: 'Pendidikan', color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' }
  }
  if (t === 'project' || t === 'internship' || t === 'magang' || pos.includes('magang') || pos.includes('intern') || pos.includes('produser') || pos.includes('prakerin')) {
    return { label: 'Magang', color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' }
  }
  if (t === 'freelance' || t === 'organization' || t === 'organisasi' || pos.includes('ketua') || pos.includes('koor') || pos.includes('wakil')) {
    return { label: 'Organisasi', color: '#b45309', bg: '#fffbeb', border: '#fde68a' }
  }
  if (t === 'work' || t === 'pekerjaan') {
    return { label: 'Pekerjaan', color: '#7e22ce', bg: '#faf5ff', border: '#e9d5ff' }
  }
  return { label: type || 'Pengalaman', color: 'var(--color-muted)', bg: 'var(--color-surface)', border: 'var(--color-border)' }
}
