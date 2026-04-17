import { create } from "zustand";
import { dashboardAPI } from "@/lib/api/admin/dashboard.api";
import { DashboardStats } from "@/types/dashboard";

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  fetchStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  loading: false,

  fetchStats: async () => {
    set({ loading: true });

    try {
      const res = await dashboardAPI.getStats();

      set({
        stats: res.data.data,
      });
    } catch (err) {
      console.error("Dashboard fetch failed", err);
    } finally {
      set({ loading: false });
    }
  },
}));