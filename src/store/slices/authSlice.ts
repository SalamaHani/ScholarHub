import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import {
    getCookie,
    setAuthCookie,
    initAuthExpiry,
    deleteCookie,
    clearAllAuthCookies
} from "@/lib/cookies";

// --- Types ---

export interface User {
    id: string;
    email: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    role: "STUDENT" | "PROFESSOR" | "ADMIN";
    avatar?: string;
    university?: string;
    fieldOfStudy?: string;
    degreeLevel?: string;
    currentDegree?: string;
    gpa?: number;
    graduationYear?: number;
    country?: string;
    city?: string;
    zipCode?: string;
    bio?: string;
    age?: number;
    gender?: string;
    phoneNumber?: string;
    // Professor Specific
    institution?: string;
    department?: string;
    profileCompleteness?: number;
    position?: string;
    specialization?: string;
    website?: string;
    isVerified?: boolean;
    experience?: any[];
    verifiedAt?: string | null;
    verifiedBy?: string | null;
    verificationDocs?: string | null;
    documents?: string[];
    skills?: string[];
    languages?: { name: string; proficiency: number }[];
    isEmailVerified: boolean;
    isProfessorVerified: boolean;
    isBlocked: boolean;
    certifications?: any[];
    progressMessage?: string;
    progressStatus?: string;
    officeLocation?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;
    error: string | null;
}

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterData {
    email: string;
    password: string;
    name: string;
    firstName?: string;
    lastName?: string;
    role?: "STUDENT" | "PROFESSOR";
}

function normalizeUser(rawUser: any): User {
    const profile = rawUser.studentProfile || rawUser.professorProfile || rawUser.professionalProfile || {};

    const name = rawUser.name ||
        (rawUser.firstName && rawUser.lastName ? `${rawUser.firstName} ${rawUser.lastName}` :
            rawUser.firstName || rawUser.email);

    return {
        ...rawUser,
        name,
        university: rawUser.university || profile.university,
        fieldOfStudy: rawUser.fieldOfStudy || profile.fieldOfStudy,
        degreeLevel: rawUser.degreeLevel || profile.degreeLevel,
        currentDegree: rawUser.currentDegree || profile.currentDegree,
        gpa: rawUser.gpa || profile.gpa,
        graduationYear: rawUser.graduationYear || profile.graduationYear,
        country: rawUser.country || profile.country,
        city: rawUser.city || profile.city,
        zipCode: rawUser.zipCode || profile.zipCode,
        bio: rawUser.bio || profile.bio,
        age: rawUser.age || profile.age,
        gender: rawUser.gender || profile.gender,
        phoneNumber: rawUser.phoneNumber || profile.phoneNumber,
        institution: rawUser.institution || profile.institution,
        department: rawUser.department || profile.department,
        position: rawUser.position || profile.position,
        specialization: rawUser.specialization || profile.specialization,
        website: rawUser.website || profile.website,
        profileCompleteness: rawUser.profileCompleteness ?? profile.profileCompleteness ?? 0,
        isVerified: rawUser.isVerified ?? profile.isVerified ?? rawUser.isProfessorVerified,
        experience: (() => {
            const exp = rawUser.experience || profile.experience;
            if (!exp) return [];
            if (typeof exp === 'string') {
                try {
                    return JSON.parse(exp);
                } catch (e) {
                    return [];
                }
            }
            return Array.isArray(exp) ? exp : [];
        })(),
        verifiedAt: rawUser.verifiedAt || profile.verifiedAt,
        verifiedBy: rawUser.verifiedBy || profile.verifiedBy,
        verificationDocs: rawUser.verificationDocs || profile.verificationDocs,
        documents: rawUser.documents || profile.documents,
        skills: rawUser.skills || profile.skills || [],
        languages: (() => {
            const langs = rawUser.languages || profile.languages;
            if (!langs) return [];
            if (typeof langs === 'string') {
                try {
                    return JSON.parse(langs);
                } catch (e) {
                    return [];
                }
            }
            return Array.isArray(langs) ? langs : [];
        })(),
        certifications: (() => {
            const certs = rawUser.certifications || profile.certifications;
            if (!certs) return [];
            if (typeof certs === 'string') {
                try {
                    return JSON.parse(certs);
                } catch (e) {
                    return [];
                }
            }
            return Array.isArray(certs) ? certs : [];
        })(),
    };
}

function setAuthStorage(token: string, user: User): void {
    // Resolve a professional name
    const professionalName = user.name ||
        ((user as any).firstName && (user as any).lastName
            ? `${(user as any).firstName} ${(user as any).lastName}`
            : (user as any).firstName || user.email);

    // Anchor the 7-day expiry to login time (no reset on subsequent calls)
    initAuthExpiry();

    // Cookies for middleware and client access — all share the same fixed expiry
    setAuthCookie("token", token);
    setAuthCookie("role", user.role.toUpperCase());
    setAuthCookie("user_name", professionalName);
    setAuthCookie("user_data", JSON.stringify({
        id: user.id,
        role: user.role,
        email: user.email,
        name: professionalName,
        avatar: user.avatar,
        isVerified: user.isVerified || user.isProfessorVerified
    }));

    // LocalStorage for full user data (client-only recovery)
    if (typeof window !== "undefined") {
        localStorage.setItem("scholarhub_user", JSON.stringify(user));
        localStorage.setItem("scholarhub_token", token);
    }
}

function clearAuthStorage(): void {
    // Cookies
    clearAllAuthCookies();
    // LocalStorage
    if (typeof window !== "undefined") {
        localStorage.removeItem("scholarhub_user");
        localStorage.removeItem("scholarhub_token");
    }
}

function getStoredAuth(): { token: string | null; user: User | null } {
    if (typeof window === "undefined") {
        return { token: null, user: null };
    }

    // Professional recovery: Prefer local storage for full data, fall back to cookies
    let token = localStorage.getItem("scholarhub_token") || getCookie("token");
    let user: User | null = null;

    const storedUser = localStorage.getItem("scholarhub_user");
    if (storedUser) {
        try {
            user = JSON.parse(storedUser);
        } catch (e) {
            console.error("Failed to parse localStorage user:", e);
        }
    }

    // Fallback to cookie if localStorage is empty
    if (!user) {
        const userStr = getCookie("user_data");
        if (userStr) {
            try {
                user = JSON.parse(userStr);
            } catch (e) {
                console.error("Failed to parse stored user data:", e);
            }
        }
    }

    return { token, user };
}

// --- Initial State ---

const { token: initialToken, user: initialUser } = getStoredAuth();

const initialState: AuthState = {
    user: initialUser,
    token: initialToken,
    isAuthenticated: !!initialToken && !!initialUser,
    isLoading: false,
    isInitialized: false,
    error: null,
};

// --- Async Thunks ---

export const initializeAuth = createAsyncThunk(
    "auth/initialize",
    async (_, { rejectWithValue }) => {
        const { token } = getStoredAuth();

        if (!token) {
            return { user: null, token: null };
        }

        try {
            const { data } = await api.get("/auth/me");
            const rawUser = data.data?.user || data.user || data.data || data;

            // Flatten nested profile data
            const user = normalizeUser(rawUser);

            // Refresh cookies
            setAuthStorage(token, user);
            return { user, token };
        } catch (error: any) {
            clearAuthStorage();
            return rejectWithValue(error.response?.data?.message || "Session expired");
        }
    }
);

export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/auth/login", credentials);
            const authData = data.data || data;

            // Precise extraction based on your API structure
            const token = authData.accessToken || authData.token || authData.tokens?.accessToken;
            const user = authData.user || (authData.tokens ? authData.user : authData);

            if (token && user) {
                const normalizedUser = normalizeUser(user);
                setAuthStorage(token, normalizedUser);
                return { user: normalizedUser, token };
            }

            throw new Error("Invalid response format from server");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Invalid credentials"
            );
        }
    }
);

export const registerUser = createAsyncThunk(
    "auth/register",
    async (userData: RegisterData, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/auth/register", userData);
            const authData = data.data || data;

            // Precise extraction based on your API structure
            const token = authData.accessToken || authData.token || authData.tokens?.accessToken;
            const user = authData.user || (authData.tokens ? authData.user : authData);

            if (token && user) {
                const normalizedUser = normalizeUser(user);
                setAuthStorage(token, normalizedUser);
                return { user: normalizedUser, token };
            }

            throw new Error("Registration succeeded but response format was invalid");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Registration failed"
            );
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            // Attempt server-side logout
            await api.post("/auth/logout");
            return null;
        } catch (error: any) {
            // If the server returns 401, it means we're already logged out there
            // We just log it and proceed with local cleanup
            console.warn("Logout API warning:", error.message);
            return null;
        } finally {
            // Always clear local state/cookies
            clearAuthStorage();
        }
    }
);

export const updateUserRole = createAsyncThunk(
    "auth/updateRole",
    async (role: "STUDENT" | "PROFESSOR" | "ADMIN", { getState, rejectWithValue }) => {
        try {
            const { data } = await api.patch("/auth/role", { role });
            const updatedUser = data.data?.user || data.user || data.data || data;

            // Update storage with new role
            const state = getState() as { auth: AuthState };
            if (state.auth.token && updatedUser) {
                setAuthStorage(state.auth.token, updatedUser);
            }
            return updatedUser;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update role"
            );
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    "auth/updateProfile",
    async (profileData: Partial<User>, { getState, rejectWithValue }) => {
        try {
            // Updated to use the base profile endpoint
            const { data } = await api.put("/users/profile", profileData);
            const rawUser = data.data?.user || data.user || data.data || data;

            // Handle nested profile data consistently with initializeAuth
            const user = normalizeUser(rawUser);

            // Update storage with new data
            const state = getState() as { auth: AuthState };
            if (state.auth.token && user) {
                setAuthStorage(state.auth.token, user);
            }
            return user;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update profile"
            );
        }
    }
);

export const updateAvatar = createAsyncThunk(
    "auth/updateAvatar",
    async (avatarData: { avatar: string }, { getState, rejectWithValue }) => {
        try {
            // Updated to the user controller's specific avatar endpoint
            const { data } = await api.put("/users/avatar", avatarData);
            const updatedUser = data.data?.user || data.user || data.data || data;

            // Sync with local storage
            const state = getState() as { auth: AuthState };
            if (state.auth.token && updatedUser) {
                setAuthStorage(state.auth.token, updatedUser);
            }
            return updatedUser;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update avatar"
            );
        }
    }
);

// --- Slice ---

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Manual credentials update (for edge cases)
        setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.error = null;
            setAuthStorage(action.payload.token, action.payload.user);
        },
        // Clear any errors
        clearError: (state) => {
            state.error = null;
        },
        // Update user data locally
        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
                if (state.token) {
                    setAuthStorage(state.token, state.user);
                }
            }
        },
    },
    extraReducers: (builder) => {
        // Initialize Auth
        builder
            .addCase(initializeAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(initializeAuth.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = !!action.payload.user;
                state.isLoading = false;
                state.isInitialized = true;
                state.error = null;
            })
            .addCase(initializeAuth.rejected, (state, action) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.isLoading = false;
                state.isInitialized = true;
                state.error = action.payload as string;
            });

        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Register
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Logout
        builder
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state) => {
                // Still logout locally even if API fails
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.isLoading = false;
            });

        // Update Role
        builder
            .addCase(updateUserRole.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(updateUserRole.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Update Profile
        builder
            .addCase(updateUserProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Update Avatar
        builder
            .addCase(updateAvatar.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateAvatar.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(updateAvatar.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setCredentials, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;

// --- Selectors ---

export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectIsInitialized = (state: { auth: AuthState }) => state.auth.isInitialized;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectUserRole = (state: { auth: AuthState }) => state.auth.user?.role;
