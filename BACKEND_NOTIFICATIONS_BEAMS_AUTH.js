/**
 * Backend Implementation: POST /api/notifications/beams-auth
 * Generates Pusher Beams authentication token for users
 */

const express = require('express');
const router = express.Router();
const PushNotifications = require('@pusher/push-notifications-server');
const { authenticateToken } = require('../middleware/auth');

// Initialize Pusher Beams client
const beamsClient = new PushNotifications({
    instanceId: process.env.PUSHER_BEAMS_INSTANCE_ID,
    secretKey: process.env.PUSHER_BEAMS_SECRET_KEY,
});

/**
 * @route   POST /api/notifications/beams-auth
 * @desc    Generate Beams auth token for authenticated user
 * @access  Private
 */
router.post('/notifications/beams-auth', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.body;

        // Security check: Verify the requesting user matches the userId
        if (req.user.id !== userId) {
            return res.status(403).json({
                success: false,
                error: 'Unauthorized - User ID mismatch'
            });
        }

        // Validate userId
        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Invalid userId'
            });
        }

        console.log(`📱 Generating Beams token for user: ${userId}`);

        // Generate Beams token
        const beamsToken = beamsClient.generateToken(userId);

        return res.status(200).json({
            success: true,
            token: beamsToken.token
        });
    } catch (error) {
        console.error('❌ Beams auth error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to generate authentication token',
            message: error.message
        });
    }
});

module.exports = router;

/**
 * INSTALLATION:
 *
 * 1. Install package:
 *    npm install @pusher/push-notifications-server
 *
 * 2. Add to .env:
 *    PUSHER_BEAMS_INSTANCE_ID=your-instance-id
 *    PUSHER_BEAMS_SECRET_KEY=your-secret-key
 *
 * 3. Import in your main app file:
 *    const notificationsRoutes = require('./routes/notifications');
 *    app.use('/api', notificationsRoutes);
 */
