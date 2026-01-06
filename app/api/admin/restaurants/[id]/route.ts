import { NextRequest, NextResponse } from 'next/server'
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

// GET a single restaurant by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const supabase = getSupabaseAdminClient()
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // PostgREST code for "Not found"
        return new NextResponse(JSON.stringify({ error: 'Restaurant not found' }), { status: 404 })
      }
      return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred'
    return new NextResponse(JSON.stringify({ error: message }), { status: 500 })
  }
}

// PUT (update) a restaurant by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await req.json()

    const supabase = getSupabaseAdminClient()
    const { data, error } = await supabase
      .from('restaurants')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return new NextResponse(JSON.stringify({ error: 'Restaurant not found' }), { status: 404 })
      }
      return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred'
    return new NextResponse(JSON.stringify({ error: message }), { status: 500 })
  }
}

// DELETE a restaurant by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const supabase = getSupabaseAdminClient()
    const { error } = await supabase
      .from('restaurants')
      .delete()
      .eq('id', id)

    if (error) {
      if (error.code === 'PGRST116') {
        return new NextResponse(JSON.stringify({ error: 'Restaurant not found' }), { status: 404 })
      }
      return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 })
    }

    return new NextResponse(null, { status: 204 }) // No Content
  } catch (err) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred'
    return new NextResponse(JSON.stringify({ error: message }), { status: 500 })
  }
}
