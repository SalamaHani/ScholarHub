/**
 * Google OAuth Controller for ScholarHub Backend
 *
 * Add these functions to your auth controller
 * Location: backend/controllers/auth.controller.js (or similar)
 */

const fetch = require('node-fetch'); // or use axios
const { generateToken } = require('../utils/jwt'); // Your JWT utility
const { User } = require('../models'); // Your User model
const { Op } = require('sequelize'); // If using Sequelize

/**
 * @desc    Initiate Google OAuth flow
 * @route   GET /api/auth/google
 * @access  Public
 */
const initiateGoogleAuth = (req, res) => {
    try {
        const role = req.query.role || 'STUDENT';

        // Validate role
        if (!['STUDENT', 'PROFESSOR'].includes(role)) {
            return res.redirect(
                `${process.env.FRONTEND_URL}/auth/login?error=invalid_role`
            );
        }

        // Build Google OAuth URL
        const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        googleAuthUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID);
        googleAuthUrl.searchParams.set(
            'redirect_uri',
            `${process.env.API_URL}/auth/google/callback`
        );
        googleAuthUrl.searchParams.set('response_type', 'code');
        googleAuthUrl.searchParams.set('scope', 'openid email profile');
        googleAuthUrl.searchParams.set('state', role);
        googleAuthUrl.searchParams.set('access_type', 'offline');
        googleAuthUrl.searchParams.set('prompt', 'select_account');

        // Redirect to Google
        return res.redirect(googleAuthUrl.toString());
    } catch (error) {
        console.error('Google OAuth initiation error:', error);
        return res.redirect(
            `${process.env.FRONTEND_URL}/auth/login?error=oauth_init_failed`
        );
    }
};

/**
 * @desc    Handle Google OAuth callback
 * @route   GET /api/auth/google/callback
 * @access  Public
 */
const handleGoogleCallback = async (req, res) => {
    try {
        const { code, state: role, error } = req.query;

        // Check for OAuth errors from Google
        if (error) {
            console.error('Google OAuth error:', error);
            return res.redirect(
                `${process.env.FRONTEND_URL}/auth/login?error=google_auth_failed`
            );
        }

        // Validate required parameters
        if (!code) {
            return res.redirect(
                `${process.env.FRONTEND_URL}/auth/login?error=missing_auth_code`
            );
        }

        // Exchange authorization code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: `${process.env.API_URL}/auth/google/callback`,
                grant_type: 'authorization_code',
            }),
        });

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json();
            console.error('Token exchange error:', errorData);
            return res.redirect(
                `${process.env.FRONTEND_URL}/auth/login?error=token_exchange_failed`
            );
        }

        const tokens = await tokenResponse.json();

        // Get user info from Google
        const userInfoResponse = await fetch(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            {
                headers: {
                    Authorization: `Bearer ${tokens.access_token}`,
                },
            }
        );

        if (!userInfoResponse.ok) {
            console.error('Failed to fetch user info from Google');
            return res.redirect(
                `${process.env.FRONTEND_URL}/auth/login?error=user_info_failed`
            );
        }

        const googleUser = await userInfoResponse.json();

        // Validate Google user data
        if (!googleUser.id || !googleUser.email) {
            console.error('Invalid Google user data:', googleUser);
            return res.redirect(
                `${process.env.FRONTEND_URL}/auth/login?error=invalid_user_data`
            );
        }

        // Find or create user in database
        let user = await User.findOne({
            where: {
                [Op.or]: [
                    { googleId: googleUser.id },
                    { email: googleUser.email }
                ]
            }
        });

        if (!user) {
            // Create new user
            user = await User.create({
                googleId: googleUser.id,
                email: googleUser.email,
                name: googleUser.name,
                firstName: googleUser.given_name || googleUser.name?.split(' ')[0],
                lastName: googleUser.family_name || googleUser.name?.split(' ')[1] || '',
                avatar: googleUser.picture,
                role: role || 'STUDENT',
                isEmailVerified: true, // Google emails are verified
                password: null, // No password for OAuth users
            });
        } else {
            // Update existing user with Google info
            await user.update({
                googleId: googleUser.id,
                avatar: googleUser.picture || user.avatar,
                isEmailVerified: true,
            });
        }

        // Generate JWT token
        const accessToken = generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        // Prepare user data for frontend (remove sensitive fields)
        const userData = {
            id: user.id,
            email: user.email,
            name: user.name,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            isProfessorVerified: user.isProfessorVerified || false,
            isBlocked: user.isBlocked || false,
            university: user.university,
            fieldOfStudy: user.fieldOfStudy,
            profileCompleteness: user.profileCompleteness || 0,
        };

        // Redirect to frontend success page with token and user data
        const successUrl = new URL(`${process.env.FRONTEND_URL}/auth/google/success`);
        successUrl.searchParams.set('token', accessToken);
        successUrl.searchParams.set('user', encodeURIComponent(JSON.stringify(userData)));

        return res.redirect(successUrl.toString());
    } catch (error) {
        console.error('Google OAuth callback error:', error);
        return res.redirect(
            `${process.env.FRONTEND_URL}/auth/login?error=oauth_failed`
        );
    }
};

module.exports = {
    initiateGoogleAuth,
    handleGoogleCallback,
};
