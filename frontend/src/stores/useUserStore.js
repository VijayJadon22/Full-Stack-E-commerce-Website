import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
    user: null,
    error: null,
    loading: false,
    checkingAuth: true,

    signup: async ({ name, email, password }) => {
        set({ laoding: true });
        try {
            const res = await axios.post("/auth/signup", { name, email, password });
            set({ user: res.data.user, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "An error occurred");
        }
    },
    login: async ({ email, password }) => {
        set({ loading: true });
        try {
            const res = await axios.post("/auth/login", { email, password });
            set({ user: res.data.user, loading: false });
            toast.success("Welcome to Trendify!");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "An error occurred");
        }
    },
    checkAuth: async () => {
        // const { user } = get();
        // if (!user) {
        //     set({ checkingAuth: false });
        //     return;
        // }
        set({ checkingAuth: true });
        try {
            const res = await axios.get("/auth/profile");
            set({ user: res.data, checkingAuth: false })
        } catch (error) {
            console.log(error.message);
            set({ checkingAuth: false, user: null });
        }
    },
    logout: async () => {
        try {
            await axios.post("/auth/logout");
            set({ user: null });
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response.data.message || "An error occurred");
        }
    },

    refreshToken: async () => {
        if (get().checkAuth()) return;
        set({ checkAuth: true });
        try {
            const response = await axios.post("/auth/refresh-token");
            set({ checkingAuth: false });
            return response.data;
        } catch (error) {
            set({ user: null, checkingAuth: false });
            throw error;
        }
    }
}))

// TODO: Implement the axios interceptors to refresh the token
let refreshPromise = null;
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                if (refreshPromise) {
                    await refreshPromise;
                    return axios(originalRequest);
                }

                refreshPromise = useUserStore.getState().refreshToken();
                await refreshPromise;
                refreshPromise = null;
                return axios(originalRequest);
            } catch (error) {
                useUserStore.getState().logout();
            }
        }
        return Promise.reject(error);
    }
)