import { create } from "zustand";
import { Designer } from "../../types/designer";
import { persistVendorToken, clearVendorSession, getVendorToken } from "@/lib/vendor/auth";

interface DesignerAuthState {
  designer: Designer | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  setDesigner: (designer: Designer | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (token: string, designer: Designer) => void;
  logout: () => void;
  hydrateDesigner: () => void;
}

export const useDesignerAuthStore = create<DesignerAuthState>((set) => ({
  designer: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  initialized: false,
  error: null,

  setDesigner: (designer) =>
    set({
      designer,
      isAuthenticated: !!designer,
      error: null,
    }),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  login: (token, designer) => {
    persistVendorToken(token);
    localStorage.setItem("designer", JSON.stringify(designer));
    set({
      token,
      designer,
      isAuthenticated: true,
      error: null,
    });
  },

  logout: () => {
    clearVendorSession();
    set({
      token: null,
      designer: null,
      isAuthenticated: false,
      error: null,
    });
  },

  hydrateDesigner: () => {
    if (typeof window === "undefined") return;

    try {
      const token = getVendorToken();
      const designerStr = localStorage.getItem("designer");
      const designer = designerStr ? JSON.parse(designerStr) : null;

      if (token && designer) {
        set({
          token,
          designer,
          isAuthenticated: true,
          initialized: true,
        });
      } else {
        set({
          token: null,
          designer: null,
          isAuthenticated: false,
          initialized: true,
        });
      }
    } catch (err) {
      console.error("Hydrating designer store failed", err);
      set({
        token: null,
        designer: null,
        isAuthenticated: false,
        initialized: true,
      });
    }
  },
}));
