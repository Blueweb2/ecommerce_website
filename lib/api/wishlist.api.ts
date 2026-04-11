// lib/api/wishlist.api.ts

import api from "@/lib/api/axios";

export const wishlistAPI = {
  get: () => api.get("/wishlist"),
  add: (productId: string) => api.post("/wishlist", { productId }),
  remove: (productId: string) =>
    api.delete(`/wishlist/${productId}`),
};