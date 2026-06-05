import { create } from "zustand";
import { DesignerDashboardTypes, DesignerDashboardStats } from "../../types/designer";

interface DesignerDashboardState extends DesignerDashboardTypes {
  setStats: (stats: DesignerDashboardStats) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDesignerDashboardStore = create<DesignerDashboardState>((set) => ({
  stats: null,
  loading: false,
  error: null,
  setStats: (stats) => set({ stats, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
