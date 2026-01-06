export const dynamic = "force-dynamic";

import { NextResponse } from "next/server"

/**
 * GET /api/auth/google
 * Redirects user to Google OAuth consent screen
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const redirectTo = searchParams.get("redirectTo") || "/register/social-callback"

    // Build Google OAuth URL
    const googleClientId = process.env.GOOGLE_CLIENT_ID
    const googleRedirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/google/callback`

    if (!googleClientId) {
      return NextResponse.json(
        { error: "Google OAuth not configured" },
        { status: 500 }
      )
    }

    const params = new URLSearchParams({
      client_id: googleClientId,
      redirect_uri: googleRedirectUri,
      response_type: "code",
      scope: "openid profile email",
      access_type: "offline",
      prompt: "consent",
      state: encodeURIComponent(redirectTo),
    })

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`

    return NextResponse.redirect(googleAuthUrl)
  } catch (error) {
    console.error("[OAuth] Google redirect error:", error)
    return NextResponse.json(
      { error: "Failed to initiate Google login" },
      { status: 500 }
    )
  }
}
