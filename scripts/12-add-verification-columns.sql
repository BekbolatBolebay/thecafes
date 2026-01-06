-- Add verification columns to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS verification_code VARCHAR(6),
ADD COLUMN IF NOT EXISTS verification_expires TIMESTAMPTZ;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_verification_code 
ON public.users(verification_code);

-- Create index for expiration cleanup
CREATE INDEX IF NOT EXISTS idx_users_verification_expires 
ON public.users(verification_expires);

-- Log the changes
SELECT 'Verification columns added successfully' as status;
