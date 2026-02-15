# Pusher Beams Push Notification Setup Guide

## Overview
This guide explains how to integrate Pusher Beams push notifications with ScholarHub.

## Frontend Implementation ✅

### Files Created:
1. **`src/lib/pusher-beams.ts`** - Pusher Beams client configuration
2. **`src/hooks/usePushNotifications.ts`** - React hook for push notifications
3. **`src/hooks/useNotifications.ts`** - Updated with Beams auth support

## Backend Requirements ⚠️

You need to implement these endpoints in your backend:

### 1. POST `/api/notifications/beams-auth`

**Purpose**: Generate Beams auth token for authenticated users

**Request Body**:
```json
{
  "userId": "user-123"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Implementation Example** (Node.js):
```javascript
const PushNotifications = require('@pusher/push-notifications-server');

const beamsClient = new PushNotifications({
  instanceId: process.env.PUSHER_BEAMS_INSTANCE_ID,
  secretKey: process.env.PUSHER_BEAMS_SECRET_KEY,
});

router.post('/notifications/beams-auth', authenticateToken, async (req, res) => {
  const { userId } = req.body;

  // Verify user is authenticated
  if (req.user.id !== userId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const beamsToken = beamsClient.generateToken(userId);

    return res.status(200).json({
      token: beamsToken.token
    });
  } catch (error) {
    console.error('Beams auth error:', error);
    return res.status(500).json({ error: 'Failed to generate auth token' });
  }
});
```

### 2. Enhanced POST `/api/admin/notifications/send`

**Updated to support push notifications**

**Request Body**:
```json
{
  "title": "New Scholarship Available",
  "message": "Check out the latest Computer Science scholarship!",
  "type": "SCHOLARSHIP",
  "link": "/scholarships/123",
  "targetRole": "STUDENT",
  "sendPush": true,
  "interests": ["role-student", "category-computer-science"]
}
```

**Implementation Example**:
```javascript
router.post('/admin/notifications/send', authenticateToken, isAdmin, async (req, res) => {
  const {
    title,
    message,
    type,
    link,
    targetRole,
    targetUserIds,
    sendPush,
    interests
  } = req.body;

  try {
    // 1. Create in-app notifications in database
    let userIds = targetUserIds;

    if (!userIds && targetRole) {
      const users = await User.findAll({
        where: targetRole === 'ALL' ? {} : { role: targetRole },
        attributes: ['id']
      });
      userIds = users.map(u => u.id);
    }

    const notifications = await Notification.bulkCreate(
      userIds.map(userId => ({
        userId,
        title,
        message,
        type,
        link,
        isRead: false
      }))
    );

    // 2. Send push notifications via Pusher Beams (if enabled)
    if (sendPush) {
      const publishBody = {
        web: {
          notification: {
            title: title,
            body: message,
            deep_link: link || undefined,
            icon: '/icon-192x192.png',
            badge: '/badge-72x72.png'
          }
        }
      };

      // Send to interests (topic-based)
      if (interests && interests.length > 0) {
        await beamsClient.publishToInterests(interests, publishBody);
      }

      // Send to specific users
      if (userIds && userIds.length > 0) {
        await beamsClient.publishToUsers(userIds, publishBody);
      }
    }

    return res.status(200).json({
      success: true,
      data: notifications,
      pushSent: sendPush
    });
  } catch (error) {
    console.error('Send notification error:', error);
    return res.status(500).json({ error: 'Failed to send notifications' });
  }
});
```

## Environment Variables

Add to your `.env.local`:

```bash
# Pusher Beams Configuration
NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID=your-instance-id-here

# Backend only (.env)
PUSHER_BEAMS_SECRET_KEY=your-secret-key-here
```

## Frontend Usage

### 1. Auto-initialize in Layout/Provider

Add to your root layout or auth provider:

```tsx
import { usePushNotifications } from "@/hooks/usePushNotifications";

export default function RootLayout({ children }) {
  const {
    isInitialized,
    permission,
    interests,
    requestPermission
  } = usePushNotifications();

  return (
    <>
      {children}
      {permission === "default" && (
        <NotificationPermissionBanner onRequest={requestPermission} />
      )}
    </>
  );
}
```

### 2. Subscribe to Interests

```tsx
import { usePushNotifications } from "@/hooks/usePushNotifications";

function ScholarshipPage() {
  const { subscribe, unsubscribe } = usePushNotifications();

  const handleFollowCategory = async (category: string) => {
    await subscribe(`category-${category}`);
  };

  return (
    <Button onClick={() => handleFollowCategory('computer-science')}>
      Follow Computer Science
    </Button>
  );
}
```

### 3. Admin Send Push Notifications

```tsx
import { useNotifications } from "@/hooks/useNotifications";

function AdminPanel() {
  const { sendNotification } = useNotifications();

  const sendPush = () => {
    sendNotification.mutate({
      title: "New Scholarship",
      message: "Check it out!",
      type: "SCHOLARSHIP",
      link: "/scholarships/123",
      targetRole: "STUDENT",
      sendPush: true, // Enable push
      interests: ["role-student"]
    });
  };

  return <Button onClick={sendPush}>Send Push</Button>;
}
```

## Available Interests (Topics)

Default interests that are auto-subscribed:
- `role-student` - All students
- `role-professor` - All professors
- `role-admin` - All admins

Custom interests you can create:
- `category-{category}` - Specific scholarship categories
- `scholarship-{id}` - Specific scholarship updates
- `university-{name}` - University-specific notifications

## Installation

Install Pusher Beams packages:

```bash
# Frontend
npm install @pusher/push-notifications-web

# Backend
npm install @pusher/push-notifications-server
```

## Testing Push Notifications

1. **Open ScholarHub in browser**
2. **Grant notification permission** when prompted
3. **Check browser console** for Beams initialization logs
4. **Send test notification** from admin panel
5. **Verify notification appears** (even when tab is in background)

## Browser Support

- ✅ Chrome/Edge (Desktop & Android)
- ✅ Firefox (Desktop & Android)
- ✅ Safari (Desktop & iOS 16.4+)
- ❌ Safari (iOS < 16.4) - No Web Push support

## Security Notes

- ✅ Beams auth tokens are user-specific and expire
- ✅ Backend validates user identity before issuing tokens
- ✅ Only authenticated users can receive push notifications
- ✅ Instance ID is public, Secret Key is backend-only

## Troubleshooting

**Push not working?**
1. Check browser console for errors
2. Verify notification permission is granted
3. Confirm INSTANCE_ID is correct in env vars
4. Check backend logs for Beams errors
5. Test with Pusher Beams dashboard debug console

**Users not receiving pushes?**
1. Verify user is authenticated
2. Check they're subscribed to correct interests
3. Confirm backend is calling `publishToUsers` or `publishToInterests`
4. Check Pusher Beams dashboard for delivery stats

## Next Steps

1. ✅ Frontend implementation complete
2. ⚠️ Implement backend endpoints (see examples above)
3. ⚠️ Add environment variables
4. ⚠️ Install Pusher Beams packages
5. ⚠️ Test push notifications
6. ✅ Add UI for notification preferences (optional)
