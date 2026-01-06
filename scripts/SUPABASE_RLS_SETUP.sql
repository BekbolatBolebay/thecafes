-- ========================================
-- SUPABASE RLS SETUP FOR USERS TABLE
-- Run this in Supabase SQL Editor
-- ========================================

-- 1. Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 2. Make password_hash nullable (since we use Supabase Auth)
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- 3. Drop existing policies (if any)
DROP POLICY IF EXISTS "Allow new user registration" ON users;
DROP POLICY IF EXISTS "Allow user registration via auth trigger" ON users;
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;

-- Allow trigger function to insert new users (SECURITY DEFINER bypasses RLS)
CREATE POLICY "Allow user registration via auth trigger" ON users
FOR INSERT
WITH CHECK (true);

-- Users can view their own data
CREATE POLICY "Users can view their own data" ON users 
FOR SELECT 
USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update their own data" ON users 
FOR UPDATE 
USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users" ON users 
FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- Admins can update all users
CREATE POLICY "Admins can update users" ON users 
FOR UPDATE 
USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- ========================================
-- Test: Verify RLS is working
-- ========================================
-- SELECT * FROM users; -- Should work for authenticated users
-- INSERT INTO users (id, email, full_name, phone, city, password_hash, is_admin)
-- VALUES (gen_random_uuid(), 'test@test.com', 'Test User', '1234567890', 'Almaty', '', false);
