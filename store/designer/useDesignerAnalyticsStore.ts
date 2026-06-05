import { create } from "zustand";
import { DesignerAnalyticsTypes, DesignerAnalyticsData } from "../../types/designer";

interface DesignerAnalyticsState extends DesignerAnalyticsTypes {
  setData: (data: DesignerAnalyticsData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDesignerAnalyticsStore = create<DesignerAnalyticsState>((set) => ({
  data: null,
  loading: false,
  error: null,
  setData: (data) => set({ data, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
