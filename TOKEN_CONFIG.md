# Token & Session Configuration Guide

## ✅ Frontend Changes Applied

**Auto-logout disabled** in `src/lib/axios.ts`:
- 401 errors now only show a console warning
- No automatic logout on token expiration
- No automatic redirect to login page
- Components handle auth errors individually

---

## 🔧 Backend Token Expiration Setup

To set token expiration to **5 minutes**, configure your backend JWT settings:

### Option 1: Express.js with jsonwebtoken

```javascript
const jwt = require('jsonwebtoken');

// Generate token with 5 minute expiration
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '5m' } // 5 minutes
    );
};
```

### Option 2: jose (Modern JWT)

```javascript
import { SignJWT } from 'jose';

const generateToken = async (userId) => {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new SignJWT({ id: userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('5m') // 5 minutes
        .sign(secret);

    return token;
};
```

### Option 3: Environment Variable Configuration

Add to your **backend** `.env`:

```bash
# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=5m  # 5 minutes
```

Then use it:

```javascript
const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
);
```

---

## ⏱️ Common Expiration Time Formats

```javascript
// Minutes
expiresIn: '5m'   // 5 minutes
expiresIn: '15m'  // 15 minutes
expiresIn: '30m'  // 30 minutes

// Hours
expiresIn: '1h'   // 1 hour
expiresIn: '24h'  // 24 hours

// Days
expiresIn: '7d'   // 7 days
expiresIn: '30d'  // 30 days

// Seconds
expiresIn: 300    // 5 minutes (in seconds)
```

---

## 🎯 Token Refresh Strategy (Optional)

Since you have 5-minute expiration, you may want to implement token refresh:

### Backend: Add Refresh Token Endpoint

```javascript
// POST /api/auth/refresh
router.post('/auth/refresh', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Generate new token
        const newToken = generateToken(userId);

        return res.status(200).json({
            success: true,
            token: newToken
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Failed to refresh token'
        });
    }
});
```

### Frontend: Auto-refresh Token

Add to `src/lib/axios.ts`:

```typescript
// Token refresh configuration
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token: string) => {
    refreshSubscribers.map((callback) => callback(token));
    refreshSubscribers = [];
};

// Update response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Wait for token refresh
                return new Promise((resolve) => {
                    subscribeTokenRefresh((token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(api(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Refresh token
                const { data } = await api.post('/auth/refresh');
                const newToken = data.token;

                // Save new token
                document.cookie = `token=${newToken}; path=/`;

                isRefreshing = false;
                onTokenRefreshed(newToken);

                // Retry original request
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                // Token refresh failed - handle as needed
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
```

---

## 🔒 Security Best Practices

### 1. Short-Lived Access Tokens (5 minutes) ✅
- Access token expires quickly
- Reduces risk if token is stolen
- Requires frequent refresh

### 2. Long-Lived Refresh Tokens
- Refresh token expires in 7-30 days
- Stored securely (httpOnly cookie)
- Used to get new access tokens

### 3. Token Storage
```javascript
// Backend: Set refresh token as httpOnly cookie
res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

// Frontend: Access token in localStorage or cookie
localStorage.setItem('token', accessToken);
// OR
document.cookie = `token=${accessToken}; path=/`;
```

---

## 📊 Current Configuration Summary

| Setting | Value | Status |
|---------|-------|--------|
| Auto-logout on 401 | ❌ Disabled | ✅ Applied |
| Token expiration | 5 minutes | ⚠️ Set on backend |
| Auto-redirect on error | ❌ Disabled | ✅ Applied |
| Console warning | ✅ Enabled | ✅ Applied |
| Token refresh | ❌ Optional | ℹ️ See guide above |

---

## 🧪 Testing Token Expiration

### 1. Generate a 5-minute token on backend
```bash
# Login to get token
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### 2. Wait 5 minutes

### 3. Make an authenticated request
```bash
curl http://localhost/api/notifications \
  -H "Authorization: Bearer expired-token"
```

### 4. Expected behavior:
- ✅ Returns 401 error
- ✅ Console shows: "⚠️ 401 Unauthorized - Token may be expired"
- ✅ NO auto-logout
- ✅ NO redirect to login

---

## 🎉 Done!

Your auth system now:
- ✅ Has 5-minute token expiration (when configured on backend)
- ✅ Doesn't auto-logout on auth errors
- ✅ Doesn't show error dialogs on 401
- ✅ Logs warnings to console only
- ✅ Each component handles auth errors individually

Next step: Configure your backend JWT to use `expiresIn: '5m'`
