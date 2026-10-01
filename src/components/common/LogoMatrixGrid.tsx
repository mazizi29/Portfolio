import { useState } from "react"
import SafeImage from "@/components/common/SafeImage"

export interface LogoItem {
  id: string
  /** Nama brand / logo */
  name: string
  /** URL gambar logo (PNG/SVG dengan transparansi atau latar kontras) */
  logoUrl?: string
  /** Kategori industri (misal: "Fintech", "Apparel", "F&B", "Creative") */
  industry?: string
  /** Tahun pengerjaan */
  year?: string
  /** Tone warna latar tile: "light" (putih), "dark" (hitam/ink), "cream" (paper), atau custom hex */
  bgTone?: "light" | "dark" | "cream" | string
  /** Deskripsi singkat konsep desain */
  conceptNote?: string
}

export interface LogoMatrixGridProps {
  /** Judul opsional di atas matrix */
  title?: string
  /** Subtitle / deskripsi singkat */
  subtitle?: string
  /** Daftar logo yang akan ditampilkan */
  items: LogoItem[]
  /** Jumlah kolom di desktop (3 atau 4, default 4) */
  columns?: 3 | 4
  /** Memungkinkan interaksi zoom modal saat diklik */
  interactive?: boolean
  /** Custom class name */
  className?: string
}

/**
 * Komponen Showcase Grid Logo / Visual Identity Matrix.
 * Menampilkan koleksi logo dan brand mark secara terstruktur, rapi, dan editorial
 * persis seperti lembar presentasi identitas visual kelas atas.
 *
 * Sangat cocok untuk:
 * - Visual Identity & Logo Collection
 * - Brand Mark Archive
 * - Client Showcase
 */
export default function LogoMatrixGrid({
  title = "Selected Brand Identity & Logo Marks",
  subtitle = "Koleksi logo dan identitas visual yang dirancang untuk beragam industri dan klien.",
  items,
  columns = 4,
  interactive = true,
  className = "",
}: LogoMatrixGridProps) {
  const [selectedItem, setSelectedItem] = useState<LogoItem | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<string>("All")

  // Ekstrak kategori industri unik
  const industries = ["All", ...Array.from(new Set(items.map((it) => it.industry).filter(Boolean)))] as string[]

  const filteredItems =
    selectedFilter === "All" ? items : items.filter((it) => it.industry === selectedFilter)

  const getTileBackground = (tone?: string) => {
    switch (tone) {
      case "dark":
        return "#0A0A0A"
      case "cream":
        return "#F4F4F0"
      case "light":
      default:
        return "#FFFFFF"
    }
  }

  const getTileTextColor = (tone?: string) => {
    return tone === "dark" ? "#FFFFFF" : "#0A0A0A"
  }

  const getTileMutedColor = (tone?: string) => {
    return tone === "dark" ? "#8E8E93" : "#6F6F6F"
  }

  return (
    <div
      className={`w-full ${className}`}
      style={{ fontFamily: "var(--font-sans, sans-serif)" }}
    >
      {/* ── Section Header (Editorial Style) ── */}
      {(title || subtitle) && (
        <div style={{ marginBottom: "24px" }}>
          {title && (
            <h3
              style={{
                fontFamily: "var(--font-serif, 'Fraunces', serif)",
                fontSize: "1.5rem",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "var(--color-ink, #0A0A0A)",
                marginBottom: "6px",
              }}
            >
              {title}
            </h3>
          )}
          {subtitle && (
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--color-muted, #6F6F6F)",
                lineHeight: "1.5",
                margin: 0,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* ── Category Filter Pills ── */}
      {industries.length > 2 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          {industries.map((ind) => (
            <button
              key={ind}
              type="button"
              onClick={() => setSelectedFilter(ind)}
              style={{
                padding: "4px 12px",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.02em",
                borderRadius: "100px",
                border: "1px solid",
                borderColor:
                  selectedFilter === ind ? "var(--color-ink, #0A0A0A)" : "var(--color-border, #DCDCDC)",
                backgroundColor:
                  selectedFilter === ind ? "var(--color-ink, #0A0A0A)" : "transparent",
                color:
                  selectedFilter === ind ? "#FFFFFF" : "var(--color-muted, #6F6F6F)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {ind}
            </button>
          ))}
        </div>
      )}

      {/* ── The Logo Grid Matrix ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(${columns === 3 ? "240px" : "190px"}, 1fr))`,
          gap: "12px",
        }}
      >
        {filteredItems.map((item) => {
          const bg = getTileBackground(item.bgTone)
          const textColor = getTileTextColor(item.bgTone)
          const mutedColor = getTileMutedColor(item.bgTone)

          return (
            <div
              key={item.id}
              onClick={() => interactive && setSelectedItem(item)}
              style={{
                backgroundColor: bg,
                borderRadius: "12px",
                border: "1px solid var(--color-border-light, #EBEBEB)",
                padding: "24px 16px 16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                minHeight: "180px",
                position: "relative",
                cursor: interactive ? "pointer" : "default",
                transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
              }}
              onMouseEnter={(e) => {
                if (interactive) {
                  e.currentTarget.style.transform = "translateY(-3px)"
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"
                  e.currentTarget.style.borderColor = "var(--color-ink, #0A0A0A)"
                }
              }}
              onMouseLeave={(e) => {
                if (interactive) {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.02)"
                  e.currentTarget.style.borderColor = "var(--color-border-light, #EBEBEB)"
                }
              }}
              role={interactive ? "button" : undefined}
              tabIndex={interactive ? 0 : undefined}
              aria-label={`Logo ${item.name}`}
            >
              {/* Year badge if present */}
              {item.year && (
                <span
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "12px",
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "9px",
                    color: mutedColor,
                    opacity: 0.8,
                  }}
                >
                  {item.year}
                </span>
              )}

              {/* Logo Visual Area */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  maxHeight: "90px",
                  padding: "8px 0",
                }}
              >
                {item.logoUrl ? (
                  <SafeImage
                    src={item.logoUrl}
                    alt={`${item.name} logo`}
                    style={{
                      maxHeight: "70px",
                      maxWidth: "80%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  /* Stylized Typography Mark when no image exists */
                  <div
                    style={{
                      fontFamily: "var(--font-serif, 'Fraunces', serif)",
                      fontSize: "1.8rem",
                      fontWeight: 700,
                      color: textColor,
                      letterSpacing: "-0.03em",
                      textAlign: "center",
                    }}
                  >
                    {item.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Brand Meta Footer */}
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "12px",
                  borderTop: `1px solid ${item.bgTone === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"}`,
                  marginTop: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: textColor,
                    letterSpacing: "-0.01em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "70%",
                  }}
                >
                  {item.name}
                </span>

                {item.industry && (
                  <span
                    style={{
                      fontSize: "9px",
                      fontFamily: "var(--font-mono, monospace)",
                      color: mutedColor,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {item.industry}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Modal Detail Popup for Interactive Inspect ── */}
      {selectedItem && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(6px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setSelectedItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              maxWidth: "480px",
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Showcase Header */}
            <div
              style={{
                backgroundColor: getTileBackground(selectedItem.bgTone),
                padding: "48px 32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "220px",
                position: "relative",
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "14px",
                  background: "rgba(0,0,0,0.1)",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: getTileTextColor(selectedItem.bgTone),
                }}
                aria-label="Close modal"
              >
                ✕
              </button>

              {selectedItem.logoUrl ? (
                <SafeImage
                  src={selectedItem.logoUrl}
                  alt={selectedItem.name}
                  style={{
                    maxHeight: "110px",
                    maxWidth: "85%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <div
                  style={{
                    fontFamily: "var(--font-serif, 'Fraunces', serif)",
                    fontSize: "3rem",
                    fontWeight: 700,
                    color: getTileTextColor(selectedItem.bgTone),
                  }}
                >
                  {selectedItem.name}
                </div>
              )}
            </div>

            {/* Modal Details Body */}
            <div style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div>
                  <h4
                    style={{
                      margin: "0 0 4px 0",
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: "var(--color-ink, #0A0A0A)",
                    }}
                  >
                    {selectedItem.name}
                  </h4>
                  {selectedItem.industry && (
                    <span
                      style={{
                        fontSize: "11px",
                        fontFamily: "var(--font-mono, monospace)",
                        color: "var(--color-muted, #6F6F6F)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {selectedItem.industry} {selectedItem.year ? `· ${selectedItem.year}` : ""}
                    </span>
                  )}
                </div>
              </div>

              {selectedItem.conceptNote && (
                <p
                  style={{
                    fontSize: "0.875rem",
                    lineHeight: "1.6",
                    color: "var(--color-muted, #6F6F6F)",
                    marginTop: "12px",
                    paddingTop: "12px",
                    borderTop: "1px solid var(--color-border-light, #EBEBEB)",
                  }}
                >
                  {selectedItem.conceptNote}
                </p>
              )}

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                style={{
                  marginTop: "16px",
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor: "var(--color-ink, #0A0A0A)",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontSize: "13px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Tutup Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
