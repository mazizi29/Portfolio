import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import type { ReactNode } from 'react'

// Public pages
import Home from '@/pages/public/Home'
import Work from '@/pages/public/Work'
import ProjectDetail from '@/pages/public/ProjectDetail'
import About from '@/pages/public/About'
import Contact from '@/pages/public/Contact'

// Admin pages
import Login from '@/pages/admin/Login'
import Dashboard from '@/pages/admin/Dashboard'
import AdminProjects from '@/pages/admin/Projects'
import AdminExperience from '@/pages/admin/Experience'
import AdminSkills from '@/pages/admin/Skills'
import AboutAdmin from '@/pages/admin/AboutAdmin'
import Media from '@/pages/admin/Media'
import Settings from '@/pages/admin/Settings'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<ProjectDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/projects" element={<ProtectedRoute><AdminProjects /></ProtectedRoute>} />
          <Route path="/admin/experience" element={<ProtectedRoute><AdminExperience /></ProtectedRoute>} />
          <Route path="/admin/skills" element={<ProtectedRoute><AdminSkills /></ProtectedRoute>} />
          <Route path="/admin/media" element={<ProtectedRoute><Media /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/admin/about" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
