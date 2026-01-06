# Quick Reference: Social Login Implementation

## What Was Implemented

### ✅ Google & Apple Login Buttons on Registration Page
- Located on Step 1 of registration
- Below email/password fields
- Professional styling matching login page

### ✅ Automatic Step Skipping
- Google/Apple users skip directly to Step 2
- Only need to select City and Address
- **No verification code required**

### ✅ OAuth Providers Configured
- Google OAuth 2.0 with email scope
- Apple Sign In with JWT validation

---

## Registration Comparison

| Feature | Email/Password | Social Login |
|---------|---|---|
| Step 1 | Full personal info | ❌ Skipped |
| Step 2 | City & Address | ✅ City & Address |
| Step 3 | Email verification code | ❌ Skipped |
| **Total Steps** | **3** | **2** |
| **Verification Required** | Yes | **No** |
| **Data Pre-filled** | None | Email & Name |

---

## User Journey

```
User clicks "Continue with Google/Apple"
    ↓
[OAuth Provider Login]
    ↓
"Redirect to application?"
    ↓
[Back to app, Step 2]
    ↓
Select City
Select Address
Click "Next"
    ↓
✅ Registration Complete!
```

---

## To Enable This Feature

### 1. Get OAuth Credentials

**Google:**
- Go to console.cloud.google.com
- Create project > Enable Google+ API
- Create OAuth credentials
- Get Client ID & Secret

**Apple:**
- Go to developer.apple.com
- Create App ID with Sign in with Apple
- Create Services ID
- Generate private key (.p8)
- Get Team ID & Key ID

### 2. Add Environment Variables

Create `.env.local`:
```env
# Google
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret

# Apple (if using)
APPLE_CLIENT_ID=your-service-id
APPLE_TEAM_ID=your-team-id
APPLE_KEY_ID=your-key-id
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# General
NEXTAUTH_URL=http://localhost:3000
```

### 3. Test Local
```bash
npm run dev
# Visit http://localhost:3000/register
# Try Google or Apple buttons
```

---

## Code Changes Summary

### Files Modified:
1. `app/register/page.tsx` - Added social buttons & flow

### Files Created:
2. `app/register/social-callback/page.tsx` - OAuth callback handler
3. `app/api/auth/google/route.ts` - Google redirect
4. `app/api/auth/google/callback/route.ts` - Google token exchange
5. `app/api/auth/apple/route.ts` - Apple redirect
6. `app/api/auth/apple/callback/route.ts` - Apple token exchange

---

## Key Logic

### In `register/page.tsx`:

```tsx
// Social login flag
const [isSocialLogin, setIsSocialLogin] = useState(false)

// Handlers for Google/Apple
const handleGoogleLogin = () => {
  window.location.href = `/api/auth/google?redirectTo=/register/social-callback`
}

// Step 2 skips verification for social
const handleStep2Submit = (e) => {
  if (isSocialLogin) {
    handleStep3Submit(e) // Complete directly
    return
  }
  sendVerificationCode()
  setStep(3)
}

// Step 3 skips verification check for social
const handleStep3Submit = async (e) => {
  if (!isSocialLogin) {
    // Verify code
  }
  // Register user
}
```

---

## Testing Checklist

- [ ] See Google/Apple buttons on registration page
- [ ] Click Google button → redirects to Google login
- [ ] Click Apple button → redirects to Apple login
- [ ] After auth → redirects to Step 2 (address/city)
- [ ] Email pre-filled from provider
- [ ] Name pre-filled from provider
- [ ] Select city and address
- [ ] Click Next → no verification code screen
- [ ] Registration completes successfully
- [ ] User logged in and redirected to profile

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Redirect URI mismatch" | Check exact match in OAuth provider settings |
| Empty name/email | OAuth provider may not have permission to share |
| Apple OAuth not working | Need HTTPS (use ngrok for local testing) |
| OAuth buttons not visible | Check if Step 1 renders correctly |
| Stuck at Step 2 | Check browser console for errors |

---

## Notes

- Social login is **optional** - email/password still works
- Verification code **required for email/password only**
- Social logins use **OAuth provider authentication** (more secure)
- No sensitive data stored client-side
- All OAuth tokens validated server-side

---

## Support Docs

- See `OAUTH_SETUP_GUIDE.md` for detailed provider setup
- See `SOCIAL_LOGIN_IMPLEMENTATION.md` for architecture details
