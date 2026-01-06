-- Make password_hash nullable (Суpabase Auth пароль басқарғысында)
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
