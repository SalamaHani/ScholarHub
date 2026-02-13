# Google OAuth Backend Implementation Guide

## Overview
The frontend now redirects directly to your backend API for Google OAuth. Your backend handles the entire OAuth flow.

## Required Backend Endpoints

### 1. GET `/api/auth/google` - Initiate OAuth
This endpoint initiates the Google OAuth flow and redirects to Google.

**Query Parameters:**
- `role` (optional): "STUDENT" or "PROFESSOR" (defaults to "STUDENT")

**What it should do:**
1. Build Google OAuth URL with your credentials
2. Store role in session/state
3. Redirect user to Google authorization page

**Example Implementation:**
```typescript
router.get('/auth/google', (req, res) => {
  const role = req.query.role || 'STUDENT';

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.API_URL}/auth/google/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    state: role, // Pass role through state parameter
  })}`;

  res.redirect(googleAuthUrl);
});
```

---

### 2. GET `/api/auth/google/callback` - OAuth Callback
This endpoint receives the auth code from Google and completes authentication.

**Query Parameters:**
- `code`: Authorization code from Google
- `state`: Role (STUDENT or PROFESSOR)
- `error`: Error from Google (if any)

**What it should do:**
1. Exchange code for Google tokens
2. Get user info from Google
3. Create or update user in database
4. Generate JWT token
5. Redirect to frontend success page

**Expected Redirect:**
```
http://localhost:3000/auth/google/success?token={jwt}&user={userJson}
```

**Example Implementation:**
```typescript
router.get('/auth/google/callback', async (req, res) => {
  try {
    const { code, state: role, error } = req.query;

    if (error) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=google_auth_failed`);
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.API_URL}/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();

    // Get user info
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const googleUser = await userInfoResponse.json();

    // Find or create user
    let user = await User.findOne({
      where: {
        [Op.or]: [
          { googleId: googleUser.id },
          { email: googleUser.email }
        ]
      }
    });

    if (!user) {
      user = await User.create({
        googleId: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
        avatar: googleUser.picture,
        role: role || 'STUDENT',
        isEmailVerified: true,
      });
    } else {
      await user.update({
        googleId: googleUser.id,
        avatar: googleUser.picture,
      });
    }

    // Generate JWT
    const accessToken = generateJWT({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // Redirect to frontend with token
    const successUrl = `${process.env.FRONTEND_URL}/auth/google/success?token=${accessToken}&user=${encodeURIComponent(JSON.stringify(user))}`;
    res.redirect(successUrl);

  } catch (error) {
    console.error('Google OAuth error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=oauth_failed`);
  }
});
```

---

## Database Changes

### Update User Model
Add a `googleId` field to your User model:
```typescript
googleId: {
  type: DataTypes.STRING,
  unique: true,
  allowNull: true,
  field: 'google_id'
}
```

Run migration to add the column to your database.

---

## Environment Variables

### Backend `.env`:
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
API_URL=http://localhost:8080/api
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Google Cloud Console Setup

1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URIs:
   - Development: `http://localhost:8080/api/auth/google/callback`
   - Production: `https://your-api-domain.com/api/auth/google/callback`
4. Copy Client ID and Client Secret to your backend `.env`

---

## Flow Summary

```
1. User clicks "Google" button on frontend
   ↓
2. Frontend redirects to: http://localhost:8080/api/auth/google?role=STUDENT
   ↓
3. Backend redirects to Google OAuth consent screen
   ↓
4. User authorizes with Google
   ↓
5. Google redirects to: http://localhost:8080/api/auth/google/callback?code=...&state=STUDENT
   ↓
6. Backend exchanges code for tokens, gets user info
   ↓
7. Backend creates/updates user, generates JWT
   ↓
8. Backend redirects to: http://localhost:3000/auth/google/success?token=...&user=...
   ↓
9. Frontend stores token in Redux and redirects to dashboard
```

---

## Security Considerations

- ✅ Store Google Client Secret securely on backend only
- ✅ Validate state parameter to prevent CSRF
- ✅ Set `isEmailVerified: true` for Google users
- ✅ Handle duplicate email scenarios gracefully
- ✅ Use HTTPS in production
- ✅ Implement rate limiting on OAuth endpoints

---

## Error Handling

Your backend should redirect to frontend with error codes:

| Error Scenario | Redirect URL |
|---------------|-------------|
| Google OAuth error | `/auth/login?error=google_auth_failed` |
| Token exchange failed | `/auth/login?error=token_exchange_failed` |
| User info fetch failed | `/auth/login?error=user_info_failed` |
| Database error | `/auth/login?error=auth_failed` |

The frontend will display appropriate error messages to the user.

---

## Testing

1. Set up Google OAuth credentials
2. Configure environment variables
3. Test the flow:
   ```bash
   # Start backend
   cd backend && npm start

   # Start frontend
   cd frontend && npm run dev
   ```
4. Click "Google" button and verify:
   - Redirects to Google
   - Returns to app after authorization
   - User is logged in
   - Token is stored in Redux
   - User sees dashboard

---

## No Frontend API Routes Needed

The frontend has NO Next.js API routes. Everything is handled by your backend:
- Frontend buttons redirect directly to backend endpoints
- Backend handles all OAuth communication with Google
- Backend redirects back to frontend with auth data

This is simpler, more secure, and keeps all OAuth logic in one place! ✅
