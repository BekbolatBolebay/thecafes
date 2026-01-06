import { NextRequest } from "next/server"
import { authenticate, AuthError } from "@/lib/auth-service"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    console.log("[Login API] Attempting login for:", email)

    if (!email?.trim() || !password?.trim()) {
      console.log("[Login API] Missing email or password")
      return new Response(
        JSON.stringify({ message: "Email and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const result = await authenticate(email, password)

    console.log("[Login API] Auth result success:", result.success)

    if (!result.success) {
      console.log("[Login API] Authentication failed:", (result as AuthError).message)
      return new Response(
        JSON.stringify({ success: false, message: "Invalid credentials" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      )
    }

    console.log("[Login API] Authentication successful for:", email)

    return new Response(
      JSON.stringify({
        success: true,
        user: result.user,
        token: result.token,
        redirectUrl: result.redirectUrl,
        session: result.session,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("[Login API] Error:", error)
    return new Response(
      JSON.stringify({ message: "An error occurred during login" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
