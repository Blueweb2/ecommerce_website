"use client";

import { create } from "zustand";
import { productAPI } from "@/lib/api/product.api";

type ProductState = {
  products: any[];
  product: any | null;
  loading: boolean;
  error: string;

  fetchProducts: () => Promise<void>;
  fetchProductBySlug: (slug: string) => Promise<void>;
  fetchSaleProducts: (sort?: string) => Promise<void>;
  fetchNewProducts: () => Promise<void>;
};

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  product: null,
  loading: false,
  error: "",

  fetchProducts: async () => {
    try {
      set({ loading: true });
      const res = await productAPI.getAll();
      set({ products: res.data.data });
    } catch (err: any) {
      set({ error: "Failed to fetch products" });
    } finally {
      set({ loading: false });
    }
  },

  fetchProductBySlug: async (slug: string) => {
    try {
      set({ loading: true, product: null });

      const res = await productAPI.getBySlug(slug);

      set({ product: res.data.data });
    } catch (err: any) {
      set({ error: "Failed to load product" });
    } finally {
      set({ loading: false });
    }
  },

  fetchSaleProducts: async (sort = "createdAt-desc") => {
    try {
      set({ loading: true });

      const res = await productAPI.getSale({ sort });

      set({ products: res.data.data });
    } catch (err: any) {
      set({ error: "Failed to fetch sale products" });
    } finally {
      set({ loading: false });
    }
  },

  fetchNewProducts: async () => {
    try {
      set({ loading: true });

      const res = await productAPI.getNew();

      set({ products: res.data.data });
    } catch (err: any) {
      set({ error: "Failed to fetch new products" });
    } finally {
      set({ loading: false });
    }
  },
}));