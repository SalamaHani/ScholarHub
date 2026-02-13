# Google OAuth Backend Implementation Steps

## Quick Start - 5 Steps

### Step 1: Add Google OAuth Credentials
1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URI: `http://localhost:8080/api/auth/google/callback`
4. Copy Client ID and Client Secret

### Step 2: Update Backend Environment Variables
Add to your backend `.env` file (see `BACKEND_ENV_TEMPLATE.txt`):
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
API_URL=http://localhost:8080/api
FRONTEND_URL=http://localhost:3000
```

### Step 3: Add Database Column
```bash
# Run the migration
npx sequelize-cli db:migrate

# Or manually add to your User model:
googleId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    field: 'google_id'
}
```
See `BACKEND_GOOGLE_MIGRATION.js` for the migration file.

### Step 4: Add Controller Functions
Copy the functions from `BACKEND_GOOGLE_CONTROLLER.js` to your auth controller:
- `initiateGoogleAuth`
- `handleGoogleCallback`

**Location**: `backend/controllers/auth.controller.js` (or similar)

### Step 5: Add Routes
Add these routes from `BACKEND_GOOGLE_ROUTES.js` to your auth router:

```javascript
/**
 * @route   GET /api/auth/google
 * @desc    Initiate Google OAuth flow
 */
router.get('/google', initiateGoogleAuth);

/**
 * @route   GET /api/auth/google/callback
 * @desc    Handle Google OAuth callback
 */
router.get('/google/callback', handleGoogleCallback);
```

**Location**: `backend/routes/auth.routes.js` (or similar)

---

## Dependencies

Make sure you have these npm packages installed:

```bash
npm install node-fetch  # For making HTTP requests to Google
# OR if you prefer axios:
npm install axios
```

If using axios, update the controller to use axios instead of node-fetch.

---

## Testing

1. **Start your backend:**
   ```bash
   npm start
   # or
   npm run dev
   ```

2. **Start your frontend:**
   ```bash
   npm run dev
   ```

3. **Test the flow:**
   - Go to http://localhost:3000/auth/login
   - Click the "Google" button
   - You should be redirected to Google OAuth
   - Authorize with your Google account
   - You should be redirected back and logged in

---

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure the redirect URI in Google Console matches exactly: `http://localhost:8080/api/auth/google/callback`
- Check that `API_URL` in your backend `.env` is correct

### Error: "token_exchange_failed"
- Verify `GOOGLE_CLIENT_SECRET` is correct in your backend `.env`
- Check that your Google OAuth credentials are active

### Error: "invalid_client"
- Verify `GOOGLE_CLIENT_ID` is correct in your backend `.env`
- Make sure the credentials haven't been revoked

### Users not being created
- Check database connection
- Verify the `googleId` column exists in your users table
- Check backend logs for errors

---

## Production Deployment

### Update Redirect URIs
In Google Cloud Console, add your production URLs:
- `https://api.yourdomain.com/api/auth/google/callback`
- `https://yourdomain.com/auth/google/callback` (if needed)

### Update Environment Variables
```env
API_URL=https://api.yourdomain.com/api
FRONTEND_URL=https://yourdomain.com
GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-secret
```

### Security Checklist
- ✅ Use HTTPS in production
- ✅ Keep `GOOGLE_CLIENT_SECRET` secure
- ✅ Implement rate limiting on OAuth endpoints
- ✅ Add CORS configuration
- ✅ Validate all user input
- ✅ Use environment variables for all secrets

---

## File Structure

Your backend should have this structure:

```
backend/
├── routes/
│   └── auth.routes.js          (add Google routes here)
├── controllers/
│   └── auth.controller.js      (add Google controllers here)
├── models/
│   └── user.model.js          (add googleId field)
├── migrations/
│   └── XXXXXX-add-google-oauth.js
├── utils/
│   └── jwt.js                 (your existing JWT utility)
└── .env                       (add Google credentials)
```

---

## Complete Code Files Provided

1. **BACKEND_GOOGLE_ROUTES.js** - Route definitions
2. **BACKEND_GOOGLE_CONTROLLER.js** - Controller functions
3. **BACKEND_GOOGLE_MIGRATION.js** - Database migration
4. **BACKEND_ENV_TEMPLATE.txt** - Environment variables template

Simply copy the code from these files into your existing backend!

---

## Support

If you encounter issues:
1. Check backend logs for errors
2. Verify all environment variables are set
3. Test the OAuth flow step by step
4. Check Google Cloud Console for API quotas/limits

The frontend is already complete with full error handling! 🎉
