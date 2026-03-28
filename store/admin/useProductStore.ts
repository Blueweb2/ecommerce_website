import { create } from "zustand";
import * as api from "@/lib/api/admin/product.api";
import {
  CatalogProduct,
  CatalogProductImage,
  ProductPayload,
} from "@/lib/constants/admin-catalog";

interface ProductState {
  products: CatalogProduct[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  createProduct: (data: ProductPayload) => Promise<void>;
  updateProduct: (id: string, data: ProductPayload) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,

  fetchProducts: async () => {
    set({ loading: true });

    try {
      const res = await api.getProducts();

      set({
        products: Array.isArray(res.data?.data) ? res.data.data : [],
        loading: false,
      });
    } catch {
      set({
        products: [],
        loading: false,
      });
    }
  },

  createProduct: async (data) => {
    await api.createProduct(data);
  },

  updateProduct: async (id: string, data: ProductPayload) => {
    const existing = get().products.find(
      (p: CatalogProduct) => p._id === id
    );

    if (existing?.images?.length && data.images?.length) {
      await Promise.all(
        existing.images.map((img: CatalogProductImage) =>
          fetch("/api/cloudinary/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ public_id: img.public_id }),
          })
        )
      );
    }

    const res = await api.updateProduct(id, data);

    set((state) => ({
      products: state.products.map((product) =>
        product._id === id ? res.data.data : product
      ),
    }));
  },

  deleteProduct: async (id: string) => {
    const existing = get().products.find(
      (p: CatalogProduct) => p._id === id
    );

    if (existing?.images?.length) {
      await Promise.all(
        existing.images.map((img: CatalogProductImage) =>
          fetch("/api/cloudinary/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ public_id: img.public_id }),
          })
        )
      );
    }

    await api.deleteProduct(id);

    set((state) => ({
      products: state.products.filter((p) => p._id !== id),
    }));
  },
}));