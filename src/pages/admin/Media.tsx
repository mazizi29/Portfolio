import { useState, useEffect } from "react"
import AdminLayout from "@/layouts/admin/AdminLayout"
import { getSupabaseClient } from "@/lib/supabase"
import { uploadImage } from "@/lib/upload"

const supabase = getSupabaseClient()

type MediaItem = {
  id?: string | null
  name: string
  url: string
  size: string
  created_at?: string | null
}

export default function Media() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<MediaItem | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    setLoading(true)
    const { data, error } = await supabase.storage.from("media").list("", {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    })

    if (error) {
      console.error("Error fetching media:", error)
    } else if (data) {
      // Filter out any hidden files like .emptyFolderPlaceholder
      const validFiles = data.filter(
        (file) => file.name !== ".emptyFolderPlaceholder",
      )

      const mediaItems: MediaItem[] = validFiles.map((file) => {
        const { data: urlData } = supabase.storage
          .from("media")
          .getPublicUrl(file.name)
        return {
          id: file.id,
          name: file.name,
          url: urlData.publicUrl,
          size: formatBytes(file.metadata?.size || 0),
          created_at: file.created_at,
        }
      })
      setItems(mediaItems)
    }
    setLoading(false)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const { url, error } = await uploadImage(file)

    if (error || !url) {
      alert("Upload gagal: " + error)
    } else {
      // Refresh list after successful upload
      await fetchMedia()
    }

    setUploading(false)
    // reset input
    e.target.value = ""
  }

  const handleDelete = async (fileName: string) => {
    if (!confirm(`Hapus file ${fileName}?`)) return

    const { error } = await supabase.storage.from("media").remove([fileName])
    if (error) {
      alert("Gagal menghapus file: " + error.message)
    } else {
      setItems((prev) => prev.filter((i) => i.name !== fileName))
      setSelected(null)
    }
  }

  const handleCopy = (url: string, id?: string | null) => {
    navigator.clipboard.writeText(url)
    setCopied(id || url)
    setTimeout(() => setCopied(null), 2000)
  }

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <AdminLayout title="Media Library">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2
            className="font-sans font-semibold text-xl"
            style={{ color: "var(--color-ink)", letterSpacing: "-0.02em" }}
          >
            Media Library
          </h2>
          <label
            className={`px-5 py-2.5 text-xs font-semibold tracking-widest uppercase cursor-pointer transition-opacity ${
              uploading ? "opacity-50 pointer-events-none" : ""
            }`}
            style={{
              backgroundColor: "var(--color-ink)",
              color: "var(--color-paper)",
              letterSpacing: "0.1em",
              borderRadius: "var(--radius-sm)",
            }}
          >
            {uploading ? "Uploading..." : "+ Upload"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>

        <div className="mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari media..."
            className="w-full max-w-xs px-4 py-2 text-sm border bg-transparent outline-none"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-ink)",
              borderRadius: "var(--radius-md)",
              fontFamily: "var(--font-sans)",
            }}
          />
        </div>

        {loading ? (
          <div
            className="py-12 text-center text-sm"
            style={{ color: "var(--color-muted)" }}
          >
            Memuat file media...
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="py-12 text-center text-sm border"
            style={{
              borderColor: "var(--color-border)",
              borderRadius: "var(--radius-md)",
              color: "var(--color-muted)",
            }}
          >
            Belum ada media. Silakan upload gambar pertama Anda.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group border overflow-hidden cursor-pointer transition-colors hover:border-ink"
                style={{
                  borderColor:
                    selected?.id === item.id
                      ? "var(--color-ink)"
                      : "var(--color-border)",
                  borderRadius: "var(--radius-md)",
                }}
                onClick={() =>
                  setSelected(item.id === selected?.id ? null : item)
                }
              >
                <div
                  className="aspect-video overflow-hidden"
                  style={{ backgroundColor: "var(--color-border-light)" }}
                >
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div
                  className="px-3 py-2.5"
                  style={{ backgroundColor: "var(--color-surface)" }}
                >
                  <p
                    className="text-xs font-medium truncate"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {item.name}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {item.size}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected panel */}
        {selected && (
          <div
            className="fixed bottom-0 left-0 right-0 md:bottom-6 md:right-6 md:left-auto border-t md:border p-5 md:w-72 shadow-lg z-50"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-surface)",
              borderRadius: "0",
              ...(window.innerWidth >= 768
                ? { borderRadius: "var(--radius-lg)" }
                : {}),
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <p
                className="font-sans font-medium text-sm truncate pr-2"
                style={{ color: "var(--color-ink)" }}
              >
                {selected.name}
              </p>
              <button
                onClick={() => setSelected(null)}
                className="text-xs shrink-0 px-1 py-1"
                style={{ color: "var(--color-muted)" }}
              >
                ✕
              </button>
            </div>
            <p className="text-xs mb-4" style={{ color: "var(--color-muted)" }}>
              {selected.size}
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleCopy(selected.url, selected.id)}
                className="w-full py-2 text-xs font-semibold tracking-widest uppercase border"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-ink)",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                {copied === selected.id ? "Copied!" : "Copy URL"}
              </button>
              <button
                onClick={() => handleDelete(selected.name)}
                className="w-full py-2 text-xs font-semibold tracking-widest uppercase"
                style={{
                  backgroundColor: "#c0392b",
                  color: "#fff",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
