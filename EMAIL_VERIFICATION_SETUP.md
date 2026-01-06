# Email Verification Setup Guide

## Overview
This guide will help you fix the 401 and 500 errors in the registration and email verification flow.

## Issues Fixed

### 1. **500 Error on `/api/send-verification`**
**Problem:** Missing or incorrect EMAIL_USER and EMAIL_PASS environment variables
**Solution:** Configure Gmail SMTP credentials

### 2. **Incorrect Verification Code Endpoint**
**Problem:** Register page was using GET on `/api/send-verification` instead of POST on `/api/verify-code`
**Solution:** Updated register flow to use correct endpoint

### 3. **User Profile Data Display**
**Problem:** After registration, user data should display on profile page
**Solution:** Profile page is configured to display all user data from store

---

## Step 1: Configure Gmail SMTP Credentials

### Option A: Using Gmail (Recommended)

1. **Enable 2-Step Verification:**
   - Go to https://myaccount.google.com/security
   - Click "2-Step Verification"
   - Follow the setup process

2. **Create an App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or your device)
   - Generate the password
   - Copy the 16-character password (without spaces)

3. **Update `.env.local`:**
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx
   ```
   
   **Remove spaces from the app password:**
   ```
   EMAIL_PASS=xxxxxxxxxxxxxxxx
   ```

### Option B: Using Other Email Services

For Outlook, Yahoo, or other providers, update the email transporter in `/app/api/send-verification/route.ts`:

```typescript
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",  // Change to: "outlook365", "yahoo", etc.
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}
```

---

## Step 2: Environment Variables Setup

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in all required values:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxxxxxxxxxx

# JWT Secret (generate random 32+ chars)
JWT_SECRET=your-random-secret-key-here-at-least-32-characters

# Optional: SMS (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxx...
TWILIO_AUTH_TOKEN=xxxxxxxx...
TWILIO_PHONE_NUMBER=+1234567890
```

---

## Step 3: Registration Flow

### Registration Steps (Updated)

**Step 1:** User enters name, email, phone, password
**Step 2:** User enters city and address
- **Triggers:** `POST /api/send-verification` 
- **Generates:** 6-digit verification code
- **Sends:** Email with verification code

**Step 3:** User enters verification code
- **Validates:** `POST /api/verify-code`
- **Clears:** Verification code from database (one-time use)

**Step 4:** User account created
- **Creates:** Supabase Auth user
- **Stores:** User profile in `public.users` table
- **Redirects:** To `/profile`

---

## Step 4: Verification Code Email

The verification email includes:
- ✅ 6-digit code in large, bold text
- ✅ 10-minute expiration timer
- ✅ User's name in greeting
- ✅ RTL (Right-to-Left) layout for Kazakh text

---

## Step 5: Profile Page Data Display

After successful registration, the profile page (`/profile`) displays:

```
User Avatar (with initials)
Full Name
Email
Phone
City
Address
Account Information
```

All data is pulled from the global store (`useApp()`) which syncs with Supabase.

---

## API Endpoints Reference

### 1. Send Verification Code
```
POST /api/send-verification
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "User Name",
  "phone": "+7 123 456 7890"
}

Response:
{
  "success": true,
  "message": "Растау коды email-ға жіберілді"
}
```

### 2. Verify Code
```
POST /api/verify-code
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456"
}

Response:
{
  "success": true,
  "message": "Email verified successfully",
  "userId": "user-id-here"
}
```

### 3. Register User
```
POST /api/auth/register (via useApp().register())

User data is stored in:
- Supabase Auth (credentials)
- public.users table (profile)
```

---

## Troubleshooting

### Error: "Email service not configured"
**Solution:** Add EMAIL_USER and EMAIL_PASS to `.env.local`

### Error: "Failed to send verification email"
**Possible causes:**
1. Gmail app password is incorrect
2. 2-Step Verification not enabled
3. Space in the app password wasn't removed
4. Email service is down

**Solution:**
- Check Gmail's "Sign-in & security" settings
- Verify the app password is correct
- Remove all spaces from EMAIL_PASS

### Verification code not arriving
**Check:**
1. Spam/Junk folder
2. Email address is correct
3. Server logs for errors
4. Verify environment variables are loaded

### User data not showing on profile
**Check:**
1. User is authenticated (`isAuthenticated` is true)
2. User object exists in store
3. User was successfully created in Supabase
4. Try refreshing the page

---

## Testing the Flow

### Manual Test:
1. Navigate to `/register`
2. Enter:
   - Name: Test User
   - Email: your-test@gmail.com
   - Phone: +7 123 456 7890
   - Password: password123
   - City: Almaty
   - Address: 123 Test St
3. Check email for verification code
4. Enter code on Step 3
5. Should redirect to `/profile` with all data displayed

---

## Security Notes

✅ **Verification Code Security:**
- 6-digit codes (1 million combinations)
- 10-minute expiration
- One-time use (cleared after verification)
- Stored in Supabase with service role key protection

✅ **Password Security:**
- App passwords are specific to application
- Can revoke at any time
- Not your actual Gmail password

✅ **Email Protection:**
- Email is verified before registration
- User cannot register with fake emails

---

## Next Steps

After getting email verification working:
1. Set up SMS notifications (optional Twilio)
2. Configure order confirmation emails
3. Add password reset functionality
4. Implement email notification preferences

---

## Files Modified

- ✅ `app/api/send-verification/route.ts` - Added environment variable checks and better error messages
- ✅ `app/register/page.tsx` - Fixed verification endpoint from GET to POST
- ✅ `.env.local.example` - Created template with instructions

