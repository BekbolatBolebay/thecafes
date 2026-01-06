# Supabase SignUp қатесін түзеу (Казахша)

## Қатеседі
```
AuthApiError: Database error saving new user
(500 | unexpected_failure | AuthApiError)
```

## Мәселесі

Supabase Auth таблицасы (`auth.users`) және орманызды қолданушы таблицасы (`public.users`) байланыссыз болған. Регистрация кезінде:

1. ✅ Supabase Auth-та пайдаланушы құрылады
2. ❌ `public.users` таблицасына деректер жазылмайды (RLS ынамдығы қатесі)
3. ❌ Регистрация сәтсіз болады: "Database error saving new user"

## Шешімі

### 1️⃣ Database Trigger құру
Автоматты түрде `auth.users`-тен жаңа пайдаланушы құрылғанда `public.users`-ге профиль деректерін көшіру үшін trigger функциясы құру керек.

Файл: `/scripts/06-fix-signup-error.sql`

Supabase SQL Editor-де бұл SQL командаларын орындау:
```bash
1. Supabase dashboard → SQL Editor
2. 06-fix-signup-error.sql файлын қосу және орындау
3. Немесе SUPABASE_RLS_SETUP.sql файлын орындау (жаңартылған версия)
```

### 2️⃣ Client коды (store.tsx)
Регистрация кезінде metadata-мен signUp() шақыру:

```typescript
const { data, error } = await supabaseClient.auth.signUp({
  email: userData.email,
  password: userData.password,
  options: {
    data: {
      full_name: userData.name,
      phone: userData.phone,
      city: userData.city,
      address: userData.address || "",
    },
  },
})
```

### 3️⃣ RLS Policies
UPDATE: Trigger SECURITY DEFINER қолдайды, сондықтан RLS-ты айналып өтеді

## Құрылымы

```
auth.users (SupabaseAuth)
    ↓
trigger: on_auth_user_created
    ↓
function: handle_new_user()
    ↓
public.users (Our users table) ✅
```

## Қайта-тіркеу

1. Supabase dashboard-та SQL Editor ашыңыз
2. `/scripts/06-fix-signup-error.sql` немесе `/scripts/SUPABASE_RLS_SETUP.sql` орындаңыз
3. Қосымша: Ежімегі `lib/store.tsx` файлда signUp options metadata-сі ішінде бар

## Тестілеу

```bash
1. /register парақына өтіңіз
2. Деректерді толтырыңыз және тіркеңіз
3. Консольде ❌ қатесі жоқ болуы керек
4. Email растауынан кейін аккаунтқа кіріңіз
```

## Қиындығы

Егер әрі де қатесі болса:
- Supabase Logs-та (Settings → Database → SQL queries logs) қараңыз
- `handle_new_user()` функциясы істегенін сүреу
- `raw_user_meta_data` өндіктемелі барлық деректерді құраса

## Қосымша

- Trigger файлы: `scripts/05-auth-trigger.sql`
- Түзету файлы: `scripts/06-fix-signup-error.sql` (ұсынылған)
- RLS қалпыстану: `scripts/SUPABASE_RLS_SETUP.sql`
