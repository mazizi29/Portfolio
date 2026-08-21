import { createClient } from '@supabase/supabase-js'

const DEFAULT_SUPABASE_URL = 'https://pbezjyedxiydebfuxclj.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiZXpqeWVkeGl5ZGViZnV4Y2xqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNTYyNjgsImV4cCI6MjEwMTgzMjI2OH0.ky3TYqfje9ZcQx8lrvfYmrpHzlvLc5VpZXGjMEILTkY'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY

let clientInstance: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey)
  }
  return clientInstance
}
