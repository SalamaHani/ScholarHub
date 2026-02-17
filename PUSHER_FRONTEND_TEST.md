# 🧪 Pusher Frontend Connection Test Guide

**Purpose:** Verify Pusher Beams is properly connected to the frontend and notifications display without errors.

---

## ✅ Pre-Flight Checklist

### **1. Environment Variables** (CRITICAL)

**File:** `.env`

```bash
# Must be present and correct
NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID=b4f9c400-baed-4cb0-972f-9ceb7fd8141c
```

**Verify:**
```bash
# In ScholarHub directory
cat .env | grep PUSHER
```

**Expected:** Should show the instance ID above ✅

---

### **2. Package Installation**

**Verify package is installed:**
```bash
npm list @pusher/push-notifications-web
```

**Expected:**
```
@pusher/push-notifications-web@1.3.8 ✅
```

**If not installed:**
```bash
npm install @pusher/push-notifications-web
```

---

### **3. Backend Running**

**Check backend is running:**
```bash
curl http://localhost:8080/api/health
```

**Expected:**
```json
{
  "success": true,
  "message": "ScholarHub API is running",
  "timestamp": "2026-02-16T..."
}
```

---

### **4. Frontend Running**

**Check frontend is running:**
```
Open: http://localhost:3000
```

**Expected:** Homepage loads without errors ✅

---

## 🔍 Step-by-Step Connection Test

### **Test 1: Check Browser Console (No Errors)**

1. **Open Browser DevTools**
   - Press `F12` or `Ctrl+Shift+I` (Windows)
   - Go to **Console** tab

2. **Clear Console**
   - Click the 🚫 clear button

3. **Login to ScholarHub**
   - Go to http://localhost:3000/auth/login
   - Enter credentials
   - Click Login

4. **Expected Console Output:**
   ```
   ✅ Pusher Beams initialized successfully for user: clf...
   ✅ Subscribed to interest: role-student
   ```

5. **❌ If you see errors:**

   **Error: "NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID not configured"**
   - **Fix:** Add instance ID to `.env` file
   - Restart frontend server (`npm run dev`)

   **Error: "Failed to fetch Beams auth token: 401"**
   - **Fix:** Backend auth endpoint not working
   - Check backend is running on port 8080
   - Check you're logged in with valid token

   **Error: "Invalid instance ID"**
   - **Fix:** Instance ID mismatch
   - Verify `.env` has correct instance ID
   - Should be: `b4f9c400-baed-4cb0-972f-9ceb7fd8141c`

---

### **Test 2: Check Browser Permission**

1. **Open Console**
   ```javascript
   // Type in browser console:
   Notification.permission
   ```

2. **Expected Result:**
   ```
   "granted" ✅  // Perfect!
   "default" ⚠️  // Need to request permission
   "denied"  ❌  // User blocked, need to enable in settings
   ```

3. **If "default" or "denied":**
   - Browser will show permission prompt on login
   - Click **Allow** when prompted
   - Or manually request:
     ```javascript
     Notification.requestPermission()
     ```

---

### **Test 3: Verify Pusher Connection Status**

**Method A: Using Status Component (Recommended)**

1. **Add Status Component to a page**

   Create test page: `src/app/test-pusher/page.tsx`
   ```tsx
   import { PusherConnectionStatus } from "@/components/notifications/pusher-connection-status";

   export default function TestPusherPage() {
     return (
       <div className="container py-8">
         <h1 className="text-2xl font-bold mb-6">Pusher Connection Test</h1>
         <PusherConnectionStatus />
       </div>
     );
   }
   ```

2. **Visit the page**
   ```
   http://localhost:3000/test-pusher
   ```

3. **Check Status Card**
   - ✅ **Green dot** = Connected (Perfect!)
   - 🟡 **Yellow dot** = Disconnected (Need to login/allow permission)
   - 🔴 **Red dot** = Error (Check console for details)

**Method B: Using Browser Console**

```javascript
// Check if Pusher client exists
window.beamsClient
// Should return: Client object ✅

// Check subscribed interests
window.beamsClient?.getDeviceInterests()
// Should return: Promise<["role-student", ...]> ✅
```

---

### **Test 4: Send Test Notification (No Errors)**

**Steps:**

1. **Login as Admin**
   - http://localhost:3000/auth/login
   - Use admin credentials

2. **Send Notification via Admin Panel**
   - Go to http://localhost:3000/admin
   - Find "Notifications" section
   - Click "Send Notification"
   - Fill in:
     ```
     Title: 🧪 Test Notification
     Message: Testing Pusher connection - you should see this!
     Type: INFO
     Target Role: ALL
     ```
   - Click **Send**

3. **Expected Results:**

   **✅ No Errors in Console**
   - Check browser console for errors
   - Should see no red error messages

   **✅ Browser Notification Appears**
   - Native OS notification pops up
   - Shows title and message
   - Has ScholarHub icon

   **✅ In-App Notification Shows**
   - Bell icon shows badge (1)
   - Click bell → notification in dropdown
   - Go to /notifications → notification in list

4. **❌ If No Browser Notification:**

   **Check Permission:**
   ```javascript
   Notification.permission
   // Must be "granted"
   ```

   **Check Initialization:**
   ```javascript
   // In console, should see:
   ✅ Pusher Beams initialized successfully
   ```

   **Check Backend Logs:**
   - Backend should show: "Push notification sent: clf..."
   - If not, Pusher service not working

---

### **Test 5: Network Requests (Debug)**

1. **Open Network Tab**
   - DevTools → Network tab
   - Filter: `beams`

2. **Login Again**
   - Logout and login
   - Watch Network tab

3. **Expected Requests:**

   **POST `/api/notifications/beams-auth`**
   - Status: `200 OK` ✅
   - Response:
     ```json
     {
       "success": true,
       "data": {
         "token": "..."
       }
     }
     ```

   **Pusher Beams SDK Requests**
   - Multiple requests to Pusher servers
   - All should be `200 OK` ✅

4. **❌ If 401 Unauthorized:**
   - Token expired or invalid
   - Logout and login again

---

## 🔧 Troubleshooting Common Issues

### **Issue 1: "Pusher not initializing"**

**Symptoms:**
- No console logs on login
- `isInitialized` stays `false`

**Solutions:**
1. Check `.env` has instance ID
2. Restart frontend: `npm run dev`
3. Clear browser cache: `Ctrl+Shift+Delete`
4. Check user is authenticated

---

### **Issue 2: "Browser permission denied"**

**Symptoms:**
- `Notification.permission` returns `"denied"`
- No browser notifications appear

**Solutions:**

**Chrome:**
1. Click 🔒 lock icon in address bar
2. Click "Site settings"
3. Find "Notifications"
4. Change to "Allow"
5. Refresh page

**Firefox:**
1. Click ⓘ info icon in address bar
2. Click "Permissions"
3. Find "Notifications"
4. Select "Allow"
5. Refresh page

**Edge:**
1. Click 🔒 lock icon
2. Click "Permissions for this site"
3. Find "Notifications"
4. Change to "Allow"
5. Refresh page

---

### **Issue 3: "Backend auth token fails"**

**Symptoms:**
- Console error: "Failed to fetch Beams auth token"
- Status: 401 or 500

**Solutions:**

1. **Check Backend is Running**
   ```bash
   curl http://localhost:8080/api/health
   ```

2. **Check Backend .env**
   ```bash
   # In ScholarHubApi directory
   cat .env | grep PUSHER

   # Should show:
   PUSHER_INSTANCE_ID=b4f9c400-baed-4cb0-972f-9ceb7fd8141c
   PUSHER_SECRET_KEY=6FD8140870C545B851278E657080D7673DDAABDAA067611F0DA2CA28511B9788
   ```

3. **Check Pusher Service**
   ```bash
   # Backend should have pusher.service.ts
   ls ScholarHubApi/src/services/pusher.service.ts
   ```

4. **Test Auth Endpoint Manually**
   ```bash
   curl -X POST http://localhost:8080/api/notifications/beams-auth \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"userId":"YOUR_USER_ID"}'
   ```

---

### **Issue 4: "Notifications not appearing"**

**Symptoms:**
- Pusher initialized successfully
- Permission granted
- But no notifications appear

**Solutions:**

1. **Check Interest Subscription**
   ```javascript
   // In browser console:
   window.beamsClient?.getDeviceInterests()
   // Should return array with interests
   ```

2. **Check Backend Sent Push**
   - Look at backend logs
   - Should see: "Push notification sent: clf..."

3. **Check Pusher Dashboard**
   - Go to https://dashboard.pusher.com/beams
   - Login with your account
   - Check "Notifications" → Should see sent notifications

4. **Try Manual Notification**
   ```javascript
   // In browser console:
   new Notification("Test", {
     body: "If you see this, browser notifications work!",
     icon: "/logo.png"
   });
   ```

---

### **Issue 5: "Console shows errors on page load"**

**Common Errors:**

**"Cannot read property 'start' of null"**
- Pusher client not initialized
- Check user is logged in
- Check instance ID in `.env`

**"Service worker registration failed"**
- Normal for dev environment
- Can be ignored (Pusher Beams works without service worker)

**"Mixed content warning"**
- Normal for localhost
- Will be fixed in production with HTTPS

---

## ✅ Success Checklist

After completing all tests, verify:

- ✅ No errors in browser console
- ✅ `Notification.permission` is `"granted"`
- ✅ Console shows "✅ Pusher Beams initialized successfully"
- ✅ Console shows "✅ Subscribed to interest: role-..."
- ✅ Network tab shows successful `/beams-auth` request
- ✅ Status component shows green dot (connected)
- ✅ Test notification appears as browser notification
- ✅ Test notification appears in bell dropdown
- ✅ Test notification appears on /notifications page
- ✅ Bell icon badge updates correctly

---

## 🎯 Quick Test Script

Copy/paste this into browser console after login:

```javascript
// Pusher Frontend Connection Test
console.log("🧪 Running Pusher Connection Test...\n");

// 1. Check permission
console.log("1️⃣ Browser Permission:", Notification.permission);
if (Notification.permission === "granted") {
  console.log("✅ PASS: Notifications allowed");
} else {
  console.log("❌ FAIL: Need to allow notifications");
}

// 2. Check environment variable
console.log("\n2️⃣ Instance ID:", process.env.NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID);
if (process.env.NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID) {
  console.log("✅ PASS: Instance ID configured");
} else {
  console.log("❌ FAIL: Instance ID missing in .env");
}

// 3. Check Pusher client
console.log("\n3️⃣ Checking Beams Client...");
if (window.beamsClient) {
  console.log("✅ PASS: Beams client exists");
  window.beamsClient.getDeviceInterests().then(interests => {
    console.log("📋 Subscribed Interests:", interests);
  });
} else {
  console.log("❌ FAIL: Beams client not initialized");
}

// 4. Send test browser notification
console.log("\n4️⃣ Testing Browser Notification...");
if (Notification.permission === "granted") {
  new Notification("🧪 Pusher Test", {
    body: "If you see this, browser notifications are working!",
    icon: "/logo.png"
  });
  console.log("✅ PASS: Test notification sent");
} else {
  console.log("⚠️ SKIP: Permission not granted");
}

console.log("\n🎉 Test Complete!");
```

---

## 📊 Expected Full Flow (No Errors)

```
1. User opens http://localhost:3000
   ✅ No console errors

2. User logs in
   ✅ Console: "✅ Pusher Beams initialized successfully for user: clf..."
   ✅ Console: "✅ Subscribed to interest: role-student"
   ✅ Browser shows notification permission prompt

3. User allows notifications
   ✅ Notification.permission = "granted"
   ✅ No errors in console

4. Admin sends notification
   ✅ Backend: "Push notification sent: clf..."
   ✅ Browser notification appears
   ✅ In-app notification appears
   ✅ Bell badge updates
   ✅ No errors in console

5. User clicks notification
   ✅ App opens to correct page
   ✅ Notification marked as read
   ✅ No errors in console
```

---

## 🎉 Verification Complete!

If all tests pass, your Pusher frontend connection is working perfectly with no errors!

**Status Component Added:**
- File: `src/components/notifications/pusher-connection-status.tsx`
- Usage: Shows real-time connection status
- Helps debug issues visually

**Test Page:**
- Create: `src/app/test-pusher/page.tsx`
- Visit: http://localhost:3000/test-pusher
- See: Live connection status

Your push notifications are ready to use! 🔔✨
