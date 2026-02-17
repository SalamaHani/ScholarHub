# Backend Notification System Setup Guide

## 🎯 Overview

This guide will help you integrate the complete notification system (in-app + push notifications) into your backend server at `http://localhost:8080`.

## 📦 Prerequisites

- Backend server running on port 8080
- Node.js backend (Express/Fastify/etc.)
- Database (MySQL, PostgreSQL, MongoDB, or SQLite)
- Pusher Beams account (free tier available)

---

## ✅ Step 1: Install Required Packages

In your **backend project** (not this frontend), install:

```bash
npm install @pusher/push-notifications-server
```

---

## ✅ Step 2: Add Environment Variables

Add these to your **backend** `.env` file:

```bash
# Pusher Beams Configuration
PUSHER_BEAMS_INSTANCE_ID=b4f9c400-baed-4cb0-972f-9ceb7fd8141c
PUSHER_BEAMS_SECRET_KEY=6FD8140870C545B851278E657080D7673DDAABDAA067611F0DA2CA28511B9788

# Frontend URL (for deep links)
FRONTEND_URL=http://localhost:3000
```

---

## ✅ Step 3: Create Database Table/Model

### Option A: Using Prisma

Add to your `schema.prisma`:

```prisma
model Notification {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  title     String
  message   String   @db.Text
  type      NotificationType @default(INFO)
  link      String?
  isRead    Boolean  @default(false)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@index([isRead])
  @@index([createdAt])
}

enum NotificationType {
  INFO
  SUCCESS
  WARNING
  SCHOLARSHIP
  APPLICATION
}
```

Then update your User model:
```prisma
model User {
  // ... existing fields
  notifications Notification[]
}
```

Run migration:
```bash
npx prisma migrate dev --name add_notifications
npx prisma generate
```

### Option B: Using Sequelize

See `notification-model.js` for the Sequelize implementation.

### Option C: Using MongoDB/Mongoose

See `notification-model.js` for the Mongoose schema.

### Option D: Using Raw SQL

See `notification-model.js` for SQL schemas (PostgreSQL/MySQL).

---

## ✅ Step 4: Add Routes to Your Backend

Copy the `notifications.js` file to your backend routes folder, then integrate:

### Express.js Example:

```javascript
// In your main app.js or server.js
const notificationsRoutes = require('./routes/notifications');

// Mount the routes
app.use('/api', notificationsRoutes);
```

### Fastify Example:

```javascript
// In your main app.js or server.js
const notificationsRoutes = require('./routes/notifications');

// Convert Express routes to Fastify
fastify.register(require('@fastify/express'));
fastify.use('/api', notificationsRoutes);
```

---

## ✅ Step 5: Update Routes with Your Auth Middleware

Open `notifications.js` and uncomment/update these lines:

```javascript
// Line 8-10: Import your actual middleware
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Line 11-12: Import your actual models
const Notification = require('../models/Notification');
const User = require('../models/User');
```

Then uncomment the database queries in each route:
- Line 38-46: GET notifications query
- Line 75-86: PUT mark as read query
- Line 117-125: PUT mark all as read query
- Line 236-247: POST send notifications query

---

## ✅ Step 6: Test the Endpoints

### 1. Start Your Backend Server

```bash
cd your-backend-project
npm start
```

### 2. Test GET Notifications

```bash
curl http://localhost:8080/api/notifications \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected response:
```json
{
  "success": true,
  "data": []
}
```

### 3. Test Beams Auth

```bash
curl -X POST http://localhost:8080/api/notifications/beams-auth \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId": "your-user-id"}'
```

Expected response:
```json
{
  "success": true,
  "token": "eyJhbGc..."
}
```

### 4. Test Send Notification (Admin)

```bash
curl -X POST http://localhost:8080/api/admin/notifications/send \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Notification",
    "message": "This is a test",
    "type": "INFO",
    "targetRole": "STUDENT",
    "sendPush": true,
    "interests": ["role-student"]
  }'
```

---

## ✅ Step 7: Test From Frontend

1. Start your backend: `npm start` (in backend folder)
2. Start your frontend: `npm run dev` (in ScholarHub folder)
3. Login to ScholarHub
4. You should see a notification permission prompt
5. Grant permission
6. Check browser console for Pusher Beams initialization logs

---

## 📱 Step 8: Test Push Notifications

### Send a Test Push from Admin Panel:

1. Go to `http://localhost:3000/admin`
2. Find the Notifications Panel
3. Send a test notification with "Send Push" enabled
4. You should receive a browser notification!

### Send a Test Push via API:

```javascript
// Example: Send push when scholarship is published
const sendScholarshipNotification = async (scholarship) => {
    await fetch('http://localhost:8080/api/admin/notifications/send', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: 'New Scholarship Available',
            message: `${scholarship.title} is now open for applications!`,
            type: 'SCHOLARSHIP',
            link: `/scholarships/${scholarship.id}`,
            targetRole: 'STUDENT',
            sendPush: true,
            interests: ['role-student', `category-${scholarship.category}`]
        })
    });
};
```

---

## 🎯 API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/notifications` | User | Get user's notifications |
| PUT | `/api/notifications/:id/read` | User | Mark single as read |
| PUT | `/api/notifications/read-all` | User | Mark all as read |
| POST | `/api/notifications/beams-auth` | User | Get Beams auth token |
| POST | `/api/admin/notifications/send` | Admin | Send notifications + push |
| POST | `/api/admin/notifications/email` | Admin | Send email notification |

---

## 🔧 Troubleshooting

### Push Notifications Not Working?

1. **Check browser console** for errors
2. **Verify env variables** are set correctly
3. **Check notification permission** is granted
4. **Verify Pusher Beams credentials** are correct
5. **Check backend logs** for Beams errors

### Database Errors?

1. **Verify model** is created correctly
2. **Run migrations** if using Prisma/Sequelize
3. **Check foreign key** constraints (userId references users.id)
4. **Verify indexes** are created

### Auth Errors?

1. **Verify token** is being sent in Authorization header
2. **Check middleware** is properly configured
3. **Verify user ID** matches between frontend and backend

---

## 📚 Additional Resources

- [Pusher Beams Docs](https://pusher.com/docs/beams/)
- [Frontend Setup Guide](../PUSHER_BEAMS_SETUP.md)
- [Notification Model Reference](./notification-model.js)

---

## 🎉 Done!

Your notification system is now complete with:
- ✅ In-app notifications
- ✅ Browser push notifications
- ✅ Admin notification panel
- ✅ User notification preferences
- ✅ Topic-based notifications (interests)

Users will now receive notifications even when the app is in the background! 🚀
