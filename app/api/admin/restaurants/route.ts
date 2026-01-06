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

// GET all restaurants
export async function GET() {
  try {
    const supabase = getSupabaseAdminClient()
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred'
    return new NextResponse(JSON.stringify({ error: message }), { status: 500 })
  }
}

// POST a new restaurant
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, description, image_url, category, name_kk, name_ru, name_en, description_kk, description_ru, description_en } = body

    if (!name || !image_url || !category) {
      return new NextResponse(JSON.stringify({ error: 'Missing required fields: name, image_url, category' }), { status: 400 })
    }

    const supabase = getSupabaseAdminClient()
    const { data, error } = await supabase
      .from('restaurants')
      .insert([
        { name, description, image_url, category, name_kk, name_ru, name_en, description_kk, description_ru, description_en },
      ])
      .select()
      .single()

    if (error) {
      return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred'
    return new NextResponse(JSON.stringify({ error: message }), { status: 500 })
  }
}
