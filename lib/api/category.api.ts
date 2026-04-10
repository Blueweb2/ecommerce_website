// lib/api/category.api.ts

import api from "@/lib/api/axios";

export const categoryAPI = {
  getAll: () => api.get("/categories"),

  getById: (id: string) => api.get(`/categories/${id}`),

  getBySlug: (slug: string) =>
    api.get(`/categories/slug/${slug}`),
};