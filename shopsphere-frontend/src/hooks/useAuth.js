import { useState, useEffect, useCallback } from "react";

// Reads auth state from localStorage and stays in sync — both across
// tabs (native "storage" event) and within the same tab (a custom
// "authchange" event, since "storage" doesn't fire in the tab that
// made the change).
export function useAuth() {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [role, setRole] = useState(() => localStorage.getItem("role"));

    const sync = useCallback(() => {
        setToken(localStorage.getItem("token"));
        setRole(localStorage.getItem("role"));
    }, []);

    useEffect(() => {
        window.addEventListener("storage", sync);
        window.addEventListener("authchange", sync);
        return () => {
            window.removeEventListener("storage", sync);
            window.removeEventListener("authchange", sync);
        };
    }, [sync]);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.dispatchEvent(new Event("authchange"));
    }, []);

    return { token, role, logout };
}