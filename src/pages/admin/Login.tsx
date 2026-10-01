import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const res = await login(email, password)
    setLoading(false)

    if (res.success) {
      navigate("/admin/dashboard")
    } else {
      setError(res.error || "Email atau kata sandi tidak valid.")
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-8"
      style={{ backgroundColor: "var(--color-paper)" }}
    >
      <div style={{ width: "100%", maxWidth: "380px" }}>
        <div className="mb-10 text-center">
          <p
            className="font-mono text-xs tracking-widest uppercase mb-2"
            style={{ color: "var(--color-muted)", letterSpacing: "0.14em" }}
          >
            Portfolio CMS
          </p>
          <h1
            className="font-sans font-semibold text-2xl"
            style={{ color: "var(--color-ink)", letterSpacing: "-0.02em" }}
          >
            Admin Login
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              className="font-mono text-xs tracking-widest uppercase"
              style={{ color: "var(--color-muted)", letterSpacing: "0.1em" }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@domain.com"
              required
              disabled={loading}
              className="w-full px-4 py-3 text-sm border bg-transparent outline-none disabled:opacity-50"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-ink)",
                borderRadius: "var(--radius-md)",
                fontFamily: "var(--font-sans)",
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="font-mono text-xs tracking-widest uppercase"
              style={{ color: "var(--color-muted)", letterSpacing: "0.1em" }}
            >
              Kata Sandi
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              className="w-full px-4 py-3 text-sm border bg-transparent outline-none disabled:opacity-50"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-ink)",
                borderRadius: "var(--radius-md)",
                fontFamily: "var(--font-sans)",
              }}
            />
          </div>

          {error && (
            <div
              className="p-3 border rounded text-xs"
              style={{
                borderColor: "#fca5a5",
                backgroundColor: "#fef2f2",
                color: "#b91c1c",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-xs font-semibold tracking-widest uppercase mt-2 transition-opacity hover:opacity-85 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            style={{
              backgroundColor: "var(--color-ink)",
              color: "var(--color-paper)",
              letterSpacing: "0.1em",
              borderRadius: "var(--radius-sm)",
            }}
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Memproses...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="text-center mt-10">
          <Link
            to="/"
            className="text-xs font-mono link-underline"
            style={{ color: "var(--color-muted)" }}
          >
            ← Kembali ke Beranda
          </Link>
          <p
            className="text-[11px] font-mono mt-6"
            style={{ color: "var(--color-muted)", opacity: 0.7 }}
          >
            Demo: admin@portfolio.id / admin123
          </p>
        </div>
      </div>
    </div>
  )
}

