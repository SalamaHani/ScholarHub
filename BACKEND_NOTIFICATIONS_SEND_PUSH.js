/**
 * Backend Implementation: Enhanced POST /api/admin/notifications/send
 * Sends in-app AND push notifications
 */

const express = require('express');
const router = express.Router();
const PushNotifications = require('@pusher/push-notifications-server');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Initialize Pusher Beams client
const beamsClient = new PushNotifications({
    instanceId: process.env.PUSHER_BEAMS_INSTANCE_ID,
    secretKey: process.env.PUSHER_BEAMS_SECRET_KEY,
});

/**
 * @route   POST /api/admin/notifications/send
 * @desc    Send notifications to users (in-app + push)
 * @access  Private/Admin
 */
router.post('/admin/notifications/send', authenticateToken, isAdmin, async (req, res) => {
    try {
        const {
            title,
            message,
            type = 'INFO',
            link,
            targetRole,
            targetUserIds,
            sendPush = false,
            interests = []
        } = req.body;

        // Validation
        if (!title || !message) {
            return res.status(400).json({
                success: false,
                error: 'Title and message are required'
            });
        }

        console.log(`📢 Sending notification: ${title}`);

        // 1. DETERMINE TARGET USERS
        let userIds = targetUserIds;

        if (!userIds || userIds.length === 0) {
            // Get users by role
            const whereClause = targetRole === 'ALL' ? {} : { role: targetRole };

            const users = await User.findAll({
                where: whereClause,
                attributes: ['id']
            });

            userIds = users.map(u => u.id);
            console.log(`🎯 Targeting ${userIds.length} users with role: ${targetRole || 'ALL'}`);
        }

        // 2. CREATE IN-APP NOTIFICATIONS (Database)
        const notifications = await Notification.bulkCreate(
            userIds.map(userId => ({
                userId,
                title,
                message,
                type,
                link: link || null,
                isRead: false,
                createdAt: new Date(),
                updatedAt: new Date()
            }))
        );

        console.log(`✅ Created ${notifications.length} in-app notifications`);

        // 3. SEND PUSH NOTIFICATIONS (Pusher Beams)
        let pushResult = null;

        if (sendPush) {
            try {
                const publishBody = {
                    web: {
                        notification: {
                            title: title,
                            body: message,
                            deep_link: link ? `${process.env.FRONTEND_URL}${link}` : undefined,
                            icon: '/icon-192x192.png',
                            badge: '/badge-72x72.png'
                        }
                    }
                };

                // Send to interests (topic-based)
                if (interests.length > 0) {
                    console.log(`📡 Publishing to interests: ${interests.join(', ')}`);
                    const interestResult = await beamsClient.publishToInterests(
                        interests,
                        publishBody
                    );
                    pushResult = interestResult;
                }

                // Send to specific users
                if (userIds.length > 0) {
                    console.log(`📱 Publishing to ${userIds.length} users`);
                    const userResult = await beamsClient.publishToUsers(
                        userIds,
                        publishBody
                    );
                    pushResult = userResult;
                }

                console.log(`✅ Push notifications sent successfully`);
            } catch (pushError) {
                console.error('❌ Push notification error:', pushError);
                // Continue even if push fails - in-app notifications still sent
            }
        }

        return res.status(200).json({
            success: true,
            data: {
                notifications: notifications,
                inAppCount: notifications.length,
                pushSent: sendPush,
                pushResult: pushResult
            },
            message: `Sent ${notifications.length} notifications${sendPush ? ' (with push)' : ''}`
        });
    } catch (error) {
        console.error('❌ Send notification error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to send notifications',
            message: error.message
        });
    }
});

module.exports = router;

/**
 * USAGE EXAMPLES:
 *
 * 1. Send to all students with push:
 *    POST /api/admin/notifications/send
 *    {
 *      "title": "New Scholarship Available",
 *      "message": "Check out Computer Science Scholarship 2024",
 *      "type": "SCHOLARSHIP",
 *      "link": "/scholarships/123",
 *      "targetRole": "STUDENT",
 *      "sendPush": true,
 *      "interests": ["role-student"]
 *    }
 *
 * 2. Send to specific users:
 *    POST /api/admin/notifications/send
 *    {
 *      "title": "Application Status Update",
 *      "message": "Your application has been reviewed",
 *      "type": "APPLICATION",
 *      "targetUserIds": ["user1", "user2"],
 *      "sendPush": true
 *    }
 *
 * 3. Send to category followers:
 *    POST /api/admin/notifications/send
 *    {
 *      "title": "New CS Scholarship",
 *      "message": "Perfect for computer science students",
 *      "type": "SCHOLARSHIP",
 *      "sendPush": true,
 *      "interests": ["category-computer-science"]
 *    }
 */
