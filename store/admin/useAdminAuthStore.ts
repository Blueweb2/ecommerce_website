// store/admin/useAdminAuthStore.ts

import { create } from "zustand";
import api from "@/lib/api/axios";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

type AuthState = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;

  setAuth: (data: { user: User; token: string }) => void;
  hydrate: () => Promise<void>;
  logout: () => void;
};

export const useAdminAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  isAuthenticated: false,

  // 🔥 LOGIN
  setAuth: ({ user, token }) => {
    localStorage.setItem("token", token);

    set({
      user,
      isAuthenticated: true,
      loading: false,
    });
  },

  // 🔥 VERIFY TOKEN (CRITICAL)
  hydrate: async () => {
    try {
      const res = await api.get("/auth/me");

      set({
        user: res.data.data, // ⚠️ based on your sendResponse format
        isAuthenticated: true,
        loading: false,
      });
    } catch (err) {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },

  // 🔥 LOGOUT
  logout: () => {
    localStorage.removeItem("token");

    set({
      user: null,
      isAuthenticated: false,
      loading: false,
    });
  },
}));