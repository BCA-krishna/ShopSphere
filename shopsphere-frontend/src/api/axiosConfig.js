import axios from "axios";

// Reads from .env / .env.production (Vite exposes anything prefixed VITE_).
// Falls back to localhost so `npm run dev` always talks to your local backend
// unless you explicitly point it elsewhere.
export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;