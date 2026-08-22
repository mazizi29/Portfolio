import type { ReactNode } from "react"

import Navbar from "@/components/public/Navbar"

import Footer from "@/components/public/Footer"

type PublicLayoutProps = {
  children: ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div style={{ backgroundColor: "var(--color-paper)", minHeight: "100vh" }}>
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}
