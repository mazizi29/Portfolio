import { useState, useRef, useEffect } from "react"
import SafeImage from "@/components/common/SafeImage"

export interface PhoneReelsMockupProps {
  /** Video URL (direct mp4/webm file or stream) */
  videoUrl?: string
  /** Poster/Thumbnail image shown before play or if videoUrl not present */
  posterUrl: string
  /** Video title or headline */
  title?: string
  /** Creator / Studio handle (default: "@layarputih.studio") */
  accountHandle?: string
  /** Role label on this project e.g. "Videographer & Editor" */
  roleLabel?: string
  /** Client or brand name */
  clientName?: string
  /** Audio track title (display only) */
  audioTrack?: string
  /** Metrics (display only) */
  likeCount?: string | number
  commentCount?: string | number
  shareCount?: string | number
  viewsCount?: string | number
  /** Aspect ratio width constraint (default max 320px) */
  maxWidth?: string
  /** Optional custom class name */
  className?: string
  /** Whether to autoplay muted video on load */
  autoPlay?: boolean
}

/**
 * Komponen Mockup Smartphone Vertikal (9:16) untuk Reels, TikTok, dan Shorts.
 * Sangat cocok untuk menampilkan karya:
 * - Video Production & Editing
 * - Motion Graphics & Short-form Content
 * - Commercial Video Showcase
 */
export default function PhoneReelsMockup({
  videoUrl,
  posterUrl,
  title,
  accountHandle = "@layarputih.studio",
  roleLabel = "Videographer & Editor",
  clientName,
  audioTrack = "Original Audio · Layar Putih",
  likeCount = "4.8K",
  commentCount = "128",
  shareCount = "390",
  viewsCount,
  maxWidth = "320px",
  className = "",
  autoPlay = false,
}: PhoneReelsMockupProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay && !!videoUrl)
  const [isMuted, setIsMuted] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(likeCount)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showPlayIconBriefly, setShowPlayIconBriefly] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (autoPlay && videoUrl && videoRef.current) {
      videoRef.current.play().catch(() => {
        setIsPlaying(false)
      })
    }
  }, [autoPlay, videoUrl])

  const togglePlay = () => {
    if (!videoUrl) return

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play().catch(() => {})
        setIsPlaying(true)
      }
      setShowPlayIconBriefly(true)
      setTimeout(() => setShowPlayIconBriefly(false), 600)
    }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLiked((prev) => !prev)
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
      setDuration(videoRef.current.duration || 0)
    }
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      className={`relative mx-auto select-none ${className}`}
      style={{
        maxWidth,
        width: "100%",
        fontFamily: "var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
      }}
    >
      {/* ── Outer Phone Chassis (iPhone-like Body) ── */}
      <div
        style={{
          position: "relative",
          aspectRatio: "9 / 19",
          borderRadius: "44px",
          padding: "10px",
          background: "linear-gradient(145deg, #2a2a2e 0%, #111113 100%)",
          boxShadow:
            "0 24px 64px -12px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 0 0 2px rgba(255, 255, 255, 0.06)",
        }}
      >
        {/* Phone Side Buttons (Simulated) */}
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
            height: "100%",
            borderRadius: "36px",
            overflow: "hidden",
            backgroundColor: "#000000",
            cursor: videoUrl ? "pointer" : "default",
          }}
          onClick={togglePlay}
          role="region"
          aria-label={`Video Reels Mockup: ${title || "Project video"}`}
        >
          {/* ── Media Content (Video or Poster) ── */}
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              poster={posterUrl}
              playsInline
              loop
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <SafeImage
              src={posterUrl}
              alt={title || "Reels video thumbnail"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          )}

          {/* Vignette Overlay for readable text */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.85) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* ── Top Dynamic Island & Status Bar ── */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              padding: "10px 18px 6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              zIndex: 20,
              color: "#FFFFFF",
              fontSize: "11px",
              fontWeight: 600,
              pointerEvents: "none",
            }}
          >
            {/* Clock */}
            <span>9:41</span>

            {/* Dynamic Island Pill */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "10px",
                transform: "translateX(-50%)",
                width: "80px",
                height: "22px",
                backgroundColor: "#000000",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: "8px",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.06)",
              }}
            >
              {/* Mini camera lens reflection */}
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#0f1626",
                  border: "1px solid #1a2a44",
                }}
              />
            </div>

            {/* Status Icons (Signal, Wifi, Battery) */}
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <svg width="12" height="10" viewBox="0 0 16 12" fill="currentColor">
                <rect x="0" y="8" width="3" height="4" rx="0.5" />
                <rect x="4.3" y="5.5" width="3" height="6.5" rx="0.5" />
                <rect x="8.6" y="3" width="3" height="9" rx="0.5" />
                <rect x="13" y="0.5" width="3" height="11.5" rx="0.5" />
              </svg>
              <svg width="12" height="10" viewBox="0 0 14 10" fill="currentColor">
                <path d="M7 10C7.7 10 8.2 9.4 8.2 8.8C8.2 8.1 7.7 7.5 7 7.5C6.3 7.5 5.8 8.1 5.8 8.8C5.8 9.4 6.3 10 7 10ZM11.6 4.3C10.3 3.1 8.7 2.4 7 2.4C5.3 2.4 3.7 3.1 2.4 4.3C2.1 4.6 1.6 4.6 1.3 4.3C1 4 1 3.5 1.3 3.2C2.8 1.8 4.8 1 7 1C9.2 1 11.2 1.8 12.7 3.2C13 3.5 13 4 12.7 4.3C12.4 4.6 11.9 4.6 11.6 4.3ZM9.8 6.1C9.1 5.4 8.1 5 7 5C5.9 5 4.9 5.4 4.2 6.1C3.9 6.4 3.4 6.4 3.1 6.1C2.8 5.8 2.8 5.3 3.1 5C4.1 4.1 5.5 3.6 7 3.6C8.5 3.6 9.9 4.1 10.9 5C11.2 5.3 11.2 5.8 10.9 6.1C10.6 6.4 10.1 6.4 9.8 6.1Z" />
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
                <div
                  style={{
                    width: "80%",
                    height: "100%",
                    backgroundColor: "currentColor",
                    borderRadius: "1px",
                  }}
                />
              </div>
            </div>
          </div>

          {/* ── Top Floating Role / Client Badge ── */}
          <div
            style={{
              position: "absolute",
              top: "44px",
              left: "14px",
              zIndex: 15,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {roleLabel && (
              <span
                style={{
                  padding: "3px 8px",
                  borderRadius: "100px",
                  backgroundColor: "rgba(0, 0, 0, 0.65)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#FFFFFF",
                  fontSize: "9.5px",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {roleLabel}
              </span>
            )}
            {clientName && (
              <span
                style={{
                  padding: "3px 8px",
                  borderRadius: "100px",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  color: "#0A0A0A",
                  fontSize: "9.5px",
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                }}
              >
                {clientName}
              </span>
            )}
          </div>

          {/* ── Brief Play/Pause Flash Overlay ── */}
          {showPlayIconBriefly && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 25,
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  backdropFilter: "blur(6px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  transform: "scale(1)",
                  transition: "transform 0.2s ease",
                }}
              >
                {isPlaying ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: "2px" }}>
                    <polygon points="6,3 20,12 6,21" />
                  </svg>
                )}
              </div>
            </div>
          )}

          {/* If video exists and is paused, display subtle center play hint */}
          {videoUrl && !isPlaying && !showPlayIconBriefly && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(0, 0, 0, 0.55)",
                  backdropFilter: "blur(4px)",
                  border: "1.5px solid rgba(255, 255, 255, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: "3px" }}>
                  <polygon points="6,3 20,12 6,21" />
                </svg>
              </div>
            </div>
          )}

          {/* ── Right Action Sidebar (Likes, Comments, Share, Audio Disc) ── */}
          <div
            style={{
              position: "absolute",
              right: "10px",
              bottom: "48px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "14px",
              zIndex: 18,
            }}
          >
            {/* Like Button */}
            <button
              onClick={handleLike}
              style={{
                background: "transparent",
                border: "none",
                color: isLiked ? "#FF2D55" : "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px",
                cursor: "pointer",
                padding: "2px",
                outline: "none",
              }}
              title="Like"
              type="button"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={isLiked ? "#FF2D55" : "none"}
                stroke={isLiked ? "#FF2D55" : "#FFFFFF"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span style={{ fontSize: "10px", fontWeight: 600, color: "#fff" }}>
                {isLiked ? (typeof likes === "number" ? likes + 1 : "Liked") : likes}
              </span>
            </button>

            {/* Comment Icon */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px",
                color: "#FFFFFF",
                cursor: "pointer",
              }}
            >
              <svg
                width="23"
                height="23"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              <span style={{ fontSize: "10px", fontWeight: 600 }}>{commentCount}</span>
            </div>

            {/* Share Icon */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px",
                color: "#FFFFFF",
                cursor: "pointer",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              <span style={{ fontSize: "10px", fontWeight: 600 }}>{shareCount}</span>
            </div>

            {/* Audio / Mute Toggle Button */}
            {videoUrl && (
              <button
                onClick={toggleMute}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  marginTop: "4px",
                }}
                title={isMuted ? "Unmute" : "Mute"}
                type="button"
              >
                {isMuted ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </button>
            )}

            {/* Rotating Vinyl Record Disk */}
            <div
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                background: "conic-gradient(from 0deg, #111, #444, #111, #666, #111)",
                border: "2px solid #222",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: isPlaying ? "spin 3s linear infinite" : "none",
                marginTop: "2px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-ink, #0A0A0A)",
                  border: "1.5px solid #fff",
                }}
              />
            </div>
          </div>

          {/* ── Bottom Content Overlay (Handle, Caption, Audio Track) ── */}
          <div
            style={{
              position: "absolute",
              left: "14px",
              right: "60px",
              bottom: "22px",
              zIndex: 18,
              color: "#FFFFFF",
            }}
          >
            {/* Account Handle & Follow tag */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "-0.01em" }}>
                {accountHandle}
              </span>
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 600,
                  padding: "1.5px 6px",
                  borderRadius: "4px",
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                }}
              >
                Creator
              </span>
            </div>

            {/* Caption / Title */}
            {title && (
              <p
                style={{
                  fontSize: "11.5px",
                  lineHeight: "1.35",
                  fontWeight: 400,
                  margin: "0 0 6px 0",
                  color: "rgba(255, 255, 255, 0.95)",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {title}
              </p>
            )}

            {/* Audio Track Tag */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "10px",
                color: "rgba(255, 255, 255, 0.8)",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
              <span style={{ textOverflow: "ellipsis", overflow: "hidden" }}>{audioTrack}</span>
            </div>
          </div>

          {/* ── Video Progress Bar ── */}
          {duration > 0 && (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: "2.5px",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                zIndex: 22,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progressPercent}%`,
                  backgroundColor: "#FFFFFF",
                  transition: "width 0.15s linear",
                }}
              />
            </div>
          )}

          {/* ── Home Indicator Bar (iOS) ── */}
          <div
            style={{
              position: "absolute",
              bottom: "6px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "72px",
              height: "3px",
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              borderRadius: "2px",
              zIndex: 25,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  )
}

