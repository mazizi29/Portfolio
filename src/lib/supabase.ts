import { createClient, SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Supabase] VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY tidak ditemukan di .env. " +
      "Pastikan file .env sudah dikonfigurasi dengan benar.",
  )
}

let clientInstance: SupabaseClient<any, "public", any> | null = null

export function getSupabaseClient(): SupabaseClient<any, "public", any> {
  if (!clientInstance) {
    clientInstance = createClient<any>(supabaseUrl || "", supabaseAnonKey || "")
  }
  return clientInstance
}

