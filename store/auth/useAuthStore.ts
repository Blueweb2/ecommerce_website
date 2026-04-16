// import { create } from "zustand";


// import api from "@/lib/api/axios";
// import { clearAccessToken } from "@/lib/auth";

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
// }

// interface AuthState {
//   user: User | null;
//   loading: boolean;

//   setUser: (user: User | null) => void;
//   setLoading: (loading: boolean) => void;
//   hydrate: () => Promise<void>;
//   logout: () => Promise<void>;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   loading: true,

//   setUser: (user) => set({ user }),
//   setLoading: (loading) => set({ loading }),

//   // 🔥 Restore session on app load
//   hydrate: async () => {
//     try {
//       const res = await api.get("/auth/me");

//       set({
//         user: res.data.data,
//         loading: false,
//       });
//     } catch (err) {
//       set({
//         user: null,
//         loading: false,
//       });
//     }
//   },

//   // 🔥 Logout (backend + frontend)
//   logout: async () => {
//     try {
//       await api.post("/auth/logout");
//     } catch (err) {}

//     set({
//       user: null,
//       loading: false,
//     });
//   },
// }));
// 
// removed hydrate, now we do refresh token + fetch user in useAuthInit hook, which is more robust (handles expired tokens)
import { create } from "zustand";
import api from "@/lib/api/axios";
import { clearAccessToken } from "@/lib/auth";
import { useAddressStore } from "@/store/user/address/useAddressStore";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;

  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: Boolean(user),
    }),
  setLoading: (loading) => set({ loading }),

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {}

    clearAccessToken();
    useAddressStore.getState().resetAddresses();

    set({
      user: null,
      loading: false,
      isAuthenticated: false,
    });
  },
}));
