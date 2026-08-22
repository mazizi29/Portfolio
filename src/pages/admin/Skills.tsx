import { useState, useEffect } from "react"
import AdminLayout from "@/layouts/admin/AdminLayout"
import { getSupabaseClient } from "@/lib/supabase"

const supabase = getSupabaseClient()

interface Skill {
  id: string
  name: string
  category: string
  order_index: number
}

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  const [newName, setNewName] = useState("")
  const [newCat, setNewCat] = useState("design")

  const [draggedId, setDraggedId] = useState<string | null>(null)

  // Map category code to Display Name
  const categoryLabels: Record<string, string> = {
    design: "Soft Skill",
    build: "Hard Skill",
    visual: "Alat",
  }
  const categories = Object.keys(categoryLabels)

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("order_index", { ascending: true })

    if (error) {
      console.error("Error fetching skills:", error)
    } else {
      setSkills(data || [])
    }
    setLoading(false)
  }

  const addSkill = async () => {
    if (!newName.trim()) return
    setAdding(true)

    try {
      const catSkills = skills.filter((s) => s.category === newCat)
      const newOrderIndex = catSkills.length

      const { data, error } = await supabase
        .from("skills")
        .insert({
          name: newName.trim(),
          category: newCat,
          order_index: newOrderIndex,
        })
        .select()
        .single()

      if (error) throw error
      if (data) setSkills((prev) => [...prev, data])
      setNewName("")
    } catch (err: any) {
      console.error("Error adding skill:", err)
      alert("Gagal menambah skill: " + err.message)
    } finally {
      setAdding(false)
    }
  }

  const removeSkill = async (id: string) => {
    const { error } = await supabase.from("skills").delete().eq("id", id)
    if (error) {
      console.error("Error deleting skill:", error)
      alert("Gagal menghapus skill.")
    } else {
      setSkills((prev) => prev.filter((s) => s.id !== id))
    }
  }

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id)
    e.dataTransfer.effectAllowed = "move"
    setTimeout(() => {
      const el = document.getElementById(`skill-${id}`)
      if (el) el.style.opacity = "0.5"
    }, 0)
  }

  const handleDragEnter = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedId || draggedId === targetId) return

    setSkills((prev) => {
      const copy = [...prev]
      const draggedIndex = copy.findIndex((s) => s.id === draggedId)
      const targetIndex = copy.findIndex((s) => s.id === targetId)

      if (draggedIndex === -1 || targetIndex === -1) return prev
      if (copy[draggedIndex].category !== copy[targetIndex].category)
        return prev

      const [draggedItem] = copy.splice(draggedIndex, 1)
      copy.splice(targetIndex, 0, draggedItem)
      return copy
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault() // Required to allow dropping
  }

  const handleDragEnd = async (e: React.DragEvent, id: string) => {
    setDraggedId(null)
    const el = document.getElementById(`skill-${id}`)
    if (el) el.style.opacity = "1"

    const cat = skills.find((s) => s.id === id)?.category
    if (!cat) return

    const catSkills = skills.filter((s) => s.category === cat)
    try {
      const updates = catSkills.map((s, index) => {
        // Optimistically update state order_index just in case
        s.order_index = index
        return supabase
          .from("skills")
          .update({ order_index: index })
          .eq("id", s.id)
      })
      await Promise.all(updates)
    } catch (err) {
      console.error("Failed to save order", err)
    }
  }

  return (
    <AdminLayout title="Kemampuan">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2
            className="font-sans font-semibold text-xl"
            style={{ color: "var(--color-ink)", letterSpacing: "-0.02em" }}
          >
            Manajemen Kemampuan & Alat
          </h2>
        </div>

        {/* Add skill */}
        <div
          className="border p-6 mb-8 flex gap-3"
          style={{
            borderColor: "var(--color-border)",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--color-surface)",
          }}
        >
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            disabled={adding || loading}
            placeholder="Nama Skill (Cth: UI/UX Design)"
            className="flex-1 px-4 py-2 text-sm border bg-transparent outline-none disabled:opacity-50"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-ink)",
              borderRadius: "var(--radius-md)",
              fontFamily: "var(--font-sans)",
            }}
            onKeyDown={(e) => e.key === "Enter" && addSkill()}
          />
          <select
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            disabled={adding || loading}
            className="px-3 py-2 text-sm border bg-transparent outline-none disabled:opacity-50"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-ink)",
              borderRadius: "var(--radius-md)",
              fontFamily: "var(--font-sans)",
            }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {categoryLabels[c]}
              </option>
            ))}
          </select>
          <button
            onClick={addSkill}
            disabled={adding || loading}
            className="px-5 py-2 text-xs font-semibold tracking-widest uppercase disabled:opacity-50 transition-opacity hover:opacity-80"
            style={{
              backgroundColor: "var(--color-ink)",
              color: "var(--color-paper)",
              letterSpacing: "0.1em",
              borderRadius: "var(--radius-sm)",
            }}
          >
            {adding ? "Menambahkan..." : "Tambah"}
          </button>
        </div>

        {loading ? (
          <div
            className="py-12 text-center text-sm"
            style={{ color: "var(--color-muted)" }}
          >
            Memuat data...
          </div>
        ) : (
          categories.map((cat) => {
            const catSkills = skills.filter((s) => s.category === cat)
            return (
              <div key={cat} className="mb-8">
                <p
                  className="font-mono text-xs tracking-widest uppercase mb-4"
                  style={{
                    color: "var(--color-muted)",
                    letterSpacing: "0.14em",
                  }}
                >
                  {categoryLabels[cat]}
                </p>
                <div
                  className="border overflow-hidden"
                  style={{
                    borderColor: "var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--color-surface)",
                  }}
                >
                  {catSkills.length === 0 ? (
                    <p
                      className="text-xs px-6 py-5"
                      style={{ color: "var(--color-muted)" }}
                    >
                      Belum ada data.
                    </p>
                  ) : (
                    catSkills.map((s) => (
                      <div
                        key={s.id}
                        id={`skill-${s.id}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, s.id)}
                        onDragEnter={(e) => handleDragEnter(e, s.id)}
                        onDragOver={handleDragOver}
                        onDragEnd={(e) => handleDragEnd(e, s.id)}
                        className="flex items-center justify-between px-6 py-3 border-b last:border-0 cursor-move transition-colors hover:bg-black/5"
                        style={{ borderColor: "var(--color-border-light)" }}
                      >
                        <div className="flex items-center gap-4">
                          <span
                            className="text-xl"
                            style={{
                              color: "var(--color-muted)",
                              cursor: "grab",
                            }}
                          >
                            ≡
                          </span>
                          <p
                            className="text-sm"
                            style={{ color: "var(--color-ink)" }}
                          >
                            {s.name}
                          </p>
                        </div>
                        <button
                          onClick={() => removeSkill(s.id)}
                          className="font-mono text-xs hover:opacity-70"
                          style={{ color: "#c0392b" }}
                          title="Hapus"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </AdminLayout>
  )
}
