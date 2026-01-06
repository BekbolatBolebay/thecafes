// ============================================================================
// CENTRALIZED AUTH SERVICE (REFACTORED)
// ============================================================================
// Location: lib/auth-service.ts
// Purpose: Single, unified entry point for all user roles.
// ============================================================================

import { createClient } from "@supabase/supabase-js"
import jwt from "jsonwebtoken"

// This type should ideally be generated from your DB schema.
// We define it manually based on the 'user_role' enum in the database.
export type UserRole = "admin" | "cafe_staff" | "courier" | "customer";

export interface AuthResult {
  success: true
  user: {
    id: string
    email: string
    role: UserRole
    fullName?: string
  }
  token: string
  redirectUrl: string
  session: {
    access_token: string
    refresh_token: string
  }
}

export interface AuthError {
  success: false
  message: string
}

/**
 * Returns the appropriate redirect URL based on the user's role.
 * @param role The user's role.
 * @returns The redirect URL string.
 */
function getRedirectUrlByRole(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "cafe_staff":
      return "/cafe-staff-panel";
    case "courier":
      return "/courier-panel"; // Assuming this page will be created
    case "customer":
    default:
      return "/profile";
  }
}

/**
 * Creates a Supabase client with service role permissions.
 * WARNING: This should only be used on the server-side.
 * @returns A Supabase client instance.
 */
function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase URL or service role key is not defined.");
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}

// ============================================================================
// AUTHENTICATE - UNIFIED ENTRY POINT
// ============================================================================

export async function authenticate(
  email: string,
  password: string
): Promise<AuthResult | AuthError> {
  try {
    const emailLower = email.toLowerCase()
    const authClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );

    // 1. Authenticate with Supabase Auth
    const { data: authData, error: authError } = await authClient.auth.signInWithPassword({
      email: emailLower,
      password,
    });

    if (authError || !authData.user) {
      console.error("[AuthService] Supabase auth error:", authError?.message);
      return { success: false, message: "Invalid email or password" };
    }

    // 2. Fetch user profile and role from the public 'users' table
    const supabaseAdmin = getSupabaseAdminClient();
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("users")
      .select("id, email, full_name, role")
      .eq("id", authData.user.id)
      .single();

    if (profileError || !profile) {
      console.error("[AuthService] Could not fetch user profile:", profileError?.message);
      // This indicates a data consistency issue (user in auth.users but not public.users)
      return { success: false, message: "Could not find user profile. Please contact support." };
    }

    // 3. Determine redirect URL and generate JWT
    const userRole = profile.role as UserRole;
    const redirectUrl = getRedirectUrlByRole(userRole);

    const token = jwt.sign(
      {
        userId: profile.id,
        email: profile.email,
        role: userRole,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    // 4. Return success result
    return {
      success: true,
      user: {
        id: profile.id,
        email: profile.email,
        role: userRole,
        fullName: profile.full_name || "",
      },
      token,
      redirectUrl,
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
      },
    };

  } catch (error) {
    console.error("[AuthService] Unexpected error during authentication:", error);
    return {
      success: false,
      message: "An unexpected error occurred during authentication.",
    };
  }
}
