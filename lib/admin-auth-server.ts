// ============================================================================
// ADMIN AUTHENTICATION MIDDLEWARE (Server-side)
// ============================================================================
// Location: lib/admin-auth-server.ts
// Purpose: Server-side authentication utilities for API routes
// Dependencies: Requires database connection and JWT library
// ============================================================================

import type { NextRequest } from 'next/server'
import type { AdminUser, AdminRole } from './admin-auth'

/**
 * Extract and verify JWT token from request headers
 * @param req NextRequest object
 * @returns Decoded token or null
 */
export function extractTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  return authHeader.substring(7) // Remove 'Bearer ' prefix
}

/**
 * Response helper for unauthorized requests
 */
export function unauthorizedResponse(message = 'Unauthorized') {
  return new Response(JSON.stringify({ message }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Response helper for forbidden requests
 */
export function forbiddenResponse(message = 'Forbidden') {
  return new Response(JSON.stringify({ message }), {
    status: 403,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Response helper for demo mode restrictions
 */
export function demoModeRestrictionResponse(action: string) {
  return new Response(
    JSON.stringify({
      message: `Action "${action}" is restricted in demo mode`,
      code: 'DEMO_MODE_RESTRICTED',
    }),
    {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}

/**
 * Response helper for server errors
 */
export function errorResponse(message: string, status = 500) {
  return new Response(JSON.stringify({ message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Response helper for success responses
 */
export function successResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

// ============================================================================
// PLACEHOLDER: Database Query Functions
// ============================================================================
// These functions should be replaced with actual database queries
// using your preferred ORM (Prisma, Supabase client, etc.)

// Import Supabase client for database operations
import { createClient } from '@supabase/supabase-js'

// Create a service-level Supabase client (using service role key for admin operations)
function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }
  
  return createClient(url, serviceRoleKey)
}

/**
 * Get admin user by ID
 * TODO: Implement with your database
 */
export async function getAdminUserById(userId: string): Promise<AdminUser | null> {
  try {
    const supabase = getSupabaseAdminClient()
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching admin user by ID:', error)
      return null
    }
    
    return data ? mapDatabaseUserToAdminUser(data) : null
  } catch (err) {
    console.error('getAdminUserById error:', err)
    return null
  }
}

/**
 * Get admin user by email
 * TODO: Implement with your database
 */
export async function getAdminUserByEmail(email: string): Promise<AdminUser | null> {
  try {
    const supabase = getSupabaseAdminClient()
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single()
    
    if (error) {
      console.error('Error fetching admin user by email:', error)
      return null
    }
    
    return data ? mapDatabaseUserToAdminUser(data) : null
  } catch (err) {
    console.error('getAdminUserByEmail error:', err)
    return null
  }
}

/**
 * Helper function to map database user to AdminUser type
 */
function mapDatabaseUserToAdminUser(dbUser: any): AdminUser {
  return {
    id: dbUser.id,
    email: dbUser.email,
    firstName: dbUser.first_name || '',
    lastName: dbUser.last_name || '',
    role: dbUser.role,
    isActive: dbUser.is_active,
    demoModeEnabled: dbUser.demo_mode_enabled,
    cityId: dbUser.city_id,
    cafeId: undefined,
    lastLogin: dbUser.last_login ? new Date(dbUser.last_login) : undefined,
    createdAt: new Date(dbUser.created_at),
    password_hash: dbUser.password_hash, // Include for authentication
  }
}

/**
 * Get admin session
 * TODO: Implement with your database
 */
export async function getAdminSession(token: string) {
  try {
    const supabase = getSupabaseAdminClient()
    const { data, error } = await supabase
      .from('admin_sessions')
      .select('*')
      .eq('session_token', token)
      .single()
    
    if (error) {
      console.error('Error fetching admin session:', error)
      return null
    }
    
    return data
  } catch (err) {
    console.error('getAdminSession error:', err)
    return null
  }
}

/**
 * Create admin session
 * TODO: Implement with your database
 */
export async function createAdminSession(
  userId: string,
  token: string,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    const supabase = getSupabaseAdminClient()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
    
    const { data, error } = await supabase
      .from('admin_sessions')
      .insert([
        {
          admin_user_id: userId,
          session_token: token,
          ip_address: ipAddress,
          user_agent: userAgent,
          is_active: true,
          expires_at: expiresAt.toISOString(),
        },
      ])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating admin session:', error)
      return null
    }
    
    return data
  } catch (err) {
    console.error('createAdminSession error:', err)
    return null
  }
}

/**
 * Invalidate admin session
 * TODO: Implement with your database
 */
export async function invalidateAdminSession(token: string) {
  try {
    const supabase = getSupabaseAdminClient()
    const { error } = await supabase
      .from('admin_sessions')
      .update({ is_active: false })
      .eq('session_token', token)
    
    return !error
  } catch (err) {
    console.error('invalidateAdminSession error:', err)
    return false
  }
}

/**
 * Check if action is restricted in demo mode
 * TODO: Implement with your database
 */
export async function isActionRestrictedInDemoMode(
  action: string,
  demoModeEnabled: boolean
): Promise<boolean> {
  if (!demoModeEnabled) return false

  try {
    const supabase = getSupabaseAdminClient()
    const { data } = await supabase
      .from('demo_mode_restrictions')
      .select('is_restricted')
      .eq('action_name', action)
      .single()

    return data?.is_restricted ?? false
  } catch (err) {
    // Fallback to hardcoded restrictions if database query fails
    const restrictedActions = [
      'DELETE_CAFE',
      'DELETE_BOOKING',
      'DELETE_CITY',
      'DISABLE_ADMIN',
      'MODIFY_DEMO_MODE',
      'EXPORT_DATA',
    ]
    return restrictedActions.includes(action)
  }
}

/**
 * Log admin action to audit log
 * TODO: Implement with your database
 */
export async function logAdminAction(
  userId: string,
  action: string,
  entityType?: string,
  entityId?: string,
  oldValues?: any,
  newValues?: any,
  ipAddress?: string
) {
  try {
    const supabase = getSupabaseAdminClient()
    const { error } = await supabase
      .from('admin_audit_log')
      .insert([
        {
          admin_user_id: userId,
          action,
          entity_type: entityType,
          entity_id: entityId,
          old_values: oldValues,
          new_values: newValues,
          ip_address: ipAddress,
        },
      ])

    if (error) {
      console.error('Error logging admin action:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('logAdminAction error:', err)
    return false
  }
}

// ============================================================================
// PASSWORD HASHING (Requires bcryptjs)
// ============================================================================
// In your API routes, use these functions for password operations

/**
 * Hash password using bcryptjs
 * Usage:
 * import bcrypt from 'bcryptjs'
 * const hash = await hashPassword(password)
 */
export async function hashPassword(password: string): Promise<string> {
  // const bcrypt = require('bcryptjs')
  // const salt = await bcrypt.genSalt(10)
  // return bcrypt.hash(password, salt)
  throw new Error('hashPassword not implemented. Install bcryptjs and implement this function.')
}

/**
 * Verify password against hash
 * Usage:
 * import bcrypt from 'bcryptjs'
 * const isValid = await verifyPassword(password, hash)
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // const bcrypt = require('bcryptjs')
  // return bcrypt.compare(password, hash)
  throw new Error('verifyPassword not implemented. Install bcryptjs and implement this function.')
}

// ============================================================================
// JWT TOKEN HANDLING (Requires jsonwebtoken)
// ============================================================================
// In your API routes, use these functions for JWT operations

import jwt from 'jsonwebtoken'



/**

 * Create JWT token

 * Usage:

 * import jwt from 'jsonwebtoken'

 * const token = createJWT(payload, secret)

 */

export function createJWT(

  payload: any,

  secret: string,

  expiresIn = '24h'

): string {

  if (!secret) {

    throw new Error('JWT_SECRET is not defined');

  }

  return jwt.sign(payload, secret, { expiresIn })

}



/**

 * Verify JWT token

 * Usage:

 * import jwt from 'jsonwebtoken'

 * const decoded = verifyJWT(token, secret)

 */

export function verifyJWT(token: string, secret: string): any {

  if (!secret) {

    throw new Error('JWT_SECRET is not defined');

  }

  try {

    return jwt.verify(token, secret);

  } catch (error) {

    console.error("JWT verification error:", error);

    return null;

  }

}
