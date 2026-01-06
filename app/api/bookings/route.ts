import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createSupabaseServerClient(cookieStore)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { restaurant_id, date, time, guests, table_id, user_name, restaurant_name, restaurant_image } = await request.json()

  if (!restaurant_id || !date || !time || !guests || !table_id) {
    return new NextResponse(JSON.stringify({ error: 'Missing required booking information.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert([
      {
        user_id: user.id,
        restaurant_id,
        booking_date: date,
        booking_time: time,
        number_of_guests: guests,
        table_id,
        status: 'confirmed',
        user_name,
        restaurant_name,
        restaurant_image
      },
    ])
    .select()

  if (error) {
    console.error('Error creating booking:', error)
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return NextResponse.json(data)
}

export async function GET() {
  const cookieStore = cookies()
  const supabase = createSupabaseServerClient(cookieStore)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bookings:', error)
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return NextResponse.json(data)
}
