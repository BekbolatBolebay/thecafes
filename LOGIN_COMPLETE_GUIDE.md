# Кіру Жүйесін Толық Құрылымы | Complete Login System Setup

## 📊 Жүйеңіздің Статусы | System Status

```
┌─────────────────────────────────────────────────────────────┐
│                    ✅ ПОЛНОСТЬЮ РАБОЧАЯ СИСТЕМА            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ✅ Администратор вход (Admin Login)                       │
│  ✅ Пользовательская регистрация (User Registration)       │
│  ✅ Пользовательский вход (User Login)                     │
│  ✅ JWT Токены (JWT Tokens)                                │
│  ✅ RLS Безопасность (RLS Security)                        │
│  ✅ Триггеры базы данных (Database Triggers)              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Требования Системы | System Requirements

| Компонент | Статус | Примечание |
|-----------|--------|-----------|
| `Supabase URL` | ✅ Установлено | `https://zipzanawdbzsrgxthzvb.supabase.co` |
| `Supabase ANON KEY` | ✅ Установлено | Публичный ключ |
| `SERVICE ROLE KEY` | ✅ Установлено | Для админ операций |
| `JWT_SECRET` | ✅ Установлено | `your-super-secret-jwt-key-...` |
| `Database Trigger` | ✅ Установлено | `handle_new_user()` |
| `RLS Policies` | ✅ Установлено | Все политики готовы |

---

## 🚀 Быстрый Старт | Quick Start

### 1️⃣ Запустить Сервер | Start Server

```bash
cd "/home/bekbolat/Жүктемелер/food-delivery-app"
npm run dev
```

Ожидаемый результат:
```
✓ Ready in 439ms
- Local:         http://localhost:3000
```

### 2️⃣ Тест Администратора | Test Admin Login

**Метод 1: Через браузер**
```
1. Откройте: http://localhost:3000/login
2. Email: bolebay.bekbolat.25@gmail.com
3. Password: 1234Pppp!
4. Нажмите "Login"
5. ✅ Перенаправление: /admin/dashboard
```

**Метод 2: Через cURL**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"bolebay.bekbolat.25@gmail.com","password":"1234Pppp!"}'
```

**Ожидаемый результат:**
```json
{
  "success": true,
  "user": {
    "id": "0f689949-09ec-4683-a17a-43ddef6a3135",
    "email": "bolebay.bekbolat.25@gmail.com",
    "role": "SUPER_ADMIN",
    "firstName": "Bekbolat",
    "lastName": "Bolebay"
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "redirectUrl": "/admin/dashboard"
}
```

---

## 👤 Управление Администраторами | Admin Users Management

### Доступные Администраторы | Available Admins

| Email | Пароль | Роль | Статус |
|-------|--------|------|--------|
| `bolebay.bekbolat.25@gmail.com` | `1234Pppp!` | SUPER_ADMIN | ✅ Активен |
| `nugnurd@gmail.com` | `1234Pppp!` | SUPER_ADMIN | ✅ Активен |

### Как Добавить Нового Администратора | How to Add New Admin

#### Вариант 1: SQL в Supabase Dashboard

```sql
-- 1. Сгенерируем хеш пароля в Node.js
-- const bcrypt = require('bcryptjs');
-- const hash = await bcrypt.hash('YourPassword123!', 10);
-- Скопируем результат

-- 2. Вставим в базу
INSERT INTO admin_users (
  email,
  password_hash,
  first_name,
  last_name,
  role,
  is_active
) VALUES
  (
    'newadmin@example.com',
    '$2b$10$YOUR_BCRYPT_HASH_HERE',
    'First',
    'Last',
    'SUPER_ADMIN',
    true
  );
```

#### Вариант 2: Через скрипт

```bash
# scripts/generate-bcrypt-hash.js уже готов
node scripts/generate-bcrypt-hash.js

# Введите пароль, скопируйте хеш в SQL выше
```

---

## 👥 Регистрация Пользователей | User Registration

### Полный Процесс | Complete Flow

```
┌─────────────────────────────────────────┐
│  1. Пользователь идет на /register      │
├─────────────────────────────────────────┤
│  2. Заполняет форму (Шаг 1)             │
│     - Имя                               │
│     - Email                             │
│     - Пароль (x2)                       │
├─────────────────────────────────────────┤
│  3. Выбирает город (Шаг 2)              │
│     - Город                             │
│     - Адрес (опционально)               │
├─────────────────────────────────────────┤
│  4. Получает код верификации (Шаг 3)   │
│     - На email и SMS                    │
├─────────────────────────────────────────┤
│  5. Вводит код и нажимает "Register"   │
├─────────────────────────────────────────┤
│  6. Система создает:                    │
│     ├─ auth.users (Supabase Auth)      │
│     ├─ public.users (Profile)          │
│     └─ JWT Token                       │
├─────────────────────────────────────────┤
│  7. Автоматически логирует пользователя │
├─────────────────────────────────────────┤
│  8. Перенаправляет на /profile          │
└─────────────────────────────────────────┘
```

### Пошаговая Инструкция | Step-by-Step

#### Шаг 1: Базовая информация
```
Открыть: http://localhost:3000/register

Заполнить:
┌──────────────────────────────────┐
│ Имя:           | Иван Иванов    │
│ Email:         | ivan@gmail.com │
│ Пароль:        | SecurePass123! │
│ Подтв. пароль: | SecurePass123! │
│ [Далее →]                        │
└──────────────────────────────────┘
```

#### Шаг 2: Адрес
```
┌──────────────────────────────────┐
│ Город:    | [Выбрать ▼]         │
│           | - Астана            │
│           | - Алматы            │
│           | - Қызылорда         │
│ Адрес:    | ул. Ленина, 1      │
│ [Далее →]                        │
└──────────────────────────────────┘
```

#### Шаг 3: Верификация
```
Коды отправлены на:
  📧 ivan@gmail.com
  📱 +7 (__) ___-__-__

Введите полученный код из Email или SMS:
┌──────────────────────────────────┐
│ Код: | 1 2 3 4 5 6            │
│ [Регистрация →]                  │
└──────────────────────────────────┘

⏳ Подождите 2-3 сек...
✅ Готово! Профиль создан.
🔄 Перенаправление на /profile...
```

### Тестирование Регистрации | Test Registration

**Быстрый тест (5 минут):**

```bash
# 1. Откройте браузер
http://localhost:3000/register

# 2. Заполните:
Name:     Test User
Email:    test.user@gmail.com
Password: TestPass123!
City:     Қызылорда
Address:  Test Address

# 3. Нажмите "Далее" → "Далее"

# 4. В консоли должно быть:
[AuthService] Auth successful, now fetching user profile
[AuthService] User profile found, generating token

# 5. Автоматический редирект на /profile ✅
```

---

## 🔑 Вход Пользователей | User Login

### Процесс Входа | Login Process

```
POST /api/auth/login
├─ Email: user@example.com
├─ Password: password123
│
├─ Проверка:
│  ├─ 1. Администраторы (/admin_users) → ❌ Нет
│  ├─ 2. Supabase Auth (signInWithPassword) → ✅ Да!
│  ├─ 3. Профиль пользователя (/users) → ✅ Да!
│  └─ 4. Генерация JWT Token → ✅ Готово!
│
└─ Ответ:
   ├─ success: true
   ├─ user: { id, email, role, firstName, lastName }
   ├─ token: "eyJhbGci..."
   └─ redirectUrl: "/profile"
```

### Тестирование Входа | Test Login

```bash
# После успешной регистрации пользователя:
# test.user@gmail.com / TestPass123!

curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.user@gmail.com",
    "password": "TestPass123!"
  }'

# Ожидаемый результат:
# {
#   "success": true,
#   "user": {
#     "id": "550e8400-e29b-41d4-a716-446655440000",
#     "email": "test.user@gmail.com",
#     "role": "USER",
#     "firstName": "Test",
#     "lastName": "User"
#   },
#   "token": "eyJhbGci...",
#   "redirectUrl": "/profile"
# }
```

---

## 🔒 Безопасность | Security

### JWT Токены | JWT Tokens

```javascript
// Структура JWT Token
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "user-id-here",
    "email": "user@example.com",
    "role": "USER" | "SUPER_ADMIN" | "CITY_ADMIN" | "CAFE_ADMIN",
    "iat": 1766491601,    // Issued at
    "exp": 1766578001     // Expires in 24h
  },
  "signature": "RIjH2bawT5ca..."
}
```

### RLS (Row Level Security) | RLS Policies

```sql
-- 1. Пользователи видят только свои данные
SELECT * FROM users
WHERE auth.uid() = id;

-- 2. Администраторы видят всех
SELECT * FROM users
WHERE EXISTS (
  SELECT 1 FROM users 
  WHERE id = auth.uid() AND is_admin = true
);

-- 3. Регистрация разрешена
INSERT INTO users (...)
VALUES (...);
```

### Переменные Окружения | Environment Variables

```bash
# ✅ Требуется для работы
NEXT_PUBLIC_SUPABASE_URL=https://zipzanawdbzsrgxthzvb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
SUPABASE_JWT_SECRET=JeBxqJbi...
JWT_SECRET=your-super-secret-jwt-key-...

# 🔐 ОБЯЗАТЕЛЬНО ИЗМЕНИТЕ В PRODUCTION!
# - Сгенерируйте новые ключи
# - Используйте сильные пароли (32+ символов)
# - Не коммитьте в git!
```

---

## 🐛 Диагностика и Решение Проблем | Troubleshooting

### Проблема 1: "Invalid login credentials"

**Симптомы:**
```
❌ Вход не работает
❌ Сообщение: "Invalid email or password"
```

**Причины и решения:**

| Причина | Решение |
|---------|---------|
| Пользователь не существует | Зарегистрируйте нового пользователя |
| Пароль неверный | Проверьте правильность пароля |
| Email не подтвержден | Подтвердите email через ссылку в письме |
| Пользователь деактивирован | Активируйте в `admin_users` таблице |

**Проверка:**
```sql
-- Проверить пользователя в auth.users
SELECT id, email, email_confirmed_at FROM auth.users
WHERE email = 'user@example.com';

-- Проверить профиль
SELECT id, email, full_name FROM public.users
WHERE email = 'user@example.com';
```

### Проблема 2: "RLS violation"

**Симптомы:**
```
❌ Ошибка: "new row violates row-level security policy"
❌ Регистрация не работает
```

**Решение:**

```sql
-- Проверить RLS policies
SELECT * FROM information_schema.table_privileges
WHERE table_name = 'users';

-- Пересоздать trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Скрипт:**
```bash
# Запустить в Supabase SQL Editor
cat scripts/05-auth-trigger.sql | pbcopy
# Вставить в SQL Editor и выполнить
```

### Проблема 3: Email верификация не работает

**Симптомы:**
```
❌ Коды не приходят
❌ Ошибка отправки email
```

**Проверка переменных:**
```bash
# .env.local должен иметь:
EMAIL_USER=bolebay.bekbolat.25@gmail.com
EMAIL_PASS=dgks ajth lgjh zhls
RESEND_API_KEY=re_NPePz9pC_NNEGMDt8M73zEUsfyZas1RpW
```

**Тест Email:**
```bash
curl -X POST http://localhost:3000/api/send-verification \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your.email@gmail.com",
    "phone": "+77012345678",
    "name": "Test User"
  }'

# Проверьте: Gmail → Inbox / Spam папка
```

### Проблема 4: JWT Token not valid

**Симптомы:**
```
❌ Ошибка: "JWT signature verification failed"
❌ Сессия теряется при перезагрузке
```

**Решение:**

```bash
# Проверить JWT_SECRET
grep JWT_SECRET .env.local

# Должно быть что-то вроде:
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-

# Если нет, добавить:
echo "JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-" >> .env.local
```

**Проверка токена:**
```bash
# На jwt.io вставить токен и проверить payload
# Должны видеть: userId, email, role, exp
```

---

## 📝 API Справочник | API Reference

### POST /api/auth/login

```bash
# Запрос
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

# Ответ 200 OK
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "role": "USER",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "redirectUrl": "/profile"
}

# Ответ 401 Unauthorized
{
  "success": false,
  "message": "Invalid credentials"
}
```

### Другие Endpoints

| Endpoint | Метод | Назначение |
|----------|-------|-----------|
| `/login` | GET | Страница входа |
| `/register` | GET | Страница регистрации |
| `/api/send-verification` | POST | Отправка кода верификации |
| `/profile` | GET | Профиль пользователя (защищено) |
| `/admin/dashboard` | GET | Админ панель (защищено) |

---

## ✅ Контрольный Список | Checklist

### Инициализация | Initial Setup
- [x] Supabase проект создан
- [x] Environment переменные установлены
- [x] Database таблицы созданы
- [x] Triggers установлены
- [x] RLS policies активны
- [x] Admin users добавлены

### Функциональность | Functionality
- [x] Admin login работает
- [x] User registration работает
- [x] User login работает
- [x] Email verification работает
- [x] JWT tokens генерируются
- [x] Redirect работает корректно
- [x] Session сохраняется

### Безопасность | Security
- [x] Пароли хешированы (bcrypt)
- [x] JWT подписаны
- [x] RLS включена
- [x] Sensative данные в .env
- [ ] В production: изменить пароли и ключи

---

## 📚 Дополнительные Ресурсы | Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Auth Best Practices](https://supabase.com/docs/guides/auth)
- [JWT Tokens](https://jwt.io/)
- [Bcrypt Hashing](https://www.npmjs.com/package/bcryptjs)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

## 💬 Команда Поддержки | Support

Если что-то не работает:

1. **Проверьте логи консоли:**
   ```
   Ctrl+Shift+I → Console tab
   Ищите ошибки с [AuthService] или [Login API]
   ```

2. **Проверьте Network:**
   ```
   F12 → Network tab
   Проверьте POST /api/auth/login запрос
   Смотрите response status и body
   ```

3. **Проверьте Supabase:**
   ```
   Dashboard → SQL Editor
   SELECT * FROM auth.users;
   SELECT * FROM admin_users;
   SELECT * FROM users;
   ```

4. **Очистите браузер:**
   ```
   Очистите localStorage и cookies
   Перезагрузите страницу (Ctrl+F5)
   ```

