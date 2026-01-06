import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

async function handleAdminAuth(req: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // The middleware can't set cookies, so this is a no-op
        },
        remove(name: string, options: CookieOptions) {
          // The middleware can't set cookies, so this is a no-op
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // If no user, redirect to login
  if (!user) {
    if (req.nextUrl.pathname.startsWith('/api/admin')) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Check if user is an admin
  const { data: profile, error } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (error || !profile || !profile.is_admin) {
    if (req.nextUrl.pathname.startsWith('/api/admin')) {
      return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 })
    }
    // For UI routes, redirect to home page as they are logged in but not an admin
    return NextResponse.redirect(new URL('/', req.url))
  }
  
  // If user is an admin, allow access
  return NextResponse.next()
}


export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Handle admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Exclude the public login page for the main app if it gets caught by '/admin'
    if (pathname !== '/admin/login') {
         return await handleAdminAuth(req)
    }
  }
  
  // Preserve existing security headers and HTTPS redirect logic
  const proto = req.headers.get("x-forwarded-proto") || "http"
  const host = req.headers.get("host")
  
  if (proto === "http" && host && !host.startsWith("localhost")) {
    const secureUrl = new URL(req.url)
    secureUrl.protocol = "https:"
    return NextResponse.redirect(secureUrl, { status: 308 })
  }

  const response = NextResponse.next()
  
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin")
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
