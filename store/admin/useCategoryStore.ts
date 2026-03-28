import { create } from "zustand";
import * as api from "@/lib/api/admin/category.api";
import {
  CatalogEntity,
  CategoryPayload,
} from "@/lib/constants/admin-catalog";

interface CategoryState {
  categories: CatalogEntity[];
  loading: boolean;

  fetchCategories: () => Promise<void>;
  createCategory: (data: CategoryPayload) => Promise<void>;
  updateCategory: (id: string, data: CategoryPayload) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getCategory: (id: string) => CatalogEntity | undefined;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  loading: false,

  fetchCategories: async () => {
    set({ loading: true });

    try {
      const res = await api.getCategories();
      set({
        categories: Array.isArray(res.data?.data) ? res.data.data : [],
        loading: false,
      });
    } catch {
      set({
        categories: [],
        loading: false,
      });
    }
  },

  createCategory: async (data) => {
    await api.createCategory(data);
  },

  updateCategory: async (id, data) => {
    const res = await api.updateCategory(id, data);

    set((state) => ({
      categories: state.categories.map((cat) =>
        cat._id === id ? res.data.data : cat
      ),
    }));
  },

  deleteCategory: async (id) => {
    await api.deleteCategory(id);
    set((state) => ({
      categories: state.categories.filter((c) => c._id !== id),
    }));
  },

  // ✅ FIXED
  getCategory: (id) =>
    get().categories.find((cat) => cat._id === id),
}));