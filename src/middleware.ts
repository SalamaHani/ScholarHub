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

  const isAuthPage = pathname.startsWith("/auth");
  const isProfileRoute = pathname.startsWith("/profile");
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isSavedRoute = pathname.startsWith("/saved");
  const isProtectedPage = isProfileRoute || isDashboardRoute || isSavedRoute;

  // Auth pages: only redirect to home if token is valid
  // Allow /auth/pending-verification even with a token (no redirect loop)
  if (isAuthPage && token && !pathname.startsWith("/auth/pending-verification"))
    if (isProtectedPage) {
      // Protected routes — require a valid token
      if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
      const userData = getUserDataFromCookie(req);
      const role = getRoleFromCookie(req) || userData?.role;
      // Students cannot access dashboard — send to profile
      if (isDashboardRoute && role === "STUDENT") {
        return NextResponse.redirect(new URL("/profile", req.url));
      }
      // Unverified professors cannot access dashboard
      if (isDashboardRoute && role === "PROFESSOR") {
        const isVerified =
          userData?.isVerified || userData?.isProfessorVerified || false;
        if (!isVerified) {
          return NextResponse.redirect(
            new URL("/auth/pending-verification", req.url),
          );
        }
      }
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
