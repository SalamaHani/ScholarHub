/**
 * Script to Create Test Notifications in Database
 * Run this to populate notifications for testing
 */

// Copy this code and run in backend directory or Prisma Studio

const testNotifications = [
  {
    title: "🎓 Welcome to ScholarHub!",
    message: "Start exploring scholarships and opportunities tailored for you.",
    type: "info",
    link: "/scholarships",
    isRead: false
  },
  {
    title: "📝 Complete Your Profile",
    message: "80% complete! Add more details to get better scholarship matches.",
    type: "warning",
    link: "/profile",
    isRead: false
  },
  {
    title: "✅ Application Submitted",
    message: "Your application for Computer Science Scholarship has been submitted successfully.",
    type: "success",
    link: "/applications",
    isRead: false
  },
  {
    title: "🔔 New Scholarship Available",
    message: "Engineering Excellence Scholarship - Deadline: March 30, 2026",
    type: "info",
    link: "/scholarships/new",
    isRead: false
  },
  {
    title: "⏰ Deadline Reminder",
    message: "Medical Research Scholarship deadline is in 3 days!",
    type: "warning",
    link: "/scholarships/456",
    isRead: true
  }
];

// Instructions to create notifications:
// 1. Login to get your user ID
// 2. Use one of these methods:

console.log("=== Method 1: Using Prisma Studio ===");
console.log("1. Open Prisma Studio:");
console.log("   cd ScholarHubApi");
console.log("   npx prisma studio");
console.log("");
console.log("2. Open http://localhost:5555");
console.log("3. Click 'Notification' model");
console.log("4. Click 'Add record'");
console.log("5. Fill in the fields below:");
console.log("");
testNotifications.forEach((notif, i) => {
  console.log(`--- Notification ${i + 1} ---`);
  console.log(JSON.stringify(notif, null, 2));
  console.log("");
});

console.log("\n=== Method 2: Using API (Recommended) ===");
console.log("Run this curl command (replace YOUR_ADMIN_TOKEN):\n");

const curlCommand = `curl -X POST http://localhost:8080/api/notifications/admin/send \\
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "role": "ALL",
    "title": "🎓 Welcome to ScholarHub!",
    "message": "Start exploring scholarships and opportunities.",
    "type": "info",
    "link": "/scholarships"
  }'`;

console.log(curlCommand);

console.log("\n=== Method 3: Using Admin Panel (Easiest) ===");
console.log("1. Go to http://localhost:3000/auth/login");
console.log("2. Login as admin");
console.log("3. Go to http://localhost:3000/admin");
console.log("4. Find 'Notifications' section");
console.log("5. Click 'Send Notification'");
console.log("6. Fill in and send!");

module.exports = testNotifications;
