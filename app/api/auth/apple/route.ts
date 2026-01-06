import { NextResponse } from "next/server"

/**
 * GET /api/auth/apple
 * Redirects user to Apple OAuth consent screen
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const redirectTo = searchParams.get("redirectTo") || "/register/social-callback"

    // Build Apple OAuth URL
    const appleClientId = process.env.APPLE_CLIENT_ID
    const appleRedirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/apple/callback`

    if (!appleClientId) {
      return NextResponse.json(
        { error: "Apple OAuth not configured" },
        { status: 500 }
      )
    }

    const params = new URLSearchParams({
      client_id: appleClientId,
      redirect_uri: appleRedirectUri,
      response_type: "code",
      response_mode: "form_post",
      scope: "name email",
      state: encodeURIComponent(redirectTo),
    })

    const appleAuthUrl = `https://appleid.apple.com/auth/authorize?${params.toString()}`

    return NextResponse.redirect(appleAuthUrl)
  } catch (error) {
    console.error("[OAuth] Apple redirect error:", error)
    return NextResponse.json(
      { error: "Failed to initiate Apple login" },
      { status: 500 }
    )
  }
}
