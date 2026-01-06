// ============================================================================
// ADMIN DEMO MODE TOGGLE API ROUTE
// ============================================================================
// Location: app/api/admin/demo-mode/route.ts
// Purpose: Allow Super Admins to toggle demo mode on/off
// ============================================================================

import { NextRequest } from 'next/server'
import {
  unauthorizedResponse,
  forbiddenResponse,
  successResponse,
  errorResponse,
  extractTokenFromRequest,
  getAdminSession,
  getAdminUserById,
  logAdminAction,
} from '@/lib/admin-auth-server'

/**
 * POST /api/admin/demo-mode
 *
 * Toggle demo mode for the admin user. Only Super Admins can do this.
 * When demo mode is enabled, certain destructive actions are restricted.
 *
 * Request Headers:
 * Authorization: Bearer <token>
 *
 * Request Body:
 * {
 *   enabled: boolean
 * }
 *
 * Response:
 * {
 *   success: true,
 *   demoModeEnabled: boolean,
 *   message: string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    // ====================================================================
    // 1. EXTRACT AND VERIFY TOKEN
    // ====================================================================
    const token = extractTokenFromRequest(req)

    if (!token) {
      return unauthorizedResponse('Missing or invalid authorization header')
    }

    // ====================================================================
    // 2. GET SESSION AND USER
    // ====================================================================
    const session = await getAdminSession(token)

    if (!session || !session.is_active) {
      return unauthorizedResponse('Session expired or invalid')
    }

    const adminUser = await getAdminUserById(session.admin_user_id)

    if (!adminUser) {
      return unauthorizedResponse('User not found')
    }

    // ====================================================================
    // 3. CHECK PERMISSIONS (Only Super Admin)
    // ====================================================================
    if (adminUser.role !== 'SUPER_ADMIN') {
      return forbiddenResponse('Only Super Admins can modify demo mode settings')
    }

    // ====================================================================
    // 4. PARSE REQUEST BODY
    // ====================================================================
    const { enabled } = await req.json()

    if (typeof enabled !== 'boolean') {
      return errorResponse('Invalid request: enabled must be a boolean', 400)
    }

    // ====================================================================
    // 5. UPDATE DEMO MODE IN DATABASE
    // ====================================================================
    // TODO: Implement database update
    /*
    const { error } = await supabase
      .from('admin_users')
      .update({ demo_mode_enabled: enabled })
      .eq('id', adminUser.id)

    if (error) {
      throw error
    }

    // TODO: Also update session user data in memory if needed
    */

    // ====================================================================
    // 6. LOG ACTION
    // ====================================================================
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    await logAdminAction(
      adminUser.id,
      'UPDATE_DEMO_MODE',
      'ADMIN_USER',
      adminUser.id,
      { demoModeEnabled: !enabled },
      { demoModeEnabled: enabled },
      clientIp
    )

    // ====================================================================
    // 7. RETURN RESPONSE
    // ====================================================================
    return successResponse({
      success: true,
      demoModeEnabled: enabled,
      message: enabled ? 'Demo mode is now enabled' : 'Demo mode is now disabled',
    })
  } catch (error) {
    console.error('[API] Demo mode toggle error:', error)
    return errorResponse('Failed to update demo mode', 500)
  }
}
