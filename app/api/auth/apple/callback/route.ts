import { NextResponse } from "next/server"
import crypto from "crypto"
import jwt from "jsonwebtoken"

/**
 * POST /api/auth/apple/callback
 * Handles Apple OAuth callback
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const code = formData.get("code") as string
    const state = formData.get("state") as string
    const idTokenString = formData.get("id_token") as string

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code not provided" },
        { status: 400 }
      )
    }

    const appleClientId = process.env.APPLE_CLIENT_ID
    const appleClientSecret = process.env.APPLE_CLIENT_SECRET
    const appleTeamId = process.env.APPLE_TEAM_ID
    const appleKeyId = process.env.APPLE_KEY_ID
    const applePrivateKey = process.env.APPLE_PRIVATE_KEY

    if (!appleClientId || !appleClientSecret || !appleTeamId || !appleKeyId || !applePrivateKey) {
      return NextResponse.json(
        { error: "Apple OAuth not configured" },
        { status: 500 }
      )
    }

    const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/apple/callback`

    // Generate client secret JWT for Apple
    const clientSecretJWT = jwt.sign(
      {
        iss: appleTeamId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400 * 180,
        aud: "https://appleid.apple.com",
        sub: appleClientId,
      },
      applePrivateKey.replace(/\\n/g, "\n"),
      {
        algorithm: "ES256",
        keyid: appleKeyId,
      }
    )

    // Exchange authorization code for tokens
    const tokenResponse = await fetch("https://appleid.apple.com/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: appleClientId,
        client_secret: clientSecretJWT,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }).toString(),
    })

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json()
      console.error("[OAuth] Apple token exchange error:", error)
      return NextResponse.json(
        { error: "Failed to exchange authorization code" },
        { status: 400 }
      )
    }

    const tokenData = await tokenResponse.json()

    // Decode ID token to get user info
    let userInfo: any = {}
    if (idTokenString) {
      try {
        const decoded = jwt.decode(idTokenString, { complete: true })
        if (decoded && decoded.payload) {
          userInfo = decoded.payload
        }
      } catch (decodeError) {
        console.error("[OAuth] Failed to decode Apple ID token:", decodeError)
      }
    }

    // Return user data for registration
    return NextResponse.json({
      name: userInfo.name || "",
      email: userInfo.email || "",
      provider: "apple",
    })
  } catch (error) {
    console.error("[OAuth] Apple callback error:", error)
    return NextResponse.json(
      { error: "Failed to process Apple OAuth callback" },
      { status: 500 }
    )
  }
}
