import { create } from "zustand";
import * as api from "@/lib/api/admin/category.api";

interface CategoryState {
    categories: any[];
    loading: boolean;

    fetchCategories: () => Promise<void>;
    createCategory: (data: any) => Promise<void>;
    updateCategory: (id: string, data: any) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
    categories: [],
    loading: false,

    fetchCategories: async () => {
        set({ loading: true });
        const res = await api.getCategories();
        set({ categories: res.data.data, loading: false });
    },

    createCategory: async (data) => {
        await api.createCategory(data);
    },
    updateCategory: async (id, data) => {
  const res = await api.updateCategory(id, data);

  // Update UI instantly (important UX)
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
}));