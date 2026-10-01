import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"
import { getSupabaseClient } from "@/lib/supabase"
import type { Session, User } from "@supabase/supabase-js"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  session: Session | null
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | any | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => localStorage.getItem("admin_auth") === "true",
  )
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const hasLocalAuth = localStorage.getItem("admin_auth") === "true"
    if (hasLocalAuth) {
      setIsAuthenticated(true)
      setUser({ email: import.meta.env.VITE_ADMIN_EMAIL || "admin@portfolio.id" })
    }

    try {
      const supabase = getSupabaseClient()
      supabase.auth
        .getSession()
        .then(({ data: { session: activeSession } }) => {
          if (activeSession) {
            setSession(activeSession)
            setUser(activeSession.user)
            setIsAuthenticated(true)
            localStorage.setItem("admin_auth", "true")
          }
          setIsLoading(false)
        })
        .catch((err) => {
          console.warn("Sesi Supabase Auth tidak ditemukan:", err)
          setIsLoading(false)
        })

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, currentSession) => {
        if (currentSession) {
          setSession(currentSession)
          setUser(currentSession.user)
          setIsAuthenticated(true)
          localStorage.setItem("admin_auth", "true")
        }
        setIsLoading(false)
      })

      return () => {
        subscription.unsubscribe()
      }
    } catch {
      setIsLoading(false)
    }
  }, [])

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim()
    const validEmail = (import.meta.env.VITE_ADMIN_EMAIL || "admin@portfolio.id").trim().toLowerCase()
    const validPassword = (import.meta.env.VITE_ADMIN_PASSWORD || "admin123").trim()

    // 1. Cek kredensial admin lokal/env terlebih dahulu
    if (
      (cleanEmail.toLowerCase() === validEmail ||
        cleanEmail.toLowerCase() === "izzi.azizi29@gmail.com") &&
      password === validPassword
    ) {
      setIsAuthenticated(true)
      setUser({ email: cleanEmail, role: "admin" })
      localStorage.setItem("admin_auth", "true")
      return { success: true }
    }

    // 2. Jika bukan kredensial lokal, coba verifikasi ke Supabase Auth
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      })

      if (error) {
        let msg = error.message
        if (
          error.message.includes("Invalid login credentials") ||
          error.message.includes("invalid_grant")
        ) {
          msg = "Email atau kata sandi tidak valid. (Gunakan admin@portfolio.id / admin123 jika belum membuat akun di Supabase Auth)"
        } else if (error.message.includes("Email not confirmed")) {
          msg = "Email belum dikonfirmasi di Supabase Auth."
        }
        return { success: false, error: msg }
      }

      if (data.session) {
        setSession(data.session)
        setUser(data.user)
        setIsAuthenticated(true)
        localStorage.setItem("admin_auth", "true")
        return { success: true }
      }

      return { success: false, error: "Gagal memverifikasi sesi login." }
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Terjadi kendala jaringan saat mencoba login.",
      }
    }
  }

  const logout = async () => {
    try {
      const supabase = getSupabaseClient()
      await supabase.auth.signOut()
    } catch (err) {
      console.warn("Gagal logout dari Supabase:", err)
    } finally {
      localStorage.removeItem("admin_auth")
      setSession(null)
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        session,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

