# Create Test Notifications

## Issue: 204 No Content Response

When you see "204 No Content" from the notifications endpoint, it likely means:
1. ✅ The endpoint is working correctly
2. ⚠️ There are NO notifications in the database yet
3. ✅ The frontend now handles empty responses better

---

## Solution 1: Use Admin Panel (Recommended)

1. **Login as Admin** at http://localhost:3000/auth/login
   - Use admin credentials

2. **Navigate to Admin Dashboard** at http://localhost:3000/admin

3. **Find "Notifications" section**

4. **Click "Send Notification"**

5. **Fill in the form:**
   - Title: "Welcome to ScholarHub!"
   - Message: "This is your first notification"
   - Type: Info
   - Target Role: ALL
   - Click Send

6. **Check notifications** - Click the bell icon in navbar

---

## Solution 2: Use HTTP Client (Postman/Thunder Client)

### Step 1: Login to get auth token

```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

**Copy the `token` from response**

---

### Step 2: Create test notification

```http
POST http://localhost:8080/api/notifications/admin/send
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "role": "ALL",
  "title": "🎓 Welcome to ScholarHub!",
  "message": "Start exploring scholarships and opportunities. Good luck!",
  "type": "info",
  "link": "/scholarships"
}
```

---

### Step 3: Verify notifications

```http
GET http://localhost:8080/api/notifications
Authorization: Bearer YOUR_TOKEN_HERE
```

**Should return:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "...",
        "title": "🎓 Welcome to ScholarHub!",
        "message": "Start exploring scholarships...",
        "type": "info",
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

## Solution 3: Use Prisma Studio

### Open Database GUI

```bash
cd C:\Users\xtrem\Desktop\ScholarHubApi
npx prisma studio
```

### Create Notification Manually

1. Open http://localhost:5555
2. Click on "Notification" model
3. Click "Add record"
4. Fill in:
   - userId: (copy a user ID from User table)
   - title: "Test Notification"
   - message: "This is a test"
   - type: "info"
   - isRead: false
5. Click "Save 1 change"

---

## Solution 4: Create with Prisma CLI

```bash
cd C:\Users\xtrem\Desktop\ScholarHubApi
npx ts-node -e "
import prisma from './src/lib/prisma.js';

async function createTestNotifications() {
  // Get first user
  const user = await prisma.user.findFirst();

  if (!user) {
    console.log('No users found. Create a user first.');
    return;
  }

  // Create test notifications
  const notifications = await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        title: '🎓 Welcome to ScholarHub!',
        message: 'Start exploring scholarships and opportunities.',
        type: 'info',
        link: '/scholarships'
      },
      {
        userId: user.id,
        title: '📝 Application Reminder',
        message: 'Don\\'t forget to complete your profile for better matches.',
        type: 'warning',
        link: '/profile'
      },
      {
        userId: user.id,
        title: '✅ Profile Verified',
        message: 'Your profile has been verified successfully!',
        type: 'success'
      }
    ]
  });

  console.log(\`Created \${notifications.count} test notifications\`);
}

createTestNotifications();
"
```

---

## Verify Frontend Fix

The frontend hook has been updated to handle empty responses:

**File:** `src/hooks/useNotifications.ts`

```typescript
// Now handles 204 No Content gracefully
if (!data || Object.keys(data).length === 0) {
    return {
        notifications: [],
        unreadCount: 0,
        pagination: {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0
        }
    };
}
```

---

## Expected Behavior Now

### Before Fix:
- Empty database → 204 No Content → Frontend crashes/shows error
- No notifications display

### After Fix:
- Empty database → 204 No Content → Frontend shows "No notifications yet"
- Bell icon shows no badge
- Clicking bell shows empty state message

---

## Test the Fix

1. **Refresh the frontend** (Ctrl + Shift + R)
2. **Click the bell icon** in navbar
3. **Should see:**
   - Bell icon with no badge
   - Dropdown with message: "No notifications yet"
   - "We'll notify you when something happens"

4. **Create a test notification** (use one of the methods above)
5. **Refresh the page**
6. **Should see:**
   - Bell icon with badge (1)
   - Notification in dropdown
   - Blue dot for unread notification

---

## Common Issues

### Issue: Still seeing 204 error
**Solution:** Clear browser cache and refresh (Ctrl + Shift + R)

### Issue: Can't create notifications (not admin)
**Solution:** Login with admin account or check your role in database

### Issue: Notifications created but not showing
**Solution:** Check userId matches your logged-in user

### Issue: "No token provided" error
**Solution:** Make sure you're logged in and token is valid

---

## Quick Test HTTP Requests

Open [test-notification.http](./test-notification.http) in VS Code with REST Client extension:

1. Click "Send Request" on login endpoint
2. Copy token from response
3. Replace `YOUR_AUTH_TOKEN` in other requests
4. Test each endpoint

---

**✅ Frontend fix applied!**
**🔍 Use one of the methods above to create test notifications**
**🧪 Test the notification system end-to-end**
