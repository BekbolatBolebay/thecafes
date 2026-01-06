import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import nodemailer from "nodemailer"

// Create Supabase admin client for server-side operations
function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    console.error("[Verification] Supabase configuration missing:", {
      SUPABASE_URL: url ? "set" : "MISSING",
      SERVICE_ROLE_KEY: key ? "set" : "MISSING",
    })
    throw new Error("Supabase not configured")
  }

  return createClient(url, key)
}

// Create email transporter using Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

export async function POST(request: Request) {
  try {
    console.log("[Verification] Request started")

    // Check email configuration first
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("[Verification] Email configuration MISSING")
      return NextResponse.json(
        {
          success: false,
          error: "Email service not configured. Please check EMAIL_USER and EMAIL_PASS.",
        },
        { status: 500 }
      )
    }

    console.log("[Verification] Email config OK: " + process.env.EMAIL_USER)

    let email: string | undefined
    let name: string | undefined
    let phone: string | undefined
    let city: string | undefined

    try {
      const body = await request.json()
      email = body.email?.toLowerCase().trim()
      name = body.name?.trim()
      phone = body.phone?.trim()
      city = body.city?.trim()
      console.log("[Verification] Request body parsed:", { email, hasName: !!name, hasPhone: !!phone, hasCity: !!city })
    } catch (parseError) {
      console.error("[Verification] Error parsing request body:", parseError)
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      )
    }

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
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

    console.log("[Verification] Email validation passed:", email)

    // Generate random 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    console.log("[Verification] Code generated:", verificationCode)

    // Calculate expiration time (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    // Store code in Supabase
    console.log("[Verification] Storing code in database...")
    const supabase = getSupabaseAdminClient()

    const { data: userData, error: userError } = await supabase
      .from("users")
      .upsert(
        {
          email: email,
          full_name: name,
          phone: phone,
          city: city,
          verification_code: verificationCode,
          verification_expires: expiresAt,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      )
      .select()

    if (userError) {
      console.error("[Verification] Database error:", userError)
      return NextResponse.json(
        { success: false, error: `Database error: ${userError.message}` },
        { status: 500 }
      )
    }

    console.log("[Verification] Code stored in database successfully")

    // Send email using Gmail SMTP
    console.log("[Verification] Starting email send...")
    try {
      const transporter = createTransporter()

      // Test connection
      console.log("[Verification] Testing SMTP connection...")
      await transporter.verify()
      console.log("[Verification] SMTP connection verified")

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff6b6b;">Тіркелуді растау</h2>
          <p>Сәлем, ${name || "Құрметті пайдаланушы"},</p>
          <p>Тіркелуіңіз аяқталуын өндіктеу үшін төмендегі кодты пайдаланыңыз:</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h1 style="color: #ff6b6b; font-size: 36px; letter-spacing: 8px; margin: 0;">${verificationCode}</h1>
          </div>
          <p>Бұл код 10 минут ішінде ескі болады.</p>
          <p style="color: #666; font-size: 14px;">Егер сіз бұл сұрау жіберсеңіз, ешқандай ғана айтқанда істеуге болмайды.</p>
        </div>
      `

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Тіркелуді растау коды - Food Delivery",
        html: emailHtml,
      }

      console.log("[Verification] Sending email to:", email)
      const info = await transporter.sendMail(mailOptions)
      console.log("[Verification] Email sent successfully:", info.messageId)

      return NextResponse.json(
        {
          success: true,
          message: "Растау коды email-ға жіберілді",
          code: verificationCode,
        },
        { status: 200 }
      )
    } catch (emailError) {
      console.error("[Verification] Email sending error:", emailError)
      const errorMsg =
        emailError instanceof Error
          ? emailError.message
          : String(emailError)
      console.error("[Verification] Error details:", errorMsg)
      console.error("[Verification] Full error:", JSON.stringify(emailError))

      // Clear the verification code from database if email fails
      console.log("[Verification] Clearing code from database due to email error...")
      await supabase
        .from("users")
        .update({
          verification_code: null,
          verification_expires: null,
        })
        .eq("email", email)

      return NextResponse.json(
        {
          success: false,
          error: `Failed to send verification email: ${errorMsg}`,
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("[Verification] Unexpected error:", error)
    const errorMsg =
      error instanceof Error ? error.message : String(error)
    console.error("[Verification] Full error:", JSON.stringify(error))
    return NextResponse.json(
      { success: false, error: `Failed to process verification request: ${errorMsg}` },
      { status: 500 }
    )
  }
}
