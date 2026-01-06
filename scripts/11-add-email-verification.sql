-- Add email verification fields to users table
-- Run this migration in Supabase SQL editor

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS verification_code TEXT,
ADD COLUMN IF NOT EXISTS verification_expires TIMESTAMP WITH TIME ZONE;

-- Create index for faster lookups by email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_verification_code ON users(verification_code);

-- Add comment for documentation
COMMENT ON COLUMN users.verification_code IS 'Email verification code (6-digit), one-time use, expires after 10 minutes';
COMMENT ON COLUMN users.verification_expires IS 'Timestamp when the verification code expires';
