import { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"

function getSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  )
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password, city, address } = await req.json()

    if (!email || !name || !phone || !password || !city) {
      return new Response(
        JSON.stringify({ error: "Барлық өрістерді толтырыңыз" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const supabaseAdmin = getSupabaseAdminClient()

    // Create user in Supabase Auth (auto-confirmed)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: name,
        phone,
        city,
        address: address || "",
      },
    })

    if (authError) {
      console.error("Auth user creation error:", authError)
      return new Response(
        JSON.stringify({ error: "Пайдаланушы құру қатесі" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, user: authData.user }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return new Response(
      JSON.stringify({ error: "Тіркелу қатесі" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}