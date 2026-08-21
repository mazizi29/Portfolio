import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer
      className="border-t"
      style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-paper)' }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="font-sans font-bold text-sm tracking-wide mb-0.5" style={{ color: 'var(--color-ink)' }}>
            Muhammad Azizi Abdillah
          </p>
          <p className="font-mono text-xs" style={{ color: 'var(--color-muted)', letterSpacing: '0.06em' }}>
            Mahasiswa Informatika · UI/UX &amp; Front-End
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 sm:gap-8">
          {[
            { to: '/', label: 'Beranda' },
            { to: '/work', label: 'Karya' },
            { to: '/about', label: 'Tentang' },
            { to: '/contact', label: 'Kontak' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="link-underline font-mono text-xs tracking-widest uppercase"
              style={{ color: 'var(--color-muted)', letterSpacing: '0.1em' }}
            >
              {label}
            </Link>
          ))}
          <a
            href="/cv.pdf"
            download="CV_Muhammad_Azizi_Abdillah.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline font-mono text-xs tracking-widest uppercase font-semibold"
            style={{ color: 'var(--color-ink)', letterSpacing: '0.1em' }}
          >
            CV (PDF) ↗
          </a>
        </div>

        <div className="flex items-center gap-4">
          <p className="font-mono text-xs" style={{ color: 'var(--color-muted)', letterSpacing: '0.06em' }}>
            © 2026
          </p>
          <Link
            to="/admin/login"
            className="font-mono text-xs opacity-20 hover:opacity-60 transition-opacity"
            style={{ color: 'var(--color-muted)', letterSpacing: '0.06em' }}
            title="Admin Panel"
          >
            ·
          </Link>
        </div>
      </div>
    </footer>
  )
}
