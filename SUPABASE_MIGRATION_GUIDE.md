# 🔧 Добавление колонок для верификации в Supabase

## 🔴 Ошибка:
```
Database error: Could not find the 'verification_code' column of 'users' in the schema cache
```

## ✅ Решение:

Таблице `users` нужны две новые колонки:
- `verification_code` - для хранения кода верификации (6 цифр)
- `verification_expires` - для хранения времени истечения кода (10 минут)

---

## 📋 Шаг 1: Откройте Supabase

1. Перейдите на: https://app.supabase.com
2. Выберите ваш проект
3. Нажмите на **SQL Editor** (левое меню)

---

## 📝 Шаг 2: Создайте новый запрос

Нажмите **New Query** → **From scratch**

---

## 🔑 Шаг 3: Скопируйте и выполните SQL

Скопируйте этот SQL код и вставьте в редактор:

```sql
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
```

Нажмите **Run** (или Ctrl+Enter)

---

## ✅ Ожидаемый результат:

```
status
──────────────────────────────────────
Verification columns added successfully
```

---

## 🧪 Проверка:

После выполнения скрипта:

1. Нажмите **Table Editor** (левое меню)
2. Выберите таблицу **users**
3. Вы должны увидеть две новые колонки:
   - `verification_code` (VARCHAR)
   - `verification_expires` (TIMESTAMPTZ)

---

## 🚀 После этого:

1. Перезагрузите ваш сервер разработки:
```bash
npm run dev
```

2. Перейдите на: http://localhost:3000/register

3. Попробуйте регистрацию:
   - Заполните форму
   - Отправьте код
   - **Проверьте email** ✉️
   - Введите 6-значный код
   - Создайте аккаунт ✅

---

## ❌ Если не работает:

### Ошибка: "Permission denied"
- Используйте аккаунт с правами админа
- Убедитесь что используете правильный API key

### Ошибка: "Table already has column"
- Код SQL с `IF NOT EXISTS` обработает это
- Просто выполните запрос снова

---

## 📊 Что добавлено:

| Колонка | Тип | Описание |
|---------|-----|---------|
| `verification_code` | VARCHAR(6) | 6-значный код (например: 123456) |
| `verification_expires` | TIMESTAMPTZ | Время истечения кода (UTC) |

---

**После применения SQL скрипта отправка кодов верификации будет работать!** ✨
