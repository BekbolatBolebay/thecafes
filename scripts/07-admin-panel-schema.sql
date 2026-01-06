-- ============================================================================
-- ADMIN PANEL DATABASE SCHEMA
-- ============================================================================
-- Purpose: Database tables for admin panel with RBAC and demo mode
-- Dependencies: Run this after base restaurant schema
-- ============================================================================

-- Drop existing tables if they exist (for clean recreation)
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS tables CASCADE;
DROP TABLE IF EXISTS demo_mode_restrictions CASCADE;
DROP TABLE IF EXISTS admin_audit_log CASCADE;
DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS cafes CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS cities CASCADE;

-- ============================================================================
-- 1. CITIES TABLE (Create first - no dependencies)
-- ============================================================================
-- Stores city information with admin metadata
CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  country VARCHAR(100),
  state_province VARCHAR(100),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cities_active ON cities(is_active);

-- ============================================================================
-- 2. ADMIN USERS TABLE (Create after cities)
-- ============================================================================
-- Stores admin users with roles, hashed passwords, and activity status
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) NOT NULL DEFAULT 'CAFE_ADMIN' 
    CHECK (role IN ('SUPER_ADMIN', 'CITY_ADMIN', 'CAFE_ADMIN')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  demo_mode_enabled BOOLEAN NOT NULL DEFAULT false,
  city_id UUID REFERENCES cities(id) ON DELETE SET NULL,
  last_login TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  CONSTRAINT email_lowercase CHECK (email = LOWER(email))
);

-- ============================================================================
-- 3. CAFES TABLE (Create after admin_users)
-- ============================================================================
-- Stores cafe information linked to cities and admins
CREATE TABLE IF NOT EXISTS cafes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  address TEXT,
  phone_number VARCHAR(20),
  email VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT true,
  table_count INTEGER DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cafes_city ON cafes(city_id);
CREATE INDEX IF NOT EXISTS idx_cafes_admin ON cafes(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_cafes_active ON cafes(is_active);

-- ============================================================================
-- 4. ADMIN SESSIONS TABLE
-- ============================================================================
-- Stores active sessions for admin users with expiration
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) NOT NULL UNIQUE,
  ip_address VARCHAR(45),
  user_agent TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_activity_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user ON admin_sessions(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expiry ON admin_sessions(expires_at);

-- ============================================================================
-- 5. ADMIN AUDIT LOG TABLE
-- ============================================================================
-- Logs all admin actions for security and compliance
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_user ON admin_audit_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON admin_audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON admin_audit_log(created_at);

-- ============================================================================
-- 6. DEMO MODE RESTRICTIONS TABLE
-- ============================================================================
-- Defines which actions are restricted in demo mode
CREATE TABLE IF NOT EXISTS demo_mode_restrictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  is_restricted BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Insert default demo mode restrictions
INSERT INTO demo_mode_restrictions (action_name, description, is_restricted) VALUES
  ('DELETE_CAFE', 'Deleting cafes is restricted in demo mode', true),
  ('DELETE_BOOKING', 'Deleting bookings is restricted in demo mode', true),
  ('DELETE_CITY', 'Deleting cities is restricted in demo mode', true),
  ('DISABLE_ADMIN', 'Disabling admin users is restricted in demo mode', true),
  ('MODIFY_DEMO_MODE', 'Only Super Admins can modify demo mode', true),
  ('EXPORT_DATA', 'Exporting data is restricted in demo mode', true)
ON CONFLICT (action_name) DO NOTHING;

-- ============================================================================
-- 7. TABLES TABLE
-- ============================================================================
-- Stores table information for cafes
CREATE TABLE IF NOT EXISTS tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id UUID NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
  table_number INTEGER NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 4,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(cafe_id, table_number)
);

CREATE INDEX IF NOT EXISTS idx_tables_cafe ON tables(cafe_id);
CREATE INDEX IF NOT EXISTS idx_tables_active ON tables(is_active);

-- ============================================================================
-- 8. BOOKINGS TABLE
-- ============================================================================
-- Stores table bookings with admin tracking
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  table_id UUID NOT NULL REFERENCES tables(id) ON DELETE CASCADE,
  guest_name VARCHAR(255) NOT NULL,
  guest_email VARCHAR(255),
  guest_phone VARCHAR(20),
  guest_count INTEGER NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_table ON bookings(table_id);

-- ============================================================================
-- 9. INDEXES FOR COMMON QUERIES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_users_city ON admin_users(city_id);

-- ============================================================================
-- 10. ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- Note: Enable RLS on these tables for security
-- ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Policy: Super Admin can see all admin users
-- CREATE POLICY "super_admin_view_all_admin_users" ON admin_users
-- FOR SELECT USING (
--   auth.uid() IN (
--     SELECT id FROM admin_users WHERE role = 'SUPER_ADMIN'
--   )
-- );

-- Policy: City Admin can see users in their city
-- CREATE POLICY "city_admin_view_users" ON admin_users
-- FOR SELECT USING (
--   city_id = (
--     SELECT city_id FROM admin_users WHERE id = auth.uid()
--   )
-- );

-- Policy: Cafe Admin can only see their cafe
-- CREATE POLICY "cafe_admin_view_own_cafe" ON cafes
-- FOR SELECT USING (
--   admin_user_id = auth.uid()
-- );

-- ============================================================================
-- 11. TRIGGER FOR UPDATING UPDATED_AT
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER admin_users_update_trigger BEFORE UPDATE ON admin_users
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER cities_update_trigger BEFORE UPDATE ON cities
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER cafes_update_trigger BEFORE UPDATE ON cafes
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tables_update_trigger BEFORE UPDATE ON tables
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER bookings_update_trigger BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
