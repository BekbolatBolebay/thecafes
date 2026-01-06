// ============================================================================
// ADMIN VERIFY SESSION API ROUTE
// ============================================================================
// Location: app/api/admin/auth/verify/route.ts
// Purpose: Verify admin session token is still valid
// ============================================================================

import { NextRequest } from 'next/server'
import {
  unauthorizedResponse,
  successResponse,
  extractTokenFromRequest,
  getAdminSession,
  getAdminUserById,
} from '@/lib/admin-auth-server'

/**
 * POST /api/admin/auth/verify
 *
 * Verifies that the provided session token is valid and returns user info.
 * Called on app initialization to restore session.
 *
 * Request Headers:
 * Authorization: Bearer <token>
 *
 * Response:
 * {
 *   success: true,
 *   user: AdminUser
 * }
 */
export async function POST(req: NextRequest) {
  try {
    // ====================================================================
    // 1. EXTRACT AND VALIDATE TOKEN
    // ====================================================================
    const token = extractTokenFromRequest(req)

    if (!token) {
      return unauthorizedResponse('Missing or invalid authorization header')
    }

    // ====================================================================
    // 2. VERIFY SESSION EXISTS AND IS ACTIVE
    // ====================================================================
    const session = await getAdminSession(token)

    if (!session || !session.is_active) {
      return unauthorizedResponse('Session expired or invalid')
    }

    // ====================================================================
    // 3. CHECK SESSION EXPIRATION
    // ====================================================================
    if (new Date(session.expires_at) < new Date()) {
      return unauthorizedResponse('Session has expired')
    }

    // ====================================================================
    // 4. GET ADMIN USER
    // ====================================================================
    const adminUser = await getAdminUserById(session.admin_user_id)

    if (!adminUser || !adminUser.isActive) {
      return unauthorizedResponse('User not found or inactive')
    }

    // ====================================================================
    // 5. RETURN USER DATA
    // ====================================================================
    return successResponse({
      success: true,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        role: adminUser.role,
        isActive: adminUser.isActive,
        demoModeEnabled: adminUser.demoModeEnabled,
        cityId: adminUser.cityId,
        cafeId: adminUser.cafeId,
        createdAt: adminUser.createdAt,
      },
    })
  } catch (error) {
    console.error('[API] Verify error:', error)
    return unauthorizedResponse('Session verification failed')
  }
}
