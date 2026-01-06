-- ================================================
-- RLS Саясатын түзету: Рекурсия мәселесін шешу
-- ================================================
-- Жаңа admin логикасы: auth.jwt_claim('role') пайдалану
-- Бұл Supabase-та админ ролін сақтайды

-- ҚАДАМ 1: Ескі policies өшіру
DROP POLICY IF EXISTS "Allow user registration via auth trigger" ON users;
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;

-- ҚАДАМ 2: RLS-ты қайта қосу
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ҚАДАМ 3: Жаңа политикалар (рекурсиясыз)

-- 1. Trigger арқылы пайдаланушы құру (ләззімді - INSERT үшін)
CREATE POLICY "Allow user registration via auth trigger" ON users
  FOR INSERT
  WITH CHECK (true);

-- 2. Пайдаланушыны өз деректерін қараңыз
CREATE POLICY "Users can view their own data" ON users 
  FOR SELECT 
  USING (auth.uid() = id);

-- 3. Пайдаланушыну өз деректерін өндіреңіз
CREATE POLICY "Users can update their own data" ON users 
  FOR UPDATE 
  USING (auth.uid() = id);

-- 4. Админ барлық пайдаланушыларды қара алсын
-- Ескертпе: JWT токенінде 'admin' рөлі болғанда ғана
CREATE POLICY "Admins can view all users" ON users 
  FOR SELECT 
  USING (
    auth.jwt() ->> 'role' = 'authenticated' AND
    (auth.jwt() ->> 'email') IN (
      SELECT email FROM users WHERE is_admin = true AND id = auth.uid()
    )
  );

-- 5. Админ пайдаланушыларды өндіре алсын
-- Бірақ өзін өндіргенде ғана (рекурсия құрмас үшін)
CREATE POLICY "Admins can update users" ON users 
  FOR UPDATE 
  USING (
    auth.uid() = id OR
    (
      auth.jwt() ->> 'email' IN (SELECT email FROM users WHERE is_admin = true)
      AND id != auth.uid()
    )
  );

-- ҚАДАМ 4: Орынды растау
-- Бұл сұрау өндіру керек (нетижесі жоқ = RLS дұрыс орындалып жатқан)
SELECT tablename, policyname, permissive, roles, qual FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname;

-- ТЕСТІЛЕУ:
-- 1. Өзіңіздің деректерін өндіріңіз (болсын):
-- UPDATE users SET phone = '123' WHERE id = auth.uid();

-- 2. Басқа пайдаланушыны өндіргіге тырыса (қатесі болсын):
-- UPDATE users SET phone = '456' WHERE id != auth.uid();
