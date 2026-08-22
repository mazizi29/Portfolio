import { useState, useEffect } from "react"
import AdminLayout from "@/layouts/admin/AdminLayout"
import { getSupabaseClient } from "@/lib/supabase"
import { uploadImage } from "@/lib/upload"
import {
  fetchMediaUsageMap,
  getMediaUsage,
  MediaUsageLocation,
} from "@/lib/mediaScanner"

const supabase = getSupabaseClient()

type MediaItem = {
  id?: string | null
  name: string
  url: string
  size: string
  created_at?: string | null
  isUsed: boolean
  usageLocations: MediaUsageLocation[]
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
    try {
      // Fetch storage files and active usage map in parallel
      const [storageRes, usageMap] = await Promise.all([
        supabase.storage.from("media").list("", {
          limit: 200,
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        }),
        fetchMediaUsageMap(supabase),
      ])

      const { data, error } = storageRes

      if (error) {
        console.error("Error fetching media from storage:", error)
      } else if (data) {
        // Filter out any hidden files like .emptyFolderPlaceholder
        const validFiles = data.filter(
          (file) => file.name !== ".emptyFolderPlaceholder",
        )

        const mediaItems: MediaItem[] = validFiles.map((file) => {
          const { data: urlData } = supabase.storage
            .from("media")
            .getPublicUrl(file.name)

          const publicUrl = urlData?.publicUrl || ""
          const usage = getMediaUsage(file.name, usageMap)

          return {
            id: file.id,
            name: file.name,
            url: publicUrl,
            size: formatBytes(file.metadata?.size || 0),
            created_at: file.created_at,
            isUsed: usage.isUsed,
            usageLocations: usage.locations,
          }
        })

        setItems(mediaItems)

        // If an item is currently selected, update its reference
        if (selected) {
          const updatedSelected = mediaItems.find((i) => i.name === selected.name)
          if (updatedSelected) setSelected(updatedSelected)
        }
      }
    } catch (err) {
      console.error("Error loading media library:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const { url, error } = await uploadImage(file)

    if (error || !url) {
      alert("Upload gagal: " + error)
    } else {
      // Refresh list and usage scanner after successful upload
      await fetchMedia()
    }

    setUploading(false)
    // reset input
    e.target.value = ""
  }

  const handleDelete = async (item: MediaItem) => {
    let confirmMsg = `Hapus file "${item.name}"?`
    if (item.isUsed && item.usageLocations.length > 0) {
      const locationsSummary = item.usageLocations
        .map((loc) => `• ${loc.sourceName} (${loc.detail})`)
        .join("\n")
      confirmMsg = `⚠️ PERINGATAN: File ini sedang DIGUNAKAN pada:\n${locationsSummary}\n\nJika dihapus, tampilan gambar di website akan hilang. Apakah Anda yakin ingin tetap menghapusnya?`
    }

    if (!confirm(confirmMsg)) return

    const { error } = await supabase.storage.from("media").remove([item.name])
    if (error) {
      alert("Gagal menghapus file: " + error.message)
    } else {
      setItems((prev) => prev.filter((i) => i.name !== item.name))
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

  const usedCount = items.filter((i) => i.isUsed).length
  const unusedCount = items.filter((i) => !i.isUsed).length

  return (
    <AdminLayout title="Media Library">
      <div className="max-w-6xl mx-auto pb-16">
        {/* Header Title & Upload */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2
              className="font-sans font-bold text-2xl"
              style={{ color: "var(--color-ink)", letterSpacing: "-0.02em" }}
            >
              Media Library
            </h2>
            <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
              Kelola penyimpanan berkas media Supabase Storage dan pantau status penggunaannya di proyek.
            </p>
          </div>

          <label
            className={`px-5 py-2.5 text-xs font-semibold tracking-widest uppercase cursor-pointer transition-opacity flex items-center justify-center shrink-0 ${
              uploading ? "opacity-50 pointer-events-none" : "hover:opacity-85"
            }`}
            style={{
              backgroundColor: "var(--color-ink)",
              color: "var(--color-paper)",
              letterSpacing: "0.1em",
              borderRadius: "var(--radius-sm)",
            }}
          >
            {uploading ? "Uploading..." : "+ Upload Media"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Stats & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-gray-100 text-gray-700 border border-gray-200">
              Total: <strong>{items.length}</strong> berkas
            </span>
            <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              Terpakai: <strong>{usedCount}</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
              Tidak Terpakai: <strong>{unusedCount}</strong>
            </span>
          </div>

          <div className="w-full sm:w-auto">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama berkas..."
              className="w-full sm:w-64 px-3.5 py-1.5 text-xs border outline-none rounded-md"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-ink)",
                backgroundColor: "#FFFFFF",
              }}
            />
          </div>
        </div>

        {/* Main Grid */}
        {loading ? (
          <div
            className="py-16 text-center text-sm font-mono"
            style={{ color: "var(--color-muted)" }}
          >
            Memindai status media &amp; penyimpanan...
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="py-16 text-center text-sm border rounded-lg"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-surface)",
              color: "var(--color-muted)",
            }}
          >
            Tidak ada media yang sesuai pencarian.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {filtered.map((item) => {
              const isSelected = selected?.name === item.name

              return (
                <div
                  key={item.name}
                  onClick={() => setSelected(isSelected ? null : item)}
                  className={`group border rounded-lg overflow-hidden cursor-pointer transition-all flex flex-col justify-between relative ${
                    isSelected
                      ? "ring-2 ring-blue-600 border-blue-600 shadow-md"
                      : "hover:border-black hover:shadow-sm"
                  }`}
                  style={{
                    borderColor: isSelected
                      ? "#2563EB"
                      : "var(--color-border)",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  {/* Thumbnail Image Frame */}
                  <div className="aspect-square w-full bg-gray-50 flex items-center justify-center p-2 overflow-hidden relative">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-contain pointer-events-none drop-shadow-xs transition-transform duration-200 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Usage Status Badge on Thumbnail */}
                    <div className="absolute top-2 left-2 pointer-events-none">
                      {item.isUsed ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-600/90 text-white shadow-xs backdrop-blur-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          Terpakai
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-gray-800/80 text-gray-200 shadow-xs backdrop-blur-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Tidak Terpakai
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Info Footer */}
                  <div
                    className="p-2.5 border-t flex flex-col justify-between gap-1"
                    style={{
                      backgroundColor: isSelected
                        ? "#F0F7FF"
                        : "var(--color-surface)",
                      borderColor: "var(--color-border-light)",
                    }}
                  >
                    <p
                      className="text-xs font-semibold truncate"
                      style={{ color: "var(--color-ink)" }}
                      title={item.name}
                    >
                      {item.name}
                    </p>
                    <div className="flex items-center justify-between text-[11px] font-mono text-gray-500">
                      <span>{item.size}</span>
                      {item.isUsed && item.usageLocations.length > 0 && (
                        <span
                          className="text-emerald-700 font-bold"
                          title={item.usageLocations.map((l) => l.sourceName).join(", ")}
                        >
                          {item.usageLocations.length} tempat
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Selected Inspector Drawer */}
        {selected && (
          <div
            className="fixed bottom-0 left-0 right-0 md:bottom-6 md:right-6 md:left-auto border-t md:border p-5 md:w-84 shadow-2xl z-50 bg-white"
            style={{
              borderColor: "var(--color-border)",
              borderRadius: "0",
              ...(window.innerWidth >= 768
                ? { borderRadius: "var(--radius-lg)" }
                : {}),
            }}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="overflow-hidden pr-2">
                <p
                  className="font-sans font-bold text-sm truncate"
                  style={{ color: "var(--color-ink)" }}
                  title={selected.name}
                >
                  {selected.name}
                </p>
                <p className="text-xs font-mono text-gray-500 mt-0.5">
                  {selected.size}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-black text-sm shrink-0 p-1 cursor-pointer"
                title="Tutup panel"
              >
                ✕
              </button>
            </div>

            {/* Image Preview Box */}
            <div className="w-full h-32 bg-gray-50 border rounded-md overflow-hidden flex items-center justify-center p-2 mb-3">
              <img
                src={selected.url}
                alt={selected.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Usage Status Detail Banner */}
            <div className="mb-4">
              {selected.isUsed ? (
                <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-1 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                    STATUS: TERPAKAI ({selected.usageLocations.length} Lokasi)
                  </div>
                  <div className="flex flex-col gap-1 mt-2 text-[11px] text-gray-700 max-h-28 overflow-y-auto">
                    {selected.usageLocations.map((loc, idx) => (
                      <div key={idx} className="flex items-start gap-1">
                        <span className="text-emerald-600 font-bold shrink-0">↳</span>
                        <span>
                          <strong>{loc.sourceName}</strong>
                          <span className="text-gray-500 block text-[10px]">
                            {loc.detail}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-md bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 font-mono">
                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                    STATUS: TIDAK TERPAKAI
                  </div>
                  <p className="text-[11px] text-amber-700 mt-1 leading-relaxed">
                    Berkas ini tidak terhubung ke proyek, galeri, atau halaman manapun. <strong>Aman untuk dihapus</strong> jika tidak lagi dibutuhkan.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleCopy(selected.url, selected.id)}
                className="w-full py-2 text-xs font-semibold tracking-widest uppercase border transition-colors cursor-pointer hover:bg-gray-50 text-center"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-ink)",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                {copied === (selected.id || selected.url)
                  ? "✓ URL Disalin!"
                  : "Salin Link URL"}
              </button>

              <button
                type="button"
                onClick={() => handleDelete(selected)}
                className={`w-full py-2 text-xs font-semibold tracking-widest uppercase text-white transition-opacity cursor-pointer text-center ${
                  selected.isUsed
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-red-600 hover:bg-red-700"
                }`}
                style={{ borderRadius: "var(--radius-sm)" }}
              >
                Hapus Berkas
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
