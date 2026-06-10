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
import { useTranslation } from "@/hooks/useTranslation";

/**
 * Professional Auth Hook
 * Powered by Redux Toolkit for scalable state management.
 * This hook provides a clean facade over Redux actions and selectors.
 */
export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { t } = useTranslation();

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
            const result = await dispatch(loginUser(credentials)).unwrap();
            toast({
                title: t.auth.loginSuccessful,
                description: t.auth.welcomeBackToast,
            });
            await dispatch(initializeAuth());

            // Check if professor needs verification
            const user = result.user;
            const isProfessor = user?.role === "PROFESSOR";
            const isVerified = user?.isProfessorVerified || user?.isVerified;

            if (isProfessor && !isVerified) {
                // Professor not verified - redirect to pending page
                router.push("/auth/pending-verification");
            } else {
                // Student or verified professor - go to dashboard
                router.push("/");
            }
        } catch (err: any) {
            toast({
                title: t.auth.loginFailed,
                description: err || t.auth.invalidCredentials,
                variant: "destructive",
            });
            throw err;
        }
    }, [dispatch, router, t]);

    const register = useCallback(async (userData: any) => {
        try {
            const result = await dispatch(registerUser(userData)).unwrap();
            toast({
                title: t.auth.registrationSuccessful,
                description: t.auth.accountCreated,
            });

            // Check if professor needs verification
            const user = result.user;
            const isProfessor = user?.role === "PROFESSOR";
            const isVerified = user?.isProfessorVerified || user?.isVerified;

            if (isProfessor && !isVerified) {
                // Professor not verified - redirect to pending page
                router.push("/auth/pending-verification");
            } else {
                // Student or verified professor - go to dashboard
                router.push("/");
            }
        } catch (err: any) {
            toast({
                title: t.auth.registrationFailed,
                description: err || t.auth.somethingWentWrong,
                variant: "destructive",
            });
            throw err;
        }
    }, [dispatch, router]);

    const logout = useCallback(async () => {
        // Always clear local state first — regardless of API result
        await dispatch(logoutUser());
        toast({
            title: t.auth.loggedOutTitle,
            description: t.auth.loggedOutDesc,
        });
        router.push("/auth/login");
    }, [dispatch, router, t]);

    const editProfile = useCallback(async (profileData: any) => {
        try {
            await dispatch(updateUserProfile(profileData)).unwrap();
            toast({
                title: t.auth.profileUpdated,
                description: t.auth.profileUpdatedDesc,
            });
        } catch (err: any) {
            toast({
                title: t.auth.updateFailed,
                description: err || t.auth.couldNotUpdateProfile,
                variant: "destructive",
            });
            throw err;
        }
    }, [dispatch, t]);

    const editAvatar = useCallback(async (avatarData: { avatar: string }) => {
        try {
            await dispatch(updateAvatar(avatarData)).unwrap();
            toast({
                title: t.auth.avatarUpdated,
                description: t.auth.avatarUpdatedDesc,
            });
            router.refresh(); // Sync Next.js server state
        } catch (err: any) {
            toast({
                title: t.auth.avatarUpdateFailed,
                description: err || t.auth.couldNotUpdateAvatar,
                variant: "destructive",
            });
            throw err;
        }
    }, [dispatch, router, t]);

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
