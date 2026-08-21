import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const ok = login(email, password)
    if (ok) {
      navigate('/admin/dashboard')
    } else {
      setError('Invalid credentials.')
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-8"
      style={{ backgroundColor: 'var(--color-paper)' }}
    >
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div className="mb-12 text-center">
          <p
            className="font-mono text-xs tracking-widest uppercase mb-2"
            style={{ color: 'var(--color-muted)', letterSpacing: '0.14em' }}
          >
            Portfolio
          </p>
          <h1
            className="font-sans font-semibold text-2xl"
            style={{ color: 'var(--color-ink)', letterSpacing: '-0.02em' }}
          >
            Admin Login
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              className="font-mono text-xs tracking-widest uppercase"
              style={{ color: 'var(--color-muted)', letterSpacing: '0.1em' }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@portfolio.id"
              required
              className="w-full px-4 py-3 text-sm border bg-transparent outline-none"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-ink)',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-sans)',
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="font-mono text-xs tracking-widest uppercase"
              style={{ color: 'var(--color-muted)', letterSpacing: '0.1em' }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 text-sm border bg-transparent outline-none"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-ink)',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-sans)',
              }}
            />
          </div>

          {error && (
            <p className="text-xs" style={{ color: '#c0392b' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 text-xs font-semibold tracking-widest uppercase mt-2 transition-opacity hover:opacity-80"
            style={{
              backgroundColor: 'var(--color-ink)',
              color: 'var(--color-paper)',
              letterSpacing: '0.1em',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            Sign In
          </button>

          <button
            type="button"
            className="text-xs text-center link-underline self-center"
            style={{ color: 'var(--color-muted)' }}
          >
            Forgot password
          </button>
        </form>

        <p className="text-xs text-center mt-12" style={{ color: 'var(--color-border)' }}>
          admin@portfolio.id / admin123
        </p>
      </div>
    </div>
  )
}
