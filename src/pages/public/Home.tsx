import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import PublicLayout from "@/layouts/public/PublicLayout"
import { getSupabaseClient } from "@/lib/supabase"
import {
  projects as mockProjects,
  experience as mockExperience,
  skills as mockSkills,
} from "@/data/mockData"
import { sortExperiencesChronological } from "@/pages/admin/Experience"
import {
  normalizeCategory,
  getProjectSubcategory,
  sortProjectsByOrder,
} from "@/types/project"

const supabase = getSupabaseClient()
const HERO_PHOTO_DEFAULT = "/pas_foto.jpg"

export default function Home() {
  const [profile, setProfile] = useState<any>(null)
  const [settings, setSettings] = useState<any>(null)
  const [featured, setFeatured] = useState<any[]>([])
  const [experiences, setExperiences] = useState<any[]>([])
  const [hardSkills, setHardSkills] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [profRes, setRes, projRes, expRes, skillRes] = await Promise.all([
        supabase.from("profiles").select("*").limit(1).single(),
        supabase.from("site_settings").select("*").limit(1).single(),
        supabase
          .from("projects")
          .select("*")
          .eq("featured", true)
          .order("sort_order", { ascending: true }),
        supabase
          .from("experience")
          .select("*")
          .order("start_date", { ascending: true }),
        supabase
          .from("skills")
          .select("*")
          .order("order_index", { ascending: true }),
      ])

      if (profRes.data) setProfile(profRes.data)
      if (setRes.data) setSettings(setRes.data)

      // Fallback to mock projects if database has 0 featured items
      if (projRes.data && projRes.data.length > 0) {
        setFeatured(sortProjectsByOrder(projRes.data))
      } else {
        setFeatured(sortProjectsByOrder(mockProjects.filter((p) => p.featured)))
      }

      // Fallback to mock experiences if database has 0 items
      if (expRes.data && expRes.data.length > 0) {
        const uniqueExp = Array.from(
          new Map(
            expRes.data.map((item: any) => [
              item.organization + item.position,
              item,
            ]),
          ).values(),
        )
        setExperiences(sortExperiencesChronological(uniqueExp))
      } else {
        setExperiences(
          sortExperiencesChronological(
            mockExperience.map((e) => ({
              ...e,
              start_date: e.startDate,
              end_date: e.endDate,
            })),
          ),
        )
      }

      // Skills
      if (skillRes.data && skillRes.data.length > 0) {
        const hs = skillRes.data.filter((s: any) => s.category === "build")
        setHardSkills(hs)
      } else {
        setHardSkills(mockSkills.hard_skill)
      }
    } catch (e) {
      console.warn("Database fetch fallback to local mock data:", e)
      setFeatured(sortProjectsByOrder(mockProjects.filter((p) => p.featured)))
      setExperiences(
        mockExperience.map((e) => ({
          ...e,
          start_date: e.startDate,
          end_date: e.endDate,
        })),
      )
      setHardSkills(mockSkills.hard_skill)
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <PublicLayout>
        <div
          style={{
            backgroundColor: "var(--color-paper)",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            className="font-mono text-xs tracking-widest uppercase"
            style={{ color: "var(--color-muted)" }}
          >
            Memuat...
          </p>
        </div>
      </PublicLayout>
    )
  }

  let heroImage = HERO_PHOTO_DEFAULT
  if (profile?.portrait_url) {
    if (profile.portrait_url.startsWith("{")) {
      try {
        const parsed = JSON.parse(profile.portrait_url)
        if (parsed.home) heroImage = parsed.home
      } catch (e) {}
    } else {
      heroImage = profile.portrait_url
    }
  }

  // Tagline Opsi A: "Crafting Digital Products with Joy."
  const titleText =
    settings?.site_tagline || "Crafting Digital Products | with Joy."
  const titleLines = titleText.split("\n")

  const availabilityText =
    profile?.availability === "open"
      ? "Terbuka untuk Magang"
      : profile?.availability === "freelance"
        ? "Tersedia untuk Freelance"
        : "Sedang Tidak Tersedia"

  const isAvailable =
    profile?.availability === "open" || profile?.availability === "freelance"

  // Dynamic floating badges
  const defaultBadges = [
    { id: "b1", name: "UI/UX Design" },
    { id: "b2", name: "Front-End Web" },
    { id: "b3", name: "Visual Design" },
  ]
  const displayBadges =
    hardSkills.length > 0 ? hardSkills.slice(0, 3) : defaultBadges

  return (
    <PublicLayout>
      <div
        style={{ backgroundColor: "var(--color-paper)", minHeight: "100vh" }}
      >
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-16 min-h-[calc(100vh-80px)] flex flex-col justify-center pt-24 pb-12 relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">
            {/* Left: slogan + intro + stats */}
            <div className="flex-1 min-w-0 w-full max-w-2xl">
              {/* Status badge & Name */}
              <div className="flex flex-col items-start gap-3.5 mb-6">
                <div
                  className="inline-flex items-center gap-2.5 border rounded-full px-4 py-1.5"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                  }}
                >
                  {isAvailable ? (
                    <span
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: "#22c55e" }}
                    />
                  ) : (
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "var(--color-muted)" }}
                    />
                  )}
                  <span
                    className="font-mono text-xs tracking-widest uppercase font-medium"
                    style={{
                      color: "var(--color-ink)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {availabilityText}
                  </span>
                </div>

                <p
                  className="text-sm md:text-base"
                  style={{
                    color: "var(--color-muted)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  <span className="font-normal">Portfolio by</span>{" "}
                  <span
                    className="font-bold"
                    style={{ color: "var(--color-ink)" }}
                  >
                    Muhammad Azizi Abdillah
                  </span>
                </p>
              </div>

              {/* Headline */}
              {(() => {
                const lines = titleText.includes("|")
                  ? titleText.split("|").map((s: string) => s.trim())
                  : titleLines

                return lines.map((line: string, i: number) => {
                  const words = line.split(" ")
                  const shouldItalicizeLast =
                    i === lines.length - 1 && words.length > 1
                  const lastWord = shouldItalicizeLast ? words.pop() : ""
                  const rest = words.join(" ")

                  return (
                    <h1
                      key={i}
                      className="font-sans font-bold leading-none mb-2 reveal"
                      style={{
                        fontSize: "clamp(2.4rem, 5.2vw, 4.5rem)",
                        letterSpacing: "-0.04em",
                        color: "var(--color-ink)",
                        lineHeight: 0.95,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    >
                      {rest}{" "}
                      {shouldItalicizeLast ? (
                        <span
                          style={{
                            fontFamily: "var(--font-serif)",
                            fontStyle: "italic",
                            fontWeight: 400,
                            fontVariationSettings: '"opsz" 72',
                          }}
                        >
                          {lastWord}
                        </span>
                      ) : (
                        <>{lastWord}</>
                      )}
                    </h1>
                  )
                })
              })()}

              {/* Subtitle / Intro */}
              <p
                className="font-sans text-sm md:text-base leading-relaxed mt-5 mb-8 reveal reveal-delay-2"
                style={{
                  color: "var(--color-muted)",
                  maxWidth: "520px",
                  fontWeight: 400,
                  whiteSpace: "pre-line",
                }}
              >
                {profile?.intro ||
                  "Menikmati setiap proses, tumbuh dari setiap tantangan, dan berkarya dengan penuh antusias."}
              </p>

              {/* CTAs (Sederhana & Terfokus: 2 tombol) */}
              <div className="flex flex-wrap items-center gap-3.5 mb-10 reveal reveal-delay-3">
                <Link
                  to="/work"
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-semibold tracking-widest uppercase transition-opacity hover:opacity-85 shadow-sm"
                  style={{
                    backgroundColor: "var(--color-ink)",
                    color: "var(--color-paper)",
                    letterSpacing: "0.1em",
                    borderRadius: "var(--radius-sm)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Lihat Karya →
                </Link>
                <a
                  href="/cv.pdf"
                  download="CV_Muhammad_Azizi_Abdillah.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-semibold tracking-widest uppercase border transition-colors hover:bg-white"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-ink)",
                    letterSpacing: "0.1em",
                    borderRadius: "var(--radius-sm)",
                    fontFamily: "var(--font-mono)",
                  }}
                  title="Unduh CV Terbaru (PDF)"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Unduh CV
                </a>
              </div>

              {/* Stats Bar */}
              <div
                className="flex gap-8 md:gap-14 pt-6 border-t reveal reveal-delay-3"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div>
                  <p
                    className="font-sans font-bold text-xl md:text-2xl mb-0.5"
                    style={{ color: "var(--color-ink)" }}
                  >
                    Informatika
                  </p>
                  <p
                    className="font-mono text-xs"
                    style={{ color: "var(--color-muted)" }}
                  >
                    UNU Yogyakarta
                  </p>
                </div>
                <div>
                  <p
                    className="font-sans font-bold text-xl md:text-2xl mb-0.5"
                    style={{ color: "var(--color-ink)" }}
                  >
                    4+
                  </p>
                  <p
                    className="font-mono text-xs"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Proyek Digital &amp; UI/UX
                  </p>
                </div>
                <div>
                  <p
                    className="font-sans font-bold text-xl md:text-2xl mb-0.5"
                    style={{ color: "var(--color-ink)" }}
                  >
                    3+ Tahun
                  </p>
                  <p
                    className="font-mono text-xs"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Organisasi &amp; Tim Kreatif
                  </p>
                </div>
              </div>
            </div>

            {/* Right: photo with floating badges */}
            <div className="w-full lg:w-auto flex justify-center lg:justify-end reveal reveal-delay-2 mt-6 lg:mt-0">
              <div
                className="relative"
                style={{ width: "100%", maxWidth: "400px" }}
              >
                <div
                  className="relative overflow-hidden z-10"
                  style={{
                    width: "100%",
                    aspectRatio: "3/4",
                    borderRadius: "4px 40px 4px 40px",
                    backgroundColor: "var(--color-border-light)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
                  }}
                >
                  <img
                    src={heroImage}
                    alt="Muhammad Azizi Abdillah"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "top center" }}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent 65%, rgba(10,10,10,0.12) 100%)",
                    }}
                  />
                </div>

                {/* Floating Badges */}
                {displayBadges.map((skill: any, index: number) => {
                  const configs = [
                    {
                      pos: "top-[10%] -right-3 lg:-right-6",
                      anim: { animationDuration: "4s" },
                      color: "#10B981",
                    },
                    {
                      pos: "top-[48%] -left-4 lg:-left-8",
                      anim: { animationDuration: "5s", animationDelay: "1s" },
                      color: "#3B82F6",
                    },
                    {
                      pos: "bottom-[12%] -right-2 lg:-right-4",
                      anim: {
                        animationDuration: "4.5s",
                        animationDelay: "0.5s",
                      },
                      color: "#F59E0B",
                    },
                  ]
                  const conf = configs[index]
                  return (
                    <div
                      key={skill.id || index}
                      className={`absolute ${conf.pos} z-20 animate-bounce`}
                      style={conf.anim}
                    >
                      <div
                        className="flex items-center gap-2 bg-white px-3.5 py-1.5 shadow-md border"
                        style={{
                          borderRadius: "var(--radius-full)",
                          borderColor: "var(--color-border)",
                        }}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: conf.color }}
                        ></span>
                        <span
                          className="font-sans text-xs font-semibold whitespace-nowrap"
                          style={{ color: "var(--color-ink)" }}
                        >
                          {skill.name}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-16">
          <div
            className="h-px"
            style={{ backgroundColor: "var(--color-border)" }}
          />
        </div>

        {/* ── Karya Pilihan ─────────────────────────────────────── */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-16 py-20 md:py-28">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p
                className="font-mono text-xs tracking-widest uppercase mb-1"
                style={{ color: "var(--color-muted)", letterSpacing: "0.14em" }}
              >
                Selected Works
              </p>
              <h2
                className="font-sans font-bold"
                style={{
                  fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                  color: "var(--color-ink)",
                  letterSpacing: "-0.03em",
                }}
              >
                Karya Pilihan
              </h2>
            </div>
            <Link
              to="/work"
              className="link-underline font-mono text-xs tracking-widest uppercase hidden md:block"
              style={{ color: "var(--color-muted)", letterSpacing: "0.12em" }}
            >
              Semua Proyek →
            </Link>
          </div>

          <div className="space-y-0">
            {featured.map((project, i) => (
              <ProjectRow key={project.id || i} project={project} index={i} />
            ))}
          </div>

          <div className="mt-8 md:hidden">
            <Link
              to="/work"
              className="link-underline font-mono text-xs tracking-widest uppercase"
              style={{ color: "var(--color-muted)", letterSpacing: "0.12em" }}
            >
              Semua Proyek →
            </Link>
          </div>
        </section>

        {/* ── Tentang (dark strip) ──────────────────────────────── */}
        <section style={{ backgroundColor: "var(--color-ink)" }}>
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-20 md:py-28 grid md:grid-cols-3 gap-12 md:gap-16">
            {/* Latar Belakang */}
            <div>
              <p
                className="font-mono text-xs tracking-widest uppercase mb-8"
                style={{
                  color: "rgba(247,247,245,0.75)",
                  letterSpacing: "0.14em",
                }}
              >
                Latar Belakang
              </p>

              <div className="mb-6">
                {(() => {
                  const lines = titleText.includes("|")
                    ? titleText.split("|").map((s: string) => s.trim())
                    : titleLines

                  return lines.map((line: string, i: number) => {
                    const words = line.split(" ")
                    const shouldItalicizeLast =
                      i === lines.length - 1 && words.length > 1
                    const lastWord = shouldItalicizeLast ? words.pop() : ""
                    const rest = words.join(" ")

                    return (
                      <h2
                        key={i}
                        className="font-sans font-bold leading-none mb-1"
                        style={{
                          fontSize: "clamp(1.5rem, 3.5vw, 2.75rem)",
                          letterSpacing: "-0.04em",
                          color: "var(--color-paper)",
                          lineHeight: 1,
                        }}
                      >
                        {rest}{" "}
                        {shouldItalicizeLast ? (
                          <span
                            style={{
                              fontFamily: "var(--font-serif)",
                              fontStyle: "italic",
                              fontWeight: 400,
                              fontVariationSettings: '"opsz" 72',
                            }}
                          >
                            {lastWord}
                          </span>
                        ) : (
                          <>{lastWord}</>
                        )}
                      </h2>
                    )
                  })
                })()}
              </div>

              <p
                className="text-sm leading-relaxed mb-10"
                style={{
                  color: "rgba(247,247,245,0.85)",
                  fontFamily: "var(--font-sans)",
                  whiteSpace: "pre-line",
                }}
              >
                {profile?.intro ||
                  "Mahasiswa Informatika yang aktif mendalami UI/UX Design dan Front-End Development. Memiliki latar belakang multimedia yang membentuk pemahaman visual yang kuat — dari layout hingga interaksi fungsional."}
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase link-underline"
                style={{ color: "var(--color-paper)", letterSpacing: "0.1em" }}
              >
                Selengkapnya Tentang Saya →
              </Link>
            </div>

            {/* Pendidikan */}
            <div className="flex flex-col">
              <p
                className="font-mono text-xs tracking-widest uppercase mb-8 md:mb-10"
                style={{
                  color: "rgba(247,247,245,0.75)",
                  letterSpacing: "0.14em",
                }}
              >
                Pendidikan
              </p>
              <div className="flex flex-col gap-0">
                {experiences
                  .filter((e) => e.type === "Education")
                  .map((step, i, arr) => {
                    const dateText = formatExperienceDate(
                      step.start_date,
                      step.end_date,
                    )
                    const badge = getExpBadge(step.type, step.position)
                    return (
                      <div
                        key={step.id || i}
                        className="flex gap-4 items-start"
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className="w-1.5 h-1.5 rounded-full mt-1.5"
                            style={{
                              backgroundColor:
                                i === arr.length - 1
                                  ? "var(--color-paper)"
                                  : "rgba(247,247,245,0.5)",
                            }}
                          />
                          {i < arr.length - 1 && (
                            <div
                              className="w-px flex-1 min-h-12"
                              style={{
                                backgroundColor: "rgba(247,247,245,0.2)",
                              }}
                            />
                          )}
                        </div>
                        <div className="pb-8">
                          <div className="flex items-center gap-2 mb-1">
                            <p
                              className="font-sans font-bold text-sm"
                              style={{ color: "var(--color-paper)" }}
                            >
                              {step.position}
                            </p>
                            <span
                              className="font-mono text-[9px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-semibold"
                              style={{
                                color: badge.color,
                                backgroundColor: badge.bg,
                                borderColor: badge.border,
                              }}
                            >
                              {badge.label}
                            </span>
                          </div>
                          <p
                            className="font-sans text-xs"
                            style={{ color: "rgba(247,247,245,0.85)" }}
                          >
                            {step.organization}
                          </p>
                          <p
                            className="font-mono text-[10px] mt-1.5 tracking-wider"
                            style={{ color: "rgba(247,247,245,0.65)" }}
                          >
                            {dateText}
                          </p>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>

            {/* Pengalaman */}
            <div className="flex flex-col">
              <p
                className="font-mono text-xs tracking-widest uppercase mb-8 md:mb-10"
                style={{
                  color: "rgba(247,247,245,0.75)",
                  letterSpacing: "0.14em",
                }}
              >
                Pengalaman
              </p>
              <div className="flex flex-col gap-0">
                {experiences
                  .filter((e) => e.type !== "Education")
                  .map((step, i, arr) => {
                    const dateText = formatExperienceDate(
                      step.start_date,
                      step.end_date,
                    )
                    const badge = getExpBadge(step.type, step.position)
                    return (
                      <div
                        key={step.id || i}
                        className="flex gap-4 items-start"
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className="w-1.5 h-1.5 rounded-full mt-1.5"
                            style={{
                              backgroundColor:
                                i === arr.length - 1
                                  ? "var(--color-paper)"
                                  : "rgba(247,247,245,0.5)",
                            }}
                          />
                          {i < arr.length - 1 && (
                            <div
                              className="w-px flex-1 min-h-12"
                              style={{
                                backgroundColor: "rgba(247,247,245,0.2)",
                              }}
                            />
                          )}
                        </div>
                        <div className="pb-8">
                          <div className="flex items-center gap-2 mb-1">
                            <p
                              className="font-sans font-bold text-sm"
                              style={{ color: "var(--color-paper)" }}
                            >
                              {step.position}
                            </p>
                            <span
                              className="font-mono text-[9px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-semibold"
                              style={{
                                color: badge.color,
                                backgroundColor: badge.bg,
                                borderColor: badge.border,
                              }}
                            >
                              {badge.label}
                            </span>
                          </div>
                          <p
                            className="font-sans text-xs"
                            style={{ color: "rgba(247,247,245,0.85)" }}
                          >
                            {step.organization}
                          </p>
                          <p
                            className="font-mono text-[10px] mt-1.5 tracking-wider"
                            style={{ color: "rgba(247,247,245,0.65)" }}
                          >
                            {dateText}
                          </p>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────── */}
        <section
          style={{
            backgroundColor: "var(--color-surface)",
            borderTop: `1px solid var(--color-border)`,
            borderBottom: `1px solid var(--color-border)`,
          }}
        >
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-20 md:py-28 text-center">
            <p
              className="font-mono text-xs tracking-widest uppercase mb-5"
              style={{ color: "var(--color-muted)", letterSpacing: "0.14em" }}
            >
              MARI TERHUBUNG
            </p>
            <h2
              className="font-sans font-bold mb-4 uppercase"
              style={{
                fontSize: "clamp(2rem, 6vw, 4.5rem)",
                letterSpacing: "-0.04em",
                color: "var(--color-ink)",
                lineHeight: 0.95,
              }}
            >
              SIAP BERKONTRIBUSI
              <br />
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontVariationSettings: '"opsz" 60',
                }}
              >
                DALAM TIM ANDA.
              </span>
            </h2>
            <p
              className="text-sm md:text-base mb-10 max-w-xl mx-auto"
              style={{
                color: "var(--color-muted)",
                fontFamily: "var(--font-sans)",
              }}
            >
              Menikmati setiap proses, tumbuh dari setiap tantangan, dan siap
              memberikan yang terbaik untuk produk digital Anda.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 text-xs font-semibold tracking-widest uppercase transition-opacity hover:opacity-85 shadow-sm"
                style={{
                  backgroundColor: "var(--color-ink)",
                  color: "var(--color-paper)",
                  letterSpacing: "0.1em",
                  borderRadius: "var(--radius-sm)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                HUBUNGI SAYA →
              </Link>
              <a
                href="/cv.pdf"
                download="CV_Muhammad_Azizi_Abdillah.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 text-xs font-semibold tracking-widest uppercase border transition-colors hover:bg-white"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-ink)",
                  letterSpacing: "0.1em",
                  borderRadius: "var(--radius-sm)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                DOWNLOAD CV (PDF)
              </a>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}

function ProjectRow({ project, index }: { project: any; index: number }) {
  const tags = Array.isArray(project.tags)
    ? project.tags
    : typeof project.tags === "string"
      ? project.tags.split(",")
      : []

  const projectCover = project.cover_url || project.cover || ""
  const canonicalCategory = normalizeCategory(project.category)
  const subcategory = getProjectSubcategory(project)

  return (
    <Link
      to={`/work/${project.slug}`}
      className="project-card group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 py-6 sm:py-8 border-t transition-colors"
      style={{ borderColor: "var(--color-border)" }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor = "var(--color-surface)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = "transparent")
      }
    >
      <span
        className="font-mono text-xs shrink-0"
        style={{
          color: "var(--color-muted)",
          letterSpacing: "0.06em",
          width: "2.5rem",
        }}
      >
        0{index + 1}
      </span>

      <div
        className="w-full sm:w-44 shrink-0 overflow-hidden"
        style={{
          height: "6.5rem",
          backgroundColor: "var(--color-border-light)",
          borderRadius: "var(--radius-md)",
        }}
      >
        {projectCover ? (
          <img
            src={projectCover}
            alt={project.title}
            className="project-image w-full h-full object-cover transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs font-mono text-gray-400">
            No Image
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
          <span
            className="font-mono text-[10px] uppercase font-semibold px-2 py-0.5 border rounded"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-ink)",
              backgroundColor: "#FFFFFF",
            }}
          >
            {canonicalCategory}
          </span>
          {subcategory && (
            <span
              className="font-mono text-[10px] font-medium px-2 py-0.5 rounded"
              style={{ backgroundColor: "#EAEAE6", color: "var(--color-ink)" }}
            >
              {subcategory}
            </span>
          )}
          {project.video_url && (
            <span className="font-mono text-[10px] text-red-600 font-bold px-1.5 py-0.5 bg-red-50 rounded">
              ▶ Video
            </span>
          )}
        </div>

        <h3
          className="font-sans font-bold text-lg sm:text-xl mb-1 group-hover:text-black transition-colors"
          style={{ color: "var(--color-ink)", letterSpacing: "-0.02em" }}
        >
          {project.title}
        </h3>
        <p
          className="text-sm mb-3 line-clamp-1"
          style={{
            color: "var(--color-muted)",
            fontFamily: "var(--font-sans)",
          }}
        >
          {project.subtitle || project.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 4).map((tag: string) => (
            <span
              key={tag}
              className="font-mono text-xs px-2 py-0.5 border"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-muted)",
                borderRadius: "var(--radius-sm)",
                letterSpacing: "0.04em",
              }}
            >
              {tag.trim()}
            </span>
          ))}
        </div>
      </div>

      <div
        className="shrink-0 font-mono text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"
        style={{ color: "var(--color-muted)" }}
      >
        Lihat →
      </div>
    </Link>
  )
}

function formatExperienceDate(startDate?: string, endDate?: string | null) {
  if (!startDate) return ""

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ]

  const formatDatePart = (dStr: string) => {
    if (!dStr) return ""
    const parts = dStr.split("-")
    if (parts.length >= 2) {
      const y = parts[0]
      const mIdx = parseInt(parts[1], 10) - 1
      const mName = months[mIdx] || ""
      return mName ? `${mName} ${y}` : y
    }
    return dStr
  }

  const startFormatted = formatDatePart(startDate)
  const endFormatted = endDate ? formatDatePart(endDate) : "SEKARANG"

  if (startFormatted === endFormatted) return startFormatted
  return `${startFormatted} — ${endFormatted}`
}

function getExpBadge(type: string, position?: string) {
  const t = type?.toLowerCase() || ""
  const pos = position?.toLowerCase() || ""

  if (t === "education" || t === "pendidikan") {
    return {
      label: "Pendidikan",
      color: "#60a5fa",
      bg: "rgba(59,130,246,0.15)",
      border: "rgba(59,130,246,0.35)",
    }
  }
  if (
    t === "project" ||
    t === "internship" ||
    t === "magang" ||
    pos.includes("magang") ||
    pos.includes("intern") ||
    pos.includes("produser") ||
    pos.includes("prakerin")
  ) {
    return {
      label: "Magang",
      color: "#4ade80",
      bg: "rgba(34,197,94,0.15)",
      border: "rgba(34,197,94,0.35)",
    }
  }
  if (
    t === "freelance" ||
    t === "organization" ||
    t === "organisasi" ||
    pos.includes("ketua") ||
    pos.includes("koor") ||
    pos.includes("wakil")
  ) {
    return {
      label: "Organisasi",
      color: "#fbbf24",
      bg: "rgba(245,158,11,0.15)",
      border: "rgba(245,158,11,0.35)",
    }
  }
  if (t === "work" || t === "pekerjaan") {
    return {
      label: "Pekerjaan",
      color: "#c084fc",
      bg: "rgba(168,85,247,0.15)",
      border: "rgba(168,85,247,0.35)",
    }
  }
  return {
    label: type || "Pengalaman",
    color: "rgba(247,247,245,0.7)",
    bg: "rgba(247,247,245,0.1)",
    border: "rgba(247,247,245,0.2)",
  }
}
