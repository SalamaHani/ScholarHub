/**
 * Google OAuth Routes for ScholarHub Backend
 *
 * Add these routes to your existing auth router
 * Location: backend/routes/auth.routes.js (or similar)
 */

/**
 * @route   GET /api/auth/google
 * @desc    Initiate Google OAuth flow
 * @access  Public
 * @query   role - STUDENT or PROFESSOR (optional, defaults to STUDENT)
 */
router.get('/google', initiateGoogleAuth);

/**
 * @route   GET /api/auth/google/callback
 * @desc    Handle Google OAuth callback
 * @access  Public
 * @query   code - Authorization code from Google
 * @query   state - Role (STUDENT or PROFESSOR)
 * @query   error - Error from Google (if any)
 */
router.get('/google/callback', handleGoogleCallback);
