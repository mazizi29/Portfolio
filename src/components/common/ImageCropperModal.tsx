import { useState, useRef, useEffect, useCallback } from "react"
import { uploadImage } from "@/lib/upload"

export type CropAspectRatio = "4:5" | "1:1" | "16:9" | "3:2" | "9:16" | "free"

export interface ImageCropperModalProps {
  /** URL gambar atau data URL yang ingin di-crop */
  imageUrl: string
  /** Judul atau nama aset yang sedang di-crop */
  title?: string
  /** Subtitle / deskripsi aset (opsional) */
  subtitle?: string
  /** Rasio aspek awal (default: "4:5" untuk Instagram Feed 1080x1350) */
  initialAspectRatio?: CropAspectRatio
  /** Callback saat crop selesai dan berhasil diunggah */
  onCropComplete: (croppedUrl: string) => void
  /** Callback untuk menutup modal tanpa menyimpan */
  onClose: () => void
}

interface AspectConfig {
  id: CropAspectRatio
  label: string
  badge: string
  boxWidth: number
  boxHeight: number
  targetWidth: number
  targetHeight: number
  description: string
  recommendedFor: string
}

const ASPECT_CONFIGS: AspectConfig[] = [
  {
    id: "4:5",
    label: "4:5",
    badge: "1080 × 1350 (Feed)",
    boxWidth: 340,
    boxHeight: 425,
    targetWidth: 1080,
    targetHeight: 1350,
    description: "Rasio potret standar Instagram Feed & Foto Portofolio",
    recommendedFor: "Sangat disarankan untuk Feeds Instagram halaman proyek",
  },
  {
    id: "1:1",
    label: "1:1",
    badge: "1080 × 1080 (Square)",
    boxWidth: 360,
    boxHeight: 360,
    targetWidth: 1080,
    targetHeight: 1080,
    description: "Persegi simetris untuk Logo Marks & Grid Foto",
    recommendedFor: "Brand Identity, Logo & Grid Showcase",
  },
  {
    id: "16:9",
    label: "16:9",
    badge: "1920 × 1080 (Landscape)",
    boxWidth: 440,
    boxHeight: 247.5,
    targetWidth: 1920,
    targetHeight: 1080,
    description: "Landscape lebar untuk Cover Video YouTube & Layar Laptop",
    recommendedFor: "Thumbnail Video YouTube & Frame Laptop",
  },
  {
    id: "3:2",
    label: "3:2",
    badge: "1500 × 1000 (DSLR)",
    boxWidth: 420,
    boxHeight: 280,
    targetWidth: 1500,
    targetHeight: 1000,
    description: "Rasio sensor kamera DSLR / Mirrorless",
    recommendedFor: "Fotografi Komersial & Editorial",
  },
  {
    id: "9:16",
    label: "9:16",
    badge: "1080 × 1920 (Reels)",
    boxWidth: 260,
    boxHeight: 462,
    targetWidth: 1080,
    targetHeight: 1920,
    description: "Layar penuh smartphone vertikal",
    recommendedFor: "Instagram Reels & TikTok Shorts",
  },
  {
    id: "free",
    label: "Bebas",
    badge: "Ukuran Asli",
    boxWidth: 380,
    boxHeight: 380,
    targetWidth: 1200,
    targetHeight: 1200,
    description: "Mempertahankan proporsi asli berkas gambar",
    recommendedFor: "Lampiran Umum",
  },
]

export default function ImageCropperModal({
  imageUrl,
  title = "Sesuaikan & Crop Gambar Galeri",
  subtitle,
  initialAspectRatio = "4:5",
  onCropComplete,
  onClose,
}: ImageCropperModalProps) {
  const [selectedRatio, setSelectedRatio] = useState<CropAspectRatio>(initialAspectRatio)
  const [zoom, setZoom] = useState<number>(1)
  const [rotation, setRotation] = useState<number>(0)
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [loadingImage, setLoadingImage] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveProgress, setSaveProgress] = useState<string>("")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null)
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 })

  const imageRef = useRef<HTMLImageElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const currentConfig = ASPECT_CONFIGS.find((c) => c.id === selectedRatio) || ASPECT_CONFIGS[0]

  // Fetch image via Blob to prevent CORS / Tainted Canvas issues
  useEffect(() => {
    let active = true
    setLoadingImage(true)
    setErrorMsg(null)

    const loadImage = async () => {
      try {
        // Try fetching as blob first to completely bypass canvas CORS restrictions
        let blobUrl = imageUrl
        try {
          const res = await fetch(imageUrl, { mode: "cors" })
          if (res.ok) {
            const blob = await res.blob()
            blobUrl = URL.createObjectURL(blob)
          }
        } catch {
          // If fetch fails (e.g. cross-origin without direct fetch), fall back to raw URL
          blobUrl = imageUrl
        }

        if (!active) return

        setImageBlobUrl(blobUrl)

        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          if (!active) return
          imageRef.current = img
          setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight })
          setLoadingImage(false)
          setPan({ x: 0, y: 0 })
          setZoom(1)
          setRotation(0)
        }
        img.onerror = () => {
          if (!active) return
          // Fallback without crossOrigin
          const fallback = new Image()
          fallback.onload = () => {
            if (!active) return
            imageRef.current = fallback
            setNaturalSize({ width: fallback.naturalWidth, height: fallback.naturalHeight })
            setLoadingImage(false)
          }
          fallback.onerror = () => {
            if (!active) return
            setLoadingImage(false)
            setErrorMsg("Gagal memuat gambar. Pastikan URL valid dan dapat diakses.")
          }
          fallback.src = imageUrl
        }
        img.src = blobUrl
      } catch (e: any) {
        if (!active) return
        setLoadingImage(false)
        setErrorMsg(e.message || "Gagal memuat gambar.")
      }
    }

    loadImage()

    return () => {
      active = false
    }
  }, [imageUrl])

  // Clean up Blob URL when component unmounts
  useEffect(() => {
    return () => {
      if (imageBlobUrl && imageBlobUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageBlobUrl)
      }
    }
  }, [imageBlobUrl])

  // Mouse / Touch Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    },
    [isDragging, dragStart],
  )

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true)
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY < 0 ? 0.08 : -0.08
    setZoom((prev) => Math.min(3.5, Math.max(0.8, Number((prev + delta).toFixed(2)))))
  }

  const handleReset = () => {
    setPan({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  // Calculate base rendered dimensions inside the crop box
  const getRenderedDimensions = () => {
    if (!naturalSize.width || !naturalSize.height) {
      return { width: currentConfig.boxWidth, height: currentConfig.boxHeight, baseScale: 1 }
    }

    const { boxWidth, boxHeight } = currentConfig
    const nw = naturalSize.width
    const nh = naturalSize.height

    // Cover scale: ensures the image fills the crop box without empty borders
    const baseScale = Math.max(boxWidth / nw, boxHeight / nh)
    const currentScale = baseScale * zoom

    return {
      width: nw * currentScale,
      height: nh * currentScale,
      baseScale,
    }
  }

  const rendered = getRenderedDimensions()

  // Apply Crop Export: 100% Mathematically Exact Match to On-Screen Frame
  const handleApplyCrop = async () => {
    if (!imageRef.current) return
    setSaving(true)
    setSaveProgress("Memotong gambar...")
    setErrorMsg(null)

    try {
      const img = imageRef.current
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        throw new Error("Canvas context 2D tidak didukung pada browser ini.")
      }

      // Target export dimensions
      let targetW = currentConfig.targetWidth
      let targetH = currentConfig.targetHeight

      if (selectedRatio === "free") {
        targetW = naturalSize.width || 1200
        targetH = naturalSize.height || 1200
      }

      canvas.width = targetW
      canvas.height = targetH

      // Fill clean solid white background
      ctx.fillStyle = "#FFFFFF"
      ctx.fillRect(0, 0, targetW, targetH)

      // Scale multiplier from on-screen box to high-res canvas
      const scaleFactor = targetW / currentConfig.boxWidth

      // Exact centered transform mapping
      ctx.save()
      ctx.translate(targetW / 2, targetH / 2)
      ctx.rotate((rotation * Math.PI) / 180)

      // High quality image smoothing
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"

      const drawX = (-rendered.width / 2 + pan.x) * scaleFactor
      const drawY = (-rendered.height / 2 + pan.y) * scaleFactor
      const drawW = rendered.width * scaleFactor
      const drawH = rendered.height * scaleFactor

      ctx.drawImage(img, drawX, drawY, drawW, drawH)
      ctx.restore()

      setSaveProgress("Mengompresi ke WebP HD...")

      // Export canvas to WebP Blob (quality: 0.94)
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), "image/webp", 0.94)
      })

      if (!blob) {
        throw new Error("Gagal mengonversi potongan gambar ke format web.")
      }

      setSaveProgress("Mengunggah ke penyimpanan...")

      // Create File from Blob and upload to storage
      const fileName = `crop-${Date.now()}-${selectedRatio.replace(":", "x")}.webp`
      const croppedFile = new File([blob], fileName, { type: "image/webp" })

      const { url, error } = await uploadImage(croppedFile)

      if (error || !url) {
        console.warn("Storage upload fallback to DataURL:", error)
        const fallbackDataUrl = canvas.toDataURL("image/webp", 0.9)
        onCropComplete(fallbackDataUrl)
      } else {
        onCropComplete(url)
      }

      onClose()
    } catch (err: any) {
      console.error("Crop error:", err)
      setErrorMsg(err.message || "Gagal memproses dan menyimpan hasil crop.")
    } finally {
      setSaving(false)
      setSaveProgress("")
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xs select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-[#141416] text-white rounded-2xl border border-stone-800 shadow-2xl flex flex-col overflow-hidden max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-800 bg-[#1A1A1D]">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center text-sm font-mono font-bold">
              ✂
            </span>
            <div>
              <h3 className="font-sans font-bold text-sm sm:text-base text-white line-clamp-1">
                {title}
              </h3>
              <p className="text-[11px] text-stone-400 font-mono mt-0.5">
                {subtitle || "Sesuaikan framing gambar agar tampil sempurna di halaman proyek publik"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center text-xs cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Aspect Ratio Selector Tabs */}
        <div className="px-5 py-2.5 border-b border-stone-800 bg-[#161619] flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap gap-1.5">
            {ASPECT_CONFIGS.map((cfg) => {
              const isSelected = selectedRatio === cfg.id
              const isFeed = cfg.id === "4:5"
              return (
                <button
                  key={cfg.id}
                  type="button"
                  onClick={() => {
                    setSelectedRatio(cfg.id)
                    handleReset()
                  }}
                  className={`font-mono text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-amber-500 text-black font-bold border-amber-400 shadow-xs"
                      : "bg-stone-800/80 text-stone-300 border-stone-700 hover:bg-stone-700 hover:text-white"
                  }`}
                >
                  <span>{cfg.label}</span>
                  {isFeed && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-black text-amber-400 font-mono font-bold">
                      ⭐ Feed 1080×1350
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-amber-400 font-semibold hidden md:inline-block">
              {currentConfig.recommendedFor}
            </span>
          </div>
        </div>

        {/* Main Work Area: Crop Canvas Viewport */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className="relative flex-1 min-h-[360px] sm:min-h-[440px] bg-[#0A0A0C] flex items-center justify-center p-4 overflow-hidden cursor-grab active:cursor-grabbing"
          style={{ touchAction: "none" }}
        >
          {loadingImage ? (
            <div className="flex flex-col items-center gap-2 text-stone-400 font-mono text-xs">
              <span className="w-7 h-7 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <span>Memuat gambar resolusi tinggi...</span>
            </div>
          ) : errorMsg ? (
            <div className="text-center p-6 max-w-md bg-stone-900 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-xs sm:text-sm mb-3">{errorMsg}</p>
              <button
                type="button"
                onClick={onClose}
                className="font-mono text-xs px-3 py-1.5 rounded bg-stone-800 text-white hover:bg-stone-700 cursor-pointer"
              >
                Tutup Modal
              </button>
            </div>
          ) : (
            <div
              className="relative w-full h-full flex items-center justify-center"
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Target Crop Box (Frame Pembatas Potong) */}
              <div
                style={{
                  width: `${currentConfig.boxWidth}px`,
                  height: `${currentConfig.boxHeight}px`,
                }}
                className="relative border-2 border-amber-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.8)] rounded-md overflow-hidden flex items-center justify-center shrink-0"
              >
                {/* Rule of Thirds Composition Grid */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none z-10 opacity-35">
                  <div className="border-r border-b border-white/60" />
                  <div className="border-r border-b border-white/60" />
                  <div className="border-b border-white/60" />
                  <div className="border-r border-b border-white/60" />
                  <div className="border-r border-b border-white/60" />
                  <div className="border-b border-white/60" />
                  <div className="border-r border-b border-white/60" />
                  <div className="border-r border-b border-white/60" />
                  <div />
                </div>

                {/* Corner Resolution Pill */}
                <div className="absolute top-2 left-2 z-20 pointer-events-none">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-black/85 text-amber-400 border border-amber-400/40 shadow-xs">
                    {currentConfig.badge}
                  </span>
                </div>

                {/* Draggable & Scalable Image Element */}
                <img
                  src={imageBlobUrl || imageUrl}
                  alt="Crop preview"
                  draggable={false}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: `${rendered.width}px`,
                    height: `${rendered.height}px`,
                    transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg)`,
                    transformOrigin: "center center",
                    transition: isDragging ? "none" : "transform 0.05s ease-out",
                    maxWidth: "none",
                    maxHeight: "none",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>
          )}

          {/* Floating Pan / Zoom Guide Tooltip */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none font-mono text-[10px] text-stone-300 bg-black/75 px-3 py-1 rounded-full border border-stone-700/80 backdrop-blur-xs flex items-center gap-2 shadow-lg">
            <span>🖱 Geser kursor untuk menggeser framing</span>
            <span>·</span>
            <span>Scroll untuk zoom in/out</span>
          </div>
        </div>

        {/* Toolbar: Zoom Slider & Transformation Controls */}
        <div className="px-5 py-3 border-t border-stone-800 bg-[#161619] flex flex-wrap items-center justify-between gap-4">
          {/* Zoom Slider */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <span className="font-mono text-xs text-stone-400">Zoom:</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.8, Number((z - 0.1).toFixed(2))))}
              className="w-7 h-7 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center justify-center cursor-pointer transition-colors"
              title="Perkecil zoom"
            >
              -
            </button>
            <input
              type="range"
              min="0.8"
              max="3.5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-28 sm:w-44 accent-amber-500 cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(3.5, Number((z + 0.1).toFixed(2))))}
              className="w-7 h-7 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center justify-center cursor-pointer transition-colors"
              title="Perbesar zoom"
            >
              +
            </button>
            <span className="font-mono text-xs text-amber-400 font-semibold w-12 text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Quick Fit & Orientation Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRotate}
              className="font-mono text-xs px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 cursor-pointer flex items-center gap-1.5 transition-colors"
              title="Putar gambar 90 derajat searah jarum jam"
            >
              <span>↻</span>
              <span>Putar 90°</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="font-mono text-xs px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 cursor-pointer transition-colors"
              title="Kembalikan posisi tepat di tengah"
            >
              Pusatkan
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-stone-800 bg-[#1A1A1D] flex items-center justify-between gap-3">
          <div className="text-stone-400 font-mono text-[11px] hidden sm:block">
            Target Output:{" "}
            <strong className="text-white">
              {currentConfig.targetWidth} × {currentConfig.targetHeight} px
            </strong>{" "}
            <span className="text-stone-500">(.webp HD)</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-lg font-mono text-xs text-stone-300 hover:bg-stone-800 border border-stone-700 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleApplyCrop}
              disabled={saving || loadingImage}
              className="px-5 py-2 rounded-lg font-sans font-bold text-xs bg-amber-500 hover:bg-amber-400 text-black tracking-wide shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>{saveProgress || "Memproses Crop..."}</span>
                </>
              ) : (
                <>
                  <span>✂</span>
                  <span>Terapkan Hasil Crop ({currentConfig.label})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
