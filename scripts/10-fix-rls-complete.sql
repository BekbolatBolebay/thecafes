-- ================================================
-- RLS Саясатын ТОЛЫҚТАЙ Өшіру және Қайта құру
-- Infinite Recursion Мәселесін Шешу
-- ================================================

-- ҚАДАМ 1: Барлық ескі policies-ті өшіру
DROP POLICY IF EXISTS "Allow new user registration" ON users;
DROP POLICY IF EXISTS "Allow user registration via auth trigger" ON users;
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;

-- ҚАДАМ 2: RLS-ты ҳамма ішінен өшіру және қайта қосу
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ҚАДАМ 3: ЖАҢА саясаттар (РЕКУРСИЯСЫЗ логика)

-- 1️⃣ Пайдаланушы құру (тіркеу үшін) - ләззімді
CREATE POLICY "Allow insert for registration" ON users
  FOR INSERT
  WITH CHECK (true);

-- 2️⃣ Пайдаланушы өз деректерін қораңыз
CREATE POLICY "Users can read own data" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- 3️⃣ Пайдаланушы өз деректерін өндіреңіз (РЕКУРСИЯСЫЗ)
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4️⃣ PUBLIC ACCESS: Тіркелген пайдаланушы барлық пайдаланушыларды қара алсын (бұл орынды емес, өндіргім)
-- DROP THIS - Өшіру қажет
-- CREATE POLICY "Allow select for authenticated" ON users
--   FOR SELECT
--   USING (auth.role() = 'authenticated');

-- ================================================
-- ОРЫНДАУ СТАТУСЫН ТЕКСЕРУ
-- ================================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- ================================================
-- ЕСЕПТІЛІ ТЕСТ
-- ================================================
-- 1. Суpabase Authenticated бөлімінде өндіргіңіз:
-- SELECT COUNT(*) FROM users; -- Өз деректерін қара алсын

-- 2. SELECT * FROM users; -- Өзге адамдың деректерін қара алмасын

-- 3. UPDATE users SET phone = '555-0000' WHERE id = auth.uid(); -- Өндіре алсын

-- 4. UPDATE users SET phone = '555-1111' WHERE id != auth.uid(); -- Өндіре алмасын (RLS қоршағалап салсын)
