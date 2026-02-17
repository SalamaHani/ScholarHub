# 🔌 Test Backend Notification Connection

**Purpose:** Connect backend to get all user notifications and display them properly.

---

## 🎯 Quick Fix - Create Test Notifications

### **Method 1: Using Seed Script** ⭐ Easiest

**Step 1: Run Seed Script**
```bash
cd C:\Users\xtrem\Desktop\ScholarHubApi
node seed-notifications.js
```

**Expected Output:**
```
🌱 Seeding test notifications...

✅ Found user: John Doe (john@example.com)
   User ID: clf...

🗑️  Deleted 0 existing notifications

✅ Created 8 test notifications!

📋 Notifications created:
1. [○] 🎓 Welcome to ScholarHub!
2. [○] 📝 Complete Your Profile
3. [○] ✅ Application Submitted Successfully
...

🔔 Total: 8 notifications (6 unread)

✨ Done! Check http://localhost:3000/notifications
```

**Step 2: Refresh Frontend**
- Go to http://localhost:3000
- Click bell icon 🔔
- Should see 8 notifications!

---

### **Method 2: Using Admin Panel** (No Backend Access Needed)

**Step 1: Login as Admin**
```
http://localhost:3000/auth/login
```

**Step 2: Go to Admin Panel**
```
http://localhost:3000/admin
```

**Step 3: Send Notification**
- Find "Send Notification" section
- Fill in:
  ```
  Title: 🎓 Test Notification
  Message: This is a test to verify backend connection works!
  Type: INFO
  Target Role: ALL (or your specific role)
  Link: /scholarships
  ```
- Click **Send**

**Step 4: Check Notifications**
- Click bell icon in navbar
- Go to http://localhost:3000/notifications
- Should see your test notification!

---

### **Method 3: Using HTTP Request**

**Step 1: Get Auth Token**

Login first:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }'
```

Copy the `token` from response.

**Step 2: Send Notification**
```bash
curl -X POST http://localhost:8080/api/notifications/admin/send \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "ALL",
    "title": "🎓 Test Notification",
    "message": "Testing backend notification connection!",
    "type": "info",
    "link": "/scholarships"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Notification sent to 1 users (all users)",
  "data": {
    "count": 1,
    "recipients": "all users",
    "type": "info"
  }
}
```

**Step 3: Get Your Notifications**
```bash
curl http://localhost:8080/api/notifications \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "clf...",
        "title": "🎓 Test Notification",
        "message": "Testing backend notification connection!",
        "type": "info",
        "link": "/scholarships",
        "isRead": false,
        "createdAt": "2026-02-16T..."
      }
    ],
    "unreadCount": 1,
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

---

## 🔍 Verify Backend Connection

### **Test 1: Check API Endpoint**

```bash
# Must be logged in to get token first
curl http://localhost:8080/api/notifications \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected:**
- ✅ Status 200 OK
- ✅ Returns JSON with notifications array
- ❌ If 401: Token invalid, login again
- ❌ If 204: Empty - no notifications yet

---

### **Test 2: Check Frontend Hook**

**Open browser console (F12) on http://localhost:3000:**

```javascript
// Check if notifications are being fetched
fetch('http://localhost:8080/api/notifications', {
  headers: {
    'Authorization': 'Bearer ' + document.cookie.split('token=')[1]?.split(';')[0]
  }
})
.then(r => r.json())
.then(data => {
  console.log('✅ Backend Response:', data);
  console.log('📋 Notifications:', data.data?.notifications);
  console.log('🔔 Unread Count:', data.data?.unreadCount);
})
.catch(err => console.error('❌ Error:', err));
```

**Expected Output:**
```javascript
✅ Backend Response: {success: true, data: {...}}
📋 Notifications: [{id: "clf...", title: "...", ...}]
🔔 Unread Count: 3
```

---

### **Test 3: Check React Query**

**In browser console:**

```javascript
// Check React Query cache
window.localStorage.getItem('REACT_QUERY_OFFLINE_CACHE')

// Or check notifications state
// (Open React DevTools → Components → Find NotificationBell)
```

---

## 🛠️ Fix Empty Notifications

### **Problem: Notifications show as empty**

**Cause 1: No notifications in database**

**Fix:** Use one of the methods above to create test notifications

---

**Cause 2: Wrong user ID**

**Fix:**
1. Check your user ID:
   ```bash
   # Get current user info
   curl http://localhost:8080/api/users/profile \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

2. Notifications must match your user ID

---

**Cause 3: Backend not returning data correctly**

**Fix:** Check backend controller

File: `ScholarHubApi/src/controllers/notification.controller.ts`

Line 37-49 should return:
```typescript
res.json({
    success: true,
    data: {
        notifications,
        unreadCount,
        pagination: {...}
    }
});
```

---

**Cause 4: Frontend not parsing response**

**Fix:** Check frontend hook

File: `src/hooks/useNotifications.ts`

Line 37-38 should handle response:
```typescript
const { data } = await api.get<any>("/notifications");
return data.data || data;
```

This is already fixed! ✅

---

## 📊 Backend API Reference

### **GET /api/notifications**

**Description:** Get current user's notifications

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `unreadOnly` (optional): true/false (default: false)

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "clf123",
        "userId": "clf456",
        "title": "Notification Title",
        "message": "Notification message",
        "type": "info",
        "link": "/path",
        "isRead": false,
        "createdAt": "2026-02-16T..."
      }
    ],
    "unreadCount": 3,
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 10,
      "totalPages": 1
    }
  }
}
```

---

### **PUT /api/notifications/:id/read**

**Description:** Mark notification as read

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

### **PUT /api/notifications/read-all**

**Description:** Mark all notifications as read

**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

### **POST /api/notifications/admin/send**

**Description:** Send notification to users (Admin only)

**Body:**
```json
{
  "role": "ALL" | "STUDENT" | "PROFESSOR",
  "title": "Notification Title",
  "message": "Notification message",
  "type": "info" | "success" | "warning" | "error",
  "link": "/optional/link"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification sent to 5 users (all students)",
  "data": {
    "count": 5,
    "recipients": "all students",
    "type": "info"
  }
}
```

---

## ✅ Complete Test Checklist

After creating notifications, verify:

- [ ] Backend API returns notifications
  ```bash
  curl http://localhost:8080/api/notifications -H "Authorization: Bearer TOKEN"
  ```

- [ ] Frontend fetches notifications
  - Open http://localhost:3000
  - Bell icon shows count

- [ ] Notifications display in dropdown
  - Click bell icon
  - See notification list

- [ ] Notifications display on page
  - Go to http://localhost:3000/notifications
  - See full list

- [ ] Mark as read works
  - Click notification
  - Badge count decreases

- [ ] Mark all as read works
  - Click "Mark all read"
  - All notifications marked

- [ ] Backend connection working
  - No console errors
  - Data loads correctly

---

## 🎉 Quick Start

**Fastest way to test:**

```bash
# 1. Go to backend
cd C:\Users\xtrem\Desktop\ScholarHubApi

# 2. Run seed script
node seed-notifications.js

# 3. Open frontend
# http://localhost:3000

# 4. Click bell icon
# Should see 8 test notifications! 🔔
```

**Or use admin panel:**
1. Go to http://localhost:3000/admin
2. Send notification to ALL
3. Check bell icon

Done! Your backend is connected and notifications will display properly! ✅
