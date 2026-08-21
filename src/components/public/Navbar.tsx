import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { to: '/', label: 'Beranda', end: true },
    { to: '/work', label: 'Karya', end: false },
    { to: '/about', label: 'Tentang', end: false },
    { to: '/contact', label: 'Kontak', end: false },
  ]

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(247,247,245,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
      }}
    >
      <nav className="max-w-[1440px] mx-auto px-6 md:px-16 h-16 flex items-center justify-between">
        {/* Brand logo + Title & Subtitle */}
        <Link
          to="/"
          className="flex items-center gap-3 group"
        >
          <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain shrink-0" />
          <div className="flex flex-col justify-center">
            <span
              className="font-sans font-bold text-xs sm:text-sm tracking-widest uppercase leading-none"
              style={{ color: 'var(--color-ink)', letterSpacing: '0.12em' }}
            >
              Portfolio
            </span>
            <span
              className="font-mono text-[10px] tracking-normal leading-tight mt-0.5"
              style={{ color: 'var(--color-muted)' }}
            >
              M. Azizi Abdillah
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `link-underline text-xs font-sans font-medium tracking-widest uppercase transition-colors ${
                  isActive ? 'text-ink' : 'text-muted hover:text-ink'
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? 'var(--color-ink)' : 'var(--color-muted)',
                letterSpacing: '0.12em',
              })}
            >
              {label}
            </NavLink>
          ))}

          {/* Download CV button */}
          <a
            href="/cv.pdf"
            download="CV_Muhammad_Azizi_Abdillah.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono tracking-wider uppercase border transition-all duration-200 hover:bg-black hover:text-white"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-ink)',
              borderRadius: 'var(--radius-sm)',
            }}
            title="Download CV Muhammad Azizi Abdillah (PDF)"
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            CV (PDF)
          </a>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <a
            href="/cv.pdf"
            download="CV_Muhammad_Azizi_Abdillah.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono tracking-wider uppercase border"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-ink)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            CV
          </a>

          <button
            className="flex flex-col gap-1.5 p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className="block w-5 h-px bg-ink transition-all duration-200"
              style={{
                backgroundColor: 'var(--color-ink)',
                transform: menuOpen ? 'translateY(4px) rotate(45deg)' : 'none',
              }}
            />
            <span
              className="block w-5 h-px transition-all duration-200"
              style={{
                backgroundColor: 'var(--color-ink)',
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-5 h-px bg-ink transition-all duration-200"
              style={{
                backgroundColor: 'var(--color-ink)',
                transform: menuOpen ? 'translateY(-4px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t px-8 py-6 flex flex-col gap-5"
          style={{
            borderColor: 'var(--color-border)',
            backgroundColor: 'var(--color-paper)',
          }}
        >
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium tracking-widest uppercase"
              style={{ color: 'var(--color-ink)', letterSpacing: '0.1em' }}
            >
              {label}
            </NavLink>
          ))}
          
          <a
            href="/cv.pdf"
            download="CV_Muhammad_Azizi_Abdillah.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center justify-center gap-2 py-3 text-xs font-mono font-semibold tracking-widest uppercase border mt-2"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-ink)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download CV (PDF)
          </a>
        </div>
      )}
    </header>
  )
}
