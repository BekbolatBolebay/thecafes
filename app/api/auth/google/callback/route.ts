import { NextResponse } from "next/server"

/**
 * POST /api/auth/google/callback
 * Handles Google OAuth callback
 */
export async function POST(request: Request) {
  try {
    const { code, state } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code not provided" },
        { status: 400 }
      )
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/google/callback`

    if (!googleClientId || !googleClientSecret) {
      return NextResponse.json(
        { error: "Google OAuth not configured" },
        { status: 500 }
      )
    }

    // Exchange authorization code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: googleClientId,
        client_secret: googleClientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    })

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json()
      console.error("[OAuth] Token exchange error:", error)
      return NextResponse.json(
        { error: "Failed to exchange authorization code" },
        { status: 400 }
      )
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Fetch user info from Google
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!userInfoResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch user info" },
        { status: 400 }
      )
    }

    const userInfo = await userInfoResponse.json()

    // Return user data for registration
    return NextResponse.json({
      name: userInfo.name || "",
      email: userInfo.email,
      provider: "google",
    })
  } catch (error) {
    console.error("[OAuth] Google callback error:", error)
    return NextResponse.json(
      { error: "Failed to process Google OAuth callback" },
      { status: 500 }
    )
  }
}
