"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { useEffect, useRef } from "react";
import { initializeAuth } from "@/store/slices/authSlice";
import { fetchSettings, SETTINGS_SYNC_CHANNEL } from "@/store/slices/settingsSlice";

function AppInitializer({ children }: { children: React.ReactNode }) {
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            // Fetch auth and settings in parallel on app load
            store.dispatch(initializeAuth());
            store.dispatch(fetchSettings());
        }
    }, []);

    // Listen for cross-tab settings changes and refetch from the API
    useEffect(() => {
        if (typeof BroadcastChannel === "undefined") return;
        const ch = new BroadcastChannel(SETTINGS_SYNC_CHANNEL);
        ch.onmessage = () => { store.dispatch(fetchSettings()); };
        return () => ch.close();
    }, []);

    return <>{children}</>;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <AppInitializer>{children}</AppInitializer>
        </Provider>
    );
}
