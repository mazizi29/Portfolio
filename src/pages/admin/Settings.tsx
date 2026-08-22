import { useState, useEffect } from "react"
import AdminLayout from "@/layouts/admin/AdminLayout"
import { getSupabaseClient } from "@/lib/supabase"
import { uploadImage } from "@/lib/upload"

const supabase = getSupabaseClient()

export default function Settings() {
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingHome, setUploadingHome] = useState(false)
  const [uploadingAbout, setUploadingAbout] = useState(false)

  const [form, setForm] = useState({
    // Profile (profiles table)
    profile_id: "",
    display_name: "Muhammad Azizi Abdillah",
    role_title: "Informatics Student & UI/UX Designer",
    intro:
      "Mahasiswa Informatika Universitas Nahdlatul Ulama’ Yogyakarta yang aktif mendalami UI/UX Design dan Front-End Development. Memiliki latar belakang multimedia yang membentuk pemahaman visual yang kuat — dari perancangan antarmuka hingga implementasi kode yang fungsional. Terbiasa bekerja secara terstruktur, kolaboratif, serta berorientasi pada kemudahan pengguna.",
    location: "Yogyakarta, Indonesia",
    availability: "open",
    home_image_url: "/pas_foto.jpg",
    about_image_url: "/pas_foto.jpg",

    // Site Settings (site_settings table)
    site_title: "Portfolio",
    site_tagline: "Crafting Digital Products with Joy.",
    meta_description:
      "Portofolio UI/UX Designer & Front-End Developer Muhammad Azizi Abdillah. Mahasiswa Informatika UNU Yogyakarta.",
    contact_email: "aziziabdillah01@gmail.com",
  })

  useEffect(() => {
    fetchUnifiedData()
  }, [])

  const fetchUnifiedData = async () => {
    setLoading(true)
    try {
      const [profRes, setRes] = await Promise.all([
        supabase.from("profiles").select("*").limit(1).single(),
        supabase.from("site_settings").select("*").eq("id", 1).single(),
      ])

      let homeImg = "/pas_foto.jpg"
      let aboutImg = "/pas_foto.jpg"
      let profId = ""
      let dName = form.display_name
      let rTitle = form.role_title
      let dIntro = form.intro
      let dLoc = form.location
      let dAvail = form.availability
      let dEmail = form.contact_email

      if (profRes.data) {
        profId = profRes.data.id || ""
        dName = profRes.data.display_name || dName
        rTitle = profRes.data.title || rTitle
        dIntro = profRes.data.intro || dIntro
        dLoc = profRes.data.location || dLoc
        dAvail = profRes.data.availability || dAvail
        dEmail = profRes.data.email || dEmail

        if (profRes.data.portrait_url) {
          if (profRes.data.portrait_url.startsWith("{")) {
            try {
              const parsed = JSON.parse(profRes.data.portrait_url)
              homeImg = parsed.home || homeImg
              aboutImg = parsed.about || aboutImg
            } catch (e) {}
          } else {
            homeImg = profRes.data.portrait_url
            aboutImg = profRes.data.portrait_url
          }
        }
      }

      let sTitle = form.site_title
      let sTagline = form.site_tagline
      let sMeta = form.meta_description

      if (setRes.data) {
        sTitle = setRes.data.site_title || sTitle
        sTagline = setRes.data.site_tagline || sTagline
        sMeta = setRes.data.meta_description || sMeta
        if (setRes.data.contact_email) dEmail = setRes.data.contact_email
        if (setRes.data.open_internship !== undefined) {
          dAvail = setRes.data.open_internship ? "open" : "busy"
        }
      }

      setForm({
        profile_id: profId,
        display_name: dName,
        role_title: rTitle,
        intro: dIntro,
        location: dLoc,
        availability: dAvail,
        home_image_url: homeImg,
        about_image_url: aboutImg,
        site_title: sTitle,
        site_tagline: sTagline,
        meta_description: sMeta,
        contact_email: dEmail,
      })
    } catch (err) {
      console.error("Error fetching unified settings:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "home_image_url" | "about_image_url",
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (field === "home_image_url") setUploadingHome(true)
    else setUploadingAbout(true)

    const { url, error } = await uploadImage(file)

    if (field === "home_image_url") setUploadingHome(false)
    else setUploadingAbout(false)

    if (error) {
      alert(`Gagal mengunggah foto: ${error}`)
    } else if (url) {
      setForm((prev) => ({ ...prev, [field]: url }))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const portraitJson = JSON.stringify({
        home: form.home_image_url,
        about: form.about_image_url,
      })

      // 1. Save Profile
      if (form.profile_id) {
        await supabase
          .from("profiles")
          .update({
            display_name: form.display_name,
            title: form.role_title,
            intro: form.intro,
            location: form.location,
            availability: form.availability,
            email: form.contact_email,
            portrait_url: portraitJson,
            updated_at: new Date().toISOString(),
          })
          .eq("id", form.profile_id)
      } else {
        const { data: newProf } = await supabase
          .from("profiles")
          .insert({
            display_name: form.display_name,
            title: form.role_title,
            intro: form.intro,
            location: form.location,
            availability: form.availability,
            email: form.contact_email,
            portrait_url: portraitJson,
          })
          .select()
          .single()

        if (newProf) {
          setForm((prev) => ({ ...prev, profile_id: newProf.id }))
        }
      }

      // 2. Save Site Settings
      await supabase.from("site_settings").upsert({
        id: 1,
        site_title: form.site_title,
        site_tagline: form.site_tagline,
        meta_description: form.meta_description,
        open_internship: form.availability === "open",
        contact_email: form.contact_email,
        updated_at: new Date().toISOString(),
      })

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      console.error("Error saving settings:", err)
      alert(`Gagal menyimpan pengaturan: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title="Profil & Pengaturan">
      <div className="max-w-4xl mx-auto pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2
              className="font-sans font-semibold text-2xl"
              style={{ color: "var(--color-ink)", letterSpacing: "-0.02em" }}
            >
              Profil &amp; Pengaturan
            </h2>
            <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
              Kelola informasi profil, bio tentang saya, status magang, dan foto
              tampilan website.
            </p>
          </div>

          {saved && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Perubahan Disimpan!
            </span>
          )}
        </div>

        {loading ? (
          <div
            className="py-16 text-center text-sm"
            style={{ color: "var(--color-muted)" }}
          >
            Memuat data profil &amp; pengaturan...
          </div>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-8">
            {/* 1. IDENTITAS & HEADLINE */}
            <div
              className="border p-6 md:p-8"
              style={{
                borderColor: "var(--color-border)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-surface)",
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <h3
                  className="font-mono text-xs tracking-widest uppercase font-semibold"
                  style={{ color: "var(--color-ink)", letterSpacing: "0.12em" }}
                >
                  Identitas &amp; Headline Hero
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-mono text-xs tracking-wider uppercase"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={form.display_name}
                    onChange={(e) =>
                      setForm({ ...form, display_name: e.target.value })
                    }
                    placeholder="Muhammad Azizi Abdillah"
                    className="px-3.5 py-2.5 text-sm border bg-transparent outline-none font-medium"
                    style={{
                      borderColor: "var(--color-border)",
                      color: "var(--color-ink)",
                      borderRadius: "var(--radius-sm)",
                    }}
                  />
                  <p
                    className="text-[11px] mt-0.5"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Nama yang tampil di halaman Beranda &amp; Tentang.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-mono text-xs tracking-wider uppercase"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Peran / Bidang Keahlian (Sub-headline)
                  </label>
                  <input
                    type="text"
                    value={form.role_title}
                    onChange={(e) =>
                      setForm({ ...form, role_title: e.target.value })
                    }
                    placeholder="Mahasiswa Informatika | UI/UX & Front-End"
                    className="px-3.5 py-2.5 text-sm border bg-transparent outline-none"
                    style={{
                      borderColor: "var(--color-border)",
                      color: "var(--color-ink)",
                      borderRadius: "var(--radius-sm)",
                    }}
                  />
                  <p
                    className="text-[11px] mt-0.5"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Tampil di bawah nama pada halaman Tentang Saya.
                  </p>
                </div>

                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label
                    className="font-mono text-xs tracking-wider uppercase"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Tagline Hero Beranda (Slogan Utama)
                  </label>
                  <input
                    type="text"
                    value={form.site_tagline}
                    onChange={(e) =>
                      setForm({ ...form, site_tagline: e.target.value })
                    }
                    placeholder="Crafting Digital Products with Joy."
                    className="px-3.5 py-2.5 text-sm border bg-transparent outline-none font-medium"
                    style={{
                      borderColor: "var(--color-border)",
                      color: "var(--color-ink)",
                      borderRadius: "var(--radius-sm)",
                    }}
                  />
                  <p
                    className="text-[11px] mt-0.5"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Tampil sebagai headline besar di bagian paling atas halaman
                    Beranda.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. KETERSEDIAAN, KONTAK, & LOKASI */}
            <div
              className="border p-6 md:p-8"
              style={{
                borderColor: "var(--color-border)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-surface)",
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <h3
                  className="font-mono text-xs tracking-widest uppercase font-semibold"
                  style={{ color: "var(--color-ink)", letterSpacing: "0.12em" }}
                >
                  Ketersediaan &amp; Kontak
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-mono text-xs tracking-wider uppercase"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Status Ketersediaan Magang / Kerja
                  </label>
                  <select
                    value={form.availability}
                    onChange={(e) =>
                      setForm({ ...form, availability: e.target.value })
                    }
                    className="px-3.5 py-2.5 text-sm border bg-transparent outline-none"
                    style={{
                      borderColor: "var(--color-border)",
                      color: "var(--color-ink)",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    <option value="open">● Terbuka untuk Magang</option>
                    <option value="freelance">
                      ● Tersedia untuk Freelance
                    </option>
                    <option value="busy">○ Sedang Tidak Tersedia</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-mono text-xs tracking-wider uppercase"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Email Kontak
                  </label>
                  <input
                    type="email"
                    value={form.contact_email}
                    onChange={(e) =>
                      setForm({ ...form, contact_email: e.target.value })
                    }
                    className="px-3.5 py-2.5 text-sm border bg-transparent outline-none"
                    style={{
                      borderColor: "var(--color-border)",
                      color: "var(--color-ink)",
                      borderRadius: "var(--radius-sm)",
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-mono text-xs tracking-wider uppercase"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Lokasi Domisili
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    className="px-3.5 py-2.5 text-sm border bg-transparent outline-none"
                    style={{
                      borderColor: "var(--color-border)",
                      color: "var(--color-ink)",
                      borderRadius: "var(--radius-sm)",
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-mono text-xs tracking-wider uppercase"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Judul Tab Browser (Site Title)
                  </label>
                  <input
                    type="text"
                    value={form.site_title}
                    onChange={(e) =>
                      setForm({ ...form, site_title: e.target.value })
                    }
                    className="px-3.5 py-2.5 text-sm border bg-transparent outline-none"
                    style={{
                      borderColor: "var(--color-border)",
                      color: "var(--color-ink)",
                      borderRadius: "var(--radius-sm)",
                    }}
                  />
                </div>

                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label
                    className="font-mono text-xs tracking-wider uppercase"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Meta Deskripsi SEO (Preview Google &amp; WhatsApp)
                  </label>
                  <input
                    type="text"
                    value={form.meta_description}
                    onChange={(e) =>
                      setForm({ ...form, meta_description: e.target.value })
                    }
                    className="px-3.5 py-2.5 text-sm border bg-transparent outline-none"
                    style={{
                      borderColor: "var(--color-border)",
                      color: "var(--color-ink)",
                      borderRadius: "var(--radius-sm)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 3. BIO / TENTANG SAYA */}
            <div
              className="border p-6 md:p-8"
              style={{
                borderColor: "var(--color-border)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-surface)",
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-purple-600" />
                <h3
                  className="font-mono text-xs tracking-widest uppercase font-semibold"
                  style={{ color: "var(--color-ink)", letterSpacing: "0.12em" }}
                >
                  Narasi Bio / Tentang Saya
                </h3>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  className="font-mono text-xs tracking-wider uppercase"
                  style={{ color: "var(--color-muted)" }}
                >
                  Paragraf Pengantar &amp; Perjalanan Belajar
                </label>
                <textarea
                  rows={5}
                  value={form.intro}
                  onChange={(e) => setForm({ ...form, intro: e.target.value })}
                  className="px-3.5 py-3 text-sm border bg-transparent outline-none leading-relaxed"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-ink)",
                    borderRadius: "var(--radius-sm)",
                  }}
                />
                <p
                  className="text-[11px] mt-0.5"
                  style={{ color: "var(--color-muted)" }}
                >
                  Paragraf ini tampil di bagian Hero Beranda dan di halaman
                  Tentang Saya.
                </p>
              </div>
            </div>

            {/* 4. FOTO PROFIL & VISUAL */}
            <div
              className="border p-6 md:p-8"
              style={{
                borderColor: "var(--color-border)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-surface)",
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                <h3
                  className="font-mono text-xs tracking-widest uppercase font-semibold"
                  style={{ color: "var(--color-ink)", letterSpacing: "0.12em" }}
                >
                  Foto Profil &amp; Visual
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Foto Hero Beranda */}
                <div className="flex flex-col gap-3">
                  <span
                    className="font-mono text-xs font-semibold tracking-wider uppercase"
                    style={{ color: "var(--color-ink)" }}
                  >
                    Foto Hero (Beranda)
                  </span>
                  <div
                    className="w-full h-56 overflow-hidden relative border flex items-center justify-center bg-gray-50"
                    style={{
                      borderColor: "var(--color-border)",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    {form.home_image_url ? (
                      <img
                        src={form.home_image_url}
                        alt="Hero"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-mono text-gray-400">
                        Belum ada foto
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <label
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-semibold uppercase border bg-white hover:bg-gray-50 transition-colors"
                      style={{
                        borderColor: "var(--color-border)",
                        borderRadius: "var(--radius-sm)",
                      }}
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
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      {uploadingHome ? "Mengunggah..." : "Upload Foto Hero"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "home_image_url")}
                        disabled={uploadingHome}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={form.home_image_url}
                    onChange={(e) =>
                      setForm({ ...form, home_image_url: e.target.value })
                    }
                    placeholder="URL Foto Hero"
                    className="px-3 py-1.5 text-xs font-mono border bg-transparent outline-none"
                    style={{
                      borderColor: "var(--color-border)",
                      color: "var(--color-muted)",
                      borderRadius: "var(--radius-sm)",
                    }}
                  />
                </div>

                {/* Foto Halaman Tentang */}
                <div className="flex flex-col gap-3">
                  <span
                    className="font-mono text-xs font-semibold tracking-wider uppercase"
                    style={{ color: "var(--color-ink)" }}
                  >
                    Foto Halaman Tentang
                  </span>
                  <div
                    className="w-full h-56 overflow-hidden relative border flex items-center justify-center bg-gray-50"
                    style={{
                      borderColor: "var(--color-border)",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    {form.about_image_url ? (
                      <img
                        src={form.about_image_url}
                        alt="About"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-mono text-gray-400">
                        Belum ada foto
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <label
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-semibold uppercase border bg-white hover:bg-gray-50 transition-colors"
                      style={{
                        borderColor: "var(--color-border)",
                        borderRadius: "var(--radius-sm)",
                      }}
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
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      {uploadingAbout ? "Mengunggah..." : "Upload Foto Tentang"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageUpload(e, "about_image_url")
                        }
                        disabled={uploadingAbout}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={form.about_image_url}
                    onChange={(e) =>
                      setForm({ ...form, about_image_url: e.target.value })
                    }
                    placeholder="URL Foto Tentang"
                    className="px-3 py-1.5 text-xs font-mono border bg-transparent outline-none"
                    style={{
                      borderColor: "var(--color-border)",
                      color: "var(--color-muted)",
                      borderRadius: "var(--radius-sm)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* BUTTON SIMPAN */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                Perubahan akan langsung disinkronkan ke halaman Beranda,
                Tentang, dan Kontak.
              </p>
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3.5 text-xs font-semibold tracking-widest uppercase disabled:opacity-50 transition-opacity hover:opacity-85 shadow-sm"
                style={{
                  backgroundColor: "var(--color-ink)",
                  color: "var(--color-paper)",
                  letterSpacing: "0.1em",
                  borderRadius: "var(--radius-sm)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {saving ? "Menyimpan..." : "Simpan Semua Perubahan"}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  )
}
