// lib/api/product.api.ts

import api from "@/lib/api/axios";

export const productAPI = {
  // 🔹 PRODUCT DETAILS
  getBySlug: (slug: string) =>
    api.get(`/products/slug/${slug}`),

  getById: (id: string) =>
    api.get(`/products/${id}`),

  // 🔹 VARIANTS
  getVariants: (id: string) =>
    api.get(`/products/${id}/variants`),

  // 🔹 MAIN PRODUCT LIST (WITH FILTERS)
  getAll: (params?: {
    page?: number;
    limit?: number;
    sort?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }) =>
    api.get("/products", { params }),

  //  SALE PRODUCTS (VERY IMPORTANT FOR YOUR PAGE)
  getSale: (params?: {
    page?: number;
    limit?: number;
    sort?: string;
  }) =>
    api.get("/products/sale", { params }),

  // 🔹 NEW PRODUCTS
  getNew: () =>
    api.get("/products/new"),

  // 🔹 FEATURED / HOME SECTIONS
  getFeatured: () =>
    api.get("/products/featured"),

  getTopRated: () =>
    api.get("/products?sections=top-rated"),

  getBestSellers: () =>
    api.get("/products?sections=best-seller"),

  // 🔍 SEARCH
  search: (query: string) =>
    api.get("/products/search", {
      params: { q: query },
    }),
};