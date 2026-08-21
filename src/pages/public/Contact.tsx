import { useState, useEffect } from 'react'
import PublicLayout from '@/layouts/public/PublicLayout'
import { getSupabaseClient } from '@/lib/supabase'

const supabase = getSupabaseClient()

export default function Contact() {
  const [email, setEmail] = useState('izzi.azizi29@gmail.com')
  const [loading, setLoading] = useState(true)
  
  // Nomor WhatsApp resmi dari CV
  const WHATSAPP_NUMBER = '6285876783442' 

  useEffect(() => {
    fetchContactData()
  }, [])

  const fetchContactData = async () => {
    const { data } = await supabase.from('site_settings').select('contact_email').eq('id', 1).single()
    if (data && data.contact_email) {
      setEmail(data.contact_email)
    }
    setLoading(false)
  }

  const socials = [
    { label: 'Email', value: email, href: `mailto:${email}` },
    { label: 'WhatsApp', value: '+62 858 7678 3442', href: `https://wa.me/${WHATSAPP_NUMBER}` },
    { label: 'GitHub', value: 'github.com/mazizi29', href: 'https://github.com/mazizi29' },
    { label: 'LinkedIn', value: 'linkedin.com/in/muhammad-azizi-7407a120b', href: 'https://www.linkedin.com/in/muhammad-azizi-7407a120b/' },
    { label: 'Instagram', value: '@mazizi29_', href: 'https://instagram.com/mazizi29_' },
    { label: 'Resume/CV', value: 'Unduh Dokumen CV (PDF)', href: '/cv.pdf', download: true },
  ]

  const waTemplate = "Halo Azizi, salam kenal! Saya [Nama/Instansi]. Baru saja melihat portofolio Anda dan tertarik untuk terhubung serta berdiskusi lebih lanjut."
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waTemplate)}`

  return (
    <PublicLayout>
      <div style={{ backgroundColor: 'var(--color-paper)', minHeight: '100vh' }}>

      <section className="max-w-[1440px] mx-auto px-6 md:px-16 pt-36 md:pt-44 pb-20">
        <div className="mb-14">
          <p
            className="font-mono text-xs tracking-widest uppercase mb-6"
            style={{ color: 'var(--color-muted)', letterSpacing: '0.14em' }}
          >
            MARI TERHUBUNG
          </p>
          <h1
            className="font-sans font-bold leading-none mb-4 uppercase"
            style={{ fontSize: 'clamp(2.4rem, 7vw, 5.5rem)', letterSpacing: '-0.04em', color: 'var(--color-ink)', lineHeight: 0.95 }}
          >
            SIAP BERKARYA<br />
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 400,
                fontVariationSettings: '"opsz" 72',
              }}
            >
              DENGAN ANTUSIAS.
            </span>
          </h1>
          <p className="text-sm md:text-base mt-5" style={{ color: 'var(--color-muted)', maxWidth: '520px', fontFamily: 'var(--font-sans)' }}>
            Menikmati setiap proses, tumbuh dari setiap tantangan, dan siap memberikan yang terbaik untuk tim Anda.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-stretch">
          {/* WhatsApp CTA Card */}
          <div>
            <div
              className="border p-8 md:p-12 flex flex-col items-start justify-between"
              style={{ 
                borderColor: 'var(--color-border)', 
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--color-surface)',
                height: '100%'
              }}
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-4 border" style={{ borderColor: 'var(--color-border)', color: '#16a34a', backgroundColor: '#f0fdf4' }}>
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Terbuka untuk Magang
                </div>
                <h3 className="font-sans font-bold text-2xl md:text-3xl mb-3" style={{ color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>
                  Mari Berbincang
                </h3>
                <p className="text-sm md:text-base mb-8 leading-relaxed" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-sans)' }}>
                  Saya sedang aktif mencari kesempatan magang di bidang <strong>UI/UX Design</strong> atau <strong>Front-End Web</strong>. Jika Anda sedang membangun produk digital dan mencari seseorang yang siap berkontribusi langsung dengan dedikasi penuh, mari terhubung.
                </p>
              </div>

              <div className="w-full flex flex-col sm:flex-row gap-3">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 flex-1 px-6 py-4 text-xs font-semibold tracking-widest uppercase transition-opacity hover:opacity-90 shadow-sm text-center cursor-pointer"
                  style={{ 
                    backgroundColor: '#25D366',
                    color: '#ffffff', 
                    letterSpacing: '0.1em', 
                    borderRadius: 'var(--radius-sm)', 
                    fontFamily: 'var(--font-mono)' 
                  }}
                >
                  WhatsApp Langsung ↗
                </a>
                <a
                  href="/cv.pdf"
                  download="CV_Muhammad_Azizi_Abdillah.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 text-xs font-semibold tracking-widest uppercase border transition-colors hover:bg-white text-center cursor-pointer"
                  style={{ 
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-ink)', 
                    letterSpacing: '0.1em', 
                    borderRadius: 'var(--radius-sm)', 
                    fontFamily: 'var(--font-mono)' 
                  }}
                >
                  Unduh CV
                </a>
              </div>
            </div>
          </div>

          {/* Social Channels */}
          <div className="flex flex-col justify-center">
            <p
              className="font-mono text-xs tracking-widest uppercase mb-4"
              style={{ color: 'var(--color-muted)', letterSpacing: '0.14em' }}
            >
              Kontak &amp; Tautan Profesional
            </p>
            <div className="flex flex-col gap-0">
              {socials.map(({ label, value, href, download }) => (
                <a
                  key={label}
                  href={href}
                  target={download ? undefined : "_blank"}
                  rel={download ? undefined : "noopener noreferrer"}
                  download={download ? "CV_Muhammad_Azizi_Abdillah.pdf" : undefined}
                  className="group flex items-center justify-between py-4 border-t transition-colors"
                  style={{ borderColor: 'var(--color-border)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span className="font-mono text-xs w-28 shrink-0" style={{ color: 'var(--color-muted)', letterSpacing: '0.08em' }}>
                    {label}
                  </span>
                  <span className="text-sm font-medium flex-1 truncate pr-2" style={{ color: 'var(--color-ink)' }}>
                    {loading && label === 'Email' ? 'Memuat...' : value}
                  </span>
                  <span className="font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity shrink-0" style={{ color: 'var(--color-muted)' }}>
                    →
                  </span>
                </a>
              ))}
              <div className="border-t" style={{ borderColor: 'var(--color-border)' }} />
            </div>
          </div>
        </div>
      </section>

      </div>
    </PublicLayout>
  )
}
