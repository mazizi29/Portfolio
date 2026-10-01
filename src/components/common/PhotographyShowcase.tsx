import { useState, useEffect, useRef, useCallback } from "react"
import SafeImage from "@/components/common/SafeImage"
import { GalleryItem } from "@/types/project"

export interface PhotographyShowcaseProps {
  photos: GalleryItem[]
  title?: string
  subtitle?: string
  onPhotoZoom?: (photo: GalleryItem) => void
  autoPlayInterval?: number
  className?: string
}

/**
 * Galeri Fotografi: auto-slide per kartu, berhenti di tengah kartu yang aktif,
 * loop kembali ke awal saat mencapai akhir, pause on hover/touch.
 */
export default function PhotographyShowcase({
  photos = [],
  title,
  subtitle,
  autoPlayInterval = 3500,
  onPhotoZoom,
  className = "",
}: PhotographyShowcaseProps) {
  const displayPhotos = photos
  const trackRef = useRef<HTMLDivElement | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const activeIndexRef = useRef(0)

  // Scroll kartu ke tengah viewport container
  const scrollToCard = useCallback((idx: number, behavior: ScrollBehavior = "smooth") => {
    const container = trackRef.current
    const card = cardRefs.current[idx]
    if (!container || !card) return

    // Hitung offset agar kartu berada di tengah
    const containerCenter = container.clientWidth / 2
    const cardLeft = card.offsetLeft
    const cardCenter = card.offsetWidth / 2
    const targetScroll = cardLeft - containerCenter + cardCenter

    container.scrollTo({ left: Math.max(0, targetScroll), behavior })
    setActiveIndex(idx)
    activeIndexRef.current = idx
  }, [])

  // Auto-advance per kartu dengan loop ke awal
  useEffect(() => {
    if (isPaused || displayPhotos.length <= 1) return

    const timer = setInterval(() => {
      const next = (activeIndexRef.current + 1) % displayPhotos.length
      scrollToCard(next)
    }, autoPlayInterval)

    return () => clearInterval(timer)
  }, [isPaused, displayPhotos.length, autoPlayInterval, scrollToCard])

  // Track scroll posisi secara manual (untuk sinkronisasi indikator)
  const handleScroll = useCallback(() => {
    const container = trackRef.current
    if (!container || displayPhotos.length === 0) return

    const containerCenter = container.scrollLeft + container.clientWidth / 2
    let closestIdx = 0
    let closestDist = Infinity

    cardRefs.current.forEach((card, i) => {
      if (!card) return
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      const dist = Math.abs(containerCenter - cardCenter)
      if (dist < closestDist) {
        closestDist = dist
        closestIdx = i
      }
    })

    if (closestIdx !== activeIndexRef.current) {
      setActiveIndex(closestIdx)
      activeIndexRef.current = closestIdx
    }
  }, [displayPhotos.length])

  const scrollPrev = () => {
    const prev = Math.max(0, activeIndexRef.current - 1)
    scrollToCard(prev)
  }

  const scrollNext = () => {
    const next = (activeIndexRef.current + 1) % displayPhotos.length
    scrollToCard(next)
  }

  if (!displayPhotos || displayPhotos.length === 0) return null

  return (
    <div
      className={`w-full flex flex-col gap-4 relative select-none ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* ── ACTION BAR ── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-xl border bg-[#F8F7F4]"
        style={{ borderColor: "var(--color-border, #E5E5E0)" }}
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
            ✦ Galeri Lengkap ({displayPhotos.length} Karya)
          </span>
          <span className="text-xs text-stone-500 font-sans hidden md:inline-block">
            {subtitle || "Rasio asli proporsional · Klik foto untuk resolusi penuh"}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          {/* Auto-scroll indicator */}
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-stone-600 bg-white/80 px-2.5 py-1 rounded-full border border-stone-200 shadow-2xs">
            <span
              className={`w-2 h-2 rounded-full transition-colors ${
                isPaused ? "bg-amber-400" : "bg-emerald-500 animate-pulse"
              }`}
            />
            <span>{isPaused ? "Dijeda" : "Auto-Scroll Aktif"}</span>
          </div>

          {/* Counter */}
          <span className="font-mono text-xs text-stone-600 font-medium tabular-nums">
            {activeIndex + 1} / {displayPhotos.length}
          </span>

          {/* Nav buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={scrollPrev}
              className="w-8 h-8 rounded-lg border border-stone-300 bg-white hover:bg-black hover:text-white hover:border-black text-stone-800 transition-all flex items-center justify-center cursor-pointer shadow-2xs active:scale-95 text-xs font-bold"
              aria-label="Foto sebelumnya"
            >
              ←
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="w-8 h-8 rounded-lg border border-stone-300 bg-white hover:bg-black hover:text-white hover:border-black text-stone-800 transition-all flex items-center justify-center cursor-pointer shadow-2xs active:scale-95 text-xs font-bold"
              aria-label="Foto selanjutnya"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* ── CARD STRIP ── */}
      <div
        className="relative w-full overflow-hidden rounded-2xl border bg-stone-950 p-2 sm:p-3 shadow-inner"
        style={{ borderColor: "var(--color-border, #E5E5E0)" }}
      >
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-stone-950 to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-stone-950 to-transparent pointer-events-none z-10" />

        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-2 pt-1 px-8 no-scrollbar cursor-grab active:cursor-grabbing items-center"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            height: "clamp(340px, 48vw, 460px)",
            scrollBehavior: "smooth",
          }}
        >
          {displayPhotos.map((photo, idx) => {
            const isActive = idx === activeIndex

            return (
              <div
                key={photo.id || idx}
                ref={(el) => { cardRefs.current[idx] = el }}
                onClick={() => {
                  scrollToCard(idx)
                  onPhotoZoom && onPhotoZoom(photo)
                }}
                className={`group relative shrink-0 h-full rounded-xl overflow-hidden border transition-all duration-500 cursor-pointer bg-stone-900/90 shadow-md ${
                  isActive
                    ? "ring-2 ring-emerald-400/80 border-emerald-400/50 scale-[1.02]"
                    : "border-stone-800 hover:border-stone-600 scale-[0.96] opacity-80 hover:opacity-100"
                }`}
                style={{
                  maxWidth: "80vw",
                  minWidth: "200px",
                  transition: "transform 0.4s ease, opacity 0.4s ease, border-color 0.3s ease",
                }}
              >
                <div className="relative w-full h-full flex items-center justify-center p-2 overflow-hidden bg-stone-950">
                  <SafeImage
                    src={photo.image_url}
                    alt={photo.title || `Foto ${idx + 1}`}
                    className="max-h-full w-auto max-w-full object-contain rounded-lg"
                  />
                </div>

                {/* Badge nomor */}
                <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
                  <span className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-md bg-black/70 text-white backdrop-blur-md border border-white/20 shadow-xs">
                    #{idx + 1}
                  </span>
                  <span className="font-mono text-[10px] font-semibold px-2.5 py-1 rounded-md bg-white text-black shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1">
                    <span>🔍</span>
                    <span>Perbesar</span>
                  </span>
                </div>

                {/* Keterangan bawah */}
                <div className="absolute inset-x-0 bottom-0 z-20 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent text-white pt-8">
                  <h4 className="font-sans font-bold text-xs sm:text-sm leading-snug line-clamp-1 group-hover:text-emerald-300 transition-colors">
                    {photo.title || `Dokumentasi Visual #${idx + 1}`}
                  </h4>
                  {photo.caption && (
                    <p className="text-[11px] text-white/75 line-clamp-1 font-light mt-0.5 leading-relaxed">
                      {photo.caption}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Dot indicators ── */}
      {displayPhotos.length > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-1 pt-1 px-4">
          {displayPhotos.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => scrollToCard(dotIdx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                dotIdx === activeIndex
                  ? "w-6 bg-emerald-600"
                  : "w-1.5 bg-stone-300 hover:bg-stone-400"
              }`}
              aria-label={`Foto ${dotIdx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
