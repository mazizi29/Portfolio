import { useState, useEffect } from "react"
import SafeImage from "@/components/common/SafeImage"

export interface SlideItem {
  /** URL gambar untuk slide ini */
  imageUrl: string
  /** Alt text aksesibilitas / judul slide */
  alt?: string
  /** Judul khusus slide ini */
  title?: string
  /** Keterangan / caption spesifik untuk slide ini */
  caption?: string
}

export interface InstagramPostMockupProps {
  /** Nama akun yang ditampilkan di header */
  accountName?: string
  /** Username handle akun */
  accountHandle?: string
  /** URL avatar akun (opsional, fallback ke inisial) */
  avatarUrl?: string
  /** Array slide: 1 item = single post, lebih = carousel */
  slides: SlideItem[]
  /** Caption pendek di bawah gambar */
  caption?: string
  /** Jumlah like (display only) */
  likeCount?: number | string
  /** Nama klien / brand yang didesain (ditampilkan sebagai hashtag) */
  brandTag?: string
  /** Callback saat slide aktif berganti */
  onSlideChange?: (index: number) => void
  /** Controlled active slide index (opsional) */
  activeSlideIndex?: number
  /** Maksimal lebar mockup (default: 430px) */
  maxWidth?: string
  /** className tambahan untuk wrapper terluar */
  className?: string
  /** Memungkinkan klik zoom pada gambar */
  onImageClick?: (imageUrl: string, title?: string, caption?: string) => void
}

/**
 * Komponen Mockup Instagram Feed dalam Frame Smartphone Modern.
 * Menggunakan rasio potret standar Instagram 4:5 (1080 × 1350).
 *
 * Sangat cocok untuk:
 * - Social Media & Content Design
 * - Carousel Feeds & Campaign Posters
 */
export default function InstagramPostMockup({
  accountName = "Layar Putih Studio",
  accountHandle = "layarputih.studio",
  avatarUrl,
  slides,
  caption,
  likeCount = "2.4K",
  brandTag,
  onSlideChange,
  activeSlideIndex,
  maxWidth = "440px",
  className = "",
  onImageClick,
}: InstagramPostMockupProps) {
  const [internalSlide, setInternalSlide] = useState(0)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [showHeartOverlay, setShowHeartOverlay] = useState(false)

  const activeIndex = typeof activeSlideIndex === "number" ? activeSlideIndex : internalSlide
  const isCarousel = slides && slides.length > 1
  const currentSlide = slides[activeIndex] || slides[0] || { imageUrl: "" }

  const handleSlideChange = (newIdx: number) => {
    const clamped = Math.max(0, Math.min(newIdx, slides.length - 1))
    setInternalSlide(clamped)
    if (onSlideChange) {
      onSlideChange(clamped)
    }
  }

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    handleSlideChange(activeIndex + 1)
  }

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    handleSlideChange(activeIndex - 1)
  }

  const handleDoubleTapLike = () => {
    setLiked(true)
    setShowHeartOverlay(true)
    setTimeout(() => setShowHeartOverlay(false), 700)
  }

  return (
    <div
      className={`relative mx-auto select-none ${className}`}
      style={{
        maxWidth,
        width: "100%",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      {/* ── Outer Phone Chassis (iPhone-like Body) ── */}
      <div
        style={{
          position: "relative",
          borderRadius: "44px",
          padding: "10px",
          background: "linear-gradient(145deg, #2a2a2e 0%, #111113 100%)",
          boxShadow:
            "0 24px 64px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 0 0 2px rgba(255, 255, 255, 0.06)",
        }}
      >
        {/* Phone Side Buttons */}
        <div
          style={{
            position: "absolute",
            left: "-3px",
            top: "90px",
            width: "3px",
            height: "26px",
            background: "#404044",
            borderRadius: "2px 0 0 2px",
          }}
          aria-hidden="true"
        />
        <div
          style={{
            position: "absolute",
            left: "-3px",
            top: "128px",
            width: "3px",
            height: "44px",
            background: "#404044",
            borderRadius: "2px 0 0 2px",
          }}
          aria-hidden="true"
        />
        <div
          style={{
            position: "absolute",
            right: "-3px",
            top: "108px",
            width: "3px",
            height: "60px",
            background: "#404044",
            borderRadius: "0 2px 2px 0",
          }}
          aria-hidden="true"
        />

        {/* ── Inner Screen Frame ── */}
        <div
          style={{
            position: "relative",
            width: "100%",
            borderRadius: "36px",
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
          }}
        >
          {/* ── Status Bar (Clock & Dynamic Island) ── */}
          <div
            style={{
              padding: "10px 18px 4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#FFFFFF",
              color: "#000000",
              fontSize: "11px",
              fontWeight: 600,
            }}
          >
            <span>9:41</span>

            {/* Dynamic Island Pill */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "10px",
                transform: "translateX(-50%)",
                width: "74px",
                height: "20px",
                backgroundColor: "#000000",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: "7px",
              }}
            >
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  backgroundColor: "#0f1626",
                  border: "1px solid #1a2a44",
                }}
              />
            </div>

            {/* Icons */}
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <svg width="12" height="10" viewBox="0 0 16 12" fill="currentColor">
                <rect x="0" y="8" width="3" height="4" rx="0.5" />
                <rect x="4.3" y="5.5" width="3" height="6.5" rx="0.5" />
                <rect x="8.6" y="3" width="3" height="9" rx="0.5" />
                <rect x="13" y="0.5" width="3" height="11.5" rx="0.5" />
              </svg>
              <div
                style={{
                  width: "18px",
                  height: "9px",
                  borderRadius: "2.5px",
                  border: "1px solid currentColor",
                  padding: "1px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "80%", height: "100%", backgroundColor: "currentColor", borderRadius: "1px" }} />
              </div>
            </div>
          </div>

          {/* ── Instagram Header Bar ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              borderBottom: "1px solid #F0F0F0",
              backgroundColor: "#FFFFFF",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
              {/* Avatar with gradient story ring */}
              <div
                style={{
                  position: "relative",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  padding: "2px",
                  background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    backgroundColor: "#FFFFFF",
                    padding: "1.5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={accountName}
                      style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        backgroundColor: "#0A0A0A",
                        color: "#FFFFFF",
                        fontSize: "11px",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      L
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#262626" }}>
                    {accountHandle.replace("@", "")}
                  </span>
                  {/* Verified Badge */}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="#0095F6">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z" />
                  </svg>
                </div>
                {isCarousel && (
                  <span style={{ fontSize: "10px", color: "#8E8E93" }}>
                    Carousel · Slide {activeIndex + 1}/{slides.length}
                  </span>
                )}
              </div>
            </div>

            {/* Three Dots Menu */}
            <div style={{ cursor: "pointer", padding: "4px", color: "#262626" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="6" cy="12" r="1.5" />
                <circle cx="18" cy="12" r="1.5" />
              </svg>
            </div>
          </div>

          {/* ── Media Image Container (Standard Instagram 4:5 Portrait Ratio = 1080 x 1350) ── */}
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "4 / 5",
              backgroundColor: "#FAFAFA",
              overflow: "hidden",
              cursor: "pointer",
            }}
            onDoubleClick={handleDoubleTapLike}
            onClick={() =>
              onImageClick &&
              onImageClick(
                currentSlide.imageUrl,
                currentSlide.title || slides[activeIndex]?.title,
                currentSlide.caption || slides[activeIndex]?.caption,
              )
            }
          >
            <SafeImage
              src={currentSlide.imageUrl}
              alt={currentSlide.alt || `Slide ${activeIndex + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                backgroundColor: "#F7F7F5",
                display: "block",
              }}
            />

            {/* Multi-Slide Index Badge at Top Right */}
            {isCarousel && (
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  padding: "4px 9px",
                  borderRadius: "14px",
                  backgroundColor: "rgba(18, 18, 18, 0.75)",
                  backdropFilter: "blur(6px)",
                  color: "#FFFFFF",
                  fontSize: "10.5px",
                  fontWeight: 600,
                  fontFamily: "var(--font-mono, monospace)",
                  zIndex: 10,
                }}
              >
                {activeIndex + 1}/{slides.length}
              </div>
            )}

            {/* Double-tap heart animation flash */}
            {showHeartOverlay && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 20,
                  pointerEvents: "none",
                  animation: "fadeUp 0.6s ease forwards",
                }}
              >
                <svg width="72" height="72" viewBox="0 0 24 24" fill="#FF2D55" stroke="#FFFFFF" strokeWidth="1">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
            )}

            {/* Navigation Arrows for Carousel */}
            {isCarousel && activeIndex > 0 && (
              <button
                type="button"
                onClick={goPrev}
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 15,
                  color: "#000",
                }}
                aria-label="Previous slide"
              >
                ‹
              </button>
            )}

            {isCarousel && activeIndex < slides.length - 1 && (
              <button
                type="button"
                onClick={goNext}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 15,
                  color: "#000",
                }}
                aria-label="Next slide"
              >
                ›
              </button>
            )}
          </div>

          {/* ── Action Bar (Likes, Comments, Share, Bookmark & Carousel Dots) ── */}
          <div style={{ padding: "8px 12px 6px", backgroundColor: "#FFFFFF" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                {/* Like Button */}
                <button
                  type="button"
                  onClick={() => setLiked(!liked)}
                  style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
                  title="Like"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill={liked ? "#ED4956" : "none"}
                    stroke={liked ? "#ED4956" : "#262626"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>

                {/* Comment Icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>

                {/* Share Icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </div>

              {/* Carousel Dot Indicators */}
              {isCarousel && (
                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSlideChange(i)}
                      style={{
                        width: i === activeIndex ? "6px" : "4px",
                        height: i === activeIndex ? "6px" : "4px",
                        borderRadius: "50%",
                        backgroundColor: i === activeIndex ? "#0095F6" : "#DBDBDB",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Bookmark Button */}
              <button
                type="button"
                onClick={() => setBookmarked(!bookmarked)}
                style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
                title="Save"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={bookmarked ? "#262626" : "none"}
                  stroke="#262626"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </button>
            </div>

            {/* Like Count */}
            <div style={{ marginTop: "6px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#262626" }}>
                {liked ? "Disukai oleh Anda dan 2.401 lainnya" : `${likeCount} suka`}
              </span>
            </div>

            {/* Caption Preview */}
            <div style={{ marginTop: "4px", fontSize: "11.5px", lineHeight: "1.4", color: "#262626" }}>
              <span style={{ fontWeight: 700, marginRight: "5px" }}>{accountHandle.replace("@", "")}</span>
              <span>{caption || (currentSlide.title ? `${currentSlide.title} — ${currentSlide.caption || ""}` : "Editorial Visual Feeds & Campaign Design")}</span>
              {brandTag && (
                <span style={{ color: "#00376B", marginLeft: "4px", fontWeight: 500 }}>
                  #{brandTag.replace(/\s+/g, "")}
                </span>
              )}
            </div>

            <div style={{ marginTop: "4px", fontSize: "9.5px", color: "#8E8E93", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              2 JAM LALU
            </div>
          </div>

          {/* ── Home Indicator Bar (iOS) ── */}
          <div
            style={{
              padding: "6px 0 8px",
              display: "flex",
              justifyContent: "center",
              backgroundColor: "#FFFFFF",
            }}
          >
            <div
              style={{
                width: "90px",
                height: "3.5px",
                backgroundColor: "#111111",
                borderRadius: "2px",
              }}
            />
          </div>
        </div>
      </div>

      {/* Caption Footnote */}
      {isCarousel && (
        <p
          className="text-center font-mono text-[10px] uppercase tracking-wider text-gray-400 mt-3"
          style={{ letterSpacing: "0.1em" }}
        >
          📷 INSTAGRAM CAROUSEL · SLIDE {activeIndex + 1} DARI {slides.length}
        </p>
      )}
    </div>
  )
}
