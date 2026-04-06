// lib/api/product.ts

import api from "@/lib/api/axios"; // your configured axios


export const productAPI = {
  getFeatured: () => api.get("/products/featured"),

  getBestSellers: () =>
    api.get("/products?sort=best-selling"),

  getTopRated: () =>
    api.get("/products?sort=top-rated"),
};