import axios from "axios";
import { getCookie, clearAllAuthCookies } from "@/lib/cookies";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
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
    }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized errors
        const isAuthRequest = error.config?.url?.includes("/auth/logout") || error.config?.url?.includes("/auth/login");

        if (error.response?.status === 401 && !isAuthRequest) {
            // Break the store loop by using direct cookie cleanup
            clearAllAuthCookies();

            // Force redirect on client side if needed
            if (typeof window !== "undefined") {
                window.location.href = "/auth/login?expired=true";
            }
        }

        return Promise.reject(error);
    }
);

export default api;
