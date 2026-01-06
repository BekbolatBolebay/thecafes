# Food Delivery App Setup Guide

## Supabase Configuration

### 1. Create Supabase Project
1. Go to https://supabase.com and create a new project
2. Get your project URL and anon key from Settings > API

### 2. Add Environment Variables
Add these to your Vercel project or `.env.local`:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 3. Database Schema
Run this SQL in your Supabase SQL Editor:

\`\`\`sql
-- Create restaurants table
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  rating DECIMAL(2,1),
  delivery_time TEXT,
  categories TEXT[],
  address TEXT,
  phone TEXT,
  is_new BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create food_items table
CREATE TABLE food_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  discount INTEGER DEFAULT 0,
  image TEXT,
  rating DECIMAL(2,1),
  delivery_time TEXT,
  category TEXT,
  restaurant_id UUID REFERENCES restaurants(id),
  restaurant_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  restaurant_id UUID REFERENCES restaurants(id),
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  guests INTEGER NOT NULL,
  special_requests TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  items JSONB NOT NULL,
  total INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  delivery_address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### 4. R2 Storage (Cloudflare)
For image storage, you'll need to:
1. Create a Cloudflare R2 bucket
2. Configure the bucket in Supabase Storage or use direct R2 SDK
3. Update environment variables with R2 credentials

## Features Implemented

1. **Authentication Flow**: Login redirects to profile, cart requires login
2. **Booking System**: Users can book tables at nearby restaurants
3. **Restaurant Detail Pages**: View menu and make bookings
4. **Admin Panel**: Manage bookings, restaurants, food items, users, and orders
5. **R2 Storage Ready**: Image upload function created in lib/supabase.ts

## Admin Access
Default admin credentials:
- Email: admin@food.kz
- Password: admin123
