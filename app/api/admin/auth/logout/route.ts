// ============================================================================
// ADMIN LOGOUT API ROUTE
// ============================================================================
// Location: app/api/admin/auth/logout/route.ts
// Purpose: Invalidate admin session
// ============================================================================

import { NextRequest } from 'next/server'
import {
  unauthorizedResponse,
  successResponse,
  extractTokenFromRequest,
  invalidateAdminSession,
  logAdminAction,
  getAdminSession,
} from '@/lib/admin-auth-server'

/**
 * POST /api/admin/auth/logout
 *
 * Invalidates the admin session token and logs the logout action.
 *
 * Request Headers:
 * Authorization: Bearer <token>
 *
 * Response:
 * {
 *   success: true,
 *   message: string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    // ====================================================================
    // 1. EXTRACT TOKEN
    // ====================================================================
    const token = extractTokenFromRequest(req)

    if (!token) {
      return unauthorizedResponse('Missing or invalid authorization header')
    }

    // ====================================================================
    // 2. GET SESSION AND USER INFO (for logging)
    // ====================================================================
    const session = await getAdminSession(token)

    if (!session) {
      return unauthorizedResponse('Session not found')
    }

    // ====================================================================
    // 3. INVALIDATE SESSION
    // ====================================================================
    await invalidateAdminSession(token)

    // ====================================================================
    // 4. LOG LOGOUT ACTION
    // ====================================================================
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    await logAdminAction(session.admin_user_id, 'LOGOUT', undefined, undefined, undefined, undefined, clientIp)

    // ====================================================================
    // 5. RETURN SUCCESS
    // ====================================================================
    return successResponse({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    console.error('[API] Logout error:', error)
    return successResponse({
      success: true,
      message: 'Logout completed',
    })
  }
}
