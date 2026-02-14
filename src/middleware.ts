import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "scholarhub-secret-key-change-me-in-production",
);

// Helper to verify JWT token
async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch {
    return null;
  }
}

// Helper to get role from cookies
function getRoleFromCookie(req: NextRequest): string | null {
  const roleCookie = req.cookies.get("role")?.value;
  return roleCookie ? roleCookie.toUpperCase() : null;
}

// Helper to get user data from cookies
function getUserDataFromCookie(req: NextRequest): any {
  const userDataCookie = req.cookies.get("user_data")?.value;
  if (!userDataCookie) return null;

  try {
    return JSON.parse(userDataCookie);
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Define route access rules
  const isAuthPage = pathname.startsWith("/auth");
  const isProfileRoute = pathname.startsWith("/profile");
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isSavedRoute = pathname.startsWith("/saved");
  const isProtectedPage = isDashboardRoute || isSavedRoute;

  // If on auth page and already logged in, redirect to home
  if (isAuthPage && token) {
    const payload = await verifyToken(token);
    if (payload) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Protected routes - require authentication
  if (isProtectedPage) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Verify the token is valid
    const payload = await verifyToken(token);
    // Role-based access control
    const role = getRoleFromCookie(req) || (payload as any).role?.toUpperCase();

    // Dashboard is only accessible to PROFESSOR and ADMIN
    if (isDashboardRoute && role === "STUDENT") {
      return NextResponse.redirect(new URL("/profile", req.url));
    }

    // All authenticated users can access profile and saved routes
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/dashboard/:path*",
    "/saved/:path*",
    "/auth/:path*",
  ],
};
