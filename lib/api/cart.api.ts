// lib/api/cart.api.ts

import api from "@/lib/api/axios";

export const cartAPI = {
  // ✅ Get cart
  getCart: () => api.get("/cart"),

  // ✅ Add to cart
  addToCart: (data: {
    productId: string;
    quantity: number;
    variant?: Record<string, string> | null;
    customData?: {
      fieldName: string;
      value: string | number;
    }[];
  }) =>
    api.post("/cart", data),

  // ✅ Update quantity
  updateQuantity: (itemId: string, quantity: number) =>
    api.put(`/cart/${itemId}`, { quantity }),

  // ✅ Remove item
  removeItem: (itemId: string) =>
    api.delete(`/cart/${itemId}`),

  // ✅ Clear cart
  clearCart: () =>
    api.delete("/cart"),
};