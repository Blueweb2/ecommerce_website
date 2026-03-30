import { create } from "zustand";
import api from "@/lib/api/axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;

  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  // 🔥 Restore session on app load
  hydrate: async () => {
    try {
      const res = await api.get("/auth/me");

      set({
        user: res.data.data,
        loading: false,
      });
    } catch (err) {
      set({
        user: null,
        loading: false,
      });
    }
  },

  // 🔥 Logout (backend + frontend)
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {}

    set({
      user: null,
      loading: false,
    });
  },
}));