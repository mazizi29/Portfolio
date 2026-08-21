import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import type { ReactNode } from 'react'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '◈' },
  { to: '/admin/projects', label: 'Proyek', icon: '⬡' },
  { to: '/admin/experience', label: 'Pengalaman', icon: '◎' },
  { to: '/admin/skills', label: 'Kemampuan', icon: '◐' },
  { to: '/admin/media', label: 'Media', icon: '◫' },
  { to: '/admin/settings', label: 'Profil & Pengaturan', icon: '◌' },
]

export default function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
  const [open, setOpen] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const close = () => setOpen(false)

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F0F0EE' }}>
      {open && (
        <div
          className="fixed inset-0 z-20 md:hidden"
          style={{ backgroundColor: 'rgba(10,10,10,0.45)' }}
          onClick={close}
        />
      )}

      <aside
        className="admin-sidebar fixed md:sticky md:top-0 md:self-start inset-y-0 left-0 z-30 flex flex-col"
        style={{
          width: '220px',
          height: '100vh',
          backgroundColor: 'var(--color-ink)',
          transform: open ? 'translateX(0)' : 'translateX(-220px)',
          transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div
          className="px-5 py-5 flex items-center justify-between shrink-0 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain" style={{ filter: 'invert(1)' }} />
            <div>
              <p className="font-sans font-semibold text-sm" style={{ color: 'var(--color-paper)', letterSpacing: '0.04em' }}>
                Portfolio
              </p>
              <p className="font-mono text-xs mt-0.5" style={{ color: 'rgba(247,247,245,0.35)', letterSpacing: '0.06em' }}>
                Admin
              </p>
            </div>
          </div>
          <button
            className="md:hidden text-xl leading-none"
            onClick={close}
            aria-label="Tutup sidebar"
            style={{ color: 'rgba(247,247,245,0.4)' }}
          >
            ×
          </button>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={close}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 text-xs font-mono transition-colors ${
                  isActive ? 'bg-white/10' : 'hover:bg-white/5'
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? 'var(--color-paper)' : 'rgba(247,247,245,0.5)',
              })}
            >
              <span className="shrink-0">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div
          className="px-5 py-4 shrink-0 flex flex-col gap-3 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <Link
            to="/"
            className="flex items-center gap-3 text-xs font-mono transition-opacity hover:opacity-60"
            style={{ color: 'rgba(247,247,245,0.35)' }}
          >
            <span>⌂</span>
            Lihat Portfolio
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-xs font-mono text-left transition-opacity hover:opacity-60"
            style={{ color: 'rgba(247,247,245,0.5)' }}
          >
            <span>⊠</span>
            Logout
          </button>
        </div>
      </aside>

      <div className="hidden md:block shrink-0" style={{ width: '220px' }} />

      <div className="flex-1 flex flex-col min-w-0">
        <header
          className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-6 h-14 border-b"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-3">
            <button
              className="md:hidden flex flex-col justify-center gap-1 w-8 h-8 shrink-0"
              onClick={() => setOpen(true)}
              aria-label="Buka sidebar"
            >
              <span className="block w-4 h-px mx-auto" style={{ backgroundColor: 'var(--color-ink)' }} />
              <span className="block w-4 h-px mx-auto" style={{ backgroundColor: 'var(--color-ink)' }} />
              <span className="block w-4 h-px mx-auto" style={{ backgroundColor: 'var(--color-ink)' }} />
            </button>
            <h1
              className="font-sans font-semibold text-sm truncate"
              style={{ color: 'var(--color-ink)', letterSpacing: '-0.01em' }}
            >
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Cari..."
              className="hidden md:block text-xs border px-3 py-1.5 outline-none bg-transparent"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-ink)',
                borderRadius: 'var(--radius-md)',
                width: '160px',
                fontFamily: 'var(--font-sans)',
              }}
            />
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ backgroundColor: 'var(--color-ink)', color: 'var(--color-paper)' }}
            >
              A
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}