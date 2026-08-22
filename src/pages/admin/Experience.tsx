import { useState, useEffect } from "react"
import AdminLayout from "@/layouts/admin/AdminLayout"
import { getSupabaseClient } from "@/lib/supabase"

const supabase = getSupabaseClient()

export interface Exp {
  id: string
  sort_order: number
  organization: string
  position: string
  type: "Education" | "Work" | "Internship" | "Organization" | "Freelance" | "Project"
  start_date: string
  end_date: string | null
  description: string
  skills: string[]
  status: "active" | "completed"
}

export default function AdminExperience() {
  const [items, setItems] = useState<Exp[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Exp | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchExperience()
  }, [])

  const fetchExperience = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .order("start_date", { ascending: true })

    if (error) {
      console.error("Error fetching experience:", error)
    } else {
      setItems(sortExperiencesChronological(data || []))
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("experience").delete().eq("id", id)
    if (error) {
      console.error("Error deleting experience:", error)
      alert("Gagal menghapus pengalaman.")
    } else {
      setItems((prev) => prev.filter((e) => e.id !== id))
    }
  }

  const handleSave = async (data: Partial<Exp>) => {
    setLoading(true)
    try {
      // Map to valid PostgreSQL check constraint values:
      // Education -> Education
      // Internship -> Project
      // Organization -> Freelance
      // Work -> Work
      const safeType =
        data.type === "Internship"
          ? "Project"
          : data.type === "Organization"
            ? "Freelance"
            : data.type || "Work"

      if (editing) {
        const { error, data: updatedData } = await supabase
          .from("experience")
          .update({
            ...data,
            type: safeType,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editing.id)
          .select()
          .single()

        if (error) throw error
        setItems((prev) =>
          sortExperiencesChronological(
            prev.map((e) => (e.id === editing.id ? updatedData : e)),
          ),
        )
      } else {
        const { error, data: insertedData } = await supabase
          .from("experience")
          .insert({
            organization: data.organization || "",
            position: data.position || "",
            type: safeType,
            start_date:
              data.start_date || new Date().toISOString().slice(0, 10),
            end_date: data.end_date || null,
            description: data.description || "",
            skills: [],
            status: "active",
          })
          .select()
          .single()

        if (error) throw error
        if (insertedData) {
          setItems((prev) =>
            sortExperiencesChronological([insertedData, ...prev]),
          )
        }
      }
      setShowForm(false)
      setEditing(null)
    } catch (err: any) {
      console.error("Error saving experience:", err)
      alert(`Gagal menyimpan: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout title="Experience">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2
            className="font-sans font-semibold text-xl"
            style={{ color: "var(--color-ink)", letterSpacing: "-0.02em" }}
          >
            Experience & Education
          </h2>
          <button
            onClick={() => {
              setEditing(null)
              setShowForm(true)
            }}
            disabled={loading}
            className="px-5 py-2.5 text-xs font-semibold tracking-widest uppercase disabled:opacity-50"
            style={{
              backgroundColor: "var(--color-ink)",
              color: "var(--color-paper)",
              letterSpacing: "0.1em",
              borderRadius: "var(--radius-sm)",
            }}
          >
            + Add Entry
          </button>
        </div>

        {showForm && (
          <div
            className="border p-6 mb-6"
            style={{
              borderColor: "var(--color-border)",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--color-surface)",
            }}
          >
            <ExpForm
              item={editing}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false)
                setEditing(null)
              }}
              loading={loading}
            />
          </div>
        )}

        {loading ? (
          <div
            className="py-12 text-center text-sm"
            style={{ color: "var(--color-muted)" }}
          >
            Memuat data...
          </div>
        ) : items.length === 0 ? (
          <div
            className="py-12 text-center text-sm border"
            style={{
              borderColor: "var(--color-border)",
              borderRadius: "var(--radius-md)",
              color: "var(--color-muted)",
            }}
          >
            Belum ada entri pengalaman.
          </div>
        ) : (
          <div
            className="border overflow-hidden"
            style={{
              borderColor: "var(--color-border)",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--color-surface)",
            }}
          >
            {items.map((exp) => {
              const badge = getExperienceBadge(exp.type)
              return (
                <div
                  key={exp.id}
                  className="flex items-start gap-6 px-6 py-5 border-b last:border-0"
                  style={{ borderColor: "var(--color-border-light)" }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p
                        className="text-sm font-medium"
                        style={{ color: "var(--color-ink)" }}
                      >
                        {exp.position}
                      </p>
                      <span
                        className="font-mono text-[10px] px-2 py-0.5 rounded-full border tracking-wider font-semibold"
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
                      className="text-xs mb-2"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {exp.organization} · {exp.start_date} —{" "}
                      {exp.end_date || "Present"}
                    </p>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {exp.description}
                    </p>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <button
                      onClick={() => {
                        setEditing(exp)
                        setShowForm(true)
                      }}
                      className="font-mono text-xs link-underline"
                      style={{ color: "var(--color-muted)" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="font-mono text-xs"
                      style={{ color: "#c0392b" }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export function getExperienceBadge(type: string) {
  switch (type) {
    case "Education":
      return {
        label: "🔵 Pendidikan",
        color: "#1d4ed8",
        bg: "#eff6ff",
        border: "#bfdbfe",
      }
    case "Project":
    case "Internship":
      return {
        label: "🟢 Magang",
        color: "#15803d",
        bg: "#f0fdf4",
        border: "#bbf7d0",
      }
    case "Freelance":
    case "Organization":
      return {
        label: "🟡 Organisasi",
        color: "#b45309",
        bg: "#fffbeb",
        border: "#fde68a",
      }
    case "Work":
    default:
      return {
        label: "🟣 Pekerjaan",
        color: "#7e22ce",
        bg: "#faf5ff",
        border: "#e9d5ff",
      }
  }
}

export function sortExperiencesChronological(items: any[]): any[] {
  const isOngoing = (item: any) => {
    const end = item.end_date || item.endDate
    return (
      !end ||
      end === "present" ||
      end === "sekarang" ||
      end === "Sekarang" ||
      end === "SEKARANG"
    )
  }

  const parseDate = (d?: string | null) => {
    if (!d) return 0
    const parts = String(d).split("-")
    const year = parseInt(parts[0], 10) || 0
    const month = parseInt(parts[1], 10) || 1
    const day = parseInt(parts[2], 10) || 1
    return new Date(year, month - 1, day).getTime()
  }

  return [...items].sort((a, b) => {
    const ongoingA = isOngoing(a)
    const ongoingB = isOngoing(b)

    // Pengalaman yang masih berjalan (sampai sekarang) SELALU ditempatkan paling bawah
    if (!ongoingA && ongoingB) return -1
    if (ongoingA && !ongoingB) return 1

    if (!ongoingA && !ongoingB) {
      // Sesama yang sudah selesai: urutkan dari yang selesai lebih dulu ke yang selesai belakangan
      const endA = parseDate(a.end_date || a.endDate)
      const endB = parseDate(b.end_date || b.endDate)
      if (endA !== endB) {
        return endA - endB
      }
      const startA = parseDate(a.start_date || a.startDate)
      const startB = parseDate(b.start_date || b.startDate)
      if (startA !== startB) {
        return startA - startB
      }
      return (a.sort_order || 0) - (b.sort_order || 0)
    }

    // Sesama yang masih berjalan (ongoing): urutkan berdasarkan start_date dari yang mulai lebih awal
    const startA = parseDate(a.start_date || a.startDate)
    const startB = parseDate(b.start_date || b.startDate)
    if (startA !== startB) {
      return startA - startB
    }
    return (a.sort_order || 0) - (b.sort_order || 0)
  })
}

function ExpForm({
  item,
  onSave,
  onCancel,
  loading,
}: {
  item: Exp | null
  onSave: (d: Partial<Exp>) => void
  onCancel: () => void
  loading: boolean
}) {
  const [form, setForm] = useState({
    organization: item?.organization || "",
    position: item?.position || "",
    type: item?.type || "Education",
    start_date: item?.start_date || "",
    end_date: item?.end_date || "",
    description: item?.description || "",
  })

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
        value={form[key] || ""}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        disabled={loading}
        className="w-full px-3 py-2 text-sm border bg-transparent outline-none disabled:opacity-50"
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="col-span-2">{inp("Organization", "organization")}</div>
      <div className="col-span-2">{inp("Position", "position")}</div>
      <div className="flex flex-col gap-1.5">
        <label
          className="font-mono text-xs tracking-widest uppercase"
          style={{ color: "var(--color-muted)", letterSpacing: "0.1em" }}
        >
          Type
        </label>
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value as any })}
          disabled={loading}
          className="w-full px-3 py-2 text-sm border bg-transparent outline-none disabled:opacity-50"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-ink)",
            borderRadius: "var(--radius-md)",
            fontFamily: "var(--font-sans)",
          }}
        >
          <option value="Education">🔵 Pendidikan</option>
          <option value="Project">🟢 Magang</option>
          <option value="Freelance">🟡 Organisasi</option>
          <option value="Work">🟣 Pekerjaan</option>
        </select>
      </div>
      {inp("Start Date (YYYY-MM-DD)", "start_date", "date")}
      {inp("End Date (leave empty if current)", "end_date", "date")}
      <div className="col-span-2 flex flex-col gap-1.5">
        <label
          className="font-mono text-xs tracking-widest uppercase"
          style={{ color: "var(--color-muted)", letterSpacing: "0.1em" }}
        >
          Description
        </label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          disabled={loading}
          className="w-full px-3 py-2 text-sm border bg-transparent outline-none resize-none disabled:opacity-50"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-ink)",
            borderRadius: "var(--radius-md)",
            fontFamily: "var(--font-sans)",
          }}
        />
      </div>
      <div className="col-span-2 flex gap-3">
        <button
          onClick={() => onSave({ ...form, end_date: form.end_date || null })}
          disabled={loading}
          className="px-5 py-2 text-xs font-semibold tracking-widest uppercase disabled:opacity-50"
          style={{
            backgroundColor: "var(--color-ink)",
            color: "var(--color-paper)",
            letterSpacing: "0.1em",
            borderRadius: "var(--radius-sm)",
          }}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          onClick={onCancel}
          disabled={loading}
          className="px-5 py-2 text-xs font-semibold tracking-widest uppercase border disabled:opacity-50"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-ink)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
