import React from "react"
import SafeImage from "@/components/common/SafeImage"

export interface LaptopMockupProps {
  /** YouTube / Vimeo embed URL or direct video iframe URL */
  videoEmbedUrl?: string
  /** Direct video URL (mp4/webm) */
  videoUrl?: string
  /** Image URL for screenshot / mockup */
  imageUrl?: string
  /** Alt text for accessibility */
  alt?: string
  /** Title / Website URL displayed in top simulated browser bar */
  urlBarText?: string
  /** Custom max width (default: 860px) */
  maxWidth?: string
  /** Custom class name */
  className?: string
  /** Optional click handler on the screen */
  onScreenClick?: () => void
}

/**
 * Komponen Laptop / MacBook Mockup yang elegan dan realistis.
 * Sangat cocok untuk:
 * - Menampilkan Video YouTube / Dokumenter 16:9 dalam frame layar laptop modern
 * - Web Application & Dashboard live screenshots
 */
export default function LaptopMockup({
  videoEmbedUrl,
  videoUrl,
  imageUrl,
  alt = "Laptop screen preview",
  urlBarText,
  maxWidth = "860px",
  className = "",
  onScreenClick,
}: LaptopMockupProps) {
  return (
    <div
      className={`relative mx-auto select-none ${className}`}
      style={{
        maxWidth,
        width: "100%",
        fontFamily: "var(--font-sans, sans-serif)",
      }}
    >
      {/* ── Laptop Top Display Lid ── */}
      <div
        style={{
          position: "relative",
          borderRadius: "18px 18px 0 0",
          backgroundColor: "#161618",
          padding: "12px 12px 0",
          boxShadow:
            "0 20px 50px -10px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
        }}
      >
        {/* Top Bezel Camera Dot */}
        <div
          style={{
            position: "absolute",
            top: "5px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: "#08080a",
            border: "1px solid #2a2a2e",
            zIndex: 10,
          }}
          aria-hidden="true"
        />

        {/* ── Screen Frame ── */}
        <div
          style={{
            position: "relative",
            aspectRatio: "16 / 10",
            backgroundColor: "#000000",
            borderRadius: "8px 8px 0 0",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
          onClick={onScreenClick}
        >
          {/* Optional Top Browser Tab / URL Bar */}
          {urlBarText && (
            <div
              style={{
                height: "28px",
                backgroundColor: "#1e1e22",
                borderBottom: "1px solid #2d2d34",
                display: "flex",
                alignItems: "center",
                padding: "0 12px",
                gap: "8px",
                zIndex: 5,
              }}
            >
              {/* Window Controls (Red, Yellow, Green dots) */}
              <div style={{ display: "flex", gap: "6px" }}>
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: "#ff5f56" }} />
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: "#ffbd2e" }} />
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: "#27c93f" }} />
              </div>

              {/* URL Pill */}
              <div
                style={{
                  flex: 1,
                  maxWidth: "380px",
                  margin: "0 auto",
                  height: "18px",
                  backgroundColor: "#121214",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 8px",
                  color: "#8e8e93",
                  fontSize: "10px",
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                🔒 {urlBarText}
              </div>
            </div>
          )}

          {/* Screen Content: Video Embed, Direct Video, or Screenshot */}
          <div style={{ position: "relative", flex: 1, width: "100%", height: "100%", backgroundColor: "#000" }}>
            {videoEmbedUrl ? (
              <iframe
                src={videoEmbedUrl}
                title={alt}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : videoUrl ? (
              <video
                src={videoUrl}
                poster={imageUrl}
                controls
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : imageUrl ? (
              <SafeImage
                src={imageUrl}
                alt={alt}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6F6F6F",
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "12px",
                }}
              >
                Tidak ada konten preview
              </div>
            )}

            {/* Subtle Screen Reflection Glare */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 40%, rgba(255,255,255,0) 60%)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Laptop Bottom Chassis (Keyboard Base & Hinge Notch) ── */}
      <div
        style={{
          position: "relative",
          height: "16px",
          background: "linear-gradient(180deg, #b0b0b5 0%, #8e8e93 40%, #6e6e73 100%)",
          borderRadius: "0 0 16px 16px",
          boxShadow: "0 12px 30px rgba(0, 0, 0, 0.35)",
        }}
      >
        {/* Center Display Open Notch */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "80px",
            height: "5px",
            backgroundColor: "#3a3a3e",
            borderRadius: "0 0 5px 5px",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Under Laptop Shadow Reflection */}
      <div
        style={{
          position: "absolute",
          left: "5%",
          right: "5%",
          bottom: "-10px",
          height: "12px",
          borderRadius: "50%",
          backgroundColor: "rgba(0, 0, 0, 0.35)",
          filter: "blur(8px)",
          zIndex: -1,
        }}
        aria-hidden="true"
      />
    </div>
  )
}
