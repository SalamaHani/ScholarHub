import axios from "axios";
import { getCookie, clearAllAuthCookies } from "@/lib/cookies";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Attach auth token to all requests
api.interceptors.request.use(
  (config) => {
    // Get token from professional cookies (client-side only)
    if (typeof window !== "undefined") {
      const token = getCookie("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized — session expired or invalid token
    const isAuthRequest =
      error.config?.url?.includes("/auth/logout") ||
      error.config?.url?.includes("/auth/login") ||
      error.config?.url?.includes("/auth/register");

    if (error.response?.status === 401 && !isAuthRequest) {
      // Clear all local auth state immediately
      clearAllAuthCookies();
      if (typeof window !== "undefined") {
        localStorage.removeItem("scholarhub_user");
        localStorage.removeItem("scholarhub_token");
        // Only redirect if not already on an auth page
        if (!window.location.pathname.startsWith("/auth")) {
          window.location.href = "/auth/login";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
