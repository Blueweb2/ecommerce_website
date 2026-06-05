import { create } from "zustand";
import { DesignerAuthTypes } from "../../types/designer";

interface DesignerAuthState extends DesignerAuthTypes {
  setDesigner: (designer: DesignerAuthTypes["designer"]) => void;
  login: () => void; // placeholder for login action
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDesignerAuthStore = create<DesignerAuthState>((set) => ({
  designer: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  setDesigner: (designer) =>
    set({ designer, isAuthenticated: !!designer, error: null }),
  login: () => set({ loading: true }), // Implementation goes in components using API
  logout: () => set({ designer: null, isAuthenticated: false }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
