# 🚨 RLS Infinite Recursion Мәселесін Шешу

## Мәселе
```
Қолданушы деректері қатесі: "infinite recursion detected in policy for relation \"users\""
```

**Себебі:** RLS саясатындағы `EXISTS` сұрауы өзін-өзі қайта сұрап тұрады.

---

## 🔧 Шешімі (3 қадам)

### **1️⃣ Суpabase Dashboard-та SQL Editor ашыңыз**

- URL: https://supabase.com/dashboard
- Жобаңыз таңдаңыз
- SQL Editor батырмасын басыңыз

### **2️⃣ Төмендегі SQL кодын орындаңыз:**

```sql
-- ҚАДАМ 1: Барлық ескі policies өшіру
DROP POLICY IF EXISTS "Allow new user registration" ON users;
DROP POLICY IF EXISTS "Allow user registration via auth trigger" ON users;  
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;

-- ҚАДАМ 2: RLS-ты қайта ету
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ҚАДАМ 3: ЖАҢА саясаттар (рекурсиясыз)
CREATE POLICY "auth_trigger_can_insert" ON users
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "user_can_read_self" ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "user_can_update_self" ON users
  FOR UPDATE
  USING (auth.uid() = id);
```

### **3️⃣ "Run" батырмасын басыңыз (Ctrl+Enter)**

✅ Қайтарындыңыз болсын: `Query executed successfully`

---

## ✅ Тестілеу

Браузерде қолданушы кірісін сынап өтіңіз:

1. **Логин орындау** - дәл құлақ айтсын
2. **Профильді өндіргі** - дәл құлақ айтсын
3. **Консолды тексергі** - қатесі жоқ болсын

---

## 📝 Файлдар

- `SUPABASE_RLS_EMERGENCY_FIX.sql` - Осы сценарий
- `scripts/10-fix-rls-complete.sql` - Толық документация

---

## 🆘 Егер әлі де мәселе болса:

1. Суpabase Dashboard-та `Authentication > Users` бөлімінде қолданушы болып барын тексеріңіз
2. `Table Editor > users` табысында деректер көрсінсе өндіргі болсын
3. Браузер консолын ашыңыз (F12) және қатені табыңыз
