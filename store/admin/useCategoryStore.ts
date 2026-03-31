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

  // 🔥 NEW HELPERS
  getParentCategories: () => CatalogEntity[];
  getCategoryTree: () => (CatalogEntity & { children: CatalogEntity[] })[];
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  loading: false,

  // ✅ FETCH ALL
  fetchCategories: async () => {
    set({ loading: true });

    try {
      const res = await api.getCategories();

      set({
        categories: Array.isArray(res.data?.data) ? res.data.data : [],
        loading: false,
      });
    } catch (err) {
      console.error("Fetch categories error:", err);
      set({
        categories: [],
        loading: false,
      });
    }
  },

  // ✅ CREATE
  createCategory: async (data) => {
    try {
      const res = await api.createCategory(data);

      set((state) => ({
        categories: [...state.categories, res.data.data],
      }));
    } catch (err) {
      console.error("Create category error:", err);
    }
  },

  // ✅ UPDATE
  updateCategory: async (id, data) => {
    try {
      const res = await api.updateCategory(id, data);

      set((state) => ({
        categories: state.categories.map((cat) =>
          cat._id === id ? res.data.data : cat
        ),
      }));
    } catch (err) {
      console.error("Update category error:", err);
    }
  },

  // ✅ DELETE
  deleteCategory: async (id) => {
    try {
      await api.deleteCategory(id);

      set((state) => ({
        categories: state.categories.filter((c) => c._id !== id),
      }));
    } catch (err) {
      console.error("Delete category error:", err);
    }
  },

  // ✅ GET SINGLE
  getCategory: (id) =>
    get().categories.find((cat) => cat._id === id),

  // ✅ GET ONLY PARENT CATEGORIES (for dropdown)
  getParentCategories: () =>
    get().categories.filter((cat) => !cat.parent),

  // ✅ BUILD TREE STRUCTURE (VERY IMPORTANT 🔥)
  getCategoryTree: () => {
    const categories = get().categories;

    const map = new Map<
      string,
      CatalogEntity & { children: CatalogEntity[] }
    >();

    // initialize map
    categories.forEach((cat) => {
      map.set(cat._id, { ...cat, children: [] });
    });

    const tree: (CatalogEntity & { children: CatalogEntity[] })[] = [];

    map.forEach((cat) => {
      if (cat.parent && map.has(String(cat.parent))) {
        map.get(String(cat.parent))!.children.push(cat);
      } else {
        tree.push(cat);
      }
    });

    return tree;
  },
}));