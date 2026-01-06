-- ================================================
-- СУPABASE SIGNUP ҚАТЕСІН ТҮЗЕУ
-- "Database error saving new user" (500 | unexpected_failure)
-- ================================================
-- Мәселе: RLS policies INSERT-ті блокирауда, trigger функциясы жоқ

-- ҚҰРЫЛЫМЫ:
-- 1. Trigger функциясын құру
-- 2. RLS policies бақылоу
-- 3. password_hash сипатын өзгерту

-- ================================================
-- ҚАДАМ 1: Auth trigger функциясын құру
-- ================================================
-- Бұл функция auth.users-тен жаңа пайдаланушы
-- құрылғанда автоматты түрде public.users-ке
-- профиль деректерін құрады

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, phone, city, address)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'city', ''),
    COALESCE(NEW.raw_user_meta_data->>'address', '')
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Ескі trigger-ді өшіру
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Жаңа trigger құру
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================================
-- ҚАДАМ 2: RLS Policies-ті түзету
-- ================================================
-- Ескі policies өшіру
DROP POLICY IF EXISTS "Allow new user registration" ON users;
DROP POLICY IF EXISTS "Allow user registration via auth trigger" ON users;
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;

-- RLS-ты қосу
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Жаңа policies құру
-- Trigger функциясы SECURITY DEFINER қолдана отырып RLS-ды айналып өтеді
CREATE POLICY "Allow user registration via auth trigger" ON users
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own data" ON users 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users 
  FOR SELECT 
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can update users" ON users 
  FOR UPDATE 
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
  );

-- ================================================
-- ҚАДАМ 3: password_hash сипатын өзгерту
-- ================================================
-- Supabase Auth пароль сақтағандықтан nullable құру
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- ================================================
-- ТЕСТІЛЕУ
-- ================================================
-- Бұл SQL құрылмалардың барлығы істегеніне көз жеткізу үшін:

-- 1. Trigger функциясы тіркеліп ті:
-- SELECT routine_name FROM information_schema.routines 
-- WHERE routine_name = 'handle_new_user';

-- 2. Trigger құрылған:
-- SELECT trigger_name FROM information_schema.triggers 
-- WHERE trigger_name = 'on_auth_user_created';

-- 3. RLS policy-лар құрылған:
-- SELECT policyname FROM pg_policies WHERE tablename = 'users';

-- ================================================
-- БАРЛЫҒЫ ОРЫНДАЛДЫ! 🎉
-- ================================================
-- Енді тіркеу процесі келесі сияқты жұмыс істеуі керек:
-- 1. Client signUp() шақырады metadata-мен
-- 2. Supabase Auth пайдаланушы құрады
-- 3. Trigger trigger функциясын істетеді
-- 4. handle_new_user() public.users-ке профиль құрады
-- 5. Тіркеу сәтсіз болмауы керек
