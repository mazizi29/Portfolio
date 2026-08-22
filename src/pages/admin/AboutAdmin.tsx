import { useState, useEffect } from "react"
import AdminLayout from "@/layouts/admin/AdminLayout"
import { getSupabaseClient } from "@/lib/supabase"
import { uploadImage } from "@/lib/upload"

const supabase = getSupabaseClient()

export default function AboutAdmin() {
  const [form, setForm] = useState({
    id: "", // uuid from database
    title: "",
    intro: "",
    display_name: "Portfolio User",
    location: "",
    availability: "open",
    email: "",
    home_image_url: "",
    about_image_url: "",
  })

  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .limit(1)
      .single()

    if (data) {
      let homeImg = ""
      let aboutImg = ""
      if (data.portrait_url) {
        if (data.portrait_url.startsWith("{")) {
          try {
            const parsed = JSON.parse(data.portrait_url)
            homeImg = parsed.home || ""
            aboutImg = parsed.about || ""
          } catch (e) {}
        } else {
          homeImg = data.portrait_url
          aboutImg = data.portrait_url
        }
      }

      setForm({
        id: data.id,
        title: data.title,
        intro: data.intro,
        display_name: data.display_name,
        location: data.location,
        availability: data.availability,
        email: data.email,
        home_image_url: homeImg,
        about_image_url: aboutImg,
      })
    } else if (error && error.code !== "PGRST116") {
      console.error("Error fetching profile:", error)
    }
    setLoading(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    // Jika belum ada profile, buat satu. Jika ada, update.
    const portraitJson = JSON.stringify({
      home: form.home_image_url,
      about: form.about_image_url,
    })

    let res
    if (form.id) {
      res = await supabase
        .from("profiles")
        .update({
          title: form.title,
          intro: form.intro,
          display_name: form.display_name,
          location: form.location,
          availability: form.availability,
          email: form.email,
          portrait_url: portraitJson,
          updated_at: new Date().toISOString(),
        })
        .eq("id", form.id)
    } else {
      res = await supabase
        .from("profiles")
        .insert({
          title: form.title,
          intro: form.intro,
          display_name: form.display_name,
          location: form.location,
          availability: form.availability,
          email: form.email,
          portrait_url: portraitJson,
        })
        .select()
        .single()

      if (res.data) setForm({ ...form, id: res.data.id })
    }

    setSaving(false)

    if (res.error) {
      console.error("Error saving profile:", res.error)
      alert("Gagal menyimpan profil: " + res.error.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const inp = (label: string, key: keyof typeof form, type = "text") => (
    <div className="flex flex-col gap-1.5">
      <label
        className="font-mono text-xs tracking-widest uppercase"
        style={{ color: "var(--color-muted)", letterSpacing: "0.1em" }}
      >
        {label}
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        disabled={saving}
        className="w-full px-4 py-2.5 text-sm border bg-transparent outline-none disabled:opacity-50"
        style={{
          borderColor: "var(--color-border)",
          color: "var(--color-ink)",
          borderRadius: "var(--radius-md)",
          fontFamily: "var(--font-sans)",
        }}
      />
    </div>
  )

  return (
    <AdminLayout title="About">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2
            className="font-sans font-semibold text-xl"
            style={{ color: "var(--color-ink)", letterSpacing: "-0.02em" }}
          >
            About Section
          </h2>
        </div>

        {loading ? (
          <div
            className="py-12 text-center text-sm"
            style={{ color: "var(--color-muted)" }}
          >
            Memuat data profil...
          </div>
        ) : (
          <form onSubmit={handleSave} className="grid grid-cols-1 gap-6">
            {inp("Display Name", "display_name")}
            {inp("Headline (Title)", "title")}

            <div className="flex flex-col gap-1.5">
              <label
                className="font-mono text-xs tracking-widest uppercase"
                style={{ color: "var(--color-muted)", letterSpacing: "0.1em" }}
              >
                Biography (Intro)
              </label>
              <textarea
                rows={4}
                value={form.intro}
                onChange={(e) => setForm({ ...form, intro: e.target.value })}
                disabled={saving}
                className="w-full px-4 py-2.5 text-sm border bg-transparent outline-none resize-none disabled:opacity-50"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-ink)",
                  borderRadius: "var(--radius-md)",
                  fontFamily: "var(--font-sans)",
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {inp("Email", "email", "email")}
              {inp("Location", "location")}
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="font-mono text-xs tracking-widest uppercase"
                style={{ color: "var(--color-muted)", letterSpacing: "0.1em" }}
              >
                Hero Photo URL (Beranda)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.home_image_url}
                  onChange={(e) =>
                    setForm({ ...form, home_image_url: e.target.value })
                  }
                  disabled={saving}
                  placeholder="https://..."
                  className="flex-1 px-4 py-2.5 text-sm border bg-transparent outline-none disabled:opacity-50"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-ink)",
                    borderRadius: "var(--radius-md)",
                    fontFamily: "var(--font-sans)",
                  }}
                />
                <label
                  className="px-4 py-2.5 text-xs font-semibold tracking-widest uppercase cursor-pointer flex items-center justify-center shrink-0 disabled:opacity-50"
                  style={{
                    backgroundColor: "var(--color-border)",
                    color: "var(--color-ink)",
                    letterSpacing: "0.05em",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={saving}
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const { url, error } = await uploadImage(file)
                      if (error || !url) alert("Gagal upload: " + error)
                      else setForm({ ...form, home_image_url: url })
                      e.target.value = ""
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label
                className="font-mono text-xs tracking-widest uppercase"
                style={{ color: "var(--color-muted)", letterSpacing: "0.1em" }}
              >
                About Photo URL (Tentang)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.about_image_url}
                  onChange={(e) =>
                    setForm({ ...form, about_image_url: e.target.value })
                  }
                  disabled={saving}
                  placeholder="https://..."
                  className="flex-1 px-4 py-2.5 text-sm border bg-transparent outline-none disabled:opacity-50"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-ink)",
                    borderRadius: "var(--radius-md)",
                    fontFamily: "var(--font-sans)",
                  }}
                />
                <label
                  className="px-4 py-2.5 text-xs font-semibold tracking-widest uppercase cursor-pointer flex items-center justify-center shrink-0 disabled:opacity-50"
                  style={{
                    backgroundColor: "var(--color-border)",
                    color: "var(--color-ink)",
                    letterSpacing: "0.05em",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={saving}
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const { url, error } = await uploadImage(file)
                      if (error || !url) alert("Gagal upload: " + error)
                      else setForm({ ...form, about_image_url: url })
                      e.target.value = ""
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="font-mono text-xs tracking-widest uppercase"
                style={{ color: "var(--color-muted)", letterSpacing: "0.1em" }}
              >
                Availability Status
              </label>
              <select
                value={form.availability}
                onChange={(e) =>
                  setForm({ ...form, availability: e.target.value })
                }
                disabled={saving}
                className="w-full px-4 py-2.5 text-sm border bg-transparent outline-none disabled:opacity-50"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-ink)",
                  borderRadius: "var(--radius-md)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                <option value="open">Terbuka untuk Magang</option>
                <option value="freelance">Tersedia untuk Freelance</option>
                <option value="busy">Sedang Tidak Tersedia</option>
              </select>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 text-xs font-semibold tracking-widest uppercase disabled:opacity-50"
                style={{
                  backgroundColor: "var(--color-ink)",
                  color: "var(--color-paper)",
                  letterSpacing: "0.1em",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
              {saved && (
                <p
                  className="font-mono text-xs"
                  style={{ color: "var(--color-muted)" }}
                >
                  Saved ✓
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  )
}
