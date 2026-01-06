# OAuth Configuration Guide

## Google OAuth Setup

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URI: `http://localhost:3000/api/auth/google/callback`

### 2. Environment Variables
Add to your `.env.local`:

```
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. For Production (Vercel)
Add to Vercel project settings > Environment Variables:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_URL=https://your-domain.com`

---

## Apple OAuth Setup

### 1. Create Apple Developer Account
1. Go to [Apple Developer Program](https://developer.apple.com/)
2. Register as developer (paid membership required)
3. Create a new App ID
4. Enable "Sign in with Apple" capability
5. Create a Services ID for your web app
6. Configure redirect URI: `https://your-domain.com/api/auth/apple/callback`

### 2. Create Private Key
1. In Certificates, Identifiers & Profiles
2. Create a new key with "Sign in with Apple" capability
3. Download the `.p8` private key file
4. Note the Key ID

### 3. Environment Variables
Add to your `.env.local`:

```
APPLE_CLIENT_ID=com.yourcompany.app.services
APPLE_TEAM_ID=XXXXX
APPLE_KEY_ID=XXXXX
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...your key content...\n-----END PRIVATE KEY-----"
```

### 4. For Production (Vercel)
- Use Production Apple credentials
- Update `NEXTAUTH_URL` to your production domain
- Apple requires HTTPS for Sign in with Apple

---

## Registration Flow with OAuth

### User Journey:
1. User clicks "Continue with Google" or "Continue with Apple"
2. Redirected to OAuth provider
3. User authorizes and is redirected to callback
4. User info extracted (name, email)
5. User redirected to Step 2: Select City & Address
6. **NO verification code needed** for social login
7. Registration complete and user logged in

### Key Differences from Email/Password Registration:
- ✅ No password entry needed
- ✅ No verification code required
- ✅ Email pre-filled from OAuth provider
- ✅ Faster registration process
- ✅ More secure (OAuth handled by provider)

---

## Testing OAuth Locally

For local testing without HTTPS:
1. Use `http://localhost:3000` for redirect URIs
2. Google OAuth works with localhost
3. Apple OAuth **requires HTTPS** - use tools like:
   - `ngrok` for tunnel
   - `localhost.run` for HTTPS proxy
   - Local HTTPS setup with self-signed certificates

### Example with ngrok:
```bash
ngrok http 3000
# Then update redirect URIs to: https://your-ngrok-url.ngrok.io/api/auth/{google|apple}/callback
```

---

## Troubleshooting

### Google OAuth Issues:
- **"Redirect URI mismatch"**: Ensure exact match in console and code
- **"Invalid client ID"**: Check environment variables are loaded
- **Test with**: `http://localhost:3000/api/auth/google`

### Apple OAuth Issues:
- **"Invalid team ID"**: Must use exact Team ID from Apple Developer
- **"Certificate invalid"**: Ensure `.p8` key is properly formatted
- **HTTPS required**: Cannot test Apple locally without HTTPS

---

## Production Checklist

- [ ] Update redirect URIs to production domain
- [ ] Set `NEXTAUTH_URL` to production URL (must be HTTPS)
- [ ] Use production credentials from OAuth providers
- [ ] Test full flow end-to-end
- [ ] Enable HTTPS on production domain
- [ ] Monitor OAuth logs for errors
- [ ] Have backup email/password registration
