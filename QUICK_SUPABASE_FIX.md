# ⚡ БЫСТРОЕ РЕШЕНИЕ - Добавьте колонки в Supabase

## 📍 3 Простых Шага:

### Шаг 1️⃣: Откройте Supabase SQL Editor

```
https://app.supabase.com 
→ Ваш проект 
→ SQL Editor (левое меню)
→ "New Query"
```

### Шаг 2️⃣: Вставьте этот SQL код

```sql
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS verification_code VARCHAR(6),
ADD COLUMN IF NOT EXISTS verification_expires TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_users_verification_code 
ON public.users(verification_code);

CREATE INDEX IF NOT EXISTS idx_users_verification_expires 
ON public.users(verification_expires);

SELECT 'Verification columns added successfully' as status;
```

### Шаг 3️⃣: Нажмите "Run"

```
Ожидаемый результат:
✅ Verification columns added successfully
```

---

## ✅ После этого:

1. **Перезагрузите сервер:**
   ```bash
   npm run dev
   ```

2. **Тестируйте:**
   - http://localhost:3000/register
   - Заполните форму
   - Отправьте код
   - Проверьте email ✉️

---

## 🔍 Проверка в Supabase:

1. **Table Editor** (левое меню)
2. Выберите **users**
3. Должны быть две новые колонки:
   - ✅ `verification_code`
   - ✅ `verification_expires`

---

**Готово!** Теперь отправка кодов работает! 🎉
