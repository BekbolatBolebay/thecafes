-- RLS Policies for users table - Allow registration and data management

-- Ағымды қолданушыға ўндау болсын өндеу
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Жаңа пайдаланушы құру қабылдау (тіркеу үшін)
CREATE POLICY "Allow new user registration" ON users 
FOR INSERT 
WITH CHECK (true);

-- Пайдаланушылар өз деректерін көре алсын
CREATE POLICY "Users can view their own data" ON users 
FOR SELECT 
USING (auth.uid() = id);

-- Пайдаланушылар өз деректерін өзгерте алсын
CREATE POLICY "Users can update their own data" ON users 
FOR UPDATE 
USING (auth.uid() = id);

-- Админ барлық пайдаланушыларды көре алсын
CREATE POLICY "Admins can view all users" ON users 
FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- Админ пайдаланушы деректерін өзгерте алсын
CREATE POLICY "Admins can update users" ON users 
FOR UPDATE 
USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);
