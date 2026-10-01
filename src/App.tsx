import { lazy, Suspense, type ReactNode } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "@/context/AuthContext"
import {
  HomeSkeleton,
  WorkSkeleton,
  ProjectDetailSkeleton,
  AboutSkeleton,
  PageLoadingFallback,
  AdminSkeleton,
} from "@/components/common/Skeleton"

// Lazy-loaded Public Pages
const Home = lazy(() => import("@/pages/public/Home"))
const Work = lazy(() => import("@/pages/public/Work"))
const ProjectDetail = lazy(() => import("@/pages/public/ProjectDetail"))
const About = lazy(() => import("@/pages/public/About"))
const Contact = lazy(() => import("@/pages/public/Contact"))

// Lazy-loaded Admin Pages
const Login = lazy(() => import("@/pages/admin/Login"))
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"))
const AdminProjects = lazy(() => import("@/pages/admin/Projects"))
const AdminExperience = lazy(() => import("@/pages/admin/Experience"))
const AdminSkills = lazy(() => import("@/pages/admin/Skills"))
const Media = lazy(() => import("@/pages/admin/Media"))
const Settings = lazy(() => import("@/pages/admin/Settings"))

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center font-mono text-xs"
        style={{
          backgroundColor: "var(--color-paper)",
          color: "var(--color-muted)",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          <span>Memverifikasi sesi admin...</span>
        </div>
      </div>
    )
  }

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/admin/login" replace />
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes with contextual skeletons */}
          <Route
            path="/"
            element={
              <Suspense fallback={<HomeSkeleton />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/work"
            element={
              <Suspense fallback={<WorkSkeleton />}>
                <Work />
              </Suspense>
            }
          />
          <Route
            path="/work/:slug"
            element={
              <Suspense fallback={<ProjectDetailSkeleton />}>
                <ProjectDetail />
              </Suspense>
            }
          />
          <Route
            path="/about"
            element={
              <Suspense fallback={<AboutSkeleton />}>
                <About />
              </Suspense>
            }
          />
          <Route
            path="/contact"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <Contact />
              </Suspense>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Suspense fallback={<AdminSkeleton />}>
                  <Dashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute>
                <Suspense fallback={<AdminSkeleton />}>
                  <AdminProjects />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/experience"
            element={
              <ProtectedRoute>
                <Suspense fallback={<AdminSkeleton />}>
                  <AdminExperience />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/skills"
            element={
              <ProtectedRoute>
                <Suspense fallback={<AdminSkeleton />}>
                  <AdminSkills />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/media"
            element={
              <ProtectedRoute>
                <Suspense fallback={<AdminSkeleton />}>
                  <Media />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <Suspense fallback={<AdminSkeleton />}>
                  <Settings />
                </Suspense>
              </ProtectedRoute>
            }
          />
          {/* Alias /admin/about cleanly to /admin/settings */}
          <Route
            path="/admin/about"
            element={<Navigate to="/admin/settings" replace />}
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
