import { create } from "zustand";
import * as api from "@/lib/api/admin/product.api";

// ✅ Define Product type (basic for now)
interface Product {
  _id: string;
  name: string;
  price: number;
  category: any;
}

// ✅ Define Store type
interface ProductState {
  products: Product[];
  loading: boolean;

  fetchProducts: () => Promise<void>;
  createProduct: (data: any) => Promise<void>;
  updateProduct: (id: string, data: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

// ✅ Typed Zustand store
export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,

  fetchProducts: async () => {
    set({ loading: true });

    const res = await api.getProducts();

    set({
      products: res.data.data,
      loading: false,
    });
  },

  createProduct: async (data) => {
    await api.createProduct(data);
  },

  updateProduct: async (id, data) => {
    const res = await api.updateProduct(id, data);

    set((state) => ({
      products: state.products.map((p) =>
        p._id === id ? res.data.data : p
      ),
    }));
  },

  deleteProduct: async (id) => {
    await api.deleteProduct(id);

    set((state) => ({
      products: state.products.filter((p) => p._id !== id),
    }));
  },
}));