import { create } from "zustand";
import api from "@/lib/api/axios";
import { clearAccessToken } from "@/lib/auth";
import { useAddressStore } from "@/store/user/address/useAddressStore";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "superadmin";
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  resetAuth: () => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  isAuthenticated: false,
  initialized: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: Boolean(user),
    }),

  setLoading: (loading) => set({ loading }),

  setInitialized: (initialized) => set({ initialized }),

  resetAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
      loading: false,
      initialized: false,
    }),

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      console.warn("Logout API failed, clearing locally");
    }

    clearAccessToken();
    useAddressStore.getState().resetAddresses();

    set({
      user: null,
      loading: false,
      isAuthenticated: false,
      initialized: true,
    });
  },
}));
