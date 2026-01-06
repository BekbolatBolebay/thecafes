import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ isAdmin: false, error: 'Not authenticated' }, { status: 401 })
  }

  const userEmail = session.user.email
  if (!userEmail) {
    return NextResponse.json({ isAdmin: false, error: 'Email not found in session' }, { status: 400 })
  }

  // Use service role client to check admin_users table securely
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: adminUser, error } = await supabaseAdmin
    .from('admin_users')
    .select('id')
    .eq('email', userEmail)
    .single()

  // error can be ignored if it's because no row was found (PGRST116)
  if (error && error.code !== 'PGRST116') {
    console.error('API /check-role error:', error)
    return NextResponse.json({ isAdmin: false, error: 'Internal server error' }, { status: 500 })
  }

  const isAdmin = !!adminUser

  return NextResponse.json({ isAdmin })
}
