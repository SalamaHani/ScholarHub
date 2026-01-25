"use client";

import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    loginUser,
    registerUser,
    logoutUser,
    updateUserProfile,
    updateAvatar,
    initializeAuth,
    selectUser,
    selectToken,
    selectIsAuthenticated,
    selectIsLoading,
    selectAuthError,
    selectUserRole,
    User // Re-export for compatibility
} from "@/store/slices/authSlice";
export type { User };
import type { AppDispatch } from "@/store";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

/**
 * Professional Auth Hook
 * Powered by Redux Toolkit for scalable state management.
 * This hook provides a clean facade over Redux actions and selectors.
 */
export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    // Selectors
    const user = useSelector(selectUser);
    const token = useSelector(selectToken);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isLoading = useSelector(selectIsLoading);
    const error = useSelector(selectAuthError);
    const role = useSelector(selectUserRole);

    // Actions
    const login = useCallback(async (credentials: any) => {
        try {
            await dispatch(loginUser(credentials)).unwrap();
            toast({
                title: "Login successful",
                description: "Welcome back to ScholarHub!",
            });
            router.push("/");
        } catch (err: any) {
            toast({
                title: "Login failed",
                description: err || "Invalid credentials",
                variant: "destructive",
            });
            throw err;
        }
    }, [dispatch, router]);

    const register = useCallback(async (userData: any) => {
        try {
            await dispatch(registerUser(userData)).unwrap();
            toast({
                title: "Registration successful",
                description: "Your ScholarHub account has been created.",
            });
            router.push("/");
        } catch (err: any) {
            toast({
                title: "Registration failed",
                description: err || "Something went wrong",
                variant: "destructive",
            });
            throw err;
        }
    }, [dispatch, router]);

    const logout = useCallback(async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            toast({
                title: "Logged out",
                description: "You have been successfully logged out.",
            });
            router.push("/auth/login");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    }, [dispatch, router]);

    const editProfile = useCallback(async (profileData: any) => {
        try {
            await dispatch(updateUserProfile(profileData)).unwrap();
            toast({
                title: "Profile updated",
                description: "Your changes have been saved and synced.",
            });
        } catch (err: any) {
            toast({
                title: "Update failed",
                description: err || "Could not update profile",
                variant: "destructive",
            });
            throw err;
        }
    }, [dispatch]);

    const editAvatar = useCallback(async (avatarData: { avatar: string }) => {
        try {
            await dispatch(updateAvatar(avatarData)).unwrap();
            toast({
                title: "Avatar updated",
                description: "Your individual profile visual has been updated.",
            });
            router.refresh(); // Sync Next.js server state
        } catch (err: any) {
            toast({
                title: "Avatar update failed",
                description: err || "Could not update avatar image",
                variant: "destructive",
            });
            throw err;
        }
    }, [dispatch, router]);

    const refresh = useCallback(async () => {
        try {
            await dispatch(initializeAuth()).unwrap();
        } catch (err) {
            console.error("Auth refresh failed:", err);
        }
    }, [dispatch]);

    return useMemo(() => ({
        user,
        token,
        isAuthenticated,
        isLoading,
        error,
        role,
        refresh,
        login: {
            mutate: login,
            isPending: isLoading,
        },
        register: {
            mutate: register,
            isPending: isLoading,
        },
        logout: {
            mutate: logout,
            isPending: isLoading,
        },
        editProfile: {
            mutate: async (data: any) => {
                await editProfile(data);
                await refresh(); // Double sync
                router.refresh();
            },
            isPending: isLoading,
        },
        updateAvatar: {
            mutate: async (data: any) => {
                await editAvatar(data);
                await refresh(); // Double sync
                router.refresh();
            },
            isPending: isLoading,
        }
    }), [user, token, isAuthenticated, isLoading, error, role, login, register, logout, editProfile, editAvatar, refresh, router]);
};
