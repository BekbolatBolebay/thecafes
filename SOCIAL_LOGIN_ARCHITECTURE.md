# Social Login Architecture & Flow Diagrams

## 1. Registration Flow Comparison

### Traditional Email/Password Registration
```
┌─────────────────────────────────────────────────────┐
│           REGISTRATION STEP 1                       │
│  ┌──────────────────────────────────────────────┐  │
│  │ Full Name: [_____________________]           │  │
│  │ Email: [_____________________]                │  │
│  │ Phone: [_____________________]                │  │
│  │ Password: [_____________________]            │  │
│  │ Confirm Password: [_____________________]    │  │
│  │                                               │  │
│  │              [Next →]                         │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│           REGISTRATION STEP 2                       │
│  ┌──────────────────────────────────────────────┐  │
│  │ City: [Select City ▼]                        │  │
│  │ Address: [_____________________]             │  │
│  │                                               │  │
│  │              [Next →]                         │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│       REGISTRATION STEP 3 (VERIFICATION)           │
│  ┌──────────────────────────────────────────────┐  │
│  │ Verify Email                                 │  │
│  │ Enter 6-digit code sent to email:           │  │
│  │ [______]                                     │  │
│  │                                               │  │
│  │ Didn't receive? [Resend]                    │  │
│  │                                               │  │
│  │              [Complete →]                    │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                      ↓
                   ✅ DONE
                   3 Steps
```

### Social Login Registration (NEW)
```
┌─────────────────────────────────────────────────────┐
│           REGISTRATION STEP 1                       │
│  ┌──────────────────────────────────────────────┐  │
│  │ Full Name: [_____________________]           │  │
│  │ Email: [_____________________]                │  │
│  │ Phone: [_____________________]                │  │
│  │ Password: [_____________________]            │  │
│  │ Confirm Password: [_____________________]    │  │
│  │                                               │  │
│  │              [Next →]                         │  │
│  │                                               │  │
│  │           ─── or ───                          │  │
│  │     🔵 [Continue with Google]                 │  │
│  │     ⬛ [Continue with Apple]                  │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                      ↓
           [User clicks Google/Apple]
                      ↓
    ┌─────────────────────────────────────┐
    │  🔵 GOOGLE LOGIN PAGE               │
    │  or                                 │
    │  ⬛ APPLE LOGIN PAGE               │
    │                                     │
    │  Email: [_______________________]   │
    │  Password: [_______________________] │
    │                                     │
    │  [Sign in] [Create account]        │
    └─────────────────────────────────────┘
              (Provider handles)
                      ↓
    ┌─────────────────────────────────────┐
    │  "Allow App to access your info?"   │
    │                                     │
    │  - Name                            │
    │  - Email                           │
    │                                     │
    │  [Cancel] [Allow]                  │
    └─────────────────────────────────────┘
                      ↓
          [Redirect back to app]
                      ↓
┌─────────────────────────────────────────────────────┐
│           REGISTRATION STEP 2 ONLY!                │
│  ┌──────────────────────────────────────────────┐  │
│  │ City: [Select City ▼]                        │  │
│  │ Address: [_____________________]             │  │
│  │                                               │  │
│  │ (Name and Email already filled)              │  │
│  │                                               │  │
│  │              [Complete →]                    │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                      ↓
                   ✅ DONE
             2 Steps (No Code!)
```

---

## 2. OAuth Flow Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Step 1: User clicks "Continue with Google" button          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              ↓                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ YOUR APP FRONTEND                                           │   │
│  │ redirect to: /api/auth/google                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│                         YOUR BACKEND                                 │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ /api/auth/google                                           │   │
│  │ Step 2: Build Google Auth URL with:                       │   │
│  │  - client_id                                               │   │
│  │  - redirect_uri                                            │   │
│  │  - scope: email, profile                                  │   │
│  │ Step 3: Redirect user to Google                           │   │
│  └─────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│                       GOOGLE SERVERS                                 │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Step 4: Show Google Login                                  │   │
│  │ Step 5: User enters Google credentials                     │   │
│  │ Step 6: Google shows consent screen                        │   │
│  │ Step 7: User clicks "Allow"                                │   │
│  │ Step 8: Google generates authorization code               │   │
│  │ Step 9: Redirect to your callback URL with code           │   │
│  └─────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Step 10: Receives callback with authorization code        │   │
│  │ URL: /api/auth/google/callback?code=xxx&state=yyy        │   │
│  └─────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│                         YOUR BACKEND                                 │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ /api/auth/google/callback                                 │   │
│  │ Step 11: Receive authorization code from browser          │   │
│  │ Step 12: Exchange code for access token (server-to-server)│   │
│  │         POST to Google with:                               │   │
│  │         - code                                             │   │
│  │         - client_id                                        │   │
│  │         - client_secret (SECRET - never in frontend!)    │   │
│  │ Step 13: Google returns access token & ID token          │   │
│  │ Step 14: Use access token to fetch user info              │   │
│  │         GET /userinfo with access token                  │   │
│  │ Step 15: Return user info to frontend                    │   │
│  │         { name, email, provider }                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Step 16: Receive user data from callback                  │   │
│  │ Step 17: Store in sessionStorage                          │   │
│  │ Step 18: Redirect to /register?social=true&step=2       │   │
│  │ Step 19: Retrieve from sessionStorage                     │   │
│  │ Step 20: Auto-fill name and email                         │   │
│  │ Step 21: Show address & city form                         │   │
│  └─────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│                    REGISTRATION STEP 2                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Email: [user@gmail.com] (PREFILLED)                       │   │
│  │ Name: [John Doe] (PREFILLED)                             │   │
│  │ City: [Select City ▼]                                    │   │
│  │ Address: [_____________________]                          │   │
│  │                                                            │   │
│  │ [Complete]                                                │   │
│  └─────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
                         ✅ USER REGISTERED
```

---

## 3. Data Flow Sequence Diagram

```
USER          BROWSER         YOUR API        GOOGLE        GOOGLE API
 │              │                │              │              │
 │─ Click ──────→│                │              │              │
 │  Google        │                │              │              │
 │  Button        │                │              │              │
 │                │─ GET /api/auth/google ────→  │              │
 │                │ (with client_id, redirect)    │              │
 │                │              │              │              │
 │                │              Builds OAuth URL              │
 │                │              │              │              │
 │                │ ← Redirect ──┤              │              │
 │                │ to Google OAuth             │              │
 │                │    URL       │              │              │
 │                │              │              │              │
 │ ← Redirected ──│              │              │              │
 │ to Google      │              │              │              │
 │ login page     │              │              │              │
 │                │              │              │              │
 │─ Enter Email ──│              │              │              │
 │ and Password   │              │              │              │
 │                │              │              │              │
 │─ Click Allow ──│              │              │              │
 │                │              │              │              │
 │ ← Redirected ──│              │              │              │
 │ back to app    │              │              │              │
 │ with CODE      │              │              │              │
 │                │              │              │              │
 │                │─ POST /callback with CODE ──→│              │
 │                │ (includes client_secret)     │              │
 │                │              │              │              │
 │                │              Exchange code for token      │
 │                │              │              ────────────→│
 │                │              │              │ Validate   │
 │                │              │ ← Return ────│ code      │
 │                │              │   access_token,          │
 │                │              │   id_token   │           │
 │                │              │              │           │
 │                │              Fetch user info with token │
 │                │              │              ────────────→│
 │                │              │              │ Return    │
 │                │              │ ← { name,   │ user      │
 │                │              │    email }   │ info     │
 │                │              │              │           │
 │                │ ← Return user data           │           │
 │                │   { name, email, ... }      │           │
 │                │              │              │           │
 │ ← Store in ────│              │              │           │
 │   sessionStorage              │              │           │
 │                │              │              │           │
 │ ← Redirect ────│              │              │           │
 │   to /register │              │              │           │
 │   ?social=true │              │              │           │
 │                │              │              │           │
 │─ Show Step 2 ──│              │              │           │
 │ (with prefill) │              │              │           │
 │                │              │              │           │
 │─ Complete ────→│              │              │           │
 │ registration   │              │              │           │
 │                │              │              │           │
 │✅ Logged in    │              │              │           │
```

---

## 4. Component Hierarchy

```
app/
│
├── register/
│   └── page.tsx (RegisterPage)
│       ├── Imports useSearchParams() for social callback
│       ├── State:
│       │   ├── isSocialLogin (boolean)
│       │   ├── formData (object)
│       │   └── step (1, 2, or 3)
│       │
│       ├── Effects:
│       │   └── useEffect() - Handle social login callback
│       │
│       ├── Handlers:
│       │   ├── handleGoogleLogin()
│       │   ├── handleAppleLogin()
│       │   ├── handleStep1Submit()
│       │   ├── handleStep2Submit()
│       │   └── handleStep3Submit()
│       │
│       └── JSX:
│           ├── Step 1: Personal Info + Social Buttons
│           ├── Step 2: City + Address
│           │   └── Shows only for social logins (skips verification)
│           └── Step 3: Verification Code
│               └── Hidden for social logins
│
├── register/
│   └── social-callback/
│       └── page.tsx (SocialCallbackPage)
│           ├── useEffect() - processSocialLogin()
│           ├── Exchanges code for tokens
│           ├── Fetches user info
│           ├── Stores in sessionStorage
│           └── Redirects to /register?social=true
│
└── api/
    └── auth/
        ├── google/
        │   ├── route.ts (GET)
        │   │   └── Redirects to Google OAuth
        │   │
        │   └── callback/
        │       └── route.ts (POST)
        │           ├── Exchanges code for access_token
        │           ├── Fetches user info
        │           └── Returns { name, email, provider }
        │
        └── apple/
            ├── route.ts (GET)
            │   └── Redirects to Apple OAuth
            │
            └── callback/
                └── route.ts (POST)
                    ├── Validates JWT
                    ├── Exchanges code for tokens
                    ├── Parses ID token
                    └── Returns { name, email, provider }
```

---

## 5. State Management Flow

```
┌─────────────────┐
│ INITIAL STATE   │
└────────┬────────┘
         │
         ├─ step: 1
         ├─ isSocialLogin: false
         ├─ formData: empty
         └─ error: ""
         │
         ▼
┌──────────────────────────────────────┐
│ USER CLICKS SOCIAL BUTTON            │
│ handleGoogleLogin() or               │
│ handleAppleLogin()                   │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ REDIRECT TO OAUTH PROVIDER           │
│ window.location.href = /api/auth/... │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ PROVIDER CALLBACK                    │
│ /register/social-callback            │
│ with ?code=xxx                       │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ EXCHANGE CODE FOR USER INFO          │
│ POST /api/auth/google/callback       │
│ Returns: { name, email, provider }   │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ STORE IN SESSION STORAGE             │
│ sessionStorage.setItem(               │
│   "socialLoginData",                 │
│   { name, email, provider }          │
│ )                                     │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ REDIRECT TO REGISTER PAGE            │
│ /register?social=true&step=2         │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ USEEFFECT TRIGGERS                   │
│ - Read searchParams: social=true     │
│ - Read sessionStorage: socialLoginData│
│ - setFormData({ name, email })       │
│ - setIsSocialLogin(true)             │
│ - setStep(2)                         │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ RENDER STEP 2                        │
│ - Email field pre-filled             │
│ - Name field pre-filled              │
│ - City & Address fields empty        │
│ - No Step 3 (verification)           │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ USER SELECTS CITY & ADDRESS          │
│ Updates formData state               │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ CLICK COMPLETE                       │
│ handleStep2Submit()                  │
│ - Detects isSocialLogin = true       │
│ - Calls handleStep3Submit() directly │
│ - Skips verification code check      │
│ - Calls registerUser()               │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ REGISTRATION COMPLETE                │
│ - User created in database           │
│ - User logged in                     │
│ - Redirect to /profile               │
└──────────────────────────────────────┘
```

---

## 6. Comparison: Email vs Social Registration

```
EMAIL REGISTRATION              SOCIAL LOGIN REGISTRATION
──────────────────────────────  ────────────────────────────
1. Enter name manually      →   1. Extracted from provider
2. Enter email manually     →   2. Extracted from provider
3. Enter phone manually     →   3. Still enter manually
4. Create password          →   4. NO PASSWORD NEEDED
5. Confirm password         →   5. NO CONFIRMATION NEEDED
                               
6. Click Next               →   6. Click "Continue with X"
7. Enter city              →   7. Enter city
8. Enter address           →   8. Enter address
9. Click Next              →   9. Click Complete
                               
10. Receive email with code →   10. NO EMAIL SENT
11. Enter 6-digit code     →   11. NO CODE NEEDED
12. Click Verify           →   12. DIRECTLY REGISTERED
                               
✅ 3 Steps                     ✅ 2 Steps
⏱️ ~5-10 minutes              ⏱️ ~1-2 minutes
🔑 Password management needed  🔐 OAuth provider security
📧 Email verification needed   ✨ Instant registration
```

---

This shows the complete architecture and flow of the social login feature!
