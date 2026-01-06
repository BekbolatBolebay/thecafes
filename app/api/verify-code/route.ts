import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create Supabase admin client for server-side operations
function getSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  )
}

export async function POST(request: Request) {
  try {
    let email, code

    try {
      const body = await request.json()
      email = body.email?.toLowerCase().trim()
      code = body.code?.trim()
    } catch (parseError) {
      console.error("[Verify Code] Error parsing request body:", parseError)
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      )
    }

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: "Email and code are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdminClient()

    // Get user with verification code
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("id, email, verification_code, verification_expires")
      .eq("email", email)
      .single()

    if (fetchError || !userData) {
      console.error("[Verify Code] User not found:", fetchError)
      return NextResponse.json(
        { success: false, error: "User or verification code not found" },
        { status: 400 }
      )
    }

    // Check if verification code exists
    if (!userData.verification_code) {
      return NextResponse.json(
        { success: false, error: "No verification code found for this email" },
        { status: 400 }
      )
    }

    // Check if code has expired
    const expiresAt = new Date(userData.verification_expires)
    if (Date.now() > expiresAt.getTime()) {
      // Clear expired code
      await supabase
        .from("users")
        .update({
          verification_code: null,
          verification_expires: null,
        })
        .eq("email", email)

      console.warn(`[Verify Code] Code expired for ${email}`)
      return NextResponse.json(
        { success: false, error: "Verification code has expired. Please request a new one." },
        { status: 400 }
      )
    }

    // Check if code matches
    if (userData.verification_code !== code) {
      console.warn(`[Verify Code] Invalid code attempt for ${email}`)
      return NextResponse.json(
        { success: false, error: "Verification code is incorrect" },
        { status: 400 }
      )
    }

    // Code is valid - clear it (one-time use)
    const { error: updateError } = await supabase
      .from("users")
      .update({
        verification_code: null,
        verification_expires: null,
      })
      .eq("email", email)

    if (updateError) {
      console.error("[Verify Code] Database error while clearing code:", updateError)
      return NextResponse.json(
        { success: false, error: "Database error" },
        { status: 500 }
      )
    }

    console.log(`[Verify Code] Successfully verified email: ${email}`)

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      userId: userData.id,
    })
  } catch (error) {
    console.error("[Verify Code] Unexpected error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to verify code" },
      { status: 500 }
    )
  }
}
