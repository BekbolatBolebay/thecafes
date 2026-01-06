import { NextRequest } from 'next/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {
  errorResponse,
  unauthorizedResponse,
  successResponse,
  getAdminUserByEmail,
  createAdminSession,
  logAdminAction,
} from '@/lib/admin-auth-server'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email?.trim() || !password?.trim()) {
      return errorResponse('Email and password are required', 400)
    }

    const emailLower = email.toLowerCase()
    console.log(`[LOGIN] Attempting login for email: ${emailLower}`)

    const adminUser = await getAdminUserByEmail(emailLower)
    
    if (!adminUser) {
      return unauthorizedResponse('Admin user not found')
    }

    console.log(`[LOGIN] Admin user found: ${adminUser.email}, Role: ${adminUser.role}`)

    if (!adminUser.id) {
      console.log(`[LOGIN] Admin user ID is missing`)
      return unauthorizedResponse('Invalid email or password')
    }

    if (!adminUser.password_hash) {
      console.log(`[LOGIN] User has no password hash: ${emailLower}`)
      return unauthorizedResponse('Invalid email or password')
    }

    console.log(`[LOGIN] Comparing passwords...`)
    const passwordValid = await bcrypt.compare(password, adminUser.password_hash)
    
    if (!passwordValid) {
      console.log(`[LOGIN] Invalid password for user: ${emailLower}`)
      return unauthorizedResponse('Invalid password for admin user')
    }

    console.log(`[LOGIN] Password valid, user active: ${adminUser.isActive}`)

    if (!adminUser.isActive) {
      return errorResponse('Your account has been disabled. Contact your administrator.', 403)
    }

    const sessionToken = jwt.sign(
      {
        userId: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const userAgent = req.headers.get('user-agent') || undefined
    
    await createAdminSession(
      adminUser.id,
      sessionToken,
      clientIp,
      userAgent
    )

    await logAdminAction(adminUser.id, 'LOGIN', undefined, undefined, undefined, undefined, clientIp)

    console.log(`[LOGIN] Login successful for: ${emailLower}`)

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
      token: sessionToken,
    })
  } catch (error) {
    console.error('[API] Login error:', error)
    return errorResponse('An error occurred during login', 500)
  }
}
