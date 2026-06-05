import { create } from "zustand";
import { DesignerOrderTypes } from "../../types/designer";

interface DesignerOrderState extends DesignerOrderTypes {
  setOrders: (orders: any[]) => void;
  setCurrentOrder: (order: any | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDesignerOrderStore = create<DesignerOrderState>((set) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  setOrders: (orders) => set({ orders, error: null }),
  setCurrentOrder: (currentOrder) => set({ currentOrder, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
