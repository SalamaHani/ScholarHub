/**
 * Backend API Routes: Notifications
 * These routes handle in-app notifications and Pusher Beams push notifications
 *
 * Setup Instructions:
 * 1. Install required packages:
 *    npm install @pusher/push-notifications-server
 *
 * 2. Add to your backend .env:
 *    PUSHER_BEAMS_INSTANCE_ID=b4f9c400-baed-4cb0-972f-9ceb7fd8141c
 *    PUSHER_BEAMS_SECRET_KEY=6FD8140870C545B851278E657080D7673DDAABDAA067611F0DA2CA28511B9788
 *
 * 3. Import in your main app file:
 *    const notificationsRoutes = require('./routes/notifications');
 *    app.use('/api', notificationsRoutes);
 */

const express = require('express');
const router = express.Router();
const PushNotifications = require('@pusher/push-notifications-server');

// Import your middleware and models
// const { authenticateToken, isAdmin } = require('../middleware/auth');
// const Notification = require('../models/Notification');
// const User = require('../models/User');

// Initialize Pusher Beams client
const beamsClient = new PushNotifications({
    instanceId: process.env.PUSHER_BEAMS_INSTANCE_ID,
    secretKey: process.env.PUSHER_BEAMS_SECRET_KEY,
});

/**
 * @route   GET /api/notifications
 * @desc    Get all notifications for authenticated user
 * @access  Private
 */
router.get('/notifications', async (req, res) => {
    try {
        // Replace with your auth middleware
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
        }

        // Replace with your database query
        // Example using Sequelize:
        // const notifications = await Notification.findAll({
        //     where: { userId },
        //     order: [['createdAt', 'DESC']],
        //     limit: 50
        // });

        // Example using Prisma:
        // const notifications = await prisma.notification.findMany({
        //     where: { userId },
        //     orderBy: { createdAt: 'desc' },
        //     take: 50
        // });

        // Temporary mock data for testing
        const notifications = [];

        return res.status(200).json({
            success: true,
            data: notifications
        });
    } catch (error) {
        console.error('❌ Get notifications error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch notifications',
            message: error.message
        });
    }
});

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark a single notification as read
 * @access  Private
 */
router.put('/notifications/:id/read', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
        }

        // Replace with your database query
        // Example using Sequelize:
        // const notification = await Notification.findOne({
        //     where: { id, userId }
        // });
        //
        // if (!notification) {
        //     return res.status(404).json({
        //         success: false,
        //         error: 'Notification not found'
        //     });
        // }
        //
        // await notification.update({ isRead: true });

        // Example using Prisma:
        // const notification = await prisma.notification.updateMany({
        //     where: { id, userId },
        //     data: { isRead: true }
        // });

        return res.status(200).json({
            success: true,
            message: 'Notification marked as read'
        });
    } catch (error) {
        console.error('❌ Mark read error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to mark notification as read',
            message: error.message
        });
    }
});

/**
 * @route   PUT /api/notifications/read-all
 * @desc    Mark all notifications as read for authenticated user
 * @access  Private
 */
router.put('/notifications/read-all', async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
        }

        // Replace with your database query
        // Example using Sequelize:
        // await Notification.update(
        //     { isRead: true },
        //     { where: { userId, isRead: false } }
        // );

        // Example using Prisma:
        // await prisma.notification.updateMany({
        //     where: { userId, isRead: false },
        //     data: { isRead: true }
        // });

        return res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        console.error('❌ Mark all read error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to mark all as read',
            message: error.message
        });
    }
});

/**
 * @route   POST /api/notifications/beams-auth
 * @desc    Generate Pusher Beams authentication token for user
 * @access  Private
 */
router.post('/notifications/beams-auth', async (req, res) => {
    try {
        const { userId } = req.body;
        const authenticatedUserId = req.user?.id;

        // Security check: Verify the requesting user matches the userId
        if (authenticatedUserId !== userId) {
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

/**
 * @route   POST /api/admin/notifications/send
 * @desc    Send notifications to users (in-app + optional push)
 * @access  Private/Admin
 */
router.post('/admin/notifications/send', async (req, res) => {
    try {
        // Check if user is admin
        // if (!req.user?.role === 'ADMIN') {
        //     return res.status(403).json({
        //         success: false,
        //         error: 'Forbidden - Admin access required'
        //     });
        // }

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
            // Example using Sequelize:
            // const whereClause = targetRole === 'ALL' ? {} : { role: targetRole };
            // const users = await User.findAll({
            //     where: whereClause,
            //     attributes: ['id']
            // });
            // userIds = users.map(u => u.id);

            // Example using Prisma:
            // const users = await prisma.user.findMany({
            //     where: targetRole === 'ALL' ? {} : { role: targetRole },
            //     select: { id: true }
            // });
            // userIds = users.map(u => u.id);

            // Temporary - get all user IDs
            userIds = [];
            console.log(`🎯 Targeting ${userIds.length} users with role: ${targetRole || 'ALL'}`);
        }

        // 2. CREATE IN-APP NOTIFICATIONS (Database)
        // Example using Sequelize:
        // const notifications = await Notification.bulkCreate(
        //     userIds.map(userId => ({
        //         userId,
        //         title,
        //         message,
        //         type,
        //         link: link || null,
        //         isRead: false,
        //         createdAt: new Date(),
        //         updatedAt: new Date()
        //     }))
        // );

        // Example using Prisma:
        // const notifications = await prisma.notification.createMany({
        //     data: userIds.map(userId => ({
        //         userId,
        //         title,
        //         message,
        //         type,
        //         link: link || null,
        //         isRead: false
        //     }))
        // });

        const notifications = [];
        console.log(`✅ Created ${userIds.length} in-app notifications`);

        // 3. SEND PUSH NOTIFICATIONS (Pusher Beams)
        let pushResult = null;

        if (sendPush) {
            try {
                const publishBody = {
                    web: {
                        notification: {
                            title: title,
                            body: message,
                            deep_link: link ? `${process.env.FRONTEND_URL || 'http://localhost:3000'}${link}` : undefined,
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
                inAppCount: userIds.length,
                pushSent: sendPush,
                pushResult: pushResult
            },
            message: `Sent ${userIds.length} notifications${sendPush ? ' (with push)' : ''}`
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

/**
 * @route   POST /api/admin/notifications/email
 * @desc    Send email notification
 * @access  Private/Admin
 */
router.post('/admin/notifications/email', async (req, res) => {
    try {
        // Check if user is admin
        // if (!req.user?.role === 'ADMIN') {
        //     return res.status(403).json({
        //         success: false,
        //         error: 'Forbidden - Admin access required'
        //     });
        // }

        const { to, subject, body, template } = req.body;

        if (!to || !subject || !body) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: to, subject, body'
            });
        }

        console.log(`📧 Sending email to: ${Array.isArray(to) ? to.join(', ') : to}`);

        // TODO: Implement email sending logic
        // Example using nodemailer:
        // const transporter = nodemailer.createTransport({ ... });
        // await transporter.sendMail({
        //     from: process.env.EMAIL_FROM,
        //     to: Array.isArray(to) ? to : [to],
        //     subject,
        //     html: body
        // });

        return res.status(200).json({
            success: true,
            message: 'Email sent successfully'
        });
    } catch (error) {
        console.error('❌ Send email error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to send email',
            message: error.message
        });
    }
});

module.exports = router;
