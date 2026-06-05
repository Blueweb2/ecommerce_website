import { create } from "zustand";
import { DesignerProductTypes } from "../../types/designer";

interface DesignerProductState extends DesignerProductTypes {
  setProducts: (products: any[]) => void;
  setCurrentProduct: (product: any | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDesignerProductStore = create<DesignerProductState>((set) => ({
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  setProducts: (products) => set({ products, error: null }),
  setCurrentProduct: (currentProduct) => set({ currentProduct, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
