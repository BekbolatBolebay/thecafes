import path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseOrigin = (() => {
  try {
    return supabaseUrl ? new URL(supabaseUrl).origin : ""
  } catch {
    return ""
  }
})()

const buildCsp = () => {
  const connectSrc = [
    "'self'",
    "https://va.vercel-scripts.com",
    "https://vercel.com",
    "https://vercel.live",
    "https://*.supabase.co",
  ]

  if (supabaseOrigin) {
    connectSrc.push(supabaseOrigin)
  }

  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://vercel.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    `connect-src ${connectSrc.join(" ")}`,
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ")
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  // Ensure Turbopack uses this directory as the workspace root
  turbopack: {
    root: path.resolve('./'),
  },
  // Security headers for production
  async headers() {
    const cspValue = buildCsp()
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          }
        ]
      },
      // Content-Security-Policy for password form pages
      {
        source: '/(login|register|forgot-password|admin/login)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspValue
          }
        ]
      },
      // Allow Vercel Analytics on all pages
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspValue
          }
        ],
        missing: [
          {
            type: 'header',
            key: 'Content-Security-Policy'
          }
        ]
      }
    ]
  },
  // Redirect HTTP to HTTPS in production
  async redirects() {
    return []
  }
}

export default nextConfig
