import { useState, useEffect, type ImgHTMLAttributes } from "react"

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  fallbackSrc?: string
  /** Tampilkan placeholder SVG bergaya jika semua src gagal */
  showPlaceholder?: boolean
}

/**
 * Komponen <img> yang menangani error gambar secara graceful.
 * Jika src gagal dimuat, akan mencoba fallbackSrc (opsional),
 * lalu menampilkan placeholder bertema editorial jika keduanya gagal.
 */
export default function SafeImage({
  src,
  alt,
  fallbackSrc,
  showPlaceholder = true,
  className,
  style,
  ...rest
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || "")
  const [hasFailed, setHasFailed] = useState(false)
  const [triedFallback, setTriedFallback] = useState(false)

  // Sinkronkan state jika src prop berubah dari parent
  useEffect(() => {
    setImgSrc(src || "")
    setHasFailed(!src)
    setTriedFallback(false)
  }, [src, fallbackSrc])

  const handleError = () => {
    if (!triedFallback && fallbackSrc && fallbackSrc !== imgSrc) {
      setImgSrc(fallbackSrc)
      setTriedFallback(true)
      return
    }
    setHasFailed(true)
  }

  if ((!imgSrc || hasFailed) && showPlaceholder) {
    return <ImagePlaceholder className={className} style={style} alt={alt} />
  }

  return (
    <img
      src={imgSrc || src}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      {...rest}
    />
  )
}

function ImagePlaceholder({
  className,
  style,
  alt,
}: {
  className?: string
  style?: React.CSSProperties
  alt?: string
}) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-border-light, #EBEBEB)",
        color: "var(--color-muted, #9A9A9A)",
        gap: "6px",
        width: "100%",
        height: "100%",
        minHeight: "120px",
        ...style,
      }}
      aria-label={alt || "Gambar tidak tersedia"}
      role="img"
    >
      {/* Minimalist broken-image icon */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
      <span
        style={{
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "10px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          opacity: 0.7,
        }}
      >
        {alt || "Tidak tersedia"}
      </span>
    </div>
  )
}
