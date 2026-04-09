// lib/api/product.ts

import api from "@/lib/api/axios";

export const productAPI = {
  // ✅ Product Detail (IMPORTANT)
  getBySlug: (slug: string) =>
    api.get(`/products/slug/${slug}`),

  // ✅ Optional (if you use ID anywhere)
  getById: (id: string) =>
    api.get(`/products/${id}`),

  // ✅ Variants
  getVariants: (id: string) =>
    api.get(`/products/${id}/variants`),

  // ✅ Lists
  getFeatured: () =>
    api.get("/products/featured"),

 getProducts: (params?: {
  page?: number;
  limit?: number;
  sort?: string;
  category?: string;
}) =>
  api.get("/products", { params }),

  getTopRated: () =>
    api.get("/products?sort=top-rated"),

  // ✅ Search
search: (query: string) =>
  api.get("/products/search", {
    params: { q: query },
  }),
};