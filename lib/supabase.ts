import { createBrowserClient } from "@supabase/ssr"

// Create a singleton Supabase client
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export function getSupabase() {
  if (supabaseInstance) return supabaseInstance

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  if (!supabaseUrl || !supabaseAnonKey) {
    // Environment variables missing — avoid noisy errors at module import time.
    // Return a lightweight stub client that throws when used so app code
    // can guard or fail gracefully at the call site.
    console.warn("Supabase env not found. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local")

    const thrower = () => {
      throw new Error(
        "Supabase client not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
      )
    }

    // Create a proxy that throws on any method access
    const stub: any = new Proxy({}, { get: () => thrower })
    supabaseInstance = stub
    return supabaseInstance
  }

  supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey)
  return supabaseInstance
}

export const supabase = getSupabase()

// R2 Storage configuration for images
export const uploadToR2 = async (file: File, bucket = "food-images") => {
  const supabaseClient = getSupabase()
  if (!supabaseClient) return null

  const fileName = `${Date.now()}-${file.name}`
  const { data, error } = await supabaseClient.storage.from(bucket).upload(fileName, file)

  if (error) {
    console.error("Upload error:", error)
    return null
  }

  const {
    data: { publicUrl },
  } = supabaseClient.storage.from(bucket).getPublicUrl(fileName)

  return publicUrl
}
