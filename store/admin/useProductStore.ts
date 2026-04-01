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
  createProduct: (data: ProductPayload, files: File[]) => Promise<void>;
  updateProduct: (id: string, data: ProductPayload) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,

  // ✅ FETCH PRODUCTS
  fetchProducts: async () => {
    set({ loading: true });

    try {
      const res = await api.getProducts();

      set({
        products: Array.isArray(res.data?.data) ? res.data.data : [],
        loading: false,
      });
    } catch (error) {
      console.error("Fetch products error:", error);

      set({
        products: [],
        loading: false,
      });
    }
  },

  // ✅ CREATE PRODUCT (FIXED FOR FILE UPLOAD)
  createProduct: async (data, files) => {
    set({ loading: true });

    try {
      await api.createProduct(data, files);
    } catch (error) {
      console.error("Create product error:", error);
      throw error; // 🔥 IMPORTANT for toast handling
    } finally {
      set({ loading: false });
    }
  },

  // ✅ UPDATE PRODUCT
  updateProduct: async (id: string, data: ProductPayload) => {
    set({ loading: true });

    try {
      const existing = get().products.find(
        (p: CatalogProduct) => p._id === id
      );

      // 🔥 Delete old images ONLY if new images are provided
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
    } catch (error) {
      console.error("Update product error:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // ✅ DELETE PRODUCT
  deleteProduct: async (id: string) => {
    set({ loading: true });

    try {
      const existing = get().products.find(
        (p: CatalogProduct) => p._id === id
      );

      // 🔥 Delete images from Cloudinary first
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
    } catch (error) {
      console.error("Delete product error:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));